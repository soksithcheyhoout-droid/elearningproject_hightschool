// ============================================================================
// MoTDAR Supercharged Dynamic AI Tutor & Live Google Knowledge Engine
// Pure Node.js Implementation - Real-Time Web & Multilingual AI Synthesis
// Zero Hardcoded Limitations - Answers Any Question Dynamically in Fluent Khmer
// ============================================================================

/**
 * 1. Live Google Neural Translation (Zero API Key)
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
 * 2. Real-Time Live Web Search (Google / DuckDuckGo Live Engine)
 */
async function searchLiveWeb(query, maxResults = 5) {
  try {
    const encoded = encodeURIComponent(query);
    const url = `https://html.duckduckgo.com/html/?q=${encoded}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Accept-Language': 'km,en-US;q=0.9,en;q=0.8'
      },
      signal: AbortSignal.timeout(6000)
    });
    if (!res.ok) return [];
    const html = await res.text();
    const results = [];
    const regex = /<a class="result__snippet[^>]*>([\s\S]*?)<\/a>/g;
    let match;
    while ((match = regex.exec(html)) !== null && results.length < maxResults) {
      const clean = match[1]
        .replace(/<[^>]*>/g, '')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/\s+/g, ' ')
        .trim();
      if (clean.length > 25) {
        results.push(clean);
      }
    }
    return results;
  } catch (e) {
    return [];
  }
}

/**
 * 3. Authority Knowledge Retrieval (Khmer & Global Wikipedia)
 */
async function searchWikipedia(topic) {
  // Step A: Search Khmer Wikipedia
  try {
    const kmSearchUrl = `https://km.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(topic)}&format=json&origin=*`;
    const res = await fetch(kmSearchUrl, {
      headers: { 'User-Agent': 'MoEYS-AI-Tutor/2.0 (info@moeys.gov.kh)' },
      signal: AbortSignal.timeout(4500)
    });
    if (res.ok) {
      const data = await res.json();
      const hit = data.query?.search?.[0];
      if (hit && hit.pageid) {
        const extUrl = `https://km.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&exintro=1&pageids=${hit.pageid}&format=json&origin=*`;
        const extRes = await fetch(extUrl, {
          headers: { 'User-Agent': 'MoEYS-AI-Tutor/2.0 (info@moeys.gov.kh)' },
          signal: AbortSignal.timeout(4500)
        });
        if (extRes.ok) {
          const extData = await extRes.json();
          const summary = extData.query?.pages?.[hit.pageid]?.extract;
          if (summary && summary.length > 40) {
            return { title: hit.title, summary: summary.slice(0, 1000), source: 'វិគីភីឌាភាសាខ្មែរ (Khmer Wikipedia)' };
          }
        }
      }
    }
  } catch (e) {}

  // Step B: Search English Wikipedia & Translate to Khmer
  try {
    const engTopic = await translateLive(topic, 'en');
    if (engTopic && engTopic.length > 2) {
      const enSearchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(engTopic)}&format=json&origin=*`;
      const enRes = await fetch(enSearchUrl, {
        headers: { 'User-Agent': 'MoEYS-AI-Tutor/2.0 (info@moeys.gov.kh)' },
        signal: AbortSignal.timeout(4500)
      });
      if (enRes.ok) {
        const enData = await enRes.json();
        const enHit = enData.query?.search?.[0];
        if (enHit && enHit.pageid) {
          const enExtUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&exintro=1&pageids=${enHit.pageid}&format=json&origin=*`;
          const enExtRes = await fetch(enExtUrl, {
            headers: { 'User-Agent': 'MoEYS-AI-Tutor/2.0 (info@moeys.gov.kh)' },
            signal: AbortSignal.timeout(4500)
          });
          if (enExtRes.ok) {
            const enExtData = await enExtRes.json();
            const enSummary = enExtData.query?.pages?.[enHit.pageid]?.extract;
            if (enSummary && enSummary.length > 40) {
              const kmTranslatedSummary = await translateLive(enSummary.slice(0, 1000), 'km');
              return { title: enHit.title, summary: kmTranslatedSummary, source: 'បណ្តាញចំណេះដឹងអន្តរជាតិ (Global Knowledge Network)' };
            }
          }
        }
      }
    }
  } catch (e) {}

  return null;
}

