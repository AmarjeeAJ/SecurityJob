import { Eye, MousePointerClick, FileText, Users, ChevronDown } from 'lucide-react';
import { formatNumber, formatPercent, safeDividePct } from '../../utils/marketingFormat.js';

const ACCENTS = {
  blue: { icon: 'bg-blue-50 text-blue-600', bar: 'from-blue-500 to-blue-600' },
  sky: { icon: 'bg-sky-100 text-sky-600', bar: 'from-sky-400 to-sky-500' },
  purple: { icon: 'bg-purple-50 text-purple-600', bar: 'from-purple-500 to-purple-600' },
  emerald: { icon: 'bg-emerald-50 text-emerald-600', bar: 'from-emerald-500 to-emerald-600' },
};

export default function FunnelChart({ funnel, metaConfigured, registrationsLabel = 'Website Registrations' }) {
  const steps = [
    { key: 'impressions', label: 'Impressions', icon: Eye, accent: 'blue' },
    { key: 'linkClicks', label: 'Link Clicks', icon: MousePointerClick, accent: 'sky' },
    { key: 'landingPageViews', label: 'Landing Page Views', icon: FileText, accent: 'purple' },
    { key: 'registrations', label: registrationsLabel, icon: Users, accent: 'emerald' },
  ];

  if (!metaConfigured) {
    return (
      <p className="py-8 text-center text-sm text-slate-400">
        Meta Ads Insights integration is not configured — Impressions, Link Clicks and Landing
        Page Views aren't available yet. {registrationsLabel} still tracks correctly on its own.
      </p>
    );
  }

  // Bar widths use a square-root scale rather than linear: ad funnels
  // routinely span 1000x+ between impressions and conversions, and a
  // linear width would shrink every later step to an illegible sliver.
  // A floor keeps every step visibly present even at the extreme end.
  const scaled = (v) => (v === null || v === undefined ? 0 : Math.sqrt(Math.max(v, 0)));
  const maxScaled = Math.max(...steps.map((s) => scaled(funnel[s.key])), 1);

  return (
    <div>
      <p className="text-[11px] text-slate-400 mb-5">
        Note: Impressions/Clicks/Views measure ad-level activity; {registrationsLabel} counts
        distinct people who registered -- these aren't always the same visitor completing every
        step in sequence, so treat this as a marketing performance funnel, not a strict per-user
        journey.
      </p>
      <div>
        {steps.map((step, i) => {
          const value = funnel[step.key];
          const prevValue = i > 0 ? funnel[steps[i - 1].key] : null;
          const widthPct = value === null ? 0 : Math.max(14, (scaled(value) / maxScaled) * 100);
          const dropOff = i > 0 ? safeDividePct(value, prevValue) : null;
          const Icon = step.icon;
          const accent = ACCENTS[step.accent];

          return (
            <div key={step.key}>
              <div className="flex items-center gap-4 rounded-xl border border-slate-200/80 bg-white p-3.5">
                <div className={`shrink-0 p-2.5 rounded-xl ${accent.icon}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-3 mb-1.5">
                    <p className="text-xs font-bold text-slate-600 truncate">{step.label}</p>
                    <p className="text-lg font-black text-slate-900 shrink-0">
                      {value === null || value === undefined ? '—' : formatNumber(value)}
                    </p>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${accent.bar} transition-all`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="flex items-center gap-2 py-1 pl-7">
                  <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
                  {dropOff !== null && (
                    <span className="text-[11px] font-bold text-slate-400">{formatPercent(dropOff)} continued</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
