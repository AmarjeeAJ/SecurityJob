import TextInput from '../common/TextInput.jsx';
import CheckboxInput from '../common/CheckboxInput.jsx';
import SectionHeading from './SectionHeading.jsx';

export default function ContactDetailsSection({ register, errors, watch }) {
  const whatsappSameAsMobile = watch('whatsappSameAsMobile');

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
        {...register('mobileNumber')}
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
          {...register('whatsappNumber')}
        />
      )}
    </section>
  );
}
