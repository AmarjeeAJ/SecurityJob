import { formatCurrency, formatNumber, formatPercent, formatChangePct } from '../../utils/marketingFormat.js';

const ROWS = [
  { key: 'spend', label: 'Spend', format: formatCurrency },
  { key: 'registrations', label: 'Registrations', format: formatNumber },
  { key: 'costPerRegistration', label: 'Cost per Registration', format: formatCurrency },
  { key: 'cpm', label: 'CPM', format: formatCurrency },
  { key: 'ctr', label: 'CTR', format: formatPercent },
  { key: 'cpc', label: 'CPC', format: formatCurrency },
  { key: 'landingPageViews', label: 'Landing Page Views', format: formatNumber },
  { key: 'websiteConversionRate', label: 'Website Conversion Rate', format: formatPercent },
];

function changeColor(value) {
  if (value === null || value === undefined) return 'text-slate-400';
  return value > 0 ? 'text-emerald-600' : value < 0 ? 'text-rose-600' : 'text-slate-500';
}

export default function ComparisonPanel({ comparison }) {
  if (!comparison) return null;
  const { current, previous, change, previousPeriod } = comparison;

  return (
    <div>
      <p className="text-xs text-slate-500 mb-3">
        Compared to the previous period ({previousPeriod?.dateFrom} to {previousPeriod?.dateTo})
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <th className="py-2 pr-4">Metric</th>
              <th className="py-2 pr-4">Current</th>
              <th className="py-2 pr-4">Previous</th>
              <th className="py-2 pr-4">Change</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.key} className="border-b border-slate-100">
                <td className="py-2.5 pr-4 font-semibold text-slate-700">{row.label}</td>
                <td className="py-2.5 pr-4 text-slate-900 font-bold">{row.format(current[row.key])}</td>
                <td className="py-2.5 pr-4 text-slate-500">{row.format(previous[row.key])}</td>
                <td className={`py-2.5 pr-4 font-bold ${changeColor(change[row.key])}`}>
                  {formatChangePct(change[row.key])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
