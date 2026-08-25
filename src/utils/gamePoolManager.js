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
 * @param {Object} game - Game metadata
 * @param {number} count - Number of questions to return
 * @param {string|number} grade - Grade level '1' to '12'
 * @param {string} stream - 'science' | 'social' | 'general'
 */
export function getRandomizedGameQuestions(game, count = 20, grade = '12', stream = 'science') {
  let pool = [];
  const targetGrade = String(grade || game?.grade || '12');
  const isHighSchoolTrack = targetGrade === '11' || targetGrade === '12';
  const targetStream = isHighSchoolTrack ? (stream || game?.stream || 'science') : 'general';

  const SCIENCE_SUBJECTS = new Set(['គណិតវិទ្យា', 'រូបវិទ្យា', 'គីមីវិទ្យា', 'ជីវវិទ្យា', 'math', 'physics', 'chemistry', 'biology']);
  const SOCIAL_SUBJECTS = new Set(['ភាសាខ្មែរ', 'ប្រវត្តិវិទ្យា', 'ភូមិវិទ្យា', 'សីលធម៌-ពលរដ្ឋ', 'សេដ្ឋកិច្ច', 'khmer', 'history', 'geography', 'civics', 'morals', 'economics']);

  // 1. Harvest from arenaMasterQuestionBank with STRICT STREAM FILTERING
  if (Array.isArray(arenaMasterQuestionBank)) {
    arenaMasterQuestionBank.forEach((item) => {
      if (!item || !item.q) return;

      if (isHighSchoolTrack) {
        if (targetStream === 'social') {
          // STRICT SOCIAL ONLY: Must be social stream or social subject
          if (item.stream === 'social' || SOCIAL_SUBJECTS.has(item.subject)) {
            if (item.grade === targetGrade) {
              pool.push(item);
            } else {
              // Also include grade 11/12 social pool items
              pool.push(item);
            }
          }
        } else if (targetStream === 'science') {
          // STRICT SCIENCE ONLY: Must be science stream or science subject
          if (item.stream === 'science' || SCIENCE_SUBJECTS.has(item.subject)) {
            if (item.grade === targetGrade) {
              pool.push(item);
            } else {
              // Also include grade 11/12 science pool items
              pool.push(item);
            }
          }
        }
      } else {
        // Under Grade 11 (Grades 1-10): Foundation pool
        const itemGradeNum = parseInt(item.grade, 10);
        const targetGradeNum = parseInt(targetGrade, 10);

        if (item.grade === targetGrade) {
          pool.push(item);
        } else if (!isNaN(itemGradeNum) && !isNaN(targetGradeNum) && itemGradeNum <= 10) {
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
          // DO NOT include math or science games
          if (g.stream === 'social' || SOCIAL_SUBJECTS.has(g.subjectKey) || SOCIAL_SUBJECTS.has(g.subject)) {
            pool.push(...g.questions);
          }
        } else if (targetStream === 'science') {
          // DO NOT include social games
          if (g.stream === 'science' || SCIENCE_SUBJECTS.has(g.subjectKey) || SCIENCE_SUBJECTS.has(g.subject)) {
            pool.push(...g.questions);
          }
        }
      } else {
        pool.push(...g.questions);
      }
    });
  }

  // 3. Current game's questions: ONLY include if it matches targetStream
  if (Array.isArray(game?.questions) && game.questions.length > 0) {
    if (isHighSchoolTrack) {
      if (targetStream === 'social' && (game.stream === 'social' || SOCIAL_SUBJECTS.has(game.subjectKey) || SOCIAL_SUBJECTS.has(game.subject))) {
        pool = [...game.questions, ...pool];
      } else if (targetStream === 'science' && (game.stream === 'science' || SCIENCE_SUBJECTS.has(game.subjectKey) || SCIENCE_SUBJECTS.has(game.subject))) {
        pool = [...game.questions, ...pool];
      }
    } else {
      pool = [...game.questions, ...pool];
    }
  }

  // 4. Deduplicate by question text
  const uniquePool = [];
  const seenTexts = new Set();
  pool.forEach((q) => {
    if (q && q.q && !seenTexts.has(q.q.trim())) {
      seenTexts.add(q.q.trim());
      uniquePool.push(q);
    }
  });

  // 5. Randomize pool and take requested count
  const selectedQuestions = shuffleArray(uniquePool).slice(0, Math.min(count, uniquePool.length));

  // 6. Shuffle options for each individual question so answer is NEVER at the same static index
  return selectedQuestions.map((q) => shuffleQuestionOptions(q));
}
