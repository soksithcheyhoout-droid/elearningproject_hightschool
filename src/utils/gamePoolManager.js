import { playgroundGamesData } from '../data/playgroundGamesData';
import { quizData } from '../data/quizData';
import { arenaMasterQuestionBank } from '../data/arenaMasterQuestionBank';

/**
 * Fisher-Yates Shuffle array in-place and return new copy
 */
export function shuffleArray(array) {
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

/**
 * Generate a randomized pool of unique questions for a game session
 * Strictly preserves game topic & subject isolation (never leaks Math into Khmer literature or Social into Physics)
 * @param {Object} game - Game metadata
 * @param {number} count - Number of questions to return
 * @param {string|number} grade - Grade level '1' to '12'
 * @param {string} stream - 'science' | 'social' | 'general'
 */
export function getRandomizedGameQuestions(game, count = 20, grade = null, stream = null) {
  const SCIENCE_SUBJECTS = new Set(['គណិតវិទ្យា', 'រូបវិទ្យា', 'គីមីវិទ្យា', 'ជីវវិទ្យា', 'math', 'physics', 'chemistry', 'biology']);
  const SOCIAL_SUBJECTS = new Set(['ភាសាខ្មែរ', 'អក្សរសាស្ត្រខ្មែរ', 'ប្រវត្តិវិទ្យា', 'ភូមិវិទ្យា', 'សីលធម៌-ពលរដ្ឋ', 'សេដ្ឋកិច្ច', 'khmer', 'history', 'geography', 'civics', 'morals', 'economics']);

  const requestedStream = stream || game?.stream || 'science';
  const gameStream = game?.stream || 'science';

  // =========================================================================
  // CASE 1: SPECIFIC TOPIC GAME CLICKED (Only if requestedStream matches the game's stream)
  // =========================================================================
  if (game && Array.isArray(game.questions) && game.questions.length > 0 && requestedStream === gameStream && requestedStream !== 'random') {
    const gameQuestions = game.questions.filter((q) => q && q.q);

    // If game has sufficient questions for this session, shuffle and return
    if (gameQuestions.length >= count) {
      return shuffleArray(gameQuestions)
        .slice(0, count)
        .map((q) => shuffleQuestionOptions(q));
    }

    // Otherwise, start with all game-specific questions and fill remainder from SAME SUBJECT only
    let pool = [...gameQuestions];
    const seenTexts = new Set(pool.map((q) => q.q.trim()));

    const targetSubjectKey = game.subjectKey;
    const targetSubject = game.subject;
    const targetStream = requestedStream;

    // 1. Gather other games with the EXACT SAME subjectKey from playgroundGamesData
    if (Array.isArray(playgroundGamesData)) {
      playgroundGamesData.forEach((g) => {
        if (!g || !Array.isArray(g.questions)) return;
        if (targetSubjectKey && g.subjectKey === targetSubjectKey) {
          g.questions.forEach((q) => {
            if (q && q.q && !seenTexts.has(q.q.trim())) {
              seenTexts.add(q.q.trim());
              pool.push(q);
            }
          });
        }
      });
    }

    // 2. If still need more, harvest from arenaMasterQuestionBank for the SAME subject
    if (pool.length < count && Array.isArray(arenaMasterQuestionBank)) {
      arenaMasterQuestionBank.forEach((item) => {
        if (!item || !item.q) return;
        const matchesSubject = (targetSubjectKey && item.subjectKey === targetSubjectKey) ||
                               (targetSubject && (item.subject === targetSubject || item.subject?.includes(targetSubject)));
        if (matchesSubject && !seenTexts.has(item.q.trim())) {
          seenTexts.add(item.q.trim());
          pool.push(item);
        }
      });
    }

    // 3. If STILL need more, harvest from the SAME stream only (NEVER cross streams!)
    if (pool.length < count && Array.isArray(arenaMasterQuestionBank)) {
      arenaMasterQuestionBank.forEach((item) => {
        if (!item || !item.q) return;
        if (item.stream === targetStream && !seenTexts.has(item.q.trim())) {
          if (targetStream === 'social' && !SCIENCE_SUBJECTS.has(item.subject)) {
            seenTexts.add(item.q.trim());
            pool.push(item);
          } else if (targetStream === 'science' && !SOCIAL_SUBJECTS.has(item.subject)) {
            seenTexts.add(item.q.trim());
            pool.push(item);
          }
        }
      });
    }

    const selected = shuffleArray(pool).slice(0, Math.min(count, pool.length));
    return selected.map((q) => shuffleQuestionOptions(q));
  }

  // =========================================================================
  // CASE 2: GENERAL ARENA DUEL / RANDOM SESSION / STREAM SWITCH (Science vs Social vs Random)
  // =========================================================================
  let pool = [];
  const targetGrade = String(grade || game?.grade || '12');
  const targetGradeNum = parseInt(targetGrade, 10) || 12;
  const targetStream = requestedStream;

  // Helper to determine educational tier
  const isPrimary = targetGradeNum >= 1 && targetGradeNum <= 6;
  const isJuniorHigh = targetGradeNum >= 7 && targetGradeNum <= 9;
  const isHighSchool = targetGradeNum >= 10 && targetGradeNum <= 12;

  // 1. Harvest from arenaMasterQuestionBank with STRICT Stream matching
  if (Array.isArray(arenaMasterQuestionBank)) {
    arenaMasterQuestionBank.forEach((item) => {
      if (!item || !item.q) return;

      const itemGradeNum = parseInt(item.grade, 10);
      const isExactGrade = String(item.grade) === targetGrade;
      const isSameTier = 
        (isPrimary && itemGradeNum >= 1 && itemGradeNum <= 6) ||
        (isJuniorHigh && itemGradeNum >= 7 && itemGradeNum <= 9) ||
        (isHighSchool && itemGradeNum >= 10 && itemGradeNum <= 12);

      let matchesStream = false;
      if (targetStream === 'random') {
        matchesStream = true;
      } else if (targetStream === 'social') {
        matchesStream = (item.stream === 'social' || SOCIAL_SUBJECTS.has(item.subject) || SOCIAL_SUBJECTS.has(item.subjectKey)) && !SCIENCE_SUBJECTS.has(item.subject);
      } else {
        matchesStream = (item.stream === 'science' || SCIENCE_SUBJECTS.has(item.subject) || SCIENCE_SUBJECTS.has(item.subjectKey)) && !SOCIAL_SUBJECTS.has(item.subject);
      }

      if (matchesStream) {
        if (isExactGrade) {
          pool.unshift(item);
        } else if (isSameTier) {
          pool.push(item);
        } else {
          pool.push(item);
        }
      }
    });
  }

  // 2. Gather from playgroundGamesData with STRICT Stream matching
  // Tag each question with its parent game's stream/subject for dedup guard
  if (Array.isArray(playgroundGamesData)) {
    playgroundGamesData.forEach((g) => {
      if (!g || !Array.isArray(g.questions)) return;

      let matchesStream = false;
      if (targetStream === 'random') {
        matchesStream = true;
      } else if (targetStream === 'social') {
        matchesStream = (g.stream === 'social' || SOCIAL_SUBJECTS.has(g.subjectKey) || SOCIAL_SUBJECTS.has(g.subject)) && !SCIENCE_SUBJECTS.has(g.subject);
      } else {
        matchesStream = (g.stream === 'science' || SCIENCE_SUBJECTS.has(g.subjectKey) || SCIENCE_SUBJECTS.has(g.subject)) && !SOCIAL_SUBJECTS.has(g.subject);
      }

      if (matchesStream) {
        g.questions.forEach((q) => {
          if (q && q.q) {
            pool.push({ ...q, stream: g.stream, subject: q.subject || g.subject, subjectKey: q.subjectKey || g.subjectKey });
          }
        });
      }
    });
  }

  // 3. Deduplicate by question text and enforce strict stream isolation
  const uniquePool = [];
  const seenTexts = new Set();
  pool.forEach((q) => {
    if (q && q.q && !seenTexts.has(q.q.trim())) {
      // Hard guard: Never allow Science questions into Social, and vice-versa
      if (targetStream === 'social' && SCIENCE_SUBJECTS.has(q.subject)) return;
      if (targetStream === 'science' && SOCIAL_SUBJECTS.has(q.subject)) return;

      seenTexts.add(q.q.trim());
      uniquePool.push(q);
    }
  });

  // 4. Randomize pool and take requested count
  const selectedQuestions = shuffleArray(uniquePool).slice(0, Math.min(count, uniquePool.length));

  // 5. Shuffle options for each individual question
  return selectedQuestions.map((q) => shuffleQuestionOptions(q));
}

/**
 * Asynchronously fetch fresh authentic questions from the 12,000 Master National Question Bank (6,000 Science + 6,000 Social)
 * @param {Object} options - { stream, subjectKey, grade, limit, random }
 */
export async function fetchLiveExamQuestions({ stream = 'science', subjectKey = '', grade = '12', limit = 24, random = true } = {}) {
  try {
    const API_URL = import.meta.env.VITE_API_URL || '/api';
    const params = new URLSearchParams({
      stream,
      ...(subjectKey ? { subjectKey } : {}),
      ...(grade ? { grade: String(grade) } : {}),
      limit: String(limit),
      random: String(random)
    });

    const res = await fetch(`${API_URL}/questions/master-pool?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.questions) && data.questions.length > 0) {
        return data.questions.map((q) => shuffleQuestionOptions(q));
      }
    }
  } catch (err) {
    console.warn('[Live Exam Pool Fetch Warning]:', err.message);
  }

  // Fallback to local synchronous pool if offline or loading
  return getRandomizedGameQuestions(null, limit, grade, stream);
}

