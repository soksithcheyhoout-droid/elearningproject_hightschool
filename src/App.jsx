import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import HeroSection from './components/home/HeroSection';
import SubjectGrid from './components/home/SubjectGrid';
import FeaturedLiveSection from './components/home/FeaturedLiveSection';
import ClassroomView from './components/classroom/ClassroomView';
import BacIIHubView from './components/exam/BacIIHubView';
import QuizModal from './components/exam/QuizModal';
import DigitalLibraryView from './components/library/DigitalLibraryView';
import VirtualLabView from './components/lab/VirtualLabView';
import PlaygroundArenaView from './components/playground/PlaygroundArenaView';
import StudentDashboardView from './components/dashboard/StudentDashboardView';
import StudentMessengerView from './components/chat/StudentMessengerView';
import DuelMultiplayerModal from './components/playground/DuelMultiplayerModal';
import AITutorModal from './components/ai/AITutorModal';
import LoginView from './components/auth/LoginView';
import GlobalSearchModal from './components/search/GlobalSearchModal';
import AdminLoginModal from './components/admin/AdminLoginModal';
import AdminDashboardView from './components/admin/AdminDashboardView';
import AdminLoginView from './components/admin/AdminLoginView';
import MoEYSIntroSplash from './components/common/MoEYSIntroSplash';
import MinistryDonationModal from './components/common/MinistryDonationModal';
import HumanVoiceStudioModal from './components/common/HumanVoiceStudioModal';
import { curriculumData } from './data/curriculumData';
import { quizData } from './data/quizData';
import { useAuth } from './context/AuthContext';
import { playSound } from './utils/audioEffects';
import api from './services/api';
import { 
  Sparkles, 
  Home, 
  BookOpen, 
  GraduationCap, 
  MessageSquare, 
  Gamepad2, 
  Bot, 
  Library, 
  FlaskConical, 
  UserCheck,
  Trophy,
  Award,
  Zap,
  ShieldCheck,
  ArrowRight,
  Swords,
  Check,
  X,
  Volume2
} from 'lucide-react';
import './styles/khmer-ornaments.css';

const getInitialTabFromPath = () => {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  if (!path) return 'home';
  if (path === 'dashboard') return 'dashboard';
  if (path === 'admin') return 'admin';
  if (path === 'chat' || path === 'messenger') return 'chat';
  if (path === 'courses' || path === 'curriculum') return 'courses';
  if (path === 'classroom') return 'classroom';
  if (path === 'bacii' || path === 'exam') return 'bacii';
  if (path === 'playground' || path === 'arena') return 'playground';
  if (path === 'library') return 'library';
  if (path === 'lab' || path === 'stem') return 'lab';
  return 'home';
};

