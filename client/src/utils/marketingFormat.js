// Consistent formatting for Marketing & Analysis. null/undefined always
// renders as "—" (unavailable), never as 0/$0.00/NaN -- the backend already
// only sends null when data genuinely wasn't synced, so this layer just
// has to respect that rather than re-deciding it.

export function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return Number(value).toLocaleString('en-IN');
}

export function formatCurrency(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return `₹${Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatPercent(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return `${Number(value).toFixed(2)}%`;
}

export function formatChangePct(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  const sign = value > 0 ? '+' : '';
  return `${sign}${Number(value).toFixed(1)}%`;
}

/** Client-side safe divide, for display-only ratios (funnel step %) that
 * never come from the API directly. Mirrors the server's safeDivide rules:
 * null in, null out; never NaN/Infinity. */
export function safeDividePct(numerator, denominator) {
  if (numerator === null || numerator === undefined || denominator === null || denominator === undefined) return null;
  const num = Number(numerator);
  const den = Number(denominator);
  if (!Number.isFinite(num) || !Number.isFinite(den) || den === 0) return null;
  const result = (num / den) * 100;
  return Number.isFinite(result) ? Number(result.toFixed(2)) : null;
}
