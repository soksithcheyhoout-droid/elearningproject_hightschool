import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  X, 
  ExternalLink, 
  Search, 
  Headphones, 
  Sparkles, 
  Radio, 
  SkipForward, 
  SkipBack, 
  AlertCircle,
  Eye,
  EyeOff,
  Music,
  Flame,
  Loader2,
  Check
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

// Quick Popular Search Tags for Students
const POPULAR_SEARCH_TAGS = [
  { label: '🔥 VannDa (វណ្ណដា)', query: 'VannDa' },
  { label: '🎵 ដួង វីរៈសិទ្ធ', query: 'ដួង វីរៈសិទ្ធ' },
  { label: '☕ Lo-Fi Study Chill', query: 'lofi hip hop study beats' },
  { label: '🇰🇭 Khmer Acoustic Chill', query: 'khmer acoustic chill guitar' },
  { label: '🎹 ព្យាណូស្ងប់ស្ងាត់ (Piano)', query: 'peaceful piano study music' },
  { label: '🌧️ សំឡេងភ្លៀង & រៀន (Rain)', query: 'gentle rain study music' },
  { label: '🧠 Alpha Waves Focus', query: 'alpha waves study focus' },
  { label: '✨ Taylor Swift Chill', query: 'taylor swift acoustic' },
  { label: '🎸 G-Devith', query: 'G-Devith' }
];

