import { forwardRef } from 'react';
import FieldShell from './FieldShell.jsx';

const baseClasses =
  'w-full rounded-xl border bg-white px-4 py-3 text-base text-navy-900 placeholder:text-slate-400 ' +
  'focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors';

const TextInput = forwardRef(function TextInput(
  { label, required, error, hint, id, type = 'text', className = '', datalistOptions, prefix, ...rest },
  ref
) {
  const listId = datalistOptions ? `${id}-list` : undefined;

  const input = (
    <input
      ref={ref}
      id={id}
      type={type}
      list={listId}
      className={`${baseClasses} ${error ? 'border-red-400' : 'border-slate-300'} ${prefix ? 'rounded-l-none' : ''} ${className}`}
      aria-invalid={!!error}
      {...rest}
    />
  );

  return (
    <FieldShell label={label} required={required} error={error} hint={hint} htmlFor={id}>
      {prefix ? (
        <div className="flex">
          <span
            className={`flex shrink-0 items-center rounded-l-xl border border-r-0 bg-slate-50 px-3 text-base font-semibold text-slate-600 ${
              error ? 'border-red-400' : 'border-slate-300'
            }`}
          >
            {prefix}
          </span>
          {input}
        </div>
      ) : (
        input
      )}
      {datalistOptions && (
        <datalist id={listId}>
          {datalistOptions.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      )}
    </FieldShell>
  );
});

export default TextInput;
