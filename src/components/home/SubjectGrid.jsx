import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Atom, 
  FlaskConical, 
  BookOpen, 
  Landmark, 
  Code, 
  Dna, 
  Compass,
  Globe,
  Scale,
  Coins,
  Languages,
  PlayCircle, 
  Award, 
  ChevronRight, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Layers,
  Search,
  BookCheck,
  GraduationCap
} from 'lucide-react';
import { curriculumData } from '../../data/curriculumData';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

const iconMap = {
  Calculator,
  Atom,
  FlaskConical,
  BookOpen,
  Landmark,
  Code,
  Dna,
  Compass,
  Globe,
  Scale,
  Coins,
  Languages
};

export default function SubjectGrid({ onSelectSubject, showHeroBanner = true }) {
  const { t, lang } = useLanguage();
  const { selectedGrade: authGrade } = useAuth();
  
  const [filterStream, setFilterStream] = useState('all'); // 'all' | 'science' | 'social'
  const [filterGrade, setFilterGrade] = useState('all'); // 'all' | '10' | '11' | '12'
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubjects = useMemo(() => {
    return curriculumData.filter((item) => {
      let matchesGrade = true;
      if (filterGrade === 'all') {
        matchesGrade = true;
      } else if (filterGrade === 'primary' || filterGrade === '1-6') {
        matchesGrade = item.grade === '1-6' || (item.gradesList && item.gradesList.some(g => parseInt(g, 10) <= 6)) || (parseInt(item.grade, 10) <= 6);
      } else if (filterGrade === 'junior' || filterGrade === '7-9') {
        matchesGrade = item.grade === '7-9' || (item.gradesList && item.gradesList.some(g => parseInt(g, 10) >= 7 && parseInt(g, 10) <= 9)) || (parseInt(item.grade, 10) >= 7 && parseInt(item.grade, 10) <= 9);
      } else if (filterGrade === 'high' || filterGrade === '10-12') {
        matchesGrade = parseInt(item.grade, 10) >= 10 || item.grade === '10' || item.grade === '11' || item.grade === '12';
      } else {
        // Specific grade e.g. '1', '7', '12'
        const gNum = parseInt(filterGrade, 10);
        matchesGrade = item.grade === filterGrade || 
          (item.gradesList && item.gradesList.includes(filterGrade)) ||
          (gNum <= 6 && item.grade === '1-6') ||
          (gNum >= 7 && gNum <= 9 && item.grade === '7-9');
      }

      const matchesStream = filterStream === 'all' || item.stream === filterStream;
      const matchesSearch = searchQuery.trim() === '' || 
        item.nameKm.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.descriptionKm && item.descriptionKm.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesGrade && matchesStream && matchesSearch;
    });
  }, [filterGrade, filterStream, searchQuery]);

  const scienceSubjects = useMemo(() => filteredSubjects.filter(s => s.stream === 'science'), [filteredSubjects]);
  const socialSubjects = useMemo(() => filteredSubjects.filter(s => s.stream === 'social'), [filteredSubjects]);

  const totalScienceCount = curriculumData.filter(s => s.stream === 'science').length;
  const totalSocialCount = curriculumData.filter(s => s.stream === 'social').length;

  return (
    <div className="space-y-6 sm:space-y-8 font-kantumruy">
      
      {/* 🌟 GRAND FUTURISTIC CURRICULUM COMMAND CENTER HERO */}
      {showHeroBanner && (
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-[#001f3f] via-[#003875] to-[#005baa] border-2 border-amber-400/70 shadow-xl text-white">
          
          {/* Ambient Lighting Orbs */}
          <div className="absolute top-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-64 sm:w-80 h-64 sm:h-80 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          {/* Watermark Crest */}
          <div className="absolute right-2 sm:right-12 top-1/2 -translate-y-1/2 w-48 sm:w-80 h-48 sm:h-80 pointer-events-none select-none opacity-10 sm:opacity-15 mix-blend-screen z-0">
            <img
              src="/assets/moeys-crest-transparent.png"
              alt="National Emblem Watermark"
              className="w-full h-full object-contain filter brightness-125"
            />
          </div>

          <div className="relative z-10 p-3 sm:p-7 lg:p-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 sm:gap-8">
            
            {/* Left Content */}
            <div className="space-y-2.5 sm:space-y-4 max-w-2xl min-w-0">
              
              {/* Badges line */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full bg-amber-400 text-slate-950 font-black text-[9.5px] sm:text-xs uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 shadow-sm font-cinzel shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-950" />
                  <span>{lang === 'km' ? 'កម្មវិធីសិក្សាជាតិផ្លូវការ' : 'Official Curriculum'}</span>
                </span>
                
                <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/15 backdrop-blur-md text-blue-100 text-[9.5px] sm:text-xs font-bold border border-white/20 flex items-center gap-1 shrink-0">
                  <GraduationCap className="w-3 h-3 text-amber-300" />
                  <span>{lang === 'km' ? 'ថ្នាក់ទី ១ ដល់ ទី ១២' : 'Grades 1 to 12'}</span>
                </span>

                <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[9.5px] sm:text-xs font-bold flex items-center gap-1 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{lang === 'km' ? '១០០% ឥតគិតថ្លៃ' : '100% Free'}</span>
                </span>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1 sm:space-y-2">
                <h1 className="text-lg sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight">
                  {lang === 'km' ? 'កម្មវិធីសិក្សាចំណេះទូទៅ ថ្នាក់ទី ១-១២' : 'Cambodian National Curriculum (Grades 1–12)'}
                </h1>
                <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-medium line-clamp-2 sm:line-clamp-none max-w-xl">
                  {lang === 'km' 
                    ? 'ជ្រើសរើសកម្រិតថ្នាក់ពីថ្នាក់ទី ១ ដល់ ទី ១២ ដើម្បីចូលរៀនមេរៀនវីដេអូបង្រៀនគុណភាពខ្ពស់ កំណត់ចំណាំសង្ខេប សៀវភៅពុម្ព និងកម្រងសំណួរត្រៀមប្រឡងជាតិ។' 
                    : 'Access full video courses, chapter notes, digital textbooks, and mock quizzes tailored for Grades 1 through 12.'}
                </p>
              </div>

              {/* Quick Search Input */}
              <div className="relative w-full max-w-md pt-0.5">
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'km' ? 'ស្វែងរកមុខវិជ្ជា ឬសាស្ត្រាចារ្យ...' : 'Search subjects or teachers...'}
                  className="w-full pl-9 pr-7 sm:pl-10 sm:pr-8 py-2 rounded-xl sm:rounded-2xl bg-white/90 focus:bg-white text-slate-900 placeholder-slate-400 text-[11px] sm:text-xs font-bold shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

            </div>

            {/* Right Ministry Accreditation Card */}
            <div className="w-full lg:w-72 bg-slate-950/60 backdrop-blur-md rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 border border-white/20 space-y-2 sm:space-y-3 shadow-lg shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center p-1.5 border border-white/30 shadow-inner shrink-0">
                  <img
                    src="/assets/moeys-crest-transparent.png"
                    alt="MoTDAR Crest"
                    className="w-full h-full object-contain filter brightness-125 drop-shadow"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[11px] sm:text-xs font-black text-amber-300 font-cinzel tracking-wider uppercase truncate">
                    ក្រសួងអប់រំ យុវជន និងកីឡា
                  </h4>
                  <p className="text-[9.5px] sm:text-[11px] text-blue-200 font-medium truncate">
                    MoEYS National E-Learning Platform
                  </p>
                </div>
              </div>

              {/* Stats Highlights */}
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-white/5 rounded-xl p-1.5 sm:p-2 border border-white/10">
                  <span className="text-[8.5px] sm:text-[9px] text-slate-300 block font-kantumruy font-bold">{lang === 'km' ? 'វិទ្យាសាស្ត្រពិត' : 'Science'}</span>
                  <span className="text-xs sm:text-sm font-black text-sky-400">{totalScienceCount} Subjects</span>
                </div>
                <div className="bg-white/5 rounded-xl p-1.5 sm:p-2 border border-white/10">
                  <span className="text-[8.5px] sm:text-[9px] text-slate-300 block font-kantumruy font-bold">{lang === 'km' ? 'វិទ្យាសាស្ត្រសង្គម' : 'Social'}</span>
                  <span className="text-xs sm:text-sm font-black text-amber-400">{totalSocialCount} Subjects</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 🧭 UNIFIED FILTER BAR (Stream Switcher + Grade 1-12 Selector Ribbon) */}
      <div className="bg-white p-2.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-2.5 sm:space-y-3 overflow-hidden">
        
        {/* Top Row: Stream Switcher & Status */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 flex-wrap">
              <span className="bg-[#002b5b] text-amber-300 text-[8.5px] sm:text-[10px] font-black uppercase tracking-wider px-2 sm:px-2.5 py-0.5 rounded-full shadow-2xs font-mono">
                MoTDAR STANDARDS
              </span>
              <span className="text-[10px] sm:text-xs text-slate-500 font-bold truncate">
                • {filteredSubjects.length} {lang === 'km' ? 'មុខវិជ្ជាសរុប' : 'Subjects'} ({lang === 'km' ? 'វិទ្យាសាស្ត្រ' : 'Science'}: {scienceSubjects.length}, {lang === 'km' ? 'សង្គម' : 'Social'}: {socialSubjects.length})
              </span>
            </div>
            <h2 className="text-xs sm:text-lg font-black text-[#002b5b] tracking-tight">
              {lang === 'km' ? 'តារាងមុខវិជ្ជា និងមេរៀនតាមកម្រិតថ្នាក់' : 'Select Grade & Stream'}
            </h2>
          </div>

          {/* Right Stream Filter Pills (Smooth scrollable on mobile) */}
          <div className="flex items-center gap-1.5 sm:gap-2 font-kantumruy text-xs overflow-x-auto pb-1 sm:pb-0 scrollbar-none flex-nowrap w-full md:w-auto">
            <button
              onClick={() => setFilterStream('all')}
              className={`py-1.5 px-3 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl transition-all font-black flex items-center justify-center gap-1 text-[10.5px] sm:text-xs cursor-pointer active:scale-95 shrink-0 ${
                filterStream === 'all'
                  ? 'bg-gradient-to-r from-[#005baa] to-[#003875] text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">{lang === 'km' ? 'ទាំងអស់' : 'All'} ({curriculumData.length})</span>
            </button>
            
            <button
              onClick={() => setFilterStream('science')}
              className={`py-1.5 px-3 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl transition-all font-black flex items-center justify-center gap-1 text-[10.5px] sm:text-xs cursor-pointer active:scale-95 shrink-0 ${
                filterStream === 'science'
                  ? 'bg-gradient-to-r from-[#005baa] to-[#003875] text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <Atom className="w-3.5 h-3.5 text-sky-500 shrink-0" />
              <span className="whitespace-nowrap">{lang === 'km' ? 'វិទ្យាសាស្ត្រ' : 'Science'} ({totalScienceCount})</span>
            </button>
            
            <button
              onClick={() => setFilterStream('social')}
              className={`py-1.5 px-3 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl transition-all font-black flex items-center justify-center gap-1 text-[10.5px] sm:text-xs cursor-pointer active:scale-95 shrink-0 ${
                filterStream === 'social'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="whitespace-nowrap">{lang === 'km' ? 'សង្គម' : 'Social'} ({totalSocialCount})</span>
            </button>
          </div>
        </div>

        {/* Bottom Row: Comprehensive Grade 1-12 Selector Ribbon */}
        <div className="pt-2 sm:pt-2.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-2.5">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none flex-nowrap text-xs w-full sm:w-auto -mx-0.5 px-0.5">
            <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap mr-1 hidden lg:inline">
              កម្រិតថ្នាក់ (Grade):
            </span>

            {/* Level Tier Group Pills */}
            <button
              type="button"
              onClick={() => setFilterGrade('all')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                filterGrade === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              ទាំងអស់ (Grades 1–12)
            </button>

            <button
              type="button"
              onClick={() => setFilterGrade('primary')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                filterGrade === 'primary' || filterGrade === '1-6'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🎒 បឋម (ទី១-៦)
            </button>

            <button
              type="button"
              onClick={() => setFilterGrade('junior')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                filterGrade === 'junior' || filterGrade === '7-9'
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🏛️ អនុវិទ្យាល័យ (ទី៧-៩)
            </button>

            <button
              type="button"
              onClick={() => setFilterGrade('high')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                filterGrade === 'high' || filterGrade === '10-12'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🎓 វិទ្យាល័យ (ទី១០-១២)
            </button>
          </div>

          {/* Individual Grade Pills 1 to 12 */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none flex-nowrap">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setFilterGrade(g)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                  filterGrade === g
                    ? 'bg-indigo-600 text-white shadow-xs scale-105 ring-2 ring-indigo-400/40'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                title={`ថ្នាក់ទី ${g}`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* 1. Science Stream Section */}
      {(filterStream === 'all' || filterStream === 'science') && scienceSubjects.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-[#005baa] flex items-center justify-center font-bold flex-shrink-0 shadow-2xs">
                <Atom className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-base font-black text-[#002b5b] truncate">
                  {lang === 'km' ? 'ថ្នាក់វិទ្យាសាស្ត្រពិត (Science Stream)' : 'Science Stream'}
                </h3>
              </div>
            </div>
            <span className="text-[10.5px] sm:text-xs font-black text-[#005baa] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full font-mono whitespace-nowrap flex-shrink-0">
              {scienceSubjects.length} {lang === 'km' ? 'មុខវិជ្ជា' : 'Subjects'}
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-5 w-full">
            {scienceSubjects.map((sub) => {
              const Icon = iconMap[sub.icon] || BookOpen;
              return (
                <div
                  key={sub.id}
                  onClick={() => onSelectSubject(sub)}
                  className="group cursor-pointer flex flex-col justify-between p-2.5 sm:p-5 bg-white border border-slate-200/90 hover:border-[#005baa] hover:shadow-xl transition-all duration-300 rounded-xl sm:rounded-3xl relative overflow-hidden active:scale-[0.98] w-full min-w-0"
                >
                  <div className="relative z-10 space-y-1.5 sm:space-y-3">
                    
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-1.5">
                      <div 
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xs transition-transform duration-300 group-hover:scale-110 shrink-0"
                        style={{ backgroundColor: `${sub.color}15`, border: `1px solid ${sub.color}30` }}
                      >
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: sub.color }} />
                      </div>

                      <span className="text-[7px] sm:text-[9.5px] font-black uppercase tracking-wider px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-blue-50 text-[#005baa] border border-blue-200 font-mono">
                        {lang === 'km' ? 'វិទ្យាសាស្ត្រ' : 'Science'}
                      </span>
                    </div>

                    {/* Subject Title & Teacher */}
                    <div className="space-y-0.5 sm:space-y-1">
                      <h4 className="font-black text-xs sm:text-base text-[#002b5b] group-hover:text-[#005baa] transition-colors leading-tight line-clamp-2 sm:line-clamp-1">
                        {lang === 'km' ? sub.nameKm : sub.nameEn}
                      </h4>
                      <p className="text-[8px] sm:text-xs text-[#005baa] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600 flex-shrink-0" />
                        <span className="truncate">{lang === 'km' ? 'កម្មវិធីជាតិ MoTDAR' : 'National MoTDAR Standard'}</span>
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-[10px] sm:text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium hidden sm:block">
                      {lang === 'km' ? sub.descriptionKm : sub.descriptionEn}
                    </p>

                    {/* Chapter & Lesson Counters */}
                    <div className="grid grid-cols-3 gap-0.5 sm:gap-2 pt-0.5 sm:pt-1 text-slate-600 w-full">
                      <div className="bg-slate-50 p-1 sm:p-2 rounded-lg sm:rounded-2xl border border-slate-200/80 text-center overflow-hidden">
                        <span className="text-slate-400 block text-[8.5px] sm:text-[9.5px] font-bold">{lang === 'km' ? 'ជំពូក' : 'Chapters'}</span>
                        <span className="font-black text-xs sm:text-sm text-[#002b5b] font-cinzel">{sub.totalChapters}</span>
                      </div>
                      <div className="bg-slate-50 p-1 sm:p-2 rounded-lg sm:rounded-2xl border border-slate-200/80 text-center overflow-hidden">
                        <span className="text-slate-400 block text-[8.5px] sm:text-[9.5px] font-bold">{lang === 'km' ? 'មេរៀន' : 'Lessons'}</span>
                        <span className="font-black text-xs sm:text-sm text-[#002b5b] font-cinzel">{sub.totalLessons}</span>
                      </div>
                      <div className="bg-slate-50 p-1 sm:p-2 rounded-lg sm:rounded-2xl border border-slate-200/80 text-center overflow-hidden">
                        <span className="text-slate-400 block text-[8.5px] sm:text-[9.5px] font-bold">{lang === 'km' ? 'លំហាត់' : 'Quizzes'}</span>
                        <span className="font-black text-xs sm:text-sm text-amber-700 font-cinzel">{sub.quizzesCount}</span>
                      </div>
                    </div>

                  </div>

                  {/* Bottom Progress & Button */}
                  <div className="pt-2.5 sm:pt-4 border-t border-slate-100 mt-2.5 sm:mt-4 space-y-1.5 sm:space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[8px] sm:text-xs text-slate-500 font-bold">
                        <span>{lang === 'km' ? 'វឌ្ឍនភាព' : 'Progress'}</span>
                        <span className="font-black text-[#002b5b] font-cinzel">{sub.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 sm:h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#005baa] to-[#0284c7] rounded-full transition-all duration-500"
                          style={{ width: `${sub.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-0.5 sm:pt-1">
                      <span className="text-[9px] sm:text-xs font-black text-[#005baa] group-hover:translate-x-1 transition-transform flex items-center gap-0.5 sm:gap-1">
                        <span>{t('continueLesson') || (lang === 'km' ? 'ចូលរៀន' : 'Study Lesson')}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                      <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-blue-50 flex items-center justify-center text-[#005baa] group-hover:bg-[#005baa] group-hover:text-white transition-colors shadow-2xs">
                        <PlayCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Social Science Stream Section */}
      {(filterStream === 'all' || filterStream === 'social') && socialSubjects.length > 0 && (
        <div className="space-y-3 sm:space-y-4 pt-2 sm:pt-4">
          <div className="flex items-center justify-between bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold flex-shrink-0 shadow-2xs">
                <Landmark className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-base font-black text-[#854d0e] truncate">
                  {lang === 'km' ? 'ថ្នាក់វិទ្យាសាស្ត្រសង្គម (Social Stream)' : 'Social Sciences'}
                </h3>
              </div>
            </div>
            <span className="text-[10.5px] sm:text-xs font-black text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full font-mono whitespace-nowrap flex-shrink-0">
              {socialSubjects.length} {lang === 'km' ? 'មុខវិជ្ជា' : 'Subjects'}
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-5 w-full">
            {socialSubjects.map((sub) => {
              const Icon = iconMap[sub.icon] || BookOpen;
              return (
                <div
                  key={sub.id}
                  onClick={() => onSelectSubject(sub)}
                  className="group cursor-pointer flex flex-col justify-between p-2.5 sm:p-5 bg-white border border-slate-200/90 hover:border-amber-500 hover:shadow-xl transition-all duration-300 rounded-xl sm:rounded-3xl relative overflow-hidden active:scale-[0.98] w-full min-w-0"
                >
                  <div className="relative z-10 space-y-1.5 sm:space-y-3">
                    
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-1.5">
                      <div 
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xs transition-transform duration-300 group-hover:scale-110 shrink-0"
                        style={{ backgroundColor: `${sub.color}15`, border: `1px solid ${sub.color}30` }}
                      >
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: sub.color }} />
                      </div>

                      <span className="text-[7px] sm:text-[9.5px] font-black uppercase tracking-wider px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-mono">
                        {lang === 'km' ? 'សង្គម' : 'Social'}
                      </span>
                    </div>

                    {/* Subject Title & Teacher */}
                    <div className="space-y-0.5 sm:space-y-1">
                      <h4 className="font-black text-xs sm:text-base text-[#002b5b] group-hover:text-[#ca8a04] transition-colors leading-tight line-clamp-2 sm:line-clamp-1">
                        {lang === 'km' ? sub.nameKm : sub.nameEn}
                      </h4>
                      <p className="text-[8px] sm:text-xs text-[#ca8a04] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-600 flex-shrink-0" />
                        <span className="truncate">{lang === 'km' ? 'កម្មវិធីជាតិ MoTDAR' : 'National MoTDAR Standard'}</span>
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-[10px] sm:text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium hidden sm:block">
                      {lang === 'km' ? sub.descriptionKm : sub.descriptionEn}
                    </p>

                    {/* Chapter & Lesson Counters */}
                    <div className="grid grid-cols-3 gap-0.5 sm:gap-2 pt-0.5 sm:pt-1 text-slate-600 w-full">
                      <div className="bg-slate-50 p-1 sm:p-2 rounded-lg sm:rounded-2xl border border-slate-200/80 text-center overflow-hidden">
                        <span className="text-slate-400 block text-[8.5px] sm:text-[9.5px] font-bold">{lang === 'km' ? 'ជំពូក' : 'Chapters'}</span>
                        <span className="font-black text-xs sm:text-sm text-[#002b5b] font-cinzel">{sub.totalChapters}</span>
                      </div>
                      <div className="bg-slate-50 p-1 sm:p-2 rounded-lg sm:rounded-2xl border border-slate-200/80 text-center overflow-hidden">
                        <span className="text-slate-400 block text-[8.5px] sm:text-[9.5px] font-bold">{lang === 'km' ? 'មេរៀន' : 'Lessons'}</span>
                        <span className="font-black text-xs sm:text-sm text-[#002b5b] font-cinzel">{sub.totalLessons}</span>
                      </div>
                      <div className="bg-slate-50 p-1 sm:p-2 rounded-lg sm:rounded-2xl border border-slate-200/80 text-center overflow-hidden">
                        <span className="text-slate-400 block text-[8.5px] sm:text-[9.5px] font-bold">{lang === 'km' ? 'លំហាត់' : 'Quizzes'}</span>
                        <span className="font-black text-xs sm:text-sm text-amber-700 font-cinzel">{sub.quizzesCount}</span>
                      </div>
                    </div>

                  </div>

                  {/* Bottom Progress & Button */}
                  <div className="pt-2.5 sm:pt-4 border-t border-slate-100 mt-2.5 sm:mt-4 space-y-1.5 sm:space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] sm:text-xs text-slate-500 font-bold">
                        <span>{lang === 'km' ? 'វឌ្ឍនភាព' : 'Progress'}</span>
                        <span className="font-black text-[#ca8a04] font-cinzel">{sub.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 sm:h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#ca8a04] to-[#eab308] rounded-full transition-all duration-500"
                          style={{ width: `${sub.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-0.5 sm:pt-1">
                      <span className="text-[9px] sm:text-xs font-black text-[#ca8a04] group-hover:translate-x-1 transition-transform flex items-center gap-0.5 sm:gap-1">
                        <span>{t('continueLesson') || (lang === 'km' ? 'ចូលរៀន' : 'Study Lesson')}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                      <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-amber-50 flex items-center justify-center text-[#ca8a04] group-hover:bg-[#ca8a04] group-hover:text-white transition-colors shadow-2xs">
                        <PlayCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No results fallback */}
      {filteredSubjects.length === 0 && (
        <div className="p-8 sm:p-12 text-center bg-white rounded-2xl sm:rounded-3xl border border-slate-200 space-y-3">
          <BookCheck className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto" />
          <h4 className="text-sm sm:text-base font-black text-slate-700">
            {lang === 'km' ? 'មិនមានមុខវិជ្ជាត្រូវគ្នានឹងការស្វែងរកទេ' : 'No subjects match your query'}
          </h4>
          <button
            onClick={() => { setFilterStream('all'); setSearchQuery(''); }}
            className="px-4 py-2 rounded-xl bg-[#005baa] text-white text-xs font-bold"
          >
            {lang === 'km' ? 'បង្ហាញទាំងអស់ឡើងវិញ' : 'Reset Filters'}
          </button>
        </div>
      )}

    </div>
  );
}
