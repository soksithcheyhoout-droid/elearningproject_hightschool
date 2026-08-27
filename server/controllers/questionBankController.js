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

const SEMANTIC_BANKS = {
  strait: [
    'ច្រកសមុទ្រម៉ាឡាកា (Strait of Malacca)',
    'ច្រកសមុទ្រស៊ុនដា (Sunda Strait)',
    'ច្រកសមុទ្រប៊េរីង (Bering Strait)',
    'ច្រកសមុទ្រហ័រមូស (Strait of Hormuz)',
    'ច្រកសមុទ្រជីប្រាល់តា (Strait of Gibraltar)',
    'ច្រកសមុទ្របូស្វ័រ (Bosphorus Strait)',
    'ច្រកសមុទ្រដាវីស (Davis Strait)',
    'ច្រកសមុទ្រតៃវ៉ាន់ (Taiwan Strait)',
    'ច្រកសមុទ្រកូរ៉េ (Korea Strait)',
    'ច្រកសមុទ្របាបអិលម៉ង់ដេប (Bab-el-Mandeb)',
    'ច្រកសមុទ្រម៉ាហ្សេឡង់ (Strait of Magellan)',
    'ច្រកសមុទ្រលំពិក (Lombok Strait)'
  ],
  river: [
    'ទន្លេមេគង្គ (Mekong River)',
    'ទន្លេសាប (Tonle Sap River)',
    'ទន្លេបាសាក់ (Bassac River)',
    'ទន្លេសេកុង (Sekong River)',
    'ទន្លេសេសាន (Sesan River)',
    'ទន្លេស្រែពក (Srepok River)',
    'ទន្លេយ៉ាងសេ (Yangtze River)',
    'ទន្លេហួងហូ (Yellow River)',
    'ទន្លេនីល (Nile River)',
    'ទន្លេអាម៉ាហ្សូន (Amazon River)',
    'ទន្លេគង្គា (Ganges River)'
  ],
  island: ['កោះរ៉ុង', 'កោះស្តេច', 'កោះពស់', 'កោះត្រល់', 'កោះស៊ូម៉ាត្រា', 'កោះជ្វា', 'កោះប័រណេអូ', 'កោះហុកកៃដូ'],
  mountain: ['ភ្នំឱរ៉ាល់ (កម្ពស់ ១៨១៣ម)', 'ជួរភ្នំដងរែក', 'ជួរភ្នំក្រវាញ', 'ភ្នំគូលែន', 'ភ្នំបូកគោ', 'ភ្នំអេវឺរ៉េស (Mount Everest)', 'ភ្នំហ្វូជី (Mount Fuji)'],
  province: ['ខេត្តសៀមរាប', 'ខេត្តបាត់ដំបង', 'ខេត្តកំពង់ចាម', 'ខេត្តកណ្តាល', 'ខេត្តព្រះសីហនុ', 'ខេត្តកំពត', 'ខេត្តរតនគិរី', 'ខេត្តស្ទឹងត្រែង'],
  country: ['ប្រទេសកម្ពុជា', 'ប្រទេសថៃ', 'ប្រទេសវៀតណាម', 'ប្រទេសឡាវ', 'ប្រទេសសិង្ហបុរី', 'ប្រទេសឥណ្ឌូណេស៊ី', 'ប្រទេសម៉ាឡេស៊ី', 'ប្រទេសជប៉ុន'],
  king: ['ព្រះបាទជ័យវរ្ម័នទី៧', 'ព្រះបាទសូរ្យវរ្ម័នទី២', 'ព្រះបាទជ័យវរ្ម័នទី២', 'ព្រះបាទឥន្ទ្រវរ្ម័នទី១', 'ព្រះបាទយសោវរ្ម័នទី១', 'ព្រះបាទរាជេន្ទ្រវរ្ម័ន', 'ព្រះបាទឧទ័យទិត្យវរ្ម័នទី២', 'ព្រះបាទអង្គឌួង'],
  literature_theme: [
    'តម្លៃសីលធម៌ និងការតស៊ូព្យាយាម',
    'តម្លៃវប្បធម៌ និងប្រពៃណីទំនៀមទម្លាប់',
    'តម្លៃគ្រួសារ សេចក្តីស្រឡាញ់ និងភក្តីភាព',
    'តម្លៃសាមគ្គីភាព និងសច្ចធម៌ក្នុងសង្គម',
    'តម្លៃនៃការអប់រំ និងចំណេះដឹងពិតប្រាកដ',
    'តម្លៃយុត្តិធម៌ និងសមភាពសង្គម'
  ],
  author: ['ញ៉ុក ថែម', 'នូ ហាច', 'រីម គីន', 'ឌឹក គាម', 'ភិក្ខុសោម', 'ព្រះបាទអង្គឌួង', 'ក្រមង៉ុយ', 'សន្ធរវោហារម៉ុក']
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
  if (combinedText.includes('តម្លៃ') || combinedText.includes('កុលាបប៉ៃលិន') || combinedText.includes('ទុំទាវ')) return 'literature_theme';
  if (combinedText.includes('និពន្ធ') || combinedText.includes('ញ៉ុក ថែម')) return 'author';

  return null;
}

