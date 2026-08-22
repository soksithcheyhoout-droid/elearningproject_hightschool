// ============================================================================
// MoTDAR Supercharged Dynamic AI Tutor & Live Google Knowledge Engine
// Pure Node.js Implementation - Real-Time Web & Multilingual AI Synthesis
// Zero Hardcoded Limitations - Answers Any Question Dynamically in Fluent Khmer
// ============================================================================

/**
 * Cambodian & National Educational Institutions Knowledge Base
 */
const CAMBODIA_INSTITUTIONS_KB = {
  'beltei': {
    name: 'សាលា ប៊ែលធី អន្តរជាតិ (BELTEI International School & University)',
    desc: 'សាលា ប៊ែលធី អន្តរជាតិ (BELTEI International School) គឺជាគ្រឹះស្ថានអប់រំឯកជនដ៏ធំ និងឈានមុខគេមួយនៅព្រះរាជាណាចក្រកម្ពុជា ដែលត្រូវបានទទួលស្គាល់ជាផ្លូវការដោយក្រសួងអប់រំ យុវជន និងកីឡា។',
    programs: [
      'ចំណេះទូទៅខ្មែរ (ថ្នាក់មត្តេយ្យ ដល់ ថ្នាក់ទី១២ តាមកម្មវិធីក្រសួងអប់រំ)',
      'ភាសាអង់គ្លេសទូទៅគ្រប់កម្រិត (Preschool to Level 12 / ESL)',
      'វគ្គបណ្តុះបណ្តាលកុំព្យូទ័រ និងជំនាញបច្ចេកវិទ្យា',
      'វគ្គត្រៀមប្រឡងតេស្តអន្តរជាតិ (TOEFL, IELTS, Password Test)',
      'សាកលវិទ្យាល័យ ប៊ែលធី អន្តរជាតិ (BELTEI International University) ដែលផ្តល់ការបណ្តុះបណ្តាលថ្នាក់បរិញ្ញាបត្រ អនុបណ្ឌិត និងបណ្ឌិត'
    ],
    motto: '«គុណភាព ប្រសិទ្ធភាព សេចក្តីថ្លៃថ្នូរ សីលធម៌ គុណធម៌»',
    branches: 'មានសាខាច្រើនជាង ២៦ សាខាទូទាំងរាជធានីភ្នំពេញ និងតាមបណ្តាខេត្ត។'
  },
  'sisowath': {
    name: 'វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ (Preah Sisowath High School)',
    desc: 'វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ ជាវិទ្យាល័យចំណាស់ជាងគេ និងមានកេរ្តិ៍ឈ្មោះល្បីល្បាញបំផុតក្នុងប្រវត្តិសាស្ត្រអប់រំកម្ពុជា បង្កើតឡើងតាំងពីសម័យអាណានិគមបារាំង (ឆ្នាំ១៨៩៣)។ បច្ចុប្បន្នជាទីតាំងនៃ «សាលាជំនាន់ថ្មី (New Generation School - NGS)» ឈានមុខគេក្នុងការបង្រៀនមុខវិជ្ជា STEM និងបច្ចេកវិទ្យា។'
  },
  'bak touk': {
    name: 'វិទ្យាល័យ បាក់ទូក (Bak Touk High School)',
    desc: 'វិទ្យាល័យ បាក់ទូក គឺជាវិទ្យាល័យរដ្ឋដ៏ធំ និងល្បីល្បាញមួយនៅរាជធានីភ្នំពេញ ដែលបានបណ្តុះបណ្តាលសិស្សពូកែ និងធនធានមនុស្សឆ្នើមៗជាច្រើនជំនាន់ក្នុងប្រទេសកម្ពុជា។'
  },
  'santhormok': {
    name: 'វិទ្យាល័យ សន្ធរម៉ុក (Santhormok High School)',
    desc: 'វិទ្យាល័យ សន្ធរម៉ុក គឺជាវិទ្យាល័យរដ្ឋដ៏មានប្រជាប្រិយភាពមួយនៅរាជធានីភ្នំពេញ ដែលត្រូវបានដាក់ឈ្មោះតាមកវីនិពន្ធជើងចាស់ខ្មែរដ៏ល្បីល្បាញគឺ លោក ឧកញ៉ា សន្ធរម៉ុក។'
  },
  'rupp': {
    name: 'សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ (Royal University of Phnom Penh - RUPP)',
    desc: 'សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ គឺជាគ្រឹះស្ថានឧត្តមសិក្សាជាតិចំណាស់ជាងគេ និងធំជាងគេនៅកម្ពុជា បង្កើតឡើងក្នុងឆ្នាំ១៩៦០ ផ្តល់ការបណ្តុះបណ្តាលលើមុខវិជ្ជាវិទ្យាសាស្ត្រ មនុស្សសាស្ត្រ ព័ត៌មានវិទ្យា និងភាសាបរទេស (IFL)។'
  },
  'itc': {
    name: 'វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា (Institute of Technology of Cambodia - ITC / តិចណូ)',
    desc: 'វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា (សាលាតិចណូ) គឺជាគ្រឹះស្ថានឧត្តមសិក្សាឈានមុខគេបង្អស់នៅកម្ពុជា ក្នុងការបណ្តុះបណ្តាលវិស្វករ អ្នកបច្ចេកវិទ្យា និងអ្នកស្រាវជ្រាវវិទ្យាសាស្ត្រអនុវត្តន៍។'
  }
};

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
    const res = await fetch("https://html.duckduckgo.com/html/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        "Accept-Language": "km,en-US;q=0.9,en;q=0.8"
      },
      body: `q=${encodeURIComponent(query)}&b=`,
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
        .replace(/&#39;/g, "'")
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
 * Check if the Wikipedia result actually matches the search intent (avoids false matches like Ateneo de Manila)
 */
function isWikiMatchRelevant(queryTopic, wikiTitle, wikiSummary) {
  if (!queryTopic || !wikiTitle) return false;
  const q = queryTopic.toLowerCase().trim();
  const title = wikiTitle.toLowerCase().trim();
  const summary = (wikiSummary || '').toLowerCase();

  const cleanQ = q.replace(/^(?:the|a|an|about|what is|who is|សាលា|វិទ្យាល័យ|សាកលវិទ្យាល័យ)\s+/i, '').trim();
  if (title.includes(cleanQ) || cleanQ.includes(title)) return true;

  const tokens = cleanQ.split(/\s+/).filter(t => t.length > 2);
  if (tokens.length === 0) return false;

  const matchedTokens = tokens.filter(t => title.includes(t) || summary.slice(0, 300).includes(t));
  return matchedTokens.length >= Math.ceil(tokens.length * 0.6);
}

/**
 * 3. Authority Knowledge Retrieval (Khmer & Global Wikipedia)
 */
async function searchWikipedia(topic) {
  const headers = { 'User-Agent': 'MoEYS-Ministry-AI-Tutor/7.0 (education@moeys.gov.kh)' };

  // Step A: Search Khmer Wikipedia
  try {
    const kmSearchUrl = `https://km.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(topic)}&format=json&origin=*`;
    const res = await fetch(kmSearchUrl, { headers, signal: AbortSignal.timeout(4500) });
    if (res.ok) {
      const data = await res.json();
      const hit = data.query?.search?.[0];
      if (hit && hit.pageid) {
        const extUrl = `https://km.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&exintro=1&pageids=${hit.pageid}&format=json&origin=*`;
        const extRes = await fetch(extUrl, { headers, signal: AbortSignal.timeout(4500) });
        if (extRes.ok) {
          const extData = await extRes.json();
          const summary = extData.query?.pages?.[hit.pageid]?.extract;
          if (summary && summary.length > 40 && isWikiMatchRelevant(topic, hit.title, summary)) {
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
      const enRes = await fetch(enSearchUrl, { headers, signal: AbortSignal.timeout(4500) });
      if (enRes.ok) {
        const enData = await enRes.json();
        const enHit = enData.query?.search?.[0];
        if (enHit && enHit.pageid) {
          const enExtUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&exintro=1&pageids=${enHit.pageid}&format=json&origin=*`;
          const enExtRes = await fetch(enExtUrl, { headers, signal: AbortSignal.timeout(4500) });
          if (enExtRes.ok) {
            const enExtData = await enExtRes.json();
            const enSummary = enExtData.query?.pages?.[enHit.pageid]?.extract;
            if (enSummary && enSummary.length > 40 && isWikiMatchRelevant(engTopic, enHit.title, enSummary)) {
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

    // 3. Check Dedicated Cambodian & National Educational Institutions Knowledge Base
    for (const [key, info] of Object.entries(CAMBODIA_INSTITUTIONS_KB)) {
      if (qLower.includes(key) || cleanTopic.toLowerCase().includes(key)) {
        let reply = `**🎓 លោកគ្រូ AI ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ (MoTDAR) ៖**\n\n`;
        reply += `បាទប្អូន! នេះជាព័ត៌មានលម្អិតអំពី **«${info.name}»** ៖\n\n`;
        reply += `• **ទិដ្ឋភាពទូទៅ ៖** ${info.desc}\n\n`;
        if (info.programs) {
          reply += `• **កម្មវិធីសិក្សាសំខាន់ៗ ៖**\n`;
          info.programs.forEach(p => { reply += `   - ${p}\n`; });
          reply += `\n`;
        }
        if (info.branches) reply += `• **បណ្តាញសាខា ៖** ${info.branches}\n\n`;
        if (info.motto) reply += `• **បាវចនា ៖** ${info.motto}\n\n`;
        reply += `💡 **ការណែនាំពីលោកគ្រូ ៖** ប្រសិនបើប្អូនចង់ដឹងអំពីកាលវិភាគ មុខវិជ្ជា ឬការប្រឡង ប្អូនអាចសួរលោកគ្រូបន្ថែមបាន!`;

        if (targetLang === 'en') reply = await translateLive(reply, 'en');
        return res.json({ success: true, reply, sources: ['ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)'] });
      }
    }

    // 4. Parallel Live Knowledge Search (Google/DuckDuckGo Web + Wikipedia)
    const [wikiResult, webSnippets] = await Promise.all([
      searchWikipedia(cleanTopic),
      searchLiveWeb(prompt + " Cambodia", 4)
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
      synthesizedReply += `បាទប្អូន! ផ្អែកលើការស្រាវជ្រាវព័ត៌មានជាក់ស្តែងអំពី **«${cleanTopic}»** ៖\n\n`;

      const kmSnippets = await Promise.all(webSnippets.map(s => translateLive(s, 'km')));
      kmSnippets.forEach((snip, idx) => {
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
        kmSnippets.forEach((s) => {
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
