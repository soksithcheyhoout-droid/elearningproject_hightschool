import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, Music } from 'lucide-react';

const AUDIO_SRC = '/assets/audio/khmer_tea_1.webm';
const SONG_TITLE = '(Khmer tea 1) Cambodian Song';
const START_TIME = 6;
const TOTAL_DURATION = 286;

// ═══════════════════════════════════════════════════════════════════
// PHASE 1: WELCOME GATE — Beautiful royal entrance that captures
//          the user gesture Chrome requires for unmuted audio.
//          Once they click "ចូលមើល" (Enter), audio starts instantly.
// ═══════════════════════════════════════════════════════════════════
function WelcomeGate({ onEnter }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999999 }}
      className="flex items-center justify-center bg-slate-950 select-none"
    >
      {/* Cambodia Flag Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src="/assets/cambodia-flag.gif"
          onError={(e) => { e.currentTarget.src = 'https://media1.tenor.com/m/kDXhibIv45EAAAAC/cambodia-cambodia-flag.gif'; }}
          alt="Cambodia Flag"
          className="absolute inset-0 w-full h-full object-cover brightness-90 contrast-110 saturate-110 scale-105"
        />
        <div className="absolute inset-0 bg-slate-950/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/70" />
      </div>

      {/* Royal Gold Frame */}
      <div className="absolute inset-4 sm:inset-7 border border-[#ffd700]/25 rounded-xl pointer-events-none z-10" />

      {/* Content */}
      <div className={`relative z-20 flex flex-col items-center text-center px-8 transition-all duration-700 ease-out ${
        show ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
      }`}>
        {/* Emblem */}
        <div className="w-28 h-28 sm:w-36 sm:h-36 mb-6 p-3 rounded-full bg-slate-950/70 backdrop-blur-md border border-amber-400/40 shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
          <img
            src="/assets/moeys-crest-transparent.png"
            alt="ត្រាជាតិកម្ពុជា"
            className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
            onError={(e) => { e.currentTarget.src = '/assets/moeys-custom-logo-transparent.png'; }}
          />
        </div>

        {/* Welcome Text */}
        <h1 className="font-moul text-2xl sm:text-3xl text-amber-300 mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,1)]">
          សូមស្វាគមន៍
        </h1>
        <p className="text-sm sm:text-base text-amber-200/90 mb-1 font-semibold drop-shadow-[0_2px_6px_rgba(0,0,0,1)]">
          ប្រព័ន្ធសិក្សាឌីជីថលកម្រិតវិទ្យាល័យជាតិ
        </p>
        <p className="text-xs text-blue-100/80 mb-8 drop-shadow-[0_2px_6px_rgba(0,0,0,1)]">
          E-Learning Platform v2.5
        </p>

        {/* ENTER BUTTON — This captures the user gesture for audio */}
        <button
          type="button"
          onClick={onEnter}
          className="group relative px-10 py-3.5 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 font-bold text-base sm:text-lg tracking-wider shadow-[0_4px_25px_rgba(255,215,0,0.4)] hover:shadow-[0_6px_35px_rgba(255,215,0,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border border-amber-300/50"
        >
          <span className="relative z-10 flex items-center gap-2">
            🎵 ចូលមើល
          </span>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>

        <p className="text-[10px] text-amber-200/50 mt-4">
          Ministry of Talent Development & Advanced Research
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PHASE 2: MAIN SPLASH — Plays audio with sound immediately
//          because user already clicked in the Welcome Gate.
// ═══════════════════════════════════════════════════════════════════
function MainSplash({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(START_TIME);
  const [duration, setDuration] = useState(TOTAL_DURATION);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [phase, setPhase] = useState(0);

  const audioRef = useRef(null);
  const progressTimerRef = useRef(null);
  const isClosingRef = useRef(false);

  const formatTime = (secs) => {
    if (!secs || isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleFinish = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    setIsClosing(true);
    setPhase(2);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    if (audioRef.current) {
      try { audioRef.current.pause(); audioRef.current.src = ''; } catch (e) {}
      audioRef.current = null;
    }
    setTimeout(() => { onFinish?.(); }, 600);
  }, [onFinish]);

  useEffect(() => {
    const phaseTimer = setTimeout(() => setPhase(1), 60);

    // Audio plays IMMEDIATELY with sound — user gesture was captured in WelcomeGate
    const audio = new Audio(AUDIO_SRC);
    audioRef.current = audio;
    audio.preload = 'auto';
    audio.currentTime = START_TIME;
    audio.volume = 1.0;
    audio.muted = false;

    const p = audio.play();
    if (p) {
      p.then(() => setIsPlaying(true)).catch(() => {
        // Fallback: try muted
        audio.muted = true;
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
      });
    }

    // Progress timer
    const startTimeStamp = Date.now();
    const songTotalSeconds = TOTAL_DURATION - START_TIME;

    progressTimerRef.current = setInterval(() => {
      if (isClosingRef.current) return;
      let currentSec = START_TIME;
      if (audioRef.current && !isNaN(audioRef.current.currentTime) && audioRef.current.currentTime > START_TIME) {
        currentSec = audioRef.current.currentTime;
      } else {
        const elapsed = (Date.now() - startTimeStamp) / 1000;
        currentSec = Math.min(TOTAL_DURATION, START_TIME + elapsed);
      }
      setCurrentTime(currentSec);
      const effectiveCurrent = Math.max(0, currentSec - START_TIME);
      const pct = Math.min(100, Math.round((effectiveCurrent / songTotalSeconds) * 100));
      setProgress(pct);
      if (currentSec >= TOTAL_DURATION - 0.5 || pct >= 100) {
        setProgress(100);
        handleFinish();
      }
    }, 100);

    return () => {
      clearTimeout(phaseTimer);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      if (audioRef.current) {
        try { audioRef.current.pause(); audioRef.current.src = ''; } catch (e) {}
      }
    };
  }, [handleFinish]);

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

  return (
    <div
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999999 }}
      className={`flex items-center justify-center font-kantumruy select-none transition-opacity duration-700 bg-slate-950 ${
        isClosing ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Cambodia Flag Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/assets/cambodia-flag.gif"
          onError={(e) => { e.currentTarget.src = 'https://media1.tenor.com/m/kDXhibIv45EAAAAC/cambodia-cambodia-flag.gif'; }}
          alt="Cambodia National Flag"
          className="absolute inset-0 w-full h-full object-cover filter brightness-95 contrast-110 saturate-110 scale-105 select-none pointer-events-none"
        />
        <div className="absolute inset-0 bg-slate-950/35" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/60" />
      </div>

      {/* Royal Gold Frame */}
      <div className="absolute inset-4 sm:inset-7 border border-[#ffd700]/30 rounded-xl pointer-events-none z-10 shadow-[0_0_20px_rgba(0,0,0,0.5)]" />
      <div className="absolute inset-6 sm:inset-10 border border-[#ffd700]/15 rounded-lg pointer-events-none z-10" />

      {/* Corner Accents */}
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
        onClick={(e) => { e.stopPropagation(); handleFinish(); }}
        className="absolute top-4 right-4 sm:top-7 sm:right-7 z-50 px-3.5 py-1.5 rounded-full border border-white/30 hover:border-amber-300 bg-slate-950/80 hover:bg-slate-900 text-amber-300 hover:text-white text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 backdrop-blur-md shadow-xl hover:scale-105 active:scale-95"
      >
        <span>រំលង</span>
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Main Content */}
      <div className={`relative z-20 flex flex-col items-center text-center px-6 max-w-xl mx-auto transition-all duration-700 ease-out ${contentClass}`}>
        {/* Central Seal */}
        <div className="relative mb-5 flex items-center justify-center" style={{ width: size, height: size }}>
          <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
          <svg width={size} height={size} className="absolute inset-0 -rotate-90">
            <circle cx={size/2} cy={size/2} r={radius+10} fill="none" stroke="#ffd700" strokeWidth="0.5" opacity="0.4" />
            <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth={strokeWidth} />
            <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#ffd700" strokeWidth={strokeWidth}
              strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
              className="transition-all duration-100 ease-out"
              style={{ filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.9))' }}
            />
          </svg>
          <div className="w-[110px] h-[110px] sm:w-[125px] sm:h-[125px] flex items-center justify-center p-2 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-400/50 shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
            <img src="/assets/moeys-crest-transparent.png" alt="ត្រាជាតិកម្ពុជា"
              className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
              onError={(e) => { e.currentTarget.src = '/assets/moeys-custom-logo-transparent.png'; }}
            />
          </div>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-amber-400 px-3 py-0.5 rounded-full shadow-lg">
            <span className="text-[11px] font-mono font-black text-amber-300 tracking-wider">{progress}%</span>
          </div>
        </div>

        {/* Royal Headings */}
        <div className="space-y-2 mb-4 bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl">
          <h2 className="font-moul text-xl sm:text-2xl text-amber-300 tracking-wide leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
            ព្រះរាជាណាចក្រកម្ពុជា
          </h2>
          <p className="text-xs sm:text-sm text-amber-200 font-extrabold tracking-[0.3em] uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,1)]">
            ជាតិ &nbsp;•&nbsp; សាសនា &nbsp;•&nbsp; ព្រះមហាក្សត្រ
          </p>
          <div className="flex items-center justify-center gap-3 py-1">
            <span className="h-[1px] w-14 sm:w-20 bg-gradient-to-r from-transparent to-amber-400/70" />
            <svg width="8" height="8" viewBox="0 0 10 10"><path d="M5 0L6.12 3.88L10 5L6.12 6.12L5 10L3.88 6.12L0 5L3.88 3.88Z" fill="#ffd700"/></svg>
            <span className="h-[1px] w-14 sm:w-20 bg-gradient-to-l from-transparent to-amber-400/70" />
          </div>
          <h1 className="font-moul text-sm sm:text-base text-white leading-relaxed max-w-md mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
            ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ និងការស្រាវជ្រាវកម្រិតខ្ពស់
          </h1>
          <p className="text-[11px] sm:text-xs text-blue-100 tracking-wide font-medium drop-shadow-[0_2px_6px_rgba(0,0,0,1)]">
            Ministry of Talent Development & Advanced Research (MoTDAR)
          </p>
        </div>

        {/* Song Badge */}
        <div className="mb-4 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-amber-400/30 text-amber-200 text-xs backdrop-blur-md shadow-lg max-w-full truncate">
          <Music className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span className="font-medium text-[11px] sm:text-xs text-amber-200 truncate">{SONG_TITLE}</span>
          <div className="flex items-end gap-0.5 h-3 px-1 shrink-0">
            <span className={`w-0.5 bg-amber-400 rounded-full transition-all duration-300 ${isPlaying ? 'h-3 animate-pulse' : 'h-1'}`} />
            <span className={`w-0.5 bg-amber-300 rounded-full transition-all duration-300 ${isPlaying ? 'h-2 animate-bounce' : 'h-1'}`} />
            <span className={`w-0.5 bg-amber-400 rounded-full transition-all duration-300 ${isPlaying ? 'h-3.5 animate-pulse' : 'h-1'}`} />
            <span className={`w-0.5 bg-amber-300 rounded-full transition-all duration-300 ${isPlaying ? 'h-1.5 animate-bounce' : 'h-1'}`} />
          </div>
          {duration > 0 && (
            <span className="text-[10px] font-mono text-amber-400/90 shrink-0 ml-0.5">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-60 sm:w-72 space-y-2">
          <div className="w-full h-2 rounded-full bg-slate-950/80 border border-amber-400/40 overflow-hidden p-[1px] shadow-lg">
            <div
              className="h-full rounded-full transition-all duration-100 ease-out bg-gradient-to-r from-amber-500 via-amber-300 to-amber-400"
              style={{ width: `${progress}%`, boxShadow: '0 0 10px rgba(255,215,0,0.9)' }}
            />
          </div>
          <p className="text-[10px] text-amber-200/90 font-semibold tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
            ប្រព័ន្ធសិក្សាឌីជីថលកម្រិតវិទ្យាល័យជាតិ • E-Learning Platform v2.5
          </p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN EXPORT: Two-phase splash
//   Phase 1: WelcomeGate (user clicks "ចូលមើល")
//   Phase 2: MainSplash (audio plays with sound instantly)
// ═══════════════════════════════════════════════════════════════════
export default function MoEYSIntroSplash({ onFinish }) {
  const [gateOpen, setGateOpen] = useState(false);

  const handleEnterGate = useCallback(() => {
    setGateOpen(true);
  }, []);

  if (typeof document === 'undefined') return null;

  if (!gateOpen) {
    return createPortal(
      <WelcomeGate onEnter={handleEnterGate} />,
      document.body
    );
  }

  return createPortal(
    <MainSplash onFinish={onFinish} />,
    document.body
  );
}
