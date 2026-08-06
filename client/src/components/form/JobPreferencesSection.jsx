import { Controller } from 'react-hook-form';
import TextInput from '../common/TextInput.jsx';
import SearchableMultiSelect from './SearchableMultiSelect.jsx';
import SectionHeading from './SectionHeading.jsx';
import JOB_ROLES from '../../utils/jobRoles.js';
import { INDIAN_CITIES } from '../../utils/locations.js';

export default function JobPreferencesSection({ register, errors, control, watch }) {
  const preferredRoles = watch('preferredRoles') || [];

  return (
    <section className="flex flex-col gap-5">
      <SectionHeading number={3} title="Job Preferences" totalSections={5} />

      <Controller
        name="preferredRoles"
        control={control}
        render={({ field }) => (
          <SearchableMultiSelect
            label="Preferred Job Role(s)"
            required
            placeholder="Search job roles..."
            options={JOB_ROLES}
            value={field.value}
            onChange={field.onChange}
            error={errors.preferredRoles?.message}
          />
        )}
      />

      {preferredRoles.includes('Other') && (
        <TextInput
          id="otherRoleText"
          label="Please specify the role"
          required
          error={errors.otherRoleText?.message}
          {...register('otherRoleText')}
        />
      )}

      <Controller
        name="preferredLocations"
        control={control}
        render={({ field }) => (
          <SearchableMultiSelect
            label="Preferred Working City / Cities"
            required
            placeholder="Search cities..."
            options={INDIAN_CITIES}
            value={field.value}
            onChange={field.onChange}
            error={errors.preferredLocations?.message}
          />
        )}
      />
    </section>
  );
}