function generateSecretAcademicHint(q) {
  if (q.explanation && typeof q.explanation === 'string' && q.explanation.trim()) {
    const clean = q.explanation.replace(/<[^>]+>/g, '').trim();
    if (clean.length <= 120) return `💡 ព័ត៌មានជំនួយ៖ ${clean}`;
    return `💡 ព័ត៌មានជំនួយ៖ ${clean.substring(0, 110)}...`;
  }

  const qText = (q.q || '').toLowerCase();
  const sub = (q.subject || q.subjectKey || '').toLowerCase();

  if (qText.includes('ម៉ាឡាកា') || qText.includes('ច្រកសមុទ្រ')) return '💡 ព័ត៌មានជំនួយ៖ ផ្លូវទឹកយុទ្ធសាស្ត្រអន្តរជាតិតភ្ជាប់មហាសមុទ្រឥណ្ឌា និងសមុទ្រចិនខាងត្បូង';
  if (qText.includes('kmno4') || qText.includes('អុកស៊ីតកម្ម')) return '💡 ព័ត៌មានជំនួយ៖ K = +1, O = -2 (4 អាតូម = -8), ផលបូកចំនួនអុកស៊ីតកម្មស្មើ 0';
  if (qText.includes('កុលាបប៉ៃលិន') || qText.includes('ចៅចិត្រ')) return '💡 ព័ត៌មានជំនួយ៖ ឆ្លុះបញ្ចាំងពីតម្លៃសីលធម៌ គុណធម៌ និងការតស៊ូព្យាយាមរបស់យុវជន';
  if (qText.includes('អង្គរវត្ត') || qText.includes('សូរ្យវរ្ម័ន')) return '💡 ព័ត៌មានជំនួយ៖ កសាងឡើងក្នុងសតវត្សរ៍ទី១២ ឧទ្ទិសថ្វាយព្រះវិស្ណុ';
  if (sub.includes('math') || sub.includes('គណិត')) return '💡 ព័ត៌មានជំនួយ៖ ពិនិត្យរូបមន្តគណិតវិទ្យា សម្រួលកន្សោម និងគណនាឱ្យបានត្រឹមត្រូវ';
  if (sub.includes('physic') || sub.includes('រូប')) return '💡 ព័ត៌មានជំនួយ៖ ប្រើរូបមន្តរូបវិទ្យា និងផ្ទៀងផ្ទាត់ខ្នាតអន្តរជាតិ (SI Units)';
  if (sub.includes('chem') || sub.includes('គីមី')) return '💡 ព័ត៌មានជំនួយ៖ ផ្ទៀងផ្ទាត់សមីការគីមី បន្ទុកអគ្គិសនី និងច្បាប់រក្សាម៉ាស';
  if (sub.includes('geo') || sub.includes('ភូមិ')) return '💡 ព័ត៌មានជំនួយ៖ ពិចារណាលើទីតាំងភូមិសាស្ត្រ ធនធានធម្មជាតិ និងអាកាសធាតុ';
  if (sub.includes('hist') || sub.includes('ប្រវត្តិ')) return '💡 ព័ត៌មានជំនួយ៖ ព្រឹត្តិការណ៍ប្រវត្តិសាស្ត្រផ្សារភ្ជាប់នឹងសម័យកាល និងបុព្វបុរសខ្មែរ';
  if (sub.includes('khmer') || sub.includes('អក្សរ')) return '💡 ព័ត៌មានជំនួយ៖ ពិចារណាលើតម្លៃអប់រំ និងសិល្បៈតែងនិពន្ធក្នុងអក្សរសិល្ប៍ជាតិ';

  return '💡 ព័ត៌មានជំនួយ៖ សូមគិតឱ្យបានល្អិតល្អន់ និងផ្ទៀងផ្ទាត់មុននឹងជ្រើសរើសចម្លើយ';
}

