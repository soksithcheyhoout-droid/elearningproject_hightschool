import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bankPath = path.join(__dirname, '..', 'data', 'master_question_bank_12000.json');

let masterQuestionBank = null;

// Load 12,000 question bank into memory on demand
function getMasterBank() {
  if (!masterQuestionBank) {
    try {
      if (fs.existsSync(bankPath)) {
        const raw = fs.readFileSync(bankPath, 'utf-8');
        masterQuestionBank = JSON.parse(raw);
        console.log(`📚 Master Question Bank loaded into memory: ${masterQuestionBank.totalCount.toLocaleString()} questions (6,000 Science + 6,000 Social)`);
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
    version: bank.version,
    generatedAt: bank.generatedAt
  });
};

/**
 * GET /api/questions/master-pool
 * Query parameters:
 * - stream: 'science' | 'social'
 * - subjectKey: 'math' | 'physics' | 'chemistry' | 'biology' | 'khmer' | 'history' | 'geography' | 'civics'
 * - grade: '10' | '11' | '12'
 * - limit: number (default: 20, max: 100)
 * - random: boolean (default: true)
 */
export const getQuestionsFromPool = (req, res) => {
  const bank = getMasterBank();
  if (!bank) {
    return res.status(500).json({ error: 'Question bank not available' });
  }

  const { stream, subjectKey, grade, limit = 20, random = 'true' } = req.query;
  let pool = [];

  if (stream === 'social') {
    pool = bank.social || [];
  } else if (stream === 'science') {
    pool = bank.science || [];
  } else {
    // Both
    pool = [...(bank.science || []), ...(bank.social || [])];
  }

  if (subjectKey) {
    pool = pool.filter(q => q.subjectKey === subjectKey);
  }

  if (grade) {
    pool = pool.filter(q => String(q.grade) === String(grade));
  }

  const shouldRandom = random === 'true' || random === true;
  if (shouldRandom) {
    pool = shuffle(pool);
  }

  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 200);
  const result = pool.slice(0, parsedLimit);

  res.status(200).json({
    success: true,
    totalMatching: pool.length,
    returnedCount: result.length,
    stream: stream || 'all',
    questions: result
  });
};
