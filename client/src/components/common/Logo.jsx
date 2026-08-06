const SIZE_CLASSES = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-12 w-12' };
const TEXT_CLASSES = { sm: 'text-sm', md: 'text-base', lg: 'text-lg' };

export default function Logo({ size = 'md', variant = 'light', showTagline = true, className = '' }) {
  const isDark = variant === 'dark';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 48 48" className={`${SIZE_CLASSES[size]} shrink-0`}>
        <defs>
          <linearGradient id="sj-logo-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#eddab0" />
            <stop offset="55%" stopColor="#d9bc6c" />
            <stop offset="100%" stopColor="#b3872f" />
          </linearGradient>
        </defs>
        <path
          d="M24 3 6 10v12c0 12 7.6 20.8 18 23 10.4-2.2 18-11 18-23V10L24 3Z"
          fill="url(#sj-logo-gold)"
          stroke="#8a6a24"
          strokeWidth="0.6"
        />
        <path d="M24 3 6 10v12c0 12 7.6 20.8 18 23V3Z" fill="#000000" fillOpacity="0.1" />
        <path
          d="m16.5 24.5 5 5 10-10"
          fill="none"
          stroke="#0a1530"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="min-w-0">
        <p className={`${TEXT_CLASSES[size]} font-extrabold leading-tight tracking-wide ${isDark ? 'text-white' : 'text-navy-900'}`}>
          Security<span className="text-gold-500">Job</span>
        </p>
        {showTagline && (
          <p className={`text-[11px] leading-tight ${isDark ? 'text-gold-300/90' : 'text-slate-500'}`}>
            Security Industry Recruitment
          </p>
        )}
      </div>
    </div>
  );
}
