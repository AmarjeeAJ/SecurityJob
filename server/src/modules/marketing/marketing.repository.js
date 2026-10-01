import query from '../../db/query.js';
import {
  getSpybotLeadCount,
  getSpybotLeadTrend,
  getSpybotCampaignLeads,
  getSpybotAdsetLeads,
  getSpybotAdLeads,
  getSpybotSourceAnalytics,
  getSpybotLocationAnalytics,
  getSpybotServiceTypeAnalytics,
  getSpybotLeadPhoneSet,
} from './spybotLeads.repository.js';

const SPYBOT_SLUG = 'spybot-security-services';
function isSpybotBrand(filters) {
  return filters.brand === SPYBOT_SLUG;
}

// "Website Registrations" here always means a candidate's FIRST submission
// (matching Meta CAPI's own definition -- CompleteRegistration only fires
// for !isExistingCandidate). This intentionally differs from the Candidate
// Records/Detail pages, which show each candidate's LATEST submission for
// operational/CRM purposes -- that's the right choice there (what's this
// candidate's current situation), but marketing conversion counting needs
// the moment they first converted, not their most recent resubmission.
const FIRST_SUBMISSION_LATERAL = `
  LEFT JOIN LATERAL (
    SELECT source, campaign, campaign_id, adset_id, ad_id
    FROM candidate_submissions cs
    WHERE cs.candidate_id = c.id
    ORDER BY cs.submitted_at ASC
    LIMIT 1
  ) first_sub ON TRUE
`;

function buildRegistrationFilters(filters, startIndex = 1) {
  const clauses = [];
  const values = [];
  let i = startIndex;

  if (filters.brand) {
    clauses.push(`c.brand_id = (SELECT id FROM brands WHERE slug = $${i})`);
    values.push(filters.brand);
    i += 1;
  }
  if (filters.dateFrom) {
    clauses.push(`c.first_registered_at >= $${i}::date`);
    values.push(filters.dateFrom);
    i += 1;
  }
  if (filters.dateTo) {
    clauses.push(`c.first_registered_at < ($${i}::date + interval '1 day')`);
    values.push(filters.dateTo);
    i += 1;
  }
  if (filters.source) {
    clauses.push(`first_sub.source = $${i}`);
    values.push(filters.source);
    i += 1;
  }
  if (filters.campaignId) {
    clauses.push(`first_sub.campaign_id = $${i}`);
    values.push(filters.campaignId);
    i += 1;
  }
  if (filters.adsetId) {
    clauses.push(`first_sub.adset_id = $${i}`);
    values.push(filters.adsetId);
    i += 1;
  }
  if (filters.adId) {
    clauses.push(`first_sub.ad_id = $${i}`);
    values.push(filters.adId);
    i += 1;
  }
  if (filters.state) {
    clauses.push(`c.permanent_state = $${i}`);
    values.push(filters.state);
    i += 1;
  }
  if (filters.city) {
    clauses.push(`c.permanent_district = $${i}`);
    values.push(filters.city);
    i += 1;
  }
  if (filters.role) {
    clauses.push(`EXISTS (SELECT 1 FROM candidate_roles cr WHERE cr.candidate_id = c.id AND cr.role_name = $${i})`);
    values.push(filters.role);
    i += 1;
  }

  return { whereSql: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '', values, nextIndex: i };
}

function buildInsightsFilters(filters, startIndex = 1) {
  const clauses = [];
  const values = [];
  let i = startIndex;

  if (filters.brand) {
    clauses.push(`mi.brand_id = (SELECT id FROM brands WHERE slug = $${i})`);
    values.push(filters.brand);
    i += 1;
  }
  if (filters.dateFrom) {
    clauses.push(`mi.date >= $${i}::date`);
    values.push(filters.dateFrom);
    i += 1;
  }
  if (filters.dateTo) {
    clauses.push(`mi.date <= $${i}::date`);
    values.push(filters.dateTo);
    i += 1;
  }
  if (filters.platform) {
    clauses.push(`mi.platform = $${i}`);
    values.push(filters.platform);
    i += 1;
  }
  if (filters.campaignId) {
    clauses.push(`mi.campaign_id = $${i}`);
    values.push(filters.campaignId);
    i += 1;
  }
  if (filters.adsetId) {
    clauses.push(`mi.adset_id = $${i}`);
    values.push(filters.adsetId);
    i += 1;
  }
  if (filters.adId) {
    clauses.push(`mi.ad_id = $${i}`);
    values.push(filters.adId);
    i += 1;
  }

  return { whereSql: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '', values, nextIndex: i };
}

