import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  ChevronDown, 
  Phone, 
  Mail, 
  X, 
  Menu,
  Sparkles,
  BookOpen,
  GraduationCap,
  FileText,
  Bot,
  Globe,
  Gamepad2,
  MessageSquare,
  Library,
  FlaskConical,
  Flame,
  Award,
  Layers,
  ArrowRight,
  Bell,
  CheckCircle2,
  Calendar,
  LogOut,
  ShieldCheck,
  Crown,
  Heart,
  Send
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { curriculumData } from '../../data/curriculumData';
import { bacIIData } from '../../data/bacIIData';
import { libraryBooks } from '../../data/libraryBooks';
import api from '../../services/api';

export default function Navbar({ activeTab, setActiveTab, onOpenAITutor, onSelectSubject, adminSession, onOpenAdminLogin, onOpenDonation }) {
  const { lang, setLang, t } = useLanguage();
  const { student, selectedGrade, setSelectedGrade, logout } = useAuth();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const announcementContainerRef = useRef(null);
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);

  // Ultra-Smooth Scroll listener with requestAnimationFrame and hysteresis to prevent jitter
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          // Hysteresis deadzone: activate at > 40px, deactivate at < 10px to eliminate jump glitch
          setIsScrolled((prev) => {
            if (!prev && scrollY > 40) return true;
            if (prev && scrollY < 10) return false;
            return prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => {
          if (prev) {
            setSearchQuery('');
            return false;
          }
          setTimeout(() => searchInputRef.current?.focus(), 150);
          return true;
        });
      }
      if (e.key === 'Escape') {
        handleCloseSearch();
        setIsAnnouncementOpen(false);
        setIsUserMenuOpen(false);
        setActiveDropdown(null);
        setIsLangOpen(false);
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close popovers
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        handleCloseSearch();
      }
      if (announcementContainerRef.current && !announcementContainerRef.current.contains(e.target)) {
        setIsAnnouncementOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownEnter = (menuKey) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(menuKey);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleLanguageChange = (newLang) => {
    setLang(newLang);
    setIsLangOpen(false);
  };

  // Live Multi-Source Search Across the Entire Web App
  const searchResults = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const results = [];

    // 1. Curriculum Subjects & Lessons
    curriculumData.forEach((sub) => {
      if (sub.nameKm.toLowerCase().includes(q) || sub.nameEn.toLowerCase().includes(q)) {
        results.push({
          id: `sub-${sub.id}`,
          badge: 'មុខវិជ្ជាជាតិ',
          badgeColor: 'bg-blue-100 text-[#005baa] border border-blue-200',
          title: lang === 'km' ? sub.nameKm : sub.nameEn,
          subtitle: `ថ្នាក់ទី${sub.grade || '១២'} • ${sub.teacher || 'មេរៀនក្រសួង'}`,
          action: () => {
            if (onSelectSubject) onSelectSubject(sub);
            else setActiveTab('classroom');
            handleCloseSearch();
          }
        });
      }
      sub.chapters?.forEach((chap) => {
        chap.lessons?.forEach((les) => {
          if (les.titleKm.toLowerCase().includes(q) || les.titleEn.toLowerCase().includes(q)) {
            results.push({
              id: `les-${les.id}`,
              badge: 'មេរៀន',
              badgeColor: 'bg-cyan-100 text-cyan-800 border border-cyan-200',
              title: lang === 'km' ? les.titleKm : les.titleEn,
              subtitle: `${sub.nameKm.split(' ')[0]} • ${chap.titleKm}`,
              action: () => {
                if (onSelectSubject) onSelectSubject(sub);
                else setActiveTab('classroom');
                handleCloseSearch();
              }
            });
          }
        });
      });
    });

    // 2. Bac II Exam Papers
    bacIIData.forEach((exam) => {
      if (
        exam.paperTitleKm.toLowerCase().includes(q) ||
        exam.paperTitleEn.toLowerCase().includes(q) ||
        exam.subject.toLowerCase().includes(q) ||
        exam.year.includes(q)
      ) {
        results.push({
          id: `exam-${exam.id}`,
          badge: `បាក់ឌុប ${exam.year}`,
          badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
          title: lang === 'km' ? exam.paperTitleKm : exam.paperTitleEn,
          subtitle: `សម័យប្រឡង ${exam.year} • រយៈពេល ${exam.duration}`,
          action: () => {
            setActiveTab('bacii');
            handleCloseSearch();
          }
        });
      }
    });

    // 3. Digital Textbooks
    libraryBooks.forEach((book) => {
      if (
        book.titleKm.toLowerCase().includes(q) ||
        book.titleEn.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q)
      ) {
        results.push({
          id: `book-${book.id}`,
          badge: 'សៀវភៅពុម្ព',
          badgeColor: 'bg-amber-100 text-amber-900 border border-amber-200',
          title: lang === 'km' ? book.titleKm : book.titleEn,
          subtitle: `${book.author} • ${book.pages} ទំព័រ`,
          action: () => {
            setActiveTab('library');
            handleCloseSearch();
          }
        });
      }
    });

    return results.slice(0, 7);
  }, [searchQuery, lang, onSelectSubject, setActiveTab]);

  // Official MoEYS Gov Navigation Menu Structure (ដូច moeys.gov.kh)
  const navMenus = [
    {
      id: 'ministry',
      labelKm: 'ក្រសួង',
      labelEn: 'Ministry',
      tab: 'home',
      items: [
        { labelKm: 'ទំព័រដើមវិទ្យាល័យជាតិ', labelEn: 'National High School Portal', tab: 'home' },
        { labelKm: 'គណនីសិស្ស & សមិទ្ធផល', labelEn: 'Student Profile & Badges', tab: 'dashboard' },
        { labelKm: 'ជំនួយការគ្រូ AI ផ្លូវការ', labelEn: 'Official AI Tutor Assistant', action: onOpenAITutor }
      ]
    },
    {
      id: 'education',
      labelKm: 'អប់រំ',
      labelEn: 'Education',
      tab: 'courses',
      items: [
        { labelKm: 'កម្មវិធីសិក្សាថ្នាក់ទី១២ (វិទ្យាសាស្ត្រ)', labelEn: 'Grade 12 Science Stream', tab: 'courses' },
        { labelKm: 'កម្មវិធីសិក្សាថ្នាក់ទី១២ (សង្គម)', labelEn: 'Grade 12 Social Stream', tab: 'courses' },
        { labelKm: 'កម្មវិធីសិក្សាថ្នាក់ទី១០ & ទី១១', labelEn: 'Grade 10 & 11 Curriculum', tab: 'courses' },
        { labelKm: 'បន្ទប់ពិសោធន៍ STEM និម្មិត', labelEn: 'Virtual STEM Laboratory', tab: 'lab' }
      ]
    },
    {
      id: 'youth',
      labelKm: 'យុវជន',
      labelEn: 'Youth',
      tab: 'bacii',
      items: [
        { labelKm: 'វិញ្ញាសាប្រឡងបាក់ឌុបផ្លូវការ (Bac II)', labelEn: 'Official Bac II Exam Papers', tab: 'bacii' },
        { labelKm: 'អត្រាកំណែ & គន្លឹះដោះស្រាយ', labelEn: 'Exam Solutions & Marking Schemes', tab: 'bacii' },
        { labelKm: 'ការប្រកួតសំណួរ Speed Quiz', labelEn: '1v1 Speed Quiz Challenge', tab: 'playground' }
      ]
    },
    {
      id: 'sport',
      labelKm: 'កីឡា',
      labelEn: 'Sport',
      tab: 'playground',
      items: [
        { labelKm: 'សង្វៀនប្រកួត 1v1 Speed Quiz', labelEn: '1v1 Live Multiplayer Arena', tab: 'playground' },
        { labelKm: 'តារាងជើងឯកជាតិសិស្សឆ្នើម', labelEn: 'National Student Leaderboard', tab: 'playground' }
      ]
    },
    {
      id: 'media',
      labelKm: 'មជ្ឈមណ្ឌលព័ត៌មាន',
      labelEn: 'Media Center',
      tab: 'library',
      items: [
        { labelKm: 'បណ្ណាល័យសៀវភៅពុម្ពឌីជីថល', labelEn: 'Digital Textbooks Library', tab: 'library' },
        { labelKm: 'បន្ទប់ជជែកសិស្សានុសិស្សទូទាំងប្រទេស', labelEn: 'National Student Messenger', tab: 'chat' }
      ]
    }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] w-full select-none font-kantumruy transition-[background-color,box-shadow,border-color] duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-md border-b border-[#005baa]/20' 
          : 'bg-white border-b border-slate-200/80'
      }`}
    >
      
      {/* 1. Official MoTDAR Top Utility & Beta Testing Notice Ribbon */}
      <div 
        className="w-full bg-gradient-to-r from-[#00224d] via-[#004080] to-[#00224d] text-white py-1 px-3 sm:px-6 text-[10.5px] sm:text-[11px] font-medium select-none border-b border-amber-400/25 block"
      >
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full text-[9px] sm:text-[9.5px] font-black uppercase tracking-wider shadow-xs flex-shrink-0 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
              BETA TEST
            </span>
            <span className="text-amber-200 font-semibold truncate text-[10px] sm:text-[11px]">
              {lang === 'km' 
                ? 'ប្រព័ន្ធកំពុងស្ថិតក្នុងដំណាក់កាលសាកល្បងបច្ចេកវិទ្យា (Beta Phase) • រាល់មុខងារទាំងអស់បើកដំណើរការឥតគិតថ្លៃ!' 
                : 'National E-Learning platform is currently in Beta Testing • All premium features are active & free!'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[10px] sm:text-[10.5px] text-slate-200 flex-shrink-0">
            <a 
              href="tel:0977416126" 
              className="flex items-center gap-1 hover:text-amber-300 transition-colors font-mono font-bold"
              title="Call 097 741 6126"
            >
              <Phone className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300" />
              <span>097 741 6126</span>
            </a>
            <span className="text-white/30 hidden sm:inline">|</span>
            <a 
              href="https://t.me/kaixite" 
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1 hover:text-cyan-300 transition-colors font-mono font-bold"
              title="Telegram: @kaixite"
            >
              <Send className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-400" />
              <span>Telegram: @kaixite</span>
            </a>
            <span className="text-white/30 hidden md:inline">|</span>
            <a 
              href="mailto:soksithcheyhoout@gmail.com" 
              className="hidden sm:flex items-center gap-1 hover:text-amber-300 transition-colors font-mono"
              title="Email soksithcheyhoout@gmail.com"
            >
              <Mail className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300" />
              <span>soksithcheyhoout@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar with Grand 4K Emblem, Vibrant Blue Links & User Profile (PF) */}
      <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6 relative z-20">
        <div className="h-[74px] sm:h-[80px] flex items-center justify-between gap-1.5 sm:gap-3">
          
          {/* Official Ministry 4K Crest & High-End Royal Typography */}
          <div 
            onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="cursor-pointer group select-none flex items-center gap-1.5 sm:gap-2.5 transition-all duration-300 flex-shrink-0"
          >
            {/* Grand 4K Gold Angkor Emblem Crest */}
            <div className="w-9 h-9 sm:w-12 sm:h-12 flex items-center justify-center relative flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
              <img
                src="/assets/moeys-crest-transparent.png"
                alt="Ministry Official Crest"
                onError={(e) => { e.target.src = '/assets/moeys-custom-logo-transparent.png'; }}
                className="w-full h-full max-w-full max-h-full object-contain filter drop-shadow-md select-none"
              />
            </div>

            {/* High-End Official Ministry Typography */}
            <div className="hidden min-[460px]:flex flex-col justify-center leading-tight">
              <span className={`font-black tracking-tight transition-colors line-clamp-1 ${
                isScrolled 
                  ? 'text-[11px] sm:text-[13px] text-[#005baa] group-hover:text-[#002d62]' 
                  : 'text-[11px] sm:text-[13.5px] lg:text-[14.5px] text-[#002d62] group-hover:text-[#005baa] drop-shadow-2xs'
              }`}>
                {lang === 'km' ? 'ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ' : 'Ministry of Talent Dev'}
              </span>
              <span className={`font-extrabold tracking-wider uppercase font-cinzel whitespace-nowrap mt-0.5 transition-colors hidden md:block ${
                isScrolled 
                  ? 'text-[7px] sm:text-[8px] text-[#005baa]/80' 
                  : 'text-[7.5px] sm:text-[8.5px] text-amber-700 font-bold'
              }`}>
                MINISTRY OF TALENT DEVELOPMENT & ADVANCED RESEARCH
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links (Responsive: Scaled down on 1280px-1440px laptops, full on 2K+) */}
          <nav className="hidden xl:flex items-center gap-0.5 xl:gap-1 2xl:gap-2 whitespace-nowrap flex-shrink-0">
            {navMenus.map((menu, idx) => {
              const isMenuOpen = activeDropdown === menu.id;
              const isTabActive = activeTab === menu.tab;
              const label = lang === 'km' ? menu.labelKm : menu.labelEn;
              // On xl screens hide 4th and 5th items to prevent overcrowding
              const hideOnSmallDesktop = idx >= 3 ? 'hidden 2xl:flex' : 'flex';

              return (
                <div 
                  key={menu.id} 
                  className={`relative flex-shrink-0 ${hideOnSmallDesktop}`}
                  onMouseEnter={() => handleDropdownEnter(menu.id)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    type="button"
                    onClick={() => { setActiveTab(menu.tab); setActiveDropdown(null); }}
                    className={`px-2 xl:px-2.5 py-1.5 rounded-xl text-xs xl:text-[13px] font-bold transition-all duration-150 flex items-center gap-0.5 xl:gap-1 cursor-pointer whitespace-nowrap flex-shrink-0 ${
                      isTabActive
                        ? 'text-[#002d62] font-black bg-[#e0f0ff] shadow-2xs'
                        : 'text-[#005baa] hover:text-[#002d62] hover:bg-[#eaf4ff]'
                    }`}
                  >
                    <span>{label}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isMenuOpen ? 'rotate-180 text-[#002d62]' : 'text-[#005baa]/70'
                    }`} />
                  </button>

                  {/* Dropdown Menu Box */}
                  {isMenuOpen && (
                    <div className="absolute top-full left-0 mt-1.5 w-72 bg-white/95 backdrop-blur-2xl rounded-2xl border border-white/80 shadow-2xl p-2 z-50 animate-scale-up select-none ring-1 ring-black/5">
                      {menu.items.map((sub, sIdx) => (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => {
                            if (sub.action) sub.action();
                            else if (sub.tab) setActiveTab(sub.tab);
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#003876] hover:text-[#005baa] hover:bg-blue-50/90 transition-all flex items-center justify-between group cursor-pointer"
                        >
                          <span className="truncate">{lang === 'km' ? sub.labelKm : sub.labelEn}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#005baa]/60 group-hover:text-[#005baa] group-hover:translate-x-1 transition-transform" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Direct Messenger Link */}
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`px-2 xl:px-2.5 py-1.5 rounded-xl text-xs xl:text-[13px] font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                activeTab === 'chat' 
                  ? 'text-[#002d62] font-black bg-[#e0f0ff] shadow-2xs' 
                  : 'text-[#005baa] hover:text-[#002d62] hover:bg-[#eaf4ff]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#005baa]" />
              <span>{lang === 'km' ? 'បន្ទប់ជជែក' : 'Messenger'}</span>
            </button>
          </nav>

          {/* Right Utilities: Search, Language Switcher, and USER PROFILE (PF) */}
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 flex-shrink-0 ml-auto">
            
            {/* 🏛️ OFFICIAL MINISTRY NATIONAL FUND BUTTON */}
            <button
              type="button"
              onClick={onOpenDonation}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#002d62] via-[#004080] to-[#002d62] hover:from-[#00387a] hover:to-[#004d99] text-white border border-amber-400/60 hover:border-amber-300 shadow-xs hover:shadow-md font-black text-[11px] sm:text-xs transition-all duration-200 cursor-pointer active:scale-95 flex-shrink-0 select-none whitespace-nowrap ring-1 ring-amber-400/20"
              title={lang === 'km' ? 'មូលនិធិជាតិ MoTDAR គាំទ្រការអប់រំ និងទេពកោសល្យ' : 'MoTDAR National Education & Talent Fund'}
            >
              <div className="w-4 h-4 rounded-full bg-amber-400/20 border border-amber-400/50 flex items-center justify-center flex-shrink-0 p-0.5 shadow-2xs">
                <img 
                  src="/assets/moeys-crest-transparent.png" 
                  alt="MoEYS Emblem" 
                  className="w-full h-full object-contain filter drop-shadow-xs" 
                />
              </div>
              <span className="hidden md:inline font-extrabold text-amber-300 hover:text-amber-200 whitespace-nowrap tracking-tight">
                {lang === 'km' ? 'មូលនិធិជាតិ' : 'Edu Fund'}
              </span>
              <Heart className="w-3 h-3 fill-rose-500 text-rose-500 animate-pulse flex-shrink-0 -ml-0.5" />
            </button>
            
            {/* Search Icon Trigger (Attached Popover Live Search) */}
            <div ref={searchContainerRef} className="relative flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen);
                  if (!isSearchOpen) {
                    setTimeout(() => searchInputRef.current?.focus(), 50);
                  }
                }}
                className="p-1.5 sm:p-2 rounded-xl text-[#005baa] hover:text-[#002d62] hover:bg-blue-50/80 transition-colors cursor-pointer flex items-center justify-center flex-shrink-0"
                title="ស្វែងរក / Search (Ctrl+K)"
              >
                <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>

              {/* Floating Search Popover (Responsive Centered on Mobile, Attached on Desktop) */}
              {isSearchOpen && (
                <>
                  {/* Backdrop Scrim on Mobile */}
                  <div 
                    onClick={handleCloseSearch}
                    className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-[9998] sm:hidden"
                  />

                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="fixed sm:absolute top-16 sm:top-full left-3 right-3 sm:left-auto sm:right-0 mt-0 sm:mt-2 sm:w-96 max-h-[82vh] sm:max-h-[520px] bg-white rounded-3xl border border-slate-200 shadow-[0_25px_60px_rgba(0,30,80,0.22)] p-3.5 sm:p-4 z-[9999] animate-scale-up font-kantumruy select-none ring-1 ring-black/5 text-slate-800 flex flex-col"
                  >
                    {/* Header with Title and Close Button on Mobile */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 sm:hidden">
                      <span className="text-xs font-black text-[#003366] flex items-center gap-1.5">
                        <Search className="w-3.5 h-3.5 text-[#005baa]" />
                        <span>ស្វែងរកទិន្នន័យ (Search)</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleCloseSearch}
                        className="w-6 h-6 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
                        title="បិទ (Close)"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Search Input Box */}
                    <div className="relative mb-3 flex-shrink-0">
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder={lang === 'km' ? 'ស្វែងរកមេរៀន វិញ្ញាសា សៀវភៅពុម្ព...' : 'Search lessons, exams, books...'}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-10 pr-9 py-2 sm:py-2.5 text-xs text-slate-900 placeholder:text-slate-400 font-bold focus:outline-none focus:border-[#005baa] focus:bg-white focus:ring-2 focus:ring-[#005baa]/20 shadow-xs transition-all"
                        autoFocus
                      />
                      <Search className="w-4 h-4 text-[#005baa] absolute left-3.5 top-2.5 sm:top-3 pointer-events-none" />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 absolute right-2.5 top-2 cursor-pointer transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Live Results or Trending Queries */}
                    <div className="overflow-y-auto pr-1 flex-1 max-h-[360px] [scrollbar-width:thin]">
                      {searchQuery.trim() === '' ? (
                        <div className="space-y-2 pt-0.5">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                            ស្វែងរកពេញនិយម (Trending)
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {['គណិតវិទ្យា', 'បាក់ឌុប', 'រូបវិទ្យា', 'គីមីវិទ្យា', 'ភាសាខ្មែរ', 'ជីវវិទ្យា', 'STEM'].map((tag) => (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => setSearchQuery(tag)}
                                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-blue-50 border border-slate-200 text-[11px] font-bold text-slate-700 hover:text-[#005baa] hover:border-blue-300 transition-all cursor-pointer shadow-2xs hover:scale-105"
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div className="space-y-1.5 pt-0.5">
                          <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1 px-1 flex items-center justify-between">
                            <span>លទ្ធផលស្វែងរក ({searchResults.length})</span>
                          </div>
                          {searchResults.map((item) => (
                            <div
                              key={item.id}
                              onClick={item.action}
                              className="p-2.5 rounded-2xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200/90 hover:border-[#005baa]/50 cursor-pointer transition-all flex items-center justify-between group text-left shadow-2xs"
                            >
                              <div className="flex-1 min-w-0 pr-2">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <span className={`px-2 py-0.5 rounded-md text-[9.5px] font-black tracking-wide ${item.badgeColor}`}>
                                    {item.badge}
                                  </span>
                                </div>
                                <h5 className="text-xs sm:text-[13px] font-black text-[#003366] truncate group-hover:text-[#005baa] transition-colors">
                                  {item.title}
                                </h5>
                                <p className="text-[10.5px] text-slate-500 truncate mt-0.5">
                                  {item.subtitle}
                                </p>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#005baa] group-hover:translate-x-1 transition-all flex-shrink-0" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-4 text-center space-y-3">
                          <p className="text-xs text-slate-500 font-bold">
                            មិនមានទិន្នន័យសម្រាប់ "{searchQuery}"
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              if (onOpenAITutor) onOpenAITutor(searchQuery);
                              setIsSearchOpen(false);
                            }}
                            className="w-full py-2.5 px-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer border border-amber-400"
                          >
                            <Bot className="w-4 h-4 text-slate-950" />
                            <span>សួរគ្រូ AI អំពី៖ "{searchQuery}"</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Announcement Bell Trigger (សេចក្តីជូនដំណឹងផ្លូវការ) */}
            <div ref={announcementContainerRef} className="relative flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsAnnouncementOpen(!isAnnouncementOpen)}
                className="relative p-1.5 sm:p-2 rounded-xl text-[#005baa] hover:text-[#002d62] hover:bg-blue-50/80 transition-colors cursor-pointer flex items-center justify-center flex-shrink-0"
                title={lang === 'km' ? 'សេចក្តីជូនដំណឹងផ្លូវការ (Announcements)' : 'Official Ministry Announcements'}
              >
                <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                {/* Pulsing Unread Badge */}
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
              </button>

              {/* Floating Announcements Popover (Authentic MoEYS Official Bulletin Feed) */}
              {isAnnouncementOpen && (
                <>
                  {/* Backdrop Scrim on Mobile */}
                  <div 
                    onClick={() => setIsAnnouncementOpen(false)}
                    className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-[9998] sm:hidden"
                  />

                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="fixed sm:absolute top-16 sm:top-full left-3 right-3 sm:left-auto sm:right-0 mt-0 sm:mt-2 sm:w-[420px] max-h-[82vh] sm:max-h-[540px] bg-white rounded-3xl border border-slate-200 shadow-[0_25px_60px_rgba(0,30,80,0.22)] p-3.5 sm:p-4 z-[9999] animate-scale-up font-kantumruy select-none ring-1 ring-black/5 text-slate-800 flex flex-col"
                  >
                    
                    {/* Official Header with Angkor Crest & Close Button */}
                    <div className="p-3 bg-gradient-to-r from-[#003366] via-[#005baa] to-[#0284c7] text-white rounded-2xl flex items-center justify-between shadow-xs mb-3 flex-shrink-0">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center p-1 flex-shrink-0 shadow-inner">
                          <img 
                            src="/assets/moeys-crest-transparent.png" 
                            alt="MoEYS Crest"
                            className="w-full h-full object-contain filter drop-shadow-xs" 
                          />
                        </div>
                        <div className="flex flex-col text-left leading-tight min-w-0">
                          <h4 className="text-xs sm:text-[13px] font-black text-white truncate">
                            {lang === 'km' ? 'ព្រឹត្តិបត្រ & សេចក្តីជូនដំណឹងជាតិ' : 'National Official Bulletin'}
                          </h4>
                          <span className="text-[9px] text-amber-300 font-bold uppercase tracking-wider mt-0.5 truncate">
                            MoTDAR Digital Updates
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="text-[9px] font-black text-emerald-950 bg-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                          <span>ផ្សាយផ្ទាល់</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsAnnouncementOpen(false)}
                          className="w-6 h-6 rounded-lg bg-white/15 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer transition-colors"
                          title="បិទ (Close)"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Bulletin Items Feed */}
                    <div className="space-y-2.5 overflow-y-auto pr-1 flex-1 max-h-[380px] [scrollbar-width:thin]">
                      
                      {/* Official Bulletin 1: Bac II Exam */}
                      <div 
                        onClick={() => { setActiveTab('bacii'); setIsAnnouncementOpen(false); }}
                        className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200/90 hover:border-[#005baa]/50 cursor-pointer transition-all space-y-1.5 group shadow-2xs text-left"
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="px-2 py-0.5 rounded-md font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            លិខិតលេខ ០៨២ • សម័យប្រឡង
                          </span>
                          <span className="text-amber-700 font-bold flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-amber-600" />
                            ១០-១១ សីហា ២០២៦
                          </span>
                        </div>
                        <h5 className="text-xs sm:text-[13px] font-black text-[#003366] leading-snug group-hover:text-[#005baa] transition-colors">
                          កាលវិភាគសម័យប្រឡងសញ្ញាបត្រមធ្យមសិក្សាទុតិយភូមិ (បាក់ឌុប)
                        </h5>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          ក្រសួងបានប្រកាសជាផ្លូវការនូវកាលវិភាគប្រឡងថ្នាក់ជាតិ និងបើកឱ្យទាញយកកម្រងវិញ្ញាសាគំរូ និងអត្រាកំណែផ្លូវការ។
                        </p>
                        <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10.5px]">
                          <span className="text-slate-400 text-[10px]">មុននេះ ១ ម៉ោង</span>
                          <div className="flex items-center gap-1 font-bold text-[#005baa] group-hover:translate-x-0.5 transition-transform">
                            <span>ទាញយកវិញ្ញាសាផ្លូវការ</span>
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>

                      {/* Official Bulletin 2: 1v1 National Knowledge Cup */}
                      <div 
                        onClick={() => { setActiveTab('playground'); setIsAnnouncementOpen(false); }}
                        className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200/90 hover:border-[#005baa]/50 cursor-pointer transition-all space-y-1.5 group shadow-2xs text-left"
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="px-2 py-0.5 rounded-md font-bold bg-cyan-100 text-cyan-800 border border-cyan-200">
                            កម្មវិធីជាតិ • 1v1 Arena
                          </span>
                          <span className="text-cyan-700 font-bold bg-cyan-50 px-1.5 py-0.2 rounded">
                            រង្វាន់ +500 XP
                          </span>
                        </div>
                        <h5 className="text-xs sm:text-[13px] font-black text-[#003366] leading-snug group-hover:text-[#005baa] transition-colors">
                          ការប្រកួតប្រជែងចំណេះដឹងវិទ្យាសាស្ត្រ និងគណិតវិទ្យាថ្នាក់ជាតិ
                        </h5>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          សង្វៀនប្រកួតផ្ទាល់រវាងសិស្សវិទ្យាល័យទូទាំង ២៥ រាជធានី-ខេត្ត ដើម្បីឈ្នះពានរង្វាន់កិត្តិយស និងអាហារូបករណ៍។
                        </p>
                        <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10.5px]">
                          <span className="text-slate-400 text-[10px]">ម្សិលមិញ</span>
                          <div className="flex items-center gap-1 font-bold text-[#005baa] group-hover:translate-x-0.5 transition-transform">
                            <span>ចូលរួមប្រកួតសង្វៀន</span>
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>

                      {/* Official Bulletin 3: Digital Textbooks */}
                      <div 
                        onClick={() => { setActiveTab('library'); setIsAnnouncementOpen(false); }}
                        className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200/90 hover:border-[#005baa]/50 cursor-pointer transition-all space-y-1.5 group shadow-2xs text-left"
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="px-2 py-0.5 rounded-md font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            ធនធានសិក្សា • MoTDAR Library
                          </span>
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
                            PDF ស្តង់ដារ
                          </span>
                        </div>
                        <h5 className="text-xs sm:text-[13px] font-black text-[#003366] leading-snug group-hover:text-[#005baa] transition-colors">
                          ការដាក់ឱ្យទាញយកសៀវភៅពុម្ពឌីជីថលថ្នាក់ទី១០-១២ កម្រិតខ្ពស់
                        </h5>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          សៀវភៅពុម្ពផ្លូវការស្របតាមកម្មវិធីសិក្សាជាតិ អាចអាន និងទាញយកទុកប្រើប្រាស់ដោយឥតគិតថ្លៃ។
                        </p>
                        <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10.5px]">
                          <span className="text-slate-400 text-[10px]">២ ថ្ងៃមុន</span>
                          <div className="flex items-center gap-1 font-bold text-[#005baa] group-hover:translate-x-0.5 transition-transform">
                            <span>បើកបណ្ណាល័យសៀវភៅ</span>
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>
                </>
              )}
            </div>

            {/* Language Switcher Dropdown (En ▾ / Kh ▾) */}
            <div className="relative flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-xl border border-[#005baa]/30 hover:border-[#005baa] text-[11px] sm:text-xs font-black text-[#005baa] hover:text-[#002d62] hover:bg-blue-50/80 transition-all flex items-center gap-0.5 sm:gap-1 cursor-pointer shadow-2xs whitespace-nowrap flex-shrink-0"
              >
                <span>{lang === 'km' ? 'Kh' : 'En'}</span>
                <ChevronDown className="w-3 h-3 text-[#005baa]/70" />
              </button>

              {isLangOpen && (
                <div className="absolute top-full right-0 mt-1.5 w-32 bg-white/95 backdrop-blur-2xl rounded-2xl border border-white/80 shadow-2xl p-1.5 z-50 animate-scale-up select-none ring-1 ring-black/5">
                  <button
                    type="button"
                    onClick={() => handleLanguageChange('km')}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-bold text-left flex items-center gap-2 cursor-pointer transition-colors ${
                      lang === 'km' ? 'bg-[#005baa] text-white shadow-xs' : 'text-[#003876] hover:bg-blue-50/80 hover:text-[#005baa]'
                    }`}
                  >
                    <span>🇰🇭</span>
                    <span>ភាសាខ្មែរ</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLanguageChange('en')}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-bold text-left flex items-center gap-2 cursor-pointer transition-colors ${
                      lang === 'en' ? 'bg-[#005baa] text-white shadow-xs' : 'text-[#003876] hover:bg-blue-50/80 hover:text-[#005baa]'
                    }`}
                  >
                    <span>🇬🇧</span>
                    <span>English</span>
                  </button>
                </div>
              )}
            </div>

            {/* USER PROFILE SUITE (PF + Streak + XP) - Guaranteed 0% Clipping on all screen sizes */}
            <div className="flex items-center gap-1 sm:gap-2 pl-1 sm:pl-2 border-l border-slate-200 flex-shrink-0 mr-0.5 sm:mr-2">
              
              {/* Streak Badge */}
              <div 
                className="hidden 2xl:flex items-center gap-1.5 bg-amber-50/90 border border-amber-300/90 px-2 py-1 rounded-xl shadow-2xs cursor-help hover:scale-105 transition-transform flex-shrink-0"
                title={`${student?.streakDays || 14} ថ្ងៃបន្តបន្ទាប់`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse fill-amber-500/20" />
                <span className="text-xs font-black text-amber-900 font-cinzel">{student?.streakDays || 14}</span>
                <span className="text-[9px] text-amber-800 font-bold hidden 2xl:inline">{lang === 'km' ? 'ថ្ងៃ' : 'd'}</span>
              </div>

              {/* XP Badge */}
              <div 
                className="hidden xl:flex items-center gap-1.5 bg-blue-50/90 border border-blue-300/90 px-2 py-1 rounded-xl shadow-2xs hover:scale-105 transition-transform flex-shrink-0"
                title={`${(student?.xp || 3568).toLocaleString()} XP`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#005baa]" />
                <span className="text-xs font-black text-[#003876] font-cinzel">{(student?.xp || 3568).toLocaleString()}</span>
                <span className="text-[9px] text-blue-800 font-black hidden 2xl:inline">XP</span>
              </div>

              {/* User Profile Avatar Card with Interactive Dropdown Menu */}
              <div ref={userMenuRef} className="relative flex-shrink-0">
                <button 
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center gap-1.5 sm:gap-2 cursor-pointer group select-none flex-shrink-0 p-1 sm:px-2.5 sm:py-1 rounded-2xl border transition-all ${
                    isUserMenuOpen 
                      ? 'bg-blue-100 border-[#005baa] shadow-sm ring-2 ring-[#005baa]/20' 
                      : 'bg-gradient-to-r from-blue-50/90 to-indigo-50/80 hover:from-blue-100 hover:to-indigo-100 border-blue-200/80 hover:border-blue-300 shadow-2xs'
                  }`}
                  title={`គណនីសិស្ស: ${student?.name || student?.username || 'riki.dev'}`}
                >
                  <div className="relative flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center">
                    {/* Base Avatar Circle */}
                    <div className={`w-[80%] h-[80%] rounded-full overflow-hidden shadow-xs bg-slate-900 ${
                      student?.avatarFrame ? '' : 'ring-2 ring-[#005baa]/30 group-hover:ring-[#005baa]'
                    }`}>
                      <img 
                        src={api.formatAvatarUrl(student?.avatar)} 
                        alt={student?.name || 'riki.dev'} 
                        onError={(e) => { e.target.src = '/assets/anime/boys/boy_1.png'; }}
                        className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-all"
                      />
                    </div>

                    {/* Equipped Avatar Frame Overlay */}
                    {student?.avatarFrame && (
                      <img 
                        src={student.avatarFrame} 
                        alt="Avatar Frame" 
                        className="absolute inset-0 w-full h-full object-contain pointer-events-none scale-125 z-10 filter drop-shadow-sm" 
                        onError={(e) => {
                          const current = e.currentTarget.src;
                          if (current.endsWith('.png')) e.currentTarget.src = current.replace('.png', '.webp');
                          else if (current.endsWith('.webp')) e.currentTarget.src = current.replace('.webp', '.png');
                        }}
                      />
                    )}

                    {/* Online Status Dot */}
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white shadow-xs z-20" />
                  </div>

                  <div className="hidden min-[600px]:flex flex-col text-left leading-tight min-w-0 max-w-[120px] sm:max-w-[150px]">
                    <span className="font-black text-xs sm:text-[12.5px] text-[#00478f] group-hover:text-[#002d62] transition-colors truncate block">
                      {student?.name || student?.username || 'riki.dev'}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                      <span>Lv.{student?.level || 12}</span>
                      <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180 text-[#005baa]' : ''}`} />
                    </span>
                  </div>
                </button>

                {/* 🌟 RICH USER ACCOUNT DROPDOWN MENU */}
                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white/95 backdrop-blur-2xl rounded-2xl border border-blue-100 shadow-[0_20px_50px_rgba(0,35,80,0.2)] p-3.5 z-50 animate-scale-up font-kantumruy select-none ring-1 ring-black/5 text-slate-800">
                    
                    {/* User Card Header */}
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-blue-50/80 border border-blue-100 mb-2.5">
                      <div className="relative flex-shrink-0 w-12 h-12 flex items-center justify-center">
                        <div className="w-[82%] h-[82%] rounded-full overflow-hidden bg-slate-900 shadow-sm">
                          <img 
                            src={api.formatAvatarUrl(student?.avatar)} 
                            alt={student?.name || 'riki.dev'} 
                            onError={(e) => { e.target.src = '/assets/anime/boys/boy_1.png'; }}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {student?.avatarFrame && (
                          <img 
                            src={student.avatarFrame} 
                            alt="Frame" 
                            className="absolute inset-0 w-full h-full object-contain pointer-events-none scale-125 z-10 filter drop-shadow-xs" 
                            onError={(e) => {
                              const current = e.currentTarget.src;
                              if (current.endsWith('.png')) e.currentTarget.src = current.replace('.png', '.webp');
                              else if (current.endsWith('.webp')) e.currentTarget.src = current.replace('.webp', '.png');
                            }}
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1 text-left">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-sm text-[#002d62] truncate">
                            {student?.name || 'riki.dev'}
                          </h4>
                          <span className="px-1.5 py-0.2 text-[9px] font-black bg-blue-600 text-white rounded-full">
                            Lv.{student?.level || 12}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">
                          {student?.email || student?.studentId || 'BACII-2026-STUDENT'}
                        </p>
                        <p className="text-[10px] text-amber-700 font-bold mt-0.5">
                          ⭐ {(student?.xp || 3568).toLocaleString()} XP • {student?.streakDays || 14} ថ្ងៃ Streak
                        </p>
                      </div>
                    </div>

                    {/* Quick Menu Actions */}
                    <div className="space-y-1 py-1 border-b border-slate-100 mb-2">
                      <button
                        type="button"
                        onClick={() => { setActiveTab('dashboard'); setIsUserMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="w-full px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-[#005baa] hover:bg-blue-50/80 transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <BookOpen className="w-4 h-4 text-[#005baa]" />
                          <span>{lang === 'km' ? 'ព័ត៌មានរូបសង្ខេប & ពិន្ទុ' : 'My Dashboard & Profile'}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#005baa] group-hover:translate-x-1 transition-transform" />
                      </button>

                      <button
                        type="button"
                        onClick={() => { setActiveTab('playground'); setIsUserMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="w-full px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-amber-600 hover:bg-amber-50/80 transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <Gamepad2 className="w-4 h-4 text-amber-500" />
                          <span>{lang === 'km' ? 'សង្វៀនហាត់សម 1v1 Arena' : 'Game & Quiz Arena'}</span>
                        </div>
                        <span className="text-[10px] font-black text-amber-600 bg-amber-100 px-1.5 py-0.2 rounded-md">+500 XP</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => { setActiveTab('chat'); setIsUserMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="w-full px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-cyan-600 hover:bg-cyan-50/80 transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <MessageSquare className="w-4 h-4 text-cyan-500" />
                          <span>{lang === 'km' ? 'បន្ទប់ជជែកជាតិ Messenger' : 'National Student Chat'}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-1 transition-transform" />
                      </button>

                      {/* 🛡️ Only display Super Admin Portal link if the current user is an Admin or in an active Admin session */}
                      {Boolean(adminSession || student?.role === 'superadmin' || student?.isAdmin) && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onOpenAdminLogin?.();
                          }}
                          className="w-full px-3 py-2 rounded-xl text-xs font-bold text-amber-700 hover:bg-amber-50/80 transition-all flex items-center justify-between group cursor-pointer border border-amber-200/60"
                        >
                          <div className="flex items-center gap-2.5">
                            <ShieldCheck className="w-4 h-4 text-amber-600" />
                            <span>{adminSession ? (lang === 'km' ? '👑 ផ្ទាំងគ្រប់គ្រង Super Admin' : '👑 Super Admin Dashboard') : (lang === 'km' ? 'ចូលគណនី Super Admin' : 'Super Admin Login')}</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-amber-500 group-hover:translate-x-1 transition-transform" />
                        </button>
                      )}
                    </div>

                    {/* 🚪 PROMINENT LOGOUT BUTTON INSIDE ACCOUNT MENU */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 hover:border-rose-600 text-xs font-black transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-2 cursor-pointer group"
                    >
                      <LogOut className="w-4 h-4 text-rose-600 group-hover:text-white transition-colors" />
                      <span>{lang === 'km' ? 'ចាកចេញពីគណនី (Sign Out / Logout)' : 'Sign Out / Logout'}</span>
                    </button>

                  </div>
                )}
              </div>

            </div>

            {/* Mobile Hamburger Button */}
            <div ref={mobileMenuRef} className="lg:hidden relative">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-1.5 sm:p-2 rounded-xl transition-all cursor-pointer border ${
                  mobileMenuOpen 
                    ? 'bg-[#005baa] text-white border-[#005baa] shadow-xs' 
                    : 'bg-slate-100 hover:bg-slate-200 text-[#003876] border-slate-200'
                }`}
                title="Menu"
              >
                {mobileMenuOpen ? <X className="w-4.5 h-4.5 sm:w-5 sm:h-5" /> : <Menu className="w-4.5 h-4.5 sm:w-5 sm:h-5" />}
              </button>

              {/* Backdrop Scrim */}
              {mobileMenuOpen && (
                <div 
                  onClick={() => setMobileMenuOpen(false)}
                  className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-[9998] lg:hidden"
                />
              )}

              {/* Mobile Dropdown Menu - Sleek Compact App Launcher Card */}
              {mobileMenuOpen && (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-full mt-2 w-60 max-w-[calc(100vw-24px)] bg-white border border-slate-200 rounded-2xl p-2 shadow-2xl z-[9999] animate-scale-up select-none ring-1 ring-black/10 font-kantumruy"
                >
                  {/* Top Header with Close Button and Lang Toggle */}
                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleLanguageChange('km')}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${lang === 'km' ? 'bg-[#005baa] text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                      >
                        🇰🇭 KH
                      </button>
                      <span className="text-slate-300 text-[10px]">|</span>
                      <button
                        type="button"
                        onClick={() => handleLanguageChange('en')}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${lang === 'en' ? 'bg-[#005baa] text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                      >
                        🇬🇧 EN
                      </button>
                    </div>

                    {/* ✕ Direct Close Button */}
                    <button
                      type="button"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-6 h-6 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
                      title="បិទ (Close Menu)"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 2-Column Compact Grid with Game Arena */}
                  <div className="grid grid-cols-2 gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
                      className={`p-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        activeTab === 'home' ? 'bg-[#005baa] text-white shadow-xs' : 'text-slate-700 bg-slate-50 hover:bg-blue-50 hover:text-[#005baa]'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{lang === 'km' ? 'ក្រសួង' : 'Ministry'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setActiveTab('courses'); setMobileMenuOpen(false); }}
                      className={`p-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        activeTab === 'courses' ? 'bg-[#005baa] text-white shadow-xs' : 'text-slate-700 bg-slate-50 hover:bg-blue-50 hover:text-[#005baa]'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{lang === 'km' ? 'កម្មវិធីសិក្សា' : 'Lessons'}</span>
                    </button>

                    {/* 🎮 ACADEMIC GAME ARENA */}
                    <button
                      type="button"
                      onClick={() => { setActiveTab('playground'); setMobileMenuOpen(false); }}
                      className={`p-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                        activeTab === 'playground' 
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-600 shadow-xs' 
                          : 'text-amber-700 bg-amber-50/80 hover:bg-amber-100/90 border-amber-200/80'
                      }`}
                    >
                      <Gamepad2 className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 animate-pulse" />
                      <span className="truncate font-black">{lang === 'km' ? '🎮 សង្វៀនហ្គេម' : '🎮 Game Arena'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setActiveTab('bacii'); setMobileMenuOpen(false); }}
                      className={`p-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        activeTab === 'bacii' ? 'bg-[#005baa] text-white shadow-xs' : 'text-slate-700 bg-slate-50 hover:bg-blue-50 hover:text-[#005baa]'
                      }`}
                    >
                      <GraduationCap className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{lang === 'km' ? 'បាក់ឌុប' : 'Bac II'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setActiveTab('chat'); setMobileMenuOpen(false); }}
                      className={`p-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        activeTab === 'chat' ? 'bg-[#005baa] text-white shadow-xs' : 'text-slate-700 bg-slate-50 hover:bg-blue-50 hover:text-[#005baa]'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-cyan-600 flex-shrink-0" />
                      <span className="truncate">{lang === 'km' ? 'ជជែកជាតិ' : 'Chat'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setActiveTab('lab'); setMobileMenuOpen(false); }}
                      className={`p-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        activeTab === 'lab' ? 'bg-[#005baa] text-white shadow-xs' : 'text-slate-700 bg-slate-50 hover:bg-blue-50 hover:text-[#005baa]'
                      }`}
                    >
                      <FlaskConical className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                      <span className="truncate">{lang === 'km' ? 'STEM Lab' : 'STEM Lab'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setActiveTab('library'); setMobileMenuOpen(false); }}
                      className={`p-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        activeTab === 'library' ? 'bg-[#005baa] text-white shadow-xs' : 'text-slate-700 bg-slate-50 hover:bg-blue-50 hover:text-[#005baa]'
                      }`}
                    >
                      <Library className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                      <span className="truncate">{lang === 'km' ? 'សៀវភៅពុម្ព' : 'E-Books'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { onOpenAITutor(); setMobileMenuOpen(false); }}
                      className="p-2 rounded-xl font-bold flex items-center gap-1.5 text-amber-900 bg-amber-50/90 hover:bg-amber-100 transition-all cursor-pointer"
                    >
                      <Bot className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                      <span className="truncate">{lang === 'km' ? 'សួរគ្រូ AI' : 'Ask AI'}</span>
                    </button>
                  </div>

                  <div className="pt-1.5 mt-1.5 border-t border-slate-100 flex items-center gap-1">
                    {/* Compact Sponsor Developer Link */}
                    <button 
                      type="button"
                      onClick={() => { onOpenDonation(); setMobileMenuOpen(false); }}
                      className="flex-1 py-1.5 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer"
                      title="ឧបត្ថម្ភអ្នកបង្កើត"
                    >
                      <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                      <span>ឧបត្ថម្ភ DEV</span>
                    </button>

                    {/* Compact Sign Out */}
                    <button 
                      type="button"
                      onClick={() => { logout(); setMobileMenuOpen(false); }}
                      className="py-1.5 px-2.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 font-bold text-[10px] rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      title="ចាកចេញពីគណនី"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>ចាកចេញ</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

    </header>
  );
}
