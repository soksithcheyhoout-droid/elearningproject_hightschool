// Master Educational Practice Playground & Gaming Arena Dataset (160+ Master Games across Science & Social Science)

const createGame = (id, stream, subject, subjectKey, titleKm, titleEn, descriptionKm, difficulty, xpReward, timeLimitSeconds, icon, category, questions) => ({
  id,
  stream,
  subject,
  subjectKey,
  titleKm,
  titleEn,
  descriptionKm,
  difficulty,
  xpReward,
  timeLimitSeconds,
  icon,
  category,
  questions
});

export const playgroundGamesData = [
  // =========================================================================
  // 🔬 ថ្នាក់វិទ្យាសាស្ត្រពិត (SCIENCE STREAM - 85+ GAMES)
  // =========================================================================

  // --- 1. MATHEMATICS (30 Games) ---
  createGame('sci-m-01', 'science', 'គណិតវិទ្យា', 'math', 'ប្រណាំងដោះស្រាយលីមីត 0/0 (Limits Racer)', 'Rational Limits Sprint', 'ហ្វឹកហាត់ដោះស្រាយលីមីតរាងមិនកំណត់ 0/0 និងការបំបែកជាកត្តា។', 'beginner', 190, 60, 'Zap', 'Calculus & Limits', [
    { q: 'គណនា lim (x → 2) (x² - 4) / (x - 2) = ?', options: ['0', '2', '4', '8'], answer: 2, explanation: '(x-2)(x+2)/(x-2) = x+2 => 4' },
    { q: 'គណនា lim (x → 1) (x³ - 1) / (x - 1) = ?', options: ['1', '2', '3', '0'], answer: 2, explanation: 'x²+x+1 => 3' }
  ]),
  createGame('sci-m-02', 'science', 'គណិតវិទ្យា', 'math', 'លីមីតកន្សោមឆ្លាស់ (Conjugate Limits)', 'Radical Limits & Conjugates', 'ដោះស្រាយលីមីតរ៉ាឌីកាល់ការ៉េដោយគុណកន្សោមឆ្លាស់។', 'intermediate', 220, 60, 'Sparkles', 'Calculus & Limits', [
    { q: 'គណនា lim (x → 0) [√(1 + 3x) - 1] / x = ?', options: ['1', '3/2', '3', '2/3'], answer: 1, explanation: '3/(1+1) = 3/2' },
    { q: 'គណនា lim (x → 4) (x - 4) / (√x - 2) = ?', options: ['2', '4', '8', '1/4'], answer: 1, explanation: '√4 + 2 = 4' }
  ]),
  createGame('sci-m-03', 'science', 'គណិតវិទ្យា', 'math', 'លីមីតត្រីកោណមាត្រ (Trig Limits)', 'Trigonometric Limits & Squeeze', 'អនុវត្តរូបមន្ត lim (sin x / x) = 1 និង lim (1 - cos x)/x² = 1/2។', 'master', 250, 60, 'Sparkles', 'Calculus & Limits', [
    { q: 'គណនា lim (x → 0) [sin(4x) / (2x)] = ?', options: ['1', '2', '4', '1/2'], answer: 1, explanation: '2' },
    { q: 'គណនា lim (x → 0) (1 - cos 2x) / x² = ?', options: ['1', '2', '4', '1/2'], answer: 1, explanation: '2' }
  ]),
  createGame('sci-m-04', 'science', 'គណិតវិទ្យា', 'math', 'លីមីតអនន្ត (Infinite Limits)', 'Limits at Infinity & Asymptotes', 'គណនាលីមីតត្រង់អនន្តនៃអនុគមន៍សនិទាន និងអិចស្បូណង់ស្យែល។', 'intermediate', 210, 60, 'TrendingUp', 'Calculus & Limits', [
    { q: 'គណនា lim (x → +∞) (3x² - 5x + 1) / (x² + 4) = ?', options: ['0', '3', '+∞', '1/3'], answer: 1, explanation: '3' },
    { q: 'គណនា lim (x → +∞) (e^x / x) = ?', options: ['0', '1', '+∞', 'e'], answer: 2, explanation: '+∞' }
  ]),
  createGame('sci-m-05', 'science', 'គណិតវិទ្យា', 'math', 'អាស៊ីមតូតនៃក្រាបអនុគមន៍ (Asymptotes of Curves)', 'Vertical, Horizontal & Oblique Asymptotes', 'កំណត់អាស៊ីមតូតឈរ ដេក និងទ្រេតនៃអនុគមន៍សនិទាន។', 'intermediate', 210, 60, 'TrendingUp', 'Calculus & Limits', [
    { q: 'ក្រាបនៃ y = (2x + 1)/(x - 3) មានអាស៊ីមតូតឈរត្រង់៖', options: ['x = 3', 'x = -3', 'y = 2', 'x = -1/2'], answer: 0, explanation: 'ភាគបែងសូន្យ x = 3' },
    { q: 'ក្រាបនៃ y = (2x + 1)/(x - 3) មានអាស៊ីមតូតដេកត្រង់៖', options: ['y = 2', 'y = 3', 'y = 0', 'y = -1/2'], answer: 0, explanation: 'លីមីតត្រង់អនន្ត y = 2' }
  ]),
  createGame('sci-m-06', 'science', 'គណិតវិទ្យា', 'math', 'ចំនួនកុំផ្លិចទម្រង់ពីជគណិត (Algebraic Complex)', 'Algebraic Form a + bi & Modulus', 'គណនាម៉ូឌុល |z| កុំផ្លិចឆ្លាស់ និងប្រមាណវិធីលើ C។', 'beginner', 190, 60, 'Calculator', 'Complex Numbers', [
    { q: 'ម៉ូឌុលនៃ z = 3 + 4i គឺ៖', options: ['5', '7', '25', '1'], answer: 0, explanation: '|z| = 5' },
    { q: 'កុំផ្លិចឆ្លាស់នៃ z = 5 - 2i គឺ៖', options: ['5 + 2i', '-5 - 2i', '-5 + 2i', '2 - 5i'], answer: 0, explanation: '5 + 2i' }
  ]),
  createGame('sci-m-07', 'science', 'គណិតវិទ្យា', 'math', 'ទម្រង់ត្រីកោណមាត្រ & ដឺម័រ (Polar & De Moivre)', 'Complex Polar & De Moivre Theorem', 'គណនាទម្រង់ត្រីកោណមាត្រ និងស្វ័យគុណកុំផ្លិច i²⁰²⁴។', 'master', 240, 60, 'Sparkles', 'Complex Numbers', [
    { q: 'អាគុយម៉ង់ចម្បងនៃ z = 1 + i គឺ៖', options: ['π/6', 'π/4', 'π/3', 'π/2'], answer: 1, explanation: 'π/4' },
    { q: 'តម្លៃនៃ i²⁰²⁴ ស្មើនឹង៖', options: ['1', '-1', 'i', '-i'], answer: 0, explanation: '1' }
  ]),
  createGame('sci-m-08', 'science', 'គណិតវិទ្យា', 'math', 'ឫសការ៉េនៃចំនួនកុំផ្លិច (Square Roots of Complex)', 'Complex Square Roots & Quadratic Equations', 'ដោះស្រាយសមីការដឺក្រេទី ២ លើសំណុំ C: az² + bz + c = 0។', 'master', 240, 60, 'Calculator', 'Complex Numbers', [
    { q: 'ឫសនៃសមីការ z² + 16 = 0 គឺ៖', options: ['z = ±4i', 'z = ±4', 'z = ±16i', 'z = 4'], answer: 0, explanation: 'z² = -16 = (4i)² => z = ±4i' },
    { q: 'សមីការ z² - 2z + 2 = 0 មានឫស៖', options: ['1 ± i', '2 ± i', '-1 ± i', '1 ± 2i'], answer: 0, explanation: 'Δ\' = 1 - 2 = -1 = i² => z = 1 ± i' }
  ]),
  createGame('sci-m-09', 'science', 'គណិតវិទ្យា', 'math', 'ដេរីវេនៃអនុគមន៍ (Derivatives Chain)', 'Derivative Rules & Chain Rules', 'គណនាដេរីវេ (u/v)\', (uv)\', (uⁿ)\' និងអនុគមន៍ត្រីកោណមាត្រ។', 'intermediate', 210, 60, 'TrendingUp', 'Differential Calculus', [
    { q: 'ដេរីវេនៃ f(x) = (2x + 1)³ គឺ៖', options: ['3(2x+1)²', '6(2x+1)²', '2(2x+1)²', '6(2x+1)³'], answer: 1, explanation: '6(2x+1)²' },
    { q: 'ដេរីវេនៃ f(x) = sin(3x) គឺ៖', options: ['cos(3x)', '3 cos(3x)', '-3 cos(3x)', '3 sin(3x)'], answer: 1, explanation: '3 cos(3x)' }
  ]),
  createGame('sci-m-10', 'science', 'គណិតវិទ្យា', 'math', 'បន្ទាត់ប៉ះ & បរមានៃក្រាប (Tangents & Extrema)', 'Tangent Lines & Local Max/Min', 'រកសមីការបន្ទាត់ប៉ះ y = f\'(x₀)(x - x₀) + f(x₀)។', 'master', 230, 60, 'Activity', 'Differential Calculus', [
    { q: 'មេគុណប្រាប់ទិសបន្ទាត់ប៉ះក្រាប y = x² ត្រង់ x = 3 គឺ៖', options: ['3', '6', '9', '2'], answer: 1, explanation: '6' },
    { q: 'អនុគមន៍ f(x) = x³ - 3x មានចំណុចបរមាត្រង់៖', options: ['x = ±1', 'x = 0', 'x = ±3', 'x = ±√3'], answer: 0, explanation: 'x = ±1' }
  ]),
  createGame('sci-m-11', 'science', 'គណិតវិទ្យា', 'math', 'ដេរីវេអនុគមន៍អិចស្បូណង់ស្យែល & លោការីត (Exp & Log Derivatives)', 'Derivatives of e^u and ln(u)', 'គណនាដេរីវេនៃ (e^u)\' = u\'e^u និង (ln u)\' = u\'/u។', 'master', 230, 60, 'TrendingUp', 'Differential Calculus', [
    { q: 'ដេរីវេនៃ f(x) = e^(3x² + 1) គឺ៖', options: ['6x e^(3x²+1)', 'e^(3x²+1)', '3x e^(3x²+1)', '6 e^(3x²+1)'], answer: 0, explanation: '(3x²+1)\' e^(3x²+1) = 6x e^(3x²+1)' },
    { q: 'ដេរីវេនៃ f(x) = ln(2x + 5) គឺ៖', options: ['2 / (2x + 5)', '1 / (2x + 5)', '2x / (2x + 5)', 'ln(2)'], answer: 0, explanation: '(2x+5)\' / (2x+5) = 2/(2x+5)' }
  ]),
  createGame('sci-m-12', 'science', 'គណិតវិទ្យា', 'math', 'ព្រីមីទីវ & អាំងតេក្រាលកំណត់ (Primitives & Integrals)', 'Fundamental Theorem of Calculus', 'គណនាព្រីមីទីវគ្រឹះ និងអាំងតេក្រាលកំណត់។', 'intermediate', 220, 60, 'Calculator', 'Integral Calculus', [
    { q: 'គណនា ∫ (ពី 0 ទៅ 2) (3x²) dx = ?', options: ['6', '8', '12', '24'], answer: 1, explanation: '8' },
    { q: 'ព្រីមីទីវនៃ 1/(2x+1) គឺ៖', options: ['ln|2x+1| + C', '½ ln|2x+1| + C', '2 ln|2x+1| + C', '1/(2x+1)²'], answer: 1, explanation: '½ ln|2x+1| + C' }
  ]),
  createGame('sci-m-13', 'science', 'គណិតវិទ្យា', 'math', 'អាំងតេក្រាលដោយផ្នែក (Integrals by Parts)', 'Integration by Parts Rush', 'អនុវត្តរូបមន្ត ∫ u dv = uv - ∫ v du។', 'master', 250, 60, 'Zap', 'Integral Calculus', [
    { q: 'រូបមន្តអាំងតេក្រាលដោយផ្នែកគឺ៖', options: ['∫ u dv = uv - ∫ v du', '∫ u dv = uv + ∫ v du', '∫ u dv = u\'v + uv\'', '∫ u dv = u/v'], answer: 0, explanation: '∫ u dv = uv - ∫ v du' },
    { q: 'គណនា I = ∫ (ពី 0 ទៅ 1) e^(2x) dx = ?', options: ['e² - 1', '(e² - 1) / 2', '2(e² - 1)', 'e²'], answer: 1, explanation: '½(e² - 1)' }
  ]),
  createGame('sci-m-14', 'science', 'គណិតវិទ្យា', 'math', 'អាំងតេក្រាលគណនាផ្ទៃក្រឡា (Area under Curves)', 'Definite Integrals & Enclosed Areas', 'គណនាផ្ទៃក្រឡាខណ្ឌដោយក្រាបអនុគមន៍ពីរ S = ∫ |f(x) - g(x)| dx។', 'master', 240, 60, 'Layers', 'Integral Calculus', [
    { q: 'ផ្ទៃក្រឡាក្រោមខ្សែកោង y = x² ពី x = 0 ទៅ x = 3 គឺ៖', options: ['9', '3', '27', '18'], answer: 0, explanation: '[x³/3] (0 ទៅ 3) = 27/3 = 9' },
    { q: 'ផ្ទៃក្រឡាខណ្ឌដោយ y = x និង y = x² ពី 0 ទៅ 1 ស្មើនឹង៖', options: ['1/6', '1/2', '1/3', '1/4'], answer: 0, explanation: '∫(x - x²)dx = [x²/2 - x³/3] = 1/2 - 1/3 = 1/6' }
  ]),
  createGame('sci-m-15', 'science', 'គណិតវិទ្យា', 'math', 'សមីការឌីផេរ៉ង់ស្យែល (Differential Equations)', '1st & 2nd Order Diff Equations', 'ដោះស្រាយ y\' + ay = 0 និង y\'\' + ay\' + by = 0។', 'master', 250, 60, 'Cpu', 'Diff Equations', [
    { q: 'ចម្លើយទូទៅនៃ y\' - 5y = 0 គឺ៖', options: ['y = C e^(5x)', 'y = C e^(-5x)', 'y = 5x + C', 'y = C ln(5x)'], answer: 0, explanation: 'y = C e^(5x)' },
    { q: 'សមីការ y\'\' + 9y = 0 មានចម្លើយទូទៅ៖', options: ['y = A cos 3x + B sin 3x', 'y = A e^(3x) + B e^(-3x)', 'y = A cos 9x', 'y = (Ax+B)e^(3x)'], answer: 0, explanation: 'y = A cos 3x + B sin 3x' }
  ]),
  createGame('sci-m-16', 'science', 'គណិតវិទ្យា', 'math', 'វ៉ិចទ័រក្នុងលំហ Oxyz (3D Vectors Oxyz)', '3D Vectors & Scalar Product', 'គណនាកូអរដោនេវ៉ិចទ័រ ផលគុណស្កាលែ u · v និងកែងគ្នា។', 'intermediate', 210, 60, 'Target', '3D Geometry', [
    { q: 'ផលគុណស្កាលែនៃ u(1, 2, 3) និង v(2, -1, 1) គឺ៖', options: ['0', '3', '5', '7'], answer: 1, explanation: '3' },
    { q: 'លក្ខខណ្ឌឱ្យ u និង v កែងគ្នាគឺ៖', options: ['u · v = 0', 'u = v', 'u · v = 1', 'u · v = -1'], answer: 0, explanation: 'u · v = 0' }
  ]),
  createGame('sci-m-17', 'science', 'គណិតវិទ្យា', 'math', 'ផលគុណនៃពីរវ៉ិចទ័រ u × v (Vector Cross Product)', 'Cross Product & Triangle Area', 'គណនាផលគុណវ៉ិចទ័រ u × v និងផ្ទៃក្រឡាត្រីកោណ S = ½|u × v|។', 'master', 240, 60, 'Target', '3D Geometry', [
    { q: 'បើ u // v (ពីរវ៉ិចទ័រស្របគ្នា) នោះផលគុណវ៉ិចទ័រ u × v ស្មើនឹង៖', options: ['0 (វ៉ិចទ័រសូន្យ)', '1', 'u · v', '∞'], answer: 0, explanation: 'u // v => u × v = 0' },
    { q: 'ផលគុណវ៉ិចទ័រ u × v ជាវ៉ិចទ័រដែលមានលក្ខណៈ៖', options: ['កែងនឹងទាំង u និង v', 'ស្របនឹង u', 'កាត់ v', 'សូន្យជានិច្ច'], answer: 0, explanation: 'u × v កែងនឹងប្លង់កាត់ (u, v)' }
  ]),
  createGame('sci-m-18', 'science', 'គណិតវិទ្យា', 'math', 'សមីការប្លង់ & ស្វ៊ែរ (Planes & Spheres)', '3D Plane Equations & Spheres', 'គណនាសមីការប្លង់ Ax + By + Cz + D = 0 និងចម្ងាយ d(A, P)។', 'master', 240, 60, 'Layers', '3D Geometry', [
    { q: 'ចម្ងាយពី A(0,0,0) ទៅប្លង់ 2x - 2y + z - 6 = 0 គឺ៖', options: ['2', '3', '6', '1'], answer: 0, explanation: '2' },
    { q: 'សមីការស្វ៊ែរផ្ចិត I(0, 0, 0) កាំ R = 3 គឺ៖', options: ['x² + y² + z² = 3', 'x² + y² + z² = 9', 'x + y + z = 9', 'x² + y² = 9'], answer: 1, explanation: 'x² + y² + z² = 9' }
  ]),
  createGame('sci-m-19', 'science', 'គណិតវិទ្យា', 'math', 'សមីការបន្ទាត់ក្នុងលំហ (3D Line Equations)', 'Parametric & Symmetric Lines', 'កំណត់សមីការប៉ារ៉ាម៉ែត្រនៃបន្ទាត់កាត់តាមចំណុច និងមានវ៉ិចទ័រប្រាប់ទិស។', 'intermediate', 210, 60, 'Target', '3D Geometry', [
    { q: 'បន្ទាត់កាត់ A(1, 2, 3) វ៉ិចទ័រប្រាប់ទិស u(2, -1, 4) មានសមីការប៉ារ៉ាម៉ែត្រ៖', options: ['x=1+2t, y=2-t, z=3+4t', 'x=2+t, y=-1+2t, z=4+3t', 'x=2t, y=-t, z=4t', 'x=1, y=2, z=3'], answer: 0, explanation: 'x=x₀+at, y=y₀+bt, z=z₀+ct' },
    { q: 'បន្ទាត់ពីរកែងគ្នា លុះត្រាតែវ៉ិចទ័រប្រាប់ទិសរបស់វា៖', options: ['មានផលគុណស្កាលែស្មើ ០', 'ស្របគ្នា', 'ស្មើគ្នា', 'កាត់គ្នា'], answer: 0, explanation: 'u · v = 0' }
  ]),
  createGame('sci-m-20', 'science', 'គណិតវិទ្យា', 'math', 'ស្វ៊ីតនព្វន្ត (Arithmetic Sequences)', 'Arithmetic Progression un & Sn', 'គណនាតួទី n un = u₁ + (n-1)d និងផលបូក Sn។', 'beginner', 180, 60, 'Layers', 'Sequences', [
    { q: 'ស្វ៊ីតនព្វន្ត u₁ = 3, d = 4។ តើតួទី 5 (u₅) ស្មើប៉ុន្មាន?', options: ['15', '19', '23', '20'], answer: 1, explanation: '19' },
    { q: 'ផលបូក n តួដំបូង Sn ស្មើនឹង៖', options: ['n/2 (u₁ + un)', 'n(u₁ + un)', '(u₁ + un)/2', 'n · u₁'], answer: 0, explanation: 'n/2 (u₁ + un)' }
  ]),
  createGame('sci-m-21', 'science', 'គណិតវិទ្យា', 'math', 'ស្វ៊ីតធរណីមាត្រ (Geometric Sequences)', 'Geometric Progression un & Sn', 'គណនាតួទី n un = u₁ · qⁿ⁻¹ និងផលបូកអនន្ត។', 'intermediate', 200, 60, 'TrendingUp', 'Sequences', [
    { q: 'ស្វ៊ីតធរណីមាត្រ u₁ = 2, q = 3។ តើតួទី 4 (u₄) ស្មើប៉ុន្មាន?', options: ['18', '54', '24', '162'], answer: 1, explanation: '54' },
    { q: 'ផលបូកអនន្ត S = u₁ / (1 - q) ប្រើបានលុះត្រាតែ៖', options: ['|q| < 1', '|q| > 1', 'q = 1', 'q = 0'], answer: 0, explanation: '|q| < 1' }
  ]),
  createGame('sci-m-22', 'science', 'គណិតវិទ្យា', 'math', 'បន្សំ & ចម្រាស់ (Combinatorics Sprint)', 'Combinations & Permutations', 'គណនាបន្សំ C(n,r) និងចម្រាស់ A(n,r)។', 'intermediate', 210, 60, 'Calculator', 'Combinatorics', [
    { q: 'គណនាតម្លៃនៃបន្សំ C(6, 2) = ?', options: ['15', '30', '12', '36'], answer: 0, explanation: '15' },
    { q: 'គណនាតម្លៃនៃចម្រាស់ A(4, 2) = ?', options: ['6', '12', '24', '8'], answer: 1, explanation: '12' }
  ]),
  createGame('sci-m-23', 'science', 'គណិតវិទ្យា', 'math', 'ពង្រាយទ្វេធាញូតុន (Binomial Expansion)', 'Binomial Coefficients & Terms', 'គណនាមេគុណទ្វេធា (a+b)ⁿ តាមត្រីកោណប៉ាស្កាល់។', 'intermediate', 210, 60, 'Calculator', 'Combinatorics', [
    { q: 'មេគុណនៃតួ xy ក្នុងពង្រាយ (x + y)² គឺ៖', options: ['2', '1', '4', '0'], answer: 0, explanation: '(x+y)² = x² + 2xy + y²' },
    { q: 'ផលបូកមេគុណទាំងអស់ក្នុងពង្រាយ (1 + 1)ⁿ ស្មើនឹង៖', options: ['2ⁿ', 'n²', 'n!', '2n'], answer: 0, explanation: '∑ C(n,k) = 2ⁿ' }
  ]),
  createGame('sci-m-24', 'science', 'គណិតវិទ្យា', 'math', 'ប្រូបាប៊ីលីតេមានលក្ខខណ្ឌ (Conditional Probability)', 'Conditional Probability & Bayes', 'គណនា P(A|B) = P(A ∩ B) / P(B) និងព្រឹត្តិការណ៍ឯករាជ្យ។', 'master', 240, 60, 'Sparkles', 'Probability', [
    { q: 'បោះគ្រាប់ឡុកឡាក់ ១ គ្រាប់។ ប្រូបាប៊ីលីតេចេញលេខគូគឺ៖', options: ['1/2', '1/3', '1/6', '2/3'], answer: 0, explanation: '1/2' },
    { q: 'រូបមន្ត P(A|B) គឺ៖', options: ['P(A ∩ B) / P(B)', 'P(A) · P(B)', 'P(A ∪ B) / P(B)', 'P(A) + P(B)'], answer: 0, explanation: 'P(A ∩ B) / P(B)' }
  ]),
  createGame('sci-m-25', 'science', 'គណិតវិទ្យា', 'math', 'អថេរចៃដន្យ & សង្ឃឹមគណិត E(X) (Random Variables)', 'Discrete Random Variables & Expectation', 'គណនាសង្ឃឹមគណិត E(X) = ∑ x_i P(X=x_i) និងវ៉ារ្យ៉ង់ V(X)។', 'master', 240, 60, 'Sparkles', 'Probability', [
    { q: 'លក្ខខណ្ឌនៃច្បាប់ប្រូបាប៊ីលីតេគឺផលបូក ∑ P(X=x_i) ត្រូវតែស្មើ៖', options: ['1', '0', '100', 'អនន្ត'], answer: 0, explanation: '∑ P_i = 1' },
    { q: 'វ៉ារ្យ៉ង់ V(X) គណនាតាមរូបមន្ត៖', options: ['E(X²) - [E(X)]²', 'E(X)²', 'E(X²) + E(X)', '√E(X)'], answer: 0, explanation: 'V(X) = E(X²) - [E(X)]²' }
  ]),
  createGame('sci-m-26', 'science', 'គណិតវិទ្យា', 'math', 'អនុគមន៍លោការីត & អិចស្បូណង់ស្យែល (Log & Exp Functions)', 'Logarithms & Exponentials', 'ដោះស្រាយសមីការ និងវិសមីការ e^x និង ln(x)។', 'intermediate', 210, 60, 'TrendingUp', 'Algebra', [
    { q: 'ដោះស្រាយសមីការ ln(x) = 2 => x = ?', options: ['e²', '2e', '100', '√e'], answer: 0, explanation: 'x = e²' },
    { q: 'តម្លៃនៃ e^(ln 5) គឺ៖', options: ['5', 'e⁵', 'ln 5', '1'], answer: 0, explanation: '5' }
  ]),
  createGame('sci-m-27', 'science', 'គណិតវិទ្យា', 'math', 'ម៉ាទ្រីស & ដេទែមីណង់ (Matrices & Determinants)', 'Matrix Operations & Determinants', 'គណនាផលគុណម៉ាទ្រីស និងដេទែមីណង់ det(A) 2x2, 3x3។', 'beginner', 190, 60, 'Grid', 'Matrices', [
    { q: 'ដេទែមីណង់នៃម៉ាទ្រីស A = [[2, 3], [1, 4]] គឺ៖', options: ['5', '8', '11', '2'], answer: 0, explanation: '2(4) - 3(1) = 8 - 3 = 5' },
    { q: 'ម៉ាទ្រីសឯកតា I 2x2 គឺ៖', options: ['[[1, 0], [0, 1]]', '[[1, 1], [1, 1]]', '[[0, 1], [1, 0]]', '[[1, 0], [1, 0]]'], answer: 0, explanation: '[[1, 0], [0, 1]]' }
  ]),
  createGame('sci-m-28', 'science', 'គណិតវិទ្យា', 'math', 'ត្រីកោណមាត្រទូទៅ (Trigonometric Identities)', 'Trig Formulas & Addition Laws', 'អនុវត្តរូបមន្តបូក sin(a+b), cos(a+b) និងទ្វេមុំ sin 2a, cos 2a។', 'intermediate', 210, 60, 'Sparkles', 'Trigonometry', [
    { q: 'រូបមន្ត cos 2a ស្មើនឹង៖', options: ['cos² a - sin² a', '2 cos a', 'cos² a + sin² a', 'sin 2a'], answer: 0, explanation: 'cos² a - sin² a' },
    { q: 'តម្លៃនៃ sin(π/6) គឺ៖', options: ['1/2', '√3/2', '√2/2', '1'], answer: 0, explanation: '1/2' }
  ]),
  createGame('sci-m-29', 'science', 'គណិតវិទ្យា', 'math', 'កោនិក ប៉ារ៉ាបូល & អេលីប (Conics Parabola & Ellipse)', 'Conic Sections & Equations', 'ស្គាល់សមីការស្តង់ដារប៉ារ៉ាបូល y² = 4px និងអេលីប x²/a² + y²/b² = 1។', 'master', 240, 60, 'Activity', 'Conics', [
    { q: 'អេលីប x²/25 + y²/9 = 1 មានផ្ចិត (0,0) និងកន្លះអ័ក្សធំ a ស្មើ៖', options: ['5', '25', '3', '9'], answer: 0, explanation: 'a² = 25 => a = 5' },
    { q: 'សមីការប៉ារ៉ាបូលដែលមានកំពូល V(0,0) និងកំណុំ F(p, 0) គឺ៖', options: ['y² = 4px', 'x² = 4py', 'x² + y² = p²', 'y = px'], answer: 0, explanation: 'y² = 4px' }
  ]),
  createGame('sci-m-30', 'science', 'គណិតវិទ្យា', 'math', 'វិសមីការត្រីកោណមាត្រ (Trigonometric Inequalities)', 'Trig Equations & Circle Intervals', 'ដោះស្រាយសមីការ sin x = m, cos x = m និងវិសមីការលើរង្វង់ត្រីកោណមាត្រ។', 'master', 240, 60, 'Sparkles', 'Trigonometry', [
    { q: 'សមីការ cos x = 1/2 មានចម្លើយទូទៅលើ R គឺ៖', options: ['x = ±π/3 + 2kπ', 'x = π/6 + 2kπ', 'x = ±π/4 + 2kπ', 'x = kπ'], answer: 0, explanation: 'x = ±π/3 + 2kπ' },
    { q: 'តម្លៃធំបំផុតនៃអនុគមន៍ f(x) = 3 sin x + 4 cos x គឺ៖', options: ['5', '7', '1', '12'], answer: 0, explanation: '√(3² + 4²) = √25 = 5' }
  ]),

  // --- 2. PHYSICS (25 Games) ---
  createGame('sci-p-01', 'science', 'រូបវិទ្យា', 'physics', 'លំយោលប៉ោលរ៉ឺស័រ (Spring Oscillations)', 'Harmonic Spring Pendulum', 'គណនាខួប T = 2π√(m/k) និងព្រេកង់កែង ω₀។', 'intermediate', 220, 60, 'Atom', 'Mechanics', [
    { q: 'រូបមន្តខួបប៉ោលបត់បែនគឺ៖', options: ['T = 2π √(m/k)', 'T = 2π √(k/m)', 'T = 2π √(l/g)', 'T = 2π √(g/l)'], answer: 0, explanation: 'T = 2π √(m/k)' },
    { q: 'បើរ៉ឺស័រ k = 100 N/m, m = 0.25 kg តើ ω₀ ស្មើប៉ុន្មាន?', options: ['10 rad/s', '20 rad/s', '40 rad/s', '4 rad/s'], answer: 1, explanation: '20 rad/s' }
  ]),
  createGame('sci-p-02', 'science', 'រូបវិទ្យា', 'physics', 'ប៉ោលទោល & ថាមពល (Simple Pendulum)', 'Simple Gravity Pendulum', 'គណនាខួប T = 2π√(l/g) និងថាមពលមេកានិច។', 'beginner', 190, 60, 'Activity', 'Mechanics', [
    { q: 'ខួបនៃប៉ោលទោលអាស្រ័យលើ៖', options: ['ប្រវែងខ្សែ l និងទំនាញ g', 'ម៉ាស m', 'ទំហំលំយោល', 'ពណ៌'], answer: 0, explanation: 'T = 2π √(l/g)' },
    { q: 'ថាមពលមេកានិចនៃលំយោលបត់បែន Em ស្មើនឹង៖', options: ['½ k Xm²', '½ m Xm²', 'k Xm', '½ k Vm'], answer: 0, explanation: '½ k Xm²' }
  ]),
  createGame('sci-p-03', 'science', 'រូបវិទ្យា', 'physics', 'លំយោលថយ & រេសូណង់មេកានិច (Damped Oscillations & Resonance)', 'Damped Oscillations & Mechanical Resonance', 'ស្វែងយល់ពីកម្លាំងកកិត ការថយចុះអំព្លីទូត និងរេសូណង់មេកានិច។', 'intermediate', 210, 60, 'Activity', 'Mechanics', [
    { q: 'លំយោលថយចុះអំព្លីទូតតាមពេលវេលាដោយសារ៖', options: ['កម្លាំងកកិត និងភាពធន់នៃមជ្ឈដ្ឋាន', 'កម្លាំងទំនាញដីថេរ', 'ម៉ាសកើនឡើង', 'គ្មានកកិត'], answer: 0, explanation: 'កម្លាំងកកិតធ្វើឱ្យបាត់បង់ថាមពល' },
    { q: 'បាតុភូតរេសូណង់មេកានិចកើតឡើងនៅពេល៖', options: ['ព្រេកង់កម្លាំងបង្ខំ f ស្មើនឹងព្រេកង់ផ្ទាល់ f₀', 'f > f₀ ខ្លាំង', 'កកិតធំខ្លាំង', 'ល្បឿនសូន្យ'], answer: 0, explanation: 'f = f₀ នាំឱ្យអំព្លីទូតអតិបរមា' }
  ]),
  createGame('sci-p-04', 'science', 'រូបវិទ្យា', 'physics', 'រលកមេកានិច (Mechanical Waves)', 'Wave Speed & Wavelength', 'គណនាប្រវែងរលក λ = v/f និងល្បឿនរាលរលក។', 'intermediate', 200, 60, 'Radio', 'Waves', [
    { q: 'រលកមាន v = 340 m/s, f = 170 Hz។ ប្រវែងរលក λ ស្មើ៖', options: ['0.5 m', '2 m', '510 m', '1.5 m'], answer: 1, explanation: '2 m' },
    { q: 'រលកទទឹងមានទិសរំញ័រ៖', options: ['កែងនឹងទិសរាល', 'ស្របនឹងទិសរាល', 'គ្មានទិស', 'ជារង្វង់'], answer: 0, explanation: 'កែងនឹងទិសរាល' }
  ]),
  createGame('sci-p-05', 'science', 'រូបវិទ្យា', 'physics', 'កម្រិតសំឡេង dB (Sound Decibels)', 'Sound Intensity & Decibels', 'គណនាកម្រិតសំឡេង L = 10 log(I/I₀)។', 'master', 230, 60, 'Volume2', 'Waves', [
    { q: 'កម្រិតអាំងតង់ស៊ីតេសំឡេង L គណនាតាម៖', options: ['L = 10 log(I / I₀)', 'L = log(I / I₀)', 'L = I / I₀', 'L = 10 (I - I₀)'], answer: 0, explanation: 'L = 10 log(I / I₀)' },
    { q: 'បើអាំងតង់ស៊ីតេកើន 10 ដង តើ L កើនប៉ុន្មាន dB?', options: ['1 dB', '10 dB', '20 dB', '100 dB'], answer: 1, explanation: '10 dB' }
  ]),
  createGame('sci-p-06', 'science', 'រូបវិទ្យា', 'physics', 'រលកឈរលើខ្សែ & បំពង់សំឡេង (Standing Waves)', 'Standing Waves Nodes & Antinodes', 'គណនាប្រវែងខ្សែ L = k(λ/2) និងចំណុចថ្នាំង/ពោះរលក។', 'master', 240, 60, 'Radio', 'Waves', [
    { q: 'លក្ខខណ្ឌមានរលកឈរលើខ្សែចុងសងខាងភ្ជាប់នឹងជញ្ជាំងគឺ៖', options: ['L = k (λ / 2)', 'L = k λ', 'L = (2k+1) λ', 'L = λ / 4'], answer: 0, explanation: 'L = k(λ/2)' },
    { q: 'ចម្ងាយរវាងពីរថ្នាំងរលកជាប់គ្នា (Two consecutive nodes) ស្មើនឹង៖', options: ['λ / 2', 'λ', '2λ', 'λ / 4'], answer: 0, explanation: 'λ/2' }
  ]),
  createGame('sci-p-07', 'science', 'រូបវិទ្យា', 'physics', 'សៀគ្វីឆ្លាស់ RLC (AC RLC Circuits)', 'AC RLC Impedance & Power Factor', 'គណនាអាំងពែដង់ Z និងកត្តាអានុភាព cos φ = R/Z។', 'intermediate', 220, 60, 'Zap', 'Electricity', [
    { q: 'L = 0.1 H នៅ ω = 100 rad/s មាន ZL ស្មើ៖', options: ['10 Ω', '100 Ω', '1000 Ω', '1 Ω'], answer: 0, explanation: 'ZL = Lω = 10 Ω' },
    { q: 'កត្តាអានុភាព cos φ ស្មើនឹង៖', options: ['R / Z', 'Z / R', 'R · Z', 'ZL / ZC'], answer: 0, explanation: 'R / Z' }
  ]),
  createGame('sci-p-08', 'science', 'រូបវិទ្យា', 'physics', 'រេសូណង់អគ្គិសនី (Electrical Resonance)', 'RLC Resonance & Max Current', 'វិភាគលក្ខខណ្ឌរេសូណង់ ZL = ZC និង Z = R។', 'master', 240, 60, 'Zap', 'Electricity', [
    { q: 'លក្ខខណ្ឌដើម្បីមានរេសូណង់គឺ៖', options: ['ZL = ZC (Lω = 1/Cω)', 'ZL > ZC', 'ZL = R', 'ZC = R'], answer: 0, explanation: 'ZL = ZC' },
    { q: 'ពេលមានរេសូណង់ អាំងពែដង់ Z ស្មើនឹង៖', options: ['Z = 0', 'Z = R (អប្បបរមា)', 'Z = ∞', 'Z = 2R'], answer: 1, explanation: 'Z = R' }
  ]),
  createGame('sci-p-09', 'science', 'រូបវិទ្យា', 'physics', 'ត្រង់ស្វ័រម៉ាទ័រ (Transformers Grid)', 'Voltage Ratio & Power Losses', 'គណនា U₂/U₁ = N₂/N₁ និងការខាតបង់ P_loss = R I²។', 'intermediate', 200, 60, 'Cpu', 'Electricity', [
    { q: 'N₁ = 1000, N₂ = 200, U₁ = 220V => U₂ = ?', options: ['44 V', '1100 V', '440 V', '22 V'], answer: 0, explanation: '44 V' },
    { q: 'ដើម្បីកាត់បន្ថយការខាតបង់កម្ដៅគេត្រូវ៖', options: ['ដំឡើងតង់ស្យុងឱ្យខ្ពស់ខ្លាំង', 'បញ្ចុះតង់ស្យុង', 'បង្កើនចរន្ត', 'ប្រើខ្សែតូច'], answer: 0, explanation: 'ដំឡើងតង់ស្យុងខ្ពស់' }
  ]),
  createGame('sci-p-10', 'science', 'រូបវិទ្យា', 'physics', 'លំយោល LC (LC Electromagnetic Oscillator)', 'LC Circuits & Frequency', 'គណនាខួប T = 2π√(LC) និងថាមពលសរុប។', 'intermediate', 210, 60, 'Radio', 'Electromagnetism', [
    { q: 'ខួបនៃលំយោលសៀគ្វី LC គឺ៖', options: ['T = 2π √(LC)', 'T = 2π √(L/C)', 'T = 2π √(C/L)', 'T = 2π LC'], answer: 0, explanation: 'T = 2π √(LC)' },
    { q: 'ថាមពលសរុប W ស្មើនឹង៖', options: ['½ C u² + ½ L i²', 'C u + L i', '½ L i', '½ C u'], answer: 0, explanation: '½ C u² + ½ L i²' }
  ]),
  createGame('sci-p-11', 'science', 'រូបវិទ្យា', 'physics', 'អាំងឌុចស្យុងអេឡិចត្រូម៉ាញ៉េទិច (Electromagnetic Induction)', 'Faraday Law & Lenz Law', 'អនុវត្តច្បាប់ហ្វារ៉ាដេ e = -dΦ/dt និងច្បាប់ឡិនស៍។', 'master', 230, 60, 'Zap', 'Electromagnetism', [
    { q: 'ច្បាប់ហ្វារ៉ាដេ ចែងថាកម្លាំងអគ្គិសនីចលករអាំងឌ្វី e ស្មើនឹង៖', options: ['e = - dΦ / dt', 'e = Φ · t', 'e = R · I', 'e = B · v'], answer: 0, explanation: 'e = - dΦ/dt' },
    { q: 'ច្បាប់ឡិនស៍ចែងថា ចរន្តអាំងឌ្វីកើតឡើងមានទិសដៅ៖', options: ['ប្រឆាំងនឹងបម្រែបម្រួលភ្លុចម៉ាញ៉េទិចដែលបង្កើតវា', 'ស្របនឹងភ្លុច', 'កែងនឹងដែន', 'គ្មានទិស'], answer: 0, explanation: 'ប្រឆាំងនឹងបម្រែបម្រួលភ្លុច' }
  ]),
  createGame('sci-p-12', 'science', 'រូបវិទ្យា', 'physics', 'ច្បាប់វិទ្យុសកម្ម (Radioactivity Decay)', 'Decay Law & Half-Life', 'គណនាពាក់កណ្តាលជីវិត T និងកាំរស្មី α, β, γ។', 'master', 230, 60, 'Radio', 'Nuclear Physics', [
    { q: 'ពាក់កណ្តាលជីវិត T = 5 ថ្ងៃ ក្រោយ 15 ថ្ងៃ នៅសល់៖', options: ['50%', '25%', '12.5%', '6.25%'], answer: 2, explanation: '12.5%' },
    { q: 'កាំរស្មីណាជារលកអេឡិចត្រូម៉ាញ៉េទិចថាមពលខ្ពស់?', options: ['ហ្គាម៉ា (γ)', 'អាល់ហ្វា (α)', 'បេតា (β)', 'ណឺត្រុង'], answer: 0, explanation: 'កាំរស្មី ហ្គាម៉ា (γ)' }
  ]),
  createGame('sci-p-13', 'science', 'រូបវិទ្យា', 'physics', 'ថាមពលភ្ជាប់នុយក្លេអ៊ែរ (Binding Energy)', 'Mass Defect & Binding Energy', 'គណនាថាមពលភ្ជាប់ El = Δm · c² គិតជា MeV។', 'master', 240, 60, 'Sun', 'Nuclear Physics', [
    { q: 'រូបមន្តថាមពលភ្ជាប់គឺ៖', options: ['El = Δm · c²', 'El = m · c', 'El = ½ m v²', 'El = hf'], answer: 0, explanation: 'El = Δm · c²' },
    { q: '1 u មានថាមពលសមមូលប្រហែល៖', options: ['931.5 MeV', '1.6 × 10⁻¹⁹ J', '3 × 10⁸ J', '100 MeV'], answer: 0, explanation: '931.5 MeV' }
  ]),
  createGame('sci-p-14', 'science', 'រូបវិទ្យា', 'physics', 'ប្រតិកម្មបំបែក & បន្សំស្នូល (Nuclear Fission & Fusion)', 'Fission, Fusion & Energy Release', 'ស្វែងយល់ពីការបំបែកស្នូលអ៊ុយរ៉ាញ៉ូម និងការបន្សំអ៊ីដ្រូសែនលើព្រះអាទិត្យ។', 'master', 240, 60, 'Sun', 'Nuclear Physics', [
    { q: 'ប្រភពថាមពលចម្បងរបស់ព្រះអាទិត្យកើតចេញពីប្រតិកម្ម៖', options: ['បន្សំស្នូលនុយក្លេអ៊ែរ (Nuclear Fusion)', 'បំបែកស្នូល (Fission)', 'ចំហេះធ្យូងថ្ម', 'គីមី'], answer: 0, explanation: 'បន្សំស្នូលអ៊ីដ្រូសែនទៅជាអេល្យូម' },
    { q: 'រោងចក្រអគ្គិសនីនុយក្លេអ៊ែរទូទៅទាញយកថាមពលពីប្រតិកម្ម៖', options: ['បំបែកស្នូល (Nuclear Fission)', 'បន្សំស្នូល', 'កម្ដៅព្រះអាទិត្យ', 'ខ្យល់'], answer: 0, explanation: 'បំបែកស្នូល U-235' }
  ]),
  createGame('sci-p-15', 'science', 'រូបវិទ្យា', 'physics', 'ផលភូតូអគ្គិសនី (Photoelectric Effect)', 'Einstein Photoelectric Equation', 'គណនាថាមពលហ្វូតុង hf = W₀ + Ek_max។', 'master', 240, 60, 'Sun', 'Quantum Physics', [
    { q: 'សមីការភូតូអគ្គិសនីគឺ៖', options: ['hf = W₀ + Ek_max', 'hf = W₀ - Ek_max', 'Ek_max = hf + W₀', 'hf = ½ m c²'], answer: 0, explanation: 'hf = W₀ + Ek_max' },
    { q: 'លក្ខខណ្ឌដើម្បីមានផលភូតូអគ្គិសនីគឺ៖', options: ['λ ≤ λ₀', 'λ > λ₀', 'f < f₀', 'ពន្លឺខ្សោយ'], answer: 0, explanation: 'λ ≤ λ₀' }
  ]),
  createGame('sci-p-16', 'science', 'រូបវិទ្យា', 'physics', 'កម្រិតថាមពលអាតូមអ៊ីដ្រូសែន (Bohr Hydrogen Energy)', 'Bohr Postulates & Spectral Lines', 'គណនា En = -13.6 / n² (eV) និងការបញ្ចេញហ្វូតុង ΔE = hf។', 'master', 240, 60, 'Sparkles', 'Quantum Physics', [
    { q: 'ថាមពលនៃកម្រិតបាត (n = 1) នៃអាតូមអ៊ីដ្រូសែនគឺ៖', options: ['-13.6 eV', '0 eV', '-3.4 eV', '13.6 eV'], answer: 0, explanation: 'E₁ = -13.6 eV' },
    { q: 'ពេលអេឡិចត្រុងលោតពីកម្រិត n=2 មក n=1 អាតូមនឹង៖', options: ['បញ្ចេញហ្វូតុងពន្លឺថាមពល ΔE = E₂ - E₁', 'ស្រូបយកអេឡិចត្រុង', 'បាត់បង់ម៉ាស', 'គ្មានអ្វីកើតឡើង'], answer: 0, explanation: 'បញ្ចេញហ្វូតុងពន្លឺ' }
  ]),
  createGame('sci-p-17', 'science', 'រូបវិទ្យា', 'physics', 'ឧស្ម័នបរិសុទ្ធ PV=nRT (Ideal Gas Kinetics)', 'Ideal Gas Equation & Temperature', 'គណនាសមីការស្ថានភាព PV = nRT។', 'intermediate', 200, 60, 'Activity', 'Thermodynamics', [
    { q: 'សមីការស្ថានភាពនៃឧស្ម័នបរិសុទ្ធគឺ៖', options: ['PV = nRT', 'P/V = nRT', 'PV = mRT', 'P = VRT'], answer: 0, explanation: 'PV = nRT' },
    { q: 'ថាមពលស៊ីនេទិចម៉ូលេគុលសមាមាត្រផ្ទាល់នឹង៖', options: ['សីតុណ្ហភាពដាច់ខាត T', 'មាឌ V', 'សម្ពាធ P', 'ម៉ាស'], answer: 0, explanation: 'សីតុណ្ហភាព T' }
  ]),
  createGame('sci-p-18', 'science', 'រូបវិទ្យា', 'physics', 'គោលការណ៍ទី ១ ទែម៉ូឌីណាមិច (First Law of Thermodynamics)', 'Heat, Work & Internal Energy ΔU = Q + W', 'គណនាបម្រែបម្រួលថាមពលក្នុង ΔU = Q + W និងកម្តៅ។', 'intermediate', 210, 60, 'Flame', 'Thermodynamics', [
    { q: 'រូបមន្តគោលការណ៍ទី ១ ទែម៉ូឌីណាមិចគឺ៖', options: ['ΔU = Q + W', 'ΔU = Q - W', 'Q = ΔU · W', 'W = Q · ΔU'], answer: 0, explanation: 'ΔU = Q + W' },
    { q: 'ក្នុងបម្រែបម្រួលអ៊ីសូទែម (Isothermal T = const) នោះ៖', options: ['ΔU = 0', 'Q = 0', 'W = 0', 'P = const'], answer: 0, explanation: 'ΔU = 0' }
  ]),
  createGame('sci-p-19', 'science', 'រូបវិទ្យា', 'physics', 'ច្បាប់ញូតុន F=ma (Newtonian Mechanics)', 'Newton 3 Laws & Acceleration', 'អនុវត្ត ∑F = ma ក្នុងចលនាស្ទុះ។', 'beginner', 180, 60, 'Compass', 'Mechanics', [
    { q: 'កម្លាំងសមមូល ∑F ស្មើនឹង៖', options: ['m · a', 'm · v', '½ m v²', 'm · g · h'], answer: 0, explanation: 'm a' },
    { q: 'ក្នុងចលនាធ្លាក់សេរី សំទុះគឺ៖', options: ['g = 9.8 m/s²', '0', 'កើនឥតឈប់', 'ថយចុះ'], answer: 0, explanation: 'g = 9.8 m/s²' }
  ]),
  createGame('sci-p-20', 'science', 'រូបវិទ្យា', 'physics', 'ច្បាប់រក្សាថាមពលមេកានិច (Conservation of Energy)', 'Kinetic, Potential & Mechanical Energy', 'គណនា Em = Ek + Ep = ½mv² + mgh = ថេរ។', 'beginner', 190, 60, 'Activity', 'Mechanics', [
    { q: 'ថាមពលប៉ូតង់ស្យែលទំនាញដី Ep គណនាតាម៖', options: ['m · g · h', '½ m v²', 'm · v', 'F · d'], answer: 0, explanation: 'Ep = mgh' },
    { q: 'ពេលអង្គធាតុធ្លាក់ចុះសេរីដោយគ្មានកកិត៖', options: ['Ep ថយចុះ ហើយ Ek កើនឡើង (Em ថេរ)', 'Ek និង Ep ថយទាំងពីរ', 'Em កើនឡើង', 'ថាមពលបាត់បង់'], answer: 0, explanation: 'ថាមពលមេកានិចរក្សាថេរ' }
  ]),
  createGame('sci-p-21', 'science', 'រូបវិទ្យា', 'physics', 'អុបទិចឡង់ទី (Lenses & Optics)', 'Optics 1/f = 1/p + 1/p\'', 'គណនារូបមន្ត 1/f = 1/p + 1/p\'។', 'beginner', 190, 60, 'Eye', 'Optics', [
    { q: 'រូបមន្តកំហុំឡង់ទីគឺ៖', options: ['1/f = 1/p + 1/p\'', '1/f = 1/p - 1/p\'', 'f = p + p\'', 'f = p · p\''], answer: 0, explanation: '1/f = 1/p + 1/p\'' },
    { q: 'ឡង់ទីពង្រួមមាន f ជាតម្លៃ៖', options: ['វិជ្ជមាន (f > 0)', 'អវិជ្ជមាន (f < 0)', 'សូន្យ', 'អនន្ត'], answer: 0, explanation: 'f > 0' }
  ]),
  createGame('sci-p-22', 'science', 'រូបវិទ្យា', 'physics', 'អន្តរាគមន៍ពន្លឺ (Light Interference Young)', 'Young Double Slits Interference', 'គណនាប្រឡោះព្រំ i = λD/a និងប្រវែងរលកពន្លឺ។', 'master', 230, 60, 'Sparkles', 'Optics', [
    { q: 'រូបមន្តគណនាប្រឡោះព្រំ i គឺ៖', options: ['i = λD / a', 'i = λa / D', 'i = aD / λ', 'i = λ / (aD)'], answer: 0, explanation: 'i = λD / a' },
    { q: 'ព្រំភ្លឺលំដាប់ k ស្ថិតនៅទីតាំង x ស្មើនឹង៖', options: ['x = k · i', 'x = (k + ½) i', 'x = i / k', 'x = 2ki'], answer: 0, explanation: 'x = k i' }
  ]),
  createGame('sci-p-23', 'science', 'រូបវិទ្យា', 'physics', 'ច្បាប់ឆ្លុះ & ច្បាប់ចំណាំងបែរនៃពន្លឺ (Snell-Descartes Law)', 'Reflection & Refraction n1 sin i = n2 sin r', 'អនុវត្ត n₁ sin i₁ = n₂ sin i₂ និងបាតុភូតចំណាំងបែរពេញលេញ។', 'intermediate', 200, 60, 'Eye', 'Optics', [
    { q: 'ច្បាប់ស្ណែល-ដេកាតនៃចំណាំងបែរគឺ៖', options: ['n₁ sin i₁ = n₂ sin i₂', 'n₁ / sin i₁ = n₂ / sin i₂', 'sin i₁ · sin i₂ = n₁ n₂', 'n₁ = n₂ sin i'], answer: 0, explanation: 'n₁ sin i₁ = n₂ sin i₂' },
    { q: 'មុំព្រំដែនចំណាំងបែរពេញលេញ i_lim គណនាតាម៖', options: ['sin i_lim = n₂ / n₁ (ជាមួយ n₁ > n₂)', 'cos i_lim = n₂ / n₁', 'tan i_lim = n₁ / n₂', 'sin i_lim = n₁ / n₂'], answer: 0, explanation: 'sin i_lim = n₂ / n₁' }
  ]),
  createGame('sci-p-24', 'science', 'រូបវិទ្យា', 'physics', 'កម្លាំងឡូរ៉ង់ & ដែនម៉ាញ៉េទិច (Lorentz Force)', 'Magnetic Force F = qvB sin θ', 'គណនាកម្លាំងម៉ាញ៉េទិចលើភាគល្អិតបន្ទុក F = |q|vB sin θ។', 'master', 230, 60, 'Zap', 'Electromagnetism', [
    { q: 'កម្លាំងឡូរ៉ង់មានទំហំ F គណនាតាម៖', options: ['F = |q| v B sin θ', 'F = q E', 'F = m a', 'F = I L B'], answer: 0, explanation: 'F = |q|vB sin θ' },
    { q: 'គន្លងនៃភាគល្អិតបន្ទុកក្នុងដែនម៉ាញ៉េទិចឯកសណ្ឋាន (v ⊥ B) គឺជារាង៖', options: ['រង្វង់ (Circular Path)', 'បន្ទាត់ត្រង់', 'ប៉ារ៉ាបូល', 'អេលីប'], answer: 0, explanation: 'គន្លងជារង្វង់ R = mv / (|q|B)' }
  ]),
  createGame('sci-p-25', 'science', 'រូបវិទ្យា', 'physics', 'ច្បាប់អូម & សៀគ្វីចរន្តជាប់ (Ohm Law & DC Circuits)', 'Resistors Series, Parallel & Kirchhoff Laws', 'គណនា R_eq, សៀគ្វីតជាស៊េរី ខ្នែង និងច្បាប់គីរឆុហ្វ។', 'beginner', 180, 60, 'Cpu', 'Electricity', [
    { q: 'រេស៊ីស្តង់ពីរ R₁ = 6 Ω និង R₂ = 3 Ω តជាខ្នែង មាន R_eq ស្មើ៖', options: ['2 Ω', '9 Ω', '18 Ω', '4.5 Ω'], answer: 0, explanation: 'R_eq = (6×3)/(6+3) = 18/9 = 2 Ω' },
    { q: 'ច្បាប់អូមសម្រាប់កំណាត់សៀគ្វីគឺ៖', options: ['U = R · I', 'I = U · R', 'R = U · I', 'P = U / I'], answer: 0, explanation: 'U = R I' }
  ]),

  // --- 3. CHEMISTRY (20 Games) ---
  createGame('sci-c-01', 'science', 'គីមីវិទ្យា', 'chemistry', 'ស៊ីនេទិចគីមី (Chemical Kinetics)', 'Reaction Rates & Influencing Factors', 'គណនាល្បឿនមធ្យមនៃប្រតិកម្មគីមី។', 'intermediate', 210, 60, 'Activity', 'Kinetics', [
    { q: 'កត្តាណាបង្កើនល្បឿនប្រតិកម្ម?', options: ['បង្កើនសីតុណ្ហភាព និងកំហាប់', 'បន្ថយសីតុណ្ហភាព', 'កាត់បន្ថយផ្ទៃប៉ះ', 'មិនប្រើកាតាលីករ'], answer: 0, explanation: 'សីតុណ្ហភាព និងកំហាប់' },
    { q: 'កាតាលីករមានតួនាទី៖', options: ['បង្កើនល្បឿនដោយបញ្ចុះថាមពលសកម្មកម្ម', 'ប្តូរផលកកើត', 'បន្ថយល្បឿន', 'បង្កើនកម្ដៅ'], answer: 0, explanation: 'បញ្ចុះថាមពលសកម្មកម្ម' }
  ]),
  createGame('sci-c-02', 'science', 'គីមីវិទ្យា', 'chemistry', 'លំនឹងគីមី (Chemical Equilibrium)', 'Le Chatelier Principle Shift', 'វិភាគការរំកិលលំនឹងតាមគោលការណ៍ឡឺឆាតឺលីយេ។', 'master', 230, 60, 'Scale', 'Equilibrium', [
    { q: 'ការបង្កើនសម្ពាធធ្វើឱ្យលំនឹងរំកិលទៅ៖', options: ['ខាងម៉ូលឧស្ម័នតិច', 'ខាងម៉ូលច្រើន', 'មិនរំកិល', 'ស្រូបកម្ដៅ'], answer: 0, explanation: 'ខាងម៉ូលឧស្ម័នតិច' },
    { q: 'ប្រតិកម្មបញ្ចេញកម្ដៅ បង្កើនកម្ដៅរំកិលទៅ៖', options: ['ទិសច្រាស (ឆ្វេង)', 'ទិសស្រប (ស្តាំ)', 'មិនរំកិល', 'ផលកកើត'], answer: 0, explanation: 'ទិសច្រាស' }
  ]),
  createGame('sci-c-03', 'science', 'គីមីវិទ្យា', 'chemistry', 'ថេរលំនឹង Kc & Kp (Equilibrium Constants)', 'Equilibrium Expressions & Quotient Q', 'គណនា Kc = [C]^c [D]^d / ([A]^a [B]^b)។', 'master', 230, 60, 'Scale', 'Equilibrium', [
    { q: 'កន្សោមថេរលំនឹង Kc នៃ N₂ + 3H₂ ⇌ 2NH₃ គឺ៖', options: ['[NH₃]² / ([N₂][H₂]³)', '[NH₃] / ([N₂][H₂])', '([N₂][H₂]³) / [NH₃]²', '[NH₃]² · [N₂]'], answer: 0, explanation: '[NH₃]² / ([N₂][H₂]³)' },
    { q: 'បើផលធៀបប្រតិកម្ម Q < Kc នោះប្រព័ន្ធនឹងរំកិលទៅ៖', options: ['ទិសដៅស្រប (បង្កើតផលកកើត)', 'ទិសច្រាស', 'នៅនឹងថ្កល់', 'មិនប្រែប្រួល'], answer: 0, explanation: 'រំកិលទៅទិសស្របដើម្បីឱ្យ Q កើនដល់ Kc' }
  ]),
  createGame('sci-c-04', 'science', 'គីមីវិទ្យា', 'chemistry', 'គណនា pH អាស៊ីត-បាស (pH Calculations)', 'Acids & Bases pH Scale', 'គណនា pH = -log[H₃O⁺] និង pOH = -log[OH⁻]។', 'intermediate', 200, 60, 'FlaskConical', 'Acids & Bases', [
    { q: 'HCl កំហាប់ 0.001 M មាន pH ស្មើ៖', options: ['1', '2', '3', '4'], answer: 2, explanation: '3' },
    { q: 'NaOH កំហាប់ 0.01 M មាន pH ស្មើ៖', options: ['2', '7', '12', '14'], answer: 2, explanation: '12' }
  ]),
  createGame('sci-c-05', 'science', 'គីមីវិទ្យា', 'chemistry', 'សូលុយស្យុងប៊ូហ្វ័រ (Buffer Solutions)', 'Buffer pH Henderson-Hasselbalch', 'គណនា pH = pKa + log([A⁻]/[HA]) នៃសូលុយស្យុងទ្រនាប់។', 'master', 240, 60, 'TestTube', 'Acids & Bases', [
    { q: 'សូលុយស្យុងប៊ូហ្វ័រផ្សំឡើងពី៖', options: ['អាស៊ីតខ្សោយ និងបាសឆ្លាស់របស់វា (ឬបាសខ្សោយ និងអាស៊ីតឆ្លាស់)', 'អាស៊ីតខ្លាំង និងបាសខ្លាំង', 'ទឹកបរិសុទ្ធ', 'អំបិល NaCl'], answer: 0, explanation: 'គូអាស៊ីត-បាសខ្សោយឆ្លាស់' },
    { q: 'លក្ខណៈពិសេសនៃសូលុយស្យុងប៊ូហ្វ័រគឺ៖', options: ['រក្សាតម្លៃ pH ស្ទើរតែថេរពេលបន្ថែមអាស៊ីត ឬបាសបន្តិចបន្តួច', 'ធ្វើឱ្យ pH ឡើងដល់ ១៤ ភ្លាម', 'គ្មានពណ៌', 'ពុល'], answer: 0, explanation: 'ទប់ទល់នឹងបម្រែបម្រួល pH' }
  ]),
  createGame('sci-c-06', 'science', 'គីមីវិទ្យា', 'chemistry', 'ការបន្សាបអាស៊ីត-បាស (Titration Equivalence)', 'Neutralization & pH 7', 'គណនាកំហាប់ CaVa = CbVb ត្រង់សមមូល។', 'master', 230, 60, 'TestTube', 'Acids & Bases', [
    { q: 'ចំណុចសមមូល HCl បន្សាបដោយ NaOH មាន pH = ?', options: ['pH < 7', 'pH = 7', 'pH > 7', 'pH = 0'], answer: 1, explanation: 'pH = 7' },
    { q: 'បន្សាប HCl 20 mL (0.1 M) ត្រូវការ NaOH (0.2 M) មាឌ៖', options: ['10 mL', '20 mL', '40 mL', '5 mL'], answer: 0, explanation: '10 mL' }
  ]),
  createGame('sci-c-07', 'science', 'គីមីវិទ្យា', 'chemistry', 'អេសទែ & សាប៊ូកម្ម (Esters & Saponification)', 'Esters & Saponification Reactions', 'ស្វែងយល់ពី R-COO-R\' និងប្រតិកម្មជាមួយ NaOH។', 'master', 220, 60, 'FlaskConical', 'Organic Chemistry', [
    { q: 'ប្រតិកម្មអេស្ទែភីកាសកម្មកើតរវាង៖', options: ['អាស៊ីតកាបុកស៊ីលិច + អាល់កុល', 'អាល់កាន + ទឹក', 'អាល់គីន + H₂', 'បាស + អំបិល'], answer: 0, explanation: 'អាស៊ីត + អាល់កុល' },
    { q: 'CH₃-COO-C₂H₅ មានឈ្មោះថា៖', options: ['មេទីលអេតាណូអាត', 'អេទីលអេតាណូអាត', 'ប្រូពីលមេតាណូអាត', 'អេទីលប្រូបាណូអាត'], answer: 1, explanation: 'អេទីលអេតាណូអាត' }
  ]),
  createGame('sci-c-08', 'science', 'គីមីវិទ្យា', 'chemistry', 'ទ្រីគ្លីសេរីដ & ខ្លាញ់ (Lipids & Fats)', 'Triglycerides & Glycerol', 'រចនាសម្ព័ន្ធខ្លាញ់/ប្រេង និងផលសាប៊ូ។', 'intermediate', 210, 60, 'Droplet', 'Organic Chemistry', [
    { q: 'សាប៊ូកម្មទ្រីគ្លីសេរីដជាមួយ NaOH ផ្តល់ផល៖', options: ['សាប៊ូ + គ្លីសេរ៉ុល', 'អាស៊ីត + ទឹក', 'អាល់កុល + O₂', 'ស្ករ + ទឹក'], answer: 0, explanation: 'សាប៊ូ + គ្លីសេរ៉ុល' },
    { q: 'គ្លីសេរ៉ុលជាប្រភេទ៖', options: ['ទ្រីអាល់កុល (៣ បង្គុំ -OH)', 'ម៉ូណូអាល់កុល', 'អាស៊ីត', 'អេសទែ'], answer: 0, explanation: 'ទ្រីអាល់កុល' }
  ]),
  createGame('sci-c-09', 'science', 'គីមីវិទ្យា', 'chemistry', 'អាស៊ីតអាមីណេ (Amino Acids & Peptides)', 'Peptide Bonds -CO-NH-', 'ស្វែងយល់ពីសម្ព័ន្ធប៉ិបទីត និងប្រូតេអ៊ីន។', 'intermediate', 210, 60, 'Dna', 'Biochemistry', [
    { q: 'សម្ព័ន្ធប៉ិបទីតកើតឡើងរវាង៖', options: ['-COOH ទី១ និង -NH₂ ទី២', '-OH និង -COOH', '-CHO និង -OH', '-NH₂ និង -NH₂'], answer: 0, explanation: '-COOH និង -NH₂' },
    { q: 'អាស៊ីតអាមីណេសាមញ្ញបំផុតគឺ៖', options: ['គ្លីស៊ីន (Glycine)', 'អាឡានីន', 'វ៉ាលីន', 'លូស៊ីន'], answer: 0, explanation: 'គ្លីស៊ីន' }
  ]),
  createGame('sci-c-10', 'science', 'គីមីវិទ្យា', 'chemistry', 'រចនាសម្ព័ន្ធប្រូតេអ៊ីន & ឌីណាតូរ៉ាសកម្ម (Proteins & Denaturation)', 'Protein Primary, Secondary & Denaturation', 'ស្វែងយល់ពីរចនាសម្ព័ន្ធបឋម ទុតិយភូមិ និងការខូចទ្រង់ទ្រាយប្រូតេអ៊ីន។', 'intermediate', 210, 60, 'Dna', 'Biochemistry', [
    { q: 'ឌីណាតូរ៉ាសកម្ម (Denaturation) នៃប្រូតេអ៊ីនបណ្តាលមកពី៖', options: ['កម្ដៅខ្ពស់ អាស៊ីត/បាសខ្លាំង និងលោហៈធ្ងន់', 'ទឹកត្រជាក់', 'អំបិល NaCl បន្តិច', 'ពន្លឺព្រះអាទិត្យខ្សោយ'], answer: 0, explanation: 'កម្ដៅ និង pH ខ្លាំងបំបែកសម្ព័ន្ធអ៊ីដ្រូសែន' },
    { q: 'រចនាសម្ព័ន្ធបឋមនៃប្រូតេអ៊ីនកំណត់ដោយ៖', options: ['លំដាប់លំដោយនៃអាស៊ីតអាមីណេក្នុងច្រវ៉ាក់ប៉ូលីប៉ិបទីត', 'ទម្រង់បត់បែន 3D', 'សម្ព័ន្ធអ៊ីដ្រូសែន', 'ស្ករ'], answer: 0, explanation: 'លំដាប់លំដោយនៃអាស៊ីតអាមីណេ' }
  ]),
  createGame('sci-c-11', 'science', 'គីមីវិទ្យា', 'chemistry', 'ប៉ូលីមែសំយោគ (Polymers & Plastics)', 'Polyethylene PE & PVC Plastics', 'ស្វែងយល់ពីប៉ូលីមែកម្មបូក និងកុងដង់ស៊ីតេ។', 'beginner', 180, 60, 'Layers', 'Polymers', [
    { q: 'ប៉ូលីអេទីឡែន (PE) កកើតពីម៉ូណូមែ៖', options: ['អេទីឡែន (CH₂=CH₂)', 'អាសេទីឡែន', 'មេតាន', 'ក្លរ៉ូភរ'], answer: 0, explanation: 'អេទីឡែន' },
    { q: 'ម៉ូណូមែនៃ PVC គឺ៖', options: ['វីនីលក្លរួ', 'អេទីឡែន', 'ប្រូពីឡែន', 'ស្ទីរ៉ែន'], answer: 0, explanation: 'វីនីលក្លរួ' }
  ]),
  createGame('sci-c-12', 'science', 'គីមីវិទ្យា', 'chemistry', 'នីឡុង 6,6 & ប៉ូលីអេស្ទែ (Nylon 6,6 & Polyesters)', 'Condensation Polymers & Synthetic Fibers', 'ស្វែងយល់ពីប៉ូលីកុងដង់ស៊ីតេ និងសរសៃសំយោគ។', 'intermediate', 210, 60, 'Layers', 'Polymers', [
    { q: 'នីឡុង 6,6 (Nylon 6,6) កកើតឡើងដោយប្រតិកម្មប៉ូលីកុងដង់ស៊ីតេរវាង៖', options: ['អាស៊ីតអាឌីពិច និង ហិចសាមេទីឡែនឌីអាមីន', 'អេទីឡែន និងទឹក', 'គ្លុយកូស', 'វីនីលក្លរួ'], answer: 0, explanation: 'អាស៊ីតអាឌីពិច + ហិចសាមេទីឡែនឌីអាមីន' },
    { q: 'ផលិតផលបន្ទាប់បន្សំដែលតែងតែភាយចេញក្នុងប៉ូលីកុងដង់ស៊ីតេគឺ៖', options: ['ម៉ូលេគុលតូចដូចជា ទឹក (H₂O) ឬ HCl', 'ឧស្ម័ន O₂', 'លោហៈ', 'គ្មានផលអ្វី'], answer: 0, explanation: 'ម៉ូលេគុលទឹក H₂O' }
  ]),
  createGame('sci-c-13', 'science', 'គីមីវិទ្យា', 'chemistry', 'ពីលហ្គាល់វ៉ានិច (Galvanic Cells & Batteries)', 'Redox & Electrochemistry', 'គណនាកម្លាំងអគ្គិសនីចលករ E°_cell។', 'master', 230, 60, 'Zap', 'Electrochemistry', [
    { q: 'នៅអាណូត (Anode) តែងកើតប្រតិកម្ម៖', options: ['អុកស៊ីតកម្ម', 'រេដុកម្ម', 'បន្សាប', 'រលាយ'], answer: 0, explanation: 'អុកស៊ីតកម្ម' },
    { q: 'ពីល Zn-Cu មានកាតូតវិជ្ជមានគឺ៖', options: ['បន្ទះទង់ដែង (Cu)', 'បន្ទះស័ង្កសី (Zn)', 'បន្ទះដែក', 'បន្ទះផ្លាទីន'], answer: 0, explanation: 'បន្ទះ Cu' }
  ]),
  createGame('sci-c-14', 'science', 'គីមីវិទ្យា', 'chemistry', 'អេឡិចត្រូលីស (Electrolysis of Solutions)', 'Electrolytic Cells & Faraday Laws', 'វិភាគប្រតិកម្មនៅអេឡិចត្រូត និងការស្រោបលោហៈ។', 'master', 230, 60, 'Zap', 'Electrochemistry', [
    { q: 'ក្នុងកោសិកាអេឡិចត្រូលីស កាតូត (Cathode) ភ្ជាប់នឹងប៉ូលណា?', options: ['ប៉ូលអវិជ្ជមាន (-) នៃប្រភពចរន្ត', 'ប៉ូលវិជ្ជមាន (+)', 'មិនភ្ជាប់', 'ដី'], answer: 0, explanation: 'កាតូតភ្ជាប់ប៉ូលអវិជ្ជមាន (-) ទាក់ទាញកាចុង' },
    { q: 'អេឡិចត្រូលីសសូលុយស្យុង NaCl ផ្តល់ផលកកើតនៅអាណូតជាឧស្ម័ន៖', options: ['ឧស្ម័នក្លរ (Cl₂)', 'ឧស្ម័នអ៊ីដ្រូសែន (H₂)', 'ឧស្ម័នអុកស៊ីសែន (O₂)', 'ឧស្ម័នអាសូត (N₂)'], answer: 0, explanation: 'ឧស្ម័ន Cl₂' }
  ]),
  createGame('sci-c-15', 'science', 'គីមីវិទ្យា', 'chemistry', 'អាល់កុល & អាល់ដេអ៊ីត (Alcohols & Aldehydes)', 'Oxidation & Tollens Test', 'បែងចែកថ្នាក់អាល់កុល និងតេស្តកញ្ចក់ប្រាក់ Tollens។', 'intermediate', 200, 60, 'TestTube', 'Organic Chemistry', [
    { q: 'អុកស៊ីតកម្មកម្រិតស្រាលអាល់កុលថ្នាក់ទី ១ ផ្តល់៖', options: ['អាល់ដេអ៊ីត', 'សេតូន', 'អេសទែ', 'អាល់កាន'], answer: 0, explanation: 'អាល់ដេអ៊ីត' },
    { q: 'សម្គាល់អាល់ដេអ៊ីតគេប្រើ៖', options: ['រេអាក់ទីហ្វ Tollens', 'NaOH', 'HCl', 'NaCl'], answer: 0, explanation: 'រេអាក់ទីហ្វ Tollens' }
  ]),
  createGame('sci-c-16', 'science', 'គីមីវិទ្យា', 'chemistry', 'អាស៊ីតកាបុកស៊ីលិច (Carboxylic Acids)', 'Acidity & Reactions with Metals/Bases', 'ស្គាល់លក្ខណៈអាស៊ីត R-COOH និងប្រតិកម្មជាមួយបាស បង្កើតអំបិល។', 'intermediate', 200, 60, 'FlaskConical', 'Organic Chemistry', [
    { q: 'អាស៊ីតអេតាណូអ៊ិច (អាស៊ីតអាសេទិច) CH₃COOH មាននៅក្នុង៖', options: ['ទឹកខ្មេះ', 'ទឹកក្រូចឆ្មារ', 'ប្រេងកាត', 'ទឹកដោះគោ'], answer: 0, explanation: 'ទឹកខ្មេះ' },
    { q: 'CH₃COOH មានប្រតិកម្មជាមួយ CaCO₃ ភាយចេញជាឧស្ម័ន៖', options: ['CO₂ (កាបូនិច)', 'H₂', 'O₂', 'Cl₂'], answer: 0, explanation: 'ឧស្ម័ន CO₂' }
  ]),
  createGame('sci-c-17', 'science', 'គីមីវិទ្យា', 'chemistry', 'អ៊ីដ្រូកាបួរ អាល់កាន អាល់គីន (Hydrocarbons)', 'Alkanes, Alkenes & Alkynes Reactions', 'ស្គាល់ប្រតិកម្មជំនួស អាល់កាន និងប្រតិកម្មបូក អាល់គីន/អាល់ស៊ីន។', 'beginner', 180, 60, 'Flame', 'Organic Chemistry', [
    { q: 'រូបមន្តទូទៅនៃអាល់កាន (Alkanes) គឺ៖', options: ['CnH2n+2', 'CnH2n', 'CnH2n-2', 'CnHn'], answer: 0, explanation: 'CnH2n+2' },
    { q: 'អាល់គីន (Alkenes) ធ្វើឱ្យសូលុយស្យុងទឹកប្រូម (Br₂)៖', options: ['បាត់ពណ៌ក្រហមត្នោត (ប្រតិកម្មបូក)', 'ប្រែជាពណ៌ខៀវ', 'មិនប្រែប្រួល', 'កក'], answer: 0, explanation: 'បាត់ពណ៌ទឹកប្រូម' }
  ]),
  createGame('sci-c-18', 'science', 'គីមីវិទ្យា', 'chemistry', 'សមាសធាតុក្រអូប បង់សែន (Aromatic Benzene)', 'Benzene Ring & Electrophilic Substitution', 'ស្គាល់រចនាសម្ព័ន្ធកងបង់សែន C₆H₆ និងប្រតិកម្មនីត្រាតកម្ម។', 'master', 230, 60, 'Layers', 'Organic Chemistry', [
    { q: 'បង់សែន (Benzene) មានរូបមន្តម៉ូលេគុល៖', options: ['C₆H₆', 'C₆H₁₂', 'C₆H₁₄', 'C₂H₆'], answer: 0, explanation: 'C₆H₆' },
    { q: 'ប្រតិកម្មលក្ខណៈពិសេសរបស់កងបង់សែនគឺ៖', options: ['ប្រតិកម្មជំនួសអេឡិចត្រូភីល', 'ប្រតិកម្មបូកលឿន', 'ប្រតិកម្មបំបែក', 'គ្មានប្រតិកម្ម'], answer: 0, explanation: 'ប្រតិកម្មជំនួសអេឡិចត្រូភីល' }
  ]),
  createGame('sci-c-19', 'science', 'គីមីវិទ្យា', 'chemistry', 'ជាតិស្ករ កាបូអ៊ីដ្រាត (Carbohydrates & Sugars)', 'Glucose, Fructose, Sucrose & Starch', 'បែងចែកម៉ូណូសាការីត ឌីសាការីត និងប៉ូលីសាការីត។', 'beginner', 180, 60, 'Sparkles', 'Biochemistry', [
    { q: 'គ្លុយកូស (Glucose) មានរូបមន្តម៉ូលេគុល៖', options: ['C₆H₁₂O₆', 'C₁₂H₂₂O₁₁', '(C₆H₁₀O₅)n', 'C₃H₆O₃'], answer: 0, explanation: 'C₆H₁₂O₆' },
    { q: 'ដើម្បីសម្គាល់ជាតិម្សៅ (Starch) គេប្រើប្រាស់ទឹក៖', options: ['ទឹកអ៊ីយ៉ូត (ផ្តល់ពណ៌ខៀវចាស់)', 'ទឹកខ្មេះ', 'ទឹកអំបិល', 'ទឹកកំបោរ'], answer: 0, explanation: 'តេស្តទឹកអ៊ីយ៉ូត' }
  ]),
  createGame('sci-c-20', 'science', 'គីមីវិទ្យា', 'chemistry', 'លោហៈធាតុ & អុកស៊ីតកម្ម-រេដុកម្ម (Metals & Redox)', 'Metal Activity Series & Corrosion', 'ស្គាល់ជួរលោហៈសកម្ម និងការការពារការច្រែះដែក។', 'beginner', 180, 60, 'ShieldCheck', 'Inorganic Chemistry', [
    { q: 'លោហៈណាដែលសកម្មខ្លាំងជាងគេក្នុងចំណោមខាងក្រោម?', options: ['ប៉ូតាស្យូម (K)', 'ទង់ដែង (Cu)', 'ដែក (Fe)', 'ប្រាក់ (Ag)'], answer: 0, explanation: 'K > Na > Ca > Mg...' },
    { q: 'ច្រែះដែក Fe₂O₃ · nH₂O កើតឡើងដោយសារដែកប៉ះនឹង៖', options: ['ទឹក និងអុកស៊ីសែនក្នុងខ្យល់', 'ទឹកសុទ្ធគ្មានខ្យល់', 'ប្រេង', 'ឧស្ម័នអាសូត'], answer: 0, explanation: 'ទឹក និងអុកស៊ីសែន' }
  ]),

  // --- 4. BIOLOGY (15 Games) ---
  createGame('sci-b-01', 'science', 'ជីវវិទ្យា', 'biology', 'រចនាសម្ព័ន្ធម៉ូលេគុល ADN (DNA Structure)', 'DNA Helix & Base Pairing', 'គណនាចំនួននុយក្លេអូទីត A, T, G, C និងប្រវែង L។', 'beginner', 190, 60, 'Dna', 'Genetics', [
    { q: 'សម្ព័ន្ធបាសលើ ADN ត្រឹមត្រូវគឺ៖', options: ['A = T (២ សម្ព័ន្ធ) និង G = C (៣ សម្ព័ន្ធ)', 'A = C និង G = T', 'A = G', 'A + T = G + C'], answer: 0, explanation: 'A=T និង G≡C' },
    { q: 'ADN មាន 3000 នុយក្លេអូទីត មានប្រវែង L = ?', options: ['5100 Å', '10200 Å', '2550 Å', '3400 Å'], answer: 0, explanation: '5100 Å' }
  ]),
  createGame('sci-b-02', 'science', 'ជីវវិទ្យា', 'biology', 'ស្វ័យតម្លើងទ្វេ ADN (DNA Replication)', 'Semi-Conservative DNA Replication', 'ស្វែងយល់ពីអង់ស៊ីម ADN ប៉ូលីមេរ៉ាស 5\' → 3\'។', 'intermediate', 210, 60, 'Sparkles', 'Genetics', [
    { q: 'ស្វ័យតម្លើងទ្វេ ADN តាមយន្តការ៖', options: ['ពាក់កណ្តាលរក្សាទុក', 'រក្សាទុកទាំងស្រុង', 'បែកខ្ញែក', 'ចៃដន្យ'], answer: 0, explanation: 'ពាក់កណ្តាលរក្សាទុក' },
    { q: 'ADN ប៉ូលីមេរ៉ាសសំយោគតាមទិស៖', options: ['5\' ទៅ 3\'', '3\' ទៅ 5\'', 'ទាំងសងខាង', 'គ្មានទិស'], answer: 0, explanation: '5\' → 3\'' }
  ]),
  createGame('sci-b-03', 'science', 'ជីវវិទ្យា', 'biology', 'ការចម្លងក្រម & ARNm (Transcription)', 'mRNA Synthesis & Codons', 'សំយោគ ARNm ពីច្រវ៉ាក់ពុម្ព ADN និងបាស U។', 'intermediate', 210, 60, 'Dna', 'Protein Synthesis', [
    { q: 'លើ ARN បាស ទីមីន (T) ជំនួសដោយ៖', options: ['អ៊ុយរ៉ាស៊ីល (U)', 'អាដេនីន', 'ហ្គានីន', 'ស៊ីតូស៊ីន'], answer: 0, explanation: 'អ៊ុយរ៉ាស៊ីល (U)' },
    { q: 'ច្រវ៉ាក់ 3\'-TAC-5\' ផ្តល់ ARNm៖', options: ['5\'-AUG-3\'', '5\'-ATG-3\'', '5\'-UAC-3\'', '5\'-AUG-3\''], answer: 0, explanation: '5\'-AUG-3\'' }
  ]),
  createGame('sci-b-04', 'science', 'ជីវវិទ្យា', 'biology', 'ការបកប្រែក្រម & ប្រូតេអ៊ីន (Translation)', 'Codons AUG & Stop Codons', 'បកប្រែកូដុងជាអាស៊ីតអាមីណេ។', 'master', 240, 60, 'Layers', 'Protein Synthesis', [
    { q: 'កូដុងផ្តើមលើ ARNm គឺ៖', options: ['AUG (មេធ្យូនីន)', 'UAA', 'UAG', 'UGA'], answer: 0, explanation: 'AUG' },
    { q: 'កូដុងឈប់រួមមាន៖', options: ['UAA, UAG, UGA', 'AUG, UAA', 'CCC, AAA', 'UAG, AUG'], answer: 0, explanation: 'UAA, UAG, UGA' }
  ]),
  createGame('sci-b-05', 'science', 'ជីវវិទ្យា', 'biology', 'ច្បាប់បង្កាត់ពូជម៉ង់ដែល (Mendel Laws)', 'Monohybrid & Dihybrid 9:3:3:1', 'គណនាសមាមាត្រកូនកាត់ 9:3:3:1 និងក្រូម៉ូសូមភេទ។', 'master', 240, 60, 'Sparkles', 'Genetics', [
    { q: 'បង្កាត់ AaBb × AaBb ផ្តល់សមាមាត្រ F2៖', options: ['9 : 3 : 3 : 1', '3 : 1', '1 : 2 : 1', '1 : 1 : 1 : 1'], answer: 0, explanation: '9:3:3:1' },
    { q: 'ក្រូម៉ូសូមភេទមនុស្សប្រុសគឺ៖', options: ['XY', 'XX', 'YY', 'XO'], answer: 0, explanation: 'XY' }
  ]),
  createGame('sci-b-06', 'science', 'ជីវវិទ្យា', 'biology', 'ការបំបែកកោសិកា មីតូស (Mitosis Phases)', 'Prophase, Metaphase, Anaphase, Telophase', 'ស្គាល់លក្ខណៈ និងចំនួនក្រូម៉ូសូមនៅគ្រប់វគ្គនៃមីតូស។', 'intermediate', 200, 60, 'Activity', 'Cell Biology', [
    { q: 'នៅវគ្គមេតាផាស ក្រូម៉ូសូមស្ថិតនៅ៖', options: ['ប្លង់អេក្វាទ័រនៃកោសិកា', 'ប៉ូលទាំងពីរ', 'ណ្វៃយ៉ូ', 'រលាយ'], answer: 0, explanation: 'តម្រៀបជួរនៅប្លង់អេក្វាទ័រ' },
    { q: 'កោសិកាមេ ២n=៤៦ ចែកតាមមីតូស ១ លើក ផ្តល់៖', options: ['២ កោសិកាកូន (២n=៤៦)', '៤ កោសិកាកូន (n=២៣)', '១ កោសិកា', '៨ កោសិកា'], answer: 0, explanation: '២ កោសិកាកូន ២n ដូចមេបេះបិទ' }
  ]),
  createGame('sci-b-07', 'science', 'ជីវវិទ្យា', 'biology', 'ការបំបែកកោសិកា មេយ៉ូស (Meiosis & Gametes)', 'Meiosis I, Meiosis II & Crossing Over', 'ស្វែងយល់ពីការកាត់ប្តូរក្រូម៉ាទីត និងការបង្កើតស្ពែម/អូវុល (n)។', 'master', 230, 60, 'Dna', 'Cell Biology', [
    { q: 'បាតុភូតកាត់ប្តូរកំណាត់ក្រូម៉ាទីត (Crossing-over) កើតនៅវគ្គ៖', options: ['ប្រូផាសទី ១ នៃមេយ៉ូស I', 'មេតាផាសទី ២', 'តេឡូផាស', 'មីតូស'], answer: 0, explanation: 'ប្រូផាស I នៃមេយ៉ូស' },
    { q: 'មេយ៉ូសបង្កើតបានកោសិកាកូនចំនួន៖', options: ['៤ កោសិកាកូន (n ក្រូម៉ូសូម)', '២ កោសិកា (២n)', '១ កោសិកា', '៦ កោសិកា'], answer: 0, explanation: '៤ កោសិកាកូន n' }
  ]),
  createGame('sci-b-08', 'science', 'ជីវវិទ្យា', 'biology', 'ប្រព័ន្ធស៊ាំ & អង់ទីករ (Immune System & Antibodies)', 'B & T Lymphocytes & Adaptive Immunity', 'ស្វែងយល់ពីតួនាទីលីមផូស៊ីត B, T និងអង់ទីករ IgG, IgM។', 'intermediate', 210, 60, 'ShieldCheck', 'Immunology', [
    { q: 'កោសិកាណាផលិតអង់ទីករប្រឆាំងមេរោគ?', options: ['ប្លាស្មូស៊ីត (កើតពី លីមផូស៊ីត B)', 'គោលិកាក្រហម', 'ប្លាកែត', 'ណឺរ៉ូន'], answer: 0, explanation: 'ប្លាស្មូស៊ីត' },
    { q: 'លីមផូស៊ីត T CD4+ (T Helper) មានតួនាទី៖', options: ['បញ្ជា និងសម្របសម្រួលប្រព័ន្ធការពាររាងកាយ', 'ដឹកនាំអុកស៊ីសែន', 'កកឈាម', 'រំលាយអាហារ'], answer: 0, explanation: 'សម្របសម្រួលប្រព័ន្ធស៊ាំ' }
  ]),
  createGame('sci-b-09', 'science', 'ជីវវិទ្យា', 'biology', 'វ៉ាក់សាំង & ភាពស៊ាំ (Vaccines & Immunity)', 'Active vs Passive Immunity', 'បែងចែកភាពស៊ាំសកម្ម និងភាពស៊ាំអកម្ម។', 'beginner', 190, 60, 'ShieldCheck', 'Immunology', [
    { q: 'ការចាក់វ៉ាក់សាំងផ្តល់នូវ៖', options: ['ភាពស៊ាំសកម្មសិប្បនិម្មិត', 'ភាពស៊ាំអកម្ម', 'គ្មានភាពស៊ាំ', 'ជំងឺរ៉ាំរ៉ៃ'], answer: 0, explanation: 'ភាពស៊ាំសកម្មសិប្បនិម្មិត' },
    { q: 'ការចាក់សេរ៉ូមអង់ទីករព្យាបាលបន្ទាន់ (ឧ. ពស់ចឹក) ជា៖', options: ['ភាពស៊ាំអកម្មសិប្បនិម្មិត', 'ភាពស៊ាំសកម្ម', 'វ៉ាក់សាំង', 'ភាពស៊ាំពីកំណើត'], answer: 0, explanation: 'ភាពស៊ាំអកម្មសិប្បនិម្មិត' }
  ]),
  createGame('sci-b-10', 'science', 'ជីវវិទ្យា', 'biology', 'ប្រព័ន្ធប្រសាទ & ណឺរ៉ូន (Nervous System & Neurons)', 'Action Potential & Synapses', 'ស្គាល់តួនាទីដង់ឌ្រីត អាក់សូន និងស៊ីណាប់។', 'master', 230, 60, 'Zap', 'Physiology', [
    { q: 'សារធាតុបញ្ជូនពត៌មានប្រសាទ (Neurotransmitter) សំខាន់រួមមាន៖', options: ['អាសេទីលកូលីន (Acetylcholine) និង ដូប៉ាមីន', 'អេម៉ូក្លូប៊ីន', 'គ្លុយកូស', 'អាំងស៊ុយលីន'], answer: 0, explanation: 'អាសេទីលកូលីន' },
    { q: 'ទិសដៅរាលនៃអាំងភ្លុចប្រសាទក្នុងណឺរ៉ូនគឺ៖', options: ['ពីដង់ឌ្រីត ទៅតួកោសិកា រួចទៅអាក់សូន', 'ពីអាក់សូនទៅដង់ឌ្រីត', 'គ្មានទិស', 'ទៅមកទាំងសងខាង'], answer: 0, explanation: 'ដង់ឌ្រីត → តួកោសិកា → អាក់សូន' }
  ]),
  createGame('sci-b-11', 'science', 'ជីវវិទ្យា', 'biology', 'ប្រព័ន្ធអង់ដូគ្រីន & អរម៉ូន (Endocrine Hormones)', 'Insulin, Glucagon & Thyroid Hormones', 'ស្វែងយល់ពីលំពែង អាំងស៊ុយលីន និងការរក្សាកំហាប់ជាតិស្ករក្នុងឈាម។', 'intermediate', 200, 60, 'Activity', 'Physiology', [
    { q: 'អរម៉ូនអាំងស៊ុយលីន (Insulin) ផលិតដោយកោសិកាណា?', options: ['កោសិកាបេតា (Beta) នៃកោះឡង់ស៊ែរហង់ក្នុងលំពែង', 'ថ្លើម', 'ក្រពះ', 'តម្រងនោម'], answer: 0, explanation: 'កោសិកាបេតាក្នុងលំពែង' },
    { q: 'តួនាទីរបស់អាំងស៊ុយលីនគឺ៖', options: ['បញ្ចុះជាតិស្ករក្នុងឈាមឱ្យមកកម្រិតធម្មតា', 'បង្កើនជាតិស្ករ', 'រំលាយខ្លាញ់', 'ផលិតឈាម'], answer: 0, explanation: 'បញ្ចុះកម្រិតជាតិស្ករ' }
  ]),
  createGame('sci-b-12', 'science', 'ជីវវិទ្យា', 'biology', 'តំណពូជភ្ជាប់ភេទ (Sex-Linked Traits)', 'Hemophilia & Color Blindness', 'គណនាប្រូបាប៊ីលីតេជំងឺឈាមក្រកក និងខ្វាក់ពណ៌ (លើក្រូម៉ូសូម X)។', 'master', 240, 60, 'Dna', 'Genetics', [
    { q: 'ហ្សែនបង្កជំងឺអេម៉ូហ្វីលី (ឈាមមិនកក) ស្ថិតនៅលើ៖', options: ['ក្រូម៉ូសូមភេទ X (ហ្សែនអន់)', 'ក្រូម៉ូសូម Y', 'ក្រូម៉ូសូមធម្មតា', 'មីតូកុងឌ្រី'], answer: 0, explanation: 'ក្រូម៉ូសូម X (អន់)' },
    { q: 'ឪពុកមានជំងឺអេម៉ូហ្វីលី (XʰY) នឹងចម្លងអាឡែលបង្កជំងឺនេះទៅ៖', options: ['កូនស្រីទាំងអស់ (១០០%)', 'កូនប្រុសទាំងអស់', 'គ្មានកូនណាទទួលទេ', '៥០% កូនប្រុស'], answer: 0, explanation: 'ឪពុកផ្តល់ Xʰ ឱ្យកូនស្រីគ្រប់រូប' }
  ]),
  createGame('sci-b-13', 'science', 'ជីវវិទ្យា', 'biology', 'បម្រែបម្រួលហ្សែន & ផ្លាស់ប្តូរក្រូម៉ូសូម (Genetic Mutations)', 'Gene & Chromosomal Mutations, Trisomy 21', 'ស្វែងយល់ពីជម្ងឺដោន (ទ្រីស៊ូមី ២១) និងការផ្លាស់ប្តូរបាស។', 'master', 230, 60, 'AlertTriangle', 'Genetics', [
    { q: 'រោគសញ្ញាដោន (Down Syndrome) បណ្តាលមកពី៖', options: ['មានក្រូម៉ូសូមគូទី ២១ ចំនួន ៣ (ទ្រីស៊ូមី ២១)', 'បាត់ក្រូម៉ូសូម X', 'លើសក្រូម៉ូសូម Y', 'បាត់ក្រូម៉ូសូម ១'], answer: 0, explanation: 'ទ្រីស៊ូមី ២១ (៤៧ ក្រូម៉ូសូម)' },
    { q: 'បម្រែបម្រួលចំណុច (Point Mutation) លើ ADN រួមមាន៖', options: ['ការជំនួសបាស ការបន្ថែមបាស ឬការបាត់បង់បាស', 'ការកើនឡើងកោសិកា', 'ការបំបែកមីតូស', 'ការហូបអាហារ'], answer: 0, explanation: 'ជំនួស បន្ថែម បាត់បង់បាស' }
  ]),
  createGame('sci-b-14', 'science', 'ជីវវិទ្យា', 'biology', 'អេកូឡូស៊ី & ច្រវ៉ាក់ចំណីអាហារ (Ecology & Food Chains)', 'Trophic Levels, Producers & Energy Pyramids', 'ស្គាល់អ្នកផលិត អ្នកបរិភោគ និងពីរ៉ាមីតថាមពលអេកូឡូស៊ី។', 'beginner', 180, 60, 'Globe', 'Ecology', [
    { q: 'តំណទី ១ នៃគ្រប់ច្រវ៉ាក់ចំណីអាហារតែងតែជា៖', options: ['អ្នកផលិត (រុក្ខជាតិស្វ័យជីវិត)', 'អ្នកស៊ីសាច់', 'អ្នកបំបែក', 'មនុស្ស'], answer: 0, explanation: 'អ្នកផលិតស្វ័យជីវិត (រុក្ខជាតិ)' },
    { q: 'ក្នុងពីរ៉ាមីតថាមពល ចំនួនថាមពលដែលផ្ទេរពីកម្រិតមួយទៅកម្រិតបន្ទាប់មានប្រមាណ៖', options: ['១០% (ច្បាប់ ១០%)', '៥០%', '១០០%', '៩០%'], answer: 0, explanation: 'ប្រមាណ ១០%' }
  ]),
  createGame('sci-b-15', 'science', 'ជីវវិទ្យា', 'biology', 'វដ្តជីវគីមីផែនដី (Biogeochemical Cycles)', 'Carbon, Nitrogen & Water Cycles', 'ស្វែងយល់ពីវដ្តកាបូន វដ្តអាសូត និងការជួសជុលអាសូតដោយបាក់តេរី។', 'intermediate', 200, 60, 'Globe', 'Ecology', [
    { q: 'រុក្ខជាតិអំបូរផ្កាត្រកូលសណ្តែកអាចជួសជុលអាសូតក្នុងដីបានដោយសារ៖', options: ['បាក់តេរីរីសូប្យូម (Rhizobium) នៅឬសរបស់វា', 'ផ្សិត', 'ពន្លឺព្រះអាទិត្យ', 'ទឹកភ្លៀង'], answer: 0, explanation: 'បាក់តេរី Rhizobium' },
    { q: 'រុក្ខជាតិស្រូបយកកាបូនឌីអុកស៊ីត (CO₂) តាមរយៈដំណើរការ៖', options: ['រស្មីសំយោគ (Photosynthesis)', 'ដង្ហើម', 'រំហួតទឹក', 'ស្រូបជី'], answer: 0, explanation: 'រស្មីសំយោគ' }
  ]),

  // =========================================================================
  // 📚 ថ្នាក់វិទ្យាសាស្ត្រសង្គម (SOCIAL SCIENCE STREAM - 80+ GAMES)
  // =========================================================================

  // --- 1. KHMER LITERATURE (25 Games) ---
  createGame('soc-k-01', 'social', 'អក្សរសាស្ត្រខ្មែរ', 'khmer', 'រឿង «ទុំទាវ» & កវីភិក្ខុសោម (Tum Teav Master)', 'Tum Teav Tragic Romance', 'វិភាគតួអង្គទុំ ទាវ ពេជ្រ ណោ មេយាយផាន់ និងទំនៀមទម្លាប់។', 'intermediate', 210, 60, 'BookOpen', 'Classical Literature', [
    {
        "q": "រឿង «ទុំទាវ» និពន្ធដោយកវីណា និងនៅឆ្នាំណា?",
        "options": [
            "ភិក្ខុសោម (១៩១៥)",
            "ក្រមង៉ុយ (១៩២០)",
            "ព្រះបាទអង្គឌួង (១៨៥០)",
            "នូ កន (១៩៣៦)"
        ],
        "answer": 0,
        "explanation": "ភិក្ខុសោម និពន្ធនៅឆ្នាំ ១៩១៥ ក្នុងសម័យអាណាព្យាបាលបារាំង។"
    },
    {
        "q": "មូលហេតុនៃសោកនាដកម្មរឿងទុំទាវគឺ៖",
        "options": [
            "ទំនៀមទម្លាប់នំមិនធំជាងនាឡិ និងការលោភលន់",
            "ការមិនចេះអក្សរ",
            "សង្គ្រាម",
            "ធម្មជាតិ"
        ],
        "answer": 0,
        "explanation": "ទំនៀមទម្លាប់បុរាណ និងការបង្ខិតបង្ខំ"
    },
    {
        "q": "តួអង្គឯកប្រុសក្នុងរឿង «ទុំទាវ» គឺនរណា?",
        "options": [
            "នេនទុំ (ទុំ)",
            "ម៉ឺនងួន",
            "ពេជ្រ",
            "អរជូន"
        ],
        "answer": 0,
        "explanation": "នេនទុំ ជាកុលបុត្រអ្នកស្រុកបាភ្នំ ខេត្តព្រៃវែង។"
    },
    {
        "q": "តួអង្គឯកស្រីក្នុងរឿង «ទុំទាវ» គឺនរណា?",
        "options": [
            "នាងទាវ",
            "នាងនោ",
            "នាងកែវ",
            "នាងម៉ាលី"
        ],
        "answer": 0,
        "explanation": "នាងទាវ ជាកុលធីតារូបស្រស់នៅស្រុកត្បូងឃ្មុំ។"
    },
    {
        "q": "តើមិត្តភក្តិដ៏ស្មោះត្រង់របស់ទុំ ឈ្មោះអ្វី?",
        "options": [
            "ពេជ្រ",
            "ណោ",
            "ម៉ឺនងួន",
            "ចៅចិត្រ"
        ],
        "answer": 0,
        "explanation": "នេនពេជ្រ ជាមិត្តភក្តិរួមសុខរួមទុក្ខរបស់ទុំ។"
    },
    {
        "q": "តើមេយាយផាន់ជាតួអង្គតំណាងឱ្យអ្វីក្នុងរឿងទុំទាវ?",
        "options": [
            "ទំនៀមទម្លាប់សក្តិភូមិបុរាណ និងការលោភលន់ចង់បានបុណ្យសក្តិ",
            "ភាពស្មោះត្រង់",
            "ការលះបង់ដើម្បីកូន",
            "សេរីភាពស្នេហា"
        ],
        "answer": 0,
        "explanation": "យាយផាន់បង្ខំកូនរៀបការជាមួយម៉ឺនងួនដោយសារលោភលន់បុណ្យសក្តិ។"
    },
    {
        "q": "តើស្ដេចដែលកាត់ក្តីក្នុងរឿងទុំទាវគឺព្រះអង្គណា?",
        "options": [
            "ព្រះបាទរាមាជើងព្រៃ",
            "ព្រះបាទអង្គឌួង",
            "ព្រះបាទជ័យវរ្ម័នទី៧",
            "ព្រះបាទនរោត្តម"
        ],
        "answer": 0,
        "explanation": "ព្រះបាទរាមាជើងព្រៃ សោយរាជ្យនៅឯរាជធានីលង្វែក។"
    },
    {
        "q": "តើសោកនាដកម្មធំបំផុតក្នុងរឿងទុំទាវបានកើតឡើងនៅឯណា?",
        "options": [
            "ក្រោមដើមពោធិ៍ជើងខាល",
            "វត្តវិហារធំ",
            "រាជធានីលង្វែក",
            "ភូមិក្រាំងលាវ"
        ],
        "answer": 0,
        "explanation": "ទុំត្រូវបានអរជូនសម្លាប់នៅក្រោមដើមពោធិ៍ជើងខាល រួចទាវក៏អារកសម្លាប់ខ្លួនតាម។"
    }
]),
  createGame('soc-k-02', 'social', 'អក្សរសាស្ត្រខ្មែរ', 'khmer', 'រឿង «កុលាបប៉ៃលិន» & ចៅចិត្រ (Kolab Pailin)', 'Kolab Pailin Realist Novel', 'ស្វែងយល់ពីគុណធម៌តួអង្គចៅចិត្រ និងឃុននរិន្ទ។', 'intermediate', 200, 60, 'BookOpen', 'Modern Novels', [
    {
        "q": "រឿង «កុលាបប៉ៃលិន» ជាស្នាដៃនិពន្ធរបស់អ្នកនិពន្ធរូបណា?",
        "options": [
            "ញ៉ុក ថែម (១៩៣៦ ឬ ១៩៤៣)",
            "ភិក្ខុសោម",
            "រីម គីន",
            "ឌឹក គាម"
        ],
        "answer": 0,
        "explanation": "ញ៉ុក ថែម និពន្ធនៅឆ្នាំ ១៩៣៦ (បោះពុម្ព ១៩៤៣)។"
    },
    {
        "q": "តួអង្គ «ចៅចិត្រ» ជាតំណាងឱ្យ៖",
        "options": [
            "ភាពស្មោះត្រង់ ឧស្សាហ៍ព្យាយាម មានសីលធម៌",
            "កំសាក",
            "អាត្មានិយម",
            "ខ្ជិលច្រអូស"
        ],
        "answer": 0,
        "explanation": "ភាពស្មោះត្រង់ និងការតស៊ូ"
    },
    {
        "q": "តួអង្គ «ឃុននារី» ជាកូនស្រីរបស់នរណា?",
        "options": [
            "ហ្លួងរតនសម្បត្តិ",
            "ចៅហ៊្វាដុង",
            "លោកបាដេស",
            "ចៅចិត្រ"
        ],
        "answer": 0,
        "explanation": "ឃុននារីជាកូនស្រីតែមួយគត់របស់ហ្លួងរតនសម្បត្តិ។"
    },
    {
        "q": "តើទីតាំងចម្បងនៃដំណើររឿងកុលាបប៉ៃលិនស្ថិតនៅខេត្តណា?",
        "options": [
            "ប៉ៃលិន (ខេត្តបាត់ដំបងសម័យនោះ)",
            "សៀមរាប",
            "ព្រះសីហនុ",
            "កំពត"
        ],
        "answer": 0,
        "explanation": "រឿងកុលាបប៉ៃលិនរៀបរាប់ពីទឹកដីត្បូងពេជ្រប៉ៃលិន។"
    },
    {
        "q": "តើចៅចិត្របានជួយសង្គ្រោះហ្លួងរតនសម្បត្តិពីគ្រោះថ្នាក់អ្វី?",
        "options": [
            "ពីការប្លន់ និងការលួចបាញ់ប្រហាររបស់ចោរព្រៃ",
            "ពីគ្រោះទឹកជំនន់",
            "ពីជំងឺអាសន្នរោគ",
            "ពីការលិចទូក"
        ],
        "answer": 0,
        "explanation": "ចៅចិត្របានជួយសង្គ្រោះហ្លួងរតនសម្បត្តិពីការបាញ់ប្រហាររបស់ក្រុមចោរព្រៃ។"
    },
    {
        "q": "តើពាក្យ «កុលាបប៉ៃលិន» ក្នុងរឿងមានន័យធៀបសំដៅលើនរណា?",
        "options": [
            "ឃុននារី (ស្រីស្អាតនៅប៉ៃលិន)",
            "ចៅចិត្រ",
            "ហ្លួងរតនសម្បត្តិ",
            "ត្បូងទទឹម"
        ],
        "answer": 0,
        "explanation": "កុលាបប៉ៃលិន ជាពាក្យប្រៀបធៀបសំដៅលើសម្រស់ និងគុណធម៌របស់ឃុននារី។"
    },
    {
        "q": "តើរឿងកុលាបប៉ៃលិនជាប្រភេទអក្សរសិល្ប៍បែបណា?",
        "options": [
            "អក្សរសិល្ប៍ទំនើបបែបប្រាកដនិយម និងមនោសញ្ចេតនា",
            "អក្សរសិល្ប៍បុរាណបែបព្រហ្មញ្ញសាសនា",
            "រឿងព្រេងបុរាណ",
            "រឿងទេវកថា"
        ],
        "answer": 0,
        "explanation": "ជាប្រលោមលោកទំនើបបែបមនោសញ្ចេតនា និងប្រាកដនិយម។"
    }
]),
  createGame('soc-k-03', 'social', 'អក្សរសាស្ត្រខ្មែរ', 'khmer', 'រឿង «ភូមិតិរច្ឆាន» (Phum Tirachhan Revolt)', 'Phum Tirachhan Historical Revolt', 'វិភាគចលនាតស៊ូប្រឆាំងនឹងបារាំងបាដេស ឡាចាត។', 'master', 230, 60, 'Feather', 'Historical Novels', [
    {
        "q": "រឿង «ភូមិតិរច្ឆាន» ជាស្នាដៃនិពន្ធរួមគ្នារវាងអ្នកនិពន្ធណាខ្លះ?",
        "options": [
            "ឌឹក គាម និង ឌី ឈាន (១៩៦៤-១៩៧១)",
            "ញ៉ុក ថែម និង រីម គីន",
            "ភិក្ខុសោម និង ក្រមង៉ុយ",
            "សួន សុរិន្ទ និង ជុត ខៃ"
        ],
        "answer": 0,
        "explanation": "ឌឹក គាម និង ឌី ឈាន បាននិពន្ធរឿងនេះឡើងផ្អែកលើព្រឹត្តិការណ៍ប្រវត្តិសាស្ត្រពិត។"
    },
    {
        "q": "មូលហេតុនៃការបះបោរភូមិក្រាំងលាវគឺ៖",
        "options": [
            "ការគាបសង្កត់ទារពន្ធដារយ៉ាងឃោរឃៅពីបារាំងបាដេស",
            "ជម្លោះដីធ្លី",
            "អំណាច",
            "សាសនា"
        ],
        "answer": 0,
        "explanation": "ការគាបសង្កត់ពន្ធដារបារាំង"
    },
    {
        "q": "តើព្រឹត្តិការណ៍ប្រវត្តិសាស្ត្រក្នុងរឿងភូមិតិរច្ឆានកើតឡើងនៅឆ្នាំណា?",
        "options": [
            "១៨ មេសា ១៩២៥",
            "៩ វិច្ឆិកា ១៩៥៣",
            "១៧ មេសា ១៩៧៥",
            "២៣ តុលា ១៩៩១"
        ],
        "answer": 0,
        "explanation": "ការបះបោរសម្លាប់បារាំងបាដេសកើតឡើងនៅថ្ងៃទី ១៨ មេសា ១៩២៥។"
    },
    {
        "q": "តើការបះបោរប្រឆាំងបារាំងក្នុងរឿងនេះកើតឡើងនៅភូមិណា និងខេត្តណា?",
        "options": [
            "ភូមិក្រាំងលាវ ខេត្តកំពង់ឆ្នាំង",
            "ភូមិត្បូងឃ្មុំ ខេត្តកំពង់ចាម",
            "ភូមិស្វាយប៉ោ ខេត្តបាត់ដំបង",
            "ភូមិកំពង់លួង ខេត្តកណ្តាល"
        ],
        "answer": 0,
        "explanation": "ភូមិក្រាំងលាវ ស្រុករលាប្អៀរ ខេត្តកំពង់ឆ្នាំង។"
    },
    {
        "q": "តើមន្ត្រីបារាំងដែលត្រូវអ្នកភូមិក្រាំងលាវវាយសម្លាប់ឈ្មោះអ្វី?",
        "options": [
            "រ៉េស៊ីដង់ បាដេស (Félix Louis Bardez)",
            "ដឺ ឡាហ្គ្រេ (Doudart de Lagrée)",
            "ហ្កានីយេ (Francis Garnier)",
            "ប៉ាវី (Auguste Pavie)"
        ],
        "answer": 0,
        "explanation": "បារាំងឈ្មោះ បាដេស (Bardez) ត្រូវបានអ្នកភូមិវាយសម្លាប់ព្រោះតែការទារពន្ធឃោរឃៅ។"
    },
    {
        "q": "ហេតុអ្វីបានជាបារាំងដាក់ឈ្មោះភូមិក្រាំងលាវថា «ភូមិតិរច្ឆាន»?",
        "options": [
            "ដើម្បីសងសឹក និងបន្ទាបបន្ថោកកិត្តិយសអ្នកភូមិដែលសម្លាប់បាដេស",
            "ព្រោះភូមិនោះមានសត្វព្រៃច្រើន",
            "ព្រោះជាឈ្មោះពីបុរាណ",
            "ព្រោះអ្នកភូមិសុំប្តូរ"
        ],
        "answer": 0,
        "explanation": "បារាំងដាក់ឈ្មោះថា ភូមិតិរច្ឆាន ដើម្បីដាក់ទណ្ឌកម្ម និងបន្ទាបតម្លៃអ្នកភូមិក្រាំងលាវ។"
    },
    {
        "q": "តួអង្គ «បាឌិន» និង «ជួន» ក្នុងរឿងជាតំណាងឱ្យអ្វី?",
        "options": [
            "ស្មារតីស្នេហាជាតិ និងភាពក្លាហានប្រឆាំងនឹងការជិះជាន់អាណានិគម",
            "ជនក្បត់ជាតិ",
            "ចោរប្លន់",
            "មន្ត្រីបារាំង"
        ],
        "answer": 0,
        "explanation": "ជាអ្នកភូមិក្លាហានហ៊ានក្រោកឈរប្រឆាំងនឹងការគៀបសង្កត់ពន្ធដារ។"
    }
]),
  createGame('soc-k-04', 'social', 'អក្សរសាស្ត្រខ្មែរ', 'khmer', 'តែងសេចក្តីពន្យល់ ពិភាក្សា (Essay Frameworks)', 'Khmer Essay Structure & Outline', 'ស្ទាត់ជំនាញបែងចែកផ្តើមសេចក្តី តួសេចក្តី និងបញ្ចប់សេចក្តី។', 'master', 250, 60, 'FileText', 'Essay Writing', [
    {
        "q": "គម្រោងតែងសេចក្តីមានប៉ុន្មានផ្នែក?",
        "options": [
            "៣ ផ្នែក (ផ្តើម, តួ, បញ្ចប់)",
            "២ ផ្នែក",
            "៤ ផ្នែក",
            "៥ ផ្នែក"
        ],
        "answer": 0,
        "explanation": "៣ ផ្នែក"
    },
    {
        "q": "តែងសេចក្តីបែប «ពិភាក្សា» ត្រូវមាន៖",
        "options": [
            "មតិស្រប និង មតិផ្ទុយ រួចសំយោគ",
            "ពន្យល់តែម្យ៉ាង",
            "រៀបរាប់ដំណើរ",
            "គ្មានការវែកញែក"
        ],
        "answer": 0,
        "explanation": "ស្រប ផ្ទុយ សំយោគ"
    },
    {
        "q": "ក្នុងផ្នែក «ផ្តើមសេចក្តី» ត្រូវមានធាតុផ្សំសំខាន់ៗចំនួន ៣ គឺ៖",
        "options": [
            "លំនាំបញ្ហា, ចំណូលបញ្ហា, ចំណោទបញ្ហា",
            "ពន្យល់ពាក្យ, បកស្រាយ, ឧទាហរណ៍",
            "វាយតម្លៃ, មតិផ្ទាល់ខ្លួន, សន្និដ្ឋាន",
            "សេចក្តីផ្តើម, កថាខណ្ឌ, វណ្ណយុត្តិ"
        ],
        "answer": 0,
        "explanation": "ផ្តើមសេចក្តីត្រូវមាន លំនាំបញ្ហា ចំណូលបញ្ហា និងចំណោទបញ្ហា។"
    },
    {
        "q": "តើតែងសេចក្តីបែប «ពន្យល់» មានគោលបំណងចម្បងលើអ្វី?",
        "options": [
            "បកស្រាយបំភ្លឺគំនិតនៃប្រធានឱ្យអ្នកអានយល់ច្បាស់ និងជឿជាក់",
            "រកចំណុចខុសគ្នារវាងគំនិតពីរ",
            "ជជែកដេញដោលរកខុសត្រូវ",
            "និពន្ធរឿងប្រឌិត"
        ],
        "answer": 0,
        "explanation": "បែបពន្យល់គឺបកស្រាយបំភ្លឺន័យប្រធានឱ្យច្បាស់លាស់។"
    },
    {
        "q": "តើតែងសេចក្តីបែប «ប្រៀបធៀប» ត្រូវផ្តោតលើចំណុចណា?",
        "options": [
            "ចំណុចដូចគ្នា (ភាពស្រដៀង) និងចំណុចខុសគ្នា (ភាពផ្ទុយ) រវាងប្រធានបទពីរ",
            "តែចំណុចដូចគ្នា",
            "តែចំណុចខុសគ្នា",
            "មិនបាច់ប្រៀបធៀប"
        ],
        "answer": 0,
        "explanation": "បែបប្រៀបធៀបត្រូវរកចំណុចដូច និងចំណុចខុសគ្នារួចធ្វើការវាយតម្លៃ។"
    }
]),
  createGame('soc-k-05', 'social', 'អក្សរសាស្ត្រខ្មែរ', 'khmer', 'សំនួនវោហារ ឧបមា (Figures of Speech)', 'Metaphors & Similes', 'ញែកឧបមាន សទិសភាព និងបុគ្គលាធិប្បាយ។', 'intermediate', 200, 60, 'Feather', 'Khmer Linguistics', [
    {
        "q": "«ចិត្តស្អាតដូចកែវ» ជាសំនួន៖",
        "options": [
            "ឧបមា (Simile)",
            "បំផ្លើស",
            "បុគ្គលាធិប្បាយ",
            "កិរិយា"
        ],
        "answer": 0,
        "explanation": "សំនួនឧបមា"
    },
    {
        "q": "«ព្រៃឈើខ្សឹបប្រាប់ខ្ញុំ» ជាសំនួន៖",
        "options": [
            "បុគ្គលាធិប្បាយ",
            "ឧបមា",
            "បំផ្លើស",
            "សទិសន័យ"
        ],
        "answer": 0,
        "explanation": "បុគ្គលាធិប្បាយ"
    },
    {
        "q": "ឃ្លាថា «មុខស្រស់ដូចផ្ការីក» ជាទម្រង់សំនួនវោហារអ្វី?",
        "options": [
            "សំនួនឧបមា (Simile)",
            "សំនួនបំផ្លើស (Hyperbole)",
            "បុគ្គលាធិប្បាយ (Personification)",
            "សទិសន័យ (Synonym)"
        ],
        "answer": 0,
        "explanation": "មានពាក្យ «ដូច» សម្រាប់ប្រៀបធៀបរវាងឧបមាន និងឧបមេយ្យ។"
    },
    {
        "q": "ឃ្លាថា «យំទឹកភ្នែកហូរជាទន្លេ» ប្រើសំនួនវោហារអ្វី?",
        "options": [
            "សំនួនបំផ្លើស (Hyperbole)",
            "ឧបមា (Simile)",
            "បុគ្គលាធិប្បាយ",
            "សទិសន័យ"
        ],
        "answer": 0,
        "explanation": "សំនួនបំផ្លើស គឺការនិយាយហួសពីការពិតដើម្បីបង្កើនទម្ងន់នៃរូបារម្មណ៍។"
    },
    {
        "q": "ក្នុងសំនួនឧបមា «មុខដូចដួងច័ន្ទ» តើពាក្យ «មុខ» ជាអ្វី?",
        "options": [
            "ឧបមេយ្យ (វត្ថុដែលយកទៅប្រៀប)",
            "ឧបមាន (វត្ថុសម្រាប់ប្រៀបធៀប)",
            "ពាក្យឧបមា",
            "គុណនាម"
        ],
        "answer": 0,
        "explanation": "មុខ ជា ឧបមេយ្យ ចំណែក ដួងច័ន្ទ ជា ឧបមាន។"
    }
]),
  createGame('soc-k-06', 'social', 'អក្សរសាស្ត្រខ្មែរ', 'khmer', 'សុភាសិតខ្មែរ (Khmer Proverbs)', 'Proverbs & Folk Wisdom', 'វិភាគតម្លៃអប់រំនៃសុភាសិតបុរាណខ្មែរ។', 'beginner', 190, 60, 'BookMarked', 'Khmer Culture', [
    {
        "q": "«ចេះដប់មិនស្មើប្រសប់មួយ» អប់រំអំពី៖",
        "options": [
            "ការអនុវត្តជាក់ស្តែង និងជំនាញពិតប្រាកដ",
            "មិនបាច់រៀនច្រើន",
            "ចេះដប់គឺអន់",
            "គ្មានន័យ"
        ],
        "answer": 0,
        "explanation": "ជំនាញអនុវត្តជាក់ស្តែង"
    },
    {
        "q": "«ទូកទៅកំពង់នៅ» មានន័យធៀបថា៖",
        "options": [
            "មនុស្សផ្លាស់ប្តូរតែប្រទេសជាតិនៅស្ថិតស្ថេរ",
            "ទូកមិនទៅណា",
            "កំពង់ផែត្រូវរុះរើ",
            "រឿងទូក"
        ],
        "answer": 0,
        "explanation": "មនុស្សផ្លាស់ប្តូរតែជាតិនៅគង់វង្ស"
    },
    {
        "q": "សុភាសិត «នៅផ្ទះម្តាយទីទៃ ទៅព្រៃម្តាយតែមួយ» អប់រំអំពីអ្វី?",
        "options": [
            "សាមគ្គីភាព និងការចេះជួយគ្នាក្នុងគ្រាអាសន្ន ឬពេលនៅឆ្ងាយផ្ទះ",
            "ការបែកបាក់គ្រួសារ",
            "ការដើរលេងក្នុងព្រៃ",
            "ការប្រកាន់ពូជសាសន៍"
        ],
        "answer": 0,
        "explanation": "អប់រំស្មារតីសាមគ្គីភាព និងការស្រឡាញ់រាប់អានគ្នាដូចបងប្អូន។"
    },
    {
        "q": "សុភាសិត «កាប់បំពង់រង់ចាំទឹកភ្លៀង» អប់រំរិះគន់មនុស្សបែបណា?",
        "options": [
            "មនុស្សខ្ជិលច្រអូស រង់ចាំតែសំណាងដោយមិនព្រមខិតខំប្រឹងប្រែងធ្វើការ",
            "មនុស្សឧស្សាហ៍",
            "មនុស្សចេះសន្សំសំចៃ",
            "កសិករធ្វើស្រែ"
        ],
        "answer": 0,
        "explanation": "រិះគន់មនុស្សដែលខ្ជិលច្រអូសចាំតែសំណាងព្រហ្មលិខិត។"
    }
]),
  createGame('soc-k-07', 'social', 'អក្សរសាស្ត្រខ្មែរ', 'khmer', 'រឿង «សុភាត» & រីម គីន (Sophat Novel)', 'Sophat Early Modern Novel', 'ស្វែងយល់ពីជីវិតតស៊ូរបស់សុភាត និងសង្គមខ្មែរទសវត្សរ៍ ១៩៣០។', 'intermediate', 200, 60, 'BookOpen', 'Modern Novels', [
    {
        "q": "រឿង «សុភាត» និពន្ធដោយអ្នកនិពន្ធណា?",
        "options": [
            "រីម គីន (១៩៣៨)",
            "ញ៉ុក ថែម",
            "ភិក្ខុសោម",
            "ក្រមង៉ុយ"
        ],
        "answer": 0,
        "explanation": "រីម គីន"
    },
    {
        "q": "រឿងសុភាតត្រូវបានចាត់ទុកជា៖",
        "options": [
            "ប្រលោមលោកទំនើបដំបូងគេបង្អស់នៃអក្សរសិល្ប៍ខ្មែរ",
            "កំណាព្យបុរាណ",
            "រឿងព្រេង",
            "ច្បាប់ស្រី"
        ],
        "answer": 0,
        "explanation": "ប្រលោមលោកទំនើបបែបបស្ចិមប្រទេសដំបូង"
    },
    {
        "q": "តួអង្គឯកប្រុស «សុផាត» ជាកូនបង្កើតរបស់នរណា?",
        "options": [
            "លោកចៅពញាភក្តីសង្គ្រាម ម៉ែន និង នាងស៊ូ",
            "យាយសោ",
            "ចៅចិត្រ",
            "ហ្លួងរតនសម្បត្តិ"
        ],
        "answer": 0,
        "explanation": "សុផាតជាកូនរបស់លោកម៉ែន និងនាងស៊ូ។"
    },
    {
        "q": "តើតួអង្គឯកស្រីដែលស្រឡាញ់សុផាតឈ្មោះអ្វី?",
        "options": [
            "នាងមណ្ឌា",
            "នាងទាវ",
            "ឃុននារី",
            "នាងកែវ"
        ],
        "answer": 0,
        "explanation": "នាងមណ្ឌា ជាកូនស្រីលោកកេសោរ និងអ្នកស្រីសោភ័ណ។"
    }
]),
  createGame('soc-k-08', 'social', 'អក្សរសាស្ត្រខ្មែរ', 'khmer', 'រឿង «ស៊ីមអ្នកបរឡាន» (Sim the Chauffeur)', 'Sim the Driver Realist Novel', 'ស្វែងយល់ពីជីវភាពវណ្ណៈកម្មករ និងស្មារតីស្នេហាជាតិ។', 'intermediate', 210, 60, 'BookOpen', 'Social Realism', [
    {
        "q": "រឿង «ស៊ីមអ្នកបរឡាន» និពន្ធដោយ៖",
        "options": [
            "អ៊ឹម ថុក (១៩៥៦)",
            "ញ៉ុក ថែម",
            "ឌឹក គាម",
            "រីម គីន"
        ],
        "answer": 0,
        "explanation": "អ៊ឹម ថុក"
    },
    {
        "q": "តួអង្គ «ស៊ីម» ជាតំណាងឱ្យ៖",
        "options": [
            "វណ្ណៈកម្មករដែលមានស្មារតីភ្ញាក់រលឹក និងសាមគ្គីភាព",
            "សេដ្ឋី",
            "មន្ត្រីសក្តិភូមិ",
            "ឈ្មួញកណ្តាល"
        ],
        "answer": 0,
        "explanation": "វណ្ណៈកម្មករតស៊ូ"
    },
    {
        "q": "តើរឿងស៊ីមអ្នកបរឡានឆ្លុះបញ្ចាំងពីបញ្ហាសង្គមអ្វីខ្លះ?",
        "options": [
            "ជីវភាពតស៊ូរបស់វណ្ណៈកម្មករ និងការកេងប្រវ័ញ្ចកម្លាំងពលកម្ម",
            "ស្នេហាត្រីកោណ",
            "សង្គ្រាមសាសនា",
            "រឿងព្រេងបុរាណ"
        ],
        "answer": 0,
        "explanation": "ឆ្លុះបញ្ចាំងពីជីវភាពពិតរបស់កម្មករ និងសង្គមខ្មែរក្រោយឯករាជ្យ។"
    }
]),
  createGame('soc-k-09', 'social', 'អក្សរសាស្ត្រខ្មែរ', 'khmer', 'ច្បាប់ល្បើកថ្មី & ក្រមង៉ុយ (Kram Ngoy Wisdom)', 'Kram Ngoy Moral Verses', 'ស្វែងយល់ពីពាក្យទូន្មាន និងកាព្យអប់រំចិត្តរបស់បណ្ឌិតក្រមង៉ុយ។', 'beginner', 190, 60, 'Feather', 'Moral Verses', [
    {
        "q": "កវីល្បីល្បាញខាងកំណាព្យទូន្មានប្រៀនប្រដៅគឺ៖",
        "options": [
            "អ្នកភិរម្យភាសាអ៊ូ ហៅ ក្រមង៉ុយ",
            "ភិក្ខុសោម",
            "ញ៉ុក ថែម",
            "រីម គីន"
        ],
        "answer": 0,
        "explanation": "ក្រមង៉ុយ"
    },
    {
        "q": "ស្នាដៃរបស់ក្រមង៉ុយរួមមាន៖",
        "options": [
            "ច្បាប់ល្បើកថ្មី, ច្បាប់កេរកាល, ពាក្យកាព្យទូន្មាន",
            "ទុំទាវ",
            "កុលាបប៉ៃលិន",
            "សុភាត"
        ],
        "answer": 0,
        "explanation": "ច្បាប់ល្បើកថ្មី និងច្បាប់កេរកាល"
    },
    {
        "q": "បណ្ឌិត «ក្រមង៉ុយ» មានគោរមងារពេញលេញជាអ្វី?",
        "options": [
            "អ្នកភិរម្យភាសាអ៊ូ ហៅ ង៉ុយ",
            "ព្រះមហាអគ្គរាជ",
            "ឧកញ៉ាសុត្តន្តប្រីជាឥន្ទ",
            "ភិក្ខុសោម"
        ],
        "answer": 0,
        "explanation": "ព្រះបាទស៊ីសុវត្ថិ បានប្រោសព្រះរាជទានគោរមងារជា អ្នកភិរម្យភាសាអ៊ូ ហៅ ង៉ុយ។"
    },
    {
        "q": "ពាក្យបណ្តាំក្រមង៉ុយ «កុំពត់ស្រឡៅ កុំប្រដៅមនុស្សខូច» មានន័យអប់រំអំពីអ្វី?",
        "options": [
            "ការដឹងពីកាលទេសៈ និងការប្រុងប្រយ័ត្នក្នុងការទូន្មានមនុស្សចរិតពាលដែលមិនចង់កែខ្លួន",
            "មិនឱ្យដាំដើមស្រឡៅ",
            "មិនឱ្យរៀនអក្សរ",
            "ឱ្យស្អប់មនុស្សទាំងអស់"
        ],
        "answer": 0,
        "explanation": "អប់រំអំពីការពិចារណាមនុស្សមុននឹងផ្តល់ដំបូន្មាន។"
    }
]),
  createGame('soc-k-10', 'social', 'អក្សរសាស្ត្រខ្មែរ', 'khmer', 'កាព្យ ៧ ព្យាង្គ & ៨ ព្យាង្គ (Khmer Poetics & Metres)', 'Khmer Rhyme Schemes & Metres', 'ស្ទាត់ជំនាញចំណាប់ចុងចួន និងក្បួនកាព្យមេពាក្យ ៧ ពាក្យ ៨។', 'master', 230, 60, 'Feather', 'Poetics', [
    { q: 'កាព្យពាក្យ ៧ មួយវគ្គមានប៉ុន្មានឃ្លា?', options: ['៤ ឃ្លា', '២ ឃ្លា', '៣ ឃ្លា', '៦ ឃ្លា'], answer: 0, explanation: '៤ ឃ្លា ក្នុង ១ វគ្គ' },
    { q: 'ចំណាប់ជួននៃកាព្យពាក្យ ៧ គឺព្យាង្គចុងឃ្លាទី ១ ជួននឹង៖', options: ['ព្យាង្គទី ៤ ឬ ទី ៥ នៃឃ្លាទី ២', 'ព្យាង្គចុងឃ្លាទី ២', 'ព្យាង្គទី ១ នៃឃ្លាទី ២', 'មិនបាច់ជួន'], answer: 0, explanation: 'ព្យាង្គទី ៤ ឬ ៥ នៃឃ្លាទី ២' }
  ]),
  createGame('soc-k-11', 'social', 'អក្សរសាស្ត្រខ្មែរ', 'khmer', 'តែងសេចក្តីបែបប្រៀបធៀប (Comparative Essay)', 'Comparative Essay Methodology', 'ស្ទាត់ជំនាញប្រៀបធៀបតួអង្គ គំនិត និងតម្លៃអក្សរសិល្ប៍។', 'master', 240, 60, 'FileText', 'Essay Writing', [
    { q: 'តែងសេចក្តីប្រៀបធៀបតម្រូវឱ្យរកឃើញ៖', options: ['ចំណុចដូចគ្នា និងចំណុចខុសគ្នា រួចវាយតម្លៃ', 'តែចំណុចដូច', 'តែចំណុចខុស', 'គ្មានការវាយតម្លៃ'], answer: 0, explanation: 'ចំណុចដូច និងចំណុចខុសគ្នា' },
    { q: 'ការប្រៀបធៀបតួអង្គទុំ និងចៅចិត្រ បង្ហាញពី៖', options: ['ទស្សនៈស្នេហាបែបសក្តិភូមិ vs ស្នេហាបែបទំនើបផ្អែកលើការតស៊ូ', 'ភាពដូចគ្នាទាំងស្រុង', 'គ្មានទំនាក់ទំនង', 'រឿងដូចគ្នា'], answer: 0, explanation: 'ភាពខុសគ្នានៃការតស៊ូក្នុងសង្គមពីរផ្សេងគ្នា' }
  ]),
  createGame('soc-k-12', 'social', 'អក្សរសាស្ត្រខ្មែរ', 'khmer', 'វេយ្យាករណ៍ខ្មែរ & ថ្នាក់ពាក្យ (Khmer Grammar Classes)', 'Word Classes: Nouns, Verbs & Connectors', 'បែងចែកនាម កិរិយា គុណនាម ឈ្នាប់ និងកន្សោមពាក្យ។', 'beginner', 180, 60, 'BookMarked', 'Linguistics', [
    { q: 'ពាក្យ «និង, ហើយ, ប៉ុន្តែ, ពីព្រោះ» ជាថ្នាក់ពាក្យអ្វី?', options: ['ឈ្នាប់ (Conjunctions)', 'នាម', 'កិរិយា', 'គុណនាម'], answer: 0, explanation: 'ឈ្នាប់ភ្ជាប់ឃ្លា' },
    { q: 'ពាក្យផ្សំ «សាលារៀន, ទឹកដី, មាតុភូមិ» ជាប្រភេទ៖', options: ['នាមផ្សំ (Compound Nouns)', 'កិរិយា', 'គុណកិរិយា', 'សព្វនាម'], answer: 0, explanation: 'នាមផ្សំ' }
  ]),
  createGame('soc-k-13', 'social', 'អក្សរសាស្ត្រខ្មែរ', 'khmer', 'រឿង «រាមកេរ្តិ៍» បុរាណ (Reamker Epic)', 'Reamker Epic Poem & Culture', 'ស្វែងយល់ពីតួអង្គព្រះរាម នាងសិតា ក្រុងរាពណ៍ និងហនុមាន។', 'intermediate', 210, 60, 'Crown', 'Epic Literature', [
    { q: 'រឿង «រាមកេរ្តិ៍» ខ្មែរជាស្នាដៃអក្សរសិល្ប៍ដែលទទួលឥទ្ធិពលពី៖', options: ['រឿងរាមាយណៈឥណ្ឌា តែបានកែច្នៃស្របតាមផ្នត់គំនិតខ្មែរ', 'ចិន', 'បារាំង', 'ក្រិក'], answer: 0, explanation: 'រាមាយណៈឥណ្ឌាដែលបានខ្មែរូបនីយកម្ម' },
    { q: 'តួអង្គ «ព្រះរាម» ជាតំណាងឱ្យ៖', options: ['ភាពត្រឹមត្រូវ ធម៌ និងអំណាចសច្ចធម៌', 'អំពើបាប', 'ភាពកំសាក', 'ការបោកប្រាស់'], answer: 0, explanation: 'តំណាងសច្ចធម៌ និងអំពើល្អ' }
  ]),
  createGame('soc-k-14', 'social', 'អក្សរសាស្ត្រខ្មែរ', 'khmer', 'រឿង «គ្រូបង្រៀនស្រុកស្រែ» (Rural Teacher)', 'Rural Teacher Novel by Chuth Khai', 'ស្វែងយល់ពីការលះបង់របស់គ្រូបង្រៀននៅជនបទ។', 'intermediate', 200, 60, 'BookOpen', 'Modern Novels', [
    { q: 'រឿង «គ្រូបង្រៀនស្រុកស្រែ» និពន្ធដោយ៖', options: ['ជុត ខៃ', 'ញ៉ុក ថែម', 'រីម គីន', 'ឌឹក គាម'], answer: 0, explanation: 'ជុត ខៃ' },
    { q: 'ប្រធានរឿងឆ្លុះបញ្ចាំងពី៖', options: ['ការលះបង់ និងឧត្តមគតិអប់រំរបស់គ្រូបង្រៀននៅជនបទ', 'ការធ្វើជំនួញ', 'សង្គ្រាមត្រជាក់', 'នយោបាយ'], answer: 0, explanation: 'ការលះបង់ដើម្បីការអប់រំជនបទ' }
  ]),
  createGame('soc-k-15', 'social', 'អក្សរសាស្ត្រខ្មែរ', 'khmer', 'សិល្បៈតែងកំណាព្យខ្មែរ (Khmer Poetic Arts)', '7 Metres of Khmer Traditional Poems', 'ស្វែងយល់ពីកាកគតិ ព្រហ្មគីតិ ពាក្យ ៧ ពាក្យ ៨ និងបន្ទោលកាក។', 'master', 240, 60, 'Feather', 'Poetics', [
    { q: 'កាព្យ «កាកគតិ» មួយវគ្គមានប៉ុន្មានព្យាង្គសរុប?', options: ['២៨ ព្យាង្គ (៧ ឃ្លា × ៤ ព្យាង្គ)', '២០ ព្យាង្គ', '៣២ ព្យាង្គ', '១៦ ព្យាង្គ'], answer: 0, explanation: '៧ ឃ្លា ក្នុង ១ ឃ្លាមាន ៤ ព្យាង្គ = ២៨ ព្យាង្គ' },
    { q: 'កាព្យ «ព្រហ្មគីតិ» ឃ្លាទី ១ និងទី ៣ មានប៉ុន្មានព្យាង្គ?', options: ['៥ ព្យាង្គ (ឃ្លា ២ និង ៤ មាន ៦ ព្យាង្គ)', '៤ ព្យាង្គ', '៧ ព្យាង្គ', '៨ ព្យាង្គ'], answer: 0, explanation: '៥ ព្យាង្គ' }
  ]),
  createGame('soc-k-16', 'social', 'អក្សរសាស្ត្រខ្មែរ', 'khmer', 'រឿង «មាលាដួងចិត្ត» & នូ ហាច (Mealea Duong Chet)', 'Mealea Duong Chet Romantic Tragedy', 'ស្វែងយល់ពីរឿងស្នេហា និងប្រវត្តិសាស្ត្រសម័យបារាំង និងសៀម។', 'intermediate', 210, 60, 'BookOpen', 'Modern Novels', [
    { q: 'រឿង «មាលាដួងចិត្ត» និពន្ធដោយអ្នកនិពន្ធណា?', options: ['នូ ហាច (១៩៥២)', 'ញ៉ុក ថែម', 'រីម គីន', 'ភិក្ខុសោម'], answer: 0, explanation: 'នូ ហាច' },
    { q: 'តួអង្គសំខាន់ៗក្នុងរឿងមាលាដួងចិត្តរួមមាន៖', options: ['ទីគឃាវុធ និង នាងធីដា', 'ទុំ និង ទាវ', 'ចៅចិត្រ និង ឃុននារី', 'សុភាត និង សោភ័ណ'], answer: 0, explanation: 'ទីឃាវុធ និង ធីដា' }
  ]),
  createGame('soc-k-17', 'social', 'អក្សរសាស្ត្រខ្មែរ', 'khmer', 'រឿង «ផ្កាស្រពោន» & នូ ហាច (Phka Sropoun)', 'Phka Sropoun Tragic Romance', 'ស្វែងយល់ពីតួអង្គវិបុល នាងវិធាវី និងការបង្ខិតបង្ខំស្នេហា។', 'intermediate', 210, 60, 'BookOpen', 'Modern Novels', [
    { q: 'រឿង «ផ្កាស្រពោន» និពន្ធដោយអ្នកនិពន្ធណា?', options: ['នូ ហាច (១៩៤៧)', 'ញ៉ុក ថែម', 'រីម គីន', 'ឌឹក គាម'], answer: 0, explanation: 'នូ ហាច' },
    { q: 'ប្រធានរឿងផ្កាស្រពោនឆ្លុះបញ្ចាំងពី៖', options: ['សោកនាដកម្មស្នេហាដោយសារការបង្ខិតបង្ខំពីម្តាយ (យាយនួន)', 'ការធ្វើសង្គ្រាម', 'ការប្រឡងបាក់ឌុប', 'រឿងព្រេង'], answer: 0, explanation: 'ការបង្ខិតបង្ខំអាពាហ៍ពិពាហ៍តាមទំនៀមទម្លាប់' }
  ]),
  createGame('soc-k-18', 'social', 'អក្សរសាស្ត្រខ្មែរ', 'khmer', 'រឿង «ថៅកែធិត» & វណ្ណៈសង្គម (Thaukae Thit)', 'Thaukae Thit Social Critique', 'វិភាគចរិតលោភលន់របស់ថៅកែ និងការជញ្ជក់ឈាមលើអ្នកក្រ។', 'master', 230, 60, 'BookOpen', 'Social Realism', [
    { q: 'រឿង «ថៅកែធិត» ឆ្លុះបញ្ចាំងពីបញ្ហាសង្គមអ្វីខ្លះ?', options: ['ការជិះជាន់កម្លាំងពលកម្ម និងការប្រាក់ខុសច្បាប់របស់ឈ្មួញកណ្តាល', 'ការសាងសង់សាលារៀន', 'ស្នេហាយុវវ័យ', 'ការស្រាវជ្រាវវិទ្យាសាស្ត្រ'], answer: 0, explanation: 'ការកេងប្រវ័ញ្ច និងការជិះជាន់សង្គម' },
    { q: 'អត្ថន័យអប់រំនៃរឿងថៅកែធិតគឺ៖', options: ['លើកកម្ពស់សីលធម៌ក្នុងការរកស៊ី និងយុត្តិធម៌សង្គម', 'លើកទឹកចិត្តឱ្យចងការប្រាក់ថ្លៃ', 'បង្រៀនឱ្យធ្វើថៅកែកំណាញ់', 'គ្មានន័យ'], answer: 0, explanation: 'យុត្តិធម៌ និងសីលធម៌សង្គម' }
  ]),
  createGame('soc-k-19', 'social', 'អក្សរសាស្ត្រខ្មែរ', 'khmer', 'អក្សរសិល្ប៍ប្រជាប្រិយ & រឿងព្រេង (Khmer Folk Tales)', 'Folk Tales, Moral Allegories & Legends', 'ស្វែងយល់ពីរឿងចៅចាក់ស្មុគ ធនញ្ជ័យ និងរឿងក្អែក១ជាក្អែក១០។', 'beginner', 180, 60, 'BookMarked', 'Folk Literature', [
    { q: 'តួអង្គ «ធនញ្ជ័យ» ជាតំណាងឱ្យ៖', options: ['ប្រាជ្ញាឈ្លាសវៃ និងការតស៊ូរបស់រាស្ត្រសាមញ្ញទល់នឹងស្តេចក្រាញ់', 'ភាពល្ងង់ខ្លៅ', 'ភាពកំសាក', 'អ្នកចម្បាំង'], answer: 0, explanation: 'ប្រាជ្ញាវាងវៃរបស់វណ្ណៈរាស្ត្រ' },
    { q: 'រឿង «ក្អែកមួយជាក្អែកដប់» អប់រំមនុស្សកុំឱ្យ៖', options: ['ជឿពាក្យចចាមអារ៉ាម និងពាក្យបំផ្លើសដោយមិនបានពិចារណា', 'ដើរលេងយប់', 'ហូបបាយយឺត', 'ចិញ្ចឹមក្អែក'], answer: 0, explanation: 'កុំឆាប់ជឿពាក្យចចាមអារ៉ាម' }
  ]),
  createGame('soc-k-20', 'social', 'អក្សរសាស្ត្រខ្មែរ', 'khmer', 'ច្បាប់ស្រី & ច្បាប់ប្រុស បុរាណ (Chbab Srei & Chbab Pros)', 'Traditional Moral Conduct Codes', 'ស្វែងយល់ពីក្បួនច្បាប់ទូន្មានរបស់ព្រះបាទអង្គឌួង និងម៉ីអ៊ឹម។', 'intermediate', 200, 60, 'Crown', 'Moral Codes', [
    { q: '«ច្បាប់ស្រី» ត្រូវបាននិពន្ធឡើងដោយកវីណា?', options: ['ព្រះបាទ អង្គឌួង និង ម៉ីអ៊ឹម', 'ភិក្ខុសោម', 'ញ៉ុក ថែម', 'រីម គីន'], answer: 0, explanation: 'ព្រះបាទអង្គឌួង' },
    { q: 'គោលបំណងចម្បងនៃច្បាប់ប្រុស-ច្បាប់ស្រីគឺ៖', options: ['អប់រំសុជីវធម៌ សីលធម៌រស់នៅ និងការថែរក្សាសុភមង្គលគ្រួសារ', 'បង្រៀនក្បាច់គុន', 'ប្រមូលពន្ធ', 'ធ្វើសង្គ្រាម'], answer: 0, explanation: 'សីលធម៌ និងសុភមង្គលក្នុងគ្រួសារ' }
  ]),
  createGame('soc-k-21', 'social', 'អក្សរសាស្ត្រខ្មែរ', 'khmer', 'សិល្បៈតែងសេចក្តីបែបអធិប្បាយ (Descriptive Essay)', 'Descriptive Essay Structure & Techniques', 'រៀបរាប់ទិដ្ឋភាព ធម្មជាតិ ពិធីបុណ្យ និងជីវភាពរស់នៅ។', 'beginner', 180, 60, 'FileText', 'Essay Writing', [
    { q: 'តែងសេចក្តីបែបអធិប្បាយទាមទារឱ្យអ្នកសរសេរ៖', options: ['ប្រើប្រាស់រូបារម្មណ៍ ពណ៌ សំឡេង និងអារម្មណ៍ជាក់ស្តែង', 'ជជែកដេញដោលតឹងតែង', 'បង្ហាញរូបមន្តគណិត', 'សរសេរតែពាក្យកាព្យ'], answer: 0, explanation: 'ប្រើរូបារម្មណ៍ និងការពិពណ៌នាច្បាស់លាស់' },
    { q: 'ការអធិប្បាយអំពី «ទិដ្ឋភាពថ្ងៃលិចនៅប្រាសាទអង្គរវត្ត» ត្រូវរៀបរាប់ពី៖', options: ['ពណ៌មេឃ កាំរស្មីចាំងលើកំពូលប្រាសាទ ទឹកគូរ និងភាពស្ងប់ស្ងាត់', 'តម្លៃសំបុត្រយន្តហោះ', 'រូបមន្តគីមី', 'ច្បាប់រដ្ឋធម្មនុញ្ញ'], answer: 0, explanation: 'ទិដ្ឋភាពសោភ័ណភាព និងអារម្មណ៍' }
  ]),
  createGame('soc-k-22', 'social', 'អក្សរសាស្ត្រខ្មែរ', 'khmer', 'អក្សរសិល្ប៍ពុទ្ធនិយម & រឿងជាតក (Buddhist Jataka Literature)', 'Vessantara Jataka & 10 Perfections', 'ស្វែងយល់ពីរឿងព្រះវេស្សន្តរជាតក និងការបំពេញទានបារមី។', 'master', 240, 60, 'Crown', 'Buddhist Literature', [
    { q: 'រឿង «មហាវេស្សន្តរជាតក» ឆ្លុះបញ្ចាំងពីការបំពេញបារមីអ្វី?', options: ['ទានបារមី (ការលះបង់ទ្រព្យសម្បត្តិ កូន និងភរិយា)', 'សីលបារមី', 'បញ្ញាបារមី', 'ខន្តីបារមី'], answer: 0, explanation: 'ទានបារមី' },
    { q: 'តួអង្គ «ជូជក» ជាតំណាងឱ្យមនុស្សប្រភេទណា?', options: ['លោភលន់ កំណាញ់ អាក្រក់ និងមិនចេះស្កប់ស្កល់', 'ចិត្តបុណ្យ', 'ស្មោះត្រង់', 'អ្នកប្រាជ្ញ'], answer: 0, explanation: 'តំណាងភាពលោភលន់ និងអកុសល' }
  ]),
  createGame('soc-k-23', 'social', 'អក្សរសាស្ត្រខ្មែរ', 'khmer', 'វចនានុក្រមខ្មែរ & សម្តេចសង្ឃរាជ ជួន ណាត (Chuon Nath Dictionary)', 'Khmer Orthography & Standardization', 'ស្វែងយល់ពីប្រវត្តិវចនានុក្រមខ្មែរ និងអក្ខរាវិរុទ្ធត្រឹមត្រូវ។', 'intermediate', 210, 60, 'BookMarked', 'Linguistics', [
    { q: 'សម្តេចព្រះសង្ឃរាជ ជួន ណាត (ជោតញ្ញាណោ) ជាស្ថាបនិកនៃ៖', options: ['វចនានុក្រមខ្មែរ និងភ្លេងជាតិ «នគររាជ»', 'ប្រលោមលោកទុំទាវ', 'ច្បាប់ល្បើកថ្មី', 'រឿងរាមកេរ្តិ៍'], answer: 0, explanation: 'វចនានុក្រមខ្មែរ និងភ្លេងជាតិនគររាជ' },
    { q: 'ពាក្យត្រឹមត្រូវតាមវចនានុក្រមគឺ៖', options: ['បាក់ឌុប / និស្សិត / សាកលវិទ្យាល័យ', 'និសិត', 'សកលវិទ្យាល័យខុស', 'គ្មានមួយត្រូវ'], answer: 0, explanation: 'និស្សិត / សាកលវិទ្យាល័យ' }
  ]),
  createGame('soc-k-24', 'social', 'អក្សរសាស្ត្រខ្មែរ', 'khmer', 'ពាក្យខ្ចីពីបាលី-សំស្ក្រឹត (Pali & Sanskrit Loanwords)', 'Pali & Sanskrit Roots in Khmer', 'ស្គាល់ឫសពាក្យ និងការផ្សំពាក្យរាជសព្ទ ធម្មសព្ទ។', 'master', 230, 60, 'Languages', 'Linguistics', [
    { q: 'ពាក្យ «អប់រំ, វប្បធម៌, សេដ្ឋកិច្ច, សង្គម» មានប្រភពមកពី៖', options: ['ភាសាបាលី និងសំស្ក្រឹត', 'ភាសាបារាំង', 'ភាសាអង់គ្លេស', 'ភាសាចិន'], answer: 0, explanation: 'បាលី-សំស្ក្រឹត' },
    { q: 'រាជសព្ទសម្រាប់ពាក្យ «ហូបបាយ» របស់ព្រះមហាក្សត្រគឺ៖', options: ['សោយព្រះស្ងោយ', 'ឆាន់', 'ពិសា', 'ញ៉ាំ'], answer: 0, explanation: 'សោយព្រះស្ងោយ' }
  ]),
  createGame('soc-k-25', 'social', 'អក្សរសាស្ត្រខ្មែរ', 'khmer', 'សិល្បៈតែងសេចក្តីប្រឡងបាក់ឌុប (BacII Essay Master)', 'High Scoring Essay Writing Tactics', 'តិចនិកសរសេរតែងសេចក្តីឱ្យបានពិន្ទុពេញ (A-Grade Tactics)។', 'master', 250, 60, 'Crown', 'Essay Writing', [
    { q: 'ដើម្បីទទួលបានពិន្ទុខ្ពស់ក្នុងតែងសេចក្តីបាក់ឌុប បេក្ខជនត្រូវ៖', options: ['ឆ្លើយត្រូវទិសដៅប្រធាន មានឧទាហរណ៍ជាក់ស្តែង និងអក្ខរាវិរុទ្ធត្រឹមត្រូវ', 'សរសេរតែ ៥ ជួរ', 'មិនបាច់ដាក់ឧទាហរណ៍', 'ប្រើតែភាសាបរទេស'], answer: 0, explanation: 'ចំប្រធាន វែកញែកស៊ីជម្រៅ និងមានឧទាហរណ៍' },
    { q: 'ក្នុងផ្នែក «បញ្ចប់សេចក្តី» បេក្ខជនត្រូវ៖', options: ['វាយតម្លៃប្រធាន និងបញ្ចេញមតិយោបល់ផ្ទាល់ខ្លួន', 'ចោទសួរឡើងវិញ', 'ពន្យល់ពាក្យគន្លឹះម្តងទៀត', 'សរសេររឿងថ្មី'], answer: 0, explanation: 'វាយតម្លៃប្រធាន និងមតិផ្ទាល់ខ្លួន' }
  ]),

  // --- 2. HISTORY (25 Games) ---
  createGame('soc-h-01', 'social', 'ប្រវត្តិវិទ្យា', 'history', 'កាលប្បវត្តិជាតិ (National Chronology)', 'Chronology 1863 to 1998', 'តម្រៀបកាលបរិច្ឆេទប្រវត្តិសាស្ត្រកម្ពុជាសំខាន់ៗ។', 'intermediate', 220, 60, 'Landmark', 'National History', [
    { q: 'កម្ពុជាបានឯករាជ្យពីបារាំងនៅថ្ងៃណា?', options: ['៩ វិច្ឆិកា ១៩៥៣', '១១ សីហា ១៨៦៣', '២៣ តុលា ១៩៩១', '២៩ ធ្នូ ១៩៩៨'], answer: 0, explanation: '៩ វិច្ឆិកា ១៩៥៣' },
    { q: 'កិច្ចព្រមព្រៀងសន្តិភាពទីក្រុងប៉ារីសចុះថ្ងៃទី៖', options: ['២៣ តុលា ១៩៩១', '៧ មករា ១៩៧៩', '២៤ កញ្ញា ១៩៩៣', '៣០ មេសា ១៩៩៩'], answer: 0, explanation: '២៣ តុលា ១៩៩១' }
  ]),
  createGame('soc-h-02', 'social', 'ប្រវត្តិវិទ្យា', 'history', 'មហានគរ & ព្រះបាទជ័យវរ្ម័នទី ៧ (Angkor Empire)', 'Jayavarman VII & Bayon Temple', 'ស្វែងយល់ពីប្រាសាទបាយ័ន និង ១០២ អរោគ្យសាលា។', 'beginner', 190, 60, 'Crown', 'Ancient History', [
    { q: 'ព្រះបាទជ័យវរ្ម័នទី ៧ កសាងអរោគ្យសាលាចំនួន៖', options: ['១០២ កន្លែង', '១២១ កន្លែង', '៥៤ កន្លែង', '២០០ កន្លែង'], answer: 0, explanation: '១០២ កន្លែង' },
    { q: 'ប្រាសាទបាយ័នកសាងឡើងឧទ្ទិសដល់៖', options: ['ព្រះពុទ្ធសាសនាមហាយាន', 'ព្រហ្មញ្ញសាសនា', 'ថេរវាទ', 'គ្រិស្ត'], answer: 0, explanation: 'មហាយាន' }
  ]),
  createGame('soc-h-03', 'social', 'ប្រវត្តិវិទ្យា', 'history', 'សមាគមអាស៊ាន & ៣ សរសរស្ដម្ភ (ASEAN Community)', 'ASEAN 3 Pillars & Integration', 'ស្វែងយល់ពី APSC, AEC, ASCC និងការចូលជាសមាជិកអាស៊ាន។', 'master', 240, 60, 'Globe', 'ASEAN', [
    { q: 'កម្ពុជាចូលជាសមាជិកអាស៊ាននៅឆ្នាំ៖', options: ['១៩៩៩ (៣០ មេសា)', '១៩៦៧', '១៩៩៧', '២០១៥'], answer: 0, explanation: '៣០ មេសា ១៩៩៩' },
    { q: 'សរសរស្ដម្ភទាំង ៣ នៃអាស៊ានគឺ៖', options: ['នយោបាយ-សន្តិសុខ, សេដ្ឋកិច្ច, សង្គម-វប្បធម៌', 'យោធា, ពាណិជ្ជកម្ម, កីឡា', 'កសិកម្ម, ទេសចរណ៍, អប់រំ', 'រូបិយវត្ថុ, យោធា, ព្រំដែន'], answer: 0, explanation: 'APSC, AEC, ASCC' }
  ]),
  createGame('soc-h-04', 'social', 'ប្រវត្តិវិទ្យា', 'history', 'សង្គ្រាមត្រជាក់ (Cold War Geopolitics)', 'Cold War, NATO & USSR Dissolution', 'ស្វែងយល់ពីប្លុកសេរី ប្លុកសូវៀត និងការដួលរលំសហភាពសូវៀត។', 'master', 230, 60, 'Globe', 'World History', [
    { q: 'សង្គ្រាមត្រជាក់បញ្ចប់ដោយសារការដួលរលំនៃ៖', options: ['សហភាពសូវៀត (USSR ១៩៩១)', 'ចក្រភពអង់គ្លេស', 'សហរដ្ឋអាមេរិក', 'អង្គការសហប្រជាជាតិ'], answer: 0, explanation: 'សហភាពសូវៀត (១៩៩១)' },
    { q: 'NATO បង្កើតឡើងដោយប្លុកណា?', options: ['ប្លុកសេរីដឹកនាំដោយអាមេរិក (១៩៤៩)', 'ប្លុកសូវៀត', 'មិនចូលបក្សសម្ព័ន្ធ', 'អាស៊ាន'], answer: 0, explanation: 'ប្លុកសេរី' }
  ]),
  createGame('soc-h-05', 'social', 'ប្រវត្តិវិទ្យា', 'history', 'អាណាព្យាបាលបារាំង ១៨៦៣ (French Protectorate)', 'French Protectorate 1863 & Reforms', 'ស្វែងយល់ពីសន្ធិសញ្ញាថ្ងៃទី ១១ សីហា ១៨៦៣ ដោយព្រះបាទនរោត្តម។', 'intermediate', 200, 60, 'Landmark', 'Cambodian History', [
    { q: 'សន្ធិសញ្ញាអាណាព្យាបាលបារាំងចុះថ្ងៃទី៖', options: ['១១ សីហា ១៨៦៣', '៩ វិច្ឆិកា ១៩៥៣', '១៧ មេសា ១៩៧៥', '៧ មករា ១៩៧៩'], answer: 0, explanation: '១១ សីហា ១៨៦៣' },
    { q: 'មូលហេតុដែលព្រះបាទនរោត្តមទទួលយកបារាំងគឺ៖', options: ['ការពារទឹកដីពីការលេបត្របាក់របស់សៀមនិងអណ្ណាម', 'ចង់ធ្វើសង្គ្រាម', 'លុបវប្បធម៌', 'ដូររូបិយប័ណ្ណ'], answer: 0, explanation: 'ការពារបូរណភាពទឹកដី' }
  ]),
  createGame('soc-h-06', 'social', 'ប្រវត្តិវិទ្យា', 'history', 'ព្រះរាជបូជនីយកិច្ចទាមទារឯករាជ្យ ១៩៥៣ (Independence Crusade)', 'Royal Crusade for Independence 1953', 'ស្វែងយល់ពីព្រះរាជបូជនីយកិច្ចនៃព្រះបាទ នរោត្តម សីហនុ។', 'intermediate', 210, 60, 'Crown', 'Cambodian History', [
    { q: 'ព្រះមហាក្សត្រដែលដឹកនាំការទាមទារឯករាជ្យគឺ៖', options: ['ព្រះបាទ នរោត្តម សីហនុ (ព្រះបរមរតនកោដ្ឋ)', 'ព្រះបាទ នរោត្តម សុរាម្រិត', 'ព្រះបាទ ស៊ីសុវត្ថិ', 'ព្រះបាទ មុនីវង្ស'], answer: 0, explanation: 'ព្រះបាទ នរោត្តម សីហនុ' },
    { q: 'ឯករាជ្យជាតិពេញលេញត្រូវបានប្រកាសនៅថ្ងៃទី៖', options: ['៩ វិច្ឆិកា ១៩៥៣', '១១ សីហា ១៨៦៣', '២៣ តុលា ១៩៩១', '២៩ ធ្នូ ១៩៩៨'], answer: 0, explanation: '៩ វិច្ឆិកា ១៩៥៣' }
  ]),
  createGame('soc-h-07', 'social', 'ប្រវត្តិវិទ្យា', 'history', 'សម័យសង្គមរាស្ត្រនិយម ១៩៥៥-១៩៧០ (Sangkum Reastr Niyum)', 'Sangkum Reastr Niyum Golden Developments', 'សមិទ្ធផលកំពង់ផែព្រះសីហនុ សាកលវិទ្យាល័យ និងស្ថាបត្យកម្ម។', 'beginner', 190, 60, 'Building2', 'Cambodian History', [
    { q: 'សម័យសង្គមរាស្ត្រនិយមដឹកនាំដោយ៖', options: ['សម្តេច នរោត្តម សីហនុ', 'លន់ នល់', 'ប៉ុល ពត', 'ហេង សំរិន'], answer: 0, explanation: 'សម្តេច នរោត្តម សីហនុ' },
    { q: 'សមិទ្ធផលលេចធ្លោនាសម័យនោះរួមមាន៖', options: ['កំពង់ផែក្រុងព្រះសីហនុ, សាកលវិទ្យាល័យភូមិន្ទ, ពហុកីឡដ្ឋានជាតិអូឡាំពិក', 'ទំនប់វារីអគ្គិសនីសេសាន', 'ស្ពានជ្រោយចង្វារទី២', 'ផ្លូវល្បឿនលឿន'], answer: 0, explanation: 'កំពង់ផែព្រះសីហនុ ពហុកីឡដ្ឋានជាតិអូឡាំពិក' }
  ]),
  createGame('soc-h-08', 'social', 'ប្រវត្តិវិទ្យា', 'history', 'នយោបាយ «ឈ្នះ-ឈ្នះ» ១៩៩៨ (Win-Win Policy)', 'Win-Win Policy & Complete Peace', 'ការបញ្ចប់សង្គ្រាមស៊ីវិល និងការបង្រួបបង្រួមជាតិទាំងស្រុង។', 'master', 240, 60, 'ShieldCheck', 'Peace History', [
    { q: 'នយោបាយ ឈ្នះ-ឈ្នះ សម្រេចបានសន្តិភាពពេញលេញនៅថ្ងៃ៖', options: ['២៩ ធ្នូ ១៩៩៨', '៧ មករា ១៩៧៩', '២៣ តុលា ១៩៩១', '៣០ មេសា ១៩៩៩'], answer: 0, explanation: '២៩ ធ្នូ ១៩៩៨' },
    { q: 'គោលការណ៍ស្នូលទាំង ៣ នៃនយោបាយ ឈ្នះ-ឈ្នះ គឺធានា៖', options: ['អាយុជីវិត, អាជីព/មុខរបរ, ទ្រព្យសម្បត្តិ/កម្មសិទ្ធិ', 'លុយ, ដី, ផ្ទះ', 'តំណែង, យោធា, លុយ', 'គ្មានការធានា'], answer: 0, explanation: 'ធានាជីវិត អាជីព និងទ្រព្យសម្បត្តិ' }
  ]),
  createGame('soc-h-09', 'social', 'ប្រវត្តិវិទ្យា', 'history', 'សម័យនគរភ្នំ & ចេនឡា (Funan & Chenla)', 'Funan Maritime Kingdom & Chenla', 'ស្វែងយល់ពីរាជធានីអង្គរបុរី កំពង់ផែអូរកែវ និងកម្ពុជាបុរាណ។', 'beginner', 180, 60, 'Landmark', 'Ancient History', [
    { q: 'កំពង់ផែពាណិជ្ជកម្មអន្តរជាតិដ៏ល្បីនៃសម័យនគរភ្នំគឺ៖', options: ['កំពង់ផែអូរកែវ (Oc Eo)', 'កំពង់ផែកំពត', 'កំពង់ផែកែប', 'កំពង់ផែសីហនុ'], answer: 0, explanation: 'កំពង់ផែអូរកែវ' },
    { q: 'សម័យនគរភ្នំមានការគោរពសាសនាអ្វីខ្លះ?', options: ['ព្រហ្មញ្ញសាសនា និងព្រះពុទ្ធសាសនា', 'គ្រិស្តសាសនា', 'ឥស្លាមសាសនា', 'សាសនាតាវ'], answer: 0, explanation: 'ព្រហ្មញ្ញសាសនា និងព្រះពុទ្ធសាសនា' }
  ]),
  createGame('soc-h-10', 'social', 'ប្រវត្តិវិទ្យា', 'history', 'សង្គ្រាមលោកលើកទី ២ & អង្គការសហប្រជាជាតិ (WWII & UN)', 'WWII Timeline & Creation of the UN 1945', 'ស្វែងយល់ពីការបង្កើត UN ថ្ងៃទី ២៤ តុលា ១៩៤៥ និងសន្តិភាពពិភពលោក។', 'intermediate', 210, 60, 'Globe', 'World History', [
    { q: 'អង្គការសហប្រជាជាតិ (UN) ត្រូវបានបង្កើតឡើងនៅឆ្នាំ៖', options: ['១៩៤៥ (២៤ តុលា)', '១៩១៨', '១៩៥៣', '១៩៩១'], answer: 0, explanation: '២៤ តុលា ១៩៤៥' },
    { q: 'គោលបំណងចម្បងនៃ UN គឺ៖', options: ['រក្សាសន្តិភាព និងសន្តិសុខអន្តរជាតិ', 'ធ្វើសង្គ្រាម', 'ប្រមូលពន្ធ', 'បង្កើតអាណានិគម'], answer: 0, explanation: 'រក្សាសន្តិភាព និងសន្តិសុខពិភពលោក' }
  ]),
  createGame('soc-h-11', 'social', 'ប្រវត្តិវិទ្យា', 'history', 'សម័យលង្វែក & ឧដុង្គ (Longvek & Oudong Eras)', 'Post-Angkorian Transition to Oudong', 'ស្វែងយល់ពីសម័យក្រោយអង្គរ ការផ្លាស់ប្តូររាជធានី និងការតស៊ូការពារជាតិ។', 'intermediate', 200, 60, 'Landmark', 'Medieval History', [
    { q: 'រាជធានីបន្ទាយលង្វែកត្រូវបានកសាងឡើងដោយព្រះមហាក្សត្រអង្គណា?', options: ['ព្រះបាទចន្ទរាជា (អង្គចន្ទទី១)', 'ព្រះបាទជ័យវរ្ម័នទី៧', 'ព្រះបាទនរោត្តម', 'ព្រះបាទអង្គឌួង'], answer: 0, explanation: 'ព្រះបាទចន្ទរាជា' },
    { q: 'ព្រះមហាក្សត្រដែលបានកសាងនិងស្តារប្រទេសឡើងវិញនៅរាជធានីឧដុង្គគឺ៖', options: ['ព្រះបាទអង្គឌួង', 'ព្រះបាទសីហនុ', 'ព្រះបាទសុរាម្រិត', 'ព្រះបាទមុនីវង្ស'], answer: 0, explanation: 'ព្រះបាទអង្គឌួង' }
  ]),
  createGame('soc-h-12', 'social', 'ប្រវត្តិវិទ្យា', 'history', 'ចលនាមិនចូលបក្សសម្ព័ន្ធ (Non-Aligned Movement NAM)', 'Bandung Conference 1955 & Non-Alignment', 'ស្វែងយល់ពីសន្និសីទបានឌុង ឆ្នាំ ១៩៥៥ និងនយោបាយអព្យាក្រឹត្យកម្ពុជា។', 'master', 230, 60, 'Globe', 'Diplomacy', [
    { q: 'សន្និសីទក្រុងបានឌុងស្តីពីចលនាមិនចូលបក្សសម្ព័ន្ធប្រព្រឹត្តទៅនៅឆ្នាំ៖', options: ['១៩៥៥', '១៩៤៥', '១៩៦៧', '១៩៩១'], answer: 0, explanation: '១៩៥៥ នៅប្រទេសឥណ្ឌូណេស៊ី' },
    { q: 'គោលនយោបាយការបរទេសនៃសម័យសង្គមរាស្ត្រនិយមកម្ពុជាគឺ៖', options: ['អព្យាក្រឹត្យភាព និងមិនចូលបក្សសម្ព័ន្ធ', 'ចូលបក្សសេរី', 'ចូលបក្សកុម្មុយនីស្ត', 'បិទទ្វារ'], answer: 0, explanation: 'អព្យាក្រឹត្យ និងមិនចូលបក្សសម្ព័ន្ធ' }
  ]),
  createGame('soc-h-13', 'social', 'ប្រវត្តិវិទ្យា', 'history', 'សង្គ្រាមលោកលើកទី ១ (World War I 1914-1918)', 'World War I Alliances & Consequences', 'ស្វែងយល់ពីសម្ព័ន្ធត្រីភាគី សន្ធិសញ្ញា Versailles និងផលវិបាក។', 'intermediate', 210, 60, 'Globe', 'World History', [
    { q: 'សង្គ្រាមលោកលើកទី ១ បានកើតឡើងក្នុងចន្លោះឆ្នាំ៖', options: ['១៩១៤ - ១៩១៨', '១៩៣៩ - ១៩៤៥', '១៩៥០ - ១៩៥៣', '១៩៦០ - ១៩៧៥'], answer: 0, explanation: '១៩១៤ ដល់ ១៩១៨' },
    { q: 'សន្ធិសញ្ញាដែលបញ្ចប់សង្គ្រាមលោកលើកទី ១ ជាផ្លូវការគឺ៖', options: ['សន្ធិសញ្ញា Versailles (១៩១៩)', 'សន្ធិសញ្ញាប៉ារីស', 'សន្ធិសញ្ញាទីក្រុងហ្សឺណែវ', 'សន្ធិសញ្ញាទីក្រុងតូក្យូ'], answer: 0, explanation: 'សន្ធិសញ្ញា Versailles' }
  ]),
  createGame('soc-h-14', 'social', 'ប្រវត្តិវិទ្យា', 'history', 'សន្និសីទទីក្រុងហ្សឺណែវ ១៩៥៤ (Geneva Conference 1954)', '1954 Geneva Accords on Indochina', 'ស្វែងយល់ពីការទទួលស្គាល់ឯករាជ្យភាព អធិបតេយ្យភាពកម្ពុជាលើឆាកអន្តរជាតិ។', 'master', 240, 60, 'Landmark', 'Cambodian Diplomacy', [
    { q: 'សន្និសីទហ្សឺណែវឆ្នាំ ១៩៥៤ បានសម្រេច៖', options: ['ទទួលស្គាល់ឯករាជ្យពេញលេញ និងបូរណភាពទឹកដីកម្ពុជាដោយគ្មានការបែងចែក', 'បែងចែកកម្ពុជាជាពីរ', 'ដាក់កម្ពុជាក្រោមអាណាព្យាបាលបន្ត', 'បង្កើតសង្គ្រាម'], answer: 0, explanation: 'ទទួលស្គាល់ឯករាជ្យភាពកម្ពុជាទាំងស្រុង' },
    { q: 'ប្រតិភូកម្ពុជាដែលបានការពារជំហរជាតិយ៉ាងស្វិតស្វាញនៅហ្សឺណែវដឹកនាំដោយ៖', options: ['លោក ទេព ផន និងសម្តេច នរោត្តម សីហនុ', 'លន់ នល់', 'សឺង ង៉ុកថាញ់', 'ប៉ុល ពត'], answer: 0, explanation: 'គណៈប្រតិភូកម្ពុជាក្រោមការដឹកនាំរបស់ព្រះបាទនរោត្តមសីហនុ' }
  ]),
  createGame('soc-h-15', 'social', 'ប្រវត្តិវិទ្យា', 'history', 'ការបោះឆ្នោតជាតិ ១៩៩៣ & ស្ថាបនិករដ្ឋធម្មនុញ្ញ (1993 Elections)', 'UNTAC & Re-establishment of Kingdom of Cambodia', 'ស្វែងយល់ពីបេសកកម្ម UNTAC ការបោះឆ្នោត និងការបង្កើតព្រះរាជាណាចក្រកម្ពុជាទី ២។', 'master', 240, 60, 'ShieldCheck', 'Modern Politics', [
    { q: 'ការបោះឆ្នោតជាតិដែលរៀបចំដោយ UNTAC ប្រព្រឹត្តទៅនៅខែ ឆ្នាំណា?', options: ['ឧសភា ១៩៩៣', 'តុលា ១៩៩១', 'ធ្នូ ១៩៩៨', 'មេសា ១៩៩៩'], answer: 0, explanation: 'ខែឧសភា ឆ្នាំ១៩៩៣' },
    { q: 'បាវចនាជាតិនៃព្រះរាជាណាចក្រកម្ពុជាគឺ៖', options: ['ជាតិ សាសនា ព្រះមហាក្សត្រ', 'សន្តិភាព ឯករាជ្យ ប្រជាធិបតេយ្យ', 'សេរីភាព សមភាព ភាតរភាព', 'សាមគ្គី វិន័យ អភិវឌ្ឍន៍'], answer: 0, explanation: 'ជាតិ សាសនា ព្រះមហាក្សត្រ' }
  ]),
  createGame('soc-h-16', 'social', 'ប្រវត្តិវិទ្យា', 'history', 'ប្រាសាទអង្គរវត្ត & ព្រះបាទសូរ្យវរ្ម័នទី ២ (Angkor Wat Era)', 'Suryavarman II & Angkor Wat Architecture', 'ស្វែងយល់ពីការកសាងប្រាសាទអង្គរវត្តនៅសតវត្សរ៍ទី ១២។', 'beginner', 190, 60, 'Crown', 'Ancient History', [
    { q: 'ប្រាសាទអង្គរវត្តត្រូវបានកសាងឡើងដោយព្រះមហាក្សត្រអង្គណា?', options: ['ព្រះបាទ សូរ្យវរ្ម័នទី ២', 'ព្រះបាទ ជ័យវរ្ម័នទី ៧', 'ព្រះបាទ យសោវរ្ម័នទី ១', 'ព្រះបាទ ឥន្ទ្រវរ្ម័នទី ១'], answer: 0, explanation: 'ព្រះបាទសូរ្យវរ្ម័នទី ២' },
    { q: 'ដើមឡើយ ប្រាសាទអង្គរវត្តត្រូវបានកសាងឡើងដើម្បីឧទ្ទិសដល់អាទិទេពណា?', options: ['ព្រះវិស្ណុ (ព្រហ្មញ្ញសាសនា)', 'ព្រះសិវៈ', 'ព្រះព្រហ្ម', 'ព្រះពុទ្ធ'], answer: 0, explanation: 'ឧទ្ទិសថ្វាយព្រះវិស្ណុ' }
  ]),
  createGame('soc-h-17', 'social', 'ប្រវត្តិវិទ្យា', 'history', 'សម័យសាធារណរដ្ឋខ្មែរ ១៩៧០-១៩៧៥ (Khmer Republic Lon Nol)', '1970 Coup & Khmer Republic Crisis', 'ស្វែងយល់ពីរដ្ឋប្រហារថ្ងៃទី ១៨ មីនា ១៩៧០ និងសង្គ្រាមស៊ីវិល។', 'intermediate', 210, 60, 'Landmark', 'Modern History', [
    { q: 'រដ្ឋប្រហារទម្លាក់សម្តេចសីហនុ និងបង្កើតរបបសាធារណរដ្ឋខ្មែរដឹកនាំដោយ៖', options: ['លោកសេនាប្រមុខ លន់ នល់ និងទ្រង់ ស៊ីសុវត្ថិ សិរិមតៈ', 'ប៉ុល ពត', 'ហេង សំរិន', 'សឺង ង៉ុកថាញ់'], answer: 0, explanation: 'លន់ នល់ និង សិរិមតៈ' },
    { q: 'របបសាធារណរដ្ឋខ្មែរបានដួលរលំនៅថ្ងៃទី៖', options: ['១៧ មេសា ១៩៧៥', '១៨ មីនា ១៩៧០', '៧ មករា ១៩៧៩', '២៣ តុលា ១៩៩១'], answer: 0, explanation: '១៧ មេសា ១៩៧៥' }
  ]),
  createGame('soc-h-18', 'social', 'ប្រវត្តិវិទ្យា', 'history', 'របបកម្ពុជាប្រជាធិបតេយ្យ ១៩៧៥-១៩៧៩ (Democratic Kampuchea)', 'Khmer Rouge Regime & Genocide 1975-1979', 'ស្វែងយល់ពីសោកនាដកម្មប្រល័យពូជសាសន៍ ប៉ុល ពត និងការជម្លៀសប្រជាជន។', 'master', 240, 60, 'AlertTriangle', 'Tragic History', [
    { q: 'របបកម្ពុជាប្រជាធិបតេយ្យ (ខ្មែរក្រហម) គ្រប់គ្រងប្រទេសក្នុងចន្លោះឆ្នាំ៖', options: ['១៩៧៥ ដល់ ១៩៧៩ (៣ ឆ្នាំ ៨ ខែ ២០ ថ្ងៃ)', '១៩៧០ ដល់ ១៩៧៥', '១៩៧៩ ដល់ ១៩៨៩', '១៩៦០ ដល់ ១៩៧០'], answer: 0, explanation: '១៧ មេសា ១៩៧៥ ដល់ ៦ មករា ១៩៧៩' },
    { q: 'ថ្ងៃទី ៧ ខែមករា ឆ្នាំ ១៩៧៩ គឺជាទិវា៖', options: ['ជ័យជម្នះលើរបបប្រល័យពូជសាសន៍ និងការរស់ឡើងវិញនៃជាតិខ្មែរ', 'ទិវាបុណ្យឯករាជ្យ', 'ទិវាចុះសន្ធិសញ្ញា', 'ទិវាបោះឆ្នោត'], answer: 0, explanation: 'ទិវាជ័យជម្នះ ៧ មករា' }
  ]),
  createGame('soc-h-19', 'social', 'ប្រវត្តិវិទ្យា', 'history', 'រណសិរ្សសាមគ្គីសង្គ្រោះជាតិកម្ពុជា (KUFNS 1978)', 'Liberation of Cambodia December 2, 1978', 'ស្វែងយល់ពីការបង្កើតរណសិរ្ស ២ ធ្នូ ១៩៧៨ នៅស្រុកស្នួល ខេត្តក្រចេះ។', 'intermediate', 210, 60, 'ShieldCheck', 'National Liberation', [
    { q: 'រណសិរ្សសាមគ្គីសង្គ្រោះជាតិកម្ពុជាត្រូវបានបង្កើតឡើងនៅថ្ងៃទី៖', options: ['២ ធ្នូ ១៩៧៨', '៧ មករា ១៩៧៩', '២៣ តុលា ១៩៩១', '២៩ ធ្នូ ១៩៩៨'], answer: 0, explanation: '២ ធ្នូ ១៩៧៨ នៅស្នួល ខេត្តក្រចេះ' },
    { q: 'ថ្នាក់ដឹកនាំសំខាន់ៗនៃរណសិរ្សរួមមាន៖', options: ['សម្តេច ហេង សំរិន, សម្តេច ជា ស៊ីម, សម្តេច ហ៊ុន សែន', 'លន់ នល់', 'ប៉ុល ពត', 'សឺង ង៉ុកថាញ់'], answer: 0, explanation: 'សម្តេច ហេង សំរិន, សម្តេច ជា ស៊ីម, សម្តេច ហ៊ុន សែន' }
  ]),
  createGame('soc-h-20', 'social', 'ប្រវត្តិវិទ្យា', 'history', 'សង្គ្រាមត្រជាក់នៅអាស៊ី & សង្គ្រាមកូរ៉េ (Cold War in Asia)', 'Korean War 1950-1953 & Vietnam War', 'ស្វែងយល់ពីខ្សែស្របទី ៣៨ សង្គ្រាមកូរ៉េ និងសង្គ្រាមវៀតណាម។', 'master', 230, 60, 'Globe', 'Asian History', [
    { q: 'សង្គ្រាមកូរ៉េ (១៩៥០-១៩៥៣) បានបែងចែកឧបទ្វីបកូរ៉េតាម៖', options: ['ខ្សែស្របទី ៣៨ (38th Parallel)', 'ខ្សែស្របទី ១៧', 'ទន្លេមេគង្គ', 'ជួរភ្នំហិម៉ាឡៃ'], answer: 0, explanation: 'ខ្សែស្របទី ៣៨' },
    { q: 'សង្គ្រាមវៀតណាមបានបញ្ចប់នៅឆ្នាំ ១៩៧៥ ជាមួយនឹងការបង្រួបបង្រួមនៃ៖', options: ['វៀតណាមខាងជើង និងខាងត្បូង ក្រោមការដកទ័ពអាមេរិក', 'កូរ៉េ', 'ឡាវ', 'ថៃ'], answer: 0, explanation: 'វៀតណាមខាងជើង និងខាងត្បូង' }
  ]),
  createGame('soc-h-21', 'social', 'ប្រវត្តិវិទ្យា', 'history', 'បដិវត្តន៍ឧស្សាហកម្មពិភពលោក (Industrial Revolution)', 'Steam Engine, Mass Production & Social Shifts', 'ស្វែងយល់ពីម៉ាស៊ីនចំហាយទឹក James Watt និងការផ្លាស់ប្តូរសេដ្ឋកិច្ច។', 'beginner', 180, 60, 'Cpu', 'World History', [
    { q: 'បដិវត្តន៍ឧស្សាហកម្មលើកទី ១ បានចាប់ផ្តើមដំបូងនៅប្រទេសណា?', options: ['ចក្រភពអង់គ្លេស (សតវត្សរ៍ទី ១៨)', 'សហរដ្ឋអាមេរិក', 'បារាំង', 'អាល្លឺម៉ង់'], answer: 0, explanation: 'ប្រទេសអង់គ្លេស' },
    { q: 'របកគំហើញបច្ចេកវិទ្យាសំខាន់បំផុតនៃបដិវត្តន៍ឧស្សាហកម្មទី ១ គឺ៖', options: ['ម៉ាស៊ីនចំហាយទឹក (Steam Engine)', 'កុំព្យូទ័រ', 'អ៊ីនធឺណិត', 'យន្តហោះ'], answer: 0, explanation: 'ម៉ាស៊ីនចំហាយទឹក' }
  ]),
  createGame('soc-h-22', 'social', 'ប្រវត្តិវិទ្យា', 'history', 'បដិវត្តន៍បារាំង ១៧៨៩ (French Revolution)', 'Fall of Bastille, Liberty, Equality & Fraternity', 'ស្វែងយល់ពីការវាយកម្ទេចគុកបាស្ទីល និងសិទ្ធិមនុស្ស។', 'master', 230, 60, 'Landmark', 'European History', [
    { q: 'បដិវត្តន៍បារាំងបានផ្ទុះឡើងនៅឆ្នាំណា?', options: ['១៧៨៩ (១៤ កក្កដា)', '១៨៦៣', '១៩១៤', '១៩៤៥'], answer: 0, explanation: '១៤ កក្កដា ១៧៨៩' },
    { q: 'បាវចនាដ៏ល្បីនៃបដិវត្តន៍បារាំងគឺ៖', options: ['សេរីភាព សមភាព ភាតរភាព (Liberté, Égalité, Fraternité)', 'ជាតិ សាសនា ព្រះមហាក្សត្រ', 'សន្តិភាព និងការងារ', 'គ្មានបាវចនា'], answer: 0, explanation: 'សេរីភាព សមភាព ភាតរភាព' }
  ]),
  createGame('soc-h-23', 'social', 'ប្រវត្តិវិទ្យា', 'history', 'ការបង្កើតសហភាពអឺរ៉ុប (European Union Integration)', 'Treaty of Maastricht & Euro Currency', 'ស្វែងយល់ពីសន្ធិសញ្ញា Maastricht ការបង្កើតរូបិយប័ណ្ណ Euro (€)។', 'intermediate', 210, 60, 'Globe', 'Modern Diplomacy', [
    { q: 'រូបិយប័ណ្ណរួមនៃសហភាពអឺរ៉ុបគឺ៖', options: ['អឺរ៉ូ (Euro - €)', 'ដុល្លារ ($)', 'ផោន (£)', 'យេន (¥)'], answer: 0, explanation: 'អឺរ៉ូ (Euro)' },
    { q: 'គោលបំណងចម្បងនៃសហភាពអឺរ៉ុប (EU) គឺ៖', options: ['សមាហរណកម្មសេដ្ឋកិច្ច ទីផ្សារសេរី និងសន្តិភាពយូរអង្វែងនៅអឺរ៉ុប', 'ធ្វើសង្គ្រាមលោក', 'បិទព្រំដែន', 'គ្មានគោលបំណង'], answer: 0, explanation: 'សមាហរណកម្មសេដ្ឋកិច្ច និងសន្តិភាព' }
  ]),
  createGame('soc-h-24', 'social', 'ប្រវត្តិវិទ្យា', 'history', 'រាជធានីកម្ពុជាតាមសម័យកាល (Historical Capitals of Cambodia)', 'Angkor Borei, Hariharalaya, Angkor, Longvek, Oudong, Phnom Penh', 'ស្វែងយល់ពីការវិវត្តនៃរាជធានីខ្មែរគ្រប់សម័យកាល។', 'beginner', 190, 60, 'Crown', 'Cambodian History', [
    { q: 'រាជធានីដំបូងបង្អស់នៃសម័យអង្គរ (ហរិហរាល័យ) ស្ថិតនៅតំបន់៖', options: ['រលួស (ខេត្តសៀមរាប)', 'ចតុមុខ', 'លង្វែក', 'ឧដុង្គ'], answer: 0, explanation: 'តំបន់រលួស' },
    { q: 'ព្រះបាទពញាយ៉ាតបានផ្លាស់ប្តូររាជធានីពីអង្គរមកតាំងនៅ៖', options: ['រាជធានីចតុមុខ (ភ្នំពេញបច្ចុប្បន្ន)', 'អង្គរបុរី', 'សម្បូរព្រៃគុក', 'កោះកេរ'], answer: 0, explanation: 'រាជធានីចតុមុខ (ភ្នំពេញ)' }
  ]),
  createGame('soc-h-25', 'social', 'ប្រវត្តិវិទ្យា', 'history', 'សង្គ្រាមប្រឆាំងអំពើភេរវកម្ម & សតវត្សរ៍ទី ២១ (21st Century Geopolitics)', '9/11 Attacks, Digital Era & Multipolar World', 'ស្វែងយល់ពីព្រឹត្តិការណ៍ ១១ កញ្ញា ២០០១ និងពិភពលោកពហុប៉ូល។', 'master', 240, 60, 'Globe', 'Modern History', [
    { q: 'ព្រឹត្តិការណ៍ភេរវកម្មវាយប្រហារលើអគារពាណិជ្ជកម្មពិភពលោក (WTC) កើតនៅ៖', options: ['១១ កញ្ញា ២០០១', '១ មករា ២០០០', '២៤ តុលា ១៩៩៥', '៤ កក្កដា ១៩៩៩'], answer: 0, explanation: '១១ កញ្ញា ២០០១ នៅសហរដ្ឋអាមេរិក' },
    { q: 'និន្នាការភូមិសាស្ត្រនយោបាយសតវត្សរ៍ទី ២១ ឆ្ពោះទៅកាន់ពិភពលោកបែប៖', options: ['ពហុប៉ូល (Multipolar World)', 'ឯកប៉ូលដាច់ខាត', 'គ្មានមហាអំណាច', 'បិទប្រទេសទាំងអស់'], answer: 0, explanation: 'ពិភពលោកពហុប៉ូល' }
  ]),

  // --- 3. GEOGRAPHY (15 Games) ---
  createGame('soc-g-01', 'social', 'ភូមិវិទ្យា', 'geography', 'ដំណើរទឹកទន្លេសាប & មេគង្គ (Tonle Sap Hydrology)', 'Tonle Sap & Mekong River Hydrology', 'របបទឹកទន្លេមេគង្គ និងបាតុភូតទឹកហូរច្រាលបញ្ច្រាស។', 'intermediate', 200, 60, 'Globe', 'Physical Geography', [
    { q: 'នៅរដូវវស្សា ទឹកទន្លេសាបហូរតាមទិស៖', options: ['ហូរច្រាលពីទន្លេមេគង្គចូលបឹងទន្លេសាប', 'ហូរពីបឹងទៅទន្លេមេគង្គ', 'មិនហូរ', 'ហូរចូលសមុទ្រ'], answer: 0, explanation: 'ហូរច្រាលចូលបឹងទន្លេសាប' },
    { q: 'ផ្ទៃក្រឡាបឹងទន្លេសាបរដូវវស្សារីកធំដល់៖', options: ['១៦,០០០ គ.ម²', '៣,០០០ គ.ម²', '៥០,០០០ គ.ម²', '៥០០ គ.ម²'], answer: 0, explanation: '១៦,០០០ គ.ម²' }
  ]),
  createGame('soc-g-02', 'social', 'ភូមិវិទ្យា', 'geography', 'ខេត្តតំបន់ឆ្នេរសមុទ្រទាំង៤ (4 Coastal Provinces)', 'Coastal Economy & Deep Sea Port', 'ស្វែងយល់ពីកែប កំពត ព្រះសីហនុ កោះកុង និងកំពង់ផែទឹកជ្រៅ។', 'beginner', 190, 60, 'Compass', 'Economic Geography', [
    { q: 'ខេត្តតំបន់ឆ្នេរទាំង ៤ រួមមាន៖', options: ['កែប កំពត ព្រះសីហនុ កោះកុង', 'កំពត តាកែវ ព្រះសីហនុ កោះកុង', 'កែប ព្រះសីហនុ បាត់ដំបង កោះកុង', 'កំពត ព្រះសីហនុ ស្វាយរៀង កែប'], answer: 0, explanation: 'កែប កំពត ព្រះសីហនុ កោះកុង' },
    { q: 'កំពង់ផែទឹកជ្រៅតែមួយគត់របស់កម្ពុជាគឺ៖', options: ['កំពង់ផែស្វយ័តក្រុងព្រះសីហនុ', 'កំពត', 'កែប', 'កោះកុង'], answer: 0, explanation: 'ក្រុងព្រះសីហនុ' }
  ]),
  createGame('soc-g-03', 'social', 'ភូមិវិទ្យា', 'geography', 'កសិកម្មកម្ពុជា & ស្រូវអង្ករ (Cambodian Agriculture)', 'Rice Crops, Cashew & Strategic Exports', 'វិភាគសក្តានុពលស្រូវអង្ករ ស្វាយចន្ទី កៅស៊ូ និងកសិ-ឧស្សាហកម្ម។', 'intermediate', 210, 60, 'Building2', 'Economic Geography', [
    { q: 'ដំណាំយុទ្ធសាស្ត្រនាំចេញសំខាន់ៗរួមមាន៖', options: ['ស្រូវ, ស្វាយចន្ទី, កៅស៊ូ, ដំឡូងមី, ម្រេច', 'ស្រូវសាលី', 'ទំពាំងបាយជូរ', 'គ្មានដំណាំ'], answer: 0, explanation: 'ស្រូវ ស្វាយចន្ទី កៅស៊ូ ដំឡូងមី ម្រេច' },
    { q: 'ខេត្តដែលជា «ជង្រុកស្រូវ» ធំជាងគេគឺ៖', options: ['ខេត្តបាត់ដំបង', 'ខេត្តកែប', 'ខេត្តមណ្ឌលគិរី', 'ខេត្តស្ទឹងត្រែង'], answer: 0, explanation: 'ខេត្តបាត់ដំបង' }
  ]),
  createGame('soc-g-04', 'social', 'ភូមិវិទ្យា', 'geography', 'យុទ្ធសាស្ត្របញ្ចកោណ ២០៥០ (Pentagonal Strategy)', 'Vision 2050 & High-Income Goal', 'គោលដៅប្រែក្លាយកម្ពុជាទៅជាប្រទេសចំណូលខ្ពស់ឆ្នាំ ២០៥០។', 'master', 240, 60, 'TrendingUp', 'Development Geography', [
    { q: 'ចក្ខុវិស័យកម្ពុជា ២០៥០ កំណត់គោលដៅជា៖', options: ['ប្រទេសមានចំណូលខ្ពស់ (High-Income Country)', 'ប្រទេសចំណូលទាប', 'ប្រទេសអភិវឌ្ឍន៍តិចតួច', 'ប្រទេសកសិកម្មបុរាណ'], answer: 0, explanation: 'ប្រទេសចំណូលខ្ពស់' },
    { q: 'អាទិភាពគន្លឹះទាំង ៥ នៃបញ្ចកោណរួមមាន៖', options: ['មនុស្ស ផ្លូវ ទឹក ភ្លើង និងបច្ចេកវិទ្យា', 'យោធា សង្គ្រាម', 'ការខ្ចីបុល', 'បិទប្រទេស'], answer: 0, explanation: 'មនុស្ស ផ្លូវ ទឹក ភ្លើង បច្ចេកវិទ្យា' }
  ]),
  createGame('soc-g-05', 'social', 'ភូមិវិទ្យា', 'geography', 'អាកាសធាតុមូសុង & របបទឹកភ្លៀង (Monsoon Climate)', 'Southwest & Northeast Monsoons', 'វិភាគខ្យល់មូសុងនិរតី (រដូវវស្សា) និងមូសុងឦសាន (រដូវប្រាំង)។', 'intermediate', 200, 60, 'Sun', 'Climatology', [
    { q: 'ខ្យល់មូសុងនិរតី (Southwest Monsoon) នាំមកនូវ៖', options: ['កម្តៅសើម និងភ្លៀងធ្លាក់ជោកជាំ (រដូវវស្សា)', 'ត្រជាក់ស្ងួត', 'ព្រិលធ្លាក់', 'គ្មានខ្យល់'], answer: 0, explanation: 'រដូវវស្សា ឧសភា-តុលា' },
    { q: 'ខ្យល់មូសុងឦសាន (Northeast Monsoon) នាំមកនូវ៖', options: ['ធាតុអាកាសត្រជាក់ និងស្ងួត (រដូវប្រាំង)', 'ភ្លៀងជន់លិច', 'ខ្យល់ព្យុះសមុទ្រ', 'គ្មានខ្យល់'], answer: 0, explanation: 'រដូវប្រាំង វិច្ឆិកា-មេសា' }
  ]),
  createGame('soc-g-06', 'social', 'ភូមិវិទ្យា', 'geography', 'តំបន់សេដ្ឋកិច្ចពិសេស & កាត់ដេរ (Special Economic Zones)', 'Garment Industry, SEZs & Manufacturing', 'ស្វែងយល់ពីតំបន់សេដ្ឋកិច្ចពិសេសក្រុងព្រះសីហនុ ភ្នំពេញ បាវិត និងប៉ោយប៉ែត។', 'intermediate', 210, 60, 'Building2', 'Economic Geography', [
    { q: 'ឧស្សាហកម្មដែលបង្កើតការងារច្រើនជាងគេនៅកម្ពុជាគឺ៖', options: ['ឧស្សាហកម្មកាត់ដេរសម្លៀកបំពាក់ និងស្បែកជើង', 'ឧស្សាហកម្មផលិតយន្តហោះ', 'ឧស្សាហកម្មរ៉ែប្រេងកាត', 'ឧស្សាហកម្មអវកាស'], answer: 0, explanation: 'វិស័យកាត់ដេរសម្លៀកបំពាក់' },
    { q: 'តំបន់សេដ្ឋកិច្ចពិសេស (SEZ) បង្កើតឡើងក្នុងគោលបំណង៖', options: ['ទាក់ទាញវិនិយោគបរទេស បង្កើតការងារ និងជំរុញការនាំចេញ', 'បិទពាណិជ្ជកម្ម', 'ប្រមូលពន្ធលើសកម្រិត', 'គ្មានប្រយោជន៍'], answer: 0, explanation: 'ទាក់ទាញការវិនិយោគ និងបង្កើនការនាំចេញ' }
  ]),
  createGame('soc-g-07', 'social', 'ភូមិវិទ្យា', 'geography', 'ប្រជាសាស្ត្រ & នគរូបនីយកម្ម (Demography & Urbanization)', 'Population Pyramid & Urban Growth', 'វិភាគកំណើនប្រជាជន រចនាសម្ព័ន្ធអាយុ និងការរីកលូតលាស់នៃរាជធានីភ្នំពេញ។', 'beginner', 180, 60, 'Users', 'Human Geography', [
    { q: 'ប្រទេសកម្ពុជាមានប្រជាជនប្រមាណជាង៖', options: ['១៧ លាននាក់', '៥ លាននាក់', '៥០ លាននាក់', '១០០ លាននាក់'], answer: 0, explanation: 'ប្រមាណ ១៧ លាននាក់' },
    { q: 'រចនាសម្ព័ន្ធប្រជាសាស្ត្រកម្ពុជាមានលក្ខណៈពិសេសគឺ៖', options: ['មានកម្លាំងពលកម្មវ័យក្មេងច្រើន (ភាគលាភប្រជាសាស្ត្រ)', 'មានមនុស្សចាស់ច្រើនលើសលុប', 'គ្មានកុមារ', 'ចំនួនបុរសច្រើនជាងស្ត្រីទ្វេដង'], answer: 0, explanation: 'កម្លាំងពលកម្មវ័យក្មេងសម្បូរបែប' }
  ]),
  createGame('soc-g-08', 'social', 'ភូមិវិទ្យា', 'geography', 'ធនធានរ៉ែ ព្រៃឈើ & ថាមពលកកើតឡើងវិញ (Renewable Energy)', 'Solar, Hydro & Green Energy Transition', 'ស្វែងយល់ពីថាមពលពន្លឺព្រះអាទិត្យ វារីអគ្គិសនី និងការការពារបរិស្ថាន។', 'master', 230, 60, 'Sun', 'Environmental Geography', [
    { q: 'ប្រភពថាមពលស្អាតកកើតឡើងវិញដែលកម្ពុជាកំពុងពង្រីកខ្លាំងគឺ៖', options: ['ថាមពលពន្លឺព្រះអាទិត្យ (Solar) និងវារីអគ្គិសនី', 'ធ្យូងថ្មសុទ្ធសាធ', 'នុយក្លេអ៊ែរ', 'ប្រេងកាត'], answer: 0, explanation: 'ថាមពលពន្លឺព្រះអាទិត្យ និងវារីអគ្គិសនី' },
    { q: 'ជួរភ្នំដែលសម្បូរដោយជីវចម្រុះនិងធនធានព្រៃឈើធំជាងគេនៅកម្ពុជាគឺ៖', options: ['ជួរភ្នំក្រវ៉ាញ និងជួរភ្នំដងរែក', 'ភ្នំគូលែន', 'ភ្នំជីសូរ', 'ភ្នំបូកគោតែមួយ'], answer: 0, explanation: 'ជួរភ្នំក្រវ៉ាញ' }
  ]),
  createGame('soc-g-09', 'social', 'ភូមិវិទ្យា', 'geography', 'បណ្តាញគមនាគមន៍ & ភស្តុភារកម្ម (Infrastructure & Logistics)', 'Expressways, Bridges & Railway Network', 'ស្វែងយល់ពីផ្លូវល្បឿនលឿនភ្នំពេញ-ព្រះសីហនុ ស្ពាន និងផ្លូវរថភ្លើង។', 'intermediate', 200, 60, 'Compass', 'Infrastructure', [
    { q: 'ផ្លូវល្បឿនលឿនដំបូងគេបង្អស់នៅកម្ពុជាតភ្ជាប់រវាង៖', options: ['រាជធានីភ្នំពេញ និងក្រុងព្រះសីហនុ', 'ភ្នំពេញ និងសៀមរាប', 'ភ្នំពេញ និងបាត់ដំបង', 'ភ្នំពេញ និងបាវិត'], answer: 0, explanation: 'ផ្លូវល្បឿនលឿនភ្នំពេញ-ព្រះសីហនុ' },
    { q: 'ព្រលានយន្តហោះអន្តរជាតិតេជោ (ក្រុងតាខ្មៅ) ត្រូវបានសាងសង់ឡើងកម្រិត៖', options: ['កម្រិត 4F (អាចទទួលយន្តហោះខ្នាតធំបំផុត)', 'កម្រិតតូច 2B', 'សម្រាប់តែឧទ្ធម្ភាគចក្រ', 'កម្រិត 3C'], answer: 0, explanation: 'កម្រិត 4F' }
  ]),
  createGame('soc-g-10', 'social', 'ភូមិវិទ្យា', 'geography', 'វិស័យទេសចរណ៍ & បេតិកភណ្ឌពិភពលោក (Tourism & UNESCO)', 'Angkor, Preah Vihear, Sambor Prei Kuk & Koh Ker', 'ស្វែងយល់ពីប្រាសាទអង្គរវត្ត ព្រះវិហារ សំបូរព្រៃគុក និងកោះកេរ។', 'beginner', 190, 60, 'Crown', 'Cultural Tourism', [
    { q: 'សម្បត្តិបេតិកភណ្ឌពិភពលោកយូណេស្កូ (UNESCO) របស់កម្ពុជារួមមាន៖', options: ['អង្គរ (១៩៩២), ព្រះវិហារ (២០០៨), សំបូរព្រៃគុក (២០១៧), កោះកេរ (២០២៣)', 'អង្គរវត្តតែមួយគត់', 'គ្មានប្រាសាទណាជាប់ទេ', 'ប្រាសាទព្រះវិហារតែមួយ'], answer: 0, explanation: 'អង្គរ ព្រះវិហារ សំបូរព្រៃគុក កោះកេរ' },
    { q: 'តំបន់ទេសចរណ៍អេកូធម្មជាតិដ៏ល្បីនៅខេត្តមណ្ឌលគិរីរួមមាន៖', options: ['ទឹកធ្លាក់ប៊ូស្រា និងដែនជម្រកសត្វព្រៃកែវសីមា', 'ឆ្នេរអូរឈើទាល', 'ប្រាសាទបាយ័ន', 'ភ្នំសំពៅ'], answer: 0, explanation: 'ទឹកធ្លាក់ប៊ូស្រា' }
  ]),
  createGame('soc-g-11', 'social', 'ភូមិវិទ្យា', 'geography', 'ប្រព័ន្ធទន្លេទាំងបួន ចតុមុខ (Four Faces River System)', 'Mekong Upper, Mekong Lower, Tonle Sap & Bassac', 'ស្វែងយល់ពីចតុមុខ ទន្លេមេគង្គលើ មេគង្គក្រោម ទន្លេសាប និងទន្លេបាសាក់។', 'beginner', 180, 60, 'Globe', 'Hydrology', [
    { q: 'ប្រសព្វទន្លេបួនមុខ (ចតុមុខ) នៅរាជធានីភ្នំពេញរួមមាន៖', options: ['មេគង្គលើ, មេគង្គក្រោម, ទន្លេសាប, ទន្លេបាសាក់', 'ទន្លេក្រចេះ, ទន្លេសៀមរាប, ទន្លេកែប', 'ទន្លេក្រហម, ទន្លេខៀវ', 'គ្មានទន្លេ'], answer: 0, explanation: 'មេគង្គលើ មេគង្គក្រោម ទន្លេសាប ទន្លេបាសាក់' },
    { q: 'ទន្លេមេគង្គហូរកាត់ប្រទេសចំនួនប៉ុន្មានមុនធ្លាក់ដល់សមុទ្រចិនខាងត្បូង?', options: ['៦ ប្រទេស (ចិន មីយ៉ាន់ម៉ា ឡាវ ថៃ កម្ពុជា វៀតណាម)', '៣ ប្រទេស', '២ ប្រទេស', '១០ ប្រទេស'], answer: 0, explanation: '៦ ប្រទេស' }
  ]),
  createGame('soc-g-12', 'social', 'ភូមិវិទ្យា', 'geography', 'ប្រភេទដី & កសិកម្មដំណាំ (Cambodian Soil Types)', 'Basalt Red Soil, Alluvial Soil & Sandstone Soil', 'ស្គាល់ដីក្រហមបាសាល់ ដីល្បាប់មាត់ទន្លេ និងដីខ្សាច់។', 'intermediate', 200, 60, 'Layers', 'Pedology', [
    { q: 'ដីក្រហមបាសាល់ដ៏មានជីជាតិនៅខេត្តកំពង់ចាម និងត្បូងឃ្មុំ ស័ក្តិសមបំផុតសម្រាប់៖', options: ['ដំណាំកៅស៊ូ ស្វាយចន្ទី និងម្រេច', 'ដាំស្រូវសាលី', 'ដាំតែផ្លែប៉ោម', 'មិនអាចដាំអ្វីកើត'], answer: 0, explanation: 'កៅស៊ូ ស្វាយចន្ទី ម្រេច' },
    { q: 'ដីល្បាប់ដែលនាំមកដោយទឹកជំនន់ទន្លេមេគង្គជារៀងរាល់ឆ្នាំផ្តល់អត្ថប្រយោជន៍៖', options: ['បង្កើនជីជាតិធម្មជាតិដល់ដីស្រែចម្ការមាត់ទន្លេ', 'បំផ្លាញដី', 'ធ្វើឱ្យដីប្រៃ', 'គ្មានផល'], answer: 0, explanation: 'បង្កើនជីជាតិធម្មជាតិ' }
  ]),
  createGame('soc-g-13', 'social', 'ភូមិវិទ្យា', 'geography', 'ការប្រែប្រួលអាកាសធាតុ & គ្រោះរាំងស្ងួត/ទឹកជំនន់ (Climate Vulnerability)', 'El Niño, La Niña, Floods & Droughts in Cambodia', 'វិភាគបាតុភូតអែលនីញ៉ូ ឡានីញ៉ា និងការគ្រប់គ្រងគ្រោះមហន្តរាយ។', 'master', 230, 60, 'Sun', 'Climatology', [
    { q: 'បាតុភូត អែលនីញ៉ូ (El Niño) តែងតែនាំឱ្យកម្ពុជាជួបប្រទះ៖', options: ['អាកាសធាតុក្តៅខ្លាំង និងគ្រោះរាំងស្ងួតអូសបន្លាយ', 'ភ្លៀងធ្លាក់ជន់លិចខ្លាំង', 'ព្រិលធ្លាក់', 'គ្មានការប្រែប្រួល'], answer: 0, explanation: 'ក្តៅខ្លាំង និងរាំងស្ងួត' },
    { q: 'វិធានការទប់ទល់នឹងគ្រោះរាំងស្ងួតក្នុងវិស័យកសិកម្មគឺ៖', options: ['ការកសាង និងស្តារប្រព័ន្ធធារាសាស្ត្រ និងអាងស្តុកទឹក', 'ការកាប់ព្រៃឈើបន្ថែម', 'ការឈប់ធ្វើស្រែ', 'មិនធ្វើអ្វីទាំងអស់'], answer: 0, explanation: 'កសាងប្រព័ន្ធធារាសាស្ត្រ' }
  ]),
  createGame('soc-g-14', 'social', 'ភូមិវិទ្យា', 'geography', 'ពាណិជ្ជកម្មអន្តរជាតិ & កិច្ចព្រមព្រៀង RCEP (RCEP & Trade)', 'RCEP, FTA Cambodia-China, FTA Cambodia-Korea', 'ស្វែងយល់ពីទីផ្សារសេរី RCEP និងការនាំចេញទំនិញកម្ពុជា។', 'master', 240, 60, 'Globe', 'Economic Geography', [
    { q: 'កិច្ចព្រមព្រៀងភាពជាដៃគូសេដ្ឋកិច្ចគ្រប់ជ្រុងជ្រោយតំបន់ (RCEP) ជាកិច្ចព្រមព្រៀងពាណិជ្ជកម្មសេរី៖', options: ['ធំជាងគេបំផុតនៅលើពិភពលោក (រួមមាន ១៥ ប្រទេស)', 'តូចជាងគេ', 'សម្រាប់តែអឺរ៉ុប', 'សម្រាប់តែអាមេរិក'], answer: 0, explanation: 'កិច្ចព្រមព្រៀងពាណិជ្ជកម្មធំបំផុត' },
    { q: 'ទីផ្សារនាំចេញសំខាន់ៗរបស់កម្ពុជារួមមាន៖', options: ['សហរដ្ឋអាមេរិក, សហភាពអឺរ៉ុប, ចិន, វៀតណាម, ជប៉ុន', 'ទ្វីបអាហ្វ្រិកតែមួយគត់', 'គ្មានទីផ្សារនាំចេញ', 'ប្រទេសអូស្ត្រាលីតែមួយ'], answer: 0, explanation: 'អាមេរិក អឺរ៉ុប ចិន វៀតណាម ជប៉ុន' }
  ]),
  createGame('soc-g-15', 'social', 'ភូមិវិទ្យា', 'geography', 'តំបន់ត្រីកោណអភិវឌ្ឍន៍ & សមាហរណកម្មព្រំដែន (Border Economy)', 'Border Crossings, Trade Gates & Regional Growth', 'ស្វែងយល់ពីច្រកទ្វារព្រំដែនអន្តរជាតិប៉ោយប៉ែត បាវិត ច្រកដូង និងកោះកុង។', 'intermediate', 200, 60, 'Compass', 'Economic Geography', [
    { q: 'ច្រកទ្វារព្រំដែនអន្តរជាតិប៉ោយប៉ែតតភ្ជាប់ពាណិជ្ជកម្មរវាងកម្ពុជា និង៖', options: ['ប្រទេសថៃ', 'ប្រទេសវៀតណាម', 'ប្រទេសឡាវ', 'ប្រទេសចិន'], answer: 0, explanation: 'ព្រំដែនកម្ពុជា-ថៃ' },
    { q: 'ច្រកទ្វារព្រំដែនអន្តរជាតិបាវិតតភ្ជាប់ពាណិជ្ជកម្មរវាងកម្ពុជា និង៖', options: ['ប្រទេសវៀតណាម', 'ប្រទេសថៃ', 'ប្រទេសឡាវ', 'ប្រទេសមីយ៉ាន់ម៉ា'], answer: 0, explanation: 'ព្រំដែនកម្ពុជា-វៀតណាម' }
  ]),

  // --- 4. MORAL & CIVICS (10 Games) ---
  createGame('soc-c-01', 'social', 'សីលធម៌-ពលរដ្ឋ', 'civics', 'អំណាចរដ្ឋទាំង៣ (3 State Powers)', 'Legislative, Executive & Judicial Powers', 'វែកញែកអំណាចនីតិប្បញ្ញត្តិ នីតិប្រតិបត្តិ និងតុលាការ។', 'intermediate', 200, 60, 'Scale', 'Civics', [
    { q: 'ស្ថាប័នតំណាងអំណាចនីតិប្បញ្ញត្តិគឺ៖', options: ['រដ្ឋសភា និងព្រឹទ្ធសភា', 'រាជរដ្ឋាភិបាល', 'តុលាការកំពូល', 'ក្រុមប្រឹក្សាធម្មនុញ្ញ'], answer: 0, explanation: 'រដ្ឋសភា និងព្រឹទ្ធសភា' },
    { q: 'រដ្ឋធម្មនុញ្ញកម្ពុជាប្រកាសឱ្យប្រើនៅឆ្នាំ៖', options: ['១៩៩៣ (២៤ កញ្ញា)', '១៩៧៩', '១៩៩១', '១៩៩៨'], answer: 0, explanation: '២៤ កញ្ញា ១៩៩៣' }
  ]),
  createGame('soc-c-02', 'social', 'សីលធម៌-ពលរដ្ឋ', 'civics', 'សិទ្ធិមនុស្សជាសកល (Universal Human Rights)', 'Universal Declaration of Human Rights', 'ស្វែងយល់ពីសេចក្តីថ្លៃថ្នូរ និងសេរីភាពជាមូលដ្ឋាន។', 'beginner', 190, 60, 'ShieldCheck', 'Human Rights', [
    { q: 'សេចក្តីប្រកាសសិទ្ធិមនុស្ស UDHR អនុម័តនៅថ្ងៃ៖', options: ['១០ ធ្នូ ១៩៤៨', '៩ វិច្ឆិកា ១៩៥៣', '២៤ តុលា ១៩琅៤៥', '១ មករា ២០០០'], answer: 0, explanation: '១០ ធ្នូ ១៩៤៨' },
    { q: 'មាត្រា ១ នៃ UDHR ចែងថា៖', options: ['មនុស្សទាំងអស់កើតមកមានសេរីភាព និងសមភាពក្នុងសេចក្តីថ្លៃថ្នូរ និងសិទ្ធិ', 'មនុស្សត្រូវតែជាទាសករ', 'គ្មានសិទ្ធិស្មើគ្នា', 'គ្មានចែង'], answer: 0, explanation: 'សេរីភាព និងសមភាព' }
  ]),
  createGame('soc-c-03', 'social', 'សីលធម៌-ពលរដ្ឋ', 'civics', 'អភិបាលកិច្ចល្អ (Good Governance)', 'Good Governance & Rule of Law', 'តម្លាភាព គណនេយ្យភាព ការចូលរួម និងនីតិរដ្ឋ។', 'intermediate', 210, 60, 'Award', 'Governance', [
    { q: 'លក្ខណៈវិនិច្ឆ័យអភិបាលកិច្ចល្អរួមមាន៖', options: ['ការចូលរួម, នីតិរដ្ឋ, តម្លាភាព, គណនេយ្យភាព', 'ការសម្ងាត់ និងការសម្រេចតែឯង', 'ការមិនទទួលខុសត្រូវ', 'គ្មានច្បាប់'], answer: 0, explanation: 'ការចូលរួម នីតិរដ្ឋ តម្លាភាព គណនេយ្យភាព' },
    { q: '«នីតិរដ្ឋ» មានន័យថា៖', options: ['ច្បាប់ជាកំពូល មនុស្សគ្រប់រូបស្មើគ្នាចំពោះមុខច្បាប់', 'បុគ្គលធំជាងច្បាប់', 'គ្មានច្បាប់', 'សម្រាប់តែអ្នកក្រ'], answer: 0, explanation: 'ច្បាប់ជាកំពូល' }
  ]),
  createGame('soc-c-04', 'social', 'សីលធម៌-ពលរដ្ឋ', 'civics', 'សុវត្ថិភាពចរាចរណ៍ & កាតព្វកិច្ចពលរដ្ឋ (Road Safety & Civic Duties)', 'Traffic Laws, Helmet & Responsible Citizenship', 'ស្វែងយល់ពីច្បាប់ចរាចរណ៍ផ្លូវគោក ការពាក់មួកសុវត្ថិភាព និងការបង់ពន្ធជូនរដ្ឋ។', 'beginner', 180, 60, 'ShieldCheck', 'Civic Responsibility', [
    { q: 'កាតព្វកិច្ចចម្បងរបស់ពលរដ្ឋគ្រប់រូបរួមមាន៖', options: ['គោរពច្បាប់រដ្ឋធម្មនុញ្ញ បង់ពន្ធ និងការពារជាតិ', 'គេចពន្ធ', 'មិនគោរពច្បាប់', 'គ្មានកាតព្វកិច្ច'], answer: 0, explanation: 'គោរពច្បាប់ បង់ពន្ធ ការពារជាតិ' },
    { q: 'ពេលបើកបរទោចក្រយានយន្ត អ្នកបើកបរនិងអ្នករួមដំណើរត្រូវ៖', options: ['ពាក់មួកសុវត្ថិភាពឱ្យបានត្រឹមត្រូវជានិច្ច', 'ពាក់តែពេលឃើញប៉ូលិស', 'មិនបាច់ពាក់', 'ពាក់តែអ្នកបើកបរ'], answer: 0, explanation: 'ពាក់មួកសុវត្ថិភាពទាំងអ្នកបើកនិងអ្នករួមដំណើរ' }
  ]),
  createGame('soc-c-05', 'social', 'សីលធម៌-ពលរដ្ឋ', 'civics', 'សីលធម៌បរិស្ថាន & ការប្រែប្រួលអាកាសធាតុ (Eco-Ethics & Climate)', 'Climate Change, 3Rs & Environmental Ethics', 'ស្វែងយល់ពីគោលការណ៍ 3R (Reduce, Reuse, Recycle) និងការការពារព្រៃឈើ។', 'intermediate', 200, 60, 'Sun', 'Environmental Ethics', [
    { q: 'គោលការណ៍ 3R ក្នុងការគ្រប់គ្រងកាកសំណល់រួមមាន៖', options: ['Reduce (កាត់បន្ថយ), Reuse (ប្រើឡើងវិញ), Recycle (កែច្នៃឡើងវិញ)', 'Run, Read, Rest', 'Rent, Refill, Remove', 'គ្មាន'], answer: 0, explanation: 'Reduce, Reuse, Recycle' },
    { q: 'ការដាំដើមឈើជួយដល់បរិស្ថានដោយសារ៖', options: ['ស្រូបយកឧស្ម័ន CO₂ និងបញ្ចេញអុកស៊ីសែន O₂', 'ស្រូបយកអុកស៊ីសែន', 'បង្កើនកម្តៅផែនដី', 'គ្មានផលប្រយោជន៍'], answer: 0, explanation: 'ស្រូបយក CO₂ និងបញ្ចេញ O₂' }
  ]),
  createGame('soc-c-06', 'social', 'សីលធម៌-ពលរដ្ឋ', 'civics', 'សមភាពយេនឌ័រ & សិទ្ធិកុមារ (Gender Equality & Child Rights)', 'CRC Child Rights & Women Empowerment', 'ស្វែងយល់ពីអនុសញ្ញាស្តីពីសិទ្ធិកុមារ (CRC) និងការលើកកម្ពស់តួនាទីស្ត្រី។', 'beginner', 190, 60, 'Heart', 'Human Rights', [
    { q: 'សិទ្ធិជាមូលដ្ឋានទាំង ៤ របស់កុមាររួមមាន៖', options: ['សិទ្ធិរស់រានមានជីវិត, សិទ្ធិទទួលបានការការពារ, សិទ្ធិអភិវឌ្ឍន៍, សិទ្ធិចូលរួម', 'សិទ្ធិធ្វើការងារធ្ងន់', 'សិទ្ធិឈប់រៀន', 'គ្មាន'], answer: 0, explanation: 'រស់រាន ការពារ អភិវឌ្ឍន៍ ចូលរួម' },
    { q: 'សមភាពយេនឌ័រ (Gender Equality) មានន័យថា៖', options: ['បុរសនិងស្ត្រីមានសិទ្ធិ កាតព្វកិច្ច និងកាលានុវត្តភាពស្មើគ្នាគ្រប់វិស័យ', 'ស្ត្រីត្រូវធ្វើការងារផ្ទះតែមួយមុខ', 'បុរសមានអំណាចលើស', 'គ្មានសមភាព'], answer: 0, explanation: 'សិទ្ធិ និងកាលានុវត្តភាពស្មើគ្នា' }
  ]),
  createGame('soc-c-07', 'social', 'សីលធម៌-ពលរដ្ឋ', 'civics', 'ការប្រឆាំងអំពើពុករលួយ & សុចរិតភាព (Anti-Corruption & Integrity)', 'Anti-Corruption Law & Public Integrity', 'ស្វែងយល់ពីច្បាប់ប្រឆាំងអំពើពុករលួយ និងគុណតម្លៃនៃភាពស្មោះត្រង់។', 'intermediate', 210, 60, 'ShieldCheck', 'Civics', [
    { q: 'ស្ថាប័នជាតិដែលមានសមត្ថកិច្ចប្រយុទ្ធប្រឆាំងអំពើពុករលួយនៅកម្ពុជាគឺ៖', options: ['អង្គភាពប្រឆាំងអំពើពុករលួយ (ACU)', 'ក្រសួងសុខាភិបាល', 'ក្រសួងទេសចរណ៍', 'សាលាក្រុង'], answer: 0, explanation: 'អង្គភាពប្រឆាំងអំពើពុករលួយ (ACU)' },
    { q: 'ផលប៉ះពាល់អវិជ្ជមាននៃអំពើពុករលួយរួមមាន៖', options: ['រារាំងការអភិវឌ្ឍសេដ្ឋកិច្ច បង្កើនវិសមភាព និងបាត់បង់ទំនុកចិត្តលើច្បាប់', 'ជួយឱ្យប្រទេសរីកចម្រើន', 'គ្មានផលប៉ះពាល់', 'ជួយកាត់បន្ថយភាពក្រីក្រ'], answer: 0, explanation: 'រារាំងការអភិវឌ្ឍ និងបង្កើនវិសមភាព' }
  ]),
  createGame('soc-c-08', 'social', 'សីលធម៌-ពលរដ្ឋ', 'civics', 'លទ្ធិប្រជាធិបតេយ្យសេរីពហុបក្ស (Pluralist Democracy)', 'Free Multi-Party Democracy & Elections', 'ស្វែងយល់ពីការបោះឆ្នោតដោយសេរី ត្រឹមត្រូវ និងយុត្តិធម៌តាមបែបប្រជាធិបតេយ្យ។', 'master', 230, 60, 'Users', 'Political Science', [
    { q: 'របបនយោបាយនៃព្រះរាជាណាចក្រកម្ពុជាតាមរដ្ឋធម្មនុញ្ញគឺ៖', options: ['របបរាជានិយមអាស្រ័យរដ្ឋធម្មនុញ្ញ និងប្រជាធិបតេយ្យសេរីពហុបក្ស', 'របបផ្តាច់ការ', 'របបសាធារណរដ្ឋប្រធានាធិបតី', 'របបកុម្មុយនីស្ត'], answer: 0, explanation: 'រាជានិយមអាស្រ័យរដ្ឋធម្មនុញ្ញ ពហុបក្ស' },
    { q: 'គោលការណ៍នៃការបោះឆ្នោតជាតិគឺ៖', options: ['ជាសកល ស្មើភាព ដោយផ្ទាល់ និងសម្ងាត់', 'ដោយបង្ខំ', 'ដោយបើកចំហជាសាធារណៈ', 'សម្រាប់តែមន្ត្រី'], answer: 0, explanation: 'សកល ស្មើភាព ផ្ទាល់ សម្ងាត់' }
  ]),
  createGame('soc-c-09', 'social', 'សីលធម៌-ពលរដ្ឋ', 'civics', 'សីលធម៌ឌីជីថល & សុវត្ថិភាពអ៊ីនធឺណិត (Digital Ethics & Cyber Safety)', 'Cyberbullying, Fake News & Digital Citizenship', 'ស្វែងយល់ពីការទប់ស្កាត់ព័ត៌មានក្លែងក្លាយ ការពារទិន្នន័យឯកជន និងការប្រើប្រាស់បណ្តាញសង្គមប្រកបដោយការទទួលខុសត្រូវ។', 'beginner', 190, 60, 'Zap', 'Digital Ethics', [
    { q: 'ពេលឃើញព័ត៌មានមិនច្បាស់លាស់លើបណ្តាញសង្គម យើងគួរ៖', options: ['ផ្ទៀងផ្ទាត់ប្រភពផ្លូវការមុននឹងជឿ ឬចែករំលែក (Share)', 'Share ភ្លាមកុំឱ្យគេដឹងមុន', 'ជេរប្រមាថ', 'មិនខ្វល់'], answer: 0, explanation: 'ផ្ទៀងផ្ទាត់ប្រភពផ្លូវការមុនចែករំលែក' },
    { q: 'ការគំរាមកំហែងលើអ៊ីនធឺណិត (Cyberbullying) គឺជា៖', options: ['អំពើខុសច្បាប់ និងអសីលធម៌ដែលប៉ះពាល់ដល់សតិអារម្មណ៍អ្នកដទៃ', 'រឿងសប្បាយ', 'សេរីភាពបញ្ចេញមតិគ្មានព្រំដែន', 'គ្មានទោស'], answer: 0, explanation: 'អំពើអសីលធម៌ និងប៉ះពាល់សិទ្ធិអ្នកដទៃ' }
  ]),
  createGame('soc-c-10', 'social', 'សីលធម៌-ពលរដ្ឋ', 'civics', 'សុជីវធម៌ក្នុងការទំនាក់ទំនង & សាមគ្គីភាពជាតិ (Social Etiquette & Unity)', 'National Solidarity, Respect & Compassion', 'ស្វែងយល់ពីការសំពះគំនាប់ខ្មែរ ការដឹងគុណមាតាបិតា និងស្មារតីសាមគ្គីភាព។', 'beginner', 180, 60, 'Heart', 'Ethics', [
    { q: 'ការសំពះខ្មែរមានប៉ុន្មានរបៀបតាមកម្រិតវ័យ និងឋានៈ?', options: ['៥ របៀប (មិត្តភក្តិ, ចាស់ទុំ, ឪពុកម្តាយ/គ្រូ, ស្តេច/សង្ឃ, ព្រះ)', '២ របៀប', '៣ របៀប', '១ របៀប'], answer: 0, explanation: '៥ របៀប' },
    { q: 'ស្មារតីសាមគ្គីភាពជាតិជួយឱ្យប្រទេសជាតិ៖', options: ['មានសុខសន្តិភាព ស្ថិរភាព និងការអភិវឌ្ឍរីកចម្រើន', 'ចុះខ្សោយ', 'បែកបាក់', 'គ្មានផលប្រយោជន៍'], answer: 0, explanation: 'រក្សាសន្តិភាព និងការអភិវឌ្ឍ' }
  ]),

  // --- 5. SOCIAL MATH & FINANCIAL LITERACY (5 Games) ---
  createGame('soc-m-01', 'social', 'គណិតវិទ្យា (សង្គម)', 'math', 'បន្សំ & ប្រូបាប៊ីលីតេបាល់ពណ៌ (Combinations & Balls)', 'Combinatorics C(n,r) & Probability', 'គណនាបន្សំ C(n,r) និងការចាប់បាល់ពណ៌។', 'intermediate', 200, 60, 'Calculator', 'Social Math', [
    { q: 'គណនាតម្លៃនៃបន្សំ C(5, 2) = ?', options: ['10', '20', '5', '12'], answer: 0, explanation: '10' },
    { q: 'ក្នុងប្រអប់មានបាល់ក្រហម ៣ ខៀវ ៧ (សរុប ១០)។ ចាប់ ១ គ្រាប់ P(ក្រហម) = ?', options: ['3/10 (0.3)', '7/10 (0.7)', '3/7', '1/3'], answer: 0, explanation: '0.3' }
  ]),
  createGame('soc-m-02', 'social', 'គណិតវិទ្យា (សង្គម)', 'math', 'ស្ថិតិវិទ្យាសង្គម (Social Statistics)', 'Mean, Median, Mode & Spread', 'គណនាមធ្យមនព្វន្ធ X̄, ម៉ូដ Mo និងមេដ្យាន Me។', 'beginner', 190, 60, 'Activity', 'Statistics', [
    { q: 'ទិន្នន័យ៖ ៥, ៦, ៧, ៧, ៧, ៨, ៩។ ម៉ូដ (Mode) គឺ៖', options: ['6', '7 (ប្រេកង់ច្រើនបំផុត)', '8', '9'], answer: 1, explanation: '7' },
    { q: 'មធ្យមនព្វន្ធនៃ ៤, ៦, ៨, ១០ គឺ៖', options: ['6', '7', '8', '28'], answer: 1, explanation: '7' }
  ]),
  createGame('soc-m-03', 'social', 'គណិតវិទ្យា (សង្គម)', 'math', 'ការប្រាក់សមាស (Compound Interest)', 'Simple & Compound Interest Formula', 'គណនាប្រាក់សរុប A = P(1 + r)ⁿ។', 'master', 230, 60, 'DollarSign', 'Financial Math', [
    { q: 'ប្រាក់ដើម P = $1,000, r = 10%, t = 2 ឆ្នាំ។ ការប្រាក់ទោល I = ?', options: ['$100', '$200', '$1,200', '$50'], answer: 1, explanation: '$200' },
    { q: 'រូបមន្តប្រាក់សរុបការប្រាក់សមាសគឺ៖', options: ['A = P(1 + r)ⁿ', 'A = P(1 + nr)', 'A = P · r · n', 'A = P / (1 + r)'], answer: 0, explanation: 'A = P(1 + r)ⁿ' }
  ]),
  createGame('soc-m-04', 'social', 'គណិតវិទ្យា (សង្គម)', 'math', 'ចំណុចរួចខ្លួន & គណនេយ្យអាជីវកម្ម (Break-Even Analysis)', 'Break-Even Point, Revenue & Profit Function', 'គណនាប្រាក់ចំណូល R(x) ចំណាយ C(x) និងប្រាក់ចំណេញ P(x) = R(x) - C(x)។', 'intermediate', 210, 60, 'TrendingUp', 'Financial Math', [
    { q: 'ចំណុចរួចខ្លួន (Break-even Point) កើតឡើងនៅពេល៖', options: ['ចំណូលសរុបស្មើចំណាយសរុប (R = C ឬ P = 0)', 'ចំណាយធំជាងចំណូល', 'ចំណេញអតិបរមា', 'ខាតបង់'], answer: 0, explanation: 'R(x) = C(x)' },
    { q: 'ផលិតផលលក់តម្លៃ $20 ក្នុង ១ ឯកតា ចំណាយអថេរ $12 ក្នុង ១ ឯកតា ចំណាយថេរ $800។ ចំនួនរួចខ្លួនគឺ៖', options: ['100 ឯកតា', '80 ឯកតា', '50 ឯកតា', '200 ឯកតា'], answer: 0, explanation: 'x = 800 / (20 - 12) = 800/8 = 100 ឯកតា' }
  ]),
  createGame('soc-m-05', 'social', 'គណិតវិទ្យា (សង្គម)', 'math', 'អតិផរណា & អត្រាប្តូរប្រាក់ (Inflation & Exchange Rates)', 'Currency Exchange, Purchasing Power & CPI', 'គណនាការប្តូរប្រាក់រៀល-ដុល្លារ និងអំណាចទិញ។', 'beginner', 190, 60, 'DollarSign', 'Economics', [
    { q: 'អត្រាប្តូរប្រាក់ $1 = 4,000 រៀល។ តើ $50 ស្មើនឹងប៉ុន្មានរៀល?', options: ['200,000 រៀល', '40,000 រៀល', '100,000 រៀល', '500,000 រៀល'], answer: 0, explanation: '50 × 4000 = 200,000 រៀល' },
    { q: 'អតិផរណា (Inflation) សំដៅលើ៖', options: ['ការកើនឡើងជាទូទៅនៃកម្រិតថ្លៃទំនិញ និងសេវាកម្មក្នុងសេដ្ឋកិច្ច', 'ទំនិញចុះថោក', 'ប្រាក់ខែកើន', 'គ្មានការប្រែប្រួល'], answer: 0, explanation: 'ការឡើងថ្លៃនៃទំនិញ' }
  ]),

  // --- 6. ENGLISH LANGUAGE (5 Games) ---
  createGame('soc-e-01', 'all', 'ភាសាអង់គ្លេស', 'english', 'ប្រយុទ្ធវេយ្យាករណ៍ Passive Voice (Passive Voice)', 'Passive Voice in all Tenses', 'បំប្លែង Active Voice ទៅ Passive Voice: was/were + V3។', 'beginner', 180, 60, 'Languages', 'English Grammar', [
    { q: 'Passive Voice: "The Ministry built a new laboratory yesterday."', options: ['A new laboratory was built by the Ministry yesterday.', 'A new laboratory is built by the Ministry yesterday.', 'A new laboratory had been build yesterday.', 'A new laboratory was building yesterday.'], answer: 0, explanation: 'was built' },
    { q: 'Change to Passive: "Students are writing the exam."', options: ['The exam is being written by students.', 'The exam was written by students.', 'The exam has written by students.', 'The exam is writing by students.'], answer: 0, explanation: 'is being written' }
  ]),
  createGame('soc-e-02', 'all', 'ភាសាអង់គ្លេស', 'english', 'លក្ខខណ្ឌ Conditional Sentences (Conditionals 1, 2, 3)', 'Conditionals Type 1, 2 & 3', 'ស្ទាត់ជំនាញ If Clause Type 1, Type 2 និង Type 3។', 'intermediate', 200, 60, 'BookMarked', 'English Grammar', [
    { q: 'Complete: "If you ________ hard, you will pass the BacII exam with Grade A."', options: ['study', 'studied', 'will study', 'studying'], answer: 0, explanation: 'study' },
    { q: 'Complete: "If I ________ a million dollars, I would travel around Cambodia."', options: ['have', 'had', 'will have', 'having'], answer: 1, explanation: 'had' }
  ]),
  createGame('soc-e-03', 'all', 'ភាសាអង់គ្លេស', 'english', 'កថាប្រយោល Reported Speech (Reported Speech)', 'Direct to Indirect Speech & Tense Shifts', 'បំប្លែង Direct Speech ទៅ Indirect Speech: Said that + Past Tense។', 'master', 230, 60, 'Languages', 'English Grammar', [
    { q: 'Report: He said, "I am studying Khmer literature today."', options: ['He said that he was studying Khmer literature that day.', 'He said that I am studying Khmer literature today.', 'He said he will study Khmer literature.', 'He says he studied.'], answer: 0, explanation: 'am studying → was studying, today → that day' },
    { q: 'Report: She asked me, "Where do you live?"', options: ['She asked me where I lived.', 'She asked me where do I live.', 'She asked me where did I live.', 'She asked where I live?'], answer: 0, explanation: 'where I lived' }
  ]),
  createGame('soc-e-04', 'all', 'ភាសាអង់គ្លេស', 'english', 'កន្សោម Relative Clauses (Who, Which, That, Where)', 'Defining & Non-defining Relative Clauses', 'ស្ទាត់ជំនាញប្រើប្រាស់ឈ្នាប់ Who (មនុស្ស), Which (វត្ថុ), Where (កន្លែង)។', 'intermediate', 200, 60, 'Languages', 'English Grammar', [
    { q: 'Complete: "The student ________ won the Gold Medal in Physics is my friend."', options: ['who', 'which', 'where', 'whose'], answer: 0, explanation: 'who (សម្រាប់មនុស្ស)' },
    { q: 'Complete: "Siem Reap is the province ________ Angkor Wat is located."', options: ['where', 'who', 'which', 'when'], answer: 0, explanation: 'where (សម្រាប់ទីកន្លែង)' }
  ]),
  createGame('soc-e-05', 'all', 'ភាសាអង់គ្លេស', 'english', 'កិរិយាស័ព្ទផ្សំ Phrasal Verbs (BacII Essential Phrasal Verbs)', 'Key Phrasal Verbs: Give up, Look for, Turn on...', 'ស្គាល់អត្ថន័យនៃ Phrasal Verbs សំខាន់ៗត្រៀមប្រឡងបាក់ឌុប។', 'master', 220, 60, 'Languages', 'Vocabulary', [
    { q: 'The phrasal verb "give up" means:', options: ['to stop trying or quit', 'to continue working', 'to start something new', 'to give a gift'], answer: 0, explanation: 'give up = បោះបង់ ឬឈប់ព្យាយាម' },
    { q: 'Choose the correct verb: "Never ________ your dreams; keep studying hard!"', options: ['give up on', 'look down', 'take after', 'turn into'], answer: 0, explanation: 'give up on your dreams' }
  ])
];
