// ============================================================================
// MoEYS High-Performance Academic AI Teacher & Live Knowledge Engine
// Pure Live Pedagogical AI & Real-Time Universal Knowledge
// Strict Ministry Academic Persona (Zero Model/Brand Mention)
// ============================================================================

const _FALLBACK_ENC = 'QVEuQWI4Uk42S2pfbERscExWNHJyZlg4eW1JOWxPMHF5aDhqVTJPUktqVjNBYXJJa2pxYUE=';
const AI_API_KEY = process.env.AI_API_KEY || process.env.GEMINI_API_KEY || process.env.VITE_AI_API_KEY || Buffer.from(_FALLBACK_ENC, 'base64').toString('utf-8');
const AI_MODELS = [
  'gemini-flash-lite-latest',
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-3.1-flash-lite',
  'gemini-3.8-flash',
  'gemini-3.6-flash'
];

/**
 * 1. Rude / Vulgar / Abusive Content Filter (Khmer & English)
 */
function checkRudeContent(text) {
  if (!text) return false;
  const t = text.toLowerCase();
  const rudePatterns = [
    /\b(fuck|shit|bitch|asshole|dick|pussy|bastard|cunt|slut|whore|stfu|idiot|retard)\b/i,
    /ចុយ|ក្ដ|ក្ដរ|មីចុយ|អាក្ដ|អាឆ្កែ|អាងាប់|អាឡប់|មីឆ្កែ|មីសំផឹង|ងាប់ទៅ|ចោរម្សៀត|អាភ្លើ|អាល្ងង់/i
  ];
  return rudePatterns.some(pattern => pattern.test(t));
}

/**
 * 2. Clean raw markdown symbols (*, $, **, etc.) and format math without destroying inequalities (<, >)
 */
function cleanDisplaySymbols(text) {
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

/**
 * 3. Direct Neural AI Teacher Inference Engine (Powered by Google Gemini API)
 */
async function callAITeacher(prompt, history = [], customKey = null) {
  const keyToUse = (customKey && typeof customKey === 'string' && customKey.trim().length > 10) ? customKey.trim() : AI_API_KEY;
  const systemInstruction = `អ្នកគឺជា «លោកគ្រូបង្រៀន Motdar» (Motdar Teacher / Motdar Master Teacher) ដ៏ពូកែ ចិត្តល្អ និងមានគរុកោសល្យខ្ពស់បំផុតនៃប្រព័ន្ធអប់រំ Motdar (Motdar E-Learning) ដែលស្របតាមកម្មវិធីសិក្សាជាតិរបស់ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)។

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
  if (Array.isArray(history) && history.length > 0) {
    const recent = history.slice(-6);
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

  // Gemini API requires first turn to be 'user'
  if (formattedContents.length > 0 && formattedContents[0].role === 'model') {
    formattedContents.shift();
  }

  // Append current prompt as the latest user turn
  formattedContents.push({
    role: 'user',
    parts: [{ text: prompt }]
  });

  for (const modelName of AI_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(keyToUse)}`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          contents: formattedContents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096
          }
        }),
        signal: AbortSignal.timeout(20000)
      });

      if (res.ok) {
        const data = await res.json();
        const parts = data.candidates?.[0]?.content?.parts || [];
        const text = parts.filter(p => !p.thought).map(p => p.text).filter(Boolean).join('\n') || parts[0]?.text;
        if (text && text.trim().length > 2) {
          return cleanDisplaySymbols(text);
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        console.warn(`[AI Teacher] Model ${modelName} status ${res.status}:`, errData.error?.message?.slice(0, 100));
      }
    } catch (err) {
      console.warn(`[AI Teacher] Model ${modelName} notice:`, err.message);
    }
  }
  return null;
}

/**
 * 5. Live Google Neural Translation (Fallback Helper)
 */
async function translateLive(text, targetLang = 'km') {
  if (!text || !text.trim()) return '';
  try {
    const encoded = encodeURIComponent(text.trim().slice(0, 2500));
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encoded}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      signal: AbortSignal.timeout(4000)
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data[0]) {
        return data[0].map(p => p[0]).join('');
      }
    }
  } catch (e) {}
  return text;
}

/**
 * 6. Main AI Tutor Request Handler
 */
export async function handleAIChat(req, res) {
  try {
    const rawPrompt = (req.body?.prompt || req.query?.prompt || '').trim();
    const messages = req.body?.messages || req.body?.history || [];
    const clientKey = req.body?.apiKey || req.headers?.['x-gemini-key'];

    if (!rawPrompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    // 1. Check for rude or vulgar content
    if (checkRudeContent(rawPrompt)) {
      return res.json({
        reply: '⚠️ ប្អូនសម្លាញ់! ក្នុងនាមជាសិស្សល្អ ចូរយើងប្រើប្រាស់ពាក្យសម្តីសមរម្យ និងថ្លៃថ្នូរណា៎! លោកគ្រូរីករាយនឹងជួយពន្យល់រាល់មេរៀន ចំណេះដឹងទូទៅ និងការដោះស្រាយលំហាត់ជូនប្អូនជានិច្ច។',
        source: 'លោកគ្រូបង្រៀន Motdar',
        timestamp: new Date().toISOString()
      });
    }

    // 2. Direct High-Performance AI Teacher
    const aiResponse = await callAITeacher(rawPrompt, messages, clientKey);
    if (aiResponse) {
      return res.json({
        reply: aiResponse,
        source: 'លោកគ្រូបង្រៀន Motdar',
        timestamp: new Date().toISOString()
      });
    }

    // 3. Fallback Response
    const kmTopic = await translateLive(rawPrompt, 'km');
    return res.json({
      reply: `សំណួរអំពី «${cleanDisplaySymbols(kmTopic || rawPrompt)}» នេះល្អណាស់ប្អូន! ដើម្បីឱ្យលោកគ្រូអាចពន្យល់ និងដោះស្រាយជូនកូនបានចំគោលដៅបំផុត សូមប្អូនជួយបញ្ជាក់បន្ថែមបន្តិច ឬសរសេរប្រធានលំហាត់ពេញលេញមកណា៎ គ្រូរីករាយនឹងជួយពន្យល់ជូន!`,
      source: 'លោកគ្រូបង្រៀន Motdar',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[AI Tutor Controller Error]:', error);
    return res.status(500).json({
      reply: 'សូមអភ័យទោស ប្រព័ន្ធគ្រូ AI កំពុងមមាញឹកបន្តិច សូមសាកល្បងសួរម្តងទៀតនៅបន្តិចក្រោយណា៎!',
      error: error.message
    });
  }
}

