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
  'gemini-flash-latest',
  'gemma-4-26b-a4b-it'
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
 * 2. Clean raw markdown symbols (*, $, <, >, **, etc.)
 */
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

/**
 * 3. Multi-Turn Conversation Memory Resolver
 */
function resolveContextualQuery(currentPrompt, history = []) {
  const q = (currentPrompt || '').trim().toLowerCase();
  const pronouns = ['it', 'they', 'he', 'she', 'him', 'her', 'its', 'their', 'that', 'this', 'there', 'who is', 'where is', 'how many', 'who founded', 'founder', 'details', 'detail', 'វា', 'គាត់', 'នោះ', 'នេះ', 'ហ្នឹង', 'ចុះ', 'ស្ថាបនិក'];

  const isShort = q.split(/\s+/).length <= 6;
  const hasPronoun = pronouns.some(p => new RegExp(`\\b${p}\\b`, 'i').test(q) || q.includes(p));
  const isFollowup = /tell\s+me\s+more|how\s+about|what\s+else|more\s+details|detail\s+me|and\s+then|ប្រាប់បន្ថែម|មានអ្វីទៀត|ចុះ|ហើយ|តទៅ/i.test(q);

  if ((isShort || hasPronoun || isFollowup) && Array.isArray(history) && history.length > 0) {
    for (let i = history.length - 1; i >= 0; i--) {
      const msg = history[i];
      const text = (msg.text || msg.content || '').trim();
      const sender = msg.sender || msg.role;
      if (sender === 'user' && text && text.toLowerCase() !== q) {
        return `${text} ${currentPrompt}`;
      }
    }
  }
  return currentPrompt;
}

/**
 * 4. Direct Neural AI Teacher Inference Engine (Powered by Google Gemini API)
 */
async function callAITeacher(prompt, history = [], customKey = null) {
  const keyToUse = (customKey && typeof customKey === 'string' && customKey.trim().length > 10) ? customKey.trim() : AI_API_KEY;
  const systemInstruction = `អ្នកគឺជា «លោកគ្រូ» (Master Teacher) ដ៏ពូកែ ចិត្តល្អ មានគរុកោសល្យខ្ពស់ និងជាគ្រូបង្រៀនមនុស្សពិតប្រាកដប្រចាំវិទ្យាល័យ និងថ្នាក់ជាតិកម្ពុជា។

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
  if (Array.isArray(history) && history.length > 0) {
    const recent = history.slice(-6);
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
    parts: [{ text: `${systemInstruction}\n\nសំណួររបស់សិស្ស៖ ${prompt}` }]
  });

  for (const modelName of AI_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(keyToUse)}`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: formattedContents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048
          }
        }),
        signal: AbortSignal.timeout(8000)
      });

      if (res.ok) {
        const data = await res.json();
        const parts = data.candidates?.[0]?.content?.parts || [];
        const textPart = parts.find(p => p.text && !p.thought) || parts[parts.length - 1];
        const text = textPart?.text;
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
        source: 'លោកគ្រូបង្រៀនគរុកោសល្យ',
        timestamp: new Date().toISOString()
      });
    }

    const resolvedQuery = resolveContextualQuery(rawPrompt, messages);

    // 2. Direct High-Performance AI Teacher (Uses Google Gemini API)
    const aiResponse = await callAITeacher(resolvedQuery, messages, clientKey);
    if (aiResponse) {
      return res.json({
        reply: aiResponse,
        source: 'លោកគ្រូបង្រៀនគរុកោសល្យ (Google Gemini)',
        timestamp: new Date().toISOString()
      });
    }

    // 3. Fallback Response
    const kmTopic = await translateLive(rawPrompt, 'km');
    return res.json({
      reply: `សំណួរអំពី «${cleanDisplaySymbols(kmTopic || rawPrompt)}» នេះល្អណាស់ប្អូន! ដើម្បីឱ្យលោកគ្រូអាចពន្យល់ និងដោះស្រាយជូនកូនបានចំគោលដៅបំផុត សូមប្អូនជួយបញ្ជាក់បន្ថែមបន្តិច ឬសរសេរប្រធានលំហាត់ពេញលេញមកណា៎ គ្រូរីករាយនឹងជួយពន្យល់ជូន!`,
      source: 'លោកគ្រូបង្រៀនគរុកោសល្យ',
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

