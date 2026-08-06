import logger from '../config/logger.js';
import env from '../config/env.js';

export class AppError extends Error {
  constructor(message, statusCode = 400, details = undefined) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function notFoundHandler(req, res) {
  res.status(404).json({ success: false, message: 'The requested resource was not found.' });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  if (statusCode >= 500) {
    logger.error(err.message, { stack: env.isProduction ? undefined : err.stack, path: req.path });
  } else {
    logger.warn(err.message, { path: req.path });
  }

  const response = {
    success: false,
    message: statusCode >= 500 ? 'Something went wrong. Please try again.' : err.message,
  };

  if (err.details) {
    response.errors = err.details;
  }

  res.status(statusCode).json(response);
}

export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
