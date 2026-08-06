import crypto from 'node:crypto';
import env from '../config/env.js';

/**
 * Returns a one-way hash of the client IP so we can support abuse
 * investigation without persisting raw IP addresses.
 */
export function hashIp(ip) {
  if (!ip) return null;
  return crypto.createHmac('sha256', env.cookieSecret).update(ip).digest('hex');
}

export default hashIp;
