import { forwardRef } from 'react';
import FieldShell from './FieldShell.jsx';

const TextAreaInput = forwardRef(function TextAreaInput(
  { label, required, error, hint, id, maxLength, className = '', ...rest },
  ref
) {
  return (
    <FieldShell label={label} required={required} error={error} hint={hint} htmlFor={id}>
      <textarea
        ref={ref}
        id={id}
        rows={4}
        maxLength={maxLength}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-base text-navy-900 placeholder:text-slate-400
          focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors
          ${error ? 'border-red-400' : 'border-slate-300'} ${className}`}
        aria-invalid={!!error}
        {...rest}
      />
    </FieldShell>
  );
});

export default TextAreaInput;
