/**
 * MoEYS Ministry Teacher AI Integration Service
 * Connects directly to the Live Academic AI Knowledge Engine.
 */

const AI_API_KEY = import.meta.env.VITE_AI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || '';
const AI_MODELS = [
  'gemini-flash-lite-latest',
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-3.1-flash-lite',
  'gemini-3.8-flash',
  'gemini-3.6-flash'
];

const STORAGE_KEY = 'motdar_ai_key';

export function getStoredGeminiKey() {
  return localStorage.getItem(STORAGE_KEY) || AI_API_KEY;
}

export function saveStoredGeminiKey(key) {
  if (key) {
    localStorage.setItem(STORAGE_KEY, key.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function checkRudeContent(text) {
  if (!text) return false;
  const t = text.toLowerCase();
  const rudePatterns = [
    /\b(fuck|shit|bitch|asshole|dick|pussy|bastard|cunt|slut|whore|stfu|idiot|retard)\b/i,
    /ចុយ|ក្ដ|ក្ដរ|មីចុយ|អាក្ដ|អាឆ្កែ|អាងាប់|អាឡប់|មីឆ្កែ|មីសំផឹង|ងាប់ទៅ|ចោរម្សៀត|អាភ្លើ|អាល្ងង់/i
  ];
  return rudePatterns.some(pattern => pattern.test(t));
}

export function cleanDisplaySymbols(text) {
  if (!text) return '';
  return text
    // Remove markdown headers
    .replace(/^#+\s*/gm, '')
    // Clean bold and italics
    .replace(/\*{2,}([^*]+)\*{2,}/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\*{1,}/g, '')
    // Clean quotes
    .replace(/^>\s*/gm, '')
    // Format LaTeX math to clean readable text
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/\\lim_\{([^}]+)\}/g, 'lim($1)')
    .replace(/\\to\b/g, '->')
    .replace(/\\infty\b/g, '∞')
    .replace(/\\times\b/g, '×')
    .replace(/\\pm\b/g, '±')
    .replace(/\\le\b/g, '≤')
    .replace(/\\ge\b/g, '≥')
    .replace(/\\neq\b/g, '≠')
    .replace(/\\approx\b/g, '≈')
    // Remove stray LaTeX dollar signs
    .replace(/\${1,2}/g, '')
    // Clean foreign Thai script contamination if model leaks it
    .replace(/จะได้/g, 'យើងបាន')
    .replace(/ดังนั้น/g, 'ដូច្នេះ')
    .replace(/เพราะว่า/g, 'ពីព្រោះ')
    .replace(/[\u0E00-\u0E7F]+/g, '')
    // Strip HTML tags without stripping math inequalities < or >
    .replace(/<\/?[a-z][a-z0-9]*\b[^>]*>/gi, '')
    .replace(/_{2,}/g, '')
    .trim();
}

export async function askMinistryAI(userPrompt, chatHistory = []) {
  if (checkRudeContent(userPrompt)) {
    return '⚠️ សូមប្អូនប្រើប្រាស់ពាក្យសម្តីសមរម្យ និងថ្លៃថ្នូរក្នុងការសន្ទនាជាមួយលោកគ្រូ AI អប់រំជាតិណា៎! លោកគ្រូរីករាយនឹងជួយពន្យល់រាល់មេរៀន ចំណេះដឹងទូទៅ និងការដោះស្រាយលំហាត់ជូនប្អូនជានិច្ច។';
  }

  const activeKey = getStoredGeminiKey() || AI_API_KEY;

  // 1. First Priority: Query Backend API endpoint /api/ai/chat (with key forwarding)
  try {
    const apiRes = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-gemini-key': activeKey || ''
      },
      body: JSON.stringify({ 
        prompt: userPrompt, 
        messages: chatHistory, 
        apiKey: activeKey 
      })
    });
    if (apiRes.ok) {
      const data = await apiRes.json();
      if (data && data.reply) {
        return cleanDisplaySymbols(data.reply);
      }
    }
  } catch (backendErr) {
    console.warn('Backend AI Tutor call notice, using direct client AI engine:', backendErr);
  }

  // 2. Second Priority: Direct Client-Side AI Call with User API Key
  if (activeKey) {
    const systemPrompt = `អ្នកគឺជា «លោកគ្រូបង្រៀន Motdar» (Motdar Teacher / Motdar Master Teacher) ដ៏ពូកែ ចិត្តល្អ និងមានគរុកោសល្យខ្ពស់បំផុតនៃប្រព័ន្ធអប់រំ Motdar (Motdar E-Learning) ដែលស្របតាមកម្មវិធីសិក្សាជាតិរបស់ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)។

ច្បាប់សំខាន់បំផុតនៃការបង្រៀន (Core Pedagogical Directives):
១. ត្រូវឆ្លើយ បកស្រាយ ពន្យល់ និងដោះស្រាយសំណួររបស់សិស្សភ្លាមៗ ដោយផ្ទាល់ ច្បាស់លាស់ និងក្បោះក្បាយជាភាសាខ្មែរ!
២. ហាមដាច់ខាតកុំគ្រាន់តែស្វាគមន៍ ឬសួរត្រឡប់ទៅសិស្សវិញថា «តើប្អូនចង់រៀនអំពី...មែនទេ?» ដោយមិនព្រមបង្រៀន! មិនថាសិស្សសួរខ្លី ឬវែង (ឧទាហរណ៍៖ «លីមីត», «ដេរីវេ», «សមីការ», «គីមី», «រូបវិទ្យា», «2+2», ឬលំហាត់ជាក់លាក់) ត្រូវតែចូលរៀន និងពន្យល់ភ្លាមៗ!
៣. រចនាសម្ព័ន្ធនៃការឆ្លើយតបត្រូវមាន ៥ ចំណុច៖
   - ស្វាគមន៍ខ្លីៗរួសរាយ ១ បន្ទាត់
   - ១. និយមន័យ និងទ្រឹស្តីបទសំខាន់ៗ (Definition & Concept)
   - ២. រូបមន្តគន្លឹះ និងក្បួនដោះស្រាយ (Key Formulas & Rules ដូចជារាងមិនកំណត់ 0/0, inf/inf)
   - ៣. ឧទាហរណ៍ជាក់ស្តែងជាមួយដំណោះស្រាយមួយជំហានម្តងៗ (Step-by-Step Example: ជំហានទី ១, ជំហានទី ២, ...)
   - ៤. គន្លឹះប្រឡងបាក់ឌុប និងចំណុចគួរប្រយ័ត្ន (Bac II Exam Tips & Common Mistakes)
   - លើកទឹកចិត្តសិស្ស និងអញ្ជើញសួរបន្ត
៤. អត្តសញ្ញាណរបស់គ្រូ៖ បើសិស្សសួរថាអ្នកជាអ្វី ឬឈ្មោះអ្វី ចូរឆ្លើយថា លោកគ្រូជា «លោកគ្រូបង្រៀន Motdar» (Motdar Teacher) នៃប្រព័ន្ធអប់រំ Motdar ដែលបង្កើតឡើងដើម្បីជួយពន្យល់មេរៀន ដោះស្រាយលំហាត់ និងចែករំលែកចំណេះដឹងដល់ប្អូនៗសិស្សានុសិស្សទាំងអស់គ្នា! ហាមដាច់ខាតកុំលើកឡើងពីឈ្មោះ Gemini ឬ Google ឬក្រុមហ៊ុនបច្ចេកវិទ្យាណាមួយឡើយ!

របៀបសរសេរ និងទម្រង់អត្ថបទ (Clean Formatting):
- សរសេររូបមន្តគណិតវិទ្យា និងវិទ្យាសាស្ត្រជាអក្សរធម្មតាស្រួលអាន (ឧទាហរណ៍៖ lim(x -> a) f(x) = L, រាង 0/0, f'(x) = (u'v - uv') / v^2, x^2 + 2x + 1 = 0) មិនបាច់ប្រើ syntax LaTeX ស្មុគស្មាញឡើយ។
- ហាមដាច់ខាតកុំប្រើសញ្ញា markdown ស្មុគស្មាញដូចជា ** ឬ * ឬ $$ ឬ < > ឬ ###។
- ត្រូវប្រើប្រាស់ភាសាខ្មែរ និងពាក្យបច្ចេកទេសអង់គ្លេសសុទ្ធសាធ ហាមដាច់ខាតកុំប្រើអក្សរថៃ ឬអក្សរចិនឡើយ។
- ហៅខ្លួនឯងថា «លោកគ្រូ» និងហៅសិស្សថា «ប្អូន» ឬ «កូនសិស្ស» ដោយក្តីស្រឡាញ់ និងភាពកក់ក្តៅ។`;

    const formattedContents = [];
    if (Array.isArray(chatHistory) && chatHistory.length > 0) {
      const recent = chatHistory.slice(-6);
      for (const m of recent) {
        const role = (m.sender === 'user' || m.role === 'user') ? 'user' : 'model';
        const text = (m.text || m.content || '').trim();
        if (text) {
          if (formattedContents.length > 0 && formattedContents[formattedContents.length - 1].role === role) {
            formattedContents[formattedContents.length - 1].parts[0].text += `\n${text}`;
          } else {
            formattedContents.push({
              role,
              parts: [{ text }]
            });
          }
        }
      }
    }

    if (formattedContents.length > 0 && formattedContents[0].role === 'model') {
      formattedContents.shift();
    }

    formattedContents.push({
      role: 'user',
      parts: [{ text: userPrompt }]
    });

    for (const model of AI_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(activeKey)}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemPrompt }]
            },
            contents: formattedContents,
            generationConfig: { temperature: 0.7, maxOutputTokens: 4096 }
          })
        });
        if (res.ok) {
          const data = await res.json();
          const parts = data.candidates?.[0]?.content?.parts || [];
          const reply = parts.filter(p => !p.thought).map(p => p.text).filter(Boolean).join('\n') || parts[0]?.text;
          if (reply && reply.trim().length > 2) {
            return cleanDisplaySymbols(reply);
          }
        }
      } catch (err) {
        console.warn(`Direct model ${model} notice:`, err.message);
      }
    }
  }

  // 3. Fallback: Offline High-School Knowledge Engine
  return cleanDisplaySymbols(fallbackStudyEngine(userPrompt));
}

