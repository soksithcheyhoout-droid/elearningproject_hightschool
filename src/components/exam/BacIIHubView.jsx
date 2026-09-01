import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Clock, 
  FileText, 
  Sparkles, 
  Eye, 
  Play, 
  Award, 
  Filter, 
  ShieldCheck, 
  Building2,
  Atom,
  Landmark,
  Layers,
  Search,
  Check,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Database
} from 'lucide-react';
import { bacIIData } from '../../data/bacIIData';
import { quizData } from '../../data/quizData';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';
import QuizModal from './QuizModal';
import AcademicTextRenderer from '../common/AcademicTextRenderer';

const MASTER_SUBJECT_DEFINITIONS = [
  { key: 'math', stream: 'science', nameKm: 'គណិតវិទ្យា', nameEn: 'Mathematics' },
  { key: 'physics', stream: 'science', nameKm: 'រូបវិទ្យា', nameEn: 'Physics' },
  { key: 'chemistry', stream: 'science', nameKm: 'គីមីវិទ្យា', nameEn: 'Chemistry' },
  { key: 'biology', stream: 'science', nameKm: 'ជីវវិទ្យា', nameEn: 'Biology' },
  { key: 'khmer', stream: 'social', nameKm: 'អក្សរសាស្ត្រខ្មែរ', nameEn: 'Khmer Literature' },
  { key: 'history', stream: 'social', nameKm: 'ប្រវត្តិវិទ្យា', nameEn: 'History' },
  { key: 'geography', stream: 'social', nameKm: 'ភូមិវិទ្យា', nameEn: 'Geography' },
  { key: 'civics', stream: 'social', nameKm: 'សីលធម៌-ពលរដ្ឋ', nameEn: 'Civics & Morals' },
  { key: 'english', stream: 'all', nameKm: 'ភាសាអង់គ្លេស', nameEn: 'English' }
];

