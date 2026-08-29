import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  MessageSquare, 
  Swords, 
  Database, 
  Activity, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  RefreshCw, 
  Send, 
  Crown, 
  LogOut, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Lock, 
  KeyRound, 
  Save, 
  X, 
  Loader2,
  Server,
  Cpu,
  Flame,
  Radio,
  BookOpen,
  Filter,
  Bell,
  Mail,
  ChevronDown,
  Clock,
  Calendar as CalendarIcon,
  Award,
  GraduationCap,
  Layers,
  ArrowRight,
  TrendingUp,
  Sliders,
  Check,
  FileText,
  UserPlus,
  HelpCircle,
  ExternalLink,
  Laptop,
  Home,
  Library,
  FlaskConical,
  Gamepad2,
  UserCheck
} from 'lucide-react';
import { playSound } from '../../utils/audioEffects';
import api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { bacIIData } from '../../data/bacIIData';
import { curriculumData } from '../../data/curriculumData';
import { libraryBooks } from '../../data/libraryBooks';
import { periodicElements } from '../../data/labData';

export default function AdminDashboardView({ admin, onLogout, onSwitchToStudentView }) {
  const { lang, setLang, t } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);

  // Navigation Sidebar View: 'dashboard' | 'approvals' | 'students' | 'lecturers' | 'faculties' | 'chat' | 'exams' | 'arena' | 'announcements' | 'database' | 'settings'
  const [activeView, setActiveView] = useState('dashboard');
  
  // Data States
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [globalSearch, setGlobalSearch] = useState('');
  const [chatChannelFilter, setChatChannelFilter] = useState('all');

  // Exams & Bac II Management State
  const [adminExams, setAdminExams] = useState([]);
  const [isAddExamOpen, setIsAddExamOpen] = useState(false);
  const [isSavingExam, setIsSavingExam] = useState(false);
  const [previewExam, setPreviewExam] = useState(null);
  const [examForm, setExamForm] = useState({
    paperTitleKm: '',
    paperTitleEn: '',
    subject: 'គណិតវិទ្យា',
    subjectKey: 'math',
    stream: 'science',
    year: '2026',
    duration: '៩០ នាទី (1.5 Hours)',
    totalPoints: 75,
    problemTitle: 'សំណួរទី ១ (១៥ ពិន្ទុ)៖ លំហាត់អនុវត្តថ្នាក់ជាតិ',
    problemText: '',
    solutionText: ''
  });

  // Approvals & Certificates State
  const [certificates, setCertificates] = useState([]);

  // Time & Date State for Live Clock
  const [currentTime, setCurrentTime] = useState(new Date());

  // Edit Student Modal State
  const [editingStudent, setEditingStudent] = useState(null);
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    email: '',
    xp: 500,
    level: 1,
    grade: '12',
    stream: 'science',
    school: '',
    avatarFrame: '/assets/frames/11_gyoko_pink.png',
    newPassword: ''
  });
  const [isSavingStudent, setIsSavingStudent] = useState(false);

  // Custom Delete Student Confirmation Modal State
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState(null);
  const [isDeletingStudent, setIsDeletingStudent] = useState(false);

  // Add Student Modal State
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [addFormData, setAddFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: 'password123',
    grade: '12',
    stream: 'science',
    school: 'វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ'
  });
  const [isCreatingStudent, setIsCreatingStudent] = useState(false);

  // Announcement State
  const [announcementText, setAnnouncementText] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Time ticker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch All Admin Data
  const fetchAllData = async () => {
    try {
      const [statsRes, studentsRes, messagesRes, examsRes, certsRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminStudents(),
        api.getAdminMessages(),
        api.getAdminExams(),
        api.getAdminCertificates()
      ]);

      if (statsRes && statsRes.stats) setStats(statsRes);
      if (studentsRes && Array.isArray(studentsRes.students)) setStudents(studentsRes.students);
      if (messagesRes && Array.isArray(messagesRes.messages)) setMessages(messagesRes.messages);
      if (examsRes && Array.isArray(examsRes.exams)) setAdminExams(examsRes.exams);
      if (certsRes && Array.isArray(certsRes.certificates)) setCertificates(certsRes.certificates);
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 4000);
    return () => clearInterval(interval);
  }, []);

  // Handle Edit Student Open
  const handleOpenEditModal = (student) => {
    playSound?.pop?.();
    setEditingStudent(student);
    setEditFormData({
      fullName: student.full_name || '',
      email: student.email || '',
      xp: student.xp || 500,
      level: student.level || 1,
      grade: student.grade || '12',
      stream: student.stream || 'science',
      school: student.school || 'វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ',
      avatarFrame: student.avatar_frame || '/assets/frames/11_gyoko_pink.png',
      newPassword: ''
    });
  };

  // Handle Save Student Edits
  const handleSaveStudent = async (e) => {
    e?.preventDefault();
    if (!editingStudent) return;
    setIsSavingStudent(true);
    playSound?.click?.();

    try {
      const res = await api.updateAdminStudent(editingStudent.id, editFormData);
      if (res && res.success) {
        playSound?.levelUp?.();
        setStudents(prev => prev.map(s => s.id === editingStudent.id ? { ...s, ...editFormData, full_name: editFormData.fullName } : s));
        setEditingStudent(null);
        fetchAllData();
      }
    } catch (err) {
      playSound?.wrong?.();
    } finally {
      setIsSavingStudent(false);
    }
  };

  // Handle Open Custom Delete Modal
  const handleOpenDeleteModal = (student) => {
    playSound?.pop?.();
    setDeleteConfirmTarget(student);
  };

  // Execute Custom Delete Student
  const handleExecuteDeleteStudent = async () => {
    if (!deleteConfirmTarget || isDeletingStudent) return;
    const targetId = deleteConfirmTarget.id;
    setIsDeletingStudent(true);
    playSound?.wrong?.();

    try {
      // Instant optimistic UI update
      setStudents(prev => prev.filter(s => s.id !== targetId));
      setDeleteConfirmTarget(null);

      // Broadcast account deletion across all tabs instantly
      try {
        if (typeof BroadcastChannel !== 'undefined') {
          const bc = new BroadcastChannel('khmer_elearn_profile_sync');
          bc.postMessage({ type: 'ACCOUNT_DELETED', studentId: targetId });
          bc.close();
        }
      } catch (e) {}

      const res = await api.deleteAdminStudent(targetId);
      if (res && res.success) {
        playSound?.levelUp?.();
      }
      setTimeout(fetchAllData, 300);
    } catch (err) {
      console.error('Delete student error:', err);
      fetchAllData();
    } finally {
      setIsDeletingStudent(false);
    }
  };

  // Handle Save New Exam Paper
  const handleSaveExam = async (e) => {
    e?.preventDefault();
    if (!examForm.paperTitleKm.trim() || isSavingExam) return;
    setIsSavingExam(true);
    playSound?.click?.();

    try {
      const payload = {
        paperTitleKm: examForm.paperTitleKm,
        paperTitleEn: examForm.paperTitleEn || examForm.paperTitleKm,
        subject: examForm.subject,
        subjectKey: examForm.subjectKey,
        stream: examForm.stream,
        year: examForm.year,
        duration: examForm.duration,
        totalPoints: Number(examForm.totalPoints) || 75,
        exercises: [
          {
            id: `ex-${Date.now()}-1`,
            titleKm: examForm.problemTitle || 'សំណួរទី ១ (១៥ ពិន្ទុ)៖ លំហាត់អនុវត្ត',
            titleEn: 'Problem 1: Practice Exercise',
            problemText: examForm.problemText || 'ចូរគណនា និងដោះស្រាយសមីការតាមក្បួនខ្នាតផ្លូវការរបស់ក្រសួងអប់រំ។',
            solutionText: examForm.solutionText || 'ដំណោះស្រាយផ្លូវការត្រូវបានផ្ទៀងផ្ទាត់ដោយគណៈកម្មការបច្ចេកទេស។'
          }
        ]
      };

      const res = await api.createAdminExam(payload);
      if (res && res.success) {
        playSound?.levelUp?.();
        setIsAddExamOpen(false);
        setExamForm({
          paperTitleKm: '',
          paperTitleEn: '',
          subject: 'គណិតវិទ្យា',
          subjectKey: 'math',
          stream: 'science',
          year: '2026',
          duration: '៩០ នាទី (1.5 Hours)',
          totalPoints: 75,
          problemTitle: 'សំណួរទី ១ (១៥ ពិន្ទុ)៖ លំហាត់អនុវត្តថ្នាក់ជាតិ',
          problemText: '',
          solutionText: ''
        });
        fetchAllData();
      }
    } catch (err) {
      playSound?.wrong?.();
    } finally {
      setIsSavingExam(false);
    }
  };

  // Handle Delete Exam
  const handleDeleteExam = async (examId) => {
    playSound?.wrong?.();
    try {
      setAdminExams(prev => prev.filter(e => e.id !== examId));
      await api.deleteAdminExam(examId);
      fetchAllData();
    } catch (err) {}
  };

  // Handle Delete Chat Message
  const handleDeleteChatMessage = async (msgId) => {
    playSound?.wrong?.();
    setMessages(prev => prev.filter(m => m.id !== msgId));
    try {
      await api.deleteChatMessage(msgId);
    } catch (err) {}
  };

  // Handle Clear Channel
  const handleClearChannel = async (channel) => {
    if (!window.confirm(`តើអ្នកប្រាកដជាចង់សម្អាតសារទាំងអស់ក្នុងបន្ទប់ "${channel}" ទេ?`)) return;
    playSound?.wrong?.();
    try {
      await api.clearChatChannel(channel);
      setMessages(prev => prev.filter(m => m.channel_id !== channel));
    } catch (err) {}
  };

  // Handle Broadcast Announcement
  const handleSendAnnouncement = async (e) => {
    e?.preventDefault();
    if (!announcementText.trim() || isBroadcasting) return;

    setIsBroadcasting(true);
    playSound.click();

    try {
      const res = await api.broadcastAdminAnnouncement(announcementText.trim(), admin?.fullName || 'Super Admin');
      if (res && res.success) {
        playSound.levelUp();
        setAnnouncementText('');
        setBroadcastSuccess(true);
        setTimeout(() => setBroadcastSuccess(false), 4000);
        fetchAllData();
      }
    } catch (err) {
      playSound.wrong();
    } finally {
      setIsBroadcasting(false);
    }
  };

  // Filtered Students
  const filteredStudents = students.filter(s => {
    const q = globalSearch.toLowerCase().trim();
    if (!q) return true;
    const name = (s.full_name || '').toLowerCase();
    const email = (s.email || '').toLowerCase();
    const username = (s.username || '').toLowerCase();
    const school = (s.school || '').toLowerCase();
    return name.includes(q) || email.includes(q) || username.includes(q) || school.includes(q);
  });

  // Filtered Messages
  const filteredMessages = messages.filter(m => {
    const matchesChannel = chatChannelFilter === 'all' || m.channel_id === chatChannelFilter;
    const q = globalSearch.toLowerCase().trim();
    if (!q) return matchesChannel;
    const content = (m.content || '').toLowerCase();
    const sender = (m.sender_name || m.sender_username || '').toLowerCase();
    return matchesChannel && (content.includes(q) || sender.includes(q));
  });

  // Formatted Date & Time Strings
  const formattedDate = currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formattedDay = currentTime.toLocaleDateString('en-US', { weekday: 'long' });
  const formattedTime = currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });

  const adminName = admin?.username || admin?.fullName?.toLowerCase() || 'soksithchey';

  return (
    <div className="flex min-h-screen bg-[#f4f7fb] font-kantumruy text-slate-800 antialiased selection:bg-[#005baa] selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. LEFT ROYAL NAVY SIDEBAR (Exact University Management System Structure) */}
      {/* ========================================================================= */}
      <aside className="w-64 bg-[#0a2346] text-white flex flex-col justify-between border-r border-[#153460] shadow-2xl flex-shrink-0 z-30 select-none">
        
        <div className="flex flex-col">
          
          {/* Logo & Ministry Brand Header */}
          <div className="p-5 border-b border-white/10 flex items-center gap-3.5 bg-[#071b37]">
            <div className="w-11 h-11 rounded-xl bg-white/10 p-1.5 border border-amber-400/40 shadow-inner flex items-center justify-center flex-shrink-0">
              <img
                src="/assets/moeys-crest-transparent.png"
                alt="Ministry Crest"
                className="w-full h-full object-contain filter drop-shadow-sm"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-sm text-white tracking-tight leading-tight truncate">
                MoTDAR Platform
              </h2>
              <span className="text-[9.5px] font-bold text-amber-300 uppercase tracking-wider block font-cinzel truncate mt-0.5">
                MANAGEMENT SYSTEM
              </span>
            </div>
          </div>

          {/* Sidebar Navigation Items */}
          <nav className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-160px)] no-scrollbar text-xs">
            
            {/* Group 1: ម៉ឺនុយស្នូល / CORE PLATFORM (Exact 1-to-1 Match with Student Menu) */}
            <div className="space-y-1">
              <span className="px-3 text-[10px] font-black text-cyan-300 uppercase tracking-widest block mb-1 font-kantumruy">
                {lang === 'km' ? 'ម៉ឺនុយស្នូល' : 'CORE MENU'}
              </span>

              {/* 1. Home / Dashboard */}
              <button
                type="button"
                onClick={() => { playSound.click(); setActiveView('dashboard'); }}
                className={`w-full px-3.5 py-2.5 rounded-xl font-bold flex items-center justify-between transition-all cursor-pointer ${
                  activeView === 'dashboard'
                    ? 'bg-[#1864ab] text-white shadow-md font-extrabold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Home className="w-4 h-4 text-cyan-300" />
                  <span>{lang === 'km' ? 'ទំព័រដើម' : 'Home'}</span>
                </div>
              </button>

              {/* 2. Curriculum */}
              <button
                type="button"
                onClick={() => { playSound.click(); setActiveView('faculties'); }}
                className={`w-full px-3.5 py-2.5 rounded-xl font-bold flex items-center justify-between transition-all cursor-pointer ${
                  activeView === 'faculties'
                    ? 'bg-[#1864ab] text-white shadow-md font-extrabold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-blue-300" />
                  <span>{lang === 'km' ? 'កម្មវិធីសិក្សាជាតិ' : 'Curriculum'}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#1864ab] text-white text-[9.5px] font-bold shadow-xs">
                  {lang === 'km' ? 'ថ្នាក់ទី១០-១២' : 'Grade 10-12'}
                </span>
              </button>

              {/* 3. BacII Prep Hub */}
              <button
                type="button"
                onClick={() => { playSound.click(); setActiveView('exams'); }}
                className={`w-full px-3.5 py-2.5 rounded-xl font-bold flex items-center justify-between transition-all cursor-pointer ${
                  activeView === 'exams'
                    ? 'bg-[#1864ab] text-white shadow-md font-extrabold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-4 h-4 text-rose-300" />
                  <span>{lang === 'km' ? 'វិញ្ញាសាប្រឡងបាក់ឌុប' : 'BacII Prep Hub'}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9.5px] font-bold shadow-xs">
                  {lang === 'km' ? 'បាក់ឌុប' : 'Bac II'}
                </span>
              </button>

              {/* 4. Game Arena */}
              <button
                type="button"
                onClick={() => { playSound.click(); setActiveView('arena'); }}
                className={`w-full px-3.5 py-2.5 rounded-xl font-bold flex items-center justify-between transition-all cursor-pointer ${
                  activeView === 'arena'
                    ? 'bg-[#1864ab] text-white shadow-md font-extrabold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Gamepad2 className="w-4 h-4 text-amber-300" />
                  <span>{lang === 'km' ? 'សង្វៀនហ្គេមអប់រំ' : 'Game Arena'}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[9.5px] font-bold shadow-xs">
                  {lang === 'km' ? 'ហាត់សម' : 'Practice'}
                </span>
              </button>

              {/* 5. Messenger & Chat */}
              <button
                type="button"
                onClick={() => { playSound.click(); setActiveView('chat'); }}
                className={`w-full px-3.5 py-2.5 rounded-xl font-bold flex items-center justify-between transition-all cursor-pointer ${
                  activeView === 'chat'
                    ? 'bg-[#1864ab] text-white shadow-md font-extrabold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-cyan-300" />
                  <span>{lang === 'km' ? 'សារ & ជជែក' : 'Messenger & Chat'}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950 text-[9.5px] font-black shadow-xs flex items-center gap-1">
                  <span>Chat</span>
                  <span>💬</span>
                </span>
              </button>

              {/* 6. Digital Textbooks */}
              <button
                type="button"
                onClick={() => { playSound.click(); setActiveView('textbooks'); }}
                className={`w-full px-3.5 py-2.5 rounded-xl font-bold flex items-center justify-between transition-all cursor-pointer ${
                  activeView === 'textbooks'
                    ? 'bg-[#1864ab] text-white shadow-md font-extrabold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Library className="w-4 h-4 text-indigo-300" />
                  <span>{lang === 'km' ? 'សៀវភៅពុម្ពអេឡិចត្រូនិក' : 'Digital Textbooks'}</span>
                </div>
              </button>

              {/* 7. Virtual Lab */}
              <button
                type="button"
                onClick={() => { playSound.click(); setActiveView('lab'); }}
                className={`w-full px-3.5 py-2.5 rounded-xl font-bold flex items-center justify-between transition-all cursor-pointer ${
                  activeView === 'lab'
                    ? 'bg-[#1864ab] text-white shadow-md font-extrabold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FlaskConical className="w-4 h-4 text-emerald-300" />
                  <span>{lang === 'km' ? 'បន្ទប់ពិសោធន៍ STEM' : 'Virtual Lab STEM'}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9.5px] font-bold shadow-xs">
                  STEM
                </span>
              </button>

              {/* 8. Student Profile */}
              <button
                type="button"
                onClick={() => { playSound.click(); setActiveView('students'); }}
                className={`w-full px-3.5 py-2.5 rounded-xl font-bold flex items-center justify-between transition-all cursor-pointer ${
                  activeView === 'students'
                    ? 'bg-[#1864ab] text-white shadow-md font-extrabold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <UserCheck className="w-4 h-4 text-blue-300" />
                  <span>{lang === 'km' ? 'កម្រងព័ត៌មានសិស្ស' : 'Student Profile'}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-[10px] font-black font-cinzel">
                  {students.length}
                </span>
              </button>
            </div>

            {/* Group 2: GOVERNANCE & MINISTERIAL CONTROL */}
            <div className="space-y-1 pt-2 border-t border-white/10">
              <span className="px-3 text-[10px] font-black text-amber-300 uppercase tracking-widest block mb-1 font-kantumruy">
                {lang === 'km' ? 'ការគ្រប់គ្រងជាន់ខ្ពស់' : 'GOVERNANCE'}
              </span>

              {/* Lecturers */}
              <button
                type="button"
                onClick={() => { playSound.click(); setActiveView('lecturers'); }}
                className={`w-full px-3.5 py-2 rounded-xl font-bold flex items-center gap-3 transition-all cursor-pointer ${
                  activeView === 'lecturers'
                    ? 'bg-[#1864ab] text-white shadow-md font-extrabold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Award className="w-4 h-4 text-emerald-300" />
                <span>{lang === 'km' ? 'សាស្ត្រាចារ្យជាតិ & AI' : 'Lecturers & AI Tutors'}</span>
              </button>

              {/* Approvals */}
              <button
                type="button"
                onClick={() => { playSound.click(); setActiveView('approvals'); }}
                className={`w-full px-3.5 py-2 rounded-xl font-bold flex items-center justify-between transition-all cursor-pointer ${
                  activeView === 'approvals'
                    ? 'bg-[#1864ab] text-white shadow-md font-extrabold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>{lang === 'km' ? 'ការផ្ទៀងផ្ទាត់សញ្ញាបត្រ' : 'Approvals & Diplomas'}</span>
                </div>
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  {lang === 'km' ? 'សកម្ម' : 'Active'}
                </span>
              </button>

              {/* Broadcast */}
              <button
                type="button"
                onClick={() => { playSound.click(); setActiveView('announcements'); }}
                className={`w-full px-3.5 py-2 rounded-xl font-bold flex items-center justify-between transition-all cursor-pointer ${
                  activeView === 'announcements'
                    ? 'bg-[#1864ab] text-white shadow-md font-extrabold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Radio className="w-4 h-4 text-amber-300" />
                  <span>{lang === 'km' ? 'សេចក្តីប្រកាសព័ត៌មាន' : 'Broadcast Notice'}</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              </button>

              {/* Database */}
              <button
                type="button"
                onClick={() => { playSound.click(); setActiveView('database'); }}
                className={`w-full px-3.5 py-2 rounded-xl font-bold flex items-center gap-3 transition-all cursor-pointer ${
                  activeView === 'database'
                    ? 'bg-[#1864ab] text-white shadow-md font-extrabold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Database className="w-4 h-4 text-emerald-300" />
                <span>{lang === 'km' ? 'មូលទិន្នន័យ (elearning_db)' : 'MySQL (elearning_db)'}</span>
              </button>
            </div>

          </nav>

        </div>

        {/* Sidebar Footer Actions */}
        <div className="p-3 border-t border-white/10 space-y-1.5 bg-[#071b37]">
          <button
            type="button"
            onClick={onSwitchToStudentView}
            className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold transition-all flex items-center justify-between cursor-pointer border border-white/10"
          >
            <div className="flex items-center gap-2">
              <Laptop className="w-3.5 h-3.5 text-cyan-300" />
              <span>{lang === 'km' ? 'ផ្ទាំងសិស្ស (Student Portal)' : 'Student Portal'}</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="w-full py-2 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-rose-400/30"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{lang === 'km' ? 'ចាកចេញ (Logout Admin)' : 'Sign Out Admin'}</span>
          </button>
        </div>

      </aside>

      {/* ========================================================================= */}
      {/* 2. RIGHT MAIN BODY (Header + Central Command Center) */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-2xs">
          
          {/* Left Title */}
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>{lang === 'km' ? 'ផ្ទាំងគ្រប់គ្រងរដ្ឋបាលជាតិ' : 'National Admin Dashboard'}</span>
              {isLoading && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {lang === 'km' 
                ? 'ទិដ្ឋភាពទូទៅនៃប្រព័ន្ធអប់រំ និងការគ្រប់គ្រងគ្រឹះស្ថានសិក្សាជាតិ' 
                : 'Overview of your national education & university management system'}
            </p>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Search Input */}
            <div className="relative w-48 sm:w-72 hidden md:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={lang === 'km' ? 'ស្វែងរកសិស្ស គ្រូបង្រៀន មេរៀន...' : 'Search students, teachers, classes...'}
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full bg-slate-100/90 border border-slate-200 rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#1864ab] focus:bg-white transition-all shadow-inner"
              />
            </div>

            {/* 🌐 Language Switcher Dropdown (En / Kh) */}
            <div className="relative flex-shrink-0">
              <button
                type="button"
                onClick={() => { playSound?.pop?.(); setIsLangOpen(!isLangOpen); }}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl border border-[#1864ab]/30 hover:border-[#1864ab] text-xs font-black text-[#1864ab] hover:bg-blue-50/80 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap"
              >
                <span>{lang === 'km' ? '🇰🇭 ខ្មែរ' : '🇬🇧 English'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#1864ab]/70" />
              </button>

              {isLangOpen && (
                <div className="absolute top-full right-0 mt-1.5 w-36 bg-white/95 backdrop-blur-2xl rounded-2xl border border-slate-200 shadow-2xl p-1.5 z-50 animate-scale-up select-none ring-1 ring-black/5">
                  <button
                    type="button"
                    onClick={() => { setLang('km'); setIsLangOpen(false); playSound?.click?.(); }}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-bold text-left flex items-center gap-2 cursor-pointer transition-colors ${
                      lang === 'km' ? 'bg-[#1864ab] text-white shadow-xs' : 'text-slate-700 hover:bg-blue-50 hover:text-[#1864ab]'
                    }`}
                  >
                    <span>🇰🇭</span>
                    <span>ភាសាខ្មែរ</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLang('en'); setIsLangOpen(false); playSound?.click?.(); }}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-bold text-left flex items-center gap-2 cursor-pointer transition-colors ${
                      lang === 'en' ? 'bg-[#1864ab] text-white shadow-xs' : 'text-slate-700 hover:bg-blue-50 hover:text-[#1864ab]'
                    }`}
                  >
                    <span>🇬🇧</span>
                    <span>English</span>
                  </button>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => playSound.pop()}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 relative cursor-pointer transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                3
              </span>
            </button>

            {/* Mail Icon */}
            <button
              type="button"
              onClick={() => { playSound.click(); setActiveView('chat'); }}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 relative cursor-pointer transition-colors"
              title="Messages"
            >
              <Mail className="w-4 h-4" />
            </button>

            {/* Admin Profile Chip */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <div className="relative w-9 h-9 flex items-center justify-center flex-shrink-0">
                <img
                  src={admin?.avatar || '/assets/anime/boys/boy_1.png'}
                  alt="Admin"
                  className="w-[82%] h-[82%] rounded-full object-cover border-2 border-amber-400 shadow-xs"
                />
                <img
                  src="/assets/frames/11_gyoko_pink.png"
                  alt="Frame"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none scale-110"
                />
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-xs font-black text-slate-900 block leading-tight">
                  {adminName}
                </span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                  {lang === 'km' ? 'អ្នកគ្រប់គ្រងប្រព័ន្ធ' : 'Administrator'}
                </span>
              </div>
            </div>

          </div>

        </header>

        {/* Central View Content Canvas */}
        <main className="flex-1 p-6 lg:p-8 space-y-6">

          {/* ========================================================================= */}
          {/* VIEW 1: DASHBOARD OVERVIEW (Exact Replica of Beltei University Layout) */}
          {/* ========================================================================= */}
          {activeView === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* 🌟 1. HERO BANNER: "Welcome back, soksithchey" */}
              <div className="bg-[#0b1f3a] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border border-slate-800">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="space-y-2 relative z-10 max-w-2xl">
                  <span className="text-[11px] font-black text-cyan-300 uppercase tracking-widest block font-cinzel">
                    — DASHBOARD OVERVIEW
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Welcome back, <span className="text-cyan-400 font-moul">{adminName}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                    Monitor your institution's performance, track key metrics, and manage operations efficiently from your central command center.
                  </p>
                </div>

                {/* Right Side: Embedded Live Date & Clock Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 shadow-xl text-right min-w-[200px] flex-shrink-0 self-stretch sm:self-auto">
                  <div className="flex items-center justify-end gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span>TODAY'S DATE</span>
                  </div>
                  <div className="text-lg sm:text-xl font-black text-white font-cinzel tracking-tight">
                    {formattedDate}
                  </div>
                  <div className="text-xs font-bold text-slate-300">
                    {formattedDay}
                  </div>
                  <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-cyan-300 mt-2 font-mono pt-2 border-t border-white/10">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formattedTime}</span>
                  </div>
                </div>
              </div>

              {/* 🌟 2. FIVE METRIC KPI CARDS ROW */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                
                {/* Card 1: Total Students */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Active</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[10.5px] font-extrabold text-slate-400 uppercase tracking-wider block">
                      {lang === 'km' ? 'សិស្សចុះឈ្មោះសរុប' : 'TOTAL STUDENTS'}
                    </span>
                    <span className="text-2xl font-black text-slate-900 font-cinzel mt-0.5 block">
                      {students.length}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {lang === 'km' ? 'សកម្មក្នុងប្រព័ន្ធ' : 'vs last semester'}
                    </span>
                  </div>
                </div>

                {/* Card 2: Total Teachers */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{lang === 'km' ? 'សកម្ម' : 'Active'}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[10.5px] font-extrabold text-slate-400 uppercase tracking-wider block">
                      {lang === 'km' ? 'គ្រូបង្រៀន & AI' : 'TOTAL TEACHERS'}
                    </span>
                    <span className="text-2xl font-black text-slate-900 font-cinzel mt-0.5 block">
                      5
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {lang === 'km' ? 'សាស្ត្រាចារ្យជាតិ' : 'vs last semester'}
                    </span>
                  </div>
                </div>

                {/* Card 3: Total Classes */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {lang === 'km' ? 'គ្រប់កម្រិត' : 'All Sections'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10.5px] font-extrabold text-slate-400 uppercase tracking-wider block">
                      {lang === 'km' ? 'មុខវិជ្ជាថ្នាក់ទី១០-១២' : 'TOTAL CLASSES'}
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-2xl font-black text-slate-900 font-cinzel">
                        7
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        — 100%
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {lang === 'km' ? 'កម្មវិធីសិក្សាជាតិ' : 'vs last semester'}
                    </span>
                  </div>
                </div>

                {/* Card 4: Total Chat Messages */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      <span>↑ Live Chat</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[10.5px] font-extrabold text-slate-400 uppercase tracking-wider block">
                      {lang === 'km' ? 'សារជជែកសរុប' : 'CHAT MESSAGES'}
                    </span>
                    <span className="text-2xl font-black text-slate-900 font-cinzel mt-0.5 block">
                      {messages.length}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {lang === 'km' ? 'លើ ៦ ប៉ុស្តិ៍ជជែក' : 'across 6 channels'}
                    </span>
                  </div>
                </div>

                {/* Card 5: Server Memory & DB */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-sm">
                      <Database className="w-5 h-5" />
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      <span>MySQL Synced</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[10.5px] font-extrabold text-slate-400 uppercase tracking-wider block">
                      {lang === 'km' ? 'ការប្រើប្រាស់ RAM' : 'SERVER RAM'}
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-2xl font-black text-slate-900 font-cinzel">
                        {stats?.stats?.memoryUsageMb || 64}
                      </span>
                      <span className="text-xs font-bold text-slate-500 font-mono">MB</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {lang === 'km' ? 'ម៉ាស៊ីនបម្រើការ dual-engine' : 'dual-engine SQLite'}
                    </span>
                  </div>
                </div>

              </div>

              {/* 🌟 3. MAIN ANALYTICS & QUICK ACTIONS ROW */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left (8 Cols): Revenue / Learning Analytics Wave Graph */}
                <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
                  
                  {/* Graph Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">
                        Revenue Analytics (ការវិភាគសកម្មភាពសិក្សាជាតិ)
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-bold text-slate-400">— 0%</span>
                        <span className="text-xs text-slate-400">vs last year</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#1864ab] cursor-pointer">
                        <option>This Year</option>
                        <option>This Month</option>
                        <option>This Week</option>
                      </select>
                    </div>
                  </div>

                  {/* SVG Wave Graph Visual Replica */}
                  <div className="w-full h-64 relative flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#1864ab" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="#1864ab" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Horizontal Grid lines */}
                      <line x1="40" y1="20" x2="680" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="40" y1="60" x2="680" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="40" y1="100" x2="680" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="40" y1="140" x2="680" y2="140" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="40" y1="180" x2="680" y2="180" stroke="#e2e8f0" strokeWidth="1.5" />

                      {/* Y-Axis labels */}
                      <text x="35" y="24" textAnchor="end" fontSize="10" fill="#94a3b8" fontFamily="monospace">$0.02</text>
                      <text x="35" y="64" textAnchor="end" fontSize="10" fill="#94a3b8" fontFamily="monospace">$0.015</text>
                      <text x="35" y="104" textAnchor="end" fontSize="10" fill="#94a3b8" fontFamily="monospace">$0.010</text>
                      <text x="35" y="144" textAnchor="end" fontSize="10" fill="#94a3b8" fontFamily="monospace">$0.005</text>
                      <text x="35" y="184" textAnchor="end" fontSize="10" fill="#94a3b8" fontFamily="monospace">$0.000</text>

                      {/* Bell Curve Area Fill */}
                      <path
                        d="M 40 180 C 260 180, 310 20, 360 20 C 410 20, 460 180, 680 180 Z"
                        fill="url(#waveGradient)"
                      />

                      {/* Bell Curve Stroke Line */}
                      <path
                        d="M 40 180 C 260 180, 310 20, 360 20 C 410 20, 460 180, 680 180"
                        fill="none"
                        stroke="#1864ab"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                      {/* Peak Point Dot */}
                      <circle cx="360" cy="20" r="5" fill="#ffffff" stroke="#1864ab" strokeWidth="3" />
                    </svg>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 font-medium">
                    <span>Jan - Mar</span>
                    <span>Apr - Jun</span>
                    <span className="font-bold text-[#1864ab]">Jul - Sep (Peak Exam Period)</span>
                    <span>Oct - Dec</span>
                  </div>

                </div>

                {/* Right (4 Cols): Quick Actions Card */}
                <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
                  
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Quick Actions
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Frequently used tasks
                    </p>
                  </div>

                  <div className="space-y-3">
                    
                    {/* Action 1: Add New Student */}
                    <button
                      type="button"
                      onClick={() => { playSound.click(); setActiveView('students'); }}
                      className="w-full p-4 rounded-2xl bg-blue-50/70 hover:bg-blue-100/80 border border-blue-200/80 transition-all flex items-center justify-between group cursor-pointer text-left shadow-2xs"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                          <UserPlus className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-black text-blue-900 block group-hover:text-blue-700">
                            Add New Student
                          </span>
                          <span className="text-[10.5px] text-blue-600 block">
                            Register enrollment
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-blue-400 group-hover:text-blue-700 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Action 2: Add New Teacher / Announcement */}
                    <button
                      type="button"
                      onClick={() => { playSound.click(); setActiveView('announcements'); }}
                      className="w-full p-4 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-200/80 transition-all flex items-center justify-between group cursor-pointer text-left shadow-2xs"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                          <Radio className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-black text-emerald-900 block group-hover:text-emerald-700">
                            Broadcast Announcement
                          </span>
                          <span className="text-[10.5px] text-emerald-600 block">
                            Send national alert
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Action 3: Chat Moderation */}
                    <button
                      type="button"
                      onClick={() => { playSound.click(); setActiveView('chat'); }}
                      className="w-full p-4 rounded-2xl bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200/80 transition-all flex items-center justify-between group cursor-pointer text-left shadow-2xs"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-black text-amber-900 block group-hover:text-amber-700">
                            Moderate Chat Channels
                          </span>
                          <span className="text-[10.5px] text-amber-600 block">
                            Audit & clean messages
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-amber-400 group-hover:text-amber-700 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Action 4: Sync MySQL DB */}
                    <button
                      type="button"
                      onClick={() => { playSound.pop(); fetchAllData(); }}
                      className="w-full p-4 rounded-2xl bg-purple-50/70 hover:bg-purple-100/80 border border-purple-200/80 transition-all flex items-center justify-between group cursor-pointer text-left shadow-2xs"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
                          <Database className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-black text-purple-900 block group-hover:text-purple-700">
                            Sync Database (MySQL)
                          </span>
                          <span className="text-[10.5px] text-purple-600 block">
                            Live Dual-Engine Sync
                          </span>
                        </div>
                      </div>
                      <RefreshCw className={`w-4 h-4 text-purple-400 group-hover:text-purple-700 transition-transform ${isLoading ? 'animate-spin' : ''}`} />
                    </button>

                  </div>

                </div>

              </div>

              {/* 🌟 4. BOTTOM STUDENT LIST & CHAT STREAM CARDS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Registered Students Table Card (7 cols) */}
                <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <h3 className="font-extrabold text-sm text-slate-900">
                        Registered Students ({students.length})
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveView('students')}
                      className="text-xs font-bold text-[#1864ab] hover:underline"
                    >
                      Manage All
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {students.slice(0, 5).map((st, idx) => (
                      <div key={st.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 hover:bg-blue-50/40 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center font-cinzel">
                            #{st.id}
                          </span>
                          <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-900 border border-slate-200 shadow-xs flex-shrink-0">
                            <img
                              src={api.formatAvatarUrl(st.avatar)}
                              alt={st.full_name}
                              onError={(e) => { e.currentTarget.src = '/assets/anime/boys/boy_1.png'; }}
                              className="w-full h-full object-cover rounded-full"
                            />
                          </div>
                          <div className="min-w-0">
                            <span className="font-black text-xs text-slate-900 block truncate">
                              {st.full_name || st.username}
                            </span>
                            <span className="text-[10px] text-slate-500 truncate block font-mono">
                              {st.email}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#1864ab] text-[10px] font-black font-cinzel">
                            {st.xp || 500} XP
                          </span>
                          <button
                            type="button"
                            onClick={() => handleOpenDeleteModal(st)}
                            className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-600 cursor-pointer transition-colors"
                            title="Delete Student"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Message Moderation Card (5 cols) */}
                <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-amber-500" />
                      <h3 className="font-extrabold text-sm text-slate-900">
                        Live Chat Messages ({messages.length})
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveView('chat')}
                      className="text-xs font-bold text-[#1864ab] hover:underline"
                    >
                      Audit
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {messages.slice(0, 5).map((msg) => (
                      <div key={msg.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 group">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="font-black text-xs text-blue-900 truncate">
                              {msg.sender_name || msg.sender_username}
                            </span>
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-blue-100 text-blue-800 font-cinzel">
                              #{msg.channel_id}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 break-words line-clamp-2">
                            {msg.content}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteChatMessage(msg.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all cursor-pointer flex-shrink-0"
                          title="Delete message"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 2: FULL STUDENTS MANAGEMENT (CRUD with MySQL Sync) */}
          {/* ========================================================================= */}
          {activeView === 'students' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 animate-fadeIn">
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    Student Database Management ({filteredStudents.length})
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Direct dual-engine sync with MySQL (phpMyAdmin: `elearning_db`) & SQLite
                  </p>
                </div>

                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by name, email, school..."
                    value={globalSearch}
                    onChange={(e) => setGlobalSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#1864ab] focus:bg-white transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-black uppercase text-[10px] tracking-wider border-b border-slate-200">
                      <th className="py-3.5 px-4">ID / Student</th>
                      <th className="py-3.5 px-4">Email</th>
                      <th className="py-3.5 px-4">XP & Level</th>
                      <th className="py-3.5 px-4">Grade & School</th>
                      <th className="py-3.5 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredStudents.map((st) => (
                      <tr key={st.id} className="hover:bg-blue-50/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-slate-400 font-cinzel">#{st.id}</span>
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-900 border border-slate-200 shadow-xs flex-shrink-0">
                              <img
                                src={api.formatAvatarUrl(st.avatar)}
                                alt={st.full_name}
                                onError={(e) => { e.currentTarget.src = '/assets/anime/boys/boy_1.png'; }}
                                className="w-full h-full object-cover rounded-full"
                              />
                            </div>
                            <div>
                              <span className="font-extrabold text-xs text-slate-900 block">{st.full_name || st.username}</span>
                              <span className="text-[10px] text-slate-400 font-mono">@{st.username}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold text-xs text-[#1864ab] font-mono">{st.email}</td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#1864ab] font-extrabold text-[10px] font-cinzel">
                            Lv.{st.level || 1} • {st.xp || 500} XP
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-xs text-slate-800 block">Grade {st.grade || '12'}</span>
                          <span className="text-[10px] text-slate-500 truncate block">{st.school || 'វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ'}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => handleOpenDeleteModal(st)}
                              className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold transition-all cursor-pointer border border-rose-200 shadow-2xs hover:scale-105 active:scale-95"
                              title="Delete Student"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 3: CHAT MODERATION */}
          {/* ========================================================================= */}
          {activeView === 'chat' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 animate-fadeIn">
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    Live Chat Moderation ({filteredMessages.length})
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Audit and remove messages across all channels
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {chatChannelFilter !== 'all' && (
                    <button
                      type="button"
                      onClick={() => handleClearChannel(chatChannelFilter)}
                      className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold border border-rose-200 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Purge #{chatChannelFilter}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Channel Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2">
                {[
                  { id: 'all', label: 'All Channels' },
                  { id: 'global', label: '🌐 Global' },
                  { id: 'math', label: '📐 Math' },
                  { id: 'physics', label: '⚡ Physics' },
                  { id: 'chemistry', label: '🧪 Chemistry' },
                  { id: 'bacii', label: '🎓 Bac II' },
                  { id: 'gaming', label: '🎮 1v1 Arena' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setChatChannelFilter(c.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      chatChannelFilter === c.id
                        ? 'bg-[#1864ab] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Messages Feed */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {filteredMessages.map((msg) => (
                  <div key={msg.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4 group">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="relative w-10 h-10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <img
                          src={api.formatAvatarUrl(msg.sender_avatar)}
                          alt={msg.sender_name}
                          onError={(e) => { e.currentTarget.src = '/assets/anime/boys/boy_1.png'; }}
                          className="w-[82%] h-[82%] rounded-full object-cover border border-slate-300"
                        />
                        {msg.sender_frame && (
                          <img
                            src={msg.sender_frame}
                            alt="Frame"
                            className="absolute inset-0 w-full h-full object-contain pointer-events-none scale-110"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-black text-xs text-[#1864ab]">
                            {msg.sender_name || msg.sender_username}
                          </span>
                          <span className="text-[9px] font-bold px-2 py-0.2 rounded-full bg-slate-200 text-slate-700">
                            #{msg.channel_id}
                          </span>
                          <span className="text-[9px] text-slate-400 ml-auto font-mono">
                            {msg.created_at ? new Date(msg.created_at).toLocaleString() : 'Just now'}
                          </span>
                        </div>
                        {msg.content?.startsWith('http') && (msg.content.includes('.gif') || msg.content.includes('giphy.com')) ? (
                          <div className="rounded-xl overflow-hidden shadow-xs my-1 max-w-xs bg-slate-900/10">
                            <img src={msg.content} alt="GIF" className="w-full max-h-48 object-contain rounded-xl" />
                          </div>
                        ) : (
                          <p className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                            {msg.content}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteChatMessage(msg.id)}
                      className="p-2 rounded-xl bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-300 transition-all cursor-pointer flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 4: BROADCAST ANNOUNCEMENT */}
          {/* ========================================================================= */}
          {activeView === 'announcements' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 max-w-3xl mx-auto animate-fadeIn">
              <div className="text-center space-y-2 pb-4 border-b border-slate-200">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-sm">
                  <Radio className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-black text-slate-900">
                  National Broadcast Studio
                </h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Broadcast live notices and announcements across all students in Cambodia.
                </p>
              </div>

              {broadcastSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>Announcement successfully broadcasted!</span>
                </div>
              )}

              <form onSubmit={handleSendAnnouncement} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700 block">
                    Announcement Message
                  </label>
                  <textarea
                    rows="5"
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    placeholder="Enter official ministry update..."
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-[#1864ab] focus:bg-white transition-all shadow-inner resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!announcementText.trim() || isBroadcasting}
                  className="w-full py-4 rounded-2xl bg-[#1864ab] hover:bg-[#155490] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isBroadcasting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>BROADCAST TO ALL STUDENTS</span>
                </button>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 5: DATABASE & MYSQL STATUS */}
          {/* ========================================================================= */}
          {activeView === 'database' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 max-w-4xl mx-auto animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900">
                      MySQL Database & SQLite Dual-Engine
                    </h2>
                    <p className="text-xs text-slate-500">
                      Database: `elearning_db` on phpMyAdmin / SQLite fallback
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { playSound.pop(); fetchAllData(); }}
                  className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Verify Status</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Engine Status</span>
                  <div className="text-base font-black text-emerald-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>Connected (Healthy)</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Database Name</span>
                  <div className="text-base font-black text-slate-800 font-mono">
                    elearning_db
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Total Students in DB</span>
                  <div className="text-base font-black text-blue-600 font-cinzel">
                    {students.length} Accounts
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 6: EXAMS & BAC II (វិញ្ញាសាប្រឡងបាក់ឌុប) */}
          {/* ========================================================================= */}
          {activeView === 'exams' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-rose-600" />
                    <span>ការគ្រប់គ្រងវិញ្ញាសាប្រឡងបាក់ឌុប (Bac II Exams & Mock Papers)</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    បង្ហោះវិញ្ញាសាថ្មីៗ កែសម្រួល និងគ្រប់គ្រងគន្លឹះដោះស្រាយផ្លូវការ
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => { playSound?.pop?.(); setIsAddExamOpen(true); }}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-xs shadow-md shadow-rose-600/20 cursor-pointer transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>បង្ហោះវិញ្ញាសាថ្មី (Post New Exam)</span>
                </button>
              </div>

              {/* Total Exam Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase block">វិញ្ញាសាសរុប</span>
                  <span className="text-xl font-black text-slate-900 font-cinzel">{adminExams.length + bacIIData.length} Papers</span>
                </div>
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                  <span className="text-[10px] font-extrabold text-blue-700 uppercase block">វិទ្យាសាស្ត្រពិត</span>
                  <span className="text-xl font-black text-[#1864ab] font-cinzel">
                    {[...adminExams, ...bacIIData].filter(e => e.stream === 'science' || e.stream === 'all').length} Papers
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-[10px] font-extrabold text-amber-700 uppercase block">វិទ្យាសាស្ត្រសង្គម</span>
                  <span className="text-xl font-black text-amber-800 font-cinzel">
                    {[...adminExams, ...bacIIData].filter(e => e.stream === 'social').length} Papers
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] font-extrabold text-emerald-700 uppercase block">បង្ហោះដោយ Admin ផ្ទាល់</span>
                  <span className="text-xl font-black text-emerald-700 font-cinzel">{adminExams.length} Custom</span>
                </div>
              </div>

              {/* Exams Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-black uppercase text-[10px] tracking-wider border-b border-slate-200">
                      <th className="py-3.5 px-4">ឆ្នាំ / វិញ្ញាសា</th>
                      <th className="py-3.5 px-4">មុខវិជ្ជា</th>
                      <th className="py-3.5 px-4">ថ្នាក់ / កម្រិត</th>
                      <th className="py-3.5 px-4">រយៈពេល & ពិន្ទុ</th>
                      <th className="py-3.5 px-4 text-center">សកម្មភាព</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {[...adminExams, ...bacIIData].map((ex) => (
                      <tr key={ex.id} className="hover:bg-blue-50/40 transition-colors">
                        <td className="py-3 px-4">
                          <div>
                            <span className="font-extrabold text-xs text-slate-900 block">{ex.paperTitleKm}</span>
                            <span className="text-[10px] text-slate-400 font-mono">ID: {ex.id}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-xs text-[#1864ab]">{ex.subject}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            ex.stream === 'social' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-[#1864ab]'
                          }`}>
                            {ex.stream === 'social' ? 'វិទ្យាសាស្ត្រសង្គម' : 'វិទ្យាសាស្ត្រពិត'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-xs text-slate-700 block">{ex.duration || '៩០ នាទី'}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{ex.totalPoints || 75} ពិន្ទុសរុប</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => { playSound?.click?.(); setPreviewExam(ex); }}
                              className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1864ab] font-bold transition-all cursor-pointer border border-blue-200"
                              title="មើលគន្លឹះដោះស្រាយ (View Solution)"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>
                            {adminExams.some(ae => ae.id === ex.id) && (
                              <button
                                type="button"
                                onClick={() => handleDeleteExam(ex.id)}
                                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold transition-all cursor-pointer border border-rose-200"
                                title="លុបវិញ្ញាសា (Delete Exam)"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 7: FACULTIES & CURRICULUM (កម្មវិធីសិក្សា ថ្នាក់ទី១០-១២) */}
          {/* ========================================================================= */}
          {activeView === 'faculties' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#1864ab]" />
                    <span>ការគ្រប់គ្រងកម្មវិធីសិក្សាជាតិ (National Curriculum Matrix)</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    គ្រប់គ្រងមុខវិជ្ជា និងមេរៀនថ្នាក់ទី ១០, ១១ និង ១២ តាមស្តង់ដារក្រសួង
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {curriculumData.map((subj) => (
                  <div key={subj.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 hover:shadow-sm transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{subj.icon || '📚'}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#1864ab] font-bold text-[10px]">
                        Grade 10-12
                      </span>
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">{subj.nameKm}</h3>
                      <p className="text-xs text-slate-500 font-medium">{subj.nameEn}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-bold">
                      <span>{subj.chapters?.length || 5} ជំពូកសិក្សា</span>
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Active</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 8: LECTURERS & AI TUTORS (សាស្ត្រាចារ្យជាតិ & គ្រូបង្រៀន AI) */}
          {/* ========================================================================= */}
          {activeView === 'lecturers' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-emerald-600" />
                    <span>សាស្ត្រាចារ្យជាតិ និងគ្រូបង្រៀនឆ្លាតវៃ AI (Lecturers & AI Tutors)</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    បញ្ជីសាស្ត្រាចារ្យ និងប្រព័ន្ធ AI Tutor ជំនួយការដោះស្រាយលំហាត់ ២៤/៧
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'សាស្រ្តាចារ្យបណ្ឌិត សុខ គឹមហួរ', role: 'ប្រធានដេប៉ាតឺម៉ង់គណិតវិទ្យា', icon: '👨‍🏫', subject: 'គណិតវិទ្យា (Math)', students: 1420 },
                  { name: 'សាស្រ្តាចារ្យ ចាន់ សុផល', role: 'គ្រូឧទ្ទេសរូបវិទ្យាថ្នាក់ជាតិ', icon: '👨‍🔬', subject: 'រូបវិទ្យា (Physics)', students: 1180 },
                  { name: 'អ្នកគ្រូ ម៉េង ស្រីពៅ', role: 'សាស្ត្រាចារ្យគីមីវិទ្យាជាន់ខ្ពស់', icon: '👩‍🏫', subject: 'គីមីវិទ្យា (Chemistry)', students: 950 },
                  { name: 'MoTDAR AI Math Tutor', role: 'AI Assistant (Math Solver)', icon: '🤖', subject: 'ជំនួយការគណិតវិទ្យា', students: 4820 },
                  { name: 'MoTDAR AI Science Lab Tutor', role: 'AI Assistant (Physics & Chem)', icon: '⚡', subject: 'ជំនួយការវិទ្យាសាស្ត្រពិត', students: 3900 }
                ].map((lec, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-2xl flex items-center justify-center shadow-xs">
                        {lec.icon}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs text-slate-900">{lec.name}</h4>
                        <span className="text-[10px] text-slate-500 block">{lec.role}</span>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs flex items-center justify-between font-bold text-slate-700">
                      <span>{lec.subject}</span>
                      <span className="text-blue-600 font-mono">{lec.students} សិស្ស</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 9: APPROVALS & BAC II DIPLOMAS (សញ្ញាបត្រឌីជីថល) */}
          {/* ========================================================================= */}
          {activeView === 'approvals' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>ការផ្ទៀងផ្ទាត់វិញ្ញាបនបត្រឌីជីថលបាក់ឌុប (Bac II Digital Certificates)</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    បញ្ជីវិញ្ញាបនបត្រផ្លូវការដែលបានប្រគល់ជូនសិស្ស និងផ្ទៀងផ្ទាត់ដោយ QR Hash
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-black uppercase text-[10px] tracking-wider border-b border-slate-200">
                      <th className="py-3.5 px-4">លេខសញ្ញាបត្រ</th>
                      <th className="py-3.5 px-4">អត្តលេខសិស្ស</th>
                      <th className="py-3.5 px-4">និទ្ទេសសរុប</th>
                      <th className="py-3.5 px-4">ពិន្ទុ</th>
                      <th className="py-3.5 px-4">កាលបរិច្ឆេទចេញ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {certificates.length > 0 ? (
                      certificates.map((cert) => (
                        <tr key={cert.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-mono font-bold text-[#1864ab]">{cert.certificate_no}</td>
                          <td className="py-3 px-4 font-bold text-slate-800">Student #{cert.student_id}</td>
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
                              និទ្ទេស {cert.overall_grade}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-700">{cert.total_score} / {cert.max_possible}</td>
                          <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{new Date(cert.issued_date || cert.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                          មិនទាន់មានវិញ្ញាបនបត្រត្រូវផ្ទៀងផ្ទាត់នៅឡើយទេ។
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 10: 1V1 ARENA MATCHES (ការប្រកួតចំណេះដឹង) */}
          {/* ========================================================================= */}
          {activeView === 'arena' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Swords className="w-5 h-5 text-amber-500" />
                    <span>សង្វៀនប្រកួតចំណេះដឹង ១ ទល់ ១ (1v1 Live Arena Engine)</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ត្រួតពិនិត្យបន្ទប់ប្រកួត និងពិន្ទុសិស្សទូទាំងប្រទេសក្នុងពេលជាក់ស្តែង
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-[10px] font-extrabold text-amber-800 uppercase block">Arena Status</span>
                  <span className="text-lg font-black text-amber-900 flex items-center gap-1.5 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>Real-Time Active</span>
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                  <span className="text-[10px] font-extrabold text-blue-800 uppercase block">Turn Engine</span>
                  <span className="text-lg font-black text-[#1864ab] font-mono mt-1 block">WebSocket / SSE Dual</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-extrabold text-slate-600 uppercase block">XP Distribution</span>
                  <span className="text-lg font-black text-slate-900 font-cinzel mt-1 block">+100 XP per Win</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 11: DIGITAL TEXTBOOKS (សៀវភៅពុម្ពអេឡិចត្រូនិក) */}
          {/* ========================================================================= */}
          {activeView === 'textbooks' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Library className="w-5 h-5 text-indigo-600" />
                    <span>ការគ្រប់គ្រងសៀវភៅពុម្ពអេឡិចត្រូនិក (Digital Textbooks & Library)</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    គ្រប់គ្រងសៀវភៅពុម្ពផ្លូវការក្រសួងអប់រំ ថ្នាក់ទី១០ ទី១១ និងទី១២
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {libraryBooks.map((book) => (
                  <div key={book.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between hover:shadow-sm transition-all">
                    <div className="space-y-2">
                      <div className="w-full h-36 rounded-xl bg-slate-200 overflow-hidden relative">
                        <img 
                          src={book.coverUrl} 
                          alt={book.titleKm} 
                          onError={(e) => { e.currentTarget.src = '/assets/moeys-crest-transparent.png'; }}
                          className="w-full h-full object-cover" 
                        />
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[9px] font-black">
                          {book.grade || 'ថ្នាក់ទី១២'}
                        </span>
                      </div>
                      <h4 className="font-black text-xs text-slate-900 line-clamp-2 leading-tight">
                        {book.titleKm}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {book.author} • {book.pages} ទំព័រ
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-600">Verified PDF</span>
                      <a 
                        href={book.pdfUrl || '#'} 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold transition-all"
                      >
                        បើកមើល PDF
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 12: VIRTUAL LAB STEM (បន្ទប់ពិសោធន៍ STEM) */}
          {/* ========================================================================= */}
          {activeView === 'lab' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <FlaskConical className="w-5 h-5 text-emerald-600" />
                    <span>ការគ្រប់គ្រងបន្ទប់ពិសោធន៍ STEM (Virtual STEM Labs Matrix)</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    កម្មវិធីពិសោធន៍វិទ្យាសាស្ត្រពិត 3D/Interactive Physics, Chemistry & Biology
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {periodicElements.map((el) => (
                  <div key={el.number} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:shadow-sm transition-all flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-400 font-mono">#{el.number}</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[9px]">
                        {el.category}
                      </span>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-[#1864ab] font-cinzel">{el.symbol}</div>
                      <h3 className="font-extrabold text-xs text-slate-900 mt-0.5">{el.nameKm}</h3>
                      <p className="text-[10px] text-slate-500">{el.nameEn} • {el.mass} u</p>
                    </div>
                    <div className="pt-2 border-t border-slate-200 text-[10.5px] text-slate-600 line-clamp-2 leading-relaxed">
                      {el.descriptionKm}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>

      </div>

      {/* ========================================================================= */}
      {/* 3. EDIT STUDENT MODAL */}
      {/* ========================================================================= */}
      {editingStudent && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn font-kantumruy">
          <div 
            className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#0a2346] p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-sm text-white">
                  Edit Student Account #{editingStudent.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    value={editFormData.fullName}
                    onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1864ab]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Email</label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1864ab]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">XP Points</label>
                  <input
                    type="number"
                    value={editFormData.xp}
                    onChange={(e) => setEditFormData({ ...editFormData, xp: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1864ab]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Level</label>
                  <input
                    type="number"
                    value={editFormData.level}
                    onChange={(e) => setEditFormData({ ...editFormData, level: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1864ab]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">School Name</label>
                <input
                  type="text"
                  value={editFormData.school}
                  onChange={(e) => setEditFormData({ ...editFormData, school: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1864ab]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Avatar Frame Path</label>
                <input
                  type="text"
                  value={editFormData.avatarFrame}
                  onChange={(e) => setEditFormData({ ...editFormData, avatarFrame: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1864ab]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                  <span>Reset Password (leave empty to keep current)</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter new password..."
                  value={editFormData.newPassword}
                  onChange={(e) => setEditFormData({ ...editFormData, newPassword: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#1864ab]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingStudent}
                  className="flex-1 py-2.5 rounded-xl bg-[#1864ab] hover:bg-[#155490] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSavingStudent ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Save className="w-4 h-4" />}
                  <span>Save Changes</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. CUSTOM LUXURY DELETE CONFIRMATION MODAL (No Browser Alert) */}
      {/* ========================================================================= */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn select-none">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.3)] border border-rose-100 animate-scale-up space-y-5 text-center relative overflow-hidden">
            
            {/* Top Glowing Red Accent */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-rose-500 via-red-500 to-amber-500" />
            
            {/* Animated Warning Icon with Glow */}
            <div className="relative mx-auto w-16 h-16 rounded-3xl bg-rose-50 border-2 border-rose-200 flex items-center justify-center shadow-lg shadow-rose-500/10">
              <AlertTriangle className="w-8 h-8 text-rose-600 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h3 className="font-black text-lg text-slate-900">
                បញ្ជាក់ការលុបគណនីសិស្ស
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Confirm Student Account Deletion
              </p>
            </div>

            {/* Target Student Preview Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-left">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-900 border border-slate-300 shadow-xs flex-shrink-0">
                <img
                  src={api.formatAvatarUrl(deleteConfirmTarget.avatar)}
                  alt={deleteConfirmTarget.full_name || deleteConfirmTarget.username}
                  onError={(e) => { e.currentTarget.src = '/assets/anime/boys/boy_1.png'; }}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-black text-xs text-slate-900 block truncate">
                  {deleteConfirmTarget.full_name || deleteConfirmTarget.username}
                </span>
                <span className="text-[11px] text-slate-500 block truncate font-mono">
                  {deleteConfirmTarget.email}
                </span>
                <span className="text-[10px] text-rose-600 font-black font-mono">
                  ID: #{deleteConfirmTarget.id} • {deleteConfirmTarget.student_id || 'BACII-STUDENT'}
                </span>
              </div>
            </div>

            {/* Danger Warning Callout */}
            <div className="p-3 rounded-2xl bg-rose-50/80 border border-rose-200 text-rose-800 text-xs leading-relaxed text-left flex items-start gap-2.5">
              <span className="text-base flex-shrink-0">⚠️</span>
              <span className="font-medium text-[11.5px]">
                តើអ្នកប្រាកដជាចង់លុបគណនីសិស្សនេះមែនទេ? សកម្មភាពនេះនឹងលុបទិន្នន័យចេញពី Database ទាំងស្រុង និងមិនអាចត្រឡប់ក្រោយវិញបានឡើយ។
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                disabled={isDeletingStudent}
                onClick={() => setDeleteConfirmTarget(null)}
                className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-all active:scale-95 disabled:opacity-50"
              >
                បោះបង់ (Cancel)
              </button>

              <button
                type="button"
                disabled={isDeletingStudent}
                onClick={handleExecuteDeleteStudent}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-600 text-white font-black text-xs shadow-lg shadow-rose-600/30 cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isDeletingStudent ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>លុបគណនី (Delete)</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. POST NEW វិញ្ញាសាប្រឡង MODAL */}
      {/* ========================================================================= */}
      {isAddExamOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn font-kantumruy">
          <div 
            className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-rose-600 to-red-700 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-6 h-6 text-amber-300" />
                <div>
                  <h3 className="font-black text-base text-white">
                    បង្ហោះវិញ្ញាសាប្រឡងបាក់ឌុបថ្មី (Post New Bac II Exam Paper)
                  </h3>
                  <span className="text-[11px] text-rose-100">
                    បញ្ចូលលំហាត់ និងគន្លឹះដោះស្រាយផ្លូវការទៅកាន់ Bac II Hub
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddExamOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveExam} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-800">
                  ចំណងជើងវិញ្ញាសាជាភាសាខ្មែរ (Khmer Title) *
                </label>
                <input
                  type="text"
                  placeholder="ឧ. វិញ្ញាសាគណិតវិទ្យា ថ្នាក់វិទ្យាសាស្ត្រពិត (សម័យប្រឡង៖ ២០២៦)"
                  value={examForm.paperTitleKm}
                  onChange={(e) => setExamForm({ ...examForm, paperTitleKm: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-rose-600 focus:bg-white transition-all shadow-inner"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700">មុខវិជ្ជា (Subject) *</label>
                  <select
                    value={examForm.subject}
                    onChange={(e) => {
                      const subjMap = {
                        'គណិតវិទ្យា': 'math',
                        'រូបវិទ្យា': 'physics',
                        'គីមីវិទ្យា': 'chemistry',
                        'ជីវវិទ្យា': 'biology',
                        'ប្រវត្តិវិទ្យា': 'history',
                        'ភាសាខ្មែរ': 'khmer',
                        'ភូមិវិទ្យា': 'geography',
                        'សីលធម៌-ពលរដ្ឋ': 'civics',
                        'ភាសាអង់គ្លេស': 'english'
                      };
                      setExamForm({ 
                        ...examForm, 
                        subject: e.target.value,
                        subjectKey: subjMap[e.target.value] || 'math'
                      });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-rose-600"
                  >
                    <option value="គណិតវិទ្យា">គណិតវិទ្យា (Math)</option>
                    <option value="រូបវិទ្យា">រូបវិទ្យា (Physics)</option>
                    <option value="គីមីវិទ្យា">គីមីវិទ្យា (Chemistry)</option>
                    <option value="ជីវវិទ្យា">ជីវវិទ្យា (Biology)</option>
                    <option value="ប្រវត្តិវិទ្យា">ប្រវត្តិវិទ្យា (History)</option>
                    <option value="ភាសាខ្មែរ">អក្សរសាស្ត្រខ្មែរ (Khmer)</option>
                    <option value="ភូមិវិទ្យា">ភូមិវិទ្យា (Geography)</option>
                    <option value="សីលធម៌-ពលរដ្ឋ">សីលធម៌-ពលរដ្ឋ (Civics)</option>
                    <option value="ភាសាអង់គ្លេស">ភាសាអង់គ្លេស (English)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700">ថ្នាក់ / ផ្នែក (Stream) *</label>
                  <select
                    value={examForm.stream}
                    onChange={(e) => setExamForm({ ...examForm, stream: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-rose-600"
                  >
                    <option value="science">វិទ្យាសាស្ត្រពិត (Science)</option>
                    <option value="social">វិទ្យាសាស្ត្រសង្គម (Social)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700">ឆ្នាំប្រឡង (Year) *</label>
                  <input
                    type="text"
                    value={examForm.year}
                    onChange={(e) => setExamForm({ ...examForm, year: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-rose-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700">រយៈពេល (Duration)</label>
                  <input
                    type="text"
                    value={examForm.duration}
                    onChange={(e) => setExamForm({ ...examForm, duration: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-rose-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700">ពិន្ទុសរុប (Total Points)</label>
                  <input
                    type="number"
                    value={examForm.totalPoints}
                    onChange={(e) => setExamForm({ ...examForm, totalPoints: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-rose-600"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-rose-900">
                    សំណួរ / ប្រធានលំហាត់ (Problem Statement) *
                  </label>
                  <textarea
                    rows="3"
                    value={examForm.problemText}
                    onChange={(e) => setExamForm({ ...examForm, problemText: e.target.value })}
                    placeholder="បញ្ចូលប្រធានវិញ្ញាសា ឬលំហាត់អនុវត្ត..."
                    required
                    className="w-full bg-white border border-rose-200 rounded-xl p-3 text-xs text-slate-900 font-medium focus:outline-none focus:border-rose-600 resize-none leading-relaxed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-emerald-900">
                    គន្លឹះដោះស្រាយ និងចម្លើយផ្លូវការ (Official Solution Key) *
                  </label>
                  <textarea
                    rows="4"
                    value={examForm.solutionText}
                    onChange={(e) => setExamForm({ ...examForm, solutionText: e.target.value })}
                    placeholder="បញ្ចូលដំណោះស្រាយលម្អិត និងចម្លើយផ្លូវការ..."
                    required
                    className="w-full bg-white border border-emerald-200 rounded-xl p-3 text-xs text-slate-900 font-medium focus:outline-none focus:border-emerald-600 resize-none leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  disabled={isSavingExam}
                  onClick={() => setIsAddExamOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  បោះបង់ (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={isSavingExam}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSavingExam ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>រក្សាទុក & បង្ហោះ (Save & Publish)</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. PREVIEW SOLUTION MODAL */}
      {/* ========================================================================= */}
      {previewExam && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn font-kantumruy">
          <div 
            className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#0b1f3a] p-5 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-widest block">
                  {previewExam.subject} • {previewExam.year}
                </span>
                <h3 className="font-black text-sm text-white mt-0.5">
                  {previewExam.paperTitleKm}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewExam(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {(previewExam.exercises || []).map((ex, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="font-extrabold text-xs text-[#1864ab]">{ex.titleKm || `លំហាត់ទី ${idx + 1}`}</h4>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 whitespace-pre-line leading-relaxed font-medium">
                    {ex.problemText}
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 whitespace-pre-line leading-relaxed">
                    <span className="font-bold block text-emerald-800 mb-1">💡 គន្លឹះដោះស្រាយផ្លូវការ៖</span>
                    {ex.solutionText}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
