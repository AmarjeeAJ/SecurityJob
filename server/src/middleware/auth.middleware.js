import { AppError } from './error.middleware.js';

export function requireOwnerAuth(req, res, next) {
  if (!req.session || !req.session.ownerUserId) {
    return next(new AppError('Your session has expired. Please log in again.', 401));
  }
  next();
}
