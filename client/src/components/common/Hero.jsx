import { useLanguage } from '../../i18n/LanguageContext.jsx';

export default function Hero({ heading }) {
  const { t } = useLanguage();

  return (
    <div className="bg-white pb-8 pt-6 text-center sm:pb-10 sm:pt-8">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <h1 className="text-2xl font-extrabold leading-tight text-navy-900 sm:text-3xl">{heading}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600 sm:text-base">{t('hero.description')}</p>
        <div className="mx-auto mt-4 flex max-w-lg items-start gap-2.5 rounded-xl border border-gold-300/60 bg-gold-500/10 px-4 py-3 text-left text-xs text-navy-800 sm:text-sm">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-500/25 text-gold-700">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" />
            </svg>
          </span>
          <span>{t('hero.warning')}</span>
        </div>
      </div>
    </div>
  );
}