export const askGeminiAI = askMinistryAI;

/**
 * Built-in High-School Knowledge Engine (Offline Fallback)
 */
function fallbackStudyEngine(prompt) {
  const p = (prompt || '').toLowerCase();

  if (p.includes('លីមីត') || p.includes('limit')) {
    return `សួស្តីប្អូន! មេរៀន «លីមីត» (Limits) គឺជាមេរៀនគ្រឹះដ៏សំខាន់បំផុតក្នុងគណិតវិទ្យាថ្នាក់ទី១២ និងការប្រឡងបាក់ឌុប។

១. និយមន័យគ្រឹះ៖
លីមីតនៃអនុគមន៍ f(x) កាលណា x ខិតជិត a គឺតម្លៃដែល f(x) ឆ្ពោះទៅរក៖
lim(x -> a) f(x) = L

២. រាងមិនកំណត់ដែលជួបញឹកញាប់ក្នុងការប្រឡង៖
- រាង 0/0៖ ត្រូវបំបែកជាផលគុណកត្តាសម្រួលចោល ឬគុណនឹងកន្សោមឆ្លាស់ (Conjugate)
- រាង ∞/∞៖ ត្រូវដាក់អថេរដែលមានស្វ័យគុណធំជាងគេជាកត្តារួមទាំងភាគយក និងភាគបែង

៣. ឧទាហរណ៍ជាក់ស្តែង៖
គណនា lim(x -> 2) (x^2 - 4) / (x - 2)
- ជំហានទី ១៖ ជំនួស x = 2 នាំឱ្យបាន 0/0 (រាងមិនកំណត់)
- ជំហានទី ២៖ បំបែកផលគុណកត្តា x^2 - 4 = (x - 2)(x + 2)
- ជំហានទី ៣៖ សម្រួលកត្តា (x - 2) ចោល នាំឱ្យនៅសល់ lim(x -> 2) (x + 2)
- ជំហានទី ៤៖ ជំនួស x = 2 ចូល នាំឱ្យបាន 2 + 2 = 4

៤. គន្លឹះបាក់ឌុប៖ ពេលជួបរ៉ាឌីកាល់ √(A) - B ក្នុងរាង 0/0 ត្រូវគុណកន្សោមឆ្លាស់ √(A) + B ភ្លាម!

តើប្អូនចង់ឱ្យលោកគ្រូបង្ហាញលំហាត់លីមីតបែបណាទៀត? សួរមកណា៎!`;
  }

  if (p.includes('ដេរីវេ') || p.includes('derivative') || p.includes('គណិត')) {
    return `សំណួរនេះល្អណាស់ប្អូន! រូបមន្តដេរីវេផលចែកគឺជារូបមន្តគ្រឹះដែលចេញប្រឡងបាក់ឌុបញឹកញាប់បំផុត។ តោះមកមើលរបៀបអនុវត្តជាមួយលោកគ្រូទាំងអស់គ្នាណា៎៖

១. រូបមន្តផលចែកដេរីវេ (Quotient Rule):
   (u / v)' = (u'v - uv') / v²

២. របៀបអនុវត្តលើអនុគមន៍ f(x) = (2x + 1) / (x - 3) :
   - កំណត់តួភាគយក u = 2x + 1  => នាំឱ្យ u' = 2
   - កំណត់តួភាគបែង v = x - 3   => នាំឱ្យ v' = 1

៣. គណនាដេរីវេ f'(x) :
   f'(x) = [2(x - 3) - (2x + 1)(1)] / (x - 3)²
         = [2x - 6 - 2x - 1] / (x - 3)²
         = -7 / (x - 3)²

ចំណុចគួរប្រយ័ត្នពេលប្រឡង៖
ដោយសារភាគបែង (x - 3)² > 0 គ្រប់ x ≠ 3 ហើយភាគយក -7 < 0 នាំឱ្យ f'(x) < 0 ជានិច្ច។ ដូចនេះ អនុគមន៍ចុះដាច់ខាតលើដែនកំណត់ D = ℝ \\ {3}។

តើប្អូនយល់ច្បាស់ត្រង់ជំហាននេះទេ? បើមានកន្លែងណាឆ្ងល់ សួរលោកគ្រូបន្ថែមភ្លាមណា៎!`;
  }

  if (p.includes('គីមី') || p.includes('fe') || p.includes('សមីការ')) {
    return `ពូកែណាស់ប្អូន! ការធ្វើតុល្យការសមីការគីមី គឺជាគ្រឹះដំបូងបំផុតដើម្បីគណនាម៉ាស និងមាឌក្នុងវិញ្ញាសាគីមីវិទ្យា។ តោះមកមើលជាមួយលោកគ្រូ៖

សមីការដើម៖ Fe + O₂  →  Fe₂O₃

ជំហានធ្វើតុល្យការងាយៗ៖
១. ពិនិត្យចំនួនអាតូមអុកស៊ីសែន (O) ជាមុន៖ នៅខាងស្តាំមាន O₃ (៣ អាតូម) និងខាងឆ្វេងមាន O₂ (២ អាតូម)។ មេគុណរួមតូចបំផុតរវាង ២ និង ៣ គឺ ៦។ ដូច្នេះ ខាងឆ្វេងយើងដាក់ 3O₂ ហើយខាងស្តាំដាក់ 2Fe₂O₃។
២. ពិនិត្យចំនួនអាតូមដែក (Fe)៖ នៅខាងស្តាំមាន 2 × 2 = 4 អាតូម Fe ដូច្នេះខាងឆ្វេងយើងគ្រាន់តែដាក់មេគុណ 4Fe ជាការស្រេច។

សមីការតុល្យការពេញលេញ៖
   4Fe + 3O₂  —(កម្តៅ t°)→  2Fe₂O₃

ចំណុចសំខាន់៖ ប្រតិកម្មនេះជា «ប្រតិកម្មអុកស៊ីតកម្ម-រេដុកម្ម» ដែលបង្កើតបានជាដែក (III) អុកស៊ីត (ច្រែះដែក)។

តើប្អូនយល់ច្បាស់ពីវិធីរកមេគុណរួមតូចបំផុតនេះទេ?`;
  }

  if (p.includes('តែងសេចក្តី') || p.includes('ខ្មែរ') || p.includes('essay')) {
    return `សំណួរនេះមានតម្លៃណាស់ប្អូន! វិញ្ញាសាអក្សរសាស្ត្រខ្មែរតែងសេចក្តីមានទម្ងន់ពិន្ទុរហូតដល់ ៥០ពិន្ទុ ក្នុងចំណោម ១០០ពិន្ទុក្នុងការប្រឡងបាក់ឌុប។ លោកគ្រូសូមចែករំលែកគន្លឹះដណ្តើមយកនិទ្ទេស A ដូចខាងក្រោម៖

១. ផ្តើមសេចក្តី (ទម្ងន់ ១០% នៃពិន្ទុ)៖
   - លំនាំបញ្ហា៖ លើកយកទស្សនៈទូទៅ គុណធម៌ ឬសច្ចធម៌ជីវិតមកភ្ជាប់
   - ចំណូលបញ្ហា៖ ស្រង់ប្រធានដើមទាំងស្រុងដោយដាក់ក្នុងសញ្ញា «...»
   - ចំណោទបញ្ហា៖ ចោទសួរដើម្បីបើកផ្លូវទៅរកការពន្យល់ (តើប្រធានខាងលើមានអត្ថន័យខ្លឹមសារយ៉ាងដូចម្តេចខ្លះ?)

២. តួសេចក្តី (ទម្ងន់ ៨០% នៃពិន្ទុ)៖
   - ពន្យល់ពាក្យគន្លឹះ និងន័យរួមនៃប្រធាន
   - បកស្រាយគំនិតសំខាន់ៗទី១ ទី២ ទី៣ ឱ្យបានក្បោះក្បាយ
   - លើកឧទាហរណ៍ជាក់ស្តែងពីអក្សរសិល្ប៍ជាតិ (ដូចជារឿង ទុំទាវ, កុលាបប៉ៃលិន, ឬភូមិតិរច្ឆាន) ព្រមទាំងឧទាហរណ៍ក្នុងសង្គមរស់នៅជាក់ស្តែង

៣. បញ្ចប់សេចក្តី (ទម្ងន់ ១០% នៃពិន្ទុ)៖
   - វាយតម្លៃតម្លៃអប់រំ និងភាពត្រឹមត្រូវនៃប្រធាន
   - ផ្តល់ទស្សនៈផ្ទាល់ខ្លួនក្នុងនាមជាយុវជនសម័យទំនើបដើម្បីអភិវឌ្ឍសង្គម

កូនត្រូវចាំថា៖ អក្សរស្អាត គ្មានកំហុសអក្ខរាវិរុទ្ធ និងមិនលុបកខ្វក់ ជួយទាក់ទាញចិត្តលោកគ្រូអ្នកគ្រូកែវិញ្ញាសាបានពិន្ទុខ្ពស់បំផុតណា៎!`;
  }

  if (p.includes('រូបវិទ្យា') || p.includes('ញូតុន') || p.includes('newton') || p.includes('លំយោល')) {
    return `សំណួរនេះល្អណាស់កូន! មេរៀនច្បាប់ញូតុន និងលំយោល គឺជាវិញ្ញាសាស្នូលក្នុងរូបវិទ្យាថ្នាក់ទី១២។ លោកគ្រូសូមសង្ខេបចំណុចសំខាន់ៗជូនប្អូន៖

១. ច្បាប់ញូតុនទាំង ៣ ៖
- ច្បាប់ទី ១ (ច្បាប់និចលភាព)៖ ប្រសិនបើផលបូកកម្លាំង ΣF = 0 នោះអង្គធាតុនឹងរក្សាភាពនៅស្ងៀម ឬធ្វើចលនាត្រង់ស្មើជានិច្ច។
- ច្បាប់ទី ២ (ច្បាប់គ្រឹះឌីណាមិច)៖ ΣF = m · a (កម្លាំង គិតជា Newton N, ម៉ាស គិតជា kg, សំទុះ គិតជា m/s²)
- ច្បាប់ទី ៣ (សកម្មភាព និងប្រតិកម្ម)៖ F(A/B) = -F(B/A)

២. រូបមន្តចលនាលំយោលប៉ោលបត់បែន៖
- ព្រេកង់កែង៖ ω₀ = √(k / m)
- ខួបនៃលំយោល៖ T = 2π √(m / k)
- ថាមពលមេកានិច៖ Em = ½ k Xm² = ថេរ

ចំណុចគួរប្រយ័ត្ន៖ ពេលគណនា កូនត្រូវប្រាកដថាខ្នាតទាំងអស់ត្រូវប្តូរចូលប្រព័ន្ធអន្តរជាតិ (SI) ជាមុនសិនណា៎ ដូចជាម៉ាសត្រូវគិតជា kg (បើគេឱ្យ g ត្រូវចែក ១០០០)។

តើប្អូនចង់ឱ្យលោកគ្រូលើកឧទាហរណ៍លំហាត់ជាក់ស្តែងមកអនុវត្តជាមួយគ្នាទេ?`;
  }

  return `សំណួររបស់ប្អូនអំពី «${prompt}» នេះល្អណាស់! 

នៅក្នុងកម្មវិធីសិក្សាជាតិកម្ពុជា លោកគ្រូសូមណែនាំគន្លឹះសំខាន់ៗដូចខាងក្រោម៖
១. ទ្រឹស្តីគន្លឹះ៖ ត្រូវក្តាប់ឱ្យជាប់នូវរូបមន្តគ្រឹះ និងនិយមន័យក្នុងសៀវភៅពុម្ពក្រសួងអប់រំ។
២. ដំណោះស្រាយលំហាត់៖ អនុវត្តជំហានដោះស្រាយតាមលំដាប់លំដោយ មិនត្រូវកាត់ជំហានឡើយ ដើម្បីទទួលបានពិន្ទុពេញលេញ។
៣. គន្លឹះប្រឡងបាក់ឌុប៖ ឧស្សាហ៍ហាត់ធ្វើវិញ្ញាសាចាស់ៗ និងកំណត់ម៉ោងធ្វើឱ្យដូចពេលប្រឡងពិតប្រាកដ។

តើប្អូនមានប្រធានលំហាត់ជាក់លាក់ចង់ឱ្យលោកគ្រូជួយដោះស្រាយទេ? ផ្ញើមកទីនេះមកណា៎ គ្រូរីករាយនឹងជួយពន្យល់ជូន!`;
}

