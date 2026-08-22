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
 * Supercharged Phonetic Engine for Khmer & Academic Curriculum
 * Normalizes math symbols, formulas, abbreviations, and natural sentence pauses
 */
function normalizePhoneticsForSpeech(text, isKhmer) {
  if (!text) return '';
  let result = text;

  if (isKhmer) {
    result = result
      // 1. National & System Entities
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

      // 2. Math & Scientific Notation
      .replace(/f''\((.*?)\)/g, "ដេរីវេទីពីរ អេហ្វ នៃ $1")
      .replace(/f'\((.*?)\)/g, "ដេរីវេ អេហ្វ នៃ $1")
      .replace(/f\((.*?)\)/g, "អេហ្វ នៃ $1")
      .replace(/lim\s*\((.*?)\s*→\s*(.*?)\)/g, "លីមីត កាលណា $1 ខិតជិត $2 នៃ")
      .replace(/lim/gi, 'លីមីត')
      .replace(/(\w+)\^2/g, '$1 ការ៉េ')
      .replace(/(\w+)\^3/g, '$1 គូប')
      .replace(/(\w+)\^(\d+)/g, '$1 ស្វ័យគុណ $2')
      .replace(/e\^\{?2x\}?/g, 'អឺ ស្វ័យគុណ ពីរអ៊ិច')
      .replace(/e\^\{?x\}?/g, 'អឺ ស្វ័យគុណ អ៊ិច')
      .replace(/√/g, 'ឬសការ៉េនៃ ')
      .replace(/∫/g, 'អាំងតេក្រាលនៃ ')
      .replace(/\s*\+\s*/g, ' បូក ')
      .replace(/\s*-\s*/g, ' ដក ')
      .replace(/\s*[*×]\s*/g, ' គុណនឹង ')
      .replace(/\s*[\/÷]\s*/g, ' ចែកនឹង ')
      .replace(/\s*=\s*/g, ' ស្មើនឹង ')
      .replace(/\s*%\s*/g, ' ភាគរយ ')

      // 3. Technical & App Terms
      .replace(/\bApp\b/gi, 'កម្មវិធី')
      .replace(/\bWebsite\b/gi, 'គេហទំព័រ')
      .replace(/\bVideo\b/gi, 'វីដេអូ')
      .replace(/\bQuiz\b/gi, 'កម្រងសំណួរ')
      .replace(/\bLesson\b/gi, 'មេរៀន')
      .replace(/\bChapter\b/gi, 'ជំពូក')
      .replace(/\bOnline\b/gi, 'អនឡាញ')
      .replace(/\bChat\b/gi, 'ការសន្ទនា')
      .replace(/\bDonor\b/gi, 'សប្បុរសជន')
      .replace(/\bDonate\b/gi, 'ឧបត្ថម្ភ')

      // 4. Conversational natural breathing at punctuation
      .replace(/([!?:;។])/g, '$1 ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  return result;
}

/**
 * Controller to synthesize ultra-realistic Human Neural Voices
 * Uses Microsoft Neural Audio Engine (Zero robotic artifacting, authentic human breathing & tonal cadence)
 */
export async function synthesizeSpeech(req, res) {
  let tts = null;
  try {
    const text = req.query.text || req.body.text;
    const voiceOverride = req.query.voice || req.body.voice;
    const gender = req.query.gender || req.body.gender || 'male';

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

    let selectedVoice = gender === 'female' ? 'km-KH-SreymomNeural' : 'km-KH-PisethNeural'; // Default to Piseth (Male Developer)

    if (voiceOverride) {
      // Map alias IDs to voiceName
      const foundVoice = HUMAN_VOICES.find(v => v.id === voiceOverride || v.voiceName === voiceOverride);
      selectedVoice = foundVoice ? foundVoice.voiceName : voiceOverride;
    } else if (hasKhmer) {
      selectedVoice = gender === 'female' ? 'km-KH-SreymomNeural' : 'km-KH-PisethNeural';
    } else if (hasJapanese) {
      selectedVoice = gender === 'female' ? 'ja-JP-NanamiNeural' : 'ja-JP-KeitaNeural';
    } else {
      // English / Multilingual Natural Human Voice (Ava/Sky & Andrew/Michael)
      selectedVoice = gender === 'female' ? 'en-US-AvaMultilingualNeural' : 'en-US-AndrewMultilingualNeural';
    }

    // Check cache for instant response
    const cacheKey = `${selectedVoice}::${cleanText}`;
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
    const { audioStream } = tts.toStream(cleanText);

    const chunks = [];
    audioStream.on('data', (chunk) => chunks.push(chunk));
    
    audioStream.on('end', () => {
      const buffer = Buffer.concat(chunks);
      
      // Store in memory cache
      if (audioCache.size >= MAX_CACHE_SIZE) {
        const firstKey = audioCache.keys().next().value;
        audioCache.delete(firstKey);
      }
      audioCache.set(cacheKey, buffer);

      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length,
        'Cache-Control': 'public, max-age=86400',
        'X-TTS-Voice': selectedVoice,
        'X-TTS-Cached': 'MISS'
      });

      try {
        tts.close();
      } catch (e) {}

      return res.send(buffer);
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
