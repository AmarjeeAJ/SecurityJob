import TextInput from '../common/TextInput.jsx';
import CheckboxInput from '../common/CheckboxInput.jsx';
import SectionHeading from './SectionHeading.jsx';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

// The +91 country code is shown as a fixed prefix outside the input, so the
// field itself only ever needs to hold the 10-digit national number.
const MOBILE_DIGITS = 10;

function digitsOnlyCapped(event) {
  event.target.value = event.target.value.replace(/\D/g, '').slice(0, MOBILE_DIGITS);
}

export default function ContactDetailsSection({ register, errors, watch, trigger }) {
  const { t, tError } = useLanguage();
  const whatsappSameAsMobile = watch('whatsappSameAsMobile');
  const mobileField = register('mobileNumber');
  const whatsappField = register('whatsappNumber');

  // The input stops accepting digits at 10, so reaching 10 *is* the end of
  // typing — validate right then instead of waiting for a blur or for submit.
  // Below 10 digits we stay quiet, otherwise a half-typed number would be
  // flagged as invalid while the candidate is still entering it.
  function validateWhenComplete(name) {
    return (event) => {
      if (event.target.value.length === MOBILE_DIGITS) trigger?.(name);
    };
  }

  return (
    <section className="flex flex-col gap-5">
      <SectionHeading number={2} title={t('sections.contactDetails')} totalSections={6} />

      <TextInput
        id="mobileNumber"
        label={t('contact.mobileNumber')}
        required
        type="tel"
        inputMode="numeric"
        prefix="+91"
        maxLength={MOBILE_DIGITS}
        placeholder={t('contact.mobileNumberPlaceholder')}
        error={tError(errors.mobileNumber?.message)}
        {...mobileField}
        onChange={(event) => {
          digitsOnlyCapped(event);
          mobileField.onChange(event);
          validateWhenComplete('mobileNumber')(event);
        }}
      />

      <CheckboxInput
        id="whatsappSameAsMobile"
        label={t('contact.whatsappSame')}
        {...register('whatsappSameAsMobile')}
      />

      {!whatsappSameAsMobile && (
        <TextInput
          id="whatsappNumber"
          label={t('contact.whatsappNumber')}
          required
          type="tel"
          inputMode="numeric"
          prefix="+91"
          maxLength={MOBILE_DIGITS}
          placeholder={t('contact.whatsappNumberPlaceholder')}
          error={tError(errors.whatsappNumber?.message)}
          {...whatsappField}
          onChange={(event) => {
            digitsOnlyCapped(event);
            whatsappField.onChange(event);
            validateWhenComplete('whatsappNumber')(event);
          }}
        />
      )}
    </section>
  );
}
