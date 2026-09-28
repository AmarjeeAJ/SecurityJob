import { formatCurrency, formatNumber, formatPercent } from '../../utils/marketingFormat.js';

export default function PerformanceTable({ title, idLabel, rows, showParents = false }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm font-semibold text-slate-500">{title}</p>
        <p className="mt-1 text-xs text-slate-400">No data for the current filters.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] text-sm border-collapse">
        <thead>
          <tr className="text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
            <th className="py-2 pr-4">{idLabel}</th>
            {showParents && <th className="py-2 pr-4">Campaign</th>}
            <th className="py-2 pr-4">{idLabel} ID</th>
            <th className="py-2 pr-4">Spend</th>
            <th className="py-2 pr-4">Impressions</th>
            <th className="py-2 pr-4">Reach</th>
            <th className="py-2 pr-4">Link Clicks</th>
            <th className="py-2 pr-4">CTR</th>
            <th className="py-2 pr-4">CPC</th>
            <th className="py-2 pr-4">CPM</th>
            <th className="py-2 pr-4">Registrations</th>
            <th className="py-2 pr-4">Cost / Registration</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50/60">
              <td className="py-2.5 pr-4 font-semibold text-slate-800 max-w-[200px] truncate" title={row.name || row.id}>
                {row.name || <span className="text-slate-400 italic">Untitled</span>}
              </td>
              {showParents && (
                <td className="py-2.5 pr-4 text-slate-500 max-w-[160px] truncate" title={row.campaignName || ''}>
                  {row.campaignName || '—'}
                </td>
              )}
              <td className="py-2.5 pr-4 font-mono text-xs text-slate-500 max-w-[140px] truncate" title={row.id}>
                {row.id}
              </td>
              <td className="py-2.5 pr-4 font-bold text-slate-900">{formatCurrency(row.spend)}</td>
              <td className="py-2.5 pr-4 text-slate-600">{formatNumber(row.impressions)}</td>
              <td className="py-2.5 pr-4 text-slate-600">{formatNumber(row.reach)}</td>
              <td className="py-2.5 pr-4 text-slate-600">{formatNumber(row.linkClicks)}</td>
              <td className="py-2.5 pr-4 text-slate-600">{formatPercent(row.ctr)}</td>
              <td className="py-2.5 pr-4 text-slate-600">{formatCurrency(row.cpc)}</td>
              <td className="py-2.5 pr-4 text-slate-600">{formatCurrency(row.cpm)}</td>
              <td className="py-2.5 pr-4 font-bold text-blue-700">{formatNumber(row.registrations)}</td>
              <td className="py-2.5 pr-4 font-bold text-slate-900">{formatCurrency(row.costPerRegistration)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
