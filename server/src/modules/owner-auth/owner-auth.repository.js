import query from '../../db/query.js';

export async function findOwnerByEmail(email) {
  const result = await query(
    'SELECT id, email, password_hash, full_name, is_active FROM owner_users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
}

export async function findOwnerById(id) {
  const result = await query(
    'SELECT id, email, full_name FROM owner_users WHERE id = $1 AND is_active = TRUE',
    [id]
  );
  return result.rows[0] || null;
}

export async function touchLastLogin(id) {
  await query('UPDATE owner_users SET last_login_at = now() WHERE id = $1', [id]);
}
