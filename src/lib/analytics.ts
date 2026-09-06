import { config } from '@/config/env';

/**
 * First-party page-view beacon. Sends only the path, referrer, language and
 * device class to our own backend. No cookies, no third parties. Skipped for
 * staff pages and for visitors who enabled "Do Not Track".
 */
export const trackPageView = (path: string, lang: string) => {
  try {
    if (/^\/(dashboard|staff-login|forgot-password|reset-password)/.test(path)) return;
    if (navigator.doNotTrack === '1') return;
    const payload = JSON.stringify({
      path,
      referrer: document.referrer || undefined,
      lang,
      device: window.matchMedia('(max-width: 767px)').matches ? 'mobile' : 'desktop',
    });
    const url = `${config.apiUrl}/analytics/view`;
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([payload], { type: 'application/json' }));
    } else {
      fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true }).catch(() => {});
    }
  } catch {
    // analytics must never break the page
  }
};
