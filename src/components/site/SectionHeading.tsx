import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  as?: 'h1' | 'h2';
  align?: 'start' | 'center';
  actions?: React.ReactNode;
  className?: string;
}

/** Eyebrow + title + description block used at the top of every section. */
const SectionHeading = ({ eyebrow, title, description, as = 'h2', align = 'start', actions, className }: SectionHeadingProps) => {
  const Heading = as;
  return (
    <div
      className={cn(
        'fade-in-on-scroll mb-12 flex flex-col gap-6 md:mb-16',
        actions ? 'md:flex-row md:items-end md:justify-between' : '',
        align === 'center' && !actions ? 'items-center text-center' : '',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && !actions ? 'mx-auto' : '')}>
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <Heading className="font-display text-h2 text-balance">{title}</Heading>
        {description && <p className="mt-4 text-lead text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
};

export default SectionHeading;
