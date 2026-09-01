import shieldEmblem from '../../assets/shield-emblem.png';

const SIZE_CONFIGS = {
  sm: {
    icon: 'h-7 w-7 sm:h-8 sm:w-8',
    text: 'text-sm sm:text-base',
    dot: 'text-[10px] sm:text-xs',
    tagline: 'text-[8px] sm:text-[9px]',
  },
  md: {
    icon: 'h-8 w-8 sm:h-10 sm:w-10',
    text: 'text-sm sm:text-base md:text-lg',
    dot: 'text-xs sm:text-sm',
    tagline: 'text-[8.5px] sm:text-[9.5px]',
  },
  lg: {
    icon: 'h-10 w-10 sm:h-12 sm:w-14',
    text: 'text-lg sm:text-2xl',
    dot: 'text-sm sm:text-base',
    tagline: 'text-[10px] sm:text-[11px]',
  },
  xl: {
    icon: 'h-14 w-14 sm:h-16 sm:w-20',
    text: 'text-2xl sm:text-3xl md:text-4xl',
    dot: 'text-base sm:text-lg',
    tagline: 'text-xs sm:text-sm',
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

        {/* Official Brand Tagline with Cyan Accent Lines (Hidden on mobile phones < 640px to prevent navbar squeeze) */}
        {showTagline && (
          <div className="hidden sm:flex items-center gap-1.5 mt-1 leading-none">
            <span className="h-[1.5px] w-2 bg-blue-400 rounded-full shrink-0" />
            <span
              className={`${cfg.tagline} font-bold tracking-tight text-slate-500 whitespace-nowrap truncate`}
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
