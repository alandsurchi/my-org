import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface PageHeroProps {
  title: string;
  description?: string;
  eyebrow?: string;
  backTo?: string;
  backLabel?: string;
  children?: React.ReactNode;
}

/**
 * Navy title band at the top of the list pages and the 404 page. It carries
 * id="main-content" (skip-link target) and is the first <section> in the DOM,
 * which keeps the header in its on-photo tone.
 */
const PageHero = ({ title, description, eyebrow, backTo, backLabel, children }: PageHeroProps) => (
  <section id="main-content" className="relative bg-brand-950 pb-28 pt-28 text-white md:pb-36 md:pt-36">
    <div className="container-site">
      {backTo && backLabel && (
        <Link to={backTo} className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-brand-200 hover:text-white">
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          {backLabel}
        </Link>
      )}
      {eyebrow && <p className="eyebrow mb-4 text-brand-200 [&::before]:bg-accent-warm">{eyebrow}</p>}
      <h1 className="font-display text-h1 text-balance">{title}</h1>
      {description && <p className="mt-4 max-w-2xl text-lead text-brand-100">{description}</p>}
      {children}
    </div>
  </section>
);

export default PageHero;
