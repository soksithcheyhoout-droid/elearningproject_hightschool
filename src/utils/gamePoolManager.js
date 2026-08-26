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

  // =========================================================================
  // CASE 1: SPECIFIC TOPIC GAME CLICKED (e.g. Khmer Folk Tales, Calculus, etc.)
  // =========================================================================
  if (game && Array.isArray(game.questions) && game.questions.length > 0) {
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
    const targetStream = game.stream || (SOCIAL_SUBJECTS.has(targetSubject) || SOCIAL_SUBJECTS.has(targetSubjectKey) ? 'social' : 'science');

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
          // Double check it's not a mismatched subject
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
  // CASE 2: GENERAL ARENA DUEL / RANDOM SESSION (No specific game selected)
  // =========================================================================
  let pool = [];
  const targetGrade = String(game?.grade || grade || '12');
  const targetStream = game?.stream || stream || 'science';
  const isHighSchoolTrack = targetGrade === '11' || targetGrade === '12';

  // 1. Harvest from arenaMasterQuestionBank with STRICT stream filtering
  if (Array.isArray(arenaMasterQuestionBank)) {
    arenaMasterQuestionBank.forEach((item) => {
      if (!item || !item.q) return;

      if (isHighSchoolTrack) {
        if (targetStream === 'social') {
          if (item.stream === 'social' || SOCIAL_SUBJECTS.has(item.subject) || SOCIAL_SUBJECTS.has(item.subjectKey)) {
            pool.push(item);
          }
        } else if (targetStream === 'science') {
          if (item.stream === 'science' || SCIENCE_SUBJECTS.has(item.subject) || SCIENCE_SUBJECTS.has(item.subjectKey)) {
            pool.push(item);
          }
        } else {
          pool.push(item);
        }
      } else {
        const itemGradeNum = parseInt(item.grade, 10);
        const targetGradeNum = parseInt(targetGrade, 10);
        if (item.grade === targetGrade || (!isNaN(itemGradeNum) && !isNaN(targetGradeNum) && itemGradeNum <= 10)) {
          pool.push(item);
        }
      }
    });
  }

  // 2. Gather from playgroundGamesData with STRICT stream isolation
  if (Array.isArray(playgroundGamesData)) {
    playgroundGamesData.forEach((g) => {
      if (!g || !Array.isArray(g.questions)) return;

      if (isHighSchoolTrack) {
        if (targetStream === 'social') {
          if (g.stream === 'social' || SOCIAL_SUBJECTS.has(g.subjectKey) || SOCIAL_SUBJECTS.has(g.subject)) {
            pool.push(...g.questions);
          }
        } else if (targetStream === 'science') {
          if (g.stream === 'science' || SCIENCE_SUBJECTS.has(g.subjectKey) || SCIENCE_SUBJECTS.has(g.subject)) {
            pool.push(...g.questions);
          }
        }
      } else {
        pool.push(...g.questions);
      }
    });
  }

  // 3. Deduplicate by question text
  const uniquePool = [];
  const seenTexts = new Set();
  pool.forEach((q) => {
    if (q && q.q && !seenTexts.has(q.q.trim())) {
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

