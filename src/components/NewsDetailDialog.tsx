import React from 'react';
import { Calendar, Newspaper } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import type { NewsItem } from '@/lib/apiClient';
import { resolveImageUrl } from '@/lib/images';
import { formatDate } from '@/lib/format';
import { NEWS_BUCKET_ICONS } from '@/lib/labels';
import type { NewsBucket } from '@/lib/newsBuckets';
import Chip from '@/components/site/Chip';

export interface DialogNewsItem {
  id: string;
  title_en: string;
  description_en: string;
  category: string;
  image_url?: string;
  date: string;
}

/** Converts an API news item (or legacy shape) into what the dialog renders. */
export const toDialogNewsItem = (item: Partial<NewsItem> & { id: number | string; title_en?: string; description_en?: string; description?: string; image_url?: string | null; date?: string }): DialogNewsItem => ({
  id: String(item.id),
  title_en: item.title ?? item.title_en ?? '',
  description_en: item.content ?? item.description_en ?? item.description ?? '',
  category: item.category ?? 'placesVisited',
  image_url: item.imageUrl ?? item.image_url ?? undefined,
  date: item.createdAt ?? item.date ?? new Date().toISOString(),
});

interface NewsDetailDialogProps {
  newsItem: DialogNewsItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const NewsDetailDialog = ({ newsItem, isOpen, onClose }: NewsDetailDialogProps) => {
  const { t } = useLanguage();

  if (!newsItem) return null;

  const imageSrc = resolveImageUrl(newsItem.image_url);
  const Icon = NEWS_BUCKET_ICONS[newsItem.category as NewsBucket] || Newspaper;
  const categoryLabel = t(newsItem.category);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-h-[90vh] max-w-3xl gap-0 overflow-y-auto p-0">
        {imageSrc ? (
          <figure className="relative">
            <img src={imageSrc} alt={newsItem.title_en} className="aspect-[16/9] w-full object-cover" />
            <div className="absolute start-4 top-4">
              <Chip tone="onPhoto" icon={Icon}>{categoryLabel}</Chip>
            </div>
          </figure>
        ) : (
          <div className="flex h-28 items-center justify-center bg-brand-950 text-brand-200">
            <Icon className="h-10 w-10" aria-hidden="true" />
          </div>
        )}

        <div className="space-y-6 p-6 md:p-8">
          <div>
            <DialogTitle className="font-display text-h2 text-balance">{newsItem.title_en}</DialogTitle>
            <DialogDescription className="sr-only">{t('newsDetails')}</DialogDescription>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                {t('published')}: {formatDate(newsItem.date)}
              </span>
              <span className="inline-flex items-center gap-2">
                {t('category')}:
                <Chip tone="brand" icon={Icon}>{categoryLabel}</Chip>
              </span>
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-display text-h3">{t('fullStory')}</h3>
            <div className="prose prose-neutral max-w-none whitespace-pre-line dark:prose-invert">
              <p>{newsItem.description_en}</p>
            </div>
          </div>

          <aside className="rounded-card border-s-4 border-primary bg-muted p-6">
            <h3 className="font-display text-base font-semibold">{t('aboutThisNews')}</h3>
            <p className="mt-2 text-muted-foreground">{t('aboutThisNewsText')}</p>
          </aside>

          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>{t('close')}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewsDetailDialog;
