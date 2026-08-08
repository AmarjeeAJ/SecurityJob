import { useEffect, useState, useCallback } from 'react';
import { fetchCandidates, buildExportCsvUrl } from '../api/ownerCandidates.js';
import { useDebouncedValue } from '../hooks/useDebouncedValue.js';
import OwnerHeader from '../components/owner/OwnerHeader.jsx';
import CandidateFiltersBar from '../components/owner/CandidateFiltersBar.jsx';
import CandidateTable from '../components/owner/CandidateTable.jsx';
import PaginationControls from '../components/owner/PaginationControls.jsx';
import Card from '../components/common/Card.jsx';
import Button from '../components/common/Button.jsx';
import ErrorBanner from '../components/form/ErrorBanner.jsx';
import { useNoIndex } from '../hooks/useNoIndex.js';

const DEFAULT_FILTERS = {
  search: '',
  city: '',
  area: '',
  role: '',
  source: '',
  dateFrom: '',
  dateTo: '',
  sortBy: 'latest_submission',
  sortDir: 'desc',
  page: 1,
  pageSize: 25,
};

export default function CandidateRecordsPage() {
  useNoIndex();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [candidates, setCandidates] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(true);

  const debouncedSearch = useDebouncedValue(filters.search, 350);
  const debouncedCity = useDebouncedValue(filters.city, 350);
  const debouncedArea = useDebouncedValue(filters.area, 350);
  const debouncedSource = useDebouncedValue(filters.source, 350);

  const loadCandidates = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const queryFilters = {
        ...filters,
        search: debouncedSearch,
        city: debouncedCity,
        area: debouncedArea,
        source: debouncedSource,
      };
      const data = await fetchCandidates(queryFilters);
      setCandidates(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not load candidate records.');
    } finally {
      setLoading(false);
    }
  }, [filters, debouncedSearch, debouncedCity, debouncedArea, debouncedSource]);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  const activeExportFilters = {
    search: debouncedSearch,
    city: debouncedCity,
    area: debouncedArea,
    role: filters.role,
    source: debouncedSource,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    sortBy: filters.sortBy,
    sortDir: filters.sortDir,
  };

  const activeFilterCount = [
    debouncedSearch, debouncedCity, debouncedArea, filters.role, debouncedSource, filters.dateFrom, filters.dateTo,
  ].filter(Boolean).length;
  const hasActiveFilters = activeFilterCount > 0;

  function clearFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  return (
    <div className="bg-mesh-light min-h-screen">
      <OwnerHeader />

      <main className="mx-auto max-w-[1800px] px-4 py-6 sm:px-6 lg:px-10 sm:py-8">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-navy-900 sm:text-2xl">Candidate Records</h1>
            <p className="mt-0.5 text-sm text-slate-500">
              {loading ? 'Loading…' : `${pagination.total} registered candidate${pagination.total === 1 ? '' : 's'}`}
              {hasActiveFilters && !loading && ' matching current filters'}
            </p>
          </div>
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <a href={buildExportCsvUrl({})} className="w-full sm:w-auto">
              <Button variant="outline" className="w-full">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Download All
              </Button>
            </a>
            <a href={buildExportCsvUrl(activeExportFilters)} className="w-full sm:w-auto">
              <Button variant="gold" className="w-full">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Download Filtered
              </Button>
            </a>
          </div>
        </div>

        <Card className="mb-6">
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left sm:px-5"
          >
            <span className="flex items-center gap-2.5 text-sm font-semibold text-navy-900">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M7 12h10M10 18h4" />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-gold-500 px-2 py-0.5 text-xs font-bold text-navy-950">{activeFilterCount}</span>
              )}
            </span>
            <span className="flex items-center gap-3">
              {hasActiveFilters && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => { e.stopPropagation(); clearFilters(); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); clearFilters(); } }}
                  className="text-xs font-semibold text-slate-400 hover:text-red-500"
                >
                  Clear all
                </span>
              )}
              <svg
                viewBox="0 0 24 24"
                className={`h-4 w-4 text-slate-400 transition-transform ${filtersOpen ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </button>

          {filtersOpen && (
            <div className="border-t border-slate-100 p-4 sm:p-5">
              <CandidateFiltersBar filters={filters} onChange={setFilters} />
            </div>
          )}
        </Card>

        {error && <div className="mb-4"><ErrorBanner message={error} /></div>}

        <Card className="overflow-hidden">
          <CandidateTable candidates={candidates} loading={loading} />
          {!loading && candidates.length > 0 && (
            <PaginationControls
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
            />
          )}
        </Card>
      </main>
    </div>
  );
}
