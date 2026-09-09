import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, X, Check, Search } from 'lucide-react';

/**
 * SearchableLocationInput
 * 
 * Replaces rigid <select> and broken <datalist> with an accessible, high-performance,
 * type-to-search dropdown.
 * - Candidates can type in English or Hindi; matching suggestions immediately appear at the top.
 * - Tapping/clicking any suggestion selects it immediately with 1 tap.
 * - Trailing clear ('✕') button allows instant reset.
 * - Dropdown chevron toggles the full list open/close.
 * - If candidate types a village/block not in list, a custom write-in pill "✍️ Use custom" allows accepting it.
 */
export default function SearchableLocationInput({
  id,
  label,
  value = '',
  onChange,
  onSelectOption,
  options = [],
  placeholder = 'टाइप करें या सूची से चुनें',
  required = false,
  error = null,
  disabled = false,
  isLoading = false,
  badgeText = '',
  subLabel = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Synchronize internal query with external value when dropdown is closed
  useEffect(() => {
    if (!isOpen) {
      setQuery(value || '');
    }
  }, [value, isOpen]);

  // Click outside listener to close dropdown cleanly
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
        // If user typed something and blurred, commit whatever they typed
        if (query.trim() !== (value || '')) {
          onChange(query.trim());
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [query, value, onChange]);

  // Filter options based on typed query (supports case-insensitive Latin and Hindi search)
  const filteredOptions = useMemo(() => {
    if (!query || query.trim() === '') {
      return options;
    }
    const cleanQ = query.trim().toLowerCase();
    return options.filter((opt) => {
      if (typeof opt !== 'string') return false;
      return opt.toLowerCase().includes(cleanQ);
    });
  }, [options, query]);

  const handleSelect = (selectedVal) => {
    setQuery(selectedVal);
    onChange(selectedVal);
    if (onSelectOption) {
      onSelectOption(selectedVal);
    }
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setQuery('');
    onChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setIsOpen(true);
  };

  const isExactMatch = options.some(
    (opt) => opt.toLowerCase() === query.trim().toLowerCase()
  );

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* Label and Badge Header */}
      <div className="flex items-center justify-between gap-1 mb-1.5">
        <label
          htmlFor={id}
          className="block text-xs sm:text-sm font-semibold text-slate-800"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {badgeText ? (
          <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 transition-all duration-150 inline-block">
            {badgeText}
          </span>
        ) : (
          <span className="inline-block h-5" />
        )}
      </div>

      {/* Input container */}
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="text"
          autoComplete="off"
          disabled={disabled}
          value={query}
          placeholder={isLoading ? 'लोड हो रहा है...' : placeholder}
          onFocus={() => {
            if (!disabled) setIsOpen(true);
          }}
          onChange={(e) => {
            const nextVal = e.target.value;
            setQuery(nextVal);
            onChange(nextVal);
            if (!isOpen) setIsOpen(true);
          }}
          className={`w-full px-4 py-3 pr-16 rounded-xl border text-xs sm:text-sm font-semibold text-slate-900 bg-slate-50/40 hover:bg-white focus:bg-white transition-all placeholder:font-normal placeholder:text-slate-400 focus:outline-none ${
            error
              ? 'border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-100'
              : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
          } ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-100' : ''}`}
        />

        {/* Trailing action icons */}
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400">
          {query && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-lg hover:bg-slate-200/70 hover:text-slate-700 transition-colors cursor-pointer"
              title="साफ़ करें"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              if (!disabled) {
                setIsOpen((prev) => !prev);
                if (!isOpen && inputRef.current) {
                  inputRef.current.focus();
                }
              }
            }}
            className="p-1 rounded-lg hover:bg-slate-200/70 hover:text-slate-700 transition-colors cursor-pointer"
            title="सूची दिखाएं"
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-blue-600' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {subLabel && (
        <p className="text-[11px] text-slate-500 font-normal mt-1">{subLabel}</p>
      )}

      {error && (
        <p className="text-xs font-medium text-red-600 mt-1">{error}</p>
      )}

      {/* Floating Suggestions Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white/98 backdrop-blur-md p-1.5 shadow-2xl ring-1 ring-slate-900/10 transition-all">
          {/* Top Indicator */}
          <div className="px-2.5 py-1.5 mb-1 flex items-center justify-between text-[11px] font-bold text-slate-500 border-b border-slate-100">
            <span className="flex items-center gap-1">
              <Search className="w-3 h-3 text-slate-400" />
              {filteredOptions.length > 0
                ? `${filteredOptions.length} सुझाव (Tap to select)`
                : 'कोई सीधा मिलान नहीं'}
            </span>
            {query && (
              <span className="text-blue-600 font-semibold truncate max-w-[120px]">
                "{query}"
              </span>
            )}
          </div>

          {/* If typed query is not in list, provide 1-tap accept custom pill */}
          {query.trim() !== '' && !isExactMatch && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(query.trim())}
              className="w-full text-left px-3 py-2 rounded-lg bg-blue-50/80 hover:bg-blue-100 text-xs font-bold text-blue-700 flex items-center justify-between gap-2 mb-1 transition-colors cursor-pointer"
            >
              <span>✍️ "{query.trim()}" दर्ज करें (Custom)</span>
              <span className="text-[10px] uppercase tracking-wider bg-blue-200/80 px-1.5 py-0.5 rounded text-blue-800">
                स्वीकार करें
              </span>
            </button>
          )}

          {/* Suggestions List */}
          {filteredOptions.length === 0 && query.trim() === '' ? (
            <p className="px-3 py-3 text-xs text-slate-400 text-center font-normal">
              विकल्प लोड हो रहे हैं या कोई सूची उपलब्ध नहीं है।
            </p>
          ) : (
            <div className="space-y-0.5">
              {filteredOptions.map((option) => {
                const isSelected =
                  value && option.toLowerCase() === value.toLowerCase();
                return (
                  <button
                    key={option}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelect(option)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-800 hover:bg-slate-100 hover:text-blue-700'
                    }`}
                  >
                    <span className="truncate pr-2">{option}</span>
                    {isSelected && <Check className="w-4 h-4 shrink-0 text-white" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