// Curated Baseline Study Tracks (Ready instantly offline or before searching)
export const DEFAULT_STUDY_TRACKS = [
  {
    id: 'jfKfPfyJRdk',
    title: 'Lofi Hip Hop Beats (Relax & Study 24/7)',
    channel: 'Lofi Girl 🎧',
    duration: 'LIVE',
    thumbnail: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg',
    category: 'Lo-Fi Chill'
  },
  {
    id: 'rvje5oblrLw',
    title: 'VannDa - Time To Rise feat. Master Kong Nay',
    channel: 'វណ្ណដា-VannDa Official',
    duration: '5:40',
    thumbnail: 'https://i.ytimg.com/vi/rvje5oblrLw/hqdefault.jpg',
    category: 'Khmer HipHop'
  },
  {
    id: '5qap5aO4i9A',
    title: 'Khmer Acoustic Chill Guitar for Study',
    channel: 'Khmer Chill Vibes 🇰🇭',
    duration: '1:12:30',
    thumbnail: 'https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault.jpg',
    category: 'Khmer Acoustic'
  },
  {
    id: 'MIHCnP8pDrQ',
    title: 'ដួង វីរៈសិទ្ធ - បទចម្រៀងជ្រើសរើសពិរោះៗ (Doung Virakseth Special)',
    channel: 'MT Records',
    duration: '40:30',
    thumbnail: 'https://i.ytimg.com/vi/MIHCnP8pDrQ/hqdefault.jpg',
    category: 'Khmer Pop'
  },
  {
    id: '4xDzrJKXOOY',
    title: 'Deep Focus Study Piano & Peaceful Strings',
    channel: 'Peaceful Mind 🎹',
    duration: '3:00:00',
    thumbnail: 'https://i.ytimg.com/vi/4xDzrJKXOOY/hqdefault.jpg',
    category: 'Piano Study'
  },
  {
    id: 'mPZkdNFkNps',
    title: 'Gentle Rain & Soft Study Piano for Concentration',
    channel: 'Rain & Focus 🌧️',
    duration: '2:30:15',
    thumbnail: 'https://i.ytimg.com/vi/mPZkdNFkNps/hqdefault.jpg',
    category: 'Rain & Nature'
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
  const [searchResults, setSearchResults] = useState(DEFAULT_STUDY_TRACKS);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [activeTab, setActiveTab] = useState('search'); // 'search' | 'curated' | 'url'
  
  // Custom URL paste state
  const [customUrl, setCustomUrl] = useState('');
  const [urlError, setUrlError] = useState('');

  const iframeRef = useRef(null);
  const searchInputRef = useRef(null);

  // Notify parent of play state change (for navbar soundbars)
  useEffect(() => {
    if (onPlayStateChange) {
      onPlayStateChange(isPlaying);
    }
  }, [isPlaying, onPlayStateChange]);

  // Focus search input when modal opens on search tab
  useEffect(() => {
    if (isOpen && activeTab === 'search') {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 200);
    }
  }, [isOpen, activeTab]);

  // Handle postMessage commands to YouTube IFrame
  const sendIframeCommand = (command, args = '') => {
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func: command,
            args: args ? [args] : []
          }),
          '*'
        );
      }
    } catch (e) {
      console.warn('Iframe command warning:', e);
    }
  };

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

  const handlePlayVideo = (track) => {
    setCurrentTrack(track);
    setActiveVideoId(track.id);
    setIsPlaying(true);
    setUrlError('');
  };

  const handleStopAndDismiss = () => {
    sendIframeCommand('pauseVideo');
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
        setSearchError('មិនមានលទ្ធផលសម្រាប់ "' + q + '" ទេ សូមសាកល្បងពាក្យគន្លឹះផ្សេង។');
      }
    } catch (err) {
      console.error('YouTube search error:', err);
      setSearchError('បណ្តាញមានបញ្ហាក្នុងការស្វែងរក សូមសាកល្បងម្តងទៀត។');
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    executeSearch();
  };

  const handleQuickTagClick = (tag) => {
    setSearchQuery(tag.query);
    setActiveTab('search');
    executeSearch(tag.query);
  };

  // Handle direct custom URL paste
  const handleLoadCustomUrl = (e) => {
    if (e) e.preventDefault();
    setUrlError('');

    const id = extractYouTubeId(customUrl);
    if (!id) {
      setUrlError('សូមបញ្ចូលតំណភ្ជាប់ YouTube ឱ្យបានត្រឹមត្រូវ (ឧ. https://www.youtube.com/watch?v=...)');
      return;
    }

    const newTrack = {
      id,
      title: customUrl.length > 45 ? customUrl.slice(0, 42) + '...' : customUrl,
      channel: 'YouTube Video',
      duration: 'Custom',
      thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      category: 'User Custom'
    };

    handlePlayVideo(newTrack);
    setCustomUrl('');
  };

  // Construct iframe embed URL
  const embedUrl = `https://www.youtube.com/embed/${activeVideoId}?enablejsapi=1&autoplay=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}&rel=0&iv_load_policy=3&modestbranding=1`;

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. PERSISTENT YOUTUBE IFRAME (NEVER UNMOUNTED - AUDIO KEEPS PLAYING!)     */}
      {/* ========================================================================= */}
      <div 
        className="fixed bottom-0 right-0 w-1 h-1 opacity-0 pointer-events-none z-[1]"
        style={{ display: 'block' }}
        aria-hidden="true"
      >
        <iframe
          ref={iframeRef}
          key={activeVideoId}
          src={embedUrl}
          title="Persistent YouTube Background Audio Player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>

      {/* ========================================================================= */}
      {/* 2. FLOATING MINI MUSIC DOCK (Appears when Modal is Closed BUT playing)   */}
      {/* ========================================================================= */}
      {!isOpen && isPlaying && (
        <div className="fixed bottom-20 md:bottom-6 right-3 sm:right-6 z-[9995] animate-fadeIn font-kantumruy select-none">
          <div className="flex items-center gap-3 bg-slate-950/95 backdrop-blur-xl border border-red-500/40 text-white p-2 sm:p-2.5 pl-3 rounded-2xl shadow-[0_12px_45px_rgba(0,0,0,0.8)] hover:border-red-500/70 transition-all max-w-[92vw] sm:max-w-md ring-1 ring-red-500/20">
            
            {/* Spinning Vinyl / Music Disc */}
            <div 
              onClick={() => onClose && onClose(true)} 
              className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden cursor-pointer flex-shrink-0 group shadow-md"
              title="ចុចដើម្បីបើកផ្ទាំងស្វែងរក និងចាក់ចម្រៀងធំឡើងវិញ (Open YouTube Player)"
            >
              <img 
                src={currentTrack.thumbnail || `https://i.ytimg.com/vi/${activeVideoId}/hqdefault.jpg`} 
                alt={currentTrack.title}
                className={`w-full h-full object-cover group-hover:scale-110 transition-transform ${isPlaying ? 'animate-spin-slow' : ''}`}
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80'; }}
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4 text-white" />
              </div>
              
              {/* Pulsing red live dot */}
              <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-slate-950 animate-pulse" />
            </div>

            {/* Track Information */}
            <div 
              onClick={() => onClose && onClose(true)}
              className="min-w-0 flex-1 cursor-pointer"
              title="ចុចដើម្បីបើកផ្ទាំងធំ (Expand to search songs)"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-red-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  YouTube Music
                </span>
                {currentTrack.duration && (
                  <span className="text-[10px] text-slate-400 truncate">• {currentTrack.duration}</span>
                )}
              </div>
              <h4 className="text-xs sm:text-[13px] font-bold text-white truncate max-w-[140px] sm:max-w-[200px]">
                {currentTrack.title}
              </h4>
              <p className="text-[10px] text-slate-400 truncate max-w-[140px] sm:max-w-[200px]">
                {currentTrack.channel || 'YouTube'}
              </p>
            </div>

            {/* Quick Controls */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Play / Pause */}
              <button
                type="button"
                onClick={handleTogglePlay}
                className="w-8 h-8 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center cursor-pointer transition-transform active:scale-95 shadow-xs"
                title={isPlaying ? "ផ្អាក (Pause)" : "បន្តចាក់ (Play)"}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
              </button>

              {/* Mute / Unmute */}
              <button
                type="button"
                onClick={handleToggleMute}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                title={isMuted ? "បើកសំឡេង (Unmute)" : "បិទសំឡេង (Mute)"}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-slate-200" />}
              </button>

              {/* Expand to Search / Full Modal */}
              <button
                type="button"
                onClick={() => onClose && onClose(true)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                title="ស្វែងរកបទផ្សេងទៀត (Search more songs)"
              >
                <Search className="w-3.5 h-3.5 text-slate-200" />
              </button>

              {/* Stop & Dismiss Completely */}
              <button
                type="button"
                onClick={handleStopAndDismiss}
                className="w-8 h-8 rounded-xl hover:bg-red-500/20 text-slate-400 hover:text-red-400 flex items-center justify-center cursor-pointer transition-colors"
                title="បិទតន្ត្រីទាំងស្រុង (Stop & Close)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. FULL INTERACTIVE YOUTUBE SEARCH & STUDY PLAYER MODAL                   */}
      {/* ========================================================================= */}
      {isOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn font-kantumruy select-none">
          <div className="relative bg-[#0b1120] border border-slate-800 rounded-3xl shadow-[0_25px_90px_rgba(0,0,0,0.85)] max-w-4xl w-full max-h-[94vh] flex flex-col overflow-hidden my-auto text-white ring-1 ring-white/10">
            
            {/* Header */}
            <div className="px-4 sm:px-6 py-3.5 bg-gradient-to-r from-red-950/90 via-slate-900 to-[#0b1120] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-[0_0_25px_rgba(239,68,68,0.6)]">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base md:text-lg font-extrabold text-white flex items-center gap-2">
                      <span>YouTube សិក្សា & ស្វែងរកបទចម្រៀង</span>
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 font-bold uppercase tracking-wider font-sans">
                      Live Search
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                    <Headphones className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ស្វែងរកបទចម្រៀងដែលប្អូនចង់ស្តាប់ពេលរៀន • បិទផ្ទាំងតន្ត្រីនៅតែបន្តចាក់</span>
                  </p>
                </div>
              </div>

              {/* Top Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowVideo(!showVideo)}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                    showVideo 
                      ? 'bg-white/10 text-white border-white/15' 
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}
                  title={showVideo ? "លាក់វីដេអូ / ស្តាប់តែសំឡេង (Audio Only)" : "បង្ហាញវីដេអូ (Show Video)"}
                >
                  {showVideo ? <Eye className="w-3.5 h-3.5 text-slate-300" /> : <EyeOff className="w-3.5 h-3.5 text-emerald-400" />}
                  <span className="hidden sm:inline">{showVideo ? 'វីដេអូ' : 'សន្សំថ្ម (Audio)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onClose && onClose(false)}
                  className="w-9 h-9 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                  title="បិទផ្ទាំង (តន្ត្រីនៅតែបន្តចាក់ក្នុងប្រព័ន្ធ)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
              
              {/* Background Music Notice Banner */}
              <div className="p-3 bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/60 border border-blue-500/30 rounded-2xl flex items-center gap-3 text-xs text-blue-200 shadow-sm">
                <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 animate-pulse" />
                <span className="leading-relaxed">
                  💡 <strong>គន្លឹះពិសេស៖</strong> នៅពេលប្អូនបិទផ្ទាំងនេះ (ចុចសញ្ញា X) <strong>តន្ត្រីនៅតែបន្តចាក់ក្នុងប្រព័ន្ធដដែល</strong> ដើម្បីឱ្យប្អូនអាចអានសៀវភៅ ឬធ្វើលំហាត់ដោយគ្មានការរំខាន!
                </span>
              </div>

              {/* ========================================================================= */}
              {/* 🌟 SEARCH BAR SUITE (PRIMARY USER FEATURE)                               */}
              {/* ========================================================================= */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="ស្វែងរកបទចម្រៀង ឬតារាចម្រៀង (ឧ. VannDa, ដួង វីរៈសិទ្ធ, Taylor Swift, Lofi, បទចម្រៀងរៀន...)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-9 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 shadow-inner font-kantumruy"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 sm:top-3.5 pointer-events-none" />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="p-1 rounded-lg text-slate-400 hover:text-white absolute right-2.5 top-2.5 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-red-600/30 transition-transform active:scale-95 cursor-pointer disabled:cursor-not-allowed flex-shrink-0"
                  >
                    {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    <span>{isSearching ? 'កំពុងស្វែងរក...' : 'ស្វែងរក'}</span>
                  </button>
                </form>

                {/* Quick Suggestion Chips */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mr-1">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>ពេញនិយម៖</span>
                  </span>
                  {POPULAR_SEARCH_TAGS.map((tag) => (
                    <button
                      key={tag.label}
                      type="button"
                      onClick={() => handleQuickTagClick(tag)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-red-600/20 hover:border-red-500/40 border border-white/10 text-[11px] font-medium text-slate-300 hover:text-white transition-all cursor-pointer active:scale-95"
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ========================================================================= */}
              {/* ACTIVE PLAYER BAR & SCREEN (CURRENT PLAYING TRACK)                        */}
              {/* ========================================================================= */}
              <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-3 sm:p-4 space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  
                  {/* Current Song Display */}
                  <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden relative flex-shrink-0 bg-black shadow-md border border-white/10">
                      <img 
                        src={currentTrack.thumbnail || `https://i.ytimg.com/vi/${activeVideoId}/hqdefault.jpg`} 
                        alt={currentTrack.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80'; }}
                      />
                      {isPlaying && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-black uppercase text-red-400 bg-red-500/20 border border-red-500/30 px-1.5 py-0.2 rounded-md">
                          កំពុងចាក់
                        </span>
                        {currentTrack.duration && (
                          <span className="text-[10px] text-slate-400">{currentTrack.duration}</span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate max-w-[260px] sm:max-w-md">
                        {currentTrack.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate">
                        {currentTrack.channel || 'YouTube Channel'}
                      </p>
                    </div>
                  </div>

                  {/* Player Controls */}
                  <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
                    {/* Play / Pause Toggle */}
                    <button
                      type="button"
                      onClick={handleTogglePlay}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-red-600/30 transition-transform active:scale-95"
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                      <span>{isPlaying ? 'ផ្អាក (Pause)' : 'ចាក់ (Play)'}</span>
                    </button>

                    {/* Mute toggle */}
                    <button
                      type="button"
                      onClick={handleToggleMute}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors flex items-center gap-1 text-xs"
                      title={isMuted ? "បើកសំឡេង" : "បិទសំឡេង"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                    </button>

                    {/* Stop button */}
                    <button
                      type="button"
                      onClick={handleStopAndDismiss}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-700 text-xs font-bold transition-colors cursor-pointer"
                      title="បញ្ឈប់តន្ត្រីទាំងស្រុង"
                    >
                      បញ្ឈប់
                    </button>
                  </div>

                </div>

                {/* Optional Video Screen or Audio Visualizer Screen */}
                {showVideo ? (
                  <div className="relative w-full aspect-video max-h-[300px] rounded-xl overflow-hidden bg-black border border-white/10 shadow-lg">
                    <iframe
                      src={embedUrl}
                      title={currentTrack.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  </div>
                ) : (
                  <div className="w-full py-6 rounded-xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-white/10 flex flex-col items-center justify-center text-center space-y-2 relative overflow-hidden">
                    <div className="flex items-center justify-center gap-1">
                      {[0.2, 0.5, 0.8, 1, 0.6, 0.9, 0.4, 0.7, 0.5, 0.3].map((h, i) => (
                        <span 
                          key={i} 
                          className="w-1 bg-gradient-to-t from-red-600 to-amber-400 rounded-full animate-pulse"
                          style={{ height: `${h * 24}px`, animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-emerald-300">
                      ⚡ របៀបសន្សំថ្ម & ស្តាប់តែសំឡេង (Audio Only Mode)
                    </span>
                  </div>
                )}
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('search')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'search'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>លទ្ធផលស្វែងរក ({searchResults.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('curated')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'curated'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>ស្ថានីយគំរូ (Curated Stations)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('url')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'url'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>ដាក់តំណភ្ជាប់ (Paste URL)</span>
                </button>
              </div>

              {/* ========================================================================= */}
              {/* TAB 1: LIVE SEARCH RESULTS                                                */}
              {/* ========================================================================= */}
              {activeTab === 'search' && (
                <div className="space-y-3">
                  {isSearching ? (
                    <div className="py-12 text-center space-y-3">
                      <Loader2 className="w-8 h-8 text-red-500 animate-spin mx-auto" />
                      <p className="text-xs text-slate-400">កំពុងស្វែងរកបទចម្រៀងលើ YouTube ជូនប្អូន...</p>
                    </div>
                  ) : searchError ? (
                    <div className="p-6 bg-red-950/20 border border-red-500/30 rounded-2xl text-center space-y-2">
                      <AlertCircle className="w-6 h-6 text-red-400 mx-auto" />
                      <p className="text-xs text-red-300">{searchError}</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                      {searchResults.map((track) => {
                        const isCurrent = activeVideoId === track.id;
                        return (
                          <div
                            key={track.id}
                            onClick={() => handlePlayVideo(track)}
                            className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 group relative overflow-hidden ${
                              isCurrent
                                ? 'bg-red-950/40 border-red-500/60 ring-2 ring-red-500/30 shadow-md'
                                : 'bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/8'
                            }`}
                          >
                            {/* Thumbnail */}
                            <div className="w-16 h-14 rounded-xl overflow-hidden relative flex-shrink-0 shadow-md bg-black">
                              <img 
                                src={track.thumbnail} 
                                alt={track.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                onError={(e) => { e.target.src = `https://i.ytimg.com/vi/${track.id}/hqdefault.jpg`; }}
                              />
                              {track.duration && (
                                <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-bold px-1 rounded">
                                  {track.duration}
                                </span>
                              )}
                              <div className={`absolute inset-0 bg-black/40 flex items-center justify-center ${isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                                {isCurrent && isPlaying ? (
                                  <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                                ) : (
                                  <Play className="w-4 h-4 fill-white text-white" />
                                )}
                              </div>
                            </div>

                            {/* Details */}
                            <div className="min-w-0 flex-1">
                              <h5 className="text-xs font-bold text-white line-clamp-2 group-hover:text-red-300 transition-colors leading-snug">
                                {track.title}
                              </h5>
                              <p className="text-[10px] text-slate-400 truncate mt-1 flex items-center gap-1">
                                <span>{track.channel || 'YouTube'}</span>
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 2: CURATED STUDY STATIONS                                             */}
              {/* ========================================================================= */}
              {activeTab === 'curated' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {DEFAULT_STUDY_TRACKS.map((track) => {
                    const isCurrent = activeVideoId === track.id;
                    return (
                      <div
                        key={track.id}
                        onClick={() => handlePlayVideo(track)}
                        className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 group relative overflow-hidden ${
                          isCurrent
                            ? 'bg-red-950/40 border-red-500/60 ring-2 ring-red-500/30'
                            : 'bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/8'
                        }`}
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden relative flex-shrink-0 shadow-md">
                          <img 
                            src={track.thumbnail} 
                            alt={track.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center ${isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                            {isCurrent && isPlaying ? (
                              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                            ) : (
                              <Play className="w-4 h-4 fill-white text-white" />
                            )}
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-white/10 text-red-300 font-bold mb-1 inline-block">
                            {track.category}
                          </span>
                          <h5 className="text-xs font-bold text-white truncate group-hover:text-red-300 transition-colors">
                            {track.title}
                          </h5>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            {track.channel}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 3: CUSTOM URL PASTE                                                  */}
              {/* ========================================================================= */}
              {activeTab === 'url' && (
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">
                      បិទភ្ជាប់តំណ YouTube ណាមួយដែលប្អូនចូលចិត្ត
                    </h4>
                    <p className="text-xs text-slate-400">
                      ប្អូនអាចដាក់តំណភ្ជាប់បទចម្រៀង ឬបញ្ជីចាក់ (Playlist) ពី YouTube ដូចជា acoustic, podcast ឬវីដេអូបង្រៀនបានទាំងអស់!
                    </p>
                  </div>

                  <form onSubmit={handleLoadCustomUrl} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="ឧទាហរណ៍៖ https://www.youtube.com/watch?v=..."
                        value={customUrl}
                        onChange={(e) => {
                          setCustomUrl(e.target.value);
                          setUrlError('');
                        }}
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 font-mono"
                      />
                      <button
                        type="submit"
                        disabled={!customUrl.trim()}
                        className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-transform active:scale-95 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>ចាក់បទនេះ</span>
                      </button>
                    </div>

                    {urlError && (
                      <p className="text-xs text-rose-400 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{urlError}</span>
                      </p>
                    )}
                  </form>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-slate-950/80 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2 truncate max-w-[60%]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                <span className="text-slate-300 font-medium truncate">កំពុងចាក់៖ <strong>{currentTrack.title}</strong></span>
              </div>
              <button
                type="button"
                onClick={() => onClose && onClose(false)}
                className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors cursor-pointer flex-shrink-0"
              >
                បិទផ្ទាំង (តន្ត្រីនៅតែបន្តចាក់)
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}
    </>
  );
}