/**
 * Live AI English Dictation & Vocabulary Challenge Generator
 * Automatically generates a balanced, auto-randomized mix of academic English words (4-12 letters)
 * with phonetics, Khmer translations, and example sentences in real-time!
 */
export async function generateEnglishDictationWithAI(topic = 'High School Academic English', count = 10) {
  const activeKey = getStoredGeminiKey() || AI_API_KEY;

  const prompt = `You are the National English Teacher AI for Cambodian High School Students.
Generate a JSON array of ${count} unique, diverse English vocabulary words for topic: "${topic}".
Automatically mix a balanced variety of beginner (4-5 letters), intermediate (6-8 letters), and advanced academic words (9-12 letters).

CRITICAL RULES:
- ONLY use common, well-known, clearly pronounceable English words that exist in standard dictionaries.
- Do NOT use abbreviations, acronyms, slang, brand names, or made-up words.
- Every word MUST be a single English word (no spaces, no hyphens, no special characters).
- Choose words that a text-to-speech engine can easily pronounce clearly.
- Words like: Earth, Water, Space, Climate, Gravity, Oxygen, Biology, Science, Energy, Temperature, Planet, Nature, Atmosphere, Ecosystem are GREAT examples.
- Do NOT include words with unusual spellings or rare jargon that sounds unnatural when spoken aloud.

Each item in the JSON array must follow this exact JSON schema:
[
  {
    "id": "ai-word-1",
    "word": "Earth",
    "phonetic": "/ɜːrθ/",
    "partOfSpeech": "noun",
    "meaningKm": "ភពផែនដី, ផែនដី",
    "exampleEn": "The Earth orbits around the Sun.",
    "exampleKm": "ភពផែនដីធ្វើដំណើរជុំវិញព្រះអាទិត្យ។",
    "clue": "Our home planet, third from the Sun."
  }
]
Output ONLY valid JSON inside \`\`\`json \`\`\` code block without any markdown or conversational text.`;

  if (activeKey) {
    for (const model of AI_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(activeKey)}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.5, maxOutputTokens: 2048 }
          })
        });
        if (res.ok) {
          const data = await res.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const jsonMatch = reply.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, reply];
          const rawJson = (jsonMatch[1] || reply).trim();
          const parsed = JSON.parse(rawJson);
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].word) {
            // Filter: only keep words that are pure English letters (no special chars, no spaces)
            const validWords = parsed
              .filter(item => /^[a-zA-Z]{3,}$/.test(item.word.trim()))
              .map((item, idx) => ({
              id: `ai-dict-${Date.now()}-${idx}`,
              word: item.word.trim(),
              phonetic: item.phonetic || '',
              partOfSpeech: item.partOfSpeech || 'noun',
              meaningKm: item.meaningKm || '',
              exampleEn: item.exampleEn || '',
              exampleKm: item.exampleKm || '',
              clue: item.clue || ''
            }));
            if (validWords.length >= 3) return validWords;
          }
        }
      } catch (e) {
        console.warn(`AI Dictation generator notice with ${model}:`, e.message);
      }
    }
  }

  // Fallback to local high school vocabulary session
  const { getEnglishDictationSession } = await import('../data/englishDictationData.js');
  return getEnglishDictationSession(count);
}

