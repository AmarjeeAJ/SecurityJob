import { useLanguage } from '../../i18n/LanguageContext.jsx';

export default function LanguageToggle({ className = '' }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`inline-flex items-center rounded-full border border-slate-200 bg-slate-100 p-0.5 text-xs font-semibold ${className}`}>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        className={`rounded-full px-2.5 py-1 transition-colors ${
          language === 'en' ? 'bg-navy-900 text-white' : 'text-slate-500 hover:text-navy-800'
        }`}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => setLanguage('hi')}
        aria-pressed={language === 'hi'}
        className={`rounded-full px-2.5 py-1 transition-colors ${
          language === 'hi' ? 'bg-navy-900 text-white' : 'text-slate-500 hover:text-navy-800'
        }`}
      >
        हिंदी
      </button>
    </div>
  );
}
