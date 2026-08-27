// ============================================================================
// MoEYS High-Performance Academic AI Teacher & Live Knowledge Engine
// Pure Live Pedagogical AI & Real-Time Global Knowledge
// Strict Ministry Academic Persona (Zero Model/Brand Mention)
// ============================================================================

const AI_API_KEY = process.env.AI_API_KEY || process.env.GEMINI_API_KEY || '';
const AI_MODELS = ['gemini-3-flash-preview', 'gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemma-4-26b-a4b-it'];

/**
 * 1. Multi-Turn Conversation Memory Resolver
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
 * 2. Direct Neural AI Teacher Inference Engine
 */
async function callAITeacher(prompt, history = []) {
  const systemInstruction = `អ្នកគឺជា «លោកគ្រូ AI អប់រំជាតិ» នៃប្រព័ន្ធអប់រំឌីជីថលកម្ពុជា (MoEYS / MoTDAR)។
តួនាទីរបស់អ្នក៖
- ឆ្លើយតបជាភាសាខ្មែរយ៉ាងរលូន សុភាពរាបសារ និងច្បាស់លាស់ជាមួយសិស្សានុសិស្ស។
- សម្រាប់មុខវិជ្ជាវិទ្យាសាស្ត្រ (គណិត, រូប, គីមី, ជីវវិទ្យា)៖ បង្ហាញរូបមន្ត ជំហានគណនាលម្អិត និងសេចក្តីសន្និដ្ឋានត្រឹមត្រូវ ១០០%។
- សម្រាប់មុខវិជ្ជាសង្គម (អក្សរសាស្ត្រ, ប្រវត្តិ, ភូមិ, ពលរដ្ឋ)៖ ពន្យល់កាលបរិច្ឆេទ ព្រឹត្តិការណ៍ ចលនាអក្សរសិល្ប៍ និងច្បាប់ឱ្យបានស៊ីជម្រៅ។
- ប្រើប្រាស់ Markdown (ចំណងជើង, តារាង, បញ្ជី, LaTeX Formulas $$...$$) ដើម្បីឱ្យអានងាយយល់ និងមានរបៀបរៀបរយ។
- ហាមដាច់ខាតកុំនិយាយ ឬលើកឡើងពីឈ្មោះក្រុមហ៊ុន AI ឬឈ្មោះម៉ូដែលបច្ចេកវិទ្យាណាមួយឡើយ។ តាំងខ្លួនជាគ្រូបង្រៀនអប់រំជាតិសុទ្ធសាធ។`;

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
          return text.trim();
        }
      }
    } catch (err) {
      console.warn(`[AI Teacher] Model ${modelName} notice:`, err.message);
    }
  }
  return null;
}

/**
 * 3. Live Google Neural Translation (Fallback Helper)
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
 * 4. Main AI Tutor Request Handler
 */
export async function handleAIChat(req, res) {
  try {
    const rawPrompt = (req.body?.prompt || req.query?.prompt || '').trim();
    const messages = req.body?.messages || req.body?.history || [];

    if (!rawPrompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const resolvedQuery = resolveContextualQuery(rawPrompt, messages);

    // 1. First Priority: Direct High-Performance AI Teacher
    const aiResponse = await callAITeacher(resolvedQuery, messages);
    if (aiResponse) {
      return res.json({
        reply: aiResponse,
        source: 'គ្រូ AI អប់រំជាតិ (MoEYS Academic AI Teacher)',
        timestamp: new Date().toISOString()
      });
    }

    // 2. Fallback Response
    const kmTopic = await translateLive(rawPrompt, 'km');
    return res.json({
      reply: `**🎓 លោកគ្រូ AI អប់រំជាតិ ៖**\n\nបាទប្អូន! ចំពោះប្រធានបទ «**${kmTopic || rawPrompt}**» លោកគ្រូសូមលើកទឹកចិត្តឱ្យប្អូនពិនិត្យមើលសៀវភៅពុម្ពក្រសួង និងមេរៀនថ្នាក់ទី ១០-១២។ សូមសាកល្បងសួរម្តងទៀតណា៎!`,
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

