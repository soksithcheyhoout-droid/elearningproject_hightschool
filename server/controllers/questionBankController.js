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
let distractorIndexBySubject = {};
let allDistractorsList = [];

// Load 70,000 question bank into memory on demand and build O(1) fast lookup caches
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
          const science = [];
          const social = [];
          const bySubject = {};
          const distMap = {};
          const allDist = [];

          for (let i = 0; i < parsed.length; i++) {
            const q = parsed[i];
            if (!q) continue;

            if (q.stream === 'social') {
              social.push(q);
            } else {
              science.push(q);
            }

            const sub = q.subjectKey || q.subject || 'general';
            bySubject[sub] = (bySubject[sub] || 0) + 1;

            if (!distMap[sub]) distMap[sub] = [];
            if (Array.isArray(q.options)) {
              for (let oi = 0; oi < q.options.length; oi++) {
                if (oi !== q.answer && typeof q.options[oi] === 'string' && q.options[oi].trim().length >= 2) {
                  const optText = q.options[oi].trim();
                  distMap[sub].push(optText);
                  allDist.push(optText);
                }
              }
            }
          }

          distractorIndexBySubject = distMap;
          allDistractorsList = allDist;

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
        console.log(`📚 Master Question Bank loaded: ${masterQuestionBank.totalCount.toLocaleString()} questions (O(1) fast index built)`);
      }
    } catch (e) {
      console.error('Failed to load master question bank:', e);
    }
  }
  return masterQuestionBank;
}

// Fast lightweight array shuffler
function fastShuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const SEMANTIC_BANKS = {
  strait: [
    'ច្រកសមុទ្រម៉ាឡាកា (Strait of Malacca)',
    'ច្រកសមុទ្រស៊ុនដា (Sunda Strait)',
    'ច្រកសមុទ្រប៊េរីង (Bering Strait)',
    'ច្រកសមុទ្រហ័រមូស (Strait of Hormuz)',
    'ច្រកសមុទ្រជីប្រាល់តា (Strait of Gibraltar)',
    'ច្រកសមុទ្របូស្វ័រ (Bosphorus Strait)'
  ],
  river: [
    'ទន្លេមេគង្គ (Mekong River)',
    'ទន្លេសាប (Tonle Sap River)',
    'ទន្លេបាសាក់ (Bassac River)',
    'ទន្លេសេកុង (Sekong River)',
    'ទន្លេសេសាន (Sesan River)',
    'ទន្លេស្រែពក (Srepok River)'
  ],
  island: ['កោះរ៉ុង', 'កោះស្តេច', 'កោះពស់', 'កោះត្រល់', 'កោះស៊ូម៉ាត្រា', 'កោះជ្វា', 'កោះប័រណេអូ'],
  mountain: ['ភ្នំឱរ៉ាល់ (កម្ពស់ ១៨១៣ម)', 'ជួរភ្នំដងរែក', 'ជួរភ្នំក្រវាញ', 'ភ្នំគូលែន', 'ភ្នំបូកគោ'],
  province: ['ខេត្តសៀមរាប', 'ខេត្តបាត់ដំបង', 'ខេត្តកំពង់ចាម', 'ខេត្តកណ្តាល', 'ខេត្តព្រះសីហនុ', 'ខេត្តកំពត'],
  country: ['ប្រទេសកម្ពុជា', 'ប្រទេសថៃ', 'ប្រទេសវៀតណាម', 'ប្រទេសឡាវ', 'ប្រទេសសិង្ហបុរី', 'ប្រទេសឥណ្ឌូណេស៊ី'],
  king: ['ព្រះបាទជ័យវរ្ម័នទី៧', 'ព្រះបាទសូរ្យវរ្ម័នទី២', 'ព្រះបាទជ័យវរ្ម័នទី២', 'ព្រះបាទឥន្ទ្រវរ្ម័នទី១', 'ព្រះបាទយសោវរ្ម័នទី១']
};

function detectSemanticCategory(question, options) {
  const combinedText = [
    question?.q || '',
    ...(Array.isArray(options) ? options : [])
  ].join(' ').toLowerCase();

  if (combinedText.includes('ច្រកសមុទ្រ')) return 'strait';
  if (combinedText.includes('ទន្លេ') || combinedText.includes('ស្ទឹង')) return 'river';
  if (combinedText.includes('កោះ')) return 'island';
  if (combinedText.includes('ភ្នំ')) return 'mountain';
  if (combinedText.includes('ខេត្ត')) return 'province';
  if (combinedText.includes('ប្រទេស')) return 'country';
  if (combinedText.includes('ព្រះបាទ') || combinedText.includes('រជ្ជកាល')) return 'king';

  return null;
}

