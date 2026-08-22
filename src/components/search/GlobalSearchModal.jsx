import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  X, 
  BookOpen, 
  GraduationCap, 
  FileText, 
  Library, 
  FlaskConical, 
  Bot, 
  Gamepad2, 
  ArrowRight, 
  Sparkles,
  Layers,
  Flame,
  CheckCircle2,
  CornerDownLeft,
  Command
} from 'lucide-react';
import { curriculumData } from '../../data/curriculumData';
import { bacIIData } from '../../data/bacIIData';
import { libraryBooks } from '../../data/libraryBooks';
import { quizData } from '../../data/quizData';
import { useLanguage } from '../../context/LanguageContext';

export default function GlobalSearchModal({ 
  isOpen, 
  onClose, 
  onNavigateTab, 
  onSelectSubject, 
  onOpenAITutor,
  onStartQuiz
}) {
  const { lang, t } = useLanguage();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setSelectedCategory('all');
    }
  }, [isOpen]);

  // Categories config
  const categories = [
    { id: 'all', labelKm: 'ទាំងអស់', labelEn: 'All Results', icon: Layers },
    { id: 'lessons', labelKm: 'មេរៀនជាតិ', labelEn: 'Curriculum', icon: BookOpen },
    { id: 'bacii', labelKm: 'វិញ្ញាសាបាក់ឌុប', labelEn: 'Bac II Exams', icon: GraduationCap },
    { id: 'books', labelKm: 'សៀវភៅពុម្ព', labelEn: 'Textbooks', icon: Library },
    { id: 'labs', labelKm: 'ពិសោធន៍ STEM', labelEn: 'STEM Labs', icon: FlaskConical },
    { id: 'quizzes', labelKm: 'សំណួរប្រឡង', labelEn: 'Quizzes', icon: Flame },
  ];

  // STEM Labs Data for Search
  const stemLabsList = [
    {
      id: 'lab-titration',
      titleKm: 'បន្ទប់ពិសោធន៍៖ អត្រាកម្មអាស៊ីត-បាស (Acid-Base Titration)',
      titleEn: 'Virtual STEM Lab: Acid-Base Neutralization Titration',
      subject: 'គីមីវិទ្យា',
      category: 'labs',
      tab: 'lab'
    },
    {
      id: 'lab-pendulum',
      titleKm: 'បន្ទប់ពិសោធន៍៖ ចលនាលំយោលប៉ោលទោល (Simple Pendulum)',
      titleEn: 'Virtual STEM Lab: Simple Pendulum Harmonic Motion',
      subject: 'រូបវិទ្យា',
      category: 'labs',
      tab: 'lab'
    },
    {
      id: 'lab-genetics',
      titleKm: 'បន្ទប់ពិសោធន៍៖ ការបង្កាត់ពូជម៉ង់ដែល & ក្រូម៉ូសូម (Mendelian Genetics)',
      titleEn: 'Virtual STEM Lab: Mendelian Genetics & Punnett Square',
      subject: 'ជីវវិទ្យា',
      category: 'labs',
      tab: 'lab'
    },
    {
      id: 'lab-circuit',
      titleKm: 'បន្ទប់ពិសោធន៍៖ សៀគ្វីចរន្តអគ្គិសនីឆ្លាស់ R-L-C (AC Circuits)',
      titleEn: 'Virtual STEM Lab: RLC Series AC Circuit Resonance',
      subject: 'រូបវិទ្យា',
      category: 'labs',
      tab: 'lab'
    }
  ];

  // Perform multi-source live indexing
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    let results = [];

    // 1. Search Curriculum Subjects & Lessons
    curriculumData.forEach((sub) => {
      // Check subject match
      if (
        sub.nameKm.toLowerCase().includes(q) || 
        sub.nameEn.toLowerCase().includes(q) ||
        (sub.descriptionKm && sub.descriptionKm.toLowerCase().includes(q))
      ) {
        results.push({
          id: `sub-${sub.id}`,
          type: 'lessons',
          badge: `ថ្នាក់ទី${sub.grade || '១២'} • ${sub.stream === 'science' ? 'វិទ្យាសាស្ត្រ' : 'សង្គម'}`,
          title: lang === 'km' ? sub.nameKm : sub.nameEn,
          subtitle: sub.teacher || (lang === 'km' ? sub.descriptionKm : sub.descriptionEn),
          icon: BookOpen,
          color: '#005baa',
          action: () => {
            if (onSelectSubject) onSelectSubject(sub);
            if (onNavigateTab) onNavigateTab('classroom');
            onClose();
          }
        });
      }

      // Check lessons within chapters
      sub.chapters?.forEach((chap) => {
        chap.lessons?.forEach((les) => {
          if (
            les.titleKm.toLowerCase().includes(q) || 
            les.titleEn.toLowerCase().includes(q) ||
            (les.notes && les.notes.toLowerCase().includes(q))
          ) {
            results.push({
              id: `les-${les.id}`,
              type: 'lessons',
              badge: sub.nameKm.split(' ')[0],
              title: lang === 'km' ? les.titleKm : les.titleEn,
              subtitle: `${chap.titleKm} • ${les.duration || '20 នាទី'}`,
              icon: BookOpen,
              color: '#0284c7',
              action: () => {
                if (onSelectSubject) onSelectSubject(sub);
                if (onNavigateTab) onNavigateTab('classroom');
                onClose();
              }
            });
          }
        });
      });
    });

    // 2. Search Bac II Exam Archive
    bacIIData.forEach((exam) => {
      if (
        exam.paperTitleKm.toLowerCase().includes(q) ||
        exam.paperTitleEn.toLowerCase().includes(q) ||
        exam.subject.toLowerCase().includes(q) ||
        exam.year.includes(q)
      ) {
        results.push({
          id: `exam-${exam.id}`,
          type: 'bacii',
          badge: `បាក់ឌុប ${exam.year} • ${exam.stream === 'science' ? 'វិទ្យាសាស្ត្រ' : 'សង្គម'}`,
          title: lang === 'km' ? exam.paperTitleKm : exam.paperTitleEn,
          subtitle: `សម័យប្រឡងថ្នាក់ជាតិ ${exam.year} • រយៈពេល៖ ${exam.duration}`,
          icon: GraduationCap,
          color: '#0d9488',
          action: () => {
            if (onNavigateTab) onNavigateTab('bacii');
            onClose();
          }
        });
      }

      // Search exercises inside Bac II papers
      exam.exercises?.forEach((ex) => {
        if (
          ex.titleKm.toLowerCase().includes(q) ||
          ex.problemText.toLowerCase().includes(q) ||
          ex.solutionText.toLowerCase().includes(q)
        ) {
          results.push({
            id: `ex-${ex.id}`,
            type: 'bacii',
            badge: `${exam.subject} ${exam.year}`,
            title: ex.titleKm,
            subtitle: ex.problemText.slice(0, 90) + '...',
            icon: FileText,
            color: '#0f766e',
            action: () => {
              if (onNavigateTab) onNavigateTab('bacii');
              onClose();
            }
          });
        }
      });
    });

    // 3. Search Digital Library Textbooks
    libraryBooks.forEach((book) => {
      if (
        book.titleKm.toLowerCase().includes(q) ||
        book.titleEn.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.category.toLowerCase().includes(q) ||
        (book.descriptionKm && book.descriptionKm.toLowerCase().includes(q))
      ) {
        results.push({
          id: `book-${book.id}`,
          type: 'books',
          badge: `សៀវភៅពុម្ព MoTDAR • ថ្នាក់ទី${book.grade}`,
          title: lang === 'km' ? book.titleKm : book.titleEn,
          subtitle: `${book.author} • ${book.pages} ទំព័រ`,
          icon: Library,
          color: '#d97706',
          action: () => {
            if (onNavigateTab) onNavigateTab('library');
            onClose();
          }
        });
      }
    });

    // 4. Search STEM Virtual Labs
    stemLabsList.forEach((lab) => {
      if (
        lab.titleKm.toLowerCase().includes(q) ||
        lab.titleEn.toLowerCase().includes(q) ||
        lab.subject.toLowerCase().includes(q)
      ) {
        results.push({
          id: `lab-${lab.id}`,
          type: 'labs',
          badge: `STEM Lab • ${lab.subject}`,
          title: lang === 'km' ? lab.titleKm : lab.titleEn,
          subtitle: 'បន្ទប់ពិសោធន៍អន្តរកម្មនិម្មិតកម្រិតវិទ្យាល័យ',
          icon: FlaskConical,
          color: '#8b5cf6',
          action: () => {
            if (onNavigateTab) onNavigateTab('lab');
            onClose();
          }
        });
      }
    });

    // 5. Search Quizzes
    quizData?.forEach((quiz) => {
      if (
        (quiz.titleKm && quiz.titleKm.toLowerCase().includes(q)) ||
        (quiz.subject && quiz.subject.toLowerCase().includes(q)) ||
        (quiz.question && quiz.question.toLowerCase().includes(q))
      ) {
        results.push({
          id: `quiz-${quiz.id}`,
          type: 'quizzes',
          badge: `សំណួរប្រឡង • ${quiz.subject || 'ចម្រុះ'}`,
          title: quiz.titleKm || quiz.question,
          subtitle: `សំណួរពហុជ្រើសរើស (MCQ) • រង្វាន់ +${quiz.xp || 50} XP`,
          icon: Flame,
          color: '#ea580c',
          action: () => {
            if (onStartQuiz) onStartQuiz(quiz);
            else if (onNavigateTab) onNavigateTab('playground');
            onClose();
          }
        });
      }
    });

    // Filter by selected category
    if (selectedCategory !== 'all') {
      results = results.filter(r => r.type === selectedCategory);
    }

    return results;
  }, [query, selectedCategory, lang, onSelectSubject, onNavigateTab, onClose, onStartQuiz]);

  // Keyboard navigation (Up/Down/Enter/Esc)
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < searchResults.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults.length > 0 && searchResults[selectedIndex]) {
        searchResults[selectedIndex].action();
      } else if (query.trim()) {
        // Fallback: Ask AI Tutor
        if (onOpenAITutor) onOpenAITutor(query);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[82vh] font-kantumruy select-none animate-scale-up"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        
        {/* 1. Spotlight Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <Search className="w-5 h-5 text-[#005baa] mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            placeholder={lang === 'km' ? 'ស្វែងរកអ្វីៗគ្រប់យ៉ាងក្នុងវិបផតថល (មេរៀន វិញ្ញាសា សៀវភៅពុម្ព...)' : 'Search everything across the portal (lessons, exams, books...)'}
            className="flex-1 bg-transparent text-sm sm:text-base font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors mr-2 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-1 mr-2 hidden sm:flex">
              <kbd className="px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-white border border-slate-200 rounded-md shadow-2xs">ESC</kbd>
            </div>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-200 hover:bg-rose-100 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Category Filter Pills */}
        <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-white">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => { setSelectedCategory(cat.id); setSelectedIndex(0); }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-[#005baa] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{lang === 'km' ? cat.labelKm : cat.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* 3. Dynamic Results Stream */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-3 space-y-1.5 max-h-[50vh]">
          {query.trim() === '' ? (
            /* Empty State: Popular Quick Searches */
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#005baa] flex items-center justify-center mx-auto shadow-xs">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-800">
                  {lang === 'km' ? 'ស្វែងរកមាតិកាអប់រំជាតិទូទាំងប្រទេស' : 'Explore National High School Archive'}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {lang === 'km' ? 'វាយបញ្ចូលឈ្មោះមុខវិជ្ជា មេរៀន វិញ្ញាសាបាក់ឌុប ឬប្រធានបទដែលចង់សិក្សា' : 'Type subjects, lesson topics, BacII exams, or textbook names'}
                </p>
              </div>

              <div className="pt-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {lang === 'km' ? 'ប្រធានបទពេញនិយម (Popular Queries)' : 'Trending Queries'}
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    'គណិតវិទ្យា ថ្នាក់ទី១២',
                    'វិញ្ញាសាបាក់ឌុប ២០២៤',
                    'រូបវិទ្យា លំយោល',
                    'គីមីវិទ្យា អាស៊ីត-បាស',
                    'ជីវវិទ្យា ហ្សែន DNA',
                    'សៀវភៅពុម្ព ថ្នាក់ទី១១'
                  ].map((keyword) => (
                    <button
                      key={keyword}
                      type="button"
                      onClick={() => setQuery(keyword)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 border border-slate-200 hover:border-[#005baa]/30 text-xs font-bold text-slate-700 hover:text-[#005baa] transition-all cursor-pointer shadow-2xs"
                    >
                      🔍 {keyword}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            /* Match List */
            <>
              <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>{lang === 'km' ? `លទ្ធផល (${searchResults.length})` : `Matches Found (${searchResults.length})`}</span>
                <span className="text-[10px] text-slate-400">ប្រើគ្រាប់ព្រួញ ↑ ↓ ដើម្បីរំកិល</span>
              </div>

              {searchResults.map((item, idx) => {
                const isSelected = selectedIndex === idx;
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={item.action}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center gap-3 border ${
                      isSelected
                        ? 'bg-blue-50/90 border-[#005baa]/30 shadow-xs scale-[1.005]'
                        : 'bg-white hover:bg-slate-50 border-slate-100'
                    }`}
                  >
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-2xs"
                      style={{ backgroundColor: `${item.color}15`, color: item.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span 
                          className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider"
                          style={{ backgroundColor: `${item.color}18`, color: item.color }}
                        >
                          {item.badge}
                        </span>
                      </div>
                      <h5 className="text-xs sm:text-sm font-black text-slate-900 leading-snug truncate">
                        {item.title}
                      </h5>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0 text-slate-400">
                      {isSelected && (
                        <div className="flex items-center gap-1 text-[#005baa] font-bold text-xs animate-fadeIn">
                          <span>បើក</span>
                          <CornerDownLeft className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            /* No Results Found: Suggest Ask AI Tutor */
            <div className="p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-800">
                  {lang === 'km' ? `មិនមានទិន្នន័យសម្រាប់ "${query}"` : `No direct matches for "${query}"`}
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {lang === 'km' ? 'អ្នកអាចសួរទៅកាន់ជំនួយការគ្រូ AI ផ្លូវការ ដើម្បីទទួលបានការពន្យល់ និងចម្លើយភ្លាមៗ!' : 'Ask MoTDAR AI Tutor for step-by-step guidance, formulas, and solutions!'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onOpenAITutor) onOpenAITutor(query);
                  onClose();
                }}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#005baa] to-[#0284c7] hover:from-[#003876] hover:to-[#005baa] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 mx-auto cursor-pointer"
              >
                <Bot className="w-4 h-4 text-amber-300" />
                <span>{lang === 'km' ? `សួរគ្រូ AI ផ្លូវការអំពី៖ "${query}"` : `Ask MoTDAR AI Tutor about "${query}"`}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* 4. Footer Help / Shortcut Bar */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-bold">↵</kbd>
              <span>ជ្រើសរើស</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-bold">↑↓</kbd>
              <span>រំកិល</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-bold">ESC</kbd>
              <span>បិទ</span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              if (onOpenAITutor) onOpenAITutor(query || 'ជំរាបសួរគ្រូ AI');
              onClose();
            }}
            className="flex items-center gap-1.5 font-bold text-[#005baa] hover:text-[#002d62] transition-colors cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5 text-amber-500" />
            <span>{lang === 'km' ? 'ជំនួយការគ្រូ AI' : 'MoTDAR AI Tutor'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
