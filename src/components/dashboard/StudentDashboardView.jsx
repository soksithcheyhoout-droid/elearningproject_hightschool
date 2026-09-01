import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  User, 
  Sparkles, 
  Flame, 
  Award, 
  Crown, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  BookOpen, 
  Calculator, 
  Layers,
  ShieldCheck,
  Building2,
  Camera, 
  Wand2, 
  Edit3, 
  Check, 
  X, 
  School,
  QrCode,
  Download,
  Share2,
  Star,
  Target,
  Zap,
  BookMarked,
  Microscope,
  Code,
  GraduationCap,
  ArrowUpRight,
  Activity,
  SlidersHorizontal,
  Palette,
  BadgeCheck,
  UploadCloud,
  LogOut
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import AnimeAvatarGeneratorModal from './AnimeAvatarGeneratorModal';
import HextechMetricCards from './HextechMetricCards';
import DigitalStudentIdModal from './DigitalStudentIdModal';
import BacIICertificateModal from './BacIICertificateModal';
import api from '../../services/api';

export default function StudentDashboardView({ setActiveTab }) {
  const { t, lang } = useLanguage();
  const { student, updateProfile, uploadCustomProfilePicture, logout } = useAuth();
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showIdCardModal, setShowIdCardModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [isUploadingPF, setIsUploadingPF] = useState(false);
  const fileInputRef = useRef(null);

  // Edit Profile Form State
  const [editName, setEditName] = useState(student.name);
  const [editSchool, setEditSchool] = useState(student.school);
  const [editGrade, setEditGrade] = useState(student.grade || '12');
  const [editStream, setEditStream] = useState(student.stream || 'science');

  // Handle Custom Student Profile Picture (PF) Upload
  const handleCustomPFUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingPF(true);
      await uploadCustomProfilePicture(file);
    } catch (err) {
      console.error('Failed to upload profile picture:', err);
    } finally {
      setIsUploadingPF(false);
    }
  };

  // Prevent background scrolling when Edit Profile modal is open
  useEffect(() => {
    if (isEditingProfile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isEditingProfile]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!editName.trim()) return;
    updateProfile({
      name: editName,
      school: editSchool,
      grade: editGrade,
      stream: editStream
    });
    setIsEditingProfile(false);
  };

  // BacII Score Simulator State (Science & Social Science Streams)
  const [activeStream, setActiveStream] = useState(student.stream === 'social' ? 'social' : 'science');

  // Science Stream Scores (Max: 500/525)
  const [scienceScores, setScienceScores] = useState({
    math: 110,      // /125 (Passing: 62.5) - Main subject in Science!
    khmer: 65,      // /75  (Passing: 37.5)
    physics: 65,    // /75  (Passing: 37.5)
    chemistry: 68,  // /75  (Passing: 37.5)
    biology: 65,    // /75  (Passing: 37.5)
    history: 42,    // /50  (Passing: 25)
    english: 45     // /50  (Passing: 25)
  });

  // Social Science Stream Scores (Max: 525)
  const [socialScores, setSocialScores] = useState({
    khmer: 108,     // /125 (Passing: 62.5) - Main subject in Social Science!
    math: 60,       // /75  (Passing: 37.5)
    history: 65,    // /75  (Passing: 37.5)
    geography: 64,  // /75  (Passing: 37.5)
    civics: 66,     // /75  (Passing: 37.5)
    earth: 40,      // /50  (Passing: 25)
    english: 45     // /50  (Passing: 25)
  });

  // Science Stream Subjects Config (MoEYS Official Standard)
  const scienceSubjects = [
    { key: 'math', nameKm: 'គណិតវិទ្យា', nameEn: 'Mathematics', max: 125, pass: 62.5, color: '#005baa', accent: 'accent-[#005baa]', textClass: 'text-[#005baa]' },
    { key: 'khmer', nameKm: 'ភាសាខ្មែរ', nameEn: 'Khmer Literature', max: 75, pass: 37.5, color: '#d97706', accent: 'accent-amber-500', textClass: 'text-amber-700' },
    { key: 'physics', nameKm: 'រូបវិទ្យា', nameEn: 'Physics', max: 75, pass: 37.5, color: '#059669', accent: 'accent-emerald-500', textClass: 'text-emerald-700' },
    { key: 'chemistry', nameKm: 'គីមីវិទ្យា', nameEn: 'Chemistry', max: 75, pass: 37.5, color: '#7c3aed', accent: 'accent-purple-500', textClass: 'text-purple-700' },
    { key: 'biology', nameKm: 'ជីវវិទ្យា', nameEn: 'Biology', max: 75, pass: 37.5, color: '#0d9488', accent: 'accent-teal-500', textClass: 'text-teal-700' },
    { key: 'history', nameKm: 'ប្រវត្តិវិទ្យា', nameEn: 'History', max: 50, pass: 25, color: '#e11d48', accent: 'accent-rose-500', textClass: 'text-rose-700' },
    { key: 'english', nameKm: 'ភាសាអង់គ្លេស', nameEn: 'English Language', max: 50, pass: 25, color: '#0284c7', accent: 'accent-sky-500', textClass: 'text-sky-700' }
  ];

  // Social Science Stream Subjects Config (MoEYS Official Standard)
  const socialSubjects = [
    { key: 'khmer', nameKm: 'ភាសាខ្មែរ', nameEn: 'Khmer Literature', max: 125, pass: 62.5, color: '#d97706', accent: 'accent-amber-500', textClass: 'text-amber-700' },
    { key: 'math', nameKm: 'គណិតវិទ្យា', nameEn: 'Mathematics', max: 75, pass: 37.5, color: '#005baa', accent: 'accent-[#005baa]', textClass: 'text-[#005baa]' },
    { key: 'history', nameKm: 'ប្រវត្តិវិទ្យា', nameEn: 'History', max: 75, pass: 37.5, color: '#e11d48', accent: 'accent-rose-500', textClass: 'text-rose-700' },
    { key: 'geography', nameKm: 'ភូមិវិទ្យា', nameEn: 'Geography', max: 75, pass: 37.5, color: '#0d9488', accent: 'accent-teal-500', textClass: 'text-teal-700' },
    { key: 'civics', nameKm: 'សីលធម៌-ពលរដ្ឋវិជ្ជា', nameEn: 'Moral & Civics', max: 75, pass: 37.5, color: '#7c3aed', accent: 'accent-purple-500', textClass: 'text-purple-700' },
    { key: 'earth', nameKm: 'ផែនដី និងបរិស្ថាន', nameEn: 'Earth & Environment', max: 50, pass: 25, color: '#059669', accent: 'accent-emerald-500', textClass: 'text-emerald-700' },
    { key: 'english', nameKm: 'ភាសាអង់គ្លេស', nameEn: 'English Language', max: 50, pass: 25, color: '#0284c7', accent: 'accent-sky-500', textClass: 'text-sky-700' }
  ];

  const currentSubjects = activeStream === 'social' ? socialSubjects : scienceSubjects;
  const currentScores = activeStream === 'social' ? socialScores : scienceScores;
  const setCurrentScores = activeStream === 'social' ? setSocialScores : setScienceScores;

  const totalScore = Object.values(currentScores).reduce((acc, curr) => acc + Number(curr || 0), 0);
  const maxPossible = currentSubjects.reduce((acc, curr) => acc + curr.max, 0); // 525 max
  const passThreshold = 262.5; // 50% of 525
  const percentage = Math.round((totalScore / maxPossible) * 100);

  // Official MoEYS Grade Rules
  const getMoEYSGrade = (pct) => {
    if (pct >= 85) return { grade: 'A', textKm: 'និទ្ទេស A (ឆ្នើម)', textEn: 'Grade A (Excellent)', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', badge: 'bg-emerald-600 text-white', status: 'ជាប់កិត្តិយស (Honors)' };
    if (pct >= 75) return { grade: 'B', textKm: 'និទ្ទេស B (ល្អណាស់)', textEn: 'Grade B (Very Good)', color: 'text-sky-700', bg: 'bg-sky-50 border-sky-200', badge: 'bg-sky-600 text-white', status: 'ជាប់ល្អណាស់ (Very Good)' };
    if (pct >= 65) return { grade: 'C', textKm: 'និទ្ទេស C (ល្អ)', textEn: 'Grade C (Good)', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', badge: 'bg-blue-600 text-white', status: 'ជាប់កម្រិតល្អ (Good)' };
    if (pct >= 55) return { grade: 'D', textKm: 'និទ្ទេស D (ល្អបង្គួរ)', textEn: 'Grade D (Fair)', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', badge: 'bg-amber-600 text-white', status: 'ជាប់ល្អបង្គួរ (Fair)' };
    if (pct >= 50) return { grade: 'E', textKm: 'និទ្ទេស E (មធ្យម)', textEn: 'Grade E (Passing)', color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', badge: 'bg-orange-600 text-white', status: 'ជាប់មធ្យម (Passing)' };
    return { grade: 'F', textKm: 'និទ្ទេស F (ធ្លាក់)', textEn: 'Grade F (Failed)', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200', badge: 'bg-rose-600 text-white', status: 'មិនទាន់ជាប់ (Failed)' };
  };

  const currentGradeResult = getMoEYSGrade(percentage);

  // Quick preset scores for active stream
  const applyPresetScore = (type) => {
    if (activeStream === 'social') {
      if (type === 'gradeA') {
        setSocialScores({ khmer: 118, math: 68, history: 68, geography: 68, civics: 68, earth: 45, english: 48 });
      } else if (type === 'gradeB') {
        setSocialScores({ khmer: 98, math: 58, history: 58, geography: 58, civics: 58, earth: 38, english: 40 });
      } else if (type === 'pass') {
        setSocialScores({ khmer: 65, math: 40, history: 40, geography: 40, civics: 40, earth: 25, english: 25 });
      }
    } else {
      if (type === 'gradeA') {
        setScienceScores({ math: 118, khmer: 68, physics: 68, chemistry: 68, biology: 68, history: 45, english: 48 });
      } else if (type === 'gradeB') {
        setScienceScores({ math: 98, khmer: 58, physics: 58, chemistry: 58, biology: 58, history: 38, english: 40 });
      } else if (type === 'pass') {
        setScienceScores({ math: 65, khmer: 40, physics: 40, chemistry: 40, biology: 40, history: 25, english: 25 });
      }
    }
  };

  // Clean Executive Academic Badges & Credentials (0 Emojis, 100% Professional)
  const richBadges = [
    {
      id: "b1",
      category: "National Exam",
      titleKm: "មេដាយមាសអង្គរ",
      titleEn: "Angkor Gold Medal",
      desc: "លទ្ធផលឆ្នើមលើការប្រឡងតេស្តសមត្ថភាពបាក់ឌុបថ្នាក់ជាតិ",
      icon: Award,
      bgTint: "bg-amber-500/10 text-amber-600 border-amber-300/40",
      date: "2026-08-01",
      xp: "+500 XP"
    },
    {
      id: "b2",
      category: "Mathematics",
      titleKm: "កំពូលគណិតវិទ្យា",
      titleEn: "Mathematics Laureate",
      desc: "ដោះស្រាយលំហាត់លីមីត ដេរីវេ និងកុំផ្លិចបានត្រឹមត្រូវ ១០០%",
      icon: Calculator,
      bgTint: "bg-sky-500/10 text-sky-600 border-sky-300/40",
      date: "2026-08-05",
      xp: "+350 XP"
    },
    {
      id: "b3",
      category: "BacII Candidate",
      titleKm: "វីរជនបាក់ឌុប",
      titleEn: "BacII Top Honor",
      desc: "ឆ្លងកាត់ការប្រឡងសាកល្បងដោយជោគជ័យនិទ្ទេស A",
      icon: ShieldCheck,
      bgTint: "bg-emerald-500/10 text-emerald-600 border-emerald-300/40",
      date: "2026-08-12",
      xp: "+400 XP"
    },
    {
      id: "b4",
      category: "Physics & Lab",
      titleKm: "អ្នកស្រាវជ្រាវរូបវិទ្យា",
      titleEn: "Physics Lab Olympian",
      desc: "បញ្ចប់ការពិសោធន៍ច្បាប់ញូតុន និងលំយោលក្នុង Virtual Lab",
      icon: Microscope,
      bgTint: "bg-teal-500/10 text-teal-600 border-teal-300/40",
      date: "2026-08-14",
      xp: "+300 XP"
    },
    {
      id: "b5",
      category: "Literature",
      titleKm: "កវីអក្សរសាស្ត្រខ្មែរ",
      titleEn: "Khmer Literature Laureate",
      desc: "សរសេរតែងសេចក្តីបែបពន្យល់ និងពិភាក្សាបានពិន្ទុឆ្នើម",
      icon: BookOpen,
      bgTint: "bg-purple-500/10 text-purple-600 border-purple-300/40",
      date: "2026-08-15",
      xp: "+300 XP"
    },
    {
      id: "b6",
      category: "STEM & Tech",
      titleKm: "អ្នកសរសេរកូដ STEM",
      titleEn: "STEM Automation Scholar",
      desc: "អនុវត្តកូដដោះស្រាយសមីការ និងប្រព័ន្ធស្វ័យប្រវត្តិកម្មវិទ្យាសាស្ត្រ",
      icon: Code,
      bgTint: "bg-indigo-500/10 text-indigo-600 border-indigo-300/40",
      date: "2026-08-15",
      xp: "+450 XP"
    }
  ];

  return (
    <div className="space-y-6 font-kantumruy p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto pb-20">
      
      {/* Anime Avatar Generator Modal */}
      <AnimeAvatarGeneratorModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
      />

      {/* Cyberpunk & Glowing Tech Edit Profile Modal */}
      {isEditingProfile && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="bg-[#0e131f] rounded-2xl border border-slate-700/80 shadow-[0_0_50px_rgba(0,0,0,0.85)] max-w-md w-full my-auto max-h-[92vh] flex flex-col overflow-hidden font-kantumruy">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-[#001f3f] via-[#002b5b] to-[#0e131f] border-b border-slate-800/90 text-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#ff1867]/20 border border-[#ff1867]/40 flex items-center justify-center shadow-[0_0_15px_rgba(255,24,103,0.35)]">
                  <Edit3 className="w-4 h-4 text-[#ff1867]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">កែប្រែព័ត៌មានសិស្ស (Edit Profile)</h3>
                  <p className="text-[11px] text-slate-400">បំពេញព័ត៌មានផ្ទាល់ខ្លួនរបស់អ្នក</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-4 bg-[#0b0f19] overflow-y-auto flex-1">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff1867] shadow-[0_0_6px_#ff1867]"></span>
                  ឈ្មោះសិស្ស (Student Name):
                </label>
                <label className="ds-label">
                  <span>
                    <input
                      type="text"
                      required
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="ឧ. សុខ វិបុល..."
                      className="ds_textinput"
                    />
                    <div className="ds-input-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20px"
                        height="20px"
                        viewBox="0 0 38 38"
                      >
                        <g id="surface1">
                          <path
                            fill="currentColor"
                            d="M 18.933594 21.539062 C 19.546875 21.535156 20.15625 21.527344 20.789062 21.519531 C 28.1875 21.507812 28.1875 21.507812 31.039062 23.980469 C 33.105469 26.402344 33.390625 27.890625 33.316406 30.972656 C 33.3125 31.34375 33.304688 31.714844 33.300781 32.097656 C 33.289062 33.007812 33.269531 33.921875 33.25 34.832031 C 31.269531 35.425781 31.269531 35.425781 30.082031 34.832031 C 29.761719 33.097656 29.578125 31.363281 29.375 29.609375 C 29 27.839844 28.894531 27.398438 27.445312 26.390625 C 25.679688 26.144531 25.679688 26.144531 23.652344 26.179688 C 23.28125 26.175781 22.914062 26.175781 22.535156 26.175781 C 21.753906 26.171875 20.976562 26.175781 20.195312 26.183594 C 19.003906 26.191406 17.8125 26.183594 16.621094 26.171875 C 15.863281 26.171875 15.105469 26.175781 14.347656 26.179688 C 13.660156 26.179688 12.96875 26.183594 12.261719 26.183594 C 10.585938 26.25 10.585938 26.25 9.550781 27.089844 C 8.640625 28.476562 8.554688 29.871094 8.34375 31.5 C 8.261719 32.125 8.179688 32.746094 8.09375 33.386719 C 8.035156 33.863281 7.976562 34.34375 7.917969 34.832031 C 5.9375 35.425781 5.9375 35.425781 4.75 34.832031 C 4.691406 33.578125 4.652344 32.328125 4.617188 31.074219 C 4.601562 30.722656 4.582031 30.371094 4.566406 30.007812 C 4.511719 27.296875 5.164062 25.832031 6.859375 23.75 C 10.457031 21.074219 14.648438 21.542969 18.933594 21.539062 Z"
                          />
                          <path
                            fill="currentColor"
                            d="M 24.773438 4.980469 C 26.601562 7.253906 27.25 8.6875 27.445312 11.609375 C 26.9375 14.550781 26.007812 16.015625 23.75 17.945312 C 21.28125 19.589844 18.722656 19.308594 15.832031 19 C 13.457031 17.875 12.148438 16.65625 11.082031 14.25 C 10.414062 11.46875 10.53125 9.515625 11.609375 6.859375 C 15.328125 2.574219 20.128906 1.125 24.773438 4.980469 Z"
                          />
                        </g>
                      </svg>
                    </div>
                  </span>
                  <i></i>
                </label>
              </div>

              {/* School Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] shadow-[0_0_6px_#00f0ff]"></span>
                  គ្រឹះស្ថានសិក្សា / វិទ្យាល័យ (High School):
                </label>
                <label className="ds-label ds-cyan">
                  <span>
                    <input
                      type="text"
                      value={editSchool}
                      onChange={(e) => setEditSchool(e.target.value)}
                      placeholder="ឧ. វិទ្យាល័យអន្តរជាតិកម្ពុជា..."
                      className="ds_textinput"
                    />
                    <div className="ds-input-icon">
                      <School className="w-5 h-5" />
                    </div>
                  </span>
                  <i></i>
                </label>
              </div>

              {/* Grade & Stream */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff1867] shadow-[0_0_6px_#ff1867]"></span>
                    កម្រិតថ្នាក់ (Grade):
                  </label>
                  <label className="ds-label">
                    <span>
                      <select
                        value={editGrade}
                        onChange={(e) => setEditGrade(e.target.value)}
                        className="ds_select"
                      >
                        <option value="10">ថ្នាក់ទី ១០ (Grade 10)</option>
                        <option value="11">ថ្នាក់ទី ១១ (Grade 11)</option>
                        <option value="12">ថ្នាក់ទី ១២ (Grade 12)</option>
                      </select>
                      <div className="ds-input-icon">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                    </span>
                    <i></i>
                  </label>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] shadow-[0_0_6px_#00f0ff]"></span>
                    ផ្នែកជំនាញ (Stream):
                  </label>
                  <label className="ds-label ds-cyan">
                    <span>
                      <select
                        value={editStream}
                        onChange={(e) => setEditStream(e.target.value)}
                        className="ds_select"
                      >
                        <option value="science">វិទ្យាសាស្ត្រពិត (Science)</option>
                        <option value="social">វិទ្យាសាស្ត្រសង្គម (Social)</option>
                      </select>
                      <div className="ds-input-icon">
                        <Sparkles className="w-5 h-5" />
                      </div>
                    </span>
                    <i></i>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/90">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer border border-slate-700/60"
                >
                  បោះបង់ (Cancel)
                </button>
                <button
                  type="submit"
                  className="relative px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff1867] to-[#d90368] hover:from-[#ff2e7a] hover:to-[#eb0573] text-white text-xs font-bold transition-all shadow-[0_0_20px_rgba(255,24,103,0.4)] hover:shadow-[0_0_30px_rgba(255,24,103,0.7)] flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>រក្សាទុក (Save)</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Ultra-Luxurious Royal Digital Student ID Card Modal with Save Image */}
      <DigitalStudentIdModal 
        student={student} 
        isOpen={showIdCardModal} 
        onClose={() => setShowIdCardModal(false)} 
      />

      {/* 🌟 ULTRA-CLEAN & MODERN PROFESSIONAL PROFILE CARD */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-6">
        
        {/* Top Profile Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          
          {/* Avatar & Student Information */}
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5 text-center sm:text-left">
            
            {/* Clean Circular Avatar with Animated Frame & Level Badge */}
            <div 
              onClick={() => setIsAvatarModalOpen(true)}
              className="relative cursor-pointer group flex-shrink-0 select-none w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center"
              title="ចុចដើម្បីប្តូររូបតំណាង Anime & ស៊ុមចលនា (Avatar & Frame Studio)"
            >
              <div className={`w-[80%] h-[80%] rounded-full overflow-hidden shadow-md bg-slate-900 relative flex items-center justify-center ${(student.avatarFrame || student.avatar_frame) ? '' : 'border-2 border-slate-200 group-hover:border-[#005baa]'}`}>
                <img 
                  src={api.formatAvatarUrl(student.avatar)} 
                  alt="Student Avatar" 
                  className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    if (!e.currentTarget.src.includes('boy_1.png')) {
                      e.currentTarget.src = '/assets/anime/boys/boy_1.png';
                    }
                  }}
                />

                {/* Edit overlay icon on hover */}
                <div className="absolute inset-0 bg-slate-950/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white z-10">
                  <Camera className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Animated Avatar Frame (100% Inset-0) */}
              {(student.avatarFrame || student.avatar_frame) && (
                <img 
                  src={student.avatarFrame || student.avatar_frame} 
                  alt="Animated Frame" 
                  className="absolute inset-0 w-full h-full pointer-events-none object-contain scale-125 z-15 select-none filter drop-shadow-sm" 
                  onError={(e) => {
                    const current = e.currentTarget.src;
                    if (current.endsWith('.png')) e.currentTarget.src = current.replace('.png', '.webp');
                    else if (current.endsWith('.webp')) e.currentTarget.src = current.replace('.webp', '.png');
                  }}
                />
              )}

              {/* Clean Level Badge */}
              <div className="absolute bottom-0 right-0 px-2.5 py-0.5 rounded-full bg-[#002b5b] text-amber-300 font-black text-[10px] shadow border-2 border-white font-mono z-20">
                Lv.{student.level}
              </div>
            </div>

            {/* Student Identity Information */}
            <div className="space-y-1.5">
              
              {/* Badges line */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="bg-amber-50 text-amber-900 border border-amber-200 font-black px-3 py-0.5 rounded-full text-xs inline-flex items-center gap-1.5 shadow-2xs">
                  <Crown className="w-3.5 h-3.5 text-amber-600" />
                  <span>{student.rankTitleKm}</span>
                </span>

                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-3 py-0.5 rounded-full text-[11px] flex items-center gap-1.5 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{lang === 'km' ? 'សកម្មក្នុងប្រព័ន្ធ (Online)' : 'Online & Active'}</span>
                </span>
              </div>

              {/* Student Full Name */}
              <div className="flex items-center justify-center sm:justify-start gap-2 group">
                <h1 
                  onClick={() => {
                    setEditName(student.name);
                    setEditSchool(student.school);
                    setIsEditingProfile(true);
                  }}
                  className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight cursor-pointer hover:text-[#005baa] transition-colors flex items-center gap-2"
                  title={lang === 'km' ? 'ចុចដើម្បីកែប្រែឈ្មោះ' : 'Click to edit profile'}
                >
                  <span>{student.name}</span>
                  <Edit3 className="w-4 h-4 text-slate-400 group-hover:text-[#005baa] transition-colors" />
                </h1>
              </div>

              {/* School & Grade subtitle */}
              <p className="text-xs text-slate-500 flex flex-wrap items-center justify-center sm:justify-start gap-1.5 font-medium">
                <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="font-bold text-slate-700">{student.school}</span>
                <span className="text-slate-300">•</span>
                <span className="font-bold text-[#005baa]">
                  {lang === 'km' ? `ថ្នាក់ទី ${student.grade || '១២'} (${student.stream === 'social' ? 'វិទ្យាសាស្ត្រសង្គម' : 'វិទ្យាសាស្ត្រពិត'})` : `Grade ${student.grade || '12'} (${student.stream === 'social' ? 'Social Stream' : 'Science Stream'})`}
                </span>
              </p>

            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            
            {/* Hidden Custom Profile Picture File Input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              className="hidden" 
              onChange={handleCustomPFUpload} 
            />

            {/* Upload Custom PF Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingPF}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
              title={lang === 'km' ? 'បញ្ចូលរូបថតផ្ទាល់ខ្លួនពីឧបករណ៍ (Upload your own Photo / PF)' : 'Upload custom avatar image'}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>{isUploadingPF ? (lang === 'km' ? 'កំពុងបញ្ចូលរូប...' : 'Uploading...') : (lang === 'km' ? 'បញ្ចូលរូបផ្ទាល់ខ្លួន' : 'Upload Photo')}</span>
            </button>

            <button
              onClick={() => setIsAvatarModalOpen(true)}
              className="px-3.5 py-2 rounded-2xl bg-[#005baa] hover:bg-[#004280] text-white text-xs font-black transition-all shadow-xs hover:shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>{lang === 'km' ? 'ប្តូររូប Anime & ស៊ុម' : 'Avatar Studio'}</span>
            </button>

            <button
              onClick={() => {
                setEditName(student.name);
                setEditSchool(student.school);
                setIsEditingProfile(true);
              }}
              className="px-3.5 py-2 rounded-2xl bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-2xs hover:border-[#005baa] flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>{lang === 'km' ? 'កែប្រែព័ត៌មាន' : 'Edit Info'}</span>
            </button>

            <button
              onClick={() => setShowIdCardModal(true)}
              className="px-3.5 py-2 rounded-2xl bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-2xs hover:border-sky-500 flex items-center gap-1.5 cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>{lang === 'km' ? 'ប័ណ្ណសិស្ស (Digital ID)' : 'Student ID Card'}</span>
            </button>

            {/* 🚪 Prominent Profile Sign Out Button */}
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2 rounded-2xl bg-rose-50 hover:bg-rose-600 dark:bg-rose-950/40 dark:hover:bg-rose-600 text-rose-600 dark:text-rose-400 hover:text-white dark:hover:text-white border border-rose-200 dark:border-rose-800/60 hover:border-rose-600 text-xs font-black transition-all shadow-2xs hover:shadow-md flex items-center gap-1.5 cursor-pointer group active:scale-95"
              title={lang === 'km' ? 'ចាកចេញពីគណនី (Sign Out / Logout)' : 'Sign Out'}
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 group-hover:text-white transition-colors" />
              <span>{lang === 'km' ? 'ចាកចេញ' : 'Sign Out'}</span>
            </button>
          </div>

        </div>

        {/* Ultra-Premium Hextech Metric Cards */}
        <HextechMetricCards 
          student={student} 
          currentGradeResult={currentGradeResult} 
          percentage={percentage} 
        />

      </div>

      {/* SECTION 2: PROFESSIONAL ACHIEVEMENTS & CREDENTIALS */}
      <div className="bg-white p-6 sm:p-7 space-y-5 rounded-3xl border border-slate-200/90 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#002b5b] text-amber-400 flex items-center justify-center shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <span>{lang === 'km' ? 'មេដាយកិត្តិយស និងសមិទ្ធផលសិក្សា' : 'Honors, Badges & Certifications'}</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {lang === 'km' ? 'វិញ្ញាបនបត្រ និងសមិទ្ធផលដែលសិស្សសម្រេចបានតាមរយៈការរៀនសូត្រ ការធ្វើតេស្ត និងការពិសោធន៍' : 'Official milestones and credentials awarded through lessons, quizzes, and labs.'}
              </p>
            </div>
          </div>

          <span className="bg-slate-50 text-slate-700 font-black text-xs px-3.5 py-1.5 rounded-full border border-slate-200/80 self-start sm:self-auto flex items-center gap-1.5 font-mono">
            <BadgeCheck className="w-4 h-4 text-emerald-600" />
            <span>{richBadges.length} {lang === 'km' ? 'វិញ្ញាបនបត្រផ្លូវការ' : 'Credentials'}</span>
          </span>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {richBadges.map((b) => {
            const BadgeIcon = b.icon;
            return (
              <div 
                key={b.id} 
                className="bg-white hover:bg-slate-50/60 p-2.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header: Category Tag & XP Reward */}
                  <div className="flex items-center justify-between gap-1 mb-2 sm:mb-3">
                    <span className="text-[8.5px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono truncate">
                      {b.category}
                    </span>
                    <span className="text-[8.5px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-mono flex-shrink-0">
                      {b.xp}
                    </span>
                  </div>

                  {/* Icon Squircle & Titles */}
                  <div className="flex items-start gap-2 sm:gap-3.5 mb-1.5 sm:mb-2.5">
                    <div className={`w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 border shadow-2xs group-hover:scale-105 transition-transform ${b.bgTint}`}>
                      <BadgeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                        {b.titleKm}
                      </h4>
                      <p className="text-[9.5px] sm:text-[11px] font-medium text-slate-400 font-mono truncate">
                        {b.titleEn}
                      </p>
                    </div>
                  </div>

                  {/* Description (Desktop only to keep 2-column mobile card compact) */}
                  <p className="hidden sm:block text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {b.desc}
                  </p>
                </div>

                {/* Bottom Verification & Issue Date */}
                <div className="flex items-center justify-between text-[9.5px] sm:text-[11px] pt-2 sm:pt-3.5 mt-2 sm:mt-3.5 border-t border-slate-100 text-slate-400">
                  <span className="font-mono text-[8.5px] sm:text-[10px] truncate">{b.date}</span>
                  <span className="text-emerald-700 font-bold text-[8.5px] sm:text-[10px] flex items-center gap-0.5 sm:gap-1 bg-emerald-50 px-1.5 sm:px-2 py-0.5 rounded-full border border-emerald-200/60 flex-shrink-0">
                    <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600" />
                    <span>Verified</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: MoEYS OFFICIAL BACII DUAL-STREAM SIMULATOR (2-Column Executive Bento Grid) */}
      <div className="bg-white p-6 sm:p-7 space-y-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#002b5b] text-amber-400 flex items-center justify-center shadow-xs">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                ម៉ាស៊ីនគណនានិទ្ទេសបាក់ឌុបជាតិ (Official BacII Simulator)
              </h3>
              <p className="text-xs text-slate-500">
                គណនាតាមរូបមន្តមេគុណផ្លូវការថ្នាក់ជាតិ សម្រាប់ថ្នាក់វិទ្យាសាស្ត្រពិត និងសង្គម
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <span className="text-[11px] font-bold text-slate-500 hidden md:inline">
              កម្រិតគំរូ៖
            </span>
            <button
              type="button"
              onClick={() => applyPresetScore('gradeA')}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200 transition-colors shadow-2xs cursor-pointer"
            >
              និទ្ទេស A (≥85%)
            </button>
            <button
              type="button"
              onClick={() => applyPresetScore('gradeB')}
              className="px-2.5 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 text-[11px] font-bold border border-sky-200 transition-colors shadow-2xs cursor-pointer"
            >
              និទ្ទេស B (≥75%)
            </button>
            <button
              type="button"
              onClick={() => applyPresetScore('pass')}
              className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-200 transition-colors shadow-2xs cursor-pointer"
            >
              ជាប់មធ្យម (≥50%)
            </button>
          </div>
        </div>

        {/* 🌟 2-COLUMN EXECUTIVE BENTO GRID (Left: 7 Subject Controllers | Right: Live National Forecast Report) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT 7 COLUMNS: Stream Switcher & 7 Interactive Subject Sliders */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Stream Switcher Tabs */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-100/90 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveStream('science')}
                className={`flex-1 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeStream === 'science'
                    ? 'bg-[#005baa] text-white shadow-sm'
                    : 'bg-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800'
                }`}
              >
                <Microscope className="w-4 h-4" />
                <span>ថ្នាក់វិទ្យាសាស្ត្រពិត (Science)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveStream('social')}
                className={`flex-1 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeStream === 'social'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>ថ្នាក់វិទ្យាសាស្ត្រសង្គម (Social)</span>
              </button>
            </div>

            {/* 7 Subjects in Clean Balanced 2-Column Grid (2-Columns on Mobile!) */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 text-xs">
              {currentSubjects.map((sub) => {
                const val = currentScores[sub.key] ?? 0;
                const isPassing = val >= sub.pass;
                return (
                  <div 
                    key={sub.key} 
                    className="bg-white dark:bg-[#0f172a] p-2.5 sm:p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs transition-all space-y-1.5 sm:space-y-2.5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-slate-800 dark:text-slate-100 font-bold font-khmer text-[10.5px] sm:text-xs truncate">
                          {sub.nameKm} <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 font-mono">(/{sub.max})</span>
                        </span>
                        <span className={`font-black text-xs sm:text-sm font-cinzel bg-slate-50 dark:bg-slate-900 px-1.5 sm:px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 ${sub.textClass} flex-shrink-0`}>
                          {val}
                        </span>
                      </div>

                      <input 
                        type="range" 
                        min="0" 
                        max={sub.max} 
                        value={val}
                        onChange={(e) => setCurrentScores({ ...currentScores, [sub.key]: Number(e.target.value) })}
                        className={`w-full ${sub.accent} cursor-pointer h-1.5 sm:h-2`}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[8.5px] sm:text-[10px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800/80 pt-1 sm:pt-1.5 font-mono">
                      <span>0 pt</span>
                      <span className={`font-bold ${isPassing ? 'text-emerald-500' : 'text-rose-500'}`}>
                        ≥ {sub.pass}
                      </span>
                      <span>{sub.max} pts</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* RIGHT 5 COLUMNS: Live Official MoEYS BacII National Forecast Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#02132e] via-[#041d47] to-[#010a17] text-white rounded-3xl p-6 border-2 border-amber-400/40 shadow-xl space-y-5 relative overflow-hidden select-none">
            
            {/* Watermark Ambient Sheen */}
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-[#005baa]/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-12 -top-12 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Certificate Top Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-amber-400/20 pb-3">
              <div className="flex items-center gap-2.5">
                <img 
                  src="/assets/moeys-crest-transparent.png" 
                  alt="Official Ministry Crest" 
                  className="w-8 h-8 object-contain filter drop-shadow" 
                />
                <div>
                  <div className="text-[9px] font-bold text-amber-300 uppercase tracking-widest leading-none">
                    MOTDAR OFFICIAL FORECAST
                  </div>
                  <div className="text-xs font-bold text-white mt-0.5">
                    លទ្ធផលព្យាករណ៍បាក់ឌុបជាតិ
                  </div>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-[9px] font-bold text-amber-300 font-mono uppercase">
                {activeStream === 'social' ? 'Social Track' : 'Science Track'}
              </span>
            </div>

            {/* Main Score & Grade Radial Display */}
            <div className="relative z-10 flex items-center justify-between gap-4 bg-black/30 p-4 rounded-2xl border border-white/10">
              <div>
                <div className="text-[10px] text-slate-300 uppercase font-mono tracking-wider">
                  {currentGradeResult.status}
                </div>
                <h4 className="text-xl font-black text-amber-300 font-kantumruy leading-tight mt-0.5">
                  {currentGradeResult.textKm}
                </h4>
                <p className="text-xs text-slate-300 font-mono mt-1">
                  {totalScore} / {maxPossible} ពិន្ទុសរុប
                </p>
              </div>

              {/* Large Grade Box */}
              <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center shadow-lg border border-white/20 ${currentGradeResult.badge} font-mono flex-shrink-0`}>
                <span className="text-2xl font-black">{currentGradeResult.grade}</span>
                <span className="text-[10px] font-bold opacity-90">{percentage}%</span>
              </div>
            </div>

            {/* National Exam Progress Meter */}
            <div className="relative z-10 space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-300">ពិន្ទុជាប់អប្បបរមា (Pass Threshold):</span>
                <b className="text-amber-300">≥ {passThreshold} pts (50%)</b>
              </div>
              
              <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-700 overflow-hidden relative p-[1px]">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    percentage >= 85 
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-300' 
                      : percentage >= 50 
                        ? 'bg-gradient-to-r from-sky-400 to-blue-300' 
                        : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>

            {/* Qualification Highlights */}
            <div className="relative z-10 space-y-2 pt-2 border-t border-amber-400/20 text-xs">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>
                  {totalScore >= passThreshold ? 'មានសិទ្ធិចូលរៀនគ្រប់សាកលវិទ្យាល័យរដ្ឋ' : 'មិនទាន់គ្រប់លក្ខខណ្ឌជាប់បាក់ឌុប'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-300 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>អាហារូបករណ៍៖ {percentage >= 85 ? '១០០% (Full Scholarship)' : percentage >= 75 ? '៥០% (Partial)' : 'តាមលទ្ធផលប្រឡងផ្ទាល់'}</span>
              </div>

              {/* Generate Official Bac II Certificate Button */}
              <button
                type="button"
                onClick={() => setShowCertModal(true)}
                className="w-full mt-3 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-xs sm:text-sm cursor-pointer shadow-xl border-b-[4px] border-amber-600 active:border-b-0 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4 text-slate-950" />
                <span>ចេញសញ្ញាបត្របាក់ឌុបគំរូ (Print Bac II Certificate)</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Official MoEYS Bac II Certificate Modal */}
      <BacIICertificateModal
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
        student={student}
        gradeResult={currentGradeResult}
        totalScore={totalScore}
        maxPossible={maxPossible}
        percentage={percentage}
        stream={activeStream}
        scores={currentScores}
        subjects={currentSubjects}
      />

    </div>
  );
}

