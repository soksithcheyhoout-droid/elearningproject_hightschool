import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('📚 Generating 100+ National High-School Digital Library Books...');

const SUBJECTS_CONFIG = [
  // Grade 12 Core
  { id: 'math-12-adv', nameKm: 'គណិតវិទ្យា ថ្នាក់ទី១២ (កម្រិតខ្ពស់)', nameEn: 'Mathematics Grade 12 (Advanced Level)', cat: 'Math', grade: '12', pages: 284, author: 'ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)' },
  { id: 'math-12-soc', nameKm: 'គណិតវិទ្យា ថ្នាក់ទី១២ (ថ្នាក់សង្គម)', nameEn: 'Applied Mathematics Grade 12 (Social Stream)', cat: 'Math', grade: '12', pages: 220, author: 'នាយកដ្ឋានអភិវឌ្ឍន៍កម្មវិធីសិក្សា MoEYS' },
  { id: 'physics-12', nameKm: 'រូបវិទ្យា ថ្នាក់ទី១២ (ទ្រឹស្តី និងពិសោធន៍)', nameEn: 'Physics Grade 12 (Theory & Laboratory)', cat: 'Physics', grade: '12', pages: 240, author: 'ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)' },
  { id: 'chem-12', nameKm: 'គីមីវិទ្យា ថ្នាក់ទី១២ (ស៊ីនេទិច និងសរីរាង្គ)', nameEn: 'Chemistry Grade 12 (Kinetics & Organic)', cat: 'Chemistry', grade: '12', pages: 230, author: 'ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)' },
  { id: 'bio-12', nameKm: 'ជីវវិទ្យា ថ្នាក់ទី១២ (ហ្សែន និងម៉ូលេគុល ADN)', nameEn: 'Biology Grade 12 (Genetics & DNA)', cat: 'Biology', grade: '12', pages: 250, author: 'ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)' },
  { id: 'khmer-12', nameKm: 'អក្សរសាស្ត្រខ្មែរ ថ្នាក់ទី១២ (អក្សរសិល្ប៍ និងតែងសេចក្តី)', nameEn: 'Khmer Literature Grade 12', cat: 'Khmer', grade: '12', pages: 260, author: 'គណៈកម្មការអក្សរសាស្ត្រជាតិ MoEYS' },
  { id: 'history-12', nameKm: 'ប្រវត្តិវិទ្យា ថ្នាក់ទី១២ (ប្រវត្តិសាស្ត្រកម្ពុជា & ពិភពលោក)', nameEn: 'History Grade 12 (Cambodia & World History)', cat: 'History', grade: '12', pages: 210, author: 'ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)' },
  { id: 'geo-12', nameKm: 'ភូមិវិទ្យា ថ្នាក់ទី១២ (សេដ្ឋកិច្ចកម្ពុជា និងអាស៊ាន)', nameEn: 'Geography Grade 12 (Cambodian & ASEAN Economy)', cat: 'Geography', grade: '12', pages: 200, author: 'ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)' },
  { id: 'civics-12', nameKm: 'សីលធម៌ និងពលរដ្ឋវិជ្ជា ថ្នាក់ទី១២ (រដ្ឋធម្មនុញ្ញ & នីតិរដ្ឋ)', nameEn: 'Moral & Civics Education Grade 12', cat: 'Civics', grade: '12', pages: 180, author: 'ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)' },
  { id: 'earth-12', nameKm: 'ផែនដី និងបរិស្ថានវិទ្យា ថ្នាក់ទី១២', nameEn: 'Earth & Environmental Science Grade 12', cat: 'Science', grade: '12', pages: 190, author: 'ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)' },
  { id: 'english-12', nameKm: 'ភាសាអង់គ្លេស ថ្នាក់ទី១២ (English for Cambodia Book 12)', nameEn: 'English for Cambodia Book 12', cat: 'English', grade: '12', pages: 220, author: 'MoEYS / English Language Project' },

  // Grade 11 Core
  { id: 'math-11', nameKm: 'គណិតវិទ្យា ថ្នាក់ទី១១ (ធរណីមាត្រ & ត្រីកោណមាត្រ)', nameEn: 'Mathematics Grade 11 (Geometry & Trig)', cat: 'Math', grade: '11', pages: 260, author: 'ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)' },
  { id: 'physics-11', nameKm: 'រូបវិទ្យា ថ្នាក់ទី១១ (មេកានិច និងច្បាប់ញូតុន)', nameEn: 'Physics Grade 11 (Mechanics & Newton Laws)', cat: 'Physics', grade: '11', pages: 220, author: 'ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)' },
  { id: 'chem-11', nameKm: 'គីមីវិទ្យា ថ្នាក់ទី១១ (ទែរម៉ូគីមី និងអ៊ីដ្រូកាបួ)', nameEn: 'Chemistry Grade 11 (Thermochemistry & Hydrocarbons)', cat: 'Chemistry', grade: '11', pages: 210, author: 'ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)' },
  { id: 'bio-11', nameKm: 'ជីវវិទ្យា ថ្នាក់ទី១១ (កោសិកាវិទ្យា និងសរីរវិទ្យារុក្ខជាតិ)', nameEn: 'Biology Grade 11 (Cell Biology & Plant Physiology)', cat: 'Biology', grade: '11', pages: 230, author: 'ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)' },
  { id: 'khmer-11', nameKm: 'អក្សរសាស្ត្រខ្មែរ ថ្នាក់ទី១១ (សូផាត & ផ្កាស្រពោន)', nameEn: 'Khmer Literature Grade 11', cat: 'Khmer', grade: '11', pages: 240, author: 'ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)' },
  { id: 'history-11', nameKm: 'ប្រវត្តិវិទ្យា ថ្នាក់ទី១១ (សម័យកណ្តាល & សង្គ្រាមលោក)', nameEn: 'History Grade 11 (Middle Ages & World Wars)', cat: 'History', grade: '11', pages: 200, author: 'ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)' },
  { id: 'geo-11', nameKm: 'ភូមិវិទ្យា ថ្នាក់ទី១១ (ភូមិសាស្ត្ររូបវន្តពិភពលោក)', nameEn: 'Geography Grade 11 (World Physical Geography)', cat: 'Geography', grade: '11', pages: 190, author: 'ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)' },
  { id: 'civics-11', nameKm: 'សីលធម៌-ពលរដ្ឋ ថ្នាក់ទី១១ (សិទ្ធិមនុស្ស និងសង្គម)', nameEn: 'Civics Education Grade 11', cat: 'Civics', grade: '11', pages: 170, author: 'ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)' },
  { id: 'english-11', nameKm: 'ភាសាអង់គ្លេស ថ្នាក់ទី១១ (English for Cambodia Book 11)', nameEn: 'English for Cambodia Book 11', cat: 'English', grade: '11', pages: 210, author: 'MoEYS / English Language Project' },

  // Grade 10 Core
  { id: 'math-10', nameKm: 'គណិតវិទ្យា ថ្នាក់ទី១០ (ពីជគណិត និងអនុគមន៍)', nameEn: 'Mathematics Grade 10 (Algebra & Functions)', cat: 'Math', grade: '10', pages: 240, author: 'ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)' },
  { id: 'physics-10', nameKm: 'រូបវិទ្យា ថ្នាក់ទី១០ (ចលនាត្រង់ស្មើ និងកម្លាំង)', nameEn: 'Physics Grade 10 (Kinematics & Forces)', cat: 'Physics', grade: '10', pages: 200, author: 'ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)' },
  { id: 'chem-10', nameKm: 'គីមីវិទ្យា ថ្នាក់ទី១០ (តារាងខួប និងសម្ព័ន្ធគីមី)', nameEn: 'Chemistry Grade 10 (Periodic Table & Bonds)', cat: 'Chemistry', grade: '10', pages: 190, author: 'ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)' },
  { id: 'bio-10', nameKm: 'ជីវវិទ្យា ថ្នាក់ទី១០ (ជីវមណ្ឌល និងអេកូឡូស៊ី)', nameEn: 'Biology Grade 10 (Ecosystems & Biodiversity)', cat: 'Biology', grade: '10', pages: 210, author: 'ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)' },
  { id: 'khmer-10', nameKm: 'អក្សរសាស្ត្រខ្មែរ ថ្នាក់ទី១០ (កាព្យសាស្ត្រ និងរឿងព្រេង)', nameEn: 'Khmer Literature Grade 10 (Poetry & Folkloric Tales)', cat: 'Khmer', grade: '10', pages: 220, author: 'ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)' },
  { id: 'history-10', nameKm: 'ប្រវត្តិវិទ្យា ថ្នាក់ទី១០ (សម័យបុរេប្រវត្តិ & អង្គរ)', nameEn: 'History Grade 10 (Pre-history & Angkor Era)', cat: 'History', grade: '10', pages: 190, author: 'ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)' },
  { id: 'geo-10', nameKm: 'ភូមិវិទ្យា ថ្នាក់ទី១០ (ផែនទី និងដែនដីកម្ពុជា)', nameEn: 'Geography Grade 10 (Cartography & Territory)', cat: 'Geography', grade: '10', pages: 180, author: 'ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)' },
  { id: 'civics-10', nameKm: 'សីលធម៌-ពលរដ្ឋ ថ្នាក់ទី១០ (វប្បធម៌សន្តិភាព)', nameEn: 'Civics Grade 10 (Culture of Peace)', cat: 'Civics', grade: '10', pages: 160, author: 'ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)' },
  { id: 'english-10', nameKm: 'ភាសាអង់គ្លេស ថ្នាក់ទី១០ (English for Cambodia Book 10)', nameEn: 'English for Cambodia Book 10', cat: 'English', grade: '10', pages: 200, author: 'MoEYS / English Language Project' }
];

