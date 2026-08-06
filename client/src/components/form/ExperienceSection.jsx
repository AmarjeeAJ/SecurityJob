import TextInput from '../common/TextInput.jsx';
import SelectInput from '../common/SelectInput.jsx';
import FileField from '../common/FileField.jsx';
import SectionHeading from './SectionHeading.jsx';

const EMPLOYMENT_STATUS_OPTIONS = [
  { value: 'employed', label: 'Currently Employed' },
  { value: 'unemployed', label: 'Unemployed' },
  { value: 'student', label: 'Student' },
  { value: 'other', label: 'Other' },
];

const JOINING_AVAILABILITY_OPTIONS = [
  { value: 'immediate', label: 'Immediate' },
  { value: 'within_15_days', label: 'Within 15 Days' },
  { value: 'within_30_days', label: 'Within 30 Days' },
  { value: 'more_than_30_days', label: 'More than 30 Days' },
];

const DUTY_HOUR_OPTIONS = [
  { value: '8_hours', label: '8 Hours' },
  { value: '12_hours', label: '12 Hours' },
  { value: 'rotational', label: 'Rotational' },
  { value: 'any', label: 'Any' },
];

export default function ExperienceSection({ register, errors }) {
  return (
    <section className="flex flex-col gap-5">
      <SectionHeading number={4} title="Experience" totalSections={5} />

      <TextInput
        id="securityExperienceMonths"
        label="Security Experience (months)"
        type="number"
        inputMode="numeric"
        placeholder="0"
        error={errors.securityExperienceMonths?.message}
        {...register('securityExperienceMonths')}
      />

      <SelectInput
        id="currentEmploymentStatus"
        label="Current Employment Status"
        required
        placeholder="Select"
        options={EMPLOYMENT_STATUS_OPTIONS}
        error={errors.currentEmploymentStatus?.message}
        {...register('currentEmploymentStatus')}
      />

      <SelectInput
        id="joiningAvailability"
        label="Joining Availability"
        required
        placeholder="Select"
        options={JOINING_AVAILABILITY_OPTIONS}
        error={errors.joiningAvailability?.message}
        {...register('joiningAvailability')}
      />

      <SelectInput
        id="dutyHourPreference"
        label="Duty-Hour Preference"
        required
        placeholder="Select"
        options={DUTY_HOUR_OPTIONS}
        error={errors.dutyHourPreference?.message}
        {...register('dutyHourPreference')}
      />

      <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-navy-900">Aadhaar Card</p>
          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-500">Optional</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FileField
            id="aadhaarFront"
            label="Front Side"
            accept="image/jpeg,image/png,image/webp"
            error={errors.aadhaarFront?.message}
            {...register('aadhaarFront')}
          />
          <FileField
            id="aadhaarBack"
            label="Back Side"
            accept="image/jpeg,image/png,image/webp"
            error={errors.aadhaarBack?.message}
            {...register('aadhaarBack')}
          />
        </div>
        <p className="mt-2.5 text-xs text-slate-400">Clear photos of both sides, JPG/PNG/WEBP, up to 5 MB each.</p>
      </div>
    </section>
  );
}
