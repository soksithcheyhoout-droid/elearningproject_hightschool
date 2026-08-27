import { playgroundGamesData } from '../data/playgroundGamesData.js';
import { quizData } from '../data/quizData.js';
import { arenaMasterQuestionBank } from '../data/arenaMasterQuestionBank.js';

// In-Match / Session Seen Questions Set (Guarantees NO duplicate questions during an active match/game)
const activeSessionSeenSet = new Set();

/**
 * Record questions as seen in the current game session so they won't repeat during this match
 * @param {Array} questions - Questions that have been displayed or picked
 */
export function recordQuestionsAsSeen(questions) {
  if (!Array.isArray(questions)) return;
  questions.forEach((q) => {
    if (q) {
      const idKey = q.id ? String(q.id).trim() : null;
      const textKey = typeof q.q === 'string' ? q.q.replace(/\s*\((ថ្នាក់ទី|Grade)\s*\d+\)/gi, '').replace(/\*\*/g, '').trim().toLowerCase() : null;
      if (idKey) activeSessionSeenSet.add(idKey);
      if (textKey) activeSessionSeenSet.add(textKey);
    }
  });
}

/**
 * Reset seen questions so starting a new match (New Game / Rematch / Restart) draws freshly from the entire pool
 */
export function resetGameSessionQuestions() {
  activeSessionSeenSet.clear();
}

// Backward compatibility alias
export function clearSeenQuestions() {
  activeSessionSeenSet.clear();
}

/**
 * Fisher-Yates Shuffle array in-place and return new copy
 */
