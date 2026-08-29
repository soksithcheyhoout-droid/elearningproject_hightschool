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
  Bot,
  Gauge,
  BookOpen,
  Check
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

const DIFFICULTY_LEVELS = [
  {
    id: 'low',
    nameEn: 'Low (Beginner)',
    nameKm: 'កម្រិតទាប (ដំបូង)',
    descKm: 'ពាក្យខ្លីៗ ៤-៦ អក្សរ ងាយស្រួលស្តាប់ (Earth, Water, Space...)',
    badgeColor: 'from-emerald-500 to-teal-500',
    borderColor: 'border-emerald-500/60',
    activeGlow: 'shadow-[0_0_25px_rgba(16,185,129,0.35)] bg-emerald-950/40 border-emerald-400',
    textColor: 'text-emerald-300',
    xpReward: 300
  },
  {
    id: 'medium',
    nameEn: 'Medium (Standard)',
    nameKm: 'កម្រិតមធ្យម (ទូទៅ)',
    descKm: 'ពាក្យវិទ្យាសាស្ត្រ ៦-៩ អក្សរ (Gravity, Climate, Oxygen...)',
    badgeColor: 'from-amber-500 to-orange-500',
    borderColor: 'border-amber-500/60',
    activeGlow: 'shadow-[0_0_25px_rgba(245,158,11,0.35)] bg-amber-950/40 border-amber-400',
    textColor: 'text-amber-300',
    xpReward: 450
  },
  {
    id: 'hard',
    nameEn: 'Hard (BacII Advanced)',
    nameKm: 'កម្រិតខ្ពស់ (បាក់ឌុប)',
    descKm: 'ពាក្យស៊ីជម្រៅ ៨-១៤ អក្សរ (Photosynthesis, Biodiversity...)',
    badgeColor: 'from-rose-500 to-red-600',
    borderColor: 'border-rose-500/60',
    activeGlow: 'shadow-[0_0_25px_rgba(244,63,94,0.35)] bg-rose-950/40 border-rose-400',
    textColor: 'text-rose-300',
    xpReward: 600
  }
];

