import { useState, useEffect, useCallback, useRef } from 'react';
import {
  BarChart3, IndianRupee, Users, Eye, MousePointerClick, Percent, RefreshCw, AlertCircle,
} from 'lucide-react';
import OwnerHeader from '../components/owner/OwnerHeader.jsx';
import Card from '../components/common/Card.jsx';
import { useNoIndex } from '../hooks/useNoIndex.js';
import { useDebouncedValue } from '../hooks/useDebouncedValue.js';
import { fetchBrands } from '../api/ownerCandidates.js';
import {
  fetchMarketingSummary,
  fetchMarketingTrends,
  fetchMarketingComparison,
  fetchMarketingCampaigns,
  fetchMarketingAdsets,
  fetchMarketingAds,
  fetchMarketingSources,
  fetchMarketingLocations,
  fetchMarketingRoles,
  runMetaSync,
  runMetaLeadsSync,
  runSpybotMetaSync,
  runSpybotMetaLeadsSync,
} from '../api/ownerMarketing.js';

const SPYBOT_SLUG = 'spybot-security-services';
import MarketingFiltersBar from '../components/marketing/MarketingFiltersBar.jsx';
import KpiCard from '../components/marketing/KpiCard.jsx';
import TrendChart from '../components/marketing/TrendChart.jsx';
import ComparisonPanel from '../components/marketing/ComparisonPanel.jsx';
import PerformanceTable from '../components/marketing/PerformanceTable.jsx';
import BreakdownTable from '../components/marketing/BreakdownTable.jsx';
import FunnelChart from '../components/marketing/FunnelChart.jsx';
import { formatCurrency, formatNumber, formatPercent } from '../utils/marketingFormat.js';

function defaultDateRange() {
  const until = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 13);
  const fmt = (d) => d.toISOString().slice(0, 10);
  return { dateFrom: fmt(from), dateTo: fmt(until) };
}

const DEFAULT_FILTERS = {
  brand: 'securityjob-in',
  ...defaultDateRange(),
  platform: '',
  source: '',
  campaignId: '',
  adsetId: '',
  adId: '',
  state: '',
  city: '',
  role: '',
};

function SectionCard({ title, children, action }) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm sm:text-base font-bold text-slate-900">{title}</h2>
        {action}
      </div>
      {children}
    </Card>
  );
}

