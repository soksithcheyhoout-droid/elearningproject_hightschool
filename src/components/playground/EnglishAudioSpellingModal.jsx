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
  Crown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { playSound } from '../../utils/audioEffects';
import { englishDictationWords, englishDictationCategories, getEnglishDictationSession } from '../../data/englishDictationData';

const VIRTUAL_KEYBOARD = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']
];

export default function EnglishAudioSpellingModal({ isOpen, onClose }) {
  const { addXP } = useAuth();

  // Settings & Category
  const [category, setCategory] = useState('all');
  const [gameMode, setGameMode] = useState('mission'); // 'mission' | 'speed' | 'endless'
  const [soundEffects, setSoundEffects] = useState(true);
  const [autoThreeTimes, setAutoThreeTimes] = useState(true);

  // Game Progress State
  const [gameState, setGameState] = useState('lobby'); // 'lobby' | 'playing' | 'round_result' | 'game_over'
  const [wordsList, setWordsList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [repeatsLeft, setRepeatsLeft] = useState(3);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakPhase, setSpeakPhase] = useState(0); // 0 = idle, 1 = 1st time, 2 = 2nd time, 3 = 3rd time, 4 = go
  const [isWrongShake, setIsWrongShake] = useState(false);
  const [isCorrectGlow, setIsCorrectGlow] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSentence, setShowSentence] = useState(false);

  // Stats & Scoring
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [resultsHistory, setResultsHistory] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);

  // Audio Speech Synthesizer Ref
  const speechTimerRef = useRef(null);
  const countdownTimerRef = useRef(null);
  const inputRef = useRef(null);

  const currentWordItem = wordsList[currentIndex] || englishDictationWords[0];

  // Helper to pronounce words with Web Speech API
  const speakWord = useCallback((text, rate = 1.0, onComplete) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      if (onComplete) onComplete();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop prior speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = rate; // 1.0 normal, 0.75 slow
      utterance.pitch = 1.0;

      // Select top quality English Voice
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => (v.lang === 'en-US' || v.lang === 'en-GB') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Jenny') || v.name.includes('Guy') || v.name.includes('David') || v.name.includes('Zira')))
        || voices.find(v => v.lang.startsWith('en'));
      
      if (preferred) utterance.voice = preferred;

      setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        if (onComplete) onComplete();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        if (onComplete) onComplete();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setIsSpeaking(false);
      if (onComplete) onComplete();
    }
  }, []);

  // AI 3-Time Voice Routine ("ai will said for user type like ai said earth and said 3 time after go")
  const startAiThreeTimeRoutine = useCallback((targetWord) => {
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    if (!targetWord) return;

    setSpeakPhase(1); // 1st time
    speakWord(targetWord, 1.0, () => {
      // Pause 1s before 2nd time
      speechTimerRef.current = setTimeout(() => {
        setSpeakPhase(2); // 2nd time
        speakWord(targetWord, 0.9, () => {
          // Pause 1s before 3rd time
          speechTimerRef.current = setTimeout(() => {
            setSpeakPhase(3); // 3rd time
            speakWord(targetWord, 0.8, () => {
              // Pause 0.6s and announce Go!
              speechTimerRef.current = setTimeout(() => {
                setSpeakPhase(4); // GO!
                if (soundEffects) playSound.duelStart();
                speechTimerRef.current = setTimeout(() => {
                  setSpeakPhase(0); // Idle, ready for typing
                }, 1200);
              }, 400);
            });
          }, 900);
        });
      }, 900);
    });
  }, [speakWord, soundEffects]);

  // Start / Init Game Session
  const startGameSession = (selectedCat = category, mode = gameMode) => {
    const sessionWords = getEnglishDictationSession(mode === 'mission' ? 10 : 25, selectedCat);
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
    setRepeatsLeft(3);
    setTimeLeft(60);
    setGameState('playing');

    if (soundEffects) playSound.duelStart();

    // Trigger AI 3-times routine for first word
    if (sessionWords[0]) {
      setTimeout(() => {
        startAiThreeTimeRoutine(sessionWords[0].word);
      }, 400);
    }
  };

  // Speed Mode Timer
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

  // Handle User Input Submission
  const handleCheckAnswer = () => {
    if (!currentWordItem || gameState !== 'playing') return;

    const cleanInput = currentInput.trim();
    if (!cleanInput) return;

    const isCorrect = cleanInput.toLowerCase() === currentWordItem.word.toLowerCase();

    if (isCorrect) {
      // 🌟 CORRECT SPELLING!
      if (soundEffects) playSound.correct();
      setIsCorrectGlow(true);

      const streakBonus = streak >= 3 ? 1.5 : streak >= 5 ? 2.0 : 1.0;
      const roundXp = Math.round(40 * streakBonus);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak(Math.max(maxStreak, newStreak));
      setScore(prev => prev + 100 * streakBonus);
      setTotalXpEarned(prev => prev + roundXp);
      addXP(roundXp);

      // Record to history
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

      // Move to next word after short celebration
      setTimeout(() => {
        setIsCorrectGlow(false);
        proceedToNextWord();
      }, 900);

    } else {
      // ❌ WRONG SPELLING
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

      // Record to history
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
        // Allow another attempt or proceed if mission mode exceeded
        proceedToNextWord();
      }, 900);
    }
  };

  const proceedToNextWord = () => {
    setCurrentInput('');
    setShowHint(false);
    setShowSentence(false);
    setRepeatsLeft(3);

    const nextIndex = currentIndex + 1;
    if (nextIndex >= wordsList.length) {
      finishGame();
    } else {
      setCurrentIndex(nextIndex);
      const nextWord = wordsList[nextIndex];
      if (nextWord) {
        if (autoThreeTimes) {
          startAiThreeTimeRoutine(nextWord.word);
        } else {
          speakWord(nextWord.word);
        }
      }
    }
  };

  const finishGame = () => {
    if (soundEffects) playSound.victory();
    setGameState('game_over');
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
  };

  // Keyboard Handler for Typing
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

  // Physical Keyboard listener
  useEffect(() => {
    const handlePhysicalKeyDown = (e) => {
      if (gameState !== 'playing') return;

      if (e.key === 'Enter') {
        e.preventDefault();
        handleCheckAnswer();
      } else if (e.key === 'Backspace') {
        setCurrentInput(prev => prev.slice(0, -1));
      } else if (e.key === 'Escape') {
        if (onClose) onClose();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        if (currentInput.length < 24) {
          setCurrentInput(prev => prev + e.key);
        }
      }
    };

    window.addEventListener('keydown', handlePhysicalKeyDown);
    return () => window.removeEventListener('keydown', handlePhysicalKeyDown);
  }, [gameState, currentInput, currentWordItem, streak, lives, maxStreak]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-xl animate-fadeIn font-kantumruy select-none overflow-y-auto">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#081528] via-[#050f1d] to-[#020710] rounded-3xl border-2 border-cyan-400/40 shadow-[0_20px_80px_rgba(6,182,212,0.25)] overflow-hidden flex flex-col my-auto max-h-[96vh]">
        
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 🌟 TOP HEADER BAR */}
        <div className="relative z-10 bg-[#001730]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Headphones className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white font-cinzel tracking-wider">
                  AI ENGLISH AUDIO SPELL ARENA
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-cyan-400/20 border border-cyan-400/40 text-[9.5px] font-black text-cyan-300 uppercase">
                  3X DICTATION
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                ស្តាប់ AI បញ្ចេញសំឡេង ៣ ដង & វាយពាក្យអង់គ្លេសត្រឹមត្រូវដណ្តើម XP
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

            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
                onClose();
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-white/10 hover:border-rose-500/40 transition-colors cursor-pointer"
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
            <div className="space-y-6 animate-fadeIn py-2 max-w-2xl mx-auto w-full text-center">
              
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold font-cinzel">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>NATIONAL DICTATION CHALLENGE</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  ហ្គេមស្តាប់សំឡេង AI & វាយពាក្យអង់គ្លេស
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                  លោកគ្រូ AI នឹងបញ្ចេញសំឡេងពាក្យអង់គ្លេស <strong>៣ ដងជាប់គ្នា (ដូចជា Earth... Earth... Earth... GO!)</strong> ដើម្បីឱ្យប្អូនៗស្តាប់យ៉ាងច្បាស់ រួចវាយអក្សរចូលឱ្យបានត្រឹមត្រូវ!
                </p>
              </div>

              {/* Game Mode Selector */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  ជ្រើសរើសទម្រង់ប្រកួត (Game Mode):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setGameMode('mission')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      gameMode === 'mission'
                        ? 'bg-cyan-950/60 border-cyan-400 shadow-lg shadow-cyan-500/20 text-white'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">🎯 Mission Mode</span>
                      <span className="text-[10px] text-amber-400 font-cinzel font-black">+400 XP</span>
                    </div>
                    <p className="text-[11px] text-slate-300">១០ ពាក្យផ្លូវការថ្នាក់ជាតិ</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGameMode('speed')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      gameMode === 'speed'
                        ? 'bg-cyan-950/60 border-cyan-400 shadow-lg shadow-cyan-500/20 text-white'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/30 hover:text-white'
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
                        ? 'bg-cyan-950/60 border-cyan-400 shadow-lg shadow-cyan-500/20 text-white'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/30 hover:text-white'
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

              {/* Category Selector */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  ជ្រើសរើសប្រធានបទពាក្យ (Vocabulary Topic):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {englishDictationCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                        category === cat.id
                          ? 'bg-gradient-to-r from-blue-900/80 to-cyan-900/80 border-cyan-400 text-white shadow-md'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="truncate">{cat.nameKm}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto 3 Times Switch */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-left">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-cyan-400" />
                    <span>បញ្ចេញសំឡេងស្វ័យប្រវត្តិ ៣ ដង (Auto 3x Speak Routine)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    AI និយាយពាក្យ ៣ ដងដោយស្វ័យប្រវត្តិរៀងរាល់ពាក្យថ្មី
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

              {/* Start Button */}
              <button
                type="button"
                onClick={() => startGameSession(category, gameMode)}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-sm sm:text-base flex items-center justify-center gap-3 shadow-xl shadow-cyan-500/25 active:scale-98 transition-all cursor-pointer border border-cyan-300/40"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>ចាប់ផ្តើមប្រកួតស្តាប់ & វាយពាក្យ (START DICTATION)</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </button>

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

              {/* CENTER STAGE: AI VOICE SOUNDWAVE & SPEAKING CONTROLS */}
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
                      {speakPhase === 1 && '🗣️ AI Saying: 1st Time (ស្តាប់លើកទី ១)'}
                      {speakPhase === 2 && '🗣️ AI Saying: 2nd Time (ស្តាប់លើកទី ២)'}
                      {speakPhase === 3 && '🗣️ AI Saying: 3rd Time (ស្តាប់លើកទី ៣)'}
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
                    onClick={() => speakWord(currentWordItem.word)}
                    disabled={isSpeaking}
                    className="w-full h-full rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white flex flex-col items-center justify-center shadow-xl shadow-cyan-500/30 active:scale-95 transition-all cursor-pointer border-2 border-cyan-300"
                    title="Click to Listen Again"
                  >
                    <Volume2 className={`w-8 h-8 ${isSpeaking ? 'animate-bounce text-amber-300' : 'text-white'}`} />
                    <span className="text-[9px] font-black uppercase tracking-wider mt-1 text-cyan-100">
                      {isSpeaking ? 'SPEAKING...' : 'LISTEN'}
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

                {/* Audio Helper Actions (Repeat 3x, Slow, Phonics, Sentence) */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  
                  <button
                    type="button"
                    onClick={() => startAiThreeTimeRoutine(currentWordItem.word)}
                    disabled={isSpeaking}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>បញ្ចេញសំឡេង ៣ ដង (Repeat 3x)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => speakWord(currentWordItem.word, 0.65)}
                    disabled={isSpeaking}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <span>🐢 សំឡេងយឺត (Slow 0.7x)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      // Spell letter by letter
                      const letters = currentWordItem.word.split('').join(' . ');
                      speakWord(letters, 0.85);
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
                      speakWord(currentWordItem.exampleEn);
                    }}
                    disabled={isSpeaking}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>លឺឧទាហរណ៍ (Sentence)</span>
                  </button>

                </div>

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
                  អបអរសាទរ! បញ្ចប់ការប្រកួត
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  អ្នកបានបញ្ចប់ការស្តាប់ & វាយពាក្យអង់គ្លេសប្រកបដោយជោគជ័យ!
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
                  <span>បញ្ជីវាក្យសព្ទដែលបានប្រកួត (Word Review):</span>
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
                          onClick={() => speakWord(item.word)}
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
                  onClick={() => startGameSession(category, gameMode)}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>លេងម្តងទៀត (Play Again)</span>
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
