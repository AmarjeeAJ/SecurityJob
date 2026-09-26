import crypto from 'node:crypto';
import env from '../config/env.js';
import logger from '../config/logger.js';
import { normalizeIndianMobile } from '../utils/phone-normalizer.js';

const CAPI_TIMEOUT_MS = 4000;

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

/**
 * Meta requires phone numbers hashed as E.164 digits without a leading + or 0
 * (e.g. 919876543210 for an Indian number). Uses the normalized 10-digit number,
 * prepends country code 91, and returns lowercase hexadecimal SHA-256 hash.
 */
export function hashedPhone(rawMobile) {
  const tenDigit = normalizeIndianMobile(rawMobile);
  if (!tenDigit) return null;
  return sha256(`91${tenDigit}`);
}

/**
 * Detects whether an IP is loopback, local development, or private network range.
 * Meta CAPI client_ip_address requires a valid public IP. Private/loopback IPs
 * must be omitted to prevent Meta API validation errors or poor match quality.
 *
 * Covers:
 * - Loopback: 127.0.0.1, ::1, localhost, ::ffff:127.0.0.1
 * - Private RFC1918: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
 * - Link-local: 169.254.0.0/16, fe80::/10
 * - IPv6 ULA: fc00::/7
 */
export function isPrivateOrLoopbackIp(ip) {
  if (!ip || typeof ip !== 'string') return true;
  let cleanIp = ip.trim();

  // Strip IPv4-mapped IPv6 prefix (e.g., ::ffff:127.0.0.1 -> 127.0.0.1)
  if (cleanIp.startsWith('::ffff:')) {
    cleanIp = cleanIp.slice(7);
  }

  // Loopback (IPv4, IPv6, localhost)
  if (cleanIp === '::1' || cleanIp === '127.0.0.1' || cleanIp.toLowerCase() === 'localhost') {
    return true;
  }

  // IPv4 Private ranges & Link-local:
  // 10.0.0.0/8 (10.0.0.0 - 10.255.255.255)
  if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(cleanIp)) return true;
  // 172.16.0.0/12 (172.16.0.0 - 172.31.255.255)
  if (/^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/.test(cleanIp)) return true;
  // 192.168.0.0/16 (192.168.0.0 - 192.168.255.255)
  if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(cleanIp)) return true;
  // 169.254.0.0/16 Link-local
  if (/^169\.254\.\d{1,3}\.\d{1,3}$/.test(cleanIp)) return true;

  // IPv6 ULA (fc00::/7) or link-local (fe80::/10)
  if (/^f[cd][0-9a-f]{2}:/i.test(cleanIp) || /^fe80:/i.test(cleanIp)) {
    return true;
  }

  return false;
}

/**
 * Sends a server-side CompleteRegistration event to Meta's Conversions API
 * for a successfully-registered new candidate. Never throws -- every failure
 * path (missing config, network error, non-2xx from Meta) is caught and
 * logged internally, so a caller can fire this without awaiting it and
 * without a try/catch of its own. Meta must never be able to delay or
 * affect the candidate's registration response.
 */
export async function sendCompleteRegistrationEvent({
  eventId,
  candidateCode,
  mobileNumber,
  ip,
  userAgent,
  fbp,
  fbc,
  eventSourceUrl,
}) {
  if (!env.metaAccessToken) {
    logger.warn('Meta CAPI skipped: META_ACCESS_TOKEN not configured', { candidateCode });
    return;
  }
  if (!env.metaApiVersion) {
    // No hardcoded fallback version -- an unconfigured version fails the
    // send safely rather than silently guessing a Graph API version.
    logger.warn('Meta CAPI skipped: META_API_VERSION not configured', { candidateCode });
    return;
  }
  if (!env.metaPixelId) {
    logger.warn('Meta CAPI skipped: META_PIXEL_ID not configured', { candidateCode });
    return;
  }

  const ph = hashedPhone(mobileNumber);
  const isPublicIp = Boolean(ip && !isPrivateOrLoopbackIp(ip));

  const userData = {
    ...(ph ? { ph: [ph] } : {}),
    ...(isPublicIp ? { client_ip_address: ip.trim() } : {}),
    ...(userAgent ? { client_user_agent: userAgent } : {}),
    ...(fbp ? { fbp } : {}),
    // fbc is only forwarded when a real _fbc cookie value was captured.
    // If absent, we deliberately do NOT construct a synthetic fbc from fbclid
    // because Meta's fbc format embeds the click timestamp, which is not available
    // at form submission time. Fabricating a timestamp would misrepresent data to Meta.
    ...(fbc ? { fbc } : {}),
  };

  const payload = {
    data: [
      {
        event_name: 'CompleteRegistration',
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: 'website',
        ...(eventSourceUrl ? { event_source_url: eventSourceUrl } : {}),
        user_data: userData,
      },
    ],
    ...(env.metaTestEventCode ? { test_event_code: env.metaTestEventCode } : {}),
  };

  const url = `https://graph.facebook.com/${env.metaApiVersion}/${env.metaPixelId}/events`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CAPI_TIMEOUT_MS);

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.metaAccessToken}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (resp.ok) {
      logger.info('Meta CAPI CompleteRegistration sent', { candidateCode, eventId });
    } else {
      const errBody = await resp.text().catch(() => '');
      logger.error('Meta CAPI send failed', { candidateCode, status: resp.status, body: errBody.slice(0, 300) });
    }
  } catch (err) {
    clearTimeout(timer);
    logger.error('Meta CAPI send error', { candidateCode, message: err?.message });
  }
}

export default {
  sendCompleteRegistrationEvent,
  hashedPhone,
  isPrivateOrLoopbackIp,
};
