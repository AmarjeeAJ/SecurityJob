import { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Filter,
  Download,
  FileSpreadsheet,
  RotateCcw,
  ChevronDown,
  Users,
  ShieldCheck,
  CheckCircle2,
  UserPlus,
  X
} from 'lucide-react';
import { fetchCandidates, buildExportCsvUrl } from '../api/ownerCandidates.js';
import { useDebouncedValue } from '../hooks/useDebouncedValue.js';
import OwnerHeader from '../components/owner/OwnerHeader.jsx';
import CandidateFiltersBar from '../components/owner/CandidateFiltersBar.jsx';
import CandidateTable from '../components/owner/CandidateTable.jsx';
import PaginationControls from '../components/owner/PaginationControls.jsx';
import Card from '../components/common/Card.jsx';
import ErrorBanner from '../components/form/ErrorBanner.jsx';
import { useNoIndex } from '../hooks/useNoIndex.js';

const DEFAULT_FILTERS = {
  search: '',
  state: '',
  city: '',
  subdivision: '',
  role: '',
  source: '',
  dateFrom: '',
  dateTo: '',
  duplicateOnly: false,
  sortBy: 'latest_submission',
  sortDir: 'desc',
  page: 1,
  pageSize: 25,
};

export default function CandidateRecordsPage() {
  useNoIndex();
  const location = useLocation();
  const navigate = useNavigate();

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [candidates, setCandidates] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [latestCandidate, setLatestCandidate] = useState(null);
  const latestCandidateIdRef = useRef(null);

  const [successBanner, setSuccessBanner] = useState(location.state?.successMessage || '');

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessBanner(location.state.successMessage);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const debouncedSearch = useDebouncedValue(filters.search, 350);
  const debouncedCity = useDebouncedValue(filters.city, 350);
  const debouncedSource = useDebouncedValue(filters.source, 350);

  // `silent` skips the loading skeleton — used for the background poll so
  // the table doesn't flicker every time it refreshes on its own.
  const loadCandidates = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError('');
    try {
      const queryFilters = {
        ...filters,
        search: debouncedSearch,
        city: debouncedCity,
        source: debouncedSource,
      };
      const data = await fetchCandidates(queryFilters);
      setCandidates(data.data);
      setPagination(data.pagination);
    } catch (err) {
      if (!silent) setError(err?.response?.data?.message || 'Could not load candidate records.');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [filters, debouncedSearch, debouncedCity, debouncedSource]);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  // Live updates without a manual page refresh: poll the current (filtered)
  // list and the single most-recent registration in the background. This
  // project has no WebSocket/Socket.IO server wired up despite the
  // dashboard needing a refresh to see new registrations — polling is a
  // simpler, dependency-free way to get the same "no refresh needed"
  // result without standing up new realtime infrastructure.
  useEffect(() => {
    const POLL_MS = 20000;
    const timer = setInterval(() => {
      loadCandidates(true);
      fetchCandidates({ sortBy: 'latest_submission', sortDir: 'desc', page: 1, pageSize: 1 })
        .then((data) => {
          const latest = data?.data?.[0];
          if (latest && latest.id !== latestCandidateIdRef.current) {
            latestCandidateIdRef.current = latest.id;
            setLatestCandidate(latest);
          }
        })
        .catch(() => {
          // Non-blocking — the badge just won't update this cycle.
        });
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [loadCandidates]);

  // Fetch the latest-registered candidate once on mount so the badge shows
  // immediately, without waiting for the first poll cycle.
  useEffect(() => {
    fetchCandidates({ sortBy: 'latest_submission', sortDir: 'desc', page: 1, pageSize: 1 })
      .then((data) => {
        const latest = data?.data?.[0];
        if (latest) {
          latestCandidateIdRef.current = latest.id;
          setLatestCandidate(latest);
        }
      })
      .catch(() => {
        // Non-blocking
      });
  }, []);

  const activeExportFilters = {
    search: debouncedSearch,
    state: filters.state,
    city: debouncedCity,
    subdivision: filters.subdivision,
    role: filters.role,
    source: debouncedSource,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    duplicateOnly: filters.duplicateOnly,
    sortBy: filters.sortBy,
    sortDir: filters.sortDir,
  };

  const activeFilterCount = [
    debouncedSearch, filters.state, debouncedCity, filters.subdivision, filters.role, debouncedSource, filters.dateFrom, filters.dateTo, filters.duplicateOnly,
  ].filter(Boolean).length;
  const hasActiveFilters = activeFilterCount > 0;

  function clearFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <OwnerHeader />

      <main className="mx-auto max-w-[1800px] px-4 py-6 sm:px-6 lg:px-10 sm:py-8 space-y-6">
        {/* Page Top Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Candidate Records
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
                Live Data
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              {loading ? 'Fetching records…' : `${pagination.total} registered candidate${pagination.total === 1 ? '' : 's'}`}
              {hasActiveFilters && !loading && ' matching active filters'}
            </p>
          </div>

          {/* Export CSV Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <a 
              href={buildExportCsvUrl({})} 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-2xs transition-all hover:border-slate-400"
            >
              <Download className="w-4 h-4 text-slate-500" />
              Download All
            </a>
            <a 
              href={buildExportCsvUrl(activeExportFilters)} 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-sm shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <FileSpreadsheet className="w-4 h-4 text-white" />
              Download Filtered ({pagination.total})
            </a>
          </div>
        </div>

        {/* Success Toast Banner */}
        {successBanner && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 flex items-center justify-between text-sm text-emerald-800 shadow-xs">
            <div className="flex items-center gap-2.5 font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successBanner}</span>
            </div>
            <button
              type="button"
              onClick={() => setSuccessBanner('')}
              className="text-emerald-600 hover:text-emerald-900 p-1 rounded-lg transition-colors cursor-pointer"
              title="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Latest Registration Capsule */}
        {latestCandidate && (
          <button
            type="button"
            onClick={() => navigate(`/owner/candidates/${latestCandidate.id}`)}
            className="inline-flex w-full sm:w-auto items-center gap-2.5 rounded-full bg-emerald-50 border border-emerald-200 pl-2 pr-4 py-1.5 text-left hover:bg-emerald-100/80 hover:border-emerald-300 transition-colors cursor-pointer"
            title="Open this candidate's record"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="p-1 rounded-full bg-emerald-100 text-emerald-700 shrink-0">
              <UserPlus className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-semibold text-emerald-900 truncate">
              Latest Registration: <span className="font-bold">{latestCandidate.fullName}</span>
            </span>
            <span className="font-mono text-[11px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
              {latestCandidate.candidateCode}
            </span>
          </button>
        )}

        {/* Modern Filter Card */}
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            className="flex w-full items-center justify-between gap-3 px-5 py-3.5 bg-slate-50/70 hover:bg-slate-100/70 text-left transition-colors cursor-pointer border-b border-slate-100"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <Filter className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-900">
                Operational Filters & Search
              </span>
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-bold text-white shadow-xs">
                  {activeFilterCount} active
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {hasActiveFilters && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => { e.stopPropagation(); clearFilters(); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); clearFilters(); } }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Clear all
                </span>
              )}
              <ChevronDown
                className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${filtersOpen ? 'rotate-180' : ''}`}
              />
            </div>
          </button>

          {filtersOpen && (
            <div className="p-5 sm:p-6 bg-white">
              <CandidateFiltersBar 
                filters={filters} 
                onChange={setFilters} 
                onReset={clearFilters} 
              />
            </div>
          )}
        </div>

        {error && <div className="mb-4"><ErrorBanner message={error} /></div>}

        {/* Candidates Table Card */}
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden">
          <CandidateTable candidates={candidates} loading={loading} />
          {!loading && candidates.length > 0 && (
            <PaginationControls
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              pageSize={filters.pageSize}
              onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
            />
          )}
        </div>
      </main>
    </div>
  );
}
