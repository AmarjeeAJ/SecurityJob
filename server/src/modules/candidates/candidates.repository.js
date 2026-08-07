import query from '../../db/query.js';

export async function findCandidateByNormalizedMobile(client, normalizedMobile) {
  const result = await client.query(
    'SELECT * FROM candidates WHERE normalized_mobile_number = $1 FOR UPDATE',
    [normalizedMobile]
  );
  return result.rows[0] || null;
}

const CANDIDATE_COLUMNS = [
  'full_name', 'mobile_number', 'normalized_mobile_number', 'whatsapp_number', 'normalized_whatsapp_number',
  'alternate_mobile_number', 'email', 'date_of_birth', 'age', 'gender', 'current_city', 'current_area', 'state',
  'highest_qualification', 'total_experience_months', 'security_experience_months', 'previous_company',
  'current_employment_status', 'joining_availability', 'expected_salary', 'shift_preference', 'duty_hour_preference',
  'height_cm', 'languages', 'ex_serviceman', 'is_experienced', 'aadhaar_available', 'police_verification_available',
  'training_certificate_available', 'driving_licence_available', 'additional_message',
  'consent_given', 'consent_timestamp', 'consent_text_version',
];

export async function insertCandidate(client, candidateCode, data) {
  const columns = ['candidate_code', ...CANDIDATE_COLUMNS];
  const values = [candidateCode, ...CANDIDATE_COLUMNS.map((col) => data[col])];
  const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

  const result = await client.query(
    `INSERT INTO candidates (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`,
    values
  );
  return result.rows[0];
}

export async function updateCandidateOnResubmit(client, candidateId, data) {
  const setClauses = CANDIDATE_COLUMNS.map((col, i) => `${col} = $${i + 2}`);
  const values = [candidateId, ...CANDIDATE_COLUMNS.map((col) => data[col])];

  const result = await client.query(
    `UPDATE candidates SET ${setClauses.join(', ')}, last_submitted_at = now(), updated_at = now()
     WHERE id = $1 RETURNING *`,
    values
  );
  return result.rows[0];
}

export async function replaceCandidateRoles(client, candidateId, roles, otherRoleText) {
  await client.query('DELETE FROM candidate_roles WHERE candidate_id = $1', [candidateId]);
  for (const roleName of roles) {
    await client.query(
      'INSERT INTO candidate_roles (candidate_id, role_name, other_role_text) VALUES ($1, $2, $3)',
      [candidateId, roleName, roleName === 'Other' ? otherRoleText || null : null]
    );
  }
}

export async function replaceCandidatePreferredLocations(client, candidateId, locations) {
  await client.query('DELETE FROM candidate_preferred_locations WHERE candidate_id = $1', [candidateId]);
  for (const cityName of locations) {
    await client.query(
      'INSERT INTO candidate_preferred_locations (candidate_id, city_name) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [candidateId, cityName]
    );
  }
}

