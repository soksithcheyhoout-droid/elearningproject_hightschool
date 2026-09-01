import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export default function ThemeToggle({ className = '', showLabel = true, variant = 'button' }) {
  const { theme, toggleTheme, isDark } = useTheme();
  const { lang } = useLanguage();

  if (variant === 'segmented') {
    return (
      <div className={`inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ${className}`}>
        <button
          type="button"
          onClick={() => isDark && toggleTheme()}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            !isDark 
              ? 'bg-white text-[#002d62] shadow-xs border border-slate-200' 
              : 'text-slate-400 hover:text-white'
          }`}
          title={lang === 'km' ? 'ផ្ទៃពណ៌ស (White Background)' : 'White Background'}
        >
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span>{lang === 'km' ? 'ផ្ទៃស' : 'White'}</span>
        </button>
        <button
          type="button"
          onClick={() => !isDark && toggleTheme()}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            isDark 
              ? 'bg-[#0f172a] text-amber-300 shadow-xs border border-slate-700' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
          title={lang === 'km' ? 'ផ្ទៃពណ៌ខ្មៅ (Black Background)' : 'Black Background'}
        >
          <Moon className="w-3.5 h-3.5 text-indigo-400" />
          <span>{lang === 'km' ? 'ផ្ទៃខ្មៅ' : 'Black'}</span>
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`h-[33px] sm:h-[35px] md:h-[36px] px-2 sm:px-2.5 rounded-xl border transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap select-none active:scale-95 flex-shrink-0 ${
        isDark
          ? 'bg-slate-800/95 hover:bg-slate-700/90 text-amber-300 border-amber-400/40 hover:border-amber-300 ring-1 ring-amber-400/20 shadow-[0_2px_8px_rgba(245,158,11,0.15)]'
          : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-[#005baa] border-slate-200/90 hover:border-[#005baa]/50'
      } ${className}`}
      title={
        isDark 
          ? (lang === 'km' ? 'ចុចដើម្បីប្តូរទៅផ្ទៃពណ៌ស (Switch to White Background)' : 'Switch to White Background')
          : (lang === 'km' ? 'ចុចដើម្បីប្តូរទៅផ្ទៃពណ៌ខ្មៅ (Switch to Black Background)' : 'Switch to Black Background')
      }
      aria-label="Toggle White or Black Background"
    >
      <div className="relative w-4 h-4 flex items-center justify-center flex-shrink-0">
        {isDark ? (
          <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-spin-slow" />
        ) : (
          <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-700 group-hover:text-[#005baa]" />
        )}
      </div>

      {showLabel && (
        <span className="text-[11px] sm:text-xs font-black hidden min-[450px]:inline">
          {isDark 
            ? (lang === 'km' ? 'ផ្ទៃខ្មៅ' : 'Dark')
            : (lang === 'km' ? 'ផ្ទៃស' : 'Light')}
        </span>
      )}
    </button>
  );
}
