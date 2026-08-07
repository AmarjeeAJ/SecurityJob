import { z } from 'zod';
import { JOB_ROLES } from '../../utils/job-roles.js';

const boolFromForm = z.preprocess((val) => {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'string') return ['true', '1', 'on', 'yes'].includes(val.toLowerCase());
  return false;
}, z.boolean());

const optionalIntFromForm = z.preprocess((val) => {
  if (val === '' || val === undefined || val === null) return undefined;
  const num = Number(val);
  return Number.isFinite(num) ? num : val;
}, z.number().int().nonnegative().optional());

const jsonArrayFromForm = z.preprocess((val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string' && val.trim() !== '') {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [val];
    } catch {
      return [val];
    }
  }
  return [];
}, z.array(z.string().trim().min(1)));

const NAME_PATTERN = /^[a-zA-Zऀ-ॿ][a-zA-Zऀ-ॿ .'-]{1,149}$/;
const MOBILE_PATTERN = /^[6-9]\d{9}$/;

export const registerCandidateSchema = z
  .object({
    fullName: z.string().trim().regex(NAME_PATTERN, 'Please enter a valid full name'),
    mobileNumber: z.string().trim(),
    whatsappNumber: z.string().trim(),
    alternateMobileNumber: z.string().trim().optional().or(z.literal('')),
    email: z.string().trim().email('Please enter a valid email address').optional().or(z.literal('')),
    dateOfBirth: z.string().trim().optional().or(z.literal('')),
    age: z.preprocess((val) => Number(val), z.number().int().min(18, 'Minimum age is 18').max(65, 'Maximum age is 65')),
    gender: z.enum(['male', 'female', 'other'], { errorMap: () => ({ message: 'Please select a gender' }) }),
    currentCity: z.string().trim().min(1, 'Current city is required').max(100),
    currentArea: z.string().trim().min(1, 'Current area / locality is required').max(150),
    state: z.string().trim().min(1, 'State is required').max(100),
    highestQualification: z.string().trim().max(100).optional().or(z.literal('')),
    preferredRoles: jsonArrayFromForm.refine((arr) => arr.length > 0, 'Please select at least one preferred job role'),
    otherRoleText: z.string().trim().max(150).optional().or(z.literal('')),
    preferredLocations: jsonArrayFromForm.refine((arr) => arr.length > 0, 'Please select at least one preferred working city'),
    totalExperienceMonths: optionalIntFromForm.default(0),
    securityExperienceMonths: optionalIntFromForm.default(0),
    previousCompany: z.string().trim().max(150).optional().or(z.literal('')),
    isExperienced: boolFromForm.optional().default(false),
    currentEmploymentStatus: z.enum(['employed', 'unemployed', 'student', 'other']).optional(),
    joiningAvailability: z.enum(['immediate', 'within_15_days', 'within_30_days', 'more_than_30_days']).optional(),
    expectedSalary: optionalIntFromForm,
    shiftPreference: z.string().trim().max(50).optional().or(z.literal('')),
    dutyHourPreference: z.enum(['8_hours', '12_hours', 'rotational', 'any']).optional(),
    heightCm: optionalIntFromForm,
    languages: z.string().trim().max(255).optional().or(z.literal('')),
    exServiceman: boolFromForm.optional().default(false),
    aadhaarAvailable: boolFromForm.optional().default(false),
    policeVerificationAvailable: boolFromForm.optional().default(false),
    trainingCertificateAvailable: boolFromForm.optional().default(false),
    drivingLicenceAvailable: boolFromForm.optional().default(false),
    additionalMessage: z.string().trim().max(1000).optional().or(z.literal('')),
    consentGiven: boolFromForm.refine((val) => val === true, 'You must accept the consent statement to continue'),

    jobSlug: z.string().trim().max(100).optional().or(z.literal('')),
    utmSource: z.string().trim().max(150).optional().or(z.literal('')),
    utmMedium: z.string().trim().max(150).optional().or(z.literal('')),
    utmCampaign: z.string().trim().max(150).optional().or(z.literal('')),
    utmContent: z.string().trim().max(150).optional().or(z.literal('')),
    utmTerm: z.string().trim().max(150).optional().or(z.literal('')),
    fbclid: z.string().trim().max(255).optional().or(z.literal('')),
    fbp: z.string().trim().max(255).optional().or(z.literal('')),
    fbc: z.string().trim().max(255).optional().or(z.literal('')),
    referrerUrl: z.string().trim().max(2000).optional().or(z.literal('')),
    landingPageUrl: z.string().trim().max(2000).optional().or(z.literal('')),
    deviceType: z.string().trim().max(30).optional().or(z.literal('')),
    browser: z.string().trim().max(100).optional().or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    if (!MOBILE_PATTERN.test(data.mobileNumber.replace(/\D/g, '').slice(-10))) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['mobileNumber'], message: 'Please enter a valid 10-digit mobile number' });
    }
    if (!MOBILE_PATTERN.test(data.whatsappNumber.replace(/\D/g, '').slice(-10))) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['whatsappNumber'], message: 'Please enter a valid 10-digit WhatsApp number' });
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
    for (const role of data.preferredRoles) {
      if (!JOB_ROLES.includes(role)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['preferredRoles'], message: 'Invalid preferred role selected' });
        break;
      }
    }
  });

export const pageConfigSlugSchema = z.object({
  jobSlug: z.string().trim().min(1).max(100),
});
