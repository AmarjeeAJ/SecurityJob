/**
 * Divides numerator/denominator, returning null (never NaN/Infinity) when
 * the result isn't meaningfully computable -- callers render null as "-".
 */
export function safeDivide(numerator, denominator, { multiplier = 1, decimals = 2 } = {}) {
  // Number(null) is 0 and Number.isFinite(0) is true, so a null/undefined
  // input (meaning "unknown", not "zero") must be rejected explicitly here
  // -- otherwise it would silently compute as if it were a real zero.
  if (numerator === null || numerator === undefined || denominator === null || denominator === undefined) {
    return null;
  }
  const num = Number(numerator);
  const den = Number(denominator);
  if (!Number.isFinite(num) || !Number.isFinite(den) || den === 0) return null;
  const result = (num / den) * multiplier;
  if (!Number.isFinite(result)) return null;
  return Number(result.toFixed(decimals));
}

export default safeDivide;
