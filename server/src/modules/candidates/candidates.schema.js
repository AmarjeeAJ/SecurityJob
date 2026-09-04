import { z } from 'zod';
import { JOB_ROLES } from '../../utils/job-roles.js';
import { looksLikeFakeMobile } from '../../utils/phone-normalizer.js';

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

const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}\s.'\-()]{0,149}$/u;
const MOBILE_PATTERN = /^[6-9]\d{9}$/;

export const registerCandidateSchema = z
  .object({
    fullName: z.string().trim().regex(NAME_PATTERN, 'Please enter a valid full name'),
    mobileNumber: z.string().trim(),
    whatsappNumber: z.preprocess((val) => (val === undefined || val === null ? '' : String(val).trim()), z.string()),
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
    currentEmploymentStatus: z.preprocess(
      (val) => (val === '' || val === null || val === undefined ? undefined : val),
      z.enum(['employed', 'unemployed', 'student', 'other']).optional()
    ),
    joiningAvailability: z.preprocess(
      (val) => (val === '' || val === null || val === undefined ? undefined : val),
      z.enum(['immediate', 'within_15_days', 'within_30_days', 'more_than_30_days']).optional()
    ),
    expectedSalary: optionalIntFromForm,
    shiftPreference: z.string().trim().max(50).optional().or(z.literal('')),
    dutyHourPreference: z.preprocess(
      (val) => (val === '' || val === null || val === undefined ? undefined : val),
      z.enum(['8_hours', '12_hours', 'rotational', 'any']).optional()
    ),
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
    const mobileDigits = data.mobileNumber.replace(/\D/g, '').slice(-10);
    if (!MOBILE_PATTERN.test(mobileDigits)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['mobileNumber'], message: 'Please enter a valid 10-digit mobile number' });
    } else if (looksLikeFakeMobile(mobileDigits)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['mobileNumber'], message: 'This does not look like a real mobile number' });
    }

    const rawWhatsapp = data.whatsappNumber || data.mobileNumber;
    const whatsappDigits = (rawWhatsapp || '').replace(/\D/g, '').slice(-10);
    if (!MOBILE_PATTERN.test(whatsappDigits)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['whatsappNumber'], message: 'Please enter a valid 10-digit WhatsApp number' });
    } else if (looksLikeFakeMobile(whatsappDigits)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['whatsappNumber'], message: 'This does not look like a real mobile number' });
    }
    if (data.preferredRoles.includes('Other') && !data.otherRoleText) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['otherRoleText'], message: 'Please specify the preferred role' });
    }
    if (data.isExperienced) {
      if (!data.currentEmploymentStatus) {
        data.currentEmploymentStatus = 'unemployed';
      }
      if (!data.joiningAvailability) {
        data.joiningAvailability = 'immediate';
      }
      if (!data.dutyHourPreference) {
        data.dutyHourPreference = '12_hours';
      }
    }
    for (const role of data.preferredRoles) {
      if (!JOB_ROLES.includes(role)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['preferredRoles'], message: `Invalid preferred role: ${role}` });
        break;
      }
    }
  });

export const pageConfigSlugSchema = z.object({
  jobSlug: z.string().trim().min(1).max(100),
});