const COVERS = [
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80'
];

const SPECIAL_SERIES = [
  { prefix: 'កម្រងវិញ្ញាសា និងដំណោះស្រាយបាក់ឌុបនិទ្ទេស A', prefixEn: 'Bac II Grade A Examination Mastery Series', cat: 'Exam', count: 15 },
  { prefix: 'សៀវភៅជំនួយស្មារតី និងរូបមន្តសង្ខេបបាក់ឌុប', prefixEn: 'Essential Formula Handbooks & Summaries', cat: 'Summary', count: 15 },
  { prefix: 'សៀវភៅលំហាត់អនុវត្តន៍ និងវិធីសាស្ត្រគណនារហ័ស', prefixEn: 'Speed Math & Science Problem Solving Series', cat: 'Exercise', count: 15 },
  { prefix: 'ឯកសារស្រាវជ្រាវ STEM និងការសរសេរកូដកុំព្យូទ័រ', prefixEn: 'STEM Research & Computer Programming', cat: 'STEM', count: 15 },
  { prefix: 'សៀវភៅត្រៀមប្រឡងអាហារូបករណ៍ថ្នាក់ជាតិ និងអន្តរជាតិ', prefixEn: 'National & Global Scholarship Preparation Guides', cat: 'Scholarship', count: 15 }
];

