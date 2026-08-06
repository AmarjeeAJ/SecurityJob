const VARIANTS = {
  primary: 'bg-navy-800 text-white hover:bg-navy-700 active:bg-navy-900',
  gold: 'bg-gold-500 text-navy-950 hover:bg-gold-400 active:bg-gold-500',
  outline: 'bg-white text-navy-800 border border-navy-800 hover:bg-navy-50',
  ghost: 'bg-transparent text-navy-800 hover:bg-navy-50',
};

export default function Button({
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  children,
  type = 'button',
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-semibold
        transition-colors disabled:cursor-not-allowed disabled:opacity-60 min-h-[3rem]
        ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
      )}
      {children}
    </button>
  );
}
