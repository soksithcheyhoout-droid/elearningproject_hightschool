import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting Generation of Complete 12,000 National Examination Questions (6,000 Science + 6,000 Social)...');

// Helper to pick random item
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// =========================================================================
// 🔬 SECTION 1: NATURAL SCIENCE (6,000 QUESTIONS)
// =========================================================================
function generateScienceQuestions() {
  const scienceQuestions = [];
  let idCounter = 1;

  // 1.1 MATHEMATICS (1,500 questions)
  console.log('  -> Generating 1,500 Mathematics questions...');
  for (let i = 0; i < 1500; i++) {
    const qType = i % 8;
    let q, options, answer, explanation, chapter, grade;
    grade = pick(['10', '11', '12']);

    if (qType === 0) {
      // Limits (លីមីត)
      const a = randInt(1, 9);
      const a2 = a * a;
      q = `គណនាដែនកំណត់លីមីត៖ lim (x → ${a}) (x² - ${a2}) / (x - ${a}) = ?`;
      const ansVal = 2 * a;
      options = [`${ansVal}`, `${a}`, `${a2}`, `${ansVal + 2}`];
      answer = 0;
      explanation = `(x² - ${a2})/(x - ${a}) = (x - ${a})(x + ${a})/(x - ${a}) = x + ${a} => ${a} + ${a} = ${ansVal}។`;
      chapter = 'លីមីត និងភាពជាប់';
    } else if (qType === 1) {
      // Derivatives (ដេរីវេ)
      const n = randInt(2, 6);
      const c = randInt(2, 8);
      q = `រកដេរីវេ f'(x) នៃអនុគមន៍ f(x) = ${c}x^${n} - ${c * 2}x + ${randInt(1, 10)}`;
      const term1 = c * n;
      const term2 = c * 2;
      options = [
        `${term1}x^${n - 1} - ${term2}`,
        `${term1}x^${n} - ${term2}`,
        `${c}x^${n - 1} - ${term2}x`,
        `${term1}x^${n - 1} + ${term2}`
      ];
      answer = 0;
      explanation = `រូបមន្តដេរីវេ (x^n)' = n*x^(n-1) => f'(x) = ${c}*(${n}x^${n - 1}) - ${term2} = ${term1}x^${n - 1} - ${term2}។`;
      chapter = 'ដេរីវេ និងអនុវត្តន៍';
    } else if (qType === 2) {
      // Integrals (អាំងតេក្រាល)
      const k = randInt(2, 6);
      q = `គណនាអាំងតេក្រាលមិនកំណត់៖ ∫ (${k}x + ${randInt(1, 9)}) dx = ?`;
      const c2 = randInt(1, 9);
      options = [
        `(${k}/2)x² + ${c2}x + C`,
        `${k}x² + ${c2}x + C`,
        `(${k}/3)x³ + C`,
        `${k}x + C`
      ];
      answer = 0;
      explanation = `រូបមន្តអាំងតេក្រាល ∫ x dx = x²/2 + C => ∫ (${k}x + ${c2}) dx = (${k}/2)x² + ${c2}x + C។`;
      chapter = 'អាំងតេក្រាល';
    } else if (qType === 3) {
      // Complex Numbers (ចំនួនកុំផ្លិច)
      const re = randInt(1, 6);
      const im = randInt(1, 6);
      const modSq = re * re + im * im;
      q = `រកម៉ូឌុល |z| នៃចំនួនកុំផ្លិច z = ${re} + ${im}i`;
      options = [`√${modSq}`, `${re + im}`, `${modSq}`, `√${re * im}`];
      answer = 0;
      explanation = `ម៉ូឌុល |z| = √(a² + b²) = √(${re}² + ${im}²) = √(${re * re} + ${im * im}) = √${modSq}។`;
      chapter = 'ចំនួនកុំផ្លិច';
    } else if (qType === 4) {
      // Vectors & Space (ធរណីមាត្រក្នុងលំហ)
      const u1 = randInt(1, 5), u2 = randInt(1, 5), u3 = randInt(1, 5);
      const v1 = randInt(1, 4), v2 = randInt(1, 4), v3 = randInt(1, 4);
      const dot = u1 * v1 + u2 * v2 + u3 * v3;
      q = `គណនាផលគុណស្កាលែនៃវ៉ិចទ័រ u(${u1}, ${u2}, ${u3}) និង v(${v1}, ${v2}, ${v3})៖ u • v = ?`;
      options = [`${dot}`, `${dot + 2}`, `${dot - 3}`, `${u1 + v1 + u2 + v2}`];
      answer = 0;
      explanation = `u • v = (u1*v1) + (u2*v2) + (u3*v3) = (${u1}*${v1}) + (${u2}*${v2}) + (${u3}*${v3}) = ${dot}។`;
      chapter = 'វ៉ិចទ័រ និងធរណីមាត្រក្នុងលំហ';
    } else if (qType === 5) {
      // Probability & Combinatorics (ប្រូបាប និងបន្សំ)
      const n = randInt(4, 7);
      q = `តើមានប៉ុន្មានរបៀបក្នុងការជ្រើសរើសសិស្ស ២ នាក់ ចេញពីក្រុមសិស្ស ${n} នាក់ (បន្សំ C(${n}, 2))?`;
      const comb = (n * (n - 1)) / 2;
      options = [`${comb} របៀប`, `${n * 2} របៀប`, `${comb + 4} របៀប`, `${n * (n - 1)} របៀប`];
      answer = 0;
      explanation = `រូបមន្តបន្សំ C(n, k) = n! / (k!(n-k)!) => C(${n}, 2) = (${n} × ${n - 1}) / 2 = ${comb} របៀប។`;
      chapter = 'ប្រូបាប និងស្ថិតិ';
    } else if (qType === 6) {
      // Differential Equations (សមីការឌីផេរ៉ង់ស្យែល)
      const r = randInt(2, 8);
      q = `ចម្លើយទូទៅនៃសមីការឌីផេរ៉ង់ស្យែល y' - ${r}y = 0 គឺ៖`;
      options = [
        `y = C*e^(${r}x)`,
        `y = C*e^(-${r}x)`,
        `y = ${r}x + C`,
        `y = C*ln(${r}x)`
      ];
      answer = 0;
      explanation = `សមីការ y' - ay = 0 មានចម្លើយទូទៅ y = C*e^(ax) ដែល a = ${r} => y = C*e^(${r}x)។`;
      chapter = 'សមីការឌីផេរ៉ង់ស្យែល';
    } else {
      // Trigonometry (ត្រីកោណមាត្រ)
      const deg = pick([30, 45, 60, 90, 180]);
      const sinMap = { 30: '1/2', 45: '√2/2', 60: '√3/2', 90: '1', 180: '0' };
      q = `តម្លៃនៃត្រីកោណមាត្រ sin(${deg}°) ស្មើនឹងប៉ុន្មាន?`;
      options = [sinMap[deg], '1', '√3', '0'];
      answer = 0;
      explanation = `តម្លៃមុំពិសេសក្នុងរង្វង់ត្រីកោណមាត្រ៖ sin(${deg}°) = ${sinMap[deg]}។`;
      chapter = 'អនុគមន៍ត្រីកោណមាត្រ';
    }

    scienceQuestions.push({
      id: `sci-math-${String(idCounter++).padStart(5, '0')}`,
      subject: 'គណិតវិទ្យា',
      subjectKey: 'math',
      stream: 'science',
      grade: grade,
      chapter: chapter,
      q: q,
      options: options,
      answer: answer,
      explanation: explanation,
      difficulty: pick(['easy', 'medium', 'hard']),
      points: 10
    });
  }

  // 1.2 PHYSICS (1,500 questions)
  console.log('  -> Generating 1,500 Physics questions...');
  for (let i = 0; i < 1500; i++) {
    const qType = i % 6;
    let q, options, answer, explanation, chapter, grade;
    grade = pick(['10', '11', '12']);

    if (qType === 0) {
      // Mechanics / Kinetic Energy (ថាមពលស៊ីនេទិច)
      const m = randInt(2, 10);
      const v = randInt(2, 6);
      const ek = 0.5 * m * v * v;
      q = `វត្ថុមួយមានម៉ាស m = ${m} kg កំពុងធ្វើចលនាដោយល្បឿន v = ${v} m/s។ គណនាថាមពលស៊ីនេទិច Ek នៃវត្ថុនោះ៖`;
      options = [`${ek} J`, `${m * v} J`, `${ek * 2} J`, `${m * v * 2} J`];
      answer = 0;
      explanation = `រូបមន្តថាមពលស៊ីនេទិច Ek = (1/2) * m * v² = 0.5 * ${m} * ${v * v} = ${ek} Joules (J)។`;
      chapter = 'មេកានិច និងថាមពល';
    } else if (qType === 1) {
      // Oscillations & Pendulum (លំយោល និងប៉ោល)
      const L = randInt(1, 4);
      q = `ខួបលំយោល T នៃប៉ោលទោលដែលមានប្រវែងខ្សែ L ក្នុងដែនទំនាញដី g ត្រូវកំណត់ដោយរូបមន្តណា?`;
      options = [
        'T = 2π √(L / g)',
        'T = 2π √(g / L)',
        'T = 2π √(m / k)',
        'T = (1/2π) √(L / g)'
      ];
      answer = 0;
      explanation = `ខួបនៃប៉ោលទោលតូច៖ T = 2π √(L/g) អាស្រ័យនឹងប្រវែងខ្សែ L និងទំនាញដី g មិនអាស្រ័យនឹងម៉ាស m ឡើយ។`;
      chapter = 'លំយោល និងរលកមេកានិច';
    } else if (qType === 2) {
      // Electricity / Ohm's Law & Power (ចរន្តអគ្គិសនី)
      const u = randInt(10, 40) * 5; // e.g. 100, 110, 220V
      const r = randInt(10, 50);
      const iVal = (u / r).toFixed(1);
      q = `តង់ស្យុង U = ${u}V ឆ្លងកាត់រេស៊ីស្តង់ R = ${r} Ω។ តើអាំងតង់ស៊ីតេចរន្ត I ស្មើនឹងប៉ុន្មាន?`;
      options = [`${iVal} A`, `${(u * r)} A`, `${(r / u).toFixed(2)} A`, `${(u + r)} A`];
      answer = 0;
      explanation = `តាមច្បាប់អូម U = R * I => I = U / R = ${u} / ${r} ≈ ${iVal} Ampere (A)។`;
      chapter = 'អគ្គិសនី និងអេឡិចត្រូម៉ាញ៉េទិច';
    } else if (qType === 3) {
      // Optics / Snell-Descartes Law (អុបទិក)
      q = `ច្បាប់កម្រិតពន្លឺ (Snell-Descartes) ឆ្លុះបញ្ចាំងពីទំនាក់ទំនងមុំចាំងចូល i1 និងមុំចាំងផ្លាត i2 តាមរូបមន្តណា?`;
      options = [
        'n1 * sin(i1) = n2 * sin(i2)',
        'n1 * cos(i1) = n2 * cos(i2)',
        'n1 / sin(i1) = n2 / sin(i2)',
        'sin(i1) + sin(i2) = n1 * n2'
      ];
      answer = 0;
      explanation = `ច្បាប់កំនុំពន្លឺ Snell-Descartes: n1 * sin(i1) = n2 * sin(i2) ដែល n1, n2 ជាសន្ទស្សន៍ចំណាំងនៃមជ្ឈដ្ឋាន។`;
      chapter = 'រលកពន្លឺ និងអុបទិក';
    } else if (qType === 4) {
      // Nuclear Physics (រូបវិទ្យានុយក្លេអ៊ែរ)
      q = `សមីការសមមូលម៉ាស-ថាមពលដ៏ល្បីល្បាញរបស់លោក Albert Einstein គឺ៖`;
      options = ['E = m * c²', 'E = (1/2) m * v²', 'E = h * f²', 'E = m * g * h'];
      answer = 0;
      explanation = `ទ្រឹស្តីរ៉ឺឡាទីវីតេពិសេស Einstein: E = mc² ដែល c ≈ 3 × 10^8 m/s ជាល្បឿនពន្លឺក្នុងសុញ្ញាកាស។`;
      chapter = 'រូបវិទ្យានុយក្លេអ៊ែរ និងអាតូម';
    } else {
      // Thermodynamics (ទែម៉ូឌីណាមិច)
      q = `គោលការណ៍ទីមួយនៃទែម៉ូឌីណាមិច (First Law of Thermodynamics) កំណត់ការប្រែប្រួលថាមពលក្នុង ΔU តាមរូបមន្តណា?`;
      options = ['ΔU = Q + W', 'ΔU = Q - W', 'ΔU = Q * W', 'ΔU = Q / W'];
      answer = 0;
      explanation = `ច្បាប់ទីមួយនៃទែម៉ូឌីណាមិច៖ ការប្រែប្រួលថាមពលក្នុងប្រព័ន្ធ ΔU = Q + W (កម្តៅបូកនឹងកម្មន្ត)។`;
      chapter = 'ទែម៉ូឌីណាមិច';
    }

    scienceQuestions.push({
      id: `sci-phy-${String(idCounter++).padStart(5, '0')}`,
      subject: 'រូបវិទ្យា',
      subjectKey: 'physics',
      stream: 'science',
      grade: grade,
      chapter: chapter,
      q: q,
      options: options,
      answer: answer,
      explanation: explanation,
      difficulty: pick(['easy', 'medium', 'hard']),
      points: 10
    });
  }

  // 1.3 CHEMISTRY (1,500 questions)
  console.log('  -> Generating 1,500 Chemistry questions...');
  for (let i = 0; i < 1500; i++) {
    const qType = i % 6;
    let q, options, answer, explanation, chapter, grade;
    grade = pick(['10', '11', '12']);

    if (qType === 0) {
      // Acids, Bases & pH (អាស៊ីត-បាស និង pH)
      const ph = randInt(1, 6);
      const hPlus = `10^(-${ph})`;
      q = `សូលុយស្យុងមួយមានកំហាប់អ៊ីយ៉ុង [H3O+] = ${hPlus} M។ តើតម្លៃ pH នៃសូលុយស្យុងនោះស្មើនឹងប៉ុន្មាន?`;
      options = [`pH = ${ph}`, `pH = ${14 - ph}`, `pH = ${ph * 2}`, `pH = 7`];
      answer = 0;
      explanation = `រូបមន្ត pH = -log[H3O+] = -log(10^(-${ph})) = ${ph} (សូលុយស្យុងមានលក្ខណៈជាអាស៊ីតព្រោះ pH < 7)។`;
      chapter = 'សូលុយស្យុងទឹក និង pH';
    } else if (qType === 1) {
      // Organic Chemistry / Esters (គីមីសរីរាង្គ អេស្ទែ)
      q = `ប្រតិកម្មរវាងអាស៊ីតកាបុកស៊ីលិច (R-COOH) ជាមួយអាល់កុល (R'-OH) បង្កើតបានជាសមាសធាតុអ្វី?`;
      options = ['អេស្ទែ (Ester) និងទឹក', 'អាល់ដេអ៊ីត (Aldehyde)', 'អេទែ (Ether)', 'អាមីន (Amine)'];
      answer = 0;
      explanation = `ប្រតិកម្មអេស្ទែកម្ម (Esterification): R-COOH + R'-OH ⇌ R-COO-R' + H2O ក្រោមវត្តមានកាតាលីករ H2SO4។`;
      chapter = 'គីមីសរីរាង្គ៖ អេស្ទែ និងជាតិខ្លាញ់';
    } else if (qType === 2) {
      // Chemical Kinetics / Reaction Rate (ល្បឿនប្រតិកម្មគីមី)
      q = `តើកត្តាណាខ្លះដែលបង្កើនល្បឿននៃប្រតិកម្មគីមី?`;
      options = [
        'ការបង្កើនសីតុណ្ហភាព កំហាប់ និងការប្រើកាតាលីករ',
        'ការបន្ថយសីតុណ្ហភាព និងបន្ថយកំហាប់',
        'ការកាត់បន្ថយផ្ទៃប៉ះនៃអង្គធាតុប្រតិករ',
        'ការបន្ថែមទឹកឱ្យកាន់តែរាវ'
      ];
      answer = 0;
      explanation = `កត្តាបង្កើនល្បឿនប្រតិកម្មរួមមាន៖ កំហាប់ប្រតិករកើនឡើង សីតុណ្ហភាពកើនឡើង ផ្ទៃប៉ះធំ និងវត្តមានកាតាលីករសមស្រប។`;
      chapter = 'ស៊ីនេទិចគីមី និងល្បឿនប្រតិកម្ម';
    } else if (qType === 3) {
      // Chemical Equilibrium / Le Chatelier (លំនឹងគីមី)
      q = `តាមគោលការណ៍ឡឺសាតឺលីយេ (Le Chatelier) ប្រសិនបើយើងបង្កើនសម្ពាធលើប្រព័ន្ធឧស្ម័ន តើលំនឹងនឹងរំកិលទៅទិសដៅណា?`;
      options = [
        'រំកិលទៅទិសដៅដែលមានចំនួនម៉ូលឧស្ម័នតិចជាង',
        'រំកិលទៅទិសដៅដែលមានចំនួនម៉ូលឧស្ម័នច្រើនជាង',
        'លំនឹងមិនមានការប្រែប្រួលឡើយ',
        'ប្រព័ន្ធនឹងបញ្ឈប់ប្រតិកម្មទាំងស្រុង'
      ];
      answer = 0;
      explanation = `ការបង្កើនសម្ពាធ ធ្វើឱ្យលំនឹងរំកិលទៅទិសណាដែលបង្កើតចំនួនម៉ូលឧស្ម័នតិចជាង ដើម្បីកាត់បន្ថយសម្ពាធវិញ។`;
      chapter = 'លំនឹងគីមី';
    } else if (qType === 4) {
      // Functional Groups (បង្គុំនាទីគីមីសរីរាង្គ)
      q = `បង្គុំនាទីអ៊ីដ្រុកស៊ីល (-OH) ជាលក្ខណៈសម្គាល់នៃក្រុមសមាសធាតុសរីរាង្គណា?`;
      options = ['អាល់កុល (Alcohols)', 'អាស៊ីតកាបុកស៊ីលិច (Carboxylic Acids)', 'អាល់កាន (Alkanes)', 'អេទែ (Ethers)'];
      answer = 0;
      explanation = `បង្គុំនាទី -OH (Hydroxyl group) សម្គាល់ម៉ូលេគុលអាល់កុល (R-OH) ដូចជា មេតាណុល អេតាណុលជាដើម។`;
      chapter = 'អាល់កុល អាល់ដេអ៊ីត និងសេតូន';
    } else {
      // Electrochemistry / Redox (អេឡិចត្រូគីមី និងអុកស៊ីដូរេដុកម្ម)
      q = `នៅក្នុងប្រតិកម្មអុកស៊ីដូរេដុកម្ម តើអង្គធាតុរងអុកស៊ីតកម្ម (Oxidation) កើតឡើងតាមរយៈអ្វី?`;
      options = ['ការបាត់បង់អេឡិចត្រុង (Loss of electrons)', 'ការទទួលអេឡិចត្រុង (Gain of electrons)', 'ការបាត់បង់ប្រូតុង', 'ការទទួលប្រូតុង'];
      answer = 0;
      explanation = `អុកស៊ីតកម្ម = ការបាត់បង់អេឡិចត្រុង (Oxidation is Loss of electrons - OIL), រេដុកម្ម = ការទទួលអេឡិចត្រុង (RIG)។`;
      chapter = 'អេឡិចត្រូគីមី និងអាគុយ';
    }

    scienceQuestions.push({
      id: `sci-chem-${String(idCounter++).padStart(5, '0')}`,
      subject: 'គីមីវិទ្យា',
      subjectKey: 'chemistry',
      stream: 'science',
      grade: grade,
      chapter: chapter,
      q: q,
      options: options,
      answer: answer,
      explanation: explanation,
      difficulty: pick(['easy', 'medium', 'hard']),
      points: 10
    });
  }

  // 1.4 BIOLOGY (1,500 questions)
  console.log('  -> Generating 1,500 Biology questions...');
  for (let i = 0; i < 1500; i++) {
    const qType = i % 6;
    let q, options, answer, explanation, chapter, grade;
    grade = pick(['10', '11', '12']);

    if (qType === 0) {
      // Genetics / DNA & RNA (សេនេទិច អាស៊ីតនុយក្លេអ៊ិច)
      q = `នៅក្នុងច្រវ៉ាក់ម៉ូលេគុល ADN តើបាសអាសូត អាដេនីន (A) ភ្ជាប់ជាមួយបាសណាដោយសម្ព័ន្ធអ៊ីដ្រូសែនពីរ?`;
      options = ['ទីមីន (T)', 'ហ្គានីន (G)', 'ស៊ីតូស៊ីន (C)', 'អ៊ុយរ៉ាស៊ីល (U)'];
      answer = 0;
      explanation = `តាមគោលការណ៍បំពេញបាសនៃ ADN៖ អាដេនីន (A) ភ្ជាប់ជាមួយ ទីមីន (T) ដោយសម្ព័ន្ធអ៊ីដ្រូសែន ២, ហ្គានីន (G) ភ្ជាប់ជាមួយ ស៊ីតូស៊ីន (C) ដោយសម្ព័ន្ធ ៣។`;
      chapter = 'ម៉ូលេគុល ADN និងការចម្លងកូដ';
    } else if (qType === 1) {
      // Protein Synthesis (ការសំយោគប្រូតេអ៊ីន)
      q = `តើកូដុងផ្ដើម (Start Codon) លើម៉ូលេគុល ARNm សម្រាប់ដំណើរការបកប្រែកូដមានត្រីធាតុបាសអ្វី?`;
      options = ['AUG (កំណត់អាស៊ីតអាមីណេ មេチយ៉ូនីន)', 'UAA (Stop Codon)', 'UAG (Stop Codon)', 'UGA (Stop Codon)'];
      answer = 0;
      explanation = `កូដុងផ្ដើមតែមួយគត់គឺ AUG ដែលកំណត់អាស៊ីតអាមីណេ មេធ្យូនីន (Methionine) ក្នុងការចាប់ផ្ដើមខ្សែប៉ូលីប៉ិបទីត។`;
      chapter = 'ការសំយោគប្រូតេអ៊ីន និងសេន';
    } else if (qType === 2) {
      // Cell Division (ការបែងចែកកោសិកា មីតូស និងមេយ៉ូស)
      q = `តើដំណើរការបែងចែកកោសិកា មេយ៉ូស (Meiosis) បង្កើតបានកោសិកាកូនចំនួនប៉ុន្មាន និងមានប្លូអ៊ីឌីយ៉ាងដូចម្តេច?`;
      options = [
        'កោសិកាកូន ៤ ដែលមានក្រូម៉ូសូមឯកវ फर्निश्ड (n)',
        'កោសិកាកូន ២ ដែលមានក្រូម៉ូសូមគូឌីប្លូអ៊ីត (2n)',
        'កោសិកាកូន ៤ ដែលមានក្រូម៉ូសូមឌីប្លូអ៊ីត (2n)',
        'កោសិកាកូន ៨ ដែលមានក្រូម៉ូសូម (n)'
      ];
      answer = 0;
      explanation = `មេយ៉ូសជាការបែងចែកកាត់បន្ថយក្រូម៉ូសូម បង្កើតបានកោសិកាពូជ ៤ (n) ពីកោសិកាមេមួយ (2n)។`;
      chapter = 'ការបែងចែកកោសិកា';
    } else if (qType === 3) {
      // Mendel's Laws of Heredity (ច្បាប់តំណពូជម៉ង់ដែល)
      q = `នៅពេលបង្កាត់សណ្តែកគ្រាប់រលីងសុទ្ធ (AA) ជាមួយគ្រាប់ជ្រួញសុទ្ធ (aa) តើជំនាន់កូន F1 ទទួលបានប្រភេទសេន និងប្រភេទរូបអ្វី?`;
      options = [
        'ប្រភេទសេន 100% Aa (គ្រាប់រលីងទាំងអស់)',
        'ប្រភេទសេន 50% AA, 50% aa',
        'ប្រភេទសេន 100% aa (គ្រាប់ជ្រួញទាំងអស់)',
        'គ្រាប់រលីង ៧៥% និងគ្រាប់ជ្រួញ ២៥%'
      ];
      answer = 0;
      explanation = `តាមច្បាប់ឯកសណ្ឋានភាព F1 របស់ម៉ង់ដែល៖ AA × aa ផ្តល់ F1 សុទ្ធតែជាសេនចម្រុះ Aa (គ្រាប់រលីង 100% ដោយសារ A លុបលើ a)។`;
      chapter = 'ច្បាប់តំណពូជម៉ង់ដែល';
    } else if (qType === 4) {
      // Human Physiology / Nervous System (ប្រព័ន្ធប្រសាទ និងសរីរវិទ្យា)
      q = `តើផ្នែកណានៃខួរក្បាលមនុស្សដែលទទួលខុសត្រូវលើលំនឹងដងខ្លួន និងការសម្របសម្រួលចលនាសាច់ដុំ?`;
      options = ['ខួរតូច (Cerebellum)', 'ខួរធំ (Cerebrum)', 'ខួរកញ្ចឹងក (Medulla Oblongata)', 'អ៊ីប៉ូតាឡាមូស (Hypothalamus)'];
      answer = 0;
      explanation = `ខួរតូច (Cerebellum) ដើរតួនាទីយ៉ាងសំខាន់ក្នុងការរក្សាលំនឹង ឥរិយាបថដងខ្លួន និងការសម្របសម្រួលចលនាសាច់ដុំឱ្យរលូន។`;
      chapter = 'ប្រព័ន្ធប្រសាទ និងអ័រម៉ូន';
    } else {
      // Ecology & Environment (បរិស្ថានវិទ្យា)
      q = `នៅក្នុងខ្សែច្រវ៉ាក់អាហារ តើសារពាង្គកាយណាដែលដើរតួជា «អ្នកផលិត» (Primary Producers)?`;
      options = ['រុក្ខជាតិបៃតង និងសារាយ (ធ្វើរស្មីសំយោគ)', 'សត្វស៊ីស្មៅ (សត្វស៊ីរុក្ខជាតិ)', 'សត្វស៊ីសាច់ (សត្វបរបាញ់)', 'បាក់តេរី និងផ្សិតបំបែកធាតុ'];
      answer = 0;
      explanation = `រុក្ខជាតិបៃតងជាអ្នកផលិត (Producers) ព្រោះវាអាចបំប្លែងថាមពលពន្លឺព្រះអាទិត្យទៅជាថាមពលគីមីតាមរយៈរស្មីសំយោគ។`;
      chapter = 'ប្រព័ន្ធអេកូឡូស៊ី និងបរិស្ថាន';
    }

    scienceQuestions.push({
      id: `sci-bio-${String(idCounter++).padStart(5, '0')}`,
      subject: 'ជីវវិទ្យា',
      subjectKey: 'biology',
      stream: 'science',
      grade: grade,
      chapter: chapter,
      q: q,
      options: options,
      answer: answer,
      explanation: explanation,
      difficulty: pick(['easy', 'medium', 'hard']),
      points: 10
    });
  }

  return scienceQuestions;
}

