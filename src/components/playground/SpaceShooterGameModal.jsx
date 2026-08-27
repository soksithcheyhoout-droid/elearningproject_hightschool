import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Rocket, 
  Sparkles, 
  Trophy, 
  X, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Flame, 
  Clock,
  ShieldAlert,
  ArrowLeft,
  ArrowRight,
  Crosshair,
  Zap,
  Target
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { playSound } from '../../utils/audioEffects';
import { getRandomizedGameQuestions, resetGameSessionQuestions } from '../../utils/gamePoolManager';

export default function SpaceShooterGameModal({ game, onClose }) {
  const { addXP, student } = useAuth();
  const canvasRef = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [floatingFeedback, setFloatingFeedback] = useState(null);

  const [questions, setQuestions] = useState(() => 
    getRandomizedGameQuestions(game, 15, student?.grade || '12', game?.stream || student?.stream || 'science')
  );

  const currentQ = questions[currentQIndex % questions.length] || {
    q: 'គណនា lim (x → 2) (x² - 4)/(x - 2) = ?',
    options: ['0', '2', '4', '8'],
    answer: 2,
    explanation: 'x+2 => 4'
  };

  // Professional Game State Reference
  const stateRef = useRef({
    player: { x: 380, y: 380, width: 50, height: 45, speed: 7.5, targetX: 380 },
    lasers: [],
    targets: [],
    particles: [],
    shockwaves: [],
    floatingTexts: [],
    stars: [],
    keys: { left: false, right: false, shoot: false },
    lastShootTime: 0,
    timeTick: 0
  });

  // Init Starfield with 3 depth layers
  useEffect(() => {
    const stars = [];
    for (let i = 0; i < 90; i++) {
      stars.push({
        x: Math.random() * 760,
        y: Math.random() * 450,
        size: Math.random() * 2 + 0.6,
        speed: Math.random() * 1.6 + 0.4,
        color: Math.random() > 0.6 ? '#38bdf8' : Math.random() > 0.5 ? '#facc15' : '#e2e8f0',
        alpha: Math.random() * 0.7 + 0.3
      });
    }
    stateRef.current.stars = stars;
  }, []);

  // Spawn 4 Clean Non-Overlapping Targets in 4 Distinct Lanes
  const spawnTargets = () => {
    const canvasWidth = 760;
    const count = currentQ.options.length;
    const laneWidth = canvasWidth / count; // 190px per lane

    const targets = [];
    currentQ.options.forEach((optText, idx) => {
      const laneCenter = laneWidth * idx + laneWidth / 2;
      const targetW = 125;
      const targetH = 46;

      targets.push({
        id: idx,
        text: optText,
        isCorrect: idx === currentQ.answer,
        baseX: laneCenter - targetW / 2,
        x: laneCenter - targetW / 2,
        y: 45,
        width: targetW,
        height: targetH,
        speedY: 0.28,
        floatPhase: idx * 1.5,
        colorTheme: idx === 0 
          ? { bg: '#0369a1', border: '#38bdf8', glow: 'rgba(56,189,248,0.4)', text: '#e0f2fe' }
          : idx === 1 
          ? { bg: '#7c3aed', border: '#c084fc', glow: 'rgba(192,132,252,0.4)', text: '#f3e8ff' }
          : idx === 2 
          ? { bg: '#be185d', border: '#f472b6', glow: 'rgba(244,114,182,0.4)', text: '#fce7f3' }
          : { bg: '#b45309', border: '#fbbf24', glow: 'rgba(251,191,36,0.4)', text: '#fef3c7' },
        alive: true
      });
    });

    stateRef.current.targets = targets;
  };

  useEffect(() => {
    spawnTargets();
  }, [currentQIndex]);

  // Main 60 FPS Canvas Game Loop
  useEffect(() => {
    let animId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleKeyDown = (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') stateRef.current.keys.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') stateRef.current.keys.right = true;
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        shootLaser();
        e.preventDefault();
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') stateRef.current.keys.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') stateRef.current.keys.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const loop = () => {
      if (isGameOver || isWon) return;

      const state = stateRef.current;
      state.timeTick += 0.04;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Deep Space Cosmic Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, '#020617');
      bgGrad.addColorStop(0.5, '#09132e');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid Lines (Sci-Fi Radar)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Draw Starfield
      state.stars.forEach((star) => {
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // 2. Update Player Position
      if (state.keys.left && state.player.x > 50) state.player.x -= state.player.speed;
      if (state.keys.right && state.player.x < canvas.width - 50) state.player.x += state.player.speed;

      // Draw Player Thruster Plasma Particles
      if (Math.random() > 0.3) {
        state.particles.push({
          x: state.player.x + (Math.random() - 0.5) * 10,
          y: state.player.y + 18,
          vx: (Math.random() - 0.5) * 1.5,
          vy: Math.random() * 4 + 2,
          color: Math.random() > 0.5 ? '#38bdf8' : '#00f0ff',
          life: 18
        });
      }

      // Draw Detailed Fighter Jet Spaceship
      ctx.save();
      ctx.translate(state.player.x, state.player.y);

      // Forcefield Glow
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 32, 0, Math.PI * 2);
      ctx.stroke();

      // Wing Sweep
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.moveTo(0, -24);
      ctx.lineTo(-24, 16);
      ctx.lineTo(-12, 12);
      ctx.lineTo(0, 18);
      ctx.lineTo(12, 12);
      ctx.lineTo(24, 16);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Laser Cannons
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-22, -2, 4, 14);
      ctx.fillRect(18, -2, 4, 14);

      // Cockpit Glow
      ctx.fillStyle = '#fde047';
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.ellipse(0, -6, 5, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.restore();

      // 3. Update & Draw Laser Beams
      state.lasers.forEach((laser) => {
        laser.y -= 14;

        // Dual Neon Laser Line
        ctx.fillStyle = '#00f0ff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 12;
        ctx.fillRect(laser.x - 12, laser.y - 14, 3.5, 18);
        ctx.fillRect(laser.x + 9, laser.y - 14, 3.5, 18);
        ctx.shadowBlur = 0;

        // Collision Check with 4 Non-Overlapping Targets
        state.targets.forEach((target) => {
          if (!target.alive) return;
          if (
            laser.x > target.x - 10 &&
            laser.x < target.x + target.width + 10 &&
            laser.y > target.y &&
            laser.y < target.y + target.height
          ) {
            laser.dead = true;
            target.alive = false;

            // Explosion Shockwave
            state.shockwaves.push({
              x: target.x + target.width / 2,
              y: target.y + target.height / 2,
              radius: 5,
              maxRadius: 45,
              alpha: 1,
              color: target.colorTheme.border
            });

            // Explosion Particles
            for (let p = 0; p < 28; p++) {
              state.particles.push({
                x: target.x + target.width / 2,
                y: target.y + target.height / 2,
                vx: (Math.random() - 0.5) * 9,
                vy: (Math.random() - 0.5) * 9,
                color: target.colorTheme.border,
                life: 38
              });
            }

            if (target.isCorrect) {
              if (soundEnabled) {
                playSound.correct();
                setTimeout(() => playSound.bossHit(), 80);
              }
              const newCombo = combo + 1;
              setCombo(newCombo);
              setScore((prev) => prev + 150 * (newCombo >= 2 ? 1.5 : 1));
              setFloatingFeedback({ text: '🎯 TARGET DESTROYED! (+150 XP)', color: 'text-emerald-400' });

              setTimeout(() => {
                setFloatingFeedback(null);
                if (currentQIndex + 1 < questions.length) {
                  setCurrentQIndex((prev) => prev + 1);
                } else {
                  setIsWon(true);
                  if (soundEnabled) playSound.victory();
                  addXP(game.xpReward + 150);
                }
              }, 700);

            } else {
              if (soundEnabled) playSound.wrong();
              setCombo(0);
              setLives((prev) => {
                const nextLives = prev - 1;
                if (nextLives <= 0) {
                  setIsGameOver(true);
                }
                return nextLives;
              });
              setFloatingFeedback({ text: '❌ WRONG TARGET! (-1 SHIELD)', color: 'text-rose-400' });
              setTimeout(() => setFloatingFeedback(null), 900);
            }
          }
        });
      });
      state.lasers = state.lasers.filter((l) => !l.dead && l.y > -30);

      // 4. Update & Draw Target Capsules in Clean Non-Overlapping Lanes
      state.targets.forEach((target) => {
        if (!target.alive) return;
        target.y += target.speedY;

        // Gentle floating wobble strictly inside its lane
        target.x = target.baseX + Math.sin(state.timeTick + target.floatPhase) * 12;

        if (target.y > canvas.height - 90) {
          target.y = 40;
        }

        // Draw High-Tech Shield Capsule
        ctx.fillStyle = target.colorTheme.bg;
        ctx.shadowColor = target.colorTheme.glow;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.roundRect(target.x, target.y, target.width, target.height, 14);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = target.colorTheme.border;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Option Letter Badge
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.roundRect(target.x + 6, target.y + 6, 26, target.height - 12, 8);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px Kantumruy Pro, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          String.fromCharCode(65 + target.id),
          target.x + 19,
          target.y + target.height / 2
        );

        // Option Text
        ctx.fillStyle = target.colorTheme.text;
        ctx.font = 'bold 13px Kantumruy Pro, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          target.text,
          target.x + target.width / 2 + 10,
          target.y + target.height / 2
        );
      });

      // 5. Draw Shockwaves
      state.shockwaves.forEach((sw) => {
        sw.radius += 2.8;
        sw.alpha -= 0.05;
        ctx.strokeStyle = sw.color;
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = Math.max(0, sw.alpha);
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      });
      state.shockwaves = state.shockwaves.filter((sw) => sw.alpha > 0);

      // 6. Draw Particles
      state.particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, p.life / 6), 0, Math.PI * 2);
        ctx.fill();
      });
      state.particles = state.particles.filter((p) => p.life > 0);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [currentQIndex, isGameOver, isWon, combo, soundEnabled]);

  const shootLaser = () => {
    const now = Date.now();
    if (now - stateRef.current.lastShootTime < 190) return;
    stateRef.current.lastShootTime = now;

    if (soundEnabled) playSound.attack();

    stateRef.current.lasers.push({
      x: stateRef.current.player.x,
      y: stateRef.current.player.y - 20,
      dead: false
    });
  };

  const handleRestart = () => {
    resetGameSessionQuestions();
    const fresh = getRandomizedGameQuestions(game, 15, student?.grade || '12', game?.stream || student?.stream || 'science');
    setQuestions(fresh);
    setCurrentQIndex(0);
    setScore(0);
    setCombo(0);
    setLives(3);
    setIsGameOver(false);
    setIsWon(false);
    setFloatingFeedback(null);
    spawnTargets();
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-1.5 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in font-kantumruy overflow-y-auto">
      
      {/* Sci-Fi Space Game Frame */}
      <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl sm:rounded-3xl w-full max-w-4xl max-h-[96vh] sm:max-h-[92vh] flex flex-col shadow-[0_0_50px_rgba(99,102,241,0.25)] overflow-hidden text-slate-100 relative my-auto">
        
        {/* Cockpit HUD Header Bar */}
        <div className="bg-slate-900/90 px-5 py-3.5 border-b border-cyan-500/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest block font-cinzel">
                ★ COSMIC TARGET INTERCEPTOR ★
              </span>
              <h3 className="text-xs sm:text-sm font-black text-white line-clamp-1">
                {game.titleKm}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Shields Gauge */}
            <div className="flex items-center gap-1.5 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-cyan-500/30 text-xs">
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-400 mr-1" />
              <span className="text-[10px] text-slate-400 font-bold mr-1">SHIELDS:</span>
              {[...Array(3)].map((_, i) => (
                <span 
                  key={i} 
                  className={`w-3.5 h-3.5 rounded-md transition-all ${
                    i < lives ? 'bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.8)]' : 'bg-slate-800 border border-slate-700'
                  }`} 
                />
              ))}
            </div>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-red-500/30 text-slate-400 hover:text-red-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mission Target Question Banner */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 px-5 py-3 border-b border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <span className="text-[11px] font-black text-amber-400 font-cinzel">
              MISSION OBJECTIVE {currentQIndex + 1} / {questions.length}៖
            </span>
            <p className="text-sm sm:text-base font-extrabold text-white">
              {currentQ.q}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold flex-shrink-0">
            <span className="font-cinzel text-amber-300 font-black text-sm bg-slate-950 px-3.5 py-1.5 rounded-xl border border-white/10">
              SCORE: {score}
            </span>
            {combo >= 2 && (
              <span className="text-amber-400 flex items-center gap-1 bg-amber-500/20 px-2.5 py-1 rounded-xl border border-amber-400/40 animate-pulse">
                <Flame className="w-3.5 h-3.5 fill-amber-400" /> x{combo} COMBO
              </span>
            )}
          </div>
        </div>

        {/* 760x440 Widescreen Canvas Stage */}
        <div className="relative bg-slate-950 flex items-center justify-center p-3">
          
          {floatingFeedback && (
            <div className={`absolute top-6 left-1/2 -translate-x-1/2 z-30 text-xs sm:text-sm font-black ${floatingFeedback.color} bg-slate-950/95 px-5 py-2 rounded-full border border-cyan-400/50 shadow-2xl animate-bounce font-cinzel`}>
              {floatingFeedback.text}
            </div>
          )}

          <canvas
            ref={canvasRef}
            width={760}
            height={440}
            className="w-full max-w-[760px] aspect-[19/11] bg-slate-950 rounded-2xl border border-cyan-500/30 shadow-inner"
          />

          {/* GameOver / Victory Overlay */}
          {(isGameOver || isWon) && (
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fade-in">
              {isWon ? (
                <>
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 p-0.5 animate-bounce shadow-2xl">
                    <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                      <Trophy className="w-10 h-10 text-cyan-400" />
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-black text-cyan-400 uppercase tracking-widest font-cinzel">★ MISSION ACCOMPLISHED! 🚀 ★</span>
                    <h3 className="text-2xl font-black text-white mt-1">អ្នកបានបាញ់កម្ទេចសំណួរទាំងអស់!</h3>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4 border border-white/20 flex items-center gap-8 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">TOTAL SCORE</span>
                      <span className="font-cinzel text-lg font-black text-cyan-300">{score}</span>
                    </div>
                    <div className="w-px h-8 bg-white/20" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">XP REWARD</span>
                      <span className="font-cinzel text-lg font-black text-emerald-400">+{game.xpReward + 150} XP</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center">
                    <X className="w-10 h-10 text-rose-400" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-rose-400 uppercase tracking-widest font-cinzel">SPACESHIP DESTROYED 💥</span>
                    <h3 className="text-2xl font-black text-white mt-1">អ្នកបានអស់ជីវិតការពារហើយ!</h3>
                  </div>
                </>
              )}

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="px-6 py-3 rounded-2xl bg-cyan-400 hover:bg-cyan-500 text-slate-950 font-black text-xs flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>លេងម្តងទៀត (Play Again)</span>
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

        {/* Bottom Cockpit Control Bar */}
        <div className="bg-slate-900/90 px-5 py-3.5 border-t border-cyan-500/30 flex items-center justify-between gap-3 text-xs">
          
          <div className="text-[11px] text-slate-400 hidden sm:flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            <span><strong>ការបញ្ជា៖</strong> ចុច <strong>← →</strong> ឬ <strong>A D</strong> ដើម្បីរំកិល | ចុច <strong>Spacebar</strong> ដើម្បីបាញ់កាណុង!</span>
          </div>

          <div className="flex items-center justify-between w-full sm:w-auto gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onMouseDown={() => { stateRef.current.keys.left = true; }}
                onMouseUp={() => { stateRef.current.keys.left = false; }}
                onTouchStart={() => { stateRef.current.keys.left = true; }}
                onTouchEnd={() => { stateRef.current.keys.left = false; }}
                className="p-3 rounded-xl bg-slate-800 active:bg-cyan-600 text-white font-bold border border-cyan-500/40 cursor-pointer shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onMouseDown={() => { stateRef.current.keys.right = true; }}
                onMouseUp={() => { stateRef.current.keys.right = false; }}
                onTouchStart={() => { stateRef.current.keys.right = true; }}
                onTouchEnd={() => { stateRef.current.keys.right = false; }}
                className="p-3 rounded-xl bg-slate-800 active:bg-cyan-600 text-white font-bold border border-cyan-500/40 cursor-pointer shadow-sm"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={shootLaser}
              className="px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 active:scale-95 text-white font-black text-xs flex items-center gap-2 shadow-lg border border-cyan-300 cursor-pointer"
            >
              <Crosshair className="w-4 h-4" />
              <span>SHOOT (បាញ់ឡាស៊ែរ)</span>
            </button>
          </div>

        </div>

      </div>

    </div>,
    document.body
  );
}
