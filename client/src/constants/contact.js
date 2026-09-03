/**
 * Central contact and WhatsApp configuration for SecurityJob.in (Avijit Enterprises)
 */

// Hardcoded, not read from VITE_WHATSAPP_NUMBER: a stale value in a deployed
// .env would silently win over this and send candidates to the wrong number
// with no visible sign anything was wrong.
export const OFFICIAL_PHONE = '+91 99299 92886';
export const OFFICIAL_PHONE_DIGITS = '919929992886';
export const OFFICIAL_WHATSAPP_NUMBER = '919929992886';
export const OFFICIAL_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'hr@securityjob.in';
export const OFFICIAL_ADDRESS = '159, Anand Nagar, Sirsi Road, Vaishali Nagar, Jaipur, Rajasthan – 302021';
