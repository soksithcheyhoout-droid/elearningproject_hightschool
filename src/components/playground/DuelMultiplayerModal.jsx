import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';
import {
  Swords,
  Copy,
  Check,
  Play,
  RotateCcw,
  X,
  Volume2,
  VolumeX,
  Triangle,
  Diamond,
  Circle,
  Square,
  CheckCircle2,
  XCircle,
  Shield,
  Loader2,
  UserPlus,
  Share2,
  Search,
  Send,
  UserCheck,
  KeyRound,
  AlertTriangle,
  Clock,
  Zap,
  Sparkles,
  Trophy,
  Flame,
  LogOut,
  UserX,
  Crown,
  Radio,
  Users,
  Building2,
  LogIn,
  Atom,
  BookOpen,
  GraduationCap,
  Award,
  Layers,
  Target,
  Compass,
  Rocket
} from 'lucide-react';
import { useAuth, computeLevelData } from '../../context/AuthContext';
import { playSound } from '../../utils/audioEffects';
import { getRandomizedGameQuestions, fetchLiveExamQuestions } from '../../utils/gamePoolManager';
import api from '../../services/api';

// High-end Avatar with Frame Renderer
const PlayerAvatarWithFrame = ({ avatar, frame, name = '', size = 'md', className = '' }) => {
  const frameSrc = frame || null;
  const avatarSrc = avatar ? api.formatAvatarUrl(avatar) : null;

  const sizeClasses = {
    sm: 'w-11 h-11',
    md: 'w-14 h-14 sm:w-16 sm:h-16',
    lg: 'w-20 h-20 sm:w-24 sm:h-24',
    xl: 'w-24 h-24 sm:w-28 sm:h-28'
  };

  const dim = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`relative ${dim} flex items-center justify-center flex-shrink-0 isolate ${className}`}>
      {/* Circular Avatar / Silhouette */}
      <div className={`w-[82%] h-[82%] rounded-full overflow-hidden bg-slate-900 shadow-md flex items-center justify-center ${frameSrc ? '' : 'border border-slate-700'}`}>
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt={name || 'Avatar'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-slate-900 flex items-center justify-center text-slate-300 font-bold text-sm">
            {name ? name.trim().charAt(0).toUpperCase() : <Users className="w-1/2 h-1/2 text-slate-400" />}
          </div>
        )}
      </div>

      {/* Frame Overlay */}
      {frameSrc && (
        <img
          src={frameSrc}
          alt="Frame"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none scale-110 drop-shadow-md z-[1]"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      )}
    </div>
  );
};

// Bespoke Stream Mode Themes (Science, Social, Random Stream)
const STREAM_THEMES = {
  science: {
    id: 'science',
    nameKm: 'ថ្នាក់វិទ្យាសាស្ត្រពិត',
    titleKm: 'ថ្នាក់វិទ្យាសាស្ត្រពិត (Natural Science)',
    shortName: 'វិទ្យាសាស្ត្រពិត',
    subtitleKm: 'គណិតវិទ្យា, រូបវិទ្យា, គីមីវិទ្យា, ជីវវិទ្យា',
    icon: Atom,
    accentText: 'text-cyan-400',
    headerBadge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    headerIconBox: 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-400',
    glowBg: 'bg-cyan-500/20',
    boxBg: 'bg-gradient-to-br from-[#06182c]/95 via-[#081226]/95 to-[#040915]/95',
    boxBorder: 'border-cyan-500/40 shadow-cyan-950/50 ring-1 ring-cyan-500/20',
    badgeClass: 'text-cyan-300 bg-cyan-500/20 border-cyan-400/50 shadow-cyan-500/20',
    cardActive: 'bg-gradient-to-r from-cyan-950/90 via-indigo-950/90 to-blue-950/90 border-cyan-400/80 shadow-lg shadow-cyan-950/60 ring-2 ring-cyan-500/50 scale-[1.01]',
    cardInactive: 'bg-[#0a1226]/80 border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
  },
  social: {
    id: 'social',
    nameKm: 'ថ្នាក់វិទ្យាសាស្ត្រសង្គម',
    titleKm: 'ថ្នាក់វិទ្យាសាស្ត្រសង្គម (Social Science)',
    shortName: 'វិទ្យាសាស្ត្រសង្គម',
    subtitleKm: 'ភាសាខ្មែរ, ប្រវត្តិវិទ្យា, ភូមិវិទ្យា, សីលធម៌-ពលរដ្ឋ',
    icon: BookOpen,
    accentText: 'text-amber-400',
    headerBadge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    headerIconBox: 'bg-amber-500/20 border border-amber-500/40 text-amber-400',
    glowBg: 'bg-amber-500/20',
    boxBg: 'bg-gradient-to-br from-[#261505]/95 via-[#1a0f05]/95 to-[#0f0802]/95',
    boxBorder: 'border-amber-500/40 shadow-amber-950/50 ring-1 ring-amber-500/20',
    badgeClass: 'text-amber-300 bg-amber-500/20 border-amber-400/50 shadow-amber-500/20',
    cardActive: 'bg-gradient-to-r from-amber-950/90 via-rose-950/90 to-purple-950/90 border-amber-400/80 shadow-lg shadow-amber-950/60 ring-2 ring-amber-500/50 scale-[1.01]',
    cardInactive: 'bg-[#0a1226]/80 border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
  },
  random: {
    id: 'random',
    nameKm: 'សំណួរចម្រុះ / ចៃដន្យ',
    titleKm: 'សំណួរចម្រុះ / ចៃដន្យ (Random Stream)',
    shortName: 'សំណួរចម្រុះ',
    subtitleKm: 'ចម្រុះមុខវិជ្ជាវិទ្យាសាស្ត្រពិត & វិទ្យាសាស្ត្រសង្គម',
    icon: Sparkles,
    accentText: 'text-emerald-400',
    headerBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    headerIconBox: 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400',
    glowBg: 'bg-emerald-500/20',
    boxBg: 'bg-gradient-to-br from-[#062018]/95 via-[#061712]/95 to-[#030e0b]/95',
    boxBorder: 'border-emerald-500/40 shadow-emerald-950/50 ring-1 ring-emerald-500/20',
    badgeClass: 'text-emerald-300 bg-emerald-500/20 border-emerald-400/50 shadow-emerald-500/20',
    cardActive: 'bg-gradient-to-r from-emerald-950/90 via-teal-950/90 to-indigo-950/90 border-emerald-400/80 shadow-lg shadow-emerald-950/60 ring-2 ring-emerald-500/50 scale-[1.01]',
    cardInactive: 'bg-[#0a1226]/80 border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
  }
};

