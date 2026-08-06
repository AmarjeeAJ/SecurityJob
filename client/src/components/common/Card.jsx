export default function Card({ children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_20px_rgba(10,21,48,0.06)] ${className}`}>
      {children}
    </div>
  );
}
