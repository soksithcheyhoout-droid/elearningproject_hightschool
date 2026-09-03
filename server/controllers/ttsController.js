import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

// In-memory audio buffer cache for ultra-fast instant playback
const audioCache = new Map();
const MAX_CACHE_SIZE = 300;

export const HUMAN_VOICES = [
  {
    id: 'km-piseth',
    voiceName: 'km-KH-PisethNeural',
    name: 'Piseth (ពិសិដ្ឋ - គ្រូបង្រៀនបុរស)',
    gender: 'male',
    lang: 'km',
    badge: 'Khmer Human Male ⭐',
    description: 'សំឡេងមនុស្សប្រុសខ្មែរ រស់រវើក ច្បាស់ម៉ឺងម៉ាត់ បែបអប់រំ និងស្ដង់ដាជាតិ'
  },
  {
    id: 'km-sreymom',
    voiceName: 'km-KH-SreymomNeural',
    name: 'Sreymom (ស្រីមុំ - គ្រូបង្រៀននារី)',
    gender: 'female',
    lang: 'km',
    badge: 'Khmer Human Female 🌸',
    description: 'សំឡេងមនុស្សស្រីខ្មែរពិតៗ ទន់ភ្លន់ ច្បាស់លាស់ ដូចគ្រូបង្រៀនផ្ទាល់'
  },
  {
    id: 'kokoro-sky',
    voiceName: 'en-US-AvaMultilingualNeural',
    name: 'Sky (Kokoro / Ultra-Natural Female)',
    gender: 'female',
    lang: 'en',
    badge: 'Kokoro Natural Human ✨',
    description: 'Warm, conversational human voice with natural pauses and realistic breathing'
  },
  {
    id: 'kokoro-michael',
    voiceName: 'en-US-AndrewMultilingualNeural',
    name: 'Michael (Kokoro / Conversational Male)',
    gender: 'male',
    lang: 'en',
    badge: 'Engaging Human Male 🎙️',
    description: 'Deep, expressive male human tone for lessons, podcasts, and discussions'
  },
  {
    id: 'studio-emma',
    voiceName: 'en-US-EmmaMultilingualNeural',
    name: 'Emma (Studio Academic Female)',
    gender: 'female',
    lang: 'en',
    badge: 'Studio Academic 🎓',
    description: 'Clear, articulate narrator voice tailored for academic learning & science'
  },
  {
    id: 'studio-brian',
    voiceName: 'en-US-BrianMultilingualNeural',
    name: 'Brian (British Professor Male)',
    gender: 'male',
    lang: 'en',
    badge: 'British Academic 🏛️',
    description: 'Natural British professor voice with smooth pacing and distinguished cadence'
  },
  {
    id: 'studio-jenny',
    voiceName: 'en-US-JennyNeural',
    name: 'Jenny (Studio Master Female)',
    gender: 'female',
    lang: 'en',
    badge: 'Studio Master 💎',
    description: 'Professional high-definition broadcast studio narrator voice'
  },
  {
    id: 'studio-guy',
    voiceName: 'en-US-GuyNeural',
    name: 'Guy (Broadcast Deep Male)',
    gender: 'male',
    lang: 'en',
    badge: 'Broadcast Deep 🎧',
    description: 'Deep, confident American broadcast voice with rich acoustic resonance'
  },
  {
    id: 'japan-nanami',
    voiceName: 'ja-JP-NanamiNeural',
    name: 'Nanami (七海 - Japanese Human)',
    gender: 'female',
    lang: 'ja',
    badge: 'Japanese Studio 🌸',
    description: 'Sweet, natural Japanese native speaker with melodic intonation'
  },
  {
    id: 'korea-sunhi',
    voiceName: 'ko-KR-SunHiNeural',
    name: 'Sun-Hi (선희 - Korean Studio)',
    gender: 'female',
    lang: 'ko',
    badge: 'Korean Studio 🇰🇷',
    description: 'Clear, modern Seoul accent studio voice for Korean lessons'
  },
  {
    id: 'france-denise',
    voiceName: 'fr-FR-DeniseNeural',
    name: 'Denise (Parisienne French)',
    gender: 'female',
    lang: 'fr',
    badge: 'French Studio 🇫🇷',
    description: 'Elegant Parisian native speaker with flawless pronunciation'
  }
];

