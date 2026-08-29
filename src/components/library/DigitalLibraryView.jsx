import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  BookOpen, 
  Search, 
  Eye, 
  Star, 
  FileText, 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Building2, 
  ShieldCheck,
  Bookmark,
  Sun,
  Moon,
  GraduationCap,
  Layers,
  Award
} from 'lucide-react';
import { libraryBooks } from '../../data/libraryBooks';
import { useLanguage } from '../../context/LanguageContext';

// Helper to determine authentic MoEYS cover styling & vector illustrations
function getBookCoverDesign(cat = '', title = '') {
  const c = cat.toLowerCase();
  const t = title.toLowerCase();

  if (c.includes('math') || t.includes('គណិត')) {
    return {
      theme: 'math',
      primaryColor: '#003366',
      bgGradient: 'from-[#002244] via-[#003876] to-[#004b93]',
      accentColor: '#38bdf8',
      titleKm: 'គណិតវិទ្យា',
      titleEn: 'MATHEMATICS',
      streamKm: t.includes('សង្គម') ? 'ថ្នាក់វិទ្យាសាស្ត្រសង្គម' : 'ថ្នាក់វិទ្យាសាស្ត្រពិត (កម្រិតខ្ពស់)',
      badgeText: 'MATHEMATICS',
      patternType: 'math'
    };
  }
  if (c.includes('physic') || t.includes('រូបវិទ្យា')) {
    return {
      theme: 'physics',
      primaryColor: '#0369a1',
      bgGradient: 'from-[#082f49] via-[#0369a1] to-[#0284c7]',
      accentColor: '#7dd3fc',
      titleKm: 'រូបវិទ្យា',
      titleEn: 'PHYSICS',
      streamKm: 'ថ្នាក់វិទ្យាសាស្ត្រពិត (ទ្រឹស្តី និងពិសោធន៍)',
      badgeText: 'PHYSICS',
      patternType: 'physics'
    };
  }
  if (c.includes('chem') || t.includes('គីមី')) {
    return {
      theme: 'chem',
      primaryColor: '#047857',
      bgGradient: 'from-[#022c22] via-[#065f46] to-[#059669]',
      accentColor: '#6ee7b7',
      titleKm: 'គីមីវិទ្យា',
      titleEn: 'CHEMISTRY',
      streamKm: 'ថ្នាក់វិទ្យាសាស្ត្រពិត (ស៊ីនេទិច និងសរីរាង្គ)',
      badgeText: 'CHEMISTRY',
      patternType: 'chem'
    };
  }
  if (c.includes('bio') || t.includes('ជីវវិទ្យា')) {
    return {
      theme: 'bio',
      primaryColor: '#15803d',
      bgGradient: 'from-[#052e16] via-[#166534] to-[#15803d]',
      accentColor: '#86efac',
      titleKm: 'ជីវវិទ្យា',
      titleEn: 'BIOLOGY',
      streamKm: 'ថ្នាក់វិទ្យាសាស្ត្រពិត (ហ្សែន និងម៉ូលេគុល ADN)',
      badgeText: 'BIOLOGY',
      patternType: 'bio'
    };
  }
  if (c.includes('khmer') || t.includes('ខ្មែរ') || t.includes('អក្សរ')) {
    return {
      theme: 'khmer',
      primaryColor: '#9a3412',
      bgGradient: 'from-[#431407] via-[#7c2d12] to-[#9a3412]',
      accentColor: '#fde68a',
      titleKm: 'អក្សរសាស្ត្រខ្មែរ',
      titleEn: 'KHMER LITERATURE',
      streamKm: 'អក្សរសិល្ប៍ តែងសេចក្តី & វេយ្យាករណ៍',
      badgeText: 'KHMER',
      patternType: 'khmer'
    };
  }
  if (c.includes('hist') || t.includes('ប្រវត្តិ')) {
    return {
      theme: 'hist',
      primaryColor: '#991b1b',
      bgGradient: 'from-[#450a0a] via-[#7f1d1d] to-[#991b1b]',
      accentColor: '#fca5a5',
      titleKm: 'ប្រវត្តិវិទ្យា',
      titleEn: 'HISTORY',
      streamKm: 'ប្រវត្តិសាស្ត្រកម្ពុជា និងពិភពលោក',
      badgeText: 'HISTORY',
      patternType: 'hist'
    };
  }
  if (c.includes('geo') || t.includes('ភូមិ')) {
    return {
      theme: 'geo',
      primaryColor: '#0e7490',
      bgGradient: 'from-[#083344] via-[#155e75] to-[#0e7490]',
      accentColor: '#a5f3fc',
      titleKm: 'ភូមិវិទ្យា',
      titleEn: 'GEOGRAPHY',
      streamKm: 'ភូមិសាស្ត្ររូបវន្ត និងសេដ្ឋកិច្ចកម្ពុជា',
      badgeText: 'GEOGRAPHY',
      patternType: 'geo'
    };
  }
  if (c.includes('civic') || t.includes('សីលធម៌') || t.includes('ពលរដ្ឋ')) {
    return {
      theme: 'civics',
      primaryColor: '#4338ca',
      bgGradient: 'from-[#1e1b4b] via-[#3730a3] to-[#4338ca]',
      accentColor: '#c7d2fe',
      titleKm: 'សីលធម៌-ពលរដ្ឋ',
      titleEn: 'MORAL & CIVICS',
      streamKm: 'រដ្ឋធម្មនុញ្ញ សិទ្ធិមនុស្ស និងនីតិរដ្ឋ',
      badgeText: 'CIVICS',
      patternType: 'civics'
    };
  }
  if (c.includes('eng') || t.includes('english') || t.includes('អង់គ្លេស')) {
    return {
      theme: 'english',
      primaryColor: '#be185d',
      bgGradient: 'from-[#500724] via-[#831843] to-[#9d174d]',
      accentColor: '#fbcfe8',
      titleKm: 'ភាសាអង់គ្លេស',
      titleEn: 'ENGLISH FOR CAMBODIA',
      streamKm: 'Secondary & High School English',
      badgeText: 'ENGLISH',
      patternType: 'english'
    };
  }
  if (c.includes('exam') || t.includes('បាក់ឌុប') || t.includes('និទ្ទេស')) {
    return {
      theme: 'exam',
      primaryColor: '#b45309',
      bgGradient: 'from-[#451a03] via-[#78350f] to-[#b45309]',
      accentColor: '#fef08a',
      titleKm: 'កម្រងវិញ្ញាសាបាក់ឌុប',
      titleEn: 'BAC II MASTER COMPENDIUM',
      streamKm: 'គន្លឹះដោះស្រាយយកនិទ្ទេស A',
      badgeText: 'EXAM PREP',
      patternType: 'exam'
    };
  }
  if (c.includes('summary') || t.includes('រូបមន្ត')) {
    return {
      theme: 'summary',
      primaryColor: '#6b21a8',
      bgGradient: 'from-[#3b0764] via-[#581c87] to-[#6b21a8]',
      accentColor: '#e9d5ff',
      titleKm: 'រូបមន្តសង្ខេបបាក់ឌុប',
      titleEn: 'FORMULA CHEAT SHEET',
      streamKm: 'រូបមន្តគន្លឹះត្រូវចាំគ្រប់មុខវិជ្ជា',
      badgeText: 'FORMULAS',
      patternType: 'summary'
    };
  }
  if (c.includes('stem') || t.includes('python') || t.includes('កូដ')) {
    return {
      theme: 'stem',
      primaryColor: '#3730a3',
      bgGradient: 'from-[#0f172a] via-[#1e1b4b] to-[#312e81]',
      accentColor: '#d8b4fe',
      titleKm: 'វិទ្យាសាស្ត្រ STEM',
      titleEn: 'COMPUTER SCIENCE & PYTHON',
      streamKm: 'កូដកុំព្យូទ័រ & ក្បួនដោះស្រាយបញ្ហា',
      badgeText: 'STEM',
      patternType: 'stem'
    };
  }
  if (c.includes('scholarship') || t.includes('អាហារូបករណ៍')) {
    return {
      theme: 'scholarship',
      primaryColor: '#1e40af',
      bgGradient: 'from-[#172554] via-[#1e3a8a] to-[#1d4ed8]',
      accentColor: '#bfdbfe',
      titleKm: 'ត្រៀមអាហារូបករណ៍',
      titleEn: 'SCHOLARSHIP MASTER GUIDE',
      streamKm: 'អាហារូបករណ៍ជាតិ និងអន្តរជាតិ',
      badgeText: 'SCHOLARSHIP',
      patternType: 'scholarship'
    };
  }

  // Default fallback
  return {
    theme: 'general',
    primaryColor: '#334155',
    bgGradient: 'from-[#0f172a] via-[#1e293b] to-[#334155]',
    accentColor: '#cbd5e1',
    titleKm: 'សៀវភៅពុម្ពជាតិ',
    titleEn: 'NATIONAL TEXTBOOK',
    streamKm: 'កម្មវិធីសិក្សាគោល MoTDAR',
    badgeText: 'TEXTBOOK',
    patternType: 'general'
  };
}

