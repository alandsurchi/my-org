import type { PostTranslations } from '@/lib/apiClient';
import type { Language } from '@/contexts/LanguageContext';

/**
 * Picks the right language for a post's text.
 *
 * Posts are written in Kurdish and stored that way; English and Arabic are
 * machine translations held alongside. Before this existed, an English or
 * Arabic visitor read the Kurdish original, which made the language switcher
 * cosmetic for everything except the interface labels.
 *
 * Always falls back to the Kurdish original rather than showing nothing: a
 * missing or failed translation should degrade to "readable by some" rather
 * than "blank".
 */
export interface Translatable {
  title?: string | null;
  translations?: PostTranslations | null;
}

/** The post's title in `language`, falling back to the original. */
export function postTitle(post: Translatable | null | undefined, language: Language): string {
  if (!post) return '';
  const original = post.title || '';
  if (language === 'ku') return original;
  const translated = post.translations?.[language]?.title;
  return translated?.trim() ? translated : original;
}

/** The post's body in `language`, falling back to the original. */
export function postBody(
  post: (Translatable & { body?: string | null }) | null | undefined,
  originalBody: string | null | undefined,
  language: Language,
): string {
  const original = originalBody || '';
  if (!post || language === 'ku') return original;
  const translated = post.translations?.[language]?.body;
  return translated?.trim() ? translated : original;
}

/** True when this post has no translation for the language being read. */
export function isUntranslated(post: Translatable | null | undefined, language: Language): boolean {
  if (!post || language === 'ku') return false;
  return !post.translations?.[language]?.title?.trim();
}