/**
 * Returns available voice profiles
 */
export function getVoiceProfiles(req, res) {
  res.json({
    success: true,
    defaultKhmer: 'km-KH-SreymomNeural',
    defaultEnglish: 'en-US-AvaMultilingualNeural',
    voices: HUMAN_VOICES
  });
}

/**
 * Supercharged Native Cambodian Academic Teacher Phonetic Engine
 * Fully incorporates MoEYS classroom standards & French-derived variable nomenclature:
 * - Single variables (x -> អ៊ិច, y -> អុីក្រែក, u -> អ៊ុយ, v -> វេ, w -> ឌុប្លឺវេ, z -> ហ្សិត)
 * - French constants (a, b, c, d, n, k -> អា, បេ, សេ, ដេ, អិន, កា)
 * - Fractions (u/v -> អ៊ុយ លើ វេ), Powers (x^2 -> អ៊ិច ការ៉េ), Radicals (√ -> ឬសការ៉េនៃ)
 * - Calculus (f'(x) -> អេហ្វ ព្រីម នៃ អ៊ិច, dy/dx -> ដេ អុីក្រែក លើ ដេ អ៊ិច, lim, int)
 * - Geometry & Vectors (vec{u} -> វ៉ិចទ័រ អ៊ុយ, perp -> កែងនឹង)
 * - Chemistry (H2O -> អាស ពីរ អូ, CO2 -> សេ អូ ពីរ, Fe -> ដែក)
 */
