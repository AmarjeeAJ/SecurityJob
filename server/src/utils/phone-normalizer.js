/**
 * Normalizes an Indian mobile number to a bare 10-digit string.
 * Strips spaces, dashes, parentheses and a leading +91 / 91 / 0 prefix.
 * Returns null if the result is not a valid 10-digit Indian mobile number.
 */
export function normalizeIndianMobile(rawValue) {
  if (!rawValue) return null;

  let digits = String(rawValue).replace(/[^\d]/g, '');

  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  if (digits.length !== 10 || !/^[6-9]\d{9}$/.test(digits)) {
    return null;
  }

  return digits;
}

export default normalizeIndianMobile;
