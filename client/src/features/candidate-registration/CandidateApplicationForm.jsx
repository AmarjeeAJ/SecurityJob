import { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  MapPin, 
  Briefcase, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  MessageSquare, 
  Camera,
  Check,
  Award,
  Clock,
  Zap,
  Phone,
  HelpCircle,
  FileCheck,
  AlertCircle,
  Upload,
  Send
} from 'lucide-react';
import { candidateFormSchema } from '../../schemas/candidateSchema.js';
import { submitCandidateApplication } from '../../api/candidates.js';
import { trackEvent } from '../../services/tracking.service.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import Card from '../../components/common/Card.jsx';
import SuccessState from '../../components/form/SuccessState.jsx';
import ErrorBanner from '../../components/form/ErrorBanner.jsx';
import { RAJASTHAN_CITIES, getSmartAreasForDistrict } from '../../utils/locations.js';
import JOB_ROLES from '../../utils/jobRoles.js';

const TOTAL_STEPS = 3;

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
    state: data.state || 'Rajasthan',
    highestQualification: data.highestQualification || '10th Pass',
    otherRoleText: data.otherRoleText || '',
    isExperienced: data.isExperienced,
    securityExperienceMonths: data.isExperienced ? (data.securityExperienceMonths || 12) : 0,
    currentEmploymentStatus: data.isExperienced ? (data.currentEmploymentStatus || 'unemployed') : undefined,
    joiningAvailability: data.isExperienced ? (data.joiningAvailability || 'immediate') : undefined,
    dutyHourPreference: data.isExperienced ? (data.dutyHourPreference || '12_hours') : undefined,
    aadhaarAvailable: Boolean(data.aadhaarFront?.[0] || data.aadhaarBack?.[0] || data.aadhaarAvailable),
    consentGiven: data.consentGiven,
    ...trackingData,
  };

  Object.entries(scalarFields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  formData.append('preferredRoles', JSON.stringify(data.preferredRoles || ['Security Guard']));
  formData.append('preferredLocations', JSON.stringify(data.preferredLocations || [data.currentCity || 'Jaipur']));

  if (data.aadhaarFront?.[0]) formData.append('aadhaarFront', data.aadhaarFront[0]);
  if (data.aadhaarBack?.[0]) formData.append('aadhaarBack', data.aadhaarBack[0]);

  return formData;
}

