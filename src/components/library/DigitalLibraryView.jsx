import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  BookOpen, 
  Search, 
  Download, 
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
  ShieldCheck 
} from 'lucide-react';
import { libraryBooks } from '../../data/libraryBooks';
import { useLanguage } from '../../context/LanguageContext';

export default function DigitalLibraryView() {
  const { t, lang } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeReadingBook, setActiveReadingBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [fontSize, setFontSize] = useState(14);

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

  const filteredBooks = libraryBooks.filter(book => {
    const matchesSearch = book.titleKm.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          book.titleEn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || book.category.includes(selectedCategory);
    return matchesSearch && matchesCat;
  });

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

        <div className="max-w-2xl space-y-2 sm:space-y-3 relative z-10">
          <span className="bg-white/15 text-amber-300 border border-white/20 text-[10px] sm:text-xs font-black px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 backdrop-blur-md shadow-2xs">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{lang === 'km' ? 'បណ្ណាល័យសៀវភៅពុម្ពអេឡិចត្រូនិក' : 'Digital Textbook Library'}</span>
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
            {t('libraryTitle') || (lang === 'km' ? 'បណ្ណាល័យសៀវភៅពុម្ព និងឯកសារស្រាវជ្រាវ' : 'National Digital E-Book Library')}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-medium">
            {t('librarySubtitle') || (lang === 'km' ? 'បណ្តុំសៀវភៅពុម្ពផ្លូវការ សៀវភៅជំនួយស្មារតី និងឯកសារស្រាវជ្រាវកម្រិតវិទ្យាល័យ អាចអាន និងទាញយកបានដោយឥតគិតថ្លៃ។' : 'Official curriculum textbooks, supplementary manuals, and high-school research literature for free reading and offline download.')}
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 bg-white/95 backdrop-blur-md p-4 rounded-3xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder={t('searchBook') || (lang === 'km' ? 'ស្វែងរកសៀវភៅពុម្ព...' : 'Search textbooks...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-2xl py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#005baa] focus:bg-white font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs w-full sm:w-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-2xl font-bold transition-all cursor-pointer ${
              selectedCategory === 'all' ? 'bg-[#005baa] text-white shadow-xs' : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {lang === 'km' ? 'ទាំងអស់' : 'All'}
          </button>
          <button
            onClick={() => setSelectedCategory('Math')}
            className={`px-3.5 py-1.5 rounded-2xl font-bold transition-all cursor-pointer ${
              selectedCategory === 'Math' ? 'bg-[#005baa] text-white shadow-xs' : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {lang === 'km' ? 'គណិតវិទ្យា' : 'Math'}
          </button>
          <button
            onClick={() => setSelectedCategory('Physics')}
            className={`px-3.5 py-1.5 rounded-2xl font-bold transition-all cursor-pointer ${
              selectedCategory === 'Physics' ? 'bg-[#005baa] text-white shadow-xs' : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {lang === 'km' ? 'រូបវិទ្យា' : 'Physics'}
          </button>
          <button
            onClick={() => setSelectedCategory('Chemistry')}
            className={`px-3.5 py-1.5 rounded-2xl font-bold transition-all cursor-pointer ${
              selectedCategory === 'Chemistry' ? 'bg-[#005baa] text-white shadow-xs' : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {lang === 'km' ? 'គីមីវិទ្យា' : 'Chemistry'}
          </button>
          <button
            onClick={() => setSelectedCategory('Khmer')}
            className={`px-3.5 py-1.5 rounded-2xl font-bold transition-all cursor-pointer ${
              selectedCategory === 'Khmer' ? 'bg-[#005baa] text-white shadow-xs' : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {lang === 'km' ? 'ភាសាខ្មែរ' : 'Khmer'}
          </button>
        </div>
      </div>

      {/* Section Title */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#005baa] flex items-center justify-center font-bold">
            <BookOpen className="w-4.5 h-4.5" />
          </div>
          <h3 className="text-sm sm:text-base font-black text-[#003366]">
            {lang === 'km' ? 'សៀវភៅពុម្ពអេឡិចត្រូនិកផ្លូវការ' : 'Official Digital Textbooks'}
          </h3>
        </div>
        <span className="text-[11px] sm:text-xs text-slate-500 font-bold">
          {filteredBooks.length} {lang === 'km' ? 'ក្បាល' : 'Books'}
        </span>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
        {filteredBooks.map((book) => (
          <div key={book.id} className="group flex flex-col justify-between overflow-hidden shadow-xs border border-slate-200 hover:border-blue-400/80 hover:shadow-xl rounded-3xl bg-white transition-all duration-300">
            
            <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
              <img 
                src={book.coverUrl} 
                alt={book.titleKm} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3">
                <span className="badge-moeys-gold text-[8.5px] sm:text-[10px] px-2 py-0.5 rounded-lg font-black shadow-2xs">
                  {lang === 'km' ? `ថ្នាក់ទី${book.grade === 'international' ? 'អន្តរជាតិ' : book.grade}` : `Grade ${book.grade === 'international' ? 'Intl' : book.grade}`}
                </span>
              </div>

              <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 flex items-center justify-between text-[10px] sm:text-xs text-white">
                <span className="flex items-center gap-1 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-cinzel">{book.rating}</span>
                </span>
                <span className="text-[9.5px] sm:text-[11px] font-cinzel text-slate-200 font-bold">
                  {book.pages} {lang === 'km' ? 'ទំព័រ' : 'pages'}
                </span>
              </div>
            </div>

            <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-0.5">
                <p className="text-[9.5px] sm:text-[11px] text-[#005baa] font-bold truncate">{book.author}</p>
                <h3 className="font-black text-xs sm:text-sm text-[#003366] line-clamp-2 leading-tight group-hover:text-[#005baa] transition-colors">
                  {lang === 'km' ? book.titleKm : book.titleEn}
                </h3>
              </div>

              <div className="pt-2 sm:pt-3 border-t border-slate-100 flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setActiveReadingBook(book);
                    setCurrentPage(1);
                  }}
                  className="flex-1 bg-[#005baa] hover:bg-[#003876] text-white py-2 text-[10.5px] sm:text-xs font-bold shadow-xs rounded-xl cursor-pointer transition-colors active:scale-95 flex items-center justify-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{t('readBook') || (lang === 'km' ? 'អានសៀវភៅ' : 'Read')}</span>
                </button>
                <button
                  onClick={() => alert(lang === 'km' ? `សៀវភៅ ${book.titleKm} ត្រូវបានទាញយកជាទម្រង់ PDF ជោគជ័យ!` : `${book.titleEn} PDF downloaded successfully!`)}
                  className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-[#005baa] hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
                  title="ទាញយក PDF"
                >
                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>

            </div>

          </div>
        ))}
      </div>

      {/* Interactive E-Book Reader Modal */}
      {activeReadingBook && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto font-kantumruy animate-fadeIn">
          <div className="w-full max-w-4xl max-h-[92vh] flex flex-col justify-between shadow-2xl bg-white text-slate-900 border border-slate-200 rounded-3xl overflow-hidden my-auto">
            
            {/* Top Toolbar */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-blue-50/60 flex-shrink-0">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-[#005baa]" />
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-[#003366] line-clamp-1 font-kantumruy">
                    {lang === 'km' ? activeReadingBook.titleKm : activeReadingBook.titleEn}
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    {activeReadingBook.author} • ទំព័រ {currentPage} / {activeReadingBook.pages}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setFontSize(prev => Math.max(12, prev - 2))}
                  className="p-1.5 rounded bg-white border border-slate-300 text-slate-700 hover:text-[#005baa] cursor-pointer"
                  title="បង្រួមអក្សរ"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setFontSize(prev => Math.min(22, prev + 2))}
                  className="p-1.5 rounded bg-white border border-slate-300 text-slate-700 hover:text-[#005baa] cursor-pointer"
                  title="ពង្រីកអក្សរ"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setActiveReadingBook(null)}
                  className="p-1.5 rounded bg-white border border-slate-300 text-slate-700 hover:text-rose-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Reading Content */}
            <div className="p-6 sm:p-10 overflow-y-auto flex-1 space-y-6 leading-relaxed bg-[#fffdfa]" style={{ fontSize: `${fontSize}px` }}>
              <div className="max-w-2xl mx-auto space-y-4">
                <div className="text-center pb-6 border-b border-slate-200">
                  <span className="badge-moeys-gold text-xs">ទំព័រទី {currentPage}</span>
                  <h2 className="text-base sm:text-lg font-extrabold text-[#003366] mt-2 font-kantumruy leading-[1.6]">
                    {activeReadingBook.contentPreview[(currentPage - 1) % activeReadingBook.contentPreview.length]}
                  </h2>
                </div>

                <div className="space-y-4 leading-relaxed text-slate-800">
                  <p>
                    {activeReadingBook.descriptionKm}
                  </p>
                  <p>
                    ខ្លឹមសារមេរៀននេះត្រូវបានរៀបចំឡើងយ៉ាងយកចិត្តទុកដាក់បំផុត ស្របតាមកម្មវិធីសិក្សាស្តង់ដារបស់ក្រសួងអប់រំ យុវជន និងកីឡា ដើម្បីផ្តល់ចំណេះដឹងគ្រឹះដ៏រឹងមាំដល់សិស្សានុសិស្សក្នុងការត្រៀមប្រឡងសញ្ញាបត្រមធ្យមសិក្សាទុតិយភូមិ (បាក់ឌុប) និងការប្រឡងអាហារូបករណ៍នានា។
                  </p>
                  
                  <div className="p-4 rounded-xl border bg-[#f0f9ff] border-[#bae6fd] text-slate-900 shadow-sm">
                    <h4 className="font-bold mb-2 text-[#003366]">📌 ចំណុចគន្លឹះសំខាន់ៗដែលត្រូវកត់សម្គាល់៖</h4>
                    <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                      <li>ទន្ទេញរូបមន្តគ្រឹះ និងយល់ពីប្រភពទាញរូបមន្ត</li>
                      <li>អនុវត្តលំហាត់គំរូយ៉ាងហោចណាស់ ៥ ទៅ ១០ លំហាត់ក្នុងមួយថ្ងៃ</li>
                      <li>ពិនិត្យមើលកំហុសឆ្គងដែលធ្លាប់កើតឡើងញឹកញាប់ក្នុងការប្រឡងបាក់ឌុបកន្លងមក</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Page Navigation */}
            <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs bg-slate-50 flex-shrink-0">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="btn-moeys-secondary py-1.5 px-3 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>ទំព័រមុន</span>
              </button>

              <span className="font-cinzel text-slate-800 font-bold">
                {currentPage} / {activeReadingBook.pages}
              </span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(activeReadingBook.pages, prev + 1))}
                disabled={currentPage === activeReadingBook.pages}
                className="btn-moeys-secondary py-1.5 px-3 disabled:opacity-40 cursor-pointer"
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