export async function getInsightsTotals(filters) {
  const { whereSql, values } = buildInsightsFilters(filters);
  const result = await query(
    `SELECT
      COALESCE(SUM(spend), 0) AS spend,
      COALESCE(SUM(impressions), 0) AS impressions,
      COALESCE(SUM(reach), 0) AS reach,
      COALESCE(SUM(clicks), 0) AS clicks,
      COALESCE(SUM(link_clicks), 0) AS link_clicks,
      COALESCE(SUM(landing_page_views), 0) AS landing_page_views,
      COUNT(*) AS row_count
    FROM meta_insights_daily mi ${whereSql}`,
    values
  );
  return result.rows[0];
}

export async function getRegistrationCount(filters) {
  if (isSpybotBrand(filters)) return getSpybotLeadCount(filters);

  const { whereSql, values } = buildRegistrationFilters(filters);
  const result = await query(
    `SELECT COUNT(*) AS registrations
     FROM candidates c ${FIRST_SUBMISSION_LATERAL} ${whereSql}`,
    values
  );
  return Number(result.rows[0].registrations);
}

export async function getInsightsTrend(filters) {
  const { whereSql, values } = buildInsightsFilters(filters);
  const result = await query(
    `SELECT mi.date::text AS date,
      COALESCE(SUM(spend), 0) AS spend,
      COALESCE(SUM(impressions), 0) AS impressions,
      COALESCE(SUM(link_clicks), 0) AS link_clicks,
      COALESCE(SUM(clicks), 0) AS clicks
     FROM meta_insights_daily mi ${whereSql}
     GROUP BY mi.date ORDER BY mi.date`,
    values
  );
  return result.rows;
}

export async function getRegistrationTrend(filters) {
  if (isSpybotBrand(filters)) {
    const rows = await getSpybotLeadTrend(filters);
    return rows.map((r) => ({ date: r.date, registrations: r.leads }));
  }

  const { whereSql, values } = buildRegistrationFilters(filters);
  const result = await query(
    `SELECT c.first_registered_at::date::text AS date, COUNT(*) AS registrations
     FROM candidates c ${FIRST_SUBMISSION_LATERAL} ${whereSql}
     GROUP BY c.first_registered_at::date ORDER BY date`,
    values
  );
  return result.rows;
}

async function groupedInsights(dimensionColumn, nameColumn, filters) {
  const { whereSql, values } = buildInsightsFilters(filters);
  const notNullClause = `mi.${dimensionColumn} IS NOT NULL`;
  const combinedWhere = whereSql ? `${whereSql} AND ${notNullClause}` : `WHERE ${notNullClause}`;

  const extraColumns =
    dimensionColumn === 'campaign_id'
      ? ''
      : dimensionColumn === 'adset_id'
      ? 'MAX(mi.campaign_id) AS campaign_id, MAX(mi.campaign_name) AS campaign_name,'
      : 'MAX(mi.campaign_id) AS campaign_id, MAX(mi.campaign_name) AS campaign_name, MAX(mi.adset_id) AS adset_id, MAX(mi.adset_name) AS adset_name,';

  const result = await query(
    `SELECT mi.${dimensionColumn} AS id,
      MAX(mi.${nameColumn}) AS name,
      ${extraColumns}
      COALESCE(SUM(spend), 0) AS spend,
      COALESCE(SUM(impressions), 0) AS impressions,
      COALESCE(SUM(reach), 0) AS reach,
      COALESCE(SUM(link_clicks), 0) AS link_clicks,
      COALESCE(SUM(clicks), 0) AS clicks
     FROM meta_insights_daily mi ${combinedWhere}
     GROUP BY mi.${dimensionColumn}`,
    values
  );
  return result.rows;
}

async function groupedRegistrations(dimensionExpr, filters) {
  const { whereSql, values } = buildRegistrationFilters(filters);
  const combinedWhere = whereSql
    ? `${whereSql} AND ${dimensionExpr} IS NOT NULL`
    : `WHERE ${dimensionExpr} IS NOT NULL`;
  const result = await query(
    `SELECT ${dimensionExpr} AS id, COUNT(*) AS registrations
     FROM candidates c ${FIRST_SUBMISSION_LATERAL} ${combinedWhere}
     GROUP BY ${dimensionExpr}`,
    values
  );
  return result.rows;
}

function reshapeSpybotLeads(rows) {
  return rows.map((r) => ({ id: r.id, registrations: Number(r.leads) }));
}

