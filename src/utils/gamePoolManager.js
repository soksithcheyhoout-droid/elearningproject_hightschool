import { playgroundGamesData } from '../data/playgroundGamesData';
import { quizData } from '../data/quizData';

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
 */
export function getRandomizedGameQuestions(game, count = 6) {
  let pool = [];

  // 1. Gather all questions from the same subject / stream from playgroundGamesData
  if (game?.subjectKey) {
    const matchingGames = playgroundGamesData.filter(
      (g) => g.subjectKey === game.subjectKey || g.stream === game.stream
    );
    matchingGames.forEach((g) => {
      if (Array.isArray(g.questions)) {
        pool.push(...g.questions);
      }
    });
  }

  // 2. Also harvest questions from quizData if available
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

  // 3. Fallback to global playground pool if needed
  if (pool.length < count) {
    playgroundGamesData.forEach((g) => {
      if (Array.isArray(g.questions)) {
        pool.push(...g.questions);
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
