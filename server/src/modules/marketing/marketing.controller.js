import { asyncHandler, AppError } from '../../middleware/error.middleware.js';
import env from '../../config/env.js';
import safeDivide from '../../utils/safe-math.js';
import { syncMetaInsights } from '../../services/metaInsights.service.js';
import { syncMetaFormLeads } from '../../services/metaFormLeads.service.js';
import {
  getInsightsTotals,
  getRegistrationCount,
  getInsightsTrend,
  getRegistrationTrend,
  getCampaignPerformance,
  getAdsetPerformance,
  getAdPerformance,
  getSourceAnalytics,
  getLocationAnalytics,
  getRoleAnalytics,
  getMetaFormLeadsTotals,
} from './marketing.repository.js';

const SPYBOT_SLUG = 'spybot-security-services';
function isSpybotBrand(filters) {
  return filters?.brand === SPYBOT_SLUG;
}

function isMetaInsightsConfigured(filters) {
  if (isSpybotBrand(filters)) {
    return Boolean(env.spybotMetaAccessToken && env.metaApiVersion && env.spybotMetaAdAccountId);
  }
  return Boolean(env.metaAccessToken && env.metaApiVersion && env.metaAdAccountId);
}

function isSpybotDbConfigured() {
  return Boolean(env.spybotDatabaseUrl);
}

// COALESCE(SUM(...), 0) in the SQL makes "no rows matched" and "rows
// matched but spend was genuinely 0" both come back as the number 0 --
// indistinguishable at the SQL layer. hasInsightsData (row_count > 0)
// is the only reliable signal for which case we're in, so every
// spend-derived field is gated on it: null ("unavailable"), never a
// fabricated 0, when nothing was actually synced for this filter/range.
function shapeTotals(insightsTotals, registrations, hasInsightsData) {
  const spend = hasInsightsData ? Number(insightsTotals.spend) : null;
  const impressions = hasInsightsData ? Number(insightsTotals.impressions) : null;
  const reach = hasInsightsData ? Number(insightsTotals.reach) : null;
  const clicks = hasInsightsData ? Number(insightsTotals.clicks) : null;
  const linkClicks = hasInsightsData ? Number(insightsTotals.link_clicks) : null;
  const landingPageViews = hasInsightsData ? Number(insightsTotals.landing_page_views) : null;

  return {
    spend,
    impressions,
    reach,
    clicks,
    linkClicks,
    landingPageViews,
    registrations,
    ctr: safeDivide(linkClicks, impressions, { multiplier: 100 }),
    cpc: safeDivide(spend, linkClicks),
    cpm: safeDivide(spend, impressions, { multiplier: 1000 }),
    costPerRegistration: safeDivide(spend, registrations),
    websiteConversionRate: safeDivide(registrations, landingPageViews, { multiplier: 100 }),
  };
}

function isMetaLeadsConfigured(filters) {
  if (isSpybotBrand(filters)) {
    return Boolean(env.spybotMetaAccessToken && env.metaApiVersion && env.spybotMetaPageId);
  }
  return Boolean(env.metaAccessToken && env.metaApiVersion && env.metaPageId);
}

export const getSummary = asyncHandler(async (req, res) => {
  const filters = req.query;
  const [insightsTotals, registrations, formLeads] = await Promise.all([
    getInsightsTotals(filters),
    getRegistrationCount(filters),
    getMetaFormLeadsTotals(filters),
  ]);

  const hasSyncedData = Number(insightsTotals.row_count) > 0;
  const kpis = shapeTotals(insightsTotals, registrations, hasSyncedData);

  res.json({
    success: true,
    data: {
      metaConfigured: isMetaInsightsConfigured(filters),
      metaLeadsConfigured: isMetaLeadsConfigured(filters),
      spybotDbConfigured: isSpybotDbConfigured(),
      hasSyncedData,
      kpis,
      // Two genuinely separate channels, shown honestly rather than merged
      // into one guessed number: someone can submit a Meta Instant Form
      // without ever visiting the website, or vice versa. totalUniqueLeads
      // excludes form leads whose phone already matches a website
      // registration, so a person who did both is never double-counted.
      leads: {
        websiteRegistrations: registrations,
        metaFormLeads: formLeads.total,
        metaFormLeadsUniqueOfWebsite: formLeads.uniqueOfWebsite,
        totalUniqueLeads: registrations + formLeads.uniqueOfWebsite,
      },
      funnel: {
        impressions: kpis.impressions,
        linkClicks: kpis.linkClicks,
        landingPageViews: kpis.landingPageViews,
        registrations: kpis.registrations,
      },
    },
  });
});

