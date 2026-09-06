
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, X, Award, Users, Building, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { config } from '../config/env';
import type { NewsItem } from '@/lib/apiClient';

export interface DialogNewsItem {
  id: string;
  title_en: string;
  description_en: string;
  category: string;
  image_url?: string;
  date: string;
}

/** Converts an API news item (or legacy shape) into what the dialog renders. */
export const toDialogNewsItem = (item: Partial<NewsItem> & { id: number | string; title_en?: string; description_en?: string; description?: string; image_url?: string | null; date?: string }): DialogNewsItem => ({
  id: String(item.id),
  title_en: item.title ?? item.title_en ?? '',
  description_en: item.content ?? item.description_en ?? item.description ?? '',
  category: item.category ?? 'placesVisited',
  image_url: item.imageUrl ?? item.image_url ?? undefined,
  date: item.createdAt ?? item.date ?? new Date().toISOString(),
});

interface NewsDetailDialogProps {
  newsItem: DialogNewsItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const NewsDetailDialog = ({ newsItem, isOpen, onClose }: NewsDetailDialogProps) => {
  const { t } = useLanguage();

  if (!newsItem) return null;

  const getImageSrc = (url?: string) => {
    if (!url) return null;
    if (url.startsWith('/uploads/')) {
      return `${config.cdnUrl}${url}`;
    }
    return url;
  };

  const getBadgeColor = (category: string) => {
    const colors = {
      'placesVisited': 'bg-gradient-to-r from-blue-500 to-blue-600',
      'visitors': 'bg-gradient-to-r from-green-500 to-emerald-600',
      'certificatesReceived': 'bg-gradient-to-r from-purple-500 to-purple-600',
      'certificatesAwarded': 'bg-gradient-to-r from-indigo-500 to-indigo-600'
    };
    return colors[category as keyof typeof colors] || 'bg-gradient-to-r from-blue-500 to-blue-600';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      'placesVisited': '📍',
      'visitors': '👥',
      'certificatesReceived': '🏆',
      'certificatesAwarded': '🎖️'
    };
    return icons[category as keyof typeof icons] || '📰';
  };

  const getIconComponent = (category: string) => {
    const iconMap = {
      'placesVisited': Building,
      'visitors': Users,
      'certificatesReceived': Award,
      'certificatesAwarded': Trophy
    };
    return iconMap[category as keyof typeof iconMap] || Building;
  };

  const IconComponent = getIconComponent(newsItem.category);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {newsItem.title_en}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* News Image */}
          {getImageSrc(newsItem.image_url) && (
            <div className="relative">
              <img 
                src={getImageSrc(newsItem.image_url)!} 
                alt={newsItem.title_en}
                className="w-full h-64 md:h-80 object-cover rounded-lg"
              />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="text-2xl">{getCategoryIcon(newsItem.category)}</span>
                <span className="text-sm text-white font-medium bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  {t(newsItem.category)}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <span className={`${getBadgeColor(newsItem.category)} text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg`}>
                  News
                </span>
              </div>
            </div>
          )}

          {/* News Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">News Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">Published: {new Date(newsItem.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Category</h3>
                <div className="flex items-center gap-2">
                  <IconComponent className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                  <span className="font-medium">{t(newsItem.category)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* News Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Full Story</h3>
            <div className="prose max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {newsItem.description_en}
              </p>
            </div>
          </div>

          {/* Additional section */}
          <div className="bg-gradient-to-br from-purple-50 dark:from-gray-950 to-blue-50 dark:to-gray-950 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">About This News</h3>
            <p className="text-gray-700 dark:text-gray-300">
              This news item showcases our ongoing commitment to transparency and community engagement. 
              Stay updated with our latest developments and achievements as we continue our mission.
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={onClose} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewsDetailDialog;
