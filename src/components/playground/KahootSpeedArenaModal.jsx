import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Flame, 
  Volume2, 
  VolumeX, 
  X, 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Zap, 
  ArrowRight,
  Triangle,
  Diamond,
  Circle,
  Square
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { playSound } from '../../utils/audioEffects';
import { getRandomizedGameQuestions } from '../../utils/gamePoolManager';
import VictoryRewardCelebration from './VictoryRewardCelebration';

export default function KahootSpeedArenaModal({ game, onClose }) {
  const { addXP, student } = useAuth();
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [questions, setQuestions] = useState(() => getRandomizedGameQuestions(game, 6));
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [nextCountdown, setNextCountdown] = useState(3);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(15);

  const autoNextTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      clearTimeout(autoNextTimerRef.current);
      clearInterval(countdownIntervalRef.current);
    };
  }, []);

  // 15s Countdown Timer per question
  useEffect(() => {
    if (isGameOver || isAnswerSubmitted) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQIndex, isGameOver, isAnswerSubmitted]);

  const currentQ = questions[currentQIndex] || questions[0];

  const handleTimeOut = () => {
    if (isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    setCombo(0);
    if (soundEnabled) playSound.wrong();

    triggerAutoNext();
  };

  const triggerAutoNext = () => {
    setNextCountdown(3);
    clearInterval(countdownIntervalRef.current);
    countdownIntervalRef.current = setInterval(() => {
      setNextCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    clearTimeout(autoNextTimerRef.current);
    autoNextTimerRef.current = setTimeout(() => {
      handleNext();
    }, 3000);
  };

  const handleSelect = (idx) => {
    if (isAnswerSubmitted || isGameOver) return;
    setSelectedOption(idx);
    setIsAnswerSubmitted(true);

    const isCorrect = idx === currentQ.answer;

    if (isCorrect) {
      if (soundEnabled) {
        playSound.correct();
        if (combo >= 1) setTimeout(() => playSound.combo(combo + 1), 200);
      }
      const newCombo = combo + 1;
      setCombo(newCombo);
      setCorrectCount((prev) => prev + 1);
      const points = 600 + secondsLeft * 35 + newCombo * 60;
      setScore((prev) => prev + points);
    } else {
      if (soundEnabled) playSound.wrong();
      setCombo(0);
    }

    triggerAutoNext();
  };

  const handleNext = () => {
    clearTimeout(autoNextTimerRef.current);
    clearInterval(countdownIntervalRef.current);

    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setSecondsLeft(15);
      setNextCountdown(3);
    } else {
      setIsGameOver(true);
      if (soundEnabled) playSound.victory();
      addXP(Math.round(score / 5) + 100);
    }
  };

  const handleRestart = () => {
    clearTimeout(autoNextTimerRef.current);
    clearInterval(countdownIntervalRef.current);
    setQuestions(getRandomizedGameQuestions(game, 6));
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setCombo(0);
    setCorrectCount(0);
    setNextCountdown(3);
    setIsGameOver(false);
    setSecondsLeft(15);
  };

  const BUTTON_CONFIGS = [
    { bg: 'bg-[#e21b3c] hover:bg-[#c91835] border-[#b0132c]', icon: Triangle, name: 'Triangle' },
    { bg: 'bg-[#1368ce] hover:bg-[#1056ab] border-[#0c4488]', icon: Diamond, name: 'Diamond' },
    { bg: 'bg-[#d89e00] hover:bg-[#b88600] border-[#996f00]', icon: Circle, name: 'Circle' },
    { bg: 'bg-[#26890c] hover:bg-[#1f7009] border-[#185707]', icon: Square, name: 'Square' }
  ];

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-1.5 sm:p-4 md:p-6 bg-slate-950/90 backdrop-blur-lg animate-fade-in font-kantumruy overflow-y-auto">
      
      {/* Full-Featured Game Show Modal Window */}
      <div className="bg-[#46178f] rounded-3xl w-full max-w-5xl h-full max-h-[92vh] border-2 border-white/20 shadow-2xl overflow-hidden flex flex-col text-white relative">
        
        {/* Kahoot Top Header HUD */}
        <div className="bg-black/40 px-6 py-4 flex items-center justify-between border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 font-black flex items-center justify-center font-cinzel text-lg shadow-md">
              K!
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block font-cinzel">
                  KAHOOT SPEED ARENA
                </span>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-white/10 text-white border border-white/10">
                  {game?.subject || 'វិទ្យាសាស្ត្រ'}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-white line-clamp-1">
                {game?.titleKm}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* 15s Timer Ring */}
            <div className={`w-11 h-11 rounded-full border-3 flex items-center justify-center font-cinzel font-black text-sm shadow-md transition-all ${
              secondsLeft <= 5 ? 'border-rose-500 bg-rose-600/30 text-rose-300 animate-pulse' : 'border-amber-400 bg-black/30 text-white'
            }`}>
              {secondsLeft}s
            </div>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-300" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-rose-500/30 text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Game Content */}
        {!isGameOver ? (
          <div className="p-4 sm:p-8 flex-1 flex flex-col justify-between overflow-y-auto space-y-4">
            
            {/* Top Match Progress & Score Bar */}
            <div className="flex items-center justify-between text-xs font-bold bg-black/20 p-3 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-purple-200">សំណួរទី</span>
                <span className="px-3 py-0.5 rounded-full bg-white/10 text-amber-300 font-cinzel font-black">
                  {currentQIndex + 1} / {questions.length}
                </span>
              </div>

              <div className="flex items-center gap-4">
                {combo >= 2 && (
                  <span className="text-amber-300 flex items-center gap-1 font-cinzel text-xs font-black animate-pulse">
                    <Flame className="w-4 h-4 fill-amber-400 text-amber-400" /> {combo} STREAK!
                  </span>
                )}
                <div className="bg-amber-400 text-slate-950 px-3.5 py-1 rounded-xl font-cinzel font-black flex items-center gap-1.5 shadow-md">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>{score} PTS</span>
                </div>
              </div>
            </div>

            {/* Main Question Display Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 text-center shadow-2xl border-b-4 border-slate-300 my-auto">
              <h2 className="text-lg sm:text-2xl font-black text-[#1e1b4b] leading-relaxed">
                {currentQ.q}
              </h2>
            </div>

            {/* 4 Iconic Kahoot-style Answer Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {currentQ.options.map((option, idx) => {
                const config = BUTTON_CONFIGS[idx % 4];
                const IconComponent = config.icon;
                const isSelected = selectedOption === idx;
                const isCorrect = isAnswerSubmitted && idx === currentQ.answer;
                const isWrong = isAnswerSubmitted && isSelected && idx !== currentQ.answer;

                let tileStyle = `${config.bg} border-b-[6px] shadow-lg active:translate-y-1 active:border-b-0`;
                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    tileStyle = 'bg-emerald-600 border-b-[6px] border-emerald-800 ring-4 ring-emerald-300 scale-[1.02] shadow-2xl';
                  } else if (isWrong) {
                    tileStyle = 'bg-rose-700 border-b-[6px] border-rose-900 opacity-60';
                  } else {
                    tileStyle = `${config.bg} opacity-40 border-b-0`;
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAnswerSubmitted}
                    onClick={() => handleSelect(idx)}
                    className={`p-5 rounded-2xl flex items-center gap-4 transition-all duration-150 cursor-pointer ${tileStyle}`}
                  >
                    <div className="w-11 h-11 rounded-xl bg-black/20 flex items-center justify-center flex-shrink-0 shadow-inner">
                      <IconComponent className="w-6 h-6 fill-white text-white" />
                    </div>
                    <span className="text-base sm:text-lg font-black text-left line-clamp-2">
                      {option}
                    </span>
                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle2 className="w-6 h-6 text-white ml-auto flex-shrink-0" />
                    )}
                    {isAnswerSubmitted && isWrong && (
                      <XCircle className="w-6 h-6 text-rose-200 ml-auto flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation & 3s Auto-Next Timer Bar */}
            {isAnswerSubmitted && (
              <div className="bg-black/40 rounded-2xl p-4 border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
                <div className="text-xs sm:text-sm text-purple-100">
                  <strong className="text-amber-300 font-bold">💡 គន្លឹះដោះស្រាយ៖ </strong>
                  <span>{currentQ.explanation}</span>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-[11px] font-bold text-amber-300 font-cinzel animate-pulse">
                    Next in {nextCountdown}s...
                  </span>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm cursor-pointer shadow-lg hover:scale-105 transition-all"
                  >
                    សំណួរបន្ទាប់ ➔
                  </button>
                </div>
              </div>
            )}

          </div>
        ) : (
          /* 3D Realistic Victory & Confetti Celebration Component */
          <VictoryRewardCelebration
            title="អ្នកបានបញ្ចប់ KAHOOT SPEED ARENA!"
            subtitle="ទទួលបានចំណេះដឹង និងដណ្តើមបានពិន្ទុឆ្នើម!"
            score={score}
            xpEarned={Math.round(score / 5) + 100}
            correctCount={correctCount}
            totalCount={questions.length}
            onRestart={handleRestart}
            onClose={onClose}
          />
        )}

      </div>

    </div>,
    document.body
  );
}
