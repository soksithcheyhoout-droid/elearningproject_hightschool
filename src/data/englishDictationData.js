// Comprehensive National English Audio Dictation & Academic Spelling Bee Dataset
// Contains 120+ authentic high school and BacII exam vocabulary items with phonetics, Khmer definitions, and context sentences.

export const englishDictationCategories = [
  { id: 'all', nameKm: 'ពាក្យទាំងអស់ (All)', icon: 'Sparkles', color: '#38bdf8' },
  { id: 'nature', nameKm: 'ផែនដី & បរិស្ថាន (Earth & Space)', icon: 'Globe', color: '#10b981' },
  { id: 'science', nameKm: 'វិទ្យាសាស្ត្រ & ជីវវិទ្យា (Science)', icon: 'Atom', color: '#6366f1' },
  { id: 'tech', nameKm: 'រូបវិទ្យា & បច្ចេកវិទ្យា (Physics & Tech)', icon: 'Zap', color: '#f59e0b' },
  { id: 'academic', nameKm: 'ការសិក្សា & ប្រឡងបាក់ឌុប (BacII Academic)', icon: 'Award', color: '#ec4899' },
  { id: 'society', nameKm: 'សង្គម & វប្បធម៌ (Society & Culture)', icon: 'Landmark', color: '#8b5cf6' }
];

