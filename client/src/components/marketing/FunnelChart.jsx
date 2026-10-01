import { formatNumber, formatPercent, safeDividePct } from '../../utils/marketingFormat.js';

export default function FunnelChart({ funnel, metaConfigured, registrationsLabel = 'Website Registrations' }) {
  const steps = [
    { key: 'impressions', label: 'Impressions' },
    { key: 'linkClicks', label: 'Link Clicks' },
    { key: 'landingPageViews', label: 'Landing Page Views' },
    { key: 'registrations', label: registrationsLabel },
  ];

  if (!metaConfigured) {
    return (
      <p className="py-8 text-center text-sm text-slate-400">
        Meta Ads Insights integration is not configured — Impressions, Link Clicks and Landing
        Page Views aren't available yet. {registrationsLabel} still tracks correctly on its own.
      </p>
    );
  }

  const maxValue = Math.max(...steps.map((s) => funnel[s.key] || 0), 1);

  return (
    <div>
      <p className="text-[11px] text-slate-400 mb-3">
        Note: Impressions/Clicks/Views measure ad-level activity; {registrationsLabel} counts
        distinct people who registered -- these aren't always the same visitor completing every
        step in sequence, so treat this as a marketing performance funnel, not a strict per-user
        journey.
      </p>
      <div className="space-y-2">
        {steps.map((step, i) => {
          const value = funnel[step.key];
          const prevValue = i > 0 ? funnel[steps[i - 1].key] : null;
          const widthPct = value === null ? 0 : Math.max(4, (value / maxValue) * 100);
          const dropOff = i > 0 ? safeDividePct(value, prevValue) : null;

          return (
            <div key={step.key} className="flex items-center gap-3">
              <div className="w-36 shrink-0 text-xs font-semibold text-slate-600">{step.label}</div>
              <div className="flex-1 h-8 bg-slate-100 rounded-lg overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg flex items-center justify-end px-2 transition-all"
                  style={{ width: `${widthPct}%` }}
                >
                  {value !== null && value > 0 && (
                    <span className="text-[11px] font-bold text-white">{formatNumber(value)}</span>
                  )}
                </div>
                {(value === null || value === 0) && (
                  <span className="relative -top-6 left-2 text-[11px] font-bold text-slate-500">—</span>
                )}
              </div>
              <div className="w-16 shrink-0 text-right text-[11px] font-semibold text-slate-400">
                {dropOff !== null ? formatPercent(dropOff) : ''}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
