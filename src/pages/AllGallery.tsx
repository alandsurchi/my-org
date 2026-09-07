import React, { useState } from 'react';
import { ImageOff, Search } from 'lucide-react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGallery, type GalleryPhoto } from '@/hooks/useGalleryAPI';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/site/PageHero';
import FilterBar from '@/components/site/FilterBar';
import GalleryTile from '@/components/site/GalleryTile';
import EmptyState from '@/components/site/EmptyState';
import ErrorState from '@/components/site/ErrorState';

const AllGallery = () => {
  const { t } = useLanguage();
  usePageMeta({ title: t('galleryTitle'), description: t('allGalleryDescription') });
  const [searchTerm, setSearchTerm] = useState('');
  const { data: galleryImages = [], isLoading, error } = useGallery();

  const normalizedImages: GalleryPhoto[] = galleryImages.map((item, index) => ({
    ...item,
    id: item.id || String(index),
    url: item.url || '',
    title: item.title || 'Gallery photo',
    description: item.description || item.caption || '',
  }));

  const term = searchTerm.toLowerCase();
  const filteredImages = normalizedImages.filter(
    (image) => image.title.toLowerCase().includes(term) || image.description.toLowerCase().includes(term)
  );

  return (
    <div className="min-h-screen overflow-x-clip bg-background">
      <Header />
      <PageHero
        eyebrow={t('gallery')}
        title={t('galleryTitle')}
        description={t('allGalleryDescription')}
        backTo="/"
        backLabel={t('backToHome')}
      />

      <section className="pb-20 md:pb-28">
        <div className="container-site">
          <FilterBar>
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute start-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                aria-label={t('searchImages')}
                placeholder={t('searchImages')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-11 rounded-pill border-border bg-background ps-10"
              />
            </div>
          </FilterBar>

          {error ? (
            <ErrorState
              title={t('errorLoadingGallery')}
              detail={error.message}
              onRetry={() => window.location.reload()}
              retryLabel={t('retry')}
            />
          ) : isLoading ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4" aria-busy="true">
              {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-card" />)}
            </div>
          ) : filteredImages.length === 0 ? (
            <EmptyState
              icon={ImageOff}
              title={t('noPhotosYet')}
              description={t('noPhotosDescription')}
              action={searchTerm ? <Button variant="outline" onClick={() => setSearchTerm('')}>{t('clearSearch')}</Button> : undefined}
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
              {filteredImages.map((image, index) => (
                <GalleryTile key={image.id || index} photo={image} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AllGallery;