function MainApp() {
  const { lang } = useLanguage();
  const { isAuthenticated, levelUpToast, setLevelUpToast, student } = useAuth();
  const [activeTab, setActiveTab] = useState(getInitialTabFromPath);
  const [selectedSubject, setSelectedSubject] = useState(curriculumData[0]);
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);
  const [aiTutorInitialPrompt, setAiTutorInitialPrompt] = useState('');
  const [activeQuizModal, setActiveQuizModal] = useState(null);
  const [isDuelOpen, setIsDuelOpen] = useState(false);
  const [duelRoomCode, setDuelRoomCode] = useState(null);
  const [duelHostStudent, setDuelHostStudent] = useState(null);
  const [incomingInvite, setIncomingInvite] = useState(null);
  const [matchCanceledToast, setMatchCanceledToast] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Grand MoEYS Entrance Intro Splash Animation State (Session-Aware for instant repeat navigation)
  const [showIntroSplash, setShowIntroSplash] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return !sessionStorage.getItem('motdar_splash_viewed');
    } catch (e) {
      return false;
    }
  });
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [isVoiceStudioOpen, setIsVoiceStudioOpen] = useState(false);

  const handleSplashFinish = () => {
    try {
      sessionStorage.setItem('motdar_splash_viewed', 'true');
    } catch (e) {}
    setShowIntroSplash(false);
  };

  // Super Admin Session
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [adminSession, setAdminSession] = useState(() => {
    try {
      const saved = localStorage.getItem('motdar_admin_session');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // URL Browser History Sync
  const setTabAndUrl = (tab) => {
    setActiveTab(tab);
    const targetPath = tab === 'home' ? '/' : `/${tab}`;
    try {
      if (window.location.pathname !== targetPath) {
        window.history.pushState(null, '', targetPath);
      }
    } catch (e) {}
  };

  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(getInitialTabFromPath());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Real-Time Incoming Match Invitations Polling & Syncing (Cross-Tabs & Cross-Users)
  useEffect(() => {
    if (!student?.id && !student?.username) return;

    const myId = String(student.id || '');
    const myUsername = (student.username || '').toLowerCase();

    // 1. Polling fallback (every 1.0 second for instant sync across devices)
    const checkInvites = async () => {
      try {
        const res = await api.getStudentInvites(student.id || student.username);
        if (res && Array.isArray(res.invites)) {
          const activePending = res.invites.filter((i) => i.status === 'pending');
          if (activePending.length > 0) {
            const latest = activePending[activePending.length - 1];
            setIncomingInvite(latest);
          } else {
            // If server has no pending invites (canceled by host or expired), DISMISS IMMEDIATELY!
            setIncomingInvite(null);
          }
        }
      } catch (e) {}
    };

    const timer = setInterval(checkInvites, 1000);

    // 2. BroadcastChannel for instant zero-latency popup across browser tabs
    let bc = null;
    if (typeof BroadcastChannel !== 'undefined') {
      bc = new BroadcastChannel('khmer_elearn_arena_channel');
      bc.onmessage = (e) => {
        if (e.data && e.data.type === 'NEW_INVITE' && e.data.invite) {
          const inv = e.data.invite;
          if (String(inv.toStudentId) === myId || (inv.toUsername && inv.toUsername.toLowerCase() === myUsername)) {
            setIncomingInvite(inv);
            try {
              playSound.click();
            } catch (err) {}
          }
        } else if (e.data && e.data.type === 'CANCEL_INVITE') {
          setIncomingInvite((curr) => {
            if (!curr) return null;
            if (!e.data.toStudentId || String(curr.toStudentId) === String(e.data.toStudentId) || curr.roomCode === e.data.roomCode) {
              return null;
            }
            return curr;
          });
        }
      };
    }

    return () => {
      clearInterval(timer);
      if (bc) bc.close();
    };
  }, [student?.id, student?.username]);

  const handleAcceptInvite = async (inv) => {
    try {
      playSound.click();
      
      const studentPayload = {
        id: student.id || 1,
        name: student.name || student.fullName || student.username,
        username: student.username || 'student',
        school: student.school || 'វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ',
        province: student.province || 'រាជធានីភ្នំពេញ',
        level: student.level || 1,
        xp: student.xp || 3568,
        avatar: api.formatAvatarUrl(student.avatar),
        avatarFrame: student.avatarFrame || student.avatar_frame || ''
      };

      // 1. Respond and verify invitation is still valid on server
      const respondRes = await api.respondMatchInvite(inv.id, studentPayload, true);
      if (!respondRes || !respondRes.success || respondRes.canceled || respondRes.error) {
        playSound.wrong();
        setIncomingInvite(null);
        setMatchCanceledToast('ម្ចាស់បន្ទប់ (Admin) បានបោះបង់ ឬបិទការប្រកួតហើយ!');
        setTimeout(() => setMatchCanceledToast(''), 4500);
        return;
      }

      // 2. Verify if room is alive and host is still waiting
      const check = await api.getArenaRoom(inv.roomCode);
      if (!check || !check.success || !check.room || check.room.status === 'host_left' || check.room.hostLeft || !check.room.host) {
        playSound.wrong();
        setIncomingInvite(null);
        setMatchCanceledToast('ម្ចាស់បន្ទប់ (Admin) បានបោះបង់ ឬបិទការប្រកួតហើយ!');
        setTimeout(() => setMatchCanceledToast(''), 4500);
        return;
      }

      setDuelRoomCode(inv.roomCode);
      setDuelHostStudent(check.room.host || inv.fromStudent);
      setIsDuelOpen(true);
      setIncomingInvite(null);
    } catch (e) {
      playSound.wrong();
      setIncomingInvite(null);
      setMatchCanceledToast('ម្ចាស់បន្ទប់ (Admin) បានបោះបង់ ឬបិទការប្រកួតហើយ!');
      setTimeout(() => setMatchCanceledToast(''), 4500);
    }
  };

  const handleDeclineInvite = async (inv) => {
    try {
      playSound.wrong();
      await api.respondMatchInvite(inv.id, null, false);
      setIncomingInvite(null);
    } catch (e) {}
  };

  const handleSelectSubject = (subject) => {
    setSelectedSubject(subject);
    setTabAndUrl('classroom');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartLearning = () => {
    setTabAndUrl('courses');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreBacII = () => {
    setTabAndUrl('bacii');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAITutorWithPrompt = (prompt) => {
    setAiTutorInitialPrompt(prompt || '');
    setIsAITutorOpen(true);
  };

  const handleSearchSelect = (query) => {
    setIsSearchModalOpen(true);
  };

  // 1. Direct /admin Standalone Route (100% Dedicated Admin Portal - NO Student UI)
  if (activeTab === 'admin') {
    if (!adminSession) {
      return (
        <AdminLoginView
          onAdminLoginSuccess={(adm) => {
            setAdminSession(adm);
            setTabAndUrl('admin');
          }}
          onBackToStudentPortal={() => setTabAndUrl('home')}
        />
      );
    }

    return (
      <div className="min-h-screen bg-[#071322] text-slate-100 font-kantumruy">
        <AdminDashboardView
          admin={adminSession}
          onLogout={() => {
            localStorage.removeItem('motdar_admin_session');
            setAdminSession(null);
            setTabAndUrl('admin');
          }}
          onSwitchToStudentView={() => {
            setTabAndUrl('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
    );
  }

  // 2. If user is not logged in as student and not on /admin, show the Student Portal Login
  if (!isAuthenticated && activeTab !== 'admin') {
    return (
      <>
        {showIntroSplash && (
          <MoEYSIntroSplash onFinish={handleSplashFinish} />
        )}
        <LoginView />
      </>
    );
  }

  return (
    <div className={`${activeTab === 'chat' ? 'h-[100dvh] overflow-hidden' : 'min-h-screen'} bg-[#f4f7fb] flex flex-col font-kantumruy relative selection:bg-blue-500 selection:text-white overflow-x-clip w-full max-w-[100vw]`}>
      
      {/* 🎓 Subtle Ambient Lighting Orbs */}
      <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      {/* 🌟 Grand MoEYS Entrance Intro Splash Animation on Load */}
      {showIntroSplash && (
        <MoEYSIntroSplash onFinish={handleSplashFinish} />
      )}

      {/* Top Ministry App Bar with Integrated Dropdown Live Search */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setTabAndUrl}
        onOpenAITutor={(prompt) => handleOpenAITutorWithPrompt(prompt || '')}
        onSelectSubject={handleSelectSubject}
        adminSession={adminSession}
        onOpenDonation={() => setIsDonationModalOpen(true)}
        onOpenAdminLogin={() => {
          setTabAndUrl('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Spacer to offset the fixed top navbar permanently */}
      <div className="h-[102px] sm:h-[110px] flex-shrink-0 w-full" aria-hidden="true" />

      {/* Main Content Body */}
      <div className={`flex-1 flex w-full overflow-x-clip md:pl-72 ${activeTab === 'chat' ? 'min-h-0 overflow-hidden' : ''}`}>
        
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setTabAndUrl}
          onOpenAITutor={() => setIsAITutorOpen(true)}
        />

        {/* Dynamic Center Canvas View */}
        <main className={`flex-1 flex flex-col min-w-0 ${activeTab === 'chat' ? 'min-h-0 overflow-hidden p-0' : 'overflow-x-hidden pb-16 md:pb-0'}`} style={activeTab === 'chat' ? {minHeight:0, flex:'1 1 0%'} : undefined}>
          
          {/* HOME TAB */}
          {activeTab === 'home' && (
            <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-6 space-y-4 sm:space-y-8 animate-fadeIn overflow-x-hidden">
              <HeroSection
                onStartLearning={handleStartLearning}
                onExploreBacII={handleExploreBacII}
              />
              
              <FeaturedLiveSection 
                onSelectSubject={handleSelectSubject} 
                onStartQuiz={handleExploreBacII}
              />

              <SubjectGrid onSelectSubject={handleSelectSubject} showHeroBanner={false} />
            </div>
          )}

          {/* NATIONAL CURRICULUM COURSES TAB */}
          {activeTab === 'courses' && (
            <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-8 space-y-6 animate-fadeIn overflow-x-hidden">
              <SubjectGrid onSelectSubject={handleSelectSubject} showHeroBanner={true} />
            </div>
          )}

          {/* CLASSROOM VIEW */}
          {activeTab === 'classroom' && (
            <div className="animate-fadeIn">
              <ClassroomView
                subject={selectedSubject}
                onBack={() => setActiveTab('courses')}
                onOpenAITutor={() => setIsAITutorOpen(true)}
              />
            </div>
          )}

          {/* BAC II MASTER HUB TAB */}
          {activeTab === 'bacii' && (
            <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-8 space-y-6 animate-fadeIn overflow-x-hidden">
              <BacIIHubView />
            </div>
          )}

          {/* STUDENT MESSENGER CHAT TAB */}
          {activeTab === 'chat' && (
            <div className="animate-fadeIn flex-1 flex flex-col h-full min-h-0">
              <StudentMessengerView 
                onLaunchDuelGame={() => setIsDuelOpen(true)} 
                onBack={() => setTabAndUrl('home')}
              />
            </div>
          )}

          {/* DIGITAL LIBRARY TAB */}
          {activeTab === 'library' && (
            <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-8 space-y-6 animate-fadeIn overflow-x-hidden">
              <DigitalLibraryView />
            </div>
          )}

          {/* VIRTUAL STEM LAB TAB */}
          {activeTab === 'lab' && (
            <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-8 space-y-6 animate-fadeIn overflow-x-hidden">
              <VirtualLabView />
            </div>
          )}

          {/* ACADEMIC PLAYGROUND ARENA TAB */}
          {activeTab === 'playground' && (
            <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-8 space-y-6 animate-fadeIn overflow-x-hidden">
              <PlaygroundArenaView />
            </div>
          )}

          {/* STUDENT DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="animate-fadeIn">
              {isAuthenticated && student ? (
                <StudentDashboardView setActiveTab={setTabAndUrl} />
              ) : (
                <LoginView 
                  onLoginSuccess={() => setTabAndUrl('dashboard')}
                  onCancel={() => setTabAndUrl('home')}
                />
              )}
            </div>
          )}

          {/* Footer (Hidden on Chat Tab to provide full-height live messaging experience) */}
          {activeTab !== 'chat' && <Footer setActiveTab={setActiveTab} />}

        </main>

      </div>

      {/* Real-Time Match Canceled Notification Toast */}
      {matchCanceledToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[10002] w-[96%] max-w-md animate-slide-down font-kantumruy">
          <div className="bg-rose-950/95 backdrop-blur-xl border border-rose-500/80 text-white rounded-2xl px-4 py-3 shadow-[0_8px_32px_rgba(244,63,94,0.5)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center flex-shrink-0">
                <X className="w-4 h-4 text-rose-300" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-rose-100 truncate">
                {matchCanceledToast}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMatchCanceledToast('')}
              className="p-1 rounded-lg text-rose-300 hover:text-white hover:bg-rose-800/40 transition-colors cursor-pointer flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Real-Time Floating Incoming Match Invitation Alert Toast */}
      {incomingInvite && !isDuelOpen && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[10001] w-[96%] max-w-lg animate-slide-down font-kantumruy">
          <div className="bg-[#0a1128]/95 backdrop-blur-xl border border-indigo-500/60 rounded-2xl px-4 py-3 shadow-[0_8px_32px_rgba(99,102,241,0.4)] flex items-center gap-3">
            {/* Avatar */}
            <div className="relative w-10 h-10 flex-shrink-0">
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 border border-slate-700">
                <img
                  src={api.formatAvatarUrl(incomingInvite.fromStudent?.avatar) || '/assets/anime/boys/boy_1.png'}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    if (!e.currentTarget.src.includes('boy_1.png')) {
                      e.currentTarget.src = '/assets/anime/boys/boy_1.png';
                    }
                  }}
                />
              </div>
              {(incomingInvite.fromStudent?.avatarFrame || incomingInvite.fromStudent?.avatar_frame) && (
                <img
                  src={incomingInvite.fromStudent.avatarFrame || incomingInvite.fromStudent.avatar_frame}
                  alt=""
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none scale-[1.15] z-10"
                />
              )}
            </div>
            
            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-white truncate">
                ⚔️ {incomingInvite.fromStudent?.name || incomingInvite.fromStudent?.username || 'Student'} បានបបួលអ្នកប្រកួត!
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                បន្ទប់ <span className="font-mono text-amber-400 font-bold">#{incomingInvite.roomCode}</span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => handleDeclineInvite(incomingInvite)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600/30 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer border border-slate-700 hover:border-rose-500/40"
                title="បដិសេធ (Decline)"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleAcceptInvite(incomingInvite)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Swords className="w-3.5 h-3.5" />
                <span>ចូលប្រកួត</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Modals */}
      {isAITutorOpen && (
        <AITutorModal
          isOpen={isAITutorOpen}
          onClose={() => setIsAITutorOpen(false)}
          initialPrompt={aiTutorInitialPrompt}
          onNavigate={(tab) => {
            setTabAndUrl(tab);
            setIsAITutorOpen(false);
          }}
        />
      )}

      {activeQuizModal && (
        <QuizModal
          quiz={quizData.find(q => q.id === activeQuizModal)}
          isOpen={!!activeQuizModal}
          onClose={() => setActiveQuizModal(null)}
        />
      )}

      {/* 1v1 Speed Quiz Arena Multiplayer Duel Modal */}
      {isDuelOpen && (
        <DuelMultiplayerModal
          isOpen={isDuelOpen}
          onClose={() => {
            setIsDuelOpen(false);
            setDuelRoomCode(null);
            setDuelHostStudent(null);
          }}
          initialRoomCode={duelRoomCode}
          initialHostStudent={duelHostStudent}
        />
      )}

      {/* Global Search Popover Modal */}
      {isSearchModalOpen && (
        <GlobalSearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
          onNavigate={(tab, payload) => {
            setIsSearchModalOpen(false);
            if (tab === 'classroom' && payload) {
              setSelectedSubject(payload);
            }
            setTabAndUrl(tab);
          }}
        />
      )}

      {/* MoTDAR National Education & Talent Fund Donation Modal */}
      {isDonationModalOpen && (
        <MinistryDonationModal
          isOpen={isDonationModalOpen}
          onClose={() => setIsDonationModalOpen(false)}
        />
      )}

      {/* Human Voice Studio Modal */}
      {isVoiceStudioOpen && (
        <HumanVoiceStudioModal
          isOpen={isVoiceStudioOpen}
          onClose={() => setIsVoiceStudioOpen(false)}
        />
      )}

      {/* Level Up Golden Celebratory Modal */}
      {levelUpToast && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-kantumruy">
          <div className="relative w-full max-w-sm bg-gradient-to-b from-[#132347] via-[#0d172e] to-[#080d1a] border-2 border-amber-400 rounded-3xl p-6 text-center shadow-[0_20px_70px_rgba(245,158,11,0.45)] animate-scaleUp overflow-hidden">
            
            <div className="absolute -top-20 -left-20 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-yellow-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative mx-auto w-20 h-20 mb-4 flex items-center justify-center">
              <div className="absolute inset-0 bg-amber-400/30 rounded-full animate-ping opacity-75" />
              <div className="w-20 h-20 bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <Trophy className="w-10 h-10 text-slate-950 animate-bounce" />
              </div>
            </div>

            <span className="px-3 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-[10px] font-black text-amber-300 uppercase tracking-widest inline-block mb-2">
              LEVEL UP CELEBRATION
            </span>
            <h3 className="text-2xl font-black text-white font-moul mb-1 drop-shadow-md">
              ឡើងកម្រិតថ្មី!
            </h3>
            <p className="text-xs text-slate-300 mb-5 leading-relaxed">
              អបអរសាទរ! អ្នកបានឡើងដល់ <strong className="text-amber-400 font-bold">Level {levelUpToast.newLevel}</strong> ក្នុងប្រព័ន្ធ MoTDAR E-Learning
            </p>

            <div className="flex items-center justify-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-3.5 mb-5">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 block">កម្រិតមុន</span>
                <span className="text-lg font-black text-slate-400 font-cinzel">Lv.{levelUpToast.oldLevel}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs shadow-md">
                ➔
              </div>
              <div className="text-center">
                <span className="text-[10px] text-amber-400 block font-bold">កម្រិតបច្ចុប្បន្ន</span>
                <span className="text-2xl font-black text-amber-300 font-cinzel">Lv.{levelUpToast.newLevel}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-6 text-left">
              <div className="p-2.5 rounded-xl bg-[#0b1329] border border-slate-800 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">រង្វាន់</span>
                  <strong className="text-emerald-400 text-xs font-bold font-mono">+500 XP</strong>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0b1329] border border-slate-800 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">ឋានៈ</span>
                  <strong className="text-indigo-300 text-xs font-bold truncate block max-w-[80px]">New Rank</strong>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setLevelUpToast(null)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm hover:scale-[1.02] transition-all cursor-pointer"
            >
              យល់ព្រម
            </button>
          </div>
        </div>
      )}





      {/* 🌟 Ultra-Fluid Curved Mobile Bottom Navigation Bar (Hidden on Desktop md:hidden & Chat View) */}
      {activeTab !== 'chat' && (() => {
        const getMobileActiveIndex = () => {
          if (isAITutorOpen) return 5;
          if (activeTab === 'home' || activeTab === 'dashboard') return 0;
          if (activeTab === 'courses' || activeTab === 'classroom' || activeTab === 'library') return 1;
          if (activeTab === 'playground') return 2;
          if (activeTab === 'bacii') return 3;
          if (activeTab === 'chat') return 4;
          return 0;
        };

        const activeIndex = getMobileActiveIndex();

        const navItems = [
          { id: 'home', icon: Home, labelKm: 'ទំព័រដើម', labelEn: 'Home', action: () => { setTabAndUrl('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
          { id: 'courses', icon: BookOpen, labelKm: 'មេរៀន', labelEn: 'Lessons', action: () => { setTabAndUrl('courses'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
          { id: 'playground', icon: Gamepad2, labelKm: 'ហ្គេម', labelEn: 'Games', action: () => { setTabAndUrl('playground'); window.scrollTo({ top: 0, behavior: 'smooth' }); }, badge: true },
          { id: 'bacii', icon: GraduationCap, labelKm: 'បាក់ឌុប', labelEn: 'Bac II', action: () => { setTabAndUrl('bacii'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
          { id: 'chat', icon: MessageSquare, labelKm: 'ជជែក', labelEn: 'Chat', action: () => { setTabAndUrl('chat'); window.scrollTo({ top: 0, behavior: 'smooth' }); }, badgeDot: true },
          { id: 'ai', icon: Bot, labelKm: 'គ្រូ AI', labelEn: 'AI Tutor', action: () => setIsAITutorOpen(true) }
        ];

        return (
          <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden select-none font-kantumruy">
            {/* Main White Bar Container */}
            <div className="relative bg-white border-t border-slate-200/80 shadow-[0_-6px_25px_rgba(0,0,0,0.08)] h-[66px] flex items-center px-1 pb-[calc(0.35rem+env(safe-area-inset-bottom,0px))]">
              
              {/* Dynamic Curved Cutout Scoop (Smooth S-curve Notch) */}
              <svg
                className="absolute -top-[1px] w-[80px] h-[30px] pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-10"
                style={{
                  left: `calc(${activeIndex * (100 / 6)}% + ${(100 / 6) / 2}% - 40px)`
                }}
                viewBox="0 0 80 30"
                fill="none"
              >
                <path
                  d="M0 0 C 16 0, 22 26, 40 26 C 58 26, 64 0, 80 0 L 80 0 L 0 0 Z"
                  fill="#f8fafc"
                />
                <path
                  d="M0 0 C 16 0, 22 26, 40 26 C 58 26, 64 0, 80 0"
                  stroke="#e2e8f0"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>

              {/* Floating Active Circular Bubble */}
              <div
                className="absolute -top-[18px] pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-20"
                style={{
                  left: `calc(${activeIndex * (100 / 6)}% + ${(100 / 6) / 2}%)`,
                  transform: 'translateX(-50%)'
                }}
              >
                <div className="w-[48px] h-[48px] rounded-full bg-gradient-to-tr from-[#00828a] to-[#0ea5e9] text-white flex items-center justify-center shadow-[0_6px_20px_rgba(0,130,138,0.45)] border-[3.5px] border-white">
                  {activeIndex === 0 && <Home className="w-5 h-5 animate-scaleIn stroke-[2.2]" />}
                  {activeIndex === 1 && <BookOpen className="w-5 h-5 animate-scaleIn stroke-[2.2]" />}
                  {activeIndex === 2 && <Gamepad2 className="w-5 h-5 animate-scaleIn stroke-[2.2]" />}
                  {activeIndex === 3 && <GraduationCap className="w-5 h-5 animate-scaleIn stroke-[2.2]" />}
                  {activeIndex === 4 && <MessageSquare className="w-5 h-5 animate-scaleIn stroke-[2.2]" />}
                  {activeIndex === 5 && <Bot className="w-5 h-5 animate-scaleIn stroke-[2.2]" />}
                </div>
              </div>

              {/* Navigation Tab Buttons */}
              {navItems.map((item, index) => {
                const isActive = index === activeIndex;
                const IconComponent = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={item.action}
                    className="flex-1 flex flex-col items-center justify-center h-full relative z-10 cursor-pointer active:scale-95 transition-all group"
                  >
                    {/* Inactive Icon or Spacing Placeholder */}
                    <div className="relative flex items-center justify-center h-6">
                      {!isActive ? (
                        <IconComponent className={`w-5 h-5 text-slate-600 group-hover:text-slate-900 transition-colors stroke-[1.8] ${item.id === 'playground' ? 'text-amber-500' : ''}`} />
                      ) : (
                        <div className="h-2" />
                      )}

                      {/* Small badge / dots for inactive items */}
                      {!isActive && item.badge && (
                        <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                      )}
                      {!isActive && item.badgeDot && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </div>

                    {/* Label */}
                    <span
                      className={`text-[9.5px] font-bold transition-all ${
                        isActive
                          ? 'text-[#00828a] font-black scale-105 mt-2'
                          : 'text-slate-500 group-hover:text-slate-800'
                      }`}
                    >
                      {lang === 'km' ? item.labelKm : item.labelEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>
        );
      })()}

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
