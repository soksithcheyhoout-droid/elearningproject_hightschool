import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Sparkles, 
  Trophy, 
  RotateCcw, 
  X, 
  Volume2, 
  VolumeX, 
  Flame, 
  Clock,
  Shield,
  Coins,
  Crown,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { playSound } from '../../utils/audioEffects';
import { getRandomizedGameQuestions } from '../../utils/gamePoolManager';

const CHEST_REWARDS = [
  { type: 'gold_small', title: '+50 កាក់មាស', xp: 50, icon: '🪙', color: 'from-amber-500 to-yellow-400' },
  { type: 'gold_med', title: '+150 កាក់មាស', xp: 150, icon: '💰', color: 'from-amber-600 to-yellow-300' },
  { type: 'gold_large', title: '+300 កាក់មាស', xp: 300, icon: '👑', color: 'from-yellow-400 to-amber-600' },
  { type: 'double', title: 'DOUBLE X2!', xp: 200, icon: '⚡', color: 'from-cyan-400 to-blue-600' },
  { type: 'shield', title: 'SHIELD DEFENSE!', xp: 100, icon: '🛡️', color: 'from-emerald-400 to-teal-600' },
  { type: 'jackpot', title: 'MEGA JACKPOT +500!', xp: 500, icon: '💎', color: 'from-purple-500 to-pink-500' }
];

