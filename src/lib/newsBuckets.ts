import type { NewsItem } from '@/lib/apiClient';

export type NewsBucket = 'all' | 'placesVisited' | 'visitors' | 'certificatesReceived' | 'certificatesAwarded';

/** "all" is first and is the default tab: visitors see the newest posts before filtering. */
export const NEWS_BUCKETS: NewsBucket[] = [
  'all',
  'placesVisited',
  'visitors',
  'certificatesReceived',
  'certificatesAwarded',
];

/**
 * Translation key for each bucket's label.
 *
 * Most match their bucket name, but "visitors" is stored as `visitorsToOrg`.
 * Calling t('visitors') fell through to t()'s fallback and printed the raw key.
 */
export const NEWS_BUCKET_LABEL_KEYS: Record<NewsBucket, string> = {
  all: 'newsAll',
  placesVisited: 'placesVisited',
  visitors: 'visitorsToOrg',
  certificatesReceived: 'certificatesReceived',
  certificatesAwarded: 'certificatesAwarded',
};

/**
 * Every category value that has ever been written to the database, mapped to
 * the tab it belongs in. Compared lower-cased and trimmed.
 *
 * The dashboard has written several shapes over time: the English labels from
 * the template flow ("Place Visited"), the raw template ids when a post was
 * saved through the free-writing path ("KurdishVisitors"), and the Kurdish
 * labels themselves.
 */
const CATEGORY_TO_BUCKET: Record<string, Exclude<NewsBucket, 'all'>> = {
  // English labels written by the template flow
  'place visited': 'placesVisited',
  visitors: 'visitors',
  'certificate received': 'certificatesReceived',
  'certificate awarded': 'certificatesAwarded',

  // Raw template ids that reach the database through the free-writing path
  sardaniframi: 'placesVisited',
  kurdishvisitors: 'visitors',
  // The dashboard labels this one "Certificate Received", so it belongs there.
  kurdishcertificate: 'certificatesReceived',
  kurdishcertgroup: 'certificatesReceived',
  kurdishcertindividual: 'certificatesReceived',

  // Kurdish labels
  'سەردانی فەرمی': 'placesVisited',
  میوانداری: 'visitors',
  'وەرگرتنی سوپاس و پێزانین': 'certificatesReceived',

  // The bucket ids themselves
  placesvisited: 'placesVisited',
  certificatesreceived: 'certificatesReceived',
  certificatesawarded: 'certificatesAwarded',
};

/** Ordered keyword rules, used ONLY when a post's category is unrecognised. */
const KEYWORD_RULES: { bucket: Exclude<NewsBucket, 'all'>; patterns: string[] }[] = [
  { bucket: 'certificatesAwarded', patterns: ['volunteer', 'بەخشین'] },
  { bucket: 'certificatesReceived', patterns: ['certificate', 'appreciation', 'سوپاس', 'پێزانین'] },
  { bucket: 'visitors', patterns: ['میوان'] },
  { bucket: 'placesVisited', patterns: ['visit', 'delegation', 'سەردان'] },
];

/** The tab a post belongs in. Its category decides; keywords are only a fallback. */
export function newsBucketOf(item: NewsItem): Exclude<NewsBucket, 'all'> {
  const category = String(item?.category ?? '').trim().toLowerCase();
  const mapped = CATEGORY_TO_BUCKET[category];
  // An explicit category is the author's intent and always wins. Previously the
  // keyword rules ran alongside it, so a post categorised "Visitors" whose text
  // merely contained the word "visit" also appeared under Places Visited.
  if (mapped) return mapped;

  const haystack = `${item?.title ?? ''} ${item?.content ?? ''}`.toLowerCase();
  // First match wins, so a post can never land in two tabs at once.
  for (const rule of KEYWORD_RULES) {
    if (rule.patterns.some((p) => haystack.includes(p))) return rule.bucket;
  }
  return 'placesVisited';
}

/**
 * Groups news posts into the home-page tabs.
 *
 * Every post appears in exactly one category tab, plus "all".
 */
export function bucketNews(allNews: NewsItem[] | undefined): Record<NewsBucket, NewsItem[]> {
  const items = (allNews || []).filter(Boolean);
  const grouped: Record<NewsBucket, NewsItem[]> = {
    all: items,
    placesVisited: [],
    visitors: [],
    certificatesReceived: [],
    certificatesAwarded: [],
  };
  for (const item of items) grouped[newsBucketOf(item)].push(item);
  return grouped;
}
