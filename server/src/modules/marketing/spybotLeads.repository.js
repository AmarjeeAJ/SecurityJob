import spybotQuery from '../../db/spybotQuery.js';

// Spybot's client_leads are B2B service enquiries (companies wanting to hire
// guards), a genuinely different kind of record than SecurityJob.in's job
// candidates -- never conflated with "registrations" terminology in the UI.
// There's no brand_id filter here: the entire spybot_corporate database only
// ever holds Spybot's own leads.
function buildLeadFilters(filters, startIndex = 1) {
  const clauses = [];
  const values = [];
  let i = startIndex;

  if (filters.dateFrom) {
    clauses.push(`created_at >= $${i}::date`);
    values.push(filters.dateFrom);
    i += 1;
  }
  if (filters.dateTo) {
    clauses.push(`created_at < ($${i}::date + interval '1 day')`);
    values.push(filters.dateTo);
    i += 1;
  }
  if (filters.source) {
    clauses.push(`source = $${i}`);
    values.push(filters.source);
    i += 1;
  }
  if (filters.campaignId) {
    clauses.push(`campaign_id = $${i}`);
    values.push(filters.campaignId);
    i += 1;
  }
  if (filters.adsetId) {
    clauses.push(`adset_id = $${i}`);
    values.push(filters.adsetId);
    i += 1;
  }
  if (filters.adId) {
    clauses.push(`ad_id = $${i}`);
    values.push(filters.adId);
    i += 1;
  }
  if (filters.state) {
    clauses.push(`state = $${i}`);
    values.push(filters.state);
    i += 1;
  }
  if (filters.city) {
    clauses.push(`city = $${i}`);
    values.push(filters.city);
    i += 1;
  }

  return { whereSql: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '', values, nextIndex: i };
}

// Returns null (not 0) when the Spybot database isn't reachable/configured,
// so the controller can tell "genuinely zero leads" apart from
// "can't connect right now" rather than showing a fabricated zero.
export async function getSpybotLeadCount(filters) {
  const { whereSql, values } = buildLeadFilters(filters);
  const result = await spybotQuery(`SELECT COUNT(*) AS leads FROM client_leads ${whereSql}`, values);
  if (!result) return null;
  return Number(result.rows[0].leads);
}

export async function getSpybotLeadTrend(filters) {
  const { whereSql, values } = buildLeadFilters(filters);
  const result = await spybotQuery(
    `SELECT created_at::date::text AS date, COUNT(*) AS leads
     FROM client_leads ${whereSql}
     GROUP BY created_at::date ORDER BY date`,
    values
  );
  if (!result) return [];
  return result.rows;
}

async function groupedLeads(dimensionColumn, filters) {
  const { whereSql, values } = buildLeadFilters(filters);
  const notNullClause = `${dimensionColumn} IS NOT NULL`;
  const combinedWhere = whereSql ? `${whereSql} AND ${notNullClause}` : `WHERE ${notNullClause}`;

  const result = await spybotQuery(
    `SELECT ${dimensionColumn} AS id, COUNT(*) AS leads
     FROM client_leads ${combinedWhere}
     GROUP BY ${dimensionColumn}`,
    values
  );
  if (!result) return [];
  return result.rows;
}

export async function getSpybotCampaignLeads(filters) {
  return groupedLeads('campaign_id', filters);
}

export async function getSpybotAdsetLeads(filters) {
  return groupedLeads('adset_id', filters);
}

export async function getSpybotAdLeads(filters) {
  return groupedLeads('ad_id', filters);
}

export async function getSpybotSourceAnalytics(filters) {
  const { whereSql, values } = buildLeadFilters(filters);
  const combinedWhere = whereSql ? `${whereSql} AND source IS NOT NULL` : `WHERE source IS NOT NULL`;
  const result = await spybotQuery(
    `SELECT source, COUNT(*) AS leads
     FROM client_leads ${combinedWhere}
     GROUP BY source ORDER BY leads DESC`,
    values
  );
  if (!result) return [];
  return result.rows;
}

export async function getSpybotLocationAnalytics(filters) {
  const { whereSql, values } = buildLeadFilters(filters);
  const combinedWhere = whereSql ? `${whereSql} AND state IS NOT NULL` : `WHERE state IS NOT NULL`;
  const result = await spybotQuery(
    `SELECT state, city, COUNT(*) AS leads
     FROM client_leads ${combinedWhere}
     GROUP BY state, city ORDER BY leads DESC`,
    values
  );
  if (!result) return [];
  return result.rows;
}

// The Spybot-equivalent of SecurityJob.in's Role Analytics: service_types is
// a jsonb array (a lead can request more than one type of service), so this
// unnests it the same way candidate_roles' one-to-many shape is counted.
export async function getSpybotServiceTypeAnalytics(filters) {
  const { whereSql, values } = buildLeadFilters(filters);
  const result = await spybotQuery(
    `SELECT service_type, COUNT(*) AS leads
     FROM client_leads, jsonb_array_elements_text(service_types) AS service_type
     ${whereSql}
     GROUP BY service_type ORDER BY leads DESC`,
    values
  );
  if (!result) return [];
  return result.rows;
}

// Matched against Meta Instant Form leads' normalized_phone for the same
// dedup purpose as SecurityJob.in's getMetaFormLeadsTotals -- a company that
// submitted both the Instant Form and the website enquiry form shouldn't be
// counted twice. Phone numbers here aren't pre-normalized like candidates',
// so this strips common formatting the same way the form itself validates.
export async function getSpybotLeadPhoneSet(filters) {
  const { whereSql, values } = buildLeadFilters(filters);
  const result = await spybotQuery(
    `SELECT regexp_replace(mobile, '[^0-9]', '', 'g') AS normalized_mobile
     FROM client_leads ${whereSql}`,
    values
  );
  if (!result) return null;
  return new Set(result.rows.map((r) => r.normalized_mobile.replace(/^(91|0)/, '')).map((m) => m.slice(-10)));
}
