import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('khmer_elearn_lang') || 'km';
  });

  const setLang = (newLang) => {
    setLangState(newLang);
    localStorage.setItem('khmer_elearn_lang', newLang);
    document.documentElement.lang = newLang;
  };

  const t = (key) => {
    if (translations[lang] && translations[lang][key]) {
      return translations[lang][key];
    }
    if (translations['km'] && translations['km'][key]) {
      return translations['km'][key];
    }
    return key;
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
