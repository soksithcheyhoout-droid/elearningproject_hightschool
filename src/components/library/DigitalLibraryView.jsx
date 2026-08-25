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
  Calculator,
  Atom,
  FlaskConical,
  Dna,
  Landmark,
  Globe,
  Scale,
  Languages,
  Award,
  Code,
  GraduationCap,
  Layers,
  Compass
} from 'lucide-react';
import { libraryBooks } from '../../data/libraryBooks';
import { useLanguage } from '../../context/LanguageContext';

// Helper to get vibrant category gradients, icons, stickers, and tags
function getCategoryDesign(cat = '', title = '') {
  const c = cat.toLowerCase();
  const t = title.toLowerCase();

  if (c.includes('math') || t.includes('គណិត')) {
    return {
      gradient: 'from-[#001f3f] via-[#003876] to-[#005baa]',
      bgGlow: 'bg-cyan-400/20',
      icon: Calculator,
      sticker: '📐',
      tag: 'គណិតវិទ្យា',
      accentColor: '#38bdf8',
      symbol: '∫ f(x)dx • lim • π'
    };
  }
  if (c.includes('physic') || t.includes('រូបវិទ្យា')) {
    return {
      gradient: 'from-[#082f49] via-[#0284c7] to-[#38bdf8]',
      bgGlow: 'bg-sky-400/25',
      icon: Atom,
      sticker: '⚡',
      tag: 'រូបវិទ្យា',
      accentColor: '#7dd3fc',
      symbol: 'E = mc² • RLC • ω'
    };
  }
  if (c.includes('chem') || t.includes('គីមី')) {
    return {
      gradient: 'from-[#064e3b] via-[#059669] to-[#10b981]',
      bgGlow: 'bg-emerald-400/25',
      icon: FlaskConical,
      sticker: '🧪',
      tag: 'គីមីវិទ្យា',
      accentColor: '#6ee7b7',
      symbol: 'pH = -log[H+] • CnH2n'
    };
  }
  if (c.includes('bio') || t.includes('ជីវវិទ្យា')) {
    return {
      gradient: 'from-[#14532d] via-[#16a34a] to-[#4ade80]',
      bgGlow: 'bg-green-400/25',
      icon: Dna,
      sticker: '🧬',
      tag: 'ជីវវិទ្យា',
      accentColor: '#86efac',
      symbol: 'ADN • ARNm • 2A+2G'
    };
  }
  if (c.includes('khmer') || t.includes('ខ្មែរ') || t.includes('អក្សរ')) {
    return {
      gradient: 'from-[#78350f] via-[#b45309] to-[#f59e0b]',
      bgGlow: 'bg-amber-400/25',
      icon: BookOpen,
      sticker: '📜',
      tag: 'អក្សរសាស្ត្រខ្មែរ',
      accentColor: '#fde68a',
      symbol: 'តែងសេចក្តី • កុលាបប៉ៃលិន'
    };
  }
  if (c.includes('hist') || t.includes('ប្រវត្តិ')) {
    return {
      gradient: 'from-[#7f1d1d] via-[#b91c1c] to-[#ef4444]',
      bgGlow: 'bg-rose-400/25',
      icon: Landmark,
      sticker: '🏛️',
      tag: 'ប្រវត្តិវិទ្យា',
      accentColor: '#fca5a5',
      symbol: 'អង្គរ • ១៩៥៣ • អាស៊ាន'
    };
  }
  if (c.includes('geo') || t.includes('ភូមិ')) {
    return {
      gradient: 'from-[#083344] via-[#0891b2] to-[#22d3ee]',
      bgGlow: 'bg-cyan-400/25',
      icon: Globe,
      sticker: '🌏',
      tag: 'ភូមិវិទ្យា',
      accentColor: '#a5f3fc',
      symbol: 'ទន្លេមេគង្គ • បឹងទន្លេសាប'
    };
  }
  if (c.includes('civic') || t.includes('សីលធម៌') || t.includes('ពលរដ្ឋ')) {
    return {
      gradient: 'from-[#312e81] via-[#4f46e5] to-[#818cf8]',
      bgGlow: 'bg-indigo-400/25',
      icon: Scale,
      sticker: '⚖️',
      tag: 'សីលធម៌-ពលរដ្ឋ',
      accentColor: '#c7d2fe',
      symbol: 'រដ្ឋធម្មនុញ្ញ • នីតិរដ្ឋ'
    };
  }
  if (c.includes('eng') || t.includes('english') || t.includes('អង់គ្លេស')) {
    return {
      gradient: 'from-[#831843] via-[#db2777] to-[#f472b6]',
      bgGlow: 'bg-pink-400/25',
      icon: Languages,
      sticker: '🇬🇧',
      tag: 'ភាសាអង់គ្លេស',
      accentColor: '#fbcfe8',
      symbol: 'Grammar • Vocabulary'
    };
  }
  if (c.includes('exam') || t.includes('បាក់ឌុប') || t.includes('និទ្ទេស')) {
    return {
      gradient: 'from-[#451a03] via-[#d97706] to-[#fbbf24]',
      bgGlow: 'bg-amber-400/30',
      icon: Award,
      sticker: '🏆',
      tag: 'ត្រៀមបាក់ឌុប A',
      accentColor: '#fef08a',
      symbol: 'វិញ្ញាសា & គន្លឹះដោះស្រាយ'
    };
  }
  if (c.includes('summary') || t.includes('រូបមន្ត')) {
    return {
      gradient: 'from-[#3b0764] via-[#7e22ce] to-[#c084fc]',
      bgGlow: 'bg-purple-400/25',
      icon: FileText,
      sticker: '📌',
      tag: 'រូបមន្តសង្ខេប',
      accentColor: '#e9d5ff',
      symbol: 'រូបមន្តគន្លឹះត្រូវចាំ'
    };
  }
  if (c.includes('stem') || t.includes('python') || t.includes('កូដ')) {
    return {
      gradient: 'from-[#1e1b4b] via-[#4338ca] to-[#9333ea]',
      bgGlow: 'bg-violet-400/25',
      icon: Code,
      sticker: '💻',
      tag: 'STEM & Python',
      accentColor: '#d8b4fe',
      symbol: 'def solve(): return AI'
    };
  }
  if (c.includes('scholarship') || t.includes('អាហារូបករណ៍')) {
    return {
      gradient: 'from-[#172554] via-[#1d4ed8] to-[#60a5fa]',
      bgGlow: 'bg-blue-400/25',
      icon: GraduationCap,
      sticker: '🎓',
      tag: 'អាហារូបករណ៍',
      accentColor: '#bfdbfe',
      symbol: 'Global Scholarship'
    };
  }

  // Default Science
  return {
    gradient: 'from-[#0f172a] via-[#1e293b] to-[#334155]',
    bgGlow: 'bg-slate-400/20',
    icon: BookOpen,
    sticker: '📖',
    tag: 'សៀវភៅពុម្ព',
    accentColor: '#cbd5e1',
    symbol: 'MoEYS E-Book'
  };
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
            { key: 'Math', name: lang === 'km' ? '📐 គណិតវិទ្យា' : 'Math' },
            { key: 'Physics', name: lang === 'km' ? '⚡ រូបវិទ្យា' : 'Physics' },
            { key: 'Chemistry', name: lang === 'km' ? '🧪 គីមីវិទ្យា' : 'Chemistry' },
            { key: 'Biology', name: lang === 'km' ? '🧬 ជីវវិទ្យា' : 'Biology' },
            { key: 'Khmer', name: lang === 'km' ? '📜 ភាសាខ្មែរ' : 'Khmer' },
            { key: 'History', name: lang === 'km' ? '🏛️ ប្រវត្តិវិទ្យា' : 'History' },
            { key: 'Geography', name: lang === 'km' ? '🌏 ភូមិវិទ្យា' : 'Geography' },
            { key: 'Civics', name: lang === 'km' ? '⚖️ សីលធម៌-ពលរដ្ឋ' : 'Civics' },
            { key: 'Exam', name: lang === 'km' ? '🏆 ត្រៀមបាក់ឌុប' : 'Exam Series' },
            { key: 'Summary', name: lang === 'km' ? '📌 រូបមន្តសង្ខេប' : 'Formulas' },
            { key: 'STEM', name: lang === 'km' ? '💻 STEM & កូដ' : 'STEM' }
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

      {/* Modern E-Book Cards (Icon & Sticker 3D Layout - NO PHOTO IMAGES) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-5">
        {filteredBooks.map((book) => {
          const design = getCategoryDesign(book.category, book.titleKm);
          const IconComp = design.icon;

          return (
            <div 
              key={book.id} 
              onClick={() => {
                setActiveReadingBook(book);
                setCurrentPage(1);
              }}
              className="group flex flex-col justify-between overflow-hidden shadow-xs border border-slate-200 hover:border-[#005baa] hover:shadow-2xl rounded-2xl sm:rounded-3xl bg-white transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            >
              {/* STYLISH E-BOOK COVER WITH 3D ICONS & STICKERS */}
              <div className={`relative aspect-[3/4] overflow-hidden bg-gradient-to-br ${design.gradient} p-3.5 sm:p-4 flex flex-col justify-between text-white select-none`}>
                
                {/* Decorative background glow & blur */}
                <div className={`absolute top-0 right-0 w-32 h-32 ${design.bgGlow} rounded-full blur-2xl pointer-events-none`} />
                <div className="absolute inset-0 bg-radial from-transparent to-black/30 pointer-events-none" />

                {/* Top Badge & Grade */}
                <div className="relative z-10 flex items-center justify-between gap-1">
                  <span className="bg-black/40 backdrop-blur-md text-amber-300 border border-white/20 text-[8.5px] sm:text-[9.5px] px-2 py-0.5 rounded-lg font-black shadow-2xs">
                    {lang === 'km' ? `ថ្នាក់ទី ${book.grade}` : `Grade ${book.grade}`}
                  </span>
                  
                  <span className="text-[10px] bg-white/20 backdrop-blur-md px-1.5 py-0.5 rounded-md text-white font-bold flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
                    <span className="font-cinzel text-[9.5px]">{book.rating}</span>
                  </span>
                </div>

                {/* Center 3D Sticker & Icon */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center gap-1.5 my-auto">
                  
                  {/* Floating 3D Sticker */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                    <span className="text-2xl sm:text-3xl filter drop-shadow">{design.sticker}</span>
                  </div>

                  {/* Subject Tag */}
                  <span 
                    className="text-[10.5px] sm:text-[11.5px] font-black px-2.5 py-0.5 rounded-full backdrop-blur-md border border-white/30 tracking-tight shadow-sm font-kantumruy"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: design.accentColor }}
                  >
                    {design.tag}
                  </span>

                  {/* Micro formula / symbol sticker */}
                  <span className="text-[8.5px] sm:text-[9.5px] text-white/75 font-mono truncate max-w-[130px]">
                    {design.symbol}
                  </span>
                </div>

                {/* Bottom Spine Bar */}
                <div className="relative z-10 pt-2 border-t border-white/20 flex items-center justify-between text-[9px] sm:text-[10px] text-white/90 font-medium">
                  <span className="truncate max-w-[90px] font-bold">MoEYS E-Book</span>
                  <span className="font-cinzel font-bold">{book.pages} {lang === 'km' ? 'ទំព័រ' : 'p.'}</span>
                </div>

              </div>

              {/* Card Meta & Read Button */}
              <div className="p-3 space-y-2 flex-1 flex flex-col justify-between bg-white">
                <div className="space-y-0.5">
                  <p className="text-[9px] sm:text-[9.5px] text-[#005baa] font-bold truncate">{book.author}</p>
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
