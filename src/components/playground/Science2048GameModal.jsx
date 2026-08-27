import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Sparkles, 
  RotateCcw, 
  X, 
  Trophy, 
  Flame, 
  Crown,
  Volume2,
  VolumeX,
  Layers,
  Award,
  Grid
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { playSound } from '../../utils/audioEffects';

const ELEMENT_MAP = {
  2: { symbol: 'H', name: 'អ៊ីដ្រូសែន', color: 'bg-slate-800 text-cyan-300 border-cyan-500/40 shadow-sm' },
  4: { symbol: 'He', name: 'អេល្យូម', color: 'bg-indigo-900 text-indigo-200 border-indigo-500/50 shadow-md' },
  8: { symbol: 'Li', name: 'លីចូម', color: 'bg-blue-900 text-blue-200 border-blue-400/60 shadow-md' },
  16: { symbol: 'C', name: 'កាបូន', color: 'bg-emerald-900 text-emerald-200 border-emerald-400/60 shadow-md' },
  32: { symbol: 'N', name: 'អាសូត', color: 'bg-teal-900 text-teal-200 border-teal-400/60 shadow-md' },
  64: { symbol: 'O', name: 'អុកស៊ីសែន', color: 'bg-cyan-900 text-cyan-200 border-cyan-400/70 shadow-lg' },
  128: { symbol: 'Na', name: 'សូដ្យូម', color: 'bg-amber-900 text-amber-200 border-amber-400/70 shadow-lg' },
  256: { symbol: 'Fe', name: 'ដែក', color: 'bg-orange-900 text-orange-200 border-orange-400/80 shadow-lg' },
  512: { symbol: 'Cu', name: 'ទង់ដែង', color: 'bg-rose-900 text-rose-200 border-rose-400/90 shadow-xl' },
  1024: { symbol: 'Ag', name: 'ប្រាក់ (Silver)', color: 'bg-purple-900 text-purple-200 border-purple-400 shadow-xl' },
  2048: { symbol: 'Au', name: 'មាស (Gold)', color: 'bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 border-amber-300 shadow-[0_0_25px_rgba(250,204,21,0.8)]' }
};

