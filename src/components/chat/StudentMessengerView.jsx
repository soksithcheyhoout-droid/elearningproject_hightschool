import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  MessageSquare, 
  Send, 
  Smile, 
  Swords, 
  Users, 
  Search, 
  Sparkles, 
  Flame, 
  Trophy, 
  Bot, 
  Globe, 
  GraduationCap, 
  Zap, 
  FlaskConical, 
  Calculator, 
  Gamepad2,
  Heart,
  Lightbulb,
  ThumbsUp,
  Plus,
  Trash2,
  RotateCcw,
  Sparkle,
  X,
  ArrowLeft,
  Loader2,
  MoreVertical,
  Copy,
  Check,
  Film,
  Image as ImageIcon,
  ChevronDown,
  Mic,
  MicOff,
  Play,
  Pause,
  Video,
  Download,
  Maximize2,
  Paperclip,
  Volume2,
  Square
} from 'lucide-react';
import { useAuth, computeLevelData } from '../../context/AuthContext';
import { playSound } from '../../utils/audioEffects';
import { speakHumanText, stopHumanSpeech } from '../../utils/khmerVoice';
import { CHAT_CHANNELS } from '../../data/chatData';
import { GIF_CATEGORIES, POPULAR_GIFS } from '../../data/gifData';
import api from '../../services/api';

// Native Clean Emoji Categories
const EMOJI_CATEGORIES = [
  {
    id: 'trending',
    name: '🔥 ពេញនិយម',
    emojis: ['🔥', '❤️', '💯', '✨', '👑', '🚀', '👏', '🎉', '😎', '💪', '🤩', '💎']
  },
  {
    id: 'study',
    name: '📚 ការសិក្សា & STEM',
    emojis: ['📐', '⚡', '🧪', '🎓', '💡', '🧠', '📚', '🎯', '🏆', '📝', '📖', '🔬']
  },
  {
    id: 'gaming',
    name: '🎮 ហ្គេម & 1v1',
    emojis: ['⚔️', '🎮', '🏆', '💎', '⚡', '🎯', '🥇', '💥', '🛡️', '🎲', '🕹️', '👾']
  },
  {
    id: 'reactions',
    name: '😂 ស្នាមញញឹម & កាយវិការ',
    emojis: ['👋', '🥳', '👍', '👏', '🤝', '🙌', '👀', '🫡', '💖', '🥰', '☕', '✌️']
  }
];

const QUICK_REACTIONS = ['🔥', '❤️', '💡', '💯', '⚔️', '👏', '🎉', '👍'];

const isGifUrl = (str) => {
  if (typeof str !== 'string') return false;
  const s = str.trim();
  return s.startsWith('http') && (s.includes('.gif') || s.includes('giphy.com') || s.includes('tenor.com') || s.includes('media.giphy.com'));
};

/**
 * Ultra-Sleek Voice Message Player Component with Dynamic Equalizer Animations, Accurate Time & iOS Fallback
 */
