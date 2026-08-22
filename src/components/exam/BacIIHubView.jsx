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
  List
} from 'lucide-react';
import { bacIIData } from '../../data/bacIIData';
import { quizData } from '../../data/quizData';
import { useLanguage } from '../../context/LanguageContext';
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

  // Available unique years in dataset
  const availableYears = ['all', ...Array.from(new Set(allPapers.map(p => p.year))).sort((a, b) => b - a)];

  // Subject quick list
  const subjectList = [
    { key: 'all', nameKm: 'មុខវិជ្ជាទាំងអស់', nameEn: 'All Subjects' },
    { key: 'khmer', nameKm: 'អក្សរសាស្ត្រខ្មែរ', nameEn: 'Khmer Literature' },
    { key: 'math', nameKm: 'គណិតវិទ្យា', nameEn: 'Mathematics' },
    { key: 'physics', nameKm: 'រូបវិទ្យា', nameEn: 'Physics' },
    { key: 'chemistry', nameKm: 'គីមីវិទ្យា', nameEn: 'Chemistry' },
    { key: 'biology', nameKm: 'ជីវវិទ្យា', nameEn: 'Biology' },
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

  const scienceCount = bacIIData.filter(p => p.stream === 'science').length;
  const socialCount = bacIIData.filter(p => p.stream === 'social').length;

  const handleDownloadPdf = (paper) => {
    setDownloadToast(`វិញ្ញាសាបាក់ឌុប ${paper.year} ${paper.subject} (${paper.stream === 'social' ? 'ថ្នាក់វិទ្យាសាស្ត្រសង្គម' : 'ថ្នាក់វិទ្យាសាស្ត្រពិត'}) ត្រូវបានទាញយកជាទម្រង់ PDF ជោគជ័យ!`);
    setTimeout(() => {
      setDownloadToast(null);
    }, 3500);
  };

  return (
    <div className="space-y-8 font-kantumruy">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#001f3f] via-[#003876] to-[#005baa] rounded-3xl p-6 sm:p-8 relative overflow-hidden text-white shadow-xl border border-white/15">
        {/* Ambient Gradient Lighting */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />
        
        {/* Subtle Watermark Logo in Banner Background */}
        <div className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 w-60 h-60 sm:w-80 sm:h-80 pointer-events-none select-none opacity-15 sm:opacity-20 mix-blend-screen z-0">
          <img
            src="/assets/moeys-crest-transparent.png"
            alt="Ministry Logo Background"
            className="w-full h-full object-contain filter brightness-125"
          />
        </div>

        <div className="max-w-3xl space-y-3 relative z-10">
          <span className="bg-white/15 text-amber-300 border border-white/20 text-xs font-black px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 backdrop-blur-md shadow-2xs">
            <Building2 className="w-3.5 h-3.5" />
            <span>{lang === 'km' ? 'នាយកដ្ឋានកិច្ចការប្រឡងជាតិ' : 'National Examination Department'}</span>
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
            {t('bacIITitle') || (lang === 'km' ? 'បណ្ណសារវិញ្ញាសាប្រឡងបាក់ឌុបថ្នាក់ជាតិ' : 'National BacII Master Examination Archive')}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-medium">
            {t('bacIISubtitle') || (lang === 'km' ? 'បណ្តុំវិញ្ញាសាប្រឡងសញ្ញាបត្រមធ្យមសិក្សាទុតិយភូមិ (បាក់ឌុប) ផ្លូវការ និងគន្លឹះដំណោះស្រាយលម្អិត គ្រប់ឆ្នាំ (២០១៤ - ២០២៤) ទាំងថ្នាក់វិទ្យាសាស្ត្រពិត និងថ្នាក់វិទ្យាសាស្ត្រសង្គម។' : 'Official Baccalaureate Examination Papers & Detailed Solutions Archive (2014 - 2024) across Science & Social Streams.')}
          </p>
        </div>
      </div>

      {/* DUAL-STREAM SWITCHER HUB */}
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
            {lang === 'km' ? `វិញ្ញាសាសរុប៖ ${bacIIData.length} (វិទ្យាសាស្ត្រ៖ ${scienceCount}, សង្គម៖ ${socialCount})` : `Total Papers: ${bacIIData.length} (Science: ${scienceCount}, Social: ${socialCount})`}
          </span>
        </div>

        {/* 3 Main Stream Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-xs font-bold">
          
          <button
            type="button"
            onClick={() => setSelectedStream('all')}
            className={`p-3 rounded-2xl border transition-all flex items-center justify-center gap-2 cursor-pointer font-bold ${
              selectedStream === 'all'
                ? 'bg-gradient-to-r from-[#003366] to-[#005baa] text-white border-[#003366] shadow-md'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <Layers className={`w-4 h-4 ${selectedStream === 'all' ? 'text-amber-300' : 'text-slate-500'}`} />
            <span>{lang === 'km' ? 'វិញ្ញាសាទាំងពីរផ្នែក' : 'All Streams'} ({bacIIData.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStream('social')}
            className={`p-3 rounded-2xl border transition-all flex items-center justify-center gap-2 cursor-pointer font-bold ${
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
            onClick={() => setSelectedStream('science')}
            className={`p-3 rounded-2xl border transition-all flex items-center justify-center gap-2 cursor-pointer font-bold ${
              selectedStream === 'science'
                ? 'bg-gradient-to-r from-[#005baa] to-[#0284c7] text-white border-[#005baa] shadow-md ring-2 ring-blue-400/40'
                : 'bg-blue-50/50 hover:bg-blue-100/70 text-[#003366] border-blue-200'
            }`}
          >
            <Atom className={`w-4 h-4 ${selectedStream === 'science' ? 'text-cyan-300' : 'text-[#005baa]'}`} />
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
                ? bacIIData.length 
                : bacIIData.filter(p => p.year === yr).length;
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
                  <span>{quiz.questions.length} {lang === 'km' ? 'សំណួរ' : 'Questions'}</span>
                </div>
              </div>

              <button
                onClick={() => setActiveQuizModal(quiz)}
                className="btn-moeys-gold text-[10.5px] sm:text-xs py-2 px-3 sm:px-4 font-black w-full shadow-xs flex items-center justify-center gap-1 cursor-pointer mt-1 rounded-xl active:scale-95"
              >
                <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">{lang === 'km' ? 'ចាប់ផ្តើមធ្វើតេស្ត (Start Quiz)' : 'Start Mock Quiz'}</span>
                <span className="sm:hidden">{lang === 'km' ? 'ចាប់ផ្តើមតេស្ត' : 'Start'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Controls & Search */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#005baa]" />
            <span className="text-xs font-bold text-slate-800">តម្រងស្វែងរកវិញ្ញាសា (Search & View Controls):</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-bold">
              រកឃើញ <b className="text-[#005baa]">{filteredPapers.length}</b> វិញ្ញាសា
            </span>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-[#005baa] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === 'list' ? 'bg-white text-[#005baa] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Compact List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 text-xs font-bold">
          
          {/* Search Input */}
          <div className="sm:col-span-7 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="វាយពាក្យគន្លឹះ (ឧ. អក្សរសាស្ត្រ, ប្រវត្តិវិទ្យា, អាស៊ាន, លីមីត, ភូមិវិទ្យា)..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#005baa] focus:bg-white"
            />
          </div>

          {/* Subject Filter Dropdown */}
          <div className="sm:col-span-5">
            <select
              value={selectedSubjectKey}
              onChange={(e) => setSelectedSubjectKey(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 font-bold border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#005baa] cursor-pointer"
            >
              <option value="all">{t('allSubjects')}</option>
              <optgroup label="ថ្នាក់វិទ្យាសាស្ត្រសង្គម (Social Science)">
                <option value="khmer">អក្សរសាស្ត្រខ្មែរ (Khmer)</option>
                <option value="history">ប្រវត្តិវិទ្យា (History)</option>
                <option value="geography">ភូមិវិទ្យា (Geography)</option>
                <option value="civics">សីលធម៌-ពលរដ្ឋ (Civics)</option>
                <option value="math">គណិតវិទ្យាសង្គម (Social Math)</option>
                <option value="english">ភាសាអង់គ្លេស (English)</option>
              </optgroup>
              <optgroup label="ថ្នាក់វិទ្យាសាស្ត្រពិត (Science)">
                <option value="math">គណិតវិទ្យាវិទ្យាសាស្ត្រ (Science Math)</option>
                <option value="physics">រូបវិទ្យា (Physics)</option>
                <option value="chemistry">គីមីវិទ្យា (Chemistry)</option>
                <option value="biology">ជីវវិទ្យា (Biology)</option>
              </optgroup>
            </select>
          </div>

        </div>
      </div>

      {/* Download Toast Notification */}
      {downloadToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{downloadToast}</span>
          </div>
          <button onClick={() => setDownloadToast(null)} className="text-emerald-700 font-bold px-2 cursor-pointer">✕</button>
        </div>
      )}

      {/* Past Papers List / Grid */}
      <div className="space-y-4">
        {paginatedPapers.length === 0 ? (
          <div className="moeys-card p-10 text-center space-y-3 bg-white border-slate-200">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-700 text-sm">មិនមានវិញ្ញាសាស្របតាមតម្រងនេះទេ</h4>
            <p className="text-xs text-slate-500">សូមសាកល្បងជ្រើសរើសឆ្នាំ ផ្នែក ឬមុខវិជ្ជាផ្សេងទៀត។</p>
            <button
              onClick={() => { setSelectedStream('all'); setSelectedYear('all'); setSelectedSubjectKey('all'); setSearchQuery(''); }}
              className="btn-moeys-primary text-xs py-1.5 px-4 font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>កំណត់តម្រងឡើងវិញ (Reset Filters)</span>
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid Detailed View */
          <div className="grid grid-cols-2 gap-3 sm:gap-5">
            {paginatedPapers.map((paper) => {
              const isSocial = paper.stream === 'social';
              return (
                <div key={paper.id} className="p-3 sm:p-5 border border-slate-200 hover:border-blue-400/80 hover:shadow-xl space-y-2.5 sm:space-y-3.5 shadow-xs bg-white flex flex-col justify-between rounded-2xl sm:rounded-3xl transition-all duration-200">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-1 flex-wrap">
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        <span className="badge-moeys-gold text-[9px] sm:text-xs font-cinzel font-bold px-2 py-0.5 rounded-lg shadow-2xs">
                          {paper.year}
                        </span>
                        <span className={`text-[8px] sm:text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1 ${
                          isSocial 
                            ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                            : 'bg-blue-100 text-blue-900 border border-blue-300'
                        }`}>
                          {isSocial ? (
                            <Landmark className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-600 inline-block" />
                          ) : (
                            <Atom className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#005baa] inline-block" />
                          )}
                          <span>{isSocial ? (lang === 'km' ? 'សង្គម' : 'Social') : (lang === 'km' ? 'វិទ្យាសាស្ត្រ' : 'Science')}</span>
                        </span>
                      </div>
                      <span className="badge-moeys-blue text-[8.5px] sm:text-xs px-2 py-0.5 rounded-lg font-bold">
                        {paper.subject}
                      </span>
                    </div>

                    <h3 className="font-black text-xs sm:text-sm text-[#003366] leading-snug line-clamp-2">
                      {lang === 'km' ? paper.paperTitleKm : paper.paperTitleEn}
                    </h3>
                    <p className="text-[9.5px] sm:text-[11px] text-slate-500 line-clamp-1 font-medium">
                      {paper.duration} • {lang === 'km' ? `ពិន្ទុ ${paper.totalPoints}` : `${paper.totalPoints} pts`}
                    </p>

                    {/* Exercises Snippet */}
                    <div className="space-y-1 sm:space-y-1.5 pt-0.5 sm:pt-1">
                      {paper.exercises.slice(0, 2).map((ex, idx) => (
                        <div key={idx} className="bg-slate-50 p-2 sm:p-2.5 rounded-xl border border-slate-200/80 text-xs space-y-0.5">
                          <p className="font-bold text-[#003366] text-[9.5px] sm:text-[11px] truncate">
                            {lang === 'km' ? ex.titleKm : ex.titleEn}
                          </p>
                          <p className="text-slate-600 line-clamp-1 sm:line-clamp-2 leading-relaxed text-[8.5px] sm:text-[10px] font-medium">
                            {ex.problemText}
                          </p>
                        </div>
                      ))}
                      {paper.exercises.length > 2 && (
                        <p className="text-[8.5px] sm:text-[10px] text-slate-400 font-bold text-center pt-0.5">
                          {lang === 'km' ? `+ មាន ${paper.exercises.length - 2} សំណួរទៀតក្នុងវិញ្ញាសា` : `+ ${paper.exercises.length - 2} more problems included`}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-2 pt-2.5 border-t border-slate-100">
                    <button
                      onClick={() => setActiveSolutionModal(paper)}
                      className="bg-[#005baa] hover:bg-[#003876] text-white text-[10px] sm:text-xs py-2 px-2 sm:px-3 font-bold shadow-xs flex items-center justify-center gap-1 flex-1 cursor-pointer rounded-xl transition-colors active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="sm:hidden">{lang === 'km' ? 'មើលកំណែ' : 'Solution'}</span>
                      <span className="hidden sm:inline">{t('viewSolution') || (lang === 'km' ? 'មើលដំណោះស្រាយ' : 'View Solution')}</span>
                    </button>
                    <button
                      onClick={() => handleDownloadPdf(paper)}
                      className="bg-slate-100 hover:bg-slate-200 text-[#005baa] border border-slate-200 text-[10px] sm:text-xs py-2 px-2.5 cursor-pointer rounded-xl transition-colors"
                      title={lang === 'km' ? 'ទាញយកវិញ្ញាសា PDF ផ្លូវការ' : 'Download Official PDF Paper'}
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Compact Table / List View */
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="p-3">{lang === 'km' ? 'ឆ្នាំ (Year)' : 'Year'}</th>
                    <th className="p-3">{lang === 'km' ? 'ផ្នែក (Stream)' : 'Stream'}</th>
                    <th className="p-3">{lang === 'km' ? 'មុខវិជ្ជា (Subject)' : 'Subject'}</th>
                    <th className="p-3">{lang === 'km' ? 'ឈ្មោះវិញ្ញាសា (Exam Paper Title)' : 'Paper Title'}</th>
                    <th className="p-3 text-right">{lang === 'km' ? 'សកម្មភាព (Actions)' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedPapers.map((paper) => {
                    const isSocial = paper.stream === 'social';
                    return (
                      <tr key={paper.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="p-3 font-cinzel font-bold text-[#003366]">
                          {paper.year}
                        </td>
                        <td className="p-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${
                            isSocial ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'
                          }`}>
                            {isSocial ? <Landmark className="w-3 h-3 text-amber-600" /> : <Atom className="w-3 h-3 text-[#005baa]" />}
                            <span>{isSocial ? 'សង្គម' : 'វិទ្យាសាស្ត្រ'}</span>
                          </span>
                        </td>
                        <td className="p-3 font-bold text-slate-800">
                          {paper.subject}
                        </td>
                        <td className="p-3 font-semibold text-slate-700">
                          {lang === 'km' ? paper.paperTitleKm : paper.paperTitleEn}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setActiveSolutionModal(paper)}
                              className="btn-moeys-primary text-[11px] py-1 px-2.5 font-bold shadow-xs cursor-pointer"
                            >
                              <Eye className="w-3 h-3 inline mr-1" />
                              <span>មើលកំណែ</span>
                            </button>
                            <button
                              onClick={() => handleDownloadPdf(paper)}
                              className="btn-moeys-secondary text-[11px] py-1 px-2 cursor-pointer"
                            >
                              <Download className="w-3 h-3 text-[#005baa]" />
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
      </div>

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

      {/* Official Solution Key Modal */}
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
              {activeSolutionModal.exercises.map((ex, idx) => (
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
                onClick={() => handleDownloadPdf(activeSolutionModal)}
                className="btn-moeys-secondary text-xs py-2 px-4 font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#005baa]" />
                <span>ទាញយកជា PDF</span>
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

    </div>
  );
}
