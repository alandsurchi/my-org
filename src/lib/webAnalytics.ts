declare global {
  interface Window {
    __CF_BEACON_TOKEN__?: string;
  }
}

/** Staff pages are never measured — same list as the first-party beacon. */
const STAFF_ROUTES = /^\/(dashboard|staff-login|forgot-password|reset-password)/;

/**
 * Cloudflare Web Analytics: cookie-less visit counting with no cross-site
 * tracking. server.mjs injects the token only when CF_BEACON_TOKEN is set, so
 * with it unset this is a no-op and the page makes no request to Cloudflare.
 *
 * Loading the beacon from here rather than letting Cloudflare auto-inject it
 * means it obeys the same two rules our own analytics already obeys: Do Not
 * Track is honoured, and staff pages are never measured.
 */
export const initWebAnalytics = () => {
  try {
    const token = window.__CF_BEACON_TOKEN__;
    if (!token) return;
    if (navigator.doNotTrack === '1') return;
    if (STAFF_ROUTES.test(window.location.pathname)) return;

    const script = document.createElement('script');
    script.defer = true;
    script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    script.setAttribute('data-cf-beacon', JSON.stringify({ token }));
    document.head.appendChild(script);
  } catch {
    // Analytics must never break the page.
  }
};
