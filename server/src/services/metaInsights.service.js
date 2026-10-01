import env from '../config/env.js';
import logger from '../config/logger.js';
import query from '../db/query.js';
import { getBrandIdBySlug } from '../modules/candidates/candidates.repository.js';

const FETCH_TIMEOUT_MS = 15000;
const INSIGHTS_FIELDS = [
  'campaign_id', 'campaign_name',
  'adset_id', 'adset_name',
  'ad_id', 'ad_name',
  'spend', 'impressions', 'reach', 'clicks', 'inline_link_clicks', 'actions',
].join(',');

// Resolved per brand slug and cached -- every brand this sync ever serves
// (SecurityJob.in, and now Spybot) has its own fixed slug, so a lookup
// failure for one brand falls back to null without affecting the other.
const cachedBrandIds = new Map();
async function resolveBrandId(slug) {
  if (cachedBrandIds.has(slug)) return cachedBrandIds.get(slug);
  let brandId;
  try {
    brandId = await getBrandIdBySlug(slug);
  } catch (error) {
    logger.warn('Could not resolve brand id for Meta Insights sync', { slug, message: error?.message });
    brandId = null;
  }
  cachedBrandIds.set(slug, brandId);
  return brandId;
}

function extractLandingPageViews(actions) {
  if (!Array.isArray(actions)) return 0;
  const match = actions.find((a) => a.action_type === 'landing_page_view');
  return match ? Number(match.value) || 0 : 0;
}

function defaultDateRange() {
  // Meta attributes conversions up to a few days after the click/view, so a
  // short trailing window is re-synced by default to pick up late
  // attribution on recent days, not just append brand-new days.
  const until = new Date();
  const since = new Date();
  since.setDate(since.getDate() - 7);
  const fmt = (d) => d.toISOString().slice(0, 10);
  return { since: fmt(since), until: fmt(until) };
}

async function fetchWithTimeout(url, accessToken) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const resp = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: controller.signal,
    });
    return resp;
  } finally {
    clearTimeout(timer);
  }
}

async function upsertInsightRow(brandId, accountId, row) {
  await query(
    `INSERT INTO meta_insights_daily (
      brand_id, date, platform, account_id, campaign_id, campaign_name,
      adset_id, adset_name, ad_id, ad_name, spend, impressions, reach,
      clicks, link_clicks, landing_page_views, updated_at
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16, now())
    ON CONFLICT (brand_id, date, ad_id) DO UPDATE SET
      campaign_name = EXCLUDED.campaign_name,
      adset_name = EXCLUDED.adset_name,
      ad_name = EXCLUDED.ad_name,
      spend = EXCLUDED.spend,
      impressions = EXCLUDED.impressions,
      reach = EXCLUDED.reach,
      clicks = EXCLUDED.clicks,
      link_clicks = EXCLUDED.link_clicks,
      landing_page_views = EXCLUDED.landing_page_views,
      updated_at = now()`,
    [
      brandId,
      row.date_start,
      // Meta's ad-level insights (without a publisher_platform breakdown)
      // don't distinguish Facebook vs Instagram placements per row -- 'meta'
      // honestly represents "the Meta network as a whole" rather than
      // fabricating a platform split this sync doesn't actually have.
      'meta',
      accountId,
      row.campaign_id || null,
      row.campaign_name || null,
      row.adset_id || null,
      row.adset_name || null,
      row.ad_id,
      row.ad_name || null,
      Number(row.spend) || 0,
      Number(row.impressions) || 0,
      Number(row.reach) || 0,
      Number(row.clicks) || 0,
      Number(row.inline_link_clicks) || 0,
      extractLandingPageViews(row.actions),
    ]
  );
}

/**
 * Syncs Meta Ads Insights (spend/impressions/reach/clicks/link clicks/
 * landing page views) at ad-level daily granularity into meta_insights_daily.
 * Never throws -- every failure path is caught and returned as a result
 * object rather than propagated, matching the CAPI service's non-critical
 * dependency pattern. Safe to call repeatedly: every row is an upsert keyed
 * on (brand_id, date, ad_id), so re-syncing the same range never duplicates.
 *
 * Defaults to SecurityJob.in's own credentials/brand so existing call sites
 * are unaffected; pass brandSlug/accessToken/apiVersion/adAccountId to sync
 * a different brand's (e.g. Spybot's) separate Meta Business Portfolio.
 */
export async function syncMetaInsights({
  since,
  until,
  brandSlug = 'securityjob-in',
  accessToken = env.metaAccessToken,
  apiVersion = env.metaApiVersion,
  adAccountId = env.metaAdAccountId,
} = {}) {
  if (!accessToken) {
    logger.warn('Meta Insights sync skipped: access token not configured', { brandSlug });
    return { success: false, reason: 'not_configured', synced: 0 };
  }
  if (!apiVersion) {
    logger.warn('Meta Insights sync skipped: API version not configured', { brandSlug });
    return { success: false, reason: 'not_configured', synced: 0 };
  }
  if (!adAccountId) {
    logger.warn('Meta Insights sync skipped: ad account id not configured', { brandSlug });
    return { success: false, reason: 'not_configured', synced: 0 };
  }

  const brandId = await resolveBrandId(brandSlug);
  const range = since && until ? { since, until } : defaultDateRange();

  const timeRange = encodeURIComponent(JSON.stringify({ since: range.since, until: range.until }));
  let url =
    `https://graph.facebook.com/${apiVersion}/act_${adAccountId}/insights` +
    `?level=ad&time_increment=1&limit=500&time_range=${timeRange}&fields=${INSIGHTS_FIELDS}`;

  let synced = 0;
  let pages = 0;
  const MAX_PAGES = 50; // guards against an unbounded paging loop

  try {
    while (url && pages < MAX_PAGES) {
      const resp = await fetchWithTimeout(url, accessToken);
      pages += 1;

      if (!resp.ok) {
        const errBody = await resp.text().catch(() => '');
        logger.error('Meta Insights sync failed', { brandSlug, status: resp.status, body: errBody.slice(0, 300) });
        return { success: false, reason: 'meta_api_error', synced };
      }

      const json = await resp.json();
      for (const row of json.data || []) {
        try {
          await upsertInsightRow(brandId, adAccountId, row);
          synced += 1;
        } catch (rowError) {
          logger.error('Meta Insights row upsert failed', { brandSlug, adId: row.ad_id, message: rowError?.message });
        }
      }

      url = json.paging?.next || null;
    }
  } catch (error) {
    logger.error('Meta Insights sync error', { brandSlug, message: error?.message });
    return { success: false, reason: 'network_error', synced };
  }

  logger.info('Meta Insights sync complete', { brandSlug, synced, since: range.since, until: range.until });
  return { success: true, synced, since: range.since, until: range.until };
}

export default { syncMetaInsights };
