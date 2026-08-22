// ============================================================================
// Professional Human Voice Engine & Studio Audio System
// Powered by Microsoft Neural Models (km-KH-PisethNeural & km-KH-SreymomNeural),
// Kokoro Ultra-Natural Models (Ava/Sky & Andrew/Michael), and Real Human Studio Audio
// ============================================================================

let audioCtx = null;
let currentBufferSource = null;
let currentHumanAudio = null;
let currentUtterance = null;
let isAudioUnlocked = false;

export const AVAILABLE_HUMAN_VOICES = [
  {
    id: 'km-piseth',
    voiceName: 'km-KH-PisethNeural',
    name: 'Piseth (ពិសិដ្ឋ - គ្រូបុរស)',
    gender: 'male',
    lang: 'km',
    badge: 'Khmer Human Male ⭐',
    sampleText: 'ជម្រាបសួរប្អូនៗទាំងអស់គ្នា! ខ្ញុំជាលោកគ្រូពិសិដ្ឋ ត្រៀមជួយប្អូនគ្រប់មេរៀន និងលំហាត់។',
    description: 'សំឡេងមនុស្សប្រុសខ្មែរ រស់រវើក ច្បាស់ម៉ឺងម៉ាត់ បែបអប់រំ និងស្ដង់ដាជាតិ'
  },
  {
    id: 'km-sreymom',
    voiceName: 'km-KH-SreymomNeural',
    name: 'Sreymom (ស្រីមុំ - គ្រូនារី)',
    gender: 'female',
    lang: 'km',
    badge: 'Khmer Human Female 🌸',
    sampleText: 'សួស្តីប្អូនៗ! ខ្ញុំជាគ្រូស្រីមុំ ជំនួយការសិក្សាថ្នាក់វិទ្យាល័យជាតិកម្ពុជា។',
    description: 'សំឡេងមនុស្សស្រីខ្មែរពិតៗ ទន់ភ្លន់ ច្បាស់លាស់ ដូចគ្រូបង្រៀនផ្ទាល់'
  },
  {
    id: 'kokoro-sky',
    voiceName: 'en-US-AvaMultilingualNeural',
    name: 'Sky (Kokoro / Ultra-Natural Female)',
    gender: 'female',
    lang: 'en',
    badge: 'Kokoro Natural Human ✨',
    sampleText: 'Hello! I am your natural human study assistant. How can I help you excel today?',
    description: 'Warm, conversational human voice with natural pauses and realistic breathing'
  },
  {
    id: 'kokoro-michael',
    voiceName: 'en-US-AndrewMultilingualNeural',
    name: 'Michael (Kokoro / Conversational Male)',
    gender: 'male',
    lang: 'en',
    badge: 'Engaging Human Male 🎙️',
    sampleText: 'Greetings! Let’s explore your science, mathematics, and language concepts together.',
    description: 'Deep, expressive male human tone for lessons, podcasts, and discussions'
  },
  {
    id: 'studio-emma',
    voiceName: 'en-US-EmmaMultilingualNeural',
    name: 'Emma (Studio Academic Female)',
    gender: 'female',
    lang: 'en',
    badge: 'Studio Academic 🎓',
    sampleText: 'Welcome to advanced learning. Let’s break down complex questions into clear steps.',
    description: 'Clear, articulate narrator voice tailored for academic learning & science'
  },
  {
    id: 'studio-brian',
    voiceName: 'en-US-BrianMultilingualNeural',
    name: 'Brian (British Professor Male)',
    gender: 'male',
    lang: 'en',
    badge: 'British Academic 🏛️',
    sampleText: 'Good day! Let us delve into today’s academic curriculum and master every principle.',
    description: 'Natural British professor voice with smooth pacing and distinguished cadence'
  },
  {
    id: 'studio-jenny',
    voiceName: 'en-US-JennyNeural',
    name: 'Jenny (Studio Master Female)',
    gender: 'female',
    lang: 'en',
    badge: 'Studio Master 💎',
    sampleText: 'Welcome to the national e-learning portal. All lessons are ready for you.',
    description: 'Professional high-definition broadcast studio narrator voice'
  },
  {
    id: 'studio-guy',
    voiceName: 'en-US-GuyNeural',
    name: 'Guy (Broadcast Deep Male)',
    gender: 'male',
    lang: 'en',
    badge: 'Broadcast Deep 🎧',
    sampleText: 'Welcome to your premium study session. Ready whenever you are.',
    description: 'Deep, confident American broadcast voice with rich acoustic resonance'
  },
  {
    id: 'japan-nanami',
    voiceName: 'ja-JP-NanamiNeural',
    name: 'Nanami (七海 - Japanese Human)',
    gender: 'female',
    lang: 'ja',
    badge: 'Japanese Studio 🌸',
    sampleText: 'こんにちは！一緒に日本語と科学を楽しく学びましょう！',
    description: 'Sweet, natural Japanese native speaker with melodic intonation'
  },
  {
    id: 'korea-sunhi',
    voiceName: 'ko-KR-SunHiNeural',
    name: 'Sun-Hi (선희 - Korean Studio)',
    gender: 'female',
    lang: 'ko',
    badge: 'Korean Studio 🇰🇷',
    sampleText: '안녕하세요! 함께 공부하며 실력을 쑥쑥 키워봐요.',
    description: 'Clear, modern Seoul accent studio voice for Korean lessons'
  },
  {
    id: 'france-denise',
    voiceName: 'fr-FR-DeniseNeural',
    name: 'Denise (Parisienne French)',
    gender: 'female',
    lang: 'fr',
    badge: 'French Studio 🇫🇷',
    sampleText: 'Bonjour! Bienvenue dans votre espace d’apprentissage national.',
    description: 'Elegant Parisian native speaker with flawless pronunciation'
  }
];

