import { useEffect, useMemo, useRef, useState } from 'react';
import FieldShell from '../common/FieldShell.jsx';

/**
 * Compact type-to-search multi-select: selected items show as removable tags,
 * remaining options only appear in a dropdown while the input is focused —
 * unlike a wall of always-visible toggle chips, this stays out of the way on
 * a long mobile form until the candidate actually wants to pick something.
 */
export default function SearchableMultiSelect({
  label,
  required,
  error,
  options,
  value = [],
  onChange,
  placeholder = 'Search...',
  getOptionLabel = (option) => option,
  noMatchesText = 'No matches found.',
}) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    const available = options.filter((option) => !value.includes(option));
    if (!query.trim()) return available;
    const q = query.trim().toLowerCase();
    return available.filter(
      (option) => option.toLowerCase().includes(q) || getOptionLabel(option).toLowerCase().includes(q)
    );
  }, [options, value, query, getOptionLabel]);

  function addOption(option) {
    onChange([...value, option]);
    setQuery('');
    inputRef.current?.focus();
  }

  function removeOption(option) {
    onChange(value.filter((v) => v !== option));
  }

  return (
    <FieldShell label={label} required={required} error={error}>
      {value.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {value.map((option) => (
            <span
              key={option}
              className="inline-flex items-center gap-1.5 rounded-full bg-navy-800 py-1.5 pl-3.5 pr-2 text-sm font-medium text-white"
            >
              {getOptionLabel(option)}
              <button
                type="button"
                onClick={() => removeOption(option)}
                aria-label={`Remove ${getOptionLabel(option)}`}
                className="flex h-5 w-5 items-center justify-center rounded-full text-white/70 hover:bg-white/15 hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      <div ref={wrapperRef} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-base text-navy-900 placeholder:text-slate-400
            focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors
            ${error ? 'border-red-400' : 'border-slate-300'}`}
        />

        {/*
          Deliberately NOT absolutely positioned: an overlay here would float on
          top of the next field below (e.g. Preferred Working City sits right
          after Preferred Job Role), so on a phone a tap meant for that next
          field could land on a leftover role option instead. Keeping this in
          normal document flow pushes later fields down rather than covering them.
        */}
        {isOpen && (
          <div className="mt-1.5 max-h-56 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg">
            {filteredOptions.length === 0 ? (
              <p className="px-4 py-3 text-sm text-slate-400">{noMatchesText}</p>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => addOption(option)}
                  className="flex w-full items-center px-4 py-2.5 text-left text-sm text-navy-900 hover:bg-gold-500/10"
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