export default function GoldQuestGameModal({ game, onClose }) {
  const { student, addXP } = useAuth();
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Dynamic Randomized Question Pool
  const [questions, setQuestions] = useState(() => getRandomizedGameQuestions(game, 6, student?.grade, student?.stream));
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [gameState, setGameState] = useState('question'); // 'question' | 'chest_pick' | 'game_over'
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [totalGold, setTotalGold] = useState(0);
  const [combo, setCombo] = useState(0);
  const [openedChestIndex, setOpenedChestIndex] = useState(null);
  const [chestResults, setChestResults] = useState([]);
  const [pickedReward, setPickedReward] = useState(null);

  const currentQ = questions[currentQIndex] || questions[0];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleSelectOption = (idx) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
    setIsAnswerSubmitted(true);

    const isCorrect = idx === currentQ.answer;

    if (isCorrect) {
      if (soundEnabled) playSound.correct();
      const newCombo = combo + 1;
      setCombo(newCombo);

      const shuffled = [...CHEST_REWARDS].sort(() => 0.5 - Math.random()).slice(0, 3);
      setChestResults(shuffled);
      setOpenedChestIndex(null);
      setPickedReward(null);

      setTimeout(() => {
        setGameState('chest_pick');
      }, 900);

    } else {
      if (soundEnabled) playSound.wrong();
      setCombo(0);
      setTimeout(() => {
        advanceNextQuestion();
      }, 1200);
    }
  };

  const handlePickChest = (chestIdx) => {
    if (openedChestIndex !== null) return;
    setOpenedChestIndex(chestIdx);
    const reward = chestResults[chestIdx];
    setPickedReward(reward);

    if (soundEnabled) {
      playSound.victory();
      if (reward.type === 'jackpot') setTimeout(() => playSound.combo(4), 200);
    }

    setTotalGold((prev) => prev + reward.xp);
    addXP(reward.xp);

    setTimeout(() => {
      advanceNextQuestion();
    }, 1800);
  };

  const advanceNextQuestion = () => {
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setGameState('question');
      setOpenedChestIndex(null);
      setPickedReward(null);
    } else {
      setGameState('game_over');
    }
  };

  const handleRestart = () => {
    setQuestions(getRandomizedGameQuestions(game, 6, student?.grade, student?.stream));
    setCurrentQIndex(0);
    setGameState('question');
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setTotalGold(0);
    setCombo(0);
    setOpenedChestIndex(null);
    setPickedReward(null);
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-1.5 sm:p-4 md:p-6 bg-slate-950/90 backdrop-blur-md animate-fade-in font-kantumruy overflow-y-auto">
      
      <div className="bg-gradient-to-b from-[#002b5b] to-[#001737] rounded-3xl w-full max-w-4xl border-2 border-amber-400/80 shadow-2xl overflow-hidden flex flex-col relative text-white">
        
        {/* Top Header */}
        <div className="bg-black/30 px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-amber-400 text-slate-950 shadow-md">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block font-cinzel">
                BLOOKET STYLE • GOLD QUEST ARENA
              </span>
              <h3 className="text-sm sm:text-base font-black text-white">
                {game?.titleKm || 'រុករករតនសម្បត្តិមាស (Gold Quest)'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-black/40 px-4 py-1.5 rounded-2xl border border-amber-400/40 shadow-inner">
              <span className="text-lg">🪙</span>
              <span className="font-cinzel text-base font-black text-amber-300">
                {totalGold}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-red-500/30 text-slate-400 hover:text-red-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Game Content */}
        <div className="p-6 sm:p-10 flex-1 flex flex-col justify-center items-center min-h-[440px]">
          
          {/* STATE 1: QUESTION SCREEN */}
          {gameState === 'question' && (
            <div className="w-full max-w-2xl space-y-6 animate-fade-in">
              
              <div className="flex items-center justify-between text-xs font-bold text-blue-200">
                <span>សំណួរទី {currentQIndex + 1} / {questions.length} (Randomized Pool)</span>
                {combo >= 2 && (
                  <span className="text-amber-300 flex items-center gap-1 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-400/40 animate-pulse font-cinzel">
                    <Flame className="w-4 h-4 fill-amber-400" /> {combo} STREAK
                  </span>
                )}
              </div>

              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl text-center border-b-4 border-slate-300">
                <h3 className="text-lg sm:text-xl font-black text-[#002b5b] leading-relaxed">
                  {currentQ.q}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = isAnswerSubmitted && idx === currentQ.answer;
                  const isWrong = isAnswerSubmitted && isSelected && idx !== currentQ.answer;

                  const colors = [
                    'bg-red-500 hover:bg-red-600 border-red-700',
                    'bg-blue-500 hover:bg-blue-600 border-blue-700',
                    'bg-amber-500 hover:bg-amber-600 border-amber-700',
                    'bg-emerald-500 hover:bg-emerald-600 border-emerald-700'
                  ];

                  let btnColor = colors[idx % 4];
                  if (isCorrect) btnColor = 'bg-emerald-600 border-emerald-800 ring-4 ring-emerald-300 shadow-xl';
                  if (isWrong) btnColor = 'bg-rose-700 border-rose-900 opacity-60';

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isAnswerSubmitted}
                      onClick={() => handleSelectOption(idx)}
                      className={`p-5 rounded-2xl border-b-4 text-white font-extrabold text-sm sm:text-base flex items-center gap-3 transition-all duration-150 active:translate-y-1 active:border-b-0 cursor-pointer shadow-md ${btnColor}`}
                    >
                      <span className="w-8 h-8 rounded-xl bg-black/20 flex items-center justify-center text-xs font-black font-cinzel">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1 text-left line-clamp-2">{option}</span>
                    </button>
                  );
                })}
              </div>

            </div>
          )}

          {/* STATE 2: 3 MYSTERIOUS CHESTS PICK SCREEN */}
          {gameState === 'chest_pick' && (
            <div className="w-full max-w-2xl text-center space-y-8 animate-fade-in">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase font-cinzel">
                  CORRECT ANSWER! 🎉
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  ជ្រើសរើសហឹបកំណប់ ១ ដើម្បីបើកយករង្វាន់!
                </h3>
                <p className="text-xs text-blue-200">
                  រង្វាន់ក្នុងហឹប៖ កាក់មាស, មេដាយគុណពីរ, ឬមហារតនសម្បត្តិ Jackpot!
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 sm:gap-6">
                {[0, 1, 2].map((chestIdx) => {
                  const isOpened = openedChestIndex === chestIdx;
                  const reward = chestResults[chestIdx];

                  return (
                    <div
                      key={chestIdx}
                      onClick={() => handlePickChest(chestIdx)}
                      className={`aspect-square rounded-3xl p-4 sm:p-6 border-b-4 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer shadow-xl ${
                        isOpened
                          ? `bg-gradient-to-tr ${reward?.color || 'from-amber-500 to-yellow-300'} border-white/60 scale-105 shadow-2xl`
                          : openedChestIndex !== null
                          ? 'bg-slate-900/60 border-white/10 opacity-50'
                          : 'bg-gradient-to-b from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 border-amber-950 hover:scale-105'
                      }`}
                    >
                      {isOpened ? (
                        <div className="space-y-2 animate-bounce">
                          <span className="text-4xl sm:text-5xl block">{reward?.icon}</span>
                          <span className="font-black text-xs sm:text-sm text-white block">
                            {reward?.title}
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <span className="text-4xl sm:text-5xl block">🎁</span>
                          <span className="text-[11px] font-black text-amber-200 block uppercase font-cinzel">
                            CHEST #{chestIdx + 1}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {pickedReward && (
                <div className="text-sm font-black text-amber-300 animate-fade-in">
                  អ្នកទទួលបាន {pickedReward.title} ចូលក្នុងកាបូប!
                </div>
              )}
            </div>
          )}

          {/* STATE 3: GAME OVER REWARD PODIUM */}
          {gameState === 'game_over' && (
            <div className="w-full max-w-md text-center space-y-6 animate-fade-in">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 p-0.5 mx-auto shadow-2xl animate-bounce">
                <div className="w-full h-full rounded-3xl bg-slate-950 flex items-center justify-center text-4xl">
                  🏆
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-black text-amber-400 uppercase tracking-widest font-cinzel">
                  ★ QUEST COMPLETED! ★
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  ការរុករករតនសម្បត្តិបានជោគជ័យ!
                </h3>
              </div>

              <div className="bg-white/10 rounded-2xl p-6 border border-white/20 flex items-center justify-around">
                <div>
                  <span className="text-slate-400 text-xs block">TOTAL GOLD EARNED</span>
                  <span className="font-cinzel text-2xl font-black text-amber-300">🪙 {totalGold}</span>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <div>
                  <span className="text-slate-400 text-xs block">XP REWARD</span>
                  <span className="font-cinzel text-2xl font-black text-emerald-400">+{totalGold} XP</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>រុករកម្តងទៀត (Play Again)</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer border border-white/20"
                >
                  <span>ចាកចេញ (Exit)</span>
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
