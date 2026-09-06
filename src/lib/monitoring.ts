declare global {
  interface Window {
    __SENTRY_DSN__?: string;
  }
}

/**
 * Error monitoring for the browser. The DSN is injected at runtime by
 * server.mjs (SENTRY_DSN variable on the web service), so no rebuild is needed
 * to turn it on, and the Sentry code is only downloaded when it is configured.
 */
export const initMonitoring = async () => {
  const dsn = window.__SENTRY_DSN__;
  if (!dsn) return;
  try {
    const Sentry = await import('@sentry/react');
    Sentry.init({
      dsn,
      environment: import.meta.env.MODE,
      tracesSampleRate: 0.1,
      beforeSend(event) {
        // Never send anything typed into the staff pages
        if (location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/staff-login')) {
          delete event.request;
        }
        return event;
      },
    });
  } catch {
    // monitoring is optional
  }
};

export const reportError = async (error: unknown, context?: Record<string, unknown>) => {
  if (!window.__SENTRY_DSN__) return;
  try {
    const Sentry = await import('@sentry/react');
    Sentry.captureException(error, { extra: context });
  } catch {
    // ignore
  }
};
