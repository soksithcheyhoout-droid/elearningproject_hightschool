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
  Plane,
  Play
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { playSound } from '../../utils/audioEffects';
import { getRandomizedGameQuestions, resetGameSessionQuestions } from '../../utils/gamePoolManager';

export default function FlappyAcademicJetModal({ game, onClose }) {
  const { addXP, student } = useAuth();
  const canvasRef = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [questions, setQuestions] = useState(() => 
    getRandomizedGameQuestions(game, 15, student?.grade || '12', game?.stream || student?.stream || 'science')
  );

  const currentQ = questions[currentQIndex % questions.length] || {
    q: 'គណនា lim (x → 2) (x² - 4)/(x - 2) = ?',
    options: ['0', '2', '4', '8'],
    answer: 2,
    explanation: '4'
  };

  const stateRef = useRef({
    bird: { x: 100, y: 180, vy: 0, gravity: 0.36, jump: -6.5, radius: 16 },
    gates: [],
    particles: [],
    clouds: [],
    speed: 2.3,
    passedCurrentGate: false
  });

  useEffect(() => {
    const clouds = [];
    for (let i = 0; i < 6; i++) {
      clouds.push({
        x: Math.random() * 640,
        y: Math.random() * 150 + 20,
        size: Math.random() * 32 + 20,
        speed: Math.random() * 0.6 + 0.3
      });
    }
    stateRef.current.clouds = clouds;
  }, []);

  const spawnGate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isTopCorrect = currentQ.answer % 2 === 0;
    const optTop = currentQ.options[0] || 'A';
    const optBottom = currentQ.options[1] || 'B';

    stateRef.current.gates = [
      {
        x: canvas.width + 60,
        topHeight: 120,
        gap: 140,
        bottomY: 260,
        width: 75,
        optTop,
        optBottom,
        isTopCorrect,
        passed: false
      }
    ];
    stateRef.current.passedCurrentGate = false;
  };

  useEffect(() => {
    spawnGate();
  }, [currentQIndex]);

  const jump = () => {
    if (isGameOver || isWon) return;
    if (!gameStarted) setGameStarted(true);

    if (soundEnabled) playSound.click();
    stateRef.current.bird.vy = stateRef.current.bird.jump;

    for (let i = 0; i < 8; i++) {
      stateRef.current.particles.push({
        x: stateRef.current.bird.x - 12,
        y: stateRef.current.bird.y + 8,
        vx: (Math.random() - 0.5) * 4 - 3,
        vy: Math.random() * 2 + 1,
        color: '#38bdf8',
        life: 22
      });
    }
  };

  useEffect(() => {
    let animId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        jump();
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const loop = () => {
      const state = stateRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Sky & Cyber Cloud Background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGrad.addColorStop(0, '#030712');
      skyGrad.addColorStop(0.6, '#0f172a');
      skyGrad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#1e293b';
      state.clouds.forEach((cloud) => {
        cloud.x -= cloud.speed;
        if (cloud.x < -60) cloud.x = canvas.width + 40;
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
        ctx.arc(cloud.x + 20, cloud.y - 10, cloud.size * 0.8, 0, Math.PI * 2);
        ctx.arc(cloud.x + 40, cloud.y, cloud.size * 0.9, 0, Math.PI * 2);
        ctx.fill();
      });

      if (gameStarted && !isGameOver && !isWon) {
        state.bird.vy += state.bird.gravity;
        state.bird.y += state.bird.vy;

        if (state.bird.y > canvas.height - 25 || state.bird.y < 15) {
          handleCrash();
        }

        state.gates.forEach((gate) => {
          gate.x -= state.speed;

          // Top Neon Gate
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(gate.x, 0, gate.width, gate.topHeight);
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 2.5;
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 10;
          ctx.strokeRect(gate.x, 0, gate.width, gate.topHeight);
          ctx.shadowBlur = 0;

          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 12px Kantumruy Pro, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`A: ${gate.optTop}`, gate.x + gate.width / 2, gate.topHeight - 20);

          // Bottom Neon Gate
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(gate.x, gate.bottomY, gate.width, canvas.height - gate.bottomY);
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2.5;
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 10;
          ctx.strokeRect(gate.x, gate.bottomY, gate.width, canvas.height - gate.bottomY);
          ctx.shadowBlur = 0;

          ctx.fillStyle = '#fbbf24';
          ctx.fillText(`B: ${gate.optBottom}`, gate.x + gate.width / 2, gate.bottomY + 30);

          const birdBox = {
            left: state.bird.x - state.bird.radius,
            right: state.bird.x + state.bird.radius,
            top: state.bird.y - state.bird.radius,
            bottom: state.bird.y + state.bird.radius
          };

          if (birdBox.right > gate.x && birdBox.left < gate.x + gate.width) {
            if (birdBox.top < gate.topHeight || birdBox.bottom > gate.bottomY) {
              handleCrash();
            }
          }

          if (!gate.passed && state.bird.x > gate.x + gate.width) {
            gate.passed = true;
            const inTopGap = state.bird.y < (gate.topHeight + gate.gap / 2);
            const chosenCorrect = inTopGap ? gate.isTopCorrect : !gate.isTopCorrect;

            if (chosenCorrect) {
              if (soundEnabled) playSound.correct();
              setScore((prev) => prev + 200);
              setFeedback({ text: '🎯 ហោះកាត់ទ្វារត្រឹមត្រូវ! (+200 XP)', color: 'text-emerald-400' });

              setTimeout(() => {
                setFeedback(null);
                if (currentQIndex + 1 < questions.length) {
                  setCurrentQIndex((prev) => prev + 1);
                } else {
                  setIsWon(true);
                  if (soundEnabled) playSound.victory();
                  addXP(game.xpReward + 150);
                }
              }, 600);

            } else {
              handleCrash();
            }
          }
        });
      }

      // Draw Jet
      ctx.save();
      ctx.translate(state.bird.x, state.bird.y);
      const angle = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, state.bird.vy * 0.08));
      ctx.rotate(angle);

      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.ellipse(0, 0, 18, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(6, -2, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Particles
      state.particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, p.life / 5), 0, Math.PI * 2);
        ctx.fill();
      });
      state.particles = state.particles.filter((p) => p.life > 0);

      ctx.fillStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 8;
      ctx.fillRect(0, canvas.height - 6, canvas.width, 6);
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameStarted, isGameOver, isWon, currentQIndex, soundEnabled]);

  const handleCrash = () => {
    setIsGameOver(true);
    if (soundEnabled) playSound.wrong();
    setFeedback({ text: '💥 ប៉ះទង្គិចខុសទ្វារចម្លើយ!', color: 'text-rose-400' });
  };

  const handleRestart = () => {
    resetGameSessionQuestions();
    const fresh = getRandomizedGameQuestions(game, 15, student?.grade || '12', game?.stream || student?.stream || 'science');
    setQuestions(fresh);
    stateRef.current.bird.y = 180;
    stateRef.current.bird.vy = 0;
    setCurrentQIndex(0);
    setScore(0);
    setIsGameOver(false);
    setIsWon(false);
    setGameStarted(false);
    setFeedback(null);
    spawnGate();
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-1.5 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in font-kantumruy overflow-y-auto">
      
      <div className="arcade-cabinet-frame arcade-crt-overlay rounded-3xl w-full max-w-3xl flex flex-col overflow-hidden shadow-2xl relative text-white border-2 border-blue-400">
        
        {/* Header */}
        <div className="bg-slate-950 px-4 sm:px-6 py-3 border-b border-blue-500/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/40 shadow-sm">
              <Plane className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block font-cinzel">
                ★ FLAPPY ACADEMIC JET RUNNER ★
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
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
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
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 px-4 py-3 border-b border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div>
            <span className="text-[10px] font-black text-cyan-400 font-cinzel">
              CHALLENGE {currentQIndex + 1}/{questions.length}៖
            </span>
            <p className="text-xs sm:text-sm font-extrabold text-white">
              {currentQ.q}
            </p>
          </div>
          <span className="font-cinzel text-amber-300 font-black text-xs bg-slate-900 px-3 py-1 rounded-xl border border-blue-500/40">
            SCORE: {score}
          </span>
        </div>

        {/* Canvas Stage */}
        <div 
          onClick={jump}
          className="relative bg-slate-950 flex items-center justify-center p-2 cursor-pointer select-none"
        >
          {feedback && (
            <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-30 text-xs sm:text-sm font-black ${feedback.color} bg-slate-950/90 px-4 py-1.5 rounded-full border border-blue-400/40 shadow-lg animate-bounce font-cinzel`}>
              {feedback.text}
            </div>
          )}

          {!gameStarted && !isGameOver && !isWon && (
            <div className="absolute inset-0 bg-slate-950/75 z-20 flex flex-col items-center justify-center p-6 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                <Plane className="w-8 h-8 text-cyan-300" />
              </div>
              <h4 className="text-base sm:text-lg font-black text-white font-cinzel">
                TAP OR PRESS SPACEBAR TO FLAP!
              </h4>
              <p className="text-xs text-blue-200 max-w-sm">
                ហោះរំលងឧបសគ្គ ហើយឆ្លងកាត់តែទ្វារដែលមានចម្លើយត្រឹមត្រូវប៉ុណ្ណោះ!
              </p>
            </div>
          )}

          <canvas
            ref={canvasRef}
            width={640}
            height={380}
            className="w-full max-w-[640px] aspect-[16/10] bg-slate-950 rounded-2xl border border-blue-500/30 shadow-inner"
          />

          {(isGameOver || isWon) && (
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fade-in">
              {isWon ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 p-0.5 animate-bounce shadow-2xl">
                    <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                      <Trophy className="w-8 h-8 text-amber-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-white">ជើងឯកហោះហើរលំហអាកាស! 🏆</h3>
                  <p className="text-xs text-blue-200">អ្នកបានហោះកាត់ទ្វារចម្លើយទាំងអស់ដោយជោគជ័យ!</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center">
                    <X className="w-8 h-8 text-rose-400" />
                  </div>
                  <h3 className="text-xl font-black text-white">យន្តហោះបានធ្លាក់ហើយ!</h3>
                  <p className="text-xs text-slate-400">សូមសាកល្បងហោះហើរម្តងទៀតដើម្បីទម្លុះកំណត់ត្រា!</p>
                </>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>ហោះម្តងទៀត (Fly Again)</span>
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

        {/* Instructions */}
        <div className="bg-slate-950 px-4 py-2.5 border-t border-blue-500/30 text-center text-[11px] text-slate-400">
          💡 <strong>ការបញ្ជា៖</strong> ចុចលើផ្ទាំង Canvas ឬចុច <strong>Spacebar / ↑</strong> ដើម្បីឱ្យយន្តហោះហោះឡើងលើ!
        </div>

      </div>

    </div>,
    document.body
  );
}