export async function getCampaignPerformance(filters) {
  if (isSpybotBrand(filters)) {
    const [insights, leads] = await Promise.all([
      groupedInsights('campaign_id', 'campaign_name', filters),
      getSpybotCampaignLeads(filters),
    ]);
    return { insights, registrations: reshapeSpybotLeads(leads) };
  }
  const [insights, regs] = await Promise.all([
    groupedInsights('campaign_id', 'campaign_name', filters),
    groupedRegistrations('first_sub.campaign_id', filters),
  ]);
  return { insights, registrations: regs };
}

export async function getAdsetPerformance(filters) {
  if (isSpybotBrand(filters)) {
    const [insights, leads] = await Promise.all([
      groupedInsights('adset_id', 'adset_name', filters),
      getSpybotAdsetLeads(filters),
    ]);
    return { insights, registrations: reshapeSpybotLeads(leads) };
  }
  const [insights, regs] = await Promise.all([
    groupedInsights('adset_id', 'adset_name', filters),
    groupedRegistrations('first_sub.adset_id', filters),
  ]);
  return { insights, registrations: regs };
}

export async function getAdPerformance(filters) {
  if (isSpybotBrand(filters)) {
    const [insights, leads] = await Promise.all([
      groupedInsights('ad_id', 'ad_name', filters),
      getSpybotAdLeads(filters),
    ]);
    return { insights, registrations: reshapeSpybotLeads(leads) };
  }
  const [insights, regs] = await Promise.all([
    groupedInsights('ad_id', 'ad_name', filters),
    groupedRegistrations('first_sub.ad_id', filters),
  ]);
  return { insights, registrations: regs };
}

export async function getSourceAnalytics(filters) {
  if (isSpybotBrand(filters)) {
    // Spybot's source analytics don't attach spend per source (would need
    // the same campaign_id cross-reference built for SecurityJob.in below,
    // not built for this brand yet) -- spend is left null rather than
    // fabricated, same "unavailable vs. zero" rule as everywhere else.
    const rows = await getSpybotSourceAnalytics(filters);
    return rows.map((r) => ({ source: r.source, registrations: Number(r.leads), spend: null }));
  }

  const { whereSql, values } = buildRegistrationFilters(filters);
  const combinedWhere = whereSql
    ? `${whereSql} AND first_sub.source IS NOT NULL`
    : `WHERE first_sub.source IS NOT NULL`;

  const regsResult = await query(
    `SELECT first_sub.source AS source, COUNT(*) AS registrations,
      ARRAY_AGG(DISTINCT first_sub.campaign_id) FILTER (WHERE first_sub.campaign_id IS NOT NULL) AS campaign_ids
     FROM candidates c ${FIRST_SUBMISSION_LATERAL} ${combinedWhere}
     GROUP BY first_sub.source
     ORDER BY registrations DESC`,
    values
  );

  // Spend is only attached to a source when its registrations actually
  // carry a campaign_id we have spend data for -- e.g. "direct" or
  // "whatsapp" registrations never get a spend figure fabricated onto
  // them, since there is no ad spend behind them.
  const rows = [];
  for (const row of regsResult.rows) {
    let spend = null;
    if (row.campaign_ids && row.campaign_ids.length > 0) {
      const { whereSql: insightsWhere, values: insightsValues } = buildInsightsFilters(filters, 1);
      const campaignFilterIndex = insightsValues.length + 1;
      const spendResult = await query(
        `SELECT COALESCE(SUM(spend), 0) AS spend FROM meta_insights_daily mi
         ${insightsWhere ? `${insightsWhere} AND` : 'WHERE'} mi.campaign_id = ANY($${campaignFilterIndex})`,
        [...insightsValues, row.campaign_ids]
      );
      spend = Number(spendResult.rows[0].spend);
    }
    rows.push({ source: row.source, registrations: Number(row.registrations), spend });
  }
  return rows;
}

export async function getLocationAnalytics(filters) {
  if (isSpybotBrand(filters)) {
    const rows = await getSpybotLocationAnalytics(filters);
    // Spybot's leads carry a specific city, not a "district" -- mapped onto
    // the existing district field so the frontend/API contract is unchanged.
    return rows.map((r) => ({ state: r.state, district: r.city, registrations: Number(r.leads) }));
  }

  const { whereSql, values } = buildRegistrationFilters(filters);
  const combinedWhere = whereSql
    ? `${whereSql} AND c.permanent_state IS NOT NULL`
    : `WHERE c.permanent_state IS NOT NULL`;
  const result = await query(
    `SELECT c.permanent_state AS state, c.permanent_district AS district, COUNT(*) AS registrations
     FROM candidates c ${FIRST_SUBMISSION_LATERAL} ${combinedWhere}
     GROUP BY c.permanent_state, c.permanent_district
     ORDER BY registrations DESC`,
    values
  );
  return result.rows;
}