export default function DuelMultiplayerModal({ game, onClose, initialRoomCode = null, initialHost = null }) {
  const { student, addXP } = useAuth();
  const levelInfo = computeLevelData(student?.xp || 3568);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Flow Step: 'lobby' -> 'countdown' -> 'battle' -> 'results'
  const [currentStep, setCurrentStep] = useState('lobby');
  const [tab, setTab] = useState('host'); // Default to Matchup Lobby view
  const [joinCodeInput, setJoinCodeInput] = useState(initialRoomCode || '');
  const [roomCode, setRoomCode] = useState(() => initialRoomCode || Math.floor(100000 + Math.random() * 900000).toString());
  const [copied, setCopied] = useState(false);
  const [joinError, setJoinError] = useState('');
  const [isHost, setIsHost] = useState(!initialRoomCode);

  // Ready State Management
  const [isChallengerReady, setIsChallengerReady] = useState(false);
  const [hostWarningNotice, setHostWarningNotice] = useState('');

  // Rematch (Play Again) Synchronization State
  const [myRematchRequested, setMyRematchRequested] = useState(false);
  const [opponentRematchRequested, setOpponentRematchRequested] = useState(false);
  const [opponentLeftNotice, setOpponentLeftNotice] = useState('');

  // Real Database Registered Students
  const [realStudents, setRealStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Real-Time Match Invitation Sent Tracker & 5s Declined Cooldown
  const [invitedStudentsMap, setInvitedStudentsMap] = useState({}); // studentId -> 'pending' | 'accepted' | 'declined'
  const [declinedCooldowns, setDeclinedCooldowns] = useState({}); // studentId -> secondsRemaining (5s)

  // 5-Second Cooldown Timer for Declined Invites
  useEffect(() => {
    const hasActiveCooldown = Object.values(declinedCooldowns).some((val) => val > 0);
    if (!hasActiveCooldown) return;

    const cdTimer = setInterval(() => {
      setDeclinedCooldowns((prev) => {
        const next = { ...prev };
        let modified = false;
        Object.keys(next).forEach((k) => {
          if (next[k] > 1) {
            next[k] -= 1;
            modified = true;
          } else {
            delete next[k];
            modified = true;
            // Unblock student so the host can invite again!
            setInvitedStudentsMap((im) => {
              const copy = { ...im };
              delete copy[k];
              return copy;
            });
          }
        });
        return modified ? next : prev;
      });
    }, 1000);

    return () => clearInterval(cdTimer);
  }, [declinedCooldowns]);

  // Auto-expire pending invites after 20 seconds so host is never stuck
  useEffect(() => {
    const hasPending = Object.values(invitedStudentsMap).some((s) => s === 'pending');
    if (!hasPending) return;

    const timer = setTimeout(() => {
      setInvitedStudentsMap((prev) => {
        const next = { ...prev };
        let changed = false;
        Object.keys(next).forEach((k) => {
          if (next[k] === 'pending') {
            delete next[k];
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }, 20000);

    return () => clearTimeout(timer);
  }, [invitedStudentsMap]);

  // Invite Modal State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteSearch, setInviteSearch] = useState('');
  const [inviteFeedback, setInviteFeedback] = useState('');

  // Matchmaking Intro
  const [countdownNum, setCountdownNum] = useState(3);

  // Live Synchronized Players
  const [hostPlayer, setHostPlayer] = useState(() => {
    if (initialHost) return initialHost;
    if (initialRoomCode) return null;
    return {
      id: student?.id || null,
      name: student?.name || student?.fullName || student?.username || 'Student',
      username: student?.username || 'student',
      school: student?.school || 'វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ',
      province: student?.province || 'រាជធានីភ្នំពេញ',
      level: levelInfo?.level || student?.level || 1,
      xp: student?.xp || 500,
      avatar: student?.avatar || '/assets/anime/boys/boy_1.png',
      avatarFrame: student?.avatarFrame || student?.avatar_frame || '',
      isHost: true
    };
  });
  const [challengerPlayer, setChallengerPlayer] = useState(null);

  // Sync hostPlayer dynamically with current student profile
  useEffect(() => {
    if (isHost && student) {
      setHostPlayer({
        id: student?.id || null,
        name: student?.name || student?.fullName || student?.username || 'Student',
        username: student?.username || 'student',
        school: student?.school || 'វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ',
        province: student?.province || 'រាជធានីភ្នំពេញ',
        level: levelInfo?.level || student?.level || 1,
        xp: student?.xp || 500,
        avatar: api.formatAvatarUrl(student?.avatar),
        avatarFrame: student?.avatarFrame || student?.avatar_frame || '',
        isHost: true
      });
    }
  }, [isHost, student, student?.avatar, student?.avatarFrame, student?.avatar_frame, levelInfo?.level]);

  // Auto-close invite modal whenever challenger joins the room
  useEffect(() => {
    if (challengerPlayer) {
      setShowInviteModal(false);
      setInviteFeedback('');
    }
  }, [challengerPlayer]);

  // Stream Customization ('science' | 'social' | 'random')
  const [selectedStream, setSelectedStream] = useState(() => (student?.stream || game?.stream || 'science'));
  const currentTheme = STREAM_THEMES[selectedStream] || STREAM_THEMES.science;
  const CurrentStreamIcon = currentTheme.icon || Atom;

  // Synchronized Questions Pool (24-question deep pool)
  const [questions, setQuestions] = useState(() => getRandomizedGameQuestions(game, 24, '12', student?.stream || 'science'));
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);

  // First to 6 Correct Score Trackers
  const [hostCorrectCount, setHostCorrectCount] = useState(0);
  const [challengerCorrectCount, setChallengerCorrectCount] = useState(0);
  const [isOvertime, setIsOvertime] = useState(false);

  // Turn-Based Game State
  const [activeTurn, setActiveTurn] = useState('host'); // 'host' | 'challenger'
  const [turnStatus, setTurnStatus] = useState('playing'); // 'playing' | 'turn_ended'
  const [turnResult, setTurnResult] = useState(null); // { answeredBy, selectedIdx, isCorrect, scoreEarned }
  const [nextTurnCountdown, setNextTurnCountdown] = useState(3);
  const [secondsLeft, setSecondsLeft] = useState(15);

  const autoNextTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const hostKickedRef = useRef(false); // Tracks if host just kicked challenger (prevents poller re-firing)
  const lastProcessedTurnRef = useRef(null); // Prevents 700ms poller from restarting the 3-2-1 turn countdown

  const currentQ = (questions && questions[currentQIndex]) || (questions && questions[0]) || {
    q: 'គណនា lim (x → 2) (x² - 4) / (x - 2) = ?',
    options: ['0', '2', '4', '8'],
    answer: 2,
    explanation: '(x-2)(x+2)/(x-2) = x+2 => 4'
  };

  const isMyTurn = (isHost && activeTurn === 'host') || (!isHost && activeTurn === 'challenger');
  const activePlayerName = activeTurn === 'host' ? (hostPlayer?.name || 'ម្ចាស់បន្ទប់') : (challengerPlayer?.name || 'គូប្រជែង');
  const nextPlayerName = activeTurn === 'host' ? (challengerPlayer?.name || 'គូប្រជែង') : (hostPlayer?.name || 'ម្ចាស់បន្ទប់');

  const myCorrectCount = isHost ? hostCorrectCount : challengerCorrectCount;
  const opponentCorrectCount = isHost ? challengerCorrectCount : hostCorrectCount;

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Asynchronously enrich questions from 12,000 question bank
    let isSubscribed = true;
    const targetStream = (selectedGrade === '11' || selectedGrade === '12') ? selectedStream : 'general';
    fetchLiveExamQuestions({
      stream: targetStream === 'social' ? 'social' : 'science',
      grade: selectedGrade,
      limit: 24,
      random: true
    }).then((livePool) => {
      if (isSubscribed && Array.isArray(livePool) && livePool.length > 0) {
        setQuestions(livePool);
        if (isHost && roomCode) {
          api.createArenaRoom(roomCode, game?.id || 'sci-m-01', game?.subject || 'គណិតវិទ្យា', currentStudentPayload, livePool, selectedGrade, targetStream);
        }
      }
    });

    return () => {
      isSubscribed = false;
      document.body.style.overflow = '';
      clearTimeout(autoNextTimerRef.current);
      clearInterval(countdownIntervalRef.current);
      clearInterval(pollingIntervalRef.current);
    };
  }, []);

  // Format student payload for room registration
  const currentStudentPayload = {
    id: student?.id || null,
    name: student?.name || student?.fullName || student?.username || 'Student',
    username: student?.username || 'student',
    school: student?.school || 'វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ',
    province: student?.province || 'រាជធានីភ្នំពេញ',
    level: levelInfo?.level || student?.level || 1,
    xp: student?.xp || 500,
    avatar: api.formatAvatarUrl(student?.avatar),
    avatarFrame: student?.avatarFrame || student?.avatar_frame || '',
    isHost: isHost
  };



  // Switch to next turn & question
  const handleSwitchToNextTurn = useCallback(async () => {
    clearTimeout(autoNextTimerRef.current);
    clearInterval(countdownIntervalRef.current);

    // Win condition: Player must reach 6 correct answers
    if (hostCorrectCount >= 6 || challengerCorrectCount >= 6) {
      setCurrentStep('results');
      setMyRematchRequested(false);
      setOpponentRematchRequested(false);
      try {
        confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });
      } catch (e) { }
      addXP(myCorrectCount >= opponentCorrectCount ? (game?.xpReward ? game.xpReward + 350 : 500) : 150);
      return;
    }

    // Prepare next question
    let extra = [];
    if (currentQIndex + 1 >= questions.length) {
      extra = getRandomizedGameQuestions(game, 15, selectedGrade, selectedStream);
      setQuestions((prev) => [...prev, ...extra]);
    }

    const nextIdx = currentQIndex + 1;
    const nextActiveTurn = activeTurn === 'host' ? 'challenger' : 'host';
    setCurrentQIndex(nextIdx);
    setActiveTurn(nextActiveTurn);
    setTurnStatus('playing');
    setTurnResult(null);
    setSecondsLeft(15);
    setNextTurnCountdown(3);

    // Both Host & Challenger can invoke nextTurn with currentQIndex idempotency
    try {
      await api.nextTurn(roomCode, currentQIndex, extra);
    } catch (e) { }
  }, [currentQIndex, questions.length, activeTurn, roomCode, hostCorrectCount, challengerCorrectCount, myCorrectCount, opponentCorrectCount, addXP, game]);

  // Start 3-2-1 countdown after an answer is submitted (Guaranteed 1 execution per turn)
  const triggerTurnEndCountdown = useCallback((result) => {
    if (!result) return;

    // Deduplication check: Do NOT restart countdown if already processing this turn
    const turnKey = result.turnId || `${result.answeredBy}_${result.timestamp || ''}_${result.selectedIdx}`;
    if (lastProcessedTurnRef.current === turnKey) {
      return;
    }
    lastProcessedTurnRef.current = turnKey;

    setTurnStatus('turn_ended');
    setTurnResult(result);
    setNextTurnCountdown(3);

    if (typeof result.hostCorrectCount === 'number') {
      setHostCorrectCount(result.hostCorrectCount);
    }
    if (typeof result.challengerCorrectCount === 'number') {
      setChallengerCorrectCount(result.challengerCorrectCount);
    }

    clearInterval(countdownIntervalRef.current);
    clearTimeout(autoNextTimerRef.current);

    let countRemaining = 3;

    countdownIntervalRef.current = setInterval(() => {
      countRemaining -= 1;
      if (countRemaining >= 1) {
        setNextTurnCountdown(countRemaining);
      } else {
        clearInterval(countdownIntervalRef.current);
        setNextTurnCountdown(0);
      }
    }, 950);

    autoNextTimerRef.current = setTimeout(() => {
      handleSwitchToNextTurn();
    }, 3100);
  }, [handleSwitchToNextTurn]);

  // Start Actual Match Function
  const startMatch = (roomQuestions = null) => {
    clearTimeout(autoNextTimerRef.current);
    clearInterval(countdownIntervalRef.current);

    if (Array.isArray(roomQuestions) && roomQuestions.length > 0) {
      setQuestions(roomQuestions);
    }
    lastProcessedTurnRef.current = null;
    setCurrentQIndex(0);
    setActiveTurn('host');
    setTurnStatus('playing');
    setTurnResult(null);
    setMyScore(0);
    setOpponentScore(0);
    setHostCorrectCount(0);
    setChallengerCorrectCount(0);
    setIsOvertime(false);
    setMyRematchRequested(false);
    setOpponentRematchRequested(false);
    setOpponentLeftNotice('');
    setSecondsLeft(15);
    setNextTurnCountdown(3);
    setCurrentStep('battle');
  };

  // Start 3-2-1 Countdown Sequence
  const startCountdown = (roomQuestions = null) => {
    setCurrentStep('countdown');
    setCountdownNum(3);
    setMyRematchRequested(false);
    setOpponentRematchRequested(false);

    let count = 3;
    const timer = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdownNum(count);
      } else if (count === 0) {
        setCountdownNum('START!');
      } else {
        clearInterval(timer);
        startMatch(roomQuestions);
      }
    }, 950);
  };

  // Fetch ONLY real registered students who logged in with Gmail from database
  const fetchStudents = async () => {
    setLoadingStudents(true);
    try {
      const res = await api.getRegisteredStudents();
      if (res && Array.isArray(res.students)) {
        setRealStudents(res.students);
      } else {
        setRealStudents([]);
      }
    } catch (e) {
      console.warn('Failed to fetch real registered students:', e);
      setRealStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [showInviteModal]);

  // Real-Time Profile & Frame Sync Listener across tabs & users
  useEffect(() => {
    let bc = null;
    if (typeof BroadcastChannel !== 'undefined') {
      bc = new BroadcastChannel('khmer_elearn_profile_sync');
      bc.onmessage = () => {
        fetchStudents();
      };
    }
    return () => {
      if (bc) bc.close();
    };
  }, []);

  // Initialize Host Room or Auto-Join Incoming Invite Room in Backend
  useEffect(() => {
    if (initialRoomCode) {
      setIsHost(false);
      setTab('host');
      setRoomCode(initialRoomCode);
      setChallengerPlayer(currentStudentPayload);

      api.joinArenaRoom(initialRoomCode, currentStudentPayload)
        .then((res) => {
          if (res && res.success && res.room && res.room.status !== 'host_left' && !res.room.hostLeft && res.room.host) {
            if (res.room.host) setHostPlayer(res.room.host);
            if (res.room.challenger) setChallengerPlayer(res.room.challenger);
            if (res.room.grade) setSelectedGrade(String(res.room.grade));
            if (res.room.stream) setSelectedStream(res.room.stream);
            if (Array.isArray(res.room.questions) && res.room.questions.length > 0) {
              setQuestions(res.room.questions);
            }
          } else {
            setHostWarningNotice('ម្ចាស់បន្ទប់ (Admin) បានបោះបង់ ឬបិទការប្រកួតហើយ!');
            setTimeout(() => {
              if (typeof onClose === 'function') onClose();
            }, 1800);
          }
        })
        .catch(() => {
          setHostWarningNotice('ម្ចាស់បន្ទប់ (Admin) បានបោះបង់ ឬបិទការប្រកួតហើយ!');
          setTimeout(() => {
            if (typeof onClose === 'function') onClose();
          }, 1800);
        });
    } else if (isHost && student) {
      const initialPool = getRandomizedGameQuestions(game, 24, '12', selectedStream);
      setQuestions(initialPool);

      api.createArenaRoom(roomCode, game?.id || 'sci-m-01', game?.subject || 'គណិតវិទ្យា', currentStudentPayload, initialPool, '12', selectedStream)
        .then((res) => {
          if (res && res.room && res.room.host) {
            setHostPlayer(res.room.host);
          }
        });
    }
  }, [initialRoomCode]);

  // Real-Time Room State Poller (700ms continuous loop)
  useEffect(() => {
    if (!roomCode) return;

    let isMounted = true;
    const interval = setInterval(async () => {
      try {
        const res = await api.getArenaRoom(roomCode);
        if (!isMounted) return;

        // 1. Host has closed / canceled the room or not found
        if (!res || !res.room || res.canceled || res.error || (res.room && (res.room.status === 'host_left' || res.room.hostLeft || !res.room.host))) {
          if (!isHost) {
            setChallengerPlayer(null);
            setHostWarningNotice('ម្ចាស់បន្ទប់ (Admin) បានបោះបង់ ឬបិទការប្រកួតហើយ!');
            setTimeout(() => {
              if (typeof onClose === 'function') onClose();
            }, 1200);
            return;
          }
        }

        if (!res || !res.room) return;
        const room = res.room;

        // Synchronize Host & Challenger
        if (!isHost && room.host) setHostPlayer(room.host);
        if (!isHost && room.stream) setSelectedStream(room.stream);

        if (isHost) {
          if (room.challenger) {
            setChallengerPlayer(room.challenger);
            hostKickedRef.current = false;
            setShowInviteModal(false);
            setInviteFeedback('');
          } else if (room.status === 'waiting' || room.challengerLeft || !room.challenger) {
            if (!hostKickedRef.current) {
              setChallengerPlayer(null);
              setIsChallengerReady(false);
            }
          }
        } else {
          if (room.challenger) {
            setChallengerPlayer(room.challenger);
          }
        }

        if (typeof room.challengerReady === 'boolean') {
          setIsChallengerReady(room.challengerReady);
          if (room.challengerReady) setHostWarningNotice('');
        }

        // Rematch request sync
        const opRematch = isHost ? !!room.challengerRematch : !!room.hostRematch;
        setOpponentRematchRequested(opRematch);

        // Check if current user was kicked — close the entire modal
        if (!isHost && room.kickedStudentId && (room.kickedStudentId === student?.id || room.kickedStudentId === student?.username)) {
          setChallengerPlayer(null);
          if (typeof onClose === 'function') onClose();
          return;
        }

        // Check if opponent left
        if ((room.status === 'opponent_left' || room.challengerLeft || (isHost && !room.challenger && currentStep !== 'lobby')) && !hostKickedRef.current) {
          setChallengerPlayer(null);
          setIsChallengerReady(false);
          setMyRematchRequested(false);
          setOpponentRematchRequested(false);
          if (currentStep === 'battle' || currentStep === 'countdown') {
            setCurrentStep('lobby');
          }
          setOpponentLeftNotice('គូប្រជែងបានចាកចេញពីបន្ទប់ប្រកួតហើយ');
          setTimeout(() => {
            setOpponentLeftNotice('');
          }, 3500);
        }

        // Rematch launched by both agreeing
        if (currentStep === 'results' && room.status === 'countdown') {
          startCountdown(room.questions);
        }

        // Synchronize Questions pool for Challenger
        if (!isHost && Array.isArray(room.questions) && room.questions.length > 0) {
          setQuestions(room.questions);
        }

        // Synchronize Scores & Correct Counts
        if (isHost) {
          if (typeof room.challengerScore === 'number') setOpponentScore(room.challengerScore);
        } else {
          if (typeof room.hostScore === 'number') setOpponentScore(room.hostScore);
        }
        if (typeof room.hostCorrectCount === 'number') setHostCorrectCount(room.hostCorrectCount);
        if (typeof room.challengerCorrectCount === 'number') setChallengerCorrectCount(room.challengerCorrectCount);
        if (typeof room.isOvertime === 'boolean') setIsOvertime(room.isOvertime);

        // Automatic start trigger for Challenger in lobby
        if (!isHost && currentStep === 'lobby' && (room.status === 'countdown' || room.status === 'battle')) {
          startCountdown(room.questions);
        }

        // Synchronize Turn Result when other player finishes their turn
        if (currentStep === 'battle') {
          if (room.turnStatus === 'turn_ended' && room.turnResult) {
            triggerTurnEndCountdown(room.turnResult);
          }

          // Advance turn on challenger when host progresses
          if (!isHost && typeof room.currentQIndex === 'number' && room.currentQIndex > currentQIndex) {
            setCurrentQIndex(room.currentQIndex);
            setActiveTurn(room.activeTurn || 'host');
            setTurnStatus('playing');
            setTurnResult(null);
            setSecondsLeft(15);
            setNextTurnCountdown(3);
          }

          // Synchronize match finished
          if (!isHost && room.status === 'results') {
            setCurrentStep('results');
          }
        }

        // Check outgoing invite statuses if in Host mode
        if (isHost && showInviteModal && !room.challenger) {
          const invRes = await api.getRoomInviteStatus(roomCode);
          if (invRes && Array.isArray(invRes.invites)) {
            const map = {};
            invRes.invites.forEach((inv) => {
              if (inv.status === 'accepted') {
                map[inv.toStudentId] = 'accepted';
                setShowInviteModal(false);
                setInviteFeedback('');
              } else if (inv.status === 'declined') {
                if (declinedCooldowns[inv.toStudentId] === undefined || declinedCooldowns[inv.toStudentId] > 0) {
                  map[inv.toStudentId] = 'declined';
                  setDeclinedCooldowns((prev) => {
                    if (typeof prev[inv.toStudentId] !== 'number') {
                      return { ...prev, [inv.toStudentId]: 5 };
                    }
                    return prev;
                  });
                }
              } else if (inv.status === 'pending') {
                map[inv.toStudentId] = 'pending';
              }
            });
            setInvitedStudentsMap(map);
          }
        }
      } catch (e) { }
    }, 700);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [roomCode, isHost, currentStep, currentQIndex, showInviteModal, student, triggerTurnEndCountdown, declinedCooldowns, onClose]);

  // Host Switches Stream Mode ('science' | 'social' | 'random')
  const handleSelectStream = async (newStream) => {
    if (!isHost) return;
    if (soundEnabled) playSound.click();
    setSelectedStream(newStream);

    const freshQuestions = getRandomizedGameQuestions(game, 24, '12', newStream);
    setQuestions(freshQuestions);

    try {
      await api.updateArenaRoom(roomCode, {
        stream: newStream,
        questions: freshQuestions
      });
    } catch (e) {}
  };

  // Join Existing Room
  const handleJoinWithCode = async () => {
    const cleanCode = joinCodeInput.trim().toUpperCase().replace('#', '');
    if (cleanCode.length < 4) {
      setJoinError('សូមបញ្ចូលលេខកូដបន្ទប់ឱ្យបានត្រឹមត្រូវ');
      return;
    }

    setJoinError('');
    try {
      const res = await api.joinArenaRoom(cleanCode, currentStudentPayload);
      if (res && res.success && res.room) {
        setRoomCode(cleanCode);
        setIsHost(false);
        setIsChallengerReady(false);
        setHostPlayer(res.room.host);
        setChallengerPlayer(currentStudentPayload);
        if (Array.isArray(res.room.questions) && res.room.questions.length > 0) {
          setQuestions(res.room.questions);
        }
        setTab('host');
        if (soundEnabled) playSound.click();
      } else {
        setJoinError(res?.error || 'រកមិនឃើញបន្ទប់ប្រកួតនេះទេ');
      }
    } catch (err) {
      setJoinError('មិនអាចភ្ជាប់ទៅកាន់បន្ទប់បានទេ');
    }
  };

  // Challenger Toggles Ready State
  const handleToggleReady = async () => {
    const nextVal = !isChallengerReady;
    setIsChallengerReady(nextVal);
    if (soundEnabled) playSound.click();
    try {
      await api.updateArenaRoom(roomCode, { challengerReady: nextVal });
    } catch (e) { }
  };

  // Admin Kicks Challenger
  const handleKickChallenger = async () => {
    if (!challengerPlayer || !isHost) return;
    const kickedId = challengerPlayer.id;
    if (soundEnabled) playSound.wrong();
    hostKickedRef.current = true; // Flag so poller doesn't re-fire opponent-left
    try {
      await api.kickChallenger(roomCode, kickedId);
    } catch (e) { }
    setChallengerPlayer(null);
    setIsChallengerReady(false);

    // Fully reset ALL invite tracking state
    setInvitedStudentsMap({});
    setDeclinedCooldowns({});
    setShowInviteModal(false);
    setInviteFeedback('');

    // Clear localStorage invites for this room
    try {
      const active = JSON.parse(localStorage.getItem('khmer_elearn_invites') || '[]');
      const cleaned = active.filter(i => i.roomCode !== roomCode);
      localStorage.setItem('khmer_elearn_invites', JSON.stringify(cleaned));
    } catch (e) { }

    setHostWarningNotice('បានបណ្តេញគូប្រជែងចេញពីបន្ទប់ប្រកួតរួចរាល់');
    setTimeout(() => setHostWarningNotice(''), 3000);
  };

  // Send Match Invitation with Real-Time Approval
  const handleSendInvite = async (user) => {
    if (soundEnabled) playSound.click();
    hostKickedRef.current = false; // Reset kick flag — we're inviting again
    setInvitedStudentsMap((prev) => ({ ...prev, [user.id]: 'pending' }));
    setDeclinedCooldowns((prev) => {
      const copy = { ...prev };
      delete copy[user.id];
      return copy;
    });
    setInviteFeedback(`បានផ្ញើការអញ្ជើញទៅកាន់ ${user.full_name || user.username}... កំពុងរង់ចាំការយល់ព្រម`);

    try {
      await api.sendMatchInvite(
        currentStudentPayload,
        user.id,
        roomCode,
        game?.subject || 'គណិតវិទ្យា',
        game?.titleKm || '1v1 Academic Arena'
      );
    } catch (e) { }
  };

  // Cancel Sent Match Invitation
  const handleCancelInvite = async (user) => {
    if (soundEnabled) playSound.click();
    setInvitedStudentsMap((prev) => {
      const copy = { ...prev };
      delete copy[user.id];
      return copy;
    });
    setInviteFeedback(`បានបោះបង់ការអញ្ជើញទៅកាន់ ${user.full_name || user.username}`);
    setTimeout(() => setInviteFeedback(''), 2500);

    try {
      await api.cancelMatchInvite(roomCode, user.id);
    } catch (e) {}
  };

  // Host Triggers Duel with Ready Validation
  const handleStartDuel = async () => {
    if (!challengerPlayer) {
      setHostWarningNotice(`សូមអញ្ជើញគូប្រជែង ឬចែករំលែកលេខកូដ #${roomCode} ឱ្យមិត្តភក្តិចូលរួមជាមុនសិន!`);
      setShowInviteModal(true);
      return;
    }

    if (!isChallengerReady) {
      if (soundEnabled) playSound.wrong();
      setHostWarningNotice('គូប្រជែងមិនទាន់បានចុច "រួចរាល់ (Ready)" នៅឡើយទេ។ សូមរង់ចាំគូប្រជែងត្រៀមខ្លួនរួចរាល់ជាមុនសិន!');
      return;
    }

    setHostWarningNotice('');
    await api.updateArenaRoom(roomCode, { status: 'countdown', activeTurn: 'host' });
    startCountdown();
  };

  // Player Requests / Accepts Rematch
  const handleRequestRematch = async () => {
    setMyRematchRequested(true);
    if (soundEnabled) playSound.click();

    const freshQuestions = getRandomizedGameQuestions(game, 12);
    try {
      const res = await api.requestArenaRematch(roomCode, isHost, freshQuestions);
      if (res && res.bothReady) {
        startCountdown(freshQuestions);
      }
    } catch (e) { }
  };

  // Player Leaves Room & Closes Modal Window
  const handleCloseModal = async () => {
    if (soundEnabled) playSound.click();
    try {
      await api.leaveArenaRoom(roomCode, student?.id, student?.username);
      await api.cancelMatchInvite(roomCode);
    } catch (e) { }

    // Broadcast cancel match to any invited students tabs
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const bc = new BroadcastChannel('khmer_elearn_arena_channel');
        bc.postMessage({ type: 'CANCEL_INVITE', roomCode });
      } catch (e) {}
    }

    // Full state cleanup
    setChallengerPlayer(null);
    setIsChallengerReady(false);
    setMyRematchRequested(false);
    setOpponentRematchRequested(false);
    setInvitedStudentsMap({});
    setDeclinedCooldowns({});
    setShowInviteModal(false);
    setInviteFeedback('');
    setHostWarningNotice('');

    // Clear localStorage invites for this room
    try {
      const active = JSON.parse(localStorage.getItem('khmer_elearn_invites') || '[]');
      const cleaned = active.filter(i => i.roomCode !== roomCode);
      localStorage.setItem('khmer_elearn_invites', JSON.stringify(cleaned));
    } catch (e) { }

    if (typeof onClose === 'function') {
      onClose();
    }
  };

  // Player Leaves Match & Returns to Lobby
  const handleLeaveArenaRoom = async () => {
    if (soundEnabled) playSound.click();
    try {
      await api.leaveArenaRoom(roomCode, student?.id, student?.username);
    } catch (e) { }

    // Full state cleanup
    setChallengerPlayer(null);
    setIsChallengerReady(false);
    setMyRematchRequested(false);
    setOpponentRematchRequested(false);
    setInvitedStudentsMap({});
    setDeclinedCooldowns({});
    setShowInviteModal(false);
    setInviteFeedback('');
    setHostWarningNotice('');
    setOpponentLeftNotice('');

    // Clear localStorage invites for this room
    try {
      const active = JSON.parse(localStorage.getItem('khmer_elearn_invites') || '[]');
      const cleaned = active.filter(i => i.roomCode !== roomCode);
      localStorage.setItem('khmer_elearn_invites', JSON.stringify(cleaned));
    } catch (e) { }

    setCurrentStep('lobby');
    setTab('host');
  };

  // Timeout handler for 15s round - RUNS ONLY ON ACTIVE PLAYER'S BROWSER
  const handleRoundTimeout = useCallback(() => {
    if (turnStatus === 'turn_ended' || currentStep !== 'battle' || !isMyTurn) return;

    const now = Date.now();
    const timeoutResult = {
      turnId: `turn_to_${now}_${activeTurn}`,
      answeredBy: activeTurn,
      selectedIdx: -1,
      isCorrect: false,
      scoreEarned: 0,
      isTimeout: true,
      hostCorrectCount,
      challengerCorrectCount,
      timestamp: now
    };

    try {
      api.submitTurnAnswer(roomCode, isHost, -1, false, 0, true);
    } catch (e) { }

    triggerTurnEndCountdown(timeoutResult);
  }, [turnStatus, currentStep, isMyTurn, activeTurn, hostCorrectCount, challengerCorrectCount, roomCode, isHost, triggerTurnEndCountdown]);

  // Question Timer (15s) - ONLY RUNS WHEN IT'S THIS PLAYER'S TURN
  useEffect(() => {
    if (currentStep !== 'battle' || turnStatus === 'turn_ended' || !isMyTurn) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleRoundTimeout();
          return 0;
        }
        if (prev <= 4 && soundEnabled) {
          playSound.timerWarning();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentStep, currentQIndex, turnStatus, isMyTurn, handleRoundTimeout, soundEnabled]);

  // Active Player clicks an answer option
  const handleSelectOption = async (idx) => {
    if (!isMyTurn || turnStatus === 'turn_ended' || currentStep !== 'battle') return;

    const isCorrect = idx === currentQ.answer;
    let pointsEarned = 0;

    let nextHostCorrect = hostCorrectCount;
    let nextChallengerCorrect = challengerCorrectCount;

    if (isCorrect) {
      pointsEarned = 600 + secondsLeft * 25;
      setMyScore((prev) => prev + pointsEarned);

      if (isHost) {
        nextHostCorrect += 1;
        setHostCorrectCount(nextHostCorrect);
      } else {
        nextChallengerCorrect += 1;
        setChallengerCorrectCount(nextChallengerCorrect);
      }
    }

    const now = Date.now();
    const result = {
      turnId: `turn_ans_${now}_${isHost ? 'host' : 'chal'}_${idx}`,
      answeredBy: isHost ? 'host' : 'challenger',
      selectedIdx: idx,
      isCorrect,
      scoreEarned: pointsEarned,
      isTimeout: false,
      hostCorrectCount: nextHostCorrect,
      challengerCorrectCount: nextChallengerCorrect,
      timestamp: now
    };

    // Immediately trigger evaluation & 3-2-1 countdown on this client
    triggerTurnEndCountdown(result);

    // Sync turn result with backend room
    try {
      await api.submitTurnAnswer(roomCode, isHost, idx, isCorrect, pointsEarned, false);
    } catch (e) { }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`http://localhost:5173/?room=${roomCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(`ចូលរួមប្រកួត 1v1 Academic Arena ក្នុងបន្ទប់ #${roomCode}`);
    const url = encodeURIComponent(`http://localhost:5173/?room=${roomCode}`);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(`http://localhost:5173/?room=${roomCode}`);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const BUTTON_CONFIGS = [
    { num: '1', badge: 'bg-indigo-600/30 border-indigo-400/60 text-indigo-200', icon: Triangle },
    { num: '2', badge: 'bg-cyan-600/30 border-cyan-400/60 text-cyan-200', icon: Diamond },
    { num: '3', badge: 'bg-amber-600/30 border-amber-400/60 text-amber-200', icon: Circle },
    { num: '4', badge: 'bg-emerald-600/30 border-emerald-400/60 text-emerald-200', icon: Square }
  ];

  // Filter available registered students (Excludes ONLY the current logged-in student)
  const filteredStudents = realStudents.filter((u) => {
    const currentId = student?.id;
    const currentUsername = (student?.username || student?.nickname || '').trim().toLowerCase();
    const currentEmail = (student?.email || '').trim().toLowerCase();
    const currentName = (student?.full_name || student?.fullName || student?.name || '').trim().toLowerCase();

    const uId = u.id;
    const uUsername = (u.username || u.nickname || '').trim().toLowerCase();
    const uEmail = (u.email || '').trim().toLowerCase();
    const uName = (u.full_name || u.name || '').trim().toLowerCase();

    // Check if u is the current user (by ID, username, email, or full name)
    const isSelf = (currentId && uId && String(currentId) === String(uId)) ||
      (currentUsername && uUsername && currentUsername === uUsername) ||
      (currentEmail && uEmail && currentEmail === uEmail) ||
      (currentName && uName && currentName === uName) ||
      (student?.studentId && u.student_id && String(student.studentId) === String(u.student_id));

    const query = inviteSearch.trim().toLowerCase();
    if (!query) return !isSelf;
    return !isSelf && (
      uName.includes(query) ||
      uUsername.includes(query) ||
      uEmail.includes(query) ||
      (u.school && u.school.toLowerCase().includes(query))
    );
  });

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-0 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-xl animate-fade-in font-kantumruy overflow-y-auto">
      
      {/* Main Container: Full-screen on mobile, frosted card on desktop */}
      <div className="bg-[#0b1120]/95 border-0 sm:border border-slate-700/60 rounded-none sm:rounded-3xl w-full max-w-4xl h-[100dvh] sm:h-auto sm:max-h-[92vh] flex flex-col shadow-[0_25px_80px_rgba(0,0,0,0.85)] overflow-hidden text-slate-100 relative my-auto">
        
        {/* Subtle Dynamic Ambient Glows */}
        <div className={`absolute -top-32 -left-32 w-80 h-80 rounded-full blur-[100px] pointer-events-none transition-colors duration-500 ${currentTheme.glowBg}`} />
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />

        {/* Header */}
        <header className="px-3 sm:px-5 md:px-7 py-2.5 sm:py-3.5 bg-[#080d1a]/85 backdrop-blur-md border-b border-slate-800 flex items-center justify-between flex-shrink-0 gap-2 sm:gap-3 relative z-10 transition-colors duration-300">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm transition-all duration-300 ${currentTheme.headerIconBox}`}>
              <Swords className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors duration-300 ${currentTheme.accentText}`}>
                  <span className="hidden sm:inline">1v1 Arena • First to 6 Correct</span>
                  <span className="sm:hidden">1v1 Arena</span>
                </span>
                <span className={`text-[9px] sm:text-[10px] px-2 sm:px-2.5 py-0.5 rounded-full font-bold border transition-all duration-300 flex items-center gap-1 sm:gap-1.5 shadow-xs ${currentTheme.headerBadge}`}>
                  <CurrentStreamIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                  <span className="truncate">{currentTheme.shortName}</span>
                </span>
                {isOvertime && (
                  <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40 animate-pulse flex items-center gap-1">
                    OT
                  </span>
                )}
              </div>
              <h2 className="text-xs sm:text-base md:text-lg font-black text-white leading-tight truncate mt-0.5">
                <span className="hidden sm:inline">
                  {selectedStream === 'social'
                    ? 'សង្វៀនប្រឡងវិទ្យាសាស្ត្រសង្គម (Social Science Arena)'
                    : selectedStream === 'random'
                      ? 'សង្វៀនប្រកួតសំណួរចម្រុះ (Random Academic Arena)'
                      : (game?.titleKm || 'សង្វៀនប្រឡងវិទ្យាសាស្ត្រពិត (Science Arena)')}
                </span>
                <span className="sm:hidden">
                  {selectedStream === 'social'
                    ? 'សង្វៀនសង្គមវិទ្យា'
                    : selectedStream === 'random'
                      ? 'សង្វៀនសំណួរចម្រុះ'
                      : 'សង្វៀនវិទ្យាសាស្ត្រ'}
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {currentStep === 'battle' && (
              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center font-mono font-black text-[11px] sm:text-xs border ${
                secondsLeft <= 4 
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse' 
                  : 'bg-slate-800 text-slate-200 border-slate-700'
              }`}>
                {secondsLeft}s
              </div>
            )}

            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 flex items-center justify-center transition-all cursor-pointer shadow-xs"
              title="Toggle Audio"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />}
            </button>

            <button
              type="button"
              onClick={handleCloseModal}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-700/80 hover:border-rose-500/40 flex items-center justify-center transition-all cursor-pointer shadow-xs"
              title="Leave Room & Close"
            >
              <X className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* STEP 1: MATCH LOBBY & STAGING */}
        {/* ========================================================================= */}
        {currentStep === 'lobby' && (
          <div className="p-4 sm:p-7 md:p-8 flex-1 flex flex-col justify-between overflow-y-auto space-y-6 animate-fade-in relative z-10">
            
            {/* Unified Control Bar: PIN + Share Actions + Tab Toggle */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0e1628] p-3 sm:p-3.5 rounded-2xl border border-slate-800 shadow-sm">
              
              {/* PIN Code Pill & Copy Actions */}
              <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(roomCode);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 hover:border-amber-400/60 text-xs font-mono transition-all cursor-pointer group shadow-xs"
                  title="ចុចដើម្បីចម្លងលេខកូដ"
                >
                  <span className="text-slate-400 font-sans text-xs font-semibold">PIN:</span>
                  <strong className="text-amber-300 font-black tracking-wider text-sm">#{roomCode}</strong>
                  <span className="text-[10px] text-amber-400/80 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 group-hover:bg-amber-400/20 font-sans">
                    {copied ? 'បានចម្លង' : 'Copy'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{copied ? 'បានចម្លង' : 'Copy Link'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleShareTelegram}
                    className="p-1.5 rounded-xl bg-[#229ED9]/15 hover:bg-[#229ED9]/25 text-[#229ED9] border border-[#229ED9]/30 transition-all cursor-pointer hover:scale-105 shadow-xs"
                    title="Share to Telegram"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleShareFacebook}
                    className="p-1.5 rounded-xl bg-[#1877F2]/15 hover:bg-[#1877F2]/25 text-[#1877F2] border border-[#1877F2]/30 transition-all cursor-pointer hover:scale-105 shadow-xs"
                    title="Share to Facebook"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Tab Switcher: Host vs Join */}
              <div className="flex items-center p-1 rounded-xl bg-[#080d1a] border border-slate-800 w-full sm:w-auto shadow-inner">
                <button
                  type="button"
                  onClick={() => setTab('host')}
                  className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    tab === 'host'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  បន្ទប់ប្រកួត (Lobby)
                </button>

                <button
                  type="button"
                  onClick={() => setTab('join')}
                  className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    tab === 'join'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ចូលរួម (Join PIN)
                </button>
              </div>

            </div>

            {/* TAB: JOIN BY PIN */}
            {tab === 'join' && (
              <div className="bg-[#0e1628] p-6 sm:p-8 rounded-3xl border border-slate-800 max-w-md mx-auto w-full space-y-4 shadow-lg my-auto">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto mb-2">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-black text-white">ចូលរួមបន្ទប់ប្រកួត (Join Game)</h3>
                  <p className="text-xs text-slate-400">បញ្ចូលលេខកូដសម្ងាត់ ៦ ខ្ទង់ដែលបានចែករំលែកដោយមិត្តភក្តិ</p>
                </div>

                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={6}
                      value={joinCodeInput}
                      onChange={(e) => {
                        setJoinCodeInput(e.target.value.trim());
                        setJoinError('');
                      }}
                      placeholder="ឧ. 123456"
                      className="w-full bg-[#080d1a] border-2 border-slate-700 focus:border-indigo-500 rounded-2xl px-4 py-3.5 text-center text-xl font-mono font-black text-amber-300 placeholder:text-slate-600 tracking-widest outline-none shadow-inner"
                    />
                  </div>

                  {joinError && (
                    <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold text-center flex items-center justify-center gap-1.5 animate-fade-in">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{joinError}</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const text = await navigator.clipboard.readText();
                          if (text) {
                            const cleaned = text.replace(/[^0-9]/g, '').slice(0, 6);
                            setJoinCodeInput(cleaned);
                          }
                        } catch (e) { }
                      }}
                      className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                    >
                      បិទភ្ជាប់កូដពី Clipboard (Paste Code)
                    </button>
                  </div>
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={handleJoinWithCode}
                    className="cyber-start-btn active:scale-98"
                    title="Join Match"
                  >
                    <div className="cyber-clip">
                      <div className="cyber-corner cyber-leftTop" />
                      <div className="cyber-corner cyber-rightTop" />
                      <div className="cyber-corner cyber-leftBottom" />
                      <div className="cyber-corner cyber-rightBottom" />
                    </div>
                    <div className="cyber-arrow cyber-leftArrow" />
                    <div className="cyber-arrow cyber-rightArrow" />
                    <span className="relative z-10 flex items-center justify-center gap-2 font-black text-sm tracking-wider">
                      <LogIn className="w-4 h-4 text-cyan-300" />
                      <span>ចូលរួមការប្រកួត (JOIN MATCH)</span>
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB: HOST / 1v1 MATCHUP CARDS */}
            {tab === 'host' && (
              <div className="space-y-6 my-auto">
                
                {/* Stream Selection Box (3 Stream Modes: Science, Social, Random) */}
                <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 shadow-xl relative overflow-hidden space-y-3.5 ${currentTheme.boxBg} ${currentTheme.boxBorder}`}>
                  
                  {/* Dynamic Ambient Background Glow */}
                  <div className={`absolute -right-16 -bottom-16 w-56 h-56 rounded-full blur-[80px] pointer-events-none opacity-40 transition-colors duration-500 ${currentTheme.glowBg}`} />

                  {/* Top Title */}
                  <div className="flex items-center justify-between gap-2.5 relative z-10">
                    <div className="flex items-center gap-2">
                      <CurrentStreamIcon className={`w-4 h-4 transition-colors duration-300 ${currentTheme.accentText}`} />
                      <span className="text-xs font-bold text-slate-200">
                        ជ្រើសរើសផ្នែកប្រកួត (Stream Mode):
                      </span>
                      <span className={`text-xs font-black px-2.5 py-1 rounded-xl border transition-all duration-300 flex items-center gap-1.5 shadow-sm ${currentTheme.badgeClass}`}>
                        <CurrentStreamIcon className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{currentTheme.nameKm}</span>
                      </span>
                    </div>
                  </div>

                  {/* 3 Stream Selection Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 relative z-10">
                    
                    {/* 1. Science Stream */}
                    <button
                      type="button"
                      disabled={!isHost}
                      onClick={() => handleSelectStream('science')}
                      className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between gap-2.5 ${
                        selectedStream === 'science'
                          ? STREAM_THEMES.science.cardActive
                          : STREAM_THEMES.science.cardInactive
                      } ${!isHost ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center flex-shrink-0 shadow-inner">
                          <Atom className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-xs font-black text-white truncate flex items-center gap-1">
                            <span>វិទ្យាសាស្ត្រពិត</span>
                            {selectedStream === 'science' && <span className="text-[8px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">ជ្រើស</span>}
                          </h5>
                          <p className="text-[9.5px] text-slate-300 truncate">គណិត, រូប, គីមី, ជីវៈ</p>
                        </div>
                      </div>
                      {selectedStream === 'science' && <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />}
                    </button>

                    {/* 2. Social Stream */}
                    <button
                      type="button"
                      disabled={!isHost}
                      onClick={() => handleSelectStream('social')}
                      className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between gap-2.5 ${
                        selectedStream === 'social'
                          ? STREAM_THEMES.social.cardActive
                          : STREAM_THEMES.social.cardInactive
                      } ${!isHost ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center flex-shrink-0 shadow-inner">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-xs font-black text-white truncate flex items-center gap-1">
                            <span>វិទ្យាសាស្ត្រសង្គម</span>
                            {selectedStream === 'social' && <span className="text-[8px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">ជ្រើស</span>}
                          </h5>
                          <p className="text-[9.5px] text-slate-300 truncate">ភាសាខ្មែរ, ប្រវត្តិ, ភូមិ, ពលរដ្ឋ</p>
                        </div>
                      </div>
                      {selectedStream === 'social' && <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                    </button>

                    {/* 3. Random / Mixed Stream */}
                    <button
                      type="button"
                      disabled={!isHost}
                      onClick={() => handleSelectStream('random')}
                      className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between gap-2.5 ${
                        selectedStream === 'random'
                          ? STREAM_THEMES.random.cardActive
                          : STREAM_THEMES.random.cardInactive
                      } ${!isHost ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center flex-shrink-0 shadow-inner">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-xs font-black text-white truncate flex items-center gap-1">
                            <span>សំណួរចម្រុះ (Random)</span>
                            {selectedStream === 'random' && <span className="text-[8px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">ជ្រើស</span>}
                          </h5>
                          <p className="text-[9.5px] text-slate-300 truncate">ចម្រុះវិទ្យាសាស្ត្រ & សង្គម</p>
                        </div>
                      </div>
                      {selectedStream === 'random' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                    </button>

                  </div>
                </div>

                {/* 2-Player Modern Matchup Cards */}
                <div className="grid grid-cols-1 md:grid-cols-11 gap-4 sm:gap-6 items-stretch relative">
                  
                  {/* Left Player Card: Host */}
                  <div className="md:col-span-5 bg-gradient-to-b from-[#101b38] to-[#0a1226] p-5 sm:p-6 rounded-3xl border border-cyan-500/30 shadow-xl shadow-cyan-950/20 relative flex flex-col items-center justify-between text-center min-h-[300px] sm:min-h-[320px] group transition-all">
                    
                    {/* Top Status Bar */}
                    <div className="w-full flex items-center justify-between pb-3 border-b border-slate-700/50">
                      <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                        <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                        ម្ចាស់បន្ទប់ (Host)
                      </span>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> រួចរាល់
                      </span>
                    </div>

                    {/* Center Hero Avatar */}
                    {hostPlayer ? (
                      <div className="my-auto py-2 flex flex-col items-center w-full">
                        {/* Avatar */}
                        <div className="relative mb-2.5">
                          <PlayerAvatarWithFrame
                            avatar={hostPlayer.avatar}
                            frame={hostPlayer.avatarFrame || hostPlayer.avatar_frame}
                            name={hostPlayer.name}
                            size="lg"
                            className="scale-105 drop-shadow-lg"
                          />
                          {/* Level Badge */}
                          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 border border-cyan-300 text-[10px] font-black text-white shadow-md z-20 whitespace-nowrap">
                            Lv.{hostPlayer.level || 1}
                          </div>
                        </div>

                        {/* Player Name & School */}
                        <h3 className="text-base sm:text-lg font-black text-white tracking-tight truncate max-w-[220px] mt-1">
                          {hostPlayer.name || 'សុខ វិបុល'}
                        </h3>
                        <p className="text-xs text-slate-300 font-medium flex items-center gap-1 mt-0.5 truncate max-w-[220px]">
                          <Building2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                          <span className="truncate">{hostPlayer.school || 'វិទ្យាល័យជាតិ'}</span>
                        </p>

                        {/* XP Badge */}
                        <div className="mt-3">
                          <span className="px-3 py-1 rounded-xl bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 text-xs font-bold flex items-center gap-1 shadow-xs font-mono">
                            {(hostPlayer.xp || 500).toLocaleString()} XP
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="my-auto py-8 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                        <span>កំពុងទាញយកទិន្នន័យ...</span>
                      </div>
                    )}
                  </div>

                  {/* Center: VS Circle Badge */}
                  <div className="md:col-span-1 flex flex-row md:flex-col items-center justify-center py-2 relative my-auto">
                    <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-indigo-600/40 animate-pulse">
                      <div className="w-full h-full bg-[#0a1226] rounded-2xl flex flex-col items-center justify-center">
                        <span className="font-black text-base sm:text-lg text-white">
                          VS
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Player Card: Challenger */}
                  <div className={`md:col-span-5 p-5 sm:p-6 rounded-3xl border transition-all flex flex-col items-center justify-between text-center min-h-[300px] sm:min-h-[320px] ${
                    challengerPlayer
                      ? 'bg-gradient-to-b from-[#2a1226] to-[#150713] border-rose-500/30 shadow-xl shadow-rose-950/20'
                      : 'bg-gradient-to-b from-[#181128] to-[#0c0818] border-rose-500/30 shadow-xl shadow-rose-950/10 hover:border-rose-400/60 cursor-pointer'
                  }`}
                  onClick={() => {
                    if (!challengerPlayer) {
                      fetchStudents();
                      setShowInviteModal(true);
                    }
                  }}
                  >
                    {/* Top Status Bar */}
                    <div className="w-full flex items-center justify-between pb-3 border-b border-slate-700/50">
                      <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                        <Swords className="w-4 h-4 text-rose-400" /> 
                        គូប្រជែង (Challenger)
                      </span>

                      {challengerPlayer ? (
                        <div className="flex items-center gap-2">
                          {isChallengerReady ? (
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 text-emerald-400" /> រួចរាល់
                            </span>
                          ) : (
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1 animate-pulse">
                              <Clock className="w-3.5 h-3.5" /> កំពុងរៀបចំ...
                            </span>
                          )}

                          {/* Kick Button for Host */}
                          {isHost && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleKickChallenger();
                              }}
                              className="px-2 py-0.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 hover:text-white border border-rose-500/30 text-[10px] font-bold transition-all cursor-pointer"
                              title="បណ្តេញចេញ"
                            >
                              <UserX className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                          រង់ចាំ
                        </span>
                      )}
                    </div>

                    {/* Center Content */}
                    {challengerPlayer ? (
                      <div className="my-auto py-2 flex flex-col items-center w-full">
                        {/* Avatar */}
                        <div className="relative mb-2.5">
                          <PlayerAvatarWithFrame
                            avatar={challengerPlayer.avatar}
                            frame={challengerPlayer.avatarFrame || challengerPlayer.avatar_frame}
                            name={challengerPlayer.name}
                            size="lg"
                            className="scale-105 drop-shadow-lg"
                          />
                          {/* Level Badge */}
                          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 border border-rose-300 text-[10px] font-black text-white shadow-md z-20 whitespace-nowrap">
                            Lv.{challengerPlayer.level || 1}
                          </div>
                        </div>

                        {/* Player Name & School */}
                        <h3 className="text-base sm:text-lg font-black text-white tracking-tight truncate max-w-[220px] mt-1">
                          {challengerPlayer.name}
                        </h3>
                        <p className="text-xs text-slate-300 font-medium flex items-center gap-1 mt-0.5 truncate max-w-[220px]">
                          <Building2 className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                          <span className="truncate">{challengerPlayer.school}</span>
                        </p>

                        {/* XP Badge */}
                        <div className="mt-3">
                          <span className="px-3 py-1 rounded-xl bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 text-xs font-bold flex items-center gap-1 shadow-xs font-mono">
                            {(challengerPlayer.xp || 500).toLocaleString()} XP
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* Empty Slot */
                      <div className="my-auto py-6 flex flex-col items-center justify-center text-center w-full">
                        <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-slate-900/80 border-2 border-dashed border-rose-400/40 flex items-center justify-center mb-3 shadow-inner group-hover:scale-105 group-hover:border-rose-400 transition-all">
                          <UserPlus className="w-8 h-8 text-rose-400/80" />
                        </div>

                        <span className="text-sm font-black text-white block">
                          រង់ចាំគូប្រជែងចូលរួម
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-0.5 max-w-[220px]">
                          ចុចប៊ូតុងខាងក្រោមដើម្បីអញ្ជើញ ឬចែករំលែក PIN
                        </span>
                        
                        {/* Custom Valorant Slanted Invite Button */}
                        <div className="valorant-btn-borders mt-3.5">
                          <button
                            type="button"
                            className="valorant-invite-btn"
                          >
                            <UserPlus className="w-4 h-4 text-rose-400" />
                            <span>អញ្ជើញកីឡាករ (INVITE)</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                </div>

                {/* Primary Action Bar */}
                <div className="flex flex-col items-center gap-3 pt-2">
                  
                  {/* Warning notice when Host tries to start without ready opponent */}
                  {isHost && hostWarningNotice && (
                    <div className="w-full max-w-md p-3 bg-rose-500/20 border border-rose-500/40 rounded-2xl text-rose-300 text-xs font-bold text-center flex items-center justify-center gap-2 animate-fade-in shadow-sm">
                      <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      <span>{hostWarningNotice}</span>
                    </div>
                  )}

                  {isHost ? (
                    // Host / Admin view: CYBER OCTAGON START MATCH BUTTON
                    <button
                      type="button"
                      onClick={handleStartDuel}
                      className="cyber-start-btn active:scale-98"
                      title="Start Match"
                    >
                      <div className="cyber-clip">
                        <div className="cyber-corner cyber-leftTop" />
                        <div className="cyber-corner cyber-rightTop" />
                        <div className="cyber-corner cyber-leftBottom" />
                        <div className="cyber-corner cyber-rightBottom" />
                      </div>
                      <div className="cyber-arrow cyber-leftArrow" />
                      <div className="cyber-arrow cyber-rightArrow" />
                      <span className="relative z-10 flex items-center justify-center gap-2 font-black text-sm tracking-wider">
                        <Play className="w-4 h-4 fill-white" />
                        <span>ចាប់ផ្តើមការប្រកួត (START)</span>
                      </span>
                    </button>
                  ) : (
                    // Challenger view: LIQUID WAVE READY BUTTON
                    <div className="flex flex-col items-center gap-2.5 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={handleToggleReady}
                        className="liquid-ready-btn active:scale-98"
                      >
                        <p className="btn-text">
                          {isChallengerReady ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              <span>រួចរាល់ហើយ! (READY)</span>
                            </>
                          ) : (
                            <>
                              <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
                              <span>ចុចដើម្បី READY</span>
                            </>
                          )}
                        </p>
                      </button>

                      {isChallengerReady && (
                        <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-pulse">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          កំពុងរង់ចាំម្ចាស់បន្ទប់ (Host) ចុចចាប់ផ្តើមការប្រកួត...
                        </span>
                      )}
                    </div>
                  )}

                  {/* Leave Room Button */}
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="w-full sm:w-auto px-8 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 bg-rose-600/15 hover:bg-rose-600/30 text-rose-300 hover:text-white border border-rose-500/30 hover:border-rose-500/50"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>ចាកចេញពីបន្ទប់ (Leave Room)</span>
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: AAA eSPORTS MATCHUP / VERSUS INTRO COUNTDOWN */}
        {/* ========================================================================= */}
        {currentStep === 'countdown' && (
          <div className="p-3 sm:p-6 md:p-10 flex-1 flex flex-col justify-center items-center text-center space-y-4 sm:space-y-6 animate-fade-in my-auto relative overflow-hidden">
            
            {/* Background Battle Beams */}
            <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Top Match Title Ribbon */}
            <div className={`inline-flex items-center gap-2 px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border shadow-xl transition-all duration-300 ${currentTheme.boxBg} ${currentTheme.boxBorder}`}>
              <Swords className={`w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse ${currentTheme.accentText}`} />
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-white">
                <span className="sm:hidden">1v1 DUEL • ទី{selectedGrade}</span>
                <span className="hidden sm:inline">1v1 DUEL ARENA • ថ្នាក់ទី {selectedGrade}</span>
              </span>
              <span className={`text-[9px] sm:text-[11px] px-1.5 sm:px-2.5 py-0.5 rounded-lg font-bold border transition-all duration-300 items-center gap-1 hidden sm:flex ${currentTheme.badgeClass}`}>
                <CurrentGradeIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                <span>{selectedGrade >= 11 ? (selectedStream === 'science' ? 'វិទ្យាសាស្ត្រពិត' : 'វិទ្យាសាស្ត្រសង្គម') : `${currentTheme.shortLevel}`}</span>
              </span>
              <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-black border border-amber-400/30">
                +500 XP
              </span>
            </div>

            {/* ── 3-Column VS Arena Stage ── ALWAYS horizontal (side-by-side) */}
            <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4 md:gap-6 items-center w-full max-w-4xl relative z-10">
              
              {/* Host Hero Card (Left, Blue/Cyan Corner) */}
              <div className="bg-gradient-to-b from-[#0e1d3e]/95 to-[#081024]/95 p-3 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border-2 border-cyan-500/40 shadow-2xl shadow-cyan-950/50 relative flex flex-col items-center text-center min-w-0">
                <div className="w-full flex items-center justify-between pb-2 sm:pb-3 mb-2 sm:mb-3 border-b border-cyan-500/20">
                  <span className="text-[9px] sm:text-xs font-black text-cyan-300 flex items-center gap-1 uppercase tracking-wider">
                    <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400 fill-amber-400" />
                    <span className="hidden sm:inline">BLUE CORNER</span>
                  </span>
                  <span className="text-[9px] sm:text-[11px] px-1.5 sm:px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-black border border-emerald-500/40 flex items-center gap-0.5 sm:gap-1">
                    <Check className="w-3 h-3 text-emerald-400" /> <span className="hidden sm:inline">READY</span>
                  </span>
                </div>

                <div className="relative my-1 sm:my-3">
                  <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-lg animate-pulse" />
                  <PlayerAvatarWithFrame
                    avatar={hostPlayer?.avatar}
                    frame={hostPlayer?.avatarFrame || hostPlayer?.avatar_frame}
                    name={hostPlayer?.name}
                    size="lg"
                    className="drop-shadow-2xl relative z-10"
                  />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 sm:px-3 py-0.5 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 border border-cyan-300 text-[10px] sm:text-[11px] font-black text-white shadow-lg z-20 whitespace-nowrap">
                    Lv.{hostPlayer?.level || 1}
                  </div>
                </div>

                <h3 className="text-xs sm:text-base md:text-lg font-black text-white tracking-tight truncate w-full mt-2">
                  {hostPlayer?.name || 'សុខ វិបុល'}
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-300 font-medium flex items-center gap-1 mt-0.5 sm:mt-1 truncate w-full justify-center">
                  <Building2 className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                  <span className="truncate">{hostPlayer?.school || 'វិទ្យាល័យជាតិ'}</span>
                </p>

                <div className="mt-2 sm:mt-3.5 w-full pt-2 sm:pt-3 border-t border-cyan-500/20 flex items-center justify-between text-[10px] sm:text-xs">
                  <span className="text-slate-400 font-semibold hidden sm:inline">សមត្ថភាព (XP):</span>
                  <span className="text-slate-400 font-semibold sm:hidden">XP:</span>
                  <span className="font-mono font-black text-cyan-300 text-[11px] sm:text-sm">
                    {(hostPlayer?.xp || 500).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Center VS & Holographic Digital Countdown Radar */}
              <div className="flex flex-col items-center justify-center py-1 sm:py-2 relative px-1">
                
                {/* 3-2-1 Digital Countdown Sphere */}
                <div className="relative">
                  {/* Rotating Neon Glow Rings */}
                  <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-2 border-dashed border-indigo-400/50 animate-spin flex items-center justify-center pointer-events-none" style={{ animationDuration: '6s' }} />
                  <div className="absolute inset-1.5 sm:inset-2 rounded-full border border-cyan-400/30 animate-pulse pointer-events-none" />
                  
                  {/* Countdown Center Circle */}
                  <div className={`absolute inset-2.5 sm:inset-3 rounded-full flex flex-col items-center justify-center shadow-2xl backdrop-blur-md transition-all duration-300 ${
                    countdownNum === 'START!'
                      ? 'bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 border-2 border-emerald-300 shadow-[0_0_40px_rgba(16,185,129,0.9)] scale-110'
                      : countdownNum === 1
                        ? 'bg-gradient-to-br from-pink-600 to-rose-700 border-2 border-pink-300 shadow-[0_0_35px_rgba(244,63,94,0.8)] scale-105'
                        : countdownNum === 2
                          ? 'bg-gradient-to-br from-cyan-600 to-blue-700 border-2 border-cyan-300 shadow-[0_0_35px_rgba(6,182,212,0.8)] scale-105'
                          : 'bg-gradient-to-br from-indigo-600 to-purple-700 border-2 border-indigo-300 shadow-[0_0_35px_rgba(99,102,241,0.8)] scale-105'
                  }`}>
                    {countdownNum === 'START!' ? (
                      <div className="flex flex-col items-center animate-bounce">
                        <Swords className="w-4 h-4 sm:w-6 sm:h-6 text-white mb-0.5" />
                        <span className="font-black text-[10px] sm:text-sm text-white tracking-wider font-mono">
                          START!
                        </span>
                      </div>
                    ) : (
                      <span className="font-mono font-black text-3xl sm:text-4xl md:text-5xl text-white drop-shadow-md animate-pulse">
                        {countdownNum}
                      </span>
                    )}
                  </div>
                </div>

                {/* Subtitle Status */}
                <div className="mt-1.5 sm:mt-2">
                  <span className="text-[10px] sm:text-xs md:text-sm font-black tracking-wider text-indigo-300">
                    {countdownNum === 'START!' ? 'ចាប់ផ្តើម!' : countdownNum === 1 ? 'ត្រៀមប្រកួត' : countdownNum === 2 ? 'ផ្ចង់អារម្មណ៍' : 'ត្រៀមខ្លួន'}
                  </span>
                </div>
              </div>

              {/* Challenger Hero Card (Right, Crimson Corner) */}
              <div className="bg-gradient-to-b from-[#341124]/95 to-[#1c0813]/95 p-3 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border-2 border-rose-500/40 shadow-2xl shadow-rose-950/50 relative flex flex-col items-center text-center min-w-0">
                <div className="w-full flex items-center justify-between pb-2 sm:pb-3 mb-2 sm:mb-3 border-b border-rose-500/20">
                  <span className="text-[9px] sm:text-xs font-black text-rose-300 flex items-center gap-1 uppercase tracking-wider">
                    <Swords className="w-3 h-3 sm:w-4 sm:h-4 text-rose-400" />
                    <span className="hidden sm:inline">RED CORNER</span>
                  </span>
                  <span className="text-[9px] sm:text-[11px] px-1.5 sm:px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-black border border-emerald-500/40 flex items-center gap-0.5 sm:gap-1">
                    <Check className="w-3 h-3 text-emerald-400" /> <span className="hidden sm:inline">READY</span>
                  </span>
                </div>

                <div className="relative my-1 sm:my-3">
                  <div className="absolute inset-0 rounded-full bg-rose-500/20 blur-lg animate-pulse" />
                  <PlayerAvatarWithFrame
                    avatar={challengerPlayer?.avatar}
                    frame={challengerPlayer?.avatarFrame || challengerPlayer?.avatar_frame}
                    name={challengerPlayer?.name}
                    size="lg"
                    className="drop-shadow-2xl relative z-10"
                  />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 sm:px-3 py-0.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 border border-rose-300 text-[10px] sm:text-[11px] font-black text-white shadow-lg z-20 whitespace-nowrap">
                    Lv.{challengerPlayer?.level || 1}
                  </div>
                </div>

                <h3 className="text-xs sm:text-base md:text-lg font-black text-white tracking-tight truncate w-full mt-2">
                  {challengerPlayer?.name || 'គូប្រជែង'}
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-300 font-medium flex items-center gap-1 mt-0.5 sm:mt-1 truncate w-full justify-center">
                  <Building2 className="w-3 h-3 text-rose-400 flex-shrink-0" />
                  <span className="truncate">{challengerPlayer?.school || 'វិទ្យាល័យ'}</span>
                </p>

                <div className="mt-2 sm:mt-3.5 w-full pt-2 sm:pt-3 border-t border-rose-500/20 flex items-center justify-between text-[10px] sm:text-xs">
                  <span className="text-slate-400 font-semibold hidden sm:inline">សមត្ថភាព (XP):</span>
                  <span className="text-slate-400 font-semibold sm:hidden">XP:</span>
                  <span className="font-mono font-black text-rose-300 text-[11px] sm:text-sm">
                    {(challengerPlayer?.xp || 500).toLocaleString()}
                  </span>
                </div>
              </div>

            </div>

            {/* Bottom Target Goal */}
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium">
              <span className="hidden sm:inline">ឆ្លើយឱ្យបានត្រឹមត្រូវ ៦ សំណួរមុនគេដើម្បីទទួលជ័យជម្នះ (First to 6 Correct Points Wins)</span>
              <span className="sm:hidden">ឆ្លើយត្រឹមត្រូវ ៦ មុនគេ = ជ័យជម្នះ 🏆</span>
            </p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: LIVE TURN-BASED BATTLE */}
        {/* ========================================================================= */}
        {currentStep === 'battle' && (
          <div className="p-2.5 sm:p-5 md:p-7 flex-1 flex flex-col overflow-y-auto space-y-2.5 sm:space-y-4 animate-fade-in" style={{ WebkitOverflowScrolling: 'touch' }}>

            {/* ── Score HUD ── ALWAYS side-by-side on every device */}
            <div className="bg-[#0a1226]/90 backdrop-blur-sm p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-700/60 shadow-lg">
              <div className="grid grid-cols-[1fr_auto_1fr] gap-1.5 sm:gap-3 items-center">

                {/* Host HUD */}
                <div className={`flex items-center gap-1.5 sm:gap-2.5 p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl transition-all min-w-0 ${
                  activeTurn === 'host' 
                    ? 'bg-indigo-950/60 border border-indigo-500/70 shadow-lg shadow-indigo-950/50 ring-1 sm:ring-2 ring-indigo-500/40' 
                    : 'opacity-70 bg-slate-900/40 border border-slate-800'
                }`}>
                  <div className="relative flex-shrink-0">
                    <PlayerAvatarWithFrame
                      avatar={hostPlayer?.avatar}
                      frame={hostPlayer?.avatarFrame || hostPlayer?.avatar_frame}
                      name={hostPlayer?.name}
                      size="sm"
                    />
                    {activeTurn === 'host' && (
                      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 sm:w-3 sm:h-3 bg-emerald-400 rounded-full animate-ping" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-0.5 text-[10px] sm:text-xs font-semibold">
                      <span className="text-slate-200 truncate font-bold">{hostPlayer?.name}</span>
                      <span className="text-cyan-400 font-mono font-black text-[10px] sm:text-xs flex-shrink-0">{isHost ? myScore : opponentScore}</span>
                    </div>
                    <div className="flex items-center gap-0.5 sm:gap-1.5 mt-0.5 sm:mt-1">
                      <span className="text-[8px] sm:text-[10px] font-mono text-emerald-400 font-black flex items-center gap-0.5 flex-shrink-0">
                        <Trophy className="w-2 h-2 sm:w-3 sm:h-3 text-amber-400" /> {hostCorrectCount}/6
                      </span>
                      <div className="flex-1 h-1 sm:h-2 bg-slate-900 rounded-full overflow-hidden flex gap-px sm:gap-0.5 p-px border border-slate-800">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className={`flex-1 h-full rounded-full transition-all duration-300 ${i < hostCorrectCount ? 'bg-gradient-to-r from-emerald-400 to-teal-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-slate-800'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center: Round & Win Target */}
                <div className="flex flex-col items-center justify-center px-1 sm:px-2">
                  <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 font-bold whitespace-nowrap">{currentQIndex + 1}/{questions.length}</span>
                  <span className="text-[8px] sm:text-[9px] text-amber-400 font-mono font-black whitespace-nowrap">Win: 6</span>
                </div>

                {/* Challenger HUD */}
                <div className={`flex items-center gap-1.5 sm:gap-2.5 p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl transition-all min-w-0 ${
                  activeTurn === 'challenger' 
                    ? 'bg-rose-950/60 border border-rose-500/70 shadow-lg shadow-rose-950/50 ring-1 sm:ring-2 ring-rose-500/40' 
                    : 'opacity-70 bg-slate-900/40 border border-slate-800'
                }`}>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-0.5 text-[10px] sm:text-xs font-semibold">
                      <span className="text-rose-400 font-mono font-black text-[10px] sm:text-xs flex-shrink-0">{!isHost ? myScore : opponentScore}</span>
                      <span className="text-slate-200 truncate font-bold text-right">{challengerPlayer?.name}</span>
                    </div>
                    <div className="flex items-center gap-0.5 sm:gap-1.5 mt-0.5 sm:mt-1">
                      <div className="flex-1 h-1 sm:h-2 bg-slate-900 rounded-full overflow-hidden flex gap-px sm:gap-0.5 p-px border border-slate-800">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className={`flex-1 h-full rounded-full transition-all duration-300 ${i < challengerCorrectCount ? 'bg-gradient-to-r from-rose-400 to-pink-400 shadow-[0_0_6px_rgba(251,113,133,0.8)]' : 'bg-slate-800'}`} />
                        ))}
                      </div>
                      <span className="text-[8px] sm:text-[10px] font-mono text-rose-400 font-black flex items-center gap-0.5 flex-shrink-0">
                        <Trophy className="w-2 h-2 sm:w-3 sm:h-3 text-amber-400" /> {challengerCorrectCount}/6
                      </span>
                    </div>
                  </div>
                  <div className="relative flex-shrink-0">
                    <PlayerAvatarWithFrame
                      avatar={challengerPlayer?.avatar}
                      frame={challengerPlayer?.avatarFrame || challengerPlayer?.avatar_frame}
                      name={challengerPlayer?.name}
                      size="sm"
                    />
                    {activeTurn === 'challenger' && (
                      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 sm:w-3 sm:h-3 bg-rose-400 rounded-full animate-ping" />
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* ── Turn Announcement Banner */}
            <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl border text-center text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all ${
              isMyTurn
                ? 'bg-gradient-to-r from-indigo-600/20 via-purple-600/25 to-indigo-600/20 border-indigo-500/50 text-indigo-200 shadow-md ring-1 ring-indigo-400/40'
                : 'bg-slate-900/80 border-slate-800 text-slate-400'
            }`}>
              {isMyTurn ? (
                <>
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400 animate-bounce flex-shrink-0" />
                  <span>
                    <strong>វេនអ្នក (Your Turn)</strong> ({secondsLeft}s)
                  </span>
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 animate-spin flex-shrink-0" style={{ animationDuration: '4s' }} />
                  <span><strong>{activePlayerName}</strong> កំពុងឆ្លើយ...</span>
                </>
              )}
            </div>

            {/* ── Question Card */}
            <div className="bg-gradient-to-b from-[#0e1730] to-[#080d1e] rounded-xl sm:rounded-3xl p-3 sm:p-6 md:p-8 text-center border border-slate-700/60 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <span className="text-[8px] sm:text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-1.5 sm:mb-2 font-mono relative z-[1]">
                {`${currentQ?.subject ? currentQ.subject + ' • ' : ''}${currentQ?.category || (selectedStream === 'social' ? 'Social Science' : 'Natural Science')} #${currentQIndex + 1}`}
              </span>
              <h3
                className="text-[13px] sm:text-lg md:text-2xl font-black text-white leading-relaxed relative z-[1]"
                style={{ overflowWrap: 'anywhere', wordBreak: 'break-word', hyphens: 'auto' }}
              >
                {currentQ.q}
              </h3>
            </div>

            {/* ── 4 Answer Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-3">
              {currentQ.options.map((option, idx) => {
                const config = BUTTON_CONFIGS[idx % 4];
                const isSelectedByPlayer = turnResult && turnResult.selectedIdx === idx;
                const isCorrectOption = idx === currentQ.answer;

                let btnStyle = 'bg-[#0e1730] border-slate-800 hover:border-slate-700 text-slate-200';

                if (turnStatus === 'turn_ended') {
                  if (isCorrectOption) {
                    btnStyle = 'bg-emerald-950/80 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400/60 shadow-lg shadow-emerald-950/60';
                  } else if (isSelectedByPlayer && !turnResult?.isCorrect) {
                    btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-300 ring-2 ring-rose-500/40';
                  } else {
                    btnStyle = 'bg-[#080d1a] border-slate-800/80 text-slate-600 opacity-40';
                  }
                } else {
                  if (!isMyTurn) {
                    btnStyle = 'bg-[#080d1a] border-slate-800/80 text-slate-500 opacity-50 cursor-not-allowed';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={!isMyTurn || turnStatus === 'turn_ended'}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border flex items-center gap-2 sm:gap-3.5 transition-all text-left ${
                      isMyTurn && turnStatus === 'playing' 
                        ? 'cursor-pointer hover:border-indigo-400 hover:bg-slate-800/90 active:scale-[0.98] shadow-md' 
                        : ''
                    } ${btnStyle}`}
                  >
                    <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl border flex items-center justify-center flex-shrink-0 font-mono font-black text-[11px] sm:text-sm shadow-xs ${config.badge}`}>
                      {config.num}
                    </div>
                    <span
                      className="text-[11px] sm:text-sm font-bold flex-1 leading-snug"
                      style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                    >
                      {option}
                    </span>
                    {turnStatus === 'turn_ended' && isCorrectOption && (
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0 animate-bounce" />
                    )}
                    {turnStatus === 'turn_ended' && isSelectedByPlayer && !turnResult?.isCorrect && (
                      <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400 flex-shrink-0 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* ── Turn Result & Countdown ── ALWAYS single row */}
            <div className="bg-[#0a1226]/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2 sm:p-3.5 border border-slate-700/60 text-[10px] sm:text-xs animate-fade-in shadow-md">
              {turnStatus === 'playing' ? (
                <div className="flex items-center gap-1.5 sm:gap-2 text-slate-300 font-medium">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400 flex-shrink-0" />
                  <span>
                    {isMyTurn
                      ? `ជ្រើសចម្លើយ (${secondsLeft}s)...`
                      : `រង់ចាំ ${activePlayerName}...`}
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 min-w-0">
                    {turnResult?.isCorrect ? (
                      <span className="text-emerald-400 font-black flex items-center gap-1 truncate">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="truncate">✓ +{turnResult.scoreEarned}pts [{activeTurn === 'host' ? hostCorrectCount : challengerCorrectCount}/6]</span>
                      </span>
                    ) : (
                      <span className="text-rose-400 font-black flex items-center gap-1 truncate">
                        <XCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                        <span className="truncate">{turnResult?.isTimeout ? 'អស់ពេល' : 'មិនត្រឹមត្រូវ'}</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 bg-indigo-600/25 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-indigo-500/40 text-indigo-200 font-black font-mono flex-shrink-0">
                    <span className="hidden sm:inline">វេនបន្ទាប់</span>
                    <span className="sm:hidden">Next</span>
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] animate-bounce shadow-md">
                      {nextTurnCountdown}
                    </span>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: RESULTS WITH REMATCH & LEAVE SYNCHRONIZATION */}
        {/* ========================================================================= */}
        {currentStep === 'results' && (
          <div className="p-6 sm:p-10 flex-1 flex flex-col justify-center items-center text-center space-y-6 animate-fade-in my-auto">

            {/* Opponent Left Warning Banner */}
            {opponentLeftNotice && (
              <div className="w-full max-w-md p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 text-xs font-semibold flex items-center justify-center gap-2 animate-fade-in shadow-md">
                <LogOut className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{opponentLeftNotice}</span>
              </div>
            )}

            {/* Rematch Request Incoming Banner */}
            {!myRematchRequested && opponentRematchRequested && (
              <div className="w-full max-w-md p-3 bg-indigo-500/20 border border-indigo-500/40 rounded-xl text-indigo-200 text-xs font-semibold flex items-center justify-center gap-2 animate-bounce shadow-md">
                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>គូប្រជែងបានស្នើសុំប្រកួតម្តងទៀត! ចុច 'ប្រកួតម្តងទៀត' ដើម្បីចាប់ផ្តើម</span>
              </div>
            )}

            {/* Champion Podium Spotlight with Frame */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative">
                <PlayerAvatarWithFrame
                  avatar={student?.avatar}
                  frame={student?.avatarFrame || student?.avatar_frame}
                  name={student?.name}
                  size="xl"
                />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 border border-amber-300 text-[10px] font-black text-white shadow-md z-20 whitespace-nowrap flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-amber-200" />
                  <span>{myCorrectCount >= opponentCorrectCount ? 'CHAMPION' : 'MATCH COMPLETE'}</span>
                </div>
              </div>
              <div className="mt-3">
                <h4 className="text-base font-black text-white">{student?.name || 'សុខ វិបុល'}</h4>
                <span className="text-xs text-indigo-400 font-mono font-bold">Lv.{levelInfo?.level || 1} • {levelInfo?.rankTitleKm || 'សិស្សឆ្នើម'}</span>
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white">
              {myScore > opponentScore || myCorrectCount > opponentCorrectCount
                ? 'អ្នកបានទទួលជ័យជម្នះ (Victory)'
                : myScore === opponentScore && myCorrectCount === opponentCorrectCount
                  ? 'លទ្ធផលស្មើគ្នា (Draw)'
                  : 'គូប្រជែងបានទទួលជ័យជម្នះ (Defeat)'}
            </h3>

            {/* Score & Correct Count Comparison */}
            <div className="bg-[#0e1730] rounded-2xl p-5 border border-slate-800 w-full max-w-md flex items-center justify-around text-xs shadow-lg">
              <div>
                <span className="text-slate-400 block mb-1">ពិន្ទុរបស់អ្នក</span>
                <span className="text-2xl font-black font-mono text-cyan-400">{myScore}</span>
                <span className="text-[10px] text-emerald-400 font-mono block mt-0.5 font-bold">({myCorrectCount}/6 ត្រូវ)</span>
              </div>
              <div className="w-px h-10 bg-slate-800" />
              <div>
                <span className="text-slate-400 block mb-1">ពិន្ទុគូប្រជែង</span>
                <span className="text-2xl font-black font-mono text-rose-400">{opponentScore}</span>
                <span className="text-[10px] text-rose-400 font-mono block mt-0.5 font-bold">({opponentCorrectCount}/6 ត្រូវ)</span>
              </div>
              <div className="w-px h-10 bg-slate-800" />
              <div>
                <span className="text-slate-400 block mb-1">XP ទទួលបាន</span>
                <span className="text-2xl font-black font-mono text-emerald-400">
                  +{myCorrectCount >= opponentCorrectCount ? 500 : 150}
                </span>
              </div>
            </div>

            {/* Rematch & Exit Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">

              {/* Play Again (Rematch) Button */}
              <button
                type="button"
                disabled={myRematchRequested}
                onClick={handleRequestRematch}
                className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
                  myRematchRequested
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-wait'
                    : opponentRematchRequested
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25 ring-2 ring-emerald-400/50'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/25'
                }`}
              >
                {myRematchRequested ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                    <span>កំពុងរង់ចាំគូប្រជែងចុច 'ប្រកួតម្តងទៀត'...</span>
                  </>
                ) : opponentRematchRequested ? (
                  <>
                    <Zap className="w-4 h-4 fill-white" />
                    <span>ទទួលយកការប្រកួតម្តងទៀត (Accept Rematch)</span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>ប្រកួតម្តងទៀត (Play Again)</span>
                  </>
                )}
              </button>

              {/* Leave Room Button */}
              <button
                type="button"
                onClick={handleLeaveArenaRoom}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-400" />
                <span>ចាកចេញទៅ Lobby</span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* INVITE REAL REGISTERED STUDENTS MODAL WITH REAL-TIME APPROVAL */}
      {/* ========================================================================= */}
      {showInviteModal && !challengerPlayer && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-kantumruy isolate">
          <div className="bg-[#0e1730] border border-slate-700/80 rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative z-10">

            {/* Modal Header */}
            <div className="px-5 py-4 bg-[#080e1e] border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4 text-indigo-400" />
                <h4 className="font-bold text-sm text-white">
                  ផ្ញើការអញ្ជើញទៅកាន់សិស្សក្នុងប្រព័ន្ធ
                </h4>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowInviteModal(false);
                  setInviteFeedback('');
                  setInvitedStudentsMap({});
                }}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {inviteFeedback && (
              <div className="px-5 py-2.5 bg-indigo-500/15 border-b border-indigo-500/30 text-indigo-300 text-xs font-medium flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin flex-shrink-0" />
                <span>{inviteFeedback}</span>
              </div>
            )}

            {/* Body */}
            <div className="p-5 space-y-4 overflow-y-auto">

              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={inviteSearch}
                  onChange={(e) => setInviteSearch(e.target.value)}
                  placeholder="ស្វែងរកឈ្មោះសិស្ស ឬសាលារៀន..."
                  className="w-full bg-[#080e1e] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {loadingStudents ? (
                <div className="py-8 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                  <span>កំពុងទាញយកទិន្នន័យពី Database...</span>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="py-8 text-center space-y-3 bg-[#080e1e] rounded-xl p-5 border border-slate-800/80">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    មិនទាន់មានគណនីសិស្សផ្សេងទៀតបានចុះឈ្មោះក្នុងប្រព័ន្ធនៅឡើយទេ។<br />
                    លោកអ្នកអាចចែករំលែកលេខកូដបន្ទប់ <strong>#{roomCode}</strong> ដើម្បីអញ្ជើញមិត្តភក្តិឱ្យចុះឈ្មោះចូលរួមលេងជាមួយគ្នា!
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'បានចម្លងរួចរាល់' : 'ចម្លងតំណភ្ជាប់ (Copy Link)'}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {filteredStudents.map((user) => {
                    const status = invitedStudentsMap[user.id];

                    return (
                      <div
                        key={user.id}
                        className="p-3 rounded-xl bg-[#080e1e] border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Student Avatar with Frame in Invite List */}
                          <PlayerAvatarWithFrame
                            avatar={user.avatar}
                            frame={user.avatar_frame || user.avatarFrame}
                            name={user.full_name || user.username}
                            size="sm"
                          />
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-white truncate">
                              {user.full_name || user.username}
                            </h5>
                            <span className="text-[10px] text-slate-400 block truncate">
                              {user.school || 'វិទ្យាល័យជាតិ'} • Lv.{user.level || 1}
                            </span>
                          </div>
                        </div>

                        {status === 'pending' ? (
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <div className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-center gap-1.5">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span>កំពុងរង់ចាំ...</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCancelInvite(user)}
                              className="px-2 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                              title="បោះបង់ការអញ្ជើញ"
                            >
                              <X className="w-3 h-3 text-rose-400" />
                              <span className="hidden sm:inline">បោះបង់</span>
                            </button>
                          </div>
                        ) : status === 'declined' || (declinedCooldowns[user.id] > 0) ? (
                          <div className="px-3 py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-1.5 flex-shrink-0 animate-pulse">
                            <X className="w-3 h-3 text-rose-400" />
                            <span>បានបដិសេធ ({declinedCooldowns[user.id] || 5}s)</span>
                          </div>
                        ) : (
                          <div className="valorant-btn-borders flex-shrink-0 scale-90 sm:scale-100">
                            <button
                              type="button"
                              onClick={() => handleSendInvite(user)}
                              className="valorant-invite-btn py-1.5 px-3 text-xs"
                            >
                              <Send className="w-3 h-3 text-rose-400" />
                              <span>អញ្ជើញ (INVITE)</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-[#080e1e] border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowInviteModal(false);
                  setInviteFeedback('');
                  setInvitedStudentsMap({});
                }}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors cursor-pointer"
              >
                បិទ (Close)
              </button>
            </div>

          </div>
        </div>
      )}

    </div>,
    document.body
  );
}