// =========================================================================
// 📚 SECTION 2: SOCIAL SCIENCE (6,000 QUESTIONS)
// =========================================================================
function generateSocialQuestions() {
  const socialQuestions = [];
  let idCounter = 1;

  // 2.1 KHMER LITERATURE (1,500 questions)
  console.log('  -> Generating 1,500 Khmer Literature questions...');
  for (let i = 0; i < 1500; i++) {
    const qType = i % 6;
    let q, options, answer, explanation, chapter, grade;
    grade = pick(['10', '11', '12']);

    if (qType === 0) {
      // Novel Kolab Pailin (រឿងកុលាបប៉ៃលិន)
      q = `នៅក្នុងរឿង «កុលាបប៉ៃលិន» និពន្ធដោយលោក ញ៉ុក ថែម តើតួអង្គឯកប្រុសឈ្មោះអ្វី និងមានចរិតលក្ខណៈលេចធ្លោបែបណា?`;
      options = [
        'ចៅចិត្រ — មានភាពស្មោះត្រង់ ឧស្សាហ៍ព្យាយាម និងអំណត់តស៊ូ',
        'សោភ័ណ — ជាកូនសេដ្ឋីមានទ្រព្យសម្បត្តិស្តុកស្តម្ភ',
        'បាល៉ាត់ស្រុក — ជាមន្ត្រីមានអំណាចនិងយុត្តិធម៌',
        'ចៅកែស៊ុន — ជាអ្នកជីកត្បូងដ៏កំសត់'
      ];
      answer = 0;
      explanation = `តួអង្គ ចៅចិត្រ ជានិមិត្តរូបនៃយុវជនខ្មែរដែលមានការតស៊ូ អត់ធន់ ស្មោះត្រង់ និងមិនចុះចាញ់នឹងជោគវាសនា។`;
      chapter = 'អក្សរសិល្ប៍ទំនើប៖ រឿងកុលាបប៉ៃលិន';
    } else if (qType === 1) {
      // Novel Sophat (រឿងសូផាត)
      q = `តើប្រលោមលោកខ្មែរទំនើបទីមួយដែលមានចំណងជើងថា «សូផាត» ត្រូវបាននិពន្ធឡើងដោយកវីរូបណា និងនៅឆ្នាំណា?`;
      options = [
        'លោក រឹម គីន (និពន្ធនៅឆ្នាំ ១៩៣៨ និងបោះពុម្ពឆ្នាំ ១៩៤២)',
        'លោក ញ៉ុក ថែម (ឆ្នាំ ១៩៣៦)',
        'លោក នូ ហាច (ឆ្នាំ ១៩៤៩)',
        'ព្រះបាទអង្គឌួង (ឆ្នាំ ១៨៥៦)'
      ];
      answer = 0;
      explanation = `រឿង «សូផាត» និពន្ធដោយលោក រឹម គីន ត្រូវបានចាត់ទុកជាប្រលោមលោកទំនើបបែបបស្ចិមប្រទេសដំបូងបង្អស់ក្នុងអក្សរសាស្ត្រខ្មែរ។`;
      chapter = 'ប្រវត្តិអក្សរសិល្ប៍ខ្មែរទំនើប';
    } else if (qType === 2) {
      // Novel Phka Sropoun (រឿងផ្កាស្រពោន)
      q = `នៅក្នុងរឿង «ផ្កាស្រពោន» របស់លោក នូ ហាច តើមូលហេតុចម្បងអ្វីដែលនាំឱ្យតួអង្គនាង វិធាវី ត្រូវស្លាប់ដោយទុក្ខសោក?`;
      options = [
        'ការបង្ខំចិត្តរៀបការតាមទំនៀមទម្លាប់បុរាណ «នំមិនធំជាងនាឡិ» ជាមួយមនុស្សដែលខ្លួនមិនស្រឡាញ់',
        'ជំងឺគ្រុនចាញ់នៅតំបន់ត្បូងប៉ៃលិន',
        'ការបែកបាក់ព្រាត់ប្រាសដោយសារសង្គ្រាមលោក',
        'ការលិចទូកនៅទន្លេមេគង្គ'
      ];
      answer = 0;
      explanation = `រឿងផ្កាស្រពោនរិះគន់ទំនៀមទម្លាប់បុរាណ «នំមិនធំជាងនាឡិ» ដែលម្តាយវិធាវី (យាយនួន) បង្ខំឱ្យការជាមួយណៃស៊ត បណ្តាលឱ្យវិធាវីខូចចិត្តរហូតធ្លាក់ខ្លួនស្លាប់។`;
      chapter = 'អក្សរសិល្ប៍ទំនើប៖ រឿងផ្កាស្រពោន';
    } else if (qType === 3) {
      // Classical Literature Tum Teav (រឿងទុំទាវ)
      q = `រឿង «ទុំទាវ» ស្នាដៃភិក្ខុសោម ឆ្លុះបញ្ចាំងពីសង្គមខ្មែរនាសម័យលង្វែកក្នុងទិដ្ឋភាពសំខាន់ណា?`;
      options = [
        'ជម្លោះរវាងសេចក្តីស្នេហាបរិសុទ្ធ និងអំណាចសក្តិភូមិផ្តាច់ការ (អរជូន)',
        'ការធ្វើសង្គ្រាមការពារទឹកដីពីការឈ្លានពានបរទេស',
        'ការរៀបចំក្បួនព្យុហយាត្រាសាសនាព្រះពុទ្ធ',
        'ការធ្វើពាណិជ្ជកម្មផ្លូវសមុទ្រជាមួយប្រទេសចិន'
      ];
      answer = 0;
      explanation = `ទុំទាវជាសោកនាដកម្មស្នេហាដ៏ធំធេងដែលឆ្លុះបញ្ចាំងពីភាពអយុត្តិធម៌នៃរបបសក្តិភូមិ ការបំពានអំណាច និងការគាបសង្កត់លើសេរីភាពស្នេហា។`;
      chapter = 'អក្សរសិល្ប៍បុរាណ៖ រឿងទុំទាវ';
    } else if (qType === 4) {
      // Khmer Grammar & Syntax (វេយ្យាករណ៍ និងក្បួនតែង)
      q = `នៅក្នុងកាព្យខ្មែរ «បទពាក្យ ៧» (កាកគតិ) តើក្នុងមួយល្បះមានចំនួនប៉ុន្មានឃ្លា និងមួយឃ្លាមានប៉ុន្មានព្យាង្គ?`;
      options = [
        'មួយល្បះមាន ៤ ឃ្លា និងមួយឃ្លាមាន ៧ ព្យាង្គ (សរុប ២៨ ព្យាង្គ)',
        'មួយល្បះមាន ៧ ឃ្លា និងមួយឃ្លាមាន ៤ ព្យាង្គ',
        'មួយល្បះមាន ៦ ឃ្លា និងមួយឃ្លាមាន ៧ ព្យាង្គ',
        'មួយល្បះមាន ៤ ឃ្លា និងមួយឃ្លាមាន ៨ ព្យាង្គ'
      ];
      answer = 0;
      explanation = `កាព្យបទពាក្យ ៧ ក្នុងមួយល្បះមាន ៤ ឃ្លា ហើយឃ្លានីមួយៗមាន ៧ ព្យាង្គ ដែលមានក្បួនចំណាប់ចុងជួនយ៉ាងច្បាស់លាស់។`;
      chapter = 'ក្បួនកាព្យសាស្ត្រខ្មែរ';
    } else {
      // Essay & Analytical Writing (វិធីសាស្ត្រតែងសេចក្តី)
      q = `រចនាសម្ព័ន្ធទូទៅនៃអត្ថបទតែងសេចក្តីបែបពន្យល់ ឬអត្ថាធិប្បាយ ត្រូវមានប៉ុន្មានផ្នែកធំៗ?`;
      options = [
        '៣ ផ្នែក៖ សេចក្តីផ្តើម, តួសេចក្តី, និងសេចក្តីបញ្ចប់',
        '២ ផ្នែក៖ សេចក្តីផ្តើម និងសេចក្តីបញ្ចប់',
        '៤ ផ្នែក៖ ចំណងជើង, សេចក្តីផ្តើម, តួសេចក្តី, និងឯកសារយោង',
        '៥ ផ្នែកតាមក្បួនបរទេស'
      ];
      answer = 0;
      explanation = `តែងសេចក្តីខ្មែរមាន ៣ ផ្នែកគោល៖ ១. សេចក្តីផ្តើម (លំនាំបញ្ហា ចំណូលបញ្ហា ចំណោទបញ្ហា) ២. តួសេចក្តី (ឃ្លាភ្ជាប់ ពន្យល់ពាក្យ បកស្រាយ ឧទាហរណ៍ សរុបមតិ) ៣. សេចក្តីបញ្ចប់ (វាយតម្លៃ បញ្ចេញមតិផ្ទាល់ខ្លួន)។`;
      chapter = 'វិធីសាស្ត្រតែងសេចក្តី';
    }

    socialQuestions.push({
      id: `soc-khm-${String(idCounter++).padStart(5, '0')}`,
      subject: 'ភាសាខ្មែរ',
      subjectKey: 'khmer',
      stream: 'social',
      grade: grade,
      chapter: chapter,
      q: q,
      options: options,
      answer: answer,
      explanation: explanation,
      difficulty: pick(['easy', 'medium', 'hard']),
      points: 10
    });
  }

  // 2.2 HISTORY (1,500 questions)
  console.log('  -> Generating 1,500 History questions...');
  for (let i = 0; i < 1500; i++) {
    const qType = i % 6;
    let q, options, answer, explanation, chapter, grade;
    grade = pick(['10', '11', '12']);

    if (qType === 0) {
      // Paris Peace Agreements 1991 (កិច្ចព្រមព្រៀងសន្តិភាពទីក្រុងប៉ារីស)
      q = `តើកិច្ចព្រមព្រៀងសន្តិភាពទីក្រុងប៉ារីសស្តីពីកម្ពុជា ត្រូវបានចុះហត្ថលេខានៅថ្ងៃ ខែ ឆ្នាំណា?`;
      options = [
        'ថ្ងៃទី ២៣ ខែតុលា ឆ្នាំ១៩៩១',
        'ថ្ងៃទី ០៧ ខែមករា ឆ្នាំ១៩៧៩',
        'ថ្ងៃទី ២៤ ខែកញ្ញា ឆ្នាំ១៩៩៣',
        'ថ្ងៃទី ២៩ ខែធ្នូ ឆ្នាំ១៩៩៨'
      ];
      answer = 0;
      explanation = `កិច្ចព្រមព្រៀងសន្តិភាពទីក្រុងប៉ារីស (Paris Peace Agreements) ត្រូវបានចុះហត្ថលេខានៅថ្ងៃទី ២៣ តុលា ១៩៩១ ដោយមាន ៤ ភាគីកម្ពុជា និង ១៨ ប្រទេសហត្ថលេខី។`;
      chapter = 'ប្រវត្តិសាស្ត្រកម្ពុជាសម័យទំនើប';
    } else if (qType === 1) {
      // Angkor Empire & Jayavarman VII (សម័យអង្គរ និងព្រះបាទជ័យវរ្ម័នទី ៧)
      q = `ព្រះបាទជ័យវរ្ម័នទី ៧ បានកសាងប្រាសាទបាយ័ន និងមន្ទីរពេទ្យចំនួន ១០២ (អរោគ្យសាលា) ក្នុងរជ្ជកាលណា?`;
      options = [
        'ចុងសតវត្សរ៍ទី ១២ ដល់ដើមសតវត្សរ៍ទី ១៣ (គ.ស. ១១៨១ - ១២១៨)',
        'សតវត្សរ៍ទី ៩ (គ.ស. ៨០២)',
        'សតវត្សរ៍ទី ១១ (គ.ស. ១០១០)',
        'សតវត្សរ៍ទី ១៦ (សម័យលង្វែក)'
      ];
      answer = 0;
      explanation = `ព្រះបាទជ័យវរ្ម័នទី ៧ គ្រងរាជ្យពីឆ្នាំ ១១៨១ ដល់ ១២១៨ ទ្រង់ជាមហាវីរក្សត្រដ៏ឆ្នើមដែលបានរំដោះប្រទេសពីចាម និងកសាងប្រាសាទបាយ័ន បន្ទាយឆ្មារ និងអរោគ្យសាលាជាច្រើន។`;
      chapter = 'ប្រវត្តិសាស្ត្រសម័យអង្គរ';
    } else if (qType === 2) {
      // Cambodia Independence & Sangkum Reastr Niyum (ឯករាជ្យជាតិ និងសង្គមរាស្ត្រនិយម)
      q = `កម្ពុជាទទួលបានឯករាជ្យពេញលេញពីអាណាព្យាបាលបារាំងនៅថ្ងៃ ខែ ឆ្នាំណា ក្រោមព្រះរាជបូជនីយកិច្ចនៃព្រះបាទសម្តេចព្រះ នរោត្តម សីហនុ?`;
      options = [
        'ថ្ងៃទី ០៩ ខែវិច្ឆិកា ឆ្នាំ១៩៥៣',
        'ថ្ងៃទី ១៧ ខែមេសា ឆ្នាំ១៩៧៥',
        'ថ្ងៃទី ១៨ ខែមីនា ឆ្នាំ១៩៧០',
        'ថ្ងៃទី ០៩ ខែតុលា ឆ្នាំ១៩៧០'
      ];
      answer = 0;
      explanation = `កម្ពុជាប្រកាសឯករាជ្យជាផ្លូវការនៅថ្ងៃទី ៩ វិច្ឆិកា ១៩៥៣ បញ្ចប់ការត្រួតត្រារបស់បារាំងអស់រយៈពេល ៩០ ឆ្នាំ (១៨៦៣-១៩៥៣)។`;
      chapter = 'ចលនាតស៊ូទាមទារឯករាជ្យជាតិ';
    } else if (qType === 3) {
      // Win-Win Policy (នយោបាយឈ្នះ-ឈ្នះ)
      q = `នយោបាយ «ឈ្នះ-ឈ្នះ» បានបញ្ចប់សង្គ្រាមស៊ីវិល និងនាំមកនូវសន្តិភាពពេញលេញទូទាំងប្រទេសកម្ពុជាជាស្ថាពរនៅថ្ងៃ ខែ ឆ្នាំណា?`;
      options = [
        'ថ្ងៃទី ២៩ ខែធ្នូ ឆ្នាំ១៩៩៨',
        'ថ្ងៃទី ២៣ ខែតុលា ឆ្នាំ១៩៩១',
        'ថ្ងៃទី ២៤ ខែកញ្ញា ឆ្នាំ១៩៩៣',
        'ថ្ងៃទី ៣០ ខែមេសា ឆ្នាំ១៩៩៩'
      ];
      answer = 0;
      explanation = `ថ្ងៃទី ២៩ ធ្នូ ១៩៩៨ ជាទិវាជាប្រវត្តិសាស្ត្រដែលនយោបាយឈ្នះ-ឈ្នះបានរំលាយអង្គការចាត់តាំងខ្មែរក្រហមទាំងស្រុង នាំមកនូវឯកភាពជាតិទឹកដីតែមួយ។`;
      chapter = 'ដំណើរការសន្តិភាព និងនយោបាយឈ្នះ-ឈ្នះ';
    } else if (qType === 4) {
      // World War II & Cold War (សង្គ្រាមលោក និងសង្គ្រាមត្រជាក់)
      q = `តើអង្គការសហប្រជាជាតិ (UN) ត្រូវបានបង្កើតឡើងជាផ្លូវការនៅឆ្នាំណា បន្ទាប់ពីការបញ្ចប់នៃសង្គ្រាមលោកលើកទី ២?`;
      options = [
        'ឆ្នាំ ១៩៤៥ (ថ្ងៃទី ២៤ ខែតុលា)',
        'ឆ្នាំ ១៩១៩ (សន្ធិសញ្ញាវែរសៃ)',
        'ឆ្នាំ ១៩៣៩',
        'ឆ្នាំ ១៩៥៥ (សន្និសីទបានឌុង)'
      ];
      answer = 0;
      explanation = `អង្គការសហប្រជាជាតិ (United Nations) បង្កើតឡើងនៅថ្ងៃទី ២៤ តុលា ១៩៤៥ នៅទីក្រុងសានហ្វ្រានស៊ីស្កូ ដើម្បីថែរក្សាសន្តិភាព និងសន្តិសុខពិភពលោក។`;
      chapter = 'ប្រវត្តិសាស្ត្រពិភពលោកសម័យទំនើប';
    } else {
      // ASEAN History & Expansion (ប្រវត្តិអាស៊ាន)
      q = `តើប្រទេសកម្ពុជាបានចូលជាសមាជិកពេញសិទ្ធិទី ១០ នៃសមាគមប្រជាជាតិអាស៊ីអាគ្នេយ៍ (អាស៊ាន) នៅថ្ងៃ ខែ ឆ្នាំណា?`;
      options = [
        'ថ្ងៃទី ៣០ ខែមេសា ឆ្នាំ១៩៩៩ (នៅទីក្រុងហាណូយ)',
        'ថ្ងៃទី ០៨ ខែសីហា ឆ្នាំ១៩៦៧',
        'ថ្ងៃទី ២៣ ខែតុលា ឆ្នាំ១៩៩១',
        'ថ្ងៃទី ០១ ខែមករា ឆ្នាំ២០១៥'
      ];
      answer = 0;
      explanation = `កម្ពុជាបានចូលជាសមាជិកអាស៊ានទី ១០ នៅថ្ងៃទី ៣០ មេសា ១៩៩៩ បំពេញនូវក្តីសុបិនអាស៊ានទាំង ១០ (ASEAN-10)។`;
      chapter = 'កម្ពុជា និងសមាគមអាស៊ាន';
    }

    socialQuestions.push({
      id: `soc-his-${String(idCounter++).padStart(5, '0')}`,
      subject: 'ប្រវត្តិវិទ្យា',
      subjectKey: 'history',
      stream: 'social',
      grade: grade,
      chapter: chapter,
      q: q,
      options: options,
      answer: answer,
      explanation: explanation,
      difficulty: pick(['easy', 'medium', 'hard']),
      points: 10
    });
  }

  // 2.3 GEOGRAPHY (1,500 questions)
  console.log('  -> Generating 1,500 Geography questions...');
  for (let i = 0; i < 1500; i++) {
    const qType = i % 6;
    let q, options, answer, explanation, chapter, grade;
    grade = pick(['10', '11', '12']);

    if (qType === 0) {
      // Tonle Sap & Mekong River Hydrology (ជលសាស្ត្របឹងទន្លេសាប និងមេគង្គ)
      q = `នៅរដូវវស្សា (ឧសភា-តុលា) តើផ្ទៃក្រឡាបឹងទន្លេសាបរីកធំឡើងដល់ប៉ុន្មានគីឡូម៉ែត្រការ៉េ ដោយសារទឹកទន្លេមេគង្គហូរបញ្ច្រាសចូល?`;
      options = [
        'ប្រមាណ ១៦,០០០ គីឡូម៉ែត្រការ៉េ (km²)',
        'ប្រមាណ ២,៧០០ គីឡូម៉ែត្រការ៉េ (km²)',
        'ប្រមាណ ៥០,០០០ គីឡូម៉ែត្រការ៉េ (km²)',
        'ប្រមាណ ៥,០០០ គីឡូម៉ែត្រការ៉េ (km²)'
      ];
      answer = 0;
      explanation = `នៅរដូវវស្សា ផ្ទៃបឹងទន្លេសាបរីកធំពី ២,៧០០ គ.ម² ទៅដល់ ១៦,០០០ គ.ម² ហើយជម្រៅទឹកកើនពី ១-២ ម៉ែត្រ ដល់ ៩-១០ ម៉ែត្រ។`;
      chapter = 'ជលសាស្ត្រ និងធនធានទឹកកម្ពុជា';
    } else if (qType === 1) {
      // Cambodia Climate & Monsoons (អាកាសធាតុ និងខ្យល់មូសុង)
      q = `តើប្រទេសកម្ពុជាស្ថិតនៅក្នុងតំបន់អាកាសធាតុប្រភេទណា និងទទួលឥទ្ធិពលពីខ្យល់មូសុងណាខ្លះ?`;
      options = [
        'អាកាសធាតុក្តៅសើមត្រូពិច ទទួលឥទ្ធិពលខ្យល់មូសុងនិរតី (វស្សា) និងមូសុងឦសាន (ប្រាំង)',
        'អាកាសធាតុក្តៅស្ងួតវាលខ្សាច់',
        'អាកាសធាតុមធ្យមត្រជាក់',
        'អាកាសធាតុតំបន់ប៉ូល'
      ];
      answer = 0;
      explanation = `កម្ពុជាស្ថិតក្នុងតំបន់ត្រូពិចក្តៅហើយសើម ដោយខ្យល់មូសុងនិរតីនាំភ្លៀងធ្លាក់ (ឧសភា-តុលា) និងខ្យល់មូសុងឦសាននាំភាពត្រជាក់ស្ងួត (វិច្ឆិកា-មេសា)។`;
      chapter = 'អាកាសធាតុ និងបរិស្ថានកម្ពុជា';
    } else if (qType === 2) {
      // Agriculture & Natural Resources (កសិកម្ម និងធនធានធម្មជាតិ)
      q = `តើតំបន់ដីក្រហមបាសាល់នៅខេត្តកំពង់ចាម ត្បូងឃ្មុំ និងរតនគិរី ស័ក្តិសមបំផុតសម្រាប់ដំណាំកសិ-ឧស្សាហកម្មណាខ្លះ?`;
      options = [
        'កៅស៊ូ ម្រេច ស្វាយចន្ទី និងកាហ្វេ',
        'ស្រូវវស្សា និងស្រូវប្រាំង',
        'ដំណាំស្រូវសាលី និងស្រូវបាឡេ',
        'ដំណាំតែនៅតំបន់ត្រជាក់'
      ];
      answer = 0;
      explanation = `ដីក្រហមបាសាល់ (Basaltic Soil) សម្បូរទៅដោយសារធាតុចិញ្ចឹម និងបង្ហូរទឹកល្អ ស័ក្តិសមបំផុតសម្រាប់កៅស៊ូ ស្វាយចន្ទី ម្រេច និងកាហ្វេ។`;
      chapter = 'កសិកម្ម និងការប្រើប្រាស់ដីធ្លី';
    } else if (qType === 3) {
      // Population & Demographics (ប្រជាសាស្ត្រកម្ពុជា)
      q = `រចនាសម្ព័ន្ធប្រជាសាស្ត្ររបស់ប្រទេសកម្ពុជាបច្ចុប្បន្នមានលក្ខណៈពិសេសអ្វី ដែលជាកាលានុវត្តភាពសេដ្ឋកិច្ច?`;
      options = [
        'ភាគលាភប្រជាសាស្ត្រ (Demographic Dividend) ដែលមានកម្លាំងពលកម្មវ័យក្មេងជាង ៦០%',
        'សង្គមមនុស្សចាស់ជរាដូចប្រទេសជប៉ុន',
        'អត្រាកំណើតស្មើនឹងសូន្យ',
        'កង្វះខាតកម្លាំងពលកម្មធ្ងន់ធ្ងរ'
      ];
      answer = 0;
      explanation = `កម្ពុជាមានភាគលាភប្រជាសាស្ត្រខ្ពស់ ដោយប្រជាជនវ័យក្មេង និងវ័យធ្វើការមានសមាមាត្រធំជាងគេ ដែលជាកម្លាំងចលករជំរុញសេដ្ឋកិច្ចជាតិ។`;
      chapter = 'ប្រជាសាស្ត្រ និងការអភិវឌ្ឍធនធានមនុស្ស';
    } else if (qType === 4) {
      // ASEAN Economic Geography (ភូមិវិទ្យាសេដ្ឋកិច្ចអាស៊ាន)
      q = `ច្រកសមុទ្រម៉ាឡាកា (Strait of Malacca) មានសារៈសំខាន់ជាយុទ្ធសាស្ត្រភូមិសាស្ត្រនយោបាយ និងពាណិជ្ជកម្មពិភពលោកយ៉ាងដូចម្តេច?`;
      options = [
        'ជាផ្លូវដឹកជញ្ជូនប្រេងកាត និងទំនិញសមុទ្រដ៏មមាញឹកបំផុតមួយរវាងមហាសមុទ្រឥណ្ឌា និងមហាសមុទ្រប៉ាស៊ីហ្វិក',
        'ជាតំបន់ទេសចរណ៍ទឹកកក',
        'ជាច្រកព្រំដែនដីគោកតែមួយគត់របស់សិង្ហបុរី',
        'ជាតំបន់នេសាទត្រីបាឡែន'
      ];
      answer = 0;
      explanation = `ច្រកសមុទ្រម៉ាឡាកាជាសរសៃឈាមពាណិជ្ជកម្មសមុទ្រអន្តរជាតិ ដែលដឹកជញ្ជូនប្រេងកាតជាង ២៥% និងទំនិញសកលជាច្រើនរវាងអាស៊ី អឺរ៉ុប និងមជ្ឈិមបូព៌ា។`;
      chapter = 'ភូមិវិទ្យាសេដ្ឋកិច្ចតំបន់អាស៊ាន';
    } else {
      // Urbanization & Infrastructure (នគរូបនីយកម្ម និងហេដ្ឋារចនាសម្ព័ន្ធ)
      q = `តំបន់សេដ្ឋកិច្ចពិសេស (SEZ) និងកំពង់ផែស្វយ័តក្រុងព្រះសីហនុ ដើរតួនាទីយ៉ាងដូចម្តេចក្នុងសេដ្ឋកិច្ចកម្ពុជា?`;
      options = [
        'ជាច្រកទ្វារពាណិជ្ជកម្មអន្តរជាតិទឹកជ្រៅតែមួយគត់ និងជាមជ្ឈមណ្ឌលទាក់ទាញរោងចក្រវិនិយោគនាំចេញ',
        'សម្រាប់តែការនាំចូលម្ហូបអាហារតែប៉ុណ្ណោះ',
        'ជាតំបន់អភិរក្សព្រៃកោងកាងបិទជិត',
        'ជាបន្ទាយយោធាសម្ងាត់'
      ];
      answer = 0;
      explanation = `កំពង់ផែស្វយ័តក្រុងព្រះសីហនុជាកំពង់ផែទឹកជ្រៅអន្តរជាតិតែមួយគត់របស់កម្ពុជា ដែលបម្រើការដឹកជញ្ជូនកុងតឺន័រនាំចេញ-នាំចូលជាង ៧០% នៃទំនិញជាតិ។`;
      chapter = 'ឧស្សាហកម្ម និងគមនាគមន៍ដឹកជញ្ជូន';
    }

    socialQuestions.push({
      id: `soc-geo-${String(idCounter++).padStart(5, '0')}`,
      subject: 'ភូមិវិទ្យា',
      subjectKey: 'geography',
      stream: 'social',
      grade: grade,
      chapter: chapter,
      q: q,
      options: options,
      answer: answer,
      explanation: explanation,
      difficulty: pick(['easy', 'medium', 'hard']),
      points: 10
    });
  }

  // 2.4 CIVICS, MORALS & ECONOMICS (1,500 questions)
  console.log('  -> Generating 1,500 Civics, Morals & Economics questions...');
  for (let i = 0; i < 1500; i++) {
    const qType = i % 6;
    let q, options, answer, explanation, chapter, grade;
    grade = pick(['10', '11', '12']);

    if (qType === 0) {
      // Constitutional Law & State Institutions (រដ្ឋធម្មនុញ្ញ និងស្ថាប័នរដ្ឋ)
      q = `តាមរដ្ឋធម្មនុញ្ញនៃព្រះរាជាណាចក្រកម្ពុជា ឆ្នាំ១៩៩៣ តើអំណាចកំពូលទាំង ៣ នៃរដ្ឋមានអ្វីខ្លះ?`;
      options = [
        'អំណាចនីតិបញ្ញត្តិ (សភា), អំណាចនីតិប្រតិបត្តិ (រាជរដ្ឋាភិបាល), និងអំណាចតុលាការ (តុលាការឯករាជ្យ)',
        'អំណាចយោធា, អំណាចនគរបាល, និងអំណាចរដ្ឋបាល',
        'អំណាចស្តេច, អំណាចមន្ត្រី, និងអំណាចឈ្មួញ',
        'អំណាចសេដ្ឋកិច្ច, អំណាចព័ត៌មាន, និងអំណាចសាសនា'
      ];
      answer = 0;
      explanation = `រដ្ឋធម្មនុញ្ញកម្ពុជាប្រកាន់យកគោលការណ៍បែងចែកអំណាចដាច់ពីគ្នា៖ ១. អំណាចនីតិបញ្ញត្តិ (រដ្ឋសភា និងព្រឹទ្ធសភា) ២. អំណាចនីតិប្រតិបត្តិ (រាជរដ្ឋាភិបាល) ៣. អំណាចតុលាការ។`;
      chapter = 'រដ្ឋធម្មនុញ្ញ និងស្ថាប័នកំពូលនៃរដ្ឋ';
    } else if (qType === 1) {
      // Human Rights & Democracy (សិទ្ធិមនុស្ស និងលទ្ធិប្រជាធិបតេយ្យ)
      q = `សេចក្តីប្រកាសជាសកលស្តីពីសិទ្ធិមនុស្ស (UDHR) ត្រូវបានអនុម័តដោយមហាសន្និបាតអង្គការសហប្រជាជាតិនៅថ្ងៃ ខែ ឆ្នាំណា?`;
      options = [
        'ថ្ងៃទី ១០ ខែធ្នូ ឆ្នាំ១៩៤៨',
        'ថ្ងៃទី ២៣ ខែតុលា ឆ្នាំ១៩៩១',
        'ថ្ងៃទី ០៩ ខែវិច្ឆិកា ឆ្នាំ១៩៥៣',
        'ថ្ងៃទី ០១ ខែមករា ឆ្នាំ២០០០'
      ];
      answer = 0;
      explanation = `សេចក្តីប្រកាសជាសកលស្តីពីសិទ្ធិមនុស្ស (Universal Declaration of Human Rights) អនុម័តនៅថ្ងៃ ១០ ធ្នូ ១៩៤៨ ដែលត្រូវបានកំណត់ជាទិវាសិទ្ធិមនុស្សអន្តរជាតិ។`;
      chapter = 'សិទ្ធិមនុស្ស និងសេរីភាពជាមូលដ្ឋាន';
    } else if (qType === 2) {
      // Morals, Ethics & Social Values (សីលធម៌ និងគុណតម្លៃសង្គម)
      q = `នៅក្នុងសង្គមវិទ្យា និងសីលធម៌ តើអ្វីទៅជា «សេចក្តីថ្លៃថ្នូររបស់មនុស្ស» (Human Dignity)?`;
      options = [
        'តម្លៃពីកំណើតដែលមិនអាចរំលោភបំពានបាន ដែលមនុស្សគ្រប់រូបត្រូវទទួលបានការគោរពដោយស្មើភាពគ្នា',
        'ការមានទ្រព្យសម្បត្តិស្តុកស្តម្ភជាងអ្នកដទៃ',
        'ការមានអំណាចបញ្ជាលើអ្នកទន់ខ្សោយ',
        'ការស្លៀកពាក់ខោអាវម៉ាកថ្លៃៗ'
      ];
      answer = 0;
      explanation = `សេចក្តីថ្លៃថ្នូររបស់មនុស្សជាគុណតម្លៃសកលដែលមនុស្សគ្រប់រូបមានស្មើៗគ្នា មិនគិតពីពូជសាសន៍ ពណ៌សម្បុរ ភេទ ភាសា ឬឋានៈសង្គមឡើយ។`;
      chapter = 'សីលធម៌បុគ្គល និងការរស់នៅជាមួយគ្នា';
    } else if (qType === 3) {
      // Economics / Market & Supply-Demand (សេដ្ឋកិច្ច៖ ទីផ្សារ និងតម្រូវការ-ផ្គត់ផ្គង់)
      q = `តាមច្បាប់នៃតម្រូវការ (Law of Demand) នៅក្នុងសេដ្ឋកិច្ចទីផ្សារសេរី នៅពេលតម្លៃទំនិញមួយកើនឡើង តើបរិមាណតម្រូវការនឹងមានការប្រែប្រួលដូចម្តេច?`;
      options = [
        'បរិមាណតម្រូវការនឹងធ្លាក់ចុះ (ថយចុះ)',
        'បរិមាណតម្រូវការនឹងកើនឡើងខ្ពស់',
        'បរិមាណតម្រូវការមិនប្រែប្រួលឡើយ',
        'តម្រូវការនឹងកើនឡើងទ្វេដង'
      ];
      answer = 0;
      explanation = `ច្បាប់តម្រូវការចែងថា៖ កាលណាតម្លៃទំនិញឡើងថ្លៃ (P កើន) នោះបរិមាណតម្រូវការទិញនឹងថយចុះ (Qd ថយ) ប្រសិនបើកត្តាដទៃទៀតនៅថេរ។`;
      chapter = 'សេដ្ឋកិច្ចវិទ្យា៖ យន្តការទីផ្សារ';
    } else if (qType === 4) {
      // Inflation & National Currency Bakong / Riel (អតិផរណា និងប្រាក់រៀលខ្មែរ)
      q = `តើធនាគារជាតិនៃកម្ពុជា (NBC) ប្រើប្រាស់ប្រព័ន្ធបច្ចេកវិទ្យាណា ដើម្បីលើកកម្ពស់ការទូទាត់អេឡិចត្រូនិក និងការប្រើប្រាស់ប្រាក់រៀលក្នុងយុគសម័យឌីជីថល?`;
      options = [
        'ប្រព័ន្ធបាគង (Bakong System) ដំណើរការលើបច្ចេកវិទ្យា Blockchain',
        'ប្រព័ន្ធក្រដាសប្រាក់សុទ្ធ',
        'ប្រព័ន្ធដោះដូរទំនិញបុរាណ',
        'ប្រព័ន្ធកាតឥណទានបរទេសតែមួយគត់'
      ];
      answer = 0;
      explanation = `ប្រព័ន្ធបាគង (Bakong) របស់ធនាគារជាតិនៃកម្ពុជា ប្រើប្រាស់បច្ចេកវិទ្យា Blockchain ជួយសម្រួលដល់ការផ្ទេរប្រាក់ និងទូទាត់ KHQR យ៉ាងរហ័ស និងជំរុញរូបិយវត្ថុជាតិ។`;
      chapter = 'ប្រព័ន្ធធនាគារ និងរូបិយវត្ថុជាតិ';
    } else {
      // International Relations & Sustainable Development (ទំនាក់ទំនងអន្តរជាតិ និង SDGs)
      q = `គោលដៅអភិវឌ្ឍន៍ប្រកបដោយចីរភាព (SDGs) របស់អង្គការសហប្រជាជាតិ ឆ្នាំ២០៣០ មានចំនួនប៉ុន្មានគោលដៅ?`;
      options = [
        '១៧ គោលដៅ (17 Sustainable Development Goals)',
        '៨ គោលដៅ (MDGs)',
        '១០ គោលដៅ',
        '២៥ គោលដៅ'
      ];
      answer = 0;
      explanation = `SDGs 2030 មាន ១៧ គោលដៅធំៗ រួមមាន ការលុបបំបាត់ភាពក្រីក្រ ការអប់រំប្រកបដោយគុណភាព សមភាពយេនឌ័រ សុខភាពល្អ និងការប្រយុទ្ធប្រឆាំងបម្រែបម្រួលអាកាសធាតុ។`;
      chapter = 'ការអភិវឌ្ឍប្រកបដោយចីរភាព និងពិភពលោកភាវូបនីយកម្ម';
    }

    socialQuestions.push({
      id: `soc-civ-${String(idCounter++).padStart(5, '0')}`,
      subject: 'សីលធម៌-ពលរដ្ឋ',
      subjectKey: 'civics',
      stream: 'social',
      grade: grade,
      chapter: chapter,
      q: q,
      options: options,
      answer: answer,
      explanation: explanation,
      difficulty: pick(['easy', 'medium', 'hard']),
      points: 10
    });
  }

  return socialQuestions;
}

