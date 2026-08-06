import { useState } from 'react';
import Button from '../common/Button.jsx';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

export default function SuccessState({ candidateCode, isExistingCandidate, whatsappNumber, onSubmitAnother }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(candidateCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can be unavailable in some mobile browsers; the code is still visible on screen.
    }
  }

  return (
    <div className="flex flex-col items-center gap-5 py-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-navy-900">{t('success.title')}</h2>
        <p className="mt-2 text-slate-600 max-w-sm">
          {t('success.thankYou')}
          {isExistingCandidate && ' ' + t('success.existingUpdated')}
        </p>
      </div>

      <div className="w-full max-w-xs rounded-xl border border-gold-500/50 bg-gold-500/10 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-navy-700">{t('success.candidateId')}</p>
        <p className="mt-1 text-xl font-bold tracking-wide text-navy-900">{candidateCode}</p>
        <button
          type="button"
          onClick={handleCopy}
          className="mt-2 text-sm font-semibold text-navy-700 underline underline-offset-2"
        >
          {copied ? t('success.copied') : t('success.copy')}
        </button>
      </div>

      <p className="text-sm text-slate-600 max-w-sm">{t('success.contactNote')}</p>

      <div className="flex w-full max-w-xs flex-col gap-3">
        {whatsappNumber && (
          <Button
            variant="gold"
            className="w-full"
            onClick={() =>
              window.open(
                `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi, I registered on SecurityJob. My Candidate ID is ${candidateCode}.`)}`,
                '_blank'
              )
            }
          >
            {t('success.whatsappUs')}
          </Button>
        )}
        <Button variant="outline" className="w-full" onClick={onSubmitAnother}>
          {t('success.submitAnother')}
        </Button>
      </div>
    </div>
  );
}
