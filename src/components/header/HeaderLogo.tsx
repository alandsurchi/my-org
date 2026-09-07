import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import type { HeaderTone } from './types';

interface HeaderLogoProps {
  tone: HeaderTone;
}

/** Logo + wordmark. Keeps the `.logo-trigger` class used by the hidden staff shortcut. */
const HeaderLogo: React.FC<HeaderLogoProps> = ({ tone }) => {
  const { t } = useLanguage();

  return (
    <div className="logo-trigger flex cursor-pointer select-none items-center gap-3">
      <img
        src="/lovable-uploads/eb6198ca-261c-4e22-ba5c-9af9f83d0c52.png"
        alt="Mrovdostan for Humanitarian Aid Logo"
        width={48}
        height={48}
        className="h-11 w-11 rounded-full bg-white object-contain p-0.5 shadow-sm sm:h-12 sm:w-12"
      />
      <span className={cn('font-display text-lg font-bold tracking-tight sm:text-xl', tone === 'photo' ? 'text-white' : 'text-foreground')}>
        {t('orgName')}
      </span>
    </div>
  );
};

export default HeaderLogo;
