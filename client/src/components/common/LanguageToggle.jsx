import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { Globe } from 'lucide-react';

export default function LanguageToggle({ className = '' }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`inline-flex items-center rounded-xl border border-slate-200/90 bg-slate-100/90 p-0.5 text-xs font-bold shadow-2xs ${className}`}
      role="group"
      aria-label="Language selection"
    >
      <button
        type="button"
        onClick={() => setLanguage('hi')}
        aria-pressed={language === 'hi'}
        className={`inline-flex items-center gap-1 rounded-lg px-2 sm:px-2.5 py-1 sm:py-1.5 text-xs font-bold transition-all cursor-pointer ${
          language === 'hi'
            ? 'bg-blue-600 text-white shadow-xs font-extrabold'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
        }`}
      >
        <span>हिंदी</span>
      </button>

      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        className={`inline-flex items-center gap-1 rounded-lg px-2 sm:px-2.5 py-1 sm:py-1.5 text-xs font-bold transition-all cursor-pointer ${
          language === 'en'
            ? 'bg-blue-600 text-white shadow-xs font-extrabold'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
        }`}
      >
        <span>Eng</span>
      </button>
    </div>
  );
}
