
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
  Send,
  Shield,
  UserCheck,
  Video,
  Target,
  ClipboardCheck,
  Building2,
  Loader2,
  Navigation,
  Crosshair,
  Compass,
  Home,
  Copy,
  Info
} from 'lucide-react';
import { candidateFormSchema } from '../../schemas/candidateSchema.js';
import { submitCandidateApplication, checkMobileRegistered } from '../../api/candidates.js';
import { trackEvent } from '../../services/tracking.service.js';
import { compressImage } from '../../utils/compressImage.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import Card from '../../components/common/Card.jsx';
import SuccessState from '../../components/form/SuccessState.jsx';
import ErrorBanner from '../../components/form/ErrorBanner.jsx';
import { 
  RAJASTHAN_CITIES, 
  ALL_INDIAN_STATES, 
  getDistrictsForState, 
  getTehsilsForDistrict, 
  getSmartAreasForDistrict 
} from '../../utils/locations.js';
import SearchableLocationInput from '../../components/form/SearchableLocationInput.jsx';
import { 
  fetchStates, 
  fetchDistricts, 
  fetchTehsilsAndVillages, 
  fetchVillagesForTehsil, 
  fetchSubdivisions,
  fetchBlocks,
  resolvePincode,
  lookupPincode, 
  reverseGeocode 
} from '../../services/location.service.js';
import { 
  getVillagesForTehsil,
  getSubdivisionsForDistrict,
  getBlocksForSubdivision,
  getPincodeForLocation
} from '../../utils/tehsilVillages.js';
import { OFFICIAL_WHATSAPP_NUMBER } from '../../constants/contact.js';
import JOB_ROLES from '../../utils/jobRoles.js';

const TOTAL_STEPS = 3;
const DRAFT_STORAGE_KEY = 'securityjob_candidate_draft_v1';

