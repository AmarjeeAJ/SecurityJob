import TextInput from '../common/TextInput.jsx';
import SelectInput from '../common/SelectInput.jsx';
import FileField from '../common/FileField.jsx';
import SectionHeading from './SectionHeading.jsx';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

export default function ExperienceSection({ register, errors }) {
  const { t, tError } = useLanguage();

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
      <SectionHeading number={4} title={t('sections.experience')} totalSections={5} />

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

      <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-navy-900">{t('experience.aadhaarCard')}</p>
          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-500">
            {t('experience.optional')}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FileField
            id="aadhaarFront"
            label={t('experience.frontSide')}
            accept="image/jpeg,image/png,image/webp"
            uploadText={t('experience.uploadTap')}
            changeText={t('experience.changeImage')}
            error={tError(errors.aadhaarFront?.message)}
            {...register('aadhaarFront')}
          />
          <FileField
            id="aadhaarBack"
            label={t('experience.backSide')}
            accept="image/jpeg,image/png,image/webp"
            uploadText={t('experience.uploadTap')}
            changeText={t('experience.changeImage')}
            error={tError(errors.aadhaarBack?.message)}
            {...register('aadhaarBack')}
          />
        </div>
        <p className="mt-2.5 text-xs text-slate-400">{t('experience.uploadHint')}</p>
      </div>
    </section>
  );
}
