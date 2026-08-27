import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bankPath70k = path.join(__dirname, '..', 'data', 'master_question_bank_70000.json');
const bankPath60k = path.join(__dirname, '..', 'data', 'master_question_bank_60000.json');
const bankPath20k = path.join(__dirname, '..', 'data', 'master_question_bank_20000.json');
const bankPath12k = path.join(__dirname, '..', 'data', 'master_question_bank_12000.json');

let masterQuestionBank = null;

// Load 70,000 question bank into memory on demand
function getMasterBank() {
  if (!masterQuestionBank) {
    try {
      let raw = null;
      if (fs.existsSync(bankPath70k)) {
        raw = fs.readFileSync(bankPath70k, 'utf-8');
      } else if (fs.existsSync(bankPath60k)) {
        raw = fs.readFileSync(bankPath60k, 'utf-8');
      } else if (fs.existsSync(bankPath20k)) {
        raw = fs.readFileSync(bankPath20k, 'utf-8');
      } else if (fs.existsSync(bankPath12k)) {
        raw = fs.readFileSync(bankPath12k, 'utf-8');
      }

      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const science = parsed.filter(q => q.stream === 'science');
          const social = parsed.filter(q => q.stream === 'social');
          const bySubject = {};
          parsed.forEach(q => {
            bySubject[q.subjectKey || q.subject] = (bySubject[q.subjectKey || q.subject] || 0) + 1;
          });

          masterQuestionBank = {
            totalCount: parsed.length,
            science,
            social,
            counts: {
              science: science.length,
              social: social.length,
              bySubject
            },
            version: '5.0.0-National-MoEYS-70k'
          };
        } else {
          masterQuestionBank = parsed;
        }
        console.log(`📚 Master Question Bank loaded into memory: ${masterQuestionBank.totalCount.toLocaleString()} questions (35,000 Science + 35,000 Social)`);
      }
    } catch (e) {
      console.error('Failed to load master question bank:', e);
    }
  }
  return masterQuestionBank;
}

// Fisher-Yates array shuffler
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Shuffle options of a single question and recalculate correct answer index
function shuffleQuestionOptions(question) {
  if (!question || !Array.isArray(question.options) || question.options.length === 0) {
    return question;
  }

  const safeAnswerIndex = typeof question.answer === 'number' && question.answer >= 0 && question.answer < question.options.length
    ? question.answer
    : 0;

  const originalCorrectOption = question.options[safeAnswerIndex];
  const shuffledOptions = shuffle(question.options);
  const newAnswerIndex = shuffledOptions.indexOf(originalCorrectOption);

  return {
    ...question,
    options: shuffledOptions,
    answer: newAnswerIndex !== -1 ? newAnswerIndex : 0
  };
}

/**
 * GET /api/questions/stats
 */
export const getQuestionBankStats = (req, res) => {
  const bank = getMasterBank();
  if (!bank) {
    return res.status(500).json({ error: 'Question bank not available' });
  }

  res.status(200).json({
    success: true,
    totalCount: bank.totalCount,
    scienceCount: bank.counts.science,
    socialCount: bank.counts.social,
    bySubject: bank.counts.bySubject,
    version: bank.version
  });
};

/**
 * GET /api/questions/master-pool
 * Query parameters:
 * - stream: 'science' | 'social' | 'random' | 'all'
 * - subjectKey: 'math' | 'physics' | 'chemistry' | 'biology' | 'khmer' | 'history' | 'geography' | 'civics'
 * - grade: '1' - '12' | 'all'
 * - limit: number (default: 24, max: 200)
 * - random: boolean (default: true)
 * - excludeIds: comma-separated list of question ids or hashes to exclude
 */
export const getQuestionsFromPool = (req, res) => {
  const bank = getMasterBank();
  if (!bank) {
    return res.status(500).json({ error: 'Question bank not available' });
  }

  const { stream, subjectKey, grade, limit = 24, random = 'true', excludeIds = '' } = req.query;
  let pool = [];

  const excludedSet = new Set(
    typeof excludeIds === 'string' && excludeIds.trim()
      ? excludeIds.split(',').map(s => s.trim())
      : []
  );

  const scienceList = bank.science || [];
  const socialList = bank.social || [];

  if (stream === 'social') {
    pool = [...socialList];
  } else if (stream === 'science') {
    pool = [...scienceList];
  } else if (stream === 'random' || stream === 'all' || !stream) {
    // Balanced interleave from both streams
    const shuffledSci = shuffle(scienceList);
    const shuffledSoc = shuffle(socialList);
    const maxLen = Math.max(shuffledSci.length, shuffledSoc.length);
    const interleaved = [];
    for (let i = 0; i < maxLen; i++) {
      if (i < shuffledSci.length) interleaved.push(shuffledSci[i]);
      if (i < shuffledSoc.length) interleaved.push(shuffledSoc[i]);
    }
    pool = interleaved;
  } else {
    pool = [...scienceList, ...socialList];
  }

  // Filter by subjectKey if provided
  if (subjectKey && subjectKey !== 'all') {
    const keys = subjectKey.split(',').map(k => k.trim().toLowerCase());
    pool = pool.filter(q => keys.includes((q.subjectKey || '').toLowerCase()));
  }

  // Filter out excluded question IDs if any
  if (excludedSet.size > 0) {
    const filteredPool = pool.filter(q => !excludedSet.has(q.id) && !excludedSet.has(q.q));
    if (filteredPool.length >= (parseInt(limit, 10) || 24)) {
      pool = filteredPool;
    }
  }

  // Filter or prioritize by grade
  if (grade && grade !== 'all') {
    const targetGrade = String(grade);
    const targetGradeNum = parseInt(targetGrade, 10) || 12;

    const exactMatches = pool.filter(q => String(q.grade) === targetGrade);
    const reqLimit = parseInt(limit, 10) || 24;

    if (exactMatches.length >= reqLimit) {
      pool = exactMatches;
    } else {
      // Include neighboring grades within the same educational tier
      const tierMatches = pool.filter(q => {
        const qG = parseInt(q.grade, 10) || 12;
        if (targetGradeNum >= 10 && targetGradeNum <= 12) return qG >= 10 && qG <= 12;
        if (targetGradeNum >= 7 && targetGradeNum <= 9) return qG >= 7 && qG <= 9;
        return qG >= 1 && qG <= 6;
      });

      if (tierMatches.length >= reqLimit) {
        pool = tierMatches;
      }
    }
  }

  const shouldRandom = random === 'true' || random === true;
  if (shouldRandom) {
    pool = shuffle(pool);
  }

  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 24, 1), 200);
  const selected = pool.slice(0, parsedLimit);

  // Deeply shuffle options and re-index correct answer for each individual question
  const randomizedQuestions = selected.map(q => shuffleQuestionOptions(q));

  res.status(200).json({
    success: true,
    totalMatching: pool.length,
    returnedCount: randomizedQuestions.length,
    stream: stream || 'all',
    questions: randomizedQuestions
  });
};
