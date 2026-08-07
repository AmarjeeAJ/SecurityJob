import { useEffect, useMemo, useRef, useState } from 'react';
import FieldShell from '../common/FieldShell.jsx';

/**
 * Type-to-search single select for city/state. Replaces the native <datalist>,
 * whose browser-rendered popup can't be styled, ignores the page's language,
 * and on some browsers renders as a full-height panel pinned away from the
 * field. This keeps the suggestion list inside the form's own design, shows
 * translated labels while still submitting the canonical English value, and
 * still allows a free-typed value for places not in the list.
 */
export default function SearchableSelect({
  id,
  label,
  required,
  error,
  options,
  value = '',
  onChange,
  placeholder,
  getOptionLabel = (option) => option,
  noMatchesText = 'No matches found.',
}) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // What the input shows: the typed query while searching, otherwise the
  // translated label of whatever is currently selected.
  const displayValue = isOpen ? query : value ? getOptionLabel(value) : '';

  useEffect(() => {
    // Close on click (not mousedown): closing collapses this in-flow list and
    // shifts everything below it upward — doing that on mousedown moves the
    // element out from under the pointer before mouseup, so the click never
    // lands on whatever the user was actually aiming at.
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (option) => option.toLowerCase().includes(q) || getOptionLabel(option).toLowerCase().includes(q)
    );
  }, [options, query, getOptionLabel]);

  function selectOption(option) {
    onChange(option);
    setQuery('');
    setIsOpen(false);
  }

  return (
    <FieldShell label={label} required={required} error={error} htmlFor={id}>
      <div ref={wrapperRef} className="relative">
        <input
          id={id}
          type="text"
          autoComplete="off"
          value={displayValue}
          placeholder={placeholder}
          onFocus={() => {
            setIsOpen(true);
            setQuery('');
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            // Keep the typed text as the value so places outside the list still work.
            onChange(e.target.value);
          }}
          className={`w-full rounded-xl border bg-white px-4 py-3 pr-10 text-base text-navy-900 placeholder:text-slate-400
            focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors
            ${error ? 'border-red-400' : 'border-slate-300'}`}
        />
        <svg
          viewBox="0 0 24 24"
          className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
        </svg>

        {isOpen && (
          <div className="absolute left-0 right-0 top-full z-20 mt-1.5 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg">
            {filteredOptions.length === 0 ? (
              <p className="px-4 py-3 text-sm text-slate-400">{noMatchesText}</p>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => selectOption(option)}
                  className={`flex w-full items-center px-4 py-2.5 text-left text-sm hover:bg-gold-500/10
                    ${option === value ? 'font-semibold text-gold-700' : 'text-navy-900'}`}
                >
                  {getOptionLabel(option)}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </FieldShell>
  );
}
