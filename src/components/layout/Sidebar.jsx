import React from 'react';
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
  MessageSquare
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function Sidebar({ activeTab, setActiveTab, onOpenAITutor }) {
  const { lang, t } = useLanguage();

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
    <aside className="w-72 hidden md:flex flex-col flex-shrink-0 bg-white/95 backdrop-blur-md border-r border-slate-200/90 py-4 px-3 space-y-3 select-none shadow-xs font-kantumruy overflow-y-auto sticky top-[74px] sm:top-[80px] h-[calc(100vh-74px)] sm:h-[calc(100vh-80px)] self-start z-10 pb-8 [scrollbar-width:thin] [scrollbar-color:rgba(0,91,170,0.15)_transparent]">
      
      {/* Header Menu Section Badge */}
      <div className="flex items-center justify-between px-3 pb-2.5 border-b border-slate-100/90">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500/15 to-indigo-500/10 border border-blue-200/80 text-[#005baa] flex items-center justify-center font-bold shadow-2xs">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-black text-[#003366] uppercase tracking-wider">
            {lang === 'km' ? 'ម៉ឺនុយចម្បង' : 'Main Menu'}
          </span>
        </div>
        <span className="text-[9.5px] font-extrabold text-amber-800 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-full font-mono shadow-2xs flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          v2.5 BETA
        </span>
      </div>

      {/* Navigation Items List */}
      <nav className="space-y-1 font-kantumruy">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs sm:text-[12.5px] font-bold transition-all duration-200 group cursor-pointer relative ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500/12 via-indigo-500/8 to-transparent text-[#005baa] border border-blue-300/60 shadow-xs'
                  : 'text-slate-700 hover:text-[#005baa] hover:bg-slate-50/80 border border-transparent'
              }`}
            >
              {/* Left Active Glow Indicator */}
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full bg-gradient-to-b from-[#005baa] to-indigo-500 shadow-sm shadow-blue-500/40" />
              )}

              <div className="flex items-center gap-2.5 min-w-0 pr-1">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                  isActive 
                    ? `bg-gradient-to-br ${item.iconColor} text-white shadow-md shadow-blue-500/25` 
                    : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-[#005baa] group-hover:scale-105'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`truncate text-xs ${isActive ? 'text-[#003366] font-extrabold' : 'text-slate-700 font-semibold group-hover:text-[#005baa]'}`}>
                  {item.label}
                </span>
              </div>
              
              {item.badge && (
                <span className={`text-[9.5px] font-black px-2 py-0.5 rounded-full border flex-shrink-0 shadow-2xs whitespace-nowrap transition-transform duration-200 group-hover:scale-105 ${item.badgeClass || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Official MoEYS Hotline & National Info Card */}
      <div className="mt-auto pt-3 border-t border-slate-100">
        <div className="bg-gradient-to-br from-blue-50/80 via-slate-50 to-indigo-50/60 rounded-2xl p-3 border border-blue-100/80 space-y-2 text-center shadow-2xs">
          <div className="flex items-center justify-center gap-1.5 text-[#003366] font-extrabold text-[11px]">
            <img src="/assets/moeys-crest-transparent.png" alt="MoEYS" className="w-4 h-4 object-contain" />
            <span>{lang === 'km' ? 'ជំនួយការសិក្សាជាតិ' : 'National Support'}</span>
          </div>
          <div className="text-[10px] text-slate-600 font-semibold space-y-0.5">
            <p>
              <a href="https://t.me/kaixite" target="_blank" rel="noopener noreferrer" className="hover:text-[#005baa] font-mono font-bold">
                {lang === 'km' ? 'Telegram: @kaixite (097 741 6126)' : 'Telegram: @kaixite (097 741 6126)'}
              </a>
            </p>
            <p className="text-[9.5px] text-slate-500 truncate font-mono">
              soksithcheyhoout@gmail.com
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenAITutor}
            className="w-full py-1.5 px-2.5 rounded-xl bg-[#005baa] hover:bg-[#003d7a] text-white text-[10.5px] font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer active:scale-95"
          >
            <Bot className="w-3 h-3 text-amber-300" />
            <span>{lang === 'km' ? 'សួរគ្រូ AI MoTDAR' : 'Ask MoTDAR AI'}</span>
          </button>
        </div>
      </div>

    </aside>
  );
}
