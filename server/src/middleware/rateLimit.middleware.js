import rateLimit from 'express-rate-limit';
import env from '../config/env.js';

// Public registration endpoint: guards against scripted spam submissions.
//
// Deliberately generous per IP. Indian mobile carriers (Jio, Airtel, Vi) route
// large numbers of subscribers through carrier-grade NAT, so many genuinely
// unrelated candidates arriving from a paid ad campaign can share one public
// IP — as can a recruitment camp on shared WiFi. A tight per-IP cap would
// silently turn those real candidates away. Duplicate submissions are already
// de-duplicated by mobile number rather than creating new rows, so the spam
// upside of a low limit here is small compared to the cost of lost applicants.
export const registrationRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: env.registrationRateLimit,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many submissions from this device. Please try again later.' },
});

// Owner login: brute-force protection.
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { success: false, message: 'Too many login attempts. Please try again later.' },
});

// General API rate limit as a baseline safety net.
export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please slow down.' },
});
