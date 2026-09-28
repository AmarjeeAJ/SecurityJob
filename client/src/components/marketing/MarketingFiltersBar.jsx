import { Calendar, Tag, Shield, Building2, ChevronDown, RotateCcw } from 'lucide-react';
import JOB_ROLES from '../../utils/jobRoles.js';
import { ALL_INDIAN_STATES } from '../../utils/india-locations.js';
import SearchableLocationInput from '../form/SearchableLocationInput.jsx';

const FIELD_CLASSES =
  'relative flex items-center bg-slate-50/90 hover:bg-slate-100/70 focus-within:bg-white rounded-xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all';
const INPUT_CLASSES = 'w-full pl-9 pr-3 py-2 bg-transparent text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none';
const LABEL_CLASSES = 'block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1';

export default function MarketingFiltersBar({ filters, onChange, onReset, brands = [] }) {
  function update(key, value) {
    onChange({ ...filters, [key]: value });
  }

  const hasNonDefaultFilters = Object.entries(filters).some(
    ([key, value]) => key !== 'brand' && value
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">Filters</h3>
        {hasNonDefaultFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
        {/* Brand */}
        <div className="lg:col-span-3">
          <label className={LABEL_CLASSES}>Brand</label>
          <div className={FIELD_CLASSES}>
            <Building2 className="w-4 h-4 text-amber-600 absolute left-3 pointer-events-none" />
            <select
              value={filters.brand}
              onChange={(e) => update('brand', e.target.value)}
              className={`${INPUT_CLASSES} appearance-none pr-8 cursor-pointer`}
            >
              <option value="">All Brands</option>
              {brands.map((b) => (
                <option key={b.slug} value={b.slug}>{b.name}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none" />
          </div>
        </div>

        {/* Date From */}
        <div className="lg:col-span-2">
          <label className={LABEL_CLASSES}>From Date</label>
          <div className={FIELD_CLASSES}>
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => update('dateFrom', e.target.value)}
              className={`${INPUT_CLASSES} cursor-pointer`}
            />
          </div>
        </div>

        {/* Date To */}
        <div className="lg:col-span-2">
          <label className={LABEL_CLASSES}>To Date</label>
          <div className={FIELD_CLASSES}>
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => update('dateTo', e.target.value)}
              className={`${INPUT_CLASSES} cursor-pointer`}
            />
          </div>
        </div>

        {/* Platform */}
        <div className="lg:col-span-2">
          <label className={LABEL_CLASSES}>Platform</label>
          <div className={FIELD_CLASSES}>
            <select
              value={filters.platform}
              onChange={(e) => update('platform', e.target.value)}
              className={`${INPUT_CLASSES} pl-3 appearance-none pr-8 cursor-pointer`}
            >
              <option value="">All Platforms</option>
              <option value="meta">Meta</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none" />
          </div>
        </div>

        {/* Role */}
        <div className="lg:col-span-3">
          <label className={LABEL_CLASSES}>Role</label>
          <div className={FIELD_CLASSES}>
            <Shield className="w-4 h-4 text-indigo-600 absolute left-3 pointer-events-none" />
            <select
              value={filters.role}
              onChange={(e) => update('role', e.target.value)}
              className={`${INPUT_CLASSES} appearance-none pr-8 cursor-pointer truncate`}
            >
              <option value="">All Roles</option>
              {JOB_ROLES.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none" />
          </div>
        </div>

        {/* Source */}
        <div className="lg:col-span-3">
          <label className={LABEL_CLASSES}>Source</label>
          <div className={FIELD_CLASSES}>
            <Tag className="w-4 h-4 text-purple-600 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="e.g. fb, ig, direct"
              value={filters.source}
              onChange={(e) => update('source', e.target.value)}
              className={INPUT_CLASSES}
            />
          </div>
        </div>

        {/* State */}
        <div className="lg:col-span-3">
          <SearchableLocationInput
            id="marketing-filter-state"
            label="State"
            value={filters.state}
            onChange={(val) => update('state', val)}
            onSelectOption={(val) => update('state', val)}
            options={ALL_INDIAN_STATES}
            placeholder="All States"
            compact
          />
        </div>

        {/* City */}
        <div className="lg:col-span-3">
          <label className={LABEL_CLASSES}>City / District</label>
          <div className={FIELD_CLASSES}>
            <input
              type="text"
              placeholder="e.g. Jaipur"
              value={filters.city}
              onChange={(e) => update('city', e.target.value)}
              className={`${INPUT_CLASSES} pl-3`}
            />
          </div>
        </div>

        {/* Campaign ID */}
        <div className="lg:col-span-3">
          <label className={LABEL_CLASSES}>Campaign ID</label>
          <div className={FIELD_CLASSES}>
            <input
              type="text"
              placeholder="Campaign ID"
              value={filters.campaignId}
              onChange={(e) => update('campaignId', e.target.value)}
              className={`${INPUT_CLASSES} pl-3 font-mono`}
            />
          </div>
        </div>

        {/* Ad Set ID */}
        <div className="lg:col-span-3">
          <label className={LABEL_CLASSES}>Ad Set ID</label>
          <div className={FIELD_CLASSES}>
            <input
              type="text"
              placeholder="Ad Set ID"
              value={filters.adsetId}
              onChange={(e) => update('adsetId', e.target.value)}
              className={`${INPUT_CLASSES} pl-3 font-mono`}
            />
          </div>
        </div>

        {/* Ad ID */}
        <div className="lg:col-span-3">
          <label className={LABEL_CLASSES}>Ad ID</label>
          <div className={FIELD_CLASSES}>
            <input
              type="text"
              placeholder="Ad ID"
              value={filters.adId}
              onChange={(e) => update('adId', e.target.value)}
              className={`${INPUT_CLASSES} pl-3 font-mono`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
