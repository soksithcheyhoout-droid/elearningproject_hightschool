import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, Music } from 'lucide-react';

const AUDIO_SRC = '/assets/audio/khmer_tea_1.webm';
const SONG_TITLE = '(Khmer tea 1) Cambodian Song';
const START_TIME = 6; // Starts playing immediately at 0:06

export default function MoEYSIntroSplash({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(START_TIME);
  const [duration, setDuration] = useState(286); // ~4:46 default duration
  const [isPlaying, setIsPlaying] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [phase, setPhase] = useState(0); // 0=enter, 1=loaded, 2=exit

  const audioRef = useRef(null);
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

    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.src = '';
      } catch (e) {}
      audioRef.current = null;
    }

    setTimeout(() => {
      onFinish?.();
    }, 600);
  }, [onFinish]);

  // Start playing audio with sound
  const startAudioPlayback = useCallback(() => {
    if (!audioRef.current || isClosingRef.current) return;
    const audio = audioRef.current;

    try {
      audio.muted = false;
      if (audio.currentTime < START_TIME) {
        audio.currentTime = START_TIME;
      }
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // If unmuted playback is blocked by policy, play muted and unmute on first gesture
            audio.muted = true;
            audio.play().then(() => setIsPlaying(true)).catch(() => {});
          });
      }
    } catch (err) {
      console.warn('Play error:', err);
    }
  }, []);

  // User click / touch anywhere on the screen ensures audio is unmuted
  const handleUserInteract = () => {
    if (audioRef.current) {
      try {
        audioRef.current.muted = false;
        if (audioRef.current.paused) {
          audioRef.current.play().catch(() => {});
        }
      } catch (e) {}
    }
  };

  // Initialize High-Performance Audio
  useEffect(() => {
    const phaseTimer = setTimeout(() => setPhase(1), 60);

    const audio = new Audio();
    audioRef.current = audio;
    audio.src = AUDIO_SRC;
    audio.preload = 'auto';
    audio.currentTime = START_TIME;

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
      if (audio.currentTime < START_TIME) {
        audio.currentTime = START_TIME;
      }
      startAudioPlayback();
    };

    const handleCanPlay = () => {
      startAudioPlayback();
    };

    const handleTimeUpdate = () => {
      if (isClosingRef.current) return;
      const curr = audio.currentTime || START_TIME;
      const dur = audio.duration || duration || 286;

      setCurrentTime(curr);
      if (dur > START_TIME) {
        setDuration(dur);
        const effectiveCurrent = Math.max(0, curr - START_TIME);
        const effectiveTotal = Math.max(1, dur - START_TIME);
        const pct = Math.min(100, Math.round((effectiveCurrent / effectiveTotal) * 100));
        setProgress(pct);

        if (curr >= dur - 0.4) {
          setProgress(100);
          handleFinish();
        }
      }
    };

    const handleEnded = () => {
      setProgress(100);
      setTimeout(() => handleFinish(), 400);
    };

    const handleError = (e) => {
      console.warn('Audio playback error:', e);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Initial attempt to load and play
    audio.load();
    startAudioPlayback();

    // Global listener on window to seamlessly unmute audio on first interaction
    const unlockAudio = () => {
      if (audioRef.current) {
        try {
          audioRef.current.muted = false;
          if (audioRef.current.paused) {
            audioRef.current.play().catch(() => {});
          }
        } catch (e) {}
      }
    };

    window.addEventListener('click', unlockAudio, { once: true });
    window.addEventListener('touchstart', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });

    return () => {
      clearTimeout(phaseTimer);
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      try {
        audio.pause();
        audio.src = '';
      } catch (e) {}
    };
  }, [handleFinish, startAudioPlayback, duration]);

  if (typeof document === 'undefined') return null;

  // Circular progress dimensions
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
      onClick={handleUserInteract}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999999 }}
      className={`flex items-center justify-center font-kantumruy select-none transition-opacity duration-700 bg-slate-950 cursor-pointer ${
        isClosing ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* ═══════ BRIGHT, VIBRANT WAVING CAMBODIAN FLAG ═══════ */}
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

      {/* ── Skip Button (រំលង ✕) in Top-Right ── */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleFinish();
        }}
        className="absolute top-4 right-4 sm:top-7 sm:right-7 z-50 px-3.5 py-1.5 rounded-full border border-white/30 hover:border-amber-300 bg-slate-950/80 hover:bg-slate-900 text-amber-300 hover:text-white text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 backdrop-blur-md shadow-xl hover:scale-105 active:scale-95"
      >
        <span>រំលង</span>
        <X className="w-3.5 h-3.5" />
      </button>

      {/* ═══════ EXECUTIVE NATIONAL EMBLEM & HIGH CONTRAST TYPOGRAPHY ═══════ */}
      <div className={`relative z-20 flex flex-col items-center text-center px-6 max-w-xl mx-auto transition-all duration-700 ease-out ${contentClass}`}>

        {/* Central Seal with Golden Halo */}
        <div className="relative mb-5 flex items-center justify-center" style={{ width: size, height: size }}>
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

          {/* Emblem Container with Dark Backing */}
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

        {/* ── ROYAL HEADINGS ── */}
        <div className="space-y-2 mb-4 bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl">
          {/* Kingdom of Cambodia */}
          <h2 className="font-moul text-xl sm:text-2xl text-amber-300 tracking-wide leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
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
          <h1 className="font-moul text-sm sm:text-base text-white leading-relaxed max-w-md mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
            ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ និងការស្រាវជ្រាវកម្រិតខ្ពស់
          </h1>

          <p className="text-[11px] sm:text-xs text-blue-100 tracking-wide font-medium drop-shadow-[0_2px_6px_rgba(0,0,0,1)]">
            Ministry of Talent Development & Advanced Research (MoTDAR)
          </p>
        </div>

        {/* ── LIVE SONG PLAYBACK BADGE ── */}
        <div className="mb-4 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-amber-400/30 text-amber-200 text-xs backdrop-blur-md shadow-lg max-w-full truncate">
          <Music className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span className="font-medium text-[11px] sm:text-xs text-amber-200 truncate">
            {SONG_TITLE}
          </span>
          {/* Animated Equalizer Wave */}
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

        {/* ── AUDIO-SYNCED PROGRESS BAR ── */}
        <div className="w-60 sm:w-72 space-y-2">
          <div className="w-full h-2 rounded-full bg-slate-950/80 border border-amber-400/40 overflow-hidden p-[1px] shadow-lg">
            <div
              className="h-full rounded-full transition-all duration-100 ease-out bg-gradient-to-r from-amber-500 via-amber-300 to-amber-400"
              style={{
                width: `${progress}%`,
                boxShadow: '0 0 10px rgba(255,215,0,0.9)'
              }}
            />
          </div>
          <p className="text-[10px] text-amber-200/90 font-semibold tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
            ប្រព័ន្ធសិក្សាឌីជីថលកម្រិតវិទ្យាល័យជាតិ • E-Learning Platform v2.5
          </p>
        </div>

      </div>
    </div>,
    document.body
  );
}
