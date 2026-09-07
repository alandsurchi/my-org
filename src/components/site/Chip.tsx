import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ChipTone = 'neutral' | 'brand' | 'success' | 'warm' | 'onPhoto';

const TONE: Record<ChipTone, string> = {
  neutral: 'bg-muted text-foreground',
  brand: 'bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-100',
  success: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200',
  warm: 'bg-orange-100 text-orange-950 dark:bg-orange-950 dark:text-orange-200',
  onPhoto: 'bg-background/90 text-foreground backdrop-blur-sm shadow-sm',
};

export const STATUS_TONE: Record<string, ChipTone> = {
  active: 'success',
  completed: 'brand',
  planned: 'neutral',
  'on-hold': 'warm',
};

interface ChipProps {
  tone?: ChipTone;
  icon?: LucideIcon;
  className?: string;
  children: React.ReactNode;
}

const Chip = ({ tone = 'neutral', icon: Icon, className, children }: ChipProps) => (
  <span className={cn('inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-semibold leading-none', TONE[tone], className)}>
    {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
    {children}
  </span>
);

export default Chip;