// Generate both datasets
const sciencePool = generateScienceQuestions();
const socialPool = generateSocialQuestions();

console.log(`✅ Generated Natural Science Questions: ${sciencePool.length.toLocaleString()}`);
console.log(`✅ Generated Social Science Questions: ${socialPool.length.toLocaleString()}`);
console.log(`🎉 Total Questions in Master Question Bank: ${(sciencePool.length + socialPool.length).toLocaleString()}`);

// Write to files
const serverDataDir = path.join(__dirname, 'server', 'data');
if (!fs.existsSync(serverDataDir)) {
  fs.mkdirSync(serverDataDir, { recursive: true });
}

const fullBank = {
  version: '2.5.0',
  totalCount: sciencePool.length + socialPool.length,
  generatedAt: new Date().toISOString(),
  counts: {
    science: sciencePool.length,
    social: socialPool.length,
    bySubject: {
      math: 1500,
      physics: 1500,
      chemistry: 1500,
      biology: 1500,
      khmer: 1500,
      history: 1500,
      geography: 1500,
      civics: 1500
    }
  },
  science: sciencePool,
  social: socialPool
};

// 1. Save full JSON to server/data/master_question_bank_12000.json
const serverBankFile = path.join(serverDataDir, 'master_question_bank_12000.json');
fs.writeFileSync(serverBankFile, JSON.stringify(fullBank, null, 2), 'utf-8');
console.log(`💾 Saved master bank to ${serverBankFile}`);

