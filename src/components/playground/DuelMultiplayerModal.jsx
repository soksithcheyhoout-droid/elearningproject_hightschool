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
  UserX
} from 'lucide-react';
import { useAuth, computeLevelData } from '../../context/AuthContext';
import { playSound } from '../../utils/audioEffects';
import { getRandomizedGameQuestions } from '../../utils/gamePoolManager';
import api from '../../services/api';

// High-end Avatar with Frame Renderer
const PlayerAvatarWithFrame = ({ avatar, frame, size = 'md', className = '' }) => {
  const frameSrc = frame || null;
  const avatarSrc = api.formatAvatarUrl(avatar) || '/assets/anime/boys/boy_1.png';

  const sizeClasses = {
    sm: 'w-11 h-11',
    md: 'w-14 h-14 sm:w-16 sm:h-16',
    lg: 'w-20 h-20 sm:w-24 sm:h-24',
    xl: 'w-24 h-24 sm:w-28 sm:h-28'
  };

  const dim = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`relative ${dim} flex items-center justify-center flex-shrink-0 ${className}`}>
      {/* Circular Avatar */}
      <div className={`w-[82%] h-[82%] rounded-full overflow-hidden bg-slate-900 shadow-md ${frameSrc ? '' : 'border border-slate-700'}`}>
        <img
          src={avatarSrc}
          alt="Avatar"
          className="w-full h-full object-cover"
          onError={(e) => {
            if (!e.currentTarget.src.includes('boy_2.png')) {
              e.currentTarget.src = '/assets/anime/boys/boy_2.png';
            }
          }}
        />
      </div>

      {/* Frame Overlay */}
      {frameSrc && (
        <img
          src={frameSrc}
          alt="Frame"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none scale-110 drop-shadow-md z-10"
          onError={(e) => {
            const current = e.currentTarget.src;
            if (current.endsWith('.png')) {
              e.currentTarget.src = current.replace('.png', '.webp');
            } else if (current.endsWith('.webp')) {
              e.currentTarget.src = current.replace('.webp', '.png');
            }
          }}
        />
      )}
    </div>
  );
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

  // Synchronized Questions Pool
  const [questions, setQuestions] = useState(() => getRandomizedGameQuestions(game, 12));
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
    return () => {
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
      if (soundEnabled) playSound.victory();
      try {
        confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
      addXP(myCorrectCount >= opponentCorrectCount ? (game?.xpReward ? game.xpReward + 350 : 500) : 150);
      return;
    }

    // Prepare next question
    let extra = [];
    if (currentQIndex + 1 >= questions.length) {
      extra = getRandomizedGameQuestions(game, 10);
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

    if (isHost) {
      try {
        await api.nextTurn(roomCode, extra);
      } catch (e) {}
    }
  }, [currentQIndex, questions.length, activeTurn, isHost, roomCode, hostCorrectCount, challengerCorrectCount, myCorrectCount, opponentCorrectCount, soundEnabled, addXP, game]);

  // Start 3-2-1 countdown after an answer is submitted
  const triggerTurnEndCountdown = useCallback((result) => {
    setTurnStatus('turn_ended');
    setTurnResult(result);
    setNextTurnCountdown(3);

    if (result && typeof result.hostCorrectCount === 'number') {
      setHostCorrectCount(result.hostCorrectCount);
    }
    if (result && typeof result.challengerCorrectCount === 'number') {
      setChallengerCorrectCount(result.challengerCorrectCount);
    }

    // Sound effect
    if (result && result.isCorrect) {
      if (soundEnabled) playSound.correct();
    } else {
      if (soundEnabled) playSound.wrong();
    }

    clearInterval(countdownIntervalRef.current);
    countdownIntervalRef.current = setInterval(() => {
      setNextTurnCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    clearTimeout(autoNextTimerRef.current);
    autoNextTimerRef.current = setTimeout(() => {
      handleSwitchToNextTurn();
    }, 3200);
  }, [soundEnabled, handleSwitchToNextTurn]);

  // Start Actual Match Function
  const startMatch = (roomQuestions = null) => {
    clearTimeout(autoNextTimerRef.current);
    clearInterval(countdownIntervalRef.current);

    if (Array.isArray(roomQuestions) && roomQuestions.length > 0) {
      setQuestions(roomQuestions);
    }
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
    if (soundEnabled) playSound.click();

    let count = 3;
    const timer = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdownNum(count);
        if (soundEnabled) playSound.click();
      } else if (count === 0) {
        setCountdownNum('START!');
        if (soundEnabled) playSound.attack();
      } else {
        clearInterval(timer);
        startMatch(roomQuestions);
      }
    }, 850);
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
          if (res && res.success && res.room) {
            if (res.room.host) setHostPlayer(res.room.host);
            if (res.room.challenger) setChallengerPlayer(res.room.challenger);
            if (Array.isArray(res.room.questions) && res.room.questions.length > 0) {
              setQuestions(res.room.questions);
            }
          }
        });
    } else if (isHost && student) {
      const initialPool = getRandomizedGameQuestions(game, 12);
      setQuestions(initialPool);

      api.createArenaRoom(roomCode, game?.id || 'sci-m-01', game?.subject || 'គណិតវិទ្យា', currentStudentPayload, initialPool)
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
        if (!isMounted || !res || !res.room) return;
        const room = res.room;

        // Synchronize Host & Challenger
        if (!isHost && room.host) setHostPlayer(room.host);
        if (room.challenger) {
          setChallengerPlayer(room.challenger);
          hostKickedRef.current = false; // New challenger joined — reset kick flag
          // Auto-close invite modal on Host side immediately!
          setShowInviteModal(false);
          setInviteFeedback('');
        } else if (room.status === 'waiting' && isHost && !hostKickedRef.current) {
          // Only null out challenger if the host didn't just kick them
          setChallengerPlayer(null);
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

        // Check if opponent left the room (NOT triggered by host kick)
        if (room.status === 'host_left' || room.hostLeft) {
          if (!isHost) {
            // Host left — close the modal immediately for challenger
            setChallengerPlayer(null);
            if (typeof onClose === 'function') onClose();
            return;
          }
        } else if (room.challengerLeft && !hostKickedRef.current) {
          // Only fire opponent-left when challenger left on their own (not kicked by host)
          setChallengerPlayer(null);
          setIsChallengerReady(false);
          setMyRematchRequested(false);
          setOpponentRematchRequested(false);
          setOpponentLeftNotice('គូប្រជែងបានចាកចេញពីបន្ទប់ប្រកួតហើយ!');
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
      } catch (e) {}
    }, 700);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [roomCode, isHost, currentStep, currentQIndex, showInviteModal, student]);

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
    } catch (e) {}
  };

  // Admin Kicks Challenger
  const handleKickChallenger = async () => {
    if (!challengerPlayer || !isHost) return;
    const kickedId = challengerPlayer.id;
    if (soundEnabled) playSound.wrong();
    hostKickedRef.current = true; // Flag so poller doesn't re-fire opponent-left
    try {
      await api.kickChallenger(roomCode, kickedId);
    } catch (e) {}
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
    } catch (e) {}
    
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
    } catch (e) {}
  };

  // Player Leaves Room & Closes Modal Window
  const handleCloseModal = async () => {
    if (soundEnabled) playSound.click();
    try {
      await api.leaveArenaRoom(roomCode, student?.id, student?.username);
    } catch (e) {}

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
    } catch (e) {}

    if (typeof onClose === 'function') {
      onClose();
    }
  };

  // Player Leaves Match & Returns to Lobby
  const handleLeaveArenaRoom = async () => {
    if (soundEnabled) playSound.click();
    try {
      await api.leaveArenaRoom(roomCode, student?.id, student?.username);
    } catch (e) {}

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
    } catch (e) {}

    setCurrentStep('lobby');
    setTab('host');
  };

  // Timeout handler for 15s round - RUNS ONLY ON ACTIVE PLAYER'S BROWSER
  const handleRoundTimeout = useCallback(() => {
    if (turnStatus === 'turn_ended' || currentStep !== 'battle' || !isMyTurn) return;

    const timeoutResult = {
      answeredBy: activeTurn,
      selectedIdx: -1,
      isCorrect: false,
      scoreEarned: 0,
      isTimeout: true,
      hostCorrectCount,
      challengerCorrectCount
    };

    try {
      api.submitTurnAnswer(roomCode, isHost, -1, false, 0, true);
    } catch (e) {}

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
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentStep, currentQIndex, turnStatus, isMyTurn, handleRoundTimeout]);

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

    const result = {
      answeredBy: isHost ? 'host' : 'challenger',
      selectedIdx: idx,
      isCorrect,
      scoreEarned: pointsEarned,
      isTimeout: false,
      hostCorrectCount: nextHostCorrect,
      challengerCorrectCount: nextChallengerCorrect
    };

    // Immediately trigger evaluation & 3-2-1 countdown on this client
    triggerTurnEndCountdown(result);

    // Sync turn result with backend room
    try {
      await api.submitTurnAnswer(roomCode, isHost, idx, isCorrect, pointsEarned, false);
    } catch (e) {}
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
    { bg: 'bg-[#dc2626] hover:bg-[#b91c1c] border-[#991b1b]', icon: Triangle },
    { bg: 'bg-[#2563eb] hover:bg-[#1d4ed8] border-[#1e40af]', icon: Diamond },
    { bg: 'bg-[#d97706] hover:bg-[#b45309] border-[#92400e]', icon: Circle },
    { bg: 'bg-[#16a34a] hover:bg-[#15803d] border-[#166534]', icon: Square }
  ];

  // Filter available registered students (Excludes ONLY the current logged-in student)
  const filteredStudents = realStudents.filter((u) => {
    const currentId = student?.id;
    const currentUsername = (student?.username || student?.nickname || '').trim().toLowerCase();
    const currentEmail = (student?.email || '').trim().toLowerCase();

    const uId = u.id;
    const uUsername = (u.username || u.nickname || '').trim().toLowerCase();
    const uEmail = (u.email || '').trim().toLowerCase();
    const uName = (u.full_name || u.name || '').trim().toLowerCase();

    // Check if u is the current user
    const isSelf = (currentId && uId && String(currentId) === String(uId)) ||
                   (currentUsername && uUsername && currentUsername === uUsername) ||
                   (currentEmail && uEmail && currentEmail === uEmail);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in font-kantumruy">
      
      {/* Main Container */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 relative">
        
        {/* Top Header */}
        <header className="px-6 py-4 bg-[#080e1e] border-b border-slate-800/80 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
                  Turn-Based 1v1 Arena • First to 6 Correct
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700">
                  {game?.subject || 'វិទ្យាសាស្ត្រ'}
                </span>
                {isOvertime && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40 animate-pulse flex items-center gap-1">
                    <Flame className="w-3 h-3" /> OVERTIME (ស្មើគ្នា)
                  </span>
                )}
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white leading-tight">
                {game?.titleKm || 'សង្វៀនប្រកួតល្បឿនបន្តផ្ទាល់'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentStep === 'battle' && (
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-xs border ${
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
              className="w-9 h-9 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60 flex items-center justify-center transition-colors cursor-pointer"
              title="Toggle Audio"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={handleCloseModal}
              className="w-9 h-9 rounded-lg bg-slate-800/60 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-700/60 flex items-center justify-center transition-colors cursor-pointer"
              title="Leave Room & Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* STEP 1: MATCH LOBBY & STAGING */}
        {/* ========================================================================= */}
        {currentStep === 'lobby' && (
          <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between overflow-y-auto space-y-6 animate-fade-in">
            
            {/* Top Control Bar: Tab Toggle & Room Code */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0e1730] p-4 rounded-2xl border border-slate-800">
              
              {/* Room Code & Quick Share */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(roomCode);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#080e1e] hover:bg-slate-800 border border-slate-700 hover:border-indigo-500 text-xs font-mono transition-colors cursor-pointer"
                  title="ចុចដើម្បីចម្លងលេខកូដ (Click to copy code)"
                >
                  <span className="text-slate-400">PIN:</span>
                  <strong className="text-amber-400 font-bold tracking-wider">#{roomCode}</strong>
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{copied ? 'បានចម្លង' : 'Copy Link'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareTelegram}
                  className="p-1.5 rounded-xl bg-[#229ED9]/15 hover:bg-[#229ED9]/25 text-[#229ED9] border border-[#229ED9]/30 transition-colors cursor-pointer"
                  title="Share Telegram"
                >
                  <Send className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleShareFacebook}
                  className="p-1.5 rounded-xl bg-[#1877F2]/15 hover:bg-[#1877F2]/25 text-[#1877F2] border border-[#1877F2]/30 transition-colors cursor-pointer"
                  title="Share Facebook"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Tab Switcher: Host vs Join */}
              <div className="flex items-center p-1 rounded-xl bg-[#080e1e] border border-slate-800 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setTab('host')}
                  className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    tab === 'host'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  បន្ទប់ប្រកួត (Lobby)
                </button>

                <button
                  type="button"
                  onClick={() => setTab('join')}
                  className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    tab === 'join'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  បញ្ចូលកូដបន្ទប់ (Join)
                </button>
              </div>

            </div>

            {/* TAB: JOIN BY PIN */}
            {tab === 'join' && (
              <div className="max-w-md mx-auto my-auto w-full p-6 sm:p-8 bg-[#0e1730] rounded-2xl border border-slate-800 text-center space-y-4 animate-fade-in">
                <div className="w-12 h-12 rounded-xl bg-indigo-600/15 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/20">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">ចូលរួមបន្ទប់ប្រកួត</h3>
                  <p className="text-xs text-slate-400">
                    បញ្ចូលលេខកូដបន្ទប់ ៦ ខ្ទង់ដែលទទួលបានពីមិត្តភក្តិរបស់អ្នក
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="relative flex items-center justify-center max-w-[260px] mx-auto bg-[#080e1e] border border-slate-700 rounded-xl px-4 focus-within:border-indigo-500 shadow-inner">
                    <span className="text-xl font-mono font-bold text-amber-400 select-none mr-2">#</span>
                    <input
                      type="text"
                      maxLength={6}
                      value={joinCodeInput}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (val.includes('room=')) {
                          const match = val.match(/room=([0-9a-zA-Z]+)/);
                          if (match) val = match[1];
                        }
                        const clean = val.replace(/[^0-9a-zA-Z]/g, '').slice(0, 6).toUpperCase();
                        setJoinCodeInput(clean);
                        if (joinError) setJoinError('');
                      }}
                      placeholder="754926"
                      className="w-full font-mono text-2xl font-bold tracking-widest bg-transparent py-2.5 text-indigo-300 placeholder:text-slate-600 focus:outline-none text-center"
                      autoFocus
                    />
                  </div>
                  {joinError && <p className="text-xs text-rose-400">{joinError}</p>}

                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const text = await navigator.clipboard.readText();
                          if (text) {
                            let val = text.trim();
                            if (val.includes('room=')) {
                              const m = val.match(/room=([0-9a-zA-Z]+)/);
                              if (m) val = m[1];
                            }
                            val = val.replace(/[^0-9a-zA-Z]/g, '').slice(0, 6).toUpperCase();
                            setJoinCodeInput(val);
                            if (joinError) setJoinError('');
                          }
                        } catch (e) {}
                      }}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                    >
                      បិទភ្ជាប់កូដពី Clipboard (Paste Code)
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleJoinWithCode}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  ចូលរួមការប្រកួត (Join Match)
                </button>
              </div>
            )}

            {/* TAB: HOST / HEAD-TO-HEAD MATCHUP */}
            {tab === 'host' && (
              <div className="space-y-6 my-auto">
                
                {/* 2-Player Matchup Showcase */}
                <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                  
                  {/* Left Side: Host */}
                  <div className="md:col-span-5 bg-[#0e1730] p-5 rounded-2xl border border-slate-800 relative">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
                      <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5" /> ម្ចាស់បន្ទប់ (Host / Admin)
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <Check className="w-3 h-3" /> រួចរាល់
                      </span>
                    </div>

                    {hostPlayer ? (
                      <div className="flex items-center gap-3.5">
                        <PlayerAvatarWithFrame
                          avatar={hostPlayer.avatar}
                          frame={hostPlayer.avatarFrame || hostPlayer.avatar_frame}
                          size="md"
                        />

                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-bold text-white truncate">
                            {hostPlayer.name || 'សុខ វិបុល'}
                          </h4>
                          <p className="text-xs text-slate-400 truncate mt-0.5">
                            {hostPlayer.school || 'វិទ្យាល័យជាតិ'}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-indigo-300 font-mono">
                            <span>Lv.{hostPlayer.level || 1}</span>
                            <span>•</span>
                            <span>{hostPlayer.xp || 500} XP</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-4 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                        <span>កំពុងទាញយកទិន្នន័យ...</span>
                      </div>
                    )}
                  </div>

                  {/* Center: VS Emblem */}
                  <div className="md:col-span-1 flex flex-col items-center justify-center py-2">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-indigo-400 shadow-inner">
                      VS
                    </div>
                  </div>

                  {/* Right Side: Challenger (Opponent) with Admin KICK Button */}
                  <div className="md:col-span-5 bg-[#0e1730] p-5 rounded-2xl border border-slate-800 relative">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
                      <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Swords className="w-3.5 h-3.5" /> គូប្រជែង (Challenger)
                      </span>
                      {challengerPlayer ? (
                        <div className="flex items-center gap-2">
                          {isChallengerReady ? (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                              <Check className="w-3 h-3" /> រួចរាល់ (Ready)
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> មិនទាន់រួចរាល់ (Not Ready)
                            </span>
                          )}

                          {/* Admin KICK button */}
                          {isHost && (
                            <button
                              type="button"
                              onClick={handleKickChallenger}
                              className="px-2 py-0.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 hover:text-rose-200 border border-rose-500/30 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                              title="បណ្តេញគូប្រជែងចេញ (Kick Player)"
                            >
                              <UserX className="w-3 h-3 text-rose-400" />
                              <span>បណ្តេញចេញ (Kick)</span>
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          រង់ចាំ
                        </span>
                      )}
                    </div>

                    {challengerPlayer ? (
                      <div className="flex items-center gap-3.5">
                        <PlayerAvatarWithFrame
                          avatar={challengerPlayer.avatar}
                          frame={challengerPlayer.avatarFrame || challengerPlayer.avatar_frame}
                          size="md"
                        />

                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-bold text-white truncate">
                            {challengerPlayer.name}
                          </h4>
                          <p className="text-xs text-slate-400 truncate mt-0.5">
                            {challengerPlayer.school}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-rose-300 font-mono">
                            <span>Lv.{challengerPlayer.level || 1}</span>
                            <span>•</span>
                            <span>{challengerPlayer.xp || 500} XP</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div 
                        onClick={() => {
                          fetchStudents();
                          setShowInviteModal(true);
                        }}
                        className="py-3.5 px-4 rounded-xl border border-dashed border-slate-700 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-1.5"
                      >
                        <UserPlus className="w-5 h-5 text-indigo-400" />
                        <span className="text-xs font-semibold text-slate-200">
                          ចុចទីនេះដើម្បីអញ្ជើញសិស្សពិតប្រាកដ
                        </span>
                        <span className="text-[10px] text-slate-400">
                          ឬចែករំលែកលេខកូដ #{roomCode} ឱ្យមិត្តភក្តិចូលរួម
                        </span>
                      </div>
                    )}
                  </div>

                </div>

                {/* Primary Action Button Bar */}
                <div className="flex flex-col items-center gap-3 pt-2">
                  
                  {/* Warning notice when Host tries to start without ready opponent */}
                  {isHost && hostWarningNotice && (
                    <div className="w-full max-w-md p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-medium text-center flex items-center justify-center gap-2 animate-fade-in">
                      <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      <span>{hostWarningNotice}</span>
                    </div>
                  )}

                  {isHost ? (
                    // Host / Admin view: START MATCH BUTTON
                    <button
                      type="button"
                      onClick={handleStartDuel}
                      className={`w-full sm:w-auto px-10 py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
                        challengerPlayer && isChallengerReady
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25 ring-2 ring-emerald-500/50'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/25'
                      }`}
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>ចាប់ផ្តើមការប្រកួត (Start Match)</span>
                    </button>
                  ) : (
                    // Challenger view: READY UP BUTTON
                    <div className="flex flex-col items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={handleToggleReady}
                        className={`w-full sm:w-auto px-10 py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
                          isChallengerReady
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25 ring-2 ring-emerald-400/50'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/25'
                        }`}
                      >
                        {isChallengerReady ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-white" />
                            <span>រួចរាល់ហើយ! (Ready - Waiting for Admin)</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>ចុចទីនេះដើម្បីត្រៀមខ្លួនរួចរាល់ (Click to Ready)</span>
                          </>
                        )}
                      </button>

                      {isChallengerReady && (
                        <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5 animate-pulse">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          កំពុងរង់ចាំម្ចាស់បន្ទប់ (Admin) ចាប់ផ្តើមការប្រកួត...
                        </span>
                      )}
                    </div>
                  )}

                  {/* Leave Room Button */}
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="w-full sm:w-auto px-8 py-2.5 rounded-xl font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 bg-rose-600/15 hover:bg-rose-600/30 text-rose-400 hover:text-rose-300 border border-rose-500/30 hover:border-rose-500/50"
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
        {/* STEP 2: 3-2-1 INTRO COUNTDOWN */}
        {/* ========================================================================= */}
        {currentStep === 'countdown' && (
          <div className="p-8 sm:p-12 flex-1 flex flex-col justify-center items-center text-center space-y-8 animate-fade-in my-auto">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">
              Live Duel Starting • First to 6 Correct Wins!
            </span>

            <div className="flex items-center justify-center gap-8 sm:gap-14 w-full max-w-lg">
              <div className="flex flex-col items-center space-y-2">
                <PlayerAvatarWithFrame
                  avatar={hostPlayer?.avatar}
                  frame={hostPlayer?.avatarFrame || hostPlayer?.avatar_frame}
                  size="lg"
                />
                <span className="text-xs font-bold text-white truncate max-w-[100px]">
                  {hostPlayer?.name}
                </span>
              </div>

              <div className="w-20 h-20 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-white font-mono font-extrabold text-3xl flex items-center justify-center shadow-lg animate-pulse">
                {countdownNum}
              </div>

              <div className="flex flex-col items-center space-y-2">
                <PlayerAvatarWithFrame
                  avatar={challengerPlayer?.avatar}
                  frame={challengerPlayer?.avatarFrame || challengerPlayer?.avatar_frame}
                  size="lg"
                />
                <span className="text-xs font-bold text-white truncate max-w-[100px]">
                  {challengerPlayer?.name}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: LIVE TURN-BASED BATTLE */}
        {/* ========================================================================= */}
        {currentStep === 'battle' && (
          <div className="p-5 sm:p-7 flex-1 flex flex-col justify-between overflow-y-auto space-y-4 animate-fade-in">
            
            {/* Top Score HUD with First to 6 Correct Progress */}
            <div className="grid grid-cols-11 gap-3 items-center bg-[#0e1730] p-3.5 rounded-2xl border border-slate-800">
              
              {/* Host HUD */}
              <div className={`col-span-5 flex items-center gap-3 p-2 rounded-xl transition-all ${
                activeTurn === 'host' ? 'bg-indigo-950/50 border border-indigo-500/60 shadow-md ring-1 ring-indigo-500/30' : 'opacity-70'
              }`}>
                <PlayerAvatarWithFrame
                  avatar={hostPlayer?.avatar}
                  frame={hostPlayer?.avatarFrame || hostPlayer?.avatar_frame}
                  size="sm"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-200 truncate flex items-center gap-1">
                      {hostPlayer?.name}
                      {activeTurn === 'host' && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">
                          កំពុងឆ្លើយ
                        </span>
                      )}
                    </span>
                    <span className="text-indigo-400 font-mono font-bold">{isHost ? myScore : opponentScore} pts</span>
                  </div>

                  {/* 6 Correct Progress Meter */}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-0.5">
                      <Trophy className="w-3 h-3 text-amber-400" /> {hostCorrectCount}/6
                    </span>
                    <div className="flex-1 h-1.5 bg-slate-900 rounded-full overflow-hidden flex gap-0.5">
                      {[...Array(6)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`flex-1 h-full rounded-full transition-all duration-300 ${
                            i < hostCorrectCount ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-slate-800'
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Round & Target Badge */}
              <div className="col-span-1 text-center">
                <span className="text-[10px] font-mono text-slate-400 block font-bold">
                  {currentQIndex + 1}/{questions.length}
                </span>
                <span className="text-[9px] text-amber-400 block font-mono">Win: 6🎯</span>
              </div>

              {/* Challenger HUD */}
              <div className={`col-span-5 flex items-center gap-3 p-2 rounded-xl text-right transition-all ${
                activeTurn === 'challenger' ? 'bg-rose-950/50 border border-rose-500/60 shadow-md ring-1 ring-rose-500/30' : 'opacity-70'
              }`}>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-rose-400 font-mono font-bold">{!isHost ? myScore : opponentScore} pts</span>
                    <span className="text-slate-200 truncate flex items-center gap-1 ml-auto">
                      {activeTurn === 'challenger' && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/30 text-rose-300 border border-rose-500/40">
                          កំពុងឆ្លើយ
                        </span>
                      )}
                      {challengerPlayer?.name}
                    </span>
                  </div>

                  {/* 6 Correct Progress Meter */}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="flex-1 h-1.5 bg-slate-900 rounded-full overflow-hidden flex gap-0.5">
                      {[...Array(6)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`flex-1 h-full rounded-full transition-all duration-300 ${
                            i < challengerCorrectCount ? 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]' : 'bg-slate-800'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-rose-400 font-bold flex items-center gap-0.5">
                      <Trophy className="w-3 h-3 text-amber-400" /> {challengerCorrectCount}/6
                    </span>
                  </div>
                </div>

                <PlayerAvatarWithFrame
                  avatar={challengerPlayer?.avatar}
                  frame={challengerPlayer?.avatarFrame || challengerPlayer?.avatar_frame}
                  size="sm"
                />
              </div>

            </div>

            {/* Turn Announcement Banner */}
            <div className={`p-2.5 rounded-xl border text-center text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              isMyTurn 
                ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-200 shadow-sm ring-1 ring-indigo-500/30' 
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}>
              {isMyTurn ? (
                <>
                  <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
                  <span>🎯 <strong>ដល់វេនរបស់អ្នកឆ្លើយ!</strong> ជ្រើសរើសចម្លើយត្រឹមត្រូវខាងក្រោម (15s)</span>
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>⏳ វេនរបស់ <strong>{activePlayerName}</strong> កំពុងឆ្លើយ... សូមរង់ចាំ</span>
                </>
              )}
            </div>

            {/* Question Card */}
            <div className="bg-[#0e1730] rounded-2xl p-6 sm:p-8 text-center border border-slate-800 shadow-sm my-auto relative">
              <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider block mb-2 font-mono">
                {game?.category || 'Question'} #{currentQIndex + 1}
              </span>
              <h3 className="text-base sm:text-xl font-bold text-white leading-relaxed">
                {currentQ.q}
              </h3>
            </div>

            {/* 4 Answer Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((option, idx) => {
                const config = BUTTON_CONFIGS[idx % 4];
                const IconComponent = config.icon;
                
                const isSelectedByPlayer = turnResult && turnResult.selectedIdx === idx;
                const isCorrectOption = idx === currentQ.answer;

                let btnStyle = 'bg-[#0e1730] border-slate-800 hover:border-slate-700 text-slate-200';
                
                if (turnStatus === 'turn_ended') {
                  // After turn is submitted: reveal results immediately!
                  if (isCorrectOption) {
                    btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/50';
                  } else if (isSelectedByPlayer && !turnResult?.isCorrect) {
                    btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-300';
                  } else {
                    btnStyle = 'bg-[#0e1730] border-slate-800 text-slate-500 opacity-40';
                  }
                } else {
                  // Normal playing state
                  if (!isMyTurn) {
                    btnStyle = 'bg-[#0e1730] border-slate-800 text-slate-500 opacity-50 cursor-not-allowed';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={!isMyTurn || turnStatus === 'turn_ended'}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-4 rounded-xl border flex items-center gap-3 transition-all text-left ${
                      isMyTurn && turnStatus === 'playing' ? 'cursor-pointer hover:border-indigo-400 hover:bg-slate-800/80 active:scale-98' : ''
                    } ${btnStyle}`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center flex-shrink-0 text-slate-300">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold flex-1 line-clamp-2">
                      {option}
                    </span>

                    {/* Result Icon on Reveal */}
                    {turnStatus === 'turn_ended' && isCorrectOption && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 animate-bounce" />
                    )}
                    {turnStatus === 'turn_ended' && isSelectedByPlayer && !turnResult?.isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Turn Result & 3-2-1 Countdown Bar */}
            <div className="bg-[#0e1730] rounded-xl p-3.5 border border-slate-800 flex items-center justify-between text-xs animate-fade-in min-h-[48px]">
              {turnStatus === 'playing' ? (
                <div className="flex items-center gap-2 text-slate-300">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>
                    {isMyTurn 
                      ? 'ចុចលើជម្រើសមួយដើម្បីឆ្លើយ (15s)...' 
                      : `កំពុងរង់ចាំ ${activePlayerName} ជ្រើសរើសចម្លើយ...`}
                  </span>
                </div>
              ) : (
                /* Turn Ended: Show Result & 3-2-1 countdown to next player */
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    {turnResult?.isCorrect ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> {activePlayerName} ឆ្លើយត្រឹមត្រូវ! (+{turnResult.scoreEarned} pts) 🎯 [{activeTurn === 'host' ? hostCorrectCount : challengerCorrectCount}/6]
                      </span>
                    ) : (
                      <span className="text-rose-400 font-bold flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> {activePlayerName} {turnResult?.isTimeout ? 'អស់ពេលឆ្លើយ!' : 'ឆ្លើយមិនត្រឹមត្រូវ!'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 bg-indigo-600/20 px-3 py-1 rounded-lg border border-indigo-500/30 text-indigo-300 font-bold font-mono">
                    <span>ឆ្លាស់វេនទៅ {nextPlayerName} ក្នុង</span>
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs animate-pulse">
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
          <div className="p-8 sm:p-10 flex-1 flex flex-col justify-center items-center text-center space-y-6 animate-fade-in my-auto">
            
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
                <span>⚡ គូប្រជែងបានស្នើសុំប្រកួតម្តងទៀត! ចុច 'ប្រកួតម្តងទៀត' ដើម្បីចាប់ផ្តើម!</span>
              </div>
            )}

            {/* Champion Podium Spotlight with Frame */}
            <div className="flex flex-col items-center justify-center">
              <PlayerAvatarWithFrame
                avatar={student?.avatar}
                frame={student?.avatarFrame || student?.avatar_frame}
                size="xl"
              />
              <div className="mt-2.5">
                <h4 className="text-sm font-bold text-white">{student?.name || 'សុខ វិបុល'}</h4>
                <span className="text-[11px] text-indigo-400 font-mono">Lv.{levelInfo?.level || 1} • {levelInfo?.rankTitleKm || 'សិស្សឆ្នើម'}</span>
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white">
              {myScore > opponentScore || myCorrectCount > opponentCorrectCount 
                ? 'អ្នកបានទទួលជ័យជម្នះ (Victory) 🏆' 
                : myScore === opponentScore && myCorrectCount === opponentCorrectCount 
                  ? 'លទ្ធផលស្មើគ្នា (Draw)' 
                  : 'គូប្រជែងបានទទួលជ័យជម្នះ (Defeat)'}
            </h3>

            {/* Score & Correct Count Comparison */}
            <div className="bg-[#0e1730] rounded-2xl p-5 border border-slate-800 w-full max-w-md flex items-center justify-around text-xs">
              <div>
                <span className="text-slate-400 block mb-1">ពិន្ទុរបស់អ្នក</span>
                <span className="text-2xl font-bold font-mono text-indigo-400">{myScore}</span>
                <span className="text-[10px] text-emerald-400 font-mono block mt-0.5">({myCorrectCount}/6 ត្រូវ)</span>
              </div>
              <div className="w-px h-10 bg-slate-800" />
              <div>
                <span className="text-slate-400 block mb-1">ពិន្ទុគូប្រជែង</span>
                <span className="text-2xl font-bold font-mono text-rose-400">{opponentScore}</span>
                <span className="text-[10px] text-rose-400 font-mono block mt-0.5">({opponentCorrectCount}/6 ត្រូវ)</span>
              </div>
              <div className="w-px h-10 bg-slate-800" />
              <div>
                <span className="text-slate-400 block mb-1">XP ទទួលបាន</span>
                <span className="text-2xl font-bold font-mono text-emerald-400">
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
                className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
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
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
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
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-[1px] animate-fade-in font-kantumruy">
          <div className="bg-[#0e1730] border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] shadow-2xl">
            
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
                          <div className="px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-center gap-1.5 flex-shrink-0">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>កំពុងរង់ចាំ...</span>
                          </div>
                        ) : status === 'declined' || (declinedCooldowns[user.id] > 0) ? (
                          <div className="px-3 py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-1.5 flex-shrink-0 animate-pulse">
                            <X className="w-3 h-3 text-rose-400" />
                            <span>បានបដិសេធ ({declinedCooldowns[user.id] || 5}s)</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSendInvite(user)}
                            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0 active:scale-98 shadow-sm"
                          >
                            <Send className="w-3 h-3" />
                            <span>អញ្ជើញ (Invite)</span>
                          </button>
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