// Vector Illustration Component for Official MoEYS Covers
function OfficialVectorIllustration({ type, accentColor }) {
  if (type === 'math') {
    return (
      <svg viewBox="0 0 160 100" className="w-full h-full opacity-90 filter drop-shadow">
        <defs>
          <linearGradient id="mathGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        <line x1="20" y1="50" x2="140" y2="50" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="80" y1="10" x2="80" y2="90" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeDasharray="3 3" />
        {/* Parabola Curve */}
        <path d="M 30 80 Q 80 15 130 80" fill="none" stroke="url(#mathGrad)" strokeWidth="3" />
        {/* Geometric Triangle */}
        <polygon points="45,75 80,35 115,75" fill="rgba(56,189,248,0.15)" stroke="#38bdf8" strokeWidth="1.5" />
        {/* Sigma Symbol */}
        <text x="80" y="58" textAnchor="middle" fill="#ffffff" fontSize="22" fontWeight="bold" fontFamily="serif">∑</text>
        <text x="32" y="32" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace">f(x)=x²</text>
        <text x="110" y="32" fill="#e0e7ff" fontSize="11" fontWeight="bold" fontFamily="serif">∫</text>
      </svg>
    );
  }

  if (type === 'physics') {
    return (
      <svg viewBox="0 0 160 100" className="w-full h-full opacity-90 filter drop-shadow">
        {/* Atomic Orbits */}
        <ellipse cx="80" cy="50" rx="45" ry="16" fill="none" stroke="#7dd3fc" strokeWidth="1.5" transform="rotate(30 80 50)" />
        <ellipse cx="80" cy="50" rx="45" ry="16" fill="none" stroke="#38bdf8" strokeWidth="1.5" transform="rotate(-30 80 50)" />
        <ellipse cx="80" cy="50" rx="45" ry="16" fill="none" stroke="#93c5fd" strokeWidth="1.5" />
        {/* Atomic Nucleus */}
        <circle cx="80" cy="50" r="7" fill="#fbbf24" stroke="#ffffff" strokeWidth="2" />
        {/* Electrons */}
        <circle cx="118" cy="35" r="3" fill="#ffffff" />
        <circle cx="42" cy="65" r="3" fill="#ffffff" />
        {/* Formula text */}
        <text x="80" y="88" textAnchor="middle" fill="#bae6fd" fontSize="10" fontWeight="bold" fontFamily="monospace">E = mc² • RLC</text>
      </svg>
    );
  }

  if (type === 'chem') {
    return (
      <svg viewBox="0 0 160 100" className="w-full h-full opacity-90 filter drop-shadow">
        {/* Benzene Ring 1 */}
        <polygon points="55,30 70,22 85,30 85,48 70,56 55,48" fill="rgba(16,185,129,0.15)" stroke="#6ee7b7" strokeWidth="2" />
        <circle cx="70" cy="39" r="8" fill="none" stroke="#6ee7b7" strokeWidth="1.5" strokeDasharray="3 2" />
        {/* Connected Benzene Ring 2 */}
        <polygon points="85,48 100,40 115,48 115,66 100,74 85,66" fill="rgba(16,185,129,0.2)" stroke="#34d399" strokeWidth="2" />
        {/* Erlenmeyer Flask Outline */}
        <path d="M 35 30 L 45 30 L 45 42 L 25 75 L 55 75 L 35 42 Z" fill="rgba(52,211,153,0.25)" stroke="#ffffff" strokeWidth="1.5" />
        <text x="80" y="90" textAnchor="middle" fill="#a7f3d0" fontSize="10" fontWeight="bold" fontFamily="monospace">pH = -log[H+]</text>
      </svg>
    );
  }

  if (type === 'bio') {
    return (
      <svg viewBox="0 0 160 100" className="w-full h-full opacity-90 filter drop-shadow">
        {/* DNA Helix Strands */}
        <path d="M 30 25 Q 55 75 80 25 T 130 25" fill="none" stroke="#86efac" strokeWidth="3" />
        <path d="M 30 75 Q 55 25 80 75 T 130 75" fill="none" stroke="#4ade80" strokeWidth="3" />
        {/* Base Pairs (Rungs) */}
        <line x1="42" y1="42" x2="42" y2="58" stroke="#ffffff" strokeWidth="2" />
        <line x1="68" y1="45" x2="68" y2="55" stroke="#ffffff" strokeWidth="2" />
        <line x1="92" y1="45" x2="92" y2="55" stroke="#ffffff" strokeWidth="2" />
        <line x1="118" y1="42" x2="118" y2="58" stroke="#ffffff" strokeWidth="2" />
        <text x="80" y="90" textAnchor="middle" fill="#bbf7d0" fontSize="10" fontWeight="bold" fontFamily="sans-serif">ADN • GENETICS</text>
      </svg>
    );
  }

  if (type === 'khmer') {
    return (
      <svg viewBox="0 0 160 100" className="w-full h-full opacity-90 filter drop-shadow">
        {/* Traditional Ornamental Frame */}
        <rect x="25" y="15" width="110" height="70" rx="8" fill="rgba(251,191,36,0.1)" stroke="#fde68a" strokeWidth="1.5" strokeDasharray="6 3" />
        {/* Open Book Icon */}
        <path d="M 80 40 Q 60 30 40 35 L 40 65 Q 60 60 80 70 Q 100 60 120 65 L 120 35 Q 100 30 80 40 Z" fill="rgba(255,255,255,0.2)" stroke="#ffffff" strokeWidth="2" />
        {/* Lotus Petal Motif */}
        <path d="M 80 25 Q 75 18 80 12 Q 85 18 80 25 Z" fill="#fde68a" />
        <text x="80" y="80" textAnchor="middle" fill="#fef08a" fontSize="10" fontWeight="bold" fontFamily="serif">កុលាបប៉ៃលិន • តែងសេចក្តី</text>
      </svg>
    );
  }

  if (type === 'hist') {
    return (
      <svg viewBox="0 0 160 100" className="w-full h-full opacity-90 filter drop-shadow">
        {/* Sun in background */}
        <circle cx="80" cy="35" r="16" fill="rgba(254,202,202,0.25)" />
        {/* Angkor Wat 5 Towers Silhouette */}
        <path d="M 30 75 L 45 75 L 45 55 L 50 48 L 55 55 L 55 75 L 65 75 L 65 42 L 72 32 L 80 20 L 88 32 L 95 42 L 95 75 L 105 75 L 105 55 L 110 48 L 115 55 L 115 75 L 130 75 Z" fill="rgba(255,255,255,0.3)" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="20" y1="75" x2="140" y2="75" stroke="#fca5a5" strokeWidth="2" />
        <text x="80" y="89" textAnchor="middle" fill="#fecaca" fontSize="9.5" fontWeight="bold">១៩៥៣ • អាស៊ាន • ប៉ារីស</text>
      </svg>
    );
  }

  if (type === 'geo') {
    return (
      <svg viewBox="0 0 160 100" className="w-full h-full opacity-90 filter drop-shadow">
        {/* Globe Outline */}
        <circle cx="80" cy="48" r="28" fill="rgba(34,211,238,0.15)" stroke="#a5f3fc" strokeWidth="2" />
        <ellipse cx="80" cy="48" rx="28" ry="12" fill="none" stroke="#22d3ee" strokeWidth="1" strokeDasharray="3 2" />
        <ellipse cx="80" cy="48" rx="14" ry="28" fill="none" stroke="#22d3ee" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="52" y1="48" x2="108" y2="48" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="80" y1="20" x2="80" y2="76" stroke="#ffffff" strokeWidth="1.5" />
        <text x="80" y="90" textAnchor="middle" fill="#cffafe" fontSize="9.5" fontWeight="bold">ទន្លេមេគង្គ • បឹងទន្លេសាប</text>
      </svg>
    );
  }

  if (type === 'civics') {
    return (
      <svg viewBox="0 0 160 100" className="w-full h-full opacity-90 filter drop-shadow">
        {/* Pillar & Beam */}
        <line x1="45" y1="35" x2="115" y2="35" stroke="#ffffff" strokeWidth="2.5" />
        <line x1="80" y1="30" x2="80" y2="75" stroke="#ffffff" strokeWidth="2.5" />
        <polygon points="65,75 95,75 80,68" fill="#c7d2fe" />
        {/* Scale Pans */}
        <path d="M 45 35 L 35 55 L 55 55 Z" fill="rgba(199,210,254,0.3)" stroke="#c7d2fe" strokeWidth="1.5" />
        <path d="M 115 35 L 105 55 L 125 55 Z" fill="rgba(199,210,254,0.3)" stroke="#c7d2fe" strokeWidth="1.5" />
        <text x="80" y="90" textAnchor="middle" fill="#e0e7ff" fontSize="9.5" fontWeight="bold">រដ្ឋធម្មនុញ្ញ • នីតិរដ្ឋ</text>
      </svg>
    );
  }

  if (type === 'english') {
    return (
      <svg viewBox="0 0 160 100" className="w-full h-full opacity-90 filter drop-shadow">
        <rect x="35" y="22" width="90" height="52" rx="8" fill="rgba(244,114,182,0.15)" stroke="#fbcfe8" strokeWidth="2" />
        <text x="80" y="44" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">ENGLISH</text>
        <text x="80" y="60" textAnchor="middle" fill="#fbcfe8" fontSize="10" fontWeight="bold" fontFamily="sans-serif">FOR CAMBODIA</text>
        <line x1="50" y1="65" x2="110" y2="65" stroke="#ffffff" strokeWidth="1" />
      </svg>
    );
  }

  if (type === 'exam') {
    return (
      <svg viewBox="0 0 160 100" className="w-full h-full opacity-90 filter drop-shadow">
        <circle cx="80" cy="42" r="22" fill="rgba(251,191,36,0.25)" stroke="#fde047" strokeWidth="2.5" />
        {/* Star */}
        <polygon points="80,26 84,36 94,36 86,43 89,53 80,47 71,53 74,43 66,36 76,36" fill="#fef08a" />
        {/* Ribbon tails */}
        <polygon points="70,60 62,80 72,74 78,80 76,60" fill="#f59e0b" />
        <polygon points="90,60 84,80 90,74 98,80 92,60" fill="#d97706" />
        <text x="80" y="94" textAnchor="middle" fill="#fef08a" fontSize="10" fontWeight="bold">និទ្ទេស A • បាក់ឌុប</text>
      </svg>
    );
  }

  // Fallback Book
  return (
    <svg viewBox="0 0 160 100" className="w-full h-full opacity-90 filter drop-shadow">
      <rect x="40" y="20" width="80" height="55" rx="6" fill="rgba(255,255,255,0.15)" stroke="#ffffff" strokeWidth="2" />
      <line x1="80" y1="20" x2="80" y2="75" stroke="#ffffff" strokeWidth="2" />
      <text x="80" y="90" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">MOTDAR TEXTBOOK</text>
    </svg>
  );
}

