import FileField from '../common/FileField.jsx';
import SectionHeading from './SectionHeading.jsx';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

/**
 * Identity documents. Deliberately its own section rather than living under
 * "Experience": an Aadhaar card has nothing to do with whether a candidate has
 * prior security work, so a fresher must be able to upload one too.
 */
export default function DocumentsSection({ register, errors }) {
  const { t, tError } = useLanguage();

  return (
    <section className="flex flex-col gap-5">
      <SectionHeading number={5} title={t('sections.documents')} totalSections={6} />

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
