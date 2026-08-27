import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Sword, 
  Shield, 
  Flame, 
  Zap, 
  Sparkles, 
  Heart, 
  Clock, 
  Trophy, 
  RotateCcw, 
  X, 
  Award, 
  Crown,
  Volume2,
  VolumeX,
  Wand2,
  Hourglass,
  Skull
} from 'lucide-react';
import { useAuth, computeLevelData } from '../../context/AuthContext';
import { playSound } from '../../utils/audioEffects';
import { getRandomizedGameQuestions, fetchLiveExamQuestions } from '../../utils/gamePoolManager';

export default function BossBattleGameModal({ game, onClose }) {
  const { student, addXP } = useAuth();
  const levelInfo = computeLevelData(student.xp);

  const [soundEnabled, setSoundEnabled] = useState(true);

  // Dynamic Randomized Question Pool
  const [questions, setQuestions] = useState(() => getRandomizedGameQuestions(game, 8, student?.grade, game?.stream || student?.stream));

  // Boss metadata
  const bossNames = {
    science: { 
      name: 'មេបិសាចកង់ទិច (Lord Quantum)', 
      title: 'Guard of the Quantum Realm', 
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80', 
      maxHp: 1000,
      element: 'វិទ្យាសាស្ត្រពិត (Quantum Energy)',
      color: 'from-blue-600 to-cyan-500'
    },
    social: { 
      name: 'មេបិសាចកាលប្បវត្តិ (Titan Chronos)', 
      title: 'Master of Ancient Timelines', 
      avatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&auto=format&fit=crop&q=80', 
      maxHp: 1000,
      element: 'វិទ្យាសាស្ត្រសង្គម (Ancient Wisdom)',
      color: 'from-amber-600 to-rose-600'
    },
    all: { 
      name: 'មេបិសាចមហាសកល (Omni Scholar)', 
      title: 'Universal Grandmaster', 
      avatar: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=200&auto=format&fit=crop&q=80', 
      maxHp: 1000,
      element: 'វិទ្យាសាស្ត្រចម្រុះ (Omni Realm)',
      color: 'from-purple-600 to-indigo-600'
    }
  };

  const boss = bossNames[game.stream] || bossNames.science;

  // Game state
  const [playerHp, setPlayerHp] = useState(100);
  const [bossHp, setBossHp] = useState(boss.maxHp);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(game.timeLimitSeconds || 75);
  const [isGameOver, setIsGameOver] = useState(false);
  const [battleOutcome, setBattleOutcome] = useState(null);
  const [bossAction, setBossAction] = useState('idle'); // 'idle' | 'attack' | 'hit'
  const [playerAction, setPlayerAction] = useState('idle'); // 'idle' | 'attack' | 'hit'
  const [screenFlash, setScreenFlash] = useState(false);
  const [floatingText, setFloatingText] = useState(null);

  // Spells / Mana Items
  const [hasUsedSpell5050, setHasUsedSpell5050] = useState(false);
  const [hasUsedFreeze, setHasUsedFreeze] = useState(false);
  const [hasUsedHeal, setHasUsedHeal] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState([]);

  const currentQ = questions[currentQIndex] || questions[0];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    let isSubscribed = true;

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

    return () => {
      isSubscribed = false;
      document.body.style.overflow = '';
    };
  }, [game, student]);

  // Timer countdown
  useEffect(() => {
    if (isGameOver) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerGameOver('timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isGameOver]);

  const triggerGameOver = (outcome) => {
    setIsGameOver(true);
    setBattleOutcome(outcome);

    if (outcome === 'win') {
      if (soundEnabled) playSound.victory();
      const bonusXP = game.xpReward + combo * 25 + 100;
      addXP(bonusXP);
    } else {
      if (soundEnabled) playSound.wrong();
      addXP(Math.round(game.xpReward * 0.25));
    }
  };

  const showFloatingEffect = (text, color = 'text-amber-300') => {
    setFloatingText({ text, color });
    setTimeout(() => setFloatingText(null), 1200);
  };

  const handleSelectOption = (idx) => {
    if (isAnswerSubmitted || isGameOver) return;
    setSelectedOption(idx);
    setIsAnswerSubmitted(true);

    const isCorrect = idx === currentQ.answer;

    if (isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);

      const baseDmg = Math.round(boss.maxHp / questions.length);
      const critMultiplier = newCombo >= 3 ? 1.75 : newCombo >= 2 ? 1.35 : 1.0;
      const finalDmg = Math.round(baseDmg * critMultiplier);

      if (soundEnabled) {
        playSound.attack();
        setTimeout(() => playSound.bossHit(), 150);
        if (newCombo >= 2) setTimeout(() => playSound.combo(newCombo), 350);
      }

      setPlayerAnim('attack');
      setBossAnim('hit');
      setScreenFlash(true);
      setTimeout(() => setScreenFlash(false), 200);
      showFloatingEffect(`-${finalDmg} CRITICAL! 💥`, 'text-yellow-400');

      const nextBossHp = Math.max(0, bossHp - finalDmg);
      setBossHp(nextBossHp);
      setScore((prev) => prev + finalDmg * 2);

      setTimeout(() => {
        setPlayerAnim('');
        setBossAnim('');
        if (nextBossHp <= 0) {
          triggerGameOver('win');
        } else {
          advanceNextTurn();
        }
      }, 1000);

    } else {
      setCombo(0);
      const bossDmg = 25;

      if (soundEnabled) {
        playSound.wrong();
        setTimeout(() => playSound.bossHit(), 200);
      }

      setBossAnim('attack');
      setPlayerAnim('hit');
      showFloatingEffect(`-${bossDmg} HP! ⚔️`, 'text-rose-400');

      const nextPlayerHp = Math.max(0, playerHp - bossDmg);
      setPlayerHp(nextPlayerHp);

      setTimeout(() => {
        setBossAnim('');
        setPlayerAnim('');
        if (nextPlayerHp <= 0) {
          triggerGameOver('lose');
        } else {
          advanceNextTurn();
        }
      }, 1000);
    }
  };

  const advanceNextTurn = () => {
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setHiddenOptions([]);
    } else {
      setBossHp(0);
      triggerGameOver('win');
    }
  };

  const handleSpell5050 = () => {
    if (hasUsedSpell5050 || isAnswerSubmitted || isGameOver) return;
    setHasUsedSpell5050(true);
    if (soundEnabled) playSound.click();

    const wrongIdxs = currentQ.options
      .map((_, i) => i)
      .filter((i) => i !== currentQ.answer);
    
    const shuffled = wrongIdxs.sort(() => 0.5 - Math.random()).slice(0, 2);
    setHiddenOptions(shuffled);
    showFloatingEffect('50:50 Spell Activated! ✨', 'text-cyan-300');
  };

  const handleSpellTimeFreeze = () => {
    if (hasUsedFreeze || isGameOver) return;
    setHasUsedFreeze(true);
    if (soundEnabled) playSound.correct();
    setSecondsLeft((prev) => prev + 20);
    showFloatingEffect('+20s Time Freeze! ❄️', 'text-blue-300');
  };

  const handleSpellHeal = () => {
    if (hasUsedHeal || isGameOver) return;
    setHasUsedHeal(true);
    if (soundEnabled) playSound.correct();
    setPlayerHp((prev) => Math.min(100, prev + 40));
    showFloatingEffect('+40 HP Healed! 💚', 'text-emerald-400');
  };

  const handleRestart = () => {
    setQuestions(getRandomizedGameQuestions(game, 6, student?.grade, game?.stream || student?.stream));
    setPlayerHp(100);
    setBossHp(boss.maxHp);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setCombo(0);
    setScore(0);
    setSecondsLeft(game.timeLimitSeconds || 75);
    setIsGameOver(false);
    setBattleOutcome(null);
    setHasUsedSpell5050(false);
    setHasUsedFreeze(false);
    setHasUsedHeal(false);
    setHiddenOptions([]);
  };

  const bossHpPct = Math.max(0, Math.round((bossHp / boss.maxHp) * 100));
  const playerHpPct = Math.max(0, playerHp);

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-1.5 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in font-kantumruy overflow-y-auto">
      
      {screenFlash && (
        <div className="absolute inset-0 bg-red-500/20 z-50 pointer-events-none animate-pulse" />
      )}

      <div className="arcade-cabinet-frame arcade-crt-overlay rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative text-white border-2 border-cyan-400">
        
        {floatingText && (
          <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 text-3xl sm:text-5xl font-black ${floatingText.color} drop-shadow-[0_6px_15px_rgba(0,0,0,0.9)] animate-bounce font-cinzel`}>
            {floatingText.text}
          </div>
        )}

        {/* Top Header Bar */}
        <div className="bg-slate-950 px-4 sm:px-6 py-3 border-b border-cyan-500/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 shadow-md">
              <Sword className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest block font-cinzel">
                ★ ARCADE RPG BOSS DUEL ARENA ★
              </span>
              <h3 className="text-xs sm:text-sm font-black text-white line-clamp-1">
                {game.titleKm}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-cinzel font-bold text-xs border ${
              secondsLeft <= 15 
                ? 'bg-red-500/30 text-red-300 border-red-400 animate-pulse' 
                : 'bg-slate-900 text-cyan-200 border-cyan-500/40'
            }`}>
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{secondsLeft}s</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-red-500/30 text-slate-400 hover:text-red-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Combat Stage */}
        <div className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/80 p-4 sm:p-6 flex flex-col justify-between border-b border-cyan-500/20 overflow-hidden">
          
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none" />
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Player & Boss HUD Row */}
          <div className="grid grid-cols-2 gap-4 sm:gap-8 relative z-10">
            
            {/* Student Hero Card */}
            <div className={`bg-slate-900/90 backdrop-blur-md rounded-2xl p-3 sm:p-4 border-2 border-cyan-400/50 shadow-lg transition-all ${
              playerAnim === 'hit' ? 'border-red-500 bg-red-950/60 animate-shake' : playerAnim === 'attack' ? 'scale-105 border-cyan-300 shadow-[0_0_20px_rgba(56,189,248,0.5)]' : ''
            }`}>
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-cyan-400 bg-slate-950 flex-shrink-0 shadow-md">
                  <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 inset-x-0 bg-cyan-600 text-center text-[9px] font-black text-white font-cinzel">
                    LV.{levelInfo.level}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs sm:text-sm text-cyan-300 truncate">{student.name}</span>
                    <span className="text-[10px] font-black text-cyan-200 font-cinzel">{playerHp} / 100 HP</span>
                  </div>
                  <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-cyan-500/40 mt-1 p-0.5 shadow-inner">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        playerHpPct > 50 ? 'bg-gradient-to-r from-emerald-500 to-cyan-400' : playerHpPct > 25 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-red-600 to-rose-400 animate-pulse'
                      }`}
                      style={{ width: `${playerHpPct}%` }}
                    />
                  </div>
                </div>
              </div>

              {combo >= 2 && (
                <div className="mt-2 text-center text-[10px] font-black text-amber-300 bg-amber-500/20 rounded-lg py-1 border border-amber-400/40 flex items-center justify-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-bounce" />
                  <span>COMBO STREAK x{combo}! (+{combo * 25}% DMG)</span>
                </div>
              )}
            </div>

            {/* Boss Card */}
            <div className={`bg-slate-900/90 backdrop-blur-md rounded-2xl p-3 sm:p-4 border-2 border-rose-500/50 shadow-lg transition-all ${
              bossAnim === 'hit' ? 'border-amber-400 bg-amber-950/60 animate-shake' : bossAnim === 'attack' ? 'scale-105 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.5)]' : ''
            }`}>
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0 text-right">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-rose-200 font-cinzel">{bossHp} / {boss.maxHp} HP</span>
                    <span className="font-extrabold text-xs sm:text-sm text-rose-400 truncate">{boss.name}</span>
                  </div>
                  <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-rose-500/40 mt-1 p-0.5 shadow-inner">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-rose-500 via-red-500 to-amber-500 transition-all duration-300"
                      style={{ width: `${bossHpPct}%` }}
                    />
                  </div>
                </div>
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-rose-500 bg-slate-950 flex-shrink-0 shadow-md">
                  <img src={boss.avatar} alt={boss.name} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 inset-x-0 bg-rose-700 text-center text-[9px] font-black text-white font-cinzel">
                    BOSS
                  </div>
                </div>
              </div>

              <div className="mt-2 text-right text-[10px] text-slate-400 truncate">
                {boss.title}
              </div>
            </div>

          </div>

          {/* Spell / Ability Quick Bar */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-4 relative z-10">
            <button
              type="button"
              disabled={hasUsedSpell5050 || isAnswerSubmitted || isGameOver}
              onClick={handleSpell5050}
              className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                hasUsedSpell5050 
                  ? 'opacity-40 bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                  : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border-cyan-400/50 shadow-sm'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>50:50 Spell</span>
            </button>

            <button
              type="button"
              disabled={hasUsedFreeze || isGameOver}
              onClick={handleSpellTimeFreeze}
              className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                hasUsedFreeze 
                  ? 'opacity-40 bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                  : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-blue-400/50 shadow-sm'
              }`}
            >
              <Hourglass className="w-3.5 h-3.5" />
              <span>+20s Freeze</span>
            </button>

            <button
              type="button"
              disabled={hasUsedHeal || isGameOver}
              onClick={handleSpellHeal}
              className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                hasUsedHeal 
                  ? 'opacity-40 bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                  : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-400/50 shadow-sm'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>+40 HP Potion</span>
            </button>
          </div>

        </div>

        {/* Question & Options Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-white/10 pb-2">
            <span>សំណួរទី {currentQIndex + 1} / {questions.length} (Random Pool)</span>
            <span className="text-amber-400 font-cinzel">COMBAT SCORE: {score}</span>
          </div>

          <div className="bg-slate-950/80 rounded-2xl p-4 border border-cyan-500/30 shadow-inner">
            <h4 className="text-sm sm:text-base font-bold text-white leading-relaxed">
              {currentQ.q}
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((option, idx) => {
              if (hiddenOptions.includes(idx)) {
                return (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950/40 border border-white/5 text-slate-600 text-xs italic text-center">
                    [ជម្រើសត្រូវបានលុបដោយ 50:50 Spell]
                  </div>
                );
              }

              const isSelected = selectedOption === idx;
              const isCorrectAnswer = isAnswerSubmitted && idx === currentQ.answer;
              const isWrongSelection = isAnswerSubmitted && isSelected && idx !== currentQ.answer;

              let btnStyle = 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200';
              if (isCorrectAnswer) {
                btnStyle = 'bg-emerald-600/50 border-emerald-400 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.4)] ring-2 ring-emerald-400';
              } else if (isWrongSelection) {
                btnStyle = 'bg-rose-600/50 border-rose-400 text-rose-100';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isAnswerSubmitted || isGameOver}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-3.5 rounded-xl border-2 text-left text-xs sm:text-sm font-semibold transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
                >
                  <span className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold font-cinzel flex-shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="leading-snug">{option}</span>
                </button>
              );
            })}
          </div>

          {isAnswerSubmitted && currentQ.explanation && (
            <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl p-3 text-xs text-amber-200 leading-relaxed animate-fade-in">
              <span className="font-bold text-amber-300">💡 គន្លឹះដោះស្រាយ៖ </span>
              {currentQ.explanation}
            </div>
          )}

        </div>

        {/* GameOver Overlay */}
        {isGameOver && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center space-y-5 animate-fade-in">
            {battleOutcome === 'win' ? (
              <>
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-2xl animate-bounce">
                  <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                    <Trophy className="w-10 h-10 text-amber-400" />
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-black text-amber-400 tracking-widest uppercase block font-cinzel">
                    ★ VICTORY ACHIEVED! ⚔️ ★
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    អ្នកបានយកឈ្នះ {boss.name}!
                  </h3>
                  <p className="text-xs text-blue-200 max-w-md">
                    ចំណេះដឹងរបស់អ្នកបានបំបាក់មេបិសាចវិជ្ជា និងទទួលបានពិន្ទុរង្វាន់ XP យ៉ាងច្រើន!
                  </p>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 border border-white/20 flex items-center gap-6 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">COMBAT SCORE</span>
                    <span className="font-cinzel text-lg font-black text-amber-300">{score}</span>
                  </div>
                  <div className="w-px h-8 bg-white/20" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">REWARD XP</span>
                    <span className="font-cinzel text-lg font-black text-emerald-400">+{game.xpReward + combo * 25 + 100} XP</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
                  <Skull className="w-10 h-10 text-red-400" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-black text-red-400 tracking-widest uppercase block font-cinzel">
                    DEFEATED IN COMBAT 🛡️
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {boss.name} បានវាយបកឈ្នះ!
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md">
                    កុំបោះបង់! ហាត់សមបន្ថែម និងសាកល្បងប្រយុទ្ធម្តងទៀតដើម្បីដណ្តើមយកជ័យជម្នះ!
                  </p>
                </div>
              </>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleRestart}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>ប្រយុទ្ធម្តងទៀត (Rematch)</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer border border-white/20"
              >
                <span>ចាកចេញ (Exit Arena)</span>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>,
    document.body
  );
}