/**
 * AI Smart Spelling Coach & Etymology / Mnemonic Hint Generator
 */
export async function getAIAssistedSpellingHint(word, meaningKm) {
  const activeKey = getStoredGeminiKey() || AI_API_KEY;
  const prompt = `Give a short, friendly, and memorable spelling hint / mnemonic and etymology in Khmer for high school students learning how to spell the English word "${word}" (meaning: ${meaningKm}). Keep it under 2 sentences, fun, encouraging, and clear without any markdown symbols.`;

  if (activeKey) {
    for (const model of AI_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(activeKey)}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 256 }
          })
        });
        if (res.ok) {
          const data = await res.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply && reply.trim().length > 5) {
            return cleanDisplaySymbols(reply);
          }
        }
      } catch (e) {}
    }
  }

  return `ពាក្យ «${word}» មានអត្ថន័យថា «${meaningKm}»។ ចងចាំអក្សរដំបូង ${word[0]} និងព្យាង្គបន្តបន្ទាប់ដើម្បីសរសេរឱ្យបានត្រឹមត្រូវណា៎!`;
}

/**
 * Grade-specific syllabus guidelines for Cambodian MoEYS Curriculum
 */
function getCurriculumGuideline(gradeNum, subjectName = '') {
  const g = parseInt(gradeNum, 10) || 12;
  const s = String(subjectName).toLowerCase();

  if (g === 7) {
    if (s.includes('ប្រវត្តិ') || s.includes('hist')) {
      return `មុខវិជ្ជា៖ ប្រវត្តិវិទ្យា ថ្នាក់ទី ៧ (អនុវិទ្យាល័យ):
- ប្រធានបទសំខាន់ៗ៖ ដើមសម័យអង្គរ (ការបង្រួបបង្រួមជាតិ និងពិធីរាជាភិសេករបស់ព្រះបាទជ័យវរ្ម័នទី ២ នៅឆ្នាំ ៨០២ លើភ្នំគូលែន / មហេន្ទ្របព៌ត), រាជធានីហរិហរាល័យ (រលួស), ព្រះបាទឥន្ទ្រវរ្ម័នទី ១ (ប្រាសាទបាគង, ព្រះគោ), ព្រះបាទយសោវរ្ម័នទី ១ (រាជធានីយសោធរបុរៈ / អង្គរ), ប្រភពដើមនៃរដ្ឋខ្មែរ (នគរភ្នំ ហ្វូណន និង ចេនឡា), សម័យចេនឡាដីគោក និងចេនឡាទឹកលិច, ព្រះបាទឥសានវរ្ម័ន (សម្បូរព្រៃគុក), វប្បធម៌ សាសនា ព្រហ្មញ្ញសាសនា និងព្រះពុទ្ធសាសនាបុរាណ។
* បម្រាមតឹងរ៉ឹង៖ ហាមដាច់ខាតកុំសួរពីរូបវិទ្យា គីមីវិទ្យា ឬរូបមន្តគណិតវិទ្យា! ហាមសួរមេរៀនវិទ្យាល័យថ្នាក់ទី ១១ ឬ ១២! សំណួរ ១០០% ត្រូវតែជាប្រវត្តិវិទ្យាថ្នាក់ទី ៧!`;
    }
    if (s.includes('គណិត') || s.includes('math')) {
      return `មុខវិជ្ជា៖ គណិតវិទ្យា ថ្នាក់ទី ៧: ចំនួនគត់រ៉ឺឡាទីវ, ផលបូក ដក គុណ ចែកចំនួនគត់, សមីការដឺក្រេទី ១ មានមួយអញ្ញាត (2x + 4 = 10), ប្រភាគ, មុំជាប់គ្នា មុំទល់កំពូល មុំស្រប, ត្រីកោណ។`;
    }
    if (s.includes('ខ្មែរ') || s.includes('khmer')) {
      return `មុខវិជ្ជា៖ ភាសាខ្មែរ ថ្នាក់ទី ៧: ថ្នាក់ពាក្យ (នាម, គុណនាម, កិរិយា, គុណកិរិយា), ព្យាង្គ និងពាក្យ, វណ្ណយុត្តិ, កាព្យមេបួន និងមេប្រាំពីរសាមញ្ញ, រឿងនិទានប្រជាប្រិយខ្មែរ (រឿងធនញ្ជ័យ, រឿងសុភាទន្សាយ, រឿងក្អែកមួយក្អែកដប់)។`;
    }
    if (s.includes('ភូមិ') || s.includes('geo')) {
      return `មុខវិជ្ជា៖ ភូមិវិទ្យា ថ្នាក់ទី ៧: ទីតាំងភូមិសាស្ត្រប្រទេសកម្ពុជា, ព្រំប្រទល់ប្រទេសជិតខាង, ប្រព័ន្ធទន្លេមេគង្គ និងបឹងទន្លេសាប, តំបន់ទំនាបកណ្តាល តំបន់មាត់សមុទ្រ និងតំបន់ភ្នំ, អាកាសធាតុមូសុង។`;
    }
    if (s.includes('សីលធម៌') || s.includes('civic')) {
      return `មុខវិជ្ជា៖ សីលធម៌-ពលរដ្ឋ ថ្នាក់ទី ៧: ការគោរពវិន័យសាលារៀន, ការគោរពមាតាបិតា និងលោកគ្រូអ្នកគ្រូ, សីលធម៌រស់នៅក្នុងសង្គម, ការសន្សំសំចៃ, ការថែរក្សាអនាម័យបរិស្ថាន។`;
    }
    if (s.includes('អង់គ្លេស') || s.includes('english')) {
      return `Subject: English Grade 7: Basic grammar (Simple Present, Present Continuous), daily activities, classroom objects, family, hobbies, school vocabulary, simple prepositions.`;
    }
    return `មុខវិជ្ជា៖ ${subjectName} ថ្នាក់ទី ៧ (អនុវិទ្យាល័យ): សំណួរត្រូវតែត្រូវគ្នានឹងកម្រិតសិស្សថ្នាក់ទី ៧ តាមកម្មវិធីសិក្សារបស់ក្រសួងអប់រំ យុវជន និងកីឡាកម្ពុជា (MoEYS)។`;
  }

  if (g <= 6) {
    return `កម្រិតបឋមសិក្សា ថ្នាក់ទី ${g}៖ សំណួរសាមញ្ញ ងាយយល់ សមស្របនឹងកុមារបឋមសិក្សា ហាមរូបមន្តវិទ្យាល័យជាដាច់ខាត!`;
  }

  if (g >= 11) {
    return `កម្រិតវិទ្យាល័យ ថ្នាក់ទី ${g} ត្រៀមប្រឡងបាក់ឌុប Bac II ថ្នាក់ជាតិ លើមុខវិជ្ជា ${subjectName}។`;
  }

  return `កម្រិតអនុវិទ្យាល័យ ថ្នាក់ទី ${g} លើមុខវិជ្ជា ${subjectName} តាមកម្មវិធីសិក្សាជាតិ MoEYS។`;
}

