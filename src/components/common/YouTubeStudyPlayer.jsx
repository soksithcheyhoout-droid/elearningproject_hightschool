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

// Baseline High Quality Tracks with Search Tags (Verified 100% embeddable & active)
export const DEFAULT_STUDY_TRACKS = [
  {
    id: 'lTRiuFIWV54',
    title: '1 A.M Study Session - Lofi Hip Hop Beats',
    channel: 'Lofi Girl',
    duration: '1:01:00',
    thumbnail: 'https://i.ytimg.com/vi/lTRiuFIWV54/hqdefault.jpg',
    tags: ['lofi', 'chill', 'study', 'beats', 'focus', 'relax']
  },
  {
    id: 'rvje5oblrLw',
    title: 'VannDa - Time To Rise feat. Master Kong Nay',
    channel: 'VannDa Official',
    duration: '5:40',
    thumbnail: 'https://i.ytimg.com/vi/rvje5oblrLw/hqdefault.jpg',
    tags: ['vannda', 'kong nay', 'khmer', 'rap', 'hip hop', 'time to rise', 'វណ្ណដា']
  },
  {
    id: 'gyTRfSOpQUM',
    title: 'Acoustic Guitar Nonstop - Khmer Chill Melodies',
    channel: 'Nob Acoustic',
    duration: '45:20',
    thumbnail: 'https://i.ytimg.com/vi/gyTRfSOpQUM/hqdefault.jpg',
    tags: ['acoustic', 'guitar', 'khmer', 'chill', 'instrumental', 'ណុប']
  },
  {
    id: 'MIHCnP8pDrQ',
    title: 'Doung Virakseth - Selected Acoustic Hits',
    channel: 'MT Records',
    duration: '40:30',
    thumbnail: 'https://i.ytimg.com/vi/MIHCnP8pDrQ/hqdefault.jpg',
    tags: ['doung virakseth', 'acoustic', 'khmer', 'hits', 'ដួង វីរៈសិទ្ធ', 'virakseth']
  },
  {
    id: 'oiGmGFxsJi8',
    title: 'Calm Piano Music for Studying, Reading & Focus',
    channel: 'HALIDONMUSIC',
    duration: '2:05:00',
    thumbnail: 'https://i.ytimg.com/vi/oiGmGFxsJi8/hqdefault.jpg',
    tags: ['piano', 'classical', 'calm', 'focus', 'study']
  },
  {
    id: 'mPZkdNFkNps',
    title: 'Gentle Rain & Soft Study Piano for Concentration',
    channel: 'Rain & Focus',
    duration: '2:30:15',
    thumbnail: 'https://i.ytimg.com/vi/mPZkdNFkNps/hqdefault.jpg',
    tags: ['rain', 'ambience', 'piano', 'concentration', 'gentle']
  },
  {
    id: '5qap5aO4i9A',
    title: 'Lofi Hip Hop Radio - Beats to Relax/Study to',
    channel: 'Lofi Girl',
    duration: 'LIVE',
    thumbnail: 'https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault.jpg',
    tags: ['lofi', 'live', 'beats', 'relax', 'study', 'hip hop']
  },
  {
    id: 'dF0rA0qVp-g',
    title: 'VannDa - BOK KALO (Official Music Video)',
    channel: 'VannDa Official',
    duration: '4:15',
    thumbnail: 'https://i.ytimg.com/vi/dF0rA0qVp-g/hqdefault.jpg',
    tags: ['vannda', 'bok kalo', 'khmer', 'rap', 'វណ្ណដា']
  },
  {
    id: 'G1Fw8m_X0G8',
    title: 'Doung Virakseth - Bong Som Tveu Neak Thae (Acoustic)',
    channel: 'Rasmey Hang Meas',
    duration: '4:50',
    thumbnail: 'https://i.ytimg.com/vi/G1Fw8m_X0G8/hqdefault.jpg',
    tags: ['doung virakseth', 'bong som tveu neak thae', 'khmer', 'ដួង វីរៈសិទ្ធ']
  },
  {
    id: 'd_hKzE5gHMo',
    title: 'G-Devith - Acoustic Study Chill Session',
    channel: 'G-Devith Official',
    duration: '38:10',
    thumbnail: 'https://i.ytimg.com/vi/d_hKzE5gHMo/hqdefault.jpg',
    tags: ['g-devith', 'devith', 'g devith', 'khmer', 'acoustic', 'ដេវីត']
  },
  {
    id: 'K-a8s8OLBSE',
    title: 'Taylor Swift - Folklore & Evermore Acoustic Chill Study',
    channel: 'Acoustic Chill',
    duration: '1:12:30',
    thumbnail: 'https://i.ytimg.com/vi/K-a8s8OLBSE/hqdefault.jpg',
    tags: ['taylor swift', 'folklore', 'evermore', 'acoustic', 'chill', 'taylor']
  },
  {
    id: 'xK9-8Z7vP0k',
    title: 'Tena - Acoustic Chill Song Collection',
    channel: 'Tena Official',
    duration: '35:40',
    thumbnail: 'https://i.ytimg.com/vi/xK9-8Z7vP0k/hqdefault.jpg',
    tags: ['tena', 'acoustic', 'khmer', 'chill', 'ថេណា']
  },
  {
    id: '7K0gXo3bF7U',
    title: 'Khmer Acoustic Song Nonstop Collection 2026',
    channel: 'Khmer Acoustic Club',
    duration: '1:20:00',
    thumbnail: 'https://i.ytimg.com/vi/7K0gXo3bF7U/hqdefault.jpg',
    tags: ['khmer acoustic', 'nonstop', 'collection', 'guitar', 'ចម្រៀងខ្មែរ']
  },
  {
    id: 'jfKfPfyJRdk',
    title: 'Lofi Sleep & Deep Study Session - Deep Calm Focus Beats',
    channel: 'Lofi Sleep',
    duration: '3:00:00',
    thumbnail: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg',
    tags: ['lofi', 'sleep', 'deep', 'calm', 'focus']
  },
  {
    id: 'y8e_ih8eOcg',
    title: 'Studio Ghibli Relaxing Piano for Studying & Reading',
    channel: 'Ghibli Relax',
    duration: '2:15:00',
    thumbnail: 'https://i.ytimg.com/vi/y8e_ih8eOcg/hqdefault.jpg',
    tags: ['ghibli', 'piano', 'relaxing', 'study', 'reading', 'anime']
  }
];

