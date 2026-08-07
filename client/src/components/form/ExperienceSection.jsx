import TextInput from '../common/TextInput.jsx';
import SelectInput from '../common/SelectInput.jsx';
import CheckboxInput from '../common/CheckboxInput.jsx';
import SectionHeading from './SectionHeading.jsx';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

export default function ExperienceSection({ register, errors, watch }) {
  const { t, tError } = useLanguage();
  const isExperienced = watch('isExperienced');

  const EMPLOYMENT_STATUS_OPTIONS = [
    { value: 'employed', label: t('experience.employed') },
    { value: 'unemployed', label: t('experience.unemployed') },
    { value: 'student', label: t('experience.student') },
    { value: 'other', label: t('experience.other') },
  ];

  const JOINING_AVAILABILITY_OPTIONS = [
    { value: 'immediate', label: t('experience.immediate') },
    { value: 'within_15_days', label: t('experience.within15') },
    { value: 'within_30_days', label: t('experience.within30') },
    { value: 'more_than_30_days', label: t('experience.moreThan30') },
  ];

  const DUTY_HOUR_OPTIONS = [
    { value: '8_hours', label: t('experience.hours8') },
    { value: '12_hours', label: t('experience.hours12') },
    { value: 'rotational', label: t('experience.rotational') },
    { value: 'any', label: t('experience.any') },
  ];

  return (
    <section className="flex flex-col gap-5">
      <SectionHeading number={4} title={t('sections.experience')} totalSections={6} />

      <CheckboxInput id="isExperienced" label={t('experience.isExperienced')} {...register('isExperienced')} />

      {isExperienced && (
        <>
          <TextInput
            id="securityExperienceMonths"
            label={t('experience.securityExperience')}
            type="number"
            inputMode="numeric"
            placeholder="0"
            error={tError(errors.securityExperienceMonths?.message)}
            {...register('securityExperienceMonths')}
          />

          <SelectInput
            id="currentEmploymentStatus"
            label={t('experience.employmentStatus')}
            required
            placeholder={t('experience.select')}
            options={EMPLOYMENT_STATUS_OPTIONS}
            error={tError(errors.currentEmploymentStatus?.message)}
            {...register('currentEmploymentStatus')}
          />

          <SelectInput
            id="joiningAvailability"
            label={t('experience.joiningAvailability')}
            required
            placeholder={t('experience.select')}
            options={JOINING_AVAILABILITY_OPTIONS}
            error={tError(errors.joiningAvailability?.message)}
            {...register('joiningAvailability')}
          />

          <SelectInput
            id="dutyHourPreference"
            label={t('experience.dutyHour')}
            required
            placeholder={t('experience.select')}
            options={DUTY_HOUR_OPTIONS}
            error={tError(errors.dutyHourPreference?.message)}
            {...register('dutyHourPreference')}
          />
        </>
      )}
    </section>
  );
}
