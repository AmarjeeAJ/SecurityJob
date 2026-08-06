const FEATURES = [
  { icon: 'search', text: 'Search and filter every registration in seconds' },
  { icon: 'download', text: 'Export verified candidate data straight to Excel' },
  { icon: 'trend', text: 'See exactly which campaign each candidate came from' },
];

const ICON_PATHS = {
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm10 17-4.3-4.3',
  download: 'M12 3v12m0 0-4-4m4 4 4-4M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2',
  trend: 'M3 17l6-6 4 4 8-8M21 7v6h-6',
  camera: 'M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Zm8 3.5a3.2 3.2 0 1 1 0 6.4 3.2 3.2 0 0 1 0-6.4Z',
  users: 'M9 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7-1a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 20c0-3.3 3.1-6 7-6s7 2.7 7 6M15 14c3.3 0 6 2.4 6 5.4',
  pin: 'M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z',
  shieldCheck: 'M24 3 6 10v12c0 12 7.6 20.8 18 23 10.4-2.2 18-11 18-23V10L24 3Zm-7.5 22.6 5 5 10-10',
};

function MiniIcon({ path, className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}

function FloatingBadge({ icon, className = '' }) {
  return (
    <div className={`absolute flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-gold-300 backdrop-blur-md shadow-lg ${className}`}>
      <MiniIcon path={ICON_PATHS[icon]} />
    </div>
  );
}

export default function OwnerLoginIllustration() {
  return (
    <div className="relative hidden h-full min-h-0 flex-col justify-center gap-6 overflow-hidden bg-gradient-to-br from-navy-900 to-navy-950 p-8 text-white lg:flex xl:p-10 2xl:gap-8">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-gold-500/15 blur-3xl" />
        <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
        <div
          className="absolute inset-0 opacity-40"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '26px 26px' }}
        />
      </div>

      <div className="text-sm font-bold uppercase tracking-[0.2em] text-gold-300">SecurityJob</div>

      <div className="relative mx-auto flex h-40 w-40 shrink-0 items-center justify-center 2xl:h-48 2xl:w-48">
        {/* Radar-style concentric rings behind the central shield */}
        <div className="absolute inset-0 rounded-full border border-white/10" />
        <div className="absolute inset-4 rounded-full border border-white/10" />
        <div className="absolute inset-8 rounded-full border border-gold-400/20" />

        <svg viewBox="0 0 48 48" className="relative h-16 w-16 drop-shadow-[0_8px_24px_rgba(201,164,71,0.35)] 2xl:h-20 2xl:w-20">
          <defs>
            <linearGradient id="owner-login-shield" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#eddab0" />
              <stop offset="55%" stopColor="#d9bc6c" />
              <stop offset="100%" stopColor="#b3872f" />
            </linearGradient>
          </defs>
          <path d="M24 3 6 10v12c0 12 7.6 20.8 18 23 10.4-2.2 18-11 18-23V10L24 3Z" fill="url(#owner-login-shield)" stroke="#8a6a24" strokeWidth="0.6" />
          <path d="m16.5 24.5 5 5 10-10" fill="none" stroke="#0a1530" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <FloatingBadge icon="camera" className="-left-1 -top-1 h-9 w-9" />
        <FloatingBadge icon="users" className="-right-2 top-3 h-9 w-9" />
        <FloatingBadge icon="pin" className="-bottom-1 left-4 h-9 w-9" />
      </div>

      <div>
        <h2 className="text-xl font-extrabold leading-tight xl:text-2xl 2xl:text-3xl">
          Every Application, One Dashboard
        </h2>
        <p className="mt-2.5 max-w-sm text-sm text-white/70">
          Review registered security personnel, filter by role, city or campaign, and export verified
          candidate data — all from one secure owner portal.
        </p>

        <ul className="mt-4 flex flex-col gap-2.5">
          {FEATURES.map((f) => (
            <li key={f.text} className="flex items-center gap-3 text-sm text-white/80">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-gold-300">
                <MiniIcon path={ICON_PATHS[f.icon]} className="h-3.5 w-3.5" />
              </span>
              {f.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
