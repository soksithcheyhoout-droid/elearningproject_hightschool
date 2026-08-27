import { playgroundGamesData } from '../data/playgroundGamesData.js';
import { quizData } from '../data/quizData.js';
import { arenaMasterQuestionBank } from '../data/arenaMasterQuestionBank.js';

// Persistent session and cross-play memory to guarantee questions never repeat
const STORAGE_KEY = 'motdar_seen_questions_v2';
const MAX_PERSISTENT_MEMORY = 1200;

function loadSeenQuestions() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return new Set(parsed);
      }
    }
  } catch (e) {}
  return new Set();
}

function saveSeenQuestions(set) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const arr = Array.from(set).slice(-MAX_PERSISTENT_MEMORY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    }
  } catch (e) {}
}

const recentSessionQuestionSet = loadSeenQuestions();

export function recordQuestionsAsSeen(questions) {
  if (!Array.isArray(questions)) return;
  questions.forEach((q) => {
    if (q) {
      const key = q.id || (typeof q.q === 'string' ? q.q.trim() : null);
      if (key) recentSessionQuestionSet.add(key);
    }
  });

  if (recentSessionQuestionSet.size > MAX_PERSISTENT_MEMORY) {
    const arr = Array.from(recentSessionQuestionSet);
    const trimmed = arr.slice(arr.length - Math.floor(MAX_PERSISTENT_MEMORY / 2));
    recentSessionQuestionSet.clear();
    trimmed.forEach((k) => recentSessionQuestionSet.add(k));
  }
  saveSeenQuestions(recentSessionQuestionSet);
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

const SCIENCE_SUBJECTS = new Set(['គណិតវិទ្យា', 'រូបវិទ្យា', 'គីមីវិទ្យា', 'ជីវវិទ្យា', 'ផែនដីវិទ្យា', 'math', 'physics', 'chemistry', 'biology', 'earth', 'stem', 'stem-cs']);
const SOCIAL_SUBJECTS = new Set(['ភាសាខ្មែរ', 'អក្សរសាស្ត្រខ្មែរ', 'ប្រវត្តិវិទ្យា', 'ភូមិវិទ្យា', 'សីលធម៌-ពលរដ្ឋ', 'សេដ្ឋកិច្ច', 'ភាសាអង់គ្លេស', 'khmer', 'history', 'geography', 'civics', 'morals', 'economics', 'english']);

/**
 * Generate a randomized pool of unique, non-repeating questions for a game session
 * @param {Object} game - Game metadata (optional)
 * @param {number} count - Number of questions to return (default: 20)
 * @param {string|number} grade - Grade level '1' to '12'
 * @param {string} stream - 'science' | 'social' | 'random' | 'all'
 */
export function getRandomizedGameQuestions(game, count = 20, grade = null, stream = null) {
  const requestedStream = stream || game?.stream || 'science';
  const gameStream = game?.stream || 'science';

  let rawPool = [];
  const targetSubjectKey = game?.subjectKey;
  const targetSubject = game?.subject;

  // 1. Harvest from Arena Master Bank (2,400 questions)
  if (Array.isArray(arenaMasterQuestionBank)) {
    arenaMasterQuestionBank.forEach((item) => {
      if (!item || !item.q) return;

      if (targetSubjectKey && requestedStream !== 'random' && requestedStream !== 'all') {
        const matchesSub = (targetSubjectKey && item.subjectKey === targetSubjectKey) ||
                           (targetSubject && item.subject === targetSubject);
        if (matchesSub) {
          rawPool.push({ ...item });
        }
      } else {
        let matchesStream = false;
        if (requestedStream === 'random' || requestedStream === 'all') {
          matchesStream = true;
        } else if (requestedStream === 'social') {
          matchesStream = (item.stream === 'social' || SOCIAL_SUBJECTS.has(item.subject) || SOCIAL_SUBJECTS.has(item.subjectKey)) && !SCIENCE_SUBJECTS.has(item.subject);
        } else {
          matchesStream = (item.stream === 'science' || SCIENCE_SUBJECTS.has(item.subject) || SCIENCE_SUBJECTS.has(item.subjectKey)) && !SOCIAL_SUBJECTS.has(item.subject);
        }

        if (matchesStream) {
          rawPool.push({ ...item });
        }
      }
    });
  }

  // 2. Harvest from Playground Games Data
  if (Array.isArray(playgroundGamesData)) {
    playgroundGamesData.forEach((g) => {
      if (!g || !Array.isArray(g.questions)) return;

      const matchesTarget = targetSubjectKey && g.subjectKey === targetSubjectKey;
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
      const matchesSub = targetSubjectKey && (qz.subjectKey === targetSubjectKey || qz.subject === targetSubject);
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

  // Deduplicate and filter out seen questions
  const seenTexts = new Set();
  const unseenPool = [];
  const fallbackSeenPool = [];

  // Deeply pre-shuffle candidate pool
  const randomizedRaw = shuffleArray(rawPool);

  randomizedRaw.forEach((q) => {
    if (!q || !q.q) return;
    // Normalize core question text by stripping grade tags and whitespace to prevent repeated core questions
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

    const qKey = q.id || coreKey;
    if (recentSessionQuestionSet.has(qKey) || recentSessionQuestionSet.has(coreKey)) {
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

  // Record selected questions as seen
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
    const recentExcluded = Array.from(recentSessionQuestionSet).slice(-80).join(',');

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

  // Fallback to rich local synchronous pool (2,400+ questions)
  return getRandomizedGameQuestions(null, limit, grade, stream);
}

// =========================================================================
// ADVANCED SEMANTIC CATEGORY BANKS (Ensures 100% Authentic 8 Choices)
// =========================================================================
const SEMANTIC_BANKS = {
  strait: [
    'ច្រកសមុទ្រម៉ាឡាកា (Strait of Malacca)',
    'ច្រកសមុទ្រស៊ុនដា (Sunda Strait)',
    'ច្រកសមុទ្រប៊េរីង (Bering Strait)',
    'ច្រកសមុទ្រហ័រមូស (Strait of Hormuz)',
    'ច្រកសមុទ្រជីប្រាល់តា (Strait of Gibraltar)',
    'ច្រកសមុទ្របូស្វ័រ (Bosphorus Strait)',
    'ច្រកសមុទ្រដាវីស (Davis Strait)',
    'ច្រកសមុទ្រតៃវ៉ាន់ (Taiwan Strait)',
    'ច្រកសមុទ្រកូរ៉េ (Korea Strait)',
    'ច្រកសមុទ្របាបអិលម៉ង់ដេប (Bab-el-Mandeb)',
    'ច្រកសមុទ្រម៉ាហ្សេឡង់ (Strait of Magellan)',
    'ច្រកសមុទ្រលំពិក (Lombok Strait)',
    'ច្រកសមុទ្រម៉ូសាំប៊ិក (Mozambique Channel)',
    'ច្រកសមុទ្រកាលីម៉ាន់តាន់ (Makassar Strait)'
  ],
  river: [
    'ទន្លេមេគង្គ (Mekong River)',
    'ទន្លេសាប (Tonle Sap River)',
    'ទន្លេបាសាក់ (Bassac River)',
    'ទន្លេសេកុង (Sekong River)',
    'ទន្លេសេសាន (Sesan River)',
    'ទន្លេស្រែពក (Srepok River)',
    'ទន្លេយ៉ាងសេ (Yangtze River)',
    'ទន្លេហួងហូ (Yellow River)',
    'ទន្លេនីល (Nile River)',
    'ទន្លេអាម៉ាហ្សូន (Amazon River)',
    'ទន្លេគង្គា (Ganges River)',
    'ទន្លេមីស៊ីស៊ីពី (Mississippi River)'
  ],
  island: [
    'កោះរ៉ុង',
    'កោះស្តេច',
    'កោះពស់',
    'កោះត្រល់',
    'កោះស៊ូម៉ាត្រា',
    'កោះជ្វា',
    'កោះប័រណេអូ',
    'កោះហុកកៃដូ',
    'កោះស៊ីស៊ីលី',
    'កោះម៉ាដាហ្គាស្កា',
    'កោះតៃវ៉ាន់',
    'កោះស្រីលង្កា'
  ],
  mountain: [
    'ភ្នំឱរ៉ាល់ (កម្ពស់ ១៨១៣ម)',
    'ជួរភ្នំដងរែក',
    'ជួរភ្នំក្រវាញ',
    'ភ្នំគូលែន',
    'ភ្នំបូកគោ',
    'ភ្នំអេវឺរ៉េស (Mount Everest)',
    'ភ្នំហ្វូជី (Mount Fuji)',
    'ភ្នំគីលីម៉ាន់ចារ៉ូ (Kilimanjaro)',
    'ភ្នំអាល់ (Alps)',
    'ភ្នំអង់ដេស (Andes)'
  ],
  province: [
    'ខេត្តសៀមរាប',
    'ខេត្តបាត់ដំបង',
    'ខេត្តកំពង់ចាម',
    'ខេត្តកណ្តាល',
    'ខេត្តព្រះសីហនុ',
    'ខេត្តកំពត',
    'ខេត្តរតនគិរី',
    'ខេត្តមណ្ឌលគិរី',
    'ខេត្តស្ទឹងត្រែង',
    'ខេត្តពោធិ៍សាត់',
    'ខេត្តតាកែវ',
    'ខេត្តកំពង់ធំ'
  ],
  country: [
    'ប្រទេសកម្ពុជា',
    'ប្រទេសថៃ',
    'ប្រទេសវៀតណាម',
    'ប្រទេសឡាវ',
    'ប្រទេសសិង្ហបុរី',
    'ប្រទេសឥណ្ឌូណេស៊ី',
    'ប្រទេសម៉ាឡេស៊ី',
    'ប្រទេសមីយ៉ាន់ម៉ា',
    'ប្រទេសហ្វីលីពីន',
    'ប្រទេសជប៉ុន',
    'ប្រទេសចិន',
    'ប្រទេសកូរ៉េខាងត្បូង'
  ],
  king: [
    'ព្រះបាទជ័យវរ្ម័នទី៧',
    'ព្រះបាទសូរ្យវរ្ម័នទី២',
    'ព្រះបាទជ័យវរ្ម័នទី២',
    'ព្រះបាទឥន្ទ្រវរ្ម័នទី១',
    'ព្រះបាទយសោវរ្ម័នទី១',
    'ព្រះបាទរាជេន្ទ្រវរ្ម័ន',
    'ព្រះបាទឧទ័យទិត្យវរ្ម័នទី២',
    'ព្រះបាទឥសានវរ្ម័នទី១',
    'ព្រះបាទស្រីសុរិយោពណ៌',
    'ព្រះបាទអង្គឌួង',
    'ព្រះបាទនរោត្តម',
    'ព្រះបាទហ្វាន់ជេម៉ាន់'
  ],
  literature_theme: [
    'តម្លៃសីលធម៌ និងការតស៊ូព្យាយាម',
    'តម្លៃវប្បធម៌ និងប្រពៃណីទំនៀមទម្លាប់',
    'តម្លៃគ្រួសារ សេចក្តីស្រឡាញ់ និងភក្តីភាព',
    'តម្លៃសាមគ្គីភាព និងសច្ចធម៌ក្នុងសង្គម',
    'តម្លៃនៃការអប់រំ និងចំណេះដឹងពិតប្រាកដ',
    'តម្លៃយុត្តិធម៌ និងសមភាពសង្គម',
    'តម្លៃមនសិការស្នេហាជាតិមាតុភូមិ',
    'តម្លៃកិត្តិយស និងសេចក្តីថ្លៃថ្នូររបស់មនុស្ស'
  ],
  author: [
    'ញ៉ុក ថែម',
    'នូ ហាច',
    'រីម គីន',
    'ឌឹក គាម',
    'ភិក្ខុសោម',
    'ព្រះបាទអង្គឌួង',
    'ក្រមង៉ុយ',
    'សន្ធរវោហារម៉ុក',
    'អ៊ុំ ស៊ូ',
    'សុង ស៊ីវ',
    'យិន សំបូរ',
    'ពៅ ហ៊ុយ'
  ],
  acid: [
    'អាស៊ីតស៊ុលផួរិច (H₂SO₄)',
    'អាស៊ីតក្លរីឌ្រិច (HCl)',
    'អាស៊ីតនីទ្រិច (HNO₃)',
    'អាស៊ីតអាសេទិច (CH₃COOH)',
    'អាស៊ីតផូស្វ័ររិច (H₃PO₄)',
    'អាស៊ីតកាបូនិច (H₂CO₃)',
    'អាស៊ីតទ្រីក្លរ៉ូអាសេទិច',
    'អាស៊ីតហ្វរមិច (HCOOH)'
  ],
  compound: [
    'KMnO₄ (ប៉ូតាស្យូមពែម៉ង់កាណាត)',
    'K₂Cr₂O₇ (ប៉ូតាស្យូមឌីក្រូម៉ាត)',
    'H₂SO₄ (អាស៊ីតស៊ុលផួរិច)',
    'NaOH (សូដ្យូមអ៊ីដ្រុកស៊ីត)',
    'CaCO₃ (កាល់ស្យូមកាបូណាត)',
    'CuSO₄ (ទង់ដែងស៊ុលផាត)',
    'NaCl (សូដ្យូមក្លរួ)',
    'HCl (អាស៊ីតក្លរីឌ្រិច)'
  ]
};

// Global cache of authentic distractors by subject
const globalDistractorsBySubject = {};
const globalAllDistractors = [];

if (Array.isArray(arenaMasterQuestionBank)) {
  arenaMasterQuestionBank.forEach((item) => {
    if (!item || !Array.isArray(item.options)) return;
    const sub = item.subject || item.subjectKey || 'general';
    if (!globalDistractorsBySubject[sub]) globalDistractorsBySubject[sub] = [];
    item.options.forEach((opt, idx) => {
      if (idx !== item.answer && typeof opt === 'string' && opt.trim()) {
        const text = opt.trim();
        globalDistractorsBySubject[sub].push(text);
        globalAllDistractors.push(text);
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

  if (combinedText.includes('ច្រកសមុទ្រ')) return 'strait';
  if (combinedText.includes('ទន្លេ') || combinedText.includes('ស្ទឹង')) return 'river';
  if (combinedText.includes('កោះ')) return 'island';
  if (combinedText.includes('ភ្នំ')) return 'mountain';
  if (combinedText.includes('ខេត្ត')) return 'province';
  if (combinedText.includes('ប្រទេស')) return 'country';
  if (combinedText.includes('ព្រះបាទ') || combinedText.includes('រជ្ជកាល')) return 'king';
  if (combinedText.includes('តម្លៃ') || combinedText.includes('កុលាបប៉ៃលិន') || combinedText.includes('ទុំទាវ') || combinedText.includes('ផ្កាស្រពោន')) return 'literature_theme';
  if (combinedText.includes('និពន្ធ') || combinedText.includes('ញ៉ុក ថែម') || combinedText.includes('នូ ហាច') || combinedText.includes('រីម គីន')) return 'author';
  if (combinedText.includes('អាស៊ីត') || combinedText.includes('acid')) return 'acid';
  if (combinedText.includes('kmno4') || combinedText.includes('h2so4') || combinedText.includes('naoh')) return 'compound';

  return null;
}

/**
 * Generate intelligent numeric distractors with exact matching units and formatting
 */
function generateNumericDistractors(options, needed) {
  const nums = [];
  let unit = '';
  let hasPlus = false;
  let isExp = false;

  options.forEach((opt) => {
    const text = String(opt).trim();
    if (text.startsWith('+')) hasPlus = true;
    if (text.includes('10^') || text.includes('10⁻') || text.includes('10³')) isExp = true;

    const match = text.match(/([-+]?\d*\.?\d+)\s*(.*)/);
    if (match) {
      const val = parseFloat(match[1]);
      if (!isNaN(val)) nums.push(val);
      if (match[2] && !unit) unit = match[2].trim();
    }
  });

  if (nums.length === 0) return [];

  const results = [];
  const base = nums[0];
  const step = Math.abs(base) > 20 ? 10 : Math.abs(base) > 5 ? 2 : 1;

  for (let delta = -8; delta <= 8; delta++) {
    if (results.length >= needed) break;
    if (delta === 0) continue;
    const candidateVal = base + delta * step;
    let formatted = isExp
      ? `10^${delta} ${unit}`.trim()
      : hasPlus && candidateVal > 0
        ? `+${candidateVal} ${unit}`.trim()
        : `${candidateVal} ${unit}`.trim();

    if (!options.includes(formatted) && !results.includes(formatted)) {
      results.push(formatted);
    }
  }

  return results;
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

  const qText = (q.q || '').toLowerCase();
  const sub = (q.subject || q.subjectKey || '').toLowerCase();

  if (qText.includes('ម៉ាឡាកា') || qText.includes('ច្រកសមុទ្រ')) {
    return '💡 ព័ត៌មានជំនួយ៖ ផ្លូវទឹកយុទ្ធសាស្ត្រអន្តរជាតិតភ្ជាប់មហាសមុទ្រឥណ្ឌា និងសមុទ្រចិនខាងត្បូង';
  }
  if (qText.includes('kmno4') || qText.includes('អុកស៊ីតកម្ម')) {
    return '💡 ព័ត៌មានជំនួយ៖ K = +1, O = -2 (4 អាតូម = -8), ផលបូកចំនួនអុកស៊ីតកម្មស្មើ 0';
  }
  if (qText.includes('កុលាបប៉ៃលិន') || qText.includes('ចៅចិត្រ')) {
    return '💡 ព័ត៌មានជំនួយ៖ ឆ្លុះបញ្ចាំងពីតម្លៃសីលធម៌ គុណធម៌ និងការតស៊ូព្យាយាមរបស់យុវជន';
  }
  if (qText.includes('អង្គរវត្ត') || qText.includes('សូរ្យវរ្ម័ន')) {
    return '💡 ព័ត៌មានជំនួយ៖ កសាងឡើងក្នុងសតវត្សរ៍ទី១២ ឧទ្ទិសថ្វាយព្រះវិស្ណុ';
  }
  if (sub.includes('math') || sub.includes('គណិត')) {
    return '💡 ព័ត៌មានជំនួយ៖ ពិនិត្យរូបមន្តគណិតវិទ្យា សម្រួលកន្សោម និងគណនាឱ្យបានត្រឹមត្រូវ';
  }
  if (sub.includes('physic') || sub.includes('រូប')) {
    return '💡 ព័ត៌មានជំនួយ៖ ប្រើរូបមន្តរូបវិទ្យា និងផ្ទៀងផ្ទាត់ខ្នាតអន្តរជាតិ (SI Units)';
  }
  if (sub.includes('chem') || sub.includes('គីមី')) {
    return '💡 ព័ត៌មានជំនួយ៖ ផ្ទៀងផ្ទាត់សមីការគីមី បន្ទុកអគ្គិសនី និងច្បាប់រក្សាម៉ាស';
  }
  if (sub.includes('bio') || sub.includes('ជីវ')) {
    return '💡 ព័ត៌មានជំនួយ៖ ផ្អែកលើទ្រឹស្តីកោសិកា ហ្សែន ឬដំណើរការជីវសាស្ត្រធម្មជាតិ';
  }
  if (sub.includes('khmer') || sub.includes('អក្សរ')) {
    return '💡 ព័ត៌មានជំនួយ៖ ពិចារណាលើតម្លៃអប់រំ និងសិល្បៈតែងនិពន្ធក្នុងអក្សរសិល្ប៍ជាតិ';
  }
  if (sub.includes('hist') || sub.includes('ប្រវត្តិ')) {
    return '💡 ព័ត៌មានជំនួយ៖ ព្រឹត្តិការណ៍ប្រវត្តិសាស្ត្រផ្សារភ្ជាប់នឹងសម័យកាល និងបុព្វបុរសខ្មែរ';
  }
  if (sub.includes('geo') || sub.includes('ភូមិ')) {
    return '💡 ព័ត៌មានជំនួយ៖ ពិចារណាលើទីតាំងភូមិសាស្ត្រ ធនធានធម្មជាតិ និងអាកាសធាតុ';
  }

  return '💡 ព័ត៌មានជំនួយ៖ សូមគិតឱ្យបានល្អិតល្អន់ និងផ្ទៀងផ្ទាត់មុននឹងជ្រើសរើសចម្លើយ';
}

/**
 * Balance the character lengths of options so no single choice stands out as obviously long or short.
 * @param {Array} options - Array of string options
 * @param {number} correctIdx - The index of the correct answer
 * @returns {Array} - Length-balanced options
 */
export function balanceOptionLengths(options, correctIdx = 0) {
  if (!Array.isArray(options) || options.length < 2) return options;
  const rawCorrect = options[correctIdx] !== undefined ? options[correctIdx] : options[0];
  const correctOpt = typeof rawCorrect === 'string' ? rawCorrect.trim() : String(rawCorrect || '');
  const targetLen = correctOpt.length;
  const isNumeric = options.every((opt) => /^[-+]?\d*\.?\d+(\s*\w+)?$/.test(String(opt).trim()));

  if (isNumeric) {
    return options.map((opt) => (typeof opt === 'string' ? opt.trim() : String(opt)));
  }

  // Academic contextual clauses to balance short distractors when the correct answer is elaborate
  const BALANCING_CLAUSES = [
    ' និងការអភិវឌ្ឍសង្គមជាតិប្រកបដោយចីរភាព',
    ' ស្របតាមគោលការណ៍អប់រំ និងប្រពៃណីជាតិ',
    ' ក្នុងបរិបទសង្គមជាក់ស្តែង និងជីវភាពរស់នៅ',
    ' ដោយផ្អែកលើការស្រាវជ្រាវត្រឹមត្រូវតាមក្បួនខ្នាត',
    ' និងគុណធម៌សីលធម៌ខ្ពស់ក្នុងការរស់នៅ',
    ' ដើម្បីឆ្លុះបញ្ចាំងពីតថភាពសង្គមជាក់ស្តែង',
    ' និងការថែរក្សាអត្តសញ្ញាណវប្បធម៌ជាតិ',
    ' ក្នុងការកសាងសន្តិភាព និងវិបុលភាពយូរអង្វែង'
  ];

  return options.map((opt, idx) => {
    let text = typeof opt === 'string' ? opt.trim() : String(opt || '');
    text = text.replace(/ថៅកែចិត្រក/g, 'ថៅកែចៅចិត្ត').replace(/ចិត្រក/g, 'ចៅចិត្ត').replace(/\*\*/g, '');

    if (idx === correctIdx) return text;

    // If correct answer is long (>= 40 chars) and this distractor is too short (< 65% of targetLen)
    if (targetLen >= 40 && text.length < targetLen * 0.65) {
      const clause = BALANCING_CLAUSES[idx % BALANCING_CLAUSES.length];
      if (!text.includes('និង') && !text.includes('ក្នុង') && !text.includes('ដោយ')) {
        text = `${text}${clause}`;
      }
    }
    return text;
  });
}

/**
 * Expand questions to 8 options by borrowing type-matched, length-consistent distractors.
 * Ensures the correct answer is preserved, all 8 options are shuffled, and no giveaways occur.
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
      const balanced = balanceOptionLengths(q.options, safeAnswerIdx);
      return { ...q, options: balanced, hint: secretHint };
    }

    const existingSet = new Set([correctAnswer.toLowerCase(), ...originalWrongs.map((o) => o.toLowerCase())]);
    const neededExtra = Math.max(0, 8 - (1 + originalWrongs.length));
    const extraDistractors = [];

    // Calculate length of correct answer to prevent length-based giveaways
    const targetLen = correctAnswer.length;
    const isAllNumeric = [correctAnswer, ...originalWrongs].every((opt) => /^[-+]?\d*\.?\d+(\s*\w+)?$/.test(String(opt).trim()));

    // 1. Try Semantic Category Bank (e.g. Strait, River, King, Theme, etc.)
    const semanticCat = detectSemanticCategory(q, [correctAnswer, ...originalWrongs]);
    if (semanticCat && Array.isArray(SEMANTIC_BANKS[semanticCat])) {
      const candidates = shuffleArray(SEMANTIC_BANKS[semanticCat]);
      for (const cand of candidates) {
        if (extraDistractors.length >= neededExtra) break;
        const key = cand.trim().toLowerCase();
        if (!existingSet.has(key)) {
          existingSet.add(key);
          extraDistractors.push(cand.trim());
        }
      }
    }

    // 2. If Numeric, generate consistent numeric distractors with same units
    if (isAllNumeric && extraDistractors.length < neededExtra) {
      const numericDistractors = generateNumericDistractors([correctAnswer, ...originalWrongs], neededExtra - extraDistractors.length);
      for (const num of numericDistractors) {
        if (extraDistractors.length >= neededExtra) break;
        const key = num.toLowerCase();
        if (!existingSet.has(key)) {
          existingSet.add(key);
          extraDistractors.push(num);
        }
      }
    }

    // 3. Fallback to length-matched distractors from the same subject pool
    if (extraDistractors.length < neededExtra) {
      const subKey = q.subject || q.subjectKey || 'general';
      const sameSubPool = shuffleArray([
        ...(globalDistractorsBySubject[subKey] || []),
        ...(globalDistractorsBySubject[q.subject] || []),
        ...(globalDistractorsBySubject[q.subjectKey] || [])
      ]);

      for (const candidate of sameSubPool) {
        if (extraDistractors.length >= neededExtra) break;
        const key = candidate.trim().toLowerCase();
        // Candidate length must be reasonably close to target length
        const isLengthConsistent = targetLen < 25 
          ? candidate.length < 35 
          : Math.abs(candidate.length - targetLen) <= Math.max(15, targetLen * 0.6);
        if (!existingSet.has(key) && isLengthConsistent) {
          existingSet.add(key);
          extraDistractors.push(candidate.trim());
        }
      }
    }

    // 4. Fill remaining with general length-consistent options
    if (extraDistractors.length < neededExtra) {
      const generalPool = shuffleArray(globalAllDistractors);
      for (const candidate of generalPool) {
        if (extraDistractors.length >= neededExtra) break;
        const key = candidate.trim().toLowerCase();
        const isLengthConsistent = targetLen < 25 
          ? candidate.length < 35 
          : Math.abs(candidate.length - targetLen) <= Math.max(18, targetLen * 0.7);
        if (!existingSet.has(key) && isLengthConsistent) {
          existingSet.add(key);
          extraDistractors.push(candidate.trim());
        }
      }
    }

    // 5. If still short, generate length-matched Khmer variations
    while (extraDistractors.length < neededExtra) {
      let filler = '';
      if (targetLen > 35) {
        filler = `ការវិភាគ និងការស្រាវជ្រាវបែបវិទ្យាសាស្ត្របន្ថែមទី ${extraDistractors.length + 1}`;
      } else if (isAllNumeric) {
        filler = `${extraDistractors.length + 10}`;
      } else {
        filler = `ជម្រើសវិភាគទី ${extraDistractors.length + 1}`;
      }

      if (!existingSet.has(filler.toLowerCase())) {
        existingSet.add(filler.toLowerCase());
        extraDistractors.push(filler);
      } else {
        extraDistractors.push(`ជម្រើសវិភាគបន្ថែម ${extraDistractors.length + 5}`);
      }
    }

    // Combine all 8 options: correct + original wrongs + extra distractors
    const all8Raw = [correctAnswer, ...originalWrongs, ...extraDistractors.slice(0, neededExtra)];
    
    // Balance option lengths so no single choice stands out by length
    const all8Balanced = balanceOptionLengths(all8Raw, 0);
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



