
import React from 'react';
import { Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage, type Language } from '@/contexts/LanguageContext';

interface LanguageSelectorProps {
  getSelectStyling: () => string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ getSelectStyling }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
      <SelectTrigger className={`w-auto min-w-[80px] sm:min-w-[100px] transition-all duration-300 hover:scale-105 touch-manipulation ${getSelectStyling()}`}>
        <Globe className="w-4 h-4 mr-1 sm:mr-2" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="ku">کوردی</SelectItem>
        <SelectItem value="ar">العربية</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
