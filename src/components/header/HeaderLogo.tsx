import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import type { HeaderTone } from './types';

interface HeaderLogoProps {
  tone: HeaderTone;
}

/** Logo + wordmark. Staff sign in at /dashboard, so there is no hidden shortcut here. */
const HeaderLogo: React.FC<HeaderLogoProps> = ({ tone }) => {
  const { t } = useLanguage();

  return (
    <div className="flex min-w-0 select-none items-center gap-2 min-[375px]:gap-3">
      <img
        src="/lovable-uploads/eb6198ca-261c-4e22-ba5c-9af9f83d0c52.png"
        /* Decorative: the {t('orgName')} wordmark beside it already names the organisation. */
        alt=""
        width={48}
        height={48}
        className="h-10 w-10 shrink-0 rounded-full bg-white object-contain p-0.5 shadow-sm min-[375px]:h-11 min-[375px]:w-11 sm:h-12 sm:w-12"
      />
      <span className={cn('truncate font-display text-base font-bold tracking-tight min-[375px]:text-lg sm:text-xl', tone === 'photo' ? 'text-white' : 'text-foreground')}>
        {t('orgName')}
      </span>
    </div>
  );
};

export default HeaderLogo;