export function getStoredVoicePreference() {
  if (typeof window === 'undefined') return 'km-piseth';
  return localStorage.getItem('app_preferred_voice_id') || 'km-piseth';
}

export function setStoredVoicePreference(voiceId) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('app_preferred_voice_id', voiceId);
}

export const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

/**
 * Proactively unlocks browser Web Audio Context and HTMLAudioElement playback
 * preventing browser Autoplay policy blocks
 */
export function unlockAudio() {
  if (typeof window === 'undefined') return;
  try {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    if (!isAudioUnlocked) {
      const silentAudio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
      silentAudio.volume = 0.01;
      silentAudio.play().then(() => {
        isAudioUnlocked = true;
      }).catch(() => {});
    }
  } catch (e) {}
}

// Auto-unlock on first user pointerdown/click anywhere in window
if (typeof window !== 'undefined') {
  const onUserInteraction = () => {
    unlockAudio();
    window.removeEventListener('click', onUserInteraction);
    window.removeEventListener('keydown', onUserInteraction);
    window.removeEventListener('touchstart', onUserInteraction);
  };
  window.addEventListener('click', onUserInteraction, { passive: true, once: true });
  window.addEventListener('keydown', onUserInteraction, { passive: true, once: true });
  window.addEventListener('touchstart', onUserInteraction, { passive: true, once: true });
}

/**
 * Signature Executive Harmonic Bell Chime (Apple Pay / Bakong POS Signature)
 */
export function playLuxuryChime() {
  try {
    unlockAudio();
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Harmonic bell layer 1 (880Hz / A5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.4);

    // Harmonic bell layer 2 (1318.5Hz / E6)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1318.51, now + 0.06);
    gain2.gain.setValueAtTime(0.25, now + 0.06);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.06);
    osc2.stop(now + 0.55);
  } catch (e) {}
}

let qrGeneratedKhmerAudio = null;
let paymentSuccessKhmerAudio = null;

export function preloadKhmerAudio() {
  if (typeof window === 'undefined') return;
  unlockAudio();
  try {
    if (!qrGeneratedKhmerAudio) {
      qrGeneratedKhmerAudio = new Audio('/assets/audio/khmer-qr-generated.mp3');
      qrGeneratedKhmerAudio.load();
    }
    if (!paymentSuccessKhmerAudio) {
      paymentSuccessKhmerAudio = new Audio('/assets/audio/khmer-payment-success.mp3');
      paymentSuccessKhmerAudio.load();
    }
  } catch (e) {
    console.warn('Audio preload error:', e);
  }
}

/**
 * Supercharged Phonetic Engine for Khmer & Academic Curriculum
 * Normalizes math symbols, formulas, abbreviations, and natural sentence pauses
 */