export default function MarketingAnalyticsPage() {
  useNoIndex();

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const debouncedFilters = useDebouncedValue(filters, 350);

  const [brands, setBrands] = useState([]);
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [adsets, setAdsets] = useState([]);
  const [ads, setAds] = useState([]);
  const [sources, setSources] = useState([]);
  const [locations, setLocations] = useState([]);
  const [roles, setRoles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const [leadsSyncing, setLeadsSyncing] = useState(false);
  const [leadsSyncMessage, setLeadsSyncMessage] = useState('');

  useEffect(() => {
    fetchBrands()
      .then((data) => setBrands(data?.data || []))
      .catch(() => {});
  }, []);

  // Every filter change fires a fresh batch of requests, but nothing
  // guarantees they resolve in the order they were sent -- a slower
  // response for stale (previous) filters arriving after a faster response
  // for the current filters would silently overwrite the page with
  // mismatched data (e.g. a "Previous Period Comparison" date range that
  // doesn't correspond to the currently selected Filters). requestIdRef
  // guards against this: only the most recently *fired* request is allowed
  // to apply its results.
  const requestIdRef = useRef(0);

  const loadData = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError('');
    try {
      const [
        summaryRes, trendsRes, comparisonRes,
        campaignsRes, adsetsRes, adsRes,
        sourcesRes, locationsRes, rolesRes,
      ] = await Promise.all([
        fetchMarketingSummary(debouncedFilters),
        fetchMarketingTrends(debouncedFilters),
        fetchMarketingComparison(debouncedFilters),
        fetchMarketingCampaigns(debouncedFilters),
        fetchMarketingAdsets(debouncedFilters),
        fetchMarketingAds(debouncedFilters),
        fetchMarketingSources(debouncedFilters),
        fetchMarketingLocations(debouncedFilters),
        fetchMarketingRoles(debouncedFilters),
      ]);

      if (requestId !== requestIdRef.current) return; // a newer request has already superseded this one

      setSummary(summaryRes.data);
      setTrends(trendsRes.data);
      setComparison(comparisonRes.success ? comparisonRes.data : null);
      setCampaigns(campaignsRes.data.rows);
      setAdsets(adsetsRes.data.rows);
      setAds(adsRes.data.rows);
      setSources(sourcesRes.data.rows);
      setLocations(locationsRes.data.rows);
      setRoles(rolesRes.data.rows);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setError(err?.response?.data?.message || 'Could not load marketing analytics.');
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [debouncedFilters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleSync() {
    setSyncing(true);
    setSyncMessage('');
    try {
      const result = await runMetaSync({ since: filters.dateFrom, until: filters.dateTo });
      if (result.success) {
        setSyncMessage(`Synced ${result.data.synced} ad-day records.`);
        loadData();
      } else if (result.data?.reason === 'not_configured') {
        setSyncMessage('Meta Ads Insights integration is not configured.');
      } else {
        setSyncMessage('Sync failed -- check server logs for details.');
      }
    } catch {
      setSyncMessage('Sync request failed.');
    } finally {
      setSyncing(false);
    }
  }

  async function handleLeadsSync() {
    setLeadsSyncing(true);
    setLeadsSyncMessage('');
    try {
      const result = await runMetaLeadsSync();
      if (result.success) {
        setLeadsSyncMessage(`Synced ${result.data.synced} form lead(s).`);
        loadData();
      } else if (result.data?.reason === 'not_configured') {
        setLeadsSyncMessage('Meta Instant Form leads integration is not configured.');
      } else {
        setLeadsSyncMessage('Sync failed -- check server logs for details.');
      }
    } catch {
      setLeadsSyncMessage('Sync request failed.');
    } finally {
      setLeadsSyncing(false);
    }
  }

  async function handleSpybotSync() {
    setSyncing(true);
    setSyncMessage('');
    try {
      const result = await runSpybotMetaSync({ since: filters.dateFrom, until: filters.dateTo });
      if (result.success) {
        setSyncMessage(`Synced ${result.data.synced} ad-day records.`);
        loadData();
      } else if (result.data?.reason === 'not_configured') {
        setSyncMessage('Spybot Meta Ads Insights integration is not configured.');
      } else {
        setSyncMessage('Sync failed -- check server logs for details.');
      }
    } catch {
      setSyncMessage('Sync request failed.');
    } finally {
      setSyncing(false);
    }
  }

  async function handleSpybotLeadsSync() {
    setLeadsSyncing(true);
    setLeadsSyncMessage('');
    try {
      const result = await runSpybotMetaLeadsSync();
      if (result.success) {
        setLeadsSyncMessage(`Synced ${result.data.synced} form lead(s).`);
        loadData();
      } else if (result.data?.reason === 'not_configured') {
        setLeadsSyncMessage('Spybot Meta Instant Form leads integration is not configured.');
      } else {
        setLeadsSyncMessage('Sync failed -- check server logs for details.');
      }
    } catch {
      setLeadsSyncMessage('Sync request failed.');
    } finally {
      setLeadsSyncing(false);
    }
  }

  const isSpybot = filters.brand === SPYBOT_SLUG;
  const metaConfigured = summary?.metaConfigured ?? false;
  const metaLeadsConfigured = summary?.metaLeadsConfigured ?? false;
  const spybotDbConfigured = summary?.spybotDbConfigured ?? false;
  const hasSyncedData = summary?.hasSyncedData ?? false;
  const leads = summary?.leads;
  const registrationsLabel = isSpybot ? 'Website Enquiries' : 'Website Registrations';
  const roleSectionLabel = isSpybot ? 'Service Type Analytics' : 'Role Analytics';
  const roleColumnLabel = isSpybot ? 'Service Type' : 'Role';

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <OwnerHeader />

      <main className="mx-auto max-w-[1800px] px-4 py-6 sm:px-6 lg:px-10 sm:py-8 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Marketing & Analysis
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Meta Ads performance and website registration attribution
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={isSpybot ? handleSpybotSync : handleSync}
                disabled={syncing}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 shadow-sm transition-all disabled:opacity-60 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing…' : isSpybot ? 'Sync Spybot Ads Data' : 'Sync Meta Ads Data'}
              </button>
              <button
                type="button"
                onClick={isSpybot ? handleSpybotLeadsSync : handleLeadsSync}
                disabled={leadsSyncing}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 shadow-sm transition-all disabled:opacity-60 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${leadsSyncing ? 'animate-spin' : ''}`} />
                {leadsSyncing ? 'Syncing…' : isSpybot ? 'Sync Spybot Form Leads' : 'Sync Meta Form Leads'}
              </button>
            </div>
            {syncMessage && <p className="text-[11px] text-slate-500 max-w-xs text-right">{syncMessage}</p>}
            {leadsSyncMessage && <p className="text-[11px] text-slate-500 max-w-xs text-right">{leadsSyncMessage}</p>}
          </div>
        </div>

        {isSpybot && !spybotDbConfigured && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Spybot's enquiry database isn't connected yet. Website Enquiries and all breakdowns
              below won't be available until <code className="font-mono">SPYBOT_DATABASE_URL</code> is set.
            </span>
          </div>
        )}
        {!metaConfigured && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Meta Ads Insights integration is not configured for this brand. Spend, impressions, reach, and
              click metrics won't be available until{' '}
              <code className="font-mono">{isSpybot ? 'SPYBOT_META_ACCESS_TOKEN' : 'META_ACCESS_TOKEN'}</code>,{' '}
              <code className="font-mono">META_API_VERSION</code>, and{' '}
              <code className="font-mono">{isSpybot ? 'SPYBOT_META_AD_ACCOUNT_ID' : 'META_AD_ACCOUNT_ID'}</code> are
              set. {registrationsLabel} and attribution below are unaffected and fully real.
            </span>
          </div>
        )}
        {metaConfigured && !hasSyncedData && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Meta Ads spend data has not been synced yet for this range. Click "Sync {isSpybot ? 'Spybot' : 'Meta'} Ads Data" above.</span>
          </div>
        )}
        {!metaLeadsConfigured && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Meta Instant Form leads integration is not configured for this brand. Leads submitted directly on
              Facebook/Instagram (never touching the website) won't be counted until{' '}
              <code className="font-mono">{isSpybot ? 'SPYBOT_META_PAGE_ID' : 'META_PAGE_ID'}</code> is set.
            </span>
          </div>
        )}

        <SectionCard title="Total Leads">
          {leads ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide">{registrationsLabel}</p>
                <p className="mt-1 text-2xl font-black text-slate-900">{formatNumber(leads.websiteRegistrations)}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200">
                <p className="text-[11px] font-bold text-purple-700 uppercase tracking-wide">Meta Form Leads</p>
                <p className="mt-1 text-2xl font-black text-slate-900">{formatNumber(leads.metaFormLeads)}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Total Unique Leads</p>
                <p className="mt-1 text-2xl font-black text-slate-900">{formatNumber(leads.totalUniqueLeads)}</p>
                <p className="mt-1 text-[10px] text-slate-400">Website + Meta form, deduplicated by phone number</p>
              </div>
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-slate-400">Loading…</p>
          )}
        </SectionCard>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">{error}</div>
        )}

        <SectionCard title="Filters">
          <MarketingFiltersBar filters={filters} onChange={setFilters} onReset={() => setFilters(DEFAULT_FILTERS)} brands={brands} />
        </SectionCard>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <KpiCard icon={IndianRupee} label="Meta Spend" value={formatCurrency(summary?.kpis?.spend)} accent="blue" />
          <KpiCard icon={Users} label={registrationsLabel} value={formatNumber(summary?.kpis?.registrations)} accent="emerald" />
          <KpiCard icon={Eye} label="Impressions" value={formatNumber(summary?.kpis?.impressions)} accent="sky" />
          <KpiCard icon={Eye} label="Reach" value={formatNumber(summary?.kpis?.reach)} accent="sky" />
          <KpiCard icon={MousePointerClick} label="Link Clicks" value={formatNumber(summary?.kpis?.linkClicks)} accent="purple" />
          <KpiCard icon={Percent} label="CTR" value={formatPercent(summary?.kpis?.ctr)} accent="amber" />
          <KpiCard icon={IndianRupee} label="CPC" value={formatCurrency(summary?.kpis?.cpc)} accent="amber" />
          <KpiCard icon={IndianRupee} label="CPM" value={formatCurrency(summary?.kpis?.cpm)} accent="amber" />
          <KpiCard icon={BarChart3} label="Cost per Registration" value={formatCurrency(summary?.kpis?.costPerRegistration)} accent="rose" />
        </div>

        <SectionCard title="Marketing Funnel">
          <FunnelChart funnel={summary?.funnel || {}} metaConfigured={metaConfigured} registrationsLabel={registrationsLabel} />
        </SectionCard>

        <SectionCard title="Performance Trend">
          <TrendChart series={trends?.series} metaConfigured={metaConfigured} registrationsLabel={registrationsLabel} />
        </SectionCard>

        <SectionCard title="Previous Period Comparison">
          {comparison ? (
            <ComparisonPanel comparison={comparison} registrationsLabel={registrationsLabel} />
          ) : (
            <p className="py-6 text-center text-sm text-slate-400">
              Select a From Date and To Date to see period comparison.
            </p>
          )}
        </SectionCard>

        <SectionCard title="Campaign Performance">
          <PerformanceTable title="Campaign Performance" idLabel="Campaign" rows={campaigns} registrationsLabel={registrationsLabel} />
        </SectionCard>

        <SectionCard title="Ad Set Performance">
          <PerformanceTable title="Ad Set Performance" idLabel="Ad Set" rows={adsets} showParents registrationsLabel={registrationsLabel} />
        </SectionCard>

        <SectionCard title="Ad Performance">
          <PerformanceTable title="Ad Performance" idLabel="Ad" rows={ads} showParents registrationsLabel={registrationsLabel} />
        </SectionCard>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SectionCard title="Source Analytics">
            <BreakdownTable
              columns={{ label: 'Source', share: true }}
              rows={sources}
              getKey={(r) => r.source}
              getLabel={(r) => r.source}
              showSpend
              registrationsLabel={registrationsLabel}
            />
          </SectionCard>

          <SectionCard title="Location Analytics">
            <BreakdownTable
              columns={{ label: 'Location' }}
              rows={locations}
              getKey={(r) => `${r.state}-${r.district}`}
              getLabel={(r) => `${r.district || '—'}, ${r.state || '—'}`}
              registrationsLabel={registrationsLabel}
            />
          </SectionCard>

          <SectionCard title={roleSectionLabel}>
            <BreakdownTable
              columns={{ label: roleColumnLabel }}
              rows={roles}
              getKey={(r) => r.role}
              getLabel={(r) => r.role}
              registrationsLabel={registrationsLabel}
            />
          </SectionCard>
        </div>

        {loading && <p className="text-center text-xs text-slate-400 py-4">Loading…</p>}
      </main>
    </div>
  );
}
