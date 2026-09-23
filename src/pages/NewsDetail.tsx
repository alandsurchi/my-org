import React from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Newspaper } from 'lucide-react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNewsById } from '@/hooks/useNewsAPI';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/site/PageHero';
import EmptyState from '@/components/site/EmptyState';
import ErrorState from '@/components/site/ErrorState';
import { Skeleton } from '@/components/ui/skeleton';
import { resolveImageUrl } from '@/lib/images';
import { excerpt, formatDate } from '@/lib/format';

/** One news post, at its own address, so it can be shared, linked and indexed. */
const NewsDetail = () => {
  const { t } = useLanguage();
  const { id = '' } = useParams();
  const { data: item, isLoading, error } = useNewsById(id);

  const title = item?.title || '';
  const content = item?.content || '';
  usePageMeta({
    title: title || t('allNewsTitle'),
    description: excerpt(content, 160) || t('allNewsDescription'),
  });

  const imageSrc = resolveImageUrl(item?.imageUrl);

  return (
    <div className="min-h-screen overflow-x-clip bg-background">
      <Header />
      <PageHero
        eyebrow={t('news')}
        title={title || (isLoading ? '…' : t('pageNotFound'))}
        breadcrumbs={[
          { label: t('home'), to: '/' },
          { label: t('allNewsTitle'), to: '/news' },
          { label: title || t('newsDetails') },
        ]}
      />

      <section className="pb-20 pt-12 md:pb-28">
        <div className="container-site max-w-3xl">
          {error ? (
            <ErrorState
              title={t('errorLoadingNews')}
              detail={error.message}
              onRetry={() => window.location.reload()}
              retryLabel={t('retry')}
            />
          ) : isLoading ? (
            <div aria-busy="true" className="space-y-4">
              <Skeleton className="aspect-[16/9] w-full rounded-card" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
            </div>
          ) : !item ? (
            <EmptyState icon={Newspaper} title={t('noNewsFound')} description={t('pageNotFound')} />
          ) : (
            <article>
              {imageSrc && (
                <figure className="relative mb-8 overflow-hidden rounded-card">
                  <img
                    src={imageSrc}
                    alt={title || t('newsImageAlt')}
                    className="aspect-[16/9] w-full object-cover"
                  />
                </figure>
              )}

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  {t('published')}: {formatDate(item.createdAt)}
                </span>
              </div>

              <h2 className="mb-3 mt-10 font-display text-h3">{t('fullStory')}</h2>
              <div className="prose prose-lg max-w-none whitespace-pre-line dark:prose-invert">
                <p>{content}</p>
              </div>

              <aside className="mt-10 rounded-card border-s-4 border-primary bg-muted p-6">
                <h2 className="font-display text-base font-semibold">{t('aboutThisNews')}</h2>
                <p className="mt-2 text-muted-foreground">{t('aboutThisNewsText')}</p>
              </aside>
            </article>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NewsDetail;
