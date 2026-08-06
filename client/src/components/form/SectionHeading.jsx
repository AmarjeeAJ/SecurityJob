export default function SectionHeading({ number, title, totalSections = 6 }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-800 text-sm font-bold text-gold-300">
        {number}
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="text-base font-bold text-navy-900 sm:text-lg">{title}</h2>
      </div>
      <span className="shrink-0 text-xs font-medium text-slate-400">{number}/{totalSections}</span>
    </div>
  );
}