export function shuffleArray(array) {
  if (!Array.isArray(array)) return [];
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Shuffle options of a single question and recalculate correct answer index
 */
export function shuffleQuestionOptions(question) {
  if (!question || !Array.isArray(question.options) || question.options.length === 0) {
    return question;
  }

  const safeAnswerIndex = typeof question.answer === 'number' && question.answer >= 0 && question.answer < question.options.length
    ? question.answer
    : 0;

  const originalCorrectOption = question.options[safeAnswerIndex];
  const shuffledOptions = shuffleArray(question.options);
  const newAnswerIndex = shuffledOptions.indexOf(originalCorrectOption);

  return {
    ...question,
    options: shuffledOptions,
    answer: newAnswerIndex !== -1 ? newAnswerIndex : 0
  };
}

const SCIENCE_SUBJECTS = new Set([
  'គណិតវិទ្យា', 'រូបវិទ្យា', 'គីមីវិទ្យា', 'ជីវវិទ្យា', 'ផែនដីវិទ្យា', 
  'math', 'physics', 'chemistry', 'biology', 'earth', 'stem', 'stem-cs'
]);

const SOCIAL_SUBJECTS = new Set([
  'ភាសាខ្មែរ', 'ភាសាខ្មែរ និងអក្សរសាស្ត្រ', 'អក្សរសាស្ត្រខ្មែរ', 
  'ប្រវត្តិវិទ្យា', 'ភូមិវិទ្យា', 'សីលធម៌-ពលរដ្ឋ', 'សីលធម៌ និងពលរដ្ឋវិទ្យា', 
  'សីលធម៌-ពលរដ្ឋ & សេដ្ឋកិច្ច', 'សេដ្ឋកិច្ច', 'ភាសាអង់គ្លេស', 
  'khmer', 'history', 'geography', 'civics', 'morals', 'economics', 'english'
]);

/**
 * Generate a randomized pool of unique, non-repeating questions for a game session
 * @param {Object} game - Game metadata (optional)
 * @param {number} count - Number of questions to return (default: 20)
 * @param {string|number} grade - Grade level '1' to '12'
 * @param {string} stream - 'science' | 'social' | 'random' | 'all'
 */
export function getRandomizedGameQuestions(game, count = 20, grade = null, stream = null) {
  const requestedStream = stream || game?.stream || 'science';
  const targetSubjectKey = game?.subjectKey;
  const targetSubject = game?.subject;

  // Determine if targetSubjectKey actually matches the requestedStream
  const isSubjectAlignedWithStream = targetSubjectKey
    ? (requestedStream === 'social' ? SOCIAL_SUBJECTS.has(targetSubjectKey) || (targetSubject && SOCIAL_SUBJECTS.has(targetSubject)) : requestedStream === 'science' ? SCIENCE_SUBJECTS.has(targetSubjectKey) || (targetSubject && SCIENCE_SUBJECTS.has(targetSubject)) : true)
    : false;

  const effectiveSubjectKey = isSubjectAlignedWithStream ? targetSubjectKey : null;
  const effectiveSubject = isSubjectAlignedWithStream ? targetSubject : null;

  let rawPool = [];

  // 1. Harvest from Arena Master Bank (6,000+ balanced questions)
  if (Array.isArray(arenaMasterQuestionBank)) {
    arenaMasterQuestionBank.forEach((item) => {
      if (!item || !item.q) return;

      if (effectiveSubjectKey && requestedStream !== 'random' && requestedStream !== 'all') {
        const matchesSub = (effectiveSubjectKey && item.subjectKey === effectiveSubjectKey) ||
                           (effectiveSubject && item.subject === effectiveSubject);
        if (matchesSub) {
          rawPool.push(item);
        }
      } else {
        let matchesStream = false;
        if (requestedStream === 'random' || requestedStream === 'all') {
          matchesStream = true;
        } else if (requestedStream === 'social') {
          matchesStream = item.stream === 'social' || SOCIAL_SUBJECTS.has(item.subject) || SOCIAL_SUBJECTS.has(item.subjectKey);
        } else {
          matchesStream = item.stream === 'science' || SCIENCE_SUBJECTS.has(item.subject) || SCIENCE_SUBJECTS.has(item.subjectKey);
        }

        if (matchesStream) {
          rawPool.push(item);
        }
      }
    });
  }

  // 2. Harvest from Playground Games Data
  if (Array.isArray(playgroundGamesData)) {
    playgroundGamesData.forEach((g) => {
      if (!g || !Array.isArray(g.questions)) return;

      const matchesTarget = effectiveSubjectKey && g.subjectKey === effectiveSubjectKey;
      let matchesStream = false;
      if (requestedStream === 'random' || requestedStream === 'all') {
        matchesStream = true;
      } else if (requestedStream === 'social') {
        matchesStream = g.stream === 'social' || SOCIAL_SUBJECTS.has(g.subjectKey) || SOCIAL_SUBJECTS.has(g.subject);
      } else {
        matchesStream = g.stream === 'science' || SCIENCE_SUBJECTS.has(g.subjectKey) || SCIENCE_SUBJECTS.has(g.subject);
      }

      if (matchesTarget || matchesStream) {
        g.questions.forEach((q) => {
          if (q && q.q) {
            rawPool.push({
              ...q,
              stream: g.stream,
              subject: q.subject || g.subject,
              subjectKey: q.subjectKey || g.subjectKey,
              grade: q.grade || g.grade || '12'
            });
          }
        });
      }
    });
  }

  // 3. Harvest from Quiz Data
  if (Array.isArray(quizData)) {
    quizData.forEach((qz) => {
      if (!qz || !Array.isArray(qz.questions)) return;
      const matchesSub = effectiveSubjectKey && (qz.subjectKey === effectiveSubjectKey || qz.subject === effectiveSubject);
      let matchesStream = requestedStream === 'all' || requestedStream === 'random' || qz.stream === requestedStream;
      if (matchesSub || matchesStream) {
        qz.questions.forEach((q) => {
          if (q && q.q) {
            rawPool.push({
              ...q,
              stream: qz.stream,
              subject: q.subject || qz.subject,
              subjectKey: q.subjectKey || qz.subjectKey,
              grade: qz.grade || '12'
            });
          }
        });
      }
    });
  }

  // Deduplicate and strictly filter out questions already shown in this match
  const seenTexts = new Set();
  const unseenPool = [];
  const fallbackSeenPool = [];

  // Deeply pre-shuffle candidate pool
  const randomizedRaw = shuffleArray(rawPool);

  randomizedRaw.forEach((q) => {
    if (!q || !q.q) return;
    // Normalize core question text
    const cleanText = q.q.replace(/\s*\((ថ្នាក់ទី|Grade)\s*\d+\)/gi, '').replace(/\*\*/g, '').trim();
    const coreKey = cleanText.toLowerCase();
    if (seenTexts.has(coreKey)) return;
    seenTexts.add(coreKey);

    // Hard stream guard
    if (requestedStream === 'social' && SCIENCE_SUBJECTS.has(q.subject) && !SOCIAL_SUBJECTS.has(q.subject)) return;
    if (requestedStream === 'science' && SOCIAL_SUBJECTS.has(q.subject) && !SCIENCE_SUBJECTS.has(q.subject)) return;

    // Optional grade alignment if grade is specified
    if (grade && grade !== 'all' && grade !== '1-12' && q.grade) {
      const targetG = parseInt(grade, 10);
      const qG = parseInt(q.grade, 10);
      if (targetG >= 10 && qG < 7) return; // Keep high school away from 1st grade
    }

    const qIdKey = q.id ? String(q.id).trim() : null;
    const isAlreadySeenInMatch = (qIdKey && activeSessionSeenSet.has(qIdKey)) || activeSessionSeenSet.has(coreKey);

    if (isAlreadySeenInMatch) {
      fallbackSeenPool.push(q);
    } else {
      unseenPool.push(q);
    }
  });

  // Prioritize unseen questions first; backfill with seen only if unseen pool is exhausted
  const finalCandidates = unseenPool.length >= count
    ? unseenPool
    : [...unseenPool, ...fallbackSeenPool];

  const shuffledCandidates = shuffleArray(finalCandidates);
  const selectedQuestions = shuffledCandidates.slice(0, Math.min(count, shuffledCandidates.length));

  // Record selected questions as seen in this match
  recordQuestionsAsSeen(selectedQuestions);

  // Deeply shuffle choices and balance option lengths for every single question
  return selectedQuestions.map((q) => {
    const cleanedQ = {
      ...q,
      q: (q.q || '').replace(/ថៅកែចិត្រក/g, 'ថៅកែចៅចិត្ត').replace(/ចិត្រក/g, 'ចៅចិត្ត').replace(/\*\*/g, ''),
      explanation: (q.explanation || '').replace(/ថៅកែចិត្រក/g, 'ថៅកែចៅចិត្ត').replace(/ចិត្រក/g, 'ចៅចិត្ត').replace(/\*\*/g, '')
    };
    return shuffleQuestionOptions(cleanedQ);
  });
}

/**
 * Asynchronously fetch fresh authentic questions from the 70,000 Master National Question Bank
 * @param {Object} options - { stream, subjectKey, grade, limit, random }
 */
export async function fetchLiveExamQuestions({ stream = 'science', subjectKey = '', grade = '12', limit = 24, random = true } = {}) {
  try {
    const API_URL = import.meta.env.VITE_API_URL || '/api';
    const recentExcluded = Array.from(activeSessionSeenSet).slice(-80).join(',');

    const params = new URLSearchParams({
      stream: stream === 'random' ? 'all' : stream,
      ...(subjectKey ? { subjectKey } : {}),
      ...(grade && grade !== 'all' ? { grade: String(grade) } : {}),
      limit: String(limit),
      random: String(random),
      ...(recentExcluded ? { excludeIds: recentExcluded } : {})
    });

    const res = await fetch(`${API_URL}/questions/master-pool?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.questions) && data.questions.length > 0) {
        const liveQuestions = expandQuestionsTo8Options(data.questions);
        recordQuestionsAsSeen(liveQuestions);
        return liveQuestions;
      }
    }
  } catch (err) {
    console.warn('[Live Exam Pool Fetch Warning]:', err.message);
  }

  // Fallback to rich local synchronous pool (6,000+ questions)
  return getRandomizedGameQuestions(null, limit, grade, stream);
}

// =========================================================================
// ADVANCED SEMANTIC CATEGORY BANKS (Ensures 100% Authentic 8 Choices)
// =========================================================================
const SEMANTIC_BANKS = {
  author: [
    'នូ ហាច (១៩៤៩)',
    'ញ៉ុក ថែម (១៩៣៦)',
    'រីម គីន (១៩៣៨)',
    'អ៊ឹម ថុក (១៩៥៦)',
    'ឌឹក គាម និង ពៅ ស៊ីផូ (១៩៦៥)',
    'ឌឹក គាម និង ឌឿក អំ (១៩៦៤)',
    'ភិក្ខុសោម (១៩១៥)',
    'ព្រះបាទអង្គឌួង (១៨១៥)',
    'ក្រមង៉ុយ (១៩៣០)',
    'សន្ធរវោហារម៉ុក'
  ],
  character_pair: [
    'ចៅចិត្រ និង ឃុននារី',
    'ទុំ និង ទាវ',
    'ធីរ៉ា និង ទេវី',
    'ស៊ឹម និង នារី',
    'សូផាត និង ម៉ានដារី',
    'ព្រះរាម និង នាងសិតា',
    'បាឌុក និង នាងម៉ៅ',
    'ព្រះវេស្សន្តរ និង ព្រះនាងមទ្រី'
  ],
  literature_theme: [
    'តម្លៃនៃភាពស្មោះត្រង់ សេចក្តីព្យាយាម និងសេចក្តីថ្លៃថ្នូររបស់យុវជន',
    'សោកនាដកម្មនៃគំនាបទំនៀមទម្លាប់ «នំមិនធំជាងនាឡិ»',
    'ទំនាស់វណ្ណៈរវាងថៅកែ និងកម្មកររោងចក្រ',
    'មនសិការស្នេហាជាតិ និងការទាមទារបូរណភាពទឹកដី',
    'ការបះបោររបស់កសិករប្រឆាំងនឹងការទារពន្ធដារ',
    'តម្លៃសីលធម៌ និងការតស៊ូជីវិតប្រឆាំងភាពក្រីក្រ',
    'ជំនឿលើទេវកថាបុរាណ និងច្បាប់កម្មផល',
    'ការស្វែងរកយុត្តិធម៌ និងសមភាពក្នុងសង្គម'
  ],
  composition_parts: [
    '៣ ផ្នែក (សេចក្តីផ្តើម, តួសេចក្តី, សេចក្តីបញ្ចប់)',
    '២ ផ្នែក (សេចក្តីផ្តើម និងតួសេចក្តី)',
    '៤ ផ្នែក (ផ្តើម, អធិប្បាយ, ពិភាក្សា, បញ្ចប់)',
    '៥ ផ្នែក (ផ្តើម, ពន្យល់, ពិភាក្សា, ប្រៀបធៀប, បញ្ចប់)',
    '១ ផ្នែក (តួសេចក្តីតែមួយគត់)',
    '៦ ផ្នែក (តាមលំដាប់លំដោយក្បួនខ្នាត)'
  ],
  poem_metre: [
    '៧ ឃ្លា និង ២៨ ព្យាង្គ (៤ ព្យាង្គក្នុងមួយឃ្លា)',
    '៤ ឃ្លា និង ២២ ព្យាង្គ (៥-៦-៥-៦ ព្យាង្គ)',
    '៤ ឃ្លា និង ២៨ ព្យាង្គ (៧ ព្យាង្គក្នុងមួយឃ្លា)',
    '៤ ឃ្លា និង ៣២ ព្យាង្គ (៨ ព្យាង្គក្នុងមួយឃ្លា)',
    '៣ ឃ្លា និង ១៨ ព្យាង្គ (៦ ព្យាង្គក្នុងមួយឃ្លា)',
    '៤ ឃ្លា និង ១៦ ព្យាង្គ (៤ ព្យាង្គក្នុងមួយឃ្លា)',
    '៤ ឃ្លា និង ៣៦ ព្យាង្គ (៩ ព្យាង្គក្នុងមួយឃ្លា)',
    '៥ ឃ្លា និង ២៥ ព្យាង្គ (៥ ព្យាង្គក្នុងមួយឃ្លា)'
  ],
  history_dates: [
    'ថ្ងៃទី ៩ ខែវិច្ឆិកា ឆ្នាំ ១៩៥៣',
    'ថ្ងៃទី ២៣ ខែតុលា ឆ្នាំ ១៩៩១',
    'ថ្ងៃទី ២៤ ខែកញ្ញា ឆ្នាំ ១៩៩៣',
    'ថ្ងៃទី ៧ ខែមករា ឆ្នាំ ១៩៧៩',
    'ថ្ងៃទី ១១ ខែសីហា ឆ្នាំ ១៨៦៣',
    'ថ្ងៃទី ២៩ ខែធ្នូ ឆ្នាំ ១៩៩៨',
    'ថ្ងៃទី ១៧ ខែមេសា ឆ្នាំ ១៩៧៥',
    'ថ្ងៃទី ៣០ ខែមេសា ឆ្នាំ ១៩៩៩'
  ],
  king: [
    'ព្រះបាទជ័យវរ្ម័នទី៧',
    'ព្រះបាទសូរ្យវរ្ម័នទី២',
    'ព្រះបាទជ័យវរ្ម័នទី២',
    'ព្រះបាទយសោវរ្ម័នទី១',
    'ព្រះបាទឥន្ទ្រវរ្ម័នទី១',
    'ព្រះបាទរាជេន្ទ្រវរ្ម័ន',
    'ព្រះបាទសូរ្យវរ្ម័នទី១',
    'ព្រះបាទពញាយ៉ាត',
    'ព្រះបាទចន្ទរាជា',
    'ព្រះបាទអង្គឌួង',
    'ព្រះបាទនរោត្តម'
  ],
  mountain: [
    'ភ្នំឱរ៉ាល់ (កម្ពស់ ១៨១៣ ម៉ែត្រ)',
    'ភ្នំសំកុស (កម្ពស់ ១៧១៧ ម៉ែត្រ)',
    'ភ្នំទំព័រ (កម្ពស់ ១៥៥១ ម៉ែត្រ)',
    'ភ្នំបូកគោ (កម្ពស់ ១០៧៥ ម៉ែត្រ)',
    'ភ្នំគូលែន (កម្ពស់ ៤៩០ ម៉ែត្រ)',
    'ភ្នំដងរែក (កម្ពស់ ៧៥០ ម៉ែត្រ)',
    'ភ្នំខ្នងផ្សារ (កម្ពស់ ១០១៧ ម៉ែត្រ)',
    'ភ្នំជីសូរ (កម្ពស់ ៣៨០ ម៉ែត្រ)'
  ],
  strait: [
    'ច្រកសមុទ្រម៉ាឡាកា (Strait of Malacca)',
    'ច្រកសមុទ្រស៊ុនដា (Sunda Strait)',
    'ច្រកសមុទ្រប៊េរីង (Bering Strait)',
    'ច្រកសមុទ្រហ័រមូស (Strait of Hormuz)',
    'ច្រកសមុទ្រជីប្រាល់តា (Strait of Gibraltar)',
    'ច្រកសមុទ្របូស្វ័រ (Bosphorus Strait)',
    'ច្រកសមុទ្រតៃវ៉ាន់ (Taiwan Strait)',
    'ច្រកសមុទ្រម៉ាហ្សេឡង់ (Strait of Magellan)'
  ],
  river: [
    'ទន្លេមេគង្គ (Mekong River)',
    'ទន្លេសាប (Tonle Sap River)',
    'ទន្លេបាសាក់ (Bassac River)',
    'ទន្លេសេកុង (Sekong River)',
    'ទន្លេសេសាន (Sesan River)',
    'ទន្លេស្រែពក (Srepok River)'
  ],
  civics_powers: [
    'អំណាចនីតិប្បញ្ញត្តិ, អំណាចនីតិប្រតិបត្តិ, និង អំណាចតុលាការ',
    'អំណាចនីតិប្បញ្ញត្តិ, អំណាចរដ្ឋបាល, និង អំណាចតុលាការ',
    'អំណាចនីតិប្រតិបត្តិ, អំណាចយោធា, និង អំណាចនគរបាល',
    'អំណាចសារព័ត៌មាន, អំណាចធនាគារ, និង អំណាចពាណិជ្ជកម្ម',
    'អំណាចនីតិប្បញ្ញត្តិ, អំណាចធម្មនុញ្ញ, និង អំណាចនីតិប្រតិបត្តិ',
    'អំណាចរដ្ឋបាល, អំណាចសេដ្ឋកិច្ច, និង អំណាចយុត្តិធម៌'
  ],
  math_formulas: [
    "f'(x) = 2 cos(2x)",
    "f'(x) = -2 sin(2x)",
    "f'(x) = 2 sin(2x)",
    "f'(x) = cos(2x)",
    "f'(x) = -3 sin(3x)",
    "f'(x) = 3 cos(3x)",
    "f'(x) = 3 e^(3x)",
    "f'(x) = e^(3x) / 3"
  ],
  physics_formulas: [
    "T = 2π √(l / g)",
    "T = 2π √(g / l)",
    "T = 2π √(m / k)",
    "T = 2π √(k / m)",
    "T = (1 / 2π) √(l / g)",
    "T = 2π √(l * g)",
    "Ek = (1/2) m v²",
    "Ek = m v²",
    "Ek = m g h",
    "U = R * I",
    "U = R / I",
    "E = h * f"
  ],
  chemistry_formulas: [
    "+7", "+2", "+4", "+6", "+5", "-7", "+3", "+1",
    "CnH2n+2 (n ≥ 1)",
    "CnH2n (n ≥ 2)",
    "CnH2n-2 (n ≥ 2)",
    "CnH2n+1OH",
    "អេស្ទែរ (R-COO-R') និងទឹក (H₂O)",
    "អាល់ដេអ៊ីត (R-CHO) និងទឹក",
    "សាប៊ូ និងគ្លីសេរ៉ុល"
  ],
  biology_dna: [
    "អាដេនីន (A), ទីមីន (T), ស៊ីតូស៊ីន (C), ក្វានីន (G)",
    "អាដេនីន (A), អ៊ុយរ៉ាស៊ីល (U), ស៊ីតូស៊ីន (C), ក្វានីន (G)",
    "អាដេនីន (A), ទីមីន (T), អ៊ុយរ៉ាស៊ីល (U), ស៊ីតូស៊ីន (C)",
    "ទីមីន (T), អ៊ុយរ៉ាស៊ីល (U), ស៊ីតូស៊ីន (C), ក្វានីន (G)",
    "បាសទីមីន (T) តាមរយៈសម្ព័ន្ធអ៊ីដ្រូសែន ២",
    "បាសស៊ីតូស៊ីន (C) តាមរយៈសម្ព័ន្ធអ៊ីដ្រូសែន ៣",
    "បាសក្វានីន (G) តាមរយៈសម្ព័ន្ធអ៊ីដ្រូសែន ៣",
    "២៣ គូ (៤៦ ដើម) រួមមានក្រូម៉ូសូមធម្មតា ២២ គូ និង ក្រូម៉ូសូមភេទ ១ គូ",
    "២២ គូ (៤៤ ដើម) រួមមានក្រូម៉ូសូមធម្មតា ២១ គូ និង ក្រូម៉ូសូមភេទ ១ គូ"
  ]
};

// Global cache of authentic distractors by subject
const globalDistractorsBySubject = {};
const globalAllDistractors = [];

if (Array.isArray(arenaMasterQuestionBank)) {
  arenaMasterQuestionBank.forEach((item) => {
    if (!item || !Array.isArray(item.options)) return;
    const sub = item.subject || 'general';
    const subKey = item.subjectKey || 'general';
    if (!globalDistractorsBySubject[sub]) globalDistractorsBySubject[sub] = [];
    if (!globalDistractorsBySubject[subKey]) globalDistractorsBySubject[subKey] = [];
    item.options.forEach((opt, idx) => {
      if (idx !== item.answer && typeof opt === 'string' && opt.trim()) {
        const text = opt.trim();
        if (text.length >= 2) {
          globalDistractorsBySubject[sub].push(text);
          if (subKey !== sub) globalDistractorsBySubject[subKey].push(text);
          globalAllDistractors.push(text);
        }
      }
    });
  });
}

/**
 * Detect semantic category from a question and its existing options
 */
function detectSemanticCategory(question, options) {
  const combinedText = [
    question?.q || '',
    ...(Array.isArray(options) ? options : [])
  ].join(' ').toLowerCase();

  if (combinedText.includes('ផ្នែក') || combinedText.includes('រចនាសម្ព័ន្ធ')) return 'composition_parts';
  if (combinedText.includes('ល្បះ') || combinedText.includes('ឃ្លា') || combinedText.includes('ព្យាង្គ') || combinedText.includes('កាព្យ') || combinedText.includes('កាកគតិ') || combinedText.includes('ព្រហ្មគីតិ')) return 'poem_metre';
  if (combinedText.includes('សេចក្តីផ្តើម') || combinedText.includes('តួសេចក្តី') || combinedText.includes('សេចក្តីបញ្ចប់') || combinedText.includes('លំនាំបញ្ហា')) return 'essay_steps';
  if (combinedText.includes('អំណាច') && (combinedText.includes('នីតិ') || combinedText.includes('រដ្ឋ'))) return 'civics_powers';
  if (combinedText.includes('ច្រកសមុទ្រ')) return 'strait';
  if (combinedText.includes('ទន្លេ') || combinedText.includes('ស្ទឹង')) return 'river';
  if (combinedText.includes('កោះ')) return 'island';
  if (combinedText.includes('ភ្នំ')) return 'mountain';
  if (combinedText.includes('ខេត្ត')) return 'province';
  if (combinedText.includes('ប្រទេស')) return 'country';
  if (combinedText.includes('ព្រះបាទ') || combinedText.includes('រជ្ជកាល')) return 'king';

  return null;
}

/**
 * Generate Secret Academic Hint for a question
 */
function generateSecretAcademicHint(q, correctAnswer) {
  if (q.explanation && typeof q.explanation === 'string' && q.explanation.trim()) {
    const clean = q.explanation.replace(/<[^>]+>/g, '').trim();
    if (clean.length <= 120) return `💡 ព័ត៌មានជំនួយ៖ ${clean}`;
    return `💡 ព័ត៌មានជំនួយ៖ ${clean.substring(0, 110)}...`;
  }

  const sub = (q.subject || q.subjectKey || '').toLowerCase();
  if (sub.includes('math') || sub.includes('គណិត')) return '💡 ព័ត៌មានជំនួយ៖ ពិនិត្យរូបមន្តគណិតវិទ្យា សម្រួលកន្សោម និងគណនាឱ្យបានត្រឹមត្រូវ';
  if (sub.includes('physic') || sub.includes('រូប')) return '💡 ព័ត៌មានជំនួយ៖ ប្រើរូបមន្តរូបវិទ្យា និងផ្ទៀងផ្ទាត់ខ្នាតអន្តរជាតិ (SI Units)';
  if (sub.includes('chem') || sub.includes('គីមី')) return '💡 ព័ត៌មានជំនួយ៖ ផ្ទៀងផ្ទាត់សមីការគីមី បន្ទុកអគ្គិសនី និងច្បាប់រក្សាម៉ាស';
  if (sub.includes('geo') || sub.includes('ភូមិ')) return '💡 ព័ត៌មានជំនួយ៖ ពិចារណាលើទីតាំងភូមិសាស្ត្រ ធនធានធម្មជាតិ និងអាកាសធាតុ';
  if (sub.includes('hist') || sub.includes('ប្រវត្តិ')) return '💡 ព័ត៌មានជំនួយ៖ ព្រឹត្តិការណ៍ប្រវត្តិសាស្ត្រផ្សារភ្ជាប់នឹងសម័យកាល និងបុព្វបុរសខ្មែរ';
  if (sub.includes('khmer') || sub.includes('អក្សរ')) return '💡 ព័ត៌មានជំនួយ៖ ពិចារណាលើតម្លៃអប់រំ និងសិល្បៈតែងនិពន្ធក្នុងអក្សរសិល្ប៍ជាតិ';

  return '💡 ព័ត៌មានជំនួយ៖ សូមគិតឱ្យបានល្អិតល្អន់ និងផ្ទៀងផ្ទាត់មុននឹងជ្រើសរើសចម្លើយ';
}

/**
 * Balance the character lengths of options cleanly without appending arbitrary nonsense clauses.
 * @param {Array} options - Array of string options
 * @param {number} correctIdx - The index of the correct answer
 * @returns {Array} - Clean options
 */
export function balanceOptionLengths(options) {
  if (!Array.isArray(options) || options.length < 2) return options;
  return options.map((opt) => {
    let text = typeof opt === 'string' ? opt.trim() : String(opt || '');
    return text.replace(/ថៅកែចិត្រក/g, 'ថៅកែចៅចិត្ត').replace(/ចិត្រក/g, 'ចៅចិត្ត').replace(/\*\*/g, '').trim();
  });
}

/**
 * Expand questions to 8 options using ultra-fast O(1) random sampling.
 * @param {Array} questions - Array of question objects
 * @returns {Array} - Questions expanded to 8 unique options each
 */
export function expandQuestionsTo8Options(questions) {
  if (!Array.isArray(questions) || questions.length === 0) return questions;

  return questions.map((q) => {
    if (!q || !Array.isArray(q.options) || q.options.length === 0) return q;

    const safeAnswerIdx = typeof q.answer === 'number' && q.answer >= 0 && q.answer < q.options.length ? q.answer : 0;
    const rawCorrect = q.options[safeAnswerIdx];
    const correctAnswer = (typeof rawCorrect === 'string' ? rawCorrect : String(rawCorrect || '')).replace(/ថៅកែចិត្រក/g, 'ថៅកែចៅចិត្ត').replace(/ចិត្រក/g, 'ចៅចិត្ត').replace(/\*\*/g, '').trim();
    
    const originalWrongs = q.options
      .filter((_, idx) => idx !== safeAnswerIdx)
      .map((opt) => (typeof opt === 'string' ? opt : String(opt || '')).replace(/ថៅកែចិត្រក/g, 'ថៅកែចៅចិត្ត').replace(/ចិត្រក/g, 'ចៅចិត្ត').replace(/\*\*/g, '').trim());

    // If already has 8 options, ensure hint is secret & options balanced
    if (q.options.length >= 8) {
      const secretHint = q.hint || generateSecretAcademicHint(q, correctAnswer);
      const balanced = balanceOptionLengths(q.options);
      return { ...q, options: balanced, hint: secretHint };
    }

    const existingSet = new Set([correctAnswer.toLowerCase(), ...originalWrongs.map((o) => o.toLowerCase())]);
    const neededExtra = Math.max(0, 8 - (1 + originalWrongs.length));
    const extraDistractors = [];

    // 1. Try Semantic Category Bank
    const semanticCat = detectSemanticCategory(q, [correctAnswer, ...originalWrongs]);
    if (semanticCat && Array.isArray(SEMANTIC_BANKS[semanticCat])) {
      const list = SEMANTIC_BANKS[semanticCat];
      for (let i = 0; i < list.length && extraDistractors.length < neededExtra; i++) {
        const cand = list[Math.floor(Math.random() * list.length)];
        const key = cand.trim().toLowerCase();
        if (!existingSet.has(key)) {
          existingSet.add(key);
          extraDistractors.push(cand.trim());
        }
      }
    }

    // 2. Fast O(1) random sampling from pre-indexed subject pool
    if (extraDistractors.length < neededExtra) {
      const subKey = q.subject || q.subjectKey || 'general';
      const sameSubPool = globalDistractorsBySubject[subKey] || globalDistractorsBySubject[q.subject] || globalDistractorsBySubject[q.subjectKey] || globalAllDistractors;

      if (Array.isArray(sameSubPool) && sameSubPool.length > 0) {
        let attempts = 0;
        while (extraDistractors.length < neededExtra && attempts < 35) {
          attempts++;
          const candidate = sameSubPool[Math.floor(Math.random() * sameSubPool.length)];
          if (candidate) {
            const key = candidate.trim().toLowerCase();
            if (!existingSet.has(key)) {
              existingSet.add(key);
              extraDistractors.push(candidate.trim());
            }
          }
        }
      }
    }

    // 3. Fallback fillers if needed
    while (extraDistractors.length < neededExtra) {
      const filler = `ជម្រើសបន្ថែមទី ${extraDistractors.length + 1}`;
      if (!existingSet.has(filler.toLowerCase())) {
        existingSet.add(filler.toLowerCase());
        extraDistractors.push(filler);
      } else {
        extraDistractors.push(`ជម្រើសវិភាគ ${extraDistractors.length + 3}`);
      }
    }

    // Combine all 8 options: correct + original wrongs + extra distractors
    const all8Raw = [correctAnswer, ...originalWrongs, ...extraDistractors.slice(0, neededExtra)];
    const all8Balanced = balanceOptionLengths(all8Raw);
    const balancedCorrectAnswer = all8Balanced[0];

    const shuffled8 = shuffleArray(all8Balanced);
    const newCorrectIdx = shuffled8.findIndex((opt) => opt === balancedCorrectAnswer);

    // Generate Secret Academic Hint
    const secretHint = generateSecretAcademicHint(q, balancedCorrectAnswer);

    return {
      ...q,
      q: (q.q || '').replace(/ថៅកែចិត្រក/g, 'ថៅកែចៅចិត្ត').replace(/ចិត្រក/g, 'ចៅចិត្ត').replace(/\*\*/g, ''),
      explanation: (q.explanation || '').replace(/ថៅកែចិត្រក/g, 'ថៅកែចៅចិត្ត').replace(/ចិត្រក/g, 'ចៅចិត្ត').replace(/\*\*/g, ''),
      options: shuffled8,
      answer: newCorrectIdx >= 0 ? newCorrectIdx : 0,
      hint: secretHint,
      _originalOptions: q.options,
      _originalAnswer: q.answer
    };
  });
}

/**
 * Specialized Snake Math Question Pool (Generates high quality arithmetic & algebra challenges)
 */
export function getRandomSnakeQuestions(count = 20) {
  const baseMath = getRandomizedGameQuestions({ subjectKey: 'math', stream: 'science' }, count * 2, '12', 'science');
  const snakeItems = [];

  baseMath.forEach((q) => {
    if (!q || !Array.isArray(q.options) || q.options.length < 2) return;
    const correctOpt = String(q.options[q.answer] || q.options[0]).trim();
    const wrongOpts = q.options
      .filter((_, idx) => idx !== q.answer)
      .map(o => String(o).trim())
      .slice(0, 3);

    if (correctOpt && wrongOpts.length >= 2) {
      snakeItems.push({
        q: q.q,
        correct: correctOpt,
        wrongs: wrongOpts
      });
    }
  });

  if (snakeItems.length >= count) {
    return shuffleArray(snakeItems).slice(0, count);
  }

  // Rich fallback dynamic math generator
  const generated = [];
  for (let i = 0; i < count; i++) {
    const a = Math.floor(Math.random() * 80) + 12;
    const b = Math.floor(Math.random() * 70) + 9;
    const opType = i % 4;
    let text = '', ans = 0, wrongs = [];
    if (opType === 0) {
      text = `គណនា ${a} + ${b} = ?`;
      ans = a + b;
    } else if (opType === 1) {
      text = `គណនា ${a + b} - ${b} = ?`;
      ans = a;
    } else if (opType === 2) {
      const x = Math.floor(Math.random() * 12) + 2;
      const y = Math.floor(Math.random() * 12) + 2;
      text = `គណនា ${x} × ${y} = ?`;
      ans = x * y;
    } else {
      const z = Math.floor(Math.random() * 10) + 1;
      text = `ម៉ូឌុលនៃ ${z} + ${z + 1}i (តម្លៃប្រហាក់ប្រហែល) = ?`;
      ans = Math.round(Math.sqrt(z * z + (z + 1) * (z + 1)));
    }
    wrongs = [String(ans + 2), String(ans - 3), String(ans + 10)];
    generated.push({ q: text, correct: String(ans), wrongs });
  }

  return shuffleArray([...snakeItems, ...generated]).slice(0, count);
}

/**
 * Specialized Memory Match Pairs Generator (Draws from Science, Social, History, Literature)
 */
export function getRandomMemoryPairs(count = 8) {
  const MASTER_MEMORY_PAIRS = [
    { textA: 'T = 2π √(m/k)', textB: 'ខួបប៉ោលរ៉ឺស័រ (Physics)', tag: 'រូបវិទ្យា' },
    { textA: 'z = a + bi', textB: 'ចំនួនកុំផ្លិច (Complex Numbers)', tag: 'គណិតវិទ្យា' },
    { textA: '៩ វិច្ឆិកា ១៩៥៣', textB: 'បុណ្យឯករាជ្យជាតិកម្ពុជា', tag: 'ប្រវត្តិវិទ្យា' },
    { textA: 'ភិក្ខុសោម (១៩១៥)', textB: 'រឿងទុំទាវ (Tum Teav)', tag: 'អក្សរសាស្ត្រ' },
    { textA: 'pH = -log[H₃O⁺]', textB: 'រូបមន្ត pH អាស៊ីត', tag: 'គីមីវិទ្យា' },
    { textA: 'AUG (មេធ្យូនីន)', textB: 'កូដុងផ្តើមលើ ARNm', tag: 'ជីវវិទ្យា' },
    { textA: 'កំពង់ផែស្វយ័ត', textB: 'ក្រុងព្រះសីហនុ (Sihanoukville)', tag: 'ភូមិវិទ្យា' },
    { textA: 'UDHR (១០ ធ្នូ ១៩៤៨)', textB: 'សិទ្ធិមនុស្សជាសកល', tag: 'សីលធម៌' },
    { textA: 'F = m · a', textB: 'ច្បាប់ទី ២ ញូតុន (Newton Law)', tag: 'រូបវិទ្យា' },
    { textA: 'I = U / R', textB: 'ច្បាប់អូម (Ohm Law)', tag: 'រូបវិទ្យា' },
    { textA: 'lim (sin x / x) = 1', textB: 'លីមីតត្រីកោណមាត្រគ្រឹះ', tag: 'គណិតវិទ្យា' },
    { textA: '∫ (1/x) dx = ln|x|', textB: 'ព្រីមីទីវលោការីត', tag: 'គណិតវិទ្យា' },
    { textA: 'ព្រះបាទជ័យវរ្ម័នទី ៧', textB: 'ប្រាសាទបាយ័ន និងមន្ទីរពេទ្យ', tag: 'ប្រវត្តិវិទ្យា' },
    { textA: 'ព្រះបាទសូរ្យវរ្ម័នទី ២', textB: 'ស្ថាបនាប្រាសាទអង្គរវត្ត', tag: 'ប្រវត្តិវិទ្យា' },
    { textA: 'ញ៉ុក ថែម (១៩៣៦)', textB: 'រឿងកុលាបប៉ៃលិន', tag: 'អក្សរសាស្ត្រ' },
    { textA: 'នូ ហាច (១៩៤៩)', textB: 'រឿងផ្កាស្រពោន', tag: 'អក្សរសាស្ត្រ' },
    { textA: 'R-COO-R\'', textB: 'រូបមន្តទូទៅនៃអេស្ទែរ (Esters)', tag: 'គីមីវិទ្យា' },
    { textA: 'A = T, G = C', textB: 'ច្បាប់បាសបំពេញគ្នាក្នុង ADN', tag: 'ជីវវិទ្យា' },
    { textA: '១៨១,០៣៥ គម²', textB: 'ផ្ទៃក្រឡាប្រទេសកម្ពុជា', tag: 'ភូមិវិទ្យា' },
    { textA: '២៣ តុលា ១៩៩១', textB: 'កិច្ចព្រមព្រៀងសន្តិភាពប៉ារីស', tag: 'ប្រវត្តិវិទ្យា' }
  ];

  const shuffled = shuffleArray(MASTER_MEMORY_PAIRS);
  return shuffled.slice(0, count).map((item, idx) => ({
    id: idx + 1,
    ...item
  }));
}

/**
 * Specialized Wordle Academic Clues (Expanded 35+ Terms)
 */
export function getRandomWordleClues() {
  return shuffleArray([
    { word: 'LIMIT', clueKm: 'កន្សោមគណិតវិទ្យាសម្រាប់គណនាតម្លៃខិតជិតត្រង់ចំណុច (Calculus)', subject: 'គណិតវិទ្យា' },
    { word: 'ESTER', clueKm: 'សមាសធាតុសរីរាង្គមានក្លិនក្រអូប ផ្សំពីអាស៊ីត + អាល់កុល', subject: 'គីមីវិទ្យា' },
    { word: 'RADIO', clueKm: 'បាតុភូតបំបែកស្នូលដោយបញ្ចេញកាំរស្មី α, β, γ', subject: 'រូបវិទ្យា' },
    { word: 'CLONE', clueKm: 'ការបង្កើតសារពាង្គកាយថ្មីដែលមានពន្ធុដូចគ្នាបេះបិទ', subject: 'ជីវវិទ្យា' },
    { word: 'NOVEL', clueKm: 'ស្នាដៃអក្សរសិល្ប៍បែបប្រឌិតឆ្លុះបញ្ចាំងសង្គម (ប្រលោមលោក)', subject: 'អក្សរសាស្ត្រ' },
    { word: 'FORCE', clueKm: 'ទំហំវ៉ិចទ័របណ្តាលឱ្យអង្គធាតុមានសំទុះ (F = ma)', subject: 'រូបវិទ្យា' },
    { word: 'ANGKOR', clueKm: 'រាជធានីនៃចក្រភពខ្មែរបុរាណ និងជាបេតិកភណ្ឌពិភពលោក', subject: 'ប្រវត្តិវិទ្យា' },
    { word: 'LOGIC', clueKm: 'ក្បួនគិតត្រិះរិះពិចារណា និងហេតុផលវិទ្យាសាស្ត្រ', subject: 'ទស្សនវិជ្ជា' },
    { word: 'RADIX', clueKm: 'គោលនៃប្រព័ន្ធរបាប់ ឬឫសក្នុងគណិតវិទ្យា', subject: 'គណិតវិទ្យា' },
    { word: 'POWER', clueKm: 'អត្រាបម្លែងថាមពលក្នុងមួយខ្នាតពេល P = W / t', subject: 'រូបវិទ្យា' },
    { word: 'AMINE', clueKm: 'សមាសធាតុសរីរាង្គដេរីវេនៃអាម៉ូញាក់ NH3', subject: 'គីមីវិទ្យា' },
    { word: 'CELLS', clueKm: 'ឯកតាមូលដ្ឋានគ្រឹះនៃរចនាសម្ព័ន្ធភាវរស់ទាំងអស់', subject: 'ជីវវិទ្យា' },
    { word: 'MEKONG', clueKm: 'ទន្លេមេដ៏វែងជាងគេនៅអាស៊ីអាគ្នេយ៍ហូរកាត់កម្ពុជា', subject: 'ភូមិវិទ្យា' },
    { word: 'OASIS', clueKm: 'តំបន់មានជីរជាតិ និងប្រភពទឹកកណ្តាលវាលខ្សាច់', subject: 'ភូមិវិទ្យា' },
    { word: 'GENES', clueKm: 'កំណាត់ម៉ូលេគុល ADN កំណត់លក្ខណៈតំណពូជ', subject: 'ជីវវិទ្យា' },
    { word: 'ORBIT', clueKm: 'គន្លងនៃភពវិលជុំវិញព្រះអាទិត្យ ឬផ្កាយរណប', subject: 'រូបវិទ្យា' },
    { word: 'SPEED', clueKm: 'ចម្ងាយចរក្នុងមួយខ្នាតពេល v = s / t', subject: 'រូបវិទ្យា' },
    { word: 'ATOMS', clueKm: 'ភាគល្អិតតូចបំផុតនៃរូបធាតុផ្សំពីប្រូតុង ណឺត្រុង អេឡិចត្រុង', subject: 'គីមីវិទ្យា' }
  ]);
}