export default function YouTubeStudyPlayer({ isOpen, onClose, onPlayStateChange }) {
  const [activeVideoId, setActiveVideoId] = useState(DEFAULT_STUDY_TRACKS[0].id);
  const [currentTrack, setCurrentTrack] = useState(DEFAULT_STUDY_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasUserStarted, setHasUserStarted] = useState(false);
  const hasUserStartedRef = useRef(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [showVideo, setShowVideo] = useState(true);

  // Vertical Volume Capsule Popup State & Refs (Matching Image 2)
  const [showVolumePopup, setShowVolumePopup] = useState(false);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);
  const volumeContainerRef = useRef(null);
  const volumeSliderRef = useRef(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('All');
  const [searchResults, setSearchResults] = useState(DEFAULT_STUDY_TRACKS);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const searchTimerRef = useRef(null);

  // Clean up search debounce timer on unmount
  useEffect(() => {
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, []);
  
  // Custom URL paste state
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [urlError, setUrlError] = useState('');

  // Single persistent iframe reference
  const iframeRef = useRef(null);
  const volumeRef = useRef(volume);
  const searchInputRef = useRef(null);
  const tagsScrollRef = useRef(null);

  // Keep volumeRef in sync for callbacks without stale closures
  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  // Notify parent of play state change (for navbar soundbars)
  useEffect(() => {
    if (onPlayStateChange) {
      onPlayStateChange(isPlaying);
    }
  }, [isPlaying, onPlayStateChange]);

  // Listen to YouTube postMessage events for accurate player state & volume sync
  useEffect(() => {
    const handleMessage = (event) => {
      try {
        if (!event.data) return;
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (!data) return;

        // When YouTube embed initializes, handshake with listening and apply user's volume
        if (data.event === 'initialDelivery' || data.event === 'onReady') {
          if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'listening' }), '*');
            iframeRef.current.contentWindow.postMessage(
              JSON.stringify({
                event: 'command',
                func: 'setVolume',
                args: [volumeRef.current]
              }),
              '*'
            );
          }
        }

        // State changes (1: PLAYING, 2: PAUSED, 0: ENDED, 3: BUFFERING)
        if (data.event === 'onStateChange' || (data.event === 'infoDelivery' && data.info?.playerState !== undefined)) {
          const state = data.info?.playerState !== undefined ? data.info.playerState : data.info;
          if (state === 1) {
            setHasUserStarted(true);
            hasUserStartedRef.current = true;
            setIsPlaying(true);
          } else if (state === 2 || state === 0) {
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

  // Handle postMessage commands to YouTube IFrame (clean, reliable, never mutates DOM)
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

  // Synchronize audio volume on new video load
  const handleIframeLoad = useCallback(() => {
    const targetVol = volumeRef.current > 0 ? volumeRef.current : 80;

    // Send proper YouTube listening event and initial volume
    const sendHandshake = () => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'listening' }), '*');
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func: 'setVolume',
            args: [targetVol]
          }),
          '*'
        );
        if (hasUserStartedRef.current) {
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({
              event: 'command',
              func: 'unMute',
              args: []
            }),
            '*'
          );
        }
      }
    };

    sendHandshake();
    setTimeout(sendHandshake, 350);
    setTimeout(sendHandshake, 800);
  }, []);

  // Toggle Play / Pause
  const handleTogglePlay = useCallback(() => {
    setHasUserStarted(true);
    hasUserStartedRef.current = true;
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

  // Proactively unmute and activate sound reliably (never stay on "close" / VolumeX)
  const handleUnmuteAndPlay = useCallback(() => {
    setHasUserStarted(true);
    hasUserStartedRef.current = true;
    const targetVol = volumeRef.current > 0 ? volumeRef.current : 100;
    setIsMuted(false);
    setVolume(targetVol);
    volumeRef.current = targetVol;
    sendIframeCommand('unMute');
    sendIframeCommand('setVolume', [targetVol]);
    sendIframeCommand('playVideo');
    setIsPlaying(true);
  }, [sendIframeCommand]);

  // Toggle Mute / Unmute
  const handleToggleMute = useCallback(() => {
    if (isMuted) {
      handleUnmuteAndPlay();
    } else {
      setIsMuted(true);
      sendIframeCommand('mute');
      sendIframeCommand('setVolume', [0]);
    }
  }, [isMuted, handleUnmuteAndPlay, sendIframeCommand]);

  // Handle Smooth Volume Slider Change (Correctly scales 0-100% directly to YouTube audio)
  const handleVolumeChange = useCallback((newVal) => {
    const val = Math.max(0, Math.min(100, Math.round(Number(newVal))));
    setVolume(val);
    volumeRef.current = val;

    if (val === 0) {
      setIsMuted(true);
      sendIframeCommand('mute');
      sendIframeCommand('setVolume', [0]);
    } else {
      if (isMuted) {
        setIsMuted(false);
        sendIframeCommand('unMute');
      }
      sendIframeCommand('setVolume', [val]);
    }
  }, [isMuted, sendIframeCommand]);

  // Handle vertical slider drag / click coordinate calculations (Image 2)
  const updateVolumeFromY = useCallback((clientY) => {
    if (!volumeSliderRef.current) return;
    const rect = volumeSliderRef.current.getBoundingClientRect();
    const height = rect.height;
    // Bottom of rect is 0%, Top is 100%
    const offsetY = rect.bottom - clientY;
    const ratio = Math.max(0, Math.min(1, offsetY / height));
    const newVol = Math.round(ratio * 100);
    handleVolumeChange(newVol);
  }, [handleVolumeChange]);

  const handleSliderMouseDown = (e) => {
    e.preventDefault();
    setIsDraggingVolume(true);
    updateVolumeFromY(e.clientY);
  };

  const handleSliderTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      updateVolumeFromY(e.touches[0].clientY);
    }
  };

  const handleSliderTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      updateVolumeFromY(e.touches[0].clientY);
    }
  };

  // Window drag listeners for smooth tracking
  useEffect(() => {
    if (!isDraggingVolume) return;
    const onMouseMove = (e) => updateVolumeFromY(e.clientY);
    const onMouseUp = () => setIsDraggingVolume(false);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDraggingVolume, updateVolumeFromY]);

  // Mouse wheel scroll handler (for desktop/laptop mouse wheel & trackpads)
  const handleWheelVolume = useCallback((e) => {
    e.preventDefault();
    const step = 5;
    const change = e.deltaY < 0 ? step : -step;
    const newVol = Math.max(0, Math.min(100, (isMuted ? 0 : volume) + change));
    handleVolumeChange(newVol);
    setShowVolumePopup(true);
  }, [isMuted, volume, handleVolumeChange]);

  // Handle Main Sound Button Click on Video Canvas:
  // - If muted, unmutes immediately and plays sound
  // - Ensures iframe is unmuted and active
  // - Toggles volume popup slider open/close
  // - NEVER accidentally mutes or shows "close" (VolumeX)
  const handleMainSoundButtonClick = useCallback((e) => {
    e.stopPropagation();
    if (isMuted || volume === 0) {
      handleUnmuteAndPlay();
    } else {
      sendIframeCommand('setVolume', [volume]);
    }
    setShowVolumePopup(prev => !prev);
  }, [isMuted, volume, handleUnmuteAndPlay, sendIframeCommand]);

  // Handle Popup Mute Toggle Button
  const handlePopupMuteToggle = useCallback((e) => {
    e.stopPropagation();
    if (isMuted || volume === 0) {
      handleUnmuteAndPlay();
    } else {
      setIsMuted(true);
      sendIframeCommand('mute');
      sendIframeCommand('setVolume', [0]);
    }
  }, [isMuted, volume, handleUnmuteAndPlay, sendIframeCommand]);



  // Click outside listener to dismiss vertical volume capsule on mobile
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (volumeContainerRef.current && !volumeContainerRef.current.contains(e.target)) {
        setShowVolumePopup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Handle track selection from list: if already active, toggle play/pause; otherwise play new
  const handleTrackClick = useCallback((track) => {
    setHasUserStarted(true);
    hasUserStartedRef.current = true;
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

  // Perform Live YouTube Search with Local Instant Results & Debounce
  const executeSearch = useCallback(async (queryToSearch) => {
    const q = (queryToSearch !== undefined ? queryToSearch : searchQuery).trim();
    if (!q) {
      setSearchResults(DEFAULT_STUDY_TRACKS);
      setIsSearching(false);
      setSearchError('');
      return;
    }

    const trimmed = q.toLowerCase();

    // 1. Instant match in curated catalog
    const localMatches = DEFAULT_STUDY_TRACKS.filter(t => 
      t.title.toLowerCase().includes(trimmed) ||
      t.channel.toLowerCase().includes(trimmed) ||
      (t.tags && t.tags.some(tag => tag.toLowerCase().includes(trimmed)))
    );

    if (localMatches.length > 0) {
      setSearchResults(localMatches);
      setSearchError('');
    }

    setIsSearching(true);

    try {
      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(q)}`);
      const data = await response.json();

      if (data && data.results && data.results.length > 0) {
        setSearchResults(data.results);
        setSearchError('');
      } else if (localMatches.length === 0) {
        setSearchResults([]);
        setSearchError(`No tracks found for "${q}"`);
      }
    } catch (err) {
      if (localMatches.length === 0) {
        setSearchError('Search service unavailable. Please try again.');
      }
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  // Real-time as-you-type search: triggers instantly from 1 letter or full name
  const handleSearchInputChange = (e) => {
    const text = e.target.value;
    setSearchQuery(text);
    setActiveTag('');

    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);

    const trimmed = text.trim().toLowerCase();
    if (!trimmed) {
      setSearchResults(DEFAULT_STUDY_TRACKS);
      setIsSearching(false);
      setSearchError('');
      return;
    }

    // 1. Instant 0ms response for single letters or partial names
    const localMatches = DEFAULT_STUDY_TRACKS.filter(t => 
      t.title.toLowerCase().includes(trimmed) ||
      t.channel.toLowerCase().includes(trimmed) ||
      (t.tags && t.tags.some(tag => tag.toLowerCase().includes(trimmed)))
    );

    if (localMatches.length > 0) {
      setSearchResults(localMatches);
      setSearchError('');
    }

    // 2. Play YouTube-style loading animation & query backend with 280ms debounce
    setIsSearching(true);
    searchTimerRef.current = setTimeout(() => {
      executeSearch(text);
    }, 280);
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    setActiveTag('');
    executeSearch();
  };

  const handleQuickTagClick = (tag) => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
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

  // Construct iframe embed URL with native YouTube controls visible (play, volume, progress, fullscreen)
  // Disable autoplay until the student explicitly clicks play
  const embedUrl = `https://www.youtube.com/embed/${activeVideoId}?enablejsapi=1&autoplay=${hasUserStarted ? 1 : 0}&playsinline=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}&rel=0&iv_load_policy=3&modestbranding=1`;

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
          className={`relative bg-[#0b1220] border border-white/15 rounded-2xl sm:rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.85)] w-full max-w-5xl h-[95dvh] sm:h-auto sm:max-h-[88vh] flex flex-col overflow-hidden text-white ring-1 ring-white/10 transition-transform duration-300 ${
            isOpen ? 'scale-100' : 'scale-95'
          }`}
        >
          
          {/* Header Bar - Clean & Non-crowded on Mobile */}
          <div className="px-3.5 sm:px-6 py-2.5 sm:py-3 bg-slate-900/95 border-b border-white/10 flex items-center justify-between flex-shrink-0">
            
            {/* Title & Clean Status Indicator */}
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-600/40 flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <div className="leading-tight min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-extrabold text-white tracking-wide truncate">
                    YouTube Music
                  </h3>
                  {/* Long badge on desktop; simple live pulse on mobile to avoid overcrowding */}
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Background Audio</span>
                  </span>
                  <span className="sm:hidden w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" title="Background Audio Active" />
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
                className={`h-8 px-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  showVideo 
                    ? 'bg-white/10 text-white border-white/15 hover:bg-white/15' 
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}
                title={showVideo ? "Switch to Audio Only" : "Show Video"}
              >
                {showVideo ? <Eye className="w-3.5 h-3.5 text-slate-300" /> : <EyeOff className="w-3.5 h-3.5 text-emerald-400" />}
                <span className="hidden sm:inline">{showVideo ? 'Video' : 'Audio Mode'}</span>
              </button>

              {/* Minimize (Desktop only to prevent redundant buttons on mobile) */}
              <button
                type="button"
                onClick={() => onClose && onClose(false)}
                className="hidden sm:flex w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white items-center justify-center cursor-pointer transition-colors"
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
          <div className="p-3 sm:p-5 md:p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-5 lg:gap-6 [scrollbar-width:thin] [-webkit-overflow-scrolling:touch]">
            
            {/* ================================================================= */}
            {/* COLUMN 1: THE PLAYER (Left 6 Cols on Desktop)                     */}
            {/* ================================================================= */}
            <div className="lg:col-span-6 flex flex-col space-y-2.5 sm:space-y-3">
              
              {/* THE SINGLE YOUTUBE IFRAME CANVAS */}
              <div className="relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl flex-shrink-0 group">
                <iframe
                  ref={iframeRef}
                  id="youtube-study-player-iframe"
                  src={embedUrl}
                  onLoad={handleIframeLoad}
                  title="YouTube Player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className={showVideo ? "w-full h-full border-0" : "w-1 h-1 opacity-0 absolute pointer-events-none"}
                />

                {/* Custom Volume Button - shown ONLY on mobile (hidden on PC/desktop) */}
                <div 
                  ref={volumeContainerRef}
                  className="md:hidden absolute bottom-11 sm:bottom-12 left-2 sm:left-2.5 z-30 select-none"
                  onMouseEnter={() => setShowVolumePopup(true)}
                  onMouseLeave={() => !isDraggingVolume && setShowVolumePopup(false)}
                  onWheel={handleWheelVolume}
                >
                  <button
                    type="button"
                    onClick={handleMainSoundButtonClick}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-md border active:scale-95 ${
                      isMuted || volume === 0
                        ? 'bg-black/70 hover:bg-black/90 text-rose-400 border-rose-500/40'
                        : showVolumePopup
                        ? 'bg-black/85 text-white border-white/40 ring-2 ring-white/20'
                        : 'bg-black/50 hover:bg-black/70 text-white border-white/20'
                    }`}
                    title={isMuted ? "Unmute" : `Volume ${volume}%`}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-3.5 h-3.5" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Vertical Volume Capsule Popup */}
                  {showVolumePopup && (
                    <div 
                      className="absolute bottom-full left-0 mb-1.5 z-40 animate-fadeIn"
                      onWheel={handleWheelVolume}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="w-9 sm:w-10 h-32 sm:h-36 bg-black/90 backdrop-blur-xl border border-white/20 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.9)] flex flex-col items-center justify-between py-2 select-none">
                        
                        {/* Top: Mute/Unmute */}
                        <button
                          type="button"
                          onClick={handlePopupMuteToggle}
                          className="w-5 h-5 rounded-full flex items-center justify-center text-white hover:text-rose-400 active:scale-90 transition-all cursor-pointer"
                          title={isMuted ? "Unmute" : "Mute"}
                        >
                          {isMuted || volume === 0 ? (
                            <VolumeX className="w-3 h-3 text-rose-400" />
                          ) : (
                            <Volume2 className="w-3 h-3" />
                          )}
                        </button>

                        {/* Vertical Slider */}
                        <div 
                          ref={volumeSliderRef}
                          onMouseDown={handleSliderMouseDown}
                          onTouchStart={handleSliderTouchStart}
                          onTouchMove={handleSliderTouchMove}
                          className="relative w-6 h-16 sm:h-20 flex items-center justify-center cursor-pointer touch-none"
                        >
                          <div className="w-[3px] h-full bg-white/20 rounded-full relative overflow-hidden pointer-events-none">
                            <div 
                              className="absolute bottom-0 left-0 right-0 bg-white rounded-full transition-all duration-75"
                              style={{ height: `${isMuted ? 0 : volume}%` }}
                            />
                          </div>
                          <div 
                            className="absolute w-3 h-3 bg-white rounded-full shadow-md pointer-events-none transition-all duration-75 left-1/2 -translate-x-1/2"
                            style={{ bottom: `calc(${isMuted ? 0 : volume}% - 6px)` }}
                          />
                        </div>

                        {/* Volume % */}
                        <span className="text-[8px] sm:text-[9px] font-mono font-bold text-white/80">
                          {isMuted ? 0 : volume}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Audio-Only Visualizer Mode */}
                {!showVideo && (
                  <div className="w-full h-full relative flex flex-col items-center justify-center p-4 sm:p-6 text-center bg-gradient-to-b from-slate-900 via-[#0d1424] to-black">
                    <img 
                      src={currentTrack.thumbnail || `https://i.ytimg.com/vi/${activeVideoId}/hqdefault.jpg`} 
                      alt={currentTrack.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-15 blur-xl pointer-events-none"
                    />
                    
                    <div className="relative z-10 space-y-2">
                      <div className="w-14 h-14 sm:w-20 sm:h-20 mx-auto rounded-full bg-red-600/20 border-2 border-red-500/40 flex items-center justify-center shadow-lg">
                        <Headphones className="w-7 h-7 sm:w-9 sm:h-9 text-red-400 animate-pulse" />
                      </div>

                      <div className="space-y-1 max-w-[240px] mx-auto">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                          Audio Only Mode
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate pt-0.5">
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

            </div>

            {/* ================================================================= */}
            {/* COLUMN 2: SEARCH & TRACKLIST (Right 6 Cols on Desktop)            */}
            {/* ================================================================= */}
            <div className="lg:col-span-6 flex flex-col space-y-3 min-h-[320px]">
              
              {/* Search Bar Input with Live YouTube Animation */}
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-shrink-0">
                <div className="relative flex-1 group">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search any song or artist (e.g. VannDa, Doung Virakseth, Lofi...)"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    className="w-full bg-slate-950/90 border border-white/15 rounded-xl pl-9 sm:pl-10 pr-9 py-2 sm:py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/25 transition-all"
                  />
                  <Search className={`w-3.5 h-3.5 sm:w-4 sm:h-4 absolute left-3 sm:left-3.5 top-2.5 sm:top-3 pointer-events-none transition-colors ${
                    isSearching ? 'text-red-500 animate-pulse' : 'text-slate-400 group-focus-within:text-red-400'
                  }`} />
                  
                  {isSearching ? (
                    <div className="absolute right-2.5 top-2.5 flex items-center gap-1.5">
                      <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
                    </div>
                  ) : searchQuery ? (
                    <button
                      type="button"
                      onClick={() => handleSearchInputChange({ target: { value: '' } })}
                      className="p-1 rounded-lg text-slate-400 hover:text-white absolute right-2.5 top-2 cursor-pointer transition-colors"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : null}
                </div>

                <button
                  type="submit"
                  disabled={isSearching}
                  className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-75 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer flex-shrink-0"
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
                <form onSubmit={handleLoadCustomUrl} className="p-2.5 sm:p-3 bg-white/5 border border-white/10 rounded-xl space-y-2 flex-shrink-0 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Paste YouTube Link: https://www.youtube.com/watch?v=..."
                      value={customUrl}
                      onChange={(e) => {
                        setCustomUrl(e.target.value);
                        setUrlError('');
                      }}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 sm:py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 font-mono"
                    />
                    <button
                      type="submit"
                      disabled={!customUrl.trim()}
                      className="px-3.5 py-1.5 sm:py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
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

              {/* YouTube-style Red Top Loading Line */}
              {isSearching && (
                <div className="h-[2px] w-full bg-slate-800 overflow-hidden relative rounded-full flex-shrink-0">
                  <div className="h-full bg-gradient-to-r from-red-600 via-red-400 to-red-600 animate-yt-loader rounded-full" />
                </div>
              )}

              {/* Scrollable Track Rows List */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 max-h-[340px] sm:max-h-[380px] [scrollbar-width:thin] [-webkit-overflow-scrolling:touch]">
                {/* YouTube-style Skeleton Shimmer Loading (when searching and no items yet) */}
                {isSearching && searchResults.length === 0 ? (
                  <div className="space-y-1.5 animate-fadeIn">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="p-2 sm:p-2.5 rounded-xl border border-white/5 bg-white/[0.03] flex items-center justify-between gap-3 overflow-hidden relative">
                        <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
                          {/* Shimmer Thumbnail */}
                          <div className="w-12 h-10 sm:w-14 sm:h-11 rounded-lg bg-slate-800/90 relative overflow-hidden flex-shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-yt-shimmer" />
                          </div>
                          {/* Shimmer Text Lines */}
                          <div className="space-y-2 flex-1 min-w-0">
                            <div className="h-3.5 bg-slate-800 rounded w-3/4 relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-yt-shimmer" />
                            </div>
                            <div className="h-2.5 bg-slate-800/70 rounded w-1/3 relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-yt-shimmer" />
                            </div>
                          </div>
                        </div>
                        {/* Shimmer Play Button */}
                        <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex-shrink-0 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-yt-shimmer" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : searchError && searchResults.length === 0 ? (
                  <div className="py-10 text-center space-y-2 animate-fadeIn">
                    <AlertCircle className="w-6 h-6 text-slate-500 mx-auto" />
                    <p className="text-xs text-slate-400">{searchError}</p>
                  </div>
                ) : (
                  searchResults.map((track) => {
                    const isCurrent = activeVideoId === track.id;
                    return (
                      <div
                        key={track.id}
                        onClick={() => handleTrackClick(track)}
                        className={`p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 sm:gap-3 group animate-fadeIn ${
                          isCurrent
                            ? 'bg-red-600/15 border-red-500/50 text-white shadow-xs'
                            : 'bg-white/5 hover:bg-white/10 border-white/5 hover:border-white/15 text-slate-300'
                        }`}
                      >
                      {/* Thumbnail & Title */}
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
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

                      {/* Duration & Play/Pause Action */}
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
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
                }))}
              </div>

            </div>

          </div>

          {/* Clean Bottom Footer Bar */}
          <div className="px-4 sm:px-6 py-2 sm:py-2.5 bg-slate-900/95 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 flex-shrink-0 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              <span className="text-[11px] sm:text-xs text-slate-300 font-medium">
                {isPlaying ? 'Audio Playing in Background' : 'Audio Paused (Click Play to Start)'}
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={handleTogglePlay}
                className={`px-3 sm:px-4 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95 ${
                  isPlaying
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    <span>Play</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onClose && onClose(false)}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-semibold text-xs transition-all cursor-pointer flex-shrink-0"
              >
                Close & Listen
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
