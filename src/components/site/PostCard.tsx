import React from 'react';
import { ArrowRight, Calendar, MapPin, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Chip, { STATUS_TONE, type ChipTone } from './Chip';

export interface PostCardProps {
  title: string;
  excerpt: string;
  imageUrl: string | null;
  imageAlt?: string;
  /** Shown in a brand tile when there is no image (news posts). */
  placeholderIcon?: LucideIcon;
  categoryLabel?: string;
  categoryIcon?: LucideIcon;
  statusLabel?: string;
  statusKey?: string;
  date?: string;
  location?: string | null;
  readMoreLabel: string;
  onOpen: () => void;
  index?: number;
  className?: string;
}

/**
 * The one card used for activities and news, on the home page and the list
 * pages. The whole card is clickable; the title and the "read more" link are
 * the real keyboard controls.
 */
const PostCard = ({
  title, excerpt, imageUrl, imageAlt, placeholderIcon: Placeholder, categoryLabel, categoryIcon,
  statusLabel, statusKey, date, location, readMoreLabel, onOpen, index = 0, className,
}: PostCardProps) => {
  const statusTone: ChipTone = STATUS_TONE[statusKey || ''] || 'brand';
  return (
    <article
      className={cn(
        'group card-surface fade-in-on-scroll flex h-full cursor-pointer flex-col overflow-hidden',
        'motion-safe:transition-[box-shadow,transform] motion-safe:duration-base motion-safe:ease-out hover:-translate-y-0.5 hover:shadow-card-hover',
        className,
      )}
      style={{ transitionDelay: `${Math.min(index, 5) * 40}ms` }}
      onClick={onOpen}
    >
      <figure className="relative aspect-[16/10] overflow-hidden bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt ?? ''}
            loading="lazy"
            decoding="async"
            className="img-hover h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-brand-900 text-brand-200">
            {Placeholder && <Placeholder className="h-14 w-14 opacity-80" aria-hidden="true" />}
          </div>
        )}
        {categoryLabel && (
          <Chip tone="onPhoto" icon={categoryIcon} className="absolute start-3 top-3">
            {categoryLabel}
          </Chip>
        )}
        {statusLabel && (
          <Chip tone={statusTone} className="absolute end-3 top-3">
            {statusLabel}
          </Chip>
        )}
      </figure>

      <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
        <h3 className="font-display text-h3 text-foreground">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onOpen(); }}
            className="line-clamp-2 text-start transition-colors group-hover:text-primary"
          >
            {title}
          </button>
        </h3>
        {excerpt && <p className="line-clamp-3 text-muted-foreground">{excerpt}</p>}

        <div className="mt-auto flex min-h-11 items-center justify-between gap-3 border-t border-border pt-4 text-sm text-muted-foreground">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {date && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                {date}
              </span>
            )}
            {location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {location}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onOpen(); }}
            className="inline-flex shrink-0 items-center gap-1 font-semibold text-primary hover:underline"
          >
            {readMoreLabel}
            <ArrowRight className="h-4 w-4 rtl:rotate-180 motion-safe:transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