function generateSecretAcademicHint(q) {
  if (q.explanation && typeof q.explanation === 'string' && q.explanation.trim()) {
    const clean = q.explanation.replace(/<[^>]+>/g, '').trim();
    if (clean.length <= 120) return `💡 ព័ត៌មានជំនួយ៖ ${clean}`;
    return `💡 ព័ត៌មានជំនួយ៖ ${clean.substring(0, 110)}...`;
  }

  const sub = (q.subject || q.subjectKey || '').toLowerCase();
  if (sub.includes('math') || sub.includes('គណិត')) return '💡 ព័ត៌មានជំនួយ៖ ពិនិត្យរូបមន្តគណិតវិទ្យា សម្រួលកន្សោម និងគណនាឱ្យបានត្រឹមត្រូវ';
  if (sub.includes('physic') || sub.includes('រូប')) return '💡 ព័ត៌មានជំនួយ៖ ប្រើរូបមន្តរូបវិទ្យា និងផ្ទៀងផ្ទាត់ខ្នាតអន្តរជាតិ (SI Units)';
  if (sub.includes('chem') || sub.includes('គីមី')) return '💡 ព័ត៌មានជំនួយ៖ ផ្ទៀងផ្ទាត់សមីការគីមី បន្ទុកអគ្គិសនី និងច្បាប់រក្សាម៉ាស';
  if (sub.includes('geo') || sub.includes('ភូមិ')) return '💡 ព័ត៌មានជំនួយ៖ ពិចារណាលើទីតាំងភូមិសាស្ត្រ ធនធានធម្មជាតិ និងអាកាសធាតុ';
  if (sub.includes('hist') || sub.includes('ប្រវត្តិ')) return '💡 ព័ត៌មានជំនួយ៖ ព្រឹត្តិការណ៍ប្រវត្តិសាស្ត្រផ្សារភ្ជាប់នឹងសម័យកាល និងបុព្វបុរសខ្មែរ';
  if (sub.includes('khmer') || sub.includes('អក្សរ')) return '💡 ព័ត៌មានជំនួយ៖ ពិចារណាលើតម្លៃអប់រំ និងសិល្បៈតែងនិពន្ធក្នុងអក្សរសិល្ប៍ជាតិ';

  return '💡 ព័ត៌មានជំនួយ៖ សូមគិតឱ្យបានល្អិតល្អន់ និងផ្ទៀងផ្ទាត់មុននឹងជ្រើសរើសចម្លើយ';
}