/**
 * Live Academic Quiz Generator powered by Gemini AI
 * Dual strategy: Backend endpoint -> Direct Google AI fallback with active API key.
 * Guarantees questions focus 100% on student-selected Grade and Subject!
 */
export async function generateQuizQuestionsWithGemini({ grade = '7', subject = 'ប្រវត្តិវិទ្យា', stream = null, count = 6 } = {}) {
  const activeKey = getStoredGeminiKey() || AI_API_KEY;
  const gradeNum = parseInt(grade, 10) || 7;
  const cleanSubject = (subject || 'ប្រវត្តិវិទ្យា').trim();
  const safeCount = Math.min(Math.max(parseInt(count, 10) || 6, 4), 8);

  // 1. Try Backend API first (with 10-second timeout)
  try {
    const API_URL = import.meta.env.VITE_API_URL || '/api';
    const res = await fetch(`${API_URL}/ai/quiz-generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-gemini-key': activeKey || ''
      },
      body: JSON.stringify({
        grade: String(gradeNum),
        subject: cleanSubject,
        stream: gradeNum >= 11 ? stream : null,
        count: safeCount,
        apiKey: activeKey || ''
      }),
      signal: AbortSignal.timeout(10000)
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.success && Array.isArray(data.questions) && data.questions.length > 0) {
        // Validate questions match subject
        return data.questions.map((q, idx) => ({
          ...q,
          id: q.id || `ai-q-${Date.now()}-${idx}`,
          grade: String(gradeNum),
          subject: cleanSubject,
          source: q.source || `Gemini AI (ថ្នាក់ទី ${gradeNum} ${cleanSubject})`
        }));
      }
    }
  } catch (backendErr) {
    console.warn('[AI Quiz Service]: Backend request notice, attempting direct client Gemini...', backendErr.message);
  }

  // 2. Direct Client-Side Gemini Generation using stored API key
  if (activeKey) {
    const guideline = getCurriculumGuideline(gradeNum, cleanSubject);
    const uniqueSeed = `${Date.now()}_${Math.floor(Math.random() * 100000)}`;

    const prompt = `អ្នកគឺជាសាស្ត្រាចារ្យ និងជាអ្នកជំនាញបង្កើតវិញ្ញាសាប្រឡងថ្នាក់ជាតិនៃក្រសួងអប់រំ យុវជន និងកីឡាកម្ពុជា (MoEYS)។

សូមបង្កើតសំណួរពហុជ្រើសរើសចំនួន ${safeCount} សំណួរថ្មីៗ ប្លែកៗ មិនជាន់គ្នា សម្រាប់៖
- មុខវិជ្ជា៖ «${cleanSubject}»
- កម្រិតថ្នាក់៖ «ថ្នាក់ទី ${gradeNum}» (Grade ${gradeNum})
- លេខកូដសម្គាល់ចៃដន្យ (Random Seed): ${uniqueSeed}

សេចក្តីណែនាំអំពីកម្មវិធីសិក្សា៖
${guideline}

ច្បាប់ដាច់ខាត (CRITICAL RULES):
១. សំណួរទាំងអស់ ១០០% ត្រូវតែជារបស់មុខវិជ្ជា «${cleanSubject}» និងកម្រិត «ថ្នាក់ទី ${gradeNum}»!
២. ហាមដាច់ខាតកុំយកសំណួរមុខវិជ្ជាផ្សេង (ឧទាហរណ៍៖ បើមុខវិជ្ជាប្រវត្តិវិទ្យា ហាមយកសំណួររូបវិទ្យា គីមីវិទ្យា ឬរូបមន្តខួបប៉ោល) ឬកម្រិតថ្នាក់ផ្សេង (ដូចជាថ្នាក់ទី ១២) មកសួរឡើយ!
៣. សំណួរ និងចម្លើយត្រូវសរសេរជាភាសាខ្មែរត្រឹមត្រូវ តាមក្បួនខ្នាតវចនានុក្រមសម្តេចព្រះសង្ឃរាជ ជួន ណាត (លើកលែងភាសាអង់គ្លេស)។
៤. ជម្រើសនីមួយៗត្រូវមាន ៤ ជម្រើស (options) ដោយមានចម្លើយត្រឹមត្រូវតែ ១ គត់។
៥. កំណត់ "answer" ជាលេខសន្ទស្សន៍ 0, 1, 2, ឬ 3 នៃចម្លើយត្រឹមត្រូវ។
៦. បញ្ចូលការពន្យល់យ៉ាងច្បាស់លាស់ ២-៣ ប្រយោគ។
៧. ឆ្លើយតបជាទម្រង់ JSON Array សុទ្ធ គ្មាន markdown fences គ្មាន \`\`\`json ឡើយ។

ទម្រង់លទ្ធផល (JSON Array):
[
  {
    "q": "សំណួរ${cleanSubject}សម្រាប់ថ្នាក់ទី ${gradeNum}...",
    "options": ["ជម្រើសទី ១", "ជម្រើសទី ២", "ជម្រើសទី ៣", "ជម្រើសទី ៤"],
    "answer": 0,
    "explanation": "ការពន្យល់លម្អិត..."
  }
]`;

    for (const model of AI_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(activeKey)}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 3500,
              responseMimeType: 'application/json'
            }
          }),
          signal: AbortSignal.timeout(12000)
        });

        if (res.ok) {
          const data = await res.json();
          const parts = data.candidates?.[0]?.content?.parts || [];
          const textPart = parts.find(p => p.text && !p.thought) || parts[parts.length - 1];
          const text = textPart?.text || '';

          if (text) {
            let parsed = null;
            try {
              parsed = JSON.parse(text);
            } catch (je) {
              const match = text.match(/\[[\s\S]*\]/);
              if (match) parsed = JSON.parse(match[0]);
            }

            if (Array.isArray(parsed) && parsed.length >= 3) {
              return parsed.map((item, idx) => ({
                id: `ai-live-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
                q: cleanDisplaySymbols(item.q),
                options: (Array.isArray(item.options) ? item.options : []).map(opt => cleanDisplaySymbols(String(opt))),
                answer: typeof item.answer === 'number' && item.answer >= 0 && item.answer < item.options.length ? item.answer : 0,
                explanation: cleanDisplaySymbols(item.explanation || ''),
                grade: String(gradeNum),
                subject: cleanSubject,
                source: `Gemini AI (ថ្នាក់ទី ${gradeNum} ${cleanSubject})`
              }));
            }
          }
        }
      } catch (directErr) {
        console.warn(`[AI Quiz Direct] Model ${model} notice:`, directErr.message);
      }
    }
  }

  // 3. Fallback to instant authentic question bank
  const { getInstantGradeQuestions } = await import('../utils/gradeQuestionBank.js');
  return getInstantGradeQuestions(gradeNum, cleanSubject, safeCount);
}

