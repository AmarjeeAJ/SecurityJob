export default function LoadingSkeleton({ rows = 6 }) {
  return (
    <div className="flex flex-col gap-4 p-6 sm:p-8" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-11 w-full animate-pulse rounded-xl bg-slate-200" />
      ))}
    </div>
  );
}
