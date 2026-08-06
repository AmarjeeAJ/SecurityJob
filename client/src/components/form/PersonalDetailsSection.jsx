import TextInput from '../common/TextInput.jsx';
import SelectInput from '../common/SelectInput.jsx';
import SectionHeading from './SectionHeading.jsx';
import { INDIAN_CITIES, INDIAN_STATES } from '../../utils/locations.js';

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const QUALIFICATION_OPTIONS = [
  { value: 'Below 10th', label: 'Below 10th' },
  { value: '10th Pass', label: '10th Pass' },
  { value: '12th Pass', label: '12th Pass' },
  { value: 'ITI / Diploma', label: 'ITI / Diploma' },
  { value: 'Graduate', label: 'Graduate' },
  { value: 'Post Graduate', label: 'Post Graduate' },
];

export default function PersonalDetailsSection({ register, errors }) {
  return (
    <section className="flex flex-col gap-5">
      <SectionHeading number={1} title="Personal Details" totalSections={5} />

      <TextInput
        id="fullName"
        label="Full Name"
        required
        placeholder="e.g. Ramesh Kumar"
        error={errors.fullName?.message}
        {...register('fullName')}
      />

      <div className="grid grid-cols-2 gap-4">
        <TextInput
          id="age"
          label="Age"
          required
          type="number"
          inputMode="numeric"
          placeholder="Years"
          error={errors.age?.message}
          {...register('age')}
        />
        <SelectInput
          id="gender"
          label="Gender"
          required
          placeholder="Select"
          options={GENDER_OPTIONS}
          error={errors.gender?.message}
          {...register('gender')}
        />
      </div>

      <TextInput
        id="currentCity"
        label="Current City"
        required
        placeholder="e.g. Jaipur"
        datalistOptions={INDIAN_CITIES}
        error={errors.currentCity?.message}
        {...register('currentCity')}
      />

      <TextInput
        id="currentArea"
        label="Current Area / Locality"
        required
        placeholder="e.g. Malviya Nagar"
        error={errors.currentArea?.message}
        {...register('currentArea')}
      />

      <TextInput
        id="state"
        label="State"
        required
        placeholder="e.g. Rajasthan"
        datalistOptions={INDIAN_STATES}
        error={errors.state?.message}
        {...register('state')}
      />

      <SelectInput
        id="highestQualification"
        label="Highest Qualification"
        placeholder="Select (optional)"
        options={QUALIFICATION_OPTIONS}
        error={errors.highestQualification?.message}
        {...register('highestQualification')}
      />
    </section>
  );
}
