import type { NewsItem } from '@/lib/apiClient';

export type NewsBucket = 'placesVisited' | 'visitors' | 'certificatesReceived' | 'certificatesAwarded';

export const NEWS_BUCKETS: NewsBucket[] = ['placesVisited', 'visitors', 'certificatesReceived', 'certificatesAwarded'];

/**
 * Translation key for each bucket's label.
 *
 * Three of them happen to match their bucket name, but "visitors" is stored as
 * `visitorsToOrg`. Calling t('visitors') therefore fell through to t()'s
 * fallback and printed the raw key "visitors" in every language. This map makes
 * the label key explicit instead of assuming it equals the bucket name.
 */
export const NEWS_BUCKET_LABEL_KEYS: Record<NewsBucket, string> = {
  placesVisited: 'placesVisited',
  visitors: 'visitorsToOrg',
  certificatesReceived: 'certificatesReceived',
  certificatesAwarded: 'certificatesAwarded',
};

/**
 * Groups news posts into the four home-page tabs. The matching rules are the
 * ones the site has always used (category names plus Kurdish/English keywords).
 */
export function bucketNews(allNews: NewsItem[] | undefined): Record<NewsBucket, NewsItem[]> {
  const items = allNews || [];
  return {
    placesVisited: items.filter(item =>
      !item?.category || item?.category === null || item?.category === 'placesVisited' ||
      item?.category === 'Place Visited' || item?.category === 'سەردانی فەرمی' ||
      item?.title?.toLowerCase().includes('visit') || item?.content?.toLowerCase().includes('visit') ||
      item?.title?.toLowerCase().includes('delegation') || item?.content?.toLowerCase().includes('delegation') ||
      item?.title?.includes('سەردان') || item?.content?.includes('سەردان')
    ),
    visitors: items.filter(item =>
      item?.category === 'visitors' || item?.category === 'Visitors' || item?.category === 'میوانداری' ||
      item?.title?.includes('میوان') || item?.content?.includes('میوان')
    ),
    certificatesReceived: items.filter(item =>
      item?.category === 'certificatesReceived' || item?.category === 'Certificate Received' ||
      item?.category === 'وەرگرتنی سوپاس و پێزانین' ||
      item?.title?.toLowerCase().includes('certificate') || item?.content?.toLowerCase().includes('certificate') ||
      item?.title?.toLowerCase().includes('appreciation') || item?.content?.toLowerCase().includes('appreciation') ||
      item?.title?.includes('سوپاس') || item?.content?.includes('سوپاس') ||
      item?.title?.includes('پێزانین') || item?.content?.includes('پێزانین')
    ),
    certificatesAwarded: items.filter(item =>
      item?.category === 'certificatesAwarded' || item?.category === 'Certificate Awarded' ||
      item?.title?.toLowerCase().includes('volunteer') || item?.content?.toLowerCase().includes('volunteer') ||
      item?.title?.toLowerCase().includes('thank') || item?.content?.toLowerCase().includes('thank') ||
      item?.title?.includes('بەخشین') || item?.content?.includes('بەخشین')
    ),
  };
}
