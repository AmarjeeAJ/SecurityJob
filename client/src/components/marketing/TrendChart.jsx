import { useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const METRICS = [
  { key: 'spend', label: 'Spend (₹)', color: '#0284c7' },
  { key: 'registrations', label: 'Registrations', color: '#16a34a' },
  { key: 'costPerRegistration', label: 'Cost per Registration (₹)', color: '#dc2626' },
  { key: 'cpc', label: 'CPC (₹)', color: '#9333ea' },
  { key: 'ctr', label: 'CTR (%)', color: '#d97706' },
  { key: 'cpm', label: 'CPM (₹)', color: '#0891b2' },
];

function formatDate(d) {
  const date = new Date(`${d}T00:00:00`);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

export default function TrendChart({ series, metaConfigured }) {
  const [activeMetrics, setActiveMetrics] = useState(['spend', 'registrations']);

  function toggleMetric(key) {
    setActiveMetrics((prev) =>
      prev.includes(key) ? prev.filter((m) => m !== key) : [...prev, key]
    );
  }

  if (!series || series.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <p className="text-sm font-semibold text-slate-500">No trend data for this range yet.</p>
        {!metaConfigured && (
          <p className="text-xs text-slate-400">Registrations will still show here once a date range with data is selected.</p>
        )}
      </div>
    );
  }

  const chartData = series.map((d) => ({ ...d, dateLabel: formatDate(d.date) }));

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {METRICS.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => toggleMetric(m.key)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
              activeMetrics.includes(m.key)
                ? 'text-white border-transparent'
                : 'text-slate-500 bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
            style={activeMetrics.includes(m.key) ? { backgroundColor: m.color } : {}}
          >
            {m.label}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="dateLabel" tick={{ fontSize: 11, fill: '#64748b' }} />
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
            formatter={(value) => (value === null ? '—' : value)}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {METRICS.filter((m) => activeMetrics.includes(m.key)).map((m) => (
            <Line
              key={m.key}
              type="monotone"
              dataKey={m.key}
              name={m.label}
              stroke={m.color}
              strokeWidth={2}
              dot={{ r: 2 }}
              connectNulls={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
