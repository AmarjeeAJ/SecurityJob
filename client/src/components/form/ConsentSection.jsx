import CheckboxInput from '../common/CheckboxInput.jsx';
import SectionHeading from './SectionHeading.jsx';

export default function ConsentSection({ register, errors }) {
  return (
    <section className="flex flex-col gap-4">
      <SectionHeading number={5} title="Consent" totalSections={5} />

      <div className="rounded-xl bg-navy-950/5 border border-navy-900/10 p-4">
        <CheckboxInput
          id="consentGiven"
          error={errors.consentGiven?.message}
          label={
            <>
              I confirm that the information provided by me is correct. I agree that SecurityJob and its
              authorized recruitment partners may contact me by phone, WhatsApp or SMS regarding suitable
              employment opportunities.
            </>
          }
          {...register('consentGiven')}
        />
      </div>

      <p className="text-xs text-slate-500">
        Registration does not guarantee employment or selection. By submitting, you agree to our{' '}
        <a href="/privacy-policy" className="underline hover:text-navy-800">Privacy Policy</a>,{' '}
        <a href="/terms-of-use" className="underline hover:text-navy-800">Terms of Use</a> and{' '}
        <a href="/candidate-consent-policy" className="underline hover:text-navy-800">Candidate Consent Policy</a>.
      </p>
    </section>
  );
}
