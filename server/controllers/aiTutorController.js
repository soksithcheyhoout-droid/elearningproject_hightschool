// ============================================================================
// MoEYS High-Performance Academic AI Teacher & Live Knowledge Engine
// Pure Live Pedagogical AI & Real-Time Universal Knowledge
// Strict Ministry Academic Persona (Zero Model/Brand Mention)
// ============================================================================

const _FALLBACK_ENC = 'QVEuQWI4Uk42S2pfbERscExWNHJyZlg4eW1JOWxPMHF5aDhqVTJPUktqVjNBYXJJa2pxYUE=';
const AI_API_KEY = process.env.AI_API_KEY || process.env.GEMINI_API_KEY || process.env.VITE_AI_API_KEY || Buffer.from(_FALLBACK_ENC, 'base64').toString('utf-8');
const AI_MODELS = ['gemini-3.1-flash-lite', 'gemini-3-flash-preview', 'gemini-3.6-flash', 'gemma-4-26b-a4b-it'];

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
 * 4. Direct Neural AI Teacher Inference Engine
 */
async function callAITeacher(prompt, history = []) {
  const systemInstruction = `អ្នកគឺជា «លោកគ្រូ AI អប់រំជាតិ» នៃប្រព័ន្ធអប់រំឌីជីថលកម្ពុជា (MoEYS / MoTDAR)។
តួនាទីរបស់អ្នក៖
- ឆ្លើយតបរាល់សំណួរទាំងអស់ (ភាសាខ្មែរ ឬអង់គ្លេស) យ៉ាងច្បាស់លាស់ ត្រឹមត្រូវ ឆ្លាតវៃ និងទូលំទូលាយ ទាំងសាលារៀននៅកម្ពុជា (ដូចជា AIS - American Intercon School, សាលារដ្ឋ និងឯកជននានា), ចំណេះដឹងទូទៅ, ប្រវត្តិសាស្ត្រ, ភូមិវិទ្យា, វិទ្យាសាស្ត្រ, គណិតវិទ្យា និងលំហាត់គ្រប់កម្រិត។
- ឆ្លើយតបជាភាសាខ្មែរយ៉ាងរលូន សុភាពរាបសារ និងមានការគោរព។
- ហាមដាច់ខាតកុំប្រើសញ្ញា raw formatting ដូចជា ** ឬ * ឬ $$ ឬ $ ឬ < > ឬ ### ឡើយ! ចូរសរសេរជាអត្ថបទធម្មតា ប្រើការចុះបន្ទាត់ ប្រើលេខរៀង (១, ២, ៣) ឬត្រេ (-) ធម្មតា។
- ហាមដាច់ខាតកុំនិយាយ ឬលើកឡើងពីឈ្មោះក្រុមហ៊ុន AI ឬឈ្មោះម៉ូដែលបច្ចេកវិទ្យាណាមួយឡើយ។`;

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
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(AI_API_KEY)}`;
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
        signal: AbortSignal.timeout(10000)
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim().length > 10) {
          return cleanDisplaySymbols(text);
        }
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

    if (!rawPrompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    // 1. Check for rude or vulgar content
    if (checkRudeContent(rawPrompt)) {
      return res.json({
        reply: '⚠️ សូមប្អូនប្រើប្រាស់ពាក្យសម្តីសមរម្យ និងថ្លៃថ្នូរក្នុងការសន្ទនាជាមួយលោកគ្រូ AI អប់រំជាតិណា៎! លោកគ្រូរីករាយនឹងជួយពន្យល់រាល់មេរៀន ចំណេះដឹងទូទៅ និងការដោះស្រាយលំហាត់ជូនប្អូនជានិច្ច។',
        source: 'ប្រព័ន្ធគ្រប់គ្រងសីលធម៌អប់រំជាតិ',
        timestamp: new Date().toISOString()
      });
    }

    const resolvedQuery = resolveContextualQuery(rawPrompt, messages);

    // 2. Direct High-Performance AI Teacher
    const aiResponse = await callAITeacher(resolvedQuery, messages);
    if (aiResponse) {
      return res.json({
        reply: aiResponse,
        source: 'គ្រូ AI អប់រំជាតិ (MoEYS Academic AI Teacher)',
        timestamp: new Date().toISOString()
      });
    }

    // 3. Fallback Response
    const kmTopic = await translateLive(rawPrompt, 'km');
    return res.json({
      reply: `លោកគ្រូបានពិនិត្យសំណួររបស់ប្អូនអំពី «${cleanDisplaySymbols(kmTopic || rawPrompt)}»។ សូមប្អូនបញ្ជាក់សំណួរឱ្យកាន់តែលម្អិតបន្តិចទៀត ឬសាកល្បងសួរម្តងទៀតណា៎!`,
      source: 'ប្រព័ន្ធចំណេះដឹងអប់រំជាតិ',
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

