import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { candidateFormSchema } from '../../schemas/candidateSchema.js';
import { submitCandidateApplication } from '../../api/candidates.js';
import { trackEvent } from '../../services/tracking.service.js';
import { useScrollProgress } from '../../hooks/useScrollProgress.js';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import ErrorBanner from '../../components/form/ErrorBanner.jsx';
import SuccessState from '../../components/form/SuccessState.jsx';
import PersonalDetailsSection from '../../components/form/PersonalDetailsSection.jsx';
import ContactDetailsSection from '../../components/form/ContactDetailsSection.jsx';
import JobPreferencesSection from '../../components/form/JobPreferencesSection.jsx';
import ExperienceSection from '../../components/form/ExperienceSection.jsx';
import ConsentSection from '../../components/form/ConsentSection.jsx';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '';

function buildFormData(data, trackingData) {
  const formData = new FormData();
  const whatsappNumber = data.whatsappSameAsMobile ? data.mobileNumber : data.whatsappNumber;

  const scalarFields = {
    fullName: data.fullName,
    mobileNumber: data.mobileNumber,
    whatsappNumber,
    age: data.age,
    gender: data.gender,
    currentCity: data.currentCity,
    currentArea: data.currentArea,
    state: data.state,
    otherRoleText: data.otherRoleText,
    securityExperienceMonths: data.securityExperienceMonths,
    currentEmploymentStatus: data.currentEmploymentStatus,
    joiningAvailability: data.joiningAvailability,
    dutyHourPreference: data.dutyHourPreference,
    consentGiven: data.consentGiven,
    ...trackingData,
  };

  Object.entries(scalarFields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  formData.append('preferredRoles', JSON.stringify(data.preferredRoles));
  formData.append('preferredLocations', JSON.stringify(data.preferredLocations));

  return formData;
}

export default function CandidateApplicationForm({ preselectedRole, trackingData }) {
  const [submissionResult, setSubmissionResult] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const hasTrackedStart = useRef(false);
  const isSubmittingRef = useRef(false);

  const scrollProgress = useScrollProgress();

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(candidateFormSchema),
    defaultValues: {
      whatsappSameAsMobile: true,
      preferredRoles: preselectedRole ? [preselectedRole] : [],
      preferredLocations: [],
      consentGiven: false,
    },
  });

  useEffect(() => {
    trackEvent('ApplicationFormView', {}, { once: true });
  }, []);

  function handleFirstInteraction() {
    if (!hasTrackedStart.current) {
      hasTrackedStart.current = true;
      trackEvent('ApplicationFormStart');
    }
  }

  async function onSubmit(data) {
    if (isSubmittingRef.current) return; // belt-and-braces guard against double submission
    isSubmittingRef.current = true;
    setSubmitError('');

    try {
      const formData = buildFormData(data, trackingData);
      const response = await submitCandidateApplication(formData);

      trackEvent('ApplicationSubmitSuccess', { candidateCode: response.candidateCode }, { dedupeKey: response.candidateCode });
      setSubmissionResult(response);
    } catch (error) {
      trackEvent('ApplicationSubmitError');
      const apiMessage = error?.response?.data?.message;
      setSubmitError(apiMessage || 'Your details could not be submitted. Please try again.');
    } finally {
      isSubmittingRef.current = false;
    }
  }

  function handleSubmitAnother() {
    setSubmissionResult(null);
    setSubmitError('');
    hasTrackedStart.current = false;
    reset({
      whatsappSameAsMobile: true,
      preferredRoles: preselectedRole ? [preselectedRole] : [],
      preferredLocations: [],
      consentGiven: false,
    });
  }

  if (submissionResult) {
    return (
      <Card className="p-6 sm:p-8">
        <SuccessState
          candidateCode={submissionResult.candidateCode}
          isExistingCandidate={submissionResult.isExistingCandidate}
          whatsappNumber={WHATSAPP_NUMBER}
          onSubmitAnother={handleSubmitAnother}
        />
      </Card>
    );
  }

  return (
    <>
      {/* Scroll progress — orientation cue on a long single-page form, mobile-first. */}
      <div className="fixed inset-x-0 top-0 z-50 h-1 bg-black/10">
        <div
          className="h-full bg-gradient-to-r from-gold-400 to-gold-500 transition-[width] duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <Card className="p-5 pb-24 sm:p-8 sm:pb-8">
        <form onSubmit={handleSubmit(onSubmit)} onChange={handleFirstInteraction} noValidate className="flex flex-col gap-8">
          <ErrorBanner message={submitError} />

          <PersonalDetailsSection register={register} errors={errors} />
          <ContactDetailsSection register={register} errors={errors} watch={watch} />
          <JobPreferencesSection register={register} errors={errors} control={control} watch={watch} />
          <ExperienceSection register={register} errors={errors} />
          <ConsentSection register={register} errors={errors} />

          {/* Desktop: inline submit at the end of the form. */}
          <Button type="submit" variant="gold" loading={isSubmitting} className="hidden w-full text-lg sm:flex">
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Button>

          {/* Mobile: always-reachable sticky bar, since most candidates apply from a phone
              and shouldn't have to scroll back down through five sections to submit. */}
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.08)] sm:hidden">
            <Button type="submit" variant="gold" loading={isSubmitting} className="w-full">
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
}