export async function insertCandidateDocument(client, candidateId, doc) {
  await client.query(
    `INSERT INTO candidate_documents
      (candidate_id, document_type, original_file_name, stored_file_name, file_url, mime_type, file_size)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [candidateId, doc.documentType, doc.originalFileName, doc.storedFileName, doc.fileUrl, doc.mimeType, doc.fileSize]
  );
}

export async function insertCandidateSubmission(client, candidateId, tracking) {
  await client.query(
    `INSERT INTO candidate_submissions (
      candidate_id, landing_page_slug, source, medium, campaign,
      utm_source, utm_medium, utm_campaign, utm_content, utm_term,
      fbclid, fbp, fbc, referrer_url, landing_page_url, device_type, browser, ip_hash
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
    [
      candidateId, tracking.landingPageSlug, tracking.source, tracking.medium, tracking.campaign,
      tracking.utmSource, tracking.utmMedium, tracking.utmCampaign, tracking.utmContent, tracking.utmTerm,
      tracking.fbclid, tracking.fbp, tracking.fbc, tracking.referrerUrl, tracking.landingPageUrl,
      tracking.deviceType, tracking.browser, tracking.ipHash,
    ]
  );
}

export async function upsertCandidateSource(client, candidateId, tracking) {
  await client.query(
    `INSERT INTO candidate_sources (candidate_id, source, medium, campaign, landing_page_slug)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (candidate_id, source, medium, campaign)
     DO UPDATE SET last_seen_at = now(), submission_count = candidate_sources.submission_count + 1`,
    [candidateId, tracking.source, tracking.medium, tracking.campaign, tracking.landingPageSlug]
  );
}

function buildFilterClauses(filters, startIndex = 1) {
  const clauses = [];
  const values = [];
  let i = startIndex;

  if (filters.search) {
    clauses.push(`(c.full_name ILIKE $${i} OR c.mobile_number LIKE $${i + 1} OR c.candidate_code ILIKE $${i}) `);
    values.push(`%${filters.search}%`, `%${filters.search}%`);
    i += 2;
  }
  if (filters.city) {
    clauses.push(`c.current_city ILIKE $${i}`);
    values.push(`%${filters.city}%`);
    i += 1;
  }
  if (filters.role) {
    clauses.push(`EXISTS (SELECT 1 FROM candidate_roles cr WHERE cr.candidate_id = c.id AND cr.role_name = $${i})`);
    values.push(filters.role);
    i += 1;
  }
  if (filters.source) {
    clauses.push(`EXISTS (SELECT 1 FROM candidate_sources cs WHERE cs.candidate_id = c.id AND cs.source = $${i})`);
    values.push(filters.source);
    i += 1;
  }
  if (filters.dateFrom) {
    clauses.push(`c.last_submitted_at >= $${i}`);
    values.push(filters.dateFrom);
    i += 1;
  }
  if (filters.dateTo) {
    clauses.push(`c.last_submitted_at <= $${i}`);
    values.push(filters.dateTo);
    i += 1;
  }

  return { whereSql: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '', values, nextIndex: i };
}

const SORT_COLUMNS = {
  latest_submission: 'c.last_submitted_at',
  first_registered: 'c.first_registered_at',
  name: 'c.full_name',
};

export async function listCandidatesPaginated(filters) {
  const { whereSql, values, nextIndex } = buildFilterClauses(filters);
  const sortColumn = SORT_COLUMNS[filters.sortBy] || SORT_COLUMNS.latest_submission;
  const sortDir = filters.sortDir === 'asc' ? 'ASC' : 'DESC';

  const limit = filters.pageSize;
  const offset = (filters.page - 1) * filters.pageSize;

  const dataSql = `
    SELECT
      c.id, c.candidate_code, c.full_name, c.mobile_number, c.whatsapp_number, c.current_city,
      c.security_experience_months, c.joining_availability, c.first_registered_at, c.last_submitted_at,
      COALESCE(roles.role_names, '') AS role_names,
      COALESCE(locations.city_names, '') AS preferred_city_names,
      src.source, src.campaign
    FROM candidates c
    LEFT JOIN LATERAL (
      SELECT STRING_AGG(role_name, ' | ' ORDER BY role_name) AS role_names
      FROM candidate_roles WHERE candidate_id = c.id
    ) roles ON TRUE
    LEFT JOIN LATERAL (
      SELECT STRING_AGG(city_name, ' | ' ORDER BY city_name) AS city_names
      FROM candidate_preferred_locations WHERE candidate_id = c.id
    ) locations ON TRUE
    LEFT JOIN LATERAL (
      SELECT source, campaign FROM candidate_sources WHERE candidate_id = c.id ORDER BY last_seen_at DESC LIMIT 1
    ) src ON TRUE
    ${whereSql}
    ORDER BY ${sortColumn} ${sortDir}
    LIMIT $${nextIndex} OFFSET $${nextIndex + 1}
  `;

  const countSql = `SELECT COUNT(*)::int AS total FROM candidates c ${whereSql}`;

  const [dataResult, countResult] = await Promise.all([
    query(dataSql, [...values, limit, offset]),
    query(countSql, values),
  ]);

  return { rows: dataResult.rows, total: countResult.rows[0].total };
}

export async function getCandidateFullById(id) {
  const candidateResult = await query('SELECT * FROM candidates WHERE id = $1', [id]);
  const candidate = candidateResult.rows[0];
  if (!candidate) return null;

  const [roles, locations, documents, submissions, sources] = await Promise.all([
    query('SELECT role_name, other_role_text FROM candidate_roles WHERE candidate_id = $1 ORDER BY role_name', [id]),
    query('SELECT city_name FROM candidate_preferred_locations WHERE candidate_id = $1 ORDER BY city_name', [id]),
    query('SELECT id, document_type, original_file_name, file_url, mime_type, file_size, created_at FROM candidate_documents WHERE candidate_id = $1 ORDER BY created_at DESC', [id]),
    query('SELECT landing_page_slug, source, medium, campaign, submitted_at FROM candidate_submissions WHERE candidate_id = $1 ORDER BY submitted_at DESC', [id]),
    query('SELECT source, medium, campaign, landing_page_slug, first_seen_at, last_seen_at, submission_count FROM candidate_sources WHERE candidate_id = $1 ORDER BY last_seen_at DESC', [id]),
  ]);

  return {
    ...candidate,
    roles: roles.rows,
    preferredLocations: locations.rows.map((r) => r.city_name),
    documents: documents.rows,
    submissions: submissions.rows,
    sources: sources.rows,
  };
}

export async function* streamCandidatesForExport(filters, batchSize = 500) {
  const { whereSql, values } = buildFilterClauses(filters);
  let lastId = 0;

  while (true) {
    const sql = `
      SELECT
        c.id, c.candidate_code, c.full_name, c.mobile_number, c.whatsapp_number, c.alternate_mobile_number,
        c.email, c.age, c.gender, c.current_city, c.current_area, c.state, c.highest_qualification,
        c.total_experience_months, c.security_experience_months, c.previous_company, c.is_experienced,
        c.current_employment_status, c.joining_availability, c.expected_salary, c.shift_preference,
        c.duty_hour_preference, c.ex_serviceman, c.aadhaar_available, c.police_verification_available,
        c.training_certificate_available, c.driving_licence_available, c.consent_given,
        c.first_registered_at, c.last_submitted_at,
        COALESCE(roles.role_names, '') AS role_names,
        COALESCE(locations.city_names, '') AS preferred_city_names,
        src.source, src.campaign, src.landing_page_slug
      FROM candidates c
      LEFT JOIN LATERAL (
        SELECT STRING_AGG(role_name, ' | ' ORDER BY role_name) AS role_names
        FROM candidate_roles WHERE candidate_id = c.id
      ) roles ON TRUE
      LEFT JOIN LATERAL (
        SELECT STRING_AGG(city_name, ' | ' ORDER BY city_name) AS city_names
        FROM candidate_preferred_locations WHERE candidate_id = c.id
      ) locations ON TRUE
      LEFT JOIN LATERAL (
        SELECT source, campaign, landing_page_slug FROM candidate_sources WHERE candidate_id = c.id ORDER BY last_seen_at DESC LIMIT 1
      ) src ON TRUE
      ${whereSql ? `${whereSql} AND c.id > $${values.length + 1}` : `WHERE c.id > $${values.length + 1}`}
      ORDER BY c.id ASC
      LIMIT ${batchSize}
    `;

    const result = await query(sql, [...values, lastId]);
    if (result.rows.length === 0) break;

    for (const row of result.rows) {
      yield row;
    }

    lastId = result.rows[result.rows.length - 1].id;
    if (result.rows.length < batchSize) break;
  }
}
