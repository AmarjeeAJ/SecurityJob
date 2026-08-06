import { forwardRef } from 'react';

const CheckboxInput = forwardRef(function CheckboxInput({ label, id, error, className = '', ...rest }, ref) {
  return (
    <div className={className}>
      <label htmlFor={id} className="flex items-start gap-3 cursor-pointer select-none">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className="mt-0.5 h-5 w-5 shrink-0 rounded border-slate-400 text-navy-800 focus:ring-2 focus:ring-gold-500"
          {...rest}
        />
        <span className="text-sm text-navy-900 leading-snug">{label}</span>
      </label>
      {error && <p className="mt-1 text-xs font-medium text-red-600" role="alert">{error}</p>}
    </div>
  );
});

export default CheckboxInput;