// Ultra-fast O(1) expansion of options to 8 choices
function fastExpandTo8Options(question) {
  if (!question || !Array.isArray(question.options) || question.options.length === 0) {
    return question;
  }

  const safeAnswerIndex = typeof question.answer === 'number' && question.answer >= 0 && question.answer < question.options.length
    ? question.answer
    : 0;

  const correctAnswer = question.options[safeAnswerIndex];
  const originalWrongs = question.options.filter((_, idx) => idx !== safeAnswerIndex);

  if (question.options.length >= 8) {
    const hint = question.hint || generateSecretAcademicHint(question);
    return { ...question, hint };
  }

  const existingSet = new Set(question.options.map(o => String(o).trim().toLowerCase()));
  const needed = 8 - question.options.length;
  const extraDistractors = [];

  // 1. Check semantic category bank
  const semanticCat = detectSemanticCategory(question, question.options);
  if (semanticCat && Array.isArray(SEMANTIC_BANKS[semanticCat])) {
    const list = SEMANTIC_BANKS[semanticCat];
    for (let i = 0; i < list.length && extraDistractors.length < needed; i++) {
      const cand = list[Math.floor(Math.random() * list.length)];
      const key = cand.trim().toLowerCase();
      if (!existingSet.has(key)) {
        existingSet.add(key);
        extraDistractors.push(cand.trim());
      }
    }
  }

  // 2. Fetch from pre-indexed subject distractor pool (O(1) instant lookup)
  const sub = question.subjectKey || question.subject || 'general';
  const subDistractors = distractorIndexBySubject[sub] || allDistractorsList;

  if (Array.isArray(subDistractors) && subDistractors.length > 0) {
    let attempts = 0;
    while (extraDistractors.length < needed && attempts < 30) {
      attempts++;
      const randOpt = subDistractors[Math.floor(Math.random() * subDistractors.length)];
      if (randOpt) {
        const key = randOpt.trim().toLowerCase();
        if (!existingSet.has(key)) {
          existingSet.add(key);
          extraDistractors.push(randOpt.trim());
        }
      }
    }
  }

  // 3. Fallback fillers if needed
  while (extraDistractors.length < needed) {
    const filler = `ជម្រើសបន្ថែមទី ${extraDistractors.length + 1}`;
    if (!existingSet.has(filler.toLowerCase())) {
      existingSet.add(filler.toLowerCase());
      extraDistractors.push(filler);
    } else {
      extraDistractors.push(`ជម្រើសវិភាគ ${extraDistractors.length + 3}`);
    }
  }

  const all8Options = [correctAnswer, ...originalWrongs, ...extraDistractors.slice(0, needed)];
  const shuffled8 = fastShuffle(all8Options);
  const newAnswerIndex = shuffled8.findIndex(o => o === correctAnswer);

  return {
    ...question,
    options: shuffled8,
    answer: newAnswerIndex !== -1 ? newAnswerIndex : 0,
    hint: generateSecretAcademicHint(question)
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
 * GET /api/questions/master-pool (Instant O(1) response)
 */
export const getQuestionsFromPool = (req, res) => {
  const bank = getMasterBank();
  if (!bank) {
    return res.status(500).json({ error: 'Question bank not available' });
  }

  const { stream, subjectKey, grade, limit = 24, excludeIds = '' } = req.query;
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 24, 1), 50);

  const excludedSet = new Set(
    typeof excludeIds === 'string' && excludeIds.trim()
      ? excludeIds.split(',').map(s => s.trim())
      : []
  );

  let sourcePool = [];
  if (stream === 'social') {
    sourcePool = bank.social;
  } else if (stream === 'science') {
    sourcePool = bank.science;
  } else {
    // Balanced mixed pool
    sourcePool = [...bank.social, ...bank.science];
  }

  // Filter by subjectKey if provided
  if (subjectKey && subjectKey !== 'all') {
    const keys = subjectKey.split(',').map(k => k.trim().toLowerCase());
    sourcePool = sourcePool.filter(q => keys.includes((q.subjectKey || '').toLowerCase()));
  }

  // Filter or prioritize by grade
  if (grade && grade !== 'all') {
    const targetGrade = String(grade);
    const targetGradeNum = parseInt(targetGrade, 10) || 12;
    const gradeFiltered = sourcePool.filter(q => {
      const qG = parseInt(q.grade, 10) || 12;
      if (targetGradeNum >= 10) return qG >= 10;
      if (targetGradeNum >= 7) return qG >= 7 && qG <= 9;
      return qG <= 6;
    });
    if (gradeFiltered.length >= parsedLimit) {
      sourcePool = gradeFiltered;
    }
  }

  // Fast random sampling without full array copy/shuffle
  const selected = [];
  const chosenIndices = new Set();
  const maxAttempts = sourcePool.length * 2;
  let attempts = 0;

  while (selected.length < parsedLimit && chosenIndices.size < sourcePool.length && attempts < maxAttempts) {
    attempts++;
    const rIdx = Math.floor(Math.random() * sourcePool.length);
    if (!chosenIndices.has(rIdx)) {
      chosenIndices.add(rIdx);
      const q = sourcePool[rIdx];
      if (q && !excludedSet.has(q.id) && !excludedSet.has(q.q)) {
        selected.push(q);
      }
    }
  }

  // Fallback if excludedSet filtered too many
  if (selected.length < parsedLimit && sourcePool.length > 0) {
    for (let i = 0; i < sourcePool.length && selected.length < parsedLimit; i++) {
      const q = sourcePool[i];
      if (!selected.includes(q)) {
        selected.push(q);
      }
    }
  }

  // Expand to 8 options in O(1) time
  const randomizedQuestions = selected.map(q => fastExpandTo8Options(q));

  res.status(200).json({
    success: true,
    totalMatching: sourcePool.length,
    returnedCount: randomizedQuestions.length,
    stream: stream || 'all',
    questions: randomizedQuestions
  });
};
