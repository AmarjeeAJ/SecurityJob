import CheckboxInput from '../common/CheckboxInput.jsx';
import SectionHeading from './SectionHeading.jsx';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

export default function ConsentSection({ register, errors }) {
  const { t, tError, language } = useLanguage();

  const privacyLink = (
    <a href="/privacy-policy" className="underline hover:text-navy-800">{t('consent.privacyPolicy')}</a>
  );
  const termsLink = <a href="/terms-of-use" className="underline hover:text-navy-800">{t('consent.termsOfUse')}</a>;
  const consentLink = (
    <a href="/candidate-consent-policy" className="underline hover:text-navy-800">{t('consent.consentPolicy')}</a>
  );

  return (
    <section className="flex flex-col gap-4">
      <SectionHeading number={5} title={t('sections.consent')} totalSections={5} />

      <div className="rounded-xl bg-navy-950/5 border border-navy-900/10 p-4">
        <CheckboxInput
          id="consentGiven"
          error={tError(errors.consentGiven?.message)}
          label={t('consent.statement')}
          {...register('consentGiven')}
        />
      </div>

      {/* Hindi and English put the linked phrase in a different position in the
          sentence, so this renders two distinct sentence structures rather than
          trying to force one template to work in both word orders. */}
      <p className="text-xs text-slate-500">
        {language === 'hi' ? (
          <>पंजीकरण रोजगार या चयन की गारंटी नहीं देता। सबमिट करके, आप हमारी {privacyLink}, {termsLink} और {consentLink} से सहमत होते हैं।</>
        ) : (
          <>
            Registration does not guarantee employment or selection. By submitting, you agree to our {privacyLink},{' '}
            {termsLink} and {consentLink}.
          </>
        )}
      </p>
    </section>
  );
}