function buildFormLeadsFilters(filters, startIndex = 1) {
  const clauses = [];
  const values = [];
  let i = startIndex;

  if (filters.brand) {
    clauses.push(`mfl.brand_id = (SELECT id FROM brands WHERE slug = $${i})`);
    values.push(filters.brand);
    i += 1;
  }
  if (filters.dateFrom) {
    clauses.push(`mfl.created_time >= $${i}::date`);
    values.push(filters.dateFrom);
    i += 1;
  }
  if (filters.dateTo) {
    clauses.push(`mfl.created_time < ($${i}::date + interval '1 day')`);
    values.push(filters.dateTo);
    i += 1;
  }
  if (filters.campaignId) {
    clauses.push(`mfl.campaign_id = $${i}`);
    values.push(filters.campaignId);
    i += 1;
  }
  if (filters.adsetId) {
    clauses.push(`mfl.adset_id = $${i}`);
    values.push(filters.adsetId);
    i += 1;
  }
  if (filters.adId) {
    clauses.push(`mfl.ad_id = $${i}`);
    values.push(filters.adId);
    i += 1;
  }

  return { whereSql: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '', values, nextIndex: i };
}

// Meta Instant Form leads are a genuinely separate channel from website
// registrations -- someone can submit a form on Facebook without ever
// visiting the site. "Unique" leads are counted by excluding form leads
// whose phone number matches an existing candidate, so a person who did
// both is never counted twice; a lead with no usable phone number is kept
// (there's no evidence it's a duplicate, so it isn't assumed to be one).
export async function getMetaFormLeadsTotals(filters) {
  const { whereSql, values } = buildFormLeadsFilters(filters);
  const totalResult = await query(
    `SELECT COUNT(*) AS total FROM meta_form_leads mfl ${whereSql}`,
    values
  );
  const total = Number(totalResult.rows[0].total);

  if (isSpybotBrand(filters)) {
    // Spybot's website leads live in a separate database, so the dedup
    // can't be a single SQL NOT EXISTS like the candidates case below --
    // fetch Spybot's known phone numbers and set-difference in JS instead.
    const spybotPhones = await getSpybotLeadPhoneSet(filters);
    if (!spybotPhones) {
      // Spybot DB unreachable/not configured: can't rule out duplicates,
      // so don't claim a dedup figure -- fall back to the raw total.
      return { total, uniqueOfWebsite: total };
    }
    const phonesResult = await query(
      `SELECT normalized_phone FROM meta_form_leads mfl ${whereSql}`,
      values
    );
    const uniqueOfWebsite = phonesResult.rows.filter(
      (r) => !r.normalized_phone || !spybotPhones.has(r.normalized_phone)
    ).length;
    return { total, uniqueOfWebsite };
  }

  const dedupeClause = `NOT EXISTS (
    SELECT 1 FROM candidates c2
    WHERE mfl.normalized_phone IS NOT NULL
      AND (c2.normalized_mobile_number = mfl.normalized_phone OR c2.normalized_whatsapp_number = mfl.normalized_phone)
  )`;
  const uniqueWhere = whereSql ? `${whereSql} AND ${dedupeClause}` : `WHERE ${dedupeClause}`;
  const uniqueResult = await query(
    `SELECT COUNT(*) AS unique_leads FROM meta_form_leads mfl ${uniqueWhere}`,
    values
  );

  return {
    total,
    uniqueOfWebsite: Number(uniqueResult.rows[0].unique_leads),
  };
}

export async function getRoleAnalytics(filters) {
  if (isSpybotBrand(filters)) {
    // Spybot's equivalent of "Role Analytics": which security services a
    // lead requested, not a job role -- same shape/field names so the
    // frontend's BreakdownTable works unchanged, just relabeled in the UI.
    const rows = await getSpybotServiceTypeAnalytics(filters);
    return rows.map((r) => ({ role: r.service_type, registrations: Number(r.leads) }));
  }

  const { whereSql, values } = buildRegistrationFilters(filters);
  const result = await query(
    `SELECT cr.role_name AS role, COUNT(DISTINCT c.id) AS registrations
     FROM candidates c
     ${FIRST_SUBMISSION_LATERAL}
     JOIN candidate_roles cr ON cr.candidate_id = c.id
     ${whereSql}
     GROUP BY cr.role_name
     ORDER BY registrations DESC`,
    values
  );
  return result.rows;
}
