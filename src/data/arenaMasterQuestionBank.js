// Master Cambodian National Curriculum Arena Question Bank
// Supports Grades 1-12 with Stream separation (Science vs Social) for Grades 11-12 and General Foundation for Grades 1-10

export const arenaMasterQuestionBank = [
  // =========================================================================
  // GRADE 12 - SCIENCE STREAM (ថ្នាក់វិទ្យាសាស្ត្រពិត ទី១២ - BacII Level)
  // =========================================================================
  
  // --- Mathematics (គណិតវិទ្យា ទី១២) ---
  {
    grade: '12',
    stream: 'science',
    subject: 'គណិតវិទ្យា',
    category: 'Calculus & Limits',
    q: 'គណនាលីមីត lim (x → 2) (x² - 4) / (x - 2) = ?',
    options: ['0', '2', '4', '8'],
    answer: 2,
    explanation: 'បំបែកជាកត្តា (x-2)(x+2)/(x-2) = x+2 => 2+2 = 4'
  },
  {
    grade: '12',
    stream: 'science',
    subject: 'គណិតវិទ្យា',
    category: 'Calculus & Limits',
    q: 'គណនាលីមីត lim (x → 0) [sin(3x) / x] = ?',
    options: ['0', '1', '3', '1/3'],
    answer: 2,
    explanation: 'lim (x → 0) sin(kx)/x = k => 3'
  },
  {
    grade: '12',
    stream: 'science',
    subject: 'គណិតវិទ្យា',
    category: 'Complex Numbers',
    q: 'ម៉ូឌុលនៃចំនួនកុំផ្លិច z = 3 - 4i គឺ៖',
    options: ['5', '7', '25', '-1'],
    answer: 0,
    explanation: '|z| = √(3² + (-4)²) = √(9+16) = √25 = 5'
  },
  {
    grade: '12',
    stream: 'science',
    subject: 'គណិតវិទ្យា',
    category: 'Complex Numbers',
    q: 'តម្លៃនៃ i²⁰²⁴ ស្មើនឹង៖',
    options: ['1', '-1', 'i', '-i'],
    answer: 0,
    explanation: '2024 ចែកដាច់នឹង 4 នាំឱ្យ i²⁰²⁴ = (i⁴)⁵⁰⁶ = 1⁵⁰⁶ = 1'
  },
  {
    grade: '12',
    stream: 'science',
    subject: 'គណិតវិទ្យា',
    category: 'Derivatives',
    q: 'ដេរីវេនៃអនុគមន៍ f(x) = ln(2x + 1) គឺ៖',
    options: ['1/(2x+1)', '2/(2x+1)', '2x/(2x+1)', '2 ln(2x+1)'],
    answer: 1,
    explanation: '(ln u)\' = u\'/u = (2x+1)\'/(2x+1) = 2/(2x+1)'
  },
  {
    grade: '12',
    stream: 'science',
    subject: 'គណិតវិទ្យា',
    category: 'Integrals',
    q: 'គណនាអាំងតេក្រាល ∫ (2x + 3) dx = ?',
    options: ['x² + 3x + c', '2x² + 3x + c', 'x² + c', '2x + c'],
    answer: 0,
    explanation: '∫ 2x dx + ∫ 3 dx = x² + 3x + c'
  },
  {
    grade: '12',
    stream: 'science',
    subject: 'គណិតវិទ្យា',
    category: 'Differential Equations',
    q: 'ចម្លើយទូទៅនៃសមីការឌីផេរ៉ង់ស្យែល y\' - 3y = 0 គឺ៖',
    options: ['y = C e^(3x)', 'y = C e^(-3x)', 'y = 3x + C', 'y = C sin(3x)'],
    answer: 0,
    explanation: 'y\' - ay = 0 មានចម្លើយទូទៅ y = C e^(ax) => y = C e^(3x)'
  },
  {
    grade: '12',
    stream: 'science',
    subject: 'គណិតវិទ្យា',
    category: 'Probability',
    q: 'បោះគ្រាប់ឡុកឡាក់មួយគ្រាប់ស្មើដៃ។ ប្រូបាប៊ីលីតេដែលចេញលេខគូគឺ៖',
    options: ['1/6', '1/3', '1/2', '2/3'],
    answer: 2,
    explanation: 'ករណីស្រប {2, 4, 6} = 3 ករណីអាច 6 => P = 3/6 = 1/2'
  },
  {
    grade: '12',
    stream: 'science',
    subject: 'គណិតវិទ្យា',
    category: 'Space Geometry',
    q: 'ក្នុងតម្រុយអរតូណរម៉ាល់ (O, i, j, k) ផលគុណស្កាលែនៃ u(1, 2, 3) និង v(2, -1, 1) គឺ៖',
    options: ['3', '5', '0', '-2'],
    answer: 0,
    explanation: 'u·v = (1)(2) + (2)(-1) + (3)(1) = 2 - 2 + 3 = 3'
  },
  {
    grade: '12',
    stream: 'science',
    subject: 'គណិតវិទ្យា',
    category: 'Calculus & Limits',
    q: 'គណនាលីមីត lim (x → +∞) (3x² - 5x + 1) / (x² + 4) = ?',
    options: ['0', '3', '+∞', '1/3'],
    answer: 1,
    explanation: 'កាលណា x → ∞ យកតួដឺក្រេខ្ពស់បំផុត 3x²/x² = 3'
  },

  // --- Physics (រូបវិទ្យា ទី១២) ---
  {
    grade: '12',
    stream: 'science',
    subject: 'រូបវិទ្យា',
    category: 'Harmonic Motion',
    q: 'ខួបនៃប៉ោលបត់បែនមានម៉ាស m និងកម្រញ័ររ៉ឺស័រ k កំណត់ដោយរូបមន្ត៖',
    options: ['T = 2π √(m/k)', 'T = 2π √(k/m)', 'T = 2π √(l/g)', 'T = 2π √(g/l)'],
    answer: 0,
    explanation: 'ខួបប៉ោលបត់បែន T = 2π √(m/k)'
  },
  {
    grade: '12',
    stream: 'science',
    subject: 'រូបវិទ្យា',
    category: 'Harmonic Motion',
    q: 'ខួបនៃប៉ោលទោលប្រវែង l ក្នុងដែនទំនាញដី g កំណត់ដោយ៖',
    options: ['T = 2π √(l/g)', 'T = 2π √(g/l)', 'T = 2π √(m/k)', 'T = 2π (l/g)'],
    answer: 0,
    explanation: 'ខួបប៉ោលទោល T = 2π √(l/g)'
  },
  {
    grade: '12',
    stream: 'science',
    subject: 'រូបវិទ្យា',
    category: 'AC Circuits',
    q: 'ក្នុងសៀគ្វីចរន្តឆ្លាស់ សមីការតង់ស្យុងប្រសិទ្ធ U_eff ធៀបនឹងតង់ស្យុងអតិបរមា U_max គឺ៖',
    options: ['U_eff = U_max / √2', 'U_eff = U_max × √2', 'U_eff = U_max / 2', 'U_eff = 2 U_max'],
    answer: 0,
    explanation: 'U_eff = U_max / √2 ≈ 0.707 U_max'
  },
  {
    grade: '12',
    stream: 'science',
    subject: 'រូបវិទ្យា',
    category: 'Nuclear Physics',
    q: 'សមីការសមមូលម៉ាស-ថាមពលរបស់ Einstein គឺ៖',
    options: ['E = mc²', 'E = 1/2 mv²', 'E = mgh', 'E = hf'],
    answer: 0,
    explanation: 'E = mc² (c ជាល្បឿនពន្លឺក្នុងសុញ្ញាកាស 3 × 10⁸ m/s)'
  },
  {
    grade: '12',
    stream: 'science',
    subject: 'រូបវិទ្យា',
    category: 'Thermodynamics',
    q: 'ច្បាប់ទី ១ ទែរម៉ូឌីណាមិច សរសេរក្នុងទម្រង់៖',
    options: ['ΔU = Q + W', 'ΔU = Q - W', 'Q = mcΔT', 'PV = nRT'],
    answer: 0,
    explanation: 'បម្រែបម្រួលថាមពលក្នុង ΔU = Q + W'
  },
  {
    grade: '12',
    stream: 'science',
    subject: 'រូបវិទ្យា',
    category: 'Waves',
    q: 'ល្បឿនរលក v ប្រវែងរលក λ និងប្រេកង់ f ទាក់ទងគ្នាដោយរូបមន្ត៖',
    options: ['v = λ × f', 'v = λ / f', 'v = f / λ', 'v = λ × T'],
    answer: 0,
    explanation: 'v = λ/T = λ × f'
  },

  // --- Chemistry (គីមីវិទ្យា ទី១២) ---
  {
    grade: '12',
    stream: 'science',
    subject: 'គីមីវិទ្យា',
    category: 'Acids & Bases',
    q: 'សូលុយស្យុងមានកំហាប់ [H₃O⁺] = 10⁻³ M មាន pH ស្មើនឹង៖',
    options: ['3', '11', '7', '1'],
    answer: 0,
    explanation: 'pH = -log[H₃O⁺] = -log(10⁻³) = 3'
  },
  {
    grade: '12',
    stream: 'science',
    subject: 'គីមីវិទ្យា',
    category: 'Organic Chemistry',
    q: 'រូបមន្តទូទៅនៃអាល់កាន (Alkane) គឺ៖',
    options: ['CnH2n+2', 'CnH2n', 'CnH2n-2', 'CnH2n+1OH'],
    answer: 0,
    explanation: 'អាល់កានជាអ៊ីដ្រូកាបួឆ្អែតមានរូបមន្ត CnH2n+2 (n ≥ 1)'
  },
  {
    grade: '12',
    stream: 'science',
    subject: 'គីមីវិទ្យា',
    category: 'Organic Chemistry',
    q: 'សមាសធាតុ CH₃-COOH មានឈ្មោះជាអន្តរជាតិ (IUPAC) ថា៖',
    options: ['អាស៊ីតអេតាណូអ៊ិច (Ethanoic acid)', 'មេតាណុល', 'អេតាណាល់', 'អេទីឡែន'],
    answer: 0,
    explanation: 'CH₃COOH ជាអាស៊ីតកាបុកស៊ីលិចមានកាបូន ២ ឈ្មោះ អាស៊ីតអេតាណូអ៊ិច (អាស៊ីតអាសេទិច)'
  },
  {
    grade: '12',
    stream: 'science',
    subject: 'គីមីវិទ្យា',
    category: 'Chemical Kinetics',
    q: 'កត្តាដែលបង្កើនល្បឿនប្រតិកម្មគីមីរួមមាន៖',
    options: ['ការបង្កើនសីតុណ្ហភាព និងកំហាប់', 'ការបន្ថយសីតុណ្ហភាព', 'ការបន្ថយផ្ទៃប៉ះ', 'ការបន្ថែមទឹក'],
    answer: 0,
    explanation: 'ការបង្កើនសីតុណ្ហភាព និងកំហាប់ ឬការប្រើកាតាលីករ ជួយបង្កើនល្បឿនប្រតិកម្ម'
  },
  {
    grade: '12',
    stream: 'science',
    subject: 'គីមីវិទ្យា',
    category: 'Electrochemistry',
    q: 'នៅក្នុងពីលអេឡិចត្រូគីមី អេឡិចត្រូតដែលកើតមានប្រតិកម្មអុកស៊ីតកម្មហៅថា៖',
    options: ['អាណូត (Anode)', 'កាតូត (Cathode)', 'ស្ពានអំបិល', 'អេឡិចត្រូលីត'],
    answer: 0,
    explanation: 'អាណូតជាកន្លែងកើតប្រតិកម្មអុកស៊ីតកម្ម (បាត់បង់អេឡិចត្រុង)'
  },

  // --- Biology (ជីវវិទ្យា ទី១២) ---
  {
    grade: '12',
    stream: 'science',
    subject: 'ជីវវិទ្យា',
    category: 'Genetics & DNA',
    q: 'ម៉ូលេគុល ADN ផ្សំឡើងពីបាសអាសូតចំនួន ៤ ប្រភេទគឺ៖',
    options: ['A, T, C, G', 'A, U, C, G', 'A, T, U, G', 'C, G, U, T'],
    answer: 0,
    explanation: 'ADN មានបាស Adenine (A), Thymine (T), Cytosine (C), Guanine (G)'
  },
  {
    grade: '12',
    stream: 'science',
    subject: 'ជីវវិទ្យា',
    category: 'Genetics & DNA',
    q: 'តាមគោលការណ៍បំពេញបាសក្នុងម៉ូលេគុល ADN បាស A ភ្ជាប់ជាមួយ T ដោយសម្ព័ន្ធអ៊ីដ្រូសែនចំនួន៖',
    options: ['២ សម្ព័ន្ធ', '៣ សម្ព័ន្ធ', '១ សម្ព័ន្ធ', '៤ សម្ព័ន្ធ'],
    answer: 0,
    explanation: 'A ភ្ជាប់ជាមួយ T ដោយសម្ព័ន្ធអ៊ីដ្រូសែន ២ (A=T) និង C ភ្ជាប់ជាមួយ G ដោយសម្ព័ន្ធអ៊ីដ្រូសែន ៣ (C≡G)'
  },
  {
    grade: '12',
    stream: 'science',
    subject: 'ជីវវិទ្យា',
    category: 'Protein Synthesis',
    q: 'ដំណើរការចម្លងកូដ (Transcription) ពី ADN ទៅជា ARN ធ្វើឡើងនៅក្នុង៖',
    options: ['ណ្វៃយ៉ូកោសិកា', 'ស៊ីតូប្លាស', 'រីបូសូម', 'មីតូកុងឌ្រី'],
    answer: 0,
    explanation: 'ការចម្លងកូដកើតឡើងក្នុងណ្វៃយ៉ូកោសិកា រួច ARNm ចេញទៅស៊ីតូប្លាសដើម្បីបកប្រែកូដ'
  },
  {
    grade: '12',
    stream: 'science',
    subject: 'ជីវវិទ្យា',
    category: 'Cell Division',
    q: 'បាតុភូតកាត់ប្តូរផ្នែកក្រូម៉ាទីត (Crossing-over) កើតឡើងនៅវគ្គណា?៖',
    options: ['ប្រូផាសទី ១ នៃមេយ៉ូស', 'មេតាផាសទី ២', 'អាណាផាសទី ១', 'តេឡូផាស'],
    answer: 0,
    explanation: 'Crossing-over កើតឡើងនៅប្រូផាសទី ១ (Prophase I) នៃមេយ៉ូស I'
  },

  // =========================================================================
  // GRADE 12 - SOCIAL SCIENCE STREAM (ថ្នាក់វិទ្យាសាស្ត្រសង្គម ទី១២ - BacII Level)
  // =========================================================================

  // --- Khmer Literature (ភាសាខ្មែរ & អក្សរសាស្ត្រ ទី១២) ---
  {
    grade: '12',
    stream: 'social',
    subject: 'ភាសាខ្មែរ',
    category: 'Khmer Literature',
    q: 'រឿង «ទុំទាវ» គឺជាស្នាដៃនិពន្ធរបស់អ្នកណា?៖',
    options: ['ព្រះភិក្ខុសោម', 'ភិក្ខុប៉ាងខាត់', 'កវីក្រមង៉ុយ', 'លោក នូ ហាច'],
    answer: 0,
    explanation: 'រឿងទុំទាវ និពន្ធដោយព្រះភិក្ខុសោម ក្នុងឆ្នាំ ១៩១៥'
  },
  {
    grade: '12',
    stream: 'social',
    subject: 'ភាសាខ្មែរ',
    category: 'Khmer Literature',
    q: 'រឿង «កុលាបប៉ៃលិន» និពន្ធដោយអ្នកនិពន្ធរូបណា?៖',
    options: ['លោក ញ៉ុក ថែម', 'លោក នូ ហាច', 'លោក រីម គីន', 'លោក គង់ ប៊ុនឈឿន'],
    answer: 0,
    explanation: 'រឿងកុលាបប៉ៃលិន និពន្ធដោយលោក ញ៉ុក ថែម ក្នុងឆ្នាំ ១៩៣៦ (បោះពុម្ព ១៩៤៣)'
  },
  {
    grade: '12',
    stream: 'social',
    subject: 'ភាសាខ្មែរ',
    category: 'Khmer Literature',
    q: 'រឿង «ភូមិតិរច្ឆាន» ឆ្លុះបញ្ចាំងពីព្រឹត្តិការណ៍ប្រឆាំងអាណានិគមបារាំងនៅភូមិ៖',
    options: ['ក្រាំងលាវ (ខេត្តកំពង់ឆ្នាំង)', 'ប៉ៃលិន', 'កោះធំ', 'ស្វាយរៀង'],
    answer: 0,
    explanation: 'ភូមិតិរច្ឆាន ឆ្លុះបញ្ចាំងចលនាបះបោររបស់ប្រជាជនភូមិក្រាំងលាវសម្លាប់បារដេស (Bardy) ឆ្នាំ១៩២៥'
  },
  {
    grade: '12',
    stream: 'social',
    subject: 'ភាសាខ្មែរ',
    category: 'Grammar',
    q: 'កិរិយាស័ព្ទក្នុងភាសាខ្មែរចែកចេញជាពីរសំខាន់គឺ៖',
    options: ['សកម្មកិរិយា និង អកម្មកិរិយា', 'នាម និង គុណនាម', 'គុណកិរិយា និង ធ្នាក់', 'ឈ្នាប់ និង ឧទានស័ព្ទ'],
    answer: 0,
    explanation: 'កិរិយាស័ព្ទសំខាន់មាន សកម្មកិរិយា (ត្រូវការកម្មបទ) និង អកម្មកិរិយា (មិនត្រូវការកម្មបទ)'
  },

  // --- History (ប្រវត្តិវិទ្យា ទី១២) ---
  {
    grade: '12',
    stream: 'social',
    subject: 'ប្រវត្តិវិទ្យា',
    category: 'Cambodian History',
    q: 'កិច្ចព្រមព្រៀងសន្តិភាពទីក្រុងប៉ារីសស្តីពីកម្ពុជា ត្រូវបានចុះហត្ថលេខានៅថ្ងៃ ខែ ឆ្នាំណា?៖',
    options: ['២៣ តុលា ១៩៩១', '៧ មករា ១៩៧៩', '១៧ មេសា ១៩៧៥', '៩ វិច្ឆិកា ១៩៥៣'],
    answer: 0,
    explanation: 'ចុះហត្ថលេខានៅថ្ងៃទី ២៣ តុលា ១៩៩១ នៅទីក្រុងប៉ារីស ប្រទេសបារាំង'
  },
  {
    grade: '12',
    stream: 'social',
    subject: 'ប្រវត្តិវិទ្យា',
    category: 'Cambodian History',
    q: 'ព្រះរាជាណាចក្រកម្ពុជាទទួលបានឯករាជ្យបរិបូណ៌ពីអាណានិគមបារាំងនៅថ្ងៃ ខែ ឆ្នាំណា?៖',
    options: ['៩ វិច្ឆិកា ១៩៥៣', '១៧ មេសា ១៩៧៥', '២៤ កញ្ញា ១៩៩៣', '២៣ តុលា ១៩៩១'],
    answer: 0,
    explanation: 'កម្ពុជាទទួលបានឯករាជ្យជាតិនៅថ្ងៃទី ៩ វិច្ឆិកា ១៩៥៣ ក្រោមព្រះរាជបូជនីយកិច្ចនៃព្រះបាទសម្តេច នរោត្តម សីហនុ'
  },
  {
    grade: '12',
    stream: 'social',
    subject: 'ប្រវត្តិវិទ្យា',
    category: 'International Relations',
    q: 'សមាគមប្រជាជាតិអាស៊ីអាគ្នេយ៍ (អាស៊ាន/ASEAN) បង្កើតឡើងនៅឆ្នាំណា?៖',
    options: ['១៩៦៧', '១៩៧៥', '១៩៩១', '១៩៩៩'],
    answer: 0,
    explanation: 'អាស៊ានបង្កើតឡើងនៅថ្ងៃទី ៨ សីហា ១៩៦៧ នៅទីក្រុងបាងកក ប្រទេសថៃ'
  },
  {
    grade: '12',
    stream: 'social',
    subject: 'ប្រវត្តិវិទ្យា',
    category: 'International Relations',
    q: 'កម្ពុជាបានចូលជាសមាជិកពេញសិទ្ធិនៃអាស៊ាន (ASEAN) នៅថ្ងៃ ខែ ឆ្នាំណា?៖',
    options: ['៣០ មេសា ១៩៩៩', '៨ សីហា ១៩៦៧', '២៣ តុលា ១៩៩១', '១ មករា ២០០០'],
    answer: 0,
    explanation: 'កម្ពុជាចូលជាសមាជិកទី១០ នៃអាស៊ាននៅថ្ងៃទី ៣០ មេសា ១៩៩៩ នៅទីក្រុងហាណូយ'
  },
  {
    grade: '12',
    stream: 'social',
    subject: 'ប្រវត្តិវិទ្យា',
    category: 'World History',
    q: 'អង្គការសហប្រជាជាតិ (UN) ត្រូវបានបង្កើតឡើងជាផ្លូវការនៅឆ្នាំណា?៖',
    options: ['១៩៤៥', '១៩១៩', '១៩៣៩', '១៩៥០'],
    answer: 0,
    explanation: 'អង្គការសហប្រជាជាតិបង្កើតឡើងនៅថ្ងៃទី ២៤ តុលា ១៩៤៥ ក្រោយសង្គ្រាមលោកលើកទី ២'
  },

  // --- Geography (ភូមិវិទ្យា ទី១២) ---
  {
    grade: '12',
    stream: 'social',
    subject: 'ភូមិវិទ្យា',
    category: 'Cambodian Geography',
    q: 'ទន្លេមេគង្គហូរកាត់ប្រទេសកម្ពុជាមានប្រវែងប្រមាណប៉ុន្មានគីឡូម៉ែត្រ?៖',
    options: ['ប្រមាណ ៥០០ គ.ម', 'ប្រមាណ ៨០០ គ.ម', 'ប្រមាណ ២០០ គ.ម', 'ប្រមាណ ១,២០០ គ.ម'],
    answer: 0,
    explanation: 'ទន្លេមេគង្គហូរកាត់កម្ពុជាពីល្បាក់ខោន (ព្រំដែនឡាវ) ដល់ព្រំដែនវៀតណាម ប្រវែងប្រមាណ ៥០០ គ.ម'
  },
  {
    grade: '12',
    stream: 'social',
    subject: 'ភូមិវិទ្យា',
    category: 'Cambodian Geography',
    q: 'ភ្នំដែលខ្ពស់ជាងគេបំផុតនៅប្រទេសកម្ពុជាគឺភ្នំអ្វី?៖',
    options: ['ភ្នំឱរ៉ាល់ (១,៨១៣ ម៉ែត្រ)', 'ភ្នំបូកគោ', 'ភ្នំដងរែក', 'ភ្នំក្រវាញ'],
    answer: 0,
    explanation: 'ភ្នំឱរ៉ាល់ ស្ថិតក្នុងខេត្តកំពង់ស្ពឺ មានកម្ពស់ ១,៨១៣ ម៉ែត្រ ជាចំណុចខ្ពស់បំផុតនៅកម្ពុជា'
  },
  {
    grade: '12',
    stream: 'social',
    subject: 'ភូមិវិទ្យា',
    category: 'Climate & Environment',
    q: 'ប្រទេសកម្ពុជាស្ថិតក្នុងតំបន់អាកាសធាតុប្រភេទណា?៖',
    options: ['ត្រូពិចខ្យល់មូសុង (Tropical Monsoon)', 'អាកាសធាតុក្តៅស្ងួត', 'អាកាសធាតុក្តៅបង្គួរ', 'អាកាសធាតុត្រជាក់'],
    answer: 0,
    explanation: 'កម្ពុជាមានអាកាសធាតុត្រូពិចខ្យល់មូសុង មានរដូវពីរច្បាស់លាស់គឺ រដូវវស្សា និងរដូវប្រាំង'
  },
  {
    grade: '12',
    stream: 'social',
    subject: 'ភូមិវិទ្យា',
    category: 'Demographics',
    q: 'បឹងទន្លេសាបជាបឹងទឹកសាបធំជាងគេនៅតំបន់ណា?៖',
    options: ['អាស៊ីអាគ្នេយ៍', 'អាស៊ីបូព៌ា', 'អាស៊ីខាងត្បូង', 'ពិភពលោកទាំងមូល'],
    answer: 0,
    explanation: 'បឹងទន្លេសាបជាបឹងទឹកសាបធំជាងគេបំផុតនៅអាស៊ីអាគ្នេយ៍ និងជាជម្រកមច្ឆជាតិដ៏សម្បូរបែប'
  },

  // --- Civics & Morals (សីលធម៌-ពលរដ្ឋ ទី១២) ---
  {
    grade: '12',
    stream: 'social',
    subject: 'សីលធម៌-ពលរដ្ឋ',
    category: 'Constitution & Laws',
    q: 'ច្បាប់កំពូលនៃព្រះរាជាណាចក្រកម្ពុជាគឺ៖',
    options: ['រដ្ឋធម្មនុញ្ញ', 'ក្រមព្រហ្មទណ្ឌ', 'ក្រមរដ្ឋប្បវេណី', 'ច្បាប់ការងារ'],
    answer: 0,
    explanation: 'រដ្ឋធម្មនុញ្ញនៃព្រះរាជាណាចក្រកម្ពុជា (អនុម័ត ២៤ កញ្ញា ១៩៩៣) ជាច្បាប់កំពូលរបស់ជាតិ'
  },
  {
    grade: '12',
    stream: 'social',
    subject: 'សីលធម៌-ពលរដ្ឋ',
    category: 'State Powers',
    q: 'អំណាចរដ្ឋទាំង ៣ ក្នុងរបបប្រជាធិបតេយ្យសេរីពហុបក្សរួមមាន៖',
    options: ['នីតិបញ្ញត្តិ នីតិប្រតិបត្តិ និង តុលាការ', 'រដ្ឋាភិបាល យោធា និង ប៉ូលិស', 'រដ្ឋសភា ព្រឹទ្ធសភា និង គណបក្ស', 'ក្រសួង ខេត្ត និង ស្រុក'],
    answer: 0,
    explanation: 'អំណាចទាំង ៣ គឺ អំណាចនីតិបញ្ញត្តិ (សភា) អំណាចនីតិប្រតិបត្តិ (រាជរដ្ឋាភិបាល) និងអំណាចតុលាការ'
  },
  {
    grade: '12',
    stream: 'social',
    subject: 'សីលធម៌-ពលរដ្ឋ',
    category: 'Human Rights',
    q: 'សេចក្តីប្រកាសជាសកលស្តីពីសិទ្ធិមនុស្ស ត្រូវបានអនុម័តដោយមហាសន្និបាត UN នៅឆ្នាំណា?៖',
    options: ['១៩៤៨', '១៩៤៥', '១៩៩៣', '១៩៧៥'],
    answer: 0,
    explanation: 'អនុម័តនៅថ្ងៃទី ១០ ធ្នូ ១៩៤៨ ដោយមហាសន្និបាតអង្គការសហប្រជាជាតិ'
  },

  // =========================================================================
  // GRADE 11 - SCIENCE & SOCIAL (ថ្នាក់ទី១១)
  // =========================================================================
  {
    grade: '11',
    stream: 'science',
    subject: 'គណិតវិទ្យា',
    category: 'Trigonometry',
    q: 'តម្លៃនៃ sin²(x) + cos²(x) ស្មើនឹង៖',
    options: ['1', '0', '2', 'tan(x)'],
    answer: 0,
    explanation: 'រូបមន្តត្រីកោណមាត្រគ្រឹះ sin²(x) + cos²(x) = 1'
  },
  {
    grade: '11',
    stream: 'science',
    subject: 'គណិតវិទ្យា',
    category: 'Sequences',
    q: 'ស្វ៊ីតនព្វន្តមានតួទីមួយ u₁ = 3 និងផលសងរួម d = 4។ តួទី ៥ (u₅) គឺ៖',
    options: ['19', '15', '23', '12'],
    answer: 0,
    explanation: 'u_n = u₁ + (n-1)d => u₅ = 3 + 4(4) = 3 + 16 = 19'
  },
  {
    grade: '11',
    stream: 'science',
    subject: 'រូបវិទ្យា',
    category: 'Newton Mechanics',
    q: 'ច្បាប់ទី ២ ញូតុន កំណត់ដោយសមីការ៖',
    options: ['F = m × a', 'F = m / a', 'a = F × m', 'P = m / g'],
    answer: 0,
    explanation: 'ផលបូកកម្លាំង F = m × a'
  },
  {
    grade: '11',
    stream: 'science',
    subject: 'គីមីវិទ្យា',
    category: 'Solutions',
    q: 'រូបមន្តគណនាកំហាប់ជាម៉ូល C_M នៃសូលុយស្យុងគឺ៖',
    options: ['C_M = n / V', 'C_M = m / M', 'C_M = V / n', 'C_M = n × V'],
    answer: 0,
    explanation: 'C_M = n / V (n ជាចំនួនម៉ូលគិតជា mol, V ជាមាឌគិតជា L)'
  },
  {
    grade: '11',
    stream: 'social',
    subject: 'ភាសាខ្មែរ',
    category: 'Khmer Literature',
    q: 'រឿង «សុភាសិតច្បាប់ស្រី» និពន្ធដោយអ្នកណា?៖',
    options: ['អ្នកឧកញ៉ាវិបុលរាជសេនា នូ កន', 'ព្រះបាទអង្គឌួង', 'កវីក្រមង៉ុយ', 'ភិក្ខុសោម'],
    answer: 1,
    explanation: 'ច្បាប់ស្រី និពន្ធដោយព្រះបាទអង្គឌួង ក្នុងឆ្នាំ ១៨៣៧'
  },
  {
    grade: '11',
    stream: 'social',
    subject: 'ប្រវត្តិវិទ្យា',
    category: 'Khmer Empire',
    q: 'ប្រាសាទអង្គរវត្តត្រូវបានកសាងឡើងក្នុងរជ្ជកាលព្រះមហាក្សត្រអង្គណា?៖',
    options: ['ព្រះបាទសូរ្យវរ្ម័នទី ២', 'ព្រះបាទជ័យវរ្ម័នទី ៧', 'ព្រះបាទយសោវរ្ម័នទី ១', 'ព្រះបាទជ័យវរ្ម័នទី ២'],
    answer: 0,
    explanation: 'កសាងឡើងនៅដើមសតវត្សរ៍ទី ១២ ដោយព្រះបាទសូរ្យវរ្ម័នទី ២ ឧទ្ទិសថ្វាយព្រះវិស្ណុ'
  },

  // =========================================================================
  // GRADES 1 - 10 (GENERAL FOUNDATION - ថ្នាក់ក្រោមទី១១)
  // =========================================================================

  // --- Grade 10 ---
  {
    grade: '10',
    stream: 'general',
    subject: 'គណិតវិទ្យា',
    category: 'Algebra',
    q: 'ផលបូកឫសនៃសមីការ x² - 5x + 6 = 0 គឺ៖',
    options: ['5', '-5', '6', '-6'],
    answer: 0,
    explanation: 'តាមទ្រឹស្តីបទវ្យែត S = x₁ + x₂ = -b/a = -(-5)/1 = 5'
  },
  {
    grade: '10',
    stream: 'general',
    subject: 'រូបវិទ្យា',
    category: 'Kinematics',
    q: 'ចលនាត្រង់ស្មើមានសមីការចលនាទូទៅ៖',
    options: ['x = v t + x₀', 'x = 1/2 a t² + v₀ t + x₀', 'v = a t', 'x = a t²'],
    answer: 0,
    explanation: 'ចលនាត្រង់ស្មើ (ល្បឿនថេរ v) x = v t + x₀'
  },
  {
    grade: '10',
    stream: 'general',
    subject: 'ជីវវិទ្យា',
    category: 'Genetics',
    q: 'លោក ហ្គ្រេហ្គ័រ ម៉ង់ដែល (Gregor Mendel) ធ្វើពិសោធន៍ពន្ធុវិទ្យាលើរុក្ខជាតិអ្វី?៖',
    options: ['សណ្តែកព័រ (Pea plant)', 'ស្រូវសាលី', 'ពោត', 'ផ្កាឈូករ័ត្ន'],
    answer: 0,
    explanation: 'ម៉ង់ដែលបានធ្វើពិសោធន៍លើដើមសណ្តែកព័រ (Pisum sativum) និងរកឃើញច្បាប់តំណពូជ'
  },
  {
    grade: '10',
    stream: 'general',
    subject: 'ប្រវត្តិវិទ្យា',
    category: 'Ancient Cambodia',
    q: 'រដ្ឋដំបូងគេបង្អស់ក្នុងប្រវត្តិសាស្ត្រខ្មែរត្រូវបានគេស្គាល់ថាជារដ្ឋ៖',
    options: ['នគរភ្នំ (ហ្វូណន)', 'ចេនឡា', 'អង្គរ', 'ចតុមុខ'],
    answer: 0,
    explanation: 'នគរភ្នំ ឬហ្វូណន (សតវត្សរ៍ទី ១ ដល់ទី ៦ នៃ គ.ស) ជារដ្ឋខ្មែរដំបូងបង្អស់'
  },

  // --- Grade 9 (Diploma Level - ឌីប្លូម) ---
  {
    grade: '9',
    stream: 'general',
    subject: 'គណិតវិទ្យា',
    category: 'Geometry',
    q: 'ទ្រឹស្តីបទពីតាករ (Pythagorean Theorem) សម្រាប់ត្រីកោណកែង ABC (កែងត្រង់ A) គឺ៖',
    options: ['BC² = AB² + AC²', 'AB² = BC² + AC²', 'AC² = AB² + BC²', 'BC = AB + AC'],
    answer: 0,
    explanation: 'ការ៉េអ៊ីប៉ូតេនុសស្មើផលបូកការ៉េជ្រុងកែងទាំងពីរ BC² = AB² + AC²'
  },
  {
    grade: '9',
    stream: 'general',
    subject: 'គីមីវិទ្យា',
    category: 'Periodic Table',
    q: 'និមិត្តសញ្ញាគីមីនៃធាតុដែកគឺ៖',
    options: ['Fe', 'Cu', 'Au', 'Ag'],
    answer: 0,
    explanation: 'Fe (Ferrum) ជាដែក, Cu ជាទង់ដែង, Au ជាមាស, Ag ជាប្រាក់'
  },
  {
    grade: '9',
    stream: 'general',
    subject: 'ភាសាខ្មែរ',
    category: 'Grammar',
    q: 'ស្រៈនិស្ស័យក្នុងភាសាខ្មែរមានចំនួនប៉ុន្មានតួ?៖',
    options: ['២៣ តួ (ឬ ២៤ តួ)', '៣៣ តួ', '១២ តួ', '៨ តួ'],
    answer: 0,
    explanation: 'ព្យញ្ជនៈខ្មែរមាន ៣៣ តួ និងស្រៈនិស្ស័យមាន ២៣ តួ (ឬ ២៤ តាមក្បួនថ្មី)'
  },
  {
    grade: '9',
    stream: 'general',
    subject: 'រូបវិទ្យា',
    category: 'Electricity',
    q: 'ច្បាប់អូម (Ohm\'s Law) កំណត់ដោយរូបមន្ត៖',
    options: ['U = R × I', 'I = U × R', 'R = U × I', 'P = U / I'],
    answer: 0,
    explanation: 'U = R × I (តង់ស្យុង = រេស៊ីស្តង់ × អាំងតង់ស៊ីតេចរន្ត)'
  },

  // --- Grade 7-8 ---
  {
    grade: '8',
    stream: 'general',
    subject: 'គណិតវិទ្យា',
    category: 'Arithmetic',
    q: 'តម្លៃនៃ (-3) × (-7) ស្មើនឹង៖',
    options: ['21', '-21', '10', '-10'],
    answer: 0,
    explanation: 'ដក គុណនឹង ដក ចេញ បូក => (-3) × (-7) = +21'
  },
  {
    grade: '8',
    stream: 'general',
    subject: 'ជីវវិទ្យា',
    category: 'Cell Biology',
    q: 'ផ្នែកនៃកោសិការុក្ខជាតិដែលផ្ទុកក្លរ៉ូភីលសម្រាប់រស្មីសំយោគគឺ៖',
    options: ['ក្លរ៉ូប្លាស (Chloroplast)', 'មីតូកុងឌ្រី', 'ណ្វៃយ៉ូ', 'ភ្នាសកោសិកា'],
    answer: 0,
    explanation: 'ក្លរ៉ូប្លាសមានសារធាតុបៃតងក្លរ៉ូភីល សម្រាប់ស្រូបពន្លឺធ្វើរស្មីសំយោគ'
  },
  {
    grade: '7',
    stream: 'general',
    subject: 'គណិតវិទ្យា',
    category: 'Fractions',
    q: 'គណនា 1/2 + 1/4 = ?',
    options: ['3/4', '2/6', '1/6', '1/8'],
    answer: 0,
    explanation: '1/2 + 1/4 = 2/4 + 1/4 = 3/4'
  },
  {
    grade: '7',
    stream: 'general',
    subject: 'ភូមិវិទ្យា',
    category: 'Earth Science',
    q: 'ភពដែលនៅជិតព្រះអាទិត្យជាងគេបំផុតក្នុងប្រព័ន្ធព្រះអាទិត្យគឺ៖',
    options: ['ភពពុធ (Mercury)', 'ភពសុក្រ (Venus)', 'ភពផែនដី (Earth)', 'ភពអង្គារ (Mars)'],
    answer: 0,
    explanation: 'ភពពុធ (Mercury) ស្ថិតនៅជិតព្រះអាទិត្យជាងគេបង្អស់'
  },

  // --- Primary Grades 1-6 (បឋមសិក្សា) ---
  {
    grade: '6',
    stream: 'general',
    subject: 'គណិតវិទ្យា',
    category: 'Basic Math',
    q: 'ផ្ទៃក្រឡាត្រីកោណមានបាត 8 cm និងកម្ពស់ 5 cm គឺ៖',
    options: ['20 cm²', '40 cm²', '13 cm²', '26 cm²'],
    answer: 0,
    explanation: 'S = (បាត × កម្ពស់) / 2 = (8 × 5) / 2 = 40 / 2 = 20 cm²'
  },
  {
    grade: '5',
    stream: 'general',
    subject: 'គណិតវិទ្យា',
    category: 'Basic Math',
    q: 'គណនា 25 × 4 = ?',
    options: ['100', '90', '125', '75'],
    answer: 0,
    explanation: '25 × 4 = 100'
  },
  {
    grade: '4',
    stream: 'general',
    subject: 'ចំណេះដឹងទូទៅ',
    category: 'General Knowledge',
    q: 'រាជធានីនៃព្រះរាជាណាចក្រកម្ពុជាបច្ចុប្បន្នគឺ៖',
    options: ['រាជធានីភ្នំពេញ', 'ខេត្តសៀមរាប', 'ខេត្តបាត់ដំបង', 'ខេត្តព្រះសីហនុ'],
    answer: 0,
    explanation: 'រាជធានីភ្នំពេញ ជារាជធានី និងជាមជ្ឈមណ្ឌលសេដ្ឋកិច្ច នយោបាយរបស់កម្ពុជា'
  },
  {
    grade: '3',
    stream: 'general',
    subject: 'គណិតវិទ្យា',
    category: 'Basic Math',
    q: 'គណនា 48 ÷ 6 = ?',
    options: ['8', '7', '9', '6'],
    answer: 0,
    explanation: '48 ÷ 6 = 8 ព្រោះ 6 × 8 = 48'
  },
  {
    grade: '2',
    stream: 'general',
    subject: 'គណិតវិទ្យា',
    category: 'Basic Math',
    q: 'គណនា 15 + 27 = ?',
    options: ['42', '32', '52', '41'],
    answer: 0,
    explanation: '15 + 27 = 42'
  },
  {
    grade: '1',
    stream: 'general',
    subject: 'គណិតវិទ្យា',
    category: 'Basic Math',
    q: 'គណនា 9 - 4 = ?',
    options: ['5', '6', '4', '3'],
    answer: 0,
    explanation: '9 - 4 = 5'
  }
];
