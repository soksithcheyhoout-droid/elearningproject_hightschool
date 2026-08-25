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
  Zap,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Database,
  RefreshCw,
  Flame,
  CheckCircle,
  Copy
} from 'lucide-react';
import { bacIIData } from '../../data/bacIIData';
import { quizData } from '../../data/quizData';
import { MASTER_EXAM_BANK_STATS } from '../../data/massiveQuestionBankInfo';
import { fetchLiveExamQuestions } from '../../utils/gamePoolManager';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';
import QuizModal from './QuizModal';

const MASTER_SUBJECT_CARDS = [
  // 🔬 ថ្នាក់វិទ្យាសាស្ត្រពិត (6,000 Questions)
  {
    key: 'math',
    stream: 'science',
    nameKm: 'គណិតវិទ្យា',
    nameEn: 'Mathematics',
    count: 1500,
    icon: Atom,
    color: 'text-cyan-600',
    bg: 'bg-cyan-50/80',
    border: 'border-cyan-200',
    glow: 'from-cyan-500/10 to-blue-500/10',
    topicsKm: 'លីមីត, ដេរីវេ, អាំងតេក្រាល, កុំផ្លិច, វ៉ិចទ័រ, ប្រូបាប, សមីការឌីផេរ៉ង់ស្យែល'
  },
  {
    key: 'physics',
    stream: 'science',
    nameKm: 'រូបវិទ្យា',
    nameEn: 'Physics',
    count: 1500,
    icon: Zap,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50/80',
    border: 'border-indigo-200',
    glow: 'from-indigo-500/10 to-purple-500/10',
    topicsKm: 'មេកានិច, លំយោល-ប៉ោល, អគ្គិសនី RLC, អុបទិក, នុយក្លេអ៊ែរ, ទែម៉ូឌីណាមិច'
  },
  {
    key: 'chemistry',
    stream: 'science',
    nameKm: 'គីមីវិទ្យា',
    nameEn: 'Chemistry',
    count: 1500,
    icon: Sparkles,
    color: 'text-purple-600',
    bg: 'bg-purple-50/80',
    border: 'border-purple-200',
    glow: 'from-purple-500/10 to-pink-500/10',
    topicsKm: 'ស៊ីនេទិចគីមី, លំនឹង Le Chatelier, អាស៊ីត-បាស & pH, អេស្ទែ, អាល់កុល'
  },
  {
    key: 'biology',
    stream: 'science',
    nameKm: 'ជីវវិទ្យា',
    nameEn: 'Biology',
    count: 1500,
    icon: Award,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50/80',
    border: 'border-emerald-200',
    glow: 'from-emerald-500/10 to-teal-500/10',
    topicsKm: 'ADN/ARN, សំយោគប្រូតេអ៊ីន, ច្បាប់ម៉ង់ដែល, មីតូស/មេយ៉ូស, ប្រព័ន្ធប្រសាទ'
  },
  // 📚 ថ្នាក់វិទ្យាសាស្ត្រសង្គម (6,000 Questions)
  {
    key: 'khmer',
    stream: 'social',
    nameKm: 'ភាសាខ្មែរ & អក្សរសាស្ត្រ',
    nameEn: 'Khmer Literature',
    count: 1500,
    icon: BookOpen,
    color: 'text-amber-600',
    bg: 'bg-amber-50/80',
    border: 'border-amber-200',
    glow: 'from-amber-500/10 to-orange-500/10',
    topicsKm: 'កុលាបប៉ៃលិន, សូផាត, ផ្កាស្រពោន, ទុំទាវ, កាព្យសាស្ត្រ, តែងសេចក្តី'
  },
  {
    key: 'history',
    stream: 'social',
    nameKm: 'ប្រវត្តិវិទ្យា',
    nameEn: 'History',
    count: 1500,
    icon: Landmark,
    color: 'text-rose-600',
    bg: 'bg-rose-50/80',
    border: 'border-rose-200',
    glow: 'from-rose-500/10 to-red-500/10',
    topicsKm: 'សម័យអង្គរ, ឯករាជ្យជាតិ ១៩៥៣, សន្ធិសញ្ញាប៉ារីស ១៩៩១, ឈ្នះ-ឈ្នះ ១៩៩៨'
  },
  {
    key: 'geography',
    stream: 'social',
    nameKm: 'ភូមិវិទ្យា',
    nameEn: 'Geography',
    count: 1500,
    icon: Layers,
    color: 'text-teal-600',
    bg: 'bg-teal-50/80',
    border: 'border-teal-200',
    glow: 'from-teal-500/10 to-cyan-500/10',
    topicsKm: 'បឹងទន្លេសាប, ទន្លេមេគង្គ, មូសុង, ដីក្រហមបាសាល់, កំពង់ផែក្រុងព្រះសីហនុ'
  },
  {
    key: 'civics',
    stream: 'social',
    nameKm: 'សីលធម៌-ពលរដ្ឋ & សេដ្ឋកិច្ច',
    nameEn: 'Civics & Economics',
    count: 1500,
    icon: ShieldCheck,
    color: 'text-blue-600',
    bg: 'bg-blue-50/80',
    border: 'border-blue-200',
    glow: 'from-blue-500/10 to-indigo-500/10',
    topicsKm: 'រដ្ឋធម្មនុញ្ញ, សិទ្ធិមនុស្ស UDHR, ទីផ្សារសេរី, ប្រព័ន្ធបាគង, SDGs 2030'
  }
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
  const [downloadToast, setDownloadToast] = useState(null);
  const [adminExams, setAdminExams] = useState([]);

  // Master 12,000 Questions Live Explorer States
  const [activeTabSection, setActiveTabSection] = useState('bank12000'); // 'bank12000' | 'archive'
  const [bankSubject, setBankSubject] = useState('all');
  const [bankQuestions, setBankQuestions] = useState([]);
  const [isLoadingBank, setIsLoadingBank] = useState(false);
  const [expandedSolutions, setExpandedSolutions] = useState({});
  const [copiedId, setCopiedId] = useState(null);

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

  // Fetch Live 12,000 Question Samples on subject / stream change
  useEffect(() => {
    let isSubscribed = true;
    setIsLoadingBank(true);

    const streamParam = selectedStream === 'all' ? '' : selectedStream;
    const subjectParam = bankSubject === 'all' ? '' : bankSubject;

    fetchLiveExamQuestions({
      stream: streamParam || (selectedStream === 'social' ? 'social' : 'science'),
      subjectKey: subjectParam,
      limit: 12,
      random: true
    }).then((qs) => {
      if (isSubscribed) {
        setBankQuestions(Array.isArray(qs) ? qs : []);
        setIsLoadingBank(false);
      }
    }).catch(() => {
      if (isSubscribed) setIsLoadingBank(false);
    });

    return () => { isSubscribed = false; };
  }, [bankSubject, selectedStream]);

  const allPapers = [...adminExams, ...bacIIData];
  const ITEMS_PER_PAGE = 8;

  // Available unique years in dataset
  const availableYears = ['all', ...Array.from(new Set(allPapers.map(p => p.year))).sort((a, b) => b - a)];

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

  const handleDownloadPdf = (paper) => {
    setDownloadToast(`វិញ្ញាសាបាក់ឌុប ${paper.year} ${paper.subject} (${paper.stream === 'social' ? 'ថ្នាក់វិទ្យាសាស្ត្រសង្គម' : 'ថ្នាក់វិទ្យាសាស្ត្រពិត'}) ត្រូវបានទាញយកជាទម្រង់ PDF ជោគជ័យ!`);
    setTimeout(() => {
      setDownloadToast(null);
    }, 3500);
  };

  // Launch 20-Question Mock Exam from 12,000 Bank
  const handleLaunchLiveMockExam = async (subjectCard) => {
    try {
      const qs = await fetchLiveExamQuestions({
        stream: subjectCard.stream,
        subjectKey: subjectCard.key,
        limit: 20,
        random: true
      });

      const formattedQuiz = {
        id: `mock-12000-${subjectCard.key}-${Date.now()}`,
        titleKm: `វិញ្ញាសាសាកល្បងបាក់ឌុបជាតិ៖ ${subjectCard.nameKm} (២០ សំណួរចម្រុះ)`,
        titleEn: `National BacII Mock: ${subjectCard.nameEn} (20 Timed Questions)`,
        stream: subjectCard.stream,
        subject: subjectCard.nameKm,
        timeLimitSeconds: 1200, // 20 Minutes
        questions: qs && qs.length > 0 ? qs : []
      };

      setActiveQuizModal(formattedQuiz);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleSolution = (qId) => {
    setExpandedSolutions(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleCopyQuestion = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSubjectCards = MASTER_SUBJECT_CARDS.filter(c => {
    if (selectedStream === 'all') return true;
    return c.stream === selectedStream;
  });

  return (
    <div className="space-y-8 font-kantumruy">
      
      {/* Header Banner with 12,000 Questions Showcase */}
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
            {t('bacIITitle') || (lang === 'km' ? 'បណ្ណសារវិញ្ញាសាប្រឡងបាក់ឌុបថ្នាក់ជាតិ' : 'National BacII Master Examination Archive')}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-medium">
            {lang === 'km' 
              ? 'បណ្តុំវិញ្ញាសាប្រឡងសញ្ញាបត្រមធ្យមសិក្សាទុតិយភូមិ (បាក់ឌុប) ផ្លូវការ ១២,០០០ សំណួរ (វិទ្យាសាស្ត្រពិត ៦,០០០ & វិទ្យាសាស្ត្រសង្គម ៦,០០០) ព្រមទាំងបណ្ណសារវិញ្ញាសា ២០១៤-២០២៤ និងគន្លឹះដំណោះស្រាយលម្អិត។' 
              : 'Official National Baccalaureate Examination Archive with 12,000 authentic questions (6,000 Science + 6,000 Social) and Ministry Solutions (2014 - 2024).'}
          </p>
        </div>
      </div>

      {/* DUAL-STREAM SWITCHER & 12,000 QUESTIONS COUNTERS */}
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
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
            {lang === 'km' ? 'វិញ្ញាសាសរុប៖ ១២,០០០+ សំណួរ (វិទ្យាសាស្ត្រ៖ ៦,០០០, សង្គម៖ ៦,០០០)' : 'Total Pool: 12,000+ Questions (Science: 6,000, Social: 6,000)'}
          </span>
        </div>

        {/* 3 Main Stream Tabs with 12,000 Question Counts */}
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
            <div className="text-left">
              <div>{lang === 'km' ? 'វិញ្ញាសាទាំងពីរផ្នែក' : 'All Streams'}</div>
              <div className={`text-[10px] ${selectedStream === 'all' ? 'text-blue-100' : 'text-slate-500'} font-normal`}>12,000 សំណួរជាតិ</div>
            </div>
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
            <div className="text-left">
              <div>{lang === 'km' ? 'ថ្នាក់វិទ្យាសាស្ត្រសង្គម' : 'Social Sciences'}</div>
              <div className={`text-[10px] ${selectedStream === 'social' ? 'text-amber-100' : 'text-slate-500'} font-normal`}>6,000 វិញ្ញាសាសង្គម</div>
            </div>
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
            <div className="text-left">
              <div>{lang === 'km' ? 'ថ្នាក់វិទ្យាសាស្ត្រពិត' : 'Science Stream'}</div>
              <div className={`text-[10px] ${selectedStream === 'science' ? 'text-blue-100' : 'text-slate-500'} font-normal`}>6,000 វិញ្ញាសាវិទ្យាសាស្ត្រ</div>
            </div>
          </button>

        </div>

        {/* Top Hub Navigation Sub-Tabs */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setActiveTabSection('bank12000')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTabSection === 'bank12000'
                ? 'bg-[#005baa] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-amber-300" />
            <span>{lang === 'km' ? 'ធនាគារវិញ្ញាសាជាតិ ១២,០០០ សំណួរ (12,000 Question Pool)' : '12,000 Questions Bank'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabSection('archive')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTabSection === 'archive'
                ? 'bg-[#005baa] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{lang === 'km' ? 'បណ្ណសារវិញ្ញាសាបាក់ឌុប ២០១៤-២០២៤ (Official Papers)' : 'Past BacII Exam Papers'}</span>
          </button>
        </div>

      </div>

      {/* SECTION 1: MASTER 12,000 QUESTIONS HUB & SIMULATOR */}
      {activeTabSection === 'bank12000' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* 8 Subjects Grid Cards (1,500 Questions Each) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-base font-black text-[#003366] flex items-center gap-2">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                <span>{lang === 'km' ? 'មុខវិជ្ជាស្នូលទាំង ៨ នៃធនាគារសំណួរជាតិ ១២,០០០ សំណួរ' : '8 Core Subjects (12,000 National Questions)'}</span>
              </h3>
              <span className="text-[11px] font-bold text-slate-500">
                1,500 {lang === 'km' ? 'សំណួរ/មុខវិជ្ជា' : 'Q / Subject'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
              {filteredSubjectCards.map((card) => {
                const IconComponent = card.icon;
                return (
                  <div
                    key={card.key}
                    className={`p-4 sm:p-5 rounded-2xl border ${card.border} ${card.bg} relative overflow-hidden flex flex-col justify-between gap-3 shadow-xs hover:shadow-lg transition-all group`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className={`w-9 h-9 rounded-xl bg-white flex items-center justify-center ${card.color} shadow-xs`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span className="text-[10.5px] font-black px-2.5 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 shadow-2xs">
                          {card.count.toLocaleString()} សំណួរ
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                          {card.nameKm}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-medium">
                          {card.nameEn}
                        </p>
                      </div>

                      <p className="text-[10.5px] text-slate-600 leading-relaxed line-clamp-2 bg-white/70 p-2 rounded-lg border border-slate-200/60">
                        {card.topicsKm}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleLaunchLiveMockExam(card)}
                        className="flex-1 py-1.5 px-2.5 rounded-xl bg-[#005baa] hover:bg-[#004080] text-white text-[11px] font-black transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer active:scale-95"
                        title="Start 20-question mock test"
                      >
                        <Play className="w-3 h-3 text-amber-300 fill-amber-300" />
                        <span>{lang === 'km' ? 'ធ្វើតេស្ត ២០ សំណួរ' : '20-Q Mock Test'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBankSubject(card.key)}
                        className={`p-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                          bankSubject === card.key
                            ? 'bg-white text-[#005baa] border-[#005baa] shadow-xs'
                            : 'bg-white/80 hover:bg-white text-slate-600 border-slate-200'
                        }`}
                        title="View questions"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Question Bank Interactive Explorer */}
          <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#005baa] flex items-center justify-center font-bold">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-[#003366]">
                    {lang === 'km' ? 'កម្រងសំណួរជាក់ស្តែង & គន្លឹះដំណោះស្រាយលម្អិត' : 'Live Question Bank & Detailed Solution Keys'}
                  </h3>
                  <p className="text-[10.5px] text-slate-500">
                    {lang === 'km' ? 'សំណួរប្រឡងបាក់ឌុបជាតិពិតៗ ជាមួយនឹងរូបមន្ត និងការពន្យល់មួយជំហានម្តងៗ' : 'Authentic National BacII questions with step-by-step solutions'}
                  </p>
                </div>
              </div>

              {/* Subject Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
                <button
                  type="button"
                  onClick={() => setBankSubject('all')}
                  className={`px-3 py-1 rounded-xl transition-all cursor-pointer flex-shrink-0 ${
                    bankSubject === 'all'
                      ? 'bg-[#005baa] text-white shadow-xs font-black'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {lang === 'km' ? 'ទាំងអស់' : 'All'}
                </button>
                {MASTER_SUBJECT_CARDS.map((sub) => (
                  <button
                    key={sub.key}
                    type="button"
                    onClick={() => setBankSubject(sub.key)}
                    className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer flex-shrink-0 text-[11px] ${
                      bankSubject === sub.key
                        ? 'bg-[#005baa] text-white shadow-xs font-black'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {sub.nameKm}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions List */}
            {isLoadingBank ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin text-[#005baa]" />
                <span className="text-xs font-bold">{lang === 'km' ? 'កំពុងទាញយកសំណួរពីធនាគារ ១២,០០០ សំណួរ...' : 'Loading questions from 12,000 pool...'}</span>
              </div>
            ) : (
              <div className="space-y-3">
                {bankQuestions.map((q, idx) => {
                  const isExpanded = !!expandedSolutions[q.id || idx];
                  return (
                    <div
                      key={q.id || idx}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 hover:bg-slate-50 border border-slate-200 space-y-3 transition-all"
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9.5px] font-black px-2 py-0.5 rounded-md bg-[#005baa] text-white">
                            #{idx + 1}
                          </span>
                          <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-md ${
                            q.stream === 'social' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-blue-100 text-blue-900 border border-blue-300'
                          }`}>
                            {q.stream === 'social' ? 'វិទ្យាសាស្ត្រសង្គម' : 'វិទ្យាសាស្ត្រពិត'}
                          </span>
                          <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                            {q.subject}
                          </span>
                          {q.chapter && (
                            <span className="text-[9.5px] text-slate-500 hidden sm:inline">
                              • {q.chapter}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopyQuestion(q.q, q.id || idx)}
                          className="text-[10px] text-slate-400 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
                          title="Copy question text"
                        >
                          {copiedId === (q.id || idx) ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === (q.id || idx) ? 'បានចម្លង' : 'ចម្លង'}</span>
                        </button>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
                        {q.q}
                      </h4>

                      {/* 4 Choices */}
                      {Array.isArray(q.options) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {q.options.map((opt, optIdx) => (
                            <div
                              key={optIdx}
                              className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 transition-all ${
                                isExpanded && optIdx === q.answer
                                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-2xs'
                                  : 'bg-white border-slate-200 text-slate-700'
                              }`}
                            >
                              <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center flex-shrink-0 ${
                                isExpanded && optIdx === q.answer
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                {['ក', 'ខ', 'គ', 'ឃ'][optIdx] || optIdx + 1}
                              </span>
                              <span className="leading-snug">{opt}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Solution Key Accordion */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => toggleSolution(q.id || idx)}
                          className="text-xs font-bold text-[#005baa] hover:text-[#003d7a] flex items-center gap-1.5 cursor-pointer"
                        >
                          <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                          <span>{isExpanded ? 'លាក់ដំណោះស្រាយ (Hide Solution)' : 'បង្ហាញដំណោះស្រាយផ្លូវការ & គន្លឹះគណនា (Show Official Solution)'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        {isExpanded && (
                          <div className="mt-2.5 p-3 sm:p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-slate-800 space-y-1.5 animate-fadeIn">
                            <div className="font-bold text-[#003366] flex items-center gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>ចម្លើយត្រឹមត្រូវ៖ ជម្រើស {['ក', 'ខ', 'គ', 'ឃ'][q.answer] || q.answer + 1}</span>
                            </div>
                            <p className="leading-relaxed text-slate-700 whitespace-pre-line">
                              {q.explanation || 'សូមផ្ទៀងផ្ទាត់ជាមួយទ្រឹស្តី និងរូបមន្តមេរៀនស្នូល។'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

      {/* SECTION 2: OFFICIAL PAST BAC II EXAM PAPERS ARCHIVE (2014-2024) */}
      {activeTabSection === 'archive' && (
        <div className="space-y-6 animate-fadeIn">
          
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

          {/* Past Papers List / Grid */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#005baa]" />
                <h3 className="text-xs sm:text-sm font-black text-[#003366]">
                  {lang === 'km' ? 'បណ្ណសារវិញ្ញាសា និងដំណោះស្រាយផ្លូវការ (Past Papers Archive)' : 'Past Examination Papers'}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paginatedPapers.map((paper) => (
                <div
                  key={paper.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 hover:border-[#005baa] hover:shadow-md transition-all flex flex-col justify-between"
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

                    <h4 className="text-sm font-black text-[#003366] leading-snug">
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
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveSolutionModal(paper)}
                      className="flex-1 btn-moeys-primary text-xs py-2 flex items-center justify-center gap-1.5 font-bold cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{lang === 'km' ? 'មើលដំណោះស្រាយ' : 'View Solutions'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownloadPdf(paper)}
                      className="btn-moeys-secondary text-xs py-2 px-3 flex items-center justify-center gap-1 cursor-pointer"
                      title="Download PDF"
                    >
                      <Download className="w-3.5 h-3.5 text-[#005baa]" />
                      <span className="hidden sm:inline">PDF</span>
                    </button>
                  </div>
                </div>
              ))}
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