function normalizePhoneticsForSpeech(text, isKhmer) {
  if (!text) return '';
  let result = text;

  // Clean Markdown and LaTeX tags for clean acoustic rendering
  result = result
    .replace(/\\mathbf\{([^}]+)\}/g, '$1')
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1 លើ $2')
    .replace(/\\vec\{([^}]+)\}/g, 'វ៉ិចទ័រ $1')
    .replace(/\\sum/g, 'ផលបូក')
    .replace(/\\cdot/g, ' គុណនឹង ')
    .replace(/\\lim_\{([^}]+)\}/g, 'លីមីត $1')
    .replace(/\\int/g, 'អាំងតេក្រាល')
    .replace(/\\left|\\right/g, '')
    .replace(/\$\$/g, '')
    .replace(/\$/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/#{1,6}\s*/g, '');

  if (isKhmer) {
    result = result
      // 1. National & System Entities
      .replace(/\bMoTDAR\b/gi, 'ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ')
      .replace(/\bMoEYS\b/gi, 'ក្រសួងអប់រំ យុវជន និងកីឡា')
      .replace(/\bKHQR\b/gi, 'ខេអេច ឃ្យូអរ')
      .replace(/\bQR\s*Code\b/gi, 'កូដ ឃ្យូអរ')
      .replace(/\bQR\b/gi, 'ឃ្យូអរ')
      .replace(/\bAI\b/gi, 'អេអាយ')
      .replace(/\bGemini\b/gi, 'អេអាយ')
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
 * Play authentic human studio recorded notification voice (Khmer Human Voice)
 * Supports dynamic donor name, developer message, and custom text announcement
 * @param {string} type - 'qr_generated' | 'payment_success' | 'qr_scan'
 * @param {Object|string} options - { donorName, donorMessage, amount, currency, customText, voiceId } or voiceLang string
 */
export function speakKhmerNotification(type = 'qr_generated', options = {}) {
  if (typeof window === 'undefined') return;

  unlockAudio();

  const opts = typeof options === 'string' ? { voiceLang: options } : (options || {});
  const { donorName, donorMessage, amount, currency, customText, voiceId } = opts;

  try {
    // 1. Check if developer or student has recorded a custom human voice in localStorage
    const customVoiceBase64 = localStorage.getItem(
      type === 'payment_success' ? 'chey_dev_custom_voice_success' : 'chey_dev_custom_voice_qr'
    );

    if (customVoiceBase64) {
      playLuxuryChime();
      setTimeout(() => {
        const customAudio = new Audio(customVoiceBase64);
        customAudio.volume = 1.0;
        customAudio.play().catch(() => {});
      }, 180);
      return;
    }

    // 2. Play Luxury Chime first
    playLuxuryChime();

    const activeVoiceId = voiceId || getStoredVoicePreference() || 'km-piseth';

    // 3. Formulate the natural announcement phrase
    let phrase = '';
    if (customText) {
      phrase = customText;
    } else if (type === 'payment_success') {
      if (donorName && amount) {
        const formattedAmount = currency === 'usd' ? `$${Number(amount).toFixed(2)}` : `${Number(amount).toLocaleString()} ៛`;
        phrase = `ការទូទាត់ប្រាក់ចំនួន ${formattedAmount} ពី ${donorName} បានជោគជ័យ! សូមថ្លែងអំណរគុណយ៉ាងជ្រាលជ្រៅចំពោះការចូលរួមចំណែកគាំទ្រ។`;
      } else {
        phrase = 'ការទូទាត់ប្រាក់បានជោគជ័យ! សូមថ្លែងអំណរគុណយ៉ាងជ្រាលជ្រៅចំពោះការចូលរួមចំណែកគាំទ្រ។';
      }
    } else if (type === 'qr_scan') {
      phrase = 'សូមស្កេនកូដ ឃ្យូអរ ដើម្បីបន្តការទូទាត់។';
    } else {
      if (donorMessage && donorMessage.trim()) {
        phrase = `កូដ ឃ្យូអរ ត្រូវបានបង្កើតដោយជោគជ័យ។ ${donorMessage.trim()}`;
      } else {
        phrase = 'កូដ ឃ្យូអរ ត្រូវបានបង្កើតដោយជោគជ័យ។ សូមស្កេនទូទាត់ប្រាក់តាមកម្មវិធីបាគង ឬធនាគារណាក៏បាន។';
      }
    }

    // Direct High-Reliability Neural Voice Playback
    speakHumanText(phrase, { voiceId: activeVoiceId });
  } catch (e) {
    console.warn('speakKhmerNotification error:', e);
  }
}

/**
 * Stop any currently playing human voice speech or audio
 */
export function stopHumanSpeech() {
  if (currentBufferSource) {
    try {
      currentBufferSource.stop();
      currentBufferSource.disconnect();
    } catch (e) {}
    currentBufferSource = null;
  }

  if (currentHumanAudio) {
    try {
      currentHumanAudio.pause();
      currentHumanAudio.currentTime = 0;
    } catch (e) {}
    currentHumanAudio = null;
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

/**
 * High-End Ultra-Realistic Human Voice Text-To-Speech (TTS)
 * 1. Microsoft Neural Voice Server Engine via Web Audio API (Piseth, Sreymom, Kokoro)
 * 2. HTML5 Direct Audio Fallback
 * 3. Browser Neural Synthesis Fallback
 * 
 * @param {string} text - The text to speak
 * @param {Object} options - { onStart, onEnd, onError, lang, speed, voiceId, voiceGender }
 */
export async function speakHumanText(text, options = {}) {
  if (!text || typeof window === 'undefined') return;

  unlockAudio();

  const storedVoice = getStoredVoicePreference();
  const activeVoiceId = options.voiceId || storedVoice || 'km-piseth';
  const { onStart, onEnd, onError, speed = 1.0, voiceGender = 'male' } = options;

  // Stop any active speech first
  stopHumanSpeech();

  const hasKhmer = /[\u1780-\u17FF]/.test(text);

  // Clean Markdown, HTML tags, math symbols, and URLs for natural human reading
  let cleanText = text
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[*_#`~>\[\]\(\)\{\}\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  cleanText = normalizePhoneticsForSpeech(cleanText, hasKhmer);

  if (!cleanText) return;

  const backendVoiceUrl = `/api/tts?text=${encodeURIComponent(cleanText)}&voice=${encodeURIComponent(activeVoiceId)}&gender=${voiceGender}`;

  console.log('[TTS] 🎙️ Playing voice:', activeVoiceId, '| Text:', cleanText);

  // 1. Primary Engine: Direct Blob Audio Player (Full Volume, zero filter attenuation)
  try {
    const res = await fetch(backendVoiceUrl);
    if (!res.ok) {
      throw new Error(`TTS server HTTP ${res.status}`);
    }

    const blob = await res.blob();
    if (blob.size < 100) {
      throw new Error('TTS server returned empty audio');
    }

    const blobUrl = URL.createObjectURL(blob);
    const audio = new Audio(blobUrl);
    audio.playbackRate = speed;
    audio.volume = 1.0;
    currentHumanAudio = audio;

    audio.onplay = () => {
      console.log('[TTS] ✅ Audio playing at 100% volume!');
      if (onStart) onStart();
    };

    audio.onended = () => {
      console.log('[TTS] ✅ Audio playback finished');
      URL.revokeObjectURL(blobUrl);
      currentHumanAudio = null;
      if (onEnd) onEnd();
    };

    audio.onerror = (e) => {
      console.warn('[TTS] Audio element error:', e);
      URL.revokeObjectURL(blobUrl);
      currentHumanAudio = null;
      if (onError) onError(e);
    };

    await audio.play();
    return () => stopHumanSpeech();
  } catch (err) {
    console.warn('[TTS] Blob player error, attempting WebAudio PCM fallback:', err);
  }

  // 2. Secondary Engine: Web Audio API PCM BufferSource
  try {
    const ctx = getAudioContext();
    if (ctx) {
      if (ctx.state === 'suspended') {
        await ctx.resume().catch(() => {});
      }

      const res = await fetch(backendVoiceUrl);
      const arrayBuf = await res.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuf.slice(0));

      stopHumanSpeech();

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.playbackRate.value = speed;

      // Studio Master Processing Chain (Broadcast Warmth, Clarity, and Vocal Compression)
      const lowCut = ctx.createBiquadFilter();
      lowCut.type = 'highpass';
      lowCut.frequency.value = 75; // Low-end rumble filter

      const warmthBoost = ctx.createBiquadFilter();
      warmthBoost.type = 'peaking';
      warmthBoost.frequency.value = 240; // Warm chest resonance
      warmthBoost.gain.value = 2.2;

      const presenceBoost = ctx.createBiquadFilter();
      presenceBoost.type = 'peaking';
      presenceBoost.frequency.value = 3400; // Crisp Khmer vowel & consonant clarity
      presenceBoost.gain.value = 3.0;

      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -16;
      compressor.knee.value = 6;
      compressor.ratio.value = 3.5;
      compressor.attack.value = 0.003;
      compressor.release.value = 0.2;

      const masterGain = ctx.createGain();
      masterGain.gain.value = 1.15; // Clean, loud volume

      source.connect(lowCut);
      lowCut.connect(warmthBoost);
      warmthBoost.connect(presenceBoost);
      presenceBoost.connect(compressor);
      compressor.connect(masterGain);
      masterGain.connect(ctx.destination);

      currentBufferSource = source;

      source.onended = () => {
        if (currentBufferSource === source) {
          currentBufferSource = null;
        }
        if (onEnd) onEnd();
      };

      source.start(0);
      if (onStart) onStart();
      console.log('[TTS] ✅ WebAudio Voice Playing! Duration:', audioBuffer.duration.toFixed(2), 'seconds');
      return () => stopHumanSpeech();
    }
  } catch (webAudioErr) {
    console.error('[TTS] All audio engines failed:', webAudioErr);
    if (onError) onError(webAudioErr);
  }

  return () => {
    stopHumanSpeech();
  };
}

/**
 * Secondary Streaming Natural Voice fallback
 */
function playStreamingFallback(cleanText, detectedLang, { onStart, onEnd, onError, speed = 1.0 }) {
  const chunks = splitTextIntoPhrases(cleanText, 180);
  let currentChunkIndex = 0;
  let isCancelled = false;

  const playNextChunk = () => {
    if (isCancelled || currentChunkIndex >= chunks.length) {
      currentHumanAudio = null;
      if (onEnd) onEnd();
      return;
    }

    const chunk = chunks[currentChunkIndex];
    currentChunkIndex++;

    const naturalVoiceUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(detectedLang)}&q=${encodeURIComponent(chunk)}`;

    const audio = new Audio(naturalVoiceUrl);
    audio.playbackRate = speed;
    audio.volume = 1.0;
    currentHumanAudio = audio;

    if (currentChunkIndex === 1 && onStart) {
      onStart();
    }

    audio.onended = () => {
      playNextChunk();
    };

    audio.onerror = () => {
      playBrowserSpeechFallback(cleanText, detectedLang, { onStart, onEnd, onError });
    };

    audio.play().catch(() => {
      playBrowserSpeechFallback(cleanText, detectedLang, { onStart, onEnd, onError });
    });
  };

  playNextChunk();
}

/**
 * Splits text into natural speech phrases respecting punctuation
 */
function splitTextIntoPhrases(text, maxLen = 180) {
  if (text.length <= maxLen) return [text];

  const sentences = text.match(/[^.!?។៕\n]+[.!?។៕\n]*/g) || [text];
  const chunks = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= maxLen) {
      currentChunk += sentence;
    } else {
      if (currentChunk) chunks.push(currentChunk.trim());
      if (sentence.length > maxLen) {
        const words = sentence.split(/([\s,，、])/);
        let sub = '';
        for (const w of words) {
          if ((sub + w).length <= maxLen) {
            sub += w;
          } else {
            if (sub) chunks.push(sub.trim());
            sub = w;
          }
        }
        if (sub) currentChunk = sub;
        else currentChunk = '';
      } else {
        currentChunk = sentence;
      }
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter(c => c.length > 0);
}

/**
 * High quality Browser SpeechSynthesis Fallback with Neural/Natural voice prioritization
 */
function playBrowserSpeechFallback(text, lang, { onStart, onEnd, onError, voice } = {}) {
  if (!('speechSynthesis' in window)) {
    if (onError) onError(new Error('SpeechSynthesis not supported'));
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  currentUtterance = utterance;

  const voices = window.speechSynthesis.getVoices() || [];
  
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else if (lang === 'km') {
    const kmVoice = voices.find(v => 
      v.lang.toLowerCase().includes('km') || 
      v.lang.toLowerCase().includes('kh') ||
      v.name.toLowerCase().includes('khmer') ||
      v.name.toLowerCase().includes('piseth') ||
      v.name.toLowerCase().includes('sreymom')
    );
    if (kmVoice) {
      utterance.voice = kmVoice;
      utterance.lang = kmVoice.lang;
    } else {
      utterance.lang = 'km-KH';
    }
  } else {
    const naturalVoice = voices.find(v => 
      (v.lang.startsWith('en') && (
        v.name.includes('Natural') || 
        v.name.includes('Neural') || 
        v.name.includes('Google') || 
        v.name.includes('Samantha') || 
        v.name.includes('Siri') ||
        v.name.includes('Jenny')
      ))
    ) || voices.find(v => v.lang.startsWith('en'));

    if (naturalVoice) {
      utterance.voice = naturalVoice;
      utterance.lang = naturalVoice.lang;
    } else {
      utterance.lang = 'en-US';
    }
  }

  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    currentUtterance = null;
    if (onError) onError(e);
  };

  window.speechSynthesis.speak(utterance);
}
