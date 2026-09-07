import React from 'react';
import { cn } from '@/lib/utils';
import type { GalleryPhoto } from '@/hooks/useGalleryAPI';

interface GalleryTileProps {
  photo: GalleryPhoto;
  featured?: boolean;
  index?: number;
  onView?: (photo: GalleryPhoto) => void;
  viewLabel?: string;
  className?: string;
}

/** Square photo tile with an always-visible caption. */
const GalleryTile = ({ photo, featured = false, index = 0, onView, viewLabel, className }: GalleryTileProps) => (
  <figure
    className={cn(
      'group fade-in-on-scroll relative overflow-hidden rounded-card bg-muted',
      featured ? 'aspect-square md:col-span-2 md:row-span-2' : 'aspect-square',
      className,
    )}
    style={{ transitionDelay: `${Math.min(index, 5) * 40}ms` }}
  >
    <img
      src={photo.url || '/placeholder.svg'}
      alt={photo.title}
      loading="lazy"
      decoding="async"
      className="img-hover h-full w-full object-cover"
      onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
    />
    <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-950/85 via-brand-950/40 to-transparent p-4 pt-12 text-white">
      <p className={cn('line-clamp-1 font-semibold', featured ? 'text-lg' : 'text-sm')}>{photo.title}</p>
      {featured && photo.description && <p className="line-clamp-2 text-sm text-white/85">{photo.description}</p>}
    </figcaption>
    {onView && (
      <button
        type="button"
        onClick={() => onView(photo)}
        aria-label={`${viewLabel || 'View'}: ${photo.title}`}
        className="absolute inset-0 cursor-pointer rounded-card"
      />
    )}
  </figure>
);

export default GalleryTile;
