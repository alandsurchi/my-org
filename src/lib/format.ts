/** Locale-aware short date ("Sep 8, 2026" / "٨ أيلول ٢٠٢٦"), never throws. */
export function formatDate(value?: string | number | Date | null): string {
  const d = value ? new Date(value) : new Date();
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

/** Trims text to `max` characters at a word boundary and appends an ellipsis. */
export function excerpt(text: string | null | undefined, max = 160): string {
  const clean = (text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

/** Sort key for items that may carry either `created_at` or `createdAt`. */
export function getSortTime(item: { created_at?: string | null; createdAt?: string | null }): number {
  const t = new Date(item.created_at || item.createdAt || 0).getTime();
  return Number.isNaN(t) ? 0 : t;
}