export const getTrends = asyncHandler(async (req, res) => {
  const filters = req.query;
  const [insightsTrend, regTrend] = await Promise.all([
    getInsightsTrend(filters),
    getRegistrationTrend(filters),
  ]);

  const byDate = new Map();
  for (const row of insightsTrend) {
    byDate.set(row.date, {
      date: row.date,
      spend: Number(row.spend),
      impressions: Number(row.impressions),
      linkClicks: Number(row.link_clicks),
      clicks: Number(row.clicks),
      registrations: 0,
    });
  }
  for (const row of regTrend) {
    const existing = byDate.get(row.date) || {
      date: row.date, spend: 0, impressions: 0, linkClicks: 0, clicks: 0, registrations: 0,
    };
    existing.registrations = Number(row.registrations);
    byDate.set(row.date, existing);
  }

  const series = [...byDate.values()]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((d) => ({
      ...d,
      ctr: safeDivide(d.linkClicks, d.impressions, { multiplier: 100 }),
      cpc: safeDivide(d.spend, d.linkClicks),
      cpm: safeDivide(d.spend, d.impressions, { multiplier: 1000 }),
      costPerRegistration: safeDivide(d.spend, d.registrations),
    }));

  res.json({ success: true, data: { metaConfigured: isMetaInsightsConfigured(filters), series } });
});

function previousPeriodRange(dateFrom, dateTo) {
  const from = new Date(`${dateFrom}T00:00:00Z`);
  const to = new Date(`${dateTo}T00:00:00Z`);
  const spanMs = to.getTime() - from.getTime();
  const prevTo = new Date(from.getTime() - 24 * 60 * 60 * 1000);
  const prevFrom = new Date(prevTo.getTime() - spanMs);
  const fmt = (d) => d.toISOString().slice(0, 10);
  return { dateFrom: fmt(prevFrom), dateTo: fmt(prevTo) };
}

function pctChange(curVal, prevVal) {
  if (curVal === null || prevVal === null || prevVal === 0) return null;
  return safeDivide(curVal - prevVal, prevVal, { multiplier: 100 });
}

export const getComparison = asyncHandler(async (req, res) => {
  const filters = req.query;
  if (!filters.dateFrom || !filters.dateTo) {
    throw new AppError('dateFrom and dateTo are required for period comparison.', 422, {
      dateFrom: 'Required', dateTo: 'Required',
    });
  }

  const prevRange = previousPeriodRange(filters.dateFrom, filters.dateTo);
  const previousFilters = { ...filters, dateFrom: prevRange.dateFrom, dateTo: prevRange.dateTo };

  const [curInsights, curRegs, prevInsights, prevRegs] = await Promise.all([
    getInsightsTotals(filters),
    getRegistrationCount(filters),
    getInsightsTotals(previousFilters),
    getRegistrationCount(previousFilters),
  ]);

  const current = shapeTotals(curInsights, curRegs, Number(curInsights.row_count) > 0);
  const previous = shapeTotals(prevInsights, prevRegs, Number(prevInsights.row_count) > 0);

  const change = {};
  for (const key of Object.keys(current)) {
    change[key] = pctChange(current[key], previous[key]);
  }

  res.json({
    success: true,
    data: { metaConfigured: isMetaInsightsConfigured(filters), current, previous, change, previousPeriod: prevRange },
  });
});

function shapePerformanceRow(row) {
  // hasSpendData distinguishes "this campaign/adset/ad has real synced
  // Meta spend" from "we only know about it because a candidate's first
  // submission referenced this id" -- the latter must show spend/CTR/CPC/
  // CPM as unavailable, not as a fabricated 0.
  const { hasSpendData, ...rest } = row;
  return {
    ...rest,
    spend: hasSpendData ? row.spend : null,
    impressions: hasSpendData ? row.impressions : null,
    reach: hasSpendData ? row.reach : null,
    linkClicks: hasSpendData ? row.linkClicks : null,
    clicks: hasSpendData ? row.clicks : null,
    ctr: hasSpendData ? safeDivide(row.linkClicks, row.impressions, { multiplier: 100 }) : null,
    cpc: hasSpendData ? safeDivide(row.spend, row.linkClicks) : null,
    cpm: hasSpendData ? safeDivide(row.spend, row.impressions, { multiplier: 1000 }) : null,
    costPerRegistration: hasSpendData ? safeDivide(row.spend, row.registrations) : null,
  };
}

function mergePerformanceRows(insightsRows, regRows) {
  const byId = new Map();
  for (const row of insightsRows) {
    byId.set(row.id, {
      id: row.id,
      name: row.name,
      campaignId: row.campaign_id ?? null,
      campaignName: row.campaign_name ?? null,
      adsetId: row.adset_id ?? null,
      adsetName: row.adset_name ?? null,
      spend: Number(row.spend),
      impressions: Number(row.impressions),
      reach: Number(row.reach),
      linkClicks: Number(row.link_clicks),
      clicks: Number(row.clicks),
      registrations: 0,
      hasSpendData: true,
    });
  }
  for (const row of regRows) {
    const existing = byId.get(row.id) || {
      id: row.id, name: null, campaignId: null, campaignName: null, adsetId: null, adsetName: null,
      spend: 0, impressions: 0, reach: 0, linkClicks: 0, clicks: 0, registrations: 0, hasSpendData: false,
    };
    existing.registrations = Number(row.registrations);
    byId.set(row.id, existing);
  }
  return [...byId.values()]
    .map(shapePerformanceRow)
    .sort((a, b) => (b.spend ?? -1) - (a.spend ?? -1) || b.registrations - a.registrations);
}

