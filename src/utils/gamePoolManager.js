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

  // 1. Harvest from arenaMasterQuestionBank by Grade & Stream
  if (Array.isArray(arenaMasterQuestionBank)) {
    arenaMasterQuestionBank.forEach((item) => {
      if (!item || !item.q) return;

      if (isHighSchoolTrack) {
        // For Grade 11-12: Must match exact grade and chosen stream
        if (item.grade === targetGrade && item.stream === targetStream) {
          pool.push(item);
        } else if (item.stream === targetStream) {
          // Secondary fallback from matching stream
          pool.push(item);
        }
      } else {
        // Under Grade 11 (Grades 1-10): Randomize both Science & Social
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

  // 2. Gather from playgroundGamesData by matching stream / subject
  if (Array.isArray(playgroundGamesData)) {
    playgroundGamesData.forEach((g) => {
      if (isHighSchoolTrack) {
        if (g.stream === targetStream || (game?.subjectKey && g.subjectKey === game.subjectKey)) {
          if (Array.isArray(g.questions)) pool.push(...g.questions);
        }
      } else {
        if (Array.isArray(g.questions)) pool.push(...g.questions);
      }
    });
  }

  // 3. Harvest from quizData
  if (Array.isArray(quizData)) {
    quizData.forEach((q) => {
      if (q && q.question && Array.isArray(q.options)) {
        pool.push({
          q: q.question,
          options: q.options,
          answer: q.correctAnswer ?? 0,
          explanation: q.explanation || 'ចម្លើយត្រឹមត្រូវតាមកម្រងវិញ្ញាសា'
        });
      }
    });
  }

  // 4. Include current game's specific questions
  if (Array.isArray(game?.questions) && game.questions.length > 0) {
    pool = [...game.questions, ...pool];
  }

  // 5. Deduplicate by question text
  const uniquePool = [];
  const seenTexts = new Set();
  pool.forEach((q) => {
    if (q && q.q && !seenTexts.has(q.q.trim())) {
      seenTexts.add(q.q.trim());
      uniquePool.push(q);
    }
  });

  // 6. Randomize pool and take requested count
  const selectedQuestions = shuffleArray(uniquePool).slice(0, Math.min(count, uniquePool.length));

  // 7. Shuffle options for each individual question so answer is NEVER at the same static index
  return selectedQuestions.map((q) => shuffleQuestionOptions(q));
}
