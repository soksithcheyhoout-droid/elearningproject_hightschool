import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  X, 
  Search, 
  Headphones, 
  SkipForward, 
  SkipBack, 
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Square,
  Minus,
  Link as LinkIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Extract YouTube Video ID from any URL format or bare ID
export function extractYouTubeId(url) {
  if (!url) return null;
  const clean = url.trim();
  const match = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|live\/))([\w-]{11})/i);
  if (match && match[1]) return match[1];
  if (/^[\w-]{11}$/.test(clean)) return clean;
  return null;
}

// Clean Category Filter Tags (Professional, zero emojis)
const POPULAR_SEARCH_TAGS = [
  { label: 'All', query: 'lofi study beats' },
  { label: 'VannDa', query: 'VannDa' },
  { label: 'Doung Virakseth', query: 'ដួង វីរៈសិទ្ធ' },
  { label: 'Lo-Fi Chill', query: 'lofi hip hop beats study' },
  { label: 'Khmer Acoustic', query: 'khmer acoustic chill guitar' },
  { label: 'Piano Focus', query: 'peaceful piano study music' },
  { label: 'Rain Ambience', query: 'gentle rain study music' },
  { label: 'Taylor Swift', query: 'taylor swift acoustic' },
  { label: 'G-Devith', query: 'G-Devith' }
];

// Baseline High Quality Tracks
export const DEFAULT_STUDY_TRACKS = [
  {
    id: 'jfKfPfyJRdk',
    title: 'Lofi Hip Hop Beats (Relax & Study 24/7)',
    channel: 'Lofi Girl',
    duration: 'LIVE',
    thumbnail: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg'
  },
  {
    id: 'rvje5oblrLw',
    title: 'VannDa - Time To Rise feat. Master Kong Nay',
    channel: 'VannDa Official',
    duration: '5:40',
    thumbnail: 'https://i.ytimg.com/vi/rvje5oblrLw/hqdefault.jpg'
  },
  {
    id: '5qap5aO4i9A',
    title: 'Khmer Acoustic Chill Guitar for Study',
    channel: 'Khmer Chill Vibes',
    duration: '1:12:30',
    thumbnail: 'https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault.jpg'
  },
  {
    id: 'MIHCnP8pDrQ',
    title: 'Doung Virakseth - Selected Acoustic Hits',
    channel: 'MT Records',
    duration: '40:30',
    thumbnail: 'https://i.ytimg.com/vi/MIHCnP8pDrQ/hqdefault.jpg'
  },
  {
    id: '4xDzrJKXOOY',
    title: 'Deep Focus Study Piano & Peaceful Strings',
    channel: 'Peaceful Mind',
    duration: '3:00:00',
    thumbnail: 'https://i.ytimg.com/vi/4xDzrJKXOOY/hqdefault.jpg'
  },
  {
    id: 'mPZkdNFkNps',
    title: 'Gentle Rain & Soft Study Piano for Concentration',
    channel: 'Rain & Focus',
    duration: '2:30:15',
    thumbnail: 'https://i.ytimg.com/vi/mPZkdNFkNps/hqdefault.jpg'
  }
];

