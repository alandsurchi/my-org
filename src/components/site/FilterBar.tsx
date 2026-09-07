import React from 'react';
import { cn } from '@/lib/utils';

/** Card that overlaps the page band and holds search/filter controls. */
const FilterBar = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('card-surface relative z-10 -mt-16 mb-10 flex flex-col gap-3 p-3 md:-mt-20 md:flex-row md:items-center md:p-4', className)}>
    {children}
  </div>
);

export default FilterBar;
