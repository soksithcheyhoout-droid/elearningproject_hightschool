import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Sparkles, 
  RotateCcw, 
  X, 
  Trophy, 
  Volume2, 
  VolumeX, 
  Flame, 
  Clock,
  Zap,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { playSound } from '../../utils/audioEffects';

const SNAKE_QUESTIONS = [
  { q: 'គណនា 25 + 37 = ?', correct: '62', wrongs: ['52', '64', '72'] },
  { q: 'គណនា lim (x → 3) (x² - 9)/(x - 3) = ?', correct: '6', wrongs: ['3', '0', '9'] },
  { q: 'ម៉ូឌុលនៃ 3 + 4i = ?', correct: '5', wrongs: ['7', '25', '1'] },
  { q: 'ចំនួនបន្សំ C(4, 2) = ?', correct: '6', wrongs: ['12', '8', '4'] },
  { q: 'pH នៃទឹកសុទ្ធអព្យាក្រឹត្យ = ?', correct: '7', wrongs: ['0', '14', '1'] }
];

export default function SnakeMathModal({ onClose }) {
  const { addXP } = useAuth();
  const canvasRef = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const currentQ = SNAKE_QUESTIONS[qIndex % SNAKE_QUESTIONS.length];

  const stateRef = useRef({
    gridSize: 18,
    tileSize: 20,
    snake: [
      { x: 8, y: 8 },
      { x: 7, y: 8 },
      { x: 6, y: 8 }
    ],
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    foods: [],
    speed: 125,
    lastTick: 0
  });

  const spawnFoods = () => {
    const foods = [];
    const allOptions = [
      { text: currentQ.correct, isCorrect: true },
      ...currentQ.wrongs.map((w) => ({ text: w, isCorrect: false }))
    ];

    allOptions.forEach((opt) => {
      let rx, ry;
      let valid = false;
      while (!valid) {
        rx = Math.floor(Math.random() * 16) + 1;
        ry = Math.floor(Math.random() * 16) + 1;
        const onSnake = stateRef.current.snake.some((s) => s.x === rx && s.y === ry);
        const onFood = foods.some((f) => f.x === rx && f.y === ry);
        if (!onSnake && !onFood) valid = true;
      }
      foods.push({
        x: rx,
        y: ry,
        text: opt.text,
        isCorrect: opt.isCorrect,
        color: opt.isCorrect ? '#10b981' : '#f43f5e'
      });
    });

    stateRef.current.foods = foods;
  };

  useEffect(() => {
    spawnFoods();
  }, [qIndex]);

  useEffect(() => {
    let animId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleKeyDown = (e) => {
      const dir = stateRef.current.dir;
      if ((e.code === 'ArrowUp' || e.code === 'KeyW') && dir.y === 0) stateRef.current.nextDir = { x: 0, y: -1 };
      if ((e.code === 'ArrowDown' || e.code === 'KeyS') && dir.y === 0) stateRef.current.nextDir = { x: 0, y: 1 };
      if ((e.code === 'ArrowLeft' || e.code === 'KeyA') && dir.x === 0) stateRef.current.nextDir = { x: -1, y: 0 };
      if ((e.code === 'ArrowRight' || e.code === 'KeyD') && dir.x === 0) stateRef.current.nextDir = { x: 1, y: 0 };
    };

    window.addEventListener('keydown', handleKeyDown);

    const loop = (timestamp) => {
      if (isGameOver || isWon) return;

      const state = stateRef.current;
      if (timestamp - state.lastTick > state.speed) {
        state.lastTick = timestamp;

        state.dir = state.nextDir;
        const head = { x: state.snake[0].x + state.dir.x, y: state.snake[0].y + state.dir.y };

        if (head.x < 0 || head.x >= state.gridSize || head.y < 0 || head.y >= state.gridSize) {
          handleGameOver();
          return;
        }

        if (state.snake.some((s) => s.x === head.x && s.y === head.y)) {
          handleGameOver();
          return;
        }

        const eatenIdx = state.foods.findIndex((f) => f.x === head.x && f.y === head.y);

        if (eatenIdx !== -1) {
          const eaten = state.foods[eatenIdx];
          if (eaten.isCorrect) {
            if (soundEnabled) playSound.correct();
            setScore((prev) => prev + 100);
            setFeedback({ text: '🎯 ញ៉ាំចំចម្លើយត្រឹមត្រូវ! (+100 XP)', color: 'text-emerald-400' });
            state.snake.unshift(head);

            setTimeout(() => {
              setFeedback(null);
              if (qIndex + 1 < SNAKE_QUESTIONS.length) {
                setQIndex((prev) => prev + 1);
              } else {
                setIsWon(true);
                if (soundEnabled) playSound.victory();
                addXP(300);
              }
            }, 500);

          } else {
            if (soundEnabled) playSound.wrong();
            handleGameOver();
            return;
          }
        } else {
          state.snake.unshift(head);
          state.snake.pop();
        }
      }

      // Render
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let i = 0; i <= state.gridSize; i++) {
        ctx.beginPath();
        ctx.moveTo(i * state.tileSize, 0);
        ctx.lineTo(i * state.tileSize, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * state.tileSize);
        ctx.lineTo(canvas.width, i * state.tileSize);
        ctx.stroke();
      }

      state.foods.forEach((food) => {
        ctx.fillStyle = food.color;
        ctx.shadowColor = food.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(
          food.x * state.tileSize + state.tileSize / 2,
          food.y * state.tileSize + state.tileSize / 2,
          state.tileSize / 2 - 2,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px Kantumruy Pro, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          food.text,
          food.x * state.tileSize + state.tileSize / 2,
          food.y * state.tileSize + state.tileSize / 2
        );
      });

      state.snake.forEach((segment, idx) => {
        ctx.fillStyle = idx === 0 ? '#38bdf8' : '#0284c7';
        if (idx === 0) {
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 6;
        }
        ctx.beginPath();
        ctx.roundRect(
          segment.x * state.tileSize + 1,
          segment.y * state.tileSize + 1,
          state.tileSize - 2,
          state.tileSize - 2,
          idx === 0 ? 6 : 3
        );
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [qIndex, isGameOver, isWon, soundEnabled]);

  const handleGameOver = () => {
    setIsGameOver(true);
    if (soundEnabled) playSound.wrong();
    setFeedback({ text: '💥 ពស់បានបុកទង្គិចហើយ!', color: 'text-rose-400' });
  };

  const handleRestart = () => {
    stateRef.current.snake = [
      { x: 8, y: 8 },
      { x: 7, y: 8 },
      { x: 6, y: 8 }
    ];
    stateRef.current.dir = { x: 1, y: 0 };
    stateRef.current.nextDir = { x: 1, y: 0 };
    setQIndex(0);
    setScore(0);
    setIsGameOver(false);
    setIsWon(false);
    setFeedback(null);
    spawnFoods();
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-1.5 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in font-kantumruy overflow-y-auto">
      
      <div className="arcade-cabinet-frame arcade-crt-overlay rounded-3xl w-full max-w-lg flex flex-col overflow-hidden shadow-2xl relative text-white border-2 border-teal-400">
        
        {/* Header */}
        <div className="bg-slate-950 px-4 sm:px-6 py-3 border-b border-teal-500/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-400/40 shadow-sm">
              <Activity className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest block font-cinzel">
                ★ RETRO SNAKE MATH & FORMULA ★
              </span>
              <h3 className="text-xs sm:text-sm font-black text-white">
                ពស់ស៊ីរូបមន្ត & លំហាត់គណិត (Snake Math)
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-teal-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
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

        {/* Question Banner */}
        <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-teal-950 px-4 py-2.5 border-b border-teal-500/20 flex items-center justify-between gap-2 text-xs">
          <div>
            <span className="text-[10px] font-black text-teal-400 font-cinzel">TARGET {qIndex + 1}/{SNAKE_QUESTIONS.length}៖ </span>
            <span className="font-extrabold text-white">{currentQ.q}</span>
          </div>
          <span className="font-cinzel text-amber-300 font-black">SCORE: {score}</span>
        </div>

        {/* Canvas Stage */}
        <div className="p-4 flex flex-col items-center justify-center relative">
          {feedback && (
            <div className={`absolute top-6 left-1/2 -translate-x-1/2 z-30 text-xs sm:text-sm font-black ${feedback.color} bg-slate-950/90 px-4 py-1 rounded-full border border-teal-400/40 shadow-lg animate-bounce font-cinzel`}>
              {feedback.text}
            </div>
          )}

          <canvas
            ref={canvasRef}
            width={360}
            height={360}
            className="rounded-2xl border-2 border-teal-500/30 shadow-inner bg-slate-950"
          />

          {(isGameOver || isWon) && (
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fade-in">
              {isWon ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-400 p-0.5 animate-bounce shadow-2xl">
                    <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                      <Trophy className="w-8 h-8 text-emerald-400" />
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">ជើងឯកពស់ស៊ីរូបមន្ត! 🎉</h3>
                  <p className="text-xs text-blue-200">អ្នកបានញ៉ាំចំចម្លើយត្រឹមត្រូវទាំងអស់!</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center">
                    <X className="w-8 h-8 text-rose-400" />
                  </div>
                  <h3 className="text-xl font-black text-white">ចប់ការប្រកួត (Game Over)</h3>
                  <p className="text-xs text-slate-400">ពិន្ទុ៖ <strong className="text-amber-300 font-cinzel">{score}</strong></p>
                </>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>លេងម្តងទៀត (Try Again)</span>
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

        {/* Controls */}
        <div className="bg-slate-950 p-3 border-t border-teal-500/20 flex flex-col items-center gap-2">
          <div className="text-[10px] text-slate-400 hidden sm:block">
            🎮 ចុចព្រួញ <strong>↑ ↓ ← →</strong> ឬ <strong>WASD</strong> ដើម្បីបញ្ជាទិសដៅពស់
          </div>

          <div className="grid grid-cols-3 gap-1.5 w-40">
            <div />
            <button
              onClick={() => { if (stateRef.current.dir.y === 0) stateRef.current.nextDir = { x: 0, y: -1 }; }}
              className="p-2 rounded-lg bg-slate-800 active:bg-teal-600 text-white font-bold text-xs cursor-pointer border border-white/10"
            >
              ↑
            </button>
            <div />
            <button
              onClick={() => { if (stateRef.current.dir.x === 0) stateRef.current.nextDir = { x: -1, y: 0 }; }}
              className="p-2 rounded-lg bg-slate-800 active:bg-teal-600 text-white font-bold text-xs cursor-pointer border border-white/10"
            >
              ←
            </button>
            <button
              onClick={() => { if (stateRef.current.dir.y === 0) stateRef.current.nextDir = { x: 0, y: 1 }; }}
              className="p-2 rounded-lg bg-slate-800 active:bg-teal-600 text-white font-bold text-xs cursor-pointer border border-white/10"
            >
              ↓
            </button>
            <button
              onClick={() => { if (stateRef.current.dir.x === 0) stateRef.current.nextDir = { x: 1, y: 0 }; }}
              className="p-2 rounded-lg bg-slate-800 active:bg-teal-600 text-white font-bold text-xs cursor-pointer border border-white/10"
            >
              →
            </button>
          </div>
        </div>

      </div>

    </div>,
    document.body
  );
}
