import { Controller } from 'react-hook-form';
import TextInput from '../common/TextInput.jsx';
import SelectInput from '../common/SelectInput.jsx';
import SearchableSelect from './SearchableSelect.jsx';
import SectionHeading from './SectionHeading.jsx';
import { INDIAN_CITIES, INDIAN_STATES } from '../../utils/locations.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

export default function PersonalDetailsSection({ register, errors, control }) {
  const { t, tError, tPlace } = useLanguage();

  const GENDER_OPTIONS = [
    { value: 'male', label: t('personal.male') },
    { value: 'female', label: t('personal.female') },
    { value: 'other', label: t('personal.other') },
  ];

  const QUALIFICATION_OPTIONS = [
    { value: 'Below 10th', label: t('personal.qualificationBelow10th') },
    { value: '10th Pass', label: t('personal.qualification10th') },
    { value: '12th Pass', label: t('personal.qualification12th') },
    { value: 'ITI / Diploma', label: t('personal.qualificationIti') },
    { value: 'Graduate', label: t('personal.qualificationGraduate') },
    { value: 'Post Graduate', label: t('personal.qualificationPostGraduate') },
  ];

  return (
    <section className="flex flex-col gap-5">
      <SectionHeading number={1} title={t('sections.personalDetails')} totalSections={6} />

      <TextInput
        id="fullName"
        label={t('personal.fullName')}
        required
        placeholder={t('personal.fullNamePlaceholder')}
        error={tError(errors.fullName?.message)}
        {...register('fullName')}
      />

      <div className="grid grid-cols-2 gap-4">
        <TextInput
          id="age"
          label={t('personal.age')}
          required
          type="number"
          inputMode="numeric"
          placeholder={t('personal.agePlaceholder')}
          error={tError(errors.age?.message)}
          {...register('age')}
        />
        <SelectInput
          id="gender"
          label={t('personal.gender')}
          required
          placeholder={t('personal.select')}
          options={GENDER_OPTIONS}
          error={tError(errors.gender?.message)}
          {...register('gender')}
        />
      </div>

      <Controller
        name="currentCity"
        control={control}
        render={({ field }) => (
          <SearchableSelect
            id="currentCity"
            label={t('personal.currentCity')}
            required
            options={INDIAN_CITIES}
            getOptionLabel={tPlace}
            noMatchesText={t('jobPrefs.noMatches')}
            placeholder={t('personal.currentCityPlaceholder')}
            value={field.value || ''}
            onChange={field.onChange}
            error={tError(errors.currentCity?.message)}
          />
        )}
      />

      <TextInput
        id="currentArea"
        label={t('personal.currentArea')}
        required
        placeholder={t('personal.currentAreaPlaceholder')}
        error={tError(errors.currentArea?.message)}
        {...register('currentArea')}
      />

      <Controller
        name="state"
        control={control}
        render={({ field }) => (
          <SearchableSelect
            id="state"
            label={t('personal.state')}
            required
            options={INDIAN_STATES}
            getOptionLabel={tPlace}
            noMatchesText={t('jobPrefs.noMatches')}
            placeholder={t('personal.statePlaceholder')}
            value={field.value || ''}
            onChange={field.onChange}
            error={tError(errors.state?.message)}
          />
        )}
      />

      <SelectInput
        id="highestQualification"
        label={t('personal.qualification')}
        placeholder={t('personal.qualificationSelect')}
        options={QUALIFICATION_OPTIONS}
        error={tError(errors.highestQualification?.message)}
        {...register('highestQualification')}
      />
    </section>
  );
}
