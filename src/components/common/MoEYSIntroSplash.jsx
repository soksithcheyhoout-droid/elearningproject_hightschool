import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function MoEYSIntroSplash({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [phase, setPhase] = useState(0); // 0=enter, 1=loaded, 2=exit

  const handleFinish = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setPhase(2);
    setTimeout(() => { onFinish?.(); }, 650);
  }, [onFinish, isClosing]);

  useEffect(() => {
    const phaseTimer = setTimeout(() => setPhase(1), 60);

    const startTime = Date.now();
    const duration = 1400;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const raw = elapsed / duration;
      const eased = 1 - Math.pow(1 - Math.min(raw, 1), 3);
      const pct = Math.min(100, Math.round(eased * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => handleFinish(), 350);
      }
    }, 16);

    return () => {
      clearInterval(interval);
      clearTimeout(phaseTimer);
    };
  }, [handleFinish]);

  if (typeof document === 'undefined') return null;

  // Refined circular progress dimensions
  const size = 190;
  const strokeWidth = 2.5;
  const radius = (size - 32) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const contentClass = phase >= 1 && !isClosing
    ? 'opacity-100 scale-100 translate-y-0'
    : phase === 2
      ? 'opacity-0 scale-95 -translate-y-2'
      : 'opacity-0 scale-95 translate-y-3';

  return createPortal(
    <div
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999999 }}
      className={`flex items-center justify-center font-kantumruy select-none transition-opacity duration-700 bg-slate-950 ${
        isClosing ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* ═══════ BRIGHT, VIBRANT WAVING CAMBODIAN FLAG (NOT TOO BLACK) ═══════ */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Full-color vibrant waving flag GIF */}
        <img
          src="/assets/cambodia-flag.gif"
          onError={(e) => { e.currentTarget.src = 'https://media1.tenor.com/m/kDXhibIv45EAAAAC/cambodia-cambodia-flag.gif'; }}
          alt="Cambodia National Flag"
          className="absolute inset-0 w-full h-full object-cover filter brightness-95 contrast-110 saturate-110 scale-105 select-none pointer-events-none"
        />

        {/* Soft, light translucent tint so flag colors stay vivid and bright */}
        <div className="absolute inset-0 bg-slate-950/35" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/60" />
      </div>

      {/* Royal Gold Frame with High Visibility */}
      <div className="absolute inset-4 sm:inset-7 border border-[#ffd700]/30 rounded-xl pointer-events-none z-10 shadow-[0_0_20px_rgba(0,0,0,0.5)]" />
      <div className="absolute inset-6 sm:inset-10 border border-[#ffd700]/15 rounded-lg pointer-events-none z-10" />

      {/* Corner Royal Accents */}
      {[
        'top-3.5 left-3.5 sm:top-6.5 sm:left-6.5',
        'top-3.5 right-3.5 sm:top-6.5 sm:right-6.5 scale-x-[-1]',
        'bottom-3.5 left-3.5 sm:bottom-6.5 sm:left-6.5 scale-y-[-1]',
        'bottom-3.5 right-3.5 sm:bottom-6.5 sm:right-6.5 scale-[-1]'
      ].map((pos, i) => (
        <div key={i} className={`absolute ${pos} w-10 h-10 sm:w-12 sm:h-12 pointer-events-none z-20`}>
          <svg viewBox="0 0 50 50" className="w-full h-full filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            <path d="M2,2 L2,20 M2,2 L20,2" fill="none" stroke="#ffd700" strokeWidth="1.8" opacity="0.85"/>
            <circle cx="5" cy="5" r="1.5" fill="#fff" opacity="0.9"/>
          </svg>
        </div>
      ))}

      {/* Skip Button */}
      <button
        type="button"
        onClick={handleFinish}
        className="absolute top-5 right-5 sm:top-8 sm:right-8 z-50 px-3.5 py-1.5 rounded-full border border-white/30 hover:border-amber-300 bg-slate-950/70 hover:bg-slate-900 text-amber-300 hover:text-white text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 backdrop-blur-md shadow-xl"
      >
        <span>រំលង</span>
        <X className="w-3.5 h-3.5" />
      </button>

      {/* ═══════ EXECUTIVE NATIONAL EMBLEM & HIGH CONTRAST TYPOGRAPHY ═══════ */}
      <div className={`relative z-20 flex flex-col items-center text-center px-6 max-w-xl mx-auto transition-all duration-700 ease-out ${contentClass}`}>

        {/* Central Seal with Golden Halo */}
        <div className="relative mb-6 flex items-center justify-center" style={{ width: size, height: size }}>
          
          {/* Subtle Ambient Gold Glow */}
          <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

          {/* SVG Circular Progress Track */}
          <svg width={size} height={size} className="absolute inset-0 -rotate-90">
            {/* Outer Decorative Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius + 10}
              fill="none"
              stroke="#ffd700"
              strokeWidth="0.5"
              opacity="0.4"
            />
            {/* Base Ring Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="rgba(0,0,0,0.5)"
              strokeWidth={strokeWidth}
            />
            {/* Glowing Active Gold Progress Ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#ffd700"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-100 ease-out"
              style={{ filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.9))' }}
            />
          </svg>

          {/* Emblem Container with Dark Backing for Crisp Contrast */}
          <div className="w-[110px] h-[110px] sm:w-[125px] sm:h-[125px] flex items-center justify-center p-2 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-400/50 shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
            <img
              src="/assets/moeys-crest-transparent.png"
              alt="ត្រាជាតិកម្ពុជា"
              className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
              onError={(e) => { e.currentTarget.src = '/assets/moeys-custom-logo-transparent.png'; }}
            />
          </div>

          {/* Progress Percentage */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-amber-400 px-3 py-0.5 rounded-full shadow-lg">
            <span className="text-[11px] font-mono font-black text-amber-300 tracking-wider">
              {progress}%
            </span>
          </div>
        </div>

        {/* ── CRISP ROYAL HEADINGS (Crystal Legibility over Flag) ── */}
        <div className="space-y-2 mb-6 bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl">
          
          {/* Kingdom of Cambodia */}
          <h2
            className="font-moul text-xl sm:text-2xl text-amber-300 tracking-wide leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,1)]"
          >
            ព្រះរាជាណាចក្រកម្ពុជា
          </h2>

          {/* National Motto */}
          <p className="text-xs sm:text-sm text-amber-200 font-extrabold tracking-[0.3em] uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,1)]">
            ជាតិ &nbsp;•&nbsp; សាសនា &nbsp;•&nbsp; ព្រះមហាក្សត្រ
          </p>

          {/* Delicate Star Divider */}
          <div className="flex items-center justify-center gap-3 py-1">
            <span className="h-[1px] w-14 sm:w-20 bg-gradient-to-r from-transparent to-amber-400/70" />
            <svg width="8" height="8" viewBox="0 0 10 10">
              <path d="M5 0L6.12 3.88L10 5L6.12 6.12L5 10L3.88 6.12L0 5L3.88 3.88Z" fill="#ffd700"/>
            </svg>
            <span className="h-[1px] w-14 sm:w-20 bg-gradient-to-l from-transparent to-amber-400/70" />
          </div>

          {/* Ministry Title */}
          <h1
            className="font-moul text-sm sm:text-base text-white leading-relaxed max-w-md mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,1)]"
          >
            ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ និងការស្រាវជ្រាវកម្រិតខ្ពស់
          </h1>

          <p className="text-[11px] sm:text-xs text-blue-100 tracking-wide font-medium drop-shadow-[0_2px_6px_rgba(0,0,0,1)]">
            Ministry of Talent Development & Advanced Research (MoTDAR)
          </p>
        </div>

        {/* ── MINIMALIST PROGRESS BAR ── */}
        <div className="w-56 sm:w-68 space-y-2">
          <div className="w-full h-2 rounded-full bg-slate-950/80 border border-amber-400/40 overflow-hidden p-[1px] shadow-lg">
            <div
              className="h-full rounded-full transition-all duration-100 ease-out bg-gradient-to-r from-amber-500 via-amber-300 to-amber-400"
              style={{
                width: `${progress}%`,
                boxShadow: '0 0 10px rgba(255,215,0,0.9)'
              }}
            />
          </div>
          <p className="text-[10px] text-amber-200 font-semibold tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
            ប្រព័ន្ធសិក្សាឌីជីថលកម្រិតវិទ្យាល័យជាតិ • E-Learning Platform v2.5 (Beta Testing Phase)
          </p>
        </div>

      </div>
    </div>,
    document.body
  );
}
