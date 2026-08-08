import { z } from 'zod';
import normalizeIndianMobile, { looksLikeFakeMobile } from '../utils/phone.js';

const MOBILE_PATTERN = /^[6-9]\d{9}$/;
const NAME_PATTERN = /^[a-zA-Zऀ-ॿ][a-zA-Zऀ-ॿ .'-]{1,149}$/;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// react-hook-form gives file inputs a FileList; validated as optional since
// both Aadhaar sides are optional uploads.
const imageFileField = () =>
  z
    .any()
    .optional()
    .refine((files) => !files || files.length === 0 || files[0].size <= MAX_IMAGE_SIZE, 'Image must be 5 MB or smaller')
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files[0].type),
      'Please upload a JPG, PNG or WEBP image'
    );

// Normalizes before validating so a number typed/pasted with a country code,
// leading zero or spaces (all common on a phone) still passes — matching the
// backend's own normalizer, so nothing that fails here would have passed
// server-side anyway, and nothing that passes here can fail server-side.
const mobileField = (label) =>
  z.preprocess(
    (val) => (typeof val === 'string' ? normalizeIndianMobile(val) : val),
    z
      .string()
      .regex(MOBILE_PATTERN, `Please enter a valid 10-digit ${label} number`)
      .refine((digits) => !looksLikeFakeMobile(digits), 'This does not look like a real mobile number')
  );

export const candidateFormSchema = z
  .object({
    fullName: z.string().trim().regex(NAME_PATTERN, 'Please enter a valid full name'),
    mobileNumber: mobileField('mobile'),
    whatsappSameAsMobile: z.boolean().default(true),
    whatsappNumber: z.string().trim().optional().or(z.literal('')),
    age: z.coerce.number({ invalid_type_error: 'Age is required' }).int().min(18, 'Minimum age is 18').max(65, 'Maximum age is 65'),
    gender: z.enum(['male', 'female', 'other'], { errorMap: () => ({ message: 'Please select a gender' }) }),
    currentCity: z
      .string({ required_error: 'Current city is required' })
      .trim()
      .min(1, 'Current city is required'),
    currentArea: z
      .string({ required_error: 'Current area / locality is required' })
      .trim()
      .min(1, 'Current area / locality is required'),
    state: z.string({ required_error: 'State is required' }).trim().min(1, 'State is required'),
    highestQualification: z.string().trim().optional().or(z.literal('')),

    preferredRoles: z.array(z.string()).min(1, 'Please select at least one preferred job role'),
    otherRoleText: z.string().trim().optional().or(z.literal('')),
    preferredLocations: z.array(z.string()).min(1, 'Please select at least one preferred working city'),

    isExperienced: z.boolean().optional().default(false),
    securityExperienceMonths: z.coerce.number().int().min(0).optional().default(0),
    currentEmploymentStatus: z.enum(['employed', 'unemployed', 'student', 'other']).optional().or(z.literal('')),
    joiningAvailability: z
      .enum(['immediate', 'within_15_days', 'within_30_days', 'more_than_30_days'])
      .optional()
      .or(z.literal('')),
    dutyHourPreference: z.enum(['8_hours', '12_hours', 'rotational', 'any']).optional().or(z.literal('')),
    aadhaarFront: imageFileField(),
    aadhaarBack: imageFileField(),

    consentGiven: z.boolean().refine((val) => val === true, 'You must accept the consent statement to continue'),
  })
  .superRefine((data, ctx) => {
    if (!data.whatsappSameAsMobile) {
      const normalized = normalizeIndianMobile(data.whatsappNumber);
      if (!MOBILE_PATTERN.test(normalized)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['whatsappNumber'], message: 'Please enter a valid 10-digit WhatsApp number' });
      } else if (looksLikeFakeMobile(normalized)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['whatsappNumber'], message: 'This does not look like a real mobile number' });
      }
    }
    if (data.preferredRoles.includes('Other') && !data.otherRoleText) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['otherRoleText'], message: 'Please specify the preferred role' });
    }
    if (data.isExperienced) {
      if (!data.currentEmploymentStatus) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['currentEmploymentStatus'], message: 'Please select your current employment status' });
      }
      if (!data.joiningAvailability) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['joiningAvailability'], message: 'Please select your joining availability' });
      }
      if (!data.dutyHourPreference) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['dutyHourPreference'], message: 'Please select your duty-hour preference' });
      }
    }
  });

export default candidateFormSchema;