function buildFormData(data, trackingData, frontFile, backFile) {
  const formData = new FormData();
  const whatsappNumber = data.whatsappSameAsMobile ? data.mobileNumber : data.whatsappNumber;

  const actualFront = frontFile || data.aadhaarFront?.[0] || data.aadhaarFront;
  const actualBack = backFile || data.aadhaarBack?.[0] || data.aadhaarBack;
  const hasAadhaar = Boolean(actualFront || actualBack);

  const scalarFields = {
    fullName: data.fullName,
    mobileNumber: data.mobileNumber,
    whatsappNumber: whatsappNumber || data.mobileNumber,
    age: data.age,
    gender: data.gender,
    permanentDistrict: data.permanentDistrict || 'Jaipur',
    currentArea: data.currentArea || 'City Area',
    permanentState: data.permanentState || 'Rajasthan',
    permanentSubdivision: data.permanentSubdivision || '',
    permanentBlock: data.permanentBlock || data.permanentTehsil || '',
    permanentTehsil: data.permanentBlock || data.permanentTehsil || '',
    permanentVillage: data.permanentVillage || '',
    permanentPincode: data.permanentPincode || '',
    permanentAddressLine: data.permanentAddressLine || '',
    geoLat: data.geoLat || undefined,
    geoLng: data.geoLng || undefined,
    geoAddress: data.geoAddress || '',
    currentStayAddress: data.currentStayAddress || '',
    preferredState: data.preferredState || data.permanentState || 'Rajasthan',
    preferredDistrict: data.preferredDistrict || data.permanentDistrict || 'Jaipur',
    preferredSubdivision: data.preferredSubdivision || '',
    preferredBlock: data.preferredBlock || data.preferredTehsil || '',
    preferredTehsil: data.preferredBlock || data.preferredTehsil || '',
    preferredVillage: data.preferredVillage || '',
    preferredPincode: data.preferredPincode || '',
    preferredAddressLine: data.preferredAddressLine || '',
    highestQualification: data.highestQualification || '10th Pass',
    otherRoleText: data.otherRoleText || '',
    isExperienced: Boolean(data.isExperienced),
    // No more silent "|| 12 months" / "|| 'unemployed'" style fallbacks —
    // the schema now requires the candidate to genuinely fill these in
    // when isExperienced is true, so whatever reaches here is real input,
    // not a fabricated plausible-looking default.
    securityExperienceMonths: data.isExperienced ? data.securityExperienceMonths : 0,
    currentEmploymentStatus: data.isExperienced ? data.currentEmploymentStatus : undefined,
    joiningAvailability: data.isExperienced ? data.joiningAvailability : undefined,
    dutyHourPreference: data.isExperienced ? data.dutyHourPreference : undefined,
    aadhaarAvailable: hasAadhaar,
    // Was hard-coded `true` here regardless of the checkbox's actual state
    // -- the consent checkbox was functionally meaningless, since
    // submission always claimed consent was given either way.
    consentGiven: Boolean(data.consentGiven),
    ...trackingData,
  };

  Object.entries(scalarFields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  formData.append('preferredRoles', JSON.stringify(data.preferredRoles || ['Security Guard']));
  formData.append('preferredLocations', JSON.stringify(data.preferredLocations || [data.permanentDistrict || 'Jaipur']));

  if (actualFront instanceof File) formData.append('aadhaarFront', actualFront);
  if (actualBack instanceof File) formData.append('aadhaarBack', actualBack);

  return formData;
}

export default function CandidateApplicationForm({ preselectedRole, trackingData }) {
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [aadhaarFrontPreview, setAadhaarFrontPreview] = useState(null);
  const [aadhaarFrontFile, setAadhaarFrontFile] = useState(null);
  const [aadhaarBackPreview, setAadhaarBackPreview] = useState(null);
  const [aadhaarBackFile, setAadhaarBackFile] = useState(null);
  const [compressingFront, setCompressingFront] = useState(false);
  const [compressingBack, setCompressingBack] = useState(false);
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
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(candidateFormSchema),
    mode: 'onTouched',
    defaultValues: {
      fullName: '',
      mobileNumber: '',
      whatsappSameAsMobile: true,
      whatsappNumber: '',
      // undefined (not 25) so the field starts genuinely empty, showing
      // its placeholder instead of a plausible-looking number the
      // candidate never actually typed.
      age: undefined,
      gender: 'male',
      permanentDistrict: 'Jaipur',
      currentArea: '',
      permanentState: 'Rajasthan',
      permanentSubdivision: '',
      permanentBlock: '',
      permanentTehsil: '',
      permanentVillage: '',
      permanentPincode: '',
      permanentAddressLine: '',
      geoLat: undefined,
      geoLng: undefined,
      geoAddress: '',
      currentStayAddress: '',
      preferredState: 'Rajasthan',
      preferredDistrict: 'Jaipur',
      preferredSubdivision: '',
      preferredBlock: '',
      preferredTehsil: '',
      preferredVillage: '',
      preferredPincode: '',
      preferredAddressLine: '',
      highestQualification: '10th Pass',
      preferredRoles: [initialRole],
      otherRoleText: '',
      preferredLocations: ['Jaipur'],
      isExperienced: false,
      // undefined (not 0) so the Months input starts genuinely empty,
      // showing its placeholder ("उदा. 12") instead of a literal "0" that
      // reads like the system already decided the candidate has zero
      // experience right after they picked "Experienced".
      securityExperienceMonths: undefined,
      // These three, plus consentGiven below, previously defaulted to a
      // plausible-looking value ('unemployed' / 'immediate' / '12_hours')
      // from page load. A candidate could tap "Experienced" and submit
      // without ever touching the fields underneath — the UI showed them
      // as already selected — and the recruiter would see fabricated
      // "12 months experience, 12-hour shift, immediate joining" data the
      // candidate never actually provided. Left blank now so nothing is
      // pre-selected; the candidate must make a real choice, and
      // submission is blocked (see the schema) until they do.
      currentEmploymentStatus: '',
      joiningAvailability: '',
      dutyHourPreference: '',
      aadhaarAvailable: false,
      // Consent must be an affirmative act, not a pre-ticked default —
      // this previously let a candidate submit without ever having agreed
      // to anything.
      consentGiven: false,
    },
  });

  const [isCapturingLocation, setIsCapturingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState(null);
  // Defaults to unchecked — the candidate must actively confirm their
  // current address (either "same as permanent" or their own stay
  // address) rather than have it silently assumed on page load.
  const [currentSameAsPermanent, setCurrentSameAsPermanent] = useState(false);
  const [sameAsPermanentForPreferred, setSameAsPermanentForPreferred] = useState(false);

  // Restore an in-progress draft on mount — a candidate who accidentally
  // refreshes (or their browser reloads on a flaky connection) should never
  // have to retype everything. File selections can't survive localStorage,
  // so only the text/number/array fields are restored; Aadhaar photos (if
  // re-enabled) would need to be re-picked.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!saved) return;
      const { step, values } = JSON.parse(saved);
      if (values) {
        reset(values, { keepDefaultValues: true });
        setCurrentSameAsPermanent(values.currentStayAddress === 'स्थाई पते के अनुसार (Same as Permanent)');
      }
      if (step) setCurrentStep(step);
    } catch {
      // Corrupted or unavailable storage — just start with a blank form.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autosave the draft (debounced 500ms after the last change) so a refresh
  // never loses progress. Runs for the lifetime of the form; cleared on
  // successful submission and when starting a fresh application.
  useEffect(() => {
    let timer;
    const subscription = watch((values) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        try {
          const { aadhaarFront, aadhaarBack, ...serializable } = values;
          localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({ step: currentStep, values: serializable }));
        } catch {
          // Storage full/unavailable/private-mode — draft save is best-effort only.
        }
      }, 500);
    });
    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [watch, currentStep]);

  // Dynamic 5-Tier API location state lists
  const [statesList, setStatesList] = useState(ALL_INDIAN_STATES);
  const [currentDistricts, setCurrentDistricts] = useState(() => getDistrictsForState('Rajasthan'));
  const [permanentSubdivisions, setCurrentSubdivisions] = useState(() => getSubdivisionsForDistrict('Rajasthan', 'Jaipur'));
  const [permanentBlocks, setCurrentBlocks] = useState(() => getBlocksForSubdivision('Rajasthan', 'Jaipur', ''));
  const [permanentVillages, setCurrentVillages] = useState(() => getSmartAreasForDistrict('Jaipur'));
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingSubdivisions, setIsLoadingSubdivisions] = useState(false);
  const [isLoadingBlocks, setIsLoadingBlocks] = useState(false);

  const [preferredDistricts, setPreferredDistricts] = useState(() => getDistrictsForState('Rajasthan'));
  const [preferredSubdivisions, setPreferredSubdivisions] = useState(() => getSubdivisionsForDistrict('Rajasthan', 'Jaipur'));
  const [preferredBlocks, setPreferredBlocks] = useState(() => getBlocksForSubdivision('Rajasthan', 'Jaipur', ''));
  const [isLoadingPrefDistricts, setIsLoadingPrefDistricts] = useState(false);
  const [isLoadingPrefSubdivisions, setIsLoadingPrefSubdivisions] = useState(false);
  const [isLoadingPrefBlocks, setIsLoadingPrefBlocks] = useState(false);

  const watchWhatsappSame = watch('whatsappSameAsMobile');
  const watchGender = watch('gender');
  const watchMobileNumber = watch('mobileNumber') || '';
  const [duplicateMobileInfo, setDuplicateMobileInfo] = useState(null);
  const [isCheckingMobile, setIsCheckingMobile] = useState(false);
  const watchPermanentState = watch('permanentState') || 'Rajasthan';
  const watchPermanentDistrict = watch('permanentDistrict') || 'Jaipur';
  const watchArea = watch('currentArea');
  const watchPermanentSubdivision = watch('permanentSubdivision') || '';
  const watchPermanentBlock = watch('permanentBlock') || watch('permanentTehsil') || '';
  const watchPermanentTehsil = watch('permanentTehsil') || watchPermanentBlock || '';
  const watchPermanentVillage = watch('permanentVillage') || '';
  const watchPermanentPincode = watch('permanentPincode') || '';
  const watchPermanentAddressLine = watch('permanentAddressLine') || '';
  const watchCurrentStayAddress = watch('currentStayAddress') || '';

  // Warn (and block) a candidate who already registered with this mobile
  // number before they invest time filling out the rest of the form —
  // previously this was only discovered silently at final submission,
  // which quietly updated the existing record instead of telling them.
  useEffect(() => {
    const digits = watchMobileNumber.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(digits)) {
      setDuplicateMobileInfo(null);
      return;
    }
    let isCancelled = false;
    setIsCheckingMobile(true);
    const timer = setTimeout(() => {
      checkMobileRegistered(digits)
        .then((res) => {
          if (isCancelled) return;
          setDuplicateMobileInfo(res?.exists ? { fullName: res.fullName, candidateCode: res.candidateCode } : null);
        })
        .catch(() => {
          // Non-blocking — a check failure should never trap a genuine candidate.
        })
        .finally(() => {
          if (!isCancelled) setIsCheckingMobile(false);
        });
    }, 500);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [watchMobileNumber]);

  // No fallback to watchPermanentState/watchPermanentDistrict here — that
  // silently mirrored the Permanent Address into these fields (and, via the
  // effect below, into the real preferredState/preferredDistrict), even
  // though the candidate never touched the "Same as Permanent" checkbox.
  // Preferred Location gets its own independent default; explicit copying
  // only happens through handleToggleSameForPreferred.
  const watchPreferredState = watch('preferredState') || 'Rajasthan';
  const watchPreferredDistrict = watch('preferredDistrict') || 'Jaipur';
  const watchPreferredSubdivision = watch('preferredSubdivision') || '';
  const watchPreferredBlock = watch('preferredBlock') || watch('preferredTehsil') || '';
  const watchPreferredTehsil = watch('preferredTehsil') || watchPreferredBlock || '';
  const watchPreferredPincode = watch('preferredPincode') || '';
  const watchPreferredAddressLine = watch('preferredAddressLine') || '';

  const watchRoles = watch('preferredRoles') || [];
  const watchLocations = watch('preferredLocations') || [];
  const watchExperienced = watch('isExperienced');
  const watchDutyHour = watch('dutyHourPreference');
  const watchJoining = watch('joiningAvailability');
  const watchConsent = watch('consentGiven');

  // 1. Load States list from API
  useEffect(() => {
    fetchStates().then((res) => {
      if (res && res.length > 0) setStatesList(res);
    });
  }, []);

  // 2. Fetch districts for current state via API
  useEffect(() => {
    let isCancelled = false;
    setIsLoadingDistricts(true);
    fetchDistricts(watchPermanentState).then((dists) => {
      if (isCancelled) return;
      setCurrentDistricts(dists);
      setIsLoadingDistricts(false);
      if (dists.length > 0 && !dists.includes(watchPermanentDistrict)) {
        setValue('permanentDistrict', dists[0], { shouldValidate: true });
        setValue('permanentSubdivision', '');
        setValue('permanentBlock', '');
        setValue('permanentTehsil', '');
        setValue('permanentVillage', '');
        setValue('permanentPincode', '');
      }
    });
    return () => { isCancelled = true; };
  }, [watchPermanentState]);

  // 3. Fetch subdivisions & blocks for current district
  useEffect(() => {
    if (!watchPermanentDistrict) return;
    let isCancelled = false;
    setIsLoadingSubdivisions(true);
    setIsLoadingBlocks(true);

    fetchSubdivisions(watchPermanentState, watchPermanentDistrict).then((subs) => {
      if (isCancelled) return;
      setCurrentSubdivisions(subs || []);
      setIsLoadingSubdivisions(false);
    });

    fetchBlocks(watchPermanentState, watchPermanentDistrict, watchPermanentSubdivision).then((blks) => {
      if (isCancelled) return;
      setCurrentBlocks(blks || []);
      setIsLoadingBlocks(false);
    });

    fetchTehsilsAndVillages(watchPermanentState, watchPermanentDistrict, watchPermanentSubdivision).then((data) => {
      if (isCancelled) return;
      if (!watchPermanentSubdivision) {
        setCurrentVillages(data.villages || []);
      }
    });

    return () => { isCancelled = true; };
  }, [watchPermanentState, watchPermanentDistrict]);

  // 4. Update blocks when subdivision changes
  useEffect(() => {
    if (!watchPermanentDistrict) return;
    let isCancelled = false;
    fetchBlocks(watchPermanentState, watchPermanentDistrict, watchPermanentSubdivision).then((blks) => {
      if (isCancelled) return;
      setCurrentBlocks(blks || []);
    });
    return () => { isCancelled = true; };
  }, [watchPermanentSubdivision, watchPermanentDistrict, watchPermanentState]);

  // 5. Update villages and auto-resolve PIN code when subdivision/tehsil changes
  // (debounced by 350ms to eliminate typing glitch/blinking). Keyed off
  // Subdivision rather than Block — Block (Tier 4) is hidden for now.
  useEffect(() => {
    if (!watchPermanentDistrict) return;
    let isCancelled = false;

    const timer = setTimeout(() => {
      if (isCancelled) return;

      if (watchPermanentSubdivision && watchPermanentSubdivision.trim().length > 0) {
        // Merge rather than replace: selecting an option from the dropdown
        // already triggers its own immediate load+merge of the full
        // government village list (see the Subdivision field's
        // onSelectOption below), and this debounced effect re-fires 350ms
        // later for that same final value. Overwriting here with just the
        // small curated fallback regressed the list back down right after
        // it had already been correctly filled with hundreds of real
        // villages — this is what left the village count stuck low.
        const localVills = getVillagesForTehsil(watchPermanentState, watchPermanentDistrict, watchPermanentSubdivision);
        if (localVills && localVills.length > 0) {
          setCurrentVillages((prev) => {
            const merged = [...new Set([...(prev || []), ...localVills])];
            return merged.length === (prev || []).length ? prev : merged;
          });
        }

        fetchVillagesForTehsil(watchPermanentState, watchPermanentDistrict, watchPermanentSubdivision).then((vills) => {
          if (isCancelled) return;
          if (vills && vills.length > 0) {
            setCurrentVillages((prev) => {
              const merged = [...new Set([...(prev || []), ...vills])];
              return merged.length === prev.length ? prev : merged;
            });
          }
        });

        // Auto-fetch PIN code based on subdivision/tehsil
        resolvePincode(watchPermanentState, watchPermanentDistrict, watchPermanentSubdivision, watchPermanentVillage).then((autoPin) => {
          if (!isCancelled && autoPin) {
            setValue('permanentPincode', autoPin);
          }
        });
      } else {
        const defaultVills = getVillagesForTehsil(watchPermanentState, watchPermanentDistrict, '');
        if (defaultVills && defaultVills.length > 0) {
          setCurrentVillages(defaultVills);
        }
      }
    }, 350);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [watchPermanentSubdivision, watchPermanentDistrict, watchPermanentState]);

  // 6. Auto-fetch PIN code when village changes
  useEffect(() => {
    if (!watchPermanentDistrict) return;
    let isCancelled = false;
    if (watchPermanentVillage && watchPermanentVillage.trim().length > 0) {
      resolvePincode(watchPermanentState, watchPermanentDistrict, watchPermanentSubdivision, watchPermanentVillage).then((autoPin) => {
        if (!isCancelled && autoPin) {
          setValue('permanentPincode', autoPin);
        }
      });
    }
    return () => { isCancelled = true; };
  }, [watchPermanentVillage, watchPermanentSubdivision, watchPermanentDistrict, watchPermanentState]);

  // 7. Preferred location effects
  useEffect(() => {
    let isCancelled = false;
    setIsLoadingPrefDistricts(true);
    fetchDistricts(watchPreferredState).then((dists) => {
      if (isCancelled) return;
      setPreferredDistricts(dists);
      setIsLoadingPrefDistricts(false);
      if (dists.length > 0 && !dists.includes(watchPreferredDistrict)) {
        setValue('preferredDistrict', dists[0]);
        setValue('preferredLocations', [dists[0]]);
        setValue('preferredSubdivision', '');
        setValue('preferredBlock', '');
        setValue('preferredTehsil', '');
        setValue('preferredPincode', '');
      }
    });
    return () => { isCancelled = true; };
  }, [watchPreferredState]);

  useEffect(() => {
    if (!watchPreferredDistrict) return;
    let isCancelled = false;
    setIsLoadingPrefSubdivisions(true);
    setIsLoadingPrefBlocks(true);

    fetchSubdivisions(watchPreferredState, watchPreferredDistrict).then((subs) => {
      if (isCancelled) return;
      setPreferredSubdivisions(subs || []);
      setIsLoadingPrefSubdivisions(false);
    });

    fetchBlocks(watchPreferredState, watchPreferredDistrict, watchPreferredSubdivision).then((blks) => {
      if (isCancelled) return;
      setPreferredBlocks(blks || []);
      setIsLoadingPrefBlocks(false);
    });

    return () => { isCancelled = true; };
  }, [watchPreferredState, watchPreferredDistrict, watchPreferredSubdivision]);

  // Auto-resolve PIN code when the preferred subdivision/tehsil changes.
  // Keyed off Subdivision rather than Block — Block is hidden for now.
  useEffect(() => {
    if (watchPreferredSubdivision) {
      resolvePincode(watchPreferredState, watchPreferredDistrict, watchPreferredSubdivision, '').then((prefPin) => {
        if (prefPin) {
          setValue('preferredPincode', prefPin);
        }
      });
    }
  }, [watchPreferredSubdivision, watchPreferredDistrict, watchPreferredState]);



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

  // Keep preferred locations synced with preferred district
  useEffect(() => {
    if (watchPreferredDistrict && (!watchLocations || watchLocations.length === 0 || watchLocations[0] !== watchPreferredDistrict)) {
      setValue('preferredLocations', [watchPreferredDistrict]);
    }
  }, [watchPreferredDistrict, setValue]);

  const handleCaptureLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus({
        success: false,
        message: 'आपके मोबाइल या ब्राउज़र में GPS लोकेशन सपोर्ट नहीं है। कृपया नीचे हाथ से पता लिखें।'
      });
      return;
    }

    setIsCapturingLocation(true);
    setLocationStatus({ success: null, message: 'लोकेशन खोजी जा रही है... कृपया मोबाइल स्क्रीन पर "Allow" दबाएं।' });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = Number(position.coords.latitude.toFixed(6));
        const lng = Number(position.coords.longitude.toFixed(6));
        const accuracy = Math.round(position.coords.accuracy);

        setValue('geoLat', lat);
        setValue('geoLng', lng);

        let capturedAddressText = `Lat: ${lat}, Lng: ${lng} (सटीकता: ±${accuracy}m)`;

        try {
          // Only the display text feeds the Current Address fields below.
          // This must never touch state/permanentDistrict/permanentTehsil/permanentVillage/
          // permanentPincode/permanentAddressLine — those belong to the Permanent
          // Address section, and a GPS fix here previously overwrote them,
          // silently corrupting a candidate's native address with wherever
          // they happened to be standing when they tapped the button.
          const geoInfo = await reverseGeocode(lat, lng);
          if (geoInfo?.displayName) {
            capturedAddressText = geoInfo.displayName;
          }
        } catch {
          // Fallback gracefully to coordinates
        }

        setValue('geoAddress', capturedAddressText);
        setValue('currentStayAddress', capturedAddressText);
        setValue('currentArea', capturedAddressText);
        setCurrentSameAsPermanent(false);
        setLocationStatus({
          success: true,
          message: 'आपकी वर्तमान लोकेशन मिल गई और नीचे फॉर्म में भर दी गई है!',
          address: capturedAddressText,
          coords: { lat, lng, accuracy }
        });
        setIsCapturingLocation(false);
      },
      (error) => {
        let errMessage = 'लोकेशन नहीं मिल सकी। कृपया फोन में GPS चालू करें या नीचे हाथ से पता लिखें।';
        if (error.code === error.PERMISSION_DENIED) {
          errMessage = 'लोकेशन अनुमति नहीं मिली। कृपया ब्राउज़र में "Allow" करें या नीचे हाथ से पता लिखें।';
        } else if (error.code === error.TIMEOUT) {
          errMessage = 'समय समाप्त हुआ। कृपया दोबारा प्रयास करें या नीचे हाथ से पता लिखें।';
        }
        setLocationStatus({ success: false, message: errMessage });
        setIsCapturingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // "Same as Permanent" and GPS capture must be mutually exclusive in what
  // gets stored — a candidate could previously capture GPS, then tick "Same
  // as Permanent", and the stale geoLat/geoLng/geoAddress from the earlier
  // GPS fix stayed saved alongside the new "same as permanent" text, so the
  // owner dashboard showed a contradictory record (permanent address in one
  // state, GPS-captured address in a completely different one). Ticking
  // this on now clears any previously-captured GPS data.
  const handleSameAsPermanentToggle = (isSame) => {
    setCurrentSameAsPermanent(isSame);
    if (isSame) {
      setValue('currentStayAddress', 'स्थाई पते के अनुसार (Same as Permanent)');
      setValue('geoLat', undefined);
      setValue('geoLng', undefined);
      setValue('geoAddress', '');
      setLocationStatus(null);
    } else {
      setValue('currentStayAddress', '');
    }
  };

  const handleToggleSameForPreferred = (checked) => {
    setSameAsPermanentForPreferred(checked);
    if (checked) {
      const curState = watch('permanentState') || 'Rajasthan';
      const curCity = watch('permanentDistrict') || 'Jaipur';
      const curSub = watch('permanentSubdivision') || '';
      const curBlk = watch('permanentBlock') || watch('permanentTehsil') || '';
      const curPin = watch('permanentPincode') || '';
      const curAddr = watch('permanentAddressLine') || '';

      setValue('preferredState', curState);
      setValue('preferredDistrict', curCity);
      setValue('preferredSubdivision', curSub);
      setValue('preferredBlock', curBlk);
      setValue('preferredTehsil', curBlk);
      setValue('preferredPincode', curPin);
      setValue('preferredAddressLine', curAddr);
      setValue('preferredLocations', [curCity]);

      setPreferredDistricts(currentDistricts);
      setPreferredSubdivisions(permanentSubdivisions);
      setPreferredBlocks(permanentBlocks);
    }
  };

  const stepFields = {
    1: ['fullName', 'mobileNumber', 'whatsappNumber', 'age', 'gender'],
    2: ['permanentDistrict', 'permanentSubdivision', 'currentArea', 'permanentState', 'preferredRoles', 'preferredState', 'preferredDistrict', 'preferredSubdivision'],
    3: ['highestQualification', 'consentGiven', 'securityExperienceMonths', 'joiningAvailability', 'dutyHourPreference'],
  };

  const handleNextStep = async () => {
    if (currentStep === 1 && duplicateMobileInfo) {
      setSubmitError(`यह मोबाइल नंबर पहले से पंजीकृत है (${duplicateMobileInfo.fullName} — ${duplicateMobileInfo.candidateCode})। कृपया दोबारा फॉर्म न भरें। (This mobile number is already registered. Please do not fill the form again.)`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentStep === 2) {
      const curCity = watch('permanentDistrict') || 'Jaipur';
      const curSub = watch('permanentSubdivision') || '';
      const curBlk = watch('permanentBlock') || watch('permanentTehsil') || '';
      const curVillage = watch('permanentVillage') || '';
      const curAddr = watch('permanentAddressLine') || '';
      const stayAddr = (watch('currentStayAddress') || '').trim();
      const geoAddr = watch('geoAddress') || '';

      // A candidate must actively confirm their current address — either by
      // checking "Same as Permanent" or by giving a real stay address
      // (typed or GPS-captured) — before moving on. This used to always
      // synthesize a filler value (even a bare "${curCity} Main Area}")
      // regardless of whether either was actually provided, which silently
      // let candidates through the step with no real current-address data.
      if (!currentSameAsPermanent && !stayAddr) {
        setSubmitError('कृपया वर्तमान पता भरें या "स्थाई पते पर ही रहता हूँ" विकल्प चुनें। (Please fill your current address or select "Same as Permanent".)');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      setSubmitError('');

      const combinedArea = currentSameAsPermanent
        ? [curSub, curBlk, curVillage, curAddr].filter(Boolean).join(', ') || `${curCity} Main Area`
        : (stayAddr || geoAddr);
      setValue('currentArea', combinedArea);

      const prefDist = watch('preferredDistrict') || curCity;
      setValue('preferredLocations', [prefDist]);
    }

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
      const payload = buildFormData(data, trackingData, aadhaarFrontFile, aadhaarBackFile);
      const res = await submitCandidateApplication(payload);

      trackEvent('ApplicationSubmitSuccess', {
        candidateCode: res.candidateCode,
        isExisting: res.isExistingCandidate,
      });

      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setSubmissionResult(res);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const backendErrors = err.response?.data?.errors;
      if (backendErrors && typeof backendErrors === 'object' && Object.keys(backendErrors).length > 0) {
        let jumpToStep = 3;
        const errMessages = [];

        Object.entries(backendErrors).forEach(([field, msg]) => {
          setError(field, { type: 'server', message: msg });
          errMessages.push(`${msg}`);

          if (['fullName', 'mobileNumber', 'whatsappNumber', 'age', 'gender'].includes(field)) {
            jumpToStep = Math.min(jumpToStep, 1);
          } else if (['permanentDistrict', 'permanentSubdivision', 'currentArea', 'permanentState', 'preferredRoles', 'preferredState', 'preferredDistrict', 'preferredSubdivision'].includes(field)) {
            jumpToStep = Math.min(jumpToStep, 2);
          }
        });

        setCurrentStep(jumpToStep);
        const detailedMsg = err.response?.data?.message || 'कृपया फॉर्म में हाइलाइट की गई त्रुटियों को सुधारें।';
        setSubmitError(`${detailedMsg}: ${errMessages.join(', ')}`);
        window.scrollTo({ top: 120, behavior: 'smooth' });
      } else {
        const errorMsg =
          err.response?.data?.message ||
          err.message ||
          'फॉर्म जमा करने में त्रुटि हुई। कृपया दोबारा प्रयास करें।';
        setSubmitError(errorMsg);
      }
      trackEvent('form_submit_error', { message: err.message });
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const handleImageChange = async (e, side) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Shrink a 3-5 MB phone photo down to ~300-400 KB now, while the candidate
    // carries on filling the form, rather than making them wait for a
    // multi-megabyte upload when they hit submit.
    const setCompressing = side === 'front' ? setCompressingFront : setCompressingBack;
    setCompressing(true);
    const compressed = await compressImage(file);
    setCompressing(false);

    const url = URL.createObjectURL(compressed);
    if (side === 'front') {
      setAadhaarFrontPreview(url);
      setAadhaarFrontFile(compressed);
    }
    if (side === 'back') {
      setAadhaarBackPreview(url);
      setAadhaarBackFile(compressed);
    }
  };

  const roleOptions = [
    {
      label: 'Security Guard (सिक्योरिटी गार्ड)',
      value: 'Security Guard',
      icon: Shield,
      color: 'text-blue-600 bg-blue-100/80',
    },
    {
      label: 'Security Supervisor (सुपरवाइजर)',
      value: 'Security Supervisor',
      icon: Award,
      color: 'text-indigo-600 bg-indigo-100/80',
    },
    {
      label: 'Lady Security Guard (लेडी गार्ड)',
      value: 'Lady Security Guard',
      icon: UserCheck,
      color: 'text-purple-600 bg-purple-100/80',
    },
    {
      label: 'CCTV Operator (सीसीटीवी ऑपरेटर)',
      value: 'CCTV Operator',
      icon: Video,
      color: 'text-emerald-600 bg-emerald-100/80',
    },
    {
      label: 'Bouncer & Event Security Guards (बाउंसर)',
      value: 'Bouncer',
      icon: Zap,
      color: 'text-amber-600 bg-amber-100/80',
    },
    {
      label: 'Armed Guard / Gunman (गनमैन)',
      value: 'Armed Guard',
      icon: Target,
      color: 'text-rose-600 bg-rose-100/80',
    },
    {
      label: 'Field Officer (फील्ड ऑफिसर)',
      value: 'Field Officer',
      icon: ClipboardCheck,
      color: 'text-cyan-600 bg-cyan-100/80',
    },
    {
      label: 'Facility Supervisor (सुपरवाइजर)',
      value: 'Facility Supervisor',
      icon: Building2,
      color: 'text-teal-600 bg-teal-100/80',
    },
  ];

  if (submissionResult) {
    return (
      <Card className="p-6 sm:p-10">
        <SuccessState
          candidateCode={submissionResult.candidateCode}
          isExistingCandidate={submissionResult.isExistingCandidate}
          whatsappNumber={submissionResult.whatsappNumber || OFFICIAL_WHATSAPP_NUMBER}
          onSubmitAnother={() => {
            localStorage.removeItem(DRAFT_STORAGE_KEY);
            reset();
            setSubmissionResult(null);
            setCurrentStep(1);
            setAadhaarFrontPreview(null);
            setAadhaarFrontFile(null);
            setAadhaarBackPreview(null);
            setAadhaarBackFile(null);
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
      {/* Guard Friendly Trust Header - Responsive & Clean */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50/90 via-indigo-50/70 to-emerald-50/80 border border-blue-200/80 p-4 sm:p-5 shadow-xs transition-all">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-6 w-24 h-24 bg-emerald-400/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-md shadow-blue-600/25 ring-4 ring-blue-100/90">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight leading-snug">
                  सिक्योरिटी जॉब आवेदन फॉर्म
                </h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-blue-100/90 text-blue-700 border border-blue-200/70 shrink-0">
                  100% फ्री
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="font-medium text-slate-700">सीधी भर्ती (No Fees)</span>
                <span className="text-slate-300 hidden xs:inline">&bull;</span>
                <span>सरकारी PF व ESIC सुविधा</span>
                <span className="text-slate-300 hidden xs:inline">&bull;</span>
                <span className="text-blue-600 font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3 inline" /> 2 मिनट में भरें
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-start sm:justify-end shrink-0 pl-14 sm:pl-0">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              ₹0 कोई फीस नहीं
            </span>
          </div>
        </div>
      </div>

      <Card className="p-4 sm:p-8 shadow-md border-slate-200/90">
        {/* Step Indicator Progress Bar - Animated & Responsive */}
        <div className="mb-7 sm:mb-9">
          {/* Top Status Meta Row */}
          <div className="flex items-center justify-between gap-2 mb-3.5 px-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-extrabold text-xs">
                {currentStep}
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight">
                {stepsMeta[currentStep - 1]?.title}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100/90 border border-slate-200/80 text-[11px] font-bold text-slate-700 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{Math.round((currentStep / TOTAL_STEPS) * 100)}% पूर्ण</span>
            </div>
          </div>

          {/* Interactive Steps Rail with Connecting Lines */}
          <div className="relative flex items-center justify-between mb-3 px-3 sm:px-6">
            {/* Background Rail Line */}
            <div className="absolute left-7 right-7 sm:left-12 sm:right-12 top-1/2 -translate-y-1/2 h-1 bg-slate-200/80 rounded-full z-0" />
            
            {/* Animated Active Rail Fill */}
            <motion.div
              className="absolute left-7 sm:left-12 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full z-0 origin-left"
              initial={false}
              animate={{
                width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : 'calc(100% - 3.5rem)'
              }}
              transition={{ type: "spring", stiffness: 100, damping: 16 }}
            />

            {/* Step Nodes */}
            {stepsMeta.map((s) => {
              const isPassed = currentStep > s.num;
              const isCurrent = currentStep === s.num;
              return (
                <div key={s.num} className="relative z-10 flex flex-col items-center">
                  <motion.div
                    initial={false}
                    animate={{
                      scale: isCurrent ? 1.08 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center transition-all ${
                      isPassed
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-500/30 ring-2 ring-emerald-100'
                        : isCurrent
                        ? 'bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md shadow-blue-500/30 ring-4 ring-blue-100'
                        : 'bg-white text-slate-400 border-2 border-slate-200 shadow-2xs'
                    }`}
                  >
                    {isPassed ? (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                    ) : (
                      <span>{s.num}</span>
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Step Labels Grid */}
          <div className="grid grid-cols-3 gap-1 sm:gap-4 text-center">
            {stepsMeta.map((s) => {
              const isPassed = currentStep > s.num;
              const isCurrent = currentStep === s.num;
              return (
                <div key={s.num} className="px-1">
                  <p
                    className={`text-[11px] sm:text-xs font-bold leading-tight transition-colors ${
                      isCurrent
                        ? 'text-blue-700 font-extrabold'
                        : isPassed
                        ? 'text-emerald-700 font-semibold'
                        : 'text-slate-500 font-medium'
                    }`}
                  >
                    {s.title}
                  </p>
                  <p className="text-[10px] text-slate-400 font-normal hidden sm:block mt-0.5">
                    {s.sub}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Note: encourage complete, accurate details instead of a plain progress bar */}
          <div className="mt-3.5 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-2.5">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] sm:text-xs font-medium text-amber-900 leading-snug">
              कृपया सभी जानकारी पूरी और सही भरें, इससे आपको नौकरी मिलने की संभावना बढ़ जाती है।
              <span className="block text-amber-700/90 font-normal mt-0.5">
                (Please fill in all details completely and correctly — this improves your chances of getting a job.)
              </span>
            </p>
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
                {isCheckingMobile && !duplicateMobileInfo && (
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    नंबर जाँचा जा रहा है...
                  </p>
                )}
                {duplicateMobileInfo && (
                  <div className="mt-2 p-3 rounded-xl bg-red-50 border border-red-300 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-xs font-semibold text-red-800 leading-relaxed">
                      आप पहले से पंजीकृत हैं ({duplicateMobileInfo.fullName} — {duplicateMobileInfo.candidateCode})। कृपया दोबारा फॉर्म न भरें।
                      <span className="block font-normal text-red-700 mt-0.5">
                        (You are already registered. Please do not fill the form again.)
                      </span>
                    </p>
                  </div>
                )}
                {!duplicateMobileInfo && (
                  <p className="text-[11px] text-slate-500 mt-1">
                    इस नंबर पर आपको जॉब की जानकारी और इंटरव्यू का कॉल आएगा।
                  </p>
                )}
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
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setValue('gender', 'male', { shouldValidate: true })}
                      className={`py-3 px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                        watchGender === 'male'
                          ? 'bg-blue-50 border-blue-600 text-blue-700 ring-2 ring-blue-200 shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className={`w-4 h-4 shrink-0 transition-colors ${watchGender === 'male' ? 'text-blue-600' : 'text-slate-500'}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="10" cy="14" r="5" />
                        <path d="M19 5L13.6 10.4" />
                        <path d="M14 5h5v5" />
                      </svg>
                      <span>पुरुष (Male)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setValue('gender', 'female', { shouldValidate: true })}
                      className={`py-3 px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                        watchGender === 'female'
                          ? 'bg-blue-50 border-blue-600 text-blue-700 ring-2 ring-blue-200 shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className={`w-4 h-4 shrink-0 transition-colors ${watchGender === 'female' ? 'text-blue-600' : 'text-slate-500'}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="9" r="5" />
                        <path d="M12 14v7" />
                        <path d="M9 18h6" />
                      </svg>
                      <span>महिला (Female)</span>
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

              {/* ------------------------------------------------------------- */}
              {/* 1. PERMANENT ADDRESS (स्थाई पता) - Full Hierarchy With API   */}
              {/* ------------------------------------------------------------- */}
              {/* ------------------------------------------------------------- */}
              {/* 1. PERMANENT ADDRESS (स्थाई पता) - Full Hierarchy With API   */}
              {/* ------------------------------------------------------------- */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3.5 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-xs">
                      <Home className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                        1. स्थाई पता (Permanent Address) <span className="text-red-500">*</span>
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        जहाँ आपका मूल / पैतृक निवास है (Your permanent native residence)
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200/70 px-3 py-1 rounded-full self-start sm:self-center">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>मूल निवास</span>
                  </span>
                </div>

                {/* 2-Column Responsive Minimal Breathable Grid: State ➔ District ➔ Subdivision ➔ Block ➔ Village */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {/* Tier 1: State */}
                  <div>
                    <SearchableLocationInput
                      id="current-state"
                      label="मूल राज्य (State)"
                      value={watchPermanentState}
                      onChange={(val) => {
                        setValue('permanentState', val, { shouldValidate: true });
                      }}
                      onSelectOption={(val) => {
                        setValue('permanentState', val, { shouldValidate: true });
                        setValue('permanentDistrict', '');
                        setValue('permanentSubdivision', '');
                        setValue('permanentBlock', '');
                        setValue('permanentTehsil', '');
                        setValue('permanentVillage', '');
                        setValue('permanentPincode', '');
                      }}
                      options={statesList}
                      placeholder="राज्य टाइप करें या चुनें (उदा. Rajasthan, Bihar)"
                      required
                    />
                  </div>

                  {/* Tier 2: District */}
                  <div>
                    <SearchableLocationInput
                      id="current-city"
                      label="मूल जिला (District)"
                      value={watchPermanentDistrict}
                      onChange={(val) => {
                        setValue('permanentDistrict', val, { shouldValidate: true });
                        setValue('preferredLocations', [val]);
                      }}
                      onSelectOption={(val) => {
                        setValue('permanentDistrict', val, { shouldValidate: true });
                        setValue('preferredLocations', [val]);
                        setValue('permanentSubdivision', '');
                        setValue('permanentBlock', '');
                        setValue('permanentTehsil', '');
                        setValue('permanentVillage', '');
                        setValue('permanentPincode', '');
                      }}
                      options={currentDistricts.length > 0 ? currentDistricts : getDistrictsForState(watchPermanentState)}
                      placeholder="जिला टाइप करें या चुनें (उदा. Jaipur, Siwan)"
                      required
                      error={errors.permanentDistrict?.message}
                      isLoading={isLoadingDistricts}
                      badgeText={currentDistricts.length > 0 ? `${currentDistricts.length} जिले` : ''}
                    />
                  </div>

                  {/* Tier 3: Subdivision (labeled as Tehsil per candidate-facing convention) */}
                  <div>
                    <SearchableLocationInput
                      id="current-subdivision"
                      label="तहसील (Tehsil / Subdivision)"
                      value={watchPermanentSubdivision}
                      onChange={(val) => {
                        setValue('permanentSubdivision', val);
                      }}
                      onSelectOption={(val) => {
                        setValue('permanentSubdivision', val);
                        setValue('permanentBlock', '');
                        setValue('permanentTehsil', '');
                        setValue('permanentVillage', '');
                        setValue('permanentPincode', '');

                        // Load authoritative villages immediately to prevent blinking
                        // (village now keys off subdivision/tehsil, not block — see Tier 4 below)
                        const localVills = getVillagesForTehsil(watchPermanentState, watchPermanentDistrict, val);
                        if (localVills && localVills.length > 0) {
                          setCurrentVillages(localVills);
                        }
                        fetchVillagesForTehsil(watchPermanentState, watchPermanentDistrict, val).then((vills) => {
                          if (vills && vills.length > 0) {
                            setCurrentVillages((prev) => {
                              const merged = [...new Set([...(prev || []), ...vills])];
                              return merged.length === prev.length ? prev : merged;
                            });
                          }
                        });

                        resolvePincode(watchPermanentState, watchPermanentDistrict, val, '').then((pin) => {
                          if (pin) setValue('permanentPincode', pin);
                        });
                      }}
                      options={permanentSubdivisions}
                      placeholder={permanentSubdivisions.length > 0 ? "तहसील टाइप करें या चुनें" : "तहसील का नाम लिखें"}
                      required
                      error={errors.permanentSubdivision?.message}
                      isLoading={isLoadingSubdivisions}
                      badgeText={permanentSubdivisions.length > 0 ? `${permanentSubdivisions.length} तहसील` : ''}
                    />
                  </div>

                  {/* Tier 4: Block / Tehsil — hidden for now (kept, not deleted, so it
                      can come back later). Village/pincode lookups below now key off
                      Subdivision (Tier 3) instead of this field.
                  <div>
                    <SearchableLocationInput
                      id="current-block"
                      label="प्रखंड / ब्लॉक / तहसील (Block)"
                      value={watchPermanentBlock}
                      onChange={(val) => {
                        setValue('permanentBlock', val);
                        setValue('permanentTehsil', val);
                      }}
                      onSelectOption={(val) => {
                        setValue('permanentBlock', val);
                        setValue('permanentTehsil', val);
                        setValue('permanentVillage', '');

                        // Load authoritative villages immediately to prevent blinking
                        const localVills = getVillagesForTehsil(watchPermanentState, watchPermanentDistrict, val);
                        if (localVills && localVills.length > 0) {
                          setCurrentVillages(localVills);
                        }
                        fetchVillagesForTehsil(watchPermanentState, watchPermanentDistrict, val).then((vills) => {
                          if (vills && vills.length > 0) {
                            setCurrentVillages((prev) => {
                              const merged = [...new Set([...(prev || []), ...vills])];
                              return merged.length === prev.length ? prev : merged;
                            });
                          }
                        });

                        resolvePincode(watchPermanentState, watchPermanentDistrict, val, '').then((pin) => {
                          if (pin) setValue('permanentPincode', pin);
                        });
                      }}
                      options={permanentBlocks}
                      placeholder={permanentBlocks.length > 0 ? "प्रखंड / ब्लॉक टाइप करें या चुनें" : "प्रखंड / ब्लॉक का नाम लिखें"}
                      isLoading={isLoadingBlocks}
                      badgeText={permanentBlocks.length > 0 ? `${permanentBlocks.length} ब्लॉक उपलब्ध` : ''}
                    />
                  </div>
                  */}

                  {/* Tier 5: Village / Ward / Town */}
                  <div>
                    <SearchableLocationInput
                      id="current-village"
                      label="गाँव / कस्बा / वार्ड (Village / Town)"
                      value={watchPermanentVillage}
                      onChange={(val) => {
                        setValue('permanentVillage', val);
                      }}
                      onSelectOption={(val) => {
                        setValue('permanentVillage', val);
                        resolvePincode(watchPermanentState, watchPermanentDistrict, watchPermanentSubdivision, val).then((pin) => {
                          if (pin) setValue('permanentPincode', pin);
                        });
                      }}
                      options={permanentVillages}
                      placeholder={permanentVillages.length > 0 ? "गाँव या कस्बा टाइप करें या चुनें" : "गाँव / वार्ड का नाम लिखें"}
                      badgeText={permanentVillages.length > 0 ? `${permanentVillages.length} गाँव उपलब्ध` : ''}
                    />
                  </div>

                  {/* Tier 6: Pincode (with Auto-fetch pill) */}
                  <div>
                    <div className="flex items-center justify-between gap-1.5 mb-1.5">
                      <label htmlFor="current-pincode" className="block text-[11px] sm:text-xs font-semibold text-slate-800">
                        पिनकोड (Pincode)
                      </label>
                      {watchPermanentPincode && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <Zap className="w-3 h-3 text-emerald-600 fill-emerald-500" /> ऑटो-फ़िल
                        </span>
                      )}
                    </div>
                    <input
                      id="current-pincode"
                      type="text"
                      maxLength={6}
                      placeholder="उदा. 302001 या 841238 (तहसील से स्वतः दर्ज)"
                      value={watchPermanentPincode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setValue('permanentPincode', val);
                        if (val.length === 6 && (!watchPermanentState || !watchPermanentDistrict)) {
                          lookupPincode(val).then((info) => {
                            if (info) {
                              if (!watchPermanentState && info.state) setValue('permanentState', info.state, { shouldValidate: true });
                              if (!watchPermanentDistrict && info.district) setValue('permanentDistrict', info.district, { shouldValidate: true });
                            }
                          });
                        }
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/40 hover:bg-white focus:bg-white text-xs sm:text-sm font-semibold text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all tracking-wider placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400"
                    />
                  </div>

                  {/* Tier 7: House / Street / Landmark (paired with Pincode above, same row) */}
                  <div>
                    <label htmlFor="current-address-line" className="block text-[11px] sm:text-xs font-semibold text-slate-800 mb-1.5 truncate">
                      मकान नं., टोला, गली व लैंडमार्क (House / Street / Landmark)
                    </label>
                    <input
                      id="current-address-line"
                      type="text"
                      placeholder="उदा. मकान नं. 24, मेन मंदिर के पास, पटेल नगर"
                      value={watchPermanentAddressLine}
                      onChange={(e) => setValue('permanentAddressLine', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/40 hover:bg-white focus:bg-white text-xs sm:text-sm font-semibold text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all placeholder:font-normal placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* 2. CURRENT ADDRESS (वर्तमान पता) - Simple & Guard-Friendly */}
              {/* ------------------------------------------------------------- */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-emerald-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-emerald-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-xs">
                      <Navigation className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                        2. वर्तमान पता (Current Address)
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        अभी आप कहाँ रह रहे हैं? (Where do you currently reside?)
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full self-start sm:self-center">
                    <Crosshair className="w-3.5 h-3.5 text-emerald-600" />
                    <span>वर्तमान लोकेशन</span>
                  </span>
                </div>

                {/* Option 1: Live at Native Home / Permanent Address */}
                <div
                  onClick={() => handleSameAsPermanentToggle(!currentSameAsPermanent)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    currentSameAsPermanent
                      ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-200/60 shadow-2xs'
                      : 'bg-slate-50/60 border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                  }`}
                >
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={currentSameAsPermanent}
                      onChange={(e) => handleSameAsPermanentToggle(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="block text-xs sm:text-sm font-bold text-slate-900">
                        मैं अभी अपने स्थाई (गाँव / घर) पते पर ही रहता हूँ (Same as Permanent)
                      </span>
                      <span className="block text-[11px] sm:text-xs text-slate-500 mt-0.5">
                        {currentSameAsPermanent ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            स्थाई पता ही आपका वर्तमान पता मान लिया गया है (अलग से भरने की आवश्यकता नहीं)।
                          </span>
                        ) : (
                          'यदि आप अपने मूल गाँव या घर पर ही रहते हैं, तो इसे टिक करें।'
                        )}
                      </span>
                    </div>
                  </label>
                </div>

                {/* Option 2: Living Away / In City / On Duty */}
                {!currentSameAsPermanent && (
                  <div className="space-y-4 pt-1">
                    {/* Auto-fill with 1-click GPS Button */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-white border border-emerald-200 space-y-3">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                            <Crosshair className="w-4 h-4 text-emerald-600" />
                            <span>मोबाइल से अभी की लोकेशन भरें (Auto-Fill Location)</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">
                            बटन दबाते ही आपकी अभी की लोकेशन अपने आप फॉर्म में आ जाएगी
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={handleCaptureLocation}
                          disabled={isCapturingLocation}
                          className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 transition-all shrink-0"
                        >
                          {isCapturingLocation ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>लोकेशन जाँची जा रही है...</span>
                            </>
                          ) : (
                            <>
                              <Crosshair className="w-4 h-4" />
                              <span>📍 अभी की लोकेशन लें</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Captured Result Message Card */}
                      {locationStatus && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-3 rounded-xl border text-xs ${
                            locationStatus.success === true
                              ? 'bg-white border-emerald-300 text-emerald-950 shadow-2xs'
                              : locationStatus.success === false
                              ? 'bg-amber-50 border-amber-300 text-amber-950'
                              : 'bg-blue-50 border-blue-200 text-blue-900'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            {locationStatus.success === true ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            )}
                            <div className="min-w-0 flex-1">
                              <span className="font-bold block text-xs sm:text-sm">
                                {locationStatus.message}
                              </span>
                              {locationStatus.address && (
                                <p className="mt-1.5 text-slate-800 text-xs sm:text-sm leading-relaxed bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-200/80 font-semibold">
                                  {locationStatus.address}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Manual / Verified Stay Address Input */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                        वर्तमान रहने का पता (Current Stay Address)
                      </label>
                      <input
                        type="text"
                        placeholder="उदा. कमरा नं. 12, शिव कॉलोनी, मानसरोवर, जयपुर (या ऊपर बटन दबाकर लोकेशन लें)"
                        value={watchCurrentStayAddress}
                        onChange={(e) => {
                          setValue('currentStayAddress', e.target.value);
                          if (currentSameAsPermanent) setCurrentSameAsPermanent(false);
                        }}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-semibold text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 focus:outline-none transition-all placeholder:font-normal placeholder:text-slate-400"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        यदि आप किराए पर या किसी अन्य शहर में रहते हैं, तो यहाँ लिखें।
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* ------------------------------------------------------------- */}
              {/* 3. PREFERRED JOB LOCATION (पसंदीदा जॉब लोकेशन) - Town/Tehsil Level (No Village) */}
              {/* ------------------------------------------------------------- */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-blue-200 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3.5 border-b border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-xs">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                        3. पसंदीदा जॉब लोकेशन (Preferred Job Location) <span className="text-red-500">*</span>
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        जहाँ आप ड्यूटी करना चाहते हैं
                      </p>
                    </div>
                  </div>

                  {/* Same as Permanent Location Toggle */}
                  <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 text-xs font-semibold cursor-pointer hover:bg-blue-100/70 transition-colors shadow-2xs">
                    <input
                      type="checkbox"
                      checked={sameAsPermanentForPreferred}
                      onChange={(e) => handleToggleSameForPreferred(e.target.checked)}
                      className="w-4 h-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                    />
                    <Copy className="w-3.5 h-3.5 text-blue-600" />
                    <span>स्थाई जिले व तहसील में ड्यूटी (Same as Permanent)</span>
                  </label>
                </div>

                {/* 2-Column Responsive Breathable Grid: State ➔ District ➔ Subdivision ➔ Block / Town (NO VILLAGE LEVEL) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {/* Row 1, Col 1: Preferred State */}
                  <div>
                    <SearchableLocationInput
                      id="pref-state"
                      label="पसंदीदा राज्य (Duty State)"
                      value={watchPreferredState}
                      onChange={(val) => setValue('preferredState', val)}
                      onSelectOption={(val) => {
                        setValue('preferredState', val);
                        setValue('preferredDistrict', '');
                        setValue('preferredSubdivision', '');
                        setValue('preferredBlock', '');
                        setValue('preferredTehsil', '');
                        setValue('preferredPincode', '');
                      }}
                      options={statesList}
                      placeholder="राज्य टाइप करें या चुनें"
                      required
                      error={errors.preferredState?.message}
                    />
                  </div>

                  {/* Row 1, Col 2: Preferred District */}
                  <div>
                    <SearchableLocationInput
                      id="pref-city"
                      label="पसंदीदा जिला (Duty District)"
                      value={watchPreferredDistrict}
                      onChange={(val) => {
                        setValue('preferredDistrict', val);
                        setValue('preferredLocations', [val]);
                      }}
                      onSelectOption={(val) => {
                        setValue('preferredDistrict', val);
                        setValue('preferredLocations', [val]);
                        setValue('preferredSubdivision', '');
                        setValue('preferredBlock', '');
                        setValue('preferredTehsil', '');
                        setValue('preferredPincode', '');
                      }}
                      options={preferredDistricts.length > 0 ? preferredDistricts : getDistrictsForState(watchPreferredState)}
                      placeholder="जिला टाइप करें या चुनें"
                      required
                      error={errors.preferredDistrict?.message}
                      isLoading={isLoadingPrefDistricts}
                      badgeText={preferredDistricts.length > 0 ? `${preferredDistricts.length} जिले` : ''}
                    />
                  </div>

                  {/* Row 2, Col 1: Preferred Subdivision (labeled as Tehsil per candidate-facing convention) */}
                  <div>
                    <SearchableLocationInput
                      id="pref-subdivision"
                      label="पसंदीदा तहसील (Duty Tehsil / Subdivision)"
                      value={watchPreferredSubdivision}
                      onChange={(val) => setValue('preferredSubdivision', val)}
                      onSelectOption={(val) => {
                        setValue('preferredSubdivision', val);
                        setValue('preferredBlock', '');
                        setValue('preferredTehsil', '');
                        setValue('preferredPincode', '');
                        resolvePincode(watchPreferredState, watchPreferredDistrict, val, '').then((pin) => {
                          if (pin) setValue('preferredPincode', pin);
                        });
                      }}
                      options={preferredSubdivisions}
                      placeholder={preferredSubdivisions.length > 0 ? "तहसील टाइप करें या चुनें" : "तहसील का नाम लिखें"}
                      required
                      error={errors.preferredSubdivision?.message}
                      isLoading={isLoadingPrefSubdivisions}
                      badgeText={preferredSubdivisions.length > 0 ? `${preferredSubdivisions.length} तहसील` : ''}
                    />
                  </div>

                  {/* Row 2, Col 2: Preferred Block / Town — hidden for now (kept, not
                      deleted, so it can come back later). Pincode lookup above now keys
                      off Subdivision/Tehsil instead of this field.
                  <div>
                    <SearchableLocationInput
                      id="pref-block"
                      label="पसंदीदा ब्लॉक / टाउन / कस्बा (Duty Block / Town)"
                      value={watchPreferredBlock}
                      onChange={(val) => {
                        setValue('preferredBlock', val);
                        setValue('preferredTehsil', val);
                      }}
                      onSelectOption={(val) => {
                        setValue('preferredBlock', val);
                        setValue('preferredTehsil', val);
                        resolvePincode(watchPreferredState, watchPreferredDistrict, val, '').then((pin) => {
                          if (pin) setValue('preferredPincode', pin);
                        });
                      }}
                      options={preferredBlocks}
                      placeholder={preferredBlocks.length > 0 ? "ब्लॉक / टाउन टाइप करें या चुनें" : "ब्लॉक / कस्बा लिखें"}
                      isLoading={isLoadingPrefBlocks}
                      badgeText={preferredBlocks.length > 0 ? `${preferredBlocks.length} उपलब्ध` : ''}
                    />
                  </div>
                  */}

                  {/* Row 2, Col 2: Preferred Pincode (auto-flows next to Subdivision since Block above is hidden) */}
                  <div>
                    <div className="flex items-center justify-between gap-1.5 mb-1.5">
                      <label htmlFor="pref-pincode" className="block text-[11px] sm:text-xs font-semibold text-slate-800">
                        पसंदीदा पिनकोड (Duty PIN Code)
                      </label>
                      {watchPreferredPincode && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <Zap className="w-3 h-3 text-emerald-600 fill-emerald-500" /> ऑटो-फ़िल
                        </span>
                      )}
                    </div>
                    <input
                      id="pref-pincode"
                      type="text"
                      maxLength={6}
                      placeholder="उदा. 302001 या 841238"
                      value={watchPreferredPincode}
                      onChange={(e) => setValue('preferredPincode', e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/40 hover:bg-white focus:bg-white text-xs sm:text-sm font-semibold text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all tracking-wider placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400"
                    />
                  </div>

                  {/* Row 4: Preferred Duty Landmark / Area (spans 2 columns — free-text field, matches Permanent Address's Address Line treatment) */}
                  <div className="md:col-span-2">
                    <label htmlFor="pref-landmark" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                      इच्छित ड्यूटी क्षेत्र / लैंडमार्क (Duty Landmark / Area)
                    </label>
                    <input
                      id="pref-landmark"
                      type="text"
                      placeholder="उदा. रीको इंडस्ट्रियल एरिया, मुख्य बस स्टैंड, मॉल, बैंक"
                      value={watchPreferredAddressLine}
                      onChange={(e) => setValue('preferredAddressLine', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/40 hover:bg-white focus:bg-white text-xs sm:text-sm font-semibold text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all placeholder:font-normal placeholder:text-slate-400"
                    />
                  </div>

                  {/* Row 4: Job Placement Scope Note (Spans 2 columns on md) */}
                  <div className="md:col-span-2">
                    <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200/80 text-blue-900 text-xs flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <p className="leading-relaxed">
                        आपकी पसंद के नजदीकी क्षेत्र में ड्यूटी दी जाएगी।
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ----------------------------------------------------------------- */}
              {/* PREVIOUS LOCATION UI (COMMENTED OUT AS REQUESTED - DO NOT REMOVE) */}
              {/* ----------------------------------------------------------------- */}
              {/*
              <div className="opacity-60 pointer-events-none space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                    राज्य (State)
                  </label>
                  <div className="flex items-center gap-2 p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 font-bold text-sm text-blue-900">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>राजस्थान (Rajasthan) &mdash; केवल राजस्थान के लिए सक्रिय</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs sm:text-sm font-bold text-slate-900">
                      वर्तमान जिला / शहर (Current District in Rajasthan) *
                    </label>
                  </div>
                  <select
                    value={watchPermanentDistrict}
                    className="w-full px-4 py-3.5 rounded-xl border text-sm font-bold text-slate-900 bg-slate-50"
                  >
                    {RAJASTHAN_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-2">मुख्य जिले (Quick Select):</p>
                  <div className="flex flex-wrap gap-2">
                    {['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Alwar', 'Bhiwadi', 'Neemrana', 'Bhilwara', 'Sikar'].map((city) => (
                      <button
                        key={city}
                        type="button"
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/90 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs sm:text-sm font-bold text-slate-900">
                      तहसील / एरिया / औद्योगिक क्षेत्र (Area / Tehsil / RIICO Hub) *
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder={`उदा. ${watchPermanentDistrict || 'Jaipur'} का अपना एरिया या रीको हब`}
                    className="w-full px-4 py-3.5 rounded-xl border text-sm font-semibold text-slate-900 bg-white"
                  />
                </div>
              </div>
              */}

              {/* Preferred Job Role Selection Cards */}
              <div className="pt-2 border-t border-slate-100 space-y-2.5">
                <label className="block text-xs sm:text-sm font-bold text-slate-900">
                  आप किस पद / जॉब के लिए आवेदन करना चाहते हैं? <span className="text-red-500">*</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {roleOptions.map((opt) => {
                    const isSelected = watchRoles.includes(opt.value);
                    const IconComponent = opt.icon;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setValue('preferredRoles', [opt.value], { shouldValidate: true });
                        }}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50/80 border-blue-600 text-blue-950 ring-2 ring-blue-200 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg shrink-0 ${opt.color}`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">{opt.label}</span>
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
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setValue('isExperienced', false);
                      setValue('securityExperienceMonths', 0);
                    }}
                    className={`p-3 sm:py-3.5 sm:px-4 rounded-xl border text-center transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 ${
                      !watchExperienced
                        ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-200'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <ShieldCheck className={`w-5 h-5 shrink-0 ${!watchExperienced ? 'text-blue-600' : 'text-slate-400'}`} />
                    <div className="leading-tight">
                      <span className="block font-bold text-xs sm:text-sm">नया गार्ड / फ्रेशर</span>
                      <span className="text-[10.5px] sm:text-xs opacity-75 font-semibold">(Fresher)</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setValue('isExperienced', true)}
                    className={`p-3 sm:py-3.5 sm:px-4 rounded-xl border text-center transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 ${
                      watchExperienced
                        ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-200'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Briefcase className={`w-5 h-5 shrink-0 ${watchExperienced ? 'text-blue-600' : 'text-slate-400'}`} />
                    <div className="leading-tight">
                      <span className="block font-bold text-xs sm:text-sm">अनुभवी गार्ड</span>
                      <span className="text-[10.5px] sm:text-xs opacity-75 font-semibold">(Experienced)</span>
                    </div>
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
                    {errors.securityExperienceMonths && (
                      <p className="text-xs font-semibold text-red-600 mt-1">{errors.securityExperienceMonths.message}</p>
                    )}
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
                    {errors.dutyHourPreference && (
                      <p className="text-xs font-semibold text-red-600 mt-1">{errors.dutyHourPreference.message}</p>
                    )}
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
                    {errors.joiningAvailability && (
                      <p className="text-xs font-semibold text-red-600 mt-1">{errors.joiningAvailability.message}</p>
                    )}
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

              {/* ID Proof / Aadhaar Upload Box (Guard-Friendly & Voluntary)
                  Temporarily disabled — re-enable by uncommenting this block
                  when the feature is ready to come back.
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-xs sm:text-sm font-bold text-slate-900 truncate">
                        पहचान पत्र / आधार फोटो
                      </span>
                      <span className="text-[10px] sm:text-xs text-slate-500 font-medium">ID Proof / Aadhaar Photo</span>
                    </div>
                  </div>
                  <span className="shrink-0 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                    वैकल्पिक (Optional)
                  </span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  पहचान व आयु सत्यापन हेतु स्वैच्छिक फोटो (यदि आपके पास फोटो है तो अपलोड करें, इससे जल्दी जॉइनिंग होती है):
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Front Side }
                  <div className="p-3 rounded-xl bg-white border border-dashed border-slate-300 text-center space-y-2">
                    <p className="text-[11px] font-bold text-slate-700">आगे का भाग (Front Photo)</p>
                    {aadhaarFrontPreview ? (
                      <div className="relative space-y-2">
                        <div className="relative h-36 sm:h-44 w-full rounded-xl overflow-hidden bg-slate-900/5 border border-slate-200 flex items-center justify-center p-1">
                          <img
                            src={aadhaarFrontPreview}
                            alt="ID Front Preview"
                            className="h-full w-full object-contain rounded-lg"
                          />
                        </div>
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>फोटो सेलेक्टेड</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setAadhaarFrontPreview(null);
                              setAadhaarFrontFile(null);
                              setValue('aadhaarFront', null);
                            }}
                            className="text-[11px] font-bold text-red-600 hover:text-red-700 hover:underline cursor-pointer"
                          >
                            ✕ हटाएं (Remove)
                          </button>
                        </div>
                      </div>
                    ) : compressingFront ? (
                      <div className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200">
                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                        <span>फोटो तैयार हो रही है... (Processing)</span>
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

                  {/* Back Side }
                  <div className="p-3 rounded-xl bg-white border border-dashed border-slate-300 text-center space-y-2">
                    <p className="text-[11px] font-bold text-slate-700">पीछे का भाग (Back Photo)</p>
                    {aadhaarBackPreview ? (
                      <div className="relative space-y-2">
                        <div className="relative h-36 sm:h-44 w-full rounded-xl overflow-hidden bg-slate-900/5 border border-slate-200 flex items-center justify-center p-1">
                          <img
                            src={aadhaarBackPreview}
                            alt="ID Back Preview"
                            className="h-full w-full object-contain rounded-lg"
                          />
                        </div>
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>फोटो सेलेक्टेड</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setAadhaarBackPreview(null);
                              setAadhaarBackFile(null);
                              setValue('aadhaarBack', null);
                            }}
                            className="text-[11px] font-bold text-red-600 hover:text-red-700 hover:underline cursor-pointer"
                          >
                            ✕ हटाएं (Remove)
                          </button>
                        </div>
                      </div>
                    ) : compressingBack ? (
                      <div className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200">
                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                        <span>फोटो तैयार हो रही है... (Processing)</span>
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
              */}

              {/* Guard Friendly Consent Checkbox */}
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-emerald-50/70 border border-emerald-200/90 space-y-2">
                <label className="flex items-start gap-2.5 sm:gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={true}
                    {...register('consentGiven')}
                    className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 rounded-md border-emerald-300 focus:ring-emerald-500 cursor-pointer mt-0.5 shrink-0"
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
          <div className="flex items-stretch gap-2.5 sm:gap-4 pt-4 border-t border-slate-100">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-3.5 sm:px-6 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span>पीछे (Back)</span>
              </button>
            )}

            {currentStep < TOTAL_STEPS ? (
              <button
                type="button"
                key="step-btn-next"
                onClick={handleNextStep}
                className="flex-1 py-3 sm:py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <span>अगला कदम (Next Step)</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            ) : (
              <button
                type="button"
                key="step-btn-submit"
                disabled={isSubmitting || compressingFront || compressingBack}
                onClick={handleSubmit(onSubmit)}
                className="flex-1 py-3.5 sm:py-4 px-4 rounded-xl font-extrabold text-xs sm:text-base text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <span>फॉर्म जमा हो रहा है...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" />
                    <span className="whitespace-nowrap">आवेदन जमा करें</span>
                    <span className="hidden sm:inline text-xs opacity-90 font-medium">(Submit Application)</span>
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
