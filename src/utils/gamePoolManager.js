import { playgroundGamesData } from '../data/playgroundGamesData.js';
import { quizData } from '../data/quizData.js';
import { arenaMasterQuestionBank } from '../data/arenaMasterQuestionBank.js';

// Global session memory to prevent showing the exact same questions repeatedly
const recentSessionQuestionSet = new Set();
const MAX_SESSION_MEMORY = 500;

export function recordQuestionsAsSeen(questions) {
  if (!Array.isArray(questions)) return;
  questions.forEach((q) => {
    if (q) {
      const key = q.id || q.q?.trim();
      if (key) recentSessionQuestionSet.add(key);
    }
  });

  if (recentSessionQuestionSet.size > MAX_SESSION_MEMORY) {
    const arr = Array.from(recentSessionQuestionSet);
    const trimmed = arr.slice(arr.length - MAX_SESSION_MEMORY / 2);
    recentSessionQuestionSet.clear();
    trimmed.forEach((k) => recentSessionQuestionSet.add(k));
  }
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

const SCIENCE_SUBJECTS = new Set(['គណិតវិទ្យា', 'រូបវិទ្យា', 'គីមីវិទ្យា', 'ជីវវិទ្យា', 'math', 'physics', 'chemistry', 'biology']);
const SOCIAL_SUBJECTS = new Set(['ភាសាខ្មែរ', 'អក្សរសាស្ត្រខ្មែរ', 'ប្រវត្តិវិទ្យា', 'ភូមិវិទ្យា', 'សីលធម៌-ពលរដ្ឋ', 'សេដ្ឋកិច្ច', 'khmer', 'history', 'geography', 'civics', 'morals', 'economics']);

/**
 * Generate a randomized pool of unique questions for a game session
 * Strictly preserves game topic & subject isolation (never leaks Math into Khmer literature or Social into Physics)
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

  // =========================================================================
  // CASE 1: SPECIFIC SUBJECT / TOPIC GAME (e.g. Limits, Optics, Khmer, History)
  // Only if the user selected a game with a specific subjectKey and not stream-overridden
  // =========================================================================
  if (game && targetSubjectKey && requestedStream === gameStream && requestedStream !== 'random' && requestedStream !== 'all') {
    // 1. Add game-specific questions first
    if (Array.isArray(game.questions)) {
      game.questions.forEach((q) => {
        if (q && q.q) rawPool.push({ ...q, subjectKey: targetSubjectKey, stream: gameStream });
      });
    }

    // 2. Harvest all other questions matching targetSubjectKey from arenaMasterQuestionBank (300+ items per subject)
    if (Array.isArray(arenaMasterQuestionBank)) {
      arenaMasterQuestionBank.forEach((item) => {
        if (!item || !item.q) return;
        const matchesSub = (targetSubjectKey && item.subjectKey === targetSubjectKey) ||
                           (targetSubject && item.subject === targetSubject);
        if (matchesSub) {
          rawPool.push(item);
        }
      });
    }

    // 3. Harvest from other games matching same subjectKey in playgroundGamesData
    if (Array.isArray(playgroundGamesData)) {
      playgroundGamesData.forEach((g) => {
        if (g && g.subjectKey === targetSubjectKey && Array.isArray(g.questions)) {
          g.questions.forEach((q) => {
            if (q && q.q) rawPool.push({ ...q, subjectKey: targetSubjectKey, stream: gameStream });
          });
        }
      });
    }
  }

  // =========================================================================
  // CASE 2: STREAM MODE / 1V1 ARENA (Science vs Social vs Random)
  // =========================================================================
  if (rawPool.length === 0) {
    if (Array.isArray(arenaMasterQuestionBank)) {
      arenaMasterQuestionBank.forEach((item) => {
        if (!item || !item.q) return;

        let matchesStream = false;
        if (requestedStream === 'random' || requestedStream === 'all') {
          matchesStream = true;
        } else if (requestedStream === 'social') {
          matchesStream = (item.stream === 'social' || SOCIAL_SUBJECTS.has(item.subject) || SOCIAL_SUBJECTS.has(item.subjectKey)) && !SCIENCE_SUBJECTS.has(item.subject);
        } else {
          matchesStream = (item.stream === 'science' || SCIENCE_SUBJECTS.has(item.subject) || SCIENCE_SUBJECTS.has(item.subjectKey)) && !SOCIAL_SUBJECTS.has(item.subject);
        }

        if (matchesStream) {
          rawPool.push(item);
        }
      });
    }

    // Also include questions from playgroundGamesData
    if (Array.isArray(playgroundGamesData)) {
      playgroundGamesData.forEach((g) => {
        if (!g || !Array.isArray(g.questions)) return;

        let matchesStream = false;
        if (requestedStream === 'random' || requestedStream === 'all') {
          matchesStream = true;
        } else if (requestedStream === 'social') {
          matchesStream = (g.stream === 'social' || SOCIAL_SUBJECTS.has(g.subjectKey) || SOCIAL_SUBJECTS.has(g.subject)) && !SCIENCE_SUBJECTS.has(g.subject);
        } else {
          matchesStream = (g.stream === 'science' || SCIENCE_SUBJECTS.has(g.subjectKey) || SCIENCE_SUBJECTS.has(g.subject)) && !SOCIAL_SUBJECTS.has(g.subject);
        }

        if (matchesStream) {
          g.questions.forEach((q) => {
            if (q && q.q) {
              rawPool.push({ ...q, stream: g.stream, subject: q.subject || g.subject, subjectKey: q.subjectKey || g.subjectKey });
            }
          });
        }
      });
    }
  }

  // Deduplicate and filter out seen questions
  const seenTexts = new Set();
  const unseenPool = [];
  const fallbackSeenPool = [];

  rawPool.forEach((q) => {
    if (!q || !q.q) return;
    const cleanText = q.q.trim();
    if (seenTexts.has(cleanText)) return;
    seenTexts.add(cleanText);

    // Hard stream guard
    if (requestedStream === 'social' && SCIENCE_SUBJECTS.has(q.subject)) return;
    if (requestedStream === 'science' && SOCIAL_SUBJECTS.has(q.subject)) return;

    const qKey = q.id || cleanText;
    if (recentSessionQuestionSet.has(qKey)) {
      fallbackSeenPool.push(q);
    } else {
      unseenPool.push(q);
    }
  });

  // Prioritize unseen questions first; backfill with seen only if count is higher than unseen
  const finalCandidates = unseenPool.length >= count
    ? unseenPool
    : [...unseenPool, ...fallbackSeenPool];

  const shuffledCandidates = shuffleArray(finalCandidates);
  const selectedQuestions = shuffledCandidates.slice(0, Math.min(count, shuffledCandidates.length));

  // Record selected questions as seen
  recordQuestionsAsSeen(selectedQuestions);

  // Deeply shuffle and expand every question to 8 options
  return expandQuestionsTo8Options(selectedQuestions);
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

  // Fallback to rich local synchronous pool (2,400 questions)
  return getRandomizedGameQuestions(null, limit, grade, stream);
}

// Global cache of authentic distractors by subject for robust 8-option expansion
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
 * Expand questions to 8 options by borrowing plausible distractors
 * from other questions in the pool or global master bank.
 * Ensures the correct answer is preserved and all 8 options are shuffled.
 * Also generates a hint for each question from its explanation or subject context.
 * @param {Array} questions - Array of question objects
 * @returns {Array} - Questions expanded to 8 unique options each
 */
export function expandQuestionsTo8Options(questions) {
  if (!Array.isArray(questions) || questions.length === 0) return questions;

  // Build a local pool of all wrong answers grouped by subject
  const localWrongBySub = {};
  const localAllWrong = [];

  questions.forEach((q) => {
    if (!q || !Array.isArray(q.options)) return;
    const subKey = q.subject || q.subjectKey || 'general';
    if (!localWrongBySub[subKey]) localWrongBySub[subKey] = [];
    q.options.forEach((opt, idx) => {
      if (idx !== q.answer && typeof opt === 'string' && opt.trim()) {
        localWrongBySub[subKey].push(opt.trim());
        localAllWrong.push(opt.trim());
      }
    });
  });

  return questions.map((q) => {
    if (!q || !Array.isArray(q.options) || q.options.length === 0) return q;

    // If already has 8 options, just ensure hint exists
    if (q.options.length >= 8) {
      let hint = q.hint || '';
      if (!hint) {
        if (q.explanation) {
          const clean = q.explanation.replace(/<[^>]+>/g, '').trim();
          hint = clean.length > 80 ? clean.substring(0, 80) + '...' : clean;
        } else if (q.subject) {
          hint = `ព័ត៌មានជំនួយ៖ សំណួរនេះស្ថិតក្នុងមុខវិជ្ជា ${q.subject}`;
        }
      }
      return { ...q, hint };
    }

    const safeAnswerIdx = typeof q.answer === 'number' && q.answer >= 0 && q.answer < q.options.length ? q.answer : 0;
    const correctAnswer = q.options[safeAnswerIdx];
    const originalWrongs = q.options.filter((_, idx) => idx !== safeAnswerIdx);

    const subKey = q.subject || q.subjectKey || 'general';
    const sameSubPool = shuffleArray([
      ...(localWrongBySub[subKey] || []),
      ...(globalDistractorsBySubject[subKey] || []),
      ...(globalDistractorsBySubject[q.subject] || []),
      ...(globalDistractorsBySubject[q.subjectKey] || [])
    ]);
    const generalPool = shuffleArray([...localAllWrong, ...globalAllDistractors]);

    const existingSet = new Set(q.options.map((o) => typeof o === 'string' ? o.trim().toLowerCase() : String(o)));
    if (typeof correctAnswer === 'string') existingSet.add(correctAnswer.trim().toLowerCase());

    const neededExtra = Math.max(0, 8 - q.options.length);
    const extraDistractors = [];

    // 1. Try same-subject distractors first (authentic match)
    for (const candidate of sameSubPool) {
      if (extraDistractors.length >= neededExtra) break;
      const key = candidate.trim().toLowerCase();
      if (!existingSet.has(key)) {
        existingSet.add(key);
        extraDistractors.push(candidate);
      }
    }

    // 2. Fill from general bank pool
    for (const candidate of generalPool) {
      if (extraDistractors.length >= neededExtra) break;
      const key = candidate.trim().toLowerCase();
      if (!existingSet.has(key)) {
        existingSet.add(key);
        extraDistractors.push(candidate);
      }
    }

    // 3. Fallback subject-themed fillers if needed
    const subjectThemedFillers = [
      'ជម្រើសមិនត្រឹមត្រូវ',
      'គ្មានចម្លើយត្រឹមត្រូវ',
      'គ្រប់ចម្លើយទាំងអស់សុទ្ធតែត្រឹមត្រូវ',
      'ចម្លើយខាងលើទាំងអស់មិនត្រឹមត្រូវ',
      'ជម្រើសកែសម្រួលបន្ថែម',
      'ចម្លើយមិនទាន់ពេញលេញ'
    ];
    for (const filler of subjectThemedFillers) {
      if (extraDistractors.length >= neededExtra) break;
      const key = filler.toLowerCase();
      if (!existingSet.has(key)) {
        existingSet.add(key);
        extraDistractors.push(filler);
      }
    }

    // Combine all 8 options: correct + original wrongs + extra distractors
    const all8Options = [correctAnswer, ...originalWrongs, ...extraDistractors.slice(0, neededExtra)];
    const shuffled8 = shuffleArray(all8Options);
    const newCorrectIdx = shuffled8.findIndex((opt) => opt === correctAnswer);

    // Generate a smart hint from explanation or subject context
    let hint = q.hint || '';
    if (!hint) {
      if (q.explanation) {
        const cleanExp = q.explanation.replace(/<[^>]+>/g, '').trim();
        hint = cleanExp.length > 80 ? cleanExp.substring(0, 80) + '...' : cleanExp;
      } else if (q.subject) {
        hint = `ព័ត៌មានជំនួយ៖ សំណួរនេះស្ថិតក្នុងមុខវិជ្ជា ${q.subject}`;
        if (q.grade) hint += ` (ថ្នាក់ទី${q.grade})`;
      }
    }

    const firstChar = typeof correctAnswer === 'string' && correctAnswer.length > 0 ? correctAnswer.charAt(0) : '';
    const letterHint = firstChar ? `ចម្លើយត្រឹមត្រូវចាប់ផ្តើមដោយអក្សរ "${firstChar}"` : '';

    return {
      ...q,
      options: shuffled8,
      answer: newCorrectIdx >= 0 ? newCorrectIdx : 0,
      hint: hint || letterHint || 'សូមគិតឱ្យបានល្អិតល្អន់មុននឹងជ្រើសរើសចម្លើយ',
      letterHint: letterHint || 'ជ្រើសរើសចម្លើយដែលត្រឹមត្រូវបំផុត',
      _originalOptions: q.options,
      _originalAnswer: q.answer
    };
  });
}