export default function YouTubeStudyPlayer({ isOpen, onClose, onPlayStateChange }) {
  const [activeVideoId, setActiveVideoId] = useState(DEFAULT_STUDY_TRACKS[0].id);
  const [currentTrack, setCurrentTrack] = useState(DEFAULT_STUDY_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showVideo, setShowVideo] = useState(true);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('All');
  const [searchResults, setSearchResults] = useState(DEFAULT_STUDY_TRACKS);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  
  // Custom URL paste state
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [urlError, setUrlError] = useState('');

  // Single persistent iframe reference
  const iframeRef = useRef(null);
  const searchInputRef = useRef(null);
  const tagsScrollRef = useRef(null);

  // Notify parent of play state change (for navbar soundbars)
  useEffect(() => {
    if (onPlayStateChange) {
      onPlayStateChange(isPlaying);
    }
  }, [isPlaying, onPlayStateChange]);

  // Listen to YouTube postMessage events for accurate player state sync
  useEffect(() => {
    const handleMessage = (event) => {
      try {
        if (!event.data) return;
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data && data.event === 'onStateChange') {
          // 1: PLAYING, 2: PAUSED, 0: ENDED, 3: BUFFERING
          if (data.info === 1) {
            setIsPlaying(true);
          } else if (data.info === 2 || data.info === 0) {
            setIsPlaying(false);
          }
        }
      } catch (e) {
        // Non-JSON message from other sources
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Handle postMessage commands to YouTube IFrame (Single source of truth)
  const sendIframeCommand = useCallback((command, args = []) => {
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func: command,
            args: args
          }),
          '*'
        );
      }
    } catch (e) {
      console.warn('Iframe command notice:', e);
    }
  }, []);

  // Toggle Play / Pause
  const handleTogglePlay = useCallback(() => {
    if (isPlaying) {
      sendIframeCommand('pauseVideo');
      setIsPlaying(false);
    } else {
      sendIframeCommand('playVideo');
      setIsPlaying(true);
    }
  }, [isPlaying, sendIframeCommand]);

  // Stop video without closing modal
  const handleStop = useCallback(() => {
    sendIframeCommand('pauseVideo');
    sendIframeCommand('seekTo', [0, true]);
    setIsPlaying(false);
  }, [sendIframeCommand]);

  // Toggle Mute / Unmute
  const handleToggleMute = useCallback(() => {
    if (isMuted) {
      sendIframeCommand('unMute');
      setIsMuted(false);
    } else {
      sendIframeCommand('mute');
      setIsMuted(true);
    }
  }, [isMuted, sendIframeCommand]);

  // Handle track selection from list: if already active, toggle play/pause; otherwise play new
  const handleTrackClick = useCallback((track) => {
    if (activeVideoId === track.id) {
      handleTogglePlay();
    } else {
      setCurrentTrack(track);
      setActiveVideoId(track.id);
      setIsPlaying(true);
      setUrlError('');
    }
  }, [activeVideoId, handleTogglePlay]);

  // Next Track
  const handleNextTrack = useCallback(() => {
    const list = searchResults.length > 0 ? searchResults : DEFAULT_STUDY_TRACKS;
    const currentIndex = list.findIndex(t => t.id === activeVideoId);
    const nextIndex = (currentIndex + 1) % list.length;
    handleTrackClick(list[nextIndex]);
  }, [searchResults, activeVideoId, handleTrackClick]);

  // Previous Track
  const handlePrevTrack = useCallback(() => {
    const list = searchResults.length > 0 ? searchResults : DEFAULT_STUDY_TRACKS;
    const currentIndex = list.findIndex(t => t.id === activeVideoId);
    const prevIndex = (currentIndex - 1 + list.length) % list.length;
    handleTrackClick(list[prevIndex]);
  }, [searchResults, activeVideoId, handleTrackClick]);

  // Horizontal scroll tags handler
  const scrollTags = (direction) => {
    if (tagsScrollRef.current) {
      const offset = direction === 'left' ? -180 : 180;
      tagsScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Perform Live YouTube Search
  const executeSearch = useCallback(async (queryToSearch) => {
    const q = (queryToSearch !== undefined ? queryToSearch : searchQuery).trim();
    if (!q) {
      setSearchResults(DEFAULT_STUDY_TRACKS);
      return;
    }

    setIsSearching(true);
    setSearchError('');

    try {
      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(q)}`);
      const data = await response.json();

      if (data && data.results && data.results.length > 0) {
        setSearchResults(data.results);
      } else {
        setSearchResults([]);
        setSearchError(`No tracks found for "${q}"`);
      }
    } catch (err) {
      console.error('YouTube search error:', err);
      setSearchError('Search service unavailable. Please try again.');
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setActiveTag('');
    executeSearch();
  };

  const handleQuickTagClick = (tag) => {
    setActiveTag(tag.label);
    setSearchQuery(tag.query);
    executeSearch(tag.query);
  };

  // Handle direct custom URL paste
  const handleLoadCustomUrl = (e) => {
    if (e) e.preventDefault();
    setUrlError('');

    const id = extractYouTubeId(customUrl);
    if (!id) {
      setUrlError('Please enter a valid YouTube video link');
      return;
    }

    const newTrack = {
      id,
      title: customUrl.length > 40 ? customUrl.slice(0, 38) + '...' : customUrl,
      channel: 'YouTube Video',
      duration: 'Custom',
      thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`
    };

    handleTrackClick(newTrack);
    setCustomUrl('');
    setShowUrlInput(false);
  };

  // Construct iframe embed URL
  const embedUrl = `https://www.youtube.com/embed/${activeVideoId}?enablejsapi=1&autoplay=1&origin=${typeof window !== 'undefined' ? encodeURIComponent(window.location.origin) : ''}&rel=0&iv_load_policy=3&modestbranding=1`;

  return (
    <>
      {/* ========================================================================= */}
      {/* MASTER MODAL & PERSISTENT SINGLE IFRAME CONTAINER                         */}
      {/* Never unmounted: closes cleanly with opacity-0 -z-50 for background audio */}
      {/* ========================================================================= */}
      <div 
        className={`fixed inset-0 flex items-center justify-center p-2 sm:p-4 md:p-6 transition-all duration-300 font-kantumruy select-none ${
          isOpen 
            ? 'z-[9999] opacity-100 pointer-events-auto bg-slate-950/85 backdrop-blur-md' 
            : 'opacity-0 pointer-events-none -z-50'
        }`}
      >
        <div 
          className={`relative bg-[#0b1220] border border-white/15 rounded-2xl sm:rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.85)] w-full max-w-5xl h-[94dvh] sm:h-auto sm:max-h-[88vh] flex flex-col overflow-hidden text-white ring-1 ring-white/10 transition-transform duration-300 ${
            isOpen ? 'scale-100' : 'scale-95'
          }`}
        >
          
          {/* Header Bar */}
          <div className="px-4 sm:px-6 py-3 bg-slate-900/90 border-b border-white/10 flex items-center justify-between flex-shrink-0">
            
            {/* Title & Clean Status Indicator */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-600/40 flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-extrabold text-white tracking-wide">
                    YouTube Music
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Background Audio</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block mt-0.5">
                  Play songs while studying • Closes cleanly while audio keeps playing
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {/* Video / Audio Mode Toggle */}
              <button
                type="button"
                onClick={() => setShowVideo(!showVideo)}
                className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  showVideo 
                    ? 'bg-white/10 text-white border-white/15 hover:bg-white/15' 
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}
                title={showVideo ? "Switch to Audio Only" : "Show Video"}
              >
                {showVideo ? <Eye className="w-3.5 h-3.5 text-slate-300" /> : <EyeOff className="w-3.5 h-3.5 text-emerald-400" />}
                <span className="hidden sm:inline">{showVideo ? 'Video' : 'Audio Mode'}</span>
              </button>

              {/* Minimize (Close to background) */}
              <button
                type="button"
                onClick={() => onClose && onClose(false)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                title="Minimize (Audio continues)"
              >
                <Minus className="w-4 h-4" />
              </button>

              {/* Close (Audio continues in background) */}
              <button
                type="button"
                onClick={() => onClose && onClose(false)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-red-600/40 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                title="Close modal (Audio keeps playing)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Clean Responsive Body: Two columns on desktop, stacked on mobile */}
          <div className="p-3 sm:p-5 md:p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 [scrollbar-width:thin] [-webkit-overflow-scrolling:touch]">
            
            {/* ================================================================= */}
            {/* COLUMN 1: THE PLAYER (Left 5 Cols on Desktop)                     */}
            {/* ================================================================= */}
            <div className="lg:col-span-5 flex flex-col space-y-3 sm:space-y-4">
              
              {/* THE SINGLE YOUTUBE IFRAME CANVAS */}
              <div className="relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl flex-shrink-0">
                <iframe
                  ref={iframeRef}
                  key={activeVideoId}
                  src={embedUrl}
                  title="YouTube Player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className={showVideo ? "w-full h-full border-0" : "w-1 h-1 opacity-0 absolute pointer-events-none"}
                />

                {/* Audio-Only Visualizer Mode */}
                {!showVideo && (
                  <div className="w-full h-full relative flex flex-col items-center justify-center p-4 sm:p-6 text-center bg-gradient-to-b from-slate-900 via-[#0d1424] to-black">
                    <img 
                      src={currentTrack.thumbnail || `https://i.ytimg.com/vi/${activeVideoId}/hqdefault.jpg`} 
                      alt={currentTrack.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-15 blur-xl pointer-events-none"
                    />
                    
                    <div className="relative z-10 space-y-2.5">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-red-600/20 border-2 border-red-500/40 flex items-center justify-center shadow-lg">
                        <Headphones className="w-8 h-8 sm:w-9 sm:h-9 text-red-400 animate-pulse" />
                      </div>

                      <div className="space-y-1 max-w-[220px] mx-auto">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                          Audio Only Mode
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate pt-1">
                          {currentTrack.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 truncate">{currentTrack.channel}</p>
                      </div>

                      {/* Equalizer Waveform */}
                      <div className="flex items-center justify-center gap-1 pt-1">
                        {[0.3, 0.6, 0.9, 0.4, 0.8, 1, 0.5, 0.7, 0.3].map((h, i) => (
                          <span 
                            key={i} 
                            className="w-1 bg-gradient-to-t from-red-600 to-amber-400 rounded-full animate-pulse"
                            style={{ height: `${h * 18}px`, animationDelay: `${i * 0.1}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Now Playing Track Info & Dedicated Player Controls */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 sm:p-4 space-y-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9.5px] font-bold uppercase text-red-400 bg-red-500/20 border border-red-500/30 px-2 py-0.5 rounded-md">
                      {isPlaying ? 'Playing' : 'Paused'}
                    </span>
                    {currentTrack.duration && (
                      <span className="text-[10px] text-slate-400 font-mono">{currentTrack.duration}</span>
                    )}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1 leading-snug">
                    {currentTrack.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {currentTrack.channel || 'YouTube'}
                  </p>
                </div>

                {/* Primary Player Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {/* Previous Track */}
                    <button
                      type="button"
                      onClick={handlePrevTrack}
                      className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors active:scale-95"
                      title="Previous Track"
                    >
                      <SkipBack className="w-4 h-4" />
                    </button>

                    {/* Play / Pause Toggle Button */}
                    <button
                      type="button"
                      onClick={handleTogglePlay}
                      className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-red-600/30 transition-transform active:scale-95"
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                      <span>{isPlaying ? 'Pause' : 'Play'}</span>
                    </button>

                    {/* Next Track */}
                    <button
                      type="button"
                      onClick={handleNextTrack}
                      className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors active:scale-95"
                      title="Next Track"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Mute Toggle */}
                    <button
                      type="button"
                      onClick={handleToggleMute}
                      className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-slate-200" />}
                    </button>

                    {/* Stop Button (Stops playback and resets time to 0) */}
                    <button
                      type="button"
                      onClick={handleStop}
                      className="p-2 sm:p-2.5 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-700 text-xs font-bold transition-colors cursor-pointer"
                      title="Stop Playback"
                    >
                      <Square className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* ================================================================= */}
            {/* COLUMN 2: SEARCH & TRACKLIST (Right 7 Cols on Desktop)            */}
            {/* ================================================================= */}
            <div className="lg:col-span-7 flex flex-col space-y-3 min-h-[340px]">
              
              {/* Search Bar Input */}
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-shrink-0">
                <div className="relative flex-1">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search any song or artist (VannDa, Doung Virakseth, Taylor Swift, Lofi...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950/90 border border-white/15 rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="p-1 rounded-lg text-slate-400 hover:text-white absolute right-2.5 top-2.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSearching}
                  className="px-4 sm:px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-transform active:scale-95 cursor-pointer flex-shrink-0"
                >
                  {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  <span className="hidden sm:inline">Search</span>
                </button>
              </form>

              {/* Scrollable Category Tags Carousel with Left & Right Arrows */}
              <div className="relative flex items-center flex-shrink-0">
                <button
                  type="button"
                  onClick={() => scrollTags('left')}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white mr-1 flex-shrink-0 cursor-pointer transition-colors"
                  title="Scroll left"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <div 
                  ref={tagsScrollRef}
                  className="flex items-center gap-1.5 overflow-x-auto py-1 scroll-smooth no-scrollbar flex-1 [scrollbar-width:none] [-ms-overflow-style:none]"
                >
                  {POPULAR_SEARCH_TAGS.map((tag) => {
                    const isSelected = activeTag === tag.label;
                    return (
                      <button
                        key={tag.label}
                        type="button"
                        onClick={() => handleQuickTagClick(tag)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                          isSelected
                            ? 'bg-red-600 text-white shadow-xs'
                            : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5'
                        }`}
                      >
                        {tag.label}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => scrollTags('right')}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white ml-1 flex-shrink-0 cursor-pointer transition-colors"
                  title="Scroll right"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Header Title & Direct URL Toggle */}
              <div className="flex items-center justify-between text-xs text-slate-400 px-0.5 flex-shrink-0 pt-0.5">
                <span className="font-semibold text-white/90 text-xs">
                  {searchResults.length > 0 ? `Results (${searchResults.length})` : 'Results'}
                </span>
                
                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="text-slate-400 hover:text-red-400 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>{showUrlInput ? 'Hide URL' : 'Paste YouTube URL'}</span>
                </button>
              </div>

              {/* Direct URL Input */}
              {showUrlInput && (
                <form onSubmit={handleLoadCustomUrl} className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-2 flex-shrink-0 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Paste YouTube Link: https://www.youtube.com/watch?v=..."
                      value={customUrl}
                      onChange={(e) => {
                        setCustomUrl(e.target.value);
                        setUrlError('');
                      }}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 font-mono"
                    />
                    <button
                      type="submit"
                      disabled={!customUrl.trim()}
                      className="px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Play</span>
                    </button>
                  </div>
                  {urlError && (
                    <p className="text-[11px] text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      <span>{urlError}</span>
                    </p>
                  )}
                </form>
              )}

              {/* Scrollable Track Rows List */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 max-h-[360px] sm:max-h-[380px] [scrollbar-width:thin] [-webkit-overflow-scrolling:touch]">
                {isSearching ? (
                  <div className="py-12 text-center space-y-2">
                    <Loader2 className="w-6 h-6 text-red-500 animate-spin mx-auto" />
                    <p className="text-xs text-slate-400">Searching YouTube tracks...</p>
                  </div>
                ) : searchError ? (
                  <div className="py-10 text-center space-y-2">
                    <AlertCircle className="w-6 h-6 text-slate-500 mx-auto" />
                    <p className="text-xs text-slate-400">{searchError}</p>
                  </div>
                ) : searchResults.map((track) => {
                  const isCurrent = activeVideoId === track.id;
                  return (
                    <div
                      key={track.id}
                      onClick={() => handleTrackClick(track)}
                      className={`p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                        isCurrent
                          ? 'bg-red-600/15 border-red-500/50 text-white shadow-xs'
                          : 'bg-white/5 hover:bg-white/10 border-white/5 hover:border-white/15 text-slate-300'
                      }`}
                    >
                      {/* Thumbnail & Title */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="relative w-12 h-10 sm:w-14 sm:h-11 rounded-lg overflow-hidden flex-shrink-0 bg-black shadow-xs">
                          <img 
                            src={track.thumbnail || `https://i.ytimg.com/vi/${track.id}/hqdefault.jpg`} 
                            alt={track.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            onError={(e) => { e.target.src = `https://i.ytimg.com/vi/${track.id}/hqdefault.jpg`; }}
                          />
                          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                            isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                          }`}>
                            {isCurrent && isPlaying ? (
                              <Pause className="w-3.5 h-3.5 fill-white text-white" />
                            ) : (
                              <Play className="w-3.5 h-3.5 fill-white text-white" />
                            )}
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <h5 className={`text-xs font-bold truncate ${
                            isCurrent ? 'text-red-300' : 'text-white group-hover:text-red-300'
                          }`}>
                            {track.title}
                          </h5>
                          <p className="text-[10.5px] text-slate-400 truncate mt-0.5">
                            {track.channel || 'YouTube'}
                          </p>
                        </div>
                      </div>

                      {/* Duration & Play/Pause Button */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {track.duration && (
                          <span className="text-[10px] text-slate-400 font-mono hidden min-[400px]:inline">
                            {track.duration}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTrackClick(track);
                          }}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                            isCurrent && isPlaying
                              ? 'bg-red-600 hover:bg-red-700 text-white shadow-md'
                              : 'bg-white/10 hover:bg-red-600 text-white'
                          }`}
                          title={isCurrent && isPlaying ? "Pause this track" : "Play this track"}
                        >
                          {isCurrent && isPlaying ? (
                            <Pause className="w-3.5 h-3.5 fill-white" />
                          ) : (
                            <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                          )}
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>

          </div>

          {/* Clean Bottom Footer Bar */}
          <div className="px-4 sm:px-6 py-2.5 bg-slate-900/90 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 flex-shrink-0">
            <div className="flex items-center gap-2 truncate max-w-[65%] sm:max-w-[75%]">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              <span className="truncate text-[11px] sm:text-xs">
                {isPlaying ? `Playing: ${currentTrack.title}` : `Paused: ${currentTrack.title}`}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onClose && onClose(false)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors cursor-pointer flex-shrink-0"
            >
              Close & Listen
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
