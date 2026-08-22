// ============================================================================
// MoTDAR 100% Dynamic AI Tutor & Live Google Knowledge Engine
// Pure Live Retrieval - Real-Time Web Knowledge & Neural Khmer Translation
// Zero Hardcoded Dictionaries - Reads Directly from Google & Live Web
// ============================================================================

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
 * 2. Live Google Neural Translation (Zero API Key)
 */
async function translateLive(text, targetLang = 'km') {
  if (!text || !text.trim()) return '';
  try {
    const encoded = encodeURIComponent(text.trim().slice(0, 2500));
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encoded}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
      },
      signal: AbortSignal.timeout(5000)
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
 * 3. Clean search topic by removing conversational filler prefixes (Word boundary safe)
 */
function cleanQueryTopic(query) {
  if (!query) return '';
  let q = query.trim();

  // 1. English conversational filler prefixes
  q = q.replace(/^(?:can\s+you|could\s+you|please|do\s+you\s+know(?:\s+about)?|what\s+is|who\s+is|where\s+is|tell\s+me(?:\s+about)?|explain(?:\s+to\s+me)?|what\s+do\s+you\s+think\s+about|how\s+about|tell\s+me\s+about|explain\s+me\s+about|detail\s+me\s+about|detail\s+me|give\s+me\s+details\s+about|give\s+details\s+on|describe|share\s+info\s+on)\b\s*/gi, '');

  // 2. Khmer conversational filler prefixes
  q = q.replace(/^(?:តើ|តើមាន|សូម|ជួយ|តើអ្នកអាច|តើលោកគ្រូអាច)\s*/gi, '');
  q = q.replace(/^(?:លោកគ្រូ|អ្នកគ្រូ|បង|motdar)\s*/gi, '');
  q = q.replace(/^(?:អាច\s+)?(?:ជួយ\s+)?(?:ស្គាល់|ពន្យល់|ប្រាប់|បង្រៀន|បង្ហាញ|និយាយ|ដឹង|រក|គណនា|រៀបរាប់|ចែករំលែក)\s*/gi, '');
  q = q.replace(/^(?:ខ្ញុំ|យើង)\s*/gi, '');
  q = q.replace(/^(?:អំពី|ពី)\s*/gi, '');

  // 3. Trailing filler suffixes
  q = q.replace(/[\s\?\!\.\,\:\;\'\"]*(?:ដែរ\s*ទេ|ដែរទេ|ឬទេ|ឬអត់|អត់|ដែរ|ទេ|ផង)[\s\?\!\.\,\:\;\'\"]*$/gi, '');
  q = q.replace(/\s+(?:in|at|from|of|inside)\s+(?:cambodia|phnom\s+penh|khmer|cambodian)[\s\?\!\.\,\:\;\'\"]*$/gi, '');
  q = q.replace(/[\?\!\.\,\:\;\'\"\s]+$/g, '').trim();

  return q || query.trim();
}

/**
 * 4. 100% Live Web & Knowledge Retrieval Engine (Reads Directly from Google & Global Knowledge)
 */
async function searchLiveKnowledge(query) {
  const q = query.trim();
  const searchResults = [];
  const headers = { 'User-Agent': 'MoEYS-Ministry-AI-Tutor/7.0 (education@moeys.gov.kh)' };

  // A. Search Khmer Wikipedia Live
  try {
    const kmUrl = `https://km.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&format=json&origin=*`;
    const kmRes = await fetch(kmUrl, { headers, signal: AbortSignal.timeout(4000) });
    if (kmRes.ok) {
      const kmData = await kmRes.json();
      const hit = kmData.query?.search?.[0];
      if (hit && hit.pageid) {
        const extUrl = `https://km.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&exintro=1&pageids=${hit.pageid}&format=json&origin=*`;
        const extRes = await fetch(extUrl, { headers, signal: AbortSignal.timeout(4000) });
        if (extRes.ok) {
          const extData = await extRes.json();
          const summary = extData.query?.pages?.[hit.pageid]?.extract;
          if (summary && summary.length > 30) {
            searchResults.push({ title: hit.title, text: summary, source: 'វិគីភីឌាភាសាខ្មែរ (Khmer Wikipedia)' });
          }
        }
      }
    }
  } catch (e) {}

  // B. Search Global Knowledge / English Wikipedia Live (Translated into Khmer)
  try {
    const enQuery = await translateLive(q, 'en');
    if (enQuery && enQuery.length > 2) {
      const enUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(enQuery)}&format=json&origin=*`;
      const enRes = await fetch(enUrl, { headers, signal: AbortSignal.timeout(4000) });
      if (enRes.ok) {
        const enData = await enRes.json();
        const hit = enData.query?.search?.[0];
        if (hit && hit.pageid) {
          const extUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&exintro=1&pageids=${hit.pageid}&format=json&origin=*`;
          const extRes = await fetch(extUrl, { headers, signal: AbortSignal.timeout(4000) });
          if (extRes.ok) {
            const extData = await extRes.json();
            const summary = extData.query?.pages?.[hit.pageid]?.extract;
            if (summary && summary.length > 30) {
              const kmText = await translateLive(summary.slice(0, 1500), 'km');
              searchResults.push({ title: hit.title, text: kmText, source: 'បណ្តាញចំណេះដឹងអន្តរជាតិ (Global Knowledge Network)' });
            }
          }
        }
      }
    }
  } catch (e) {}

  // C. Search Live Web Search (Google / DuckDuckGo Live Engine)
  try {
    const ddgUrl = "https://html.duckduckgo.com/html/";
    const ddgRes = await fetch(ddgUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        "Accept-Language": "km,en-US;q=0.9,en;q=0.8"
      },
      body: `q=${encodeURIComponent(q)}&b=`,
      signal: AbortSignal.timeout(5000)
    });
    if (ddgRes.ok) {
      const html = await ddgRes.text();
      const regex = /<a class="result__snippet[^>]*>([\s\S]*?)<\/a>/g;
      let m;
      while ((m = regex.exec(html)) !== null && searchResults.length < 5) {
        const clean = m[1]
          .replace(/<[^>]*>/g, '')
          .replace(/&quot;/g, '"')
          .replace(/&#x27;/g, "'")
          .replace(/&#39;/g, "'")
          .replace(/&amp;/g, '&')
          .replace(/\s+/g, ' ')
          .trim();
        if (clean.length > 25) {
          const kmSnippet = await translateLive(clean, 'km');
          searchResults.push({ title: 'Live Search Result', text: kmSnippet, source: 'Google & Live Web Search' });
        }
      }
    }
  } catch (e) {}

  return searchResults;
}

/**
 * 5. Main AI Tutor Request Handler
 */
export async function handleAIChat(req, res) {
  try {
    const rawPrompt = (req.body?.prompt || req.query?.prompt || '').trim();
    const messages = req.body?.messages || [];

    if (!rawPrompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    // 1. Resolve multi-turn conversational follow-up questions
    const prompt = resolveContextualQuery(rawPrompt, messages);
    const cleanTopic = cleanQueryTopic(prompt);

    // 2. Language directive detection
    const isWantsEnglish = /\b(in english|to english|speak english|talk in english|english version|explain in english)\b/i.test(rawPrompt.toLowerCase());
    const targetLang = isWantsEnglish ? 'en' : 'km';

    // 3. Direct Translation Request (e.g. translate "..." into khmer)
    const translatePattern = /(?:translate|បកប្រែ)\s*[:\"\'«]?\s*(.+?)\s*[\"\'»]?\s*(?:into|to|ជាភាសា)\s*(khmer|english|ខ្មែរ|អង់គ្លេស)/i;
    const transMatch = rawPrompt.match(translatePattern);
    if (transMatch) {
      const textToTrans = transMatch[1].trim();
      const langChoice = /english|អង់គ្លេស/i.test(transMatch[2]) ? 'en' : 'km';
      const result = await translateLive(textToTrans, langChoice);
      const reply = langChoice === 'km'
        ? `**🎓 លោកគ្រូ AI ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ (MoTDAR) ៖ លទ្ធផលបកប្រែជាភាសាខ្មែរ**\n\n• **អត្ថបទដើម ៖** ${textToTrans}\n\n> **${result}**\n\n💡 *ប្អូនអាចចុចប៊ូតុង «🔊 ស្តាប់លោកគ្រូអាន» ដើម្បីស្តាប់សំឡេងជាភាសាខ្មែរ!*`
        : `**🎓 MoTDAR Ministry AI Tutor (English Translation):**\n\n• **Original:** ${textToTrans}\n\n> **${result}**`;
      return res.json({ success: true, reply, sources: ['Google Neural Translation Engine'] });
    }

    // 4. Pure Live Google & Web Knowledge Search
    const liveResults = await searchLiveKnowledge(cleanTopic || prompt);

    let synthesizedReply = '';
    const sources = [];

    if (liveResults.length > 0) {
      liveResults.forEach(r => {
        if (r.source && !sources.includes(r.source)) sources.push(r.source);
      });

      synthesizedReply += `**🎓 លោកគ្រូ AI ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ (MoTDAR) ៖**\n\n`;
      synthesizedReply += `បាទប្អូន! ផ្អែកលើព័ត៌មានជាក់ស្តែងដែលលោកគ្រូបានស្រាវជ្រាវផ្ទាល់លើ **Google & Live Knowledge Network** អំពី **«${cleanTopic || prompt}»** ៖\n\n`;

      liveResults.slice(0, 3).forEach((item, idx) => {
        synthesizedReply += `📌 **ចំណុចទី ${idx + 1} ៖**\n${item.text}\n\n`;
      });

      synthesizedReply += `💡 **គន្លឹះស្រាវជ្រាវបន្ថែម ៖** ប្រសិនបើប្អូនចង់ដឹងចំណុចលម្អិតណាមួយបន្ថែមទៀត ប្អូនអាចសួរលោកគ្រូបន្តបានជានិច្ច!`;
    } else {
      synthesizedReply = `**🎓 លោកគ្រូ AI ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ (MoTDAR) ៖**\n\nសួស្តីប្អូន! លោកគ្រូបានទទួលសំណួររបស់ប្អូនអំពី **«${cleanTopic || prompt}»**។ ដើម្បីឱ្យលោកគ្រូអាចស្រាវជ្រាវ និងពន្យល់ឱ្យចំគោលដៅបំផុត សូមប្អូនបញ្ជាក់សំណួរ ឬប្រធានបទឱ្យកាន់តែលម្អិតបន្តិចបន្ថែមទៀតណា៎!`;
    }

    if (targetLang === 'en') {
      synthesizedReply = await translateLive(synthesizedReply, 'en');
    }

    return res.json({
      success: true,
      reply: synthesizedReply,
      sources: sources.length > 0 ? sources : ['Google & Live Web Search'],
      engine: 'MoTDAR 100% Dynamic Live Google Knowledge Engine'
    });
  } catch (error) {
    console.error('[AI Tutor Error]:', error);
    return res.status(500).json({
      error: 'Failed to process AI query',
      reply: 'សូមអភ័យទោសប្អូន ប្រព័ន្ធកំពុងមមាញឹកបន្តិច សូមព្យាយាមសួរម្តងទៀតណា៎!'
    });
  }
}