export default function BacIIHubView() {
  const { t, lang } = useLanguage();
  const [selectedStream, setSelectedStream] = useState('all'); // 'all' | 'science' | 'social'
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedSubjectKey, setSelectedSubjectKey] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [activeSolutionModal, setActiveSolutionModal] = useState(null);
  const [activeQuizModal, setActiveQuizModal] = useState(null);
  const [adminExams, setAdminExams] = useState([]);

  // Fetch dynamic exams created by Admin
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await api.getAdminExams();
        if (res && Array.isArray(res.exams)) {
          setAdminExams(res.exams);
        }
      } catch (e) {}
    };
    fetchExams();
    const interval = setInterval(fetchExams, 4000);
    return () => clearInterval(interval);
  }, []);

  const allPapers = useMemo(() => [...adminExams, ...bacIIData], [adminExams]);
  const ITEMS_PER_PAGE = 8;

  // Total Stream Counts
  const scienceCount = useMemo(() => allPapers.filter(p => p.stream === 'science').length, [allPapers]);
  const socialCount = useMemo(() => allPapers.filter(p => p.stream === 'social').length, [allPapers]);

  // Dynamic Subject List matching the currently selected stream
  const visibleSubjectList = useMemo(() => {
    const streamFiltered = allPapers.filter(p => selectedStream === 'all' || p.stream === selectedStream || p.stream === 'all');
    const availableKeys = new Set(streamFiltered.map(p => p.subjectKey));

    const matchedSubs = MASTER_SUBJECT_DEFINITIONS.filter(s => availableKeys.has(s.key));
    return [
      { key: 'all', nameKm: 'មុខវិជ្ជាទាំងអស់', nameEn: 'All Subjects' },
      ...matchedSubs
    ];
  }, [allPapers, selectedStream]);

  // Handle Stream Selection with Auto-Reset of mismatched Subject
  const handleSelectStream = (newStream) => {
    setSelectedStream(newStream);
    setCurrentPage(1);

    // If a specific subject is selected, check if it's valid in the new stream
    if (selectedSubjectKey !== 'all') {
      const validForNewStream = allPapers.some(p => 
        (newStream === 'all' || p.stream === newStream || p.stream === 'all') &&
        p.subjectKey === selectedSubjectKey
      );
      if (!validForNewStream) {
        setSelectedSubjectKey('all');
      }
    }
  };

  // Available unique years in dataset (sorted descending)
  const availableYears = useMemo(() => {
    return ['all', ...Array.from(new Set(allPapers.map(p => p.year))).sort((a, b) => b - a)];
  }, [allPapers]);

  // Prevent background scrolling when solution modal is open
  useEffect(() => {
    if (activeSolutionModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeSolutionModal]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStream, selectedYear, selectedSubjectKey, searchQuery]);

  const filteredQuizzes = useMemo(() => {
    return quizData.filter(quiz => {
      if (selectedStream === 'all') return true;
      return quiz.stream === selectedStream || quiz.stream === 'all';
    });
  }, [selectedStream]);

  const filteredPapers = useMemo(() => {
    return allPapers.filter(paper => {
      const matchesStream = selectedStream === 'all' || paper.stream === selectedStream || paper.stream === 'all';
      const matchesYear = selectedYear === 'all' || paper.year === selectedYear;
      const matchesSub = selectedSubjectKey === 'all' || paper.subjectKey === selectedSubjectKey;
      
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        matchesSearch = (
          paper.paperTitleKm.toLowerCase().includes(q) ||
          paper.paperTitleEn.toLowerCase().includes(q) ||
          paper.subject.toLowerCase().includes(q) ||
          paper.year.includes(q) ||
          paper.exercises.some(ex => 
            ex.titleKm.toLowerCase().includes(q) || 
            ex.problemText.toLowerCase().includes(q)
          )
        );
      }

      return matchesStream && matchesYear && matchesSub && matchesSearch;
    });
  }, [allPapers, selectedStream, selectedYear, selectedSubjectKey, searchQuery]);

  const totalPages = Math.ceil(filteredPapers.length / ITEMS_PER_PAGE) || 1;
  const paginatedPapers = useMemo(() => {
    return filteredPapers.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [filteredPapers, currentPage]);

  return (
    <div className="space-y-6 sm:space-y-8 font-kantumruy">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#001738] via-[#002f6c] to-[#005baa] rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:p-8 relative overflow-hidden text-white shadow-xl border border-white/15">
        <div className="absolute top-0 right-1/4 w-64 sm:w-80 h-64 sm:h-80 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="absolute right-2 sm:right-12 top-1/2 -translate-y-1/2 w-48 h-48 sm:w-80 sm:h-80 pointer-events-none select-none opacity-10 sm:opacity-20 mix-blend-screen z-0">
          <img
            src="/assets/moeys-crest-transparent.png"
            alt="Ministry Logo Background"
            className="w-full h-full object-contain filter brightness-125"
          />
        </div>

        <div className="max-w-3xl space-y-2.5 sm:space-y-3 relative z-10">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="bg-white/15 text-amber-300 border border-white/20 text-[10px] sm:text-xs font-black px-2.5 sm:px-3.5 py-1 rounded-full inline-flex items-center gap-1 sm:gap-1.5 backdrop-blur-md shadow-2xs">
              <Building2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 flex-shrink-0" />
              <span>{lang === 'km' ? 'នាយកដ្ឋានកិច្ចការប្រឡងជាតិ' : 'National Examination Department'}</span>
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] sm:text-xs font-black px-2.5 sm:px-3 py-1 rounded-full inline-flex items-center gap-1 backdrop-blur-md shadow-2xs">
              <Database className="w-3 sm:w-3.5 h-3 sm:h-3.5 flex-shrink-0" />
              <span>២០,០០០ វិញ្ញាសាសំណួរជាតិ (20k Questions)</span>
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
            {t('bacIITitle') || (lang === 'km' ? 'បណ្ណសារវិញ្ញាសាប្រឡងបាក់ឌុបថ្នាក់ជាតិ (BacII Master Hub)' : 'National BacII Master Examination Archive')}
          </h1>
          <p className="text-[11px] sm:text-sm text-blue-100/90 leading-relaxed font-medium">
            {lang === 'km' 
              ? 'បណ្តុំវិញ្ញាសាប្រឡងសញ្ញាបត្រមធ្យមសិក្សាទុតិយភូមិ (បាក់ឌុប) ផ្លូវការ ២០,០០០ សំណួរ និងបណ្ណសារវិញ្ញាសាគ្រប់ឆ្នាំ ២០១៤-២០២៤ ព្រមទាំងគន្លឹះដំណោះស្រាយលម្អិតរបស់គណៈកម្មការកំណែ។' 
              : 'Official National Baccalaureate Examination Archive with 20,000 authentic questions and Ministry Solutions (2014 - 2024).'}
          </p>
        </div>
      </div>

      {/* DUAL-STREAM SWITCHER & DYNAMIC FILTERS */}
      <div className="bg-white/95 backdrop-blur-md p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-3.5 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-50 text-[#005baa] flex items-center justify-center font-bold flex-shrink-0">
              <GraduationCap className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <h2 className="text-xs sm:text-base font-black text-[#003366]">
              {lang === 'km' ? 'ជ្រើសរើសផ្នែកជំនាញប្រឡងបាក់ឌុប' : 'Select Examination Stream'}
            </h2>
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 sm:px-3 py-1 rounded-xl border border-slate-200 self-start sm:self-auto">
            {lang === 'km' ? `វិញ្ញាសាសរុប៖ ${allPapers.length} (វិទ្យាសាស្ត្រ៖ ${scienceCount}, សង្គម៖ ${socialCount})` : `Total Papers: ${allPapers.length} (Science: ${scienceCount}, Social: ${socialCount})`}
          </span>
        </div>

        {/* 3 Main Stream Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-xs font-bold">
          
          <button
            type="button"
            onClick={() => handleSelectStream('all')}
            className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all flex items-center justify-center gap-2 cursor-pointer font-bold active:scale-[0.98] ${
              selectedStream === 'all'
                ? 'bg-gradient-to-r from-[#003366] to-[#005baa] text-white border-[#003366] shadow-md ring-2 ring-blue-500/30'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <Layers className={`w-4 h-4 ${selectedStream === 'all' ? 'text-amber-300' : 'text-slate-500'}`} />
            <span>{lang === 'km' ? 'វិញ្ញាសាទាំងពីរផ្នែក' : 'All Streams'} ({allPapers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectStream('social')}
            className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all flex items-center justify-center gap-2 cursor-pointer font-bold active:scale-[0.98] ${
              selectedStream === 'social'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white border-amber-600 shadow-md ring-2 ring-amber-400/40'
                : 'bg-amber-50/50 hover:bg-amber-100/70 text-amber-950 border-amber-200'
            }`}
          >
            <Landmark className={`w-4 h-4 ${selectedStream === 'social' ? 'text-amber-200' : 'text-amber-600'}`} />
            <span>{lang === 'km' ? 'ថ្នាក់វិទ្យាសាស្ត្រសង្គម' : 'Social Sciences'} ({socialCount})</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectStream('science')}
            className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all flex items-center justify-center gap-2 cursor-pointer font-bold active:scale-[0.98] ${
              selectedStream === 'science'
                ? 'bg-gradient-to-r from-[#005baa] to-[#0284c7] text-white border-[#005baa] shadow-md ring-2 ring-blue-400/40'
                : 'bg-blue-50/50 hover:bg-blue-100/70 text-[#003366] border-blue-200'
            }`}
          >
            <Atom className={`w-4 h-4 ${selectedStream === 'science' ? 'text-cyan-300' : 'text-[#005baa]'}`} />
            <span>{lang === 'km' ? 'ថ្នាក់វិទ្យាសាស្ត្រពិត' : 'Science Stream'} ({scienceCount})</span>
          </button>

        </div>

        {/* Multi-Year Horizontal Carousel Selector with Dynamic Stream Counts */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <label className="text-[10.5px] sm:text-[11px] font-bold text-slate-500 block">
            {lang === 'km' ? 'ជ្រើសរើសឆ្នាំប្រឡង (Filter by Exam Year):' : 'Filter by Exam Year:'}
          </label>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 text-xs font-bold touch-pan-x [scrollbar-width:none] [-webkit-overflow-scrolling:touch]">
            {availableYears.map((yr) => {
              const isSelected = selectedYear === yr;
              const count = yr === 'all'
                ? allPapers.filter(p => selectedStream === 'all' || p.stream === selectedStream || p.stream === 'all').length
                : allPapers.filter(p => (selectedStream === 'all' || p.stream === selectedStream || p.stream === 'all') && p.year === yr).length;

              return (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setSelectedYear(yr)}
                  className={`px-3 py-1.5 rounded-xl transition-all flex-shrink-0 flex items-center gap-1.5 cursor-pointer font-bold text-[11px] sm:text-xs active:scale-95 ${
                    isSelected
                      ? 'bg-[#005baa] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{yr === 'all' ? (lang === 'km' ? 'គ្រប់ឆ្នាំទាំងអស់' : 'All Years') : (lang === 'km' ? `ឆ្នាំ ${yr}` : `Year ${yr}`)}</span>
                  <span className={`text-[9.5px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Subject Filter Pills - Synced to Selected Stream! */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-[10.5px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
              {lang === 'km' ? 'ជ្រើសរើសមុខវិជ្ជា (Filter by Subject):' : 'Filter by Subject:'}
            </label>
            <span className="text-[10px] sm:text-[10.5px] text-slate-400 font-medium">
              {visibleSubjectList.length - 1} {lang === 'km' ? 'មុខវិជ្ជាក្នុងផ្នែកនេះ' : 'Subjects Available'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 text-xs font-bold touch-pan-x [scrollbar-width:none] [-webkit-overflow-scrolling:touch]">
            {visibleSubjectList.map((sub) => {
              const isSelected = selectedSubjectKey === sub.key;
              const subCount = sub.key === 'all'
                ? allPapers.filter(p => (selectedStream === 'all' || p.stream === selectedStream || p.stream === 'all') && (selectedYear === 'all' || p.year === selectedYear)).length
                : allPapers.filter(p => (selectedStream === 'all' || p.stream === selectedStream || p.stream === 'all') && (selectedYear === 'all' || p.year === selectedYear) && p.subjectKey === sub.key).length;

              return (
                <button
                  key={sub.key}
                  type="button"
                  onClick={() => setSelectedSubjectKey(sub.key)}
                  className={`px-3 py-1.5 rounded-xl transition-all flex-shrink-0 flex items-center gap-1.5 cursor-pointer font-bold text-[11px] sm:text-xs active:scale-95 ${
                    isSelected
                      ? 'bg-[#003366] dark:bg-cyan-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700'
                  }`}
                >
                  <span>{lang === 'km' ? sub.nameKm : sub.nameEn}</span>
                  <span className={`text-[9.5px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                    {subCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Quick Mock Quiz Launchers */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-base font-black text-[#003366] dark:text-white flex items-center gap-1.5 sm:gap-2">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#005baa] dark:text-cyan-400" />
            <span>{lang === 'km' ? 'វិញ្ញាសាតេស្តសាកល្បងកំណត់ម៉ោង MoTDAR (Timed Mock Tests)' : 'Timed National Mock Tests'}</span>
          </h3>
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400">
            {filteredQuizzes.length} {lang === 'km' ? 'តេស្ត' : 'Tests'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
          {filteredQuizzes.map((quiz) => (
            <div key={quiz.id} className="p-3.5 sm:p-5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-3 sm:gap-3.5 shadow-xs hover:border-[#005baa] dark:hover:border-cyan-500 hover:shadow-lg transition-all rounded-2xl sm:rounded-3xl">
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between gap-1 sm:gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md ${quiz.stream === 'social' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-blue-100 text-blue-900 border border-blue-300'}`}>
                      {quiz.stream === 'social' ? (lang === 'km' ? 'សង្គម' : 'Social') : (lang === 'km' ? 'វិទ្យាសាស្ត្រ' : 'Science')}
                    </span>
                    <span className="badge-moeys-blue text-[9px] sm:text-[10px] px-2 py-0.5 rounded-md font-bold">
                      {quiz.subject}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-3 h-3 text-[#005baa] dark:text-cyan-400" />
                      <span>{Math.round(quiz.timeLimitSeconds / 60)} {lang === 'km' ? 'នាទី' : 'mins'}</span>
                    </span>
                    <span>•</span>
                    <span>{quiz.questions?.length || 5} {lang === 'km' ? 'សំណួរ' : 'Q'}</span>
                  </div>
                </div>
                <h4 className="font-black text-xs sm:text-sm text-[#003366] dark:text-white leading-snug">
                  {lang === 'km' ? quiz.titleKm : quiz.titleEn}
                </h4>
              </div>

              <button
                type="button"
                onClick={() => setActiveQuizModal(quiz)}
                className="w-full btn-moeys-primary text-xs py-2 sm:py-2.5 flex items-center justify-center gap-1.5 font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
              >
                <Play className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>{lang === 'km' ? 'ចាប់ផ្តើមតេស្ត' : 'Start Mock'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Past Papers List / Grid (Clickable cards that open official solution modal) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#005baa] flex-shrink-0" />
            <h3 className="text-xs sm:text-sm font-black text-[#003366] leading-tight">
              {lang === 'km' ? 'បណ្ណសារវិញ្ញាសា និងដំណោះស្រាយផ្លូវការ (Past Papers Archive)' : 'Past Examination Papers & Solutions'}
            </h3>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search Box */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'km' ? 'ស្វែងរកវិញ្ញាសា...' : 'Search papers...'}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#005baa] bg-slate-50 focus:bg-white transition-all"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden flex-shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 cursor-pointer transition-colors ${viewMode === 'grid' ? 'bg-[#005baa] text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-2 cursor-pointer transition-colors ${viewMode === 'list' ? 'bg-[#005baa] text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Papers Grid View */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {paginatedPapers.map((paper) => (
              <div
                key={paper.id}
                onClick={() => setActiveSolutionModal(paper)}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-3.5 sm:space-y-4 hover:border-[#005baa] hover:shadow-lg transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="badge-moeys-gold text-xs font-cinzel">{paper.year}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      paper.stream === 'social' 
                        ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                        : 'bg-blue-100 text-blue-900 border border-blue-300'
                    }`}>
                      {paper.stream === 'social' ? <Landmark className="w-3 h-3 text-amber-600" /> : <Atom className="w-3 h-3 text-[#005baa]" />}
                      <span>{paper.stream === 'social' ? 'ថ្នាក់វិទ្យាសាស្ត្រសង្គម' : 'ថ្នាក់វិទ្យាសាស្ត្រពិត'}</span>
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-black text-[#003366] leading-snug group-hover:text-[#005baa] transition-colors">
                    {paper.paperTitleKm}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                    {paper.paperTitleEn}
                  </p>

                  <div className="flex items-center gap-2 sm:gap-3 text-[10.5px] sm:text-xs text-slate-500 pt-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#005baa]" />
                      <span>{paper.duration}</span>
                    </span>
                    <span>•</span>
                    <span>{paper.totalPoints} ពិន្ទុពេញ</span>
                    <span>•</span>
                    <span>{paper.exercises?.length || 4} លំហាត់/សំណួរ</span>
                  </div>
                </div>

                <div className="pt-2 sm:pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSolutionModal(paper);
                    }}
                    className="w-full btn-moeys-primary text-xs py-2 sm:py-2.5 flex items-center justify-center gap-2 font-bold cursor-pointer shadow-xs active:scale-[0.99] transition-all"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{lang === 'km' ? 'មើលកម្រងវិញ្ញាសា & ដំណោះស្រាយ' : 'View Exam & Solutions'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List Mode: Mobile Card Stack (< md) & Desktop Table (>= md) */
          <div>
            {/* 1. Mobile-Optimized Card Stack (Hidden on Desktop) */}
            <div className="block md:hidden space-y-3">
              {paginatedPapers.map((paper) => (
                <div
                  key={paper.id}
                  onClick={() => setActiveSolutionModal(paper)}
                  className="bg-white rounded-2xl border border-slate-200 p-3.5 space-y-2.5 shadow-xs hover:border-[#005baa] transition-all cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="badge-moeys-gold text-xs font-cinzel">{paper.year}</span>
                      <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        paper.stream === 'social' 
                          ? 'bg-amber-100 text-amber-900 border border-amber-200' 
                          : 'bg-blue-100 text-blue-900 border border-blue-200'
                      }`}>
                        {paper.stream === 'social' ? <Landmark className="w-3 h-3 text-amber-600" /> : <Atom className="w-3 h-3 text-[#005baa]" />}
                        <span>{paper.stream === 'social' ? 'សង្គម' : 'វិទ្យាសាស្ត្រពិត'}</span>
                      </span>
                    </div>
                    <span className="text-[10.5px] font-bold text-slate-600">
                      {paper.totalPoints} ពិន្ទុ
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-[#003366] leading-snug">
                      {paper.paperTitleKm}
                    </h4>
                    <p className="text-[10.5px] text-slate-500 font-medium mt-0.5">
                      {paper.paperTitleEn}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10.5px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#005baa]" />
                      <span>{paper.duration}</span>
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSolutionModal(paper);
                      }}
                      className="btn-moeys-primary text-[11px] py-1.5 px-3 rounded-xl flex items-center gap-1 font-bold shadow-2xs cursor-pointer active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{lang === 'km' ? 'មើលវិញ្ញាសា' : 'View Paper'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. Desktop High-Density Table (Hidden on Mobile) */}
            <div className="hidden md:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[#003366] font-bold">
                    <tr>
                      <th className="py-3 px-4 whitespace-nowrap">ឆ្នាំ</th>
                      <th className="py-3 px-4 whitespace-nowrap">ផ្នែក</th>
                      <th className="py-3 px-4">ឈ្មោះវិញ្ញាសា</th>
                      <th className="py-3 px-4 whitespace-nowrap">រយៈពេល</th>
                      <th className="py-3 px-4 whitespace-nowrap">ពិន្ទុ</th>
                      <th className="py-3 px-4 text-right whitespace-nowrap">សកម្មភាព</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedPapers.map((paper) => (
                      <tr
                        key={paper.id}
                        onClick={() => setActiveSolutionModal(paper)}
                        className="hover:bg-blue-50/50 transition-colors cursor-pointer"
                      >
                        <td className="py-3 px-4 font-cinzel font-bold whitespace-nowrap">{paper.year}</td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            paper.stream === 'social' ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'bg-blue-100 text-blue-900 border border-blue-200'
                          }`}>
                            {paper.stream === 'social' ? 'សង្គម' : 'វិទ្យាសាស្ត្រ'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-[#003366]">
                          <div>{paper.paperTitleKm}</div>
                          <div className="text-[11px] text-slate-400 font-normal">{paper.paperTitleEn}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{paper.duration}</td>
                        <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{paper.totalPoints} ពិន្ទុ</td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => setActiveSolutionModal(paper)}
                              className="btn-moeys-primary text-[11px] py-1.5 px-3 cursor-pointer font-bold flex items-center gap-1.5 shadow-2xs active:scale-95"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>មើលវិញ្ញាសា</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Pagination Controls - Touch-Swipeable & Fully Responsive */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs text-xs font-bold gap-3">
            <span className="text-slate-500 text-center sm:text-left text-[11px] sm:text-xs">
              ទំព័រទី <b className="text-[#005baa]">{currentPage}</b> នៃ {totalPages} (សរុប {filteredPapers.length} វិញ្ញាសា)
            </span>

            <div className="w-full sm:w-auto flex items-center justify-center sm:justify-end gap-1.5 overflow-x-auto max-w-full py-1 px-1 no-scrollbar touch-pan-x [scrollbar-width:none]">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage(prev => Math.max(prev - 1, 1));
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                className="px-2.5 sm:px-3 h-8 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 flex-shrink-0 transition-colors shadow-2xs text-[11px] sm:text-xs"
                title="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>មុន</span>
              </button>

              <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] sm:max-w-none py-0.5 px-0.5 no-scrollbar touch-pan-x [scrollbar-width:none]">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => {
                      setCurrentPage(page);
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className={`min-w-[30px] sm:min-w-[32px] h-8 px-2 rounded-xl transition-all cursor-pointer flex-shrink-0 flex items-center justify-center text-xs ${
                      currentPage === page
                        ? 'bg-[#005baa] text-white shadow-xs font-black ring-2 ring-[#005baa]/30 scale-105'
                        : 'bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#005baa] border border-slate-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage(prev => Math.min(prev + 1, totalPages));
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                className="px-2.5 sm:px-3 h-8 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 flex-shrink-0 transition-colors shadow-2xs text-[11px] sm:text-xs"
                title="Next Page"
              >
                <span>បន្ទាប់</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Official Solution Key Modal */}
      {activeSolutionModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto font-kantumruy animate-fadeIn">
          <div className="moeys-card w-full max-w-3xl bg-white border-slate-300 p-4 sm:p-7 space-y-4 sm:space-y-5 shadow-2xl my-auto max-h-[94vh] flex flex-col rounded-2xl sm:rounded-3xl">
            
            <div className="flex items-start justify-between border-b border-slate-200 pb-3 sm:pb-4 flex-shrink-0 gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                  <span className="badge-moeys-gold text-xs font-cinzel">{activeSolutionModal.year}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    activeSolutionModal.stream === 'social' 
                      ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                      : 'bg-blue-100 text-blue-900 border border-blue-300'
                  }`}>
                    {activeSolutionModal.stream === 'social' ? <Landmark className="w-3 h-3 text-amber-600" /> : <Atom className="w-3 h-3 text-[#005baa]" />}
                    <span>{activeSolutionModal.stream === 'social' ? 'ថ្នាក់វិទ្យាសាស្ត្រសង្គម' : 'ថ្នាក់វិទ្យាសាស្ត្រពិត'}</span>
                  </span>
                </div>
                <h3 className="font-bold text-xs sm:text-base text-[#003366] font-kantumruy leading-snug sm:leading-[1.6]">
                  ដំណោះស្រាយលម្អិតរបស់ក្រសួង៖ {activeSolutionModal.paperTitleKm}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveSolutionModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto pr-1 text-xs sm:text-sm leading-relaxed flex-1">
              {activeSolutionModal.exercises && activeSolutionModal.exercises.map((ex, idx) => (
                <div key={idx} className="space-y-3 bg-slate-50/80 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="font-black text-[#003366] text-xs sm:text-base border-b border-slate-200 pb-2.5 flex items-center justify-between gap-2">
                    <span>{ex.titleKm}</span>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-400 font-cinzel">EXERCISE #{idx + 1}</span>
                  </div>
                  
                  {/* Problem Question */}
                  <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
                    <span className="font-black text-xs sm:text-sm text-[#003366] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#005baa]" />
                      ប្រធានលំហាត់ / សំណួរ៖
                    </span>
                    <AcademicTextRenderer content={ex.problemText} baseTextSize="text-xs sm:text-sm" />
                  </div>

                  {/* Solution Key */}
                  <div className="bg-[#f0f9ff] p-3.5 sm:p-4 rounded-xl border border-[#bae6fd] shadow-xs space-y-2">
                    <div className="flex items-center justify-between border-b border-sky-200/80 pb-1.5">
                      <span className="font-black text-xs sm:text-sm text-[#003366] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#005baa]" />
                        ដំណោះស្រាយផ្លូវការ និងគន្លឹះគណនា៖
                      </span>
                      <span className="text-[10px] font-bold text-sky-600 bg-sky-100 px-2 py-0.5 rounded-full">Official Curriculum</span>
                    </div>
                    <AcademicTextRenderer content={ex.solutionText} baseTextSize="text-xs sm:text-sm" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-200 flex-shrink-0">
              <button
                type="button"
                onClick={() => setActiveSolutionModal(null)}
                className="w-full sm:w-auto btn-moeys-primary text-xs py-2.5 px-8 font-bold cursor-pointer"
              >
                {lang === 'km' ? 'បិទផ្ទាំង (Close)' : 'Close'}
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* Timed Quiz Modal */}
      {activeQuizModal && (
        <QuizModal
          quiz={activeQuizModal}
          onClose={() => setActiveQuizModal(null)}
        />
      )}

    </div>
  );
}