const allBooks = [];
let idCounter = 1;

// 1. Add Core Grade 10-12 Textbooks
SUBJECTS_CONFIG.forEach((cfg, idx) => {
  allBooks.push({
    id: `book-${cfg.id}`,
    titleKm: `សៀវភៅពុម្ព ${cfg.nameKm}`,
    titleEn: `MoEYS Textbook ${cfg.nameEn}`,
    grade: cfg.grade,
    category: cfg.cat,
    author: cfg.author,
    year: '២០២៤',
    pages: cfg.pages,
    rating: (4.7 + (idx % 4) * 0.1).toFixed(1),
    coverUrl: COVERS[idx % COVERS.length],
    descriptionKm: `សៀវភៅសិក្សាគោលផ្លូវការបោះពុម្ពដោយ${cfg.author} ស្របតាមក្របខ័ណ្ឌកម្មវិធីសិក្សាជាតិ និងស្តង់ដាអប់រំកម្ពុជាសតវត្សរ៍ទី២១។`,
    descriptionEn: `Official national curriculum textbook published by ${cfg.author} for Cambodian high schools.`,
    chapters: [
      {
        chapterNumber: 1,
        titleKm: 'ជំពូកទី ១៖ មូលដ្ឋានគ្រឹះ និងគោលគំនិតចម្បង',
        titleEn: 'Chapter 1: Foundational Principles & Core Concepts',
        pages: [
          {
            pageNumber: 1,
            title: 'ទំព័រក្រប និងអារម្ភកថា (Preface & Overview)',
            type: 'intro',
            content: `សៀវភៅសិក្សាគោលនេះត្រូវបានរៀបចំឡើងដោយក្រុមអ្នកជំនាញអប់រំ និងគណៈកម្មការតាក់តែងកម្មវិធីសិក្សាជាតិ ដើម្បីបម្រើដល់ការរៀន និងបង្រៀននៅកម្រិតមធ្យមសិក្សាទុតិយភូមិ។ ខ្លឹមសារត្រូវបានរៀបរៀងយ៉ាងសម្រិតសម្រាំង ដោយរួមបញ្ចូលទាំងទ្រឹស្តីគ្រឹះ រូបមន្តគន្លឹះ លំហាត់គំរូ និងការអនុវត្តជាក់ស្តែង។`,
            keyPoints: [
              'គោរពតាមស្តង់ដាកម្មវិធីសិក្សាជាតិ MoEYS & MoTDAR',
              'ពង្រឹងសមត្ថភាពវិភាគ បំណិនដោះស្រាយបញ្ហា និងការត្រិះរិះពិចារណា',
              'ត្រៀមលក្ខណៈពេញលេញសម្រាប់ការប្រឡងសញ្ញាបត្រមធ្យមសិក្សាទុតិយភូមិ (បាក់ឌុប)'
            ]
          },
          {
            pageNumber: 2,
            title: 'ទ្រឹស្តីសំខាន់ៗ និងរូបមន្តគោល (Core Theory & Formulas)',
            type: 'theory',
            content: `នៅក្នុងជំពូកទី១ នេះ សិស្សានុសិស្សនឹងសិក្សាស្វែងយល់យ៉ាងស៊ីជម្រៅអំពីនិយមន័យគោល លក្ខណៈសម្បត្តិរូបវន្ត និងគណិតវិទ្យា ព្រមទាំងរូបមន្តគ្រឹះដែលមិនអាចខ្វះបាន។ ការយល់ដឹងពីប្រភពនៃការទាញរូបមន្ត គឺជាគន្លឹះដំបូងក្នុងការដោះស្រាយលំហាត់ស្មុគស្មាញ។`,
            keyPoints: [
              'និយមន័យច្បាស់លាស់នៃធាតុនីមួយៗក្នុងសមីការ',
              'ការផ្ទៀងផ្ទាត់ខ្នាតអន្តរជាតិ (SI Units)',
              'លក្ខខណ្ឌកំណត់ និងដែនសុពលភាពនៃរូបមន្ត'
            ]
          },
          {
            pageNumber: 3,
            title: 'លំហាត់គំរូបាក់ឌុប និងដំណោះស្រាយ (Step-by-Step Problem Solving)',
            type: 'exercise',
            content: `【លំហាត់គំរូថ្នាក់ជាតិ】៖ ចូរបកស្រាយ និងគណនាតម្លៃនៃកន្សោមគណិតវិទ្យា/រូបវិទ្យា ដោយបង្ហាញដំណាក់កាលលម្អិតពីជំហានដំបូងរហូតដល់ចម្លើយចុងក្រោយ។\n\nដំណោះស្រាយគំរូ៖\n១. កំណត់បម្រាប់ដែលប្រធានបានផ្តល់ឱ្យ\n២. សរសេររូបមន្តគន្លឹះដែលត្រូវយកមកអនុវត្ត\n៣. ជំនួសលេខ និងគណនាដោយប្រុងប្រយ័ត្ន\n៤. សន្និដ្ឋានចម្លើយ និងបញ្ជាក់ខ្នាតឱ្យបានត្រឹមត្រូវ ១០០%។`,
            keyPoints: [
              'គន្លឹះសរសេរឱ្យត្រូវតាមកម្រងពិន្ទុរបស់គណៈកម្មការកំណែ',
              'ជៀសវាងកំហុសឆ្គងបូកដកលេខ និងការភ្លេចដាក់ខ្នាត',
              'វិធីសាស្ត្រត្រួតពិនិត្យចម្លើយឡើងវិញមុនពេលបញ្ចប់'
            ]
          },
          {
            pageNumber: 4,
            title: 'លំហាត់ស្វ័យវាយតម្លៃ និងសង្ខេបជំពូក (Self-Assessment & Summary)',
            type: 'summary',
            content: `ចូរអនុវត្តលំហាត់ស្វ័យវាយតម្លៃទាំង ៥ ខាងក្រោមនេះ ដើម្បីវាស់ស្ទង់កម្រិតយល់ដឹងផ្ទាល់ខ្លួនបន្ទាប់ពីបញ្ចប់ជំពូកទី១។ ប្រសិនបើជួបការលំបាក សិស្សអាចពិគ្រោះជាមួយគ្រូ AI Tutor ឬត្រឡប់ទៅមើលទ្រឹស្តីទំព័រមុនៗឡើងវិញ។`,
            keyPoints: [
              'លំហាត់ពង្រឹងចំណេះដឹងកម្រិតមូលដ្ឋាន ៣ លំហាត់',
              'លំហាត់កម្រិតខ្ពស់សម្រាប់សិស្សពូកែ ២ លំហាត់',
              'តារាងផ្ទៀងផ្ទាត់ចម្លើយ និងពិន្ទុស្វ័យវាយតម្លៃ'
            ]
          }
        ]
      }
    ]
  });
});

