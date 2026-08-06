import { Link } from 'react-router-dom';
import { useOwnerAuth } from '../../features/owner-auth/OwnerAuthContext.jsx';
import Logo from '../common/Logo.jsx';

export default function OwnerHeader() {
  const { owner, logout } = useOwnerAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link to="/owner/candidates" className="flex items-center gap-2">
          <Logo size="sm" variant="light" showTagline={false} />
          <span className="hidden rounded-full bg-navy-800 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-gold-300 sm:inline">
            Owner
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {owner && (
            <div className="hidden items-center gap-2 sm:flex">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-800 text-xs font-bold text-gold-300">
                {owner.email?.[0]?.toUpperCase()}
              </span>
              <span className="text-sm text-slate-600">{owner.email}</span>
            </div>
          )}
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-2 text-xs font-semibold
              text-slate-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:text-sm"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
