import { 
  Search, 
  MapPin, 
  Building, 
  Shield, 
  Tag, 
  Calendar, 
  ArrowUpDown, 
  X, 
  RotateCcw,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import JOB_ROLES from '../../utils/jobRoles.js';

const QUICK_ROLES = [
  'All',
  'Security Guard',
  'Security Supervisor',
  'Armed Guard',
  'Gunman',
  'Bouncer',
];

const QUICK_CITIES = ['Jaipur', 'Jodhpur', 'Kota', 'Udaipur', 'Alwar'];

export default function CandidateFiltersBar({ filters, onChange, onReset }) {
  function update(key, value) {
    onChange({ ...filters, [key]: value, page: 1 });
  }

  const activeFilters = [];
  if (filters.search) activeFilters.push({ key: 'search', label: `Search: "${filters.search}"`, clear: () => update('search', '') });
  if (filters.city) activeFilters.push({ key: 'city', label: `City: ${filters.city}`, clear: () => update('city', '') });
  if (filters.area) activeFilters.push({ key: 'area', label: `Area: ${filters.area}`, clear: () => update('area', '') });
  if (filters.role) activeFilters.push({ key: 'role', label: `Role: ${filters.role}`, clear: () => update('role', '') });
  if (filters.source) activeFilters.push({ key: 'source', label: `Source: ${filters.source}`, clear: () => update('source', '') });
  if (filters.dateFrom) activeFilters.push({ key: 'dateFrom', label: `From: ${filters.dateFrom}`, clear: () => update('dateFrom', '') });
  if (filters.dateTo) activeFilters.push({ key: 'dateTo', label: `To: ${filters.dateTo}`, clear: () => update('dateTo', '') });

  return (
    <div className="space-y-4">
      {/* Quick Filter Chips (Top Bar) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-500" />
            Quick Roles:
          </span>
          {QUICK_ROLES.map((roleName) => {
            const isSelected = roleName === 'All' ? !filters.role : filters.role === roleName;
            return (
              <button
                key={roleName}
                type="button"
                onClick={() => update('role', roleName === 'All' ? '' : roleName)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600 border border-slate-200/60'
                }`}
              >
                {roleName}
              </button>
            );
          })}
        </div>

        {/* Quick Cities */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-emerald-500" />
            Hubs:
          </span>
          {QUICK_CITIES.map((cityName) => {
            const isSelected = filters.city.toLowerCase() === cityName.toLowerCase();
            return (
              <button
                key={cityName}
                type="button"
                onClick={() => update('city', isSelected ? '' : cityName)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600 border border-slate-200/60'
                }`}
              >
                {cityName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Form Fields Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 items-end">
        
        {/* 1. Global Search Field (Span 4 cols on desktop) */}
        <div className="sm:col-span-2 lg:col-span-4 space-y-1">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
            Search Records
          </label>
          <div className="relative flex items-center bg-slate-50/90 hover:bg-slate-100/70 focus-within:bg-white rounded-xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
            <Search className="w-4 h-4 text-blue-600 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Name, 10-digit mobile or Candidate ID..."
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

        {/* 3. City Input (Span 3 cols) */}
        <div className="sm:col-span-1 lg:col-span-3 space-y-1">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
            City / District
          </label>
          <div className="relative flex items-center bg-slate-50/90 hover:bg-slate-100/70 focus-within:bg-white rounded-xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
            <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="e.g. Jaipur, Kota, Jodhpur"
              value={filters.city}
              onChange={(e) => update('city', e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-transparent text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            {filters.city && (
              <button
                type="button"
                onClick={() => update('city', '')}
                className="absolute right-2.5 p-1 rounded-md text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 4. Area / Locality (Span 2 cols) */}
        <div className="sm:col-span-1 lg:col-span-2 space-y-1">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
            Area / Locality
          </label>
          <div className="relative flex items-center bg-slate-50/90 hover:bg-slate-100/70 focus-within:bg-white rounded-xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
            <Building className="w-4 h-4 text-amber-600 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="e.g. Malviya Nagar"
              value={filters.area}
              onChange={(e) => update('area', e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-transparent text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            {filters.area && (
              <button
                type="button"
                onClick={() => update('area', '')}
                className="absolute right-2.5 p-1 rounded-md text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
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

        {/* 8. Sort By (Span 3 cols) */}
        <div className="sm:col-span-1 lg:col-span-3 space-y-1">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
            Sort Order
          </label>
          <div className="relative flex items-center bg-slate-50/90 hover:bg-slate-100/70 focus-within:bg-white rounded-xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
            <ArrowUpDown className="w-4 h-4 text-blue-600 absolute left-3 pointer-events-none" />
            <select
              value={`${filters.sortBy}:${filters.sortDir}`}
              onChange={(e) => {
                const [sortBy, sortDir] = e.target.value.split(':');
                onChange({ ...filters, sortBy, sortDir, page: 1 });
              }}
              className="w-full pl-9 pr-8 py-2.5 bg-transparent text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer appearance-none truncate"
            >
              <option value="latest_submission:desc">Latest Submission (Newest)</option>
              <option value="latest_submission:asc">Latest Submission (Oldest)</option>
              <option value="first_registered:desc">First Registered (Newest)</option>
              <option value="name:asc">Candidate Name (A – Z)</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 pointer-events-none" />
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
