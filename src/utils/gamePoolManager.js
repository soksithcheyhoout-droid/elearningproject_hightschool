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

  // Deeply shuffle options for every question
  return selectedQuestions.map((q) => shuffleQuestionOptions(q));
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
        const liveQuestions = data.questions.map((q) => shuffleQuestionOptions(q));
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

/**
 * Expand 4-option questions to 8 options by borrowing plausible distractors
 * from other questions in the pool. Ensures the correct answer is preserved
 * and all 8 options are shuffled with the correct index recalculated.
 * Also generates a hint for each question from its explanation or subject context.
 * @param {Array} questions - Array of question objects with 4 options
 * @returns {Array} - Questions expanded to 8 unique options each
 */
export function expandQuestionsTo8Options(questions) {
  if (!Array.isArray(questions) || questions.length === 0) return questions;

  // Build a pool of all wrong answers grouped by subject for smart distractors
  const wrongOptionsBySubject = {};
  const allWrongOptions = [];

  questions.forEach((q) => {
    if (!q || !Array.isArray(q.options)) return;
    const subKey = q.subject || q.subjectKey || 'general';
    if (!wrongOptionsBySubject[subKey]) wrongOptionsBySubject[subKey] = [];
    q.options.forEach((opt, idx) => {
      if (idx !== q.answer && opt) {
        wrongOptionsBySubject[subKey].push(opt);
        allWrongOptions.push(opt);
      }
    });
  });

  return questions.map((q) => {
    if (!q || !Array.isArray(q.options) || q.options.length < 4) return q;

    const correctAnswer = q.options[q.answer];
    const originalWrongs = q.options.filter((_, idx) => idx !== q.answer);

    // Gather candidate distractors from same subject first, then all subjects
    const subKey = q.subject || q.subjectKey || 'general';
    const sameSubjectPool = shuffleArray(wrongOptionsBySubject[subKey] || []);
    const otherPool = shuffleArray(allWrongOptions);

    // Existing option texts (lowercase for dedup)
    const existingSet = new Set(q.options.map((o) => o.trim().toLowerCase()));
    existingSet.add(correctAnswer.trim().toLowerCase());

    const extraDistractors = [];

    // Try same-subject distractors first (more plausible)
    for (const candidate of sameSubjectPool) {
      if (extraDistractors.length >= 4) break;
      const key = candidate.trim().toLowerCase();
      if (!existingSet.has(key)) {
        existingSet.add(key);
        extraDistractors.push(candidate);
      }
    }

    // Fill remaining from general pool
    for (const candidate of otherPool) {
      if (extraDistractors.length >= 4) break;
      const key = candidate.trim().toLowerCase();
      if (!existingSet.has(key)) {
        existingSet.add(key);
        extraDistractors.push(candidate);
      }
    }

    // If we still don't have enough, generate labeled variants
    while (extraDistractors.length < 4) {
      const filler = `ចម្លើយទី ${q.options.length + extraDistractors.length + 1}`;
      if (!existingSet.has(filler.toLowerCase())) {
        existingSet.add(filler.toLowerCase());
        extraDistractors.push(filler);
      } else {
        extraDistractors.push(`ជម្រើសផ្សេង ${extraDistractors.length + 5}`);
      }
    }

    // Combine all 8 options: correct + 3 original wrongs + 4 new distractors
    const all8Options = [correctAnswer, ...originalWrongs, ...extraDistractors.slice(0, 4)];
    const shuffled8 = shuffleArray(all8Options);
    const newCorrectIdx = shuffled8.findIndex((opt) => opt === correctAnswer);

    // Generate a smart hint from the question's context
    let hint = '';
    if (q.explanation) {
      // Take first 60 chars of explanation as a clue
      const cleanExplanation = q.explanation.replace(/<[^>]+>/g, '').trim();
      hint = cleanExplanation.length > 80 ? cleanExplanation.substring(0, 80) + '...' : cleanExplanation;
    } else if (q.subject) {
      hint = `ព័ត៌មានជំនួយ៖ សំណួរនេះស្ថិតក្នុងមុខវិជ្ជា ${q.subject}`;
      if (q.grade) hint += ` (ថ្នាក់ទី${q.grade})`;
    }

    // Determine the correct answer letter for the hint (1-indexed)
    const correctLetter = String.fromCharCode(65 + (newCorrectIdx >= 0 ? newCorrectIdx : 0));
    const letterHint = `ចម្លើយត្រឹមត្រូវចាប់ផ្តើមដោយអក្សរ "${correctAnswer.charAt(0)}"`;

    return {
      ...q,
      options: shuffled8,
      answer: newCorrectIdx >= 0 ? newCorrectIdx : 0,
      hint: hint || letterHint,
      letterHint: letterHint,
      _original4Options: q.options,
      _original4Answer: q.answer
    };
  });
}
