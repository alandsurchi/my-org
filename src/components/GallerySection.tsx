import React from 'react';
import { Camera, ImageOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGallery } from '@/hooks/useGalleryAPI';
import Section from '@/components/site/Section';
import SectionHeading from '@/components/site/SectionHeading';
import GalleryTile from '@/components/site/GalleryTile';
import EmptyState from '@/components/site/EmptyState';

const GallerySection = () => {
  const { t } = useLanguage();
  const { data: galleryImages = [], isLoading } = useGallery();
  const photos = galleryImages.slice(0, 6);

  return (
    <Section id="gallery" tone="muted">
      <div className="container-site">
        <SectionHeading eyebrow={t('gallery')} title={t('galleryTitle')} description={t('galleryDescription')} />

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4" aria-busy="true">
            <Skeleton className="aspect-square rounded-card md:col-span-2 md:row-span-2" />
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-card" />)}
          </div>
        ) : photos.length === 0 ? (
          <EmptyState icon={ImageOff} title={t('galleryTitle')} description={t('galleryDescription')} />
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {photos.map((photo, index) => (
              <GalleryTile key={photo.id || index} photo={photo} featured={index === 0} index={index} />
            ))}
          </div>
        )}

        <div className="fade-in-on-scroll mt-12 text-center">
          <Button asChild variant="outline" size="lg" className="rounded-pill">
            <Link to="/gallery">
              <Camera aria-hidden="true" />
              {t('viewAllImages')}
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  );
};

export default GallerySection;
