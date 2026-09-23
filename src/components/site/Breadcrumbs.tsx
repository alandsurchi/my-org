import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useLanguage } from '@/contexts/LanguageContext';

export interface Crumb {
  label: string;
  /** Omitted on the last crumb, which renders as the current page. */
  to?: string;
}

/**
 * Breadcrumb trail for the navy PageHero band.
 *
 * Every colour here is an override, not decoration: the shadcn defaults are
 * text-muted-foreground and hover:text-foreground, which measure 3.15:1 against
 * bg-brand-950 — a serious axe colour-contrast violation. brand-200 is 12:1.
 */
const Breadcrumbs = ({ items }: { items: Crumb[] }) => {
  const { t } = useLanguage();

  return (
    <Breadcrumb aria-label={t('breadcrumbLabel')} className="mb-8">
      <BreadcrumbList className="text-brand-200">
        {items.map((crumb, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={`${crumb.label}-${index}`}>
              <BreadcrumbItem>
                {isLast || !crumb.to ? (
                  <BreadcrumbPage className="font-medium text-white">{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild className="hover:text-white">
                    {/* asChild keeps navigation inside the SPA; a bare <a> would full-page reload. */}
                    <Link to={crumb.to}>{crumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator className="text-brand-300">
                  <ChevronRight className="rtl:rotate-180" />
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
