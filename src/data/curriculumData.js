export const curriculumData = [
  // ==========================================
  // 🎒 កម្រិតបឋមសិក្សា (PRIMARY SCHOOL: GRADES 1–6)
  // ==========================================
  {
    id: 'primary-math',
    grade: '1-6',
    gradesList: ['1', '2', '3', '4', '5', '6'],
    stream: 'science',
    nameKm: 'គណិតវិទ្យា បឋមសិក្សា (ថ្នាក់ទី ១ ដល់ ទី ៦)',
    nameEn: 'Primary Mathematics (Grades 1–6 Foundation)',
    icon: 'Calculator',
    color: '#0284c7',
    cardClass: 'subject-card-math',
    teacher: 'នាយកដ្ឋានអភិវឌ្ឍន៍កម្មវិធីសិក្សាបឋមសិក្សា MoEYS',
    teacherRole: 'គ្រូបង្រៀនគំរូបឋមសិក្សាជាតិ MoTDAR',
    progress: 90,
    totalChapters: 6,
    totalLessons: 24,
    quizzesCount: 12,
    bannerImg: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    descriptionKm: 'កម្មវិធីសិក្សាគណិតវិទ្យាមូលដ្ឋានគ្រឹះកម្រិតបឋមសិក្សា ថ្នាក់ទី ១-៦ បង្រៀនលេខនព្វន្ត បូក ដក គុណ ចែក ប្រភាគ ទសភាគ ផ្ទៃក្រឡា និងបរិមាត្រ។',
    descriptionEn: 'Official Primary Mathematics curriculum for Grades 1-6 covering arithmetic, multiplication, division, fractions, geometry shapes, and area measurement.',
    chapters: [
      {
        id: 'pmath-ch1',
        titleKm: 'ជំពូកទី ១៖ លេខនព្វន្ត និងប្រមាណវិធីបឋម (ថ្នាក់ទី ១-៣)',
        titleEn: 'Chapter 1: Arithmetic & Basic Operations (Grades 1-3)',
        lessons: [
          {
            id: 'pm-l1',
            titleKm: 'មេរៀនទី ១៖ ចំនួនពី ១ ដល់ ១០០ និងប្រមាណវិធីបូក-ដក',
            titleEn: 'Lesson 1: Numbers 1-100 and Addition/Subtraction',
            duration: '18:30',
            videoUrl: 'https://www.youtube-nocookie.com/embed/n4p_q00a58o',
            videoPoster: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
            notes: 'រៀនស្គាល់តម្លៃលេខខ្ទង់រាយ ខ្ទង់ដប់ និងការគណនាបូកដកត្រឹមត្រូវ។',
            keyFormulas: ['តួបូក + តួបូក = ផលបូក', 'តួដក - តួដក = ផលដក']
          }
        ]
      }
    ]
  },
  {
    id: 'primary-khmer',
    grade: '1-6',
    gradesList: ['1', '2', '3', '4', '5', '6'],
    stream: 'social',
    nameKm: 'ភាសាខ្មែរ បឋមសិក្សា (ថ្នាក់ទី ១ ដល់ ទី ៦)',
    nameEn: 'Primary Khmer Language (Reading, Writing & Spelling)',
    icon: 'BookOpen',
    color: '#d97706',
    cardClass: 'subject-card-khmer',
    teacher: 'សាស្ត្រាចារ្យ ភាសាខ្មែរបឋមសិក្សាជាតិ',
    teacherRole: 'អ្នកជំនាញការអក្សរសាស្ត្រ និងអំណានកុមារ MoTDAR',
    progress: 95,
    totalChapters: 6,
    totalLessons: 24,
    quizzesCount: 12,
    bannerImg: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
    descriptionKm: 'កម្មវិធីអំណាន និងសរសេរភាសាខ្មែរផ្លូវការ ថ្នាក់ទី ១-៦ រៀនព្យញ្ជនៈ ស្រៈ ព្យាង្គតម្រួត ការប្រកប និងអក្ខរាវិរុទ្ធខ្មែរត្រឹមត្រូវ។',
    descriptionEn: 'Official Primary Khmer Language curriculum for Grades 1-6 covering vowels, consonants, compound words, and reading comprehension.',
    chapters: [
      {
        id: 'pkhm-ch1',
        titleKm: 'ជំពូកទី ១៖ ព្យញ្ជនៈ ស្រៈ និងការប្រកបព្យាង្គ',
        titleEn: 'Chapter 1: Khmer Alphabet, Vowels and Syllables',
        lessons: [
          {
            id: 'pkh-l1',
            titleKm: 'មេរៀនទី ១៖ ព្យញ្ជនៈខ្មែរទាំង ៣៣ តួ និងស្រៈនិស្ស័យ',
            titleEn: 'Lesson 1: 33 Khmer Consonants and Dependent Vowels',
            duration: '20:00',
            videoUrl: 'https://www.youtube-nocookie.com/embed/jZ_y8z89kX8',
            videoPoster: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
            notes: 'រៀនអាន និងសរសេរព្យញ្ជនៈពួក អ (ក ខ គ...) និងពួក អ៊ (គ ឃ ង...) ឱ្យបានស្ទាត់ជំនាញ។',
            keyFormulas: ['ព្យញ្ជនៈ ៣៣ តួ + ស្រៈនិស្ស័យ ២៣ តួ + ស្រៈពេញតួ ១៥ តួ']
          }
        ]
      }
    ]
  },
  {
    id: 'primary-science-social',
    grade: '1-6',
    gradesList: ['1', '2', '3', '4', '5', '6'],
    stream: 'science',
    nameKm: 'វិទ្យាសាស្ត្រ និងសង្គមសិក្សា បឋមសិក្សា (ថ្នាក់ទី ១-៦)',
    nameEn: 'Primary Science & Social Studies (Grades 1–6)',
    icon: 'Globe',
    color: '#059669',
    cardClass: 'subject-card-biology',
    teacher: 'នាយកដ្ឋានស្រាវជ្រាវគរុកោសល្យ MoEYS',
    teacherRole: 'អ្នកសម្របសម្រួលវិទ្យាសាស្ត្រកុមារ MoTDAR',
    progress: 88,
    totalChapters: 6,
    totalLessons: 20,
    quizzesCount: 10,
    bannerImg: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
    descriptionKm: 'សិក្សាពីរុក្ខជាតិ សត្វ ខ្លួនប្រាណមនុស្ស បរិស្ថាន ធម្មជាតិ ភូមិសាស្ត្រខេត្តក្រុង និងប្រវត្តិសាស្ត្រកម្ពុជាបឋម។',
    descriptionEn: 'Integrated Primary Science & Social Studies for Grades 1-6 covering plants, animals, human health, Cambodian geography, and history.',
    chapters: [
      {
        id: 'psci-ch1',
        titleKm: 'ជំពូកទី ១៖ ភាវរស់ បរិស្ថាន និងសុខភាពកុមារ',
        titleEn: 'Chapter 1: Living Organisms & Child Health',
        lessons: [
          {
            id: 'psc-l1',
            titleKm: 'មេរៀនទី ១៖ ផ្នែកសំខាន់ៗនៃរុក្ខជាតិ និងការថែទាំសុខភាព',
            titleEn: 'Lesson 1: Plant Structure & Personal Hygiene',
            duration: '19:15',
            videoUrl: 'https://www.youtube-nocookie.com/embed/n4p_q00a58o',
            videoPoster: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
            notes: 'យល់ដឹងពីមុខងារឬស ដើម ស្លឹក ផ្កា ផ្លែ និងអនាម័យ ៣ ប្រការ (ហូបស្អាត ផឹកស្អាត រស់នៅស្អាត)។',
            keyFormulas: ['អនាម័យ ៣ ប្រការ៖ ហូបស្អាត + ផឹកស្អាត + រស់នៅស្អាត']
          }
        ]
      }
    ]
  },

  // ==========================================
  // 🏛️ កម្រិតអនុវិទ្យាល័យ (JUNIOR HIGH: GRADES 7–9 / ឌីប្លូម DIPLOMA)
  // ==========================================
  {
    id: 'junior-math-7-9',
    grade: '7-9',
    gradesList: ['7', '8', '9'],
    stream: 'science',
    nameKm: 'គណិតវិទ្យា អនុវិទ្យាល័យ (ថ្នាក់ទី ៧ ដល់ ទី ៩ - ឌីប្លូម)',
    nameEn: 'Junior High Mathematics (Grades 7–9 / Diploma Exam)',
    icon: 'Calculator',
    color: '#005baa',
    cardClass: 'subject-card-math',
    teacher: 'សាស្ត្រាចារ្យ គណិតវិទ្យាអនុវិទ្យាល័យជាតិ',
    teacherRole: 'គណៈកម្មការរៀបចំការប្រឡងសញ្ញាបត្រឌីប្លូម MoEYS & MoTDAR',
    progress: 85,
    totalChapters: 6,
    totalLessons: 24,
    quizzesCount: 12,
    bannerImg: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=1200&q=80',
    descriptionKm: 'ត្រៀមប្រឡងឌីប្លូមថ្នាក់ជាតិ ផ្តោតលើសមីការលីនេអ៊ែរ សមីការដឺក្រេទី២ ទ្រឹស្តីបទពីតាក័រ និងត្រីកោណមាត្រ។',
    descriptionEn: 'Official Grade 7-9 Mathematics curriculum covering linear equations, polynomials, Pythagorean theorem, and basic trigonometry.',
    chapters: [
      {
        id: 'jmath-ch1',
        titleKm: 'ជំពូកទី ១៖ ពិជគណិត និងសមីការដឺក្រេទី ១ និង ២',
        titleEn: 'Chapter 1: Algebra, Linear & Quadratic Equations',
        lessons: [
          {
            id: 'jm-l1',
            titleKm: 'មេរៀនទី ១៖ ការដោះស្រាយសមីការដឺក្រេទី ២ តាមឌីសគ្រីមីណង់ Δ (Delta)',
            titleEn: 'Lesson 1: Solving Quadratic Equations using Discriminant Δ',
            duration: '25:00',
            videoUrl: 'https://www.youtube-nocookie.com/embed/n4p_q00a58o',
            videoPoster: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=800&q=80',
            notes: 'សមីការ ax² + bx + c = 0 មានឌីសគ្រីមីណង់ Δ = b² - 4ac។ បើ Δ > 0 មានឫសពីរផ្សេងគ្នា x = (-b ± √Δ) / 2a។',
            keyFormulas: ['Δ = b² - 4ac', 'x = (-b ± √Δ) / (2a)']
          }
        ]
      }
    ]
  },
  {
    id: 'junior-science-7-9',
    grade: '7-9',
    gradesList: ['7', '8', '9'],
    stream: 'science',
    nameKm: 'រូបវិទ្យា & គីមីវិទ្យា អនុវិទ្យាល័យ (ថ្នាក់ទី ៧-៩)',
    nameEn: 'Junior High Physics & Chemistry (Grades 7–9)',
    icon: 'Atom',
    color: '#7c3aed',
    cardClass: 'subject-card-physics',
    teacher: 'សាស្ត្រាចារ្យ រូបវិទ្យា-គីមីវិទ្យាអនុវិទ្យាល័យ',
    teacherRole: 'អ្នកជំនាញការពិសោធន៍វិទ្យាសាស្ត្រ MoTDAR',
    progress: 82,
    totalChapters: 6,
    totalLessons: 20,
    quizzesCount: 10,
    bannerImg: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=1200&q=80',
    descriptionKm: 'សិក្សាពីច្បាប់កម្លាំង ច្បាប់អូម សៀគ្វីអគ្គិសនី អាតូម ធាតុគីមី និងប្រតិកម្មអាស៊ីត-បាស។',
    descriptionEn: 'Grades 7-9 Physics & Chemistry covering Newton laws, Ohm law, electrical circuits, atoms, and chemical reactions.',
    chapters: [
      {
        id: 'jsci-ch1',
        titleKm: 'ជំពូកទី ១៖ កម្លាំង ចលនា និងច្បាប់អូមអគ្គិសនី',
        titleEn: 'Chapter 1: Force, Motion & Ohm Law',
        lessons: [
          {
            id: 'jsc-l1',
            titleKm: 'មេរៀនទី ១៖ ច្បាប់អូម I = U / R និងសៀគ្វីតជាស៊េរី/ខ្នែង',
            titleEn: 'Lesson 1: Ohm Law and Series/Parallel Circuits',
            duration: '22:45',
            videoUrl: 'https://www.youtube-nocookie.com/embed/n4p_q00a58o',
            videoPoster: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80',
            notes: 'អាំងតង់ស៊ីតេចរន្ត I សមាមាត្រនឹងតង់ស្យុង U និងច្រាសនឹងរេស៊ីស្តង់ R។',
            keyFormulas: ['I = U / R (A = V / Ω)', 'P = U × I (W)']
          }
        ]
      }
    ]
  },
  {
    id: 'junior-social-7-9',
    grade: '7-9',
    gradesList: ['7', '8', '9'],
    stream: 'social',
    nameKm: 'ប្រវត្តិវិទ្យា & ភូមិវិទ្យា អនុវិទ្យាល័យ (ថ្នាក់ទី ៧-៩)',
    nameEn: 'Junior High History & Geography (Grades 7–9)',
    icon: 'Landmark',
    color: '#b45309',
    cardClass: 'subject-card-history',
    teacher: 'សាស្ត្រាចារ្យ ប្រវត្តិសាស្ត្រ និងភូមិវិទ្យាជាតិ',
    teacherRole: 'អ្នកស្រាវជ្រាវប្រវត្តិសាស្ត្រអាស៊ីអាគ្នេយ៍ MoTDAR',
    progress: 86,
    totalChapters: 6,
    totalLessons: 22,
    quizzesCount: 10,
    bannerImg: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    descriptionKm: 'សិក្សាពីប្រវត្តិសាស្ត្រសម័យហ្វូណន ចេនឡា សម័យអង្គរដ៏រុងរឿង ទន្លេមេគង្គ និងអាកាសធាតុត្រូពិចកម្ពុជា។',
    descriptionEn: 'Grades 7-9 History & Geography covering Funan, Chenla, Angkorian Empire, Mekong River basin, and climate zones.',
    chapters: [
      {
        id: 'jsoc-ch1',
        titleKm: 'ជំពូកទី ១៖ ប្រវត្តិសាស្ត្រសម័យបុរាណ និងសម័យអង្គរ (ស.វ.ទី ១-១៤)',
        titleEn: 'Chapter 1: Ancient & Angkorian Era History',
        lessons: [
          {
            id: 'jso-l1',
            titleKm: 'មេរៀនទី ១៖ ការកកើតអាណាចក្រភ្នំ និងការស្ថាបនាសម័យអង្គរឆ្នាំ ៨០២',
            titleEn: 'Lesson 1: Funan Kingdom and Founding of Angkor in 802 AD',
            duration: '24:10',
            videoUrl: 'https://www.youtube-nocookie.com/embed/jZ_y8z89kX8',
            videoPoster: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
            notes: 'ស្វែងយល់ពីប្រវត្តិព្រះបាទជ័យវរ្ម័នទី២ ប្រកាសឯករាជ្យលើភ្នំគូលែនឆ្នាំ ៨០២។',
            keyFormulas: ['ឆ្នាំ ៨០២៖ ព្រះបាទជ័យវរ្ម័នទី ២ ស្ថាបនាសម័យអង្គរលើភ្នំគូលែន']
          }
        ]
      }
    ]
  },

  // ==========================================
  // 🔬 ថ្នាក់វិទ្យាសាស្ត្រពិត វិទ្យាល័យ (HIGH SCHOOL SCIENCE STREAM: GRADES 10–12 / BAC II)
  // ==========================================
  
  // 1. Mathematics (Grade 12 - Advanced Math MoTDAR)
  {
    id: 'math-12',
    grade: '12',
    stream: 'science',
    nameKm: 'គណិតវិទ្យា ថ្នាក់ទី១២ (កម្រិតខ្ពស់)',
    nameEn: 'Mathematics Grade 12 (Advanced Level)',
    icon: 'Calculator',
    color: '#005baa',
    cardClass: 'subject-card-math',
    teacher: 'សាស្ត្រាចារ្យ គណិតវិទ្យាថ្នាក់ជាតិ',
    teacherRole: 'នាយកដ្ឋានអភិវឌ្ឍន៍កម្មវិធីសិក្សា MoEYS & MoTDAR',
    progress: 75,
    totalChapters: 6,
    totalLessons: 24,
    quizzesCount: 12,
    bannerImg: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
    descriptionKm: 'កម្មវិធីសិក្សាគណិតវិទ្យាផ្លូវការថ្នាក់ទី១២ ស្របតាមក្របខ័ណ្ឌជាតិ MoEYS & MoTDAR ផ្តោតលើលីមីត ដេរីវេ អាំងតេក្រាល ចំនួនកុំផ្លិច ធរណីមាត្រក្នុងលំហ និងប្រូបាប៊ីលីតេ។',
    descriptionEn: 'Official Grade 12 Mathematics curriculum covering limits, derivatives, integrals, complex numbers, space geometry vectors, and probability.',
    chapters: [
      {
        id: 'math-ch1',
        titleKm: 'ជំពូកទី ១៖ លីមីតនៃអនុគមន៍ និងភាពជាប់ (Limits & Continuity)',
        titleEn: 'Chapter 1: Limits of Functions & Continuity',
        lessons: [
          {
            id: 'm12-l1',
            titleKm: 'មេរៀនទី ១៖ លីមីតនៃអនុគមន៍ត្រង់ចំណុច និងរាងមិនកំណត់ [0/0]',
            titleEn: 'Lesson 1: Limits at a Point & Indeterminate Form [0/0]',
            duration: '26:40',
            videoUrl: 'https://www.youtube-nocookie.com/embed/n4p_q00a58o',
            videoPoster: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
            notes: `
**ខ្លឹមសារសង្ខេបមេរៀនទី ១ (MoTDAR Standard):**

១. **និយមន័យលីមីត៖** អនុគមន៍ f(x) មានលីមីតស្មើនឹង L កាលណា x ខិតជិត a សរសេរ៖
   lim (x → a) f(x) = L

២. **វិធីសាស្ត្រគណនាលីមីតរាងមិនកំណត់ [0/0] ៖**
- **វិធីទី ១ (បំបែកជាកត្តា):** បើភាគយក និងភាគបែងជាពហុធា ត្រូវបំបែកជាកត្តា (x - a) រួចសម្រួលចោល។
- **វិធីទី ២ (គុណកន្សោមឆ្លាស់):** បើមានរ៉ាឌីកាល់ √(A) - √(B) ត្រូវគុណភាគយក និងភាគបែងនឹង √(A) + √(B)។
- **វិធីទី ៣ (រូបមន្តត្រីកោណមាត្រគ្រឹះ):**
   lim (x → 0) [sin(x) / x] = 1
   lim (x → 0) [(1 - cos(x)) / x²] = 1/2

៣. **លំហាត់គំរូបាក់ឌុប៖**
គណនា  lim (x → 2) [√(x + 2) - 2] / (x - 2)
- ជំនួស x = 2  =>  រាងមិនកំណត់ [0/0]
- គុណកន្សោមឆ្លាស់៖
   = lim (x → 2) [(√(x + 2) - 2)(√(x + 2) + 2)] / [(x - 2)(√(x + 2) + 2)]
   = lim (x → 2) (x - 2) / [(x - 2)(√(x + 2) + 2)]
   = lim (x → 2) 1 / [√(x + 2) + 2] = 1/4
            `,
            keyFormulas: [
              'lim (x → a) [f(x) ± g(x)] = lim f(x) ± lim g(x)',
              'lim (x → 0) [sin(x) / x] = 1',
              'lim (x → 0) [1 - cos(x)] / x² = 1/2'
            ]
          },
          {
            id: 'm12-l2',
            titleKm: 'មេរៀនទី ២៖ ដេរីវេ និងការសិក្សាអថេរភាពអនុគមន៍',
            titleEn: 'Lesson 2: Derivatives & Curve Sketching',
            duration: '28:15',
            videoUrl: 'https://www.youtube-nocookie.com/embed/WJ6U9sE_FhI',
            videoPoster: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
            notes: 'សិក្សារូបមន្តដេរីវេនៃអនុគមន៍ពហុធា សនិទាន អ៊ិចស្បូណង់ស្យែល និងលោការីតធម្មជាតិ។',
            keyFormulas: [
              '(x^n)\' = n*x^(n-1)',
              '(e^x)\' = e^x, (ln x)\' = 1/x',
              '(u/v)\' = (u\'v - uv\') / v²'
            ]
          },
          {
            id: 'm12-l3',
            titleKm: 'មេរៀនទី ៣៖ ព្រីមីទីវ និងអាំងតេក្រាលដោយផ្នែក',
            titleEn: 'Lesson 3: Integration by Parts & Applications',
            duration: '31:20',
            videoUrl: 'https://www.youtube-nocookie.com/embed/Q0FmF4oUu30',
            videoPoster: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
            notes: 'រូបមន្តអាំងតេក្រាលដោយផ្នែក៖ ∫ u dv = uv - ∫ v du សម្រាប់គណនាផ្ទៃក្រឡា និងមាឌសូលីដ។',
            keyFormulas: [
              '∫ u dv = uv - ∫ v du',
              '∫ (ax + b)^n dx = (ax + b)^(n+1) / [a(n+1)] + C'
            ]
          }
        ]
      }
    ]
  },

  // 2. Physics (Grade 12 - Physics MoEYS)
  {
    id: 'physics-12',
    grade: '12',
    stream: 'science',
    nameKm: 'រូបវិទ្យា ថ្នាក់ទី១២ (ទ្រឹស្តី និងលំហាត់)',
    nameEn: 'Physics Grade 12 (Mechanics, Waves & Nuclear)',
    icon: 'Atom',
    color: '#0284c7',
    cardClass: 'subject-card-physics',
    teacher: 'សាស្ត្រាចារ្យ រូបវិទ្យាថ្នាក់ជាតិ',
    teacherRole: 'សមាជិកគណៈកម្មការតាក់តែងវិញ្ញាសារូបវិទ្យាបាក់ឌុប',
    progress: 60,
    totalChapters: 5,
    totalLessons: 18,
    quizzesCount: 9,
    bannerImg: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=1200&q=80',
    descriptionKm: 'កម្មវិធីសិក្សារូបវិទ្យាថ្នាក់ទី១២ រួមមានចលនាលំយោល ប៉ោលទោល ប៉ោលបត់បែន ទែរម៉ូឌីណាមិច សៀគ្វីអគ្គិសនីចរន្តឆ្លាស់ RLC និងរូបវិទ្យានុយក្លេអ៊ែរ។',
    descriptionEn: 'Official Grade 12 Physics covering simple harmonic motion, spring pendulum, simple pendulum, thermodynamics, RLC AC circuits, and nuclear physics.',
    chapters: [
      {
        id: 'phy-ch1',
        titleKm: 'ជំពូកទី ១៖ ចលនាលំយោល និងរលក (Mechanical Oscillations)',
        titleEn: 'Chapter 1: Simple Harmonic Motion & Pendulums',
        lessons: [
          {
            id: 'p12-l1',
            titleKm: 'មេរៀនទី ១៖ សមីការឌីផេរ៉ង់ស្យែលនៃចលនាលំយោល និងប៉ោលបត់បែន',
            titleEn: 'Lesson 1: Differential Equations & Spring Pendulums',
            duration: '29:40',
            videoUrl: 'https://www.youtube-nocookie.com/embed/jZ_y-88cT8A',
            videoPoster: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80',
            notes: `
**ច្បាប់ចលនាលំយោល៖**
១. សមីការឌីផេរ៉ង់ស្យែល៖ x'' + ω₀² x = 0
២. សមីការចលនា៖ x(t) = Xm · cos(ω₀t + φ)
៣. ព្រេកង់កែងប៉ោលបត់បែន៖ ω₀ = √(k / m)
៤. ខួបនៃលំយោល៖ T = 2π √(m / k)
៥. ថាមពលមេកានិច៖ Em = Ec + Ep = ½ m v² + ½ k x² = ½ k Xm² = const
            `,
            keyFormulas: [
              'x(t) = Xm · cos(ω₀t + φ)',
              'T = 2π √(m / k) (Spring Pendulum)',
              'Em = 1/2 k Xm²'
            ]
          },
          {
            id: 'p12-l2',
            titleKm: 'មេរៀនទី ២៖ សៀគ្វីចរន្តឆ្លាស់ RLC និងរេសូណង់អគ្គិសនី',
            titleEn: 'Lesson 2: RLC Alternating Current Circuits',
            duration: '27:10',
            videoUrl: 'https://www.youtube-nocookie.com/embed/yVb8QWpG89w',
            videoPoster: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80',
            notes: 'សិក្សាពីអាំងប៉េដង់ Z = √[R² + (ZL - ZC)²] និងអនុភាពអគ្គិសនី P = UI cos(φ)។',
            keyFormulas: [
              'ZL = L*ω, ZC = 1/(C*ω)',
              'Z = √[R² + (ZL - ZC)²]',
              'cos(φ) = R / Z'
            ]
          }
        ]
      }
    ]
  },

  // 3. Chemistry (Grade 12 - Chemistry MoEYS)
  {
    id: 'chemistry-12',
    grade: '12',
    stream: 'science',
    nameKm: 'គីមីវិទ្យា ថ្នាក់ទី១២ (ស៊ីនេទិច និងសរីរាង្គ)',
    nameEn: 'Chemistry Grade 12 (Kinetics, Equilibrium & Organic)',
    icon: 'FlaskConical',
    color: '#059669',
    cardClass: 'subject-card-chemistry',
    teacher: 'សាស្ត្រាចារ្យ គីមីវិទ្យាថ្នាក់ជាតិ',
    teacherRole: 'អ្នកជំនាញកម្មវិធីសិក្សាគីមីវិទ្យាវិទ្យាល័យ',
    progress: 80,
    totalChapters: 4,
    totalLessons: 16,
    quizzesCount: 8,
    bannerImg: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
    descriptionKm: 'កម្មវិធីសិក្សាគីមីវិទ្យាថ្នាក់ទី១២ ផ្តោតលើល្បឿនប្រតិកម្ម តុល្យភាពគីមី អាស៊ីត-បាស គណនា pH អេស្ទែរ ខ្លាញ់ អាមីន និងអាស៊ីតអាមីណេ។',
    descriptionEn: 'Grade 12 Chemistry covering reaction kinetics, dynamic chemical equilibrium, acid-base equilibria, pH calculations, esters, fats, amines, and amino acids.',
    chapters: [
      {
        id: 'chem-ch1',
        titleKm: 'ជំពូកទី ១៖ ស៊ីនេទិចគីមី (Chemical Kinetics)',
        titleEn: 'Chapter 1: Reaction Rates & Factors',
        lessons: [
          {
            id: 'c12-l1',
            titleKm: 'មេរៀនទី ១៖ ល្បឿនមធ្យម និងល្បឿនខណៈនៃប្រតិកម្មគីមី',
            titleEn: 'Lesson 1: Average & Instantaneous Reaction Rates',
            duration: '24:50',
            videoUrl: 'https://www.youtube-nocookie.com/embed/i_yJ0nK9V0o',
            videoPoster: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
            notes: `
**ស៊ីនេទិចគីមី៖**
១. សមីការទូទៅ៖ aA + bB  →  cC + dD
២. ល្បឿនមធ្យមកំណកកើត C៖ Vm(C) = Δ[C] / Δt
៣. ល្បឿនមធ្យមបាត់បង់ A៖ Vm(A) = -Δ[A] / Δt
៤. កត្តាជះឥទ្ធិពលលើល្បឿន៖ កំហាប់អង្គធាតុកកើត, សីតុណ្ហភាព, ផ្ទៃប៉ះ, និងកាតាលីករ។
            `,
            keyFormulas: [
              'Vm(formation) = Δ[Product] / Δt',
              'pH = -log[H₃O⁺], [H₃O⁺] = 10^(-pH)'
            ]
          },
          {
            id: 'c12-l2',
            titleKm: 'មេរៀនទី ២៖ អាស៊ីត-បាស និងការគណនាតម្លៃ pH',
            titleEn: 'Lesson 2: Acid-Base & pH Calculations',
            duration: '26:45',
            videoUrl: 'https://www.youtube-nocookie.com/embed/kIuK7fE6g4s',
            videoPoster: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
            notes: 'សិក្សាពីទ្រឹស្តី Bronsted-Lowry ថេរ Ka, Kb, ផលគុណអ៊ីយ៉ុងនៃទឹក Ke, និងសូលុយស្យុងទ្រនាប់។',
            keyFormulas: [
              'pH = -log[H3O+]',
              'pH + pOH = 14',
              'Ka × Kb = Ke = 10^-14'
            ]
          }
        ]
      }
    ]
  },

  // 4. Biology (Grade 12 - MoTDAR)
  {
    id: 'biology-12',
    grade: '12',
    stream: 'science',
    nameKm: 'ជីវវិទ្យា ថ្នាក់ទី១២ (ហ្សែន និងម៉ូលេគុល ADN)',
    nameEn: 'Biology Grade 12 (Genetics, DNA & Human Biology)',
    icon: 'Dna',
    color: '#10b981',
    cardClass: 'subject-card-biology',
    teacher: 'សាស្ត្រាចារ្យ ជីវវិទ្យាថ្នាក់ជាតិ',
    teacherRole: 'អ្នករៀបចំលំហាត់ជីវវិទ្យាប្រឡងថ្នាក់ជាតិ',
    progress: 70,
    totalChapters: 4,
    totalLessons: 15,
    quizzesCount: 7,
    bannerImg: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=1200&q=80',
    descriptionKm: 'សិក្សាពីម៉ូលេគុល ADN/ARN ស្វ័យតម្លើងទ្វេ ការសំយោគប្រូតេអ៊ីន តំណពូជម៉ង់ដែល និងប្រព័ន្ធសរីរាង្គមនុស្ស។',
    descriptionEn: 'Grade 12 Biology exploring ADN/ARN molecular genetics, DNA replication, protein synthesis, and Mendelian inheritance laws.',
    chapters: [
      {
        id: 'bio-ch1',
        titleKm: 'ជំពូកទី ១៖ ហ្សែន និងការសំយោគប្រូតេអ៊ីន (Molecular Genetics)',
        titleEn: 'Chapter 1: DNA Replication & Transcription',
        lessons: [
          {
            id: 'b12-l1',
            titleKm: 'មេរៀនទី ១៖ រចនាសម្ព័ន្ធម៉ូលេគុល ADN និងរូបមន្តគណនាចំនួននុយក្លេអូទីត',
            titleEn: 'Lesson 1: DNA Structure & Nucleotide Calculation Rules',
            duration: '27:30',
            videoUrl: 'https://www.youtube-nocookie.com/embed/8kK2zwjRV0M',
            videoPoster: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=800&q=80',
            notes: `
**រូបមន្តគណនា ADN ថ្នាក់ទី១២ MoTDAR៖**
១. ច្បាប់ផ្គុំបាសបំពេញគ្នា៖ A = T  និង  G = C
២. ចំនួននុយក្លេអូទីតសរុប៖ N = 2A + 2G = 2(A + G)
៣. ប្រវែងម៉ូលេគុល ADN៖ L = (N / 2) × 3.4 Å
៤. ចំនួនសម្ព័ន្ធអ៊ីដ្រូសែន៖ H = 2A + 3G
            `,
            keyFormulas: [
              'N = 2A + 2G = 2(A + C)',
              'L = (N / 2) × 3.4 Å',
              'H = 2A + 3G'
            ]
          },
          {
            id: 'b12-l2',
            titleKm: 'មេរៀនទី ២៖ តំណពូជម៉ង់ដែល និងការបង្កាត់ពូជ',
            titleEn: 'Lesson 2: Mendelian Genetics & Crosses',
            duration: '25:20',
            videoUrl: 'https://www.youtube-nocookie.com/embed/Mehz7tCxjSE',
            videoPoster: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=800&q=80',
            notes: 'ច្បាប់ឯកសណ្ឋានភាព F1, ច្បាប់បំបែកលក្ខណៈ F2 (3:1), និងច្បាប់បន្សំឯករាជ្យនៃគូសេន (9:3:3:1)។',
            keyFormulas: [
              'Monohybrid F2: 3:1 (Phenotype), 1:2:1 (Genotype)',
              'Dihybrid F2: 9:3:3:1'
            ]
          }
        ]
      }
    ]
  },

  // 5. Earth & Environmental Science (Science Stream)
  {
    id: 'earth-12',
    grade: '12',
    stream: 'science',
    nameKm: 'ផែនដី និងបរិស្ថានវិទ្យា ថ្នាក់ទី១២',
    nameEn: 'Earth & Environmental Science Grade 12',
    icon: 'Compass',
    color: '#0891b2',
    cardClass: 'subject-card-physics',
    teacher: 'សាស្ត្រាចារ្យ បរិស្ថានវិទ្យាថ្នាក់ជាតិ',
    teacherRole: 'គ្រូឧទ្ទេសភូគព្ភវិទ្យា និងអាកាសធាតុ MoTDAR',
    progress: 65,
    totalChapters: 4,
    totalLessons: 14,
    quizzesCount: 6,
    bannerImg: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    descriptionKm: 'សិក្សាពីភូគព្ភសាស្ត្រ ប្លាកតិចតូនិច បរិយាកាសផែនដី បម្រែបម្រួលអាកាសធាតុ និងការគ្រប់គ្រងធនធានធម្មជាតិកម្ពុជា។',
    descriptionEn: 'Grade 12 Earth Science covering plate tectonics, atmospheric science, climate change, and natural resource management in Cambodia.',
    chapters: [
      {
        id: 'earth-ch1',
        titleKm: 'ជំពូកទី ១៖ ប្លាកតិចតូនិច និងរញ្ជួយដី (Plate Tectonics)',
        titleEn: 'Chapter 1: Plate Tectonics and Earthquakes',
        lessons: [
          {
            id: 'e12-l1',
            titleKm: 'មេរៀនទី ១៖ ចលនានៃប្លាកតិចតូនិច និងការកកើតភ្នំភ្លើង',
            titleEn: 'Lesson 1: Plate Movements and Volcanic Formations',
            duration: '25:10',
            videoUrl: 'https://www.youtube-nocookie.com/embed/d5_3R8q1w1g',
            videoPoster: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
            notes: 'សិក្សាពីរចនាសម្ព័ន្ធស្រទាប់ផែនដី សម្ពាធ និងចលនានៃប្លាកទ្វីប។',
            keyFormulas: ['E = 10^(11.8 + 1.5M) (Earthquake Energy)']
          }
        ]
      }
    ]
  },

  // 6. Computer Science & Python (STEM Track)
  {
    id: 'stem-cs',
    grade: '12',
    stream: 'science',
    nameKm: 'វិទ្យាសាស្ត្រកុំព្យូទ័រ & កូដ Python (STEM)',
    nameEn: 'Computer Science & Python for STEM High School',
    icon: 'Code',
    color: '#7c3aed',
    cardClass: 'subject-card-ict',
    teacher: 'Dr. Kim Sengly (STEM Education Director)',
    teacherRole: 'អ្នកសម្របសម្រួលកម្មវិធី STEM វិទ្យាល័យជំនាន់ថ្មី (NGS)',
    progress: 55,
    totalChapters: 4,
    totalLessons: 16,
    quizzesCount: 8,
    bannerImg: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    descriptionKm: 'កម្មវិធីសិក្សា STEM អន្តរជាតិ បង្រៀនមូលដ្ឋានគ្រឹះសរសេរកូដ Python ក្បួនដោះស្រាយបញ្ហា (Algorithms) និងវិទ្យាសាស្ត្រទិន្នន័យ។',
    descriptionEn: 'International STEM program teaching Python programming, algorithmic thinking, data structures, and foundational AI.',
    chapters: [
      {
        id: 'stem-ch1',
        titleKm: 'ជំពូកទី ១៖ មូលដ្ឋានគ្រឹះ Python (Python Fundamentals)',
        titleEn: 'Chapter 1: Python Data Types & Functions',
        lessons: [
          {
            id: 'cs-l1',
            titleKm: 'មេរៀនទី ១៖ អថេរ លក្ខខណ្ឌ និងរង្វិលជុំក្នុង Python (Variables & Loops)',
            titleEn: 'Lesson 1: Python Variables, Conditionals, and Loops',
            duration: '22:15',
            videoUrl: 'https://www.youtube-nocookie.com/embed/kqtD5dpn9C8',
            videoPoster: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
            notes: 'រៀនសរសេរកូដ Python សម័យទំនើបសម្រាប់ដោះស្រាយលំហាត់គណិតវិទ្យា។',
            keyFormulas: ['def solve_quadratic(a, b, c): return (-b ± √(b² - 4ac)) / (2a)']
          }
        ]
      }
    ]
  },

  // ==========================================
  // 📜 ថ្នាក់វិទ្យាសាស្ត្រសង្គម (SOCIAL SCIENCE STREAM)
  // ==========================================

  // 7. Khmer Literature (Grade 12 - MoTDAR)
  {
    id: 'khmer-12',
    grade: '12',
    stream: 'social',
    nameKm: 'អក្សរសាស្ត្រខ្មែរ ថ្នាក់ទី១២ (តែងសេចក្តី & អក្សរសិល្ប៍)',
    nameEn: 'Khmer Literature Grade 12 (Essays & Literary Masterpieces)',
    icon: 'BookOpen',
    color: '#ca8a04',
    cardClass: 'subject-card-khmer',
    teacher: 'សាស្ត្រាចារ្យ អក្សរសាស្ត្រខ្មែរថ្នាក់ជាតិ',
    teacherRole: 'ប្រធានគណៈកម្មការកំណែតែងសេចក្តីបាក់ឌុប',
    progress: 90,
    totalChapters: 4,
    totalLessons: 14,
    quizzesCount: 6,
    bannerImg: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    descriptionKm: 'បង្រៀនគន្លឹះតែងសេចក្តីបែបពន្យល់ ពិភាក្សា និងប្រៀបធៀបដើម្បីបាននិទ្ទេស A ព្រមទាំងការវិភាគតួអង្គក្នុងរឿងទុំទាវ កុលាបប៉ៃលិន និងផ្កាស្រពោន។',
    descriptionEn: 'Grade 12 Khmer Literature covering advanced essay writing methods (Explanatory, Discussion, Comparative) and analysis of classic Khmer novels.',
    chapters: [
      {
        id: 'khmer-ch1',
        titleKm: 'ជំពូកទី ១៖ វិធីសាស្ត្រតែងសេចក្តីកម្រិតបាក់ឌុប (Essay Methodology)',
        titleEn: 'Chapter 1: National BacII Essay Structuring',
        lessons: [
          {
            id: 'k12-l1',
            titleKm: 'មេរៀនទី ១៖ គម្រោងតែងសេចក្តីបែបពន្យល់ និងគន្លឹះយកពិន្ទុពេញ',
            titleEn: 'Lesson 1: Explanatory Essay Outline & Marking Criteria',
            duration: '34:00',
            videoUrl: 'https://www.youtube-nocookie.com/embed/lA8sJ6U8g9Q',
            videoPoster: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
            notes: `
**គម្រោងតែងសេចក្តីបែបពន្យល់កម្រិតបាក់ឌុប MoTDAR៖**
I. ផ្តើមសេចក្តី (១០%): លំនាំបញ្ហា + ចំណូលបញ្ហា + ចំណោទបញ្ហា
II. តួសេចក្តី (៨០%): ពន្យល់ពាក្យគន្លឹះ + បកស្រាយគំនិត + លើកឧទាហរណ៍អក្សរសិល្ប៍
III. បញ្ចប់សេចក្តី (១០%): វាយតម្លៃប្រធាន + មតិផ្ទាល់ខ្លួន
            `,
            keyFormulas: ['រចនាសម្ព័ន្ធ៖ ផ្តើមសេចក្តី (១០%) + តួសេចក្តី (៨០%) + បញ្ចប់សេចក្តី (១០%)']
          }
        ]
      }
    ]
  },

  // 8. History (Social Stream)
  {
    id: 'history-12',
    grade: '12',
    stream: 'social',
    nameKm: 'ប្រវត្តិវិទ្យា ថ្នាក់ទី១២ (ប្រវត្តិសាស្ត្រជាតិ & អន្តរជាតិ)',
    nameEn: 'History Grade 12 (Cambodian & World History)',
    icon: 'Landmark',
    color: '#dc2626',
    cardClass: 'subject-card-history',
    teacher: 'សាស្ត្រាចារ្យ ប្រវត្តិវិទ្យាថ្នាក់ជាតិ',
    teacherRole: 'ទីប្រឹក្សាស្រាវជ្រាវប្រវត្តិសាស្ត្រជាតិ MoTDAR',
    progress: 85,
    totalChapters: 4,
    totalLessons: 16,
    quizzesCount: 8,
    bannerImg: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=1200&q=80',
    descriptionKm: 'សិក្សាប្រវត្តិសាស្ត្រកម្ពុជាពីសម័យអង្គរ សម័យអាណានិគមនិយមបារាំង សង្គ្រាមលោកលើកទី១ ទី២ និងដំណើរការកសាងសន្តិភាពកម្ពុជា។',
    descriptionEn: 'Grade 12 History covering the Angkorian era, French protectorate period, World Wars I & II, Cold War, and Cambodia modern peacebuilding.',
    chapters: [
      {
        id: 'hist-ch1',
        titleKm: 'ជំពូកទី ១៖ ព្រះរាជាណាចក្រកម្ពុជាសម័យទំនើប (Modern Cambodia)',
        titleEn: 'Chapter 1: Modern History of Cambodia',
        lessons: [
          {
            id: 'h12-l1',
            titleKm: 'មេរៀនទី ១៖ សន្ធិសញ្ញាសន្តិភាពទីក្រុងប៉ារីស ២៣ តុលា ១៩៩១ និងអាស៊ាន',
            titleEn: 'Lesson 1: The Paris Peace Agreements 1991 & ASEAN',
            duration: '28:15',
            videoUrl: 'https://www.youtube-nocookie.com/embed/J7aQ3q0v_rU',
            videoPoster: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80',
            notes: 'សិក្សាពីកត្តានយោបាយ និងដំណើរការបង្រួបបង្រួមជាតិកម្ពុជា និងសមាជិកភាពអាស៊ាន។',
            keyFormulas: ['កាលបរិច្ឆេទសំខាន់ៗ៖ ៩ វិច្ឆិកា ១៩៥៣ (ឯករាជ្យ), ២៣ តុលា ១៩៩១ (កិច្ចព្រមព្រៀងប៉ារីស), ៣០ មេសា ១៩៩៩ (អាស៊ាន)']
          }
        ]
      }
    ]
  },

  // 9. Geography (Social Stream)
  {
    id: 'geography-12',
    grade: '12',
    stream: 'social',
    nameKm: 'ភូមិវិទ្យា ថ្នាក់ទី១២ (សេដ្ឋកិច្ច និងប្រជាសាស្ត្រ)',
    nameEn: 'Geography Grade 12 (Cambodia & Regional Economy)',
    icon: 'Globe',
    color: '#0284c7',
    cardClass: 'subject-card-physics',
    teacher: 'សាស្ត្រាចារ្យ ភូមិវិទ្យាថ្នាក់ជាតិ',
    teacherRole: 'អ្នកជំនាញភូមិសាស្ត្រសេដ្ឋកិច្ច និងនគរូបនីយកម្ម',
    progress: 70,
    totalChapters: 4,
    totalLessons: 14,
    quizzesCount: 6,
    bannerImg: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80',
    descriptionKm: 'សិក្សាពីភូមិសាស្ត្ររូបវន្តកម្ពុជា ទន្លេមេគង្គ បឹងទន្លេសាប ប្រជាសាស្ត្រ កសិកម្ម ឧស្សាហកម្ម និងសមាហរណកម្មសេដ្ឋកិច្ចអាស៊ាន។',
    descriptionEn: 'Grade 12 Geography covering physical geography of Cambodia, Mekong & Tonle Sap ecosystems, agriculture, industry, and ASEAN integration.',
    chapters: [
      {
        id: 'geo-ch1',
        titleKm: 'ជំពូកទី ១៖ ធនធានធម្មជាតិ និងសេដ្ឋកិច្ចកម្ពុជា',
        titleEn: 'Chapter 1: Natural Resources & Cambodia Economy',
        lessons: [
          {
            id: 'g12-l1',
            titleKm: 'មេរៀនទី ១៖ ប្រព័ន្ធទន្លេមេគង្គ និងដីសណ្តទន្លេកម្ពុជា',
            titleEn: 'Lesson 1: The Mekong River System & Cambodian Floodplains',
            duration: '26:30',
            videoUrl: 'https://www.youtube-nocookie.com/embed/9gCq9Jv-4eY',
            videoPoster: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80',
            notes: 'សិក្សាពីសារៈសំខាន់នៃទន្លេមេគង្គចំពោះវិស័យកសិកម្ម និងជលផលជាតិ។',
            keyFormulas: ['ក្រឡាផ្ទៃកម្ពុជា៖ ១៨១,០៣៥ គីឡូម៉ែត្រការ៉េ']
          }
        ]
      }
    ]
  },

  // 10. Moral & Civics (Social Stream)
  {
    id: 'civics-12',
    grade: '12',
    stream: 'social',
    nameKm: 'សីលធម៌ និងពលរដ្ឋវិជ្ជា ថ្នាក់ទី១២',
    nameEn: 'Moral & Civics Education Grade 12',
    icon: 'Scale',
    color: '#854d0e',
    cardClass: 'subject-card-khmer',
    teacher: 'សាស្ត្រាចារ្យ សីលធម៌-ពលរដ្ឋថ្នាក់ជាតិ',
    teacherRole: 'អ្នកជំនាញការអប់រំពលរដ្ឋ និងនីតិរដ្ឋ MoTDAR',
    progress: 80,
    totalChapters: 3,
    totalLessons: 12,
    quizzesCount: 5,
    bannerImg: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
    descriptionKm: 'សិក្សាពីរដ្ឋធម្មនុញ្ញ សិទ្ធិមនុស្ស អភិបាលកិច្ចល្អ នីតិរដ្ឋ សន្តិភាពសង្គម និងកាតព្វកិច្ចពលរដ្ឋក្នុងសង្គមប្រជាធិបតេយ្យ។',
    descriptionEn: 'Grade 12 Moral & Civics covering the Cambodian Constitution, Human Rights, Good Governance, Rule of Law, and Civic Responsibilities.',
    chapters: [
      {
        id: 'civ-ch1',
        titleKm: 'ជំពូកទី ១៖ រដ្ឋធម្មនុញ្ញ និងនីតិរដ្ឋ (Constitution & Rule of Law)',
        titleEn: 'Chapter 1: The Constitution & Rule of Law',
        lessons: [
          {
            id: 'cv12-l1',
            titleKm: 'មេរៀនទី ១៖ រចនាសម្ព័ន្ធអំណាចរដ្ឋទាំងបី និងសិទ្ធិជាមូលដ្ឋាន',
            titleEn: 'Lesson 1: The Three State Powers & Fundamental Rights',
            duration: '24:00',
            videoUrl: 'https://www.youtube-nocookie.com/embed/v9A9g_vK89U',
            videoPoster: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
            notes: 'អំណាចនីតិបញ្ញត្តិ អំណាចនីតិប្រតិបត្តិ និងអំណាចតុលាការ។',
            keyFormulas: ['អំណាចរដ្ឋទាំង ៣៖ នីតិបញ្ញត្តិ (សភា) + នីតិប្រតិបត្តិ (រាជរដ្ឋាភិបាល) + តុលាការ']
          }
        ]
      }
    ]
  },

  // 11. English for Cambodia (Grade 12)
  {
    id: 'english-12',
    grade: '12',
    stream: 'social',
    nameKm: 'ភាសាអង់គ្លេស ថ្នាក់ទី១២ (English for Cambodia Book 12)',
    nameEn: 'English Language Grade 12 (Grammar, Reading & Writing)',
    icon: 'Languages',
    color: '#db2777',
    cardClass: 'subject-card-english',
    teacher: 'សាស្ត្រាចារ្យ ភាសាអង់គ្លេសវិទ្យាល័យ',
    teacherRole: 'អ្នកសម្របសម្រួលកម្មវិធីភាសាអង់គ្លេសវិទ្យាល័យ MoTDAR',
    progress: 85,
    totalChapters: 4,
    totalLessons: 16,
    quizzesCount: 8,
    bannerImg: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80',
    descriptionKm: 'កម្មវិធីសិក្សាភាសាអង់គ្លេសផ្លូវការ សៀវភៅ English for Cambodia ថ្នាក់ទី១២ បង្រៀនវេយ្យាករណ៍ ការអានអត្ថបទ និងការសរសេរតែងសេចក្តីអង់គ្លេស។',
    descriptionEn: 'Official MoTDAR Grade 12 English curriculum based on English for Cambodia Book 12 covering grammar, academic reading, and essay writing.',
    chapters: [
      {
        id: 'eng-ch1',
        titleKm: 'Unit 1: Education, Technology & Modern Society',
        titleEn: 'Unit 1: Education, Technology & Modern Society',
        lessons: [
          {
            id: 'en12-l1',
            titleKm: 'Lesson 1: Advanced Relative Clauses & Academic Vocabulary',
            titleEn: 'Lesson 1: Advanced Relative Clauses & Academic Vocabulary',
            duration: '25:40',
            videoUrl: 'https://www.youtube-nocookie.com/embed/yW2fF1cW998',
            videoPoster: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
            notes: 'Master defining and non-defining relative clauses for BacII exam.',
            keyFormulas: ['Relative Pronouns: Who (People), Which (Things), Whose (Possession)']
          }
        ]
      }
    ]
  }
];
