import React from 'react';
import { Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import type { HeaderTone } from './types';

interface LanguageSelectorProps {
  tone: HeaderTone;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ tone }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
      <SelectTrigger
        aria-label="Language"
        className={cn(
          'h-10 w-auto min-w-0 gap-1 rounded-pill px-3 text-sm font-medium transition-colors sm:min-w-[6.5rem]',
          // Narrowest phones: a globe button. The language name stays readable to screen readers.
          'max-[374px]:w-10 max-[374px]:justify-center max-[374px]:px-0 max-[374px]:[&>span]:sr-only max-[374px]:[&>svg:last-child]:hidden',
          tone === 'photo'
            ? 'border-white/40 bg-white/10 text-white hover:bg-white/20 [&>svg]:text-white'
            : 'border-border bg-card text-foreground',
        )}
      >
        <Globe className="hidden h-4 w-4 shrink-0 max-[374px]:block sm:block" aria-hidden="true" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="ku">کوردی</SelectItem>
        <SelectItem value="ar">العربية</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