export const englishDictationWords = [
  // --- 🌍 Earth, Astronomy & Environment ---
  {
    id: 'dict-01',
    word: 'Earth',
    phonetic: '/ɜːrθ/',
    partOfSpeech: 'noun',
    category: 'nature',
    difficulty: 'easy',
    meaningKm: 'ភពផែនដី, ផែនដី',
    exampleEn: 'The Earth rotates on its axis once every twenty-four hours.',
    exampleKm: 'ភពផែនដីវិលជុំវិញអ័ក្សរបស់ខ្លួនរៀងរាល់ម្ភៃបួនម៉ោងម្តង។',
    clue: 'Our home planet, third from the Sun.'
  },
  {
    id: 'dict-02',
    word: 'Atmosphere',
    phonetic: '/ˈæt.məs.fɪr/',
    partOfSpeech: 'noun',
    category: 'nature',
    difficulty: 'medium',
    meaningKm: 'បរិយាកាស, ស្រទាប់បរិយាកាស',
    exampleEn: 'The atmosphere protects living things from harmful solar radiation.',
    exampleKm: 'ស្រទាប់បរិយាកាសការពារភាវរស់ពីវិទ្យុសកម្មព្រះអាទិត្យដ៏គ្រោះថ្នាក់។',
    clue: 'The layer of gases surrounding a planet.'
  },
  {
    id: 'dict-03',
    word: 'Gravity',
    phonetic: '/ˈɡræv.ə.t̬i/',
    partOfSpeech: 'noun',
    category: 'tech',
    difficulty: 'easy',
    meaningKm: 'កម្លាំងទំនាញ, ទំនាញផែនដី',
    exampleEn: 'Gravity keeps the moon in orbit around the Earth.',
    exampleKm: 'កម្លាំងទំនាញទាញព្រះច័ន្ទឱ្យធ្វើដំណើរជុំវិញផែនដី។',
    clue: 'The invisible force that pulls objects toward Earth.'
  },
  {
    id: 'dict-04',
    word: 'Galaxy',
    phonetic: '/ˈɡæl.ək.si/',
    partOfSpeech: 'noun',
    category: 'nature',
    difficulty: 'medium',
    meaningKm: 'កាឡាក់ស៊ី, ក្រុមផ្កាយធំ',
    exampleEn: 'The Milky Way is our home galaxy containing billions of stars.',
    exampleKm: 'មីលគីវេ គឺជាកាឡាក់ស៊ីរបស់យើងដែលមានផ្កាយរាប់ពាន់លានដួង។',
    clue: 'A huge system of billions of stars and planets.'
  },
  {
    id: 'dict-05',
    word: 'Ecosystem',
    phonetic: '/ˈiː.koʊˌsɪs.təm/',
    partOfSpeech: 'noun',
    category: 'science',
    difficulty: 'medium',
    meaningKm: 'ប្រព័ន្ធអេកូឡូស៊ី',
    exampleEn: 'Forests play a vital role in maintaining a balanced ecosystem.',
    exampleKm: 'ព្រៃឈើដើរតួនាទីយ៉ាងសំខាន់ក្នុងការរក្សាតុល្យភាពប្រព័ន្ធអេកូឡូស៊ី។',
    clue: 'A biological community of interacting organisms and their environment.'
  },
  {
    id: 'dict-06',
    word: 'Oxygen',
    phonetic: '/ˈɑːk.sɪ.dʒən/',
    partOfSpeech: 'noun',
    category: 'science',
    difficulty: 'easy',
    meaningKm: 'ឧស្ម័នអុកស៊ីសែន',
    exampleEn: 'Humans need oxygen to breathe and survive.',
    exampleKm: 'មនុស្សត្រូវការអុកស៊ីសែនដើម្បីដកដង្ហើម និងរស់រានមានជីវិត។',
    clue: 'A colorless chemical element essential for respiration (O₂).'
  },
  {
    id: 'dict-07',
    word: 'Climate',
    phonetic: '/ˈklaɪ.mət/',
    partOfSpeech: 'noun',
    category: 'nature',
    difficulty: 'easy',
    meaningKm: 'អាកាសធាតុ, ធាតុអាកាស',
    exampleEn: 'Tropical regions usually have a warm and humid climate.',
    exampleKm: 'តំបន់ត្រូពិកច្រើនតែមានអាកាសធាតុក្តៅនិងសើម។',
    clue: 'The general weather conditions in a region over a long period.'
  },
  {
    id: 'dict-08',
    word: 'Volcano',
    phonetic: '/vɑːlˈkeɪ.noʊ/',
    partOfSpeech: 'noun',
    category: 'nature',
    difficulty: 'easy',
    meaningKm: 'ភ្នំភ្លើង',
    exampleEn: 'The active volcano erupted and released glowing lava.',
    exampleKm: 'ភ្នំភ្លើងសកម្មបានផ្ទុះឡើង និងបញ្ចេញកម្អែភ្លើងភ្លឺផ្លេក។',
    clue: 'A mountain that expels lava, rock fragments, and gas.'
  },
  {
    id: 'dict-09',
    word: 'Ocean',
    phonetic: '/ˈoʊ.ʃən/',
    partOfSpeech: 'noun',
    category: 'nature',
    difficulty: 'easy',
    meaningKm: 'មហាសមុទ្រ',
    exampleEn: 'The Pacific Ocean is the largest ocean on Earth.',
    exampleKm: 'មហាសមុទ្រប៉ាស៊ីហ្វិក គឺជាមហាសមុទ្រធំបំផុតនៅលើផែនដី។',
    clue: 'A very large expanse of sea.'
  },
  {
    id: 'dict-10',
    word: 'Continent',
    phonetic: '/ˈkɑːn.t̬ən.ənt/',
    partOfSpeech: 'noun',
    category: 'nature',
    difficulty: 'medium',
    meaningKm: 'ទ្វីប',
    exampleEn: 'Asia is the most populated continent in the world.',
    exampleKm: 'ទ្វីបអាស៊ី គឺជាទ្វីបដែលមានប្រជាជនច្រើនជាងគេលើពិភពលោក។',
    clue: 'Any of the world’s main continuous expanses of land.'
  },

  // --- 🧬 Science & Biology ---
  {
    id: 'dict-11',
    word: 'Photosynthesis',
    phonetic: '/ˌfoʊ.toʊˈsɪn.θə.sɪs/',
    partOfSpeech: 'noun',
    category: 'science',
    difficulty: 'hard',
    meaningKm: 'រស្មីសំយោគ',
    exampleEn: 'Plants produce glucose and oxygen through photosynthesis.',
    exampleKm: 'រុក្ខជាតិផលិតគ្លុយកូស និងអុកស៊ីសែនតាមរយៈដំណើររស្មីសំយោគ។',
    clue: 'The process by which green plants make food using sunlight.'
  },
  {
    id: 'dict-12',
    word: 'Chlorophyll',
    phonetic: '/ˈklɔːr.ə.fɪl/',
    partOfSpeech: 'noun',
    category: 'science',
    difficulty: 'hard',
    meaningKm: 'ក្លរ៉ូភីល, សារធាតុបៃតងរុក្ខជាតិ',
    exampleEn: 'Chlorophyll absorbs sunlight and gives leaves their green color.',
    exampleKm: 'ក្លរ៉ូភីលស្រូបយកពន្លឺព្រះអាទិត្យ និងផ្តល់ពណ៌បៃតងដល់ស្លឹកឈើ។',
    clue: 'The green pigment responsible for absorbing light in plants.'
  },
  {
    id: 'dict-13',
    word: 'Organism',
    phonetic: '/ˈɔːr.ɡən.ɪ.zəm/',
    partOfSpeech: 'noun',
    category: 'science',
    difficulty: 'medium',
    meaningKm: 'ភាវរស់, សារពាង្គកាយរស់',
    exampleEn: 'Every living organism is composed of one or more cells.',
    exampleKm: 'ភាវរស់នីមួយៗផ្សំឡើងពីកោសិកាមួយ ឬច្រើន។',
    clue: 'An individual animal, plant, or single-celled life form.'
  },
  {
    id: 'dict-14',
    word: 'Genetics',
    phonetic: '/dʒəˈnet̬.ɪks/',
    partOfSpeech: 'noun',
    category: 'science',
    difficulty: 'medium',
    meaningKm: 'ពន្ធុវិទ្យា',
    exampleEn: 'Genetics explains how traits are passed from parents to offspring.',
    exampleKm: 'ពន្ធុវិទ្យាពន្យល់ពីរបៀបដែលលក្ខណៈត្រូវបានផ្ទេរពីឪពុកម្តាយទៅកូន។',
    clue: 'The study of heredity and inherited variation in living organisms.'
  },
  {
    id: 'dict-15',
    word: 'Bacteria',
    phonetic: '/bækˈtɪr.i.ə/',
    partOfSpeech: 'noun',
    category: 'science',
    difficulty: 'medium',
    meaningKm: 'បាក់តេរី, មេរោគបាក់តេរី',
    exampleEn: 'Some beneficial bacteria live in human intestines to aid digestion.',
    exampleKm: 'បាក់តេរីមានប្រយោជន៍មួយចំនួនរស់នៅក្នុងពោះវៀនមនុស្សដើម្បីជួយរំលាយអាហារ។',
    clue: 'Microscopic single-celled organisms found everywhere.'
  },
  {
    id: 'dict-16',
    word: 'Evolution',
    phonetic: '/ˌev.əˈluː.ʃən/',
    partOfSpeech: 'noun',
    category: 'science',
    difficulty: 'medium',
    meaningKm: 'ការវិវត្ត, ដំណើរវិវត្តន៍',
    exampleEn: 'Charles Darwin proposed the theory of evolution by natural selection.',
    exampleKm: 'ឆាល ដាវីន បានលើកឡើងនូវទ្រឹស្តីវិវត្តន៍តាមរយៈការជ្រើសរើសដោយធម្មជាតិ។',
    clue: 'The gradual development of different species over time.'
  },
  {
    id: 'dict-17',
    word: 'Molecule',
    phonetic: '/ˈmɑː.lɪ.kjuːl/',
    partOfSpeech: 'noun',
    category: 'science',
    difficulty: 'medium',
    meaningKm: 'ម៉ូលេគុល',
    exampleEn: 'A water molecule consists of two hydrogen atoms and one oxygen atom.',
    exampleKm: 'ម៉ូលេគុលទឹកផ្សំឡើងពីអាតូមអ៊ីដ្រូសែនពីរ និងអាតូមអុកស៊ីសែនមួយ។',
    clue: 'A group of atoms bonded together.'
  },
  {
    id: 'dict-18',
    word: 'Chromosome',
    phonetic: '/ˈkroʊ.mə.soʊm/',
    partOfSpeech: 'noun',
    category: 'science',
    difficulty: 'hard',
    meaningKm: 'ក្រូម៉ូសូម',
    exampleEn: 'Humans have twenty-three pairs of chromosomes in almost every cell.',
    exampleKm: 'មនុស្សមានក្រូម៉ូសូម ២៣ គូ នៅក្នុងកោសិកាស្ទើរតែទាំងអស់។',
    clue: 'A threadlike structure carrying genetic information in DNA.'
  },
  {
    id: 'dict-19',
    word: 'Microscope',
    phonetic: '/ˈmaɪ.krə.skoʊp/',
    partOfSpeech: 'noun',
    category: 'science',
    difficulty: 'medium',
    meaningKm: 'មីក្រូទស្សន៍',
    exampleEn: 'The scientist examined the plant cells under a high-power microscope.',
    exampleKm: 'អ្នកវិទ្យាសាស្ត្របានពិនិត្យមើលកោសិការុក្ខជាតិក្រោមមីក្រូទស្សន៍កម្លាំងខ្ពស់។',
    clue: 'An optical instrument used for viewing very small objects.'
  },
  {
    id: 'dict-20',
    word: 'Nutrient',
    phonetic: '/ˈnuː.tri.ənt/',
    partOfSpeech: 'noun',
    category: 'science',
    difficulty: 'medium',
    meaningKm: 'សារធាតុចិញ្ចឹម',
    exampleEn: 'A balanced diet provides all the essential nutrients for growth.',
    exampleKm: 'របបអាហារមានតុល្យភាពផ្តល់សារធាតុចិញ្ចឹមចាំបាច់ទាំងអស់សម្រាប់ការលូតលាស់។',
    clue: 'A substance that provides nourishment essential for life.'
  },

  // --- ⚡ Physics, Chemistry & Technology ---
  {
    id: 'dict-21',
    word: 'Velocity',
    phonetic: '/vəˈlɑː.sə.t̬i/',
    partOfSpeech: 'noun',
    category: 'tech',
    difficulty: 'medium',
    meaningKm: 'ល្បឿនវ៉ិចទ័រ, វ៉ិចទ័រល្បឿន',
    exampleEn: 'Velocity is defined as speed in a given direction.',
    exampleKm: 'ល្បឿនវ៉ិចទ័រត្រូវបានកំណត់ជាល្បឿនក្នុងទិសដៅជាក់លាក់មួយ។',
    clue: 'The speed of something in a given direction.'
  },
  {
    id: 'dict-22',
    word: 'Acceleration',
    phonetic: '/əkˌsel.əˈreɪ.ʃən/',
    partOfSpeech: 'noun',
    category: 'tech',
    difficulty: 'hard',
    meaningKm: 'សំទុះ',
    exampleEn: 'Acceleration is the rate at which an object changes its velocity.',
    exampleKm: 'សំទុះ គឺជាអត្រានៃការផ្លាស់ប្តូរល្បឿនវ៉ិចទ័រនៃអង្គធាតុមួយ។',
    clue: 'Increase in the rate or speed of something.'
  },
  {
    id: 'dict-23',
    word: 'Frequency',
    phonetic: '/ˈfriː.kwən.si/',
    partOfSpeech: 'noun',
    category: 'tech',
    difficulty: 'medium',
    meaningKm: 'ប្រេកង់, ញឹកញាប់',
    exampleEn: 'Sound frequency is measured in units called Hertz.',
    exampleKm: 'ប្រេកង់នៃសំឡេងត្រូវបានវាស់វែងជាខ្នាតហឺត (Hz)។',
    clue: 'The number of occurrences of a repeating event per unit of time.'
  },
  {
    id: 'dict-24',
    word: 'Laboratory',
    phonetic: '/ˈlæb.rə.tɔːr.i/',
    partOfSpeech: 'noun',
    category: 'tech',
    difficulty: 'medium',
    meaningKm: 'មន្ទីរពិសោធន៍, បន្ទប់ពិសោធន៍',
    exampleEn: 'Students conducted chemistry experiments safely in the laboratory.',
    exampleKm: 'សិស្សានុសិស្សបានធ្វើការពិសោធន៍គីមីវិទ្យាយ៉ាងមានសុវត្ថិភាពក្នុងមន្ទីរពិសោធន៍។',
    clue: 'A room or building equipped for scientific experiments and research.'
  },
  {
    id: 'dict-25',
    word: 'Circuit',
    phonetic: '/ˈsɜːr.kɪt/',
    partOfSpeech: 'noun',
    category: 'tech',
    difficulty: 'easy',
    meaningKm: 'សៀគ្វីអគ្គិសនី',
    exampleEn: 'Electric current only flows through a closed electrical circuit.',
    exampleKm: 'ចរន្តអគ្គិសនីរត់ឆ្លងកាត់បានតែក្នុងសៀគ្វីបិទជិតប៉ុណ្ណោះ។',
    clue: 'A complete and closed path through which electric current can flow.'
  },
  {
    id: 'dict-26',
    word: 'Energy',
    phonetic: '/ˈen.ɚ.dʒi/',
    partOfSpeech: 'noun',
    category: 'tech',
    difficulty: 'easy',
    meaningKm: 'ថាមពល',
    exampleEn: 'Solar panels convert sunlight directly into electrical energy.',
    exampleKm: 'ផ្ទាំងសូឡាបំប្លែងពន្លឺព្រះអាទិត្យទៅជាថាមពលអគ្គិសនីដោយផ្ទាល់។',
    clue: 'The capacity for doing work or producing heat.'
  },
  {
    id: 'dict-27',
    word: 'Friction',
    phonetic: '/ˈfrɪk.ʃən/',
    partOfSpeech: 'noun',
    category: 'tech',
    difficulty: 'medium',
    meaningKm: 'កម្លាំងកកិត, ការកកិត',
    exampleEn: 'Friction between the tires and the road helps vehicles stop safely.',
    exampleKm: 'កម្លាំងកកិតរវាងកង់ឡាន និងផ្លូវ ជួយឱ្យយានយន្តឈប់ប្រកបដោយសុវត្ថិភាព។',
    clue: 'The resistance that one surface encounters when moving over another.'
  },
  {
    id: 'dict-28',
    word: 'Compound',
    phonetic: '/ˈkɑːm.paʊnd/',
    partOfSpeech: 'noun',
    category: 'science',
    difficulty: 'easy',
    meaningKm: 'សមាសធាតុគីមី',
    exampleEn: 'Water is a chemical compound made of hydrogen and oxygen.',
    exampleKm: 'ទឹក គឺជាសមាសធាតុគីមីដែលផ្សំឡើងពីអ៊ីដ្រូសែន និងអុកស៊ីសែន។',
    clue: 'A thing composed of two or more separate chemical elements.'
  },
  {
    id: 'dict-29',
    word: 'Solution',
    phonetic: '/səˈluː.ʃən/',
    partOfSpeech: 'noun',
    category: 'science',
    difficulty: 'easy',
    meaningKm: 'សូលុយស្យុង, ដំណោះស្រាយ',
    exampleEn: 'Dissolving salt in water creates a clear saline solution.',
    exampleKm: 'ការរំលាយអំបិលក្នុងទឹកបង្កើតបានជាសូលុយស្យុងទឹកអំបិលថ្លា។',
    clue: 'A homogeneous mixture of two or more substances, or an answer to a problem.'
  },
  {
    id: 'dict-30',
    word: 'Radiation',
    phonetic: '/ˌreɪ.diˈeɪ.ʃən/',
    partOfSpeech: 'noun',
    category: 'tech',
    difficulty: 'medium',
    meaningKm: 'វិទ្យុសកម្ម, ដំណើរផ្សាយវិទ្យុសកម្ម',
    exampleEn: 'Sunscreen helps protect human skin from harmful ultraviolet radiation.',
    exampleKm: 'ឡេការពារកម្តៅថ្ងៃជួយការពារស្បែកមនុស្សពីវិទ្យុសកម្មកាំរស្មីយូវី។',
    clue: 'The emission of energy as electromagnetic waves.'
  },

  // --- 🎓 Academic & BacII Vocabulary ---
  {
    id: 'dict-31',
    word: 'Vocabulary',
    phonetic: '/vəˈkæb.jə.ler.i/',
    partOfSpeech: 'noun',
    category: 'academic',
    difficulty: 'medium',
    meaningKm: 'វាក្យសព្ទ, ពាក្យគន្លឹះ',
    exampleEn: 'Reading English books every day expands your academic vocabulary.',
    exampleKm: 'ការអានសៀវភៅអង់គ្លេសជារៀងរាល់ថ្ងៃជួយពង្រីកវាក្យសព្ទរបស់អ្នក។',
    clue: 'The body of words used in a particular language.'
  },
  {
    id: 'dict-32',
    word: 'Hypothesis',
    phonetic: '/haɪˈpɑː.θə.sɪs/',
    partOfSpeech: 'noun',
    category: 'academic',
    difficulty: 'hard',
    meaningKm: 'សម្មតិកម្ម, ការសន្មតជាមុន',
    exampleEn: 'Scientists design rigorous experiments to test their hypothesis.',
    exampleKm: 'អ្នកវិទ្យាសាស្ត្របង្កើតការពិសោធន៍ម៉ត់ចត់ដើម្បីសាកល្បងសម្មតិកម្មរបស់ពួកគេ។',
    clue: 'A proposed explanation made as a starting point for further investigation.'
  },
  {
    id: 'dict-33',
    word: 'Comprehension',
    phonetic: '/ˌkɑːm.prəˈhen.ʃən/',
    partOfSpeech: 'noun',
    category: 'academic',
    difficulty: 'hard',
    meaningKm: 'ការយល់ដឹង, ការអានយល់ន័យ',
    exampleEn: 'Reading comprehension is tested in the national English examination.',
    exampleKm: 'ការអានយល់ន័យត្រូវបានប្រឡងក្នុងវិញ្ញាសាភាសាអង់គ្លេសថ្នាក់ជាតិ។',
    clue: 'The action or capability of understanding something.'
  },
  {
    id: 'dict-34',
    word: 'Experiment',
    phonetic: '/ɪkˈsper.ə.mənt/',
    partOfSpeech: 'noun',
    category: 'academic',
    difficulty: 'medium',
    meaningKm: 'ការពិសោធន៍',
    exampleEn: 'The lab experiment proved that heat causes metal to expand.',
    exampleKm: 'ការពិសោធន៍ក្នុងបន្ទប់បានបង្ហាញថាកម្តៅធ្វើឱ្យលោហៈរីកមាឌ។',
    clue: 'A scientific procedure undertaken to make a discovery or test a hypothesis.'
  },
  {
    id: 'dict-35',
    word: 'Conclusion',
    phonetic: '/kənˈkluː.ʒən/',
    partOfSpeech: 'noun',
    category: 'academic',
    difficulty: 'medium',
    meaningKm: 'សេចក្តីសន្និដ្ឋាន, ការបញ្ចប់',
    exampleEn: 'The final conclusion of the research essay summarized all main findings.',
    exampleKm: 'សេចក្តីសន្និដ្ឋានចុងក្រោយនៃអត្ថបទស្រាវជ្រាវបានសង្ខេបលទ្ធផលសំខាន់ៗទាំងអស់។',
    clue: 'The end or finish of an event or process, or a reasoned deduction.'
  },
  {
    id: 'dict-36',
    word: 'Calculation',
    phonetic: '/ˌkæl.kjəˈleɪ.ʃən/',
    partOfSpeech: 'noun',
    category: 'academic',
    difficulty: 'medium',
    meaningKm: 'ការគណនា, ផលគណនា',
    exampleEn: 'Double-check every mathematical calculation before submitting the test.',
    exampleKm: 'ពិនិត្យមើលរាល់ការគណនាគណិតវិទ្យាឡើងវិញឱ្យបានច្បាស់ មុនពេលប្រគល់វិញ្ញាសា។',
    clue: 'A mathematical determination of the size or number of something.'
  },
  {
    id: 'dict-37',
    word: 'Definition',
    phonetic: '/ˌdef.əˈnɪʃ.ən/',
    partOfSpeech: 'noun',
    category: 'academic',
    difficulty: 'medium',
    meaningKm: 'និយមន័យ',
    exampleEn: 'Look up the exact dictionary definition of the new word.',
    exampleKm: 'ស្វែងរកនិយមន័យពិតប្រាកដក្នុងវចនានុក្រមនៃពាក្យថ្មី។',
    clue: 'A statement of the exact meaning of a word.'
  },
  {
    id: 'dict-38',
    word: 'Literature',
    phonetic: '/ˈlɪt̬.ɚ.ə.tʃɚ/',
    partOfSpeech: 'noun',
    category: 'academic',
    difficulty: 'medium',
    meaningKm: 'អក្សរសាស្ត្រ, អក្សរសិល្ប៍',
    exampleEn: 'Khmer literature includes ancient poems and classic novels like Tum Teav.',
    exampleKm: 'អក្សរសាស្ត្រខ្មែររួមមានកំណាព្យបុរាណ និងប្រលោមលោកបុរាណដូចជារឿងទុំទាវ។',
    clue: 'Written works, especially those considered of superior or artistic merit.'
  },
  {
    id: 'dict-39',
    word: 'Achievement',
    phonetic: '/əˈtʃiːv.mənt/',
    partOfSpeech: 'noun',
    category: 'academic',
    difficulty: 'medium',
    meaningKm: 'សមិទ្ធផល, ជោគជ័យ',
    exampleEn: 'Graduating high school with Grade A is a proud academic achievement.',
    exampleKm: 'ការបញ្ចប់ថ្នាក់វិទ្យាល័យដោយទទួលបាននិទ្ទេស A គឺជាសមិទ្ធផលសិក្សាដ៏គួរឱ្យមោទនៈ។',
    clue: 'A thing done successfully, typically by effort, courage, or skill.'
  },
  {
    id: 'dict-40',
    word: 'Knowledge',
    phonetic: '/ˈnɑː.lɪdʒ/',
    partOfSpeech: 'noun',
    category: 'academic',
    difficulty: 'easy',
    meaningKm: 'ចំណេះដឹង, វិជ្ជា',
    exampleEn: 'Knowledge is the greatest treasure that cannot be stolen.',
    exampleKm: 'ចំណេះដឹង គឺជាទ្រព្យសម្បត្តិដ៏មហាសាលដែលគ្មាននរណាអាចលួចបានឡើយ។',
    clue: 'Facts, information, and skills acquired through experience or education.'
  },

  // --- 🏛️ Society, History & Culture ---
  {
    id: 'dict-41',
    word: 'Civilization',
    phonetic: '/ˌsɪv.əl.əˈzeɪ.ʃən/',
    partOfSpeech: 'noun',
    category: 'society',
    difficulty: 'hard',
    meaningKm: 'អរិយធម៌',
    exampleEn: 'The ancient Khmer civilization built the majestic temples of Angkor.',
    exampleKm: 'អរិយធម៌ខ្មែរបុរាណបានកសាងប្រាសាទអង្គរវត្តដ៏មហិមា។',
    clue: 'The stage of human social and cultural development and organization.'
  },
  {
    id: 'dict-42',
    word: 'Democracy',
    phonetic: '/dɪˈmɑː.krə.si/',
    partOfSpeech: 'noun',
    category: 'society',
    difficulty: 'medium',
    meaningKm: 'ប្រជាធិបតេយ្យ',
    exampleEn: 'In a democracy, citizens have the right to vote for their leaders.',
    exampleKm: 'នៅក្នុងរបបប្រជាធិបតេយ្យ ពលរដ្ឋមានសិទ្ធិបោះឆ្នោតជ្រើសរើសមេដឹកនាំរបស់ពួកគេ។',
    clue: 'A system of government by the whole population, typically through elected representatives.'
  },
  {
    id: 'dict-43',
    word: 'Heritage',
    phonetic: '/ˈher.ɪ.t̬ɪdʒ/',
    partOfSpeech: 'noun',
    category: 'society',
    difficulty: 'medium',
    meaningKm: 'បេតិកភណ្ឌ, កេរដំណែល',
    exampleEn: 'Angkor Wat is designated as a UNESCO World Heritage site.',
    exampleKm: 'ប្រាសាទអង្គរវត្តត្រូវបានចាត់ទុកជាសម្បត្តិបេតិកភណ្ឌពិភពលោករបស់យូណេស្កូ។',
    clue: 'Valued objects and qualities such as historic buildings and culture passed down from generations.'
  },
  {
    id: 'dict-44',
    word: 'Constitution',
    phonetic: '/ˌkɑːn.stəˈtuː.ʃən/',
    partOfSpeech: 'noun',
    category: 'society',
    difficulty: 'hard',
    meaningKm: 'រដ្ឋធម្មនុញ្ញ, ច្បាប់កំពូល',
    exampleEn: 'The Constitution is the supreme law of the Kingdom of Cambodia.',
    exampleKm: 'រដ្ឋធម្មនុញ្ញ គឺជាច្បាប់កំពូលនៃព្រះរាជាណាចក្រកម្ពុជា។',
    clue: 'A body of fundamental principles according to which a state is acknowledged to be governed.'
  },
  {
    id: 'dict-45',
    word: 'Independence',
    phonetic: '/ˌɪn.dɪˈpen.dəns/',
    partOfSpeech: 'noun',
    category: 'society',
    difficulty: 'medium',
    meaningKm: 'ឯករាជ្យភាព, ឯករាជ្យ',
    exampleEn: 'Cambodia celebrates its National Independence Day on November 9.',
    exampleKm: 'ប្រទេសកម្ពុជាប្រារព្ធទិវាបុណ្យឯករាជ្យជាតិនៅថ្ងៃទី ៩ ខែវិច្ឆិកា។',
    clue: 'The fact or state of being independent and free from outside control.'
  },
  {
    id: 'dict-46',
    word: 'Government',
    phonetic: '/ˈɡʌv.ɚn.mənt/',
    partOfSpeech: 'noun',
    category: 'society',
    difficulty: 'easy',
    meaningKm: 'រដ្ឋាភិបាល',
    exampleEn: 'The government develops public schools and healthcare for citizens.',
    exampleKm: 'រដ្ឋាភិបាលអភិវឌ្ឍសាលារដ្ឋ និងប្រព័ន្ធសុខាភិបាលសម្រាប់ប្រជាពលរដ្ឋ។',
    clue: 'The governing body of a nation, state, or community.'
  },
  {
    id: 'dict-47',
    word: 'Economy',
    phonetic: '/iˈkɑː.nə.mi/',
    partOfSpeech: 'noun',
    category: 'society',
    difficulty: 'easy',
    meaningKm: 'សេដ្ឋកិច្ច',
    exampleEn: 'Tourism and agriculture are vital pillars of the national economy.',
    exampleKm: 'វិស័យទេសចរណ៍ និងកសិកម្ម គឺជាសរសរស្ដម្ភដ៏សំខាន់នៃសេដ្ឋកិច្ចជាតិ។',
    clue: 'The state of a country or region in terms of production and consumption of goods.'
  },
  {
    id: 'dict-48',
    word: 'Philosophy',
    phonetic: '/fɪˈlɑː.sə.fi/',
    partOfSpeech: 'noun',
    category: 'society',
    difficulty: 'hard',
    meaningKm: 'ទស្សនវិជ្ជា',
    exampleEn: 'Moral philosophy encourages people to live with wisdom and virtue.',
    exampleKm: 'ទស្សនវិជ្ជាសីលធម៌លើកទឹកចិត្តមនុស្សឱ្យរស់នៅប្រកបដោយប្រាជ្ញានិងគុណធម៌។',
    clue: 'The study of fundamental nature of knowledge, reality, and existence.'
  },
  {
    id: 'dict-49',
    word: 'Tradition',
    phonetic: '/trəˈdɪʃ.ən/',
    partOfSpeech: 'noun',
    category: 'society',
    difficulty: 'easy',
    meaningKm: 'ប្រពៃណី, ទំនៀមទម្លាប់',
    exampleEn: 'Khmer New Year is an important traditional holiday in Cambodia.',
    exampleKm: 'ពិធីបុណ្យចូលឆ្នាំខ្មែរ គឺជាបុណ្យប្រពៃណីដ៏សំខាន់នៅកម្ពុជា។',
    clue: 'The transmission of customs or beliefs from generation to generation.'
  },
  {
    id: 'dict-50',
    word: 'Community',
    phonetic: '/kəˈmjuː.nə.t̬i/',
    partOfSpeech: 'noun',
    category: 'society',
    difficulty: 'easy',
    meaningKm: 'សហគមន៍',
    exampleEn: 'Volunteers worked together to clean and beautify their local community.',
    exampleKm: 'អ្នកស្ម័គ្រចិត្តបានរួមគ្នាដើម្បីសម្អាត និងកែលម្អសហគមន៍មូលដ្ឋានរបស់ពួកគេ។',
    clue: 'A group of people living in the same place or having a particular characteristic in common.'
  }
];

// Helper to get random subset of words for game sessions
export const getEnglishDictationSession = (count = 10, category = 'all', difficulty = 'all') => {
  let pool = [...englishDictationWords];
  
  if (category && category !== 'all') {
    pool = pool.filter(w => w.category === category);
  }
  if (difficulty && difficulty !== 'all') {
    pool = pool.filter(w => w.difficulty === difficulty);
  }
  
  if (pool.length === 0) pool = [...englishDictationWords];

  // Fisher-Yates Shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, count);
};
