import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
  Lock,
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
  Rocket,
  Bot,
  Calculator,
  Languages,
  Beaker,
  Globe,
  Scale,
  Leaf,
  Brain,
  ChevronDown
} from 'lucide-react';
import { useAuth, computeLevelData } from '../../context/AuthContext';
import { playSound } from '../../utils/audioEffects';
import { getRandomizedGameQuestions, fetchLiveExamQuestions, expandQuestionsTo8Options, resetGameSessionQuestions } from '../../utils/gamePoolManager';
import { getInstantGradeQuestions } from '../../utils/gradeQuestionBank';
import api from '../../services/api';

// High-end Avatar with Frame Renderer
const PlayerAvatarWithFrame = ({ avatar, frame, name = '', size = 'md', className = '' }) => {
  const frameSrc = frame || null;
  const avatarSrc = avatar ? api.formatAvatarUrl(avatar) : null;

  const sizeClasses = {
    sm: 'w-11 h-11',
    md: 'w-14 h-14 sm:w-16 sm:h-16',
    lg: 'w-20 h-20 sm:w-24 sm:h-24',
    xl: 'w-24 h-24 sm:w-28 sm:h-28',
    '2xl': 'w-28 h-28 sm:w-32 sm:h-32',
    hero: 'w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36'
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
    headerBadge: 'bg-cyan-500/15 text-cyan-300 border-cyan-400/40',
    headerIconBox: 'bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]',
    glowBg: 'bg-cyan-500/20',
    boxBg: 'bg-[#0a1324]/95',
    boxBorder: 'border-cyan-500/40 shadow-[0_10px_35px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/20',
    badgeClass: 'text-cyan-300 bg-cyan-500/20 border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]',
    cardActive: 'bg-gradient-to-br from-[#0c2b48] via-[#091f35] to-[#061424] border-2 border-cyan-400 shadow-[0_0_24px_rgba(6,182,212,0.35)] ring-2 ring-cyan-400/30 scale-[1.01]',
    cardInactive: 'bg-[#080f1e]/90 border-slate-800/90 hover:border-cyan-500/40 hover:bg-[#0c182e] text-slate-400 hover:text-slate-200 group'
  },
  social: {
    id: 'social',
    nameKm: 'ថ្នាក់វិទ្យាសាស្ត្រសង្គម',
    titleKm: 'ថ្នាក់វិទ្យាសាស្ត្រសង្គម (Social Science)',
    shortName: 'វិទ្យាសាស្ត្រសង្គម',
    subtitleKm: 'ភាសាខ្មែរ, ប្រវត្តិវិទ្យា, ភូមិវិទ្យា, សីលធម៌-ពលរដ្ឋ',
    icon: BookOpen,
    accentText: 'text-amber-400',
    headerBadge: 'bg-amber-500/15 text-amber-300 border-amber-400/40',
    headerIconBox: 'bg-amber-500/20 border border-amber-400/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]',
    glowBg: 'bg-amber-500/20',
    boxBg: 'bg-[#0a1324]/95',
    boxBorder: 'border-amber-500/40 shadow-[0_10px_35px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/20',
    badgeClass: 'text-amber-300 bg-amber-500/20 border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.25)]',
    cardActive: 'bg-gradient-to-br from-[#382006] via-[#271503] to-[#160b02] border-2 border-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.35)] ring-2 ring-amber-400/30 scale-[1.01]',
    cardInactive: 'bg-[#080f1e]/90 border-slate-800/90 hover:border-amber-500/40 hover:bg-[#1a1208] text-slate-400 hover:text-slate-200 group'
  },
  random: {
    id: 'random',
    nameKm: 'សំណួរចម្រុះ / ចៃដន្យ',
    titleKm: 'សំណួរចម្រុះ / ចៃដន្យ (Random Stream)',
    shortName: 'សំណួរចម្រុះ',
    subtitleKm: 'ចម្រុះមុខវិជ្ជាវិទ្យាសាស្ត្រពិត & វិទ្យាសាស្ត្រសង្គម',
    icon: Sparkles,
    accentText: 'text-emerald-400',
    headerBadge: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/40',
    headerIconBox: 'bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]',
    glowBg: 'bg-emerald-500/20',
    boxBg: 'bg-[#0a1324]/95',
    boxBorder: 'border-emerald-500/40 shadow-[0_10px_35px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/20',
    badgeClass: 'text-emerald-300 bg-emerald-500/20 border-emerald-400/50 shadow-[0_0_12px_rgba(16,185,129,0.25)]',
    cardActive: 'bg-gradient-to-br from-[#063324] via-[#042419] to-[#02140e] border-2 border-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.35)] ring-2 ring-emerald-400/30 scale-[1.01]',
    cardInactive: 'bg-[#080f1e]/90 border-slate-800/90 hover:border-emerald-500/40 hover:bg-[#091a14] text-slate-400 hover:text-slate-200 group'
  }
};

// Grade & Subject Configs for AI Quiz
const KHMER_NUMS = ['១','២','៣','៤','៥','៦','៧','៨','៩','១០','១១','១២'];
const GRADE_COLORS_DUEL = [
  'from-blue-400 to-blue-600','from-cyan-400 to-cyan-600','from-teal-400 to-teal-600',
  'from-emerald-400 to-emerald-600','from-green-400 to-green-600','from-lime-500 to-green-600',
  'from-yellow-400 to-amber-600','from-amber-400 to-orange-600','from-orange-400 to-red-600',
  'from-rose-400 to-pink-600','from-purple-400 to-violet-600','from-indigo-400 to-blue-600'
];

const DUEL_SCIENCE_SUBJECTS = [
  { key: 'គណិតវិទ្យា', label: 'គណិតវិទ្យា', en: 'Math', icon: Calculator, color: 'bg-blue-500/15 border-blue-400/30 text-blue-300' },
  { key: 'ភាសាខ្មែរ', label: 'ភាសាខ្មែរ', en: 'Khmer', icon: BookOpen, color: 'bg-amber-500/15 border-amber-400/30 text-amber-300' },
  { key: 'រូបវិទ្យា', label: 'រូបវិទ្យា', en: 'Physics', icon: Atom, color: 'bg-cyan-500/15 border-cyan-400/30 text-cyan-300' },
  { key: 'គីមីវិទ្យា', label: 'គីមីវិទ្យា', en: 'Chemistry', icon: Beaker, color: 'bg-emerald-500/15 border-emerald-400/30 text-emerald-300' },
  { key: 'ជីវវិទ្យា', label: 'ជីវវិទ្យា', en: 'Biology', icon: Brain, color: 'bg-pink-500/15 border-pink-400/30 text-pink-300' },
  { key: 'ប្រវត្តិវិទ្យា', label: 'ប្រវត្តិវិទ្យា', en: 'History', icon: Target, color: 'bg-yellow-500/15 border-yellow-400/30 text-yellow-300' },
  { key: 'ភាសាអង់គ្លេស', label: 'ភាសាអង់គ្លេស', en: 'English', icon: Languages, color: 'bg-violet-500/15 border-violet-400/30 text-violet-300' },
];

const DUEL_SOCIAL_SUBJECTS = [
  { key: 'ភាសាខ្មែរ', label: 'ភាសាខ្មែរ', en: 'Khmer', icon: BookOpen, color: 'bg-amber-500/15 border-amber-400/30 text-amber-300' },
  { key: 'គណិតវិទ្យា', label: 'គណិតវិទ្យា', en: 'Math', icon: Calculator, color: 'bg-blue-500/15 border-blue-400/30 text-blue-300' },
  { key: 'ប្រវត្តិវិទ្យា', label: 'ប្រវត្តិវិទ្យា', en: 'History', icon: Target, color: 'bg-yellow-500/15 border-yellow-400/30 text-yellow-300' },
  { key: 'ភូមិវិទ្យា', label: 'ភូមិវិទ្យា', en: 'Geography', icon: Globe, color: 'bg-teal-500/15 border-teal-400/30 text-teal-300' },
  { key: 'សីលធម៌-ពលរដ្ឋវិជ្ជា', label: 'សីលធម៌-ពលរដ្ឋវិជ្ជា', en: 'Civics', icon: Scale, color: 'bg-slate-500/15 border-slate-400/30 text-slate-300' },
  { key: 'ផែនដី និងបរិស្ថាន', label: 'ផែនដី និងបរិស្ថាន', en: 'Earth', icon: Leaf, color: 'bg-green-500/15 border-green-400/30 text-green-300' },
  { key: 'ភាសាអង់គ្លេស', label: 'ភាសាអង់គ្លេស', en: 'English', icon: Languages, color: 'bg-violet-500/15 border-violet-400/30 text-violet-300' },
];

const DUEL_GENERAL_SUBJECTS = [
  { key: 'គណិតវិទ្យា', label: 'គណិតវិទ្យា', en: 'Math', icon: Calculator, color: 'bg-blue-500/15 border-blue-400/30 text-blue-300' },
  { key: 'ភាសាខ្មែរ', label: 'ភាសាខ្មែរ', en: 'Khmer', icon: BookOpen, color: 'bg-amber-500/15 border-amber-400/30 text-amber-300' },
  { key: 'វិទ្យាសាស្ត្រ', label: 'វិទ្យាសាស្ត្រ', en: 'Science', icon: Atom, color: 'bg-cyan-500/15 border-cyan-400/30 text-cyan-300' },
  { key: 'ប្រវត្តិវិទ្យា', label: 'ប្រវត្តិវិទ្យា', en: 'History', icon: Target, color: 'bg-yellow-500/15 border-yellow-400/30 text-yellow-300' },
  { key: 'ភូមិវិទ្យា', label: 'ភូមិវិទ្យា', en: 'Geography', icon: Globe, color: 'bg-teal-500/15 border-teal-400/30 text-teal-300' },
  { key: 'សីលធម៌-ពលរដ្ឋវិជ្ជា', label: 'សីលធម៌-ពលរដ្ឋវិជ្ជា', en: 'Civics', icon: Scale, color: 'bg-slate-500/15 border-slate-400/30 text-slate-300' },
  { key: 'ភាសាអង់គ្លេស', label: 'ភាសាអង់គ្លេស', en: 'English', icon: Languages, color: 'bg-violet-500/15 border-violet-400/30 text-violet-300' },
];

