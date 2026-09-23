/**
 * Language union for the content modules.
 *
 * Declared here rather than imported from LanguageContext so that the content
 * modules stay a leaf of the import graph: LanguageContext imports uiStrings,
 * not the other way round.
 */
export type Lang = 'en' | 'ar' | 'ku';
