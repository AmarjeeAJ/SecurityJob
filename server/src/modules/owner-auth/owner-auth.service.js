import bcrypt from 'bcryptjs';
import { AppError } from '../../middleware/error.middleware.js';
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

  await touchLastLogin(owner.id);

  return { id: owner.id, email: owner.email, fullName: owner.full_name };
}