function VoiceMessagePlayer({ audioUrl, duration, isMe }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const parseDurationStr = (durStr) => {
    if (!durStr || typeof durStr !== 'string') return 0;
    const parts = durStr.split(':').map(Number);
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return parts[0] * 60 + parts[1];
    }
    return 0;
  };

  const [totalDuration, setTotalDuration] = useState(() => parseDurationStr(duration) || 0);
  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const audioBufferRef = useRef(null);
  const audioSourceNodeRef = useRef(null);
  const webAudioIntervalRef = useRef(null);

  useEffect(() => {
    const s = parseDurationStr(duration);
    if (s > 0) setTotalDuration(s);
  }, [duration]);

  const fullAudioSrc = api.formatMediaUrl(audioUrl);

  const togglePlay = async () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (audioSourceNodeRef.current) {
        try { audioSourceNodeRef.current.stop(); } catch (e) {}
      }
      if (webAudioIntervalRef.current) clearInterval(webAudioIntervalRef.current);
      setIsPlaying(false);
      return;
    }

    // Attempt 1: Standard HTML5 Audio (Fastest & Native)
    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        return;
      } catch (err) {
        console.warn('HTML5 audio play blocked/unsupported on this device, initiating Web Audio API decoder:', err);
      }
    }

    // Attempt 2: Web Audio API Decoder Fallback (Guaranteed to play on iOS Safari & Android)
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      if (audioCtxRef.current.state === 'suspended') {
        await audioCtxRef.current.resume();
      }

      if (!audioBufferRef.current) {
        const resp = await fetch(fullAudioSrc);
        const arrayBuf = await resp.arrayBuffer();
        audioBufferRef.current = await audioCtxRef.current.decodeAudioData(arrayBuf);
      }

      const dur = audioBufferRef.current.duration;
      if (dur && isFinite(dur)) setTotalDuration(dur);

      const source = audioCtxRef.current.createBufferSource();
      source.buffer = audioBufferRef.current;
      source.connect(audioCtxRef.current.destination);
      audioSourceNodeRef.current = source;

      const startTime = audioCtxRef.current.currentTime;
      if (webAudioIntervalRef.current) clearInterval(webAudioIntervalRef.current);
      webAudioIntervalRef.current = setInterval(() => {
        if (!audioCtxRef.current) return;
        const cur = audioCtxRef.current.currentTime - startTime;
        if (cur >= dur) {
          setIsPlaying(false);
          setCurrentTime(0);
          clearInterval(webAudioIntervalRef.current);
        } else {
          setCurrentTime(cur);
        }
      }, 100);

      source.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        if (webAudioIntervalRef.current) clearInterval(webAudioIntervalRef.current);
      };

      source.start(0);
      setIsPlaying(true);
    } catch (fallbackErr) {
      console.error('All audio playback methods failed:', fallbackErr);
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration && isFinite(audioRef.current.duration) && audioRef.current.duration > 0) {
        setTotalDuration(audioRef.current.duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const d = audioRef.current.duration;
      if (d && !isNaN(d) && isFinite(d) && d > 0) {
        setTotalDuration(d);
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatSec = (sec) => {
    if (!sec || isNaN(sec) || !isFinite(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const effectiveDuration = totalDuration > 0 ? totalDuration : (parseDurationStr(duration) || 3);
  const progressPct = effectiveDuration > 0 ? (currentTime / effectiveDuration) * 100 : 0;
  const displayDuration = duration || (totalDuration > 0 ? formatSec(totalDuration) : '0:03');

  // 18-bar waveform profile heights
  const waveHeights = [35, 75, 45, 90, 100, 55, 80, 95, 40, 70, 85, 60, 100, 75, 45, 90, 65, 35];

  return (
    <div className={`flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 ${
      isPlaying
        ? isMe 
          ? 'bg-gradient-to-r from-blue-100/90 to-sky-50 border-blue-400 shadow-md ring-2 ring-blue-300/50' 
          : 'bg-gradient-to-r from-slate-100 to-blue-50/70 border-blue-400/80 shadow-md ring-2 ring-blue-300/40'
        : isMe 
          ? 'bg-blue-600/10 border-blue-300/80 text-blue-950 shadow-2xs' 
          : 'bg-slate-100 border-slate-200 text-slate-900 shadow-2xs'
    } min-w-[220px] sm:min-w-[280px] max-w-sm font-kantumruy select-none my-1 relative overflow-hidden`}>
      
      {/* Background Animated Sound Wave Aura when Playing */}
      {isPlaying && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-sky-500/10 to-indigo-500/5 pointer-events-none animate-pulse" />
      )}

      <audio 
        ref={audioRef} 
        src={fullAudioSrc} 
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="auto"
        playsInline={true}
        crossOrigin="anonymous"
      />
      
      {/* Play/Pause Button with Pulsing Glow on Play */}
      <button
        type="button"
        onClick={togglePlay}
        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shadow-md transition-all cursor-pointer flex-shrink-0 relative z-10 ${
          isPlaying 
            ? 'bg-gradient-to-tr from-[#005baa] to-sky-500 text-white scale-105 ring-4 ring-blue-400/40 shadow-blue-500/30' 
            : isMe 
              ? 'bg-[#005baa] hover:bg-[#004785] text-white hover:scale-105 active:scale-95' 
              : 'bg-[#002b5b] hover:bg-[#001f42] text-white hover:scale-105 active:scale-95'
        }`}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 text-white animate-pulse" />
        ) : (
          <Play className="w-5 h-5 ml-0.5 text-white" />
        )}
      </button>

      <div className="flex-1 min-w-0 space-y-1.5 relative z-10">
        {/* Interactive Audio Waveform Scrubber with Equalizer Animation */}
        <div 
          onClick={(e) => {
            if (!audioRef.current || !effectiveDuration) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            audioRef.current.currentTime = pos * effectiveDuration;
          }}
          className="flex items-center gap-1 sm:gap-1.5 cursor-pointer py-1.5 h-7"
          title="ចុចដើម្បីរំកិលសំឡេង (Seek Audio)"
        >
          {waveHeights.map((h, i) => {
            const barPct = (i / waveHeights.length) * 100;
            const isPassed = progressPct >= barPct;
            const delayMs = (i * 65) % 650;

            return (
              <span 
                key={i} 
                style={{ 
                  height: `${Math.max(6, (h / 100) * 22)}px`,
                  animationDelay: isPlaying ? `${delayMs}ms` : undefined
                }}
                className={`w-1 sm:w-1.5 rounded-full transition-all duration-200 ${
                  isPlaying && isPassed
                    ? 'animate-audio-wave bg-gradient-to-t from-[#005baa] to-sky-400 shadow-xs'
                    : isPlaying
                      ? 'animate-audio-wave bg-blue-300/80'
                      : isPassed 
                        ? (isMe ? 'bg-[#005baa]' : 'bg-slate-900') 
                        : (isMe ? 'bg-blue-300/60' : 'bg-slate-300')
                }`}
              />
            );
          })}
        </div>

        {/* Status bar with Live Sound Indicator and Accurate Min/Sec Duration */}
        <div className="flex items-center justify-between text-[9.5px] sm:text-[10px] text-slate-500 font-mono">
          <span className="flex items-center gap-1.5 font-bold">
            {isPlaying ? (
              <span className="flex items-center gap-1 text-[#005baa] font-extrabold animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-[#005baa] animate-ping" />
                <span className="font-kantumruy text-[10px]">កំពុងចាក់សំឡេង...</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-slate-600">
                <Mic className="w-3 h-3 text-rose-500" />
                <span>Voice Note</span>
              </span>
            )}
          </span>
          <span className="font-bold text-slate-700 font-mono">
            {isPlaying ? `${formatSec(currentTime)} / ${displayDuration}` : displayDuration}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function StudentMessengerView({ onLaunchDuelGame, onBack }) {
  const { student } = useAuth();
  const levelInfo = computeLevelData(student?.xp || 3568);

  // Tab State: 'global' (Channels) | 'direct' (Private DMs)
  const [chatType, setChatType] = useState('global');
  const [activeChannelId, setActiveChannelId] = useState('global');
  const [activeContactId, setActiveContactId] = useState(null);
  const [mobileChatView, setMobileChatView] = useState('list');

  // Search & Input
  const [searchQuery, setSearchQuery] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [activeEmojiCategory, setActiveEmojiCategory] = useState('trending');
  
  // GIF Picker State
  const [isGifPickerOpen, setIsGifPickerOpen] = useState(false);
  const [activeGifCategory, setActiveGifCategory] = useState('all');
  const [gifSearchQuery, setGifSearchQuery] = useState('');
  const [isSending, setIsSending] = useState(false);

  // 🎙️ Voice & Media States
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [activeMediaPreview, setActiveMediaPreview] = useState(null); // { url, type, name }
  const [speakingMsgId, setSpeakingMsgId] = useState(null);

  // Real Database Data
  const [channelMessages, setChannelMessages] = useState([]);
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [overviewData, setOverviewData] = useState({});
  const [directMessages, setDirectMessages] = useState({});
  const [activeMenuMsgId, setActiveMenuMsgId] = useState(null);
  const [copiedMsgId, setCopiedMsgId] = useState(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const chatContainerRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const gifPickerRef = useRef(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const recordingStartTimeRef = useRef(null);
  const lastMsgCountRef = useRef(0);

  // Format short timestamp (e.g. 18:35 or 01:06 AM)
  const formatTimeShort = (isoStr) => {
    if (!isoStr) return '';
    try {
      const d = new Date(isoStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  const hasInitializedContactRef = useRef(false);

  // 1. Fetch Real Registered Students from Database for Contacts List
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.getRegisteredStudents();
        if (res && Array.isArray(res.students)) {
          setRegisteredStudents(res.students);
          if (!hasInitializedContactRef.current) {
            const otherStudent = res.students.find(s => s.id !== student?.id && s.username !== student?.username);
            if (otherStudent) {
              setActiveContactId(prev => prev ? prev : otherStudent.id);
              hasInitializedContactRef.current = true;
            }
          }
        }
      } catch (e) {}
    };
    fetchStudents();
    const stuInterval = setInterval(fetchStudents, 5000);
    return () => clearInterval(stuInterval);
  }, [student?.id, student?.username]);

  // 2. Poll Real-Time Chat Overview (Latest message in all channels & DMs like Facebook Messenger)
  useEffect(() => {
    let isMounted = true;
    const fetchOverview = async () => {
      try {
        const res = await api.getChatOverview();
        if (isMounted && res && res.latestByChannel) {
          setOverviewData(res.latestByChannel);
        }
      } catch (e) {}
    };

    fetchOverview();
    const ovInterval = setInterval(fetchOverview, 1800);
    return () => {
      isMounted = false;
      clearInterval(ovInterval);
    };
  }, []);

  // Scroll smoothly to bottom on message updates
  const scrollToBottom = (behavior = 'smooth') => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior
      });
      setShowScrollBottom(false);
    }
  };

  // Check scroll position to decide if user has scrolled up
  const handleChatScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;
    setShowScrollBottom(distanceToBottom > 120);
  };

  // 3. Fast Low-Latency Poll for Active Channel Messages (1200ms)
  useEffect(() => {
    let isMounted = true;
    const targetChannel = chatType === 'global' 
      ? activeChannelId 
      : `dm_${[Number(student?.id || 1), Number(activeContactId || 2)].sort((a,b) => a-b).join('_')}`;

    const fetchMessages = async () => {
      try {
        const res = await api.getChatMessages(targetChannel);
        if (isMounted && res && Array.isArray(res.messages)) {
          setChannelMessages(prev => {
            // Play notification sound when new message arrives from another student
            if (prev.length > 0 && res.messages.length > prev.length) {
              const lastIncoming = res.messages[res.messages.length - 1];
              if (lastIncoming && String(lastIncoming.sender_id) !== String(student?.id)) {
                playSound.pop();
              }
            }

            // If message count and last message are identical, keep exact state reference
            if (prev.length === res.messages.length) {
              const lastPrev = prev[prev.length - 1];
              const lastNew = res.messages[res.messages.length - 1];
              if (lastPrev && lastNew && lastPrev.id === lastNew.id && JSON.stringify(lastPrev.reactions) === JSON.stringify(lastNew.reactions)) {
                return prev;
              }
            }

            // Only auto-scroll down if user is already near the bottom!
            if (chatContainerRef.current) {
              const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
              const isNearBottom = (scrollHeight - scrollTop - clientHeight) < 140;
              if (isNearBottom) {
                setTimeout(() => scrollToBottom('smooth'), 50);
              }
            }

            return res.messages;
          });
        }
      } catch (e) {}
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 1200);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [activeChannelId, activeContactId, chatType, student?.id]);

  // When switching channel or contact, always scroll to bottom immediately
  useEffect(() => {
    setTimeout(() => scrollToBottom('auto'), 50);
  }, [activeChannelId, activeContactId, chatType]);

  // Click outside to close emoji picker, gif picker & active message menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
        setIsEmojiPickerOpen(false);
      }
      if (gifPickerRef.current && !gifPickerRef.current.contains(e.target)) {
        setIsGifPickerOpen(false);
      }
      setActiveMenuMsgId(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleCopyMessage = (msgId, text) => {
    playSound.pop();
    navigator.clipboard?.writeText(text);
    setCopiedMsgId(msgId);
    setTimeout(() => {
      setCopiedMsgId(null);
      setActiveMenuMsgId(null);
    }, 1500);
  };

  const activeContact = registeredStudents.find(s => s.id === activeContactId) || registeredStudents[0] || {
    id: 1,
    full_name: 'riki.dev',
    school: 'វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ',
    avatar: '/uploads/avatars/student-pf-1786900630622-540658663.jpg',
    avatar_frame: '/assets/frames/11_gyoko_pink.png'
  };

  const activeChannel = CHAT_CHANNELS.find(ch => ch.id === activeChannelId) || CHAT_CHANNELS[0];

  // 🔊 Text-To-Speech (TTS): Speak Message Out Loud in Natural Human Voice
  const handleSpeakMessage = (msgId, text) => {
    if (!text || typeof text !== 'string') return;

    if (speakingMsgId === msgId) {
      stopHumanSpeech();
      setSpeakingMsgId(null);
      return;
    }

    stopHumanSpeech();
    setSpeakingMsgId(msgId);
    playSound.pop();

    speakHumanText(text, {
      onStart: () => setSpeakingMsgId(msgId),
      onEnd: () => setSpeakingMsgId(null),
      onError: () => setSpeakingMsgId(null)
    });
  };

  // 🎙️ Start Voice Note Recording with Device-Aware MediaRecorder API
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Determine optimal audio MIME type supported by client browser (iPhone uses MP4/AAC, Android/PC uses WebM/Opus)
      let preferredMime = 'audio/webm;codecs=opus';
      let preferredExt = 'webm';

      if (typeof MediaRecorder !== 'undefined' && typeof MediaRecorder.isTypeSupported === 'function') {
        if (MediaRecorder.isTypeSupported('audio/mp4')) {
          preferredMime = 'audio/mp4';
          preferredExt = 'mp4';
        } else if (MediaRecorder.isTypeSupported('audio/aac')) {
          preferredMime = 'audio/aac';
          preferredExt = 'aac';
        } else if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          preferredMime = 'audio/webm;codecs=opus';
          preferredExt = 'webm';
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
          preferredMime = 'audio/webm';
          preferredExt = 'webm';
        } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
          preferredMime = 'audio/ogg';
          preferredExt = 'ogg';
        } else {
          preferredMime = '';
        }
      }

      const recorderOptions = preferredMime ? { mimeType: preferredMime } : undefined;
      const mediaRecorder = new MediaRecorder(stream, recorderOptions);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      recordingStartTimeRef.current = Date.now();

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const actualMime = mediaRecorder.mimeType || preferredMime || 'audio/mp4';
        const audioBlob = new Blob(audioChunksRef.current, { type: actualMime });
        stream.getTracks().forEach(track => track.stop());
        if (audioChunksRef.current.length === 0) return;
        
        const elapsedSec = Math.max(1, Math.round((Date.now() - (recordingStartTimeRef.current || Date.now())) / 1000));
        await handleSendVoiceBlob(audioBlob, elapsedSec, preferredExt, actualMime);
      };

      mediaRecorder.start(100);
      setIsRecordingVoice(true);
      setRecordingDuration(0);
      playSound.click();

      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = setInterval(() => {
        if (recordingStartTimeRef.current) {
          const sec = Math.floor((Date.now() - recordingStartTimeRef.current) / 1000);
          setRecordingDuration(sec);
        } else {
          setRecordingDuration(prev => prev + 1);
        }
      }, 500);
    } catch (err) {
      console.error('Microphone access denied:', err);
      alert('សូមអនុញ្ញាតឱ្យប្រើប្រាស់ Microphone (Mic) ដើម្បីថតសារជាសំឡេង (Voice Note)!');
    }
  };

  const stopAndSendVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecordingVoice) {
      clearInterval(recordingTimerRef.current);
      setIsRecordingVoice(false);
      mediaRecorderRef.current.stop();
      playSound.pop();
    }
  };

  const cancelVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecordingVoice) {
      clearInterval(recordingTimerRef.current);
      audioChunksRef.current = []; // cancel sending
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      setIsRecordingVoice(false);
      setRecordingDuration(0);
      playSound.wrong();
    }
  };

  const handleSendVoiceBlob = async (blob, durationSec, ext = 'webm', mimeType = 'audio/webm') => {
    setIsSending(true);
    try {
      const file = new File([blob], `voice-note-${Date.now()}.${ext}`, { type: mimeType });
      const uploadRes = await api.uploadChatMedia(file);
      if (uploadRes && uploadRes.url) {
        const minutes = Math.floor(durationSec / 60);
        const seconds = durationSec % 60;
        const durFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        const targetChannel = chatType === 'global' ? activeChannelId : `dm_${[student?.id || 1, activeContactId || 2].sort().join('_')}`;
        const payload = {
          channelId: targetChannel,
          senderId: student?.id || 1,
          senderName: student?.name || student?.fullName || student?.username || 'riki.dev',
          senderUsername: student?.username || 'riki.dev',
          senderAvatar: student?.avatar || '/assets/anime/boys/boy_1.png',
          senderFrame: student?.avatarFrame || student?.avatar_frame || '/assets/frames/11_gyoko_pink.png',
          senderSchool: student?.school || 'វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ',
          senderGrade: `ថ្នាក់ទី${student?.grade || '12'} (${student?.stream || 'វិទ្យាសាស្ត្រ'})`,
          senderLevel: levelInfo.level || 8,
          senderBadge: levelInfo.rankTitleKm || 'កំពូលអ្នកស្រាវជ្រាវ (Grandmaster)',
          content: '🎙️ សារសំឡេង (Voice Note)',
          mediaType: 'audio',
          mediaUrl: uploadRes.url,
          mediaDuration: durFormatted,
          mediaName: 'voice-note.webm',
          isDuelChallenge: false
        };

        const res = await api.sendChatMessage(payload);
        if (res && res.message) {
          setChannelMessages(prev => [...prev, res.message]);
          scrollToBottom();
        }
      }
    } catch (err) {
      console.error('Failed to send voice note:', err);
    } finally {
      setIsSending(false);
      setRecordingDuration(0);
    }
  };

  // 📷 🎥 Upload and Send Photo (Image) or Video
  const handleSelectMediaFile = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsSending(true);
    setUploadingMedia(true);
    playSound.click();

    try {
      const uploadRes = await api.uploadChatMedia(file);
      if (uploadRes && uploadRes.url) {
        const targetChannel = chatType === 'global' ? activeChannelId : `dm_${[student?.id || 1, activeContactId || 2].sort().join('_')}`;
        const payload = {
          channelId: targetChannel,
          senderId: student?.id || 1,
          senderName: student?.name || student?.fullName || student?.username || 'riki.dev',
          senderUsername: student?.username || 'riki.dev',
          senderAvatar: student?.avatar || '/assets/anime/boys/boy_1.png',
          senderFrame: student?.avatarFrame || student?.avatar_frame || '/assets/frames/11_gyoko_pink.png',
          senderSchool: student?.school || 'វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ',
          senderGrade: `ថ្នាក់ទី${student?.grade || '12'} (${student?.stream || 'វិទ្យាសាស្ត្រ'})`,
          senderLevel: levelInfo.level || 8,
          senderBadge: levelInfo.rankTitleKm || 'កំពូលអ្នកស្រាវជ្រាវ (Grandmaster)',
          content: inputMessage.trim(),
          mediaType: type, // 'image' or 'video'
          mediaUrl: uploadRes.url,
          mediaName: file.name,
          isDuelChallenge: false
        };

        const res = await api.sendChatMessage(payload);
        if (res && res.message) {
          setChannelMessages(prev => [...prev, res.message]);
          setInputMessage('');
          scrollToBottom();
        }
      }
    } catch (err) {
      console.error('Failed to upload media:', err);
      alert('បរាជ័យក្នុងការបញ្ជូនឯកសាររូបភាព/វីដេអូ! សូមព្យាយាមម្តងទៀត។');
    } finally {
      setIsSending(false);
      setUploadingMedia(false);
      if (e.target) e.target.value = '';
    }
  };

  // 3. Send Real Database Message
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    setIsEmojiPickerOpen(false);
    setIsGifPickerOpen(false);
    setIsSending(true);
    playSound.click();

    const targetChannel = chatType === 'global' ? activeChannelId : `dm_${[student?.id || 1, activeContactId || 2].sort().join('_')}`;

    const payload = {
      channelId: targetChannel,
      senderId: student?.id || 1,
      senderName: student?.name || student?.fullName || student?.username || 'riki.dev',
      senderUsername: student?.username || 'riki.dev',
      senderAvatar: student?.avatar || '/assets/anime/boys/boy_1.png',
      senderFrame: student?.avatarFrame || student?.avatar_frame || '/assets/frames/11_gyoko_pink.png',
      senderSchool: student?.school || 'វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ',
      senderGrade: `ថ្នាក់ទី${student?.grade || '12'} (${student?.stream || 'វិទ្យាសាស្ត្រ'})`,
      senderLevel: levelInfo.level || 8,
      senderBadge: levelInfo.rankTitleKm || 'កំពូលអ្នកស្រាវជ្រាវ (Grandmaster)',
      content: userText,
      isDuelChallenge: false
    };

    try {
      const res = await api.sendChatMessage(payload);
      if (res && res.message) {
        setChannelMessages(prev => [...prev, res.message]);
        scrollToBottom();
      }
    } catch (err) {
      console.error('Failed to send real message:', err);
    } finally {
      setIsSending(false);
    }
  };

  // 4. Send Animated GIF to Database
  const handleSendGif = async (gif) => {
    playSound.click();
    setIsGifPickerOpen(false);
    setIsSending(true);

    const targetChannel = chatType === 'global' ? activeChannelId : `dm_${[student?.id || 1, activeContactId || 2].sort().join('_')}`;

    const payload = {
      channelId: targetChannel,
      senderId: student?.id || 1,
      senderName: student?.name || student?.fullName || student?.username || 'riki.dev',
      senderUsername: student?.username || 'riki.dev',
      senderAvatar: student?.avatar || '/assets/anime/boys/boy_1.png',
      senderFrame: student?.avatarFrame || student?.avatar_frame || '/assets/frames/11_gyoko_pink.png',
      senderSchool: student?.school || 'វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ',
      senderGrade: `ថ្នាក់ទី${student?.grade || '12'} (${student?.stream || 'វិទ្យាសាស្ត្រ'})`,
      senderLevel: levelInfo.level || 8,
      senderBadge: levelInfo.rankTitleKm || 'កំពូលអ្នកស្រាវជ្រាវ (Grandmaster)',
      content: gif.url,
      isDuelChallenge: false
    };

    try {
      const res = await api.sendChatMessage(payload);
      if (res && res.message) {
        setChannelMessages(prev => [...prev, res.message]);
        scrollToBottom();
      }
    } catch (err) {
      console.error('Failed to send GIF:', err);
    } finally {
      setIsSending(false);
    }
  };

  // 5. Send Live 1v1 Challenge to Database
  const handlePostChallenge = async () => {
    playSound.click();
    const roomCode = Math.floor(100000 + Math.random() * 900000).toString();
    const payload = {
      channelId: activeChannelId,
      senderId: student?.id || 1,
      senderName: student?.name || student?.fullName || student?.username || 'riki.dev',
      senderUsername: student?.username || 'riki.dev',
      senderAvatar: student?.avatar || '/assets/anime/boys/boy_1.png',
      senderFrame: student?.avatarFrame || student?.avatar_frame || '/assets/frames/11_gyoko_pink.png',
      senderSchool: student?.school || 'វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ',
      senderGrade: `ថ្នាក់ទី${student?.grade || '12'} (${student?.stream || 'វិទ្យាសាស្ត្រ'})`,
      senderLevel: levelInfo.level || 8,
      senderBadge: '1v1 Challenger',
      content: `⚔️ ខ្ញុំបានបង្កើតបន្ទប់ប្រកួត 1v1 Speed Quiz #${roomCode}! តើមានអ្នកណាហ៊ានប្រកួតជាមួយខ្ញុំទេ? ចុចចូលរួមទាំងអស់គ្នា! 🔥`,
      isDuelChallenge: true,
      duelRoomCode: roomCode
    };

    try {
      const res = await api.sendChatMessage(payload);
      if (res && res.message) {
        setChannelMessages(prev => [...prev, res.message]);
        scrollToBottom();
      }
    } catch (e) {}
  };

  // 6. Toggle Real Database Reaction (Optimistic Instant Toggle)
  const handleAddReaction = async (msgId, emoji) => {
    playSound.pop();
    const currentUserId = String(student?.id || 1);

    // Optimistically update local React state instantly!
    setChannelMessages(prev => prev.map(m => {
      if (m.id !== msgId) return m;

      let currentReactions = typeof m.reactions === 'string' ? JSON.parse(m.reactions || '{}') : { ...(m.reactions || {}) };
      let userList = currentReactions[emoji];

      if (!userList) {
        // Add new reaction
        currentReactions[emoji] = [currentUserId];
      } else if (Array.isArray(userList)) {
        const strList = userList.map(String);
        const idx = strList.indexOf(currentUserId);
        if (idx > -1) {
          // REMOVE reaction!
          const updated = userList.filter(id => String(id) !== currentUserId);
          if (updated.length === 0) {
            delete currentReactions[emoji];
          } else {
            currentReactions[emoji] = updated;
          }
        } else {
          // Add user
          currentReactions[emoji] = [...userList, currentUserId];
        }
      } else {
        // If it was a number count, toggle off
        delete currentReactions[emoji];
      }

      return {
        ...m,
        reactions: currentReactions
      };
    }));

    try {
      const res = await api.toggleChatReaction(msgId, emoji, student?.id || 1);
      if (res && res.reactions) {
        setChannelMessages(prev => prev.map(m => m.id === msgId ? { ...m, reactions: res.reactions } : m));
      }
    } catch (e) {
      console.warn('Failed to toggle reaction:', e);
    }
  };

  // 7. Delete Individual Message by ID (for message owner)
  const handleDeleteMessage = async (msgId) => {
    playSound.wrong();
    setChannelMessages(prev => prev.filter(m => m.id !== msgId));
    try {
      await api.deleteChatMessage(msgId, student?.id || 1, student?.username || 'riki.dev');
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  // 8. Clear Channel History in Database
  const handleClearCurrentChannel = async () => {
    if (!window.confirm('តើអ្នកប្រាកដជាចង់សម្អាតប្រវត្តិសារក្នុងបន្ទប់នេះទេ? (Clear Chat)')) return;
    playSound.wrong();
    try {
      const targetChannel = chatType === 'global' ? activeChannelId : `dm_${[student?.id || 1, activeContactId || 2].sort().join('_')}`;
      await api.clearChatChannel(targetChannel);
      setChannelMessages([]);
    } catch (e) {}
  };

  const getChannelIcon = (id, active) => {
    const cls = `w-4 h-4 sm:w-4.5 sm:h-4.5 ${active ? 'text-[#005baa]' : 'text-slate-500'}`;
    switch (id) {
      case 'math': return <Calculator className={cls} />;
      case 'physics': return <Zap className={cls} />;
      case 'chemistry': return <FlaskConical className={cls} />;
      case 'bacii': return <GraduationCap className={cls} />;
      case 'gaming': return <Gamepad2 className={cls} />;
      default: return <Globe className={cls} />;
    }
  };

  const filteredChannels = CHAT_CHANNELS.filter(ch => 
    ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ch.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContacts = registeredStudents.filter(s => {
    const isSelf = s.id === student?.id || s.username === student?.username;
    if (isSelf) return false;
    const name = s.full_name || s.username || '';
    const school = s.school || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase()) || school.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredGifs = POPULAR_GIFS.filter(gif => {
    const matchesCategory = activeGifCategory === 'all' || gif.category === activeGifCategory;
    const q = gifSearchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;
    const matchesQuery = gif.titleKm.toLowerCase().includes(q) || 
      gif.titleEn.toLowerCase().includes(q) || 
      gif.tags.some(tag => tag.toLowerCase().includes(q));
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="w-full max-w-[1600px] mx-auto h-full flex-1 flex flex-col bg-white border-0 sm:border border-slate-200 sm:rounded-3xl shadow-sm sm:shadow-lg overflow-hidden font-kantumruy select-none">
      
      {/* Header Bar */}
      <div className="bg-white border-b border-slate-200 px-2.5 sm:px-6 py-2 sm:py-3 flex items-center justify-between gap-2 flex-shrink-0 select-none shadow-2xs">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="sm:hidden p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex-shrink-0 cursor-pointer transition-colors"
              title="ត្រឡប់ទៅទំព័រដើម (Back to Home)"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-[#002d62] via-[#005baa] to-sky-400 flex items-center justify-center text-white shadow-xs flex-shrink-0">
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-[9px] sm:text-[11px] font-extrabold text-[#005baa] uppercase tracking-wider font-cinzel truncate">
                LIVE MESSENGER
              </span>
              <span className="inline-flex items-center gap-1 text-[8px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>{registeredStudents.length || 2} Online</span>
              </span>
            </div>
            <h2 className="hidden sm:block text-sm sm:text-base font-extrabold text-[#003366] truncate">
              ប្រព័ន្ធជជែកសិក្សា & បន្ទប់សន្ទនាទូទាំងប្រទេស
            </h2>
          </div>
        </div>

        {/* Global / Direct Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-0.5 sm:p-1 rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-inner flex-shrink-0">
          <button
            type="button"
            onClick={() => { setChatType('global'); setMobileChatView('list'); }}
            className={`px-2 sm:px-4 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all cursor-pointer flex items-center gap-1 sm:gap-2 ${
              chatType === 'global'
                ? 'bg-white text-[#005baa] shadow-xs border border-slate-200/80 font-extrabold'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-[#005baa]" />
            <span className="hidden sm:inline">បន្ទប់រួម (Global)</span>
            <span className="sm:hidden">បន្ទប់រួម</span>
          </button>
          
          <button
            type="button"
            onClick={() => { setChatType('direct'); setMobileChatView('list'); }}
            className={`px-2 sm:px-4 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10.5px] sm:text-xs font-bold transition-all cursor-pointer flex items-center gap-1 sm:gap-2 ${
              chatType === 'direct'
                ? 'bg-white text-[#005baa] shadow-xs border border-slate-200/80 font-extrabold'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#005baa]" />
            <span className="hidden sm:inline">សារផ្ទាល់ខ្លួន (DMs)</span>
            <span className="sm:hidden">សារផ្ទាល់</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* LEFT COLUMN: CHANNELS OR REAL STUDENTS LIST */}
        <div className={`w-full md:w-80 bg-slate-50 border-r border-slate-200 flex-col flex-shrink-0 select-none ${
          mobileChatView === 'list' ? 'flex' : 'hidden md:flex'
        }`}>
          
          {/* Search Box */}
          <div className="p-3.5 border-b border-slate-200 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={chatType === 'global' ? "ស្វែងរកបន្ទប់ជជែក..." : "ស្វែងរកសិស្សក្នុងប្រព័ន្ធ..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#005baa] focus:bg-white transition-all shadow-inner"
              />
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {chatType === 'global' ? (
              <>
                <div className="text-[10px] font-black text-slate-400 uppercase px-3 py-1 font-cinzel tracking-wider flex items-center justify-between">
                  <span>SUBJECT CHANNELS (បន្ទប់តាមមុខវិជ្ជា)</span>
                  <Sparkle className="w-3 h-3 text-amber-500" />
                </div>
                {filteredChannels.map((channel) => {
                  const isActive = activeChannelId === channel.id;
                  const latest = overviewData[channel.id];
                  return (
                    <button
                      key={channel.id}
                      type="button"
                      onClick={() => { setActiveChannelId(channel.id); setMobileChatView('chat'); }}
                      className={`w-full p-2.5 sm:p-3 rounded-2xl text-left transition-all cursor-pointer flex items-center gap-2.5 sm:gap-3 group relative ${
                        isActive
                          ? 'bg-blue-50/90 border border-blue-200 text-[#005baa] shadow-xs'
                          : 'hover:bg-white text-slate-700 hover:text-[#005baa] border border-transparent'
                      }`}
                    >
                      {getChannelIcon(channel.id, isActive)}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-bold text-xs truncate group-hover:text-[#005baa] transition-colors">{channel.name}</h4>
                          {latest?.created_at && (
                            <span className="text-[9px] text-slate-400 font-mono font-bold flex-shrink-0">
                              {formatTimeShort(latest.created_at)}
                            </span>
                          )}
                        </div>
                        <p className={`text-[10px] truncate mt-0.5 ${latest ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                          {latest ? (
                            <span>
                              <strong className="text-slate-800 font-semibold">{latest.sender_name || latest.sender_username}:</strong> {latest.content}
                            </span>
                          ) : (
                            channel.desc
                          )}
                        </p>
                      </div>
                      {latest && !isActive && (
                        <span className="w-2 h-2 rounded-full bg-[#005baa] flex-shrink-0 animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </>
            ) : (
              <>
                <div className="text-[10px] font-black text-slate-400 uppercase px-3 py-1 font-cinzel tracking-wider flex items-center justify-between">
                  <span>REAL REGISTERED STUDENTS</span>
                  <Users className="w-3 h-3 text-[#005baa]" />
                </div>
                {filteredContacts.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-400">
                    គ្មានសិស្សផ្សេងទៀតទេ
                  </div>
                ) : (
                  filteredContacts.map((contact) => {
                    const isActive = activeContactId === contact.id;
                    const dmKey = `dm_${[Number(student?.id || 1), Number(contact.id || 2)].sort((a,b)=>a-b).join('_')}`;
                    const latest = overviewData[dmKey];
                    return (
                      <button
                        key={contact.id}
                        type="button"
                        onClick={() => { setActiveContactId(contact.id); setMobileChatView('chat'); }}
                        className={`w-full p-2.5 sm:p-3 rounded-2xl text-left transition-all cursor-pointer flex items-center gap-2.5 sm:gap-3 group relative ${
                          isActive
                            ? 'bg-blue-50/90 border border-blue-200 text-[#005baa] shadow-xs'
                            : 'hover:bg-white text-slate-700 hover:text-[#005baa] border border-transparent'
                        }`}
                      >
                        {/* Real Avatar with Animated Frame Overlay */}
                        <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center flex-shrink-0 select-none">
                          <div className="w-[82%] h-[82%] rounded-full overflow-hidden bg-slate-900 shadow-xs border border-slate-300">
                            <img 
                              src={api.formatAvatarUrl(contact.avatar)} 
                              alt={contact.full_name} 
                              onError={(e) => { e.currentTarget.src = '/assets/anime/boys/boy_1.png'; }}
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          {(contact.avatar_frame || contact.avatarFrame) && (
                            <img
                              src={contact.avatar_frame || contact.avatarFrame}
                              alt="Frame"
                              className="absolute inset-0 w-full h-full object-contain pointer-events-none scale-110 drop-shadow-md z-10"
                              onError={(e) => {
                                const cur = e.currentTarget.src;
                                if (cur.endsWith('.png')) e.currentTarget.src = cur.replace('.png', '.webp');
                                else if (cur.endsWith('.webp')) e.currentTarget.src = cur.replace('.webp', '.png');
                              }}
                            />
                          )}
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white bg-emerald-500 z-20" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-bold text-xs truncate text-slate-900">{contact.full_name || contact.username}</h4>
                            {latest?.created_at ? (
                              <span className="text-[9px] text-slate-400 font-mono font-bold flex-shrink-0">
                                {formatTimeShort(latest.created_at)}
                              </span>
                            ) : (
                              <span className="text-[9px] text-emerald-600 font-cinzel font-bold">Online</span>
                            )}
                          </div>
                          <p className={`text-[10.5px] truncate mt-0.5 ${latest ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                            {latest ? (
                              <span>
                                {String(latest.sender_id) === String(student?.id) ? <span className="text-slate-400">អ្នក: </span> : ''}
                                {latest.content}
                              </span>
                            ) : (
                              contact.school || 'វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ'
                            )}
                          </p>
                        </div>

                        {latest && !isActive && String(latest.sender_id) !== String(student?.id) && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 animate-pulse" />
                        )}
                      </button>
                    );
                  })
                )}
              </>
            )}
          </div>

          {/* Current User Profile Footer */}
          <div className="p-3.5 bg-white border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative w-10 h-10 flex items-center justify-center flex-shrink-0">
                <div className="w-[82%] h-[82%] rounded-full overflow-hidden bg-slate-900 border border-[#005baa]/30 shadow-xs">
                  <img 
                    src={api.formatAvatarUrl(student?.avatar)} 
                    alt="You" 
                    onError={(e) => { e.currentTarget.src = '/assets/anime/boys/boy_1.png'; }}
                    className="w-full h-full object-cover" 
                  />
                </div>
                {(student?.avatarFrame || student?.avatar_frame) && (
                  <img
                    src={student.avatarFrame || student.avatar_frame}
                    alt="Frame"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none scale-110 drop-shadow-md z-10"
                  />
                )}
              </div>
              <div className="min-w-0">
                <span className="font-black text-xs text-[#003366] truncate block">{student?.name || student?.username || 'riki.dev'}</span>
                <span className="text-[10px] text-emerald-600 font-bold block">🟢 Lv.{levelInfo.level} • Live DB</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: ACTIVE CHAT CANVAS */}
        <div className={`flex-1 flex flex-col bg-[#f8fafc] overflow-hidden relative ${
          mobileChatView === 'chat' ? 'flex' : 'hidden md:flex'
        }`}>
          
          {/* Active Chat Header */}
          <div className="bg-white border-b border-slate-200 px-2.5 sm:px-6 py-2 sm:py-3 flex items-center justify-between flex-shrink-0 shadow-2xs gap-1.5">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <button
                type="button"
                onClick={() => setMobileChatView('list')}
                className="md:hidden p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#005baa] flex items-center justify-center cursor-pointer shadow-2xs border border-slate-200 flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              {chatType === 'global' ? (
                <>
                  <div className="flex-shrink-0">
                    {getChannelIcon(activeChannel.id, true)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-extrabold text-xs sm:text-sm text-[#003366] truncate">{activeChannel.name}</h3>
                    <p className="text-[9.5px] sm:text-[11px] text-slate-500 truncate hidden xs:block">{activeChannel.desc}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0">
                    <div className="w-[82%] h-[82%] rounded-full overflow-hidden bg-slate-900 border border-blue-200 shadow-xs">
                      <img 
                        src={api.formatAvatarUrl(activeContact.avatar)} 
                        alt={activeContact.full_name} 
                        onError={(e) => { e.currentTarget.src = '/assets/anime/boys/boy_1.png'; }}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    {(activeContact.avatar_frame || activeContact.avatarFrame) && (
                      <img
                        src={activeContact.avatar_frame || activeContact.avatarFrame}
                        alt="Frame"
                        className="absolute inset-0 w-full h-full object-contain pointer-events-none scale-110 drop-shadow-md z-10"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-extrabold text-xs sm:text-sm text-[#003366] truncate">{activeContact.full_name || activeContact.username}</h3>
                    <p className="text-[9.5px] sm:text-[11px] text-emerald-600 flex items-center gap-1 font-bold truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      <span className="truncate">{activeContact.school || 'វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ'}</span>
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {chatType === 'global' && (
                <button
                  type="button"
                  onClick={handlePostChallenge}
                  className="px-2 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-950 font-black text-[10px] sm:text-xs flex items-center gap-1 cursor-pointer shadow-xs active:scale-95 transition-all border border-amber-300"
                >
                  <Swords className="w-3.5 h-3.5 text-slate-950" />
                  <span className="hidden sm:inline">បង្កើតការប្រកួត 1v1</span>
                  <span className="sm:hidden">1v1 Quiz</span>
                </button>
              )}

              {channelMessages.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearCurrentChannel}
                  className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 text-xs font-bold transition-all cursor-pointer border border-slate-200 hover:border-rose-200 flex items-center gap-1"
                  title="សម្អាតប្រវត្តិសារ (Clear Chat)"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">សម្អាតសារ</span>
                </button>
              )}
            </div>
          </div>

          {/* Real Messages Stream */}
          <div 
            ref={chatContainerRef} 
            onScroll={handleChatScroll}
            className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4 relative"
          >
            {channelMessages.length > 0 ? (
              channelMessages.map((msg, index) => {
                const isMe = (msg.sender_id === student?.id) || (msg.sender_username === student?.username);
                const reactions = typeof msg.reactions === 'string' ? JSON.parse(msg.reactions || '{}') : (msg.reactions || {});

                return (
                  <div key={msg.id ? `msg-${msg.id}` : `msg-${index}-${Date.now()}`} className="flex items-start gap-2.5 sm:gap-3.5 group animate-fade-in relative">
                    
                    {/* Sender Avatar with Animated Frame Overlay */}
                    <div className="relative w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center flex-shrink-0 select-none mt-0.5">
                      <div className="w-[82%] h-[82%] rounded-full overflow-hidden bg-slate-900 shadow-xs border border-amber-400">
                        <img 
                          src={api.formatAvatarUrl(msg.sender_avatar || (isMe ? student?.avatar : '/assets/anime/boys/boy_1.png'))} 
                          alt={msg.sender_name || 'Student'} 
                          onError={(e) => { e.currentTarget.src = '/assets/anime/boys/boy_1.png'; }}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      {(msg.sender_frame || (isMe && (student?.avatarFrame || student?.avatar_frame))) && (
                        <img
                          src={msg.sender_frame || (isMe && (student?.avatarFrame || student?.avatar_frame))}
                          alt="Frame"
                          className="absolute inset-0 w-full h-full object-contain pointer-events-none scale-120 sm:scale-125 drop-shadow-md z-10"
                          onError={(e) => {
                            const cur = e.currentTarget.src;
                            if (cur.endsWith('.png')) e.currentTarget.src = cur.replace('.png', '.webp');
                            else if (cur.endsWith('.webp')) e.currentTarget.src = cur.replace('.webp', '.png');
                          }}
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 max-w-2xl relative">

                      {/* Header: Name, Grade, Role */}
                      <div className="flex items-center justify-between gap-1.5 mb-1 min-w-0">
                        <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap min-w-0">
                          <span className={`font-black text-[11px] sm:text-xs truncate max-w-[100px] sm:max-w-none ${isMe ? 'text-[#005baa]' : 'text-slate-900'}`}>
                            {msg.sender_name || msg.sender_username || (isMe ? (student?.name || student?.username) : 'Student')}
                          </span>
                          {(msg.sender_grade || (isMe && student?.grade)) && (
                            <span className="text-[8.5px] sm:text-[9.5px] font-bold px-1.5 sm:px-2 py-0.2 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex-shrink-0">
                              {msg.sender_grade || `ថ្នាក់ទី${student?.grade || '12'} (${student?.stream || 'វិទ្យាសាស្ត្រ'})`}
                            </span>
                          )}
                          {(msg.sender_badge || (isMe && levelInfo.rankTitleKm)) && (
                            <span className="text-[8px] sm:text-[9px] font-black px-1.5 sm:px-2 py-0.2 rounded-full shadow-2xs bg-[#005baa] text-white truncate max-w-[110px] sm:max-w-none">
                              {msg.sender_badge || levelInfo.rankTitleKm}
                            </span>
                          )}
                        </div>

                        {/* Right Actions: Time, Speaker TTS & Options Trigger */}
                        <div className="flex items-center gap-1 flex-shrink-0 relative">
                          <span className="text-[8.5px] sm:text-[9px] text-slate-400 font-cinzel">
                            {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'ឥឡូវនេះ'}
                          </span>

                          {/* Speak Voice (Text-to-Speech) Quick Trigger */}
                          {msg.content && msg.content !== '🎙️ សារសំឡេង (Voice Note)' && (
                            <button
                              type="button"
                              onClick={() => handleSpeakMessage(msg.id, msg.content)}
                              className={`p-1 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                                speakingMsgId === msg.id 
                                  ? 'bg-blue-600 text-white shadow-xs scale-110 ring-2 ring-blue-300' 
                                  : 'text-slate-400 hover:text-[#005baa] hover:bg-slate-200/80'
                              }`}
                              title={speakingMsgId === msg.id ? "បញ្ឈប់ការអាន (Stop Voice)" : "អានសារជាសំឡេង (Speak Message Voice)"}
                            >
                              <Volume2 className={`w-3.5 h-3.5 ${speakingMsgId === msg.id ? 'animate-pulse text-white' : ''}`} />
                            </button>
                          )}

                          <div className="relative">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuMsgId(activeMenuMsgId === msg.id ? null : msg.id);
                              }}
                              className="p-1 rounded-lg text-slate-400 hover:text-[#005baa] hover:bg-slate-200/80 transition-colors cursor-pointer flex items-center justify-center"
                              title="ជម្រើសបន្ថែម (Options)"
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>

                            {/* Options Popup Menu */}
                            {activeMenuMsgId === msg.id && (
                              <div 
                                className={`absolute right-0 ${
                                  index >= Math.max(0, channelMessages.length - 3)
                                    ? 'bottom-full mb-1.5 origin-bottom-right'
                                    : 'top-full mt-1.5 origin-top-right'
                                } w-44 sm:w-48 bg-white/98 backdrop-blur-2xl rounded-2xl border border-slate-200 shadow-2xl p-1.5 z-50 animate-scale-up font-kantumruy select-none ring-1 ring-black/5`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {/* Quick Reactions inside Menu */}
                                <div className="flex items-center justify-between gap-1 p-1 bg-slate-50 rounded-xl mb-1 border border-slate-100">
                                  {QUICK_REACTIONS.slice(0, 6).map((emoji) => (
                                    <button
                                      key={emoji}
                                      type="button"
                                      onClick={() => {
                                        setActiveMenuMsgId(null);
                                        handleAddReaction(msg.id, emoji);
                                      }}
                                      className="w-5.5 h-5.5 hover:scale-125 transition-transform flex items-center justify-center cursor-pointer text-sm"
                                      title={`React ${emoji}`}
                                    >
                                      {emoji}
                                    </button>
                                  ))}
                                </div>

                                {/* Speak Voice Action in Menu */}
                                {msg.content && msg.content !== '🎙️ សារសំឡេង (Voice Note)' && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveMenuMsgId(null);
                                      handleSpeakMessage(msg.id, msg.content);
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-slate-700 hover:text-[#005baa] hover:bg-blue-50/80 transition-all flex items-center gap-2 cursor-pointer text-left"
                                  >
                                    <Volume2 className={`w-3.5 h-3.5 ${speakingMsgId === msg.id ? 'text-blue-600 animate-pulse' : 'text-slate-500'} flex-shrink-0`} />
                                    <span className="truncate">{speakingMsgId === msg.id ? 'បញ្ឈប់ការអាន' : 'អានសារជាសំឡេង'}</span>
                                  </button>
                                )}

                                {/* Copy Action */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleCopyMessage(msg.id, msg.content);
                                    setTimeout(() => setActiveMenuMsgId(null), 300);
                                  }}
                                  className="w-full px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-slate-700 hover:text-[#005baa] hover:bg-blue-50/80 transition-all flex items-center gap-2 cursor-pointer text-left"
                                >
                                  {copiedMsgId === msg.id ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                      <span className="text-emerald-600 font-bold">បានចម្លង!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                                      <span>ចម្លងសារ</span>
                                    </>
                                  )}
                                </button>

                                {/* Direct Message (if not me) */}
                                {!isMe && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveMenuMsgId(null);
                                      setChatType('direct');
                                      if (msg.sender_id) setActiveContactId(msg.sender_id);
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-slate-700 hover:text-[#005baa] hover:bg-blue-50/80 transition-all flex items-center gap-2 cursor-pointer text-left"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5 text-[#005baa] flex-shrink-0" />
                                    <span className="truncate">ផ្ញើសារផ្ទាល់</span>
                                  </button>
                                )}

                                {/* Owner: Delete Message Action */}
                                {isMe && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveMenuMsgId(null);
                                      handleDeleteMessage(msg.id);
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-rose-600 hover:bg-rose-50 transition-all flex items-center gap-2 cursor-pointer text-left"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                                    <span>លុបសារ</span>
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Message Card Bubble */}
                      <div className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed border transition-all ${
                        msg.is_duel_challenge 
                          ? 'bg-gradient-to-r from-amber-50 via-orange-50/60 to-yellow-50 border-amber-300 text-slate-900 shadow-xs' 
                          : isMe 
                            ? 'bg-blue-50/70 border-blue-200/90 text-slate-800 shadow-2xs'
                            : 'bg-white border-slate-200/90 text-slate-800 shadow-2xs'
                      }`}>
                        {/* 📷 Attached Image Photo */}
                        {msg.media_type === 'image' && msg.media_url && (
                          <div 
                            onClick={() => setActiveMediaPreview({ url: msg.media_url, type: 'image', name: msg.media_name || 'Photo' })}
                            className="rounded-2xl overflow-hidden shadow-xs my-1 max-w-sm sm:max-w-md bg-slate-950/5 border border-slate-200 cursor-pointer group/img relative"
                          >
                            <img
                              src={api.formatMediaUrl(msg.media_url)}
                              alt="Attached Photo"
                              loading="lazy"
                              className="w-full max-h-72 sm:max-h-80 object-cover rounded-2xl group-hover/img:scale-[1.02] transition-transform duration-200"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <span className="bg-black/60 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl backdrop-blur-sm flex items-center gap-1.5">
                                <Maximize2 className="w-3.5 h-3.5" />
                                <span>ចុចមើលរូបពេញ (Zoom)</span>
                              </span>
                            </div>
                          </div>
                        )}

                        {/* 🎥 Attached Video Player */}
                        {msg.media_type === 'video' && msg.media_url && (
                          <div className="rounded-2xl overflow-hidden shadow-sm my-1 max-w-sm sm:max-w-md bg-slate-950 border border-slate-200 relative">
                            <video
                              controls
                              preload="metadata"
                              src={api.formatMediaUrl(msg.media_url)}
                              className="w-full max-h-72 sm:max-h-80 rounded-2xl bg-black"
                            />
                          </div>
                        )}

                        {/* 🎙️ Voice Message Audio Note */}
                        {msg.media_type === 'audio' && msg.media_url && (
                          <VoiceMessagePlayer 
                            audioUrl={msg.media_url} 
                            duration={msg.media_duration} 
                            isMe={isMe} 
                          />
                        )}

                        {/* Animated GIF or Text Content */}
                        {isGifUrl(msg.content) ? (
                          <div className="rounded-2xl overflow-hidden shadow-xs my-0.5 max-w-sm sm:max-w-md bg-slate-950/5">
                            <img
                              src={msg.content ? msg.content.replaceAll('https://media.giphy.com/media/', 'https://i.giphy.com/media/') : ''}
                              alt="Animated GIF"
                              loading="lazy"
                              className="w-full max-h-60 sm:max-h-72 object-contain rounded-2xl hover:scale-[1.02] transition-transform duration-200 select-none"
                              onError={(e) => {
                                const cur = e.currentTarget.src;
                                if (cur.includes('media.giphy.com')) {
                                  e.currentTarget.src = cur.replace('media.giphy.com', 'i.giphy.com');
                                }
                              }}
                            />
                          </div>
                        ) : (
                          msg.content && msg.content !== '🎙️ សារសំឡេង (Voice Note)' && (
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          )
                        )}

                        {/* 1v1 Challenge Card Embed */}
                        {!!msg.is_duel_challenge && (
                          <div className="mt-3 p-3.5 rounded-2xl bg-white border border-amber-300 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-400 text-slate-950 font-black flex items-center justify-center shadow-xs text-lg">
                                ⚔️
                              </div>
                              <div>
                                <span className="text-[10px] font-black text-amber-700 uppercase font-cinzel block">
                                  LIVE 1V1 CHALLENGE
                                </span>
                                <span className="font-extrabold text-xs text-[#003366]">
                                  1v1 Speed Arena • Room #{msg.duel_room_code || '843730'}
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => onLaunchDuelGame?.()}
                              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-xs hover:scale-105 active:scale-95 transition-all border border-amber-400"
                            >
                              <Swords className="w-3.5 h-3.5" />
                              <span>ចូលរួមប្រកួត (ACCEPT 1V1)</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Reactions - Only display if there are active reactions */}
                      {reactions && Object.keys(reactions).length > 0 && Object.values(reactions).some(v => (Array.isArray(v) ? v.length > 0 : Number(v) > 0)) && (
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          {Object.entries(reactions).map(([emoji, userIds]) => {
                            const count = Array.isArray(userIds) ? userIds.length : (typeof userIds === 'number' ? userIds : 1);
                            if (count <= 0) return null;
                            const hasUserReacted = Array.isArray(userIds) ? userIds.map(String).includes(String(student?.id || 1)) : false;

                            return (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() => handleAddReaction(msg.id, emoji)}
                                className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs hover:scale-108 active:scale-95 transition-all ${
                                  hasUserReacted
                                    ? 'bg-blue-50/90 border-2 border-[#005baa] text-[#005baa] ring-2 ring-blue-300/40 shadow-xs'
                                    : 'bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700'
                                }`}
                                title={hasUserReacted ? 'ចុចដើម្បីដក Reaction នេះចេញ (Click to remove)' : `ចុចដើម្បី React ${emoji}`}
                              >
                                <span className="text-sm">{emoji}</span>
                                <span className={`font-cinzel font-extrabold text-[11px] ${hasUserReacted ? 'text-[#005baa]' : 'text-slate-600'}`}>{count}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                    </div>

                  </div>
                );
              })
            ) : chatType === 'global' ? (
              /* Clean Global Channel Empty State */
              <div className="h-full min-h-[320px] flex flex-col items-center justify-center text-center p-8 space-y-4 max-w-md mx-auto my-auto animate-fade-in">
                <div className="w-20 h-20 rounded-3xl bg-blue-50/80 border-2 border-blue-200 text-[#005baa] flex items-center justify-center shadow-xs">
                  <div className="scale-150">
                    {getChannelIcon(activeChannel.id, true)}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-extrabold text-[#003366] flex items-center justify-center gap-2">
                    <span>ស្វាគមន៍មកកាន់ {activeChannel.name}</span>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    នេះជាការចាប់ផ្តើមនៃប្រវត្តិសារក្នុងបន្ទប់នេះ។ ផ្ញើសារដំបូងរបស់អ្នកដើម្បីចាប់ផ្តើមជជែកជាមួយសិស្សានុសិស្សទូទាំងប្រទេស!
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setInputMessage('សួស្តីអ្នកទាំងអស់គ្នា! 👋 ✨')}
                    className="px-4 py-2 rounded-2xl bg-white hover:bg-blue-50 text-slate-700 hover:text-[#005baa] text-xs font-bold border border-slate-200 hover:border-blue-300 transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
                  >
                    <span className="text-base">👋</span>
                    <span>សួស្តីអ្នកទាំងអស់គ្នា!</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMessage('មានអ្នកណាអាចជួយពន្យល់មេរៀននេះបានទេ? 📚 💡')}
                    className="px-4 py-2 rounded-2xl bg-white hover:bg-blue-50 text-slate-700 hover:text-[#005baa] text-xs font-bold border border-slate-200 hover:border-blue-300 transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
                  >
                    <span className="text-base">📚</span>
                    <span>សួរសំណួរមេរៀន</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Clean Direct Message (DM) Empty State */
              <div className="h-full min-h-[320px] flex flex-col items-center justify-center text-center p-8 space-y-4 max-w-md mx-auto my-auto animate-fade-in">
                <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0 select-none shadow-md rounded-full bg-slate-900 border-2 border-blue-300">
                  <div className="w-[82%] h-[82%] rounded-full overflow-hidden bg-slate-900 shadow-xs border border-slate-300">
                    <img 
                      src={api.formatAvatarUrl(activeContact.avatar)} 
                      alt={activeContact.full_name} 
                      onError={(e) => { e.currentTarget.src = '/assets/anime/boys/boy_1.png'; }}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  {(activeContact.avatar_frame || activeContact.avatarFrame) && (
                    <img
                      src={activeContact.avatar_frame || activeContact.avatarFrame}
                      alt="Frame"
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none scale-120 drop-shadow-md z-10"
                    />
                  )}
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-extrabold text-[#003366] flex items-center justify-center gap-2">
                    <span>ការសន្ទនាផ្ទាល់ជាមួយ {activeContact.full_name || activeContact.username}</span>
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {activeContact.school || 'វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ'} • ផ្ញើសារដំបូងរបស់អ្នកទៅកាន់ {activeContact.full_name || activeContact.username}!
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setInputMessage(`សួស្តី ${activeContact.full_name || activeContact.username}! 👋`)}
                    className="px-4 py-2 rounded-2xl bg-white hover:bg-blue-50 text-slate-700 hover:text-[#005baa] text-xs font-bold border border-slate-200 hover:border-blue-300 transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
                  >
                    <span className="text-base">👋</span>
                    <span>សួស្តី!</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMessage('តោះជជែកគ្នាពីមេរៀនបន្តិច! 📚 💡')}
                    className="px-4 py-2 rounded-2xl bg-white hover:bg-blue-50 text-slate-700 hover:text-[#005baa] text-xs font-bold border border-slate-200 hover:border-blue-300 transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
                  >
                    <span className="text-base">📚</span>
                    <span>ជជែកមេរៀន</span>
                  </button>
                </div>
              </div>
            )}

            {/* Floating Scroll to Bottom Button */}
            {showScrollBottom && (
              <button
                type="button"
                onClick={() => scrollToBottom('smooth')}
                className="sticky bottom-3 float-right mr-1 p-2 sm:p-2.5 rounded-full bg-white/95 backdrop-blur-md hover:bg-blue-50 text-[#005baa] shadow-xl border border-slate-200 z-30 transition-all hover:scale-110 active:scale-95 cursor-pointer flex items-center gap-1 animate-bounce ring-2 ring-blue-500/20 text-xs font-bold font-kantumruy"
                title="ទៅកាន់សារចុងក្រោយ (Scroll to bottom)"
              >
                <ChevronDown className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#005baa]" />
                <span className="text-[10px] hidden sm:inline text-[#005baa]">សារថ្មី</span>
              </button>
            )}
          </div>

          {/* Input Bar Form */}
          <div className="bg-white border-t border-slate-200 p-1.5 sm:p-3 flex-shrink-0 relative z-30 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-xs w-full max-w-full overflow-hidden">
            <form onSubmit={handleSendMessage} className="flex items-center gap-1 sm:gap-2 relative w-full max-w-full">
              
              {/* 1. Native Clean Emoji / Reaction Trigger Button */}
              <div ref={emojiPickerRef} className="relative flex-shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEmojiPickerOpen(!isEmojiPickerOpen);
                    setIsGifPickerOpen(false);
                  }}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl transition-all cursor-pointer border shadow-2xs flex items-center justify-center flex-shrink-0 ${
                    isEmojiPickerOpen 
                      ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-400/40 shadow-md' 
                      : 'bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-amber-700 border-slate-200/90'
                  }`}
                  title="Emoji"
                >
                  <Smile className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                </button>

                {/* Emoji Picker Popover */}
                {isEmojiPickerOpen && (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-full left-0 mb-2 w-[calc(100vw-24px)] max-w-xs sm:max-w-sm bg-white/98 backdrop-blur-2xl rounded-2xl border border-slate-200 shadow-2xl p-3 z-50 animate-scale-up select-none ring-1 ring-black/5"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="font-extrabold text-xs text-[#003366] flex items-center gap-1.5">
                        <Smile className="w-4 h-4 text-amber-500" />
                        <span>EMOJI</span>
                      </span>
                      <button 
                        type="button"
                        onClick={() => setIsEmojiPickerOpen(false)}
                        className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Category Pills */}
                    <div className="flex items-center gap-1 py-1.5 overflow-x-auto no-scrollbar">
                      {EMOJI_CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setActiveEmojiCategory(cat.id)}
                          className={`px-2 py-0.5 rounded-lg text-[9.5px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                            activeEmojiCategory === cat.id
                              ? 'bg-[#005baa] text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-6 gap-1 pt-1 max-h-48 overflow-y-auto">
                      {EMOJI_CATEGORIES.find(c => c.id === activeEmojiCategory)?.emojis.map((emoji, eIdx) => (
                        <button
                          key={eIdx}
                          type="button"
                          onClick={() => handleInsertEmoji(emoji)}
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl hover:bg-blue-50 active:bg-blue-100 text-lg flex items-center justify-center cursor-pointer shadow-2xs border border-transparent hover:border-blue-200"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Dedicated GIF Picker Container (Desktop/Tablet) */}
              <div ref={gifPickerRef} className="relative flex-shrink-0 hidden sm:block">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsGifPickerOpen(!isGifPickerOpen);
                    setIsEmojiPickerOpen(false);
                  }}
                  className={`w-9 h-9 rounded-xl font-black text-xs transition-all cursor-pointer border shadow-2xs flex items-center justify-center gap-1 flex-shrink-0 ${
                    isGifPickerOpen 
                      ? 'bg-indigo-600 text-white border-indigo-500 ring-2 ring-indigo-400/40 shadow-md' 
                      : 'bg-slate-100 hover:bg-indigo-50 text-indigo-700 hover:text-indigo-900 border-slate-200/90'
                  }`}
                  title="GIF"
                >
                  <Film className="w-3.5 h-3.5" />
                </button>

                {/* GIF Picker Popover Window */}
                {isGifPickerOpen && (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-full left-0 sm:-left-20 mb-2 w-[calc(100vw-32px)] max-w-xs sm:max-w-[460px] bg-white/98 backdrop-blur-2xl rounded-2xl border border-slate-200 shadow-2xl p-3 z-50 animate-scale-up select-none ring-1 ring-black/5 font-kantumruy"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-cinzel font-black text-xs shadow-xs">
                          GIF
                        </div>
                        <span className="font-extrabold text-xs text-[#003366]">
                          រូបភាពចលនា GIF (60+ ផ្ទាំង)
                        </span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setIsGifPickerOpen(false)}
                        className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="relative my-2">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="ស្វែងរក GIF..."
                        value={gifSearchQuery}
                        onChange={(e) => setGifSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
                      />
                    </div>

                    <div className="flex items-center gap-1 py-1 overflow-x-auto no-scrollbar">
                      {GIF_CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setActiveGifCategory(cat.id)}
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                            activeGifCategory === cat.id
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {cat.nameKm}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 max-h-56 overflow-y-auto pr-1">
                      {filteredGifs.map((gif) => (
                        <div
                          key={gif.id}
                          onClick={() => handleSendGif(gif)}
                          className="group/gif relative h-24 rounded-2xl overflow-hidden bg-slate-900/10 border border-slate-200 hover:border-indigo-500 shadow-2xs hover:shadow-md cursor-pointer transition-all hover:scale-[1.02]"
                        >
                          <img
                            src={gif.url}
                            alt={gif.titleKm}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover/gif:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover/gif:opacity-100 transition-opacity flex items-end p-2">
                            <span className="text-[10px] font-bold text-white leading-tight truncate">
                              {gif.titleKm}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Image File Upload Input (Hidden) */}
              <input
                type="file"
                ref={imageInputRef}
                accept="image/*"
                onChange={(e) => handleSelectMediaFile(e, 'image')}
                className="hidden"
              />

              {/* 4. Video File Upload Input (Hidden) */}
              <input
                type="file"
                ref={videoInputRef}
                accept="video/*"
                onChange={(e) => handleSelectMediaFile(e, 'video')}
                className="hidden"
              />

              {/* Photo / Media Upload Button */}
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                disabled={isSending || isRecordingVoice}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 border border-slate-200/90 transition-all cursor-pointer flex items-center justify-center flex-shrink-0 disabled:opacity-40"
                title="Photo"
              >
                <ImageIcon className="w-4 h-4 text-emerald-600" />
              </button>

              {/* Video Upload Button (Tablet/Desktop) */}
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                disabled={isSending || isRecordingVoice}
                className="hidden sm:flex w-9 h-9 rounded-xl bg-slate-100 hover:bg-purple-50 text-slate-600 hover:text-purple-600 border border-slate-200/90 transition-all cursor-pointer flex-shrink-0 items-center justify-center disabled:opacity-40"
                title="Video"
              >
                <Video className="w-4 h-4 text-purple-600" />
              </button>

              {/* Live Voice Recording UI vs Text Input Box */}
              {isRecordingVoice ? (
                <div className="flex-1 min-w-0 flex items-center justify-between gap-1.5 bg-rose-50 border border-rose-200 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl animate-fade-in">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping flex-shrink-0" />
                    <span className="text-[11px] font-black text-rose-700 font-mono truncate">
                      REC {Math.floor(recordingDuration / 60)}:{recordingDuration % 60 < 10 ? '0' : ''}{recordingDuration % 60}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={cancelVoiceRecording}
                      className="px-2 py-1 rounded-lg bg-white text-rose-600 border border-rose-200 text-[10px] font-bold cursor-pointer"
                    >
                      បោះបង់
                    </button>

                    <button
                      type="button"
                      onClick={stopAndSendVoiceRecording}
                      className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[10px] font-bold cursor-pointer flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>ផ្ញើ</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder={chatType === 'global' ? `ផ្ញើសារចូល ${activeChannel.name}...` : `ផ្ញើសារ...`}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    disabled={isSending}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="sentences"
                    spellCheck="false"
                    className="flex-1 min-w-0 bg-slate-50 border border-slate-200 rounded-xl px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[16px] sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#005baa] focus:bg-white transition-all shadow-inner font-medium leading-tight"
                  />

                  {/* Mic Voice Record Button */}
                  <button
                    type="button"
                    onClick={startVoiceRecording}
                    disabled={isSending}
                    className="p-1.5 sm:px-2 sm:py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-rose-600 border border-slate-200/90 transition-all cursor-pointer flex-shrink-0"
                    title="ថតសំឡេង (Voice Note)"
                  >
                    <Mic className="w-4 h-4 text-rose-500" />
                  </button>

                  {/* Send Message Button (Always Visible!) */}
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isSending}
                    className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#005baa] via-[#004785] to-[#003366] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md active:scale-95 transition-all flex-shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    title="ផ្ញើសារ (Send Message)"
                  >
                    {isSending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">ផ្ញើ</span>
                      </>
                    )}
                  </button>
                </>
              )}
            </form>
          </div>

        </div>

      </div>

      {/* Fullscreen Media Preview Modal */}
      {activeMediaPreview && createPortal(
        <div 
          onClick={() => setActiveMediaPreview(null)}
          className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fade-in font-kantumruy"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col"
          >
            {/* Top Toolbar */}
            <div className="p-3 sm:p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 text-white">
              <span className="text-xs sm:text-sm font-bold truncate">
                {activeMediaPreview.name || 'Media Preview'}
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={api.formatMediaUrl(activeMediaPreview.url)}
                  download={activeMediaPreview.name || 'media-download'}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs transition-colors flex items-center gap-1.5"
                  title="ទាញយក (Download)"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">ទាញយក</span>
                </a>
                <button
                  type="button"
                  onClick={() => setActiveMediaPreview(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Media Content */}
            <div className="p-2 sm:p-4 overflow-auto flex items-center justify-center bg-black">
              {activeMediaPreview.type === 'video' ? (
                <video
                  controls
                  autoPlay
                  src={api.formatMediaUrl(activeMediaPreview.url)}
                  className="max-h-[75vh] w-auto max-w-full rounded-2xl"
                />
              ) : (
                <img
                  src={api.formatMediaUrl(activeMediaPreview.url)}
                  alt="Full Preview"
                  className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl"
                />
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
