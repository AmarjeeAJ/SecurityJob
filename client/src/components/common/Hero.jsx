import { useLanguage } from '../../i18n/LanguageContext.jsx';

const HELP_PHONE = import.meta.env.VITE_WHATSAPP_NUMBER || '';

export default function Hero({ heading }) {
  const { t } = useLanguage();

  return (
    <div className="bg-white pb-8 pt-6 text-center sm:pb-10 sm:pt-8">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <h1 className="text-2xl font-extrabold leading-tight text-navy-900 sm:text-3xl">{heading}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600 sm:text-base">{t('hero.description')}</p>
        <div className="mx-auto mt-4 flex max-w-lg items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-left text-xs text-amber-800 sm:text-sm">
          <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
          </svg>
          <span>{t('hero.warning')}</span>
        </div>

        {HELP_PHONE && (
          <a
            href={`tel:+91${HELP_PHONE}`}
            className="mx-auto mt-4 flex max-w-lg items-center justify-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-sm font-semibold text-sky-700 transition-colors hover:bg-sky-100"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 0 1 2-2h3l2 5-2.5 1.5a11 11 0 0 0 5 5L14 12l5 2v3a2 2 0 0 1-2 2h-1C9.163 19 5 14.837 5 9V8" />
            </svg>
            {t('helpStrip.text')} · {t('helpStrip.action')}: {HELP_PHONE}
          </a>
        )}
      </div>
    </div>
  );
}
