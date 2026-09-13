import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  X, 
  Search, 
  Headphones, 
  SkipForward, 
  SkipBack, 
  AlertCircle,
  Eye,
  EyeOff,
  Flame,
  Loader2,
  Square,
  Minus,
  Link as LinkIcon
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

// Quick Popular Search Tags
const POPULAR_SEARCH_TAGS = [
  { label: 'ទាំងអស់ (All)', query: 'lofi study' },
  { label: '🔥 VannDa', query: 'VannDa' },
  { label: '🎵 ដួង វីរៈសិទ្ធ', query: 'ដួង វីរៈសិទ្ធ' },
  { label: '☕ Lo-Fi Chill', query: 'lofi hip hop beats study' },
  { label: '🇰🇭 Acoustic ខ្មែរ', query: 'khmer acoustic chill guitar' },
  { label: '🎹 ព្យាណូ (Piano)', query: 'peaceful piano study music' },
  { label: '🌧️ សំឡេងភ្លៀង (Rain)', query: 'gentle rain study music' },
  { label: '✨ Taylor Swift', query: 'taylor swift acoustic' }
];

// Curated Baseline Study Tracks (Ready instantly on load)
export const DEFAULT_STUDY_TRACKS = [
  {
    id: 'jfKfPfyJRdk',
    title: 'Lofi Hip Hop Beats (Relax & Study 24/7)',
    channel: 'Lofi Girl 🎧',
    duration: 'LIVE',
    thumbnail: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg'
  },
  {
    id: 'rvje5oblrLw',
    title: 'VannDa - Time To Rise feat. Master Kong Nay',
    channel: 'វណ្ណដា-VannDa Official',
    duration: '5:40',
    thumbnail: 'https://i.ytimg.com/vi/rvje5oblrLw/hqdefault.jpg'
  },
  {
    id: '5qap5aO4i9A',
    title: 'Khmer Acoustic Chill Guitar for Study',
    channel: 'Khmer Chill Vibes 🇰🇭',
    duration: '1:12:30',
    thumbnail: 'https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault.jpg'
  },
  {
    id: 'MIHCnP8pDrQ',
    title: 'ដួង វីរៈសិទ្ធ - បទចម្រៀងជ្រើសរើសពិរោះៗ (Doung Virakseth Special)',
    channel: 'MT Records',
    duration: '40:30',
    thumbnail: 'https://i.ytimg.com/vi/MIHCnP8pDrQ/hqdefault.jpg'
  },
  {
    id: '4xDzrJKXOOY',
    title: 'Deep Focus Study Piano & Peaceful Strings',
    channel: 'Peaceful Mind 🎹',
    duration: '3:00:00',
    thumbnail: 'https://i.ytimg.com/vi/4xDzrJKXOOY/hqdefault.jpg'
  },
  {
    id: 'mPZkdNFkNps',
    title: 'Gentle Rain & Soft Study Piano for Concentration',
    channel: 'Rain & Focus 🌧️',
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
  const [activeTag, setActiveTag] = useState('ទាំងអស់ (All)');
  const [searchResults, setSearchResults] = useState(DEFAULT_STUDY_TRACKS);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  
  // Custom URL paste state
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [urlError, setUrlError] = useState('');

  // ONLY ONE IFRAME REF FOR THE ENTIRE APP
  const iframeRef = useRef(null);
  const searchInputRef = useRef(null);

  // Notify parent of play state change (for navbar soundbars)
  useEffect(() => {
    if (onPlayStateChange) {
      onPlayStateChange(isPlaying);
    }
  }, [isPlaying, onPlayStateChange]);

  // Listen to YouTube postMessage events for 100% accurate player state sync
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

  const handleTogglePlay = () => {
    if (isPlaying) {
      sendIframeCommand('pauseVideo');
      setIsPlaying(false);
    } else {
      sendIframeCommand('playVideo');
      setIsPlaying(true);
    }
  };

  const handleToggleMute = () => {
    if (isMuted) {
      sendIframeCommand('unMute');
      setIsMuted(false);
    } else {
      sendIframeCommand('mute');
      setIsMuted(true);
    }
  };

  const handleSelectTrack = (track) => {
    setCurrentTrack(track);
    setActiveVideoId(track.id);
    setIsPlaying(true);
    setUrlError('');
  };

  const handleNextTrack = () => {
    const list = searchResults.length > 0 ? searchResults : DEFAULT_STUDY_TRACKS;
    const currentIndex = list.findIndex(t => t.id === activeVideoId);
    const nextIndex = (currentIndex + 1) % list.length;
    handleSelectTrack(list[nextIndex]);
  };

  const handlePrevTrack = () => {
    const list = searchResults.length > 0 ? searchResults : DEFAULT_STUDY_TRACKS;
    const currentIndex = list.findIndex(t => t.id === activeVideoId);
    const prevIndex = (currentIndex - 1 + list.length) % list.length;
    handleSelectTrack(list[prevIndex]);
  };

  const handleStopAndDismiss = () => {
    sendIframeCommand('pauseVideo');
    sendIframeCommand('seekTo', [0, true]);
    setIsPlaying(false);
    if (onClose) onClose(false);
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
        setSearchError(`រកមិនឃើញបទចម្រៀងសម្រាប់ "${q}" ទេ`);
      }
    } catch (err) {
      console.error('YouTube search error:', err);
      setSearchError('បណ្តាញមានបញ្ហាក្នុងការស្វែងរក សូមសាកល្បងម្តងទៀត');
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
      setUrlError('សូមបញ្ចូលតំណភ្ជាប់ YouTube ឱ្យបានត្រឹមត្រូវ');
      return;
    }

    const newTrack = {
      id,
      title: customUrl.length > 40 ? customUrl.slice(0, 38) + '...' : customUrl,
      channel: 'YouTube Video',
      duration: 'Custom',
      thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`
    };

    handleSelectTrack(newTrack);
    setCustomUrl('');
    setShowUrlInput(false);
  };

  // Construct iframe embed URL (enablejsapi=1 enables seamless control)
  const embedUrl = `https://www.youtube.com/embed/${activeVideoId}?enablejsapi=1&autoplay=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}&rel=0&iv_load_policy=3&modestbranding=1`;

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. ULTRA-MINIMAL FLOATING MINI MUSIC DOCK (When Modal is Closed & Playing)*/}
      {/* ========================================================================= */}
      {!isOpen && isPlaying && (
        <div className="fixed bottom-20 md:bottom-6 right-3 sm:right-6 z-[9998] animate-fadeIn font-kantumruy select-none pointer-events-auto">
          <div className="flex items-center gap-3 bg-slate-950/92 backdrop-blur-2xl border border-white/15 text-white p-2 sm:p-2.5 pl-2.5 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.65)] hover:border-red-500/50 transition-all max-w-[92vw] sm:max-w-sm ring-1 ring-white/10">
            
            {/* Spinning Album Artwork */}
            <div 
              onClick={() => onClose && onClose(true)} 
              className="relative w-10 h-10 rounded-xl overflow-hidden cursor-pointer flex-shrink-0 group shadow-md"
              title="ចុចដើម្បីបើកផ្ទាំងធំ (Open Full Player)"
            >
              <img 
                src={currentTrack.thumbnail || `https://i.ytimg.com/vi/${activeVideoId}/hqdefault.jpg`} 
                alt={currentTrack.title}
                className={`w-full h-full object-cover group-hover:scale-110 transition-transform ${isPlaying ? 'animate-spin-slow' : ''}`}
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80'; }}
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-slate-950 animate-pulse" />
            </div>

            {/* Track Title & Artist */}
            <div 
              onClick={() => onClose && onClose(true)}
              className="min-w-0 flex-1 cursor-pointer pr-1"
              title="ចុចដើម្បីបើកផ្ទាំងធំ"
            >
              <h4 className="text-xs font-bold text-white truncate max-w-[130px] sm:max-w-[170px]">
                {currentTrack.title}
              </h4>
              <p className="text-[10px] text-slate-400 truncate max-w-[130px] sm:max-w-[170px] mt-0.5">
                {currentTrack.channel || 'YouTube'}
              </p>
            </div>

            {/* Compact Action Icons */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Play / Pause Toggle */}
              <button
                type="button"
                onClick={handleTogglePlay}
                className="w-8 h-8 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center cursor-pointer transition-transform active:scale-95 shadow-xs"
                title={isPlaying ? "ផ្អាក (Pause)" : "ចាក់បន្ត (Play)"}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
              </button>

              {/* Mute Toggle */}
              <button
                type="button"
                onClick={handleToggleMute}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                title={isMuted ? "បើកសំឡេង" : "បិទសំឡេង"}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-slate-200" />}
              </button>

              {/* Expand Full Modal */}
              <button
                type="button"
                onClick={() => onClose && onClose(true)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                title="បើកផ្ទាំងស្វែងរក (Expand)"
              >
                <Maximize2 className="w-3.5 h-3.5 text-slate-200" />
              </button>

              {/* Stop & Dismiss Completely */}
              <button
                type="button"
                onClick={handleStopAndDismiss}
                className="w-8 h-8 rounded-xl hover:bg-red-500/20 text-slate-400 hover:text-red-400 flex items-center justify-center cursor-pointer transition-colors"
                title="បញ្ឈប់ទាំងស្រុង (Stop)"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. THE MASTER MODAL & PERSISTENT SINGLE IFRAME CONTAINER                  */}
      {/* (CRITICAL: Never unmounted so the single iframe never reloads or restarts)*/}
      {/* ========================================================================= */}
      <div 
        className={`fixed inset-0 flex items-center justify-center p-3 sm:p-5 transition-all duration-300 font-kantumruy select-none ${
          isOpen 
            ? 'z-[9999] opacity-100 pointer-events-auto bg-slate-950/80 backdrop-blur-md' 
            : 'opacity-0 pointer-events-none -z-50'
        }`}
      >
        <div 
          className={`relative bg-[#0d1424] border border-white/15 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.85)] max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden my-auto text-white ring-1 ring-white/10 transition-transform duration-300 ${
            isOpen ? 'scale-100' : 'scale-95'
          }`}
        >
          
          {/* Top Clean Header */}
          <div className="px-5 py-3.5 bg-slate-900/90 border-b border-white/10 flex items-center justify-between flex-shrink-0">
            
            {/* Title & Status */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-600/40 flex-shrink-0">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-extrabold text-white">
                    YouTube Music
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>ចាក់បន្តក្នុង Background</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  ស្តាប់តន្ត្រីពេលរៀន • បិទផ្ទាំង (X) ចម្រៀងនៅតែបន្តចាក់
                </p>
              </div>
            </div>

            {/* Header Action Controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Video / Audio Mode Toggle */}
              <button
                type="button"
                onClick={() => setShowVideo(!showVideo)}
                className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  showVideo 
                    ? 'bg-white/10 text-white border-white/15 hover:bg-white/15' 
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}
                title={showVideo ? "ប្តូរទៅស្តាប់តែសំឡេង (Audio Only)" : "បង្ហាញវីដេអូ (Show Video)"}
              >
                {showVideo ? <Eye className="w-3.5 h-3.5 text-slate-300" /> : <EyeOff className="w-3.5 h-3.5 text-emerald-400" />}
                <span className="hidden sm:inline">{showVideo ? 'វីដេអូ' : 'សន្សំថ្ម'}</span>
              </button>

              {/* Minimize Button (Keep playing) */}
              <button
                type="button"
                onClick={() => onClose && onClose(false)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                title="បង្រួមតូច (តន្ត្រីនៅតែបន្តចាក់)"
              >
                <Minus className="w-4 h-4" />
              </button>

              {/* Close Button (Keep playing) */}
              <button
                type="button"
                onClick={() => onClose && onClose(false)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-red-600/30 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                title="បិទផ្ទាំង (តន្ត្រីនៅតែបន្តចាក់)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Clean Two-Column Body: Left = Player, Right = Search & Tracklist */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
            
            {/* ================================================================= */}
            {/* COLUMN 1: THE PLAYER (Left 5 Cols)                                */}
            {/* ================================================================= */}
            <div className="lg:col-span-5 flex flex-col space-y-4">
              
              {/* THE SINGLE YOUTUBE IFRAME CANVAS */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl flex-shrink-0">
                {/* 
                  IMPORTANT: This is the ONLY iframe in the entire app.
                  When showVideo is false, it is made 1px transparent so it stays alive playing audio!
                */}
                <iframe
                  ref={iframeRef}
                  key={activeVideoId}
                  src={embedUrl}
                  title="YouTube Player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className={showVideo ? "w-full h-full border-0" : "w-1 h-1 opacity-0 absolute pointer-events-none"}
                />

                {/* Audio-Only Visualizer Mode (Shown when showVideo is false) */}
                {!showVideo && (
                  <div className="w-full h-full relative flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-slate-900 via-[#0d1424] to-black">
                    <img 
                      src={currentTrack.thumbnail || `https://i.ytimg.com/vi/${activeVideoId}/hqdefault.jpg`} 
                      alt={currentTrack.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-20 blur-xl"
                    />
                    
                    {/* Spinning Disc Visualizer */}
                    <div className="relative z-10 space-y-3">
                      <div className="w-20 h-20 mx-auto rounded-full bg-red-600/20 border-2 border-red-500/40 flex items-center justify-center shadow-lg">
                        <Headphones className="w-9 h-9 text-red-400 animate-pulse" />
                      </div>

                      <div className="space-y-1 max-w-[220px] mx-auto">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                          ⚡ Audio Only • សន្សំថ្ម
                        </span>
                        <h4 className="text-xs font-bold text-white truncate pt-1">
                          {currentTrack.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 truncate">{currentTrack.channel}</p>
                      </div>

                      {/* Animated Soundwave Equalizer */}
                      <div className="flex items-center justify-center gap-1 pt-1">
                        {[0.3, 0.6, 0.9, 0.4, 0.8, 1, 0.5, 0.7, 0.3].map((h, i) => (
                          <span 
                            key={i} 
                            className="w-1 bg-gradient-to-t from-red-600 to-amber-400 rounded-full animate-pulse"
                            style={{ height: `${h * 20}px`, animationDelay: `${i * 0.1}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Now Playing Track Details */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9.5px] font-black uppercase text-red-400 bg-red-500/20 border border-red-500/30 px-1.5 py-0.2 rounded-md">
                      {isPlaying ? 'កំពុងចាក់' : 'បានផ្អាក'}
                    </span>
                    {currentTrack.duration && (
                      <span className="text-[10px] text-slate-400">{currentTrack.duration}</span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white line-clamp-1 leading-snug">
                    {currentTrack.title}
                  </h4>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {currentTrack.channel || 'YouTube'}
                  </p>
                </div>

                {/* Clean Control Buttons */}
                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    {/* Previous */}
                    <button
                      type="button"
                      onClick={handlePrevTrack}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors active:scale-95"
                      title="បទមុន"
                    >
                      <SkipBack className="w-4 h-4" />
                    </button>

                    {/* Play / Pause */}
                    <button
                      type="button"
                      onClick={handleTogglePlay}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-red-600/30 transition-transform active:scale-95"
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                      <span>{isPlaying ? 'ផ្អាក' : 'ចាក់'}</span>
                    </button>

                    {/* Next */}
                    <button
                      type="button"
                      onClick={handleNextTrack}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors active:scale-95"
                      title="បទបន្ទាប់"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Mute */}
                    <button
                      type="button"
                      onClick={handleToggleMute}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                      title={isMuted ? "បើកសំឡេង" : "បិទសំឡេង"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-slate-200" />}
                    </button>

                    {/* Stop & Dismiss */}
                    <button
                      type="button"
                      onClick={handleStopAndDismiss}
                      className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-700 text-xs font-bold transition-colors cursor-pointer"
                      title="បញ្ឈប់តន្ត្រីទាំងស្រុង"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* ================================================================= */}
            {/* COLUMN 2: SEARCH & TRACKLIST (Right 7 Cols)                       */}
            {/* ================================================================= */}
            <div className="lg:col-span-7 flex flex-col space-y-3.5 min-h-[360px]">
              
              {/* Minimal Search Bar */}
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-shrink-0">
                <div className="relative flex-1">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="ស្វែងរកបទចម្រៀង ឬតារាចម្រៀង (ឧ. VannDa, Taylor Swift, Lofi...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950/80 border border-white/15 rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
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
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-transform active:scale-95 cursor-pointer flex-shrink-0"
                >
                  {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  <span>ស្វែងរក</span>
                </button>
              </form>

              {/* Category Quick Tags */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] flex-shrink-0">
                {POPULAR_SEARCH_TAGS.map((tag) => {
                  const isSelected = activeTag === tag.label;
                  return (
                    <button
                      key={tag.label}
                      type="button"
                      onClick={() => handleQuickTagClick(tag)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
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

              {/* Direct URL Toggle Link */}
              <div className="flex items-center justify-between text-xs text-slate-400 px-0.5 flex-shrink-0">
                <span className="font-semibold text-white/90">
                  {searchResults.length > 0 ? `លទ្ធផលស្វែងរក (${searchResults.length})` : 'លទ្ធផលស្វែងរក'}
                </span>
                
                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="text-slate-400 hover:text-red-400 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>{showUrlInput ? 'លាក់តំណភ្ជាប់' : 'ចាក់តាមតំណភ្ជាប់ផ្ទាល់ខ្លួន (Paste URL)'}</span>
                </button>
              </div>

              {/* Collapsible Direct URL Drawer */}
              {showUrlInput && (
                <form onSubmit={handleLoadCustomUrl} className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-2 flex-shrink-0 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="បិទភ្ជាប់តំណ YouTube: https://www.youtube.com/watch?v=..."
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
                      <span>ចាក់</span>
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

              {/* Clean Track Rows List */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 max-h-[380px] [scrollbar-width:thin]">
                {isSearching ? (
                  <div className="py-12 text-center space-y-2">
                    <Loader2 className="w-6 h-6 text-red-500 animate-spin mx-auto" />
                    <p className="text-xs text-slate-400">កំពុងស្វែងរកបទចម្រៀង...</p>
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
                      onClick={() => handleSelectTrack(track)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                        isCurrent
                          ? 'bg-red-600/15 border-red-500/50 text-white shadow-xs'
                          : 'bg-white/5 hover:bg-white/10 border-white/5 hover:border-white/15 text-slate-300'
                      }`}
                    >
                      {/* Thumbnail & Track Name */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="relative w-12 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-black shadow-xs">
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
                              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
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

                      {/* Duration & Play Action */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {track.duration && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            {track.duration}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectTrack(track);
                          }}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                            isCurrent && isPlaying
                              ? 'bg-red-600 text-white'
                              : 'bg-white/10 hover:bg-red-600 text-white'
                          }`}
                        >
                          {isCurrent && isPlaying ? <Pause className="w-3 h-3 fill-white" /> : <Play className="w-3 h-3 fill-white ml-0.5" />}
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>

          </div>

          {/* Minimal Bottom Bar */}
          <div className="px-5 py-2.5 bg-slate-900/90 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 flex-shrink-0">
            <div className="flex items-center gap-2 truncate max-w-[70%]">
              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              <span className="truncate">
                {isPlaying ? `កំពុងចាក់៖ ${currentTrack.title}` : `បានផ្អាក៖ ${currentTrack.title}`}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onClose && onClose(false)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              បិទផ្ទាំង (រក្សាតន្ត្រីឱ្យនៅចាក់)
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
