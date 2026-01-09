
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale } from '../types';
import { translations } from '../i18n/translations';

interface LanguageContextType {
  locale: Locale;
  t: any;
  setLocale: (locale: Locale) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem('arabingo_locale');
    return (saved as Locale) || 'fr';
  });

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('arabingo_locale', newLocale);
  };

  const isRTL = locale === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [locale, isRTL]);

  const t = translations[locale];

  return (
    <LanguageContext.Provider value={{ locale, t, setLocale, isRTL }}>
      <div className={isRTL ? 'arabic-text' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useTranslation must be used within a LanguageProvider');
  return context;
};
