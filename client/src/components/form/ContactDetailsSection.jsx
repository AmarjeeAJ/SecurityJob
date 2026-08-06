import TextInput from '../common/TextInput.jsx';
import CheckboxInput from '../common/CheckboxInput.jsx';
import SectionHeading from './SectionHeading.jsx';

// Max raw digits a typed value can contain: 10-digit number, optionally prefixed
// with country code "91" or a leading "0" (matches normalizeIndianMobile).
const MAX_MOBILE_DIGITS = 12;

function stopTypingAfterMaxDigits(event) {
  const raw = event.target.value;
  let digitCount = 0;
  for (let i = 0; i < raw.length; i += 1) {
    if (/\d/.test(raw[i])) {
      digitCount += 1;
      if (digitCount > MAX_MOBILE_DIGITS) {
        event.target.value = raw.slice(0, i);
        break;
      }
    }
  }
}

export default function ContactDetailsSection({ register, errors, watch }) {
  const whatsappSameAsMobile = watch('whatsappSameAsMobile');
  const mobileField = register('mobileNumber');
  const whatsappField = register('whatsappNumber');

  return (
    <section className="flex flex-col gap-5">
      <SectionHeading number={2} title="Contact Details" totalSections={5} />

      <TextInput
        id="mobileNumber"
        label="Mobile Number"
        required
        type="tel"
        inputMode="numeric"
        maxLength={15}
        placeholder="10-digit mobile number"
        error={errors.mobileNumber?.message}
        {...mobileField}
        onChange={(event) => {
          stopTypingAfterMaxDigits(event);
          mobileField.onChange(event);
        }}
      />

      <CheckboxInput
        id="whatsappSameAsMobile"
        label="WhatsApp number is same as mobile number"
        {...register('whatsappSameAsMobile')}
      />

      {!whatsappSameAsMobile && (
        <TextInput
          id="whatsappNumber"
          label="WhatsApp Number"
          required
          type="tel"
          inputMode="numeric"
          maxLength={15}
          placeholder="10-digit WhatsApp number"
          error={errors.whatsappNumber?.message}
          {...whatsappField}
          onChange={(event) => {
            stopTypingAfterMaxDigits(event);
            whatsappField.onChange(event);
          }}
        />
      )}
    </section>
  );
}
