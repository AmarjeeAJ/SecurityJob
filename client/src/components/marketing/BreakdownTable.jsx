import { formatCurrency, formatNumber, formatPercent } from '../../utils/marketingFormat.js';

export default function BreakdownTable({ columns, rows, getKey, getLabel, showSpend = false }) {
  if (!rows || rows.length === 0) {
    return <p className="py-6 text-center text-sm text-slate-400">No data for the current filters.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
            <th className="py-2 pr-4">{columns.label}</th>
            <th className="py-2 pr-4">Registrations</th>
            {columns.share && <th className="py-2 pr-4">Share</th>}
            {showSpend && (
              <>
                <th className="py-2 pr-4">Spend</th>
                <th className="py-2 pr-4">Cost / Registration</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={getKey(row) ?? i} className="border-b border-slate-100">
              <td className="py-2.5 pr-4 font-semibold text-slate-800">{getLabel(row)}</td>
              <td className="py-2.5 pr-4 font-bold text-blue-700">{formatNumber(row.registrations)}</td>
              {columns.share && <td className="py-2.5 pr-4 text-slate-600">{formatPercent(row.sharePct)}</td>}
              {showSpend && (
                <>
                  <td className="py-2.5 pr-4 text-slate-600">{formatCurrency(row.spend)}</td>
                  <td className="py-2.5 pr-4 text-slate-600">{formatCurrency(row.costPerRegistration)}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
