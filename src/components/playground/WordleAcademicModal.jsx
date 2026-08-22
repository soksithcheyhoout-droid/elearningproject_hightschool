import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Sparkles, 
  RotateCcw, 
  X, 
  Trophy, 
  Volume2, 
  VolumeX, 
  Flame, 
  Award,
  Key,
  Delete,
  CornerDownLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { playSound } from '../../utils/audioEffects';

const ACADEMIC_WORDS = [
  { word: 'LIMIT', clueKm: 'កន្សោមគណិតវិទ្យាសម្រាប់គណនាតម្លៃខិតជិតត្រង់ចំណុច (Calculus)', subject: 'គណិតវិទ្យា' },
  { word: 'ESTER', clueKm: 'សមាសធាតុសរីរាង្គមានក្លិនក្រអូប ផ្សំពីអាស៊ីត + អាល់កុល', subject: 'គីមីវិទ្យា' },
  { word: 'RADIO', clueKm: 'បាតុភូតបំបែកស្នូលដោយបញ្ចេញកាំរស្មី α, β, γ', subject: 'រូបវិទ្យា' },
  { word: 'CLONE', clueKm: 'ការបង្កើតសារពាង្គកាយថ្មីដែលមានពន្ធុដូចគ្នាបេះបិទ', subject: 'ជីវវិទ្យា' },
  { word: 'NOVEL', clueKm: 'ស្នាដៃអក្សរសិល្ប៍បែបប្រឌិតឆ្លុះបញ្ចាំងសង្គម (ប្រលោមលោក)', subject: 'អក្សរសាស្ត្រ' },
  { word: 'FORCE', clueKm: 'ទំហំវ៉ិចទ័របណ្តាលឱ្យអង្គធាតុមានសំទុះ (F = ma)', subject: 'រូបវិទ្យា' },
  { word: 'ANGKOR', clueKm: 'រាជធានីនៃចក្រភពខ្មែរបុរាណ និងជាបេតិកភណ្ឌពិភពលោក', subject: 'ប្រវត្តិវិទ្យា' }
];

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']
];

