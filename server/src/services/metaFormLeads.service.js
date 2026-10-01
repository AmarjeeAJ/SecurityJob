import env from '../config/env.js';
import logger from '../config/logger.js';
import query from '../db/query.js';
import normalizeIndianMobile from '../utils/phone-normalizer.js';
import { getBrandIdBySlug } from '../modules/candidates/candidates.repository.js';

const FETCH_TIMEOUT_MS = 15000;
const MAX_PAGES_PER_FORM = 50;
const LEAD_FIELDS = [
  'id', 'form_id', 'ad_id', 'ad_name', 'adset_id', 'adset_name',
  'campaign_id', 'campaign_name', 'field_data', 'created_time',
].join(',');

// Resolved per brand slug and cached -- each brand this sync serves
// (SecurityJob.in, and now Spybot) has its own fixed slug.
const cachedBrandIds = new Map();
async function resolveBrandId(slug) {
  if (cachedBrandIds.has(slug)) return cachedBrandIds.get(slug);
  let brandId;
  try {
    brandId = await getBrandIdBySlug(slug);
  } catch (error) {
    logger.warn('Could not resolve brand id for Meta Form Leads sync', { slug, message: error?.message });
    brandId = null;
  }
  cachedBrandIds.set(slug, brandId);
  return brandId;
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// Leads Retrieval requires a Page-scoped access token, not the ad-account
// level token used for CAPI/Insights -- exchanged from the same underlying
// System User token, which must have been granted access to this Page with
// the leads_retrieval permission in Business Settings.
async function getPageAccessToken(apiVersion, pageId, accessToken) {
  const url =
    `https://graph.facebook.com/${apiVersion}/${pageId}` +
    `?fields=access_token&access_token=${accessToken}`;
  const resp = await fetchWithTimeout(url);
  const json = await resp.json();
  if (!resp.ok || !json.access_token) {
    const errBody = JSON.stringify(json).slice(0, 300);
    logger.error('Meta Form Leads sync: could not obtain Page access token', { status: resp.status, body: errBody });
    return null;
  }
  return json.access_token;
}

async function listLeadForms(apiVersion, pageId, pageAccessToken) {
  const url =
    `https://graph.facebook.com/${apiVersion}/${pageId}/leadgen_forms` +
    `?fields=id,name&limit=200&access_token=${pageAccessToken}`;
  const resp = await fetchWithTimeout(url);
  const json = await resp.json();
  if (!resp.ok) {
    const errBody = JSON.stringify(json).slice(0, 300);
    logger.error('Meta Form Leads sync: could not list lead forms', { status: resp.status, body: errBody });
    return [];
  }
  return json.data || [];
}

function fieldValue(fieldData, key) {
  if (!Array.isArray(fieldData)) return null;
  const match = fieldData.find((f) => f.name === key);
  return match?.values?.[0] || null;
}

async function upsertLead(brandId, formId, formName, lead) {
  const fullName = fieldValue(lead.field_data, 'full_name') || fieldValue(lead.field_data, 'name');
  const rawPhone = fieldValue(lead.field_data, 'phone_number');
  const email = fieldValue(lead.field_data, 'email');
  const normalizedPhone = normalizeIndianMobile(rawPhone);

  await query(
    `INSERT INTO meta_form_leads (
      brand_id, leadgen_id, form_id, form_name, campaign_id, campaign_name,
      adset_id, adset_name, ad_id, ad_name, full_name, phone_number,
      normalized_phone, email, field_data, created_time
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
    ON CONFLICT (leadgen_id) DO NOTHING`,
    [
      brandId,
      lead.id,
      formId,
      formName || null,
      lead.campaign_id || null,
      lead.campaign_name || null,
      lead.adset_id || null,
      lead.adset_name || null,
      lead.ad_id || null,
      lead.ad_name || null,
      fullName,
      rawPhone,
      normalizedPhone,
      email,
      JSON.stringify(lead.field_data || []),
      lead.created_time || null,
    ]
  );
}

/**
 * Syncs Meta native Instant Form leads (submitted directly on Facebook/
 * Instagram, never touching the website) into meta_form_leads. Never
 * throws -- every failure path is caught and returned as a result object,
 * matching the CAPI/Insights services' non-critical dependency pattern.
 * Safe to call repeatedly: every row is keyed on the Meta-assigned
 * leadgen_id (UNIQUE), so re-syncing never duplicates.
 *
 * Defaults to SecurityJob.in's own credentials/brand so existing call sites
 * are unaffected; pass brandSlug/accessToken/apiVersion/pageId to sync a
 * different brand's (e.g. Spybot's) separate Meta Page.
 */
export async function syncMetaFormLeads({
  brandSlug = 'securityjob-in',
  accessToken = env.metaAccessToken,
  apiVersion = env.metaApiVersion,
  pageId = env.metaPageId,
} = {}) {
  if (!accessToken || !apiVersion) {
    logger.warn('Meta Form Leads sync skipped: access token/API version not configured', { brandSlug });
    return { success: false, reason: 'not_configured', synced: 0 };
  }
  if (!pageId) {
    logger.warn('Meta Form Leads sync skipped: Page id not configured', { brandSlug });
    return { success: false, reason: 'not_configured', synced: 0 };
  }

  const brandId = await resolveBrandId(brandSlug);

  try {
    const pageAccessToken = await getPageAccessToken(apiVersion, pageId, accessToken);
    if (!pageAccessToken) {
      return { success: false, reason: 'meta_api_error', synced: 0 };
    }

    const forms = await listLeadForms(apiVersion, pageId, pageAccessToken);
    let synced = 0;

    for (const form of forms) {
      let url =
        `https://graph.facebook.com/${apiVersion}/${form.id}/leads` +
        `?fields=${LEAD_FIELDS}&limit=100&access_token=${pageAccessToken}`;
      let pages = 0;

      while (url && pages < MAX_PAGES_PER_FORM) {
        const resp = await fetchWithTimeout(url);
        pages += 1;

        if (!resp.ok) {
          const errBody = await resp.text().catch(() => '');
          logger.error('Meta Form Leads sync failed for form', { brandSlug, formId: form.id, status: resp.status, body: errBody.slice(0, 300) });
          break;
        }

        const json = await resp.json();
        for (const lead of json.data || []) {
          try {
            await upsertLead(brandId, form.id, form.name, lead);
            synced += 1;
          } catch (rowError) {
            logger.error('Meta Form Leads row upsert failed', { brandSlug, leadgenId: lead.id, message: rowError?.message });
          }
        }

        url = json.paging?.next || null;
      }
    }

    logger.info('Meta Form Leads sync complete', { brandSlug, synced, forms: forms.length });
    return { success: true, synced, forms: forms.length };
  } catch (error) {
    logger.error('Meta Form Leads sync error', { brandSlug, message: error?.message });
    return { success: false, reason: 'network_error', synced: 0 };
  }
}

export default { syncMetaFormLeads };
