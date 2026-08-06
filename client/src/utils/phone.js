/**
 * Normalizes an Indian mobile number to bare 10 digits, stripping spaces,
 * dashes, parentheses and a leading +91 / 91 / 0 — mirrors the backend's
 * phone-normalizer.js so a number that passes here is guaranteed to pass
 * server-side too. Without this, typing a number the natural way (with a
 * country code or a space) failed frontend validation even though the
 * backend would have accepted it once normalized.
 */
export function normalizeIndianMobile(rawValue) {
  if (!rawValue) return '';

  let digits = String(rawValue).replace(/\D/g, '');

  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  return digits;
}

export default normalizeIndianMobile;
