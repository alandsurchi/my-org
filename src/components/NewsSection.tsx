import React, { useState } from 'react';
import { ArrowRight, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNews, type NewsItem } from '@/hooks/useNewsAPI';
import NewsDetailDialog, { toDialogNewsItem, type DialogNewsItem } from './NewsDetailDialog';
import Section from '@/components/site/Section';
import SectionHeading from '@/components/site/SectionHeading';
import PostCard from '@/components/site/PostCard';
import PostCardSkeleton from '@/components/site/PostCardSkeleton';
import EmptyState from '@/components/site/EmptyState';
import ErrorState from '@/components/site/ErrorState';
import { resolveImageUrl } from '@/lib/images';
import { excerpt, formatDate } from '@/lib/format';
import { NEWS_BUCKET_ICONS } from '@/lib/labels';
import { NEWS_BUCKETS, bucketNews, type NewsBucket } from '@/lib/newsBuckets';

const NewsSection = () => {
  const { t } = useLanguage();
  const [selectedNewsItem, setSelectedNewsItem] = useState<DialogNewsItem | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const { data: allNews = [], isLoading, error } = useNews();

  const buckets = bucketNews(allNews);

  const handleReadMore = (item: NewsItem) => {
    setSelectedNewsItem(toDialogNewsItem(item));
    setIsDetailDialogOpen(true);
  };

  const closeDetailDialog = () => {
    setIsDetailDialogOpen(false);
    setSelectedNewsItem(null);
  };

  const renderBucket = (bucket: NewsBucket) => {
    const items = [...buckets[bucket]]
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 3);
    const Icon = NEWS_BUCKET_ICONS[bucket];

    if (isLoading) {
      return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-busy="true">
          <PostCardSkeleton count={3} />
        </div>
      );
    }
    if (items.length === 0) {
      return <EmptyState icon={Newspaper} title={t('noNewsInCategory')} />;
    }
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <PostCard
            key={item.id}
            index={index}
            title={item.title || t('untitledNews')}
            excerpt={excerpt(item.content, 160)}
            imageUrl={resolveImageUrl(item.imageUrl)}
            imageAlt={item.title}
            placeholderIcon={Icon}
            categoryLabel={t(bucket)}
            categoryIcon={Icon}
            date={formatDate(item.createdAt)}
            readMoreLabel={t('readMore')}
            onOpen={() => handleReadMore(item)}
          />
        ))}
      </div>
    );
  };

  return (
    <Section id="news" tone="base">
      <div className="container-site">
        <SectionHeading eyebrow={t('news')} title={t('newsTitle')} description={t('latestNews')} />

        {error ? (
          <ErrorState title={t('errorLoadingNews')} />
        ) : (
          <Tabs defaultValue="placesVisited" className="w-full">
            <TabsList className="mb-10 grid h-auto w-full grid-cols-2 gap-1 rounded-card bg-muted p-1 sm:inline-flex sm:w-auto sm:rounded-pill">
              {NEWS_BUCKETS.map((bucket) => {
                const Icon = NEWS_BUCKET_ICONS[bucket];
                return (
                  <TabsTrigger
                    key={bucket}
                    value={bucket}
                    className="gap-2 rounded-pill px-4 py-2.5 text-sm font-medium text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {t(bucket)}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            {NEWS_BUCKETS.map((bucket) => (
              <TabsContent key={bucket} value={bucket} className="mt-0">
                {renderBucket(bucket)}
              </TabsContent>
            ))}
          </Tabs>
        )}

        <div className="fade-in-on-scroll mt-12 text-center">
          <Button asChild variant="outline" size="lg" className="rounded-pill">
            <Link to="/news">
              {t('viewAllNews')}
              <ArrowRight className="rtl:rotate-180" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>

      <NewsDetailDialog newsItem={selectedNewsItem} isOpen={isDetailDialogOpen} onClose={closeDetailDialog} />
    </Section>
  );
};

export default NewsSection;
