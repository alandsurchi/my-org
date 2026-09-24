/**
 * The news templates offered in the dashboard, and the category each one saves.
 *
 * This is the single source of truth. The mapping used to be written out twice
 * in NewsTab — once in the template flow and again in the free-writing flow —
 * and the two copies drifted: both saved "وەرگرتنی سوپاس و پێزانین
 * (Certificate Received)" as `Certificate Awarded`, so posts landed under the
 * opposite tab from the one the author picked.
 *
 * All three certificate templates say وەرگرتنی ("receiving"), so all three save
 * `Certificate Received`. `Certificate Awarded` remains available when editing a
 * post directly.
 */
export interface NewsTemplate {
  /** Value stored in the dashboard's select. */
  id: string;
  label: string;
  /** Category written to the database. Must match NEWS_CATEGORIES in PostEditDialog. */
  category: string;
}

export const NEWS_TEMPLATES: NewsTemplate[] = [
  { id: 'SardaniFrami', label: 'سەردانی فەرمی (Official Visit)', category: 'Place Visited' },
  { id: 'KurdishVisitors', label: 'میوانداری (Visitors)', category: 'Visitors' },
  { id: 'KurdishCertificate', label: 'وەرگرتنی سوپاس و پێزانین (Certificate Received)', category: 'Certificate Received' },
  { id: 'KurdishCertGroup', label: 'وەرگرتنی سوپاس - کۆمەڵگا (Certificate - Group)', category: 'Certificate Received' },
  { id: 'KurdishCertIndividual', label: 'وەرگرتنی سوپاس - تاک (Certificate - Individual)', category: 'Certificate Received' },
];

/** The category a template saves. Falls back to the original default. */
export function categoryForTemplate(templateId: string | null | undefined): string {
  return NEWS_TEMPLATES.find((t) => t.id === templateId)?.category ?? 'Place Visited';
}
