const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

let metaPixelLoaded = false;
let gaLoaded = false;
const firedOnce = new Set();

function loadMetaPixel() {
  if (metaPixelLoaded || !META_PIXEL_ID) return;
  metaPixelLoaded = true;

  /* eslint-disable */
  (function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
    t = b.createElement(e); t.async = true; t.src = v;
    s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */

  window.fbq('init', META_PIXEL_ID);
  window.fbq('track', 'PageView');
}

function loadGoogleAnalytics() {
  if (gaLoaded || !GA_MEASUREMENT_ID) return;
  gaLoaded = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: true });
}

export function initTracking() {
  loadMetaPixel();
  loadGoogleAnalytics();
}

/**
 * Fires a named tracking event to whichever providers are configured.
 * `once` de-dupes events (e.g. form-view) so a re-render or refresh doesn't
 * double-count; ApplicationSubmitSuccess is intentionally never deduped by
 * caller-provided event id so the same page load can't fire two Leads for
 * two different candidates.
 */
export function trackEvent(eventName, payload = {}, { once = false, dedupeKey } = {}) {
  const key = dedupeKey || eventName;
  if (once && firedOnce.has(key)) return;
  if (once) firedOnce.add(key);

  if (window.fbq && META_PIXEL_ID) {
    if (eventName === 'ApplicationSubmitSuccess') {
      window.fbq('track', 'Lead', payload);
    } else {
      window.fbq('trackCustom', eventName, payload);
    }
  }

  if (window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('event', eventName, payload);
  }
}

export default { initTracking, trackEvent };
