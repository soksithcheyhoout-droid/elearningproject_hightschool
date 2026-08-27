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

// Expand questions to 8 choices by borrowing plausible distractors from the full bank pool
function expandTo8Options(question, allQuestionsPool = []) {
  if (!question || !Array.isArray(question.options) || question.options.length === 0) {
    return question;
  }

  if (question.options.length >= 8) {
    let hint = question.hint || '';
    if (!hint && question.explanation) {
      hint = question.explanation.length > 80 ? question.explanation.substring(0, 80) + '...' : question.explanation;
    }
    return { ...question, hint };
  }

  const safeAnswerIndex = typeof question.answer === 'number' && question.answer >= 0 && question.answer < question.options.length
    ? question.answer
    : 0;

  const correctAnswer = question.options[safeAnswerIndex];
  const originalWrongs = question.options.filter((_, idx) => idx !== safeAnswerIndex);

  const existingSet = new Set(question.options.map(o => typeof o === 'string' ? o.trim().toLowerCase() : String(o)));
  if (typeof correctAnswer === 'string') existingSet.add(correctAnswer.trim().toLowerCase());

  const needed = 8 - question.options.length;
  const extraDistractors = [];

  // 1. Gather same-subject distractors from full pool
  const sub = (question.subjectKey || question.subject || '').toLowerCase();
  const sameSubQuestions = allQuestionsPool.filter(q => (q.subjectKey || q.subject || '').toLowerCase() === sub);
  const shuffledSameSub = shuffle(sameSubQuestions);

  for (const q of shuffledSameSub) {
    if (extraDistractors.length >= needed) break;
    if (Array.isArray(q.options)) {
      for (let i = 0; i < q.options.length; i++) {
        if (i !== q.answer && typeof q.options[i] === 'string' && q.options[i].trim()) {
          const opt = q.options[i].trim();
          const key = opt.toLowerCase();
          if (!existingSet.has(key)) {
            existingSet.add(key);
            extraDistractors.push(opt);
            if (extraDistractors.length >= needed) break;
          }
        }
      }
    }
  }

  // 2. Gather from general pool
  if (extraDistractors.length < needed) {
    const shuffledGeneral = shuffle(allQuestionsPool);
    for (const q of shuffledGeneral) {
      if (extraDistractors.length >= needed) break;
      if (Array.isArray(q.options)) {
        for (let i = 0; i < q.options.length; i++) {
          if (i !== q.answer && typeof q.options[i] === 'string' && q.options[i].trim()) {
            const opt = q.options[i].trim();
            const key = opt.toLowerCase();
            if (!existingSet.has(key)) {
              existingSet.add(key);
              extraDistractors.push(opt);
              if (extraDistractors.length >= needed) break;
            }
          }
        }
      }
    }
  }

  // 3. Fallback fillers
  const fallbackFillers = ['ជម្រើសមិនត្រឹមត្រូវ', 'គ្មានចម្លើយត្រឹមត្រូវ', 'គ្រប់ចម្លើយទាំងអស់សុទ្ធតែត្រឹមត្រូវ', 'ចម្លើយខាងលើមិនត្រឹមត្រូវ'];
  for (const filler of fallbackFillers) {
    if (extraDistractors.length >= needed) break;
    const key = filler.toLowerCase();
    if (!existingSet.has(key)) {
      existingSet.add(key);
      extraDistractors.push(filler);
    }
  }

  const all8Options = [correctAnswer, ...originalWrongs, ...extraDistractors.slice(0, needed)];
  const shuffled8 = shuffle(all8Options);
  const newAnswerIndex = shuffled8.findIndex(o => o === correctAnswer);

  let hint = question.hint || '';
  if (!hint) {
    if (question.explanation) {
      hint = question.explanation.length > 80 ? question.explanation.substring(0, 80) + '...' : question.explanation;
    } else if (question.subject) {
      hint = `ព័ត៌មានជំនួយ៖ សំណួរនេះស្ថិតក្នុងមុខវិជ្ជា ${question.subject}`;
    }
  }

  return {
    ...question,
    options: shuffled8,
    answer: newAnswerIndex !== -1 ? newAnswerIndex : 0,
    hint: hint || 'សូមគិតឱ្យបានល្អិតល្អន់មុននឹងជ្រើសរើសចម្លើយ'
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

  // Expand to 8 options and deeply shuffle options for each individual question
  const allBank = [...scienceList, ...socialList];
  const randomizedQuestions = selected.map(q => expandTo8Options(q, allBank));

  res.status(200).json({
    success: true,
    totalMatching: pool.length,
    returnedCount: randomizedQuestions.length,
    stream: stream || 'all',
    questions: randomizedQuestions
  });
};
