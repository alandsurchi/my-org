import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

/** Placeholder cards with the same anatomy as PostCard, so the layout does not jump. */
const PostCardSkeleton = ({ count = 3 }: { count?: number }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="card-surface flex flex-col overflow-hidden max-sm:flex-row" aria-hidden="true">
        <Skeleton className="aspect-[16/10] w-full rounded-none max-sm:aspect-auto max-sm:min-h-28 max-sm:w-28 max-sm:shrink-0" />
        <div className="flex flex-col gap-3 p-5 md:p-6 max-sm:flex-1 max-sm:gap-2 max-sm:p-3">
          <Skeleton className="h-6 w-4/5" />
          <Skeleton className="h-6 w-3/5 max-sm:hidden" />
          <div className="mt-1 space-y-2 max-sm:mt-0">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3 max-sm:hidden" />
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-border pt-4 max-sm:hidden">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
    ))}
  </>
);

export default PostCardSkeleton;