export default function CandidateApplicationForm({ preselectedRole, trackingData }) {
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [aadhaarFrontPreview, setAadhaarFrontPreview] = useState(null);
  const [aadhaarBackPreview, setAadhaarBackPreview] = useState(null);
  const hasTrackedStart = useRef(false);
  const isSubmittingRef = useRef(false);
  const step3EnteredAtRef = useRef(0);

  const initialRole = preselectedRole || 'Security Guard';

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    trigger,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(candidateFormSchema),
    mode: 'onTouched',
    defaultValues: {
      fullName: '',
      mobileNumber: '',
      whatsappSameAsMobile: true,
      whatsappNumber: '',
      age: 25,
      gender: 'male',
      currentCity: 'Jaipur',
      currentArea: '',
      state: 'Rajasthan',
      highestQualification: '10th Pass',
      preferredRoles: [initialRole],
      otherRoleText: '',
      preferredLocations: ['Jaipur'],
      isExperienced: false,
      securityExperienceMonths: 0,
      currentEmploymentStatus: 'unemployed',
      joiningAvailability: 'immediate',
      dutyHourPreference: '12_hours',
      aadhaarAvailable: true,
      consentGiven: true,
    },
  });

  const watchWhatsappSame = watch('whatsappSameAsMobile');
  const watchGender = watch('gender');
  const watchCity = watch('currentCity');
  const watchArea = watch('currentArea');
  const watchRoles = watch('preferredRoles') || [];
  const watchLocations = watch('preferredLocations') || [];
  const watchExperienced = watch('isExperienced');
  const watchDutyHour = watch('dutyHourPreference');
  const watchJoining = watch('joiningAvailability');
  const watchConsent = watch('consentGiven');

  useEffect(() => {
    if (currentStep === 3) {
      step3EnteredAtRef.current = Date.now();
    }
  }, [currentStep]);

  useEffect(() => {
    if (preselectedRole && !watchRoles.includes(preselectedRole)) {
      setValue('preferredRoles', [preselectedRole]);
    }
  }, [preselectedRole, setValue]);

  // Keep preferred locations synced with current city if empty
  useEffect(() => {
    if (watchCity && (!watchLocations || watchLocations.length === 0)) {
      setValue('preferredLocations', [watchCity]);
    }
  }, [watchCity, setValue]);

  const stepFields = {
    1: ['fullName', 'mobileNumber', 'whatsappNumber', 'age', 'gender'],
    2: ['currentCity', 'currentArea', 'state', 'preferredRoles'],
    3: ['highestQualification', 'consentGiven'],
  };

  const handleNextStep = async () => {
    const fields = stepFields[currentStep] || [];
    const valid = await trigger(fields);
    if (!valid) return;

    if (!hasTrackedStart.current) {
      trackEvent('form_start', { step: 1 });
      hasTrackedStart.current = true;
    }
    trackEvent(`step_${currentStep}_complete`, { nextStep: currentStep + 1 });

    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleFormKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
      e.preventDefault();
      if (currentStep < TOTAL_STEPS) {
        handleNextStep();
      }
    }
  };

  const onSubmit = async (data) => {
    // STRICT GUARD 1: Prevent submission if not on final step (Step 3)
    if (currentStep !== 3) {
      await handleNextStep();
      return;
    }

    // STRICT GUARD 2: Prevent ghost clicks / touch event transfer from Step 2 Next button
    if (Date.now() - step3EnteredAtRef.current < 400) {
      return;
    }

    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setSubmitError('');

    try {
      const payload = buildFormData(data, trackingData);
      const res = await submitCandidateApplication(payload);

      trackEvent('form_submit_success', {
        candidateCode: res.candidateCode,
        isExisting: res.isExistingCandidate,
      });

      setSubmissionResult(res);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setSubmitError(err.message || 'फॉर्म जमा करने में त्रुटि हुई। कृपया दोबारा प्रयास करें।');
      trackEvent('form_submit_error', { message: err.message });
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const handleImageChange = (e, side) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (side === 'front') setAadhaarFrontPreview(url);
      if (side === 'back') setAadhaarBackPreview(url);
    }
  };

  const roleOptions = [
    { label: 'Security Guard (सिक्योरिटी गार्ड)', value: 'Security Guard', icon: '🛡️' },
    { label: 'Security Supervisor (सुपरवाइजर)', value: 'Security Supervisor', icon: '👮' },
    { label: 'Lady Security Guard (लेडी गार्ड)', value: 'Lady Security Guard', icon: '👩' },
    { label: 'CCTV Operator (सीसीटीवी ऑपरेटर)', value: 'CCTV Operator', icon: '📹' },
    { label: 'Bouncer & Event Security Guards (बाउंसर)', value: 'Bouncer', icon: '🏋️' },
    { label: 'Armed Guard / Gunman (गनमैन)', value: 'Armed Guard', icon: '🎯' },
    { label: 'Field Officer (फील्ड ऑफिसर)', value: 'Field Officer', icon: '📋' },
    { label: 'Facility Supervisor (सुपरवाइजर)', value: 'Facility Supervisor', icon: '🏢' },
  ];

  if (submissionResult) {
    return (
      <Card className="p-6 sm:p-10">
        <SuccessState
          candidateCode={submissionResult.candidateCode}
          isExistingCandidate={submissionResult.isExistingCandidate}
          whatsappNumber={submissionResult.whatsappNumber || '919999900000'}
          onSubmitAnother={() => {
            reset();
            setSubmissionResult(null);
            setCurrentStep(1);
            setAadhaarFrontPreview(null);
            setAadhaarBackPreview(null);
          }}
        />
      </Card>
    );
  }

  const stepsMeta = [
    { num: 1, title: 'उम्मीदवार विवरण', sub: 'Candidate Profile' },
    { num: 2, title: 'स्थान व जॉब रोल', sub: 'Location & Role' },
    { num: 3, title: 'अनुभव व दस्तावेज', sub: 'Exp & ID Proof' },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Guard Friendly Trust Header */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50 border border-blue-200/80 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
            🛡️
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
              राजस्थान सिक्योरिटी जॉब आवेदन फॉर्म (100% फ्री)
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              बिना किसी फीस के सीधी भर्ती &middot; सरकारी PF व ESIC सुविधा &middot; 2 मिनट में भरें
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-2xs flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            ₹0 कोई फीस नहीं
          </span>
        </div>
      </div>

      <Card className="p-5 sm:p-8 shadow-md border-slate-200/90">
        {/* Step Indicator Progress Bar */}
        <div className="mb-8">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-3">
            {stepsMeta.map((s) => {
              const isPassed = currentStep > s.num;
              const isCurrent = currentStep === s.num;
              return (
                <div key={s.num} className="text-center">
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 mx-auto rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center transition-all ${
                      isPassed
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : isCurrent
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-4 ring-blue-100'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {isPassed ? <Check className="w-4 h-4" /> : s.num}
                  </div>
                  <p className={`text-[11px] sm:text-xs font-bold mt-1.5 line-clamp-1 ${isCurrent ? 'text-blue-700' : 'text-slate-500'}`}>
                    {s.title}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        {submitError && (
          <div className="mb-6">
            <ErrorBanner message={submitError} onDismiss={() => setSubmitError('')} />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleFormKeyDown} className="space-y-6">
          {/* ========================================================================= */}
          {/* STEP 1: CANDIDATE PROFILE (उम्मीदवार विवरण) */}
          {/* ========================================================================= */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-5"
            >
              <div className="border-b border-slate-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">स्टेप 1 ऑफ 3</span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
                  उम्मीदवार विवरण (Candidate Profile)
                </h3>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                  आपका पूरा नाम (Full Name) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="उदा. रमेश कुमार शर्मा"
                  {...register('fullName')}
                  className={`w-full px-4 py-3.5 rounded-xl border text-sm font-medium text-slate-900 focus:outline-none transition-all ${
                    errors.fullName ? 'border-red-500 bg-red-50/50' : 'border-slate-300 bg-slate-50/50 focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-100'
                  }`}
                />
                {errors.fullName && (
                  <p className="text-xs font-semibold text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                  मोबाइल नंबर (10 Digit Mobile Number) <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    {...register('mobileNumber')}
                    className={`w-full pl-16 pr-4 py-3.5 rounded-xl border text-sm font-bold text-slate-900 tracking-wider focus:outline-none transition-all ${
                      errors.mobileNumber ? 'border-red-500 bg-red-50/50' : 'border-slate-300 bg-slate-50/50 focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-100'
                    }`}
                  />
                </div>
                {errors.mobileNumber && (
                  <p className="text-xs font-semibold text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.mobileNumber.message}
                  </p>
                )}
                <p className="text-[11px] text-slate-500 mt-1">
                  इस नंबर पर आपको जॉब की जानकारी और इंटरव्यू का कॉल आएगा।
                </p>
              </div>

              {/* WhatsApp Checkbox */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('whatsappSameAsMobile')}
                    className="w-4 h-4 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm font-semibold text-slate-800">
                    यही मेरा WhatsApp नंबर भी है (Same on WhatsApp)
                  </span>
                </label>

                {!watchWhatsappSame && (
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      अलग WhatsApp नंबर दर्ज करें (WhatsApp Number)
                    </label>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="10 अंकों का WhatsApp नंबर"
                      {...register('whatsappNumber')}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:bg-white focus:border-blue-600 focus:outline-none"
                    />
                    {errors.whatsappNumber && (
                      <p className="text-xs text-red-600 mt-1">{errors.whatsappNumber.message}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Age & Gender Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Age Input */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                    आपकी उम्र (Age in Years) <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={18}
                      max={65}
                      placeholder="उदा. 25"
                      {...register('age', { valueAsNumber: true })}
                      className={`w-full px-4 py-3 rounded-xl border text-sm font-bold text-slate-900 focus:outline-none transition-all ${
                        errors.age ? 'border-red-500 bg-red-50/50' : 'border-slate-300 bg-slate-50/50 focus:bg-white focus:border-blue-600'
                      }`}
                    />
                    <span className="text-xs font-semibold text-slate-500 shrink-0">वर्ष (Years)</span>
                  </div>
                  {errors.age && (
                    <p className="text-xs font-semibold text-red-600 mt-1">{errors.age.message}</p>
                  )}
                  <p className="text-[11px] text-slate-400 mt-0.5">न्यूनतम उम्र 18 वर्ष होनी चाहिए</p>
                </div>

                {/* Gender Select Cards */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                    लिंग (Gender) <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setValue('gender', 'male', { shouldValidate: true })}
                      className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                        watchGender === 'male'
                          ? 'bg-blue-50 border-blue-600 text-blue-700 ring-2 ring-blue-200'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>👨 पुरुष (Male)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setValue('gender', 'female', { shouldValidate: true })}
                      className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                        watchGender === 'female'
                          ? 'bg-blue-50 border-blue-600 text-blue-700 ring-2 ring-blue-200'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>👩 महिला (Female)</span>
                    </button>
                  </div>
                  {errors.gender && (
                    <p className="text-xs text-red-600 mt-1">{errors.gender.message}</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: LOCATION & PREFERRED JOB ROLE (स्थान व पसंदीदा जॉब रोल) */}
          {/* ========================================================================= */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              <div className="border-b border-slate-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">स्टेप 2 ऑफ 3</span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
                  स्थान व पसंदीदा जॉब रोल (Location & Job Role)
                </h3>
              </div>

              {/* State Field - Fixed to Rajasthan */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                  राज्य (State)
                </label>
                <div className="flex items-center gap-2 p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 font-bold text-sm text-blue-900">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>राजस्थान (Rajasthan) &mdash; केवल राजस्थान के लिए सक्रिय</span>
                </div>
                <input type="hidden" value="Rajasthan" {...register('state')} />
              </div>

              {/* City / District Selection */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs sm:text-sm font-bold text-slate-900">
                    वर्तमान जिला / शहर (Current District in Rajasthan) <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    33+ जिले उपलब्ध
                  </span>
                </div>
                <select
                  value={watchCity}
                  onChange={(e) => {
                    setValue('currentCity', e.target.value, { shouldValidate: true });
                    setValue('preferredLocations', [e.target.value]);
                    // Clear custom area to prompt new area selection
                    setValue('currentArea', '');
                  }}
                  className={`w-full px-4 py-3.5 rounded-xl border text-sm font-bold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none transition-all cursor-pointer ${
                    errors.currentCity ? 'border-red-500' : 'border-slate-300 focus:border-blue-600'
                  }`}
                >
                  {RAJASTHAN_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.currentCity && (
                  <p className="text-xs font-semibold text-red-600 mt-1">{errors.currentCity.message}</p>
                )}
              </div>

              {/* Quick Popular Rajasthan District Buttons */}
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-2">मुख्य जिले (Quick Select):</p>
                <div className="flex flex-wrap gap-2">
                  {['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Alwar', 'Bhiwadi', 'Neemrana', 'Bhilwara', 'Sikar'].map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => {
                        setValue('currentCity', city, { shouldValidate: true });
                        setValue('preferredLocations', [city]);
                        setValue('currentArea', '');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        watchCity === city
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI-Assisted Smart Area / Tehsil / Industrial Hub Selector */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs sm:text-sm font-bold text-slate-900">
                    तहसील / एरिया / औद्योगिक क्षेत्र (Area / Tehsil / RIICO Hub) <span className="text-red-500">*</span>
                  </label>
                  <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded-full border border-blue-200 shadow-2xs">
                    ⚡ AI Smart Match
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    list="smart-areas-list"
                    placeholder={`उदा. ${watchCity || 'Jaipur'} का अपना एरिया या रीको हब टाइप करें या नीचे से चुनें`}
                    {...register('currentArea')}
                    className={`w-full px-4 py-3.5 rounded-xl border text-sm font-semibold text-slate-900 bg-white focus:outline-none transition-all ${
                      errors.currentArea ? 'border-red-500 bg-red-50/50' : 'border-blue-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                    }`}
                  />
                  <datalist id="smart-areas-list">
                    {getSmartAreasForDistrict(watchCity || 'Jaipur').map((area) => (
                      <option key={area} value={area} />
                    ))}
                  </datalist>
                </div>

                {errors.currentArea && (
                  <p className="text-xs font-semibold text-red-600">{errors.currentArea.message}</p>
                )}

                {/* Smart Suggested Area Pills for the Selected District */}
                <div>
                  <p className="text-[11px] font-bold text-slate-600 mb-1.5">
                    💡 {watchCity || 'Jaipur'} के प्रमुख सुरक्षा ड्यूटी व औद्योगिक क्षेत्र (क्लिक करके चुनें):
                  </p>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {getSmartAreasForDistrict(watchCity || 'Jaipur').map((area) => {
                      const isSelected = watchArea === area;
                      return (
                        <button
                          key={area}
                          type="button"
                          onClick={() => setValue('currentArea', area, { shouldValidate: true })}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                            isSelected
                              ? 'bg-blue-600 text-white font-bold shadow-2xs'
                              : 'bg-white text-slate-700 hover:bg-blue-100 hover:text-blue-900 border border-slate-200'
                          }`}
                        >
                          {area}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <p className="text-[11px] text-slate-500">
                  🔒 आपके नजदीकी 15-20 किमी के दायरे में डायरेक्ट ड्यूटी अलॉटमेंट के लिए सटीक एरिया चुनें।
                </p>
              </div>

              {/* Preferred Job Role Selection Cards */}
              <div className="pt-2 border-t border-slate-100 space-y-2.5">
                <label className="block text-xs sm:text-sm font-bold text-slate-900">
                  आप किस पद / जॉब के लिए आवेदन करना चाहते हैं? <span className="text-red-500">*</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {roleOptions.map((opt) => {
                    const isSelected = watchRoles.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setValue('preferredRoles', [opt.value], { shouldValidate: true });
                        }}
                        className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-200'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{opt.icon}</span>
                          <span className="text-xs sm:text-sm font-bold">{opt.label}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
                {errors.preferredRoles && (
                  <p className="text-xs font-semibold text-red-600 mt-1">{errors.preferredRoles.message}</p>
                )}
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: EXPERIENCE, EDUCATION & ID PROOF (अनुभव, शिक्षा व पहचान पत्र) */}
          {/* ========================================================================= */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-5"
            >
              <div className="border-b border-slate-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">स्टेप 3 ऑफ 3</span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
                  अनुभव, शिक्षा व पहचान पत्र (Experience, Education & ID Proof)
                </h3>
              </div>

              {/* Prior Experience Toggle */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-2">
                  क्या आपको पहले सिक्योरिटी का अनुभव है? (Prior Experience?)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setValue('isExperienced', false);
                      setValue('securityExperienceMonths', 0);
                    }}
                    className={`py-3.5 px-4 rounded-xl border text-center font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      !watchExperienced
                        ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-200'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <ShieldCheck className={`w-4 h-4 ${!watchExperienced ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>नया गार्ड / फ्रेशर (Fresher)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setValue('isExperienced', true);
                      if (!watch('securityExperienceMonths') || watch('securityExperienceMonths') === 0) {
                        setValue('securityExperienceMonths', 12);
                      }
                    }}
                    className={`py-3.5 px-4 rounded-xl border text-center font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      watchExperienced
                        ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-200'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Briefcase className={`w-4 h-4 ${watchExperienced ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>अनुभवी गार्ड (Experienced)</span>
                  </button>
                </div>
              </div>

              {/* If Experienced, Show Experience Details */}
              {watchExperienced && (
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      कितने महीने का अनुभव है? (Experience in Months)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={360}
                        placeholder="उदा. 12"
                        {...register('securityExperienceMonths', { valueAsNumber: true })}
                        className="w-32 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                      <span className="text-xs font-semibold text-slate-600">महीने (Months)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      ड्यूटी शिफ्ट की पसंद (Duty Shift Preference)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['8_hours', '12_hours', 'any'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setValue('dutyHourPreference', opt)}
                          className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            watchDutyHour === opt
                              ? 'bg-blue-600 text-white shadow-2xs border-blue-600'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {opt === '8_hours' ? '8 घंटे' : opt === '12_hours' ? '12 घंटे' : 'कोई भी'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      कब तक जॉइन कर सकते हैं? (Joining Availability)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['immediate', 'within_15_days', 'within_30_days'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setValue('joiningAvailability', opt)}
                          className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            watchJoining === opt
                              ? 'bg-blue-600 text-white shadow-2xs border-blue-600'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {opt === 'immediate' ? 'तुरंत (Immediate)' : opt === 'within_15_days' ? '2-3 दिन में' : '1 हफ्ते में'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Education Level */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                  उच्चतम योग्यता / पढ़ाई (Highest Qualification)
                </label>
                <select
                  {...register('highestQualification')}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-300 bg-slate-50 text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 cursor-pointer"
                >
                  <option value="10th Pass">10वीं पास (Secondary)</option>
                  <option value="Non-Matric (8th Pass)">8वीं पास / नॉन-मैट्रिक</option>
                  <option value="12th Pass">12वीं पास (Sr. Secondary)</option>
                  <option value="Graduate">ग्रेजुएट / स्नातक</option>
                  <option value="Ex-Servicemen (Defence)">भूतपूर्व सैनिक (Ex-Servicemen / Army)</option>
                </select>
              </div>

              {/* ID Proof / Aadhaar Upload Box (Guard-Friendly & Voluntary) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-5 h-5 text-blue-600" />
                    <span className="text-xs sm:text-sm font-bold text-slate-900">
                      पहचान पत्र / आधार फोटो (ID Proof / Aadhaar Photo)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                    वैकल्पिक (Optional)
                  </span>
                </div>

                <p className="text-xs text-slate-500">
                  पहचान व आयु सत्यापन हेतु स्वैच्छिक फोटो (यदि आपके पास फोटो है तो अपलोड करें, इससे जल्दी जॉइनिंग होती है):
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Front Side */}
                  <div className="p-3 rounded-xl bg-white border border-dashed border-slate-300 text-center space-y-2">
                    <p className="text-[11px] font-bold text-slate-700">आगे का भाग (Front Photo)</p>
                    {aadhaarFrontPreview ? (
                      <div className="relative space-y-1.5">
                        <img src={aadhaarFrontPreview} alt="ID Front Preview" className="h-20 w-full object-cover rounded-lg mx-auto border border-slate-200" />
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[10px] text-emerald-600 font-bold">✓ फोटो सेलेक्टेड</span>
                          <button
                            type="button"
                            onClick={() => {
                              setAadhaarFrontPreview(null);
                              setValue('aadhaarFront', null);
                            }}
                            className="text-[10px] font-bold text-red-600 hover:text-red-700 hover:underline cursor-pointer"
                          >
                            ✕ हटाएं (Remove)
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs cursor-pointer transition-colors border border-blue-200">
                        <Upload className="w-4 h-4 text-blue-600" />
                        <span>फोटो अपलोड करें (Front Photo)</span>
                        <input
                          type="file"
                          accept="image/*"
                          {...register('aadhaarFront')}
                          onChange={(e) => handleImageChange(e, 'front')}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Back Side */}
                  <div className="p-3 rounded-xl bg-white border border-dashed border-slate-300 text-center space-y-2">
                    <p className="text-[11px] font-bold text-slate-700">पीछे का भाग (Back Photo)</p>
                    {aadhaarBackPreview ? (
                      <div className="relative space-y-1.5">
                        <img src={aadhaarBackPreview} alt="ID Back Preview" className="h-20 w-full object-cover rounded-lg mx-auto border border-slate-200" />
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[10px] text-emerald-600 font-bold">✓ फोटो सेलेक्टेड</span>
                          <button
                            type="button"
                            onClick={() => {
                              setAadhaarBackPreview(null);
                              setValue('aadhaarBack', null);
                            }}
                            className="text-[10px] font-bold text-red-600 hover:text-red-700 hover:underline cursor-pointer"
                          >
                            ✕ हटाएं (Remove)
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs cursor-pointer transition-colors border border-blue-200">
                        <Upload className="w-4 h-4 text-blue-600" />
                        <span>फोटो अपलोड करें (Back Photo)</span>
                        <input
                          type="file"
                          accept="image/*"
                          {...register('aadhaarBack')}
                          onChange={(e) => handleImageChange(e, 'back')}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Guard Friendly Consent Checkbox */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={true}
                    {...register('consentGiven')}
                    className="w-5 h-5 text-emerald-600 rounded-md border-emerald-300 focus:ring-emerald-500 cursor-pointer mt-0.5"
                  />
                  <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                    <span className="font-bold text-emerald-900 block mb-0.5">सहमति घोषणा (Candidate Consent):</span>
                    हाँ, मैं प्रमाणित करता हूँ कि दी गई जानकारी सत्य है और मैं सिक्योरिटी जॉब हेतु संपर्क व जॉइनिंग के लिए सहमत हूँ।
                  </div>
                </label>
                {errors.consentGiven && (
                  <p className="text-xs font-semibold text-red-600">{errors.consentGiven.message}</p>
                )}
              </div>
            </motion.div>
          )}

          {/* Form Bottom Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-3">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                पीछे जाएं (Back)
              </button>
            ) : (
              <div />
            )}

            {currentStep < TOTAL_STEPS ? (
              <button
                type="button"
                key="step-btn-next"
                onClick={handleNextStep}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer ml-auto"
              >
                <span>अगला कदम (Next Step)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                key="step-btn-submit"
                disabled={isSubmitting}
                onClick={handleSubmit(onSubmit)}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-extrabold text-sm sm:text-base text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-60 ml-auto"
              >
                {isSubmitting ? (
                  <span>फॉर्म जमा हो रहा है...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span>आवेदन जमा करें (Submit Application)</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
