import JOB_ROLES from '../../utils/jobRoles.js';

const inputClasses =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-navy-900 ' +
  'focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors';

function FilterField({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</label>
      {children}
    </div>
  );
}

export default function CandidateFiltersBar({ filters, onChange }) {
  function update(key, value) {
    onChange({ ...filters, [key]: value, page: 1 });
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <FilterField label="Search">
        <div className="relative lg:col-span-2">
          <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Name, mobile or Candidate ID"
            value={filters.search}
            onChange={(e) => update('search', e.target.value)}
            className={`${inputClasses} pl-9`}
          />
        </div>
      </FilterField>

      <FilterField label="City">
        <input
          type="text"
          placeholder="e.g. Jaipur"
          value={filters.city}
          onChange={(e) => update('city', e.target.value)}
          className={inputClasses}
        />
      </FilterField>

      <FilterField label="Area / Locality">
        <input
          type="text"
          placeholder="e.g. Malviya Nagar"
          value={filters.area}
          onChange={(e) => update('area', e.target.value)}
          className={inputClasses}
        />
      </FilterField>

      <FilterField label="Preferred Role">
        <select value={filters.role} onChange={(e) => update('role', e.target.value)} className={inputClasses}>
          <option value="">All roles</option>
          {JOB_ROLES.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </FilterField>

      <FilterField label="Source">
        <input
          type="text"
          placeholder="e.g. facebook"
          value={filters.source}
          onChange={(e) => update('source', e.target.value)}
          className={inputClasses}
        />
      </FilterField>

      <FilterField label="From Date">
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => update('dateFrom', e.target.value)}
          className={inputClasses}
          aria-label="From date"
        />
      </FilterField>

      <FilterField label="To Date">
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => update('dateTo', e.target.value)}
          className={inputClasses}
          aria-label="To date"
        />
      </FilterField>

      <FilterField label="Sort By">
        <select
          value={`${filters.sortBy}:${filters.sortDir}`}
          onChange={(e) => {
            const [sortBy, sortDir] = e.target.value.split(':');
            onChange({ ...filters, sortBy, sortDir, page: 1 });
          }}
          className={inputClasses}
        >
          <option value="latest_submission:desc">Latest submission (newest)</option>
          <option value="latest_submission:asc">Latest submission (oldest)</option>
          <option value="first_registered:desc">First registered (newest)</option>
          <option value="name:asc">Name (A-Z)</option>
        </select>
      </FilterField>
    </div>
  );
}