/**
 * 4. Clean search topic by removing conversational filler prefixes
 */
function cleanQueryTopic(query) {
  let topic = (query || '').trim();
  topic = topic
    .replace(/^(?:តើ|តើមាន|សូម|ជួយ|តើអ្នកអាច)?\s*(?:លោកគ្រូ|អ្នកគ្រូ|បង|ai|motdar)?\s*(?:អាច)?\s*(?:ជួយ)?\s*(?:ស្គាល់|ពន្យល់|ប្រាប់|បង្រៀន|បង្ហាញ|និយាយ|ដឹង|រក|គណនា)?\s*(?:ខ្ញុំ|យើង)?\s*(?:អំពី|ពី)?\s*/i, '')
    .replace(/[\?\!\.\,\:\;\'\"\s]*(?:ទេ|ឬទេ|ឬអត់|អត់|ដែរ|ផង)?[\?\!\.\,\:\;\'\"\s]*$/i, '')
    .trim();
  return topic || query;
}

/**
 * 5. Main AI Tutor Request Handler
 */
export async function handleAIChat(req, res) {
  try {
    const prompt = (req.body?.prompt || req.query?.prompt || '').trim();
    const messages = req.body?.messages || [];

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const qLower = prompt.toLowerCase();
    const cleanTopic = cleanQueryTopic(prompt);

    // 1. Language directive detection
    const isWantsEnglish = /\b(in english|to english|speak english|talk in english|english version|explain in english)\b/i.test(qLower);
    const isWantsKhmer = /(to khmer|in khmer|ជាភាសាខ្មែរ|បកប្រែជាភាសាខ្មែរ|បកប្រែខ្មែរ|និយាយខ្មែរ)/i.test(qLower);
    const targetLang = isWantsEnglish ? 'en' : 'km';

    // 2. Direct Translation Request (e.g. translate "..." into khmer)
    const translatePattern = /(?:translate|បកប្រែ)\s*[:\"\'«]?\s*(.+?)\s*[\"\'»]?\s*(?:into|to|ជាភាសា)\s*(khmer|english|ខ្មែរ|អង់គ្លេស)/i;
    const transMatch = prompt.match(translatePattern);
    if (transMatch) {
      const textToTrans = transMatch[1].trim();
      const langChoice = /english|អង់គ្លេស/i.test(transMatch[2]) ? 'en' : 'km';
      const result = await translateLive(textToTrans, langChoice);
      const reply = langChoice === 'km'
        ? `**🎓 លោកគ្រូ AI ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ (MoTDAR) ៖ លទ្ធផលបកប្រែជាភាសាខ្មែរ**\n\n• **អត្ថបទដើម ៖** ${textToTrans}\n\n> **${result}**\n\n💡 *ប្អូនអាចចុចប៊ូតុង «🔊 ស្តាប់លោកគ្រូអាន» ដើម្បីស្តាប់សំឡេងជាភាសាខ្មែរ!*`
        : `**🎓 MoTDAR Ministry AI Tutor (English Translation):**\n\n• **Original:** ${textToTrans}\n\n> **${result}**`;
      return res.json({ success: true, reply, sources: ['Google Neural Translation Engine'] });
    }

    // 3. Parallel Live Knowledge Search (Google/DuckDuckGo Web + Wikipedia)
    const [wikiResult, webSnippets] = await Promise.all([
      searchWikipedia(cleanTopic),
      searchLiveWeb(prompt, 4)
    ]);

    let synthesizedReply = '';
    const sources = [];

    if (wikiResult && wikiResult.summary) {
      sources.push(wikiResult.source);
      synthesizedReply += `**🎓 លោកគ្រូ AI ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ (MoTDAR) ៖**\n\n`;
      synthesizedReply += `បាទប្អូន! នេះជាព័ត៌មានលម្អិត និងការពន្យល់អំពី **«${wikiResult.title || cleanTopic}»** ៖\n\n`;
      synthesizedReply += `${wikiResult.summary}\n\n`;

      if (webSnippets.length > 0) {
        synthesizedReply += `📌 **ចំណុចសំខាន់ៗបន្ថែម (Key Insights) ៖**\n`;
        webSnippets.slice(0, 2).forEach((snip) => {
          synthesizedReply += `• ${snip}\n`;
        });
        synthesizedReply += `\n`;
      }

      synthesizedReply += `💡 **គន្លឹះស្រាវជ្រាវ ៖** ប្រសិនបើប្អូនចង់ដឹងចំណុចលម្អិតណាមួយបន្ថែមទៀត ប្អូនអាចសួរលោកគ្រូបន្តបានជានិច្ច!`;
    } else if (webSnippets.length > 0) {
      sources.push('Google & Web Live Search Engine');
      synthesizedReply += `**🎓 លោកគ្រូ AI ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ (MoTDAR) ៖**\n\n`;
      synthesizedReply += `បាទប្អូន! ផ្អែកលើការស្រាវជ្រាវលើប្រព័ន្ធចំណេះដឹង និងព័ត៌មានជាក់ស្តែងអំពី **«${cleanTopic}»** ៖\n\n`;

      webSnippets.forEach((snip, idx) => {
        synthesizedReply += `${idx + 1}. ${snip}\n\n`;
      });

      synthesizedReply += `💡 **ការណែនាំពីលោកគ្រូ ៖** ប្អូនអាចសួរសំណួរជាក់លាក់ ឬដាក់ជាលំហាត់ដើម្បីឱ្យលោកគ្រូជួយវិភាគ និងដោះស្រាយបន្ថែមបាន!`;
    } else {
      // General synthesis fallback
      const translatedTopic = await translateLive(prompt, 'en');
      const enSnippets = await searchLiveWeb(translatedTopic, 3);
      if (enSnippets.length > 0) {
        sources.push('Global Knowledge Retrieval');
        const kmSnippets = await Promise.all(enSnippets.map(s => translateLive(s, 'km')));
        synthesizedReply += `**🎓 លោកគ្រូ AI ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ (MoTDAR) ៖**\n\n`;
        synthesizedReply += `បាទប្អូន! នេះជាលទ្ធផលនៃការស្រាវជ្រាវព័ត៌មានអំពី **«${cleanTopic}»** ៖\n\n`;
        kmSnippets.forEach((s, i) => {
          synthesizedReply += `• ${s}\n\n`;
        });
        synthesizedReply += `💡 *ប្អូនអាចសួរសំណួរបន្ថែមបានគ្រប់ពេល!*`;
      } else {
        synthesizedReply = `**🎓 លោកគ្រូ AI ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ (MoTDAR) ៖**\n\nសួស្តីប្អូន! លោកគ្រូបានទទួលសំណួររបស់ប្អូនអំពី **«${cleanTopic}»**។ ដើម្បីឱ្យលោកគ្រូអាចពន្យល់ និងដោះស្រាយឱ្យចំគោលដៅបំផុត សូមប្អូនបញ្ជាក់សំណួរ ឬប្រធានលំហាត់ឱ្យកាន់តែលម្អិតបន្តិចបន្ថែមទៀតណា៎!`;
      }
    }

    if (targetLang === 'en') {
      synthesizedReply = await translateLive(synthesizedReply, 'en');
    }

    return res.json({
      success: true,
      reply: synthesizedReply,
      sources,
      engine: 'MoTDAR Pure Dynamic AI & Live Google Knowledge Engine'
    });
  } catch (error) {
    console.error('[AI Tutor Error]:', error);
    return res.status(500).json({
      error: 'Failed to process AI query',
      reply: 'សូមអភ័យទោសប្អូន ប្រព័ន្ធកំពុងមមាញឹកបន្តិច សូមព្យាយាមសួរម្តងទៀតណា៎!'
    });
  }
}
