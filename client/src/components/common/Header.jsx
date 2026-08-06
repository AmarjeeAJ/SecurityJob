import Logo from './Logo.jsx';

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4 sm:px-6">
        <Logo size="md" variant="light" />

        <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 py-1.5 pl-2.5 pr-3 text-xs font-semibold text-emerald-700">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2">
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path strokeLinecap="round" d="M8 11V7a4 4 0 0 1 8 0v4" />
            <circle cx="12" cy="15.5" r="1.4" fill="currentColor" stroke="none" />
          </svg>
          <span className="hidden sm:inline">Secure Form</span>
          <span className="sm:hidden">Secure</span>
        </div>
      </div>
    </header>
  );
}
