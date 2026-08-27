import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Sparkles, 
  Clock, 
  RotateCcw, 
  X, 
  Trophy, 
  Award, 
  Flame,
  Zap,
  CheckCircle2,
  Volume2,
  VolumeX,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { playSound } from '../../utils/audioEffects';
import { getRandomMemoryPairs } from '../../utils/gamePoolManager';

export default function MemoryMatchGameModal({ onClose }) {
  const { addXP } = useAuth();
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Deck generation
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]); // indices
  const [matchedIds, setMatchedIds] = useState([]); // card.pairId
  const [moves, setMoves] = useState(0);
  const [combo, setCombo] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isWon, setIsWon] = useState(false);

  // Initialize deck
  const initializeGame = () => {
    const pairs = getRandomMemoryPairs(8);
    const deck = [];
    pairs.forEach((pair) => {
      deck.push({
        uid: `${pair.id}-A`,
        pairId: pair.id,
        content: pair.textA,
        tag: pair.tag,
        isMatched: false
      });
      deck.push({
        uid: `${pair.id}-B`,
        pairId: pair.id,
        content: pair.textB,
        tag: pair.tag,
        isMatched: false
      });
    });

    // Shuffle deck
    const shuffled = deck.sort(() => 0.5 - Math.random());
    setCards(shuffled);
    setFlippedCards([]);
    setMatchedIds([]);
    setMoves(0);
    setCombo(0);
    setSeconds(0);
    setIsWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  // Timer
  useEffect(() => {
    if (isWon) return;
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isWon]);

  // Card click handler
  const handleCardClick = (index) => {
    if (flippedCards.length === 2 || flippedCards.includes(index) || cards[index].isMatched) return;

    if (soundEnabled) playSound.click();

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      const card1 = cards[newFlipped[0]];
      const card2 = cards[newFlipped[1]];

      if (card1.pairId === card2.pairId) {
        // MATCH!
        if (soundEnabled) {
          playSound.correct();
          if (combo >= 1) setTimeout(() => playSound.combo(combo + 1), 200);
        }
        setCombo((prev) => prev + 1);
        setMatchedIds((prev) => [...prev, card1.pairId]);
        setCards((prev) =>
          prev.map((c) =>
            c.pairId === card1.pairId ? { ...c, isMatched: true } : c
          )
        );
        setFlippedCards([]);

        // Check if all matched
        if (matchedIds.length + 1 === defaultPairs.length) {
          setIsWon(true);
          if (soundEnabled) playSound.victory();
          addXP(300);
        }
      } else {
        // NO MATCH
        if (soundEnabled) playSound.wrong();
        setCombo(0);
        setTimeout(() => {
          setFlippedCards([]);
        }, 900);
      }
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-1.5 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in font-kantumruy overflow-y-auto">
      
      <div className="bg-slate-900 border-2 border-cyan-400/80 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative text-white">
        
        {/* Header */}
        <div className="bg-slate-950/90 px-4 sm:px-6 py-3 border-b border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-400/20 text-cyan-300 border border-cyan-400/40">
              <Layers className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">
                3D Memory Card Match Arena
              </span>
              <h3 className="text-xs sm:text-sm font-black text-white">
                ល្បែងផ្គូផ្គងរូបមន្ត និងចំណេះដឹងទូទៅ (Formula Memory Duel)
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

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-bold font-cinzel text-blue-200">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}</span>
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

        {/* Stats Row */}
        <div className="bg-slate-950/50 px-4 sm:px-6 py-2.5 border-b border-white/10 flex items-center justify-between text-xs font-bold text-slate-300">
          <div className="flex items-center gap-4">
            <span>ចំនួនត្រឡប់ (Moves): <strong className="text-white font-cinzel">{moves}</strong></span>
            <span>គូផ្គូផ្គងបាន៖ <strong className="text-cyan-300 font-cinzel">{matchedIds.length} / {defaultPairs.length}</strong></span>
          </div>

          {combo >= 2 && (
            <div className="flex items-center gap-1 text-amber-300 text-[11px] font-black bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-400/40 animate-pulse">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>STREAK x{combo}!</span>
            </div>
          )}
        </div>

        {/* Cards Grid */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
            {cards.map((card, idx) => {
              const isFlipped = flippedCards.includes(idx) || card.isMatched;

              return (
                <div
                  key={card.uid}
                  onClick={() => handleCardClick(idx)}
                  className="aspect-[4/3] sm:aspect-square perspective-500 cursor-pointer"
                >
                  <div
                    className={`w-full h-full rounded-2xl transition-all duration-500 transform-style-preserve-3d relative shadow-lg ${
                      isFlipped ? 'rotate-y-180' : 'hover:scale-105'
                    }`}
                  >
                    {/* Card Back (Hidden state) */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#002b5b] to-[#005baa] rounded-2xl border-2 border-cyan-400/40 flex flex-col items-center justify-center p-3 text-center backface-hidden shadow-inner">
                      <Sparkles className="w-6 h-6 text-cyan-300 animate-pulse mb-1" />
                      <span className="text-[10px] font-black text-cyan-200 uppercase tracking-wider font-cinzel">
                        BAC II
                      </span>
                    </div>

                    {/* Card Front (Revealed state) */}
                    <div
                      className={`absolute inset-0 rounded-2xl p-3 text-center flex flex-col items-center justify-center rotate-y-180 backface-hidden border-2 ${
                        card.isMatched
                          ? 'bg-emerald-950/80 border-emerald-400 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                          : 'bg-slate-800 border-cyan-400 text-white'
                      }`}
                    >
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-cyan-300 mb-1">
                        {card.tag}
                      </span>
                      <p className="text-xs sm:text-sm font-extrabold line-clamp-3 leading-snug">
                        {card.content}
                      </p>
                      {card.isMatched && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Victory Screen */}
        {isWon && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 p-0.5 shadow-2xl animate-bounce">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                <Trophy className="w-10 h-10 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="text-xs font-black text-cyan-400 tracking-widest uppercase block">
                PERFECT MEMORY MATCH! 🎉
              </span>
              <h3 className="text-2xl font-black text-white">
                អ្នកបានផ្គូផ្គងរូបមន្តទាំងអស់បានជោគជ័យ!
              </h3>
              <p className="text-xs text-blue-200 mt-1">
                ប្រើពេល {seconds} វិនាទី ក្នុងចំនួនត្រឡប់ {moves} ដង!
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-4 border border-white/20 flex items-center gap-6 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">TIME TAKEN</span>
                <span className="font-cinzel text-lg font-black text-cyan-300">{seconds}s</span>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div>
                <span className="text-slate-400 block text-[10px]">REWARD XP</span>
                <span className="font-cinzel text-lg font-black text-emerald-400">+300 XP</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={initializeGame}
                className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>លេងម្តងទៀត (Play Again)</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer border border-white/20"
              >
                <span>ចាកចេញ (Exit)</span>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>,
    document.body
  );
}