export default function DigitalLibraryView() {
  const { t, lang } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [activeReadingBook, setActiveReadingBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [fontSize, setFontSize] = useState(15);
  const [readingTheme, setReadingTheme] = useState('sepia'); // 'sepia' | 'light' | 'dark'

  // Prevent background scrolling when reader modal is open
  useEffect(() => {
    if (activeReadingBook) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeReadingBook]);

  // Keyboard navigation for reader
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeReadingBook) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setCurrentPage(prev => Math.min(activeReadingBook.pages, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrentPage(prev => Math.max(1, prev - 1));
      } else if (e.key === 'Escape') {
        setActiveReadingBook(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeReadingBook]);

  const filteredBooks = libraryBooks.filter(book => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      book.titleKm.toLowerCase().includes(q) || 
      book.titleEn.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q) ||
      book.category.toLowerCase().includes(q);

    const matchesCat = selectedCategory === 'all' || 
      book.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesGrade = selectedGrade === 'all' || 
      book.grade === selectedGrade;

    return matchesSearch && matchesCat && matchesGrade;
  });

  // Calculate dynamic page content for the reader
  const getPageContent = (book, pageNum) => {
    if (!book) return null;

    const chapterIdx = Math.floor((pageNum - 1) / 4) + 1;
    const pageInChapter = ((pageNum - 1) % 4) + 1;

    let pageTitle = '';
    let pageType = '';
    let bodyText = '';
    let keyPoints = [];
    let formulas = [];

    if (pageNum === 1) {
      pageTitle = 'ទំព័រក្រប និងអារម្ភកថា (Preface & Guidelines)';
      pageType = 'cover';
      bodyText = `សៀវភៅ «${book.titleKm}» បោះពុម្ពផ្សាយដោយ ${book.author}។ ឯកសារនេះត្រូវបានរៀបចំឡើងយ៉ាងយកចិត្តទុកដាក់បំផុត ស្របតាមកម្មវិធីសិក្សាស្តង់ដារបស់ក្រសួងអប់រំ យុវជន និងកីឡា ដើម្បីផ្តល់ចំណេះដឹងគ្រឹះដ៏រឹងមាំដល់សិស្សានុសិស្សទូទាំងប្រទេសកម្ពុជា។`;
      keyPoints = [
        `គ្របដណ្តប់កម្មវិធីសិក្សាថ្នាក់ទី ${book.grade} ពេញលេញ`,
        'រៀបរៀងដោយសាស្ត្រាចារ្យ និងគណៈកម្មការតាក់តែងកម្មវិធីសិក្សាជាតិ',
        'ត្រៀមលក្ខណៈសម្រាប់សិស្សពូកែ និងការប្រឡងសញ្ញាបត្រមធ្យមសិក្សាទុតិយភូមិ (បាក់ឌុប)'
      ];
    } else if (pageInChapter === 1) {
      pageTitle = `ជំពូកទី ${chapterIdx}៖ ទ្រឹស្តីសំខាន់ៗ និងនិយមន័យគោល`;
      pageType = 'theory';
      bodyText = `នៅក្នុងជំពូកទី ${chapterIdx} នេះ សិស្សនឹងសិក្សាស្វែងយល់យ៉ាងស៊ីជម្រៅអំពីមូលដ្ឋានគ្រឹះនៃមុខវិជ្ជា ${book.titleKm}។ ការយល់ដឹងពីប្រភពទ្រឹស្តី និងនិយមន័យច្បាស់លាស់ គឺជាកាតាលីករដ៏សំខាន់ក្នុងការដោះស្រាយបញ្ហាស្មុគស្មាញ។\n\nខ្លឹមសារមេរៀនត្រូវបានបែងចែកជាចំណុចតូចៗងាយស្រួលយល់ និងភ្ជាប់ជាមួយឧទាហរណ៍ជាក់ស្តែងក្នុងជីវភាពរស់នៅ និងវិទ្យាសាស្ត្រទំនើប។`;
      keyPoints = [
        'និយមន័យច្បាស់លាស់នៃគោលគំនិតចម្បង',
        'ការបកស្រាយតាមក្បួនខ្នាតគរុកោសល្យទំនើប',
        'ចំណុចត្រូវប្រុងប្រយ័ត្នដើម្បីកុំឱ្យយល់ច្រឡំ'
      ];
      formulas = [
        'រូបមន្តគ្រឹះទី ១៖ f(x) = ax² + bx + c',
        'រូបមន្តគ្រឹះទី ២៖ Δ = b² - 4ac'
      ];
    } else if (pageInChapter === 2) {
      pageTitle = `ជំពូកទី ${chapterIdx}៖ រូបមន្តគន្លឹះ និងគំរូទាញរូបមន្ត`;
      pageType = 'formulas';
      bodyText = `តារាងប្រមូលផ្តុំរូបមន្តសំខាន់ៗដែលត្រូវទន្ទេញចាំមាត់សម្រាប់ជំពូកទី ${chapterIdx}៖\n\nសិស្សានុសិស្សត្រូវស្វែងយល់ពីរបៀបទាញរូបមន្ត និងលក្ខខណ្ឌកំណត់នីមួយៗ ដើម្បីជៀសវាងការភ្លេចភ្លាំងក្នុងបន្ទប់ប្រឡង។`;
      keyPoints = [
        'រូបមន្តដែលតែងតែចេញប្រឡងញឹកញាប់បំផុត',
        'វិធីសាស្ត្របំប្លែងសមីការស្មុគស្មាញមកជារាងសាមញ្ញ',
        'ការផ្ទៀងផ្ទាត់ខ្នាតអន្តរជាតិ (SI Units)'
      ];
      formulas = [
        'រូបមន្តគណនាចម្បង៖ ∫ (ax + b)^n dx = (ax + b)^(n+1) / [a(n+1)] + C',
        'រូបមន្តដេរីវេ៖ (u/v)\' = (u\'v - uv\') / v²',
        'រូបមន្តប្រូបាប៖ P(A ∪ B) = P(A) + P(B) - P(A ∩ B)'
      ];
    } else if (pageInChapter === 3) {
      pageTitle = `ជំពូកទី ${chapterIdx}៖ លំហាត់គំរូបាក់ឌុប និងដំណោះស្រាយលម្អិត`;
      pageType = 'exercise';
      bodyText = `【លំហាត់គំរូថ្នាក់ជាតិ សម្រាប់ជំពូកទី ${chapterIdx}】\n\nប្រធានលំហាត់៖ ចូរបកស្រាយ និងគណនាតម្លៃនៃកន្សោមដោយបង្ហាញដំណាក់កាលលម្អិតពីជំហានដំបូងរហូតដល់ចម្លើយចុងក្រោយ។\n\nដំណោះស្រាយគំរូរបស់គណៈកម្មការកំណែ៖\nជំហានទី ១៖ កំណត់បម្រាប់ដែលប្រធានបានផ្តល់ឱ្យ\nជំហានទី ២៖ សរសេររូបមន្តគន្លឹះដែលត្រូវយកមកអនុវត្ត\nជំហានទី ៣៖ ជំនួសលេខ និងគណនាដោយប្រុងប្រយ័ត្ន\nជំហានទី ៤៖ សន្និដ្ឋានចម្លើយ និងបញ្ជាក់ខ្នាតឱ្យបានត្រឹមត្រូវ ១០០%។`;
      keyPoints = [
        'គន្លឹះសរសេរឱ្យត្រូវតាមកម្រងពិន្ទុរបស់ក្រសួង',
        'ជៀសវាងកំហុសឆ្គងបូកដកលេខ និងការភ្លេចដាក់ខ្នាត',
        'វិធីសាស្ត្រត្រួតពិនិត្យចម្លើយឡើងវិញមុនពេលបញ្ចប់'
      ];
    } else {
      pageTitle = `ជំពូកទី ${chapterIdx}៖ លំហាត់ស្វ័យវាយតម្លៃ និងសង្ខេបជំពូក`;
      pageType = 'summary';
      bodyText = `កម្រងលំហាត់អនុវត្តន៍ផ្ទាល់ខ្លួនចំនួន ៥ លំហាត់ សម្រាប់វាស់ស្ទង់សមត្ថភាពបន្ទាប់ពីបញ្ចប់ជំពូកទី ${chapterIdx}។\n\nសូមធ្វើលំហាត់ទាំងនេះដោយកំណត់ម៉ោងដូចនៅក្នុងបន្ទប់ប្រឡងជាក់ស្តែង ដើម្បីបង្កើនល្បឿន និងភាពសុក្រឹត។`;
      keyPoints = [
        'លំហាត់ពង្រឹងចំណេះដឹងកម្រិតមូលដ្ឋាន',
        'លំហាត់កម្រិតខ្ពស់សម្រាប់សិស្សត្រៀមយកនិទ្ទេស A',
        'តារាងផ្ទៀងផ្ទាត់ចម្លើយ និងពិន្ទុស្វ័យវាយតម្លៃ'
      ];
    }

    return {
      chapterIdx,
      pageInChapter,
      pageTitle,
      pageType,
      bodyText,
      keyPoints,
      formulas
    };
  };

  const currentPageData = activeReadingBook ? getPageContent(activeReadingBook, currentPage) : null;

  return (
    <div className="space-y-8 font-kantumruy">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#001f3f] via-[#003876] to-[#005baa] rounded-3xl p-6 sm:p-8 relative overflow-hidden text-white shadow-xl border border-white/15">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 w-60 h-60 sm:w-80 sm:h-80 pointer-events-none select-none opacity-15 sm:opacity-20 mix-blend-screen z-0">
          <img
            src="/assets/moeys-crest-transparent.png"
            alt="Ministry Logo Background"
            className="w-full h-full object-contain filter brightness-125"
          />
        </div>

        <div className="max-w-2xl space-y-2 sm:space-y-3 relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-white/15 text-amber-300 border border-white/20 text-[10px] sm:text-xs font-black px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 backdrop-blur-md shadow-2xs">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{lang === 'km' ? 'បណ្ណាល័យសៀវភៅពុម្ពអេឡិចត្រូនិកថ្នាក់ជាតិ' : 'National Digital Textbook Library'}</span>
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] sm:text-xs font-black px-3 py-1 rounded-full inline-flex items-center gap-1 backdrop-blur-md shadow-2xs">
              <Layers className="w-3.5 h-3.5" />
              <span>{libraryBooks.length} {lang === 'km' ? 'ក្បាលសៀវភៅពេញលេញ' : 'Total Books'}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
            {t('libraryTitle') || (lang === 'km' ? 'បណ្ណាល័យសៀវភៅពុម្ព និងឯកសារស្រាវជ្រាវ (១០០+ ក្បាល)' : 'National Digital E-Book Library (100+ Books)')}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-medium">
            {t('librarySubtitle') || (lang === 'km' ? 'បណ្តុំសៀវភៅពុម្ពផ្លូវការ សៀវភៅជំនួយស្មារតី គន្លឹះប្រឡងបាក់ឌុបនិទ្ទេស A និងឯកសារស្រាវជ្រាវកម្រិតវិទ្យាល័យ អាចអានបានយ៉ាងងាយស្រួលនៅលើគ្រប់ឧបករណ៍។' : 'Official curriculum textbooks, supplementary manuals, and high-school research literature for free online reading.')}
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder={t('searchBook') || (lang === 'km' ? 'ស្វែងរកចំណងជើងសៀវភៅពុម្ព អ្នកនិពន្ធ...' : 'Search textbooks, author...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#005baa] focus:bg-white font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Grade Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 text-xs font-bold scrollbar-none">
            <span className="text-[11px] text-slate-500 font-bold mr-1 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-[#005baa]" />
              <span>{lang === 'km' ? 'កម្រិតថ្នាក់៖' : 'Grade:'}</span>
            </span>
            {['all', '12', '11', '10'].map((grd) => (
              <button
                key={grd}
                type="button"
                onClick={() => setSelectedGrade(grd)}
                className={`px-3 py-1 rounded-xl transition-all cursor-pointer font-bold ${
                  selectedGrade === grd
                    ? 'bg-[#003366] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {grd === 'all' ? (lang === 'km' ? 'គ្រប់ថ្នាក់' : 'All') : (lang === 'km' ? `ថ្នាក់ទី${grd}` : `Grade ${grd}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none border-t border-slate-100 pt-2.5">
          <span className="text-[11px] text-slate-500 font-bold mr-1">{lang === 'km' ? 'ប្រភេទ៖' : 'Category:'}</span>
          {[
            { key: 'all', name: lang === 'km' ? 'ទាំងអស់' : 'All' },
            { key: 'Math', name: lang === 'km' ? 'គណិតវិទ្យា' : 'Math' },
            { key: 'Physics', name: lang === 'km' ? 'រូបវិទ្យា' : 'Physics' },
            { key: 'Chemistry', name: lang === 'km' ? 'គីមីវិទ្យា' : 'Chemistry' },
            { key: 'Biology', name: lang === 'km' ? 'ជីវវិទ្យា' : 'Biology' },
            { key: 'Khmer', name: lang === 'km' ? 'ភាសាខ្មែរ' : 'Khmer' },
            { key: 'History', name: lang === 'km' ? 'ប្រវត្តិវិទ្យា' : 'History' },
            { key: 'Geography', name: lang === 'km' ? 'ភូមិវិទ្យា' : 'Geography' },
            { key: 'Civics', name: lang === 'km' ? 'សីលធម៌-ពលរដ្ឋ' : 'Civics' },
            { key: 'Exam', name: lang === 'km' ? 'ត្រៀមបាក់ឌុប' : 'Exam Series' },
            { key: 'Summary', name: lang === 'km' ? 'រូបមន្តសង្ខេប' : 'Formulas' },
            { key: 'STEM', name: lang === 'km' ? 'STEM & កូដ' : 'STEM' }
          ].map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1 rounded-xl whitespace-nowrap transition-all cursor-pointer font-bold ${
                selectedCategory === cat.key
                  ? 'bg-[#005baa] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

      </div>

      {/* Section Title */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#005baa] flex items-center justify-center font-bold">
            <BookOpen className="w-4.5 h-4.5" />
          </div>
          <h3 className="text-sm sm:text-base font-black text-[#003366]">
            {lang === 'km' ? 'កាតាឡុកសៀវភៅពុម្ព និងឯកសារស្រាវជ្រាវផ្លូវការ' : 'Official Digital Textbooks & Research Library'}
          </h3>
        </div>
        <span className="text-[11px] sm:text-xs text-slate-600 font-bold bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
          {filteredBooks.length} {lang === 'km' ? 'ក្បាលសៀវភៅ' : 'Books Available'}
        </span>
      </div>

      {/* AUTHENTIC OFFICIAL CAMBODIAN TEXTBOOK COVERS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-5">
        {filteredBooks.map((book) => {
          const design = getBookCoverDesign(book.category, book.titleKm);

          return (
            <div 
              key={book.id} 
              onClick={() => {
                setActiveReadingBook(book);
                setCurrentPage(1);
              }}
              className="group flex flex-col justify-between overflow-hidden shadow-sm border border-slate-200 hover:border-[#005baa] hover:shadow-2xl rounded-2xl sm:rounded-3xl bg-white transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            >
              {/* REALISTIC MINISTRY E-BOOK COVER */}
              <div className={`relative aspect-[3/4.2] overflow-hidden bg-gradient-to-b ${design.bgGradient} p-3 sm:p-3.5 flex flex-col justify-between text-white select-none border-l-4 border-l-black/30 shadow-inner`}>
                
                {/* Book Spine Highlight Overlay */}
                <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-white/20 via-white/5 to-transparent pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-l from-black/30 to-transparent pointer-events-none" />

                {/* Top Ministry Header */}
                <div className="relative z-10 text-center space-y-0.5 border-b border-white/20 pb-1.5">
                  <p className="text-[7.5px] sm:text-[8.5px] text-amber-200 font-bold tracking-wider leading-none">
                    ព្រះរាជាណាចក្រកម្ពុជា • ជាតិ សាសនា ព្រះមហាក្សត្រ
                  </p>
                  <p className="text-[8px] sm:text-[9px] text-white/95 font-bold uppercase tracking-tight leading-tight">
                    ក្រសួងអប់រំ យុវជន និងកីឡា
                  </p>
                </div>

                {/* Center Title & Vector Diagram */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto space-y-1.5">
                  
                  {/* Official Grade Seal */}
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 font-black text-[10px] sm:text-xs flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-amber-400/40">
                    <span className="leading-none text-center">
                      ថ្នាក់ទី<br /><b className="text-xs sm:text-sm">{book.grade}</b>
                    </span>
                  </div>

                  {/* Main Subject Title */}
                  <div className="space-y-0.5 px-1">
                    <h2 className="text-sm sm:text-base font-black text-white leading-tight font-kantumruy filter drop-shadow">
                      {design.titleKm}
                    </h2>
                    <p className="text-[7.5px] sm:text-[8.5px] text-white/80 font-bold tracking-wider uppercase font-mono">
                      {design.titleEn}
                    </p>
                  </div>

                  {/* Vector Subject Illustration */}
                  <div className="w-full h-14 sm:h-16 px-2 flex items-center justify-center">
                    <OfficialVectorIllustration type={design.patternType} accentColor={design.accentColor} />
                  </div>

                  {/* Stream / Focus pill */}
                  <span className="text-[7.5px] sm:text-[8.5px] font-bold text-white bg-black/40 px-2 py-0.5 rounded-full border border-white/20 max-w-[140px] truncate">
                    {design.streamKm}
                  </span>
                </div>

                {/* Bottom Ministry Publishing Mark */}
                <div className="relative z-10 pt-1.5 border-t border-white/20 flex items-center justify-between text-[7.5px] sm:text-[8.5px] text-white/90 font-medium">
                  <span className="truncate max-w-[85px] font-bold">គ្រឹះស្ថានបោះពុម្ព</span>
                  <span className="font-cinzel font-bold text-amber-200">ឆ្នាំ ២០២៤</span>
                </div>

              </div>

              {/* Card Meta & Read Button */}
              <div className="p-3 space-y-2 flex-1 flex flex-col justify-between bg-white">
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between text-[9px] text-slate-500 font-bold">
                    <span className="text-[#005baa] truncate max-w-[100px]">{book.author}</span>
                    <span className="font-cinzel">{book.pages} ទំព័រ</span>
                  </div>
                  <h3 className="font-black text-xs text-[#003366] line-clamp-2 leading-tight group-hover:text-[#005baa] transition-colors">
                    {lang === 'km' ? book.titleKm : book.titleEn}
                  </h3>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveReadingBook(book);
                      setCurrentPage(1);
                    }}
                    className="w-full btn-moeys-primary py-1.5 text-[11px] font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{lang === 'km' ? 'អានសៀវភៅ' : 'Read Book'}</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* INTERACTIVE MULTI-PAGE E-BOOK READER MODAL */}
      {activeReadingBook && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto font-kantumruy animate-fadeIn">
          <div className={`w-full max-w-4xl max-h-[94vh] flex flex-col justify-between shadow-2xl rounded-3xl overflow-hidden my-auto border transition-colors duration-200 ${
            readingTheme === 'dark'
              ? 'bg-slate-900 text-slate-100 border-slate-700'
              : readingTheme === 'sepia'
                ? 'bg-[#fcf8f2] text-slate-900 border-amber-200'
                : 'bg-white text-slate-900 border-slate-200'
          }`}>
            
            {/* Top Reader Toolbar */}
            <div className={`p-3.5 sm:p-4 border-b flex items-center justify-between gap-2 sm:gap-4 flex-shrink-0 ${
              readingTheme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-blue-50/80 border-slate-200'
            }`}>
              <div className="flex items-center gap-2.5 min-w-0">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#005baa] flex-shrink-0" />
                <div className="min-w-0">
                  <h3 className="font-bold text-xs sm:text-sm text-[#003366] truncate">
                    {lang === 'km' ? activeReadingBook.titleKm : activeReadingBook.titleEn}
                  </h3>
                  <p className="text-[10px] text-slate-500 truncate">
                    {activeReadingBook.author} • ទំព័រទី {currentPage} នៃ {activeReadingBook.pages}
                  </p>
                </div>
              </div>

              {/* Reader Controls */}
              <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
                {/* Theme Selector */}
                <button
                  type="button"
                  onClick={() => setReadingTheme(readingTheme === 'sepia' ? 'light' : readingTheme === 'light' ? 'dark' : 'sepia')}
                  className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:text-[#005baa] cursor-pointer text-xs flex items-center gap-1 shadow-2xs"
                  title="ប្តូរផ្ទាំងអាន (Theme)"
                >
                  {readingTheme === 'dark' ? <Moon className="w-3.5 h-3.5 text-blue-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                </button>

                {/* Font Size Zoom */}
                <button 
                  onClick={() => setFontSize(prev => Math.max(12, prev - 1))}
                  className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:text-[#005baa] cursor-pointer shadow-2xs"
                  title="បង្រួមអក្សរ"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setFontSize(prev => Math.min(24, prev + 1))}
                  className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:text-[#005baa] cursor-pointer shadow-2xs"
                  title="ពង្រីកអក្សរ"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>

                {/* Close Modal */}
                <button 
                  onClick={() => setActiveReadingBook(null)}
                  className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 cursor-pointer shadow-2xs ml-1"
                  title="បិទផ្ទាំងអាន"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Reading Content Area (Unique per page) */}
            <div 
              className="p-5 sm:p-8 md:p-10 overflow-y-auto flex-1 space-y-6 leading-relaxed" 
              style={{ fontSize: `${fontSize}px` }}
            >
              <div className="max-w-2xl mx-auto space-y-5">
                
                {/* Page Title & Chapter Badge */}
                <div className="text-center pb-4 border-b border-slate-200/60">
                  <span className="badge-moeys-gold text-[10.5px] font-bold">
                    ទំព័រទី {currentPage} នៃ {activeReadingBook.pages} (ជំពូកទី {currentPageData?.chapterIdx})
                  </span>
                  <h2 className="text-base sm:text-xl font-black text-[#003366] mt-2 font-kantumruy leading-snug">
                    {currentPageData?.pageTitle}
                  </h2>
                </div>

                {/* Detailed Dynamic Content */}
                <div className="space-y-4 leading-relaxed font-medium">
                  <div className="whitespace-pre-line text-justify">
                    {currentPageData?.bodyText}
                  </div>

                  {/* Key Formulas Section if available */}
                  {currentPageData?.formulas && currentPageData.formulas.length > 0 && (
                    <div className="p-4 rounded-2xl border bg-blue-50/70 border-blue-200 space-y-2 shadow-2xs">
                      <h4 className="font-bold text-[#003366] text-xs flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#005baa]" />
                        <span>រូបមន្ត និងច្បាប់គន្លឹះត្រូវចាំ (Key Formulas & Laws):</span>
                      </h4>
                      <div className="space-y-1.5">
                        {currentPageData.formulas.map((f, fIdx) => (
                          <div key={fIdx} className="bg-white p-2 rounded-xl border border-blue-200 text-[#003366] font-mono text-xs font-bold shadow-2xs">
                            <code>{f}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Points Bullet List */}
                  {currentPageData?.keyPoints && currentPageData.keyPoints.length > 0 && (
                    <div className="p-4 rounded-2xl border bg-amber-50/70 border-amber-200 space-y-2 shadow-2xs text-amber-950">
                      <h4 className="font-bold text-[#003366] text-xs flex items-center gap-1.5">
                        <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                        <span>ចំណុចគន្លឹះសំខាន់ៗក្នុងទំព័រនេះ (Key Takeaways):</span>
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        {currentPageData.keyPoints.map((pt, pIdx) => (
                          <li key={pIdx}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Bottom Page Navigation Controls */}
            <div className={`p-3.5 sm:p-4 border-t flex items-center justify-between gap-2 text-xs flex-shrink-0 ${
              readingTheme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="btn-moeys-secondary py-1.5 px-3 disabled:opacity-40 cursor-pointer flex items-center gap-1 font-bold text-xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>ទំព័រមុន</span>
              </button>

              {/* Direct Page Jump */}
              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-bold hidden sm:inline text-[11px]">ទំព័រ</span>
                <input
                  type="number"
                  min={1}
                  max={activeReadingBook.pages}
                  value={currentPage}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val)) {
                      setCurrentPage(Math.min(Math.max(1, val), activeReadingBook.pages));
                    }
                  }}
                  className="w-12 sm:w-14 text-center py-1 px-1 rounded-lg border border-slate-300 bg-white font-cinzel font-bold text-xs focus:outline-none focus:border-[#005baa]"
                />
                <span className="font-cinzel text-slate-700 font-bold text-xs">
                  / {activeReadingBook.pages}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.min(activeReadingBook.pages, prev + 1))}
                disabled={currentPage === activeReadingBook.pages}
                className="btn-moeys-secondary py-1.5 px-3 disabled:opacity-40 cursor-pointer flex items-center gap-1 font-bold text-xs"
              >
                <span>ទំព័របន្ទាប់</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
