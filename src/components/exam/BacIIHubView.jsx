import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Sparkles, 
  Download, 
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
  Database,
  Loader2
} from 'lucide-react';
import { bacIIData } from '../../data/bacIIData';
import { quizData } from '../../data/quizData';
import { useLanguage } from '../../context/LanguageContext';
import { downloadBacIIPdf } from '../../utils/baciiPdfExporter';
import api from '../../services/api';
import QuizModal from './QuizModal';

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
  const [downloadToast, setDownloadToast] = useState(null);
  const [downloadingPaperId, setDownloadingPaperId] = useState(null);
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

  const allPapers = [...adminExams, ...bacIIData];
  const ITEMS_PER_PAGE = 8;

  // Available unique years in dataset (sorted descending)
  const availableYears = ['all', ...Array.from(new Set(allPapers.map(p => p.year))).sort((a, b) => b - a)];

  // Subject quick list
  const subjectList = [
    { key: 'all', nameKm: 'មុខវិជ្ជាទាំងអស់', nameEn: 'All Subjects' },
    { key: 'math', nameKm: 'គណិតវិទ្យា', nameEn: 'Mathematics' },
    { key: 'physics', nameKm: 'រូបវិទ្យា', nameEn: 'Physics' },
    { key: 'chemistry', nameKm: 'គីមីវិទ្យា', nameEn: 'Chemistry' },
    { key: 'biology', nameKm: 'ជីវវិទ្យា', nameEn: 'Biology' },
    { key: 'khmer', nameKm: 'អក្សរសាស្ត្រខ្មែរ', nameEn: 'Khmer Literature' },
    { key: 'history', nameKm: 'ប្រវត្តិវិទ្យា', nameEn: 'History' },
    { key: 'geography', nameKm: 'ភូមិវិទ្យា', nameEn: 'Geography' },
    { key: 'civics', nameKm: 'សីលធម៌-ពលរដ្ឋ', nameEn: 'Moral & Civics' },
    { key: 'english', nameKm: 'ភាសាអង់គ្លេស', nameEn: 'English' }
  ];

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

  const filteredQuizzes = quizData.filter(quiz => {
    if (selectedStream === 'all') return true;
    return quiz.stream === selectedStream || quiz.stream === 'all';
  });

  const filteredPapers = allPapers.filter(paper => {
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

  const totalPages = Math.ceil(filteredPapers.length / ITEMS_PER_PAGE) || 1;
  const paginatedPapers = filteredPapers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const scienceCount = allPapers.filter(p => p.stream === 'science').length;
  const socialCount = allPapers.filter(p => p.stream === 'social').length;

  const handleDownloadPdf = async (paper) => {
    if (!paper || downloadingPaperId) return;
    setDownloadingPaperId(paper.id);
    setDownloadToast(`កំពុងរៀបចំ និងទាញយកវិញ្ញាសា ${paper.year} ${paper.subject} ជាទម្រង់ PDF HD... ⏳`);

    try {
      const success = await downloadBacIIPdf(paper);
      if (success) {
        setDownloadToast(`វិញ្ញាសាបាក់ឌុប ${paper.year} ${paper.subject} (${paper.stream === 'social' ? 'ថ្នាក់វិទ្យាសាស្ត្រសង្គម' : 'ថ្នាក់វិទ្យាសាស្ត្រពិត'}) ត្រូវបានទាញយកជា PDF ជោគជ័យ! ✓`);
      } else {
        setDownloadToast(`មានបញ្ហាក្នុងការទាញយក PDF សូមសាកល្បងម្តងទៀត!`);
      }
    } catch (e) {
      console.error(e);
      setDownloadToast(`មានបញ្ហាក្នុងការទាញយក PDF សូមសាកល្បងម្តងទៀត!`);
    } finally {
      setDownloadingPaperId(null);
      setTimeout(() => {
        setDownloadToast(null);
      }, 4000);
    }
  };

  return (
    <div className="space-y-8 font-kantumruy">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#001738] via-[#002f6c] to-[#005baa] rounded-3xl p-6 sm:p-8 relative overflow-hidden text-white shadow-xl border border-white/15">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 w-60 h-60 sm:w-80 sm:h-80 pointer-events-none select-none opacity-15 sm:opacity-20 mix-blend-screen z-0">
          <img
            src="/assets/moeys-crest-transparent.png"
            alt="Ministry Logo Background"
            className="w-full h-full object-contain filter brightness-125"
          />
        </div>

        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-white/15 text-amber-300 border border-white/20 text-xs font-black px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 backdrop-blur-md shadow-2xs">
              <Building2 className="w-3.5 h-3.5" />
              <span>{lang === 'km' ? 'នាយកដ្ឋានកិច្ចការប្រឡងជាតិ' : 'National Examination Department'}</span>
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-black px-3 py-1 rounded-full inline-flex items-center gap-1 backdrop-blur-md shadow-2xs">
              <Database className="w-3.5 h-3.5" />
              <span>១២,០០០ វិញ្ញាសាសំណួរជាតិ (12,000 Questions Pool)</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
            {t('bacIITitle') || (lang === 'km' ? 'បណ្ណសារវិញ្ញាសាប្រឡងបាក់ឌុបថ្នាក់ជាតិ (BacII Master Hub)' : 'National BacII Master Examination Archive')}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-medium">
            {lang === 'km' 
              ? 'បណ្តុំវិញ្ញាសាប្រឡងសញ្ញាបត្រមធ្យមសិក្សាទុតិយភូមិ (បាក់ឌុប) ផ្លូវការ ១២,០០០ សំណួរ និងបណ្ណសារវិញ្ញាសាគ្រប់ឆ្នាំ ២០១៤-២០២៤ ព្រមទាំងគន្លឹះដំណោះស្រាយលម្អិតរបស់គណៈកម្មការកំណែ។' 
              : 'Official National Baccalaureate Examination Archive with 12,000 authentic questions and Ministry Solutions (2014 - 2024).'}
          </p>
        </div>
      </div>

      {/* DUAL-STREAM SWITCHER & YEAR FILTERS */}
      <div className="bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#005baa] flex items-center justify-center font-bold">
              <GraduationCap className="w-4.5 h-4.5" />
            </div>
            <h2 className="text-sm sm:text-base font-black text-[#003366]">
              {lang === 'km' ? 'ជ្រើសរើសផ្នែកជំនាញប្រឡងបាក់ឌុប' : 'Select Examination Stream'}
            </h2>
          </div>
          <span className="text-[11px] font-bold text-slate-500">
            {lang === 'km' ? `វិញ្ញាសាសរុប៖ ${allPapers.length} (វិទ្យាសាស្ត្រ៖ ${scienceCount}, សង្គម៖ ${socialCount})` : `Total Papers: ${allPapers.length} (Science: ${scienceCount}, Social: ${socialCount})`}
          </span>
        </div>

        {/* 3 Main Stream Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-xs font-bold">
          
          <button
            type="button"
            onClick={() => setSelectedStream('all')}
            className={`p-3.5 rounded-2xl border transition-all flex items-center justify-center gap-2.5 cursor-pointer font-bold ${
              selectedStream === 'all'
                ? 'bg-gradient-to-r from-[#003366] to-[#005baa] text-white border-[#003366] shadow-md ring-2 ring-blue-500/30 scale-[1.01]'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <Layers className={`w-4.5 h-4.5 ${selectedStream === 'all' ? 'text-amber-300' : 'text-slate-500'}`} />
            <span>{lang === 'km' ? 'វិញ្ញាសាទាំងពីរផ្នែក' : 'All Streams'} ({allPapers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStream('social')}
            className={`p-3.5 rounded-2xl border transition-all flex items-center justify-center gap-2.5 cursor-pointer font-bold ${
              selectedStream === 'social'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white border-amber-600 shadow-md ring-2 ring-amber-400/40 scale-[1.01]'
                : 'bg-amber-50/50 hover:bg-amber-100/70 text-amber-950 border-amber-200'
            }`}
          >
            <Landmark className={`w-4.5 h-4.5 ${selectedStream === 'social' ? 'text-amber-200' : 'text-amber-600'}`} />
            <span>{lang === 'km' ? 'ថ្នាក់វិទ្យាសាស្ត្រសង្គម' : 'Social Sciences'} ({socialCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStream('science')}
            className={`p-3.5 rounded-2xl border transition-all flex items-center justify-center gap-2.5 cursor-pointer font-bold ${
              selectedStream === 'science'
                ? 'bg-gradient-to-r from-[#005baa] to-[#0284c7] text-white border-[#005baa] shadow-md ring-2 ring-blue-400/40 scale-[1.01]'
                : 'bg-blue-50/50 hover:bg-blue-100/70 text-[#003366] border-blue-200'
            }`}
          >
            <Atom className={`w-4.5 h-4.5 ${selectedStream === 'science' ? 'text-cyan-300' : 'text-[#005baa]'}`} />
            <span>{lang === 'km' ? 'ថ្នាក់វិទ្យាសាស្ត្រពិត' : 'Science Stream'} ({scienceCount})</span>
          </button>

        </div>

        {/* Multi-Year Horizontal Carousel Selector */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <label className="text-[11px] font-bold text-slate-500 block">
            {lang === 'km' ? 'ជ្រើសរើសឆ្នាំប្រឡង (Filter by Exam Year):' : 'Filter by Exam Year:'}
          </label>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
            {availableYears.map((yr) => {
              const isSelected = selectedYear === yr;
              const count = yr === 'all' 
                ? allPapers.length 
                : allPapers.filter(p => p.year === yr).length;
              return (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setSelectedYear(yr)}
                  className={`px-3 py-1.5 rounded-xl transition-all flex-shrink-0 flex items-center gap-1 cursor-pointer font-bold ${
                    isSelected
                      ? 'bg-[#005baa] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{yr === 'all' ? (lang === 'km' ? 'គ្រប់ឆ្នាំទាំងអស់' : 'All Years') : (lang === 'km' ? `ឆ្នាំ ${yr}` : `Year ${yr}`)}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Subject Filter Pills */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <label className="text-[11px] font-bold text-slate-500 block">
            {lang === 'km' ? 'ជ្រើសរើសមុខវិជ្ជា (Filter by Subject):' : 'Filter by Subject:'}
          </label>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
            {subjectList.map((sub) => {
              const isSelected = selectedSubjectKey === sub.key;
              return (
                <button
                  key={sub.key}
                  type="button"
                  onClick={() => setSelectedSubjectKey(sub.key)}
                  className={`px-3 py-1.5 rounded-xl transition-all flex-shrink-0 flex items-center gap-1 cursor-pointer font-bold ${
                    isSelected
                      ? 'bg-[#003366] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/60'
                  }`}
                >
                  <span>{lang === 'km' ? sub.nameKm : sub.nameEn}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Quick Mock Quiz Launchers */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-base font-black text-[#003366] flex items-center gap-1.5 sm:gap-2">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#005baa]" />
            <span>{lang === 'km' ? 'វិញ្ញាសាតេស្តសាកល្បងកំណត់ម៉ោង MoTDAR (Timed Mock Tests)' : 'Timed National Mock Tests'}</span>
          </h3>
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-500">
            {filteredQuizzes.length} {lang === 'km' ? 'តេស្ត' : 'Tests'}
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
          {filteredQuizzes.map((quiz) => (
            <div key={quiz.id} className="p-3 sm:p-5 bg-white border border-slate-200 flex flex-col justify-between gap-2.5 sm:gap-3.5 shadow-xs hover:border-[#005baa] hover:shadow-lg transition-all rounded-2xl sm:rounded-3xl">
              <div className="space-y-1 sm:space-y-1.5">
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                  <span className={`text-[8.5px] sm:text-[10px] font-black px-2 py-0.5 rounded-md ${quiz.stream === 'social' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-blue-100 text-blue-900 border border-blue-300'}`}>
                    {quiz.stream === 'social' ? (lang === 'km' ? 'សង្គម' : 'Social') : (lang === 'km' ? 'វិទ្យាសាស្ត្រ' : 'Science')}
                  </span>
                  <span className="badge-moeys-blue text-[8.5px] sm:text-[10px] px-2 py-0.5 rounded-md font-bold">
                    {quiz.subject}
                  </span>
                </div>
                <h4 className="font-black text-xs sm:text-sm text-[#003366] line-clamp-1 leading-snug">
                  {lang === 'km' ? quiz.titleKm : quiz.titleEn}
                </h4>
                <div className="flex items-center gap-1.5 sm:gap-3 text-[9.5px] sm:text-[11px] text-slate-500 pt-0.5 font-medium">
                  <span className="flex items-center gap-0.5">
                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#005baa]" />
                    <span>{Math.round(quiz.timeLimitSeconds / 60)} {lang === 'km' ? 'នាទី' : 'mins'}</span>
                  </span>
                  <span>•</span>
                  <span>{quiz.questions?.length || 5} {lang === 'km' ? 'សំណួរ' : 'questions'}</span>
                </div>
              </div>

              <button
                onClick={() => setActiveQuizModal(quiz)}
                className="w-full btn-moeys-primary text-[10px] sm:text-xs py-1.5 sm:py-2 flex items-center justify-center gap-1 font-bold shadow-xs cursor-pointer active:scale-95"
              >
                <Play className="w-3 h-3 text-amber-300 fill-amber-300" />
                <span>{lang === 'km' ? 'ចាប់ផ្តើមតេស្ត' : 'Start Mock'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Past Papers List / Grid (Clickable cards that open official solution modal) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#005baa]" />
            <h3 className="text-xs sm:text-sm font-black text-[#003366]">
              {lang === 'km' ? 'បណ្ណសារវិញ្ញាសា និងដំណោះស្រាយផ្លូវការ (Past Papers Archive)' : 'Past Examination Papers & Solutions'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Box */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'km' ? 'ស្វែងរកវិញ្ញាសា...' : 'Search papers...'}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#005baa]"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 cursor-pointer ${viewMode === 'grid' ? 'bg-[#005baa] text-white' : 'bg-white text-slate-600'}`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 cursor-pointer ${viewMode === 'list' ? 'bg-[#005baa] text-white' : 'bg-white text-slate-600'}`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Papers Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedPapers.map((paper) => {
              const isDownloading = downloadingPaperId === paper.id;
              return (
                <div
                  key={paper.id}
                  onClick={() => setActiveSolutionModal(paper)}
                  className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 hover:border-[#005baa] hover:shadow-lg transition-all flex flex-col justify-between cursor-pointer group"
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

                    <h4 className="text-sm font-black text-[#003366] leading-snug group-hover:text-[#005baa] transition-colors">
                      {paper.paperTitleKm}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      {paper.paperTitleEn}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
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

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSolutionModal(paper);
                      }}
                      className="flex-1 btn-moeys-primary text-xs py-2 flex items-center justify-center gap-1.5 font-bold cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{lang === 'km' ? 'មើលដំណោះស្រាយ' : 'View Solutions'}</span>
                    </button>

                    <button
                      type="button"
                      disabled={isDownloading}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadPdf(paper);
                      }}
                      className="btn-moeys-secondary text-xs py-2 px-3.5 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      title="Download Official PDF Exam & Solution"
                    >
                      {isDownloading ? (
                        <Loader2 className="w-3.5 h-3.5 text-[#005baa] animate-spin" />
                      ) : (
                        <Download className="w-3.5 h-3.5 text-[#005baa]" />
                      )}
                      <span>PDF</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List Mode */
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-[#003366] font-bold">
                  <tr>
                    <th className="py-3 px-4">ឆ្នាំ</th>
                    <th className="py-3 px-4">ផ្នែក</th>
                    <th className="py-3 px-4">ឈ្មោះវិញ្ញាសា</th>
                    <th className="py-3 px-4">រយៈពេល</th>
                    <th className="py-3 px-4">ពិន្ទុ</th>
                    <th className="py-3 px-4 text-right">សកម្មភាព</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedPapers.map((paper) => {
                    const isDownloading = downloadingPaperId === paper.id;
                    return (
                      <tr
                        key={paper.id}
                        onClick={() => setActiveSolutionModal(paper)}
                        className="hover:bg-blue-50/50 transition-colors cursor-pointer"
                      >
                        <td className="py-3 px-4 font-cinzel font-bold">{paper.year}</td>
                        <td className="py-3 px-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            paper.stream === 'social' ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'
                          }`}>
                            {paper.stream === 'social' ? 'សង្គម' : 'វិទ្យាសាស្ត្រ'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-[#003366]">{paper.paperTitleKm}</td>
                        <td className="py-3 px-4 text-slate-500">{paper.duration}</td>
                        <td className="py-3 px-4 text-slate-500">{paper.totalPoints} ពិន្ទុ</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setActiveSolutionModal(paper)}
                              className="btn-moeys-primary text-[11px] py-1 px-2.5 cursor-pointer font-bold flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              <span>មើល</span>
                            </button>
                            <button
                              disabled={isDownloading}
                              onClick={() => handleDownloadPdf(paper)}
                              className="btn-moeys-secondary text-[11px] py-1 px-2.5 cursor-pointer flex items-center gap-1 disabled:opacity-50"
                              title="Download Official PDF"
                            >
                              {isDownloading ? (
                                <Loader2 className="w-3 h-3 text-[#005baa] animate-spin" />
                              ) : (
                                <Download className="w-3 h-3 text-[#005baa]" />
                              )}
                              <span>PDF</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs text-xs font-bold">
            <span className="text-slate-500">
              ទំព័រទី <b className="text-[#005baa]">{currentPage}</b> នៃ {totalPages} (សរុប {filteredPapers.length} វិញ្ញាសា)
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="p-1.5 sm:px-3 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">មុន</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg transition-colors cursor-pointer ${
                    currentPage === page
                      ? 'bg-[#005baa] text-white shadow-xs font-black'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="p-1.5 sm:px-3 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
              >
                <span className="hidden sm:inline">បន្ទាប់</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Official Solution Key Modal (Modal in Screenshot 3) */}
      {activeSolutionModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto font-kantumruy animate-fadeIn">
          <div className="moeys-card w-full max-w-3xl bg-white border-slate-300 p-5 sm:p-8 space-y-5 shadow-2xl my-auto max-h-[92vh] flex flex-col">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 flex-shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
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
                <h3 className="font-bold text-sm sm:text-base text-[#003366] font-kantumruy leading-[1.6]">
                  ដំណោះស្រាយលម្អិតរបស់ក្រសួង៖ {activeSolutionModal.paperTitleKm}
                </h3>
              </div>
              <button
                onClick={() => setActiveSolutionModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5 overflow-y-auto pr-2 text-xs sm:text-sm leading-relaxed flex-1">
              {activeSolutionModal.exercises && activeSolutionModal.exercises.map((ex, idx) => (
                <div key={idx} className="space-y-3 bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200">
                  <div className="font-bold text-[#003366] text-sm border-b border-slate-200 pb-2">
                    {ex.titleKm}
                  </div>
                  <div className="text-slate-800 whitespace-pre-line bg-white p-3.5 rounded-xl border border-slate-200 text-xs shadow-xs">
                    <span className="font-bold text-[#003366]">ប្រធានលំហាត់ / សំណួរ៖</span>
                    <br />
                    {ex.problemText}
                  </div>
                  <div className="text-slate-800 whitespace-pre-line leading-relaxed font-mono text-xs bg-[#f0f9ff] p-4 rounded-xl border border-[#bae6fd]">
                    {ex.solutionText}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200 flex-shrink-0">
              <button
                disabled={downloadingPaperId === activeSolutionModal.id}
                onClick={() => handleDownloadPdf(activeSolutionModal)}
                className="btn-moeys-secondary text-xs py-2 px-4 font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {downloadingPaperId === activeSolutionModal.id ? (
                  <Loader2 className="w-3.5 h-3.5 text-[#005baa] animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5 text-[#005baa]" />
                )}
                <span>ទាញយកជា PDF (Download PDF)</span>
              </button>
              <button
                onClick={() => setActiveSolutionModal(null)}
                className="btn-moeys-primary text-xs py-2 px-6 font-bold cursor-pointer"
              >
                បិទផ្ទាំង (Close)
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

      {/* Download PDF Toast */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-xs font-bold">{downloadToast}</span>
        </div>
      )}

    </div>
  );
}
