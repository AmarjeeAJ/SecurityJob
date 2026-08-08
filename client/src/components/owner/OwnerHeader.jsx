import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOwnerAuth } from '../../features/owner-auth/OwnerAuthContext.jsx';
import Logo from '../common/Logo.jsx';
import ConfirmDialog from '../common/ConfirmDialog.jsx';

export default function OwnerHeader() {
  const { owner, logout } = useOwnerAuth();
  const [confirmingLogout, setConfirmingLogout] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-md">
      <div className="h-[3px] bg-gradient-to-r from-gold-500 via-gold-300 to-gold-500" />
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/owner/candidates" className="group flex items-center gap-3">
          <Logo size="sm" variant="light" showTagline={false} />
          <span className="hidden items-center gap-1 rounded-full bg-gradient-to-b from-navy-800 to-navy-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gold-300 shadow-sm ring-1 ring-navy-700/50 sm:flex">
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2 4 5v6c0 5.5 3.4 9.4 8 11 4.6-1.6 8-5.5 8-11V5l-8-3Z" />
            </svg>
            Owner
          </span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          {owner && (
            <div className="hidden items-center gap-2.5 border-r border-slate-200 pr-4 sm:flex">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-xs font-bold text-navy-900 shadow-sm ring-2 ring-white">
                {owner.email?.[0]?.toUpperCase()}
              </span>
              <span className="text-sm font-medium text-slate-600">{owner.email}</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => setConfirmingLogout(true)}
            className="group flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold
              text-slate-600 shadow-sm transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-600 hover:shadow sm:text-sm"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmingLogout}
        title="Log out of SecurityJob?"
        message="You will need to sign in again to view candidate records."
        confirmLabel="Log out"
        cancelLabel="Stay signed in"
        onConfirm={() => {
          setConfirmingLogout(false);
          logout();
        }}
        onCancel={() => setConfirmingLogout(false)}
      />
    </header>
  );
}
