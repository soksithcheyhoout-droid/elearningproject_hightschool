import React from 'react';
import { 
  Trophy, 
  RotateCcw, 
  X, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  Award, 
  Crown, 
  Coins, 
  Zap, 
  ArrowRight,
  TrendingUp,
  Star
} from 'lucide-react';
import { useAuth, computeLevelData } from '../../context/AuthContext';
import api from '../../services/api';

const CONFETTI_PIECES = [
  { left: '8%', delay: '0s', color: '#f59e0b', rotate: '25deg' },
  { left: '18%', delay: '0.2s', color: '#38bdf8', rotate: '-45deg' },
  { left: '28%', delay: '0.1s', color: '#10b981', rotate: '60deg' },
  { left: '38%', delay: '0.4s', color: '#ec4899', rotate: '-15deg' },
  { left: '48%', delay: '0s', color: '#fbbf24', rotate: '80deg' },
  { left: '58%', delay: '0.3s', color: '#8b5cf6', rotate: '-70deg' },
  { left: '68%', delay: '0.15s', color: '#ef4444', rotate: '35deg' },
  { left: '78%', delay: '0.25s', color: '#06b6d4', rotate: '-30deg' },
  { left: '88%', delay: '0.05s', color: '#a855f7', rotate: '50deg' },
  { left: '12%', delay: '0.5s', color: '#f97316', rotate: '-60deg' },
  { left: '32%', delay: '0.35s', color: '#10b981', rotate: '40deg' },
  { left: '62%', delay: '0.45s', color: '#facc15', rotate: '-20deg' },
  { left: '82%', delay: '0.6s', color: '#3b82f6', rotate: '75deg' }
];

export default function VictoryRewardCelebration({
  title = 'អ្នកបានបញ្ចប់ការប្រណាំងល្បឿន!',
  subtitle = 'ទទួលបានចំណេះដឹង និងដណ្តើមបានមេដាយកិត្តិយស!',
  score = 0,
  xpEarned = 0,
  correctCount = 0,
  totalCount = 6,
  onRestart,
  onClose
}) {
  const { student } = useAuth();
  const safeTotal = totalCount > 0 ? totalCount : 6;
  const safeCorrect = typeof correctCount === 'number' ? correctCount : 0;
  const accuracyPct = Math.round((safeCorrect / safeTotal) * 100);

  const levelInfo = computeLevelData(student?.xp || 2915);

  return (
    <div className="relative p-6 sm:p-8 flex-1 flex flex-col justify-center items-center text-center space-y-5 animate-fade-in font-kantumruy overflow-hidden">
      
      {/* Falling CSS Confetti Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {CONFETTI_PIECES.map((piece, idx) => (
          <div
            key={idx}
            className="confetti-piece"
            style={{
              left: piece.left,
              top: '-10px',
              backgroundColor: piece.color,
              animationDelay: piece.delay,
              transform: `rotate(${piece.rotate})`
            }}
          />
        ))}
      </div>

      {/* User Profile Champion Spotlight with Avatar Frame */}
      <div className="relative flex flex-col items-center justify-center my-2 z-20">
        {/* Radial Gold Aura Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-400/30 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />

        {/* User Avatar with Equipped Avatar Frame (Dragon Fire / Ki Energy) */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center flex-shrink-0 z-20">
          <div className={`w-[80%] h-[80%] rounded-full overflow-hidden shadow-2xl bg-slate-900 ${student?.avatarFrame ? '' : 'border-4 border-amber-400 ring-4 ring-amber-400/30'}`}>
            <img
              src={api.formatAvatarUrl(student?.avatar)}
              alt={student?.name || 'Student'}
              className="w-full h-full object-cover"
              onError={(e) => {
                if (!e.currentTarget.src.includes('boy_1.png')) {
                  e.currentTarget.src = '/assets/anime/boys/boy_1.png';
                }
              }}
            />
          </div>

          {/* Render Animated Avatar Frame */}
          {student?.avatarFrame && (
            <img
              src={student.avatarFrame}
              alt="Avatar Frame"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none scale-110 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]"
              onError={(e) => {
                const current = e.currentTarget.src;
                if (current.endsWith('.png')) e.currentTarget.src = current.replace('.png', '.webp');
                else if (current.endsWith('.webp')) e.currentTarget.src = current.replace('.webp', '.png');
              }}
            />
          )}

          {/* Level Pill Badge */}
          <div className="absolute -bottom-2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 px-3.5 py-0.5 rounded-full font-cinzel font-black text-xs shadow-xl border-2 border-slate-900 z-30">
            Lv.{levelInfo.level}
          </div>
        </div>

        {/* Student Name & Rank */}
        <div className="mt-3 space-y-0.5 z-20">
          <h4 className="font-black text-base sm:text-lg text-white">
            {student?.name || 'សុខ វិបុល (Sok Vibol)'}
          </h4>
          <span className="text-[11px] font-bold text-amber-300 bg-amber-950/60 py-0.5 px-3 rounded-full border border-amber-400/30 inline-block font-kantumruy">
            {levelInfo.rankTitleKm}
          </span>
        </div>
      </div>

      {/* Title & Rank Badge */}
      <div className="space-y-1 z-20">
        <span className="px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest font-cinzel shadow-md inline-block">
          ★ S-TIER SCHOLAR VICTORY ★
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* 3 Metric Stat Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-lg bg-[#111c30]/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-700/80 shadow-2xl text-xs z-20">
        
        {/* Correct Answers */}
        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">ចម្លើយត្រឹមត្រូវ</span>
          <span className="font-cinzel text-xl sm:text-2xl font-black text-emerald-400 block">
            {safeCorrect}/{safeTotal}
          </span>
          <span className="text-[10px] text-slate-400 font-bold font-cinzel">
            {accuracyPct}% ACC
          </span>
        </div>

        {/* Score */}
        <div className="space-y-1 border-x border-slate-700/80 px-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">ពិន្ទុសរុប</span>
          <span className="font-cinzel text-xl sm:text-2xl font-black text-cyan-400 block">
            {score || 0}
          </span>
          <span className="text-[10px] text-slate-400 font-bold font-cinzel">PTS</span>
        </div>

        {/* XP Reward Token */}
        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">រង្វាន់ XP</span>
          <span className="font-cinzel text-xl sm:text-2xl font-black text-amber-400 block">
            +{xpEarned || 0}
          </span>
          <span className="text-[10px] text-amber-400/80 font-bold font-cinzel">XP BONUS</span>
        </div>

      </div>

      {/* 3D Tactile Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md pt-1 z-20">
        <button
          type="button"
          onClick={onRestart}
          className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xl border-b-[5px] border-amber-600 active:border-b-0 active:translate-y-1 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>លេងម្តងទៀត (Play Again)</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm cursor-pointer border border-slate-700 transition-colors"
        >
          <span>ចាកចេញ (Exit)</span>
        </button>
      </div>

    </div>
  );
}
