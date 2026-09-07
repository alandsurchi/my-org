import React from 'react';
import { cn } from '@/lib/utils';

type Tone = 'base' | 'muted' | 'brand';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  tone?: Tone;
  children: React.ReactNode;
}

const TONE: Record<Tone, string> = {
  base: 'bg-background text-foreground',
  muted: 'bg-muted text-foreground',
  brand: 'bg-brand-950 text-brand-50',
};

/** A page section. Always a real <section> so section ids keep working. */
const Section = ({ id, tone = 'base', className, children, ...rest }: SectionProps) => (
  <section id={id} className={cn('relative section-pad', TONE[tone], className)} {...rest}>
    {children}
  </section>
);

export default Section;
