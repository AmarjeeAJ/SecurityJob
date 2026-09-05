import { Search, Filter, RotateCcw, X } from 'lucide-react';
import ROLE_SLUGS, { ROLE_CATEGORIES } from '../../utils/roleSlugs.js';
import { RAJASTHAN_CITIES } from '../../utils/locations.js';

export default function JobFilters({ filters, onChange, onReset, onClose = null }) {
  const activeCount = Object.entries(filters).filter(([key, val]) => {
    if (!val || val === 'All' || val === 0 || val === '') return false;
    return true;
  }).length;

  const handleFieldChange = (field, value) => {
    onChange({
      ...filters,
      [field]: value,
    });
  };

  const rajasthanTopCities = [
    'Jaipur',
    'Jodhpur',
    'Udaipur',
    'Kota',
    'Ajmer',
    'Bikaner',
    'Alwar',
    'Bhiwadi',
    'Neemrana',
    'Bhilwara',
    'Sikar',
    'Pali',
    'Sri Ganganagar',
    'Bharatpur',
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
            <Filter className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Filter Openings (Rajasthan)</h3>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-xs font-bold">
              {activeCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 1. Keyword Search */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-800">
          Search Keywords
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => handleFieldChange('searchQuery', e.target.value)}
            placeholder="Search role or district..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* 2. Specific Security Role */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-800">
          Security Role
        </label>
        <select
          value={filters.role}
          onChange={(e) => handleFieldChange('role', e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          <option value="">All Security Roles (12+)</option>
          {ROLE_SLUGS.map((r) => (
            <option key={r.slug} value={r.slug}>{r.label}</option>
          ))}
        </select>
      </div>

      {/* 3. Rajasthan City / Location */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-800">
          Rajasthan District / City
        </label>
        <select
          value={filters.city}
          onChange={(e) => handleFieldChange('city', e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          <option value="">All Rajasthan Locations</option>
          {RAJASTHAN_CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Quick city pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Alwar', 'Bhiwadi', 'Neemrana', 'Ajmer'].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => handleFieldChange('city', filters.city === c ? '' : c)}
              className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                filters.city === c
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Experience Level */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-800">
          Experience Required
        </label>
        <div className="grid grid-cols-2 gap-2">
          {['All', 'Fresher', 'Experienced'].map((exp) => (
            <button
              key={exp}
              type="button"
              onClick={() => handleFieldChange('experience', exp === 'All' ? '' : exp)}
              className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                (exp === 'All' && !filters.experience) || filters.experience === exp
                  ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {exp}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Minimum Monthly Salary */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
          <span>Minimum Monthly Salary</span>
          <span className="text-emerald-600">₹{filters.salaryMin ? filters.salaryMin.toLocaleString('en-IN') : '15,000'}/mo</span>
        </div>
        <input
          type="range"
          min={15000}
          max={50000}
          step={2000}
          value={filters.salaryMin || 15000}
          onChange={(e) => handleFieldChange('salaryMin', Number(e.target.value))}
          className="w-full accent-blue-600 cursor-pointer"
        />
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
          <span>₹15,000</span>
          <span>₹30,000</span>
          <span>₹50,000+</span>
        </div>
      </div>

      {/* Reset Filter Button */}
      {activeCount > 0 && (
        <button
          type="button"
          onClick={onReset}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
        >
          Clear All Filters ({activeCount})
        </button>
      )}
    </div>
  );
}
