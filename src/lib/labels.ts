import {
  Award, Building2, Droplets, GraduationCap, Hammer, HeartPulse, MapPin, Newspaper, Package,
  ShoppingBasket, Siren, Trophy, Users, type LucideIcon,
} from 'lucide-react';
import type { NewsBucket } from '@/lib/newsBuckets';

type Translate = (key: string) => string;

/** Category values offered in the public category filters (same order as before). */
export const PROJECT_FILTER_CATEGORIES = ['news', 'water', 'education', 'emergency', 'healthcare'] as const;

export const PROJECT_CATEGORY_ICONS: Record<string, LucideIcon> = {
  water: Droplets,
  education: GraduationCap,
  emergency: Siren,
  healthcare: HeartPulse,
  news: Newspaper,
  provision: ShoppingBasket,
  distribution: Package,
  renovation: Hammer,
  building: Building2,
};

export const NEWS_BUCKET_ICONS: Record<NewsBucket, LucideIcon> = {
  placesVisited: MapPin,
  visitors: Users,
  certificatesReceived: Award,
  certificatesAwarded: Trophy,
};

/** Human label for a project category (projects without a category count as "provision", as before). */
export function projectCategoryLabel(category: string | null | undefined, t: Translate): string {
  const key = category || 'provision';
  if (key === 'news') return t('newsUpdates');
  const known = ['provision', 'distribution', 'renovation', 'building', 'water', 'education', 'emergency', 'healthcare'];
  if (known.includes(key)) return t(key);
  return key.charAt(0).toUpperCase() + key.slice(1);
}

export function projectCategoryIcon(category: string | null | undefined): LucideIcon {
  return PROJECT_CATEGORY_ICONS[category || 'provision'] || ShoppingBasket;
}

export type ProjectStatus = 'active' | 'completed' | 'planned' | 'on-hold';

export function projectStatusLabel(status: string | null | undefined, t: Translate): string {
  switch (status) {
    case 'active': return t('statusActive');
    case 'planned': return t('statusPlanned');
    case 'on-hold': return t('statusOnHold');
    case 'completed':
    default: return t('statusCompleted');
  }
}
