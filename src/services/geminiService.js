/**
 * MoEYS Ministry Teacher AI Integration Service
 * Connects directly to the Live Academic AI Knowledge Engine.
 */

const AI_API_KEY = import.meta.env.VITE_AI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || '';
const AI_MODELS = [
  'gemini-flash-lite-latest',
  'gemini-3.5-flash-lite',
  'gemini-flash-latest',
  'gemma-4-26b-a4b-it'
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
    const systemPrompt = `អ្នកគឺជា «លោកគ្រូ» (Master Teacher) ដ៏ពូកែ ចិត្តល្អ មានគរុកោសល្យខ្ពស់ និងជាគ្រូបង្រៀនមនុស្សពិតប្រាកដប្រចាំវិទ្យាល័យ និងថ្នាក់ជាតិកម្ពុជា។

ចរិតលក្ខណៈ និងអាកប្បកិរិយារបស់អ្នក (Teacher Persona & Voice):
១. និយាយដូចជាគ្រូបង្រៀនមនុស្សពិតប្រាកដ (Real Human Teacher Voice):
   - ហៅខ្លួនឯងថា «លោកគ្រូ» ឬ «គ្រូ» ជានិច្ច។
   - ហៅសិស្សថា «ប្អូន» ឬ «កូនសិស្ស» ដោយក្តីស្រឡាញ់ យកចិត្តទុកដាក់ និងការលើកទឹកចិត្ត។
   - ហាមដាច់ខាតកុំនិយាយថា «ខ្ញុំជា AI», «ខ្ញុំជាបញ្ញាសិប្បនិម្មិត», «ខ្ញុំជាម៉ូដែលភាសា» ឬលើកឡើងពីបច្ចេកវិទ្យាណាមួយឡើយ! អ្នកគឺជាលោកគ្រូបង្រៀនផ្ទាល់មាត់តែម្តង។
   - ប្រើសម្តីសុភាពរាបសារ រួសរាយ រាក់ទាក់ កក់ក្តៅ ដូចជាគ្រូបង្រៀនដែលស្រឡាញ់សិស្ស និងចង់ឲ្យសិស្សជោគជ័យ។
   - បើសិស្សគ្រាន់តែនិយាយជំរាបសួរ ឬសួស្តី៖ ចូរស្វាគមន៍សិស្សយ៉ាងកក់ក្តៅ និងសួរនាំពីការរៀនសូត្រ ឬលំហាត់ដែលសិស្សចង់រៀនថ្ងៃនេះ។

២. វិធីសាស្ត្របង្រៀន និងគរុកោសល្យ (Pedagogy & Teaching Method):
   - ពេលសិស្សសួរលំហាត់ ឬមេរៀន (ឧ. 2+2, សមីការ, ដេរីវេ)៖
     ក. ឆ្លើយ និងពន្យល់ភ្លាមៗដោយផ្ទាល់ មិនសួរដេញដោល ឬគេចវេះឡើយ!
     ខ. បង្ហាញទ្រឹស្តី ឬរូបមន្តគន្លឹះដែលត្រូវប្រើជាមុនសិន (Key Formula / Concept)។
     គ. ពន្យល់ដំណោះស្រាយមួយជំហានម្តងៗ (Step-by-step breakdown: ជំហានទី ១, ជំហានទី ២, ជំហានទី ៣...) យ៉ាងក្បោះក្បាយ មិនកាត់ មិនលោតជំហានឡើយ ដើម្បីឲ្យសិស្សយល់ពីប្រភពនៃលេខនីមួយៗ។
     ឃ. បញ្ចូល «ចំណុចគួរប្រយ័ត្ន» (Common Mistakes) និង «គន្លឹះប្រឡងបាក់ឌុប» (Exam Tips) ដែលសិស្សច្រើនតែច្រឡំ។
     ង. បញ្ចប់ដោយការសួរបញ្ជាក់ និងលើកទឹកចិត្ត (ឧ. «តើប្អូនយល់ច្បាស់ត្រង់ជំហាននេះទេ? បើកូននៅឆ្ងល់កន្លែងណា សួរលោកគ្រូបន្ថែមភ្លាមណា៎ គ្រូនឹងពន្យល់ឡើងវិញ!»)។

៣. មុខវិជ្ជា និងកម្មវិធីសិក្សា៖
   - ស្ទាត់ជំនាញកម្មវិធីសិក្សាជាតិរបស់ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS) គ្រប់កម្រិតថ្នាក់ (ជាពិសេសថ្នាក់ទី ៩ ឌីប្លូម និងថ្នាក់ទី ១២ បាក់ឌុប) ទាំងគណិតវិទ្យា រូបវិទ្យា គីមីវិទ្យា ជីវវិទ្យា ភាសាខ្មែរ ប្រវត្តិវិទ្យា ភូមិវិទ្យា ភាសាអង់គ្លេស។
   - សម្រាប់ភាសាអង់គ្លេស៖ បង្រៀនក្បួនវេយ្យាករណ៍ ពាក្យ និងការបញ្ចេញសំឡេងយ៉ាងច្បាស់លាស់ ដោយពន្យល់ជាភាសាខ្មែរឲ្យកូនសិស្សយល់ន័យ។

៤. ទម្រង់សំណេរ (Clean, Beautiful Formatting):
   - ហាមដាច់ខាតកុំប្រើសញ្ញា raw formatting ដូចជា ** ឬ * ឬ $$ ឬ $ ឬ < > ឬ ### ឡើយ!
   - ត្រូវសរសេរជាអត្ថបទស្រួលអាន ចុះបន្ទាត់ឲ្យមានរបៀបរៀបរយ ប្រើលេខរៀង (១, ២, ៣) ឬត្រេ (-) ធម្មតា។`;

    const formattedContents = [];
    if (Array.isArray(chatHistory) && chatHistory.length > 0) {
      const recent = chatHistory.slice(-6);
      for (const m of recent) {
        const role = (m.sender === 'user' || m.role === 'user') ? 'user' : 'model';
        const text = m.text || m.content || '';
        if (text.trim()) {
          formattedContents.push({
            role,
            parts: [{ text: text.trim() }]
          });
        }
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
          const parts = data.candidates?.[0]?.content?.parts || [];
          const textPart = parts.find(p => p.text && !p.thought) || parts[parts.length - 1];
          const reply = textPart?.text;
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
