const SIZE_CONFIGS = {
  sm: {
    svg: 'h-8 w-8',
    text: 'text-base',
    tagline: 'text-[9px]',
  },
  md: {
    svg: 'h-9 w-9 sm:h-10 sm:w-10',
    text: 'text-base sm:text-lg',
    tagline: 'text-[10px]',
  },
  lg: {
    svg: 'h-11 w-11 sm:h-12 sm:w-12',
    text: 'text-lg sm:text-xl',
    tagline: 'text-[11px]',
  },
  xl: {
    svg: 'h-14 w-14 sm:h-16 sm:w-16',
    text: 'text-2xl sm:text-3xl',
    tagline: 'text-xs',
  },
};

export default function Logo({
  size = 'md',
  variant = 'light',
  showTagline = true,
  className = '',
}) {
  const isDark = variant === 'dark';
  const cfg = SIZE_CONFIGS[size] || SIZE_CONFIGS.md;

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Modern High-End Security & Job Emblem */}
      <div className={`relative ${cfg.svg} shrink-0`}>
        <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-sm">
          <defs>
            {/* Primary Shield Gradient */}
            <linearGradient id="sj-shield-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="60%" stopColor="#1d4ed8" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            {/* Gold Job Star Accent Gradient */}
            <linearGradient id="sj-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            {/* Inner Sheen */}
            <linearGradient id="sj-sheen" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Shield Base */}
          <path
            d="M24 4 L8 10.5 C8 24 14.5 35.5 24 43 C33.5 35.5 40 24 40 10.5 L24 4 Z"
            fill="url(#sj-shield-grad)"
            stroke={isDark ? '#3b82f6' : '#1e40af'}
            strokeWidth="1.2"
          />

          {/* Inner Highlight Layer */}
          <path
            d="M24 6.5 L10.5 12 C10.5 23.5 16 33.5 24 40 C32 33.5 37.5 23.5 37.5 12 L24 6.5 Z"
            fill="url(#sj-sheen)"
          />

          {/* Security Star Core (Job Excellence Emblem) */}
          <path
            d="M24 14 L26.2 19.5 L32 20.2 L27.5 24 L28.8 29.8 L24 26.5 L19.2 29.8 L20.5 24 L16 20.2 L21.8 19.5 Z"
            fill="url(#sj-gold-grad)"
            stroke="#b45309"
            strokeWidth="0.5"
          />

          {/* Stylized Verified Checkmark / Eagle Wing Arc */}
          <path
            d="M17 24.5 L22.5 30 L33 19"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Modern Wordmark */}
      <div className="min-w-0 flex flex-col justify-center">
        <div className="flex items-center gap-1 leading-none">
          <span
            className={`${cfg.text} font-black tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Security<span className="text-blue-600">Job</span>
          </span>
          <span className="text-[10px] sm:text-xs font-extrabold px-1.5 py-0.2 rounded-md bg-blue-50 text-blue-700 border border-blue-200/80">
            .in
          </span>
        </div>

        {showTagline && (
          <p
            className={`${cfg.tagline} font-bold tracking-wider uppercase mt-1 leading-none ${
              isDark ? 'text-blue-200/80' : 'text-slate-400'
            }`}
          >
            Security Careers India
          </p>
        )}
      </div>
    </div>
  );
}