export default function EnglishAudioSpellingModal({ isOpen, onClose }) {
  const { addXP } = useAuth();

  // Difficulty & Settings
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium'); // 'low' | 'medium' | 'hard'
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
    const topicPrompt = selectedDifficulty === 'low'
      ? 'Earth, Space, Nature, Everyday high school vocabulary'
      : selectedDifficulty === 'hard'
        ? 'Grade 12 BacII National English Exam Academic Science and Literature'
        : 'Science, Biology, Physics, and High School Academic Vocabulary';

    try {
      sessionWords = await generateEnglishDictationWithAI(topicPrompt, gameMode === 'mission' ? 10 : 20, selectedDifficulty);
    } catch (e) {
      console.warn('AI generator fallback:', e);
    }

    if (!sessionWords || sessionWords.length === 0) {
      sessionWords = getEnglishDictationSession(gameMode === 'mission' ? 10 : 25, 'all');
      if (selectedDifficulty === 'low') {
        sessionWords = sessionWords.filter(w => w.word.length <= 6);
      } else if (selectedDifficulty === 'hard') {
        sessionWords = sessionWords.filter(w => w.word.length >= 8);
      }
      if (sessionWords.length < 5) {
        sessionWords = getEnglishDictationSession(10);
      }
    }

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

      const streakBonus = streak >= 3 ? 1.5 : streak >= 5 ? 2.0 : 1.0;
      const basePoints = selectedDifficulty === 'hard' ? 60 : selectedDifficulty === 'low' ? 30 : 45;
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
      <div className="relative w-full max-w-4xl bg-[#050f1d] rounded-3xl border-2 border-cyan-500/40 shadow-[0_25px_90px_rgba(6,182,212,0.25)] overflow-hidden flex flex-col my-auto max-h-[96vh]">
        
        {/* Ambient Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#005baa_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 🌟 TOP HEADER BAR */}
        <div className="relative z-10 bg-[#001730]/95 backdrop-blur-md border-b border-cyan-500/20 px-4 sm:px-6 py-3.5 flex items-center justify-between flex-shrink-0">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/30 border border-cyan-300/40">
              <Headphones className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-white font-cinzel tracking-wider">
                  ENGLISH PRACTICE: LISTEN AND SPELL
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-400/20 border border-cyan-400/40 text-[9.5px] font-black text-cyan-300 uppercase tracking-wide">
                  SMART AUDIO 3X
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                អនុវត្តស្តាប់ការបញ្ចេញសំឡេង ៣ ដងយឺតៗ & សរសេរអក្ខរាវិរុទ្ធអង់គ្លេសដណ្តើម XP
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Sound Toggle */}
            <button
              type="button"
              onClick={() => setSoundEffects(!soundEffects)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
              title={soundEffects ? 'Mute Sound Effects' : 'Enable Sound'}
            >
              {soundEffects ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Close Button with Guaranteed Audio Stop */}
            <button
              type="button"
              onClick={handleCloseModal}
              className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-white/10 hover:border-rose-500/40 transition-colors cursor-pointer"
              title="Close Modal & Stop Voice"
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
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold font-cinzel tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>NATIONAL ENGLISH LISTENING & SPELLING ARENA</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  ការអនុវត្តភាសាអង់គ្លេស៖ ស្តាប់ & សរសេរអក្ខរាវិរុទ្ធ
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                  ប្រព័ន្ធបញ្ចេញសំឡេងពាក្យអង់គ្លេស <strong>៣ ដងយឺតៗច្បាស់ៗ (ដូចជា Earth... Earth... Earth... GO!)</strong> ដើម្បីឱ្យប្អូនស្តាប់ទាន់ រួចវាយអក្សរចូលឱ្យបានត្រឹមត្រូវ!
                </p>
              </div>

              {/* 🌟 1. DIFFICULTY SELECTION CARDS (LOW, MEDIUM, HARD) */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>ជ្រើសរើសកម្រិតលំបាក (Choose Difficulty Level):</span>
                  <span className="text-cyan-400 text-[11px] font-mono">3 NATIONAL TIERS</span>
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {DIFFICULTY_LEVELS.map((level) => {
                    const isSelected = selectedDifficulty === level.id;
                    return (
                      <button
                        key={level.id}
                        type="button"
                        onClick={() => setSelectedDifficulty(level.id)}
                        className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                          isSelected
                            ? `${level.activeGlow} scale-102`
                            : 'bg-slate-900/60 border-white/10 hover:border-white/20 text-slate-400'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`font-black text-sm sm:text-base ${isSelected ? level.textColor : 'text-white'}`}>
                              {level.nameKm}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-amber-400/15 border border-amber-400/30 text-[10px] font-mono font-black text-amber-300">
                              +{level.xpReward} XP
                            </span>
                          </div>
                          <p className="text-[11.5px] text-slate-300 leading-snug">
                            {level.descKm}
                          </p>
                        </div>
                        {isSelected && (
                          <div className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${level.badgeColor}`} />
                        )}
                      </button>
                    );
                  })}
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
                        ? 'bg-cyan-950/70 border-cyan-400 shadow-lg shadow-cyan-500/20 text-white'
                        : 'bg-slate-900/60 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">🎯 10-Word Mission</span>
                      <span className="text-[10px] text-amber-400 font-cinzel font-black">+400 XP</span>
                    </div>
                    <p className="text-[11px] text-slate-300">១០ ពាក្យស្តង់ដារថ្នាក់ជាតិ</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGameMode('speed')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      gameMode === 'speed'
                        ? 'bg-cyan-950/70 border-cyan-400 shadow-lg shadow-cyan-500/20 text-white'
                        : 'bg-slate-900/60 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">⚡ Speed Blitz</span>
                      <span className="text-[10px] text-cyan-400 font-cinzel font-black">60 SEC</span>
                    </div>
                    <p className="text-[11px] text-slate-300">ប្រណាំងល្បឿន ៦០ វិនាទី</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGameMode('endless')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      gameMode === 'endless'
                        ? 'bg-cyan-950/70 border-cyan-400 shadow-lg shadow-cyan-500/20 text-white'
                        : 'bg-slate-900/60 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">♾️ Endless Mastery</span>
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
                    autoThreeTimes ? 'bg-cyan-500' : 'bg-slate-700'
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
                  data-text="🎧 ចាប់ផ្តើមអនុវត្ត (START LISTEN & SPELL)"
                >
                  <Headphones className="w-5 h-5 fill-current relative z-10 text-cyan-300 animate-pulse" />
                  <span className="relative z-10 font-black text-sm sm:text-base tracking-wide">
                    ចាប់ផ្តើមអនុវត្ត (START LISTEN & SPELL)
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
                  <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono font-black border border-cyan-400/30">
                    WORD {currentIndex + 1} / {wordsList.length}
                  </span>
                  
                  <span className={`px-2 py-0.5 rounded-md text-[10.5px] font-black uppercase border ${
                    selectedDifficulty === 'hard'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                      : selectedDifficulty === 'low'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                  }`}>
                    {selectedDifficulty.toUpperCase()}
                  </span>

                  {gameMode === 'speed' && (
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-mono font-black flex items-center gap-1 border border-amber-400/30">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{timeLeft}s</span>
                    </span>
                  )}
                  {gameMode === 'endless' && (
                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((h) => (
                        <Heart
                          key={h}
                          className={`w-4 h-4 ${h <= lives ? 'text-rose-500 fill-rose-500' : 'text-slate-700'}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Streak Multiplier */}
                  {streak > 1 && (
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500/30 to-orange-500/30 border border-amber-400/40 text-amber-300 font-black text-xs animate-bounce">
                      <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>STREAK x{streak}</span>
                    </div>
                  )}

                  {/* Total Score & XP */}
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-amber-400 font-black text-xs sm:text-sm">
                      {score} PTS
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[11px] border border-emerald-400/30">
                      +{totalXpEarned} XP
                    </span>
                  </div>
                </div>

              </div>

              {/* CENTER STAGE: AI VOICE SOUNDWAVE & SLOW REPETITION CONTROLS */}
              <div className="p-6 rounded-3xl bg-gradient-to-b from-[#071933]/90 via-[#0a1f3d]/80 to-[#040e1e]/90 border border-cyan-500/30 text-center space-y-4 shadow-xl relative overflow-hidden">
                
                {/* 3-Time Speak Phase Banner Alert */}
                {speakPhase > 0 && (
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
                    <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg animate-pulse ${
                      speakPhase === 4 
                        ? 'bg-emerald-500 text-slate-950 font-cinzel text-sm scale-110' 
                        : 'bg-cyan-500 text-slate-950'
                    }`}>
                      <Volume2 className="w-3.5 h-3.5" />
                      {speakPhase === 1 && '🗣️ លើកទី ១ (1st Time)'}
                      {speakPhase === 2 && '🗣️ លើកទី ២ (2nd Time)'}
                      {speakPhase === 3 && '🗣️ លើកទី ៣ យឺតៗ (3rd Time)'}
                      {speakPhase === 4 && '🚀 GO! TYPE THE WORD NOW! (វាយពាក្យ!)'}
                    </span>
                  </div>
                )}

                {/* Animated Audio Soundwave Waves */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full mx-auto relative flex items-center justify-center mt-2">
                  <div className={`absolute inset-0 rounded-full border-2 border-cyan-400/40 ${isSpeaking ? 'animate-ping opacity-60' : 'opacity-20'}`} />
                  <div className={`absolute -inset-3 rounded-full border border-blue-400/30 ${isSpeaking ? 'animate-pulse' : 'opacity-10'}`} />
                  
                  <button
                    type="button"
                    onClick={() => speakWordSlowly(currentWordItem.word, 0.75)}
                    disabled={isSpeaking}
                    className="w-full h-full rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white flex flex-col items-center justify-center shadow-xl shadow-cyan-500/30 active:scale-95 transition-all cursor-pointer border-2 border-cyan-300"
                    title="Click to Listen Slowly Again"
                  >
                    <Volume2 className={`w-8 h-8 ${isSpeaking ? 'animate-bounce text-amber-300' : 'text-white'}`} />
                    <span className="text-[9px] font-black uppercase tracking-wider mt-1 text-cyan-100">
                      {isSpeaking ? 'SPEAKING...' : 'LISTEN 0.75X'}
                    </span>
                  </button>
                </div>

                {/* Frequency Bar Visualizer */}
                <div className="flex items-center justify-center gap-1.5 h-6">
                  {[12, 24, 18, 30, 20, 28, 14, 22, 32, 16, 26, 15].map((h, i) => (
                    <span
                      key={i}
                      className={`w-1 rounded-full bg-gradient-to-t from-cyan-500 to-blue-300 transition-all duration-150 ${
                        isSpeaking ? 'opacity-100' : 'opacity-25'
                      }`}
                      style={{
                        height: isSpeaking ? `${Math.max(6, (h * Math.sin(Date.now() / 150 + i)) % 32)}px` : '6px'
                      }}
                    />
                  ))}
                </div>

                {/* Audio Helper Actions (Repeat 3x, Slow 0.60x, Phonics, Sentence, AI Coach) */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  
                  <button
                    type="button"
                    onClick={() => startThreeTimeRoutine(currentWordItem.word)}
                    disabled={isSpeaking}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>បញ្ចេញសំឡេង ៣ ដង (Repeat 3x)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => speakWordSlowly(currentWordItem.word, 0.60)}
                    disabled={isSpeaking}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <span>🐢 សំឡេងយឺតបំផុត (Slow 0.6x)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const letters = currentWordItem.word.split('').join(' . ');
                      speakWordSlowly(letters, 0.75);
                    }}
                    disabled={isSpeaking}
                    className="px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-400/40 text-purple-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <span>🔤 អក្ខរាវិរុទ្ធ (Spelling)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowSentence(true);
                      speakWordSlowly(currentWordItem.exampleEn, 0.75);
                    }}
                    disabled={isSpeaking}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>លឺឧទាហរណ៍ (Sentence)</span>
                  </button>

                  {/* Smart Coach Hint Button */}
                  <button
                    type="button"
                    onClick={handleAskAiCoach}
                    disabled={isAskingAiCoach || isSpeaking}
                    className="px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/40 text-indigo-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Bot className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{isAskingAiCoach ? 'កំពុងគិត...' : '🤖 ជំនួយពន្យល់ (Smart Hint)'}</span>
                  </button>

                </div>

                {/* AI Smart Coach Hint Box */}
                {aiCoachHint && (
                  <div className="p-3 rounded-2xl bg-indigo-950/50 border border-indigo-500/40 text-left text-xs space-y-1 animate-fadeIn">
                    <div className="flex items-center justify-between text-indigo-300 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Bot className="w-4 h-4 text-indigo-400" />
                        <span>លោកគ្រូ AI (Smart Coach) ៖</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => speakWordSlowly(aiCoachHint, 0.85)}
                        className="text-[11px] text-cyan-300 hover:underline cursor-pointer"
                      >
                        🔊 ស្តាប់សំឡេង
                      </button>
                    </div>
                    <p className="text-slate-200 leading-relaxed">
                      {aiCoachHint}
                    </p>
                  </div>
                )}

                {/* Example Sentence Box if clicked */}
                {showSentence && (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-left text-xs space-y-1 animate-fadeIn">
                    <p className="font-bold text-emerald-200">
                      📝 {currentWordItem.exampleEn}
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      {currentWordItem.exampleKm}
                    </p>
                  </div>
                )}

                {/* Clue / Meaning Drawer */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-white/10 text-slate-300 font-mono text-[10.5px]">
                      [{currentWordItem.partOfSpeech.toUpperCase()}]
                    </span>
                    <span>ប្រវែងពាក្យ៖ {currentWordItem.word.length} អក្សរ</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowHint(!showHint)}
                    className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{showHint ? 'លាក់តម្រុយ (Hide)' : 'មើលតម្រុយន័យ (Hint)'}</span>
                  </button>
                </div>

                {/* Revealed Hint */}
                {showHint && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-left text-xs space-y-0.5 animate-fadeIn">
                    <p className="text-amber-200 font-bold">
                      💡 អត្ថន័យ៖ <span className="text-white">{currentWordItem.meaningKm}</span>
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      {currentWordItem.clue} • អក្សរដំបូង៖ <strong className="text-amber-300">{currentWordItem.word[0]}...</strong>
                    </p>
                  </div>
                )}

              </div>

              {/* 🌟 USER SPELLING INPUT DISPLAY (BIG LETTER SLOTS) */}
              <div className={`p-4 rounded-2xl bg-slate-900 border-2 transition-all duration-200 ${
                isCorrectGlow 
                  ? 'border-emerald-400 bg-emerald-950/40 shadow-xl shadow-emerald-500/20' 
                  : isWrongShake 
                    ? 'border-rose-500 bg-rose-950/40 animate-shake' 
                    : 'border-white/15 focus-within:border-cyan-400'
              }`}>
                
                <div className="flex flex-col items-center gap-3">
                  
                  {/* Slots display */}
                  <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                    {Array.from({ length: Math.max(currentWordItem.word.length, currentInput.length) }).map((_, idx) => {
                      const char = currentInput[idx] || '';
                      return (
                        <div
                          key={idx}
                          className={`w-9 h-11 sm:w-11 sm:h-13 rounded-xl border-2 flex items-center justify-center font-mono text-lg sm:text-2xl font-black transition-all ${
                            char
                              ? 'border-cyan-400 bg-cyan-950/60 text-cyan-200 shadow-md scale-105'
                              : idx === currentInput.length
                                ? 'border-amber-400 bg-white/5 text-amber-300 animate-pulse'
                                : 'border-slate-700 bg-slate-800/50 text-slate-500'
                          }`}
                        >
                          {char ? char.toUpperCase() : ''}
                        </div>
                      );
                    })}
                  </div>

                  {/* Phonetics & Feedback Text */}
                  {isCorrectGlow && (
                    <div className="text-emerald-300 font-black text-sm flex items-center gap-1.5 animate-bounce">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>ត្រឹមត្រូវណាស់! {currentWordItem.phonetic} • {currentWordItem.meaningKm}</span>
                    </div>
                  )}

                  {isWrongShake && (
                    <div className="text-rose-300 font-bold text-xs flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" />
                      <span>អក្ខរាវិរុទ្ធមិនទាន់ត្រឹមត្រូវទេ! ពាក្យពិត៖ <strong className="text-white underline">{currentWordItem.word}</strong> ({currentWordItem.meaningKm})</span>
                    </div>
                  )}

                  {/* Submission Action Buttons */}
                  <div className="w-full flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setCurrentInput('')}
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      លុបទាំងអស់ (Clear)
                    </button>

                    <button
                      type="button"
                      onClick={handleCheckAnswer}
                      disabled={!currentInput.trim()}
                      className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-40"
                    >
                      <span>បញ្ជាក់ចម្លើយ (Submit / Enter)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>

              {/* 🌟 ON-SCREEN TOUCH VIRTUAL KEYBOARD (FOR MOBILE / TABLET) */}
              <div className="space-y-1.5 max-w-xl mx-auto w-full pt-1">
                {VIRTUAL_KEYBOARD.map((row, rIdx) => (
                  <div key={rIdx} className="flex items-center justify-center gap-1 sm:gap-1.5">
                    {row.map((key) => {
                      const isSpecial = key === 'ENTER' || key === 'BACK';
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleVirtualKeyPress(key)}
                          className={`rounded-lg sm:rounded-xl font-bold font-mono transition-all active:scale-90 cursor-pointer ${
                            isSpecial
                              ? key === 'ENTER'
                                ? 'px-3 sm:px-4 py-2 sm:py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] sm:text-xs font-black shadow-md'
                                : 'px-2.5 sm:px-3.5 py-2 sm:py-2.5 bg-rose-600/80 hover:bg-rose-500 text-white text-[10px] sm:text-xs'
                              : 'w-7 sm:w-10 h-9 sm:h-11 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm border border-white/10 shadow-xs'
                          }`}
                        >
                          {key === 'BACK' ? '⌫' : key}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* 3. GAME OVER / VICTORY SUMMARY REVIEW SCREEN */}
          {/* ========================================================= */}
          {gameState === 'game_over' && (
            <div className="space-y-6 animate-fadeIn py-2 max-w-2xl mx-auto w-full text-center">
              
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center mx-auto shadow-2xl shadow-amber-400/30 animate-bounce">
                <Trophy className="w-10 h-10" />
              </div>

              <div className="space-y-1.5">
                <h2 className="text-2xl sm:text-3xl font-black text-white font-moul">
                  អបអរសាទរ! បញ្ចប់ការអនុវត្ត
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  អ្នកបានបញ្ចប់ការស្តាប់ & សរសេរអក្ខរាវិរុទ្ធអង់គ្លេសប្រកបដោយជោគជ័យ!
                </p>
              </div>

              {/* Score Highlights Bento Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-slate-400 block font-bold">TOTAL SCORE</span>
                  <span className="text-lg sm:text-xl font-black text-amber-400 font-mono">{score}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-slate-400 block font-bold">XP EARNED</span>
                  <span className="text-lg sm:text-xl font-black text-emerald-400 font-mono">+{totalXpEarned} XP</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-slate-400 block font-bold">MAX STREAK</span>
                  <span className="text-lg sm:text-xl font-black text-orange-400 font-mono">x{maxStreak}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-slate-400 block font-bold">ACCURACY</span>
                  <span className="text-lg sm:text-xl font-black text-cyan-400 font-mono">
                    {resultsHistory.length > 0 
                      ? Math.round((resultsHistory.filter(r => r.isCorrect).length / resultsHistory.length) * 100) 
                      : 100}%
                  </span>
                </div>
              </div>

              {/* Word List Review Table with Clickable Audio Play */}
              <div className="space-y-2 text-left">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>បញ្ជីវាក្យសព្ទដែលបានអនុវត្ត (Word Review):</span>
                  <span className="text-[11px] text-cyan-400 font-normal">ចុច 🔊 ដើម្បីស្តាប់ការបញ្ចេញសំឡេងម្តងទៀត</span>
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
                          <div className="font-extrabold text-sm text-white flex items-center gap-2">
                            <span>{item.word}</span>
                            <span className="text-[11px] font-mono text-cyan-300 font-normal">{item.phonetic}</span>
                          </div>
                          <p className="text-[11px] text-slate-300 truncate">
                            {item.meaningKm}
                          </p>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
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
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>អនុវត្តម្តងទៀត (Practice Again)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGameState('lobby')}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/20"
                >
                  <span>ត្រឡប់ទៅមឺនុយ (Menu)</span>
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
