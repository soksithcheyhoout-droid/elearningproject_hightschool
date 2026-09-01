import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export default function ThemeToggle({ className = '', showLabel = false, variant = 'button' }) {
  const { theme, toggleTheme, isDark } = useTheme();
  const { lang } = useLanguage();

  if (variant === 'segmented') {
    return (
      <div className={`inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-2xs ${className}`}>
        <button
          type="button"
          onClick={() => isDark && toggleTheme()}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none ${
            !isDark 
              ? 'bg-white text-[#002d62] shadow-xs border border-slate-200/90 font-black' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title={lang === 'km' ? 'ផ្ទៃពណ៌ស (White Background)' : 'White Background'}
        >
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span>{lang === 'km' ? 'ផ្ទៃស' : 'White'}</span>
        </button>
        <button
          type="button"
          onClick={() => !isDark && toggleTheme()}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none ${
            isDark 
              ? 'bg-slate-900 text-amber-300 shadow-xs border border-amber-400/30 font-black ring-1 ring-amber-400/20' 
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
      className={`p-1.5 sm:p-2 rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer border flex-shrink-0 select-none active:scale-95 ${
        isDark
          ? 'bg-slate-800/90 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border-amber-400/30 hover:border-amber-300/60 shadow-xs ring-1 ring-amber-400/15'
          : 'bg-slate-50 hover:bg-blue-50/80 text-slate-700 hover:text-[#005baa] border-slate-200/90 hover:border-[#005baa]/40 shadow-2xs'
      } ${className}`}
      title={
        isDark 
          ? (lang === 'km' ? 'ប្តូរទៅផ្ទៃពណ៌ស (Switch to White Background)' : 'Switch to White Background')
          : (lang === 'km' ? 'ប្តូរទៅផ្ទៃពណ៌ខ្មៅ (Switch to Black Background)' : 'Switch to Black Background')
      }
      aria-label="Toggle White or Black Background"
    >
      <div className="relative w-4 h-4 sm:w-4.5 sm:h-4.5 flex items-center justify-center flex-shrink-0">
        {isDark ? (
          <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-400 animate-spin-slow drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]" />
        ) : (
          <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-700 hover:text-[#005baa] transition-colors" />
        )}
      </div>

      {showLabel && (
        <span className="text-[11px] sm:text-xs font-black ml-1.5 hidden min-[450px]:inline">
          {isDark 
            ? (lang === 'km' ? 'ផ្ទៃស' : 'Light')
            : (lang === 'km' ? 'ផ្ទៃខ្មៅ' : 'Dark')}
        </span>
      )}
    </button>
  );
}
