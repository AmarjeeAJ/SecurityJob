import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { translations, validationMessages } from './translations.js';

const LanguageContext = createContext(null);
const STORAGE_KEY = 'sj_language';

function getInitialLanguage() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'hi' ? 'hi' : 'en';
  } catch {
    return 'en'; // localStorage can be unavailable (private browsing) — default to English.
  }
}

function getByPath(dict, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), dict);
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage);

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang);
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Language just won't persist across visits; not worth failing over.
    }
  }, []);

  const t = useCallback(
    (key) => getByPath(translations[language], key) ?? getByPath(translations.en, key) ?? key,
    [language]
  );

  // Zod messages are looked up by their exact English text (the schema's own
  // message), so a missing translation safely falls back to the original
  // English rather than showing a raw key.
  const tError = useCallback(
    (message) => (message ? validationMessages[language]?.[message] || message : message),
    [language]
  );

  const tRole = useCallback((roleName) => translations[language]?.jobRoles?.[roleName] || roleName, [language]);

  const value = useMemo(
    () => ({ language, setLanguage, t, tError, tRole }),
    [language, setLanguage, t, tError, tRole]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
