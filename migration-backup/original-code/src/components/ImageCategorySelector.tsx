
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface ImageCategorySelectorProps {
  category: string;
  section: string;
  onCategoryChange: (category: string) => void;
  onSectionChange: (section: string) => void;
}

const ImageCategorySelector = ({ 
  category, 
  section, 
  onCategoryChange, 
  onSectionChange 
}: ImageCategorySelectorProps) => {
  const categories = [
    { value: 'hero', label: 'Hero Section' },
    { value: 'about', label: 'About Section' },
    { value: 'gallery', label: 'Gallery' },
    { value: 'news', label: 'News' },
    { value: 'projects', label: 'Projects' },
    { value: 'team', label: 'Team' },
    { value: 'general', label: 'General' }
  ];

  const sections = [
    { value: 'background', label: 'Background Image' },
    { value: 'hero', label: 'Hero Image' },
    { value: 'featured', label: 'Featured Image' },
    { value: 'thumbnail', label: 'Thumbnail' },
    { value: 'banner', label: 'Banner' },
    { value: 'logo', label: 'Logo' },
    { value: 'icon', label: 'Icon' }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="imageCategory">Category</Label>
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="imageSection">Section</Label>
        <Select value={section} onValueChange={onSectionChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select section" />
          </SelectTrigger>
          <SelectContent>
            {sections.map((sec) => (
              <SelectItem key={sec.value} value={sec.value}>
                {sec.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ImageCategorySelector;
