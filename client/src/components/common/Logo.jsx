import shieldEmblem from '../../assets/shield-emblem.png';

const SIZE_CONFIGS = {
  sm: {
    icon: 'h-7 w-7 sm:h-8 sm:w-8',
    text: 'text-sm sm:text-base',
    dot: 'text-[10px] sm:text-xs',
    tagline: 'text-[10px] sm:text-[11px]',
  },
  md: {
    icon: 'h-9 w-9 sm:h-12 sm:w-12 md:h-[50px] md:w-[50px]',
    text: 'text-base sm:text-2xl md:text-[26px]',
    dot: 'text-xs sm:text-base md:text-lg',
    tagline: 'text-[10.5px] sm:text-[12.5px]',
  },
  lg: {
    icon: 'h-11 w-11 sm:h-14 sm:w-14',
    text: 'text-xl sm:text-3xl md:text-4xl',
    dot: 'text-sm sm:text-xl',
    tagline: 'text-xs sm:text-sm',
  },
  xl: {
    icon: 'h-14 w-14 sm:h-18 sm:w-18',
    text: 'text-2xl sm:text-4xl md:text-5xl',
    dot: 'text-base sm:text-2xl',
    tagline: 'text-sm sm:text-base',
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
    <div className={`flex items-center gap-2 sm:gap-2.5 select-none group min-w-0 ${className}`}>
      {/* 1. Official High-Resolution Transparent Shield Emblem */}
      <div className="relative shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
        <img
          src={shieldEmblem}
          alt="SecurityJob.in Emblem"
          className={`${cfg.icon} w-auto object-contain drop-shadow-xs`}
          loading="eager"
        />
      </div>

      {/* 2. Official Horizontal Brand Lockup & Tagline */}
      <div className="flex flex-col justify-center min-w-0">
        {/* Main Wordmark: SECURITYJOB.IN */}
        <div className="flex items-baseline leading-none font-black tracking-tight whitespace-nowrap">
          <span className={`${cfg.text} ${isDark ? 'text-white' : 'text-slate-900'} uppercase font-black tracking-wide`}>
            SECURITY
          </span>
          <span className={`${cfg.text} text-blue-600 uppercase font-black tracking-wide ml-0.5`}>
            JOB
          </span>
          <span className={`${cfg.dot} text-blue-500 font-extrabold ml-0.5 uppercase`}>
            .IN
          </span>
        </div>

        {/* Official Brand Tagline with Cyan Accent Lines (Rendered with full line-height to prevent letter descender cutoffs) */}
        {showTagline && (
          <div className="hidden sm:flex items-center gap-1.5 mt-0.5 leading-normal pb-0.5 overflow-visible">
            <span className="h-[1.5px] w-2 bg-blue-400 rounded-full shrink-0" />
            <span
              className={`${cfg.tagline} font-semibold tracking-tight ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              } whitespace-nowrap`}
            >
              Right Job. Right People. Right Security.
            </span>
            <span className="h-[1.5px] w-2 bg-blue-400 rounded-full shrink-0" />
          </div>
        )}
      </div>
    </div>
  );
}