export const getCampaigns = asyncHandler(async (req, res) => {
  const { insights, registrations } = await getCampaignPerformance(req.query);
  res.json({
    success: true,
    data: { metaConfigured: isMetaInsightsConfigured(req.query), rows: mergePerformanceRows(insights, registrations) },
  });
});

export const getAdsets = asyncHandler(async (req, res) => {
  const { insights, registrations } = await getAdsetPerformance(req.query);
  res.json({
    success: true,
    data: { metaConfigured: isMetaInsightsConfigured(req.query), rows: mergePerformanceRows(insights, registrations) },
  });
});

export const getAds = asyncHandler(async (req, res) => {
  const { insights, registrations } = await getAdPerformance(req.query);
  res.json({
    success: true,
    data: { metaConfigured: isMetaInsightsConfigured(req.query), rows: mergePerformanceRows(insights, registrations) },
  });
});

export const getSources = asyncHandler(async (req, res) => {
  const rows = await getSourceAnalytics(req.query);
  const total = rows.reduce((sum, r) => sum + r.registrations, 0);
  res.json({
    success: true,
    data: {
      metaConfigured: isMetaInsightsConfigured(req.query),
      rows: rows.map((r) => ({
        ...r,
        sharePct: safeDivide(r.registrations, total, { multiplier: 100 }),
        costPerRegistration: r.spend === null ? null : safeDivide(r.spend, r.registrations),
      })),
    },
  });
});

export const getLocations = asyncHandler(async (req, res) => {
  // Meta's ad-level insights carry no geographic breakdown in this sync, so
  // spend is never attached to a location -- only real registration counts.
  const rows = await getLocationAnalytics(req.query);
  res.json({
    success: true,
    data: { rows: rows.map((r) => ({ state: r.state, district: r.district, registrations: Number(r.registrations) })) },
  });
});

export const getRoles = asyncHandler(async (req, res) => {
  // Same reasoning as locations -- role is not a Meta ad dimension we sync.
  // For Spybot this returns service types under the same "role" field name
  // (see marketing.repository.js), relabeled "Service Type Analytics" in the UI.
  const rows = await getRoleAnalytics(req.query);
  res.json({
    success: true,
    data: { rows: rows.map((r) => ({ role: r.role, registrations: Number(r.registrations) })) },
  });
});

export const runMetaSync = asyncHandler(async (req, res) => {
  const { since, until } = req.body || {};
  const result = await syncMetaInsights({ since, until });
  res.json({ success: result.success, data: result });
});

export const runMetaLeadsSync = asyncHandler(async (req, res) => {
  const result = await syncMetaFormLeads();
  res.json({ success: result.success, data: result });
});

export const runSpybotMetaSync = asyncHandler(async (req, res) => {
  const { since, until } = req.body || {};
  const result = await syncMetaInsights({
    since,
    until,
    brandSlug: SPYBOT_SLUG,
    accessToken: env.spybotMetaAccessToken,
    apiVersion: env.metaApiVersion,
    adAccountId: env.spybotMetaAdAccountId,
  });
  res.json({ success: result.success, data: result });
});

export const runSpybotMetaLeadsSync = asyncHandler(async (req, res) => {
  const result = await syncMetaFormLeads({
    brandSlug: SPYBOT_SLUG,
    accessToken: env.spybotMetaAccessToken,
    apiVersion: env.metaApiVersion,
    pageId: env.spybotMetaPageId,
  });
  res.json({ success: result.success, data: result });
});

// TEMPORARY diagnostic route -- checks what the configured access token is
// actually authorized for (scopes, expiry, app id) directly from Meta,
// without exposing the token itself in the response. Remove once the
// Meta Ads Insights access issue is diagnosed.
export const debugMetaToken = asyncHandler(async (req, res) => {
  const [tokenDebug, adAccountCheck] = await Promise.all([
    fetch(
      `https://graph.facebook.com/${env.metaApiVersion}/debug_token?input_token=${env.metaAccessToken}&access_token=${env.metaAccessToken}`
    ).then((r) => r.json()),
    fetch(
      `https://graph.facebook.com/${env.metaApiVersion}/act_${env.metaAdAccountId}?fields=name,account_status&access_token=${env.metaAccessToken}`
    ).then((r) => r.json()),
  ]);

  res.json({
    success: true,
    data: {
      tokenScopes: tokenDebug?.data?.scopes || null,
      tokenType: tokenDebug?.data?.type || null,
      tokenAppId: tokenDebug?.data?.app_id || null,
      tokenIsValid: tokenDebug?.data?.is_valid ?? null,
      tokenExpiresAt: tokenDebug?.data?.expires_at ?? null,
      tokenError: tokenDebug?.data?.error || tokenDebug?.error || null,
      adAccountAccess: adAccountCheck?.error ? null : adAccountCheck,
      adAccountError: adAccountCheck?.error || null,
    },
  });
});
