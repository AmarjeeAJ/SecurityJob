
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
  LocateFixed,
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

const TOTAL_STEPS = 2;
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
    // No input anywhere in the form collects real values for these --
    // sending fabricated defaults (12 months / unemployed / immediate /
    // any) made every "Experienced" candidate's data identical and
    // meaningless. Left empty until real inputs exist to collect them.
    securityExperienceMonths: 0,
    currentEmploymentStatus: undefined,
    joiningAvailability: undefined,
    dutyHourPreference: undefined,
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
  const step2EnteredAtRef = useRef(0);

  const [isRoleCollapsed, setIsRoleCollapsed] = useState(false);
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
      if (step) setCurrentStep(Math.min(step, TOTAL_STEPS));
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
  // Real area/colony/ward options for Duty Landmark / Area, same
  // village/ward data source used for Permanent Address's Village field —
  // populated once a Duty Tehsil is selected (see its onSelectOption below).
  const [preferredAreas, setPreferredAreas] = useState([]);
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
    if (currentStep === 2) {
      step2EnteredAtRef.current = Date.now();
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
      // A 10s timeout was too short for a real satellite GPS fix (a "cold
      // start" fix commonly takes 15-30s indoors or on first request), so
      // the browser was silently falling back to a coarse WiFi/cell-tower
      // position — accurate to hundreds of meters to a few km — instead of
      // waiting for GPS. 30s gives it a real chance; maximumAge:0 forces a
      // fresh reading instead of reusing an old cached fix.
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
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
    1: [
      'fullName',
      'mobileNumber',
      'whatsappNumber',
      'age',
      'gender',
      'highestQualification',
    ],
    2: [
      'preferredRoles',
      'isExperienced',
      'currentArea',
      'preferredState',
      'preferredDistrict',
      'preferredSubdivision',
      'consentGiven',
    ],
  };

  const handleNextStep = async () => {
    if (currentStep === 1 && duplicateMobileInfo) {
      setSubmitError(`यह मोबाइल नंबर पहले से पंजीकृत है (${duplicateMobileInfo.fullName} — ${duplicateMobileInfo.candidateCode})। कृपया दोबारा फॉर्म न भरें। (This mobile number is already registered. Please do not fill the form again.)`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
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
    // STRICT GUARD 1: Prevent submission if not on final step (Step 2)
    if (currentStep !== 2) {
      await handleNextStep();
      return;
    }

    // STRICT GUARD 2: Prevent ghost clicks / touch event transfer from Step 1 Next button
    if (Date.now() - step2EnteredAtRef.current < 400) {
      return;
    }

    const curCity = watch('permanentDistrict') || watch('preferredDistrict') || 'Jaipur';
    const stayAddr = (watch('currentStayAddress') || data.currentStayAddress || '').trim();
    const geoAddr = watch('geoAddress') || data.geoAddress || '';

    if (!stayAddr && !geoAddr) {
      setSubmitError('कृपया वर्तमान पता भरें या "📍 अभी की लोकेशन लें" बटन दबाएं। (Please fill your current address or use the auto-fill location button.)');
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }
    setSubmitError('');

    const combinedArea = stayAddr || geoAddr || `${curCity} Main Area`;
    setValue('currentArea', combinedArea);
    data.currentArea = combinedArea;

    const prefDist = watch('preferredDistrict') || data.preferredDistrict || curCity;
    setValue('preferredLocations', [prefDist]);
    data.preferredLocations = [prefDist];

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
        let jumpToStep = 2;
        const errMessages = [];

        Object.entries(backendErrors).forEach(([field, msg]) => {
          setError(field, { type: 'server', message: msg });
          errMessages.push(`${msg}`);

          if (['fullName', 'mobileNumber', 'whatsappNumber', 'age', 'gender', 'highestQualification'].includes(field)) {
            jumpToStep = Math.min(jumpToStep, 1);
          } else {
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
    { num: 2, title: 'जॉब, अनुभव व लोकेशन', sub: 'Job, Experience & Location' },
  ];

  return (
    <div className="w-full space-y-5">
      {/* Guard Friendly Trust Header - Clean, Light & Reassuring */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-50 border border-blue-200/80 text-blue-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight leading-snug">
                सिक्योरिटी जॉब आवेदन फॉर्म
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                100% फ्री
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="font-semibold text-slate-700">सीधी भर्ती (Zero Agency Fees)</span>
              <span className="text-slate-300 hidden xs:inline">&bull;</span>
              <span>सरकारी PF व ESIC सुविधा</span>
              <span className="text-slate-300 hidden xs:inline">&bull;</span>
              <span className="text-blue-600 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3 inline" /> 2 मिनट में भरें
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-start sm:justify-end shrink-0 pl-13 sm:pl-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            ₹0 कोई फीस नहीं
          </span>
        </div>
      </div>

      <Card className="p-4 sm:p-7 shadow-xs border-slate-200/90 bg-white">
        {/* Step Indicator Progress Bar - Clean 2-Step Design */}
        <div className="mb-6 sm:mb-7">
          {/* Top Status Meta Row */}
          <div className="flex items-center justify-between gap-2 mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-extrabold text-xs">
                {currentStep}
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight">
                {stepsMeta[currentStep - 1]?.title}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-[11px] font-bold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>{currentStep === 1 ? '50% (स्टेप 1/2)' : '100% (अंतिम चरण)'}</span>
            </div>
          </div>

          {/* Interactive Steps Rail with Connecting Lines */}
          <div className="relative flex items-center justify-between mb-2.5 px-6 sm:px-14">
            {/* Background Rail Line */}
            <div className="absolute left-10 right-10 sm:left-20 sm:right-20 top-1/2 -translate-y-1/2 h-1 bg-slate-200 rounded-full z-0" />
            
            {/* Animated Active Rail Fill */}
            <motion.div
              className="absolute left-10 sm:left-20 top-1/2 -translate-y-1/2 h-1 bg-blue-600 rounded-full z-0 origin-left"
              initial={false}
              animate={{
                width: currentStep === 1 ? '0%' : 'calc(100% - 5rem)'
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
                      scale: isCurrent ? 1.05 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center transition-all ${
                      isPassed
                        ? 'bg-blue-600 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-blue-600 text-white shadow-sm ring-4 ring-blue-100'
                        : 'bg-white text-slate-400 border-2 border-slate-200'
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
          <div className="grid grid-cols-2 gap-2 text-center">
            {stepsMeta.map((s) => {
              const isPassed = currentStep > s.num;
              const isCurrent = currentStep === s.num;
              return (
                <div key={s.num} className="px-1">
                  <p
                    className={`text-xs font-bold leading-tight transition-colors ${
                      isCurrent || isPassed
                        ? 'text-blue-700'
                        : 'text-slate-500'
                    }`}
                  >
                    {s.title}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium hidden sm:block mt-0.5">
                    {s.sub}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {submitError && (
          <div className="mb-6">
            <ErrorBanner message={submitError} onDismiss={() => setSubmitError('')} />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleFormKeyDown} className="space-y-6">
          {/* ========================================================================= */}
          {/* STEP 1: CANDIDATE PROFILE & JOB SELECTION (उम्मीदवार व जॉब चयन) */}
          {/* ========================================================================= */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              <div className="border-b border-slate-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">स्टेप 1 ऑफ 2</span>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
                  उम्मीदवार विवरण (Candidate Profile)
                </h3>
              </div>

              {/* Personal Details Section */}
              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                    आपका पूरा नाम (Full Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. रमेश कुमार शर्मा"
                    {...register('fullName')}
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-medium text-slate-900 focus:outline-none transition-all ${
                      errors.fullName ? 'border-red-500 bg-red-50/50' : 'border-slate-300 bg-slate-50/40 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
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
                      className={`w-full pl-16 pr-4 py-3 rounded-xl border text-sm font-bold text-slate-900 tracking-wider focus:outline-none transition-all ${
                        errors.mobileNumber ? 'border-red-500 bg-red-50/50' : 'border-slate-300 bg-slate-50/40 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
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
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('whatsappSameAsMobile')}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">
                      यही मेरा WhatsApp नंबर भी है (Same on WhatsApp)
                    </span>
                  </label>

                  {!watchWhatsappSame && (
                    <div className="pt-1.5">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                        className={`w-full px-4 py-2.5 sm:py-3 rounded-xl border text-sm font-bold text-slate-900 focus:outline-none transition-all ${
                          errors.age ? 'border-red-500 bg-red-50/50' : 'border-slate-300 bg-slate-50/40 focus:bg-white focus:border-blue-600'
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
                        className={`py-2.5 sm:py-3 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                          watchGender === 'male'
                            ? 'bg-blue-50 border-blue-600 text-blue-700 ring-2 ring-blue-200'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>पुरुष (Male)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setValue('gender', 'female', { shouldValidate: true })}
                        className={`py-2.5 sm:py-3 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                          watchGender === 'female'
                            ? 'bg-blue-50 border-blue-600 text-blue-700 ring-2 ring-blue-200'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>महिला (Female)</span>
                      </button>
                    </div>
                    {errors.gender && (
                      <p className="text-xs text-red-600 mt-1">{errors.gender.message}</p>
                    )}
                  </div>
                </div>

                {/* Highest Qualification */}
                <div className="pt-4 border-t border-slate-100">
                  <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                    उच्चतम योग्यता / पढ़ाई (Highest Qualification)
                  </label>
                  <select
                    {...register('highestQualification')}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 cursor-pointer"
                  >
                    <option value="10th Pass">10वीं पास (Secondary)</option>
                    <option value="Non-Matric (8th Pass)">8वीं पास / नॉन-मैट्रिक</option>
                    <option value="12th Pass">12वीं पास (Sr. Secondary)</option>
                    <option value="Graduate">ग्रेजुएट / स्नातक</option>
                    <option value="Ex-Servicemen (Defence)">भूतपूर्व सैनिक (Ex-Servicemen / Army)</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: JOB ROLE, EXPERIENCE, LOCATION & SUBMISSION */}
          {/* ========================================================================= */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              <div className="border-b border-slate-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">स्टेप 2 ऑफ 2 (अंतिम चरण)</span>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
                  जॉब रोल, अनुभव व लोकेशन (Job Role, Experience & Location)
                </h3>
              </div>

              {/* 1. JOB ROLE SELECTION */}
              {(() => {
                const selectedRoleObj = roleOptions.find((r) => watchRoles.includes(r.value)) || roleOptions[0];
                const SelectedIcon = selectedRoleObj?.icon || Briefcase;
                return (
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/80 flex items-center justify-center shrink-0">
                          <Briefcase className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                            1. जॉब रोल चुनें (Select Job Role) <span className="text-red-500">*</span>
                          </h4>
                          <p className="text-xs text-slate-500 font-medium">
                            {isRoleCollapsed ? 'आपका चुना हुआ पद (Selected Role)' : 'आप किस पद पर काम करना चाहते हैं?'}
                          </p>
                        </div>
                      </div>

                      {isRoleCollapsed && (
                        <button
                          type="button"
                          onClick={() => setIsRoleCollapsed(false)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <span>बदलें (Change)</span>
                        </button>
                      )}
                    </div>

                    <AnimatePresence mode="wait">
                      {isRoleCollapsed && selectedRoleObj ? (
                        <motion.div
                          key="selected-role-card"
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.22, ease: "easeOut" }}
                          onClick={() => setIsRoleCollapsed(false)}
                          className="p-3.5 sm:p-4 rounded-xl border-2 border-blue-600 bg-blue-50/70 ring-2 ring-blue-100 flex items-center justify-between gap-3 shadow-2xs cursor-pointer hover:bg-blue-50 transition-all"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`p-2.5 rounded-xl shrink-0 ${selectedRoleObj.color}`}>
                              <SelectedIcon className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                                  {selectedRoleObj.label}
                                </span>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold bg-blue-600 text-white shrink-0">
                                  <Check className="w-3 h-3 stroke-[3]" /> चुना गया
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                अन्य जॉब रोल देखने या बदलने के लिए यहाँ क्लिक करें
                              </p>
                            </div>
                          </div>

                          <span className="text-xs font-bold text-blue-700 bg-white px-2.5 py-1.5 rounded-lg border border-blue-200 shrink-0">
                            बदलें
                          </span>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="all-roles-grid"
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.22, ease: "easeOut" }}
                          className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
                        >
                          {roleOptions.map((opt) => {
                            const isSelected = watchRoles.includes(opt.value);
                            const IconComponent = opt.icon;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                  setValue('preferredRoles', [opt.value], { shouldValidate: true });
                                  setIsRoleCollapsed(true);
                                }}
                                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-blue-50/80 border-blue-600 text-blue-950 ring-2 ring-blue-200 shadow-2xs'
                                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className={`p-2 rounded-lg shrink-0 ${opt.color}`}>
                                    <IconComponent className="w-4 h-4" />
                                  </div>
                                  <span className="text-xs sm:text-sm font-bold text-slate-900 leading-snug truncate">
                                    {opt.label}
                                  </span>
                                </div>
                                {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 ml-2" />}
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {errors.preferredRoles && (
                      <p className="text-xs font-semibold text-red-600 mt-1">{errors.preferredRoles.message}</p>
                    )}
                  </div>
                );
              })()}

              {/* 2. WORK EXPERIENCE */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/80 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                      2. कार्य अनुभव (Work Experience) <span className="text-red-500">*</span>
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      क्या आपको पहले सिक्योरिटी का अनुभव है?
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setValue('isExperienced', false, { shouldValidate: true });
                    }}
                    className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center border transition-all cursor-pointer ${
                      !watchExperienced
                        ? 'bg-blue-50 border-blue-600 text-blue-700 ring-2 ring-blue-200 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>नया गार्ड / फ्रेशर (Fresher)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setValue('isExperienced', true, { shouldValidate: true });
                    }}
                    className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center border transition-all cursor-pointer ${
                      watchExperienced
                        ? 'bg-blue-50 border-blue-600 text-blue-700 ring-2 ring-blue-200 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>अनुभवी गार्ड (Experienced)</span>
                  </button>
                </div>
              </div>

              {/* 3. PREFERRED JOB LOCATION (जहाँ आप जॉब करना चाहते हैं वहाँ का विवरण भरें) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/80 flex items-center justify-center shrink-0">
                    <MapPin className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                      3. जहाँ आप जॉब करना चाहते हैं वहाँ का विवरण भरें (Job Location) <span className="text-red-500">*</span>
                    </h4>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">
                      जिस जिले या जगह पर आप नौकरी करना चाहते हैं (Where you want to do the job)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                  {/* Job State */}
                  <div>
                    <SearchableLocationInput
                      id="pref-state"
                      label="राज्य (State जहां जॉब चाहिए)"
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
                      placeholder="राज्य चुनें (उदा. Rajasthan)"
                      required
                      error={errors.preferredState?.message}
                    />
                  </div>

                  {/* Job District */}
                  <div>
                    <SearchableLocationInput
                      id="pref-city"
                      label="जिला / शहर (District जहां जॉब चाहिए)"
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
                      placeholder="जिला चुनें (उदा. जयपुर, जोधपुर, कोटा)"
                      required
                      error={errors.preferredDistrict?.message}
                      isLoading={isLoadingPrefDistricts}
                    />
                  </div>

                  {/* Job Subdivision / Tehsil */}
                  <div>
                    <SearchableLocationInput
                      id="pref-subdivision"
                      label="तहसील / एरिया (Tehsil)"
                      value={watchPreferredSubdivision}
                      onChange={(val) => setValue('preferredSubdivision', val)}
                      onSelectOption={(val) => {
                        setValue('preferredSubdivision', val);
                        setValue('preferredBlock', '');
                        setValue('preferredTehsil', '');
                        setValue('preferredPincode', '');
                        setValue('preferredAddressLine', '');

                        const localAreas = getVillagesForTehsil(watchPreferredState, watchPreferredDistrict, val);
                        if (localAreas && localAreas.length > 0) {
                          setPreferredAreas(localAreas);
                        }
                        fetchVillagesForTehsil(watchPreferredState, watchPreferredDistrict, val).then((areas) => {
                          if (areas && areas.length > 0) {
                            setPreferredAreas((prev) => {
                              const merged = [...new Set([...(prev || []), ...areas])];
                              return merged.length === prev.length ? prev : merged;
                            });
                          }
                        });

                        resolvePincode(watchPreferredState, watchPreferredDistrict, val, '').then((pin) => {
                          if (pin) setValue('preferredPincode', pin);
                        });
                      }}
                      options={preferredSubdivisions}
                      placeholder={preferredSubdivisions.length > 0 ? "तहसील चुनें या टाइप करें" : "तहसील का नाम लिखें"}
                      required
                      error={errors.preferredSubdivision?.message}
                      isLoading={isLoadingPrefSubdivisions}
                    />
                  </div>

                  {/* Job Pincode */}
                  <div>
                    <div className="flex items-center justify-between gap-1.5 mb-1.5">
                      <label htmlFor="pref-pincode" className="block text-[11px] sm:text-xs font-semibold text-slate-800">
                        जॉब लोकेशन पिनकोड (PIN Code)
                      </label>
                      {watchPreferredPincode && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <Zap className="w-2.5 h-2.5 text-emerald-600 fill-emerald-500" /> ऑटो-फ़िल
                        </span>
                      )}
                    </div>
                    <input
                      id="pref-pincode"
                      type="text"
                      maxLength={6}
                      placeholder="उदा. 302001"
                      value={watchPreferredPincode}
                      onChange={(e) => setValue('preferredPincode', e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/40 hover:bg-white focus:bg-white text-xs sm:text-sm font-semibold text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all tracking-wider placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400"
                    />
                  </div>

                  {/* Job Landmark / Area */}
                  <div className="md:col-span-2">
                    <SearchableLocationInput
                      id="pref-landmark"
                      label="नजदीकी क्षेत्र / लैंडमार्क (Nearby Area / Landmark)"
                      value={watchPreferredAddressLine}
                      onChange={(val) => setValue('preferredAddressLine', val)}
                      onSelectOption={(val) => setValue('preferredAddressLine', val)}
                      options={preferredAreas}
                      placeholder={preferredAreas.length > 0 ? "क्षेत्र या लैंडमार्क चुनें / लिखें" : "जहाँ नौकरी चाहिए (उदा. इंडस्ट्रियल एरिया, मुख्य चौराहा, मॉल, बैंक)"}
                    />
                  </div>

                  {/* Job Placement Scope Note */}
                  <div className="md:col-span-2">
                    <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/70 text-blue-900 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>आपकी चुनी हुई जगह या जिले के नजदीकी इलाके में ही जॉब दी जाएगी।</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. CURRENT ADDRESS (आप अभी कहाँ रहते हैं?) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/80 flex items-center justify-center shrink-0">
                    <Home className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                      4. आप अभी कहाँ रहते हैं? (Current Address)
                    </h4>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">
                      अभी आप जिस जगह या शहर में रह रहे हैं (Where you currently live)
                    </p>
                  </div>
                </div>

                <div className="space-y-3.5">
                  {/* GPS Auto-Fill Button */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-blue-50/40 border border-blue-200/80">
                    <div>
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <LocateFixed className="w-4 h-4 text-blue-600" />
                        <span>मोबाइल से अपना पता भरें (Auto-Fill Location)</span>
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        बटन दबाते ही आपकी अभी की लोकेशन अपने-आप आ जाएगी
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleCaptureLocation}
                      disabled={isCapturingLocation}
                      className="w-full sm:w-auto px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 transition-all shrink-0"
                    >
                      {isCapturingLocation ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                          <span>लोकेशन खोजी जा रही है...</span>
                        </>
                      ) : (
                        <>
                          <LocateFixed className="w-3.5 h-3.5 shrink-0" />
                          <span>अभी की लोकेशन भरें</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Captured GPS message if any */}
                  {locationStatus && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-xl border text-xs ${
                        locationStatus.success === true
                          ? 'bg-blue-50/80 border-blue-200 text-blue-900'
                          : locationStatus.success === false
                          ? 'bg-amber-50 border-amber-200 text-amber-900'
                          : 'bg-blue-50 border-blue-200 text-blue-900'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {locationStatus.success === true ? (
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        )}
                        <div className="min-w-0 flex-1">
                          <span className="font-bold block">{locationStatus.message}</span>
                          {locationStatus.address && (
                            <p className="mt-1 text-slate-800 font-medium">
                              {locationStatus.address}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Manual / Verified Current Address */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                      रहने का पता (Current Address)
                    </label>
                    <input
                      type="text"
                      placeholder="उदा. कमरा/मकान नं., गली, कॉलोनी या एरिया (या ऊपर बटन से भरें)"
                      value={watchCurrentStayAddress}
                      onChange={(e) => {
                        const val = e.target.value;
                        setValue('currentStayAddress', val);
                        setValue('currentArea', val.trim() || 'City Area');
                        if (currentSameAsPermanent) setCurrentSameAsPermanent(false);
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-semibold text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all placeholder:font-normal placeholder:text-slate-400"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      यदि आप किराए पर या किसी अन्य जगह पर रहते हैं, तो यहाँ का पता लिखें।
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. CONSENT CHECKBOX */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-blue-50/50 border border-blue-200/80 space-y-2">
                <label className="flex items-start gap-2.5 sm:gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={true}
                    {...register('consentGiven')}
                    className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 rounded border-blue-300 focus:ring-blue-500 cursor-pointer mt-0.5 shrink-0"
                  />
                  <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                    <span className="font-bold text-blue-950 block mb-0.5">सहमति घोषणा (Candidate Consent):</span>
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
                className="px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
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
                className="flex-1 py-3.5 px-4 rounded-xl font-bold text-sm sm:text-base text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <span>आगे बढ़ें (Next)</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            ) : (
              <button
                type="button"
                key="step-btn-submit"
                disabled={isSubmitting || compressingFront || compressingBack}
                onClick={handleSubmit(onSubmit)}
                className="flex-1 py-3.5 sm:py-4 px-4 rounded-xl font-extrabold text-sm sm:text-base text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-[0.99]"
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