// 2. Add Special Series to reach over 100 Books
SPECIAL_SERIES.forEach((ser, sIdx) => {
  for (let i = 1; i <= ser.count; i++) {
    const subNames = ['គណិតវិទ្យា', 'រូបវិទ្យា', 'គីមីវិទ្យា', 'ជីវវិទ្យា', 'អក្សរសាស្ត្រខ្មែរ', 'ប្រវត្តិវិទ្យា', 'ភូមិវិទ្យា', 'សីលធម៌-ពលរដ្ឋ'];
    const sub = subNames[(idCounter + i) % subNames.length];
    const grade = (10 + (i % 3)).toString();
    const titleKm = `${ser.prefix} មុខវិជ្ជា${sub} (ភាគ ${i})`;
    const titleEn = `${ser.prefixEn} - ${sub} Vol. ${i}`;
    const coverUrl = COVERS[(idCounter + sIdx + i) % COVERS.length];

    allBooks.push({
      id: `book-series-${idCounter++}`,
      titleKm,
      titleEn,
      grade,
      category: ser.cat,
      author: 'ក្រុមប្រឹក្សាអ្នកនិពន្ធគរុកោសល្យ MoTDAR & MoEYS',
      year: '២០២៤',
      pages: 180 + (i * 12) % 120,
      rating: (4.8 + (i % 3) * 0.1).toFixed(1),
      coverUrl,
      descriptionKm: `ឯកសារជំនួយស្មារតីពិសេស ${titleKm} រៀបចំឡើងដោយក្រុមអ្នកជំនាញអប់រំ ដើម្បីជាមគ្គុទ្ទេសក៍ក្នុងការស្រាវជ្រាវ និងពង្រឹងពុទ្ធិដល់សិស្សានុសិស្សទូទាំងប្រទេស។`,
      descriptionEn: `${titleEn} compiled by expert Cambodian educators for national examination excellence.`,
      chapters: [
        {
          chapterNumber: 1,
          titleKm: `ផ្នែកទី ១៖ គន្លឹះទ្រឹស្តី និងរូបមន្តសង្ខេប ${sub}`,
          titleEn: `Part 1: Key Theoretical Foundations for ${sub}`,
          pages: [
            {
              pageNumber: 1,
              title: 'ទំព័រក្រប និងអារម្ភកថា (Introduction & Guidelines)',
              type: 'intro',
              content: `សូមស្វាគមន៍មកកាន់កម្រងសៀវភៅ ${titleKm}។ ឯកសារនេះត្រូវបានតាក់តែងឡើងដោយដកស្រង់ចេញពីវិញ្ញាសាប្រឡងបាក់ឌុបផ្លូវការជាច្រើនឆ្នាំកន្លងមក រួមផ្សំជាមួយគន្លឹះដោះស្រាយកម្រិតខ្ពស់របស់លោកគ្រូអ្នកគ្រូបង្រៀនសិស្សពូកែទូទាំងប្រទេស។`,
              keyPoints: [
                'វិធីសាស្ត្រគិតរហ័ស និងត្រឹមត្រូវតាមក្បួនខ្នាត',
                'ការបែងចែកកម្រិតលំហាត់ពីងាយទៅស្មុគស្មាញ',
                'ការវិភាគប្រធាន និងគន្លឹះកត់សម្គាល់ចំណុចពិសេស'
              ]
            },
            {
              pageNumber: 2,
              title: 'រូបមន្តសង្ខេប និងគន្លឹះត្រូវចាំ (Formula Cheat Sheet)',
              type: 'theory',
              content: `តារាងសង្ខេបរូបមន្តគ្រឹះ និងរូបមន្តបំប្លែងសម្រាប់មុខវិជ្ជា ${sub}៖ សិស្សត្រូវចងចាំ និងយល់ច្បាស់ពីលក្ខខណ្ឌប្រើប្រាស់រូបមន្តនីមួយៗដើម្បីអនុវត្តបានត្រឹមត្រូវ និងចំណេញពេលវេលាក្នុងបន្ទប់ប្រឡង។`,
              keyPoints: [
                'រូបមន្តសំខាន់ៗដែលតែងតែចេញប្រឡងរៀងរាល់ឆ្នាំ',
                'គន្លឹះចងចាំរូបមន្តតាមបែបតក្កវិជ្ជា និងសញ្ញាសម្គាល់',
                'ការបំលែងសមីការស្មុគស្មាញមកជារាងសាមញ្ញ'
              ]
            },
            {
              pageNumber: 3,
              title: 'វិញ្ញាសាគំរូ និងវិធីសាស្ត្រដោះស្រាយ (Worked Examples)',
              type: 'exercise',
              content: `【វិញ្ញាសាគំរូជ្រើសរើសពិសេស】៖ ចូរវិភាគ និងដោះស្រាយលំហាត់ខាងក្រោមដោយប្រើរូបមន្តគន្លឹះដែលបានសិក្សាខាងលើ។\n\nការណែនាំ៖ ត្រូវពិនិត្យមើលលក្ខខណ្ឌនៃប្រធានជាមុន រួចកំណត់វិធីសាស្ត្រដោះស្រាយដែលខ្លី និងត្រឹមត្រូវបំផុត។`,
              keyPoints: [
                'ការវិភាគប្រធានលំហាត់ជាជំហានៗ',
                'ការបង្ហាញការគណនាយ៉ាងក្បោះក្បាយ',
                'ការទាញសេចក្តីសន្និដ្ឋានចុងក្រោយ'
              ]
            },
            {
              pageNumber: 4,
              title: 'លំហាត់អនុវត្តន៍ និងចម្លើយផ្ទៀងផ្ទាត់ (Practice & Solution Keys)',
              type: 'summary',
              content: `កម្រងលំហាត់អនុវត្តន៍ផ្ទាល់ខ្លួនសម្រាប់ពង្រឹងល្បឿន និងភាពសុក្រឹត។ សូមធ្វើលំហាត់ទាំងនេះដោយកំណត់ម៉ោងដូចនៅក្នុងបន្ទប់ប្រឡងជាក់ស្តែង។`,
              keyPoints: [
                'សំណួរពហុជ្រើសរើស (MCQ) និងសំណួរសរសេរ',
                'គន្លឹះពិនិត្យកំហុស និងការកែតម្រូវចម្លើយ',
                'តារាងពិន្ទុ និងគន្លឹះទទួលបាននិទ្ទេសល្អ'
              ]
            }
          ]
        }
      ]
    });
  }
});

console.log(`\n🎉 Generated Total ${allBooks.length} High-School Digital Library Books!`);

// Save to src/data/libraryBooks.js
const targetFile = path.join(__dirname, 'src', 'data', 'libraryBooks.js');
const fileContent = `// Master National High School Digital Library Registry (${allBooks.length} Books)
export const libraryBooks = ${JSON.stringify(allBooks, null, 2)};
`;

fs.writeFileSync(targetFile, fileContent, 'utf-8');
console.log(`💾 Saved ${allBooks.length} Books to ${targetFile}`);
