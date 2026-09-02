import React, { useState, useEffect } from 'react';
import { 
  Home, 
  BookOpen, 
  GraduationCap, 
  Library, 
  FlaskConical, 
  Bot, 
  UserCheck, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Building2,
  Compass,
  Award,
  Gamepad2,
  Flame,
  MessageSquare,
  Phone,
  Mail,
  X
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import ThemeToggle from '../common/ThemeToggle';

export default function Sidebar({ activeTab, setActiveTab, onOpenAITutor, isOpen, onClose }) {
  const { lang, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
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

  const navItems = [
    { 
      id: 'home', 
      label: t('navHome') || (lang === 'km' ? 'ទំព័រដើម' : 'Home'), 
      icon: Home, 
      badge: null,
      iconColor: 'from-blue-500 to-indigo-600'
    },
    { 
      id: 'courses', 
      label: t('navCourses') || (lang === 'km' ? 'កម្មវិធីសិក្សាជាតិ' : 'Curriculum'), 
      icon: BookOpen, 
      badge: lang === 'km' ? 'ថ្នាក់ទី១០-១២' : 'Grades 10-12',
      badgeClass: 'bg-blue-50/90 text-blue-700 border-blue-200/90',
      iconColor: 'from-sky-500 to-blue-600'
    },
    { 
      id: 'bacii', 
      label: t('navBacII') || (lang === 'km' ? 'វិញ្ញាសាប្រឡងបាក់ឌុប' : 'BacII Prep Hub'), 
      icon: GraduationCap, 
      badge: lang === 'km' ? 'បាក់ឌុប' : 'Bac II', 
      badgeClass: 'bg-rose-50/90 text-rose-600 border-rose-200/90',
      iconColor: 'from-rose-500 to-red-600'
    },
    { 
      id: 'playground', 
      label: t('navPlayground') || (lang === 'km' ? 'សង្វៀនហ្គេមអប់រំ' : 'Game Arena'), 
      icon: Gamepad2, 
      badge: lang === 'km' ? 'ហាត់សម' : 'Arena', 
      badgeClass: 'bg-amber-50/90 text-amber-700 border-amber-200/90',
      iconColor: 'from-amber-500 to-orange-600'
    },
    { 
      id: 'chat', 
      label: t('navChat') || (lang === 'km' ? 'សារ & ជជែកកំសាន្ត' : 'Messenger & Chat'), 
      icon: MessageSquare, 
      badge: lang === 'km' ? 'ជជែកផ្ទាល់' : 'Live Chat', 
      badgeClass: 'bg-cyan-50/90 text-cyan-700 border-cyan-200/90',
      iconColor: 'from-cyan-500 to-blue-600'
    },
    { 
      id: 'library', 
      label: t('navLibrary') || (lang === 'km' ? 'សៀវភៅពុម្ពអេឡិចត្រូនិក' : 'Digital Textbooks'), 
      icon: Library, 
      badge: lang === 'km' ? 'សៀវភៅពុម្ព' : 'E-Books',
      badgeClass: 'bg-indigo-50/90 text-indigo-700 border-indigo-200/90',
      iconColor: 'from-indigo-500 to-purple-600'
    },
    { 
      id: 'lab', 
      label: t('navLab') || (lang === 'km' ? 'បន្ទប់ពិសោធន៍ STEM' : 'Virtual Lab'), 
      icon: FlaskConical, 
      badge: 'STEM', 
      badgeClass: 'bg-emerald-50/90 text-emerald-700 border-emerald-200/90',
      iconColor: 'from-emerald-500 to-teal-600'
    },
    { 
      id: 'dashboard', 
      label: t('navDashboard') || (lang === 'km' ? 'កម្រងព័ត៌មានសិស្ស' : 'Student Profile'), 
      icon: UserCheck, 
      badge: lang === 'km' ? 'ប្រវត្តិរូប' : 'Profile',
      badgeClass: 'bg-purple-50/90 text-purple-700 border-purple-200/90',
      iconColor: 'from-purple-500 to-pink-600'
    },
  ];

  return (
    <>
      {/* Mobile / Tablet Drawer Backdrop Scrim */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[299] xl:hidden transition-opacity duration-300 animate-fadeIn"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar:
          - Mobile / Tablet (< xl): Full-screen height off-canvas sheet (top-0 to bottom-0)
          - Desktop (xl:): Permanently docked on left below top navbar
      */}
      <aside 
        className={`fixed flex flex-col flex-shrink-0 bg-white dark:bg-[#0c1427] border-r border-slate-200/90 dark:border-slate-800/90 select-none shadow-2xl xl:shadow-none font-kantumruy transition-transform duration-300 ease-in-out [scrollbar-width:thin] [scrollbar-color:rgba(0,91,170,0.15)_transparent]
          top-0 bottom-0 left-0 w-[86vw] max-w-[330px] z-[300] h-[100dvh]
          ${isOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'}
          xl:w-72 xl:z-30 xl:shadow-xs
          ${isScrolled ? 'xl:top-[60px] xl:sm:top-[64px] xl:h-[calc(100vh-64px)]' : 'xl:top-[106px] xl:sm:top-[116px] xl:h-[calc(100vh-116px)]'}
        `}
      >
        
        {/* Header Menu Section Badge (Prominent on Mobile, Compact on PC) */}
        <div className="flex items-center justify-between px-3.5 py-3 border-b border-slate-100 dark:border-slate-800/80 flex-shrink-0 bg-slate-50/70 dark:bg-slate-900/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-200/80 dark:border-blue-500/30 flex items-center justify-center p-1 shadow-2xs flex-shrink-0">
              <img 
                src="/assets/moeys-crest-transparent.png" 
                alt="MoEYS Crest" 
                className="w-full h-full object-contain filter drop-shadow-2xs"
                onError={(e) => { e.target.src = '/assets/moeys-custom-logo-transparent.png'; }}
              />
            </div>
            <div className="flex flex-col text-left leading-tight min-w-0">
              <span className="text-xs font-black text-[#002d62] dark:text-white uppercase tracking-wider truncate">
                {lang === 'km' ? 'ម៉ឺនុយចម្បង' : 'Main Menu'}
              </span>
              <span className="text-[9.5px] font-bold text-[#005baa] dark:text-cyan-400 truncate">
                MoEYS National Portal
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="hidden sm:inline-block text-[9.5px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
              Portal
            </span>
            {/* Close Button on Mobile / Tablet */}
            <button
              type="button"
              onClick={onClose}
              className="xl:hidden w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Container for Navigation & Footer Info */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 [scrollbar-width:thin] [scrollbar-color:rgba(0,91,170,0.15)_transparent]">
          
          {/* Navigation Items List */}
          <nav className="space-y-1 font-kantumruy">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs sm:text-[12.5px] font-bold transition-all duration-200 group cursor-pointer relative ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-transparent dark:from-blue-600/30 dark:via-indigo-600/20 dark:to-transparent text-[#005baa] dark:text-cyan-300 border border-blue-300/60 dark:border-cyan-500/40 shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-[#005baa] dark:hover:text-white hover:bg-slate-50/80 dark:hover:bg-slate-800/70 border border-transparent'
                  }`}
                >
                  {/* Left Active Glow Indicator */}
                  {isActive && (
                    <span className="absolute left-0 top-2.5 bottom-2.5 w-1.5 rounded-r-full bg-gradient-to-b from-[#005baa] to-indigo-500 shadow-sm shadow-blue-500/40" />
                  )}

                  <div className="flex items-center gap-2.5 min-w-0 pr-1">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                      isActive 
                        ? `bg-gradient-to-br ${item.iconColor} text-white shadow-md shadow-blue-500/25` 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-blue-50 dark:group-hover:bg-slate-700 group-hover:text-[#005baa] dark:group-hover:text-cyan-300 group-hover:scale-105'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`truncate text-xs ${isActive ? 'text-[#003366] dark:text-white font-extrabold' : 'text-slate-700 dark:text-slate-300 font-semibold group-hover:text-[#005baa] dark:group-hover:text-white'}`}>
                      {item.label}
                    </span>
                  </div>
                  
                  {item.badge && (
                    <span className={`text-[9.5px] font-black px-2 py-0.5 rounded-full border flex-shrink-0 shadow-2xs whitespace-nowrap transition-transform duration-200 group-hover:scale-105 ${item.badgeClass || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* ☀️ / 🌙 Background Theme Selector (White or Black) */}
          <div className="pt-2 pb-1">
            <div className="text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1.5 px-1 flex items-center justify-between">
              <span>{lang === 'km' ? 'ផ្ទៃពណ៌ (Theme)' : 'Appearance'}</span>
            </div>
            <ThemeToggle variant="segmented" className="w-full justify-between" />
          </div>

          {/* Official MoEYS Hotline & National Info Card (With Phone, Gmail, Telegram) */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="bg-gradient-to-br from-blue-50/80 via-slate-50 to-indigo-50/60 dark:from-slate-900/90 dark:via-[#0c1427] dark:to-slate-900/90 rounded-2xl p-3 border border-blue-100/80 dark:border-slate-800/80 space-y-2 text-center shadow-2xs">
              <div className="flex items-center justify-center gap-1.5 text-[#003366] dark:text-amber-300 font-extrabold text-[11px]">
                <img src="/assets/moeys-crest-transparent.png" alt="MoTDAR" className="w-4 h-4 object-contain" />
                <span>{lang === 'km' ? 'ជំនួយការសិក្សាជាតិ' : 'National Support'}</span>
              </div>
              
              <div className="text-[10.5px] text-slate-600 dark:text-slate-300 font-semibold space-y-1">
                {/* Phone Link */}
                <a 
                  href="tel:0977416126" 
                  className="flex items-center justify-center gap-1.5 hover:text-[#005baa] dark:hover:text-cyan-400 font-mono font-bold text-xs"
                >
                  <Phone className="w-3 h-3 text-[#005baa] dark:text-cyan-400" />
                  <span>097 741 6126</span>
                </a>

                {/* Email Link */}
                <a 
                  href="mailto:soksithcheyhoout@gmail.com" 
                  className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 hover:text-[#005baa] dark:hover:text-cyan-400 font-mono truncate"
                >
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span className="truncate">soksithcheyhoout@gmail.com</span>
                </a>

                {/* Telegram Link */}
                <a 
                  href="https://t.me/kaixite" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block text-[10px] text-sky-600 dark:text-sky-400 hover:underline font-mono font-bold pt-0.5"
                >
                  Telegram: @kaixite
                </a>
              </div>

              <button
                type="button"
                onClick={() => {
                  onOpenAITutor();
                  if (onClose) onClose();
                }}
                className="w-full py-2 px-2.5 rounded-xl bg-[#005baa] hover:bg-[#003d7a] dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-[10.5px] font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Bot className="w-3.5 h-3.5 text-amber-300" />
                <span>{lang === 'km' ? 'សួរគ្រូ AI MoTDAR' : 'Ask MoTDAR AI'}</span>
              </button>
            </div>
          </div>

          {/* Bottom Buffer to Guarantee No Cut-Off on iOS Safari & Mobile Browsers */}
          <div className="h-8 flex-shrink-0" />

        </div>

      </aside>
    </>
  );
}
