import query from '../../db/query.js';

export async function logExport({ ownerUserId, filters, recordCount, ipHash }) {
  await query(
    `INSERT INTO export_logs (owner_user_id, filters_json, record_count, ip_hash) VALUES ($1, $2, $3, $4)`,
    [ownerUserId, JSON.stringify(filters), recordCount, ipHash]
  );
}
