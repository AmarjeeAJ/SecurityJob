import bcrypt from 'bcryptjs';
import { AppError } from '../../middleware/error.middleware.js';
import query from '../../db/query.js';
import logger from '../../config/logger.js';
import { findOwnerByEmail, touchLastLogin } from './owner-auth.repository.js';

export async function authenticateOwner(email, password) {
  const owner = await findOwnerByEmail(email);

  if (!owner || !owner.is_active) {
    throw new AppError('Invalid email or password.', 401);
  }

  const passwordMatches = await bcrypt.compare(password, owner.password_hash);
  if (!passwordMatches) {
    throw new AppError('Invalid email or password.', 401);
  }

  // Fire-and-forget: do not block the owner login response on audit timestamp write
  touchLastLogin(owner.id).catch((err) => {
    logger.warn('Failed to update owner last_login_at timestamp', { error: err.message });
  });

  // Rehash to 10 rounds if password hash was generated with 12+ rounds (speeds up future logins by ~240ms)
  if (owner.password_hash.startsWith('$2a$12$') || owner.password_hash.startsWith('$2b$12$')) {
    bcrypt.hash(password, 10).then((newHash) => {
      query('UPDATE owner_users SET password_hash = $1, updated_at = now() WHERE id = $2', [newHash, owner.id])
        .catch((err) => logger.warn('Failed to upgrade owner password hash rounds', { error: err.message }));
    }).catch(() => {});
  }

  return { id: owner.id, email: owner.email, fullName: owner.full_name };
}

