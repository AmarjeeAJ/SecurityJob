import { forwardRef } from 'react';
import FieldShell from './FieldShell.jsx';

const baseClasses =
  'w-full rounded-xl border bg-white px-4 py-3 text-base text-navy-900 ' +
  'focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors';

const SelectInput = forwardRef(function SelectInput(
  { label, required, error, hint, id, options, placeholder, className = '', ...rest },
  ref
) {
  return (
    <FieldShell label={label} required={required} error={error} hint={hint} htmlFor={id}>
      <select
        ref={ref}
        id={id}
        className={`${baseClasses} ${error ? 'border-red-400' : 'border-slate-300'} ${className}`}
        aria-invalid={!!error}
        defaultValue=""
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
});

export default SelectInput;