const BUTTON_CONFIGS = [
  { num: 'A', badge: 'bg-indigo-600/30 border-indigo-400/60 text-indigo-200', icon: Triangle },
  { num: 'B', badge: 'bg-cyan-600/30 border-cyan-400/60 text-cyan-200', icon: Diamond },
  { num: 'C', badge: 'bg-amber-600/30 border-amber-400/60 text-amber-200', icon: Circle },
  { num: 'D', badge: 'bg-emerald-600/30 border-emerald-400/60 text-emerald-200', icon: Square },
  { num: 'E', badge: 'bg-rose-600/30 border-rose-400/60 text-rose-200', icon: Triangle },
  { num: 'F', badge: 'bg-purple-600/30 border-purple-400/60 text-purple-200', icon: Diamond },
  { num: 'G', badge: 'bg-orange-600/30 border-orange-400/60 text-orange-200', icon: Circle },
  { num: 'H', badge: 'bg-sky-600/30 border-sky-400/60 text-sky-200', icon: Square }
];

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
  const isSpecificGameCard = Boolean(game && game.id && game.id !== 'arena-1v1-master' && game.subjectKey);
  const [selectedStream, setSelectedStream] = useState(() => (isSpecificGameCard ? (game?.stream || 'science') : (student?.stream || 'science')));
  const currentTheme = STREAM_THEMES[selectedStream] || STREAM_THEMES.science;
  const CurrentStreamIcon = currentTheme.icon || Atom;

  // Grade & Subject Selection for AI Questions
  const [selectedGrade, setSelectedGrade] = useState(() => parseInt(student?.grade, 10) || 12);
  const [selectedSubjectKey, setSelectedSubjectKey] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [showGradeSettings, setShowGradeSettings] = useState(false);
  const duelSubjects = selectedGrade >= 11
    ? (selectedStream === 'social' ? DUEL_SOCIAL_SUBJECTS : DUEL_SCIENCE_SUBJECTS)
    : DUEL_GENERAL_SUBJECTS;

  // Synchronized Questions Pool (Instant grade-matched pool + AI enrichment)
  const [questions, setQuestions] = useState(() => {
    const initG = parseInt(student?.grade, 10) || 12;
    return expandQuestionsTo8Options(getInstantGradeQuestions(initG, 'គណិតវិទ្យា', 8));
  });
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);

  // First to 6 Correct Score Trackers
  const [hostCorrectCount, setHostCorrectCount] = useState(0);
  const [challengerCorrectCount, setChallengerCorrectCount] = useState(0);
  const [isOvertime, setIsOvertime] = useState(false);

  // 🧠 Hint System State (Professional 8-Choice Mode)
  const [hintsRemaining, setHintsRemaining] = useState(3);        // 3 hints per match
  const [fiftyFiftyRemaining, setFiftyFiftyRemaining] = useState(2); // 2 fifty-fifty per match
  const [hiddenOptions, setHiddenOptions] = useState([]);           // Indices hidden by 50:50
  const [showHint, setShowHint] = useState(false);                 // Whether hint is visible for current question
  const [hintText, setHintText] = useState('');                    // Current hint text

  // Simultaneous Real-Time Battle State (Both players can answer simultaneously with 1 attempt each)
  const [turnStatus, setTurnStatus] = useState('playing'); // 'playing' | 'turn_ended'
  const [turnResult, setTurnResult] = useState(null); // { answeredBy, answeredByName, selectedIdx, isCorrect, scoreEarned, isAllWrong }
  const [nextTurnCountdown, setNextTurnCountdown] = useState(3);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [myChosenIdx, setMyChosenIdx] = useState(null); // Index selected by this player (locks out after 1 click)
  const [opponentWrongIdx, setOpponentWrongIdx] = useState(null); // Index selected wrongly by opponent
  const [wrongFeedbackNotice, setWrongFeedbackNotice] = useState('');
  const [solvedQuestionsSet, setSolvedQuestionsSet] = useState(() => new Set());

  const autoNextTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const hostKickedRef = useRef(false); // Tracks if host just kicked challenger (prevents poller re-firing)
  const lastProcessedTurnRef = useRef(null); // Prevents 700ms poller from restarting the 3-2-1 turn countdown

  const currentQ = useMemo(() => {
    let q = (questions && questions[currentQIndex]) || (questions && questions[0]);
    if (!q) {
      q = selectedStream === 'social' ? {
        q: 'តើប្រាសាទអង្គរវត្តត្រូវបានកសាងឡើងក្នុងរជ្ជកាលព្រះបាទណា?',
        options: ['ព្រះបាទជ័យវរ្ម័នទី៧', 'ព្រះបាទសូរ្យវរ្ម័នទី២', 'ព្រះបាទយសោវរ្ម័នទី១', 'ព្រះបាទឥសានវរ្ម័ន'],
        answer: 1,
        explanation: 'ប្រាសាទអង្គរវត្តត្រូវបានកសាងឡើងក្នុងរជ្ជកាលព្រះបាទសូរ្យវរ្ម័នទី២ ក្នុងសតវត្សរ៍ទី១២។'
      } : {
        q: 'គណនា lim (x → 2) (x² - 4) / (x - 2) = ?',
        options: ['0', '2', '4', '8'],
        answer: 2,
        explanation: '(x-2)(x+2)/(x-2) = x+2 => 4'
      };
    }
    return q;
  }, [questions, currentQIndex, selectedStream]);

  const myCorrectCount = isHost ? hostCorrectCount : challengerCorrectCount;
  const opponentCorrectCount = isHost ? challengerCorrectCount : hostCorrectCount;

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Asynchronously enrich questions from 70k master question bank ONLY for Grade 11-12
    let isSubscribed = true;
    if (selectedGrade >= 11) {
      fetchLiveExamQuestions({
        stream: selectedStream === 'social' ? 'social' : selectedStream === 'random' ? 'all' : 'science',
        subjectKey: isSpecificGameCard && game?.stream === selectedStream ? game.subjectKey : '',
        grade: String(selectedGrade),
        limit: 30,
        random: true
      }).then((livePool) => {
        if (isSubscribed && Array.isArray(livePool) && livePool.length > 0) {
          const expanded8 = expandQuestionsTo8Options(livePool);
          setQuestions(expanded8);
          if (isHost && roomCode) {
            api.createArenaRoom(roomCode, game?.id || 'arena-1v1-master', game?.subject || 'វិទ្យាសាស្ត្រ', currentStudentPayload, expanded8, String(selectedGrade), selectedStream);
          }
        }
      });
    }

    return () => {
      isSubscribed = false;
      document.body.style.overflow = '';
      clearTimeout(autoNextTimerRef.current);
      clearInterval(countdownIntervalRef.current);
      clearInterval(pollingIntervalRef.current);
    };
  }, []);

  // Reset wrong attempts, timer, and hint state when question index advances
  useEffect(() => {
    setMyChosenIdx(null);
    setOpponentWrongIdx(null);
    setWrongFeedbackNotice('');
    setSecondsLeft(60);
    setHiddenOptions([]);
    setShowHint(false);
    setHintText('');
  }, [currentQIndex]);

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

  // Switch to next question (Idempotent for both Host & Challenger)
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

    // Prepare next question from 60k pool without repeating solved ones
    let extra = [];
    if (currentQIndex + 1 >= questions.length) {
      const extraRaw = getRandomizedGameQuestions(
        isSpecificGameCard && game?.stream === selectedStream ? game : null,
        20,
        '12',
        selectedStream
      ).filter(q => !solvedQuestionsSet.has(q?.id || q?.q));
      extra = expandQuestionsTo8Options(extraRaw);
      setQuestions((prev) => [...prev, ...extra]);
    }

    const nextIdx = currentQIndex + 1;
    setCurrentQIndex(nextIdx);
    setMyChosenIdx(null);
    setOpponentWrongIdx(null);
    setWrongFeedbackNotice('');
    setTurnStatus('playing');
    setTurnResult(null);
    setSecondsLeft(60);
    setNextTurnCountdown(3);

    try {
      await api.nextTurn(roomCode, currentQIndex, extra);
    } catch (e) { }
  }, [currentQIndex, questions.length, roomCode, hostCorrectCount, challengerCorrectCount, myCorrectCount, opponentCorrectCount, addXP, game, selectedStream, solvedQuestionsSet]);

  // Start 3-2-1 countdown after an answer is solved (Guaranteed 1 execution per question)
  const triggerTurnEndCountdown = useCallback((result) => {
    if (!result) return;

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
      setQuestions(expandQuestionsTo8Options(roomQuestions));
    }
    lastProcessedTurnRef.current = null;
    setCurrentQIndex(0);
    setMyChosenIdx(null);
    setOpponentWrongIdx(null);
    setWrongFeedbackNotice('');
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
    setSecondsLeft(60);
    setNextTurnCountdown(3);
    // Clear solved questions set so rematch gets fully fresh questions
    setSolvedQuestionsSet(new Set());
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

  // Real-Time Profile & Room Sync Listener across tabs & users
  useEffect(() => {
    let bc = null;
    let roomBc = null;
    if (typeof BroadcastChannel !== 'undefined') {
      bc = new BroadcastChannel('khmer_elearn_profile_sync');
      bc.onmessage = () => {
        fetchStudents();
      };

      roomBc = new BroadcastChannel('khmer_elearn_arena_room_sync');
      roomBc.onmessage = (event) => {
        const msg = event?.data;
        if (msg && msg.roomCode === roomCode && !isHost) {
          if (msg.type === 'STREAM_CHANGED' && msg.stream) {
            setSelectedStream(msg.stream);
            if (Array.isArray(msg.questions) && msg.questions.length > 0) {
              setQuestions(expandQuestionsTo8Options(msg.questions));
            }
          }
        }
      };
    }
    return () => {
      if (bc) bc.close();
      if (roomBc) roomBc.close();
    };
  }, [roomCode, isHost]);

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
            if (res.room.stream) setSelectedStream(res.room.stream);
            if (Array.isArray(res.room.questions) && res.room.questions.length > 0) {
              setQuestions(expandQuestionsTo8Options(res.room.questions));
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
      const initialPool = expandQuestionsTo8Options(getRandomizedGameQuestions(game, 24, '12', selectedStream));
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
            if (currentStep === 'battle' || currentStep === 'countdown') {
              clearTimeout(autoNextTimerRef.current);
              clearInterval(countdownIntervalRef.current);
              setCurrentStep('results');
              setOpponentLeftNotice('ម្ចាស់បន្ទប់បានចាកចេញពីការប្រកួត (Victory by Forfeit!)');
              try {
                confetti({ particleCount: 160, spread: 90, origin: { y: 0.6 } });
              } catch (e) { }
              if (soundEnabled) playSound.correct();
              addXP(game?.xpReward ? game.xpReward + 350 : 500);
            } else if (currentStep === 'results') {
              setOpponentLeftNotice('ម្ចាស់បន្ទប់បានចាកចេញពីបន្ទប់ប្រកួតហើយ');
            } else {
              setHostWarningNotice('ម្ចាស់បន្ទប់ (Admin) បានបោះបង់ ឬបិទការប្រកួតហើយ!');
              setTimeout(() => {
                if (typeof onClose === 'function') onClose();
              }, 1200);
            }
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

        // Check if challenger left or forfeited
        const isChallengerDisconnected = isHost && (room.status === 'opponent_left' || room.challengerLeft || (!room.challenger && currentStep !== 'lobby'));
        if (isChallengerDisconnected && !hostKickedRef.current) {
          setChallengerPlayer(null);
          setIsChallengerReady(false);
          setMyRematchRequested(false);
          setOpponentRematchRequested(false);

          if (currentStep === 'battle' || currentStep === 'countdown') {
            clearTimeout(autoNextTimerRef.current);
            clearInterval(countdownIntervalRef.current);
            setCurrentStep('results');
            setTurnStatus('playing');
            setTurnResult(null);
            setOpponentLeftNotice('គូប្រជែងបានចាកចេញពីបន្ទប់ប្រកួតហើយ (Victory by Forfeit!)');
            try {
              confetti({ particleCount: 160, spread: 90, origin: { y: 0.6 } });
            } catch (e) { }
            if (soundEnabled) playSound.correct();
            addXP(game?.xpReward ? game.xpReward + 350 : 500);
          } else if (currentStep === 'results') {
            setOpponentLeftNotice('គូប្រជែងបានចាកចេញពីបន្ទប់ប្រកួតហើយ');
          }
        }

        // Rematch launched by both agreeing
        if (currentStep === 'results' && room.status === 'countdown') {
          startCountdown(room.questions);
        }

        // Synchronize Questions pool for Challenger without creating unnecessary re-renders
        if (!isHost && Array.isArray(room.questions) && room.questions.length > 0) {
          setQuestions((prev) => {
            if (prev && prev.length === room.questions.length && prev[0]?.id === room.questions[0]?.id) {
              return prev;
            }
            return room.questions;
          });
        }

        // Synchronize Scores & Correct Counts only when values change
        if (isHost) {
          if (typeof room.challengerScore === 'number') {
            setOpponentScore((prev) => prev !== room.challengerScore ? room.challengerScore : prev);
          }
        } else {
          if (typeof room.hostScore === 'number') {
            setOpponentScore((prev) => prev !== room.hostScore ? room.hostScore : prev);
          }
        }
        if (typeof room.hostCorrectCount === 'number') {
          setHostCorrectCount((prev) => prev !== room.hostCorrectCount ? room.hostCorrectCount : prev);
        }
        if (typeof room.challengerCorrectCount === 'number') {
          setChallengerCorrectCount((prev) => prev !== room.challengerCorrectCount ? room.challengerCorrectCount : prev);
        }
        if (typeof room.isOvertime === 'boolean') {
          setIsOvertime((prev) => prev !== room.isOvertime ? room.isOvertime : prev);
        }

        // Automatic start trigger for Challenger in lobby
        if (!isHost && currentStep === 'lobby' && (room.status === 'countdown' || room.status === 'battle')) {
          startCountdown(room.questions);
        }

        // Synchronize Turn Result when other player finishes their turn or both answer wrong
        if (currentStep === 'battle') {
          if (room.turnStatus === 'turn_ended' && room.turnResult) {
            triggerTurnEndCountdown(room.turnResult);
          }

          // Synchronize opponent wrong attempt if playing
          if (room.wrongAttempts) {
            if (isHost && room.wrongAttempts.challenger !== null && typeof room.wrongAttempts.challenger === 'number') {
              setOpponentWrongIdx(room.wrongAttempts.challenger);
            } else if (!isHost && room.wrongAttempts.host !== null && typeof room.wrongAttempts.host === 'number') {
              setOpponentWrongIdx(room.wrongAttempts.host);
            }
          }

          // Advance turn on challenger when host progresses
          if (!isHost && typeof room.currentQIndex === 'number' && room.currentQIndex > currentQIndex) {
            setCurrentQIndex(room.currentQIndex);
            setActiveTurn(room.activeTurn || 'host');
            setTurnStatus('playing');
            setTurnResult(null);
            setMyChosenIdx(null);
            setOpponentWrongIdx(null);
            setWrongFeedbackNotice('');
            setSecondsLeft(60);
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
    resetGameSessionQuestions();
    setSelectedStream(newStream);
    setSelectedSubjectKey(null); // Reset subject when stream changes

    // If grade < 11 and switching to science/social, auto-reset to random
    if (selectedGrade < 11 && (newStream === 'science' || newStream === 'social')) {
      // Still allow it but questions will be general
    }

    const freshQuestions = expandQuestionsTo8Options(getRandomizedGameQuestions(null, 24, String(selectedGrade), newStream));
    setQuestions(freshQuestions);

    // Broadcast immediately across tabs
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        const roomBc = new BroadcastChannel('khmer_elearn_arena_room_sync');
        roomBc.postMessage({
          type: 'STREAM_CHANGED',
          roomCode,
          stream: newStream,
          questions: freshQuestions
        });
        roomBc.close();
      }
    } catch (e) {}

    try {
      await api.updateArenaRoom(roomCode, {
        stream: newStream,
        questions: freshQuestions
      });

      // Asynchronously enrich with authentic stream-specific questions from 70k bank
      fetchLiveExamQuestions({
        stream: newStream,
        grade: String(selectedGrade),
        limit: 30,
        random: true
      }).then((livePool) => {
        if (Array.isArray(livePool) && livePool.length > 0) {
          const expandedPool = expandQuestionsTo8Options(livePool);
          setQuestions(expandedPool);
          api.updateArenaRoom(roomCode, {
            stream: newStream,
            questions: expandedPool
          });

          try {
            if (typeof BroadcastChannel !== 'undefined') {
              const roomBc = new BroadcastChannel('khmer_elearn_arena_room_sync');
              roomBc.postMessage({
                type: 'STREAM_CHANGED',
                roomCode,
                stream: newStream,
                questions: expandedPool
              });
              roomBc.close();
            }
          } catch (e) {}
        }
      });
    } catch (e) {}
  };

  // Live AI Question Generator for 1v1 Arena (Fast & Non-Blocking)
  const fetchDuelAIQuestions = async (targetGrade, targetSubject, targetStream) => {
    setIsLoadingAI(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || '/api';
      const streamParam = targetGrade >= 11 ? targetStream : null;
      const res = await fetch(`${API_URL}/ai/quiz-generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: String(targetGrade),
          subject: targetSubject || 'គណិតវិទ្យា',
          stream: streamParam,
          count: 5
        }),
        signal: AbortSignal.timeout(5000)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
          const expanded = expandQuestionsTo8Options(data.questions);
          setQuestions(expanded);
          setCurrentQIndex(0);
          setIsLoadingAI(false);

          try {
            await api.updateArenaRoom(roomCode, { 
              grade: String(targetGrade),
              subjectKey: targetSubject,
              stream: streamParam || 'general',
              questions: expanded 
            });
            if (typeof BroadcastChannel !== 'undefined') {
              const roomBc = new BroadcastChannel('khmer_elearn_arena_room_sync');
              roomBc.postMessage({ 
                type: 'STREAM_CHANGED', 
                roomCode, 
                stream: streamParam || 'general', 
                questions: expanded 
              });
              roomBc.close();
            }
          } catch (e) {}
          return expanded;
        }
      }
    } catch (err) {
      console.warn('[Duel AI Quiz]:', err.message);
    }

    setIsLoadingAI(false);
    return null;
  };

  // Host selects grade level (1 - 12) — Instant 0ms response + background AI
  const handleSelectGrade = (grade) => {
    if (!isHost) return;
    if (soundEnabled) playSound.click();
    setSelectedGrade(grade);
    setSelectedSubjectKey(null);

    // If grade < 11, stream is 'random' (no science/social split); if >= 11, default to 'science'
    let nextStream = selectedStream;
    if (grade < 11) {
      nextStream = 'random';
    } else if (selectedStream === 'random') {
      nextStream = 'science';
    }
    setSelectedStream(nextStream);
    resetGameSessionQuestions();

    // 1. INSTANT: Immediately switch questions to target grade in 0 milliseconds
    const instantQ = expandQuestionsTo8Options(getInstantGradeQuestions(grade, 'គណិតវិទ្យា', 8));
    setQuestions(instantQ);
    setCurrentQIndex(0);

    try {
      api.updateArenaRoom(roomCode, { grade: String(grade), stream: nextStream, questions: instantQ });
    } catch (e) {}

    // 2. Non-blocking AI background enrichment
    fetchDuelAIQuestions(grade, 'គណិតវិទ្យា', nextStream);
  };

  // Host selects a specific subject — Instant 0ms response + background AI
  const handleSelectSubject = (subjectKey) => {
    if (!isHost) return;
    if (soundEnabled) playSound.click();
    setSelectedSubjectKey(subjectKey);
    resetGameSessionQuestions();

    // 1. INSTANT: Immediately load authentic questions for this grade & subject in 0 milliseconds
    const instantQ = expandQuestionsTo8Options(getInstantGradeQuestions(selectedGrade, subjectKey, 8));
    setQuestions(instantQ);
    setCurrentQIndex(0);

    try {
      api.updateArenaRoom(roomCode, { grade: String(selectedGrade), subjectKey, stream: selectedStream, questions: instantQ });
    } catch (e) {}

    // 2. Non-blocking AI background enrichment
    fetchDuelAIQuestions(selectedGrade, subjectKey, selectedStream);
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
          setQuestions(expandQuestionsTo8Options(res.room.questions));
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

    // Reset session seen questions so fresh questions from the whole bank are chosen
    resetGameSessionQuestions();

    // Fetch completely fresh 24-question pool using the CURRENT selectedStream
    let freshQuestions = expandQuestionsTo8Options(getRandomizedGameQuestions(
      isSpecificGameCard && game?.stream === selectedStream ? game : null,
      24,
      student?.grade || '12',
      selectedStream
    ));

    try {
      const livePool = await fetchLiveExamQuestions({
        stream: selectedStream === 'social' ? 'social' : selectedStream === 'random' ? 'all' : 'science',
        subjectKey: isSpecificGameCard && game?.stream === selectedStream ? game.subjectKey : '',
        grade: student?.grade || '12',
        limit: 24,
        random: true
      });
      if (Array.isArray(livePool) && livePool.length > 0) {
        freshQuestions = expandQuestionsTo8Options(livePool);
      }
    } catch (e) {}

    setQuestions(freshQuestions);

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

  // Timeout handler for 60s round (Advances when timer expires)
  const handleRoundTimeout = useCallback(() => {
    if (turnStatus === 'turn_ended' || currentStep !== 'battle') return;

    const now = Date.now();
    const timeoutResult = {
      turnId: `turn_to_${now}_${currentQIndex}`,
      answeredBy: 'none',
      answeredByName: 'គ្មានកីឡាករ',
      selectedIdx: -1,
      isCorrect: false,
      isAllWrong: false,
      scoreEarned: 0,
      isTimeout: true,
      hostCorrectCount,
      challengerCorrectCount,
      timestamp: now
    };

    if (isHost) {
      try {
        api.submitTurnAnswer(roomCode, isHost, -1, false, 0, true);
      } catch (e) { }
    }

    triggerTurnEndCountdown(timeoutResult);
  }, [turnStatus, currentStep, currentQIndex, hostCorrectCount, challengerCorrectCount, roomCode, isHost, triggerTurnEndCountdown]);

  // Question Timer (60s / 1 min) - Active for both players during round
  useEffect(() => {
    if (currentStep !== 'battle' || turnStatus === 'turn_ended') return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleRoundTimeout();
          return 0;
        }
        if (prev <= 5 && soundEnabled) {
          playSound.timerWarning();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentStep, currentQIndex, turnStatus, handleRoundTimeout, soundEnabled]);

  // Player clicks an answer option (1 Attempt only: Wrong = locked out, Both Wrong = change question, Correct = wins round)
  const handleSelectOption = async (idx) => {
    if (turnStatus === 'turn_ended' || currentStep !== 'battle') return;
    if (myChosenIdx !== null) return; // User already chose for this question (1 attempt only!)

    setMyChosenIdx(idx);
    const isCorrect = idx === currentQ.answer;

    // CASE 1: WRONG ANSWER -> Mark as wrong and lock out current player!
    if (!isCorrect) {
      if (soundEnabled) playSound.wrong();
      setWrongFeedbackNotice('❌ អ្នកបានជ្រើសរើសខុស! អ្នកមិនអាចជ្រើសរើសម្តងទៀតលើសំណួរនេះទេ');

      // Check if opponent is already wrong OR playing alone
      const isBothWrong = challengerPlayer
        ? (opponentWrongIdx !== null)
        : true;

      if (isBothWrong) {
        const now = Date.now();
        const allWrongResult = {
          turnId: `turn_all_wrong_${now}_${currentQIndex}`,
          answeredBy: 'both_wrong',
          answeredByName: 'គ្មានអ្នកឆ្លើយត្រូវ (ឆ្លើយខុសទាំងអស់)',
          selectedIdx: idx,
          isCorrect: false,
          isAllWrong: true,
          isTimeout: false,
          scoreEarned: 0,
          hostCorrectCount,
          challengerCorrectCount,
          timestamp: now
        };

        try {
          await api.submitTurnAnswer(roomCode, isHost, idx, false, 0, false, true);
        } catch (e) { }

        triggerTurnEndCountdown(allWrongResult);
      } else {
        try {
          await api.submitTurnAnswer(roomCode, isHost, idx, false, 0, false, false);
        } catch (e) { }
      }
      return;
    }

    // CASE 2: CORRECT ANSWER -> Current player wins the round!
    if (soundEnabled) playSound.correct();

    const newHostCount = isHost ? hostCorrectCount + 1 : hostCorrectCount;
    const newChallengerCount = isHost ? challengerCorrectCount : challengerCorrectCount + 1;

    setHostCorrectCount(newHostCount);
    setChallengerCorrectCount(newChallengerCount);

    if (isHost) {
      setMyScore((s) => s + 100);
    } else {
      setMyScore((s) => s + 100);
    }

    const now = Date.now();
    const correctResult = {
      turnId: `turn_win_${now}_${currentQIndex}`,
      answeredBy: isHost ? 'host' : 'challenger',
      answeredByName: isHost ? (hostPlayer?.name || 'ម្ចាស់បន្ទប់') : (challengerPlayer?.name || 'គូប្រជែង'),
      selectedIdx: idx,
      isCorrect: true,
      isAllWrong: false,
      isTimeout: false,
      scoreEarned: 100,
      hostCorrectCount: newHostCount,
      challengerCorrectCount: newChallengerCount,
      timestamp: now
    };

    setSolvedQuestionsSet((prev) => new Set([...prev, currentQ?.id || currentQ?.q]));

    try {
      await api.submitTurnAnswer(roomCode, isHost, idx, true, 100, false, false, newHostCount, newChallengerCount);
    } catch (e) { }

    triggerTurnEndCountdown(correctResult);
  };

  // Copy Room Link to Clipboard
  const handleCopyLink = () => {
    const url = `${window.location.origin}/playground?room=${roomCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (soundEnabled) playSound.click();
  };

  // Share via Social Channels
  const handleShareTelegram = () => {
    const url = encodeURIComponent(`${window.location.origin}/playground?room=${roomCode}`);
    const text = encodeURIComponent(`⚔️ ចូលរួមសង្វៀនប្រកួត 1v1 Arena ជាមួយខ្ញុំនៅលើ Khmer E-Learning! លេខកូដបន្ទប់ PIN: #${roomCode}`);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(`${window.location.origin}/playground?room=${roomCode}`);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  // Filter available registered students for Invite modal (Excludes current student)
  const filteredStudents = (realStudents || []).filter((u) => {
    const currentId = student?.id;
    const currentUsername = (student?.username || student?.nickname || '').trim().toLowerCase();
    const currentEmail = (student?.email || '').trim().toLowerCase();
    const currentName = (student?.full_name || student?.fullName || student?.name || '').trim().toLowerCase();

    const uId = u.id;
    const uUsername = (u.username || u.nickname || '').trim().toLowerCase();
    const uEmail = (u.email || '').trim().toLowerCase();
    const uName = (u.full_name || u.name || '').trim().toLowerCase();

    // Check if u is the current user
    const isSelf = (currentId && uId && String(currentId) === String(uId)) ||
      (currentUsername && uUsername && currentUsername === uUsername) ||
      (currentEmail && uEmail && currentEmail === uEmail) ||
      (currentName && uName && currentName === uName) ||
      (student?.studentId && u.student_id && String(student.studentId) === String(u.student_id));

    const query = (inviteSearch || '').trim().toLowerCase();
    if (!query) return !isSelf;
    return !isSelf && (
      uName.includes(query) ||
      uUsername.includes(query) ||
      uEmail.includes(query) ||
      (u.school && u.school.toLowerCase().includes(query))
    );
  });

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-1 sm:p-4 bg-black/90 backdrop-blur-lg animate-fade-in font-kantumruy overflow-y-auto">
      
      {/* ARENA CONTAINER BOX */}
      <div className={`relative w-full ${currentStep === 'lobby' ? 'max-w-5xl xl:max-w-6xl' : 'max-w-4xl'} h-[98dvh] sm:h-auto sm:max-h-[92vh] rounded-2xl sm:rounded-3xl overflow-hidden border flex flex-col shadow-2xl transition-all duration-300 ${currentStep === 'lobby' ? 'valorant-grid-bg border-cyan-500/30 shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_30px_rgba(0,245,212,0.1)]' : `${currentTheme.boxBg} ${currentTheme.boxBorder}`}`}>
        
        {/* TOP STATUS HEADER */}
        <header className="px-3 sm:px-6 py-2.5 sm:py-3 border-b border-white/10 flex items-center justify-between gap-2 sm:gap-4 bg-[#060a12]/95 backdrop-blur-md relative z-20 flex-shrink-0">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {/* Official Ministry Crest Logo Badge */}
            <div className="relative flex-shrink-0 group">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/25 via-cyan-400/25 to-amber-500/25 rounded-2xl blur-xs group-hover:blur-sm transition-all duration-300 pointer-events-none" />
              <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-gradient-to-br from-[#0c1626] to-[#040810] border border-cyan-500/40 p-1 shadow-[0_0_20px_rgba(0,245,212,0.2)] flex items-center justify-center relative overflow-hidden backdrop-blur-md">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#00f5d418,transparent_70%)]" />
                <img
                  src="/assets/moeys-crest-transparent.png"
                  alt="MoEYS Official Crest"
                  onError={(e) => { e.currentTarget.src = '/assets/moeys-custom-logo-transparent.png'; }}
                  className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] relative z-10 select-none transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            </div>

            {/* Title & Institutional Badges */}
            <div className="min-w-0 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="text-[10px] sm:text-[11px] font-mono font-black uppercase tracking-widest text-[#00f5d4] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f5d4] animate-ping" />
                  <span>ក្រសួងអប់រំ យុវជន និងកីឡា // MOEYS ARENA</span>
                </span>
                <span className="text-[9px] sm:text-[10px] px-2 py-0.5 font-mono font-bold border flex items-center gap-1 shadow-xs valorant-tag bg-cyan-500/10 text-cyan-300 border-cyan-400/30">
                  <CurrentStreamIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                  <span className="truncate">{currentTheme.shortName}</span>
                </span>
                <span className="hidden md:inline-flex text-[9px] px-2 py-0.5 font-mono font-bold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded-xs">
                  FIRST TO 6 TO WIN
                </span>
                {isOvertime && (
                  <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 bg-rose-500/20 text-rose-300 font-mono font-bold border border-rose-500/40 animate-pulse flex items-center gap-1 valorant-tag">
                    OT // OVERTIME
                  </span>
                )}
              </div>
              <h2 className="text-xs sm:text-base md:text-lg font-black text-white leading-tight truncate mt-0.5 tracking-tight">
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
              <div className={`px-2 sm:px-2.5 h-8 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center font-mono font-black text-[11px] sm:text-xs border transition-colors ${
                secondsLeft <= 10 
                  ? 'bg-rose-500/25 text-rose-300 border-rose-500/50 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.4)]' 
                  : 'bg-slate-800/90 text-amber-300 border-slate-700/80 shadow-xs'
              }`}>
                {secondsLeft}s
              </div>
            )}

            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="w-8 h-8 sm:w-9 sm:h-9 valorant-tag bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-xs"
              title="Toggle Audio"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00f5d4]" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />}
            </button>

            <button
              type="button"
              onClick={handleCloseModal}
              className="w-8 h-8 sm:w-9 sm:h-9 valorant-tag bg-slate-800/90 hover:bg-rose-600/30 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 flex items-center justify-center transition-all cursor-pointer shadow-xs"
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
          <div className="p-3 sm:p-6 md:p-8 flex-1 flex flex-col justify-between overflow-y-auto space-y-4 sm:space-y-6 animate-fade-in relative z-10">
            
            {/* ═══ AAA VALORANT TACTICAL TOP HUD BAR ═══ */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-3 bg-[#060b14]/95 p-2.5 sm:p-3 rounded-2xl border border-cyan-500/25 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
              {/* Corner Sci-Fi Accent Marks */}
              <div className="absolute top-0 left-0 w-20 h-[2px] bg-gradient-to-r from-[#00f5d4] to-transparent pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-20 h-[2px] bg-gradient-to-l from-[#ff4655] to-transparent pointer-events-none" />
              <div className="absolute top-0 right-0 w-[2px] h-4 bg-[#ff4655] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[2px] h-4 bg-[#00f5d4] pointer-events-none" />

              {/* POD 1: PIN CODE + QUICK INVITE + CHANNELS */}
              <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap sm:flex-nowrap">
                {/* Tactical Room PIN Badge */}
                <div className="flex items-center bg-[#0c1422] border border-amber-500/35 hover:border-amber-400/60 rounded-xl overflow-hidden h-10 shadow-sm transition-all">
                  <div className="px-3 flex items-center gap-1.5 border-r border-amber-500/20 bg-amber-500/10 h-full">
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider">PIN //</span>
                    <span className="text-sm font-mono font-black text-amber-300 tracking-widest">#{roomCode}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(roomCode);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="px-3 h-full hover:bg-amber-500/20 text-[11px] font-mono font-black text-amber-300 transition-colors cursor-pointer flex items-center gap-1.5 active:scale-95"
                    title="Copy Match PIN"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-400" />
                        <span>COPY</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Instant Link Invite Button */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="h-10 px-3.5 rounded-xl bg-[#0c1422] hover:bg-[#121c2e] border border-slate-700/80 hover:border-cyan-400/50 text-slate-200 hover:text-white text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 shadow-xs active:scale-95"
                  title="Copy Match Invite Link"
                >
                  <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">INVITE LINK</span>
                </button>

                {/* Tactical Mini Share Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleShareTelegram}
                    className="w-10 h-10 rounded-xl bg-[#0c1422] hover:bg-[#229ED9]/20 border border-slate-700/80 hover:border-[#229ED9]/60 text-[#229ED9] transition-all cursor-pointer flex items-center justify-center shadow-xs active:scale-95"
                    title="Share via Telegram"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleShareFacebook}
                    className="w-10 h-10 rounded-xl bg-[#0c1422] hover:bg-[#1877F2]/20 border border-slate-700/80 hover:border-[#1877F2]/60 text-[#1877F2] transition-all cursor-pointer flex items-center justify-center shadow-xs active:scale-95"
                    title="Share via Facebook"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* POD 2: COMPETITIVE TELEMETRY (Center) */}
              <div className="hidden xl:flex items-center gap-2.5 text-[11px] font-mono">
                <div className="flex items-center gap-2 px-3.5 h-10 rounded-xl bg-[#0c1422] border border-white/10 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-[#00f5d4] animate-pulse shadow-[0_0_10px_#00f5d4]" />
                  <span className="font-black text-white tracking-wider">128 TICK</span>
                  <span className="text-slate-600">//</span>
                  <span className="text-slate-400">TACTICAL HUD</span>
                </div>

                <div className="flex items-center gap-2 px-3.5 h-10 rounded-xl bg-[#0c1422] border border-cyan-500/30 text-cyan-300">
                  <span className="font-bold">ថ្នាក់ទី {KHMER_NUMS[selectedGrade - 1]}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-amber-300 font-bold uppercase">{selectedStream === 'social' ? 'វិទ្យាសាស្ត្រសង្គម' : 'វិទ្យាសាស្ត្រពិត'}</span>
                </div>
              </div>

              {/* POD 3: CONFIGURATION DRAWER & MODE TOGGLES (Right) */}
              <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
                {isHost && (
                  <button
                    type="button"
                    onClick={() => setShowGradeSettings(!showGradeSettings)}
                    className={`h-10 px-4 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer flex items-center gap-2 active:scale-95 ${
                      showGradeSettings
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                        : 'bg-[#0c1422] hover:bg-[#121c2e] text-slate-300 hover:text-white border-slate-700/80 hover:border-amber-400/50'
                    }`}
                    title="កំណត់កម្រិតថ្នាក់ & ផ្នែកប្រកួត"
                  >
                    <GraduationCap className="w-4 h-4 text-amber-400" />
                    <span>G{selectedGrade} {showGradeSettings ? '▲ CLOSE' : '⚙️ CONFIG'}</span>
                  </button>
                )}

                {/* Tactical Segmented Switch: LOBBY vs JOIN PIN */}
                <div className="flex items-center p-1 rounded-xl bg-[#040810] border border-slate-800 h-10 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setTab('host')}
                    className={`px-4 h-full rounded-lg text-xs font-mono font-black tracking-wider transition-all cursor-pointer flex items-center ${
                      tab === 'host'
                        ? 'bg-[#ff4655] text-white shadow-[0_0_16px_rgba(255,70,85,0.6)]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    LOBBY
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab('join')}
                    className={`px-4 h-full rounded-lg text-xs font-mono font-black tracking-wider transition-all cursor-pointer flex items-center ${
                      tab === 'join'
                        ? 'bg-[#ff4655] text-white shadow-[0_0_16px_rgba(255,70,85,0.6)]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    JOIN PIN
                  </button>
                </div>
              </div>
            </div>

            {/* TAB: JOIN BY PIN */}
            {tab === 'join' && (
              <div className="bg-[#0b121c] p-6 sm:p-8 rounded-2xl border border-slate-800 max-w-md mx-auto w-full space-y-4 shadow-2xl my-auto valorant-tactical-card">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-xl bg-[#ff4655]/15 border border-[#ff4655]/30 text-[#ff4655] flex items-center justify-center mx-auto mb-2 shadow-[0_0_15px_rgba(255,70,85,0.25)]">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-black text-white font-mono tracking-wide">ENTER ACCESS CODE // ចូលរួមបន្ទប់</h3>
                  <p className="text-xs text-slate-400">បញ្ចូលលេខកូដ ៦ ខ្ទង់ដែលបានចែករំលែកដោយមិត្តភក្តិ</p>
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
                      placeholder="000000"
                      className="w-full bg-[#070b12] border-2 border-slate-700 focus:border-[#00f5d4] rounded-xl px-4 py-3 text-center text-2xl font-mono font-black text-amber-300 placeholder:text-slate-700 tracking-widest outline-none shadow-inner"
                    />
                  </div>

                  {joinError && (
                    <div className="p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold text-center flex items-center justify-center gap-1.5 animate-fade-in font-mono">
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
                      className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold border border-slate-700 transition-colors cursor-pointer"
                    >
                      PASTE CODE FROM CLIPBOARD
                    </button>
                  </div>
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={handleJoinWithCode}
                    className="valorant-cta-btn w-full py-3 flex items-center justify-center gap-2 text-sm font-black"
                  >
                    <LogIn className="w-4 h-4 text-white" />
                    <span>CONNECT TO MATCH (JOIN)</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB: HOST / 1v1 MATCHUP CARDS */}
            {tab === 'host' && (
              <div className="space-y-4 sm:space-y-6 my-auto">

                {/* ═══ OPTIONAL EXPANDABLE GRADE & STREAM CONFIGURATION ═══ */}
                {showGradeSettings && (
                  <div className="relative rounded-xl p-4 sm:p-5 bg-[#0a111a]/95 border border-amber-500/30 shadow-xl space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-amber-400" />
                        <h4 className="text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-wider">
                          ACADEMY LEVEL & STREAM // កម្រិតថ្នាក់ & ផ្នែកប្រកួត
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowGradeSettings(false)}
                        className="text-slate-400 hover:text-white text-xs font-mono px-2 py-0.5 rounded bg-slate-800"
                      >
                        ✕ CLOSE
                      </button>
                    </div>

                    {/* 12-Slot Tactical Grade Cards */}
                    <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => {
                        const isSelected = selectedGrade === g;
                        const isBac2 = g >= 11;
                        return (
                          <button
                            key={g}
                            type="button"
                            disabled={!isHost}
                            onClick={() => handleSelectGrade(g)}
                            className={`valorant-tag py-2 px-1 flex flex-col items-center justify-center transition-all ${
                              isSelected
                                ? 'bg-[#00f5d4] text-slate-950 font-black shadow-[0_0_12px_rgba(0,245,212,0.4)] scale-105 z-10'
                                : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700'
                            } ${isHost ? 'cursor-pointer' : 'cursor-default opacity-85'}`}
                          >
                            {isBac2 && (
                              <span className={`text-[7px] font-black px-1 rounded-sm mb-0.5 uppercase ${
                                isSelected ? 'bg-slate-950 text-[#00f5d4]' : 'text-amber-400'
                              }`}>
                                BAC II
                              </span>
                            )}
                            <span className="text-sm sm:text-base font-black leading-none font-mono">
                              {KHMER_NUMS[g - 1]}
                            </span>
                            <span className={`text-[8px] mt-0.5 font-mono ${
                              isSelected ? 'text-slate-900 font-bold' : 'text-slate-500'
                            }`}>
                              G{g}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Track Selection (Grades 11-12) */}
                    {selectedGrade >= 11 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
                        <button
                          type="button"
                          disabled={!isHost}
                          onClick={() => handleSelectStream('science')}
                          className={`p-3 rounded-lg text-left transition-all border ${
                            selectedStream === 'science'
                              ? 'bg-cyan-950/40 border-[#00f5d4] shadow-[0_0_15px_rgba(0,245,212,0.2)]'
                              : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Atom className="w-4 h-4 text-[#00f5d4]" />
                            <div>
                              <div className="text-xs font-bold text-white">ថ្នាក់វិទ្យាសាស្ត្រពិត (Natural Science)</div>
                              <div className="text-[10px] text-slate-400">គណិត, រូប, គីមី, ជីវ, អង់គ្លេស</div>
                            </div>
                          </div>
                        </button>

                        <button
                          type="button"
                          disabled={!isHost}
                          onClick={() => handleSelectStream('social')}
                          className={`p-3 rounded-lg text-left transition-all border ${
                            selectedStream === 'social'
                              ? 'bg-amber-950/40 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                              : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <BookOpen className="w-4 h-4 text-amber-400" />
                            <div>
                              <div className="text-xs font-bold text-white">ថ្នាក់វិទ្យាសាស្ត្រសង្គម (Social Science)</div>
                              <div className="text-[10px] text-slate-400">ខ្មែរ, គណិត, ប្រវត្តិ, ភូមិ, សីលធម៌, ផែនដី</div>
                            </div>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* ═══ 1. VALORANT TACTICAL SUBJECT LOADOUT DECK ═══ */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs px-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[#00f5d4] font-mono font-black">//</span>
                      <span className="font-mono font-bold text-white uppercase tracking-wider text-xs sm:text-sm">
                        SELECT BATTLE SUBJECT // ជ្រើសរើសមុខវិជ្ជាប្រកួត
                      </span>
                    </div>

                    {isLoadingAI ? (
                      <span className="text-[11px] text-amber-400 font-mono font-medium animate-pulse flex items-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>PREPARING QUESTIONS G{selectedGrade}...</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">INSTANT POOL READY (0ms)</span>
                        <span className="sm:hidden">READY</span>
                      </span>
                    )}
                  </div>

                  {/* 7-Subject Loadout Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                    {duelSubjects.map((sub) => {
                      const SubIcon = sub.icon;
                      const isActive = selectedSubjectKey === sub.key;
                      return (
                        <button
                          key={sub.key}
                          type="button"
                          disabled={!isHost}
                          onClick={() => handleSelectSubject(sub.key)}
                          className={`valorant-loadout-tile p-3 flex flex-col items-center justify-center text-center cursor-pointer group ${
                            isActive
                              ? 'valorant-loadout-tile-active text-white'
                              : 'valorant-loadout-tile-inactive text-slate-300'
                          } ${!isHost ? 'opacity-85 cursor-default' : ''}`}
                        >
                          {/* Active Accent Tag */}
                          {isActive && (
                            <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#00f5d4] shadow-[0_0_8px_#00f5d4]" />
                          )}

                          {/* Subject Icon */}
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-1.5 transition-all ${
                            isActive
                              ? 'bg-[#00f5d4]/20 text-[#00f5d4] shadow-[0_0_12px_rgba(0,245,212,0.3)]'
                              : 'bg-slate-800/80 text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-800'
                          }`}>
                            <SubIcon className="w-4 h-4" />
                          </div>

                          {/* Subject Khmer Label */}
                          <span className="text-xs font-bold truncate max-w-full leading-snug">
                            {sub.label}
                          </span>

                          {/* Subject English Subtitle */}
                          <span className={`text-[8.5px] uppercase font-mono tracking-widest mt-0.5 ${
                            isActive ? 'text-[#00f5d4] font-semibold' : 'text-slate-500'
                          }`}>
                            {sub.en || 'Subject'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ═══ 2. VALORANT 2-PLAYER VERSUS MATCHUP STAGE ═══ */}
                <div className="grid grid-cols-1 md:grid-cols-11 gap-4 sm:gap-6 items-stretch relative">
                  
                  {/* Left Player Card: Host (Defender / Blue Side) */}
                  <div className="md:col-span-5 valorant-tactical-card valorant-tactical-card-host p-5 sm:p-6 relative flex flex-col items-center justify-between text-center min-h-[340px] sm:min-h-[360px] group">
                    {/* Corner Crosshairs */}
                    <div className="absolute top-1.5 left-1.5 text-[9px] font-mono text-cyan-400/40 pointer-events-none select-none">+ DEF // 01</div>
                    <div className="absolute bottom-1.5 right-1.5 text-[9px] font-mono text-cyan-400/40 pointer-events-none select-none">LOC // BLUE +</div>

                    {/* Top Status Bar */}
                    <div className="w-full flex items-center justify-between pb-3 border-b border-cyan-500/20">
                      <span className="text-xs font-mono font-black text-cyan-300 flex items-center gap-1.5 uppercase tracking-wider">
                        <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span>DEF // HOST (ម្ចាស់បន្ទប់)</span>
                      </span>
                      <span className="valorant-tag text-[10px] font-mono font-black px-3 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>LOCKED IN</span>
                      </span>
                    </div>

                    {/* Center Hero Avatar Showcase */}
                    {hostPlayer ? (
                      <div className="my-auto py-3 flex flex-col items-center w-full">
                        {/* Avatar Pedestal with Concentric Valorant Reticle */}
                        <div className="valorant-pedestal valorant-pedestal-host mb-3 relative">
                          <PlayerAvatarWithFrame
                            avatar={hostPlayer.avatar}
                            frame={hostPlayer.avatarFrame || hostPlayer.avatar_frame}
                            name={hostPlayer.name}
                            size="hero"
                            className="scale-105 drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)] relative z-10"
                          />

                          {/* Tactical Rank / Level Diamond */}
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#081320] border border-[#00f5d4] text-[10px] sm:text-[11px] font-mono font-black text-[#00f5d4] shadow-[0_0_15px_rgba(0,245,212,0.4)] valorant-tag flex items-center gap-1 z-20 whitespace-nowrap">
                            <span>LVL</span>
                            <span className="text-white">//</span>
                            <span>{hostPlayer.level || 1}</span>
                          </div>
                        </div>

                        {/* Player Name & School */}
                        <h3 className="text-lg sm:text-xl font-black text-white font-mono tracking-wider truncate max-w-[240px] mt-2 drop-shadow-md">
                          {hostPlayer.name || 'សុខ វិបុល'}
                        </h3>
                        <p className="text-xs text-slate-300 font-medium flex items-center gap-1.5 mt-1 truncate max-w-[240px] px-2.5 py-0.5 rounded bg-white/5 border border-white/10">
                          <Building2 className="w-3.5 h-3.5 text-[#00f5d4] flex-shrink-0" />
                          <span className="truncate">{hostPlayer.school || 'វិទ្យាល័យជាតិ'}</span>
                        </p>

                        {/* Tactical Combat Rating (XP) Bar */}
                        <div className="w-full max-w-[220px] mt-4 pt-3 border-t border-cyan-500/20 flex flex-col gap-1.5">
                          <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-slate-400">
                            <span>RATING (XP)</span>
                            <span className="text-[#00f5d4] font-black font-mono text-xs">{(hostPlayer.xp || 500).toLocaleString()} XP</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-cyan-500/30">
                            <div
                              className="h-full bg-gradient-to-r from-[#00f5d4] to-blue-500 rounded-full shadow-[0_0_8px_#00f5d4]"
                              style={{ width: `${Math.min(100, Math.max(20, ((hostPlayer.xp || 500) % 1000) / 10))}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="my-auto py-8 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2 font-mono">
                        <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                        <span>SYNCING AGENT DATA...</span>
                      </div>
                    )}
                  </div>

                  {/* Center: Valorant "VS" Collision Nexus */}
                  <div className="md:col-span-1 flex flex-row md:flex-col items-center justify-center py-2 relative my-auto">
                    <div className="valorant-vs-nexus w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center animate-pulse">
                      <span className="font-black text-lg sm:text-xl text-white tracking-widest font-mono">VS</span>
                    </div>
                    <div className="hidden md:flex flex-col items-center mt-2.5">
                      <span className="text-[8px] font-mono tracking-widest text-slate-500 uppercase">MATCH POINT</span>
                      <span className="text-[9px] font-mono font-black text-amber-400">FIRST TO 6</span>
                    </div>
                  </div>

                  {/* Right Player Card: Challenger (Attacker / Red Side) */}
                  <div className={`md:col-span-5 valorant-tactical-card valorant-tactical-card-challenger p-5 sm:p-6 relative flex flex-col items-center justify-between text-center min-h-[340px] sm:min-h-[360px] group ${
                    !challengerPlayer ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => {
                    if (!challengerPlayer) {
                      fetchStudents();
                      setShowInviteModal(true);
                    }
                  }}
                  >
                    {/* Corner Crosshairs */}
                    <div className="absolute top-1.5 right-1.5 text-[9px] font-mono text-rose-400/40 pointer-events-none select-none">ATK // 02 +</div>
                    <div className="absolute bottom-1.5 left-1.5 text-[9px] font-mono text-rose-400/40 pointer-events-none select-none">+ LOC // RED</div>

                    {/* Top Status Bar */}
                    <div className="w-full flex items-center justify-between pb-3 border-b border-rose-500/20">
                      <span className="text-xs font-mono font-black text-rose-300 flex items-center gap-1.5 uppercase tracking-wider">
                        <Swords className="w-4 h-4 text-rose-400" />
                        <span>ATK // CHALLENGER (គូប្រជែង)</span>
                      </span>

                      {challengerPlayer ? (
                        <div className="flex items-center gap-2">
                          {isChallengerReady ? (
                            <span className="valorant-tag text-[10px] font-mono font-black px-3 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>LOCKED IN</span>
                            </span>
                          ) : (
                            <span className="valorant-tag text-[10px] font-mono font-black px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center gap-1 animate-pulse">
                              <Clock className="w-3.5 h-3.5" />
                              <span>PREPARING...</span>
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
                              className="px-2 py-0.5 rounded bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 hover:text-white border border-rose-500/40 text-[10px] font-bold font-mono transition-all cursor-pointer"
                              title="បណ្តេញចេញ"
                            >
                              <UserX className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="valorant-tag text-[9px] font-mono font-bold px-2.5 py-0.5 bg-rose-500/15 text-rose-400 border border-rose-500/30">
                          AWAITING
                        </span>
                      )}
                    </div>

                    {/* Center Content */}
                    {challengerPlayer ? (
                      <div className="my-auto py-3 flex flex-col items-center w-full">
                        {/* Avatar Pedestal with Concentric Valorant Reticle */}
                        <div className="valorant-pedestal valorant-pedestal-challenger mb-3 relative">
                          <PlayerAvatarWithFrame
                            avatar={challengerPlayer.avatar}
                            frame={challengerPlayer.avatarFrame || challengerPlayer.avatar_frame}
                            name={challengerPlayer.name}
                            size="hero"
                            className="scale-105 drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)] relative z-10"
                          />

                          {/* Tactical Rank / Level Diamond */}
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#1d0912] border border-[#ff4655] text-[10px] sm:text-[11px] font-mono font-black text-[#ff4655] shadow-[0_0_15px_rgba(255,70,85,0.4)] valorant-tag flex items-center gap-1 z-20 whitespace-nowrap">
                            <span>LVL</span>
                            <span className="text-white">//</span>
                            <span>{challengerPlayer.level || 1}</span>
                          </div>
                        </div>

                        {/* Player Name & School */}
                        <h3 className="text-lg sm:text-xl font-black text-white font-mono tracking-wider truncate max-w-[240px] mt-2 drop-shadow-md">
                          {challengerPlayer.name}
                        </h3>
                        <p className="text-xs text-slate-300 font-medium flex items-center gap-1.5 mt-1 truncate max-w-[240px] px-2.5 py-0.5 rounded bg-white/5 border border-white/10">
                          <Building2 className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                          <span className="truncate">{challengerPlayer.school}</span>
                        </p>

                        {/* Tactical Combat Rating (XP) Bar */}
                        <div className="w-full max-w-[220px] mt-4 pt-3 border-t border-rose-500/20 flex flex-col gap-1.5">
                          <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-slate-400">
                            <span>RATING (XP)</span>
                            <span className="text-rose-400 font-black font-mono text-xs">{(challengerPlayer.xp || 500).toLocaleString()} XP</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-rose-500/30">
                            <div
                              className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full shadow-[0_0_8px_#ff4655]"
                              style={{ width: `${Math.min(100, Math.max(20, ((challengerPlayer.xp || 500) % 1000) / 10))}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Empty Slot Tactical Searching View */
                      <div className="my-auto py-6 flex flex-col items-center justify-center text-center w-full">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-dashed border-rose-500/40 flex items-center justify-center mb-3.5 bg-slate-950/80 shadow-inner group-hover:border-rose-400 transition-all">
                          <div className="absolute inset-1.5 rounded-full border border-rose-500/20 animate-ping opacity-30 pointer-events-none" />
                          <UserPlus className="w-8 h-8 text-rose-400 group-hover:scale-110 transition-transform" />
                        </div>

                        <span className="text-sm sm:text-base font-black text-white font-mono tracking-wider block uppercase">
                          // AWAITING AGENT...
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-1 max-w-[220px]">
                          ចុចប៊ូតុងខាងក្រោមដើម្បីអញ្ជើញ ឬចែករំលែក PIN
                        </span>

                        {/* Custom Valorant Slanted Invite Button */}
                        <div className="valorant-btn-borders mt-4">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              fetchStudents();
                              setShowInviteModal(true);
                            }}
                            className="valorant-invite-btn py-2.5 px-6"
                          >
                            <UserPlus className="w-4 h-4 text-rose-400" />
                            <span>អញ្ជើញកីឡាករ (INVITE)</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                </div>

                {/* ═══ 3. PRIMARY ACTION BAR ═══ */}
                <div className="flex flex-col items-center gap-3 pt-2">
                  
                  {/* Warning notice when Host tries to start without ready opponent */}
                  {isHost && hostWarningNotice && (
                    <div className="w-full max-w-md p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 text-xs font-mono font-bold text-center flex items-center justify-center gap-2 animate-fade-in shadow-sm">
                      <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      <span>{hostWarningNotice}</span>
                    </div>
                  )}

                  {isHost ? (
                    // Host: Iconic Valorant CTA Start Match Button
                    <button
                      type="button"
                      onClick={handleStartDuel}
                      className="valorant-cta-btn px-10 sm:px-14 py-3.5 flex items-center justify-center gap-3 text-sm sm:text-base active:scale-98"
                      title="Start Match"
                    >
                      <Play className="w-5 h-5 fill-white" />
                      <span>ចាប់ផ្តើមការប្រកួត (START MATCH)</span>
                    </button>
                  ) : (
                    // Challenger: Valorant Ready Button
                    <div className="flex flex-col items-center gap-2.5 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={handleToggleReady}
                        className={`valorant-cta-btn px-10 sm:px-14 py-3.5 flex items-center justify-center gap-3 text-sm sm:text-base active:scale-98 ${
                          isChallengerReady ? '!bg-gradient-to-r !from-emerald-600 !to-teal-600 !shadow-[0_0_25px_rgba(16,185,129,0.5)]' : ''
                        }`}
                      >
                        {isChallengerReady ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-white" />
                            <span>រួចរាល់ហើយ! (LOCKED IN)</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-5 h-5 fill-amber-400 text-amber-400" />
                            <span>ចុចដើម្បី READY (LOCK IN)</span>
                          </>
                        )}
                      </button>

                      {isChallengerReady && (
                        <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1.5 animate-pulse">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>កំពុងរង់ចាំម្ចាស់បន្ទប់ (Host) ចុចចាប់ផ្តើមការប្រកួត...</span>
                        </span>
                      )}
                    </div>
                  )}

                  {/* Leave Room Button */}
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="valorant-tag px-8 py-2.5 rounded-lg font-mono font-bold text-xs tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 bg-slate-900/80 hover:bg-rose-950/40 text-slate-300 hover:text-white border border-slate-700/60 hover:border-rose-500/50"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    <span>ចាកចេញពីបន្ទប់ (ABORT / LEAVE)</span>
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
                <span className="sm:hidden">1v1 DUEL • {currentTheme.shortName}</span>
                <span className="hidden sm:inline">1v1 DUEL ARENA • {currentTheme.nameKm}</span>
              </span>
              <span className={`text-[9px] sm:text-[11px] px-1.5 sm:px-2.5 py-0.5 rounded-lg font-bold border transition-all duration-300 items-center gap-1 hidden sm:flex ${currentTheme.badgeClass}`}>
                <CurrentStreamIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                <span>{currentTheme.subtitleKm}</span>
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
        {/* STEP 3: LIVE SIMULTANEOUS 1V1 RACE BATTLE */}
        {/* ========================================================================= */}
        {currentStep === 'battle' && (
          <div className="p-2 sm:p-3.5 md:p-5 flex-1 min-h-0 flex flex-col overflow-y-auto space-y-1.5 sm:space-y-2.5 animate-fade-in custom-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>

            {/* ── Score HUD ── Real-Time Progress for Both Players */}
            <div className="bg-[#0a1226]/90 backdrop-blur-sm p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl border border-slate-700/60 shadow-md flex-shrink-0">
              <div className="grid grid-cols-[1fr_auto_1fr] gap-1.5 sm:gap-2.5 items-center">

                {/* Host HUD */}
                <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all min-w-0 bg-indigo-950/60 border border-cyan-500/50 shadow-xs">
                  <div className="relative flex-shrink-0">
                    <PlayerAvatarWithFrame
                      avatar={hostPlayer?.avatar}
                      frame={hostPlayer?.avatarFrame || hostPlayer?.avatar_frame}
                      name={hostPlayer?.name}
                      size="sm"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 text-[11px] sm:text-xs font-bold">
                      <span className="text-slate-100 truncate">{hostPlayer?.name}</span>
                      <span className="text-cyan-400 font-mono font-black text-xs sm:text-sm flex-shrink-0">{isHost ? myScore : opponentScore}</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5">
                      <span className="text-[10px] sm:text-xs font-mono text-emerald-400 font-black flex items-center gap-0.5 flex-shrink-0">
                        <Trophy className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" /> {hostCorrectCount}/6
                      </span>
                      <div className="flex-1 h-1.5 sm:h-2 bg-slate-900 rounded-full overflow-hidden flex gap-px p-px border border-slate-800">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className={`flex-1 h-full rounded-full transition-all duration-300 ${i < hostCorrectCount ? 'bg-gradient-to-r from-emerald-400 to-teal-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-slate-800'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center: Round & Win Target */}
                <div className="flex flex-col items-center justify-center px-1.5 py-0.5 bg-slate-900/80 rounded-lg border border-slate-800">
                  <span className="text-[10px] sm:text-xs font-mono text-slate-300 font-bold whitespace-nowrap">{currentQIndex + 1}/{questions.length}</span>
                  <span className="text-[9px] sm:text-[10px] text-amber-400 font-mono font-black whitespace-nowrap">Win: 6</span>
                </div>

                {/* Challenger HUD */}
                <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl transition-all min-w-0 bg-rose-950/60 border border-rose-500/50 shadow-xs">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 text-[11px] sm:text-xs font-bold">
                      <span className="text-rose-400 font-mono font-black text-xs sm:text-sm flex-shrink-0">{!isHost ? myScore : opponentScore}</span>
                      <span className="text-slate-100 truncate text-right">{challengerPlayer?.name}</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5">
                      <div className="flex-1 h-1.5 sm:h-2 bg-slate-900 rounded-full overflow-hidden flex gap-px p-px border border-slate-800">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className={`flex-1 h-full rounded-full transition-all duration-300 ${i < challengerCorrectCount ? 'bg-gradient-to-r from-rose-400 to-pink-400 shadow-[0_0_6px_rgba(251,113,133,0.8)]' : 'bg-slate-800'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] sm:text-xs font-mono text-rose-400 font-black flex items-center gap-0.5 flex-shrink-0">
                        <Trophy className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" /> {challengerCorrectCount}/6
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
                  </div>
                </div>

              </div>
            </div>

            {/* ── Race Status & Feedback Banner */}
            {turnStatus === 'turn_ended' ? (
              <div className={`p-2 sm:p-3 rounded-xl border text-center text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 transition-all shadow-sm flex-shrink-0 ${
                turnResult?.isCorrect
                  ? 'bg-gradient-to-r from-emerald-950/90 to-teal-950/90 border-emerald-500/70 text-emerald-200 ring-1 ring-emerald-400/50'
                  : turnResult?.isAllWrong
                    ? 'bg-gradient-to-r from-rose-950/90 to-amber-950/90 border-rose-500/70 text-rose-200 ring-1 ring-rose-400/50'
                    : 'bg-slate-900/90 border-slate-700 text-slate-300'
              }`}>
                {turnResult?.isCorrect ? (
                  <>
                    <Trophy className="w-4 h-4 text-amber-400 animate-bounce flex-shrink-0" />
                    <span className="truncate">
                      <strong>{turnResult.answeredByName || (turnResult.answeredBy === 'host' ? hostPlayer?.name : challengerPlayer?.name)}</strong> ត្រូវ! (+{turnResult.scoreEarned} pts) • <span className="text-emerald-300 underline font-bold">{currentQ.options[currentQ.answer]}</span>
                    </span>
                  </>
                ) : turnResult?.isAllWrong ? (
                  <>
                    <XCircle className="w-4 h-4 text-rose-400 animate-pulse flex-shrink-0" />
                    <span className="truncate">
                      <strong>ខុសទាំងអស់!</strong> ចម្លើយត្រឹមត្រូវគឺ៖ <span className="text-emerald-300 underline font-bold">{currentQ.options[currentQ.answer]}</span>
                    </span>
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span className="truncate">
                      <strong>អស់ពេល (Timeout 60s)!</strong> ចម្លើយ៖ <span className="text-emerald-300 underline font-bold">{currentQ.options[currentQ.answer]}</span>
                    </span>
                  </>
                )}
              </div>
            ) : myChosenIdx !== null ? (
              <div className="p-2 sm:p-2.5 rounded-xl border text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all bg-rose-950/80 border-rose-500/60 text-rose-200 animate-pulse shadow-sm flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span className="truncate">
                  ❌ <strong>អ្នកជ្រើសរើសខុស!</strong> {challengerPlayer ? `រង់ចាំគូប្រជែង (${secondsLeft}s)...` : 'កំពុងផ្លាស់ប្តូរសំណួរ...'}
                </span>
              </div>
            ) : (
              <div className="p-2 rounded-xl border text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all bg-gradient-to-r from-indigo-600/20 via-purple-600/25 to-indigo-600/20 border-indigo-500/50 text-indigo-200 shadow-xs flex-shrink-0">
                <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce flex-shrink-0" />
                <span>
                  <strong>ប្រណាំងល្បឿន (Speed Duel)</strong> • ម្នាក់មានសិទ្ធិជ្រើសរើស ១ លើក ({secondsLeft}s)
                </span>
              </div>
            )}

            {/* ── Question Card with Hint & 50:50 Power-ups */}
            <div className="bg-gradient-to-b from-[#0e1730] to-[#080d1e] rounded-2xl p-3.5 sm:p-5 text-center border border-slate-700/60 shadow-md relative overflow-hidden flex-shrink-0">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Subject & Category Badge */}
              <span className="text-[10px] sm:text-xs font-black text-indigo-400 uppercase tracking-widest block mb-1 font-mono relative z-[1]">
                {`${currentQ?.subject ? currentQ.subject + ' • ' : ''}${currentQ?.category || (selectedStream === 'social' ? 'SOCIAL SCIENCE' : selectedStream === 'random' ? 'MIXED ACADEMIC' : 'NATURAL SCIENCE')} #${currentQIndex + 1}`}
              </span>

              {/* Question Text */}
              <h3
                className="text-sm sm:text-base md:text-lg font-extrabold text-white leading-relaxed relative z-[1] py-1"
                style={{ overflowWrap: 'anywhere', wordBreak: 'break-word', hyphens: 'auto' }}
              >
                {typeof currentQ.q === 'string' ? currentQ.q.replace(/\*\*/g, '').replace(/\*/g, '') : currentQ.q}
              </h3>

              {/* 🧠 Hint & 50:50 Power-Up Buttons */}
              {turnStatus === 'playing' && myChosenIdx === null && (
                <div className="flex flex-wrap items-center justify-center gap-2 mt-2.5 relative z-[1]">
                  {/* 💡 Hint Button */}
                  <button
                    type="button"
                    disabled={hintsRemaining <= 0 || showHint}
                    onClick={() => {
                      if (hintsRemaining > 0 && !showHint) {
                        setShowHint(true);
                        setHintText(currentQ?.hint || currentQ?.letterHint || `មុខវិជ្ជា៖ ${currentQ?.subject || 'ទូទៅ'}`);
                        setHintsRemaining((prev) => prev - 1);
                        if (soundEnabled) playSound.click();
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                      showHint
                        ? 'bg-amber-500/25 border-amber-400/60 text-amber-200 cursor-default'
                        : hintsRemaining > 0
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25 hover:border-amber-400 cursor-pointer shadow-xs'
                          : 'bg-slate-900/50 border-slate-700/50 text-slate-600 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Hint ({hintsRemaining})</span>
                  </button>

                  {/* 50:50 Button */}
                  <button
                    type="button"
                    disabled={fiftyFiftyRemaining <= 0 || hiddenOptions.length > 0}
                    onClick={() => {
                      if (fiftyFiftyRemaining > 0 && hiddenOptions.length === 0 && currentQ) {
                        const wrongIndices = [];
                        currentQ.options.forEach((_, idx) => {
                          if (idx !== currentQ.answer) wrongIndices.push(idx);
                        });
                        const shuffledWrong = wrongIndices.sort(() => 0.5 - Math.random());
                        const toHide = shuffledWrong.slice(0, 4);
                        setHiddenOptions(toHide);
                        setFiftyFiftyRemaining((prev) => prev - 1);
                        if (soundEnabled) playSound.click();
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                      hiddenOptions.length > 0
                        ? 'bg-purple-500/25 border-purple-400/60 text-purple-200 cursor-default'
                        : fiftyFiftyRemaining > 0
                          ? 'bg-purple-500/15 border-purple-500/40 text-purple-300 hover:bg-purple-500/25 hover:border-purple-400 cursor-pointer shadow-xs'
                          : 'bg-slate-900/50 border-slate-700/50 text-slate-600 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5 text-purple-400" />
                    <span>50:50 ({fiftyFiftyRemaining})</span>
                  </button>

                  {/* 8-CHOICE badge */}
                  <span className="px-2.5 py-1 rounded-xl bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 text-xs font-black tracking-wider font-cinzel">
                    8 CHOICES
                  </span>
                </div>
              )}

              {/* Hint Display */}
              {showHint && hintText && (
                <div className="mt-2 p-2 sm:p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs font-medium animate-fade-in relative z-[1]">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 inline mr-1" />
                  {hintText}
                </div>
              )}
            </div>

            {/* ── 8 Answer Options (A-H) in 2-Column Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
              {currentQ.options.map((option, idx) => {
                if (hiddenOptions.includes(idx)) return null; // Hidden by 50:50

                const config = BUTTON_CONFIGS[idx % 8];
                const isCorrectOption = idx === currentQ.answer;
                const isMyChosen = myChosenIdx === idx;
                const isOpponentWrong = opponentWrongIdx === idx;
                const hasAttempted = myChosenIdx !== null;

                let btnStyle = '';
                let iconBadgeStyle = config.badge;
                let badgeContent = config.num;

                if (turnStatus === 'turn_ended') {
                  if (isCorrectOption) {
                    btnStyle = 'bg-gradient-to-r from-emerald-950/95 via-teal-950/90 to-emerald-950/95 border-2 border-emerald-400 text-emerald-100 ring-2 ring-emerald-400/80 shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-[1.01]';
                    iconBadgeStyle = 'bg-emerald-500 text-slate-950 font-black border-emerald-300';
                    badgeContent = '✓';
                  } else if (isMyChosen && !isCorrectOption) {
                    btnStyle = 'bg-rose-950/85 border-2 border-rose-500 text-rose-300 ring-2 ring-rose-500/40 line-through opacity-80';
                    iconBadgeStyle = 'bg-rose-600/40 border-rose-500 text-rose-300';
                    badgeContent = '✕';
                  } else if (isOpponentWrong && !isCorrectOption) {
                    btnStyle = 'bg-rose-950/50 border border-rose-600/50 text-rose-300 opacity-60';
                  } else {
                    btnStyle = 'bg-[#080d1a]/80 border-slate-800/80 text-slate-600 opacity-40';
                  }
                } else {
                  if (isMyChosen) {
                    btnStyle = 'bg-rose-950/80 border-2 border-rose-500 text-rose-300 ring-2 ring-rose-500/40 line-through cursor-not-allowed';
                    iconBadgeStyle = 'bg-rose-600/40 border-rose-500 text-rose-300';
                    badgeContent = '✕';
                  } else if (hasAttempted) {
                    btnStyle = 'bg-[#080d1a]/60 border-slate-800/80 text-slate-500 opacity-40 cursor-not-allowed';
                  } else {
                    btnStyle = 'bg-[#0e1730] border border-slate-700/80 hover:border-indigo-400 hover:bg-slate-800/90 text-slate-200 cursor-pointer shadow-xs hover:scale-[1.01]';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={turnStatus === 'turn_ended' || hasAttempted}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border flex items-center gap-2.5 transition-all text-left active:scale-[0.98] min-h-[46px] sm:min-h-[50px] ${btnStyle}`}
                  >
                    <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg border flex items-center justify-center flex-shrink-0 font-mono font-black text-xs shadow-xs transition-all ${iconBadgeStyle}`}>
                      {badgeContent}
                    </div>
                    <span
                      className="text-xs sm:text-sm font-semibold flex-1 leading-snug line-clamp-2 sm:line-clamp-3"
                      style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                    >
                      {option}
                    </span>
                    {turnStatus === 'turn_ended' && isCorrectOption && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 animate-bounce drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    )}
                    {((turnStatus === 'turn_ended' && isMyChosen && !isCorrectOption) || (turnStatus === 'playing' && isMyChosen)) && (
                      <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 animate-pulse drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* ── Turn Result & Countdown Footer */}
            <div className="bg-[#0a1226]/90 backdrop-blur-sm rounded-xl p-2 sm:p-2.5 border border-slate-700/60 text-xs animate-fade-in shadow-xs flex-shrink-0 mt-auto">
              {turnStatus === 'playing' ? (
                <div className="flex items-center justify-between text-slate-300 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>ពេលនៅសល់៖ <strong className="font-mono text-amber-300 text-[11px] sm:text-xs">{secondsLeft}s</strong></span>
                  </div>
                  {myChosenIdx !== null && (
                    <span className="text-[9px] sm:text-[10px] text-rose-300 font-bold bg-rose-500/15 px-2 py-0.5 rounded-md border border-rose-500/30">
                      🔒 ជាប់សោរ (Locked)
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 min-w-0">
                    {turnResult?.isCorrect ? (
                      <span className="text-emerald-400 font-black flex items-center gap-1 truncate text-[10px] sm:text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="truncate">✓ +{turnResult.scoreEarned}pts [{hostCorrectCount}:{challengerCorrectCount}]</span>
                      </span>
                    ) : turnResult?.isAllWrong ? (
                      <span className="text-rose-400 font-black flex items-center gap-1 truncate text-[10px] sm:text-xs">
                        <XCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                        <span className="truncate">ខុសទាំងអស់ (All Wrong)</span>
                      </span>
                    ) : (
                      <span className="text-amber-400 font-black flex items-center gap-1 truncate text-[10px] sm:text-xs">
                        <Clock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span className="truncate">អស់ពេល (60s Timeout)</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 bg-indigo-600/25 px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg border border-indigo-500/40 text-indigo-200 font-black font-mono text-[9px] sm:text-xs flex-shrink-0">
                    <span>Next ({nextTurnCountdown}s)</span>
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
              <div className="w-full max-w-md p-3.5 bg-rose-500/20 border border-rose-500/40 rounded-2xl text-rose-200 text-xs font-semibold flex items-center justify-center gap-2.5 animate-fade-in shadow-lg shadow-rose-950/40">
                <div className="p-1 rounded-lg bg-rose-500/30 text-rose-300 flex-shrink-0">
                  <LogOut className="w-4 h-4" />
                </div>
                <div className="text-left flex-1">
                  <span className="font-bold text-rose-200 block text-xs">{opponentLeftNotice}</span>
                  <span className="text-[10px] text-rose-300 font-normal">អ្នកអាចអញ្ជើញគូប្រជែងថ្មី ឬត្រឡប់ទៅ Lobby</span>
                </div>
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
              {opponentLeftNotice
                ? 'អ្នកបានទទួលជ័យជម្នះ (Victory)'
                : myScore > opponentScore || myCorrectCount > opponentCorrectCount
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
                  +{myCorrectCount >= opponentCorrectCount || opponentLeftNotice ? 500 : 150}
                </span>
              </div>
            </div>

            {/* Rematch & Exit Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
              {(!challengerPlayer || opponentLeftNotice) ? (
                <>
                  {isHost && (
                    <button
                      type="button"
                      onClick={() => {
                        setOpponentLeftNotice('');
                        setCurrentStep('lobby');
                        setTab('host');
                        setShowInviteModal(true);
                      }}
                      className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-black text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>អញ្ជើញគូប្រជែងថ្មី (Invite Player)</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleLeaveArenaRoom}
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5 text-slate-400" />
                    <span>ត្រឡប់ទៅ Lobby</span>
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
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

              {/* Instant Option: AI Scholar Bot */}

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
