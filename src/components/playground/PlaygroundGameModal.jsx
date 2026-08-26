import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Trophy, 
  Clock, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Zap, 
  Award,
  Crown,
  Check,
  X,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useAuth, computeLevelData } from '../../context/AuthContext';
import { playSound } from '../../utils/audioEffects';
import { getRandomizedGameQuestions, fetchLiveExamQuestions } from '../../utils/gamePoolManager';
import VictoryRewardCelebration from './VictoryRewardCelebration';

export default function PlaygroundGameModal({ game, onClose }) {
  const { addXP, student } = useAuth();
  const levelInfo = computeLevelData(student.xp);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [questions, setQuestions] = useState(() => getRandomizedGameQuestions(game, 8, student?.grade, student?.stream));
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [nextCountdown, setNextCountdown] = useState(3);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(game.timeLimitSeconds || 60);

  const autoNextTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  // Prevent background scroll & fetch additional questions if needed
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    let isSubscribed = true;

    // Only fetch live master pool if game has no predefined questions
    if (!game?.questions || game.questions.length === 0) {
      fetchLiveExamQuestions({
        stream: game?.stream || student?.stream || 'science',
        subjectKey: game?.subjectKey || '',
        grade: student?.grade || game?.grade || '12',
        limit: 12,
        random: true
      }).then((livePool) => {
        if (isSubscribed && Array.isArray(livePool) && livePool.length > 0) {
          setQuestions(livePool);
        }
      });
    }

    return () => {
      isSubscribed = false;
      document.body.style.overflow = '';
      clearTimeout(autoNextTimerRef.current);
      clearInterval(countdownIntervalRef.current);
    };
  }, [game, student]);

  // Timer countdown
  useEffect(() => {
    if (isGameOver) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleEndGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isGameOver]);

  const currentQ = questions[currentQIndex] || questions[0];

  const handleSelectOption = (idx) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
    setIsAnswerSubmitted(true);
    setNextCountdown(3);

    const isCorrect = idx === currentQ.answer;
    if (isCorrect) {
      if (soundEnabled) {
        playSound.correct();
        if (combo >= 1) setTimeout(() => playSound.combo(combo + 1), 200);
      }
      const newCombo = combo + 1;
      setCombo(newCombo);
      const pointsEarned = 100 * (newCombo >= 3 ? 2 : newCombo >= 2 ? 1.5 : 1);
      setScore((prev) => prev + pointsEarned);
      setCorrectAnswersCount((prev) => prev + 1);
    } else {
      if (soundEnabled) playSound.wrong();
      setCombo(0);
    }

    // 3-second auto-transition to next question
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
      handleNextQuestion();
    }, 3000);
  };

  const handleNextQuestion = () => {
    clearTimeout(autoNextTimerRef.current);
    clearInterval(countdownIntervalRef.current);

    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setNextCountdown(3);
    } else {
      handleEndGame();
    }
  };

  const handleEndGame = () => {
    clearTimeout(autoNextTimerRef.current);
    clearInterval(countdownIntervalRef.current);
    setIsGameOver(true);
    if (soundEnabled) playSound.victory();
    const earnedXP = Math.round(game.xpReward * (correctAnswersCount / (questions.length || 1)));
    if (earnedXP > 0) {
      addXP(earnedXP);
    }
  };

  const handleRestart = () => {
    clearTimeout(autoNextTimerRef.current);
    clearInterval(countdownIntervalRef.current);
    setQuestions(getRandomizedGameQuestions(game, 8, student?.grade, student?.stream));
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setNextCountdown(3);
    setScore(0);
    setCombo(0);
    setCorrectAnswersCount(0);
    setIsGameOver(false);
    setSecondsLeft(game.timeLimitSeconds || 60);
  };

  const earnedXP = Math.round(game.xpReward * (correctAnswersCount / (questions.length || 1)));

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-1.5 sm:p-4 md:p-6 bg-slate-950/90 backdrop-blur-md animate-fade-in font-kantumruy overflow-y-auto">
      
      {/* Game Window Card */}
      <div className="bg-[#0e1626] rounded-3xl w-full max-w-2xl border-2 border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-white relative">
        
        {/* Top Header */}
        <div className="bg-[#090d16] text-white p-5 flex items-center justify-between border-b border-slate-800 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block font-cinzel">
                SPEED SPRINT ARENA
              </span>
              <h3 className="font-extrabold text-sm sm:text-base line-clamp-1 text-white">
                {game.titleKm}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Countdown timer */}
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold font-cinzel border ${
              secondsLeft <= 10 ? 'bg-rose-500/20 text-rose-300 border-rose-400 animate-pulse' : 'bg-slate-800 text-white border-slate-700'
            }`}>
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>{secondsLeft}s</span>
            </div>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-300" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/30 text-slate-300 hover:text-rose-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Game Content */}
        {!isGameOver ? (
          <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between overflow-y-auto space-y-6">
            
            {/* Stats Bar */}
            <div className="flex items-center justify-between text-xs font-bold border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">សំណួរទី</span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-400 border border-slate-700 font-cinzel font-black">
                  {currentQIndex + 1} / {questions.length}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {combo >= 2 && (
                  <span className="text-amber-400 flex items-center gap-1 font-cinzel text-xs font-black animate-pulse">
                    <Flame className="w-3.5 h-3.5 fill-amber-400" /> x{combo} COMBO!
                  </span>
                )}
                <div className="bg-slate-800 text-amber-300 px-3 py-1 rounded-xl border border-slate-700 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-cinzel font-black">{score} PTS</span>
                </div>
              </div>
            </div>

            {/* Question Text */}
            <div className="bg-[#131d31] rounded-2xl p-5 border border-slate-700 shadow-inner">
              <h4 className="font-black text-base sm:text-lg text-white leading-relaxed text-center sm:text-left">
                {currentQ.q}
              </h4>
            </div>

            {/* 4 Interactive 3D Tactile Option Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = isAnswerSubmitted && idx === currentQ.answer;
                const isWrong = isAnswerSubmitted && isSelected && idx !== currentQ.answer;

                let style = 'bg-[#131d31] hover:bg-[#1a2742] border-b-[5px] border-slate-900 text-slate-200';
                if (isCorrect) {
                  style = 'bg-emerald-600 border-b-[5px] border-emerald-800 text-white ring-2 ring-emerald-300 shadow-xl';
                } else if (isWrong) {
                  style = 'bg-rose-700 border-b-[5px] border-rose-900 text-white opacity-70';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAnswerSubmitted}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-4.5 rounded-2xl text-left font-bold text-xs sm:text-sm flex items-center justify-between gap-3 transition-all cursor-pointer active:translate-y-1 active:border-b-0 ${style}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-black/30 flex items-center justify-center text-xs font-black font-cinzel text-amber-300 flex-shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-snug">{opt}</span>
                    </div>
                    {isCorrect && <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />}
                    {isWrong && <XCircle className="w-5 h-5 text-rose-200 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation & 3s Auto-Next Timer Bar */}
            {isAnswerSubmitted && (
              <div className="bg-[#131d31] rounded-2xl p-4 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
                <div className="text-xs text-slate-300">
                  <strong className="font-bold text-amber-300">💡 គន្លឹះដោះស្រាយ៖ </strong>
                  <span>{currentQ.explanation}</span>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {/* 3s Auto-countdown indicator */}
                  <span className="text-[11px] font-bold text-amber-400 font-cinzel animate-pulse">
                    Next in {nextCountdown}s...
                  </span>

                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg hover:scale-105 transition-all"
                  >
                    <span>សំណួរបន្ទាប់ ➔</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        ) : (
          /* 3D Realistic Victory & Confetti Celebration Component */
          <VictoryRewardCelebration
            title="អ្នកបានបញ្ចប់ការប្រណាំងល្បឿន!"
            subtitle="ទទួលបានចំណេះដឹង និងដណ្តើមបានមេដាយកិត្តិយស!"
            score={score}
            xpEarned={earnedXP}
            correctCount={correctAnswersCount}
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
