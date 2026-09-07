import React, { useState } from 'react';
import { Newspaper, Search } from 'lucide-react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNews, type NewsItem } from '@/hooks/useNewsAPI';
import NewsDetailDialog, { toDialogNewsItem, type DialogNewsItem } from '@/components/NewsDetailDialog';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/site/PageHero';
import FilterBar from '@/components/site/FilterBar';
import PostCard from '@/components/site/PostCard';
import PostCardSkeleton from '@/components/site/PostCardSkeleton';
import EmptyState from '@/components/site/EmptyState';
import ErrorState from '@/components/site/ErrorState';
import { resolveImageUrl } from '@/lib/images';
import { excerpt, formatDate } from '@/lib/format';

const AllNews = () => {
  const { t } = useLanguage();
  usePageMeta({ title: t('allNewsTitle'), description: t('allNewsDescription') });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNewsItem, setSelectedNewsItem] = useState<DialogNewsItem | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const { data: allNews = [], isLoading, error } = useNews();

  const term = searchTerm.toLowerCase();
  const filteredNews = allNews.filter((item) =>
    !!item && ((item.title || '').toLowerCase().includes(term) || (item.content || '').toLowerCase().includes(term))
  );

  const handleReadMore = (newsItem: NewsItem) => {
    // Same as before: the list page shows every post under the generic "News" label
    setSelectedNewsItem({ ...toDialogNewsItem(newsItem), category: 'News' });
    setIsDetailDialogOpen(true);
  };

  const closeDetailDialog = () => {
    setIsDetailDialogOpen(false);
    setSelectedNewsItem(null);
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-background">
      <Header />
      <PageHero
        eyebrow={t('news')}
        title={t('allNewsTitle')}
        description={t('allNewsDescription')}
        backTo="/"
        backLabel={t('backToHome')}
      />

      <section className="pb-20 md:pb-28">
        <div className="container-site">
          <FilterBar>
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute start-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                aria-label={t('searchNews')}
                placeholder={t('searchNews')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-11 rounded-pill border-border bg-background ps-10"
              />
            </div>
          </FilterBar>

          {error ? (
            <ErrorState
              title={t('errorLoadingNews')}
              detail={error.message}
              onRetry={() => window.location.reload()}
              retryLabel={t('retry')}
            />
          ) : isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-busy="true">
              <PostCardSkeleton count={6} />
            </div>
          ) : filteredNews.length === 0 ? (
            <EmptyState
              icon={Newspaper}
              title={allNews.length === 0 ? t('noNewsYet') : t('noNewsFound')}
              action={searchTerm ? <Button variant="outline" onClick={() => setSearchTerm('')}>{t('clearSearch')}</Button> : undefined}
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredNews.map((item, index) => (
                <PostCard
                  key={item.id}
                  index={index}
                  title={item.title || t('untitledNews')}
                  excerpt={excerpt(item.content, 160)}
                  imageUrl={resolveImageUrl(item.imageUrl)}
                  imageAlt={item.title}
                  placeholderIcon={Newspaper}
                  categoryLabel={t('news')}
                  categoryIcon={Newspaper}
                  date={formatDate(item.createdAt)}
                  readMoreLabel={t('readMore')}
                  onOpen={() => handleReadMore(item)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />

      <NewsDetailDialog newsItem={selectedNewsItem} isOpen={isDetailDialogOpen} onClose={closeDetailDialog} />
    </div>
  );
};

export default AllNews;