function normalizePhoneticsForSpeech(text, isKhmer) {
  if (!text) return '';
  let result = text;

  // 1. Clean chemical & mathematical reaction arrows FIRST before any bracket/symbol stripping!
  result = result.replace(/-->|->|→|=>/g, ' បង្កើតបានជា ');

  // 2. Clean Markdown, URLs, and LaTeX tags
  result = result
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\\mathbf\{([^}]+)\}/g, '$1')
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1 លើ $2')
    .replace(/\\vec\{([^}]+)\}/g, 'វ៉ិចទ័រ $1')
    .replace(/\\sum/g, 'ផលបូក')
    .replace(/\\cdot/g, ' គុណនឹង ')
    .replace(/\\left|\\right/g, '')
    .replace(/\$\$/g, '')
    .replace(/\$/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/#{1,6}\s*/g, '')
    .replace(/_{2,}/g, '');

  // 3. Bullet points: lines starting with '-' or '•' should NOT be read as 'ដក' (minus)
  result = result.replace(/(?:^|\n)\s*[-*•]\s+/g, '\n');

  if (isKhmer) {
    result = result
      // 4. National & System Entities
      .replace(/\bMoTDAR\b/gi, 'ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ')
      .replace(/\bMoEYS\b/gi, 'ក្រសួងអប់រំ យុវជន និងកីឡា')
      .replace(/\bKHQR\b/gi, 'ខេអេច ឃ្យូអរ')
      .replace(/\bQR\s*Code\b/gi, 'កូដ ឃ្យូអរ')
      .replace(/\bQR\b/gi, 'ឃ្យូអរ')
      .replace(/\bAI\b/gi, 'អេអាយ')
      .replace(/\bGemini\b/gi, 'ហ្គេមីនី')
      .replace(/\bPDF\b/gi, 'ភីឌីអេច')
      .replace(/\bBac\s*II\b/gi, 'បាក់ឌុប')
      .replace(/\b1v1\b/gi, 'មួយទល់មួយ')
      .replace(/\bXP\b/gi, 'ពិន្ទុ អិចភី')
      .replace(/\bSTEM\b/gi, 'ស្ទែម')

      // 5. Roman Numerals in Chemistry/Math (e.g., Fe(III) -> ដែក បី)
      .replace(/\(V\)/gi, ' ប្រាំ ')
      .replace(/\(IV\)/gi, ' បួន ')
      .replace(/\(III\)/gi, ' បី ')
      .replace(/\(II\)/gi, ' ពីរ ')
      .replace(/\(I\)/gi, ' មួយ ')

      // 6. English pedagogical terms in parentheses (localize to Khmer)
      .replace(/\bSubscripts?\b/gi, 'សន្ទស្សន៍')
      .replace(/\bCombination\s+Reaction\b/gi, 'ប្រតិកម្មផ្សំ')
      .replace(/\bSynthesis\s+Reaction\b/gi, 'ប្រតិកម្មសំយោគ')
      .replace(/\bRedox\s+Reaction\b/gi, 'ប្រតិកម្មរេដុក')
      .replace(/\bReactants?\b/gi, 'អង្គធាតុប្រតិករ')
      .replace(/\bProducts?\b/gi, 'អង្គធាតុកកើត')
      .replace(/\bFree\s+Body\s+Diagram\b/gi, 'គំនូសបំព្រួញកម្លាំង')

      // 7. Calculus, Derivatives, Functions & Limits (Cambodian French Conventions)
      .replace(/\bf''\s*\(\s*([^)]+)\s*\)/g, 'អេហ្វ សេកុង នៃ $1')
      .replace(/\bf'\s*\(\s*([^)]+)\s*\)/g, 'អេហ្វ ព្រីម នៃ $1')
      .replace(/\bf\s*\(\s*([^)]+)\s*\)/g, 'អេហ្វ នៃ $1')
      .replace(/\by''\b/g, 'អុីក្រែក សេកុង')
      .replace(/\by'\b/g, 'អុីក្រែក ព្រីម')
      .replace(/\bdy\s*\/\s*dx\b/gi, 'ដេ អុីក្រែក លើ ដេ អ៊ិច')
      .replace(/\\frac\{dy\}\{dx\}/gi, 'ដេ អុីក្រែក លើ ដេ អ៊ិច')
      .replace(/\\lim_\{([^}]+)\}|lim\s*\((.*?)\)/g, 'លីមីត $1 នៃ ')
      .replace(/\blim\b/gi, 'លីមីត')
      .replace(/x\s*→\s*\+\s*∞|x\s*->\s*\+\s*∞/g, 'អ៊ិច ខិតជិត បូក អនន្ត')
      .replace(/x\s*→\s*-\s*∞|x\s*->\s*-\s*∞/g, 'អ៊ិច ខិតជិត ដក អនន្ត')
      .replace(/x\s*→\s*([^,\s]+)|x\s*->\s*([^,\s]+)/g, 'អ៊ិច ខិតជិត $1')
      .replace(/\\int_\{([^}]+)\}\^\{([^}]+)\}/g, 'អាំងតេក្រាល ពី $1 ទៅ $2')
      .replace(/\\int/g, 'អាំងតេក្រាល នៃ ')
      .replace(/∫/g, 'អាំងតេក្រាល នៃ ')

      // 8. Trigonometry & Logarithms
      .replace(/\bsin\b/gi, 'ស៊ីនុស')
      .replace(/\bcos\b/gi, 'កូស៊ីនុស')
      .replace(/\btan\b/gi, 'តង់ហ្សង់')
      .replace(/\bcot\b/gi, 'កូតង់ហ្សង់')
      .replace(/\bln\s*\(\s*([^)]+)\s*\)/gi, 'អែល អិន នៃ $1')
      .replace(/\bln\b/gi, 'អែល អិន')
      .replace(/\blog\s*\(\s*([^)]+)\s*\)/gi, 'លោការីត នៃ $1')
      .replace(/\blog\b/gi, 'លោការីត')

      // 9. Roots & Radicals
      .replace(/\\sqrt\[3\]\{([^}]+)\}|∛\((.*?)\)/g, 'ឬសគូប នៃ $1$2')
      .replace(/\\sqrt\[(\w+)\]\{([^}]+)\}/g, 'ឬសទី $1 នៃ $2')
      .replace(/\\sqrt\{([^}]+)\}|√\((.*?)\)|√([a-zA-Z0-9]+)/g, 'ឬសការ៉េ នៃ $1$2$3')

      // 10. Fractions & Division (u/v, a/b, (expression)/(expression))
      .replace(/\(([^)]+)\)\s*\/\s*\(([^)]+)\)/g, '$1 លើ $2')
      .replace(/([a-zA-Z0-9\u1780-\u17FF]+)\s*\/\s*([a-zA-Z0-9\u1780-\u17FF]+)/g, '$1 លើ $2')

      // 11. Exponents & Powers
      .replace(/([a-zA-Z\u1780-\u17FF0-9]+)\^2/g, '$1 ការ៉េ')
      .replace(/([a-zA-Z\u1780-\u17FF0-9]+)\^3/g, '$1 គូប')
      .replace(/([a-zA-Z\u1780-\u17FF0-9]+)\^([a-zA-Z0-9\u1780-\u17FF]+)/g, '$1 ស្វ័យគុណ $2')
      .replace(/e\^\{?2x\}?/g, 'អឺ ស្វ័យគុណ ពីរអ៊ិច')
      .replace(/e\^\{?x\}?/g, 'អឺ ស្វ័យគុណ អ៊ិច')

      // 12. Vectors & Geometry
      .replace(/\\vec\{u\}|\b\\vec\s*u\b/g, 'វ៉ិចទ័រ អ៊ុយ')
      .replace(/\\vec\{v\}|\b\\vec\s*v\b/g, 'វ៉ិចទ័រ វេ')
      .replace(/\\vec\{([^}]+)\}/g, 'វ៉ិចទ័រ $1')
      .replace(/\\perp|⊥/g, ' កែងនឹង ')
      .replace(/\\parallel|∥/g, ' ស្របនឹង ')
      .replace(/\\triangle\s*([A-Z]{3})/g, 'ត្រីកោណ $1')
      .replace(/\\angle\s*([A-Z]{3})/g, 'មុំ $1')

      // 13. Sets & Logic
      .replace(/\\mathbb\{R\}|ℝ/g, 'សំណុំ អ៊ែរ')
      .replace(/\\mathbb\{N\}|ℕ/g, 'សំណុំ អិន')
      .replace(/\\mathbb\{Z\}|ℤ/g, 'សំណុំ ហ្សិត')
      .replace(/\\mathbb\{Q\}|ℚ/g, 'សំណុំ គូ')
      .replace(/\\mathbb\{C\}|ℂ/g, 'សំណុំ សេ')
      .replace(/\\in|∈/g, ' ជារបស់ ')
      .replace(/\\notin|∉/g, ' មិនមែនជារបស់ ')
      .replace(/\\cup|∪/g, ' ប្រជុំ ')
      .replace(/\\cap|∩/g, ' ប្រសព្វ ')
      .replace(/\\emptyset|∅/g, ' សំណុំទទេ ')
      .replace(/\\forall|∀/g, ' ចំពោះគ្រប់ ')
      .replace(/\\exists|∃/g, ' មានយ៉ាងហោចណាស់មួយ ')
      .replace(/\\Rightarrow|=>|⇒/g, ' នាំឱ្យ ')
      .replace(/\\Leftrightarrow|<=>|⇔/g, ' សមមូលនឹង ')

      // 14. Physics & Greek Symbols
      .replace(/ΣF|\\Sigma F/g, 'កម្លាំង ស៊ីកម៉ា អេហ្វ')
      .replace(/\\Sigma|Σ/g, 'ផលបូក ស៊ីកម៉ា')
      .replace(/\bF\s*=\s*m\s*[\*·]?\s*a\b/g, 'កម្លាំង អេហ្វ ស្មើ អឹម អា')
      .replace(/\\alpha|α/g, ' អាល់ហ្វា ')
      .replace(/\\beta|β/g, ' បេតា ')
      .replace(/\\gamma|γ/g, ' ហ្គាម៉ា ')
      .replace(/\\Delta|Δ/g, ' ដីល់តា ')
      .replace(/\\lambda|λ/g, ' ឡាំដា ')
      .replace(/\\mu|μ/g, ' មី ')
      .replace(/\\pi|π/g, ' ភី ')
      .replace(/\\rho|ρ/g, ' រ៉ូ ')
      .replace(/\\sigma|σ/g, ' ស៊ីសម៉ា ')
      .replace(/\\omega|ω/g, ' អូមេហ្គា ')
      .replace(/\\theta|θ/g, ' តេតា ')

      // 15. Chemistry Formulas & Chemical Reactions
      .replace(/\bFe2O3\b|Fe_2O_3/g, 'ដែក ពីរ អុកស៊ីត បី')
      .replace(/(\d+)\s*Fe\b/g, '$1 ដែក')
      .replace(/\bFe\b/g, 'ដែក')
      .replace(/(\d+)\s*O2\b/g, '$1 អូ ពីរ')
      .replace(/\bO2\b|O_2/g, 'អូ ពីរ')
      .replace(/\bH2O\b|H_2O/g, 'អាស ពីរ អូ')
      .replace(/\bCO2\b|CO_2/g, 'សេ អូ ពីរ')
      .replace(/\bH2SO4\b|H_2SO_4/g, 'អាស ពីរ អេស អូ បួន')
      .replace(/(\d+)\s*Cu\b/g, '$1 ទង់ដែង')
      .replace(/\bCu\b/g, 'ទង់ដែង')
      .replace(/(\d+)\s*Al\b/g, '$1 អាលុយមីញ៉ូម')
      .replace(/\bAl\b/g, 'អាលុយមីញ៉ូម')
      .replace(/\(aq\)/gi, 'សូលុយស្យុងទឹក')
      .replace(/\(s\)/gi, 'រឹង')
      .replace(/\(l\)/gi, 'រាវ')
      .replace(/\(g\)/gi, 'ឧស្ម័ន')

      // 16. Math Operators (Now safe after reaction arrows & bullets)
      .replace(/\\pm|±/g, ' បូក ដក ')
      .replace(/\\approx|≈/g, ' ប្រហាក់ប្រហែល ')
      .replace(/\\neq|≠/g, ' មិនស្មើ ')
      .replace(/\\le|\\leq|≤/g, ' តូចជាង ឬស្មើ ')
      .replace(/\\ge|\\geq|≥/g, ' ធំជាង ឬស្មើ ')
      .replace(/\\infty|∞/g, ' អនន្ត ')
      .replace(/\\cdot|\\times|×/g, ' គុណនឹង ')
      .replace(/\s*\+\s*/g, ' បូក ')
      .replace(/([0-9a-zA-Z\u1780-\u17FF]+)\s*-\s*([0-9a-zA-Z\u1780-\u17FF]+)/g, '$1 ដក $2')
      .replace(/\s*-\s*(\d+)/g, ' ដក $1')
      .replace(/\s*[*]\s*/g, ' គុណនឹង ')
      .replace(/\s*[÷]\s*/g, ' ចែកនឹង ')
      .replace(/\s*=\s*/g, ' ស្មើនឹង ')
      .replace(/\s*%\s*/g, ' ភាគរយ ')

      // 17. Standard Academic Alphabet & Variables (French-derived Cambodian conventions)
      .replace(/(\d+)\s*x\b/gi, '$1 អ៊ិច')
      .replace(/\bx\b/gi, 'អ៊ិច')
      .replace(/(\d+)\s*y\b/gi, '$1 អុីក្រែក')
      .replace(/\by\b/gi, 'អុីក្រែក')
      .replace(/\bu\b/gi, 'អ៊ុយ')
      .replace(/\bv\b/gi, 'វេ')
      .replace(/\bw\b/gi, 'ឌុប្លឺវេ')
      .replace(/\bz\b/gi, 'ហ្សិត')

      // 18. Conversational natural breathing at punctuation
      .replace(/([!?:;។៖])/g, '$1 ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  return result;
}