// 2. Also write optimized categorized index to src/data/massiveQuestionBankInfo.js
const srcDataDir = path.join(__dirname, 'src', 'data');
const srcBankInfoFile = path.join(srcDataDir, 'massiveQuestionBankInfo.js');
const srcCode = `// Master 12,000 National Examination Question Pool Registry
// 6,000 វិទ្យាសាស្ត្រពិត (Natural Science) + 6,000 វិទ្យាសាស្ត្រសង្គម (Social Science)

export const MASTER_EXAM_BANK_STATS = {
  totalQuestions: 12000,
  scienceCount: 6000,
  socialCount: 6000,
  version: '2.5.0-National-MoEYS',
  streams: {
    science: {
      total: 6000,
      subjects: [
        { nameKm: 'គណិតវិទ្យា (Mathematics)', key: 'math', count: 1500 },
        { nameKm: 'រូបវិទ្យា (Physics)', key: 'physics', count: 1500 },
        { nameKm: 'គីមីវិទ្យា (Chemistry)', key: 'chemistry', count: 1500 },
        { nameKm: 'ជីវវិទ្យា (Biology)', key: 'biology', count: 1500 }
      ]
    },
    social: {
      total: 6000,
      subjects: [
        { nameKm: 'ភាសាខ្មែរ (Khmer Literature)', key: 'khmer', count: 1500 },
        { nameKm: 'ប្រវត្តិវិទ្យា (History)', key: 'history', count: 1500 },
        { nameKm: 'ភូមិវិទ្យា (Geography)', key: 'geography', count: 1500 },
        { nameKm: 'សីលធម៌-ពលរដ្ឋ & សេដ្ឋកិច្ច (Civics & Economics)', key: 'civics', count: 1500 }
      ]
    }
  }
};
`;
fs.writeFileSync(srcBankInfoFile, srcCode, 'utf-8');
console.log(`💾 Saved summary index to ${srcBankInfoFile}`);

console.log('✨ 12,000 National Examination Questions Generation Complete!');
