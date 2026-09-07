import { config } from '@/config/env';

/** Shown when no hero image has been uploaded yet. */
export const HERO_FALLBACK =
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';

/** Shown when no about image has been uploaded yet. */
export const ABOUT_FALLBACK =
  'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=1200&h=1500&fit=crop';

/**
 * Turns an image path returned by the API into a URL the browser can load.
 * Absolute URLs pass through; relative paths (e.g. /uploads/news/x.webp) are
 * prefixed with the CDN/API host. Static assets under /public must not go
 * through here.
 */
export function resolveImageUrl(url: string | null | undefined, fallback: string | null = null): string | null {
  if (!url) return fallback;
  if (/^https?:\/\//i.test(url)) return url;
  return `${config.cdnUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}
