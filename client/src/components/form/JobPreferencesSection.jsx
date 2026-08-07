import { Controller } from 'react-hook-form';
import TextInput from '../common/TextInput.jsx';
import SearchableMultiSelect from './SearchableMultiSelect.jsx';
import SectionHeading from './SectionHeading.jsx';
import JOB_ROLES from '../../utils/jobRoles.js';
import { INDIAN_CITIES } from '../../utils/locations.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

export default function JobPreferencesSection({ register, errors, control, watch }) {
  const { t, tError, tRole, tPlace } = useLanguage();
  const preferredRoles = watch('preferredRoles') || [];

  return (
    <section className="flex flex-col gap-5">
      <SectionHeading number={3} title={t('sections.jobPreferences')} totalSections={6} />

      <Controller
        name="preferredRoles"
        control={control}
        render={({ field }) => (
          <SearchableMultiSelect
            label={t('jobPrefs.preferredRoles')}
            required
            placeholder={t('jobPrefs.searchRoles')}
            options={JOB_ROLES}
            getOptionLabel={tRole}
            noMatchesText={t('jobPrefs.noMatches')}
            value={field.value}
            onChange={field.onChange}
            error={tError(errors.preferredRoles?.message)}
          />
        )}
      />

      {preferredRoles.includes('Other') && (
        <TextInput
          id="otherRoleText"
          label={t('jobPrefs.otherRoleLabel')}
          required
          error={tError(errors.otherRoleText?.message)}
          {...register('otherRoleText')}
        />
      )}

      <Controller
        name="preferredLocations"
        control={control}
        render={({ field }) => (
          <SearchableMultiSelect
            label={t('jobPrefs.preferredLocations')}
            required
            placeholder={t('jobPrefs.searchCities')}
            options={INDIAN_CITIES}
            getOptionLabel={tPlace}
            noMatchesText={t('jobPrefs.noMatches')}
            value={field.value}
            onChange={field.onChange}
            error={tError(errors.preferredLocations?.message)}
          />
        )}
      />
    </section>
  );
}
