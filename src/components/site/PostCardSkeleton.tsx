import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

/** Placeholder cards with the same anatomy as PostCard, so the layout does not jump. */
const PostCardSkeleton = ({ count = 3 }: { count?: number }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="card-surface flex flex-col overflow-hidden" aria-hidden="true">
        <Skeleton className="aspect-[16/10] w-full rounded-none" />
        <div className="flex flex-col gap-3 p-5 md:p-6">
          <Skeleton className="h-6 w-4/5" />
          <Skeleton className="h-6 w-3/5" />
          <div className="mt-1 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-border pt-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
    ))}
  </>
);

export default PostCardSkeleton;