// Expand questions to 8 choices by borrowing plausible distractors from the full bank pool
function expandTo8Options(question, allQuestionsPool = []) {
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

  const existingSet = new Set(question.options.map(o => typeof o === 'string' ? o.trim().toLowerCase() : String(o)));
  if (typeof correctAnswer === 'string') existingSet.add(correctAnswer.trim().toLowerCase());

  const needed = 8 - question.options.length;
  const extraDistractors = [];

  const avgLen = question.options.reduce((acc, opt) => acc + (typeof opt === 'string' ? opt.length : 4), 0) / question.options.length;

  // 1. Try Semantic Category Bank (e.g. Strait, River, King, Theme, etc.)
  const semanticCat = detectSemanticCategory(question, question.options);
  if (semanticCat && Array.isArray(SEMANTIC_BANKS[semanticCat])) {
    const candidates = shuffle(SEMANTIC_BANKS[semanticCat]);
    for (const cand of candidates) {
      if (extraDistractors.length >= needed) break;
      const key = cand.trim().toLowerCase();
      if (!existingSet.has(key)) {
        existingSet.add(key);
        extraDistractors.push(cand.trim());
      }
    }
  }

  // 2. Gather same-subject length-consistent distractors from full pool
  if (extraDistractors.length < needed) {
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
            const isLengthConsistent = Math.abs(opt.length - avgLen) <= Math.max(8, avgLen * 0.75);
            if (!existingSet.has(key) && isLengthConsistent) {
              existingSet.add(key);
              extraDistractors.push(opt);
              if (extraDistractors.length >= needed) break;
            }
          }
        }
      }
    }
  }

  // 3. Gather from general pool with length filter
  if (extraDistractors.length < needed) {
    const shuffledGeneral = shuffle(allQuestionsPool);
    for (const q of shuffledGeneral) {
      if (extraDistractors.length >= needed) break;
      if (Array.isArray(q.options)) {
        for (let i = 0; i < q.options.length; i++) {
          if (i !== q.answer && typeof q.options[i] === 'string' && q.options[i].trim()) {
            const opt = q.options[i].trim();
            const key = opt.toLowerCase();
            const isLengthConsistent = Math.abs(opt.length - avgLen) <= Math.max(12, avgLen * 0.9);
            if (!existingSet.has(key) && isLengthConsistent) {
              existingSet.add(key);
              extraDistractors.push(opt);
              if (extraDistractors.length >= needed) break;
            }
          }
        }
      }
    }
  }

  // 4. Fillers if needed
  while (extraDistractors.length < needed) {
    const filler = avgLen > 20
      ? `ជម្រើសវិភាគបន្ថែមទី ${extraDistractors.length + 1}`
      : `ជម្រើសទី ${question.options.length + extraDistractors.length + 1}`;
    const key = filler.toLowerCase();
    if (!existingSet.has(key)) {
      existingSet.add(key);
      extraDistractors.push(filler);
    } else {
      extraDistractors.push(`ជម្រើសផ្សេង ${extraDistractors.length + 5}`);
    }
  }

  const all8Options = [correctAnswer, ...originalWrongs, ...extraDistractors.slice(0, needed)];
  const shuffled8 = shuffle(all8Options);
  const newAnswerIndex = shuffled8.findIndex(o => o === correctAnswer);

  const secretHint = generateSecretAcademicHint(question);

  return {
    ...question,
    options: shuffled8,
    answer: newAnswerIndex !== -1 ? newAnswerIndex : 0,
    hint: secretHint
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
