import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Section from './Section';
import PostCardSkeleton from './PostCardSkeleton';

/** Loading placeholder for a whole home-page section. Never render it before the hero. */
const SectionSkeleton = ({ cards = 3, tone = 'base' as const }: { cards?: number; tone?: 'base' | 'muted' }) => (
  <Section tone={tone} aria-busy="true">
    <div className="container-site">
      <div className="mb-12 max-w-2xl space-y-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-5 w-full" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PostCardSkeleton count={cards} />
      </div>
    </div>
  </Section>
);

export default SectionSkeleton;
