import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  Volume2, 
  VolumeX, 
  Sparkles, 
  RotateCcw, 
  X, 
  Trophy, 
  Flame, 
  Award, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Play, 
  Headphones, 
  Layers, 
  ArrowRight, 
  Clock, 
  Globe, 
  ChevronRight,
  Lightbulb,
  Heart,
  Crown,
  Gauge,
  BookOpen,
  Check,
  Target,
  Delete,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { playSound } from '../../utils/audioEffects';
import { englishDictationWords, getEnglishDictationSession } from '../../data/englishDictationData';
import { generateEnglishDictationWithAI, getAIAssistedSpellingHint } from '../../services/geminiService';

const VIRTUAL_KEYBOARD = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']
];

export default function EnglishAudioSpellingModal({ isOpen, onClose }) {
  const { addXP } = useAuth();

  // Mode & Audio Settings
  const [gameMode, setGameMode] = useState('mission'); // 'mission' | 'speed' | 'endless'
  const [soundEffects, setSoundEffects] = useState(true);
  const [autoThreeTimes, setAutoThreeTimes] = useState(true);

  // Game Progress State
  const [gameState, setGameState] = useState('lobby'); // 'lobby' | 'playing' | 'game_over'
  const [wordsList, setWordsList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakPhase, setSpeakPhase] = useState(0); // 0 = idle, 1 = 1st, 2 = 2nd, 3 = 3rd, 4 = go
  const [isWrongShake, setIsWrongShake] = useState(false);
  const [isCorrectGlow, setIsCorrectGlow] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSentence, setShowSentence] = useState(false);

  // Live AI Smart Coach State
  const [aiCoachHint, setAiCoachHint] = useState('');
  const [isAskingAiCoach, setIsAskingAiCoach] = useState(false);

  // Stats & Scoring
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [resultsHistory, setResultsHistory] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);

  // Audio & Timers Refs
  const speechTimerRef = useRef(null);
  const speechTimerRef2 = useRef(null);
  const speechTimerRef3 = useRef(null);
  const speechTimerRef4 = useRef(null);
  const speechTimerRef5 = useRef(null);
  const countdownTimerRef = useRef(null);
  const activeAudioElRef = useRef(null);
  const isClosedRef = useRef(false); // Master kill-switch ONLY when modal is closed

  const currentWordItem = wordsList[currentIndex] || englishDictationWords[0];

  // 🛑 Stop current speech / sound without killing future audio in the modal
  const stopCurrentSpeech = useCallback(() => {
    try {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (activeAudioElRef.current) {
        try {
          activeAudioElRef.current.pause();
          activeAudioElRef.current.currentTime = 0;
          activeAudioElRef.current.src = '';
        } catch(e) {}
        activeAudioElRef.current = null;
      }
      if (speechTimerRef.current) { clearTimeout(speechTimerRef.current); speechTimerRef.current = null; }
      if (speechTimerRef2.current) { clearTimeout(speechTimerRef2.current); speechTimerRef2.current = null; }
      if (speechTimerRef3.current) { clearTimeout(speechTimerRef3.current); speechTimerRef3.current = null; }
      if (speechTimerRef4.current) { clearTimeout(speechTimerRef4.current); speechTimerRef4.current = null; }
      if (speechTimerRef5.current) { clearTimeout(speechTimerRef5.current); speechTimerRef5.current = null; }
      setIsSpeaking(false);
    } catch (e) {
      console.warn('stopCurrentSpeech notice:', e);
    }
  }, []);

  // 🛑 MASTER KILL-SWITCH: Kill all audio and timers when closing modal
  const killAllAudio = useCallback(() => {
    isClosedRef.current = true;
    stopCurrentSpeech();
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setSpeakPhase(0);
    setIsSpeaking(false);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, [stopCurrentSpeech]);

  // Ensure audio state matches modal visibility
  useEffect(() => {
    if (isOpen) {
      isClosedRef.current = false; // Enable audio when modal is opened
    } else {
      killAllAudio(); // Kill audio when modal is closed
    }
    return () => {
      killAllAudio();
    };
  }, [isOpen, killAllAudio]);

  // Sanitize text to only contain clean English-pronounceable characters
  const sanitizeForSpeech = (text) => {
    if (!text) return '';
    return text.replace(/[^a-zA-Z\s.,\-']/g, '').trim();
  };

  // HTML5 Audio Fallback (via standard TTS service) if SpeechSynthesis is unavailable or silent
  const playAudioFallback = useCallback((cleanText, rate = 0.75, onDone) => {
    if (isClosedRef.current) {
      if (onDone) onDone();
      return;
    }
    try {
      const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${encodeURIComponent(cleanText)}`;
      const audio = new Audio(audioUrl);
      activeAudioElRef.current = audio;
      audio.playbackRate = Math.max(0.6, Math.min(1.0, rate));
      setIsSpeaking(true);

      let ended = false;
      const finish = () => {
        if (ended) return;
        ended = true;
        setIsSpeaking(false);
        activeAudioElRef.current = null;
        if (!isClosedRef.current && onDone) onDone();
      };

      audio.onended = finish;
      audio.onerror = () => {
        finish();
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => finish());
      }
    } catch(e) {
      setIsSpeaking(false);
      if (onDone) onDone();
    }
  }, []);

  // Calm & Slow Educational Voice Pronunciation (Speech Rate: 0.75x slow & crystal clear)
  const speakWordSlowly = useCallback((text, customRate = 0.75, onComplete) => {
    // 🛑 KILL-SWITCH: If modal is closed, do NOT speak anything
    if (isClosedRef.current || typeof window === 'undefined') {
      if (onComplete) onComplete();
      return;
    }

    const cleanText = sanitizeForSpeech(text);
    if (!cleanText) {
      if (onComplete) onComplete();
      return;
    }

    stopCurrentSpeech();

    let completed = false;
    const safeComplete = () => {
      if (completed) return;
      completed = true;
      setIsSpeaking(false);
      if (!isClosedRef.current && onComplete) onComplete();
    };

    if (window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'en-US';
        utterance.rate = customRate;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        const voices = window.speechSynthesis.getVoices() || [];
        const preferredVoice = 
          voices.find(v => v.lang === 'en-US' && (v.name.includes('Google') || v.name.includes('Natural'))) ||
          voices.find(v => v.lang === 'en-US' && (v.name.includes('Samantha') || v.name.includes('Jenny') || v.name.includes('David') || v.name.includes('Zira') || v.name.includes('Aria') || v.name.includes('Guy'))) ||
          voices.find(v => v.lang && v.lang.startsWith('en-US')) ||
          voices.find(v => v.lang && v.lang.startsWith('en'));

        if (preferredVoice) utterance.voice = preferredVoice;

        setIsSpeaking(true);

        utterance.onstart = () => {
          setIsSpeaking(true);
        };

        utterance.onend = () => {
          safeComplete();
        };

        utterance.onerror = (err) => {
          console.warn('SpeechSynthesis error, using fallback audio:', err);
          playAudioFallback(cleanText, customRate, safeComplete);
        };

        // Safety timeout to avoid getting stuck if SpeechSynthesis hangs
        const maxDuration = Math.max(3000, cleanText.length * 350);
        speechTimerRef.current = setTimeout(() => {
          if (!completed) {
            safeComplete();
          }
        }, maxDuration);

        // Small delay to ensure cancel() was processed
        setTimeout(() => {
          if (isClosedRef.current) return;
          try {
            window.speechSynthesis.speak(utterance);
          } catch(e) {
            playAudioFallback(cleanText, customRate, safeComplete);
          }
        }, 40);

        return;
      } catch (e) {
        console.warn('SpeechSynthesis exception:', e);
      }
    }

    // Direct fallback if SpeechSynthesis is not supported
    playAudioFallback(cleanText, customRate, safeComplete);
  }, [stopCurrentSpeech, playAudioFallback]);

  // 3-Time Clear Repetition Routine (Earth... Earth... Earth... GO!)
  const startThreeTimeRoutine = useCallback((targetWord) => {
    stopCurrentSpeech();
    if (!targetWord || isClosedRef.current) return;

    const cleanWord = sanitizeForSpeech(targetWord);
    if (!cleanWord) return;

    setSpeakPhase(1); // 1st time (0.78x speed)
    speakWordSlowly(cleanWord, 0.78, () => {
      if (isClosedRef.current) return;
      speechTimerRef2.current = setTimeout(() => {
        if (isClosedRef.current) return;
        setSpeakPhase(2); // 2nd time (0.74x speed)
        speakWordSlowly(cleanWord, 0.74, () => {
          if (isClosedRef.current) return;
          speechTimerRef3.current = setTimeout(() => {
            if (isClosedRef.current) return;
            setSpeakPhase(3); // 3rd time (0.70x deliberate slow phonetics)
            speakWordSlowly(cleanWord, 0.70, () => {
              if (isClosedRef.current) return;
              speechTimerRef4.current = setTimeout(() => {
                if (isClosedRef.current) return;
                setSpeakPhase(4); // GO!
                if (soundEffects) playSound.duelStart();
                speechTimerRef5.current = setTimeout(() => {
                  if (isClosedRef.current) return;
                  setSpeakPhase(0); // Ready for user typing
                }, 1200);
              }, 500);
            });
          }, 1200);
        });
      }, 1200);
    });
  }, [speakWordSlowly, stopCurrentSpeech, soundEffects]);

  // Start Session
  const startGameSession = async () => {
    isClosedRef.current = false;
    stopCurrentSpeech();

    let sessionWords = [];
    try {
      sessionWords = await generateEnglishDictationWithAI('High School Academic English', gameMode === 'mission' ? 10 : 20);
    } catch (e) {
      console.warn('AI generator fallback:', e);
    }

    if (!sessionWords || sessionWords.length === 0) {
      sessionWords = getEnglishDictationSession(gameMode === 'mission' ? 10 : 25, 'all');
    }

    // Auto-random balanced shuffle across all grade levels
    sessionWords = [...sessionWords].sort(() => Math.random() - 0.5);

    setWordsList(sessionWords);
    setCurrentIndex(0);
    setCurrentInput('');
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setLives(3);
    setTotalXpEarned(0);
    setResultsHistory([]);
    setShowHint(false);
    setShowSentence(false);
    setAiCoachHint('');
    setTimeLeft(60);
    setGameState('playing');

    if (soundEffects) playSound.duelStart();

    if (sessionWords[0]) {
      setTimeout(() => {
        if (!isClosedRef.current) {
          startThreeTimeRoutine(sessionWords[0].word);
        }
      }, 500);
    }
  };

  // Speed Timer
  useEffect(() => {
    if (gameState === 'playing' && gameMode === 'speed') {
      countdownTimerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(countdownTimerRef.current);
            finishGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownTimerRef.current);
    }
  }, [gameState, gameMode]);

  // Answer Submission & Check
  const handleCheckAnswer = () => {
    if (!currentWordItem || gameState !== 'playing') return;

    const cleanInput = currentInput.trim();
    if (!cleanInput) return;

    const isCorrect = cleanInput.toLowerCase() === currentWordItem.word.toLowerCase();

    if (isCorrect) {
      if (soundEffects) playSound.correct();
      setIsCorrectGlow(true);

      const wordLen = currentWordItem.word.length;
      const basePoints = wordLen >= 9 ? 60 : wordLen <= 5 ? 30 : 45;
      const streakBonus = streak >= 3 ? 1.5 : streak >= 5 ? 2.0 : 1.0;
      const roundXp = Math.round(basePoints * streakBonus);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak(Math.max(maxStreak, newStreak));
      setScore(prev => prev + 100 * streakBonus);
      setTotalXpEarned(prev => prev + roundXp);
      addXP(roundXp);

      setResultsHistory(prev => [
        ...prev,
        {
          word: currentWordItem.word,
          phonetic: currentWordItem.phonetic,
          meaningKm: currentWordItem.meaningKm,
          userInput: cleanInput,
          isCorrect: true,
          xp: roundXp
        }
      ]);

      setTimeout(() => {
        setIsCorrectGlow(false);
        proceedToNextWord();
      }, 900);

    } else {
      if (soundEffects) playSound.wrong();
      setIsWrongShake(true);
      setStreak(0);

      if (gameMode === 'endless') {
        const nextLives = lives - 1;
        setLives(nextLives);
        if (nextLives <= 0) {
          setTimeout(() => {
            setIsWrongShake(false);
            finishGame();
          }, 800);
          return;
        }
      }

      setResultsHistory(prev => [
        ...prev,
        {
          word: currentWordItem.word,
          phonetic: currentWordItem.phonetic,
          meaningKm: currentWordItem.meaningKm,
          userInput: cleanInput,
          isCorrect: false,
          xp: 0
        }
      ]);

      setTimeout(() => {
        setIsWrongShake(false);
        proceedToNextWord();
      }, 900);
    }
  };

  const proceedToNextWord = () => {
    stopCurrentSpeech();
    setCurrentInput('');
    setShowHint(false);
    setShowSentence(false);
    setAiCoachHint('');

    const nextIndex = currentIndex + 1;
    if (nextIndex >= wordsList.length) {
      finishGame();
    } else {
      setCurrentIndex(nextIndex);
      const nextWord = wordsList[nextIndex];
      if (nextWord) {
        if (autoThreeTimes) {
          startThreeTimeRoutine(nextWord.word);
        } else {
          speakWordSlowly(nextWord.word);
        }
      }
    }
  };

  const finishGame = () => {
    stopCurrentSpeech();
    if (soundEffects) playSound.victory();
    setGameState('game_over');
  };

  // Live AI Coach Advice in Khmer
  const handleAskAiCoach = async () => {
    if (!currentWordItem || isAskingAiCoach) return;
    setIsAskingAiCoach(true);
    try {
      const hint = await getAIAssistedSpellingHint(currentWordItem.word, currentWordItem.meaningKm);
      setAiCoachHint(hint);
    } catch (e) {
      setAiCoachHint(`ពាក្យ «${currentWordItem.word}» មានន័យថា «${currentWordItem.meaningKm}»។ ចងចាំអក្សរដំបូង ${currentWordItem.word[0]} និងព្យាង្គបន្តបន្ទាប់ណា៎!`);
    } finally {
      setIsAskingAiCoach(false);
    }
  };

  // Keyboard Handler
  const handleVirtualKeyPress = (key) => {
    if (gameState !== 'playing') return;

    if (key === 'ENTER') {
      handleCheckAnswer();
    } else if (key === 'BACK' || key === 'BACKSPACE') {
      if (soundEffects) playSound.click();
      setCurrentInput(prev => prev.slice(0, -1));
    } else if (/^[A-Z]$/i.test(key)) {
      if (soundEffects) playSound.click();
      if (currentInput.length < 24) {
        setCurrentInput(prev => prev + key);
      }
    }
  };

  useEffect(() => {
    const handlePhysicalKeyDown = (e) => {
      if (gameState !== 'playing') return;

      if (e.key === 'Enter') {
        e.preventDefault();
        handleCheckAnswer();
      } else if (e.key === 'Backspace') {
        setCurrentInput(prev => prev.slice(0, -1));
      } else if (e.key === 'Escape') {
        killAllAudio();
        if (onClose) onClose();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        if (currentInput.length < 24) {
          setCurrentInput(prev => prev + e.key);
        }
      }
    };

    window.addEventListener('keydown', handlePhysicalKeyDown);
    return () => window.removeEventListener('keydown', handlePhysicalKeyDown);
  }, [gameState, currentInput, currentWordItem, streak, lives, maxStreak, killAllAudio, onClose]);

  const handleCloseModal = () => {
    killAllAudio();
    setGameState('lobby');
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-xl animate-fadeIn font-kantumruy select-none overflow-y-auto">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-[#030a16] rounded-3xl border border-cyan-500/30 shadow-[0_25px_90px_rgba(6,182,212,0.2)] overflow-hidden flex flex-col my-auto max-h-[96vh]">
        
        {/* Subtle Ambient Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* 🌟 TOP HEADER BAR */}
        <div className="relative z-10 bg-[#061224]/95 backdrop-blur-md border-b border-cyan-500/20 px-4 sm:px-6 py-3.5 flex items-center justify-between flex-shrink-0">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-cyan-500/20 border border-cyan-400/30">
              <Headphones className="w-5 h-5 text-cyan-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-xs sm:text-sm text-white font-cinzel tracking-wider uppercase">
                  English Practice: Listen & Spell
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-400/30 text-[9px] font-black text-cyan-300 uppercase tracking-wide font-mono">
                  Smart Audio 3x
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                អនុវត្តស្តាប់ការបញ្ចេញសំឡេង ៣ ដងយឺតៗ និងសរសេរអក្ខរាវិរុទ្ធអង់គ្លេស
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Sound Toggle */}
            <button
              type="button"
              onClick={() => setSoundEffects(!soundEffects)}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
              title={soundEffects ? 'Mute Sound Effects' : 'Enable Sound'}
            >
              {soundEffects ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={handleCloseModal}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-rose-950/50 text-slate-400 hover:text-rose-300 border border-white/10 hover:border-rose-500/30 transition-colors cursor-pointer"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* 🌟 BODY CONTENT BASED ON GAME STATE */}
        <div className="relative z-10 p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col justify-between space-y-6">

          {/* ========================================================= */}
          {/* 1. LOBBY / CONFIGURATION SCREEN */}
          {/* ========================================================= */}
          {gameState === 'lobby' && (
            <div className="space-y-6 animate-fadeIn py-2 max-w-3xl mx-auto w-full text-center">
              
              {/* Header Title */}
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold font-cinzel tracking-wider uppercase">
                  <Radio className="w-3.5 h-3.5" />
                  <span>National English Listening Studio</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  ការអនុវត្តភាសាអង់គ្លេស៖ ស្តាប់ & សរសេរអក្ខរាវិរុទ្ធ
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                  ប្រព័ន្ធបញ្ចេញសំឡេងពាក្យអង់គ្លេស <strong>៣ ដងយឺតៗច្បាស់ៗ (0.75x)</strong> ជួយពង្រឹងការស្តាប់ ការបញ្ចេញសំឡេង និងការសរសេរអក្ខរាវិរុទ្ធបានត្រឹមត្រូវ។
                </p>
              </div>

              {/* 🌟 1. AUTO-RANDOM ADAPTIVE VOCABULARY HIGHLIGHT */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-cyan-500/20 text-left space-y-3 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-cyan-400/15 text-cyan-300 border border-cyan-400/20">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <span className="font-bold text-xs sm:text-sm text-white">
                      ប្រព័ន្ធចម្រុះពាក្យស្វ័យប្រវត្តិ (Auto-Random Adaptive Vocab)
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-[10px] font-mono font-bold text-cyan-300 uppercase">
                    All Levels
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  ប្រព័ន្ធនឹងចម្រុះពាក្យគ្រប់កម្រិត (ពីងាយស្រួល ៤-៥ អក្សរ ដល់កម្រិតបាក់ឌុប ១២+ អក្សរ) ដោយស្វ័យប្រវត្តិ។ ចុចចាប់ផ្តើម ហើយស្តាប់សំឡេងអាន ៣ ដងយឺតៗ!
                </p>
                <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
                    Easy (4-5 letters) <span className="block text-[10px] text-emerald-400/80 font-normal mt-0.5">+300 XP</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-amber-500/30 text-amber-300 text-[11px] font-bold">
                    Medium (6-8 letters) <span className="block text-[10px] text-amber-400/80 font-normal mt-0.5">+450 XP</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-rose-500/30 text-rose-300 text-[11px] font-bold">
                    Advanced (9+ letters) <span className="block text-[10px] text-rose-400/80 font-normal mt-0.5">+600 XP</span>
                  </div>
                </div>
              </div>

              {/* 🌟 2. GAME MODE SELECTION */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  ទម្រង់ប្រកួត (Game Mode):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setGameMode('mission')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      gameMode === 'mission'
                        ? 'bg-cyan-950/50 border-cyan-400 shadow-md text-white'
                        : 'bg-slate-900/60 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-cyan-400" />
                        <span>10-Word Mission</span>
                      </span>
                      <span className="text-[10px] text-amber-400 font-cinzel font-black">+400 XP</span>
                    </div>
                    <p className="text-[11px] text-slate-300">១០ ពាក្យស្តង់ដារថ្នាក់ជាតិ</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGameMode('speed')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      gameMode === 'speed'
                        ? 'bg-cyan-950/50 border-cyan-400 shadow-md text-white'
                        : 'bg-slate-900/60 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>60s Speed Run</span>
                      </span>
                      <span className="text-[10px] text-cyan-400 font-cinzel font-black">60 SEC</span>
                    </div>
                    <p className="text-[11px] text-slate-300">ប្រណាំងល្បឿន ៦០ វិនាទី</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGameMode('endless')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      gameMode === 'endless'
                        ? 'bg-cyan-950/50 border-cyan-400 shadow-md text-white'
                        : 'bg-slate-900/60 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                        <span>Survival Mastery</span>
                      </span>
                      <span className="text-[10px] text-rose-400 font-cinzel font-black">3 LIVES</span>
                    </div>
                    <p className="text-[11px] text-slate-300">លេងរហូតដល់ខុស ៣ ដង</p>
                  </button>
                </div>
              </div>

              {/* 🌟 3. AUTO 3-TIME VOICE TOGGLE */}
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/10 flex items-center justify-between text-left">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-cyan-400" />
                    <span>បញ្ចេញសំឡេងស្វ័យប្រវត្តិ ៣ ដងយឺតៗ (Auto 3x Routine)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    ប្រព័ន្ធនិយាយពាក្យ ៣ ដងយឺតៗច្បាស់ៗ (Earth... Earth... Earth... GO!)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoThreeTimes(!autoThreeTimes)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer relative ${
                    autoThreeTimes ? 'bg-cyan-600' : 'bg-slate-700'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    autoThreeTimes ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* 🌟 4. HACKER / CYBER ARENA START BUTTON */}
              <div className="hacker-button-container w-full pt-1">
                <button
                  type="button"
                  onClick={startGameSession}
                  className="hacker-button w-full justify-center cursor-pointer"
                  data-text="START PRACTICE (LISTEN & SPELL)"
                >
                  <Headphones className="w-5 h-5 fill-current relative z-10 text-cyan-300 animate-pulse" />
                  <span className="relative z-10 font-black text-xs sm:text-sm tracking-widest uppercase">
                    START PRACTICE (LISTEN & SPELL)
                  </span>
                  
                  <div className="neon-frame" />
                  <div className="circuit-traces">
                    <div className="circuit-trace" />
                    <div className="circuit-trace" />
                    <div className="circuit-trace" />
                    <div className="circuit-trace" />
                    <div className="circuit-trace" />
                  </div>
                  <div className="code-fragments">
                    <span className="code-fragment">0xEN</span>
                    <span className="code-fragment">SPELL</span>
                    <span className="code-fragment">AUDIO</span>
                    <span className="code-fragment">3X</span>
                    <span className="code-fragment">100%</span>
                  </div>
                  <div className="interference" />
                  <div className="scan-bars">
                    <div className="scan-bar" />
                    <div className="scan-bar" />
                    <div className="scan-bar" />
                  </div>
                  <div className="text-glow" />
                </button>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* 2. ACTIVE GAMEPLAY ARENA */}
          {/* ========================================================= */}
          {gameState === 'playing' && currentWordItem && (
            <div className="space-y-5 animate-fadeIn flex flex-col justify-between flex-1">
              
              {/* Top HUD: Round Progress, Timer, Streak, Lives & Score */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-slate-900/80 border border-white/10 text-xs">
                
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-300 font-mono font-bold border border-cyan-400/30">
                    WORD {currentIndex + 1} / {wordsList.length}
                  </span>
                  
                  {/* Dynamic Word Length Badge */}
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider border ${
                    currentWordItem.word.length >= 9
                      ? 'bg-rose-500/15 text-rose-300 border-rose-400/30'
                      : currentWordItem.word.length <= 5
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30'
                        : 'bg-amber-500/15 text-amber-300 border-amber-400/30'
                  }`}>
                    {currentWordItem.word.length >= 9 
                      ? 'ADVANCED (9+ LETTERS)' 
                      : currentWordItem.word.length <= 5 
                        ? 'EASY (4-5 LETTERS)' 
                        : 'MEDIUM (6-8 LETTERS)'}
                  </span>

                  {gameMode === 'speed' && (
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 font-mono font-bold flex items-center gap-1 border border-amber-400/30">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{timeLeft}s</span>
                    </span>
                  )}
                  {gameMode === 'endless' && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-950 border border-white/10">
                      {[1, 2, 3].map((h) => (
                        <Heart
                          key={h}
                          className={`w-3.5 h-3.5 ${h <= lives ? 'text-rose-500 fill-rose-500' : 'text-slate-700'}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Streak Multiplier */}
                  {streak > 1 && (
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold text-xs animate-pulse">
                      <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>STREAK x{streak}</span>
                    </div>
                  )}

                  {/* Total Score & XP */}
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-amber-400 font-bold text-xs sm:text-sm">
                      {score} PTS
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[11px] border border-emerald-400/30">
                      +{totalXpEarned} XP
                    </span>
                  </div>
                </div>

              </div>

              {/* CENTER STAGE: AUDIO CONSOLE & VISUALIZER */}
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 border border-cyan-500/20 text-center space-y-4 shadow-xl relative overflow-hidden">
                
                {/* 3-Step Listening Progress Stepper */}
                <div className="grid grid-cols-4 gap-1.5 sm:gap-2 max-w-xl mx-auto">
                  {[
                    { step: 1, label: '1st Listen (0.78x)' },
                    { step: 2, label: '2nd Listen (0.74x)' },
                    { step: 3, label: '3rd Listen (0.70x)' },
                    { step: 4, label: 'Ready to Spell' }
                  ].map((s) => {
                    const isActive = speakPhase === s.step;
                    const isPassed = speakPhase > s.step || (speakPhase === 0 && s.step === 4);
                    return (
                      <div
                        key={s.step}
                        className={`py-1.5 px-2 rounded-xl text-[10px] font-mono font-bold border transition-all duration-200 ${
                          isActive
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                            : isPassed
                              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                              : 'bg-slate-950/40 border-white/5 text-slate-500'
                        }`}
                      >
                        <div className="truncate">{s.label}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Animated Audio Hub Disc */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full mx-auto relative flex items-center justify-center mt-2">
                  <div className={`absolute inset-0 rounded-full border border-cyan-400/30 ${isSpeaking ? 'animate-ping opacity-50' : 'opacity-15'}`} />
                  <div className={`absolute -inset-2 rounded-full border border-blue-500/20 ${isSpeaking ? 'animate-pulse' : 'opacity-10'}`} />
                  
                  <button
                    type="button"
                    onClick={() => speakWordSlowly(currentWordItem.word, 0.75)}
                    disabled={isSpeaking}
                    className="w-full h-full rounded-full bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-700 hover:from-cyan-500 hover:to-blue-500 text-white flex flex-col items-center justify-center shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer border border-cyan-300/40"
                    title="Click to Listen Slowly"
                  >
                    <Volume2 className={`w-7 h-7 sm:w-8 sm:h-8 ${isSpeaking ? 'animate-pulse text-amber-300' : 'text-white'}`} />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider mt-1 text-cyan-100">
                      {isSpeaking ? 'Speaking...' : '0.75x Audio'}
                    </span>
                  </button>
                </div>

                {/* Frequency Bar Visualizer */}
                <div className="flex items-center justify-center gap-1.5 h-5">
                  {[10, 20, 16, 26, 18, 24, 12, 19, 28, 14, 22, 15].map((h, i) => (
                    <span
                      key={i}
                      className={`w-1 rounded-full bg-cyan-400 transition-all duration-150 ${
                        isSpeaking ? 'opacity-90' : 'opacity-20'
                      }`}
                      style={{
                        height: isSpeaking ? `${Math.max(5, (h * Math.sin(Date.now() / 150 + i)) % 26)}px` : '4px'
                      }}
                    />
                  ))}
                </div>

                {/* Streamlined Audio Controls (Repeat 3x & Slow 0.6x) */}
                <div className="flex items-center justify-center gap-2 max-w-xs mx-auto pt-1">
                  <button
                    type="button"
                    onClick={() => startThreeTimeRoutine(currentWordItem.word)}
                    disabled={isSpeaking}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-xs active:scale-95"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Repeat 3x</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => speakWordSlowly(currentWordItem.word, 0.60)}
                    disabled={isSpeaking}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-amber-500/30 text-amber-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-xs active:scale-95"
                  >
                    <Gauge className="w-3.5 h-3.5 text-amber-400" />
                    <span>Slow 0.6x</span>
                  </button>
                </div>

                {/* Clue / Word Details Footer */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300 text-[10.5px]">
                      [{currentWordItem.partOfSpeech.toUpperCase()}]
                    </span>
                    <span>LENGTH: {currentWordItem.word.length} LETTERS</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowHint(!showHint)}
                    className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{showHint ? 'Hide Meaning' : 'View Meaning'}</span>
                  </button>
                </div>

                {/* Revealed Hint */}
                {showHint && (
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-amber-400/30 text-left text-xs space-y-0.5 animate-fadeIn">
                    <p className="text-amber-200 font-bold">
                      Meaning: <span className="text-white">{currentWordItem.meaningKm}</span>
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      {currentWordItem.clue} • First Letter: <strong className="text-amber-300 font-mono">{currentWordItem.word[0]}...</strong>
                    </p>
                  </div>
                )}

              </div>

              {/* 🌟 USER SPELLING INPUT DISPLAY (RESPONSIVE LETTER TILES) */}
              <div className={`p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border-2 transition-all duration-200 ${
                isCorrectGlow 
                  ? 'border-emerald-400 bg-emerald-950/30 shadow-lg shadow-emerald-500/20' 
                  : isWrongShake 
                    ? 'border-rose-500 bg-rose-950/30 animate-shake' 
                    : 'border-white/10 focus-within:border-cyan-400'
              }`}>
                
                <div className="flex flex-col items-center gap-3">
                  
                  {/* Slots display - scales smoothly on mobile screens */}
                  <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 max-w-full">
                    {Array.from({ length: Math.max(currentWordItem.word.length, currentInput.length) }).map((_, idx) => {
                      const char = currentInput[idx] || '';
                      const totalLen = Math.max(currentWordItem.word.length, currentInput.length);
                      const sizeClasses = totalLen >= 10 
                        ? 'w-7 sm:w-9 h-9 sm:h-11 text-sm sm:text-lg' 
                        : totalLen >= 8 
                          ? 'w-8 sm:w-10 h-10 sm:h-12 text-base sm:text-xl' 
                          : 'w-9 sm:w-12 h-11 sm:h-14 text-lg sm:text-2xl';

                      return (
                        <div
                          key={idx}
                          className={`${sizeClasses} rounded-xl border-2 flex items-center justify-center font-mono font-black transition-all ${
                            char
                              ? 'border-cyan-400 bg-cyan-950/50 text-cyan-200 shadow-sm scale-105'
                              : idx === currentInput.length
                                ? 'border-amber-400 bg-white/5 text-amber-300 animate-pulse'
                                : 'border-slate-800 bg-slate-950/60 text-slate-600'
                          }`}
                        >
                          {char ? char.toUpperCase() : ''}
                        </div>
                      );
                    })}
                  </div>

                  {/* Phonetics & Feedback Text */}
                  {isCorrectGlow && (
                    <div className="text-emerald-300 font-bold text-xs sm:text-sm flex items-center gap-1.5 animate-pulse">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Correct! {currentWordItem.phonetic} • {currentWordItem.meaningKm}</span>
                    </div>
                  )}

                  {isWrongShake && (
                    <div className="text-rose-300 font-bold text-xs flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                      <span>Not correct. Word was: <strong className="text-white underline font-mono">{currentWordItem.word}</strong> ({currentWordItem.meaningKm})</span>
                    </div>
                  )}

                  {/* Submission Action Buttons */}
                  <div className="w-full flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setCurrentInput('')}
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Clear</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCheckAnswer}
                      disabled={!currentInput.trim()}
                      className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-40"
                    >
                      <span>Submit Answer (Enter)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>

              {/* 🌟 VIRTUAL KEYBOARD (VISIBLE ON MOBILE / TABLET ONLY, HIDDEN ON PC / LAPTOP) */}
              <div className="block md:hidden w-full max-w-md mx-auto space-y-1 pt-0.5 select-none">
                {/* Row 1: Q W E R T Y U I O P */}
                <div className="flex items-center justify-center gap-1 w-full">
                  {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => handleVirtualKeyPress(k)}
                      className="flex-1 h-11 bg-slate-800 active:bg-cyan-600 text-white font-mono font-black text-sm rounded-lg border border-slate-700/80 shadow-md flex items-center justify-center transition-transform active:scale-90"
                    >
                      {k}
                    </button>
                  ))}
                </div>

                {/* Row 2: A S D F G H J K L */}
                <div className="flex items-center justify-center gap-1 w-full px-2">
                  {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => handleVirtualKeyPress(k)}
                      className="flex-1 h-11 bg-slate-800 active:bg-cyan-600 text-white font-mono font-black text-sm rounded-lg border border-slate-700/80 shadow-md flex items-center justify-center transition-transform active:scale-90"
                    >
                      {k}
                    </button>
                  ))}
                </div>

                {/* Row 3: ENTER Z X C V B N M BACK */}
                <div className="flex items-center justify-center gap-1 w-full">
                  <button
                    type="button"
                    onClick={() => handleVirtualKeyPress('ENTER')}
                    className="flex-[1.4] h-11 bg-emerald-600 active:bg-emerald-500 text-white font-mono font-black text-[11px] rounded-lg shadow-md flex items-center justify-center transition-transform active:scale-90"
                  >
                    ENTER
                  </button>
                  {['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => handleVirtualKeyPress(k)}
                      className="flex-1 h-11 bg-slate-800 active:bg-cyan-600 text-white font-mono font-black text-sm rounded-lg border border-slate-700/80 shadow-md flex items-center justify-center transition-transform active:scale-90"
                    >
                      {k}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleVirtualKeyPress('BACK')}
                    className="flex-[1.2] h-11 bg-slate-700 active:bg-rose-600 text-white rounded-lg border border-slate-600 shadow-md flex items-center justify-center transition-transform active:scale-90"
                    title="Backspace"
                  >
                    <Delete className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* 💻 DESKTOP / PC KEYBOARD HINT (VISIBLE ON LAPTOP / PC, HIDDEN ON MOBILE) */}
              <div className="hidden md:flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-slate-900/60 border border-white/5 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-white/10 text-cyan-300 font-bold">A-Z</span> Type on keyboard
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-white/10 text-emerald-300 font-bold">ENTER</span> Submit
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-white/10 text-rose-300 font-bold">BACKSPACE</span> Delete
                </span>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* 3. GAME OVER / VICTORY SUMMARY REVIEW SCREEN */}
          {/* ========================================================= */}
          {gameState === 'game_over' && (
            <div className="space-y-6 animate-fadeIn py-2 max-w-2xl mx-auto w-full text-center">
              
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center mx-auto shadow-xl shadow-amber-400/20">
                <Trophy className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-black text-white font-cinzel">
                  PRACTICE COMPLETED
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  អ្នកបានបញ្ចប់ការស្តាប់ និងសរសេរអក្ខរាវិរុទ្ធអង់គ្លេសប្រកបដោយជោគជ័យ!
                </p>
              </div>

              {/* Score Highlights Bento Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center font-mono">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Total Score</span>
                  <span className="text-lg sm:text-xl font-black text-amber-400">{score}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">XP Earned</span>
                  <span className="text-lg sm:text-xl font-black text-emerald-400">+{totalXpEarned} XP</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Max Streak</span>
                  <span className="text-lg sm:text-xl font-black text-orange-400">x{maxStreak}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Accuracy</span>
                  <span className="text-lg sm:text-xl font-black text-cyan-400">
                    {resultsHistory.length > 0 
                      ? Math.round((resultsHistory.filter(r => r.isCorrect).length / resultsHistory.length) * 100) 
                      : 100}%
                  </span>
                </div>
              </div>

              {/* Word List Review Table with Clickable Audio Play */}
              <div className="space-y-2 text-left">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between font-mono">
                  <span>Vocabulary Review:</span>
                  <span className="text-[11px] text-cyan-400 font-normal">Click speaker icon to listen again</span>
                </h4>

                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {resultsHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all ${
                        item.isCorrect 
                          ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200' 
                          : 'bg-rose-950/30 border-rose-500/30 text-rose-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          type="button"
                          onClick={() => speakWordSlowly(item.word, 0.75)}
                          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center flex-shrink-0 cursor-pointer"
                          title="Play Audio"
                        >
                          <Volume2 className="w-4 h-4 text-cyan-300" />
                        </button>
                        <div className="min-w-0">
                          <div className="font-bold text-sm text-white flex items-center gap-2">
                            <span>{item.word}</span>
                            <span className="text-[11px] font-mono text-cyan-300 font-normal">{item.phonetic}</span>
                          </div>
                          <p className="text-[11px] text-slate-300 truncate">
                            {item.meaningKm}
                          </p>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                          item.isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {item.isCorrect ? `+${item.xp} XP` : 'Mistake'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={startGameSession}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Practice Again</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGameState('lobby')}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/20"
                >
                  <span>Return to Menu</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>,
    document.body
  );
}