export default function Science2048GameModal({ onClose }) {
  const { addXP } = useAuth();
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [grid, setGrid] = useState([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  const addRandomTile = (currentGrid) => {
    const emptyCells = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (currentGrid[r][c] === 0) emptyCells.push({ r, c });
      }
    }
    if (emptyCells.length === 0) return currentGrid;

    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newGrid = currentGrid.map((row) => [...row]);
    newGrid[randomCell.r][randomCell.c] = Math.random() < 0.85 ? 2 : 4;
    return newGrid;
  };

  const initializeGame = () => {
    let newGrid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    newGrid = addRandomTile(newGrid);
    newGrid = addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setIsGameOver(false);
    setHasWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const slideRow = (row) => {
    let filtered = row.filter((val) => val !== 0);
    let gainedScore = 0;
    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        gainedScore += filtered[i];
        filtered[i + 1] = 0;
        if (filtered[i] === 2048) setHasWon(true);
      }
    }
    filtered = filtered.filter((val) => val !== 0);
    while (filtered.length < 4) {
      filtered.push(0);
    }
    return { newRow: filtered, gainedScore };
  };

  const moveLeft = (currentGrid) => {
    let moved = false;
    let totalScore = 0;
    const newGrid = currentGrid.map((row) => {
      const { newRow, gainedScore } = slideRow(row);
      totalScore += gainedScore;
      if (JSON.stringify(newRow) !== JSON.stringify(row)) moved = true;
      return newRow;
    });
    return { newGrid, moved, gainedScore: totalScore };
  };

  const rotateGrid = (currentGrid) => {
    const rotated = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        rotated[c][3 - r] = currentGrid[r][c];
      }
    }
    return rotated;
  };

  const handleMove = (direction) => {
    if (isGameOver) return;

    let workGrid = grid;
    let rotations = 0;

    if (direction === 'UP') rotations = 3;
    else if (direction === 'RIGHT') rotations = 2;
    else if (direction === 'DOWN') rotations = 1;

    for (let i = 0; i < rotations; i++) {
      workGrid = rotateGrid(workGrid);
    }

    const { newGrid: movedGrid, moved, gainedScore } = moveLeft(workGrid);

    let finalGrid = movedGrid;
    for (let i = 0; i < (4 - rotations) % 4; i++) {
      finalGrid = rotateGrid(finalGrid);
    }

    if (moved) {
      if (soundEnabled) {
        if (gainedScore > 0) playSound.correct();
        else playSound.click();
      }

      const gridWithNewTile = addRandomTile(finalGrid);
      setGrid(gridWithNewTile);
      const newScore = score + gainedScore;
      setScore(newScore);
      if (newScore > bestScore) setBestScore(newScore);

      if (gainedScore >= 64) {
        addXP(Math.round(gainedScore / 4));
      }

      checkGameOver(gridWithNewTile);
    }
  };

  const checkGameOver = (g) => {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (g[r][c] === 0) return;
        if (r < 3 && g[r][c] === g[r + 1][c]) return;
        if (c < 3 && g[r][c] === g[r][c + 1]) return;
      }
    }
    setIsGameOver(true);
    if (soundEnabled) playSound.wrong();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) handleMove('LEFT');
      if (['ArrowRight', 'KeyD'].includes(e.code)) handleMove('RIGHT');
      if (['ArrowUp', 'KeyW'].includes(e.code)) handleMove('UP');
      if (['ArrowDown', 'KeyS'].includes(e.code)) handleMove('DOWN');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-1.5 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in font-kantumruy overflow-y-auto">
      
      <div className="arcade-cabinet-frame arcade-crt-overlay rounded-3xl w-full max-w-lg flex flex-col overflow-hidden shadow-2xl relative text-white border-2 border-amber-400">
        
        {/* Header */}
        <div className="bg-slate-950 px-5 py-3.5 border-b border-amber-500/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-sm">
              <Grid className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block font-cinzel">
                ★ 2048 SCIENCE ELEMENT EVOLUTION ★
              </span>
              <h3 className="text-xs sm:text-sm font-black text-white">
                បំលែងធាតុគីមី & រូបមន្តវិទ្យាសាស្ត្រ (2048 Fusion)
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-red-500/30 text-slate-400 hover:text-red-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Score Board */}
        <div className="p-4 bg-slate-950/60 flex items-center justify-between border-b border-amber-500/20">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 px-3.5 py-1.5 rounded-xl border border-amber-400/30 text-center">
              <span className="text-[9px] text-slate-400 block font-bold">SCORE</span>
              <span className="text-sm font-black text-amber-300 font-cinzel">{score}</span>
            </div>
            <div className="bg-slate-900 px-3.5 py-1.5 rounded-xl border border-cyan-400/30 text-center">
              <span className="text-[9px] text-slate-400 block font-bold">BEST</span>
              <span className="text-sm font-black text-cyan-300 font-cinzel">{bestScore}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={initializeGame}
            className="p-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Grid</span>
          </button>
        </div>

        {/* 4x4 Grid Stage */}
        <div className="p-4 sm:p-6 flex flex-col items-center justify-center">
          <div className="bg-slate-950 p-3 rounded-2xl border-2 border-amber-500/30 grid grid-cols-4 gap-2.5 w-full max-w-[360px] aspect-square shadow-inner">
            {grid.map((row, rIdx) =>
              row.map((cellVal, cIdx) => {
                const element = ELEMENT_MAP[cellVal];
                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className={`rounded-xl flex flex-col items-center justify-center border-2 transition-all duration-200 ${
                      cellVal === 0
                        ? 'bg-slate-900/40 border-white/5'
                        : `${element?.color || 'bg-slate-800 text-white'} scale-100`
                    }`}
                  >
                    {cellVal > 0 && (
                      <>
                        <span className="font-cinzel text-base sm:text-xl font-black tracking-tight">
                          {element?.symbol || cellVal}
                        </span>
                        <span className="text-[10px] sm:text-xs font-bold line-clamp-1 opacity-95">
                          {element?.name || cellVal}
                        </span>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-slate-950 p-3 border-t border-amber-500/20 flex flex-col items-center gap-2">
          <div className="text-[10px] text-slate-400">
            🎮 <strong>បញ្ជា៖</strong> ចុចព្រួញ <strong>↑ ↓ ← →</strong> ឬប៊ូតុងខាងក្រោមដើម្បីរុញផ្គុំធាតុ៖
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleMove('UP')}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 font-bold text-xs cursor-pointer border border-white/10"
            >
              ↑ លើ
            </button>
            <button
              onClick={() => handleMove('LEFT')}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 font-bold text-xs cursor-pointer border border-white/10"
            >
              ← ឆ្វេង
            </button>
            <button
              onClick={() => handleMove('DOWN')}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 font-bold text-xs cursor-pointer border border-white/10"
            >
              ↓ ក្រោម
            </button>
            <button
              onClick={() => handleMove('RIGHT')}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 font-bold text-xs cursor-pointer border border-white/10"
            >
              → ស្តាំ
            </button>
          </div>
        </div>

        {/* GameOver Screen */}
        {isGameOver && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center">
              <X className="w-8 h-8 text-rose-400" />
            </div>
            <h3 className="text-xl font-black text-white">គ្មានក្រឡាអាចផ្គុំបានទៀតទេ!</h3>
            <p className="text-xs text-slate-400">ពិន្ទុសម្រេចបាន៖ <strong className="text-amber-300 font-cinzel">{score}</strong></p>

            <button
              type="button"
              onClick={initializeGame}
              className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs cursor-pointer shadow-md"
            >
              លេងម្តងទៀត (Try Again)
            </button>
          </div>
        )}

      </div>

    </div>,
    document.body
  );
}
