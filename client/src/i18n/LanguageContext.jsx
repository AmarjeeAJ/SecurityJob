import { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react';
import { translations, validationMessages } from './translations.js';

const LanguageContext = createContext(null);
const STORAGE_KEY = 'sj_language';

/**
 * Automatically detects whether the user's mobile device or browser is set to Hindi.
 * If the user has previously explicitly chosen a language, their stored preference is used.
 * Otherwise, if the employee's mobile/browser language is Hindi (e.g., 'hi', 'hi-IN'), default to Hindi ('hi').
 * Otherwise, default to English ('en').
 */
function getInitialLanguage() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'hi' || stored === 'en') {
      return stored;
    }
  } catch {
    // localStorage unavailable (e.g., in private browsing)
  }

  try {
    const navLangs = navigator.languages || [navigator.language || navigator.userLanguage || ''];
    const isHindiDevice = navLangs.some(
      (lang) => typeof lang === 'string' && lang.toLowerCase().startsWith('hi')
    );
    return isHindiDevice ? 'hi' : 'en';
  } catch {
    return 'en';
  }
}

function getByPath(dict, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), dict);
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage);

  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch {
      // ignore
    }
  }, [language]);

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang);
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Language won't persist across visits if localStorage blocked
    }
  }, []);

  const t = useCallback(
    (key) => getByPath(translations[language], key) ?? getByPath(translations.en, key) ?? key,
    [language]
  );

  const tError = useCallback(
    (message) => (message ? validationMessages[language]?.[message] || message : message),
    [language]
  );

  const tRole = useCallback((roleName) => translations[language]?.jobRoles?.[roleName] || roleName, [language]);

  const tPlace = useCallback((placeName) => translations[language]?.places?.[placeName] || placeName, [language]);

  const value = useMemo(
    () => ({ language, setLanguage, t, tError, tRole, tPlace }),
    [language, setLanguage, t, tError, tRole, tPlace]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
