/**
 * MoEYS Ministry Teacher AI Integration Service
 * Connects directly to the Live Academic AI Knowledge Engine.
 */

const AI_API_KEY = import.meta.env.VITE_AI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || '';
const AI_MODELS = ['gemini-3-flash-preview', 'gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemma-4-26b-a4b-it'];

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

function cleanDisplaySymbols(text) {
  if (!text) return '';
  return text
    .replace(/\*{2,}/g, '')
    .replace(/\*/g, '')
    .replace(/\${1,2}/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/^#+\s*/gm, '')
    .replace(/^>\s*/gm, '')
    .replace(/_{2,}/g, '')
    .trim();
}

export async function askMinistryAI(userPrompt, chatHistory = []) {
  if (checkRudeContent(userPrompt)) {
    return '⚠️ សូមប្អូនប្រើប្រាស់ពាក្យសម្តីសមរម្យ និងថ្លៃថ្នូរក្នុងការសន្ទនាជាមួយលោកគ្រូ AI អប់រំជាតិណា៎! លោកគ្រូរីករាយនឹងជួយពន្យល់រាល់មេរៀន ចំណេះដឹងទូទៅ និងការដោះស្រាយលំហាត់ជូនប្អូនជានិច្ច។';
  }

  // 1. First Priority: Query Backend API endpoint /api/ai/chat
  try {
    const apiRes = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: userPrompt, messages: chatHistory })
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
  const activeKey = getStoredGeminiKey() || AI_API_KEY;
  if (activeKey) {
    const systemPrompt = `អ្នកគឺជា «លោកគ្រូ AI អប់រំជាតិ» នៃប្រព័ន្ធអប់រំឌីជីថលកម្ពុជា (MoEYS / MoTDAR)។
តួនាទីរបស់អ្នក៖
- ឆ្លើយតបរាល់សំណួរទាំងអស់ (ភាសាខ្មែរ ឬអង់គ្លេស) យ៉ាងច្បាស់លាស់ ត្រឹមត្រូវ ឆ្លាតវៃ និងទូលំទូលាយ ទាំងសាលារៀននៅកម្ពុជា (ដូចជា AIS - American Intercon School, សាលារដ្ឋ និងឯកជននានា), ចំណេះដឹងទូទៅ, ប្រវត្តិសាស្ត្រ, ភូមិវិទ្យា, វិទ្យាសាស្ត្រ, គណិតវិទ្យា និងលំហាត់គ្រប់កម្រិត។
- ឆ្លើយតបជាភាសាខ្មែរយ៉ាងរលូន សុភាពរាបសារ និងមានការគោរព។
- ហាមដាច់ខាតកុំប្រើសញ្ញា raw formatting ដូចជា ** ឬ * ឬ $$ ឬ $ ឬ < > ឬ ### ឡើយ! ចូរសរសេរជាអត្ថបទធម្មតា ប្រើការចុះបន្ទាត់ ប្រើលេខរៀង (១, ២, ៣) ឬត្រេ (-) ធម្មតា។
- ហាមដាច់ខាតកុំនិយាយ ឬលើកឡើងពីឈ្មោះក្រុមហ៊ុន AI ឬឈ្មោះម៉ូដែលបច្ចេកវិទ្យាណាមួយឡើយ។`;

    const formattedContents = [];
    if (Array.isArray(chatHistory) && chatHistory.length > 0) {
      for (const m of chatHistory.slice(-4)) {
        const role = (m.sender === 'user' || m.role === 'user') ? 'user' : 'model';
        const text = m.text || m.content || '';
        if (text) formattedContents.push({ role, parts: [{ text }] });
      }
    }
    formattedContents.push({
      role: 'user',
      parts: [{ text: `${systemPrompt}\n\nសំណួររបស់សិស្ស៖ ${userPrompt}` }]
    });

    for (const model of AI_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(activeKey)}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: formattedContents,
            generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
          })
        });
        if (res.ok) {
          const data = await res.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply && reply.trim().length > 10) {
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

  if (p.includes('ដេរីវេ') || p.includes('derivative') || p.includes('គណិត')) {
    return `**🎓 លោកគ្រូ AI ក្រសួងអប់រំ ៖ ដំណោះស្រាយលម្អិតលើរូបមន្តដេរីវេ**

១. **រូបមន្តផលចែកដេរីវេ (Quotient Rule):**
   (u / v)' = (u'v - uv') / v²

២. **អនុវត្តលើអនុគមន៍ f(x) = (2x + 1) / (x - 3) :**
- តាង u = 2x + 1  =>  u' = 2
- តាង v = x - 3   =>  v' = 1

៣. **គណនា f'(x) :**
   f'(x) = [2(x - 3) - (2x + 1)(1)] / (x - 3)²
         = [2x - 6 - 2x - 1] / (x - 3)²
         = -7 / (x - 3)²

**ចំណាំបាក់ឌុប៖** ដោយសារ (x - 3)² > 0 គ្រប់ x ≠ 3 នាំឱ្យ f'(x) < 0 ជានិច្ច ដូចនេះអនុគមន៍ចុះដាច់ខាតលើដែនកំណត់ D = ℝ \\ {3}។`;
  }

  if (p.includes('គីមី') || p.includes('fe') || p.includes('សមីការ')) {
    return `**🎓 លោកគ្រូ AI ក្រសួងអប់រំ ៖ តុល្យការសមីការគីមី**

សមីការដើម៖ Fe + O₂  →  Fe₂O₃

**ជំហានធ្វើតុល្យការ៖**
១. ពិនិត្យចំនួនអាតូមអុកស៊ីសែន៖ នៅខាងស្តាំមាន O₃ (៣ អាតូម) និងខាងឆ្វេងមាន O₂ (២ អាតូម) => មេគុណរួមតូចបំផុតគឺ ៦ => ដាក់ 3O₂ និង 2Fe₂O₃
២. ពិនិត្យចំនួនអាតូមដែក៖ ខាងស្តាំមាន 2 × 2 = 4 Fe => ខាងឆ្វេងដាក់មេគុណ 4Fe

**សមីការតុល្យការពេញលេញ៖**
   4Fe + 3O₂  —(t°)→  2Fe₂O₃

ប្រតិកម្មនេះជា **ប្រតិកម្មអុកស៊ីតកម្ម-រេដុកម្ម** និងបង្កើតបានជា **ដែក (III) អុកស៊ីត** (ច្រែះដែក)។`;
  }

  if (p.includes('តែងសេចក្តី') || p.includes('ខ្មែរ') || p.includes('essay')) {
    return `**🎓 លោកគ្រូ AI ក្រសួងអប់រំ ៖ គន្លឹះតែងសេចក្តីបែបពន្យល់កម្រិតបាក់ឌុប**

ដើម្បីសរសេរតែងសេចក្តីទទួលបាននិទ្ទេស A ក្នុងប្រឡងបាក់ឌុបជាតិ៖

១. **ផ្តើមសេចក្តី (១០% ពិន្ទុ):**
   - **លំនាំបញ្ហា៖** លើកឡើងពីទស្សនៈទូទៅ ឬសច្ចធម៌ជីវិត
   - **ចំណូលបញ្ហា៖** ស្រង់ប្រធានដើមទាំងស្រុងដាក់ក្នុង «...»
   - **ចំណោទបញ្ហា៖** ដាក់សំណួរបំផុស (តើ...យ៉ាងដូចម្តេចខ្លះ?)

២. **តួសេចក្តី (៨០% ពិន្ទុ):**
   - **ពន្យល់ពាក្យគន្លឹះ និងន័យរួមនៃប្រធាន**
   - **បកស្រាយគំនិតសំខាន់ៗទី១ ទី២ ទី៣**
   - **លើកឧទាហរណ៍ជាក់ស្តែងពីអក្សរសិល្ប៍** (រឿងទុំទាវ, កុលាបប៉ៃលិន, ភូមិតិរច្ឆាន)

៣. **បញ្ចប់សេចក្តី (១០% ពិន្ទុ):**
   - វាយតម្លៃតម្លៃអប់រំនៃប្រធាន
   - ផ្តល់មតិផ្ទាល់ខ្លួនក្នុងនាមជាយុវជនសម័យទំនើប។`;
  }

  if (p.includes('រូបវិទ្យា') || p.includes('ញូតុន') || p.includes('newton') || p.includes('លំយោល')) {
    return `**🎓 លោកគ្រូ AI ក្រសួងអប់រំ ៖ សង្ខេបមេរៀនរូបវិទ្យាថ្នាក់ទី១២**

១. **ច្បាប់ញូតុនទាំង ៣ ៖**
- ច្បាប់ទី ១ (និចលភាព)៖ ប្រសិនបើផលបូកកម្លាំង ΣF = 0 អង្គធាតុរក្សាភាពនៅស្ងៀម ឬចលនាត្រង់ស្មើ។
- ច្បាប់ទី ២ (ច្បាប់គ្រឹះឌីណាមិច)៖ ΣF = m · a
- ច្បាប់ទី ៣ (សកម្មភាព & ប្រតិកម្ម)៖ F(A/B) = -F(B/A)

២. **រូបមន្តចលនាលំយោលប៉ោលបត់បែន៖**
- ព្រេកង់កែង៖ ω₀ = √(k / m)
- ខួបនៃលំយោល៖ T = 2π √(m / k)
- ថាមពលមេកានិច៖ Em = ½ k Xm² = const`;
  }

  return `**🎓 លោកគ្រូ AI ក្រសួងអប់រំ យុវជន និងកីឡា ៖ ការឆ្លើយតបលើប្រធានបទ «${prompt}»**

បាទប្អូន! នៅក្នុងកម្មវិធីសិក្សាវិទ្យាល័យជាតិកម្ពុជា MoEYS៖
• **ទ្រឹស្តីគន្លឹះ៖** ត្រូវក្តាប់ឱ្យជាប់នូវរូបមន្តគ្រឹះ និងនិយមន័យក្នុងសៀវភៅពុម្ព។
• **ដំណោះស្រាយលំហាត់៖** អនុវត្តជំហានដោះស្រាយតាមលំដាប់លំដោយ ដើម្បីកុំឱ្យបាត់ពិន្ទុតាមដំណាក់កាល។
• **គន្លឹះប្រឡងបាក់ឌុប៖** ពិនិត្យមើលវិញ្ញាសាគំរូឆ្នាំកន្លងទៅ និងអនុវត្តឱ្យបានទៀងទាត់។`;
}
