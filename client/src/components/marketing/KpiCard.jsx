export default function KpiCard({ icon: Icon, label, value, accent = 'blue', subtitle }) {
  const accents = {
    blue: 'bg-blue-50 text-blue-600',
    sky: 'bg-sky-100 text-sky-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600',
    rose: 'bg-rose-50 text-rose-600',
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_2px_20px_rgba(10,21,48,0.05)]">
      <div className="flex items-center gap-2.5">
        {Icon && (
          <div className={`p-2 rounded-xl ${accents[accent] || accents.blue}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{label}</p>
      </div>
      <p className="mt-2 text-xl sm:text-2xl font-black text-slate-900">{value}</p>
      {subtitle && <p className="mt-0.5 text-[11px] text-slate-400">{subtitle}</p>}
    </div>
  );
}
