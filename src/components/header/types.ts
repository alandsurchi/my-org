/** 'photo' = header floats over the hero/page band (white text); 'surface' = solid bar after scrolling. */
export type HeaderTone = 'photo' | 'surface';

export interface NavItem {
  id: 'home' | 'about' | 'projects' | 'news' | 'gallery';
  labelKey: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', labelKey: 'home' },
  { id: 'about', labelKey: 'about' },
  { id: 'projects', labelKey: 'projects' },
  { id: 'news', labelKey: 'news' },
  { id: 'gallery', labelKey: 'gallery' },
];
