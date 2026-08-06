import { z } from 'zod';
import normalizeIndianMobile from '../utils/phone.js';

const MOBILE_PATTERN = /^[6-9]\d{9}$/;
const NAME_PATTERN = /^[a-zA-Zऀ-ॿ][a-zA-Zऀ-ॿ .'-]{1,149}$/;

// Normalizes before validating so a number typed/pasted with a country code,
// leading zero or spaces (all common on a phone) still passes — matching the
// backend's own normalizer, so nothing that fails here would have passed
// server-side anyway, and nothing that passes here can fail server-side.
const mobileField = (label) =>
  z.preprocess(
    (val) => (typeof val === 'string' ? normalizeIndianMobile(val) : val),
    z.string().regex(MOBILE_PATTERN, `Please enter a valid 10-digit ${label} number`)
  );

export const candidateFormSchema = z
  .object({
    fullName: z.string().trim().regex(NAME_PATTERN, 'Please enter a valid full name'),
    mobileNumber: mobileField('mobile'),
    whatsappSameAsMobile: z.boolean().default(true),
    whatsappNumber: z.string().trim().optional().or(z.literal('')),
    age: z.coerce.number({ invalid_type_error: 'Age is required' }).int().min(18, 'Minimum age is 18').max(65, 'Maximum age is 65'),
    gender: z.enum(['male', 'female', 'other'], { errorMap: () => ({ message: 'Please select a gender' }) }),
    currentCity: z.string().trim().min(1, 'Current city is required'),
    currentArea: z.string().trim().min(1, 'Current area / locality is required'),
    state: z.string().trim().min(1, 'State is required'),
    highestQualification: z.string().trim().optional().or(z.literal('')),

    preferredRoles: z.array(z.string()).min(1, 'Please select at least one preferred job role'),
    otherRoleText: z.string().trim().optional().or(z.literal('')),
    preferredLocations: z.array(z.string()).min(1, 'Please select at least one preferred working city'),

    securityExperienceMonths: z.coerce.number().int().min(0).optional().default(0),
    currentEmploymentStatus: z.enum(['employed', 'unemployed', 'student', 'other'], {
      errorMap: () => ({ message: 'Please select your current employment status' }),
    }),
    joiningAvailability: z.enum(['immediate', 'within_15_days', 'within_30_days', 'more_than_30_days'], {
      errorMap: () => ({ message: 'Please select your joining availability' }),
    }),
    dutyHourPreference: z.enum(['8_hours', '12_hours', 'rotational', 'any'], {
      errorMap: () => ({ message: 'Please select your duty-hour preference' }),
    }),
    aadhaarAvailable: z.boolean().optional().default(false),

    consentGiven: z.boolean().refine((val) => val === true, 'You must accept the consent statement to continue'),
  })
  .superRefine((data, ctx) => {
    if (!data.whatsappSameAsMobile) {
      const normalized = normalizeIndianMobile(data.whatsappNumber);
      if (!MOBILE_PATTERN.test(normalized)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['whatsappNumber'], message: 'Please enter a valid 10-digit WhatsApp number' });
      }
    }
    if (data.preferredRoles.includes('Other') && !data.otherRoleText) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['otherRoleText'], message: 'Please specify the preferred role' });
    }
  });

export default candidateFormSchema;
