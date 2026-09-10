import { useMemo } from 'react';
import {
  Search,
  Shield,
  Tag,
  Calendar,
  ArrowUpDown,
  X,
  RotateCcw,
  ChevronDown,
  Copy
} from 'lucide-react';
import JOB_ROLES from '../../utils/jobRoles.js';
import { RAJASTHAN_CITIES } from '../../utils/locations.js';
import { ALL_INDIAN_STATES, INDIA_STATES_DISTRICTS } from '../../utils/india-locations.js';
import { getSubdivisionsForDistrict } from '../../utils/tehsilVillages.js';
import SearchableLocationInput from '../form/SearchableLocationInput.jsx';

export default function CandidateFiltersBar({ filters, onChange, onReset }) {
  function update(key, value) {
    onChange({ ...filters, [key]: value, page: 1 });
  }

  // District options follow the selected State (like the candidate form) —
  // falls back to the Rajasthan-only list when no state is chosen, so the
  // existing default behaviour (and the Quick District Hubs below) stays
  // unchanged for owners who never touch the new State filter.
  const districtOptions = useMemo(() => {
    if (!filters.state) return RAJASTHAN_CITIES;
    return INDIA_STATES_DISTRICTS[filters.state] || RAJASTHAN_CITIES;
  }, [filters.state]);

  const subdivisionOptions = useMemo(() => {
    if (!filters.city) return [];
    return getSubdivisionsForDistrict(filters.state || 'Rajasthan', filters.city);
  }, [filters.state, filters.city]);

  function handleStateChange(newState) {
    // Changing state invalidates whatever district/subdivision was picked
    // for the old state.
    onChange({
      ...filters,
      state: newState,
      city: '',
      subdivision: '',
      page: 1,
    });
  }

  function handleCityChange(newCity) {
    // When changing district, reset any previously filtered subdivision
    onChange({
      ...filters,
      city: newCity,
      subdivision: '',
      page: 1,
    });
  }

  const activeFilters = [];
  if (filters.search) activeFilters.push({ key: 'search', label: `Search: "${filters.search}"`, clear: () => update('search', '') });
  if (filters.state) activeFilters.push({ key: 'state', label: `State: ${filters.state}`, clear: () => handleStateChange('') });
  if (filters.city) activeFilters.push({ key: 'city', label: `District: ${filters.city}`, clear: () => handleCityChange('') });
  if (filters.subdivision) activeFilters.push({ key: 'subdivision', label: `Tehsil: ${filters.subdivision}`, clear: () => update('subdivision', '') });
  if (filters.role) activeFilters.push({ key: 'role', label: `Role: ${filters.role}`, clear: () => update('role', '') });
  if (filters.source) activeFilters.push({ key: 'source', label: `Source: ${filters.source}`, clear: () => update('source', '') });
  if (filters.dateFrom) activeFilters.push({ key: 'dateFrom', label: `From: ${filters.dateFrom}`, clear: () => update('dateFrom', '') });
  if (filters.dateTo) activeFilters.push({ key: 'dateTo', label: `To: ${filters.dateTo}`, clear: () => update('dateTo', '') });
  if (filters.duplicateOnly) activeFilters.push({ key: 'duplicateOnly', label: 'Duplicate Register only', clear: () => update('duplicateOnly', false) });

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-end gap-2.5 pb-3 border-b border-slate-100">
        {/* Sort Order — a compact chip-style select, not a full input field */}
        <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 border border-slate-200/60 text-slate-600 cursor-pointer">
          <ArrowUpDown className="w-3 h-3 text-blue-600 shrink-0" />
          <select
            value={`${filters.sortBy}:${filters.sortDir}`}
            onChange={(e) => {
              const [sortBy, sortDir] = e.target.value.split(':');
              onChange({ ...filters, sortBy, sortDir, page: 1 });
            }}
            className="bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="latest_submission:desc">Latest Submission (Newest)</option>
            <option value="latest_submission:asc">Latest Submission (Oldest)</option>
            <option value="first_registered:desc">First Registered (Newest)</option>
            <option value="name:asc">Candidate Name (A – Z)</option>
          </select>
        </label>

        {/* Duplicate Register Toggle */}
        <button
          type="button"
          onClick={() => update('duplicateOnly', !filters.duplicateOnly)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            filters.duplicateOnly
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600 border border-slate-200/60'
          }`}
          title="केवल वे उम्मीदवार दिखाएं जिन्होंने एक से अधिक बार फॉर्म भरा है (same mobile number resubmitted)"
        >
          <Copy className="w-3 h-3" />
          Duplicate Register
        </button>
      </div>

      {/* Main Form Fields Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 items-start">
        
        {/* 1. Global Search Field (Span 3 cols on desktop) */}
        <div className="sm:col-span-2 lg:col-span-3 space-y-1">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
            Search Records
          </label>
          <div className="relative flex items-center bg-slate-50/90 hover:bg-slate-100/70 focus-within:bg-white rounded-xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
            <Search className="w-4 h-4 text-blue-600 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Name, 10-digit mobile or ID..."
              value={filters.search}
              onChange={(e) => update('search', e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-transparent text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            {filters.search && (
              <button
                type="button"
                onClick={() => update('search', '')}
                className="absolute right-2.5 p-1 rounded-md text-slate-400 hover:text-slate-700 focus:outline-none cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 2. Preferred Role Select (Span 3 cols) */}
        <div className="sm:col-span-1 lg:col-span-3 space-y-1">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
            Preferred Role
          </label>
          <div className="relative flex items-center bg-slate-50/90 hover:bg-slate-100/70 focus-within:bg-white rounded-xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
            <Shield className="w-4 h-4 text-indigo-600 absolute left-3 pointer-events-none" />
            <select
              value={filters.role}
              onChange={(e) => update('role', e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer appearance-none truncate"
            >
              <option value="">All Security Roles</option>
              {JOB_ROLES.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 pointer-events-none" />
          </div>
        </div>

        {/* 3. State — searchable, matching the candidate registration form (Span 3 cols) */}
        <div className="sm:col-span-1 lg:col-span-3">
          <SearchableLocationInput
            id="filter-state"
            label="State (राज्य)"
            value={filters.state}
            onChange={(val) => update('state', val)}
            onSelectOption={(val) => handleStateChange(val)}
            options={ALL_INDIAN_STATES}
            placeholder="All States"
          />
        </div>

        {/* 4. District — searchable, options follow the selected State (Span 3 cols) */}
        <div className="sm:col-span-1 lg:col-span-3">
          <SearchableLocationInput
            id="filter-district"
            label="District (जिला)"
            value={filters.city}
            onChange={(val) => update('city', val)}
            onSelectOption={(val) => handleCityChange(val)}
            options={districtOptions}
            placeholder="All Districts"
            badgeText={districtOptions.length > 0 ? `${districtOptions.length} जिले` : ''}
          />
        </div>

        {/* 4b. Tehsil / Subdivision — searchable, scoped to the selected District (Span 3 cols) */}
        <div className="sm:col-span-1 lg:col-span-3">
          <SearchableLocationInput
            id="filter-subdivision"
            label="Tehsil (तहसील)"
            value={filters.subdivision}
            onChange={(val) => update('subdivision', val)}
            onSelectOption={(val) => update('subdivision', val)}
            options={subdivisionOptions}
            placeholder={filters.city ? 'All Tehsils' : 'Select a district first'}
            disabled={!filters.city}
            badgeText={subdivisionOptions.length > 0 ? `${subdivisionOptions.length} तहसील` : ''}
          />
        </div>

        {/* 5. Marketing Source (Span 3 cols) */}
        <div className="sm:col-span-1 lg:col-span-3 space-y-1">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
            Source Channel
          </label>
          <div className="relative flex items-center bg-slate-50/90 hover:bg-slate-100/70 focus-within:bg-white rounded-xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
            <Tag className="w-4 h-4 text-purple-600 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="e.g. facebook, direct, whatsapp"
              value={filters.source}
              onChange={(e) => update('source', e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-transparent text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            {filters.source && (
              <button
                type="button"
                onClick={() => update('source', '')}
                className="absolute right-2.5 p-1 rounded-md text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 6. From Date (Span 3 cols) */}
        <div className="sm:col-span-1 lg:col-span-3 space-y-1">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
            From Date
          </label>
          <div className="relative flex items-center bg-slate-50/90 hover:bg-slate-100/70 focus-within:bg-white rounded-xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => update('dateFrom', e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-transparent text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
              aria-label="From date"
            />
          </div>
        </div>

        {/* 7. To Date (Span 3 cols) */}
        <div className="sm:col-span-1 lg:col-span-3 space-y-1">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
            To Date
          </label>
          <div className="relative flex items-center bg-slate-50/90 hover:bg-slate-100/70 focus-within:bg-white rounded-xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => update('dateTo', e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-transparent text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
              aria-label="To date"
            />
          </div>
        </div>

      </div>

      {/* Active Filter Chips Bar (Shown when any filter is active) */}
      {activeFilters.length > 0 && (
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 mr-1">Active filters:</span>
            {activeFilters.map((af) => (
              <span
                key={af.key}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold"
              >
                {af.label}
                <button
                  type="button"
                  onClick={af.clear}
                  className="p-0.5 hover:bg-blue-200/70 rounded-full cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All
          </button>
        </div>
      )}
    </div>
  );
}
