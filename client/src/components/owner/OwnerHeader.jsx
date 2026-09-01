import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, LogOut, User, Lock, ExternalLink } from 'lucide-react';
import { useOwnerAuth } from '../../features/owner-auth/OwnerAuthContext.jsx';
import Logo from '../common/Logo.jsx';
import ConfirmDialog from '../common/ConfirmDialog.jsx';

export default function OwnerHeader() {
  const { owner, logout } = useOwnerAuth();
  const [confirmingLogout, setConfirmingLogout] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link to="/owner/candidates" className="group flex items-center gap-2.5 shrink-0">
            <Logo size="md" variant="light" showTagline={false} />
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[11px] font-extrabold text-blue-700">
              <Lock className="h-3 w-3 text-blue-600" />
              Owner Console
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-slate-200/70 border border-slate-200 transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {owner && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
                {owner.email?.[0]?.toUpperCase()}
              </div>
              <span className="text-xs font-bold text-slate-700 hidden md:inline truncate max-w-[150px]">
                {owner.email}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setConfirmingLogout(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all cursor-pointer shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmingLogout}
        title="Log out of SecurityJob Owner Portal?"
        message="You will need to sign in again with your owner credentials to view candidate records."
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