export default function WordleAcademicModal({ onClose }) {
  const { addXP } = useAuth();
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [wordItem, setWordItem] = useState(ACADEMIC_WORDS[0]);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [shakeRow, setShakeRow] = useState(false);

  const targetWord = wordItem.word;
  const wordLen = targetWord.length;

  const initializeGame = () => {
    const randomItem = ACADEMIC_WORDS[Math.floor(Math.random() * ACADEMIC_WORDS.length)];
    setWordItem(randomItem);
    setGuesses([]);
    setCurrentGuess('');
    setIsGameOver(false);
    setIsWon(false);
    setShakeRow(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleKeyPress = (key) => {
    if (isGameOver || isWon) return;

    if (key === 'ENTER') {
      if (currentGuess.length !== wordLen) {
        if (soundEnabled) playSound.wrong();
        setShakeRow(true);
        setTimeout(() => setShakeRow(false), 600);
        return;
      }

      if (soundEnabled) playSound.correct();
      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);
      setCurrentGuess('');

      if (currentGuess === targetWord) {
        setIsWon(true);
        if (soundEnabled) playSound.victory();
        addXP(350);
      } else if (newGuesses.length >= 6) {
        setIsGameOver(true);
        if (soundEnabled) playSound.wrong();
      }

    } else if (key === 'BACK' || key === 'BACKSPACE') {
      if (soundEnabled) playSound.click();
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (currentGuess.length < wordLen && /^[A-Z]$/.test(key)) {
      if (soundEnabled) playSound.click();
      setCurrentGuess((prev) => prev + key);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') handleKeyPress('ENTER');
      else if (e.key === 'Backspace') handleKeyPress('BACK');
      else {
        const char = e.key.toUpperCase();
        if (/^[A-Z]$/.test(char)) handleKeyPress(char);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const getLetterStatus = (letter) => {
    let status = 'default';
    guesses.forEach((guess) => {
      for (let i = 0; i < guess.length; i++) {
        if (guess[i] === letter) {
          if (targetWord[i] === letter) {
            status = 'correct';
            return;
          } else if (targetWord.includes(letter) && status !== 'correct') {
            status = 'present';
          } else if (status === 'default') {
            status = 'absent';
          }
        }
      }
    });
    return status;
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-1.5 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in font-kantumruy overflow-y-auto">
      
      <div className="arcade-cabinet-frame arcade-crt-overlay rounded-3xl w-full max-w-lg flex flex-col overflow-hidden shadow-2xl relative text-white border-2 border-emerald-400">
        
        {/* Header */}
        <div className="bg-slate-950 px-4 sm:px-6 py-3 border-b border-emerald-500/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-sm">
              <Key className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block font-cinzel">
                ★ WORDLE ACADEMIC VOCABULARY ★
              </span>
              <h3 className="text-xs sm:text-sm font-black text-white">
                ល្បែងទាយពាក្យគន្លឹះវិទ្យាសាស្ត្រ (Wordle Master)
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-red-500/30 text-slate-400 hover:text-red-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Clue Banner */}
        <div className="bg-slate-950/80 px-4 py-2.5 border-b border-emerald-500/20 text-xs">
          <span className="font-black text-emerald-400">💡 គន្លឹះ ({wordItem.subject})៖ </span>
          <span className="text-slate-200">{wordItem.clueKm} ({wordLen} អក្សរ)</span>
        </div>

        {/* 6-Row Wordle Grid */}
        <div className="p-4 sm:p-5 flex flex-col items-center justify-center gap-2">
          {[...Array(6)].map((_, rIdx) => {
            const isCurrentRow = rIdx === guesses.length;
            const guess = guesses[rIdx] || (isCurrentRow ? currentGuess : '');

            return (
              <div 
                key={rIdx} 
                className={`flex items-center gap-1.5 ${isCurrentRow && shakeRow ? 'animate-shake' : ''}`}
              >
                {[...Array(wordLen)].map((_, cIdx) => {
                  const char = guess[cIdx] || '';
                  const isGuessed = rIdx < guesses.length;

                  let style = 'bg-slate-800/80 border-slate-700 text-white';
                  if (isGuessed) {
                    if (targetWord[cIdx] === char) {
                      style = 'bg-emerald-600 border-emerald-400 text-white font-black shadow-[0_0_12px_rgba(16,185,129,0.5)]';
                    } else if (targetWord.includes(char)) {
                      style = 'bg-amber-600 border-amber-400 text-white font-black shadow-[0_0_12px_rgba(245,158,11,0.5)]';
                    } else {
                      style = 'bg-slate-950 border-slate-800 text-slate-600';
                    }
                  } else if (char) {
                    style = 'bg-slate-700 border-cyan-400 text-white scale-105 shadow-sm';
                  }

                  return (
                    <div
                      key={cIdx}
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl border-2 flex items-center justify-center font-cinzel text-lg sm:text-xl font-black uppercase transition-all duration-300 ${style}`}
                    >
                      {char}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Virtual Keyboard */}
        <div className="bg-slate-950 p-3 sm:p-4 border-t border-emerald-500/20 space-y-1.5 flex flex-col items-center">
          {KEYBOARD_ROWS.map((row, rIdx) => (
            <div key={rIdx} className="flex items-center gap-1">
              {row.map((k) => {
                const status = getLetterStatus(k);
                let btnStyle = 'bg-slate-850 hover:bg-slate-750 text-white border border-slate-700';
                if (status === 'correct') btnStyle = 'bg-emerald-600 text-white border-emerald-400 shadow-sm';
                else if (status === 'present') btnStyle = 'bg-amber-600 text-white border-amber-400 shadow-sm';
                else if (status === 'absent') btnStyle = 'bg-slate-950 text-slate-600 opacity-60 border-transparent';

                const isWide = k === 'ENTER' || k === 'BACK';

                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => handleKeyPress(k)}
                    className={`h-10 rounded-lg text-xs font-black font-cinzel transition-all active:scale-95 flex items-center justify-center cursor-pointer ${
                      isWide ? 'px-2.5 sm:px-3 text-[10px] bg-slate-700' : 'w-8 sm:w-9'
                    } ${btnStyle}`}
                  >
                    {k === 'BACK' ? <Delete className="w-3.5 h-3.5" /> : k}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Victory / Game Over Overlay */}
        {(isWon || isGameOver) && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fade-in">
            {isWon ? (
              <>
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-400 p-0.5 animate-bounce shadow-2xl">
                  <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-emerald-400" />
                  </div>
                </div>
                <div>
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-widest font-cinzel">★ EXCELLENT DEDUCTION! 🎉 ★</span>
                  <h3 className="text-2xl font-black text-white">ពាក្យត្រឹមត្រូវគឺ «{targetWord}»!</h3>
                  <p className="text-xs text-blue-200 mt-1">អ្នកបានទាយត្រូវក្នុងចំនួន {guesses.length} ដង!</p>
                </div>
                <div className="bg-white/10 rounded-xl px-4 py-2 border border-white/20 text-xs font-bold text-emerald-400 font-cinzel">
                  +350 XP AWARDED
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center">
                  <X className="w-8 h-8 text-rose-400" />
                </div>
                <div>
                  <span className="text-xs font-black text-rose-400 uppercase tracking-widest font-cinzel">OUT OF GUESSES!</span>
                  <h3 className="text-xl font-black text-white">ពាក្យត្រឹមត្រូវគឺ «{targetWord}»</h3>
                </div>
              </>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={initializeGame}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <RotateCcw className="w-4 h-4" />
                <span>ពាក្យថ្មី (Next Word)</span>
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
