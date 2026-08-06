import { AppError } from './error.middleware.js';

/**
 * Validates req.body against a Zod schema, replacing req.body with the
 * parsed (trimmed/coerced) data on success. On failure, throws a 422
 * AppError whose `details` map field paths to human-readable messages.
 */
export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const details = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join('.') || 'form';
        if (!details[key]) details[key] = issue.message;
      }
      return next(new AppError('Please correct the highlighted fields and try again.', 422, details));
    }

    req.body = result.data;
    next();
  };
}

export function validateParams(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      return next(new AppError('Invalid request parameters.', 400));
    }

    req.params = result.data;
    next();
  };
}

export function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const details = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join('.') || 'query';
        if (!details[key]) details[key] = issue.message;
      }
      return next(new AppError('Invalid query parameters.', 400, details));
    }

    req.query = result.data;
    next();
  };
}
