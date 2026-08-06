function readCookie(name) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : '';
}

function detectDeviceType() {
  const ua = navigator.userAgent || '';
  if (/tablet|ipad/i.test(ua)) return 'tablet';
  if (/mobi|android|iphone/i.test(ua)) return 'mobile';
  return 'desktop';
}

function detectBrowser() {
  const ua = navigator.userAgent || '';
  if (/edg/i.test(ua)) return 'Edge';
  if (/chrome/i.test(ua) && !/edg/i.test(ua)) return 'Chrome';
  if (/safari/i.test(ua) && !/chrome/i.test(ua)) return 'Safari';
  if (/firefox/i.test(ua)) return 'Firefox';
  return 'Other';
}

/**
 * Captures campaign/tracking data from the current URL, referrer and Meta
 * cookies. Falls back to a "direct" source when no UTM params are present,
 * per the requirement that submissions never block on missing campaign data.
 */
export function captureTrackingData(jobSlug) {
  const params = new URLSearchParams(window.location.search);

  return {
    jobSlug,
    utmSource: params.get('utm_source') || '',
    utmMedium: params.get('utm_medium') || '',
    utmCampaign: params.get('utm_campaign') || '',
    utmContent: params.get('utm_content') || '',
    utmTerm: params.get('utm_term') || '',
    fbclid: params.get('fbclid') || '',
    fbp: readCookie('_fbp'),
    fbc: readCookie('_fbc'),
    referrerUrl: document.referrer || '',
    landingPageUrl: window.location.href,
    deviceType: detectDeviceType(),
    browser: detectBrowser(),
  };
}

export default captureTrackingData;
