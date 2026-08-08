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

/**
 * Flags 10-digit numbers that are structurally valid but obviously typed just
 * to get past the field — 9999999999, 9898989898, 9977886633, 9876543210.
 *
 * Deliberately narrow: this funnel pays per click, so a wrongly rejected real
 * candidate costs more than an occasional junk number getting through. Each
 * rule only matches shapes a genuinely allocated number effectively never
 * takes. Mirrors the client check of the same name in client/src/utils/phone.js.
 */
export function looksLikeFakeMobile(digits) {
  if (!/^\d{10}$/.test(digits)) return false; // format rules handle these

  // 9999999999, 9898989898 — one or two digits repeated throughout
  if (new Set(digits).size <= 2) return true;

  // 9977886633 — every adjacent pair doubled
  let allPairsDoubled = true;
  for (let i = 0; i < 10; i += 2) {
    if (digits[i] !== digits[i + 1]) {
      allPairsDoubled = false;
      break;
    }
  }
  if (allPairsDoubled) return true;

  // 9978787878 — a two-digit block repeated three times or more anywhere in
  // the number (…787878…). Requires the two digits to differ, since a repeated
  // single digit is already covered above.
  for (let i = 0; i + 5 < 10; i += 1) {
    const [a, b] = [digits[i], digits[i + 1]];
    if (a === b) continue;
    if (digits[i + 2] === a && digits[i + 3] === b && digits[i + 4] === a && digits[i + 5] === b) {
      return true;
    }
  }

  // 9876543210 / 6789012345 — a straight run up or down, stepped modulo 10 so
  // a run that wraps past 9 to 0 is still caught.
  let ascending = true;
  let descending = true;
  for (let i = 1; i < 10; i += 1) {
    const step = (Number(digits[i]) - Number(digits[i - 1]) + 10) % 10;
    if (step !== 1) ascending = false;
    if (step !== 9) descending = false;
  }
  return ascending || descending;
}

export default normalizeIndianMobile;