/**
 * Controller to synthesize ultra-realistic Human Neural Voices
 * Uses Microsoft Neural Audio Engine with instant chunked audio streaming
 */
export async function synthesizeSpeech(req, res) {
  let tts = null;
  try {
    const text = req.query?.text || req.body?.text;
    const voiceOverride = req.query?.voice || req.body?.voice;
    const gender = req.query?.gender || req.body?.gender || 'male';
    const rate = req.query?.rate || req.body?.rate || '+0%';

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Text parameter is required.' });
    }

    const hasKhmer = /[\u1780-\u17FF]/.test(text);

    let cleanText = text
      .replace(/https?:\/\/\S+/g, '')
      .replace(/[*_#`~>\[\]\(\)\{\}\\]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    cleanText = normalizePhoneticsForSpeech(cleanText, hasKhmer).slice(0, 1500);

    if (!cleanText) {
      return res.status(400).json({ error: 'Valid text content is required.' });
    }

    // Determine the optimal Human Neural Voice
    const hasJapanese = /[\u3040-\u30FF\u4E00-\u9FAF]/.test(cleanText);

    let selectedVoice = gender === 'female' ? 'km-KH-SreymomNeural' : 'km-KH-PisethNeural'; // Default to Piseth

    if (voiceOverride) {
      const foundVoice = HUMAN_VOICES.find(v => v.id === voiceOverride || v.voiceName === voiceOverride);
      selectedVoice = foundVoice ? foundVoice.voiceName : voiceOverride;
    } else if (hasKhmer) {
      selectedVoice = gender === 'female' ? 'km-KH-SreymomNeural' : 'km-KH-PisethNeural';
    } else if (hasJapanese) {
      selectedVoice = gender === 'female' ? 'ja-JP-NanamiNeural' : 'ja-JP-KeitaNeural';
    } else {
      selectedVoice = gender === 'female' ? 'en-US-AvaMultilingualNeural' : 'en-US-AndrewMultilingualNeural';
    }

    // Check cache for instant 0ms response
    const cacheKey = `${selectedVoice}::${rate}::${cleanText}`;
    if (audioCache.has(cacheKey)) {
      const cachedBuffer = audioCache.get(cacheKey);
      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': cachedBuffer.length,
        'Cache-Control': 'public, max-age=86400',
        'X-TTS-Voice': selectedVoice,
        'X-TTS-Cached': 'HIT'
      });
      return res.send(cachedBuffer);
    }

    tts = new MsEdgeTTS();
    await tts.setMetadata(selectedVoice, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
    // Natural human cadence +0% - crisp, fluent, lively, never dragged or slow
    const { audioStream } = tts.toStream(cleanText, { rate: rate });

    // Stream directly to client so playback starts in <300ms
    res.set({
      'Content-Type': 'audio/mpeg',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'public, max-age=86400',
      'X-TTS-Voice': selectedVoice,
      'X-TTS-Cached': 'STREAM'
    });

    const chunks = [];
    audioStream.on('data', (chunk) => {
      chunks.push(chunk);
      if (!res.writableEnded) {
        res.write(chunk);
      }
    });
    
    audioStream.on('end', () => {
      if (!res.writableEnded) {
        res.end();
      }
      const buffer = Buffer.concat(chunks);
      
      // Store in memory cache for future 0ms instant playback
      if (buffer.length > 100) {
        if (audioCache.size >= MAX_CACHE_SIZE) {
          const firstKey = audioCache.keys().next().value;
          audioCache.delete(firstKey);
        }
        audioCache.set(cacheKey, buffer);
      }

      try {
        tts.close();
      } catch (e) {}
    });

    // If client closes connection or cancels speech, terminate TTS stream immediately
    req.on('close', () => {
      if (tts) {
        try {
          tts.close();
        } catch (e) {}
      }
    });

    audioStream.on('error', (err) => {
      console.error('[TTS Stream Error]:', err);
      try {
        tts.close();
      } catch (e) {}
      if (!res.headersSent) {
        return res.status(500).json({ error: 'TTS stream error: ' + err.message });
      }
    });
  } catch (error) {
    if (tts) {
      try {
        tts.close();
      } catch (e) {}
    }
    console.error('[TTS Controller Error]:', error);
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Failed to synthesize speech: ' + error.message });
    }
  }
}
