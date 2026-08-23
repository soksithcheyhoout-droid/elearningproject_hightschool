import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, Volume2, VolumeX, Music } from 'lucide-react';

const YOUTUBE_VIDEO_ID = 'vAq3g0T_7MI'; // (Khmer tea 1 ) Cambodian Song
const SONG_TITLE = '(Khmer tea 1) Cambodian Song';

export default function MoEYSIntroSplash({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [phase, setPhase] = useState(0); // 0=enter, 1=loaded, 2=exit
  const [ytReady, setYtReady] = useState(false);

  const playerRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const fallbackIntervalRef = useRef(null);
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

    // Stop and cleanup YouTube audio player
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (fallbackIntervalRef.current) clearInterval(fallbackIntervalRef.current);

    if (playerRef.current) {
      try {
        if (typeof playerRef.current.stopVideo === 'function') {
          playerRef.current.stopVideo();
        }
        if (typeof playerRef.current.destroy === 'function') {
          playerRef.current.destroy();
        }
      } catch (e) {
        // Safe ignore
      }
      playerRef.current = null;
    }

    setTimeout(() => {
      onFinish?.();
    }, 600);
  }, [onFinish]);

  // Fallback animation if YouTube is blocked or fails to load
  const startFallback = useCallback(() => {
    if (fallbackIntervalRef.current || isClosingRef.current) return;
    const startTime = Date.now();
    const fallbackDuration = 6000;

    fallbackIntervalRef.current = setInterval(() => {
      if (isClosingRef.current) {
        clearInterval(fallbackIntervalRef.current);
        return;
      }
      const elapsed = Date.now() - startTime;
      const raw = elapsed / fallbackDuration;
      const pct = Math.min(100, Math.round(raw * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(fallbackIntervalRef.current);
        setTimeout(() => handleFinish(), 350);
      }
    }, 30);
  }, [handleFinish]);

  // Toggle Mute / Unmute
  const toggleMute = (e) => {
    e?.stopPropagation?.();
    if (!playerRef.current) return;
    try {
      if (isMuted) {
        playerRef.current.unMute();
        playerRef.current.playVideo();
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    } catch (err) {
      console.warn('Toggle mute error:', err);
    }
  };

  // User interaction anywhere unlocks audio on strict browser policies
  const handleUserInteract = () => {
    if (playerRef.current) {
      try {
        if (typeof playerRef.current.unMute === 'function') {
          playerRef.current.unMute();
          playerRef.current.setVolume(100);
        }
        if (typeof playerRef.current.playVideo === 'function') {
          playerRef.current.playVideo();
        }
        setIsMuted(false);
      } catch (e) {
        // Safe ignore
      }
    }
  };

  // Load YouTube IFrame API and Initialize Player
  useEffect(() => {
    const phaseTimer = setTimeout(() => setPhase(1), 60);

    let isMounted = true;

    const initPlayer = () => {
      if (!isMounted || playerRef.current || !window.YT || !window.YT.Player) return;

      try {
        playerRef.current = new window.YT.Player('yt-splash-audio-player', {
          height: '1',
          width: '1',
          videoId: YOUTUBE_VIDEO_ID,
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            enablejsapi: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            origin: window.location.origin
          },
          events: {
            onReady: (event) => {
              if (!isMounted || isClosingRef.current) return;
              setYtReady(true);
              try {
                event.target.unMute();
                event.target.setVolume(100);
                event.target.playVideo();
              } catch (e) {
                console.warn('Autoplay error:', e);
              }
            },
            onStateChange: (event) => {
              if (!isMounted || isClosingRef.current) return;

              // YT.PlayerState.PLAYING = 1
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                setIsMuted(event.target.isMuted ? event.target.isMuted() : false);
                const dur = event.target.getDuration ? event.target.getDuration() : 0;
                if (dur > 0) setDuration(dur);
              }
              // YT.PlayerState.PAUSED = 2
              else if (event.data === window.YT.PlayerState.PAUSED) {
                setIsPlaying(false);
              }
              // YT.PlayerState.ENDED = 0
              else if (event.data === window.YT.PlayerState.ENDED) {
                setProgress(100);
                setTimeout(() => handleFinish(), 400);
              }
            },
            onError: (err) => {
              console.warn('YouTube audio player error:', err);
              startFallback();
            }
          }
        });
      } catch (err) {
        console.warn('Failed to instantiate YouTube player:', err);
        startFallback();
      }
    };

    // Check if YouTube API is already on window
    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const existingScript = document.getElementById('youtube-iframe-api');
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        if (firstScriptTag && firstScriptTag.parentNode) {
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        } else {
          document.head.appendChild(tag);
        }
      }

      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prevCallback === 'function') prevCallback();
        if (isMounted) initPlayer();
      };
    }

    // Safety timeout: If YT player takes more than 5 seconds without ready, start fallback
    const safetyTimeout = setTimeout(() => {
      if (!playerRef.current) {
        startFallback();
      }
    }, 5000);

    // Poll current time and sync progress with audio playback
    progressIntervalRef.current = setInterval(() => {
      if (!playerRef.current || isClosingRef.current) return;
      try {
        if (typeof playerRef.current.getCurrentTime === 'function' && typeof playerRef.current.getDuration === 'function') {
          const curr = playerRef.current.getCurrentTime() || 0;
          const dur = playerRef.current.getDuration() || 0;

          if (dur > 0) {
            setDuration(dur);
            setCurrentTime(curr);
            const pct = Math.min(100, Math.round((curr / dur) * 100));
            setProgress(pct);

            if (curr >= dur - 0.4) {
              setProgress(100);
              handleFinish();
            }
          }
        }
      } catch (e) {
        // Safe ignore
      }
    }, 100);

    return () => {
      isMounted = false;
      clearTimeout(phaseTimer);
      clearTimeout(safetyTimeout);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (fallbackIntervalRef.current) clearInterval(fallbackIntervalRef.current);
      if (playerRef.current) {
        try {
          if (typeof playerRef.current.stopVideo === 'function') {
            playerRef.current.stopVideo();
          }
          if (typeof playerRef.current.destroy === 'function') {
            playerRef.current.destroy();
          }
        } catch (e) {}
        playerRef.current = null;
      }
    };
  }, [handleFinish, startFallback]);

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
      className={`flex items-center justify-center font-kantumruy select-none transition-opacity duration-700 bg-slate-950 ${
        isClosing ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Hidden YouTube Iframe Player Container for Background Audio */}
      <div
        id="yt-splash-audio-player"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          opacity: 0.01,
          pointerEvents: 'none',
          top: '-100px',
          left: '-100px'
        }}
      />

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

      {/* ── Top Header Controls: Music Status, Mute/Unmute & Skip Button ── */}
      <div className="absolute top-4 right-4 sm:top-7 sm:right-7 z-50 flex items-center gap-2">
        {/* Audio Mute / Unmute Button */}
        <button
          type="button"
          onClick={toggleMute}
          title={isMuted ? 'បើកសំឡេង (Unmute)' : 'បិទសំឡេង (Mute)'}
          className="px-3 py-1.5 rounded-full border border-white/20 hover:border-amber-300/60 bg-slate-950/75 hover:bg-slate-900/90 text-amber-200 text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 backdrop-blur-md shadow-xl"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline text-rose-300">បិទសំឡេង</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="hidden sm:inline text-amber-200">សំឡេង</span>
            </>
          )}
        </button>

        {/* Skip Button (រំលង ✕) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleFinish();
          }}
          className="px-3.5 py-1.5 rounded-full border border-white/30 hover:border-amber-300 bg-slate-950/80 hover:bg-slate-900 text-amber-300 hover:text-white text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 backdrop-blur-md shadow-xl hover:scale-105 active:scale-95"
        >
          <span>រំលង</span>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

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

