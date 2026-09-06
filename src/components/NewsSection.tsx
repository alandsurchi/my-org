import React, { useState } from 'react';
import { Calendar, ArrowRight, Award, Users, Building, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNews, type NewsItem } from '@/hooks/useNewsAPI';
import NewsDetailDialog, { toDialogNewsItem, type DialogNewsItem } from './NewsDetailDialog';

type NewsCard = NewsItem & { date?: string; image_url?: string; title_en?: string; description_en?: string; description?: string };
import { Link } from 'react-router-dom';
import { config } from '../config/env';

const NewsSection = () => {
  const { t } = useLanguage();
  const [selectedNewsItem, setSelectedNewsItem] = useState<DialogNewsItem | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const { data: allNews = [], isLoading, error } = useNews();

  const getImageSrc = (url?: string) => {
    if (!url) return null;
    if (url.startsWith('/uploads/')) {
      return `${config.cdnUrl}${url}`;
    }
    return url;
  };


  // Group news by category with proper fallback for null categories
  const newsData = {
    placesVisited: (allNews || []).filter(item => 
      !item?.category || item?.category === null || item?.category === 'placesVisited' || 
      item?.category === 'Place Visited' || item?.category === 'سەردانی فەرمی' ||
      item?.title?.toLowerCase().includes('visit') || item?.content?.toLowerCase().includes('visit') ||
      item?.title?.toLowerCase().includes('delegation') || item?.content?.toLowerCase().includes('delegation') ||
      item?.title?.includes('سەردان') || item?.content?.includes('سەردان')
    ),
    visitors: (allNews || []).filter(item => 
      item?.category === 'visitors' || item?.category === 'Visitors' || item?.category === 'میوانداری' ||
      item?.title?.includes('میوان') || item?.content?.includes('میوان')
    ),
    certificatesReceived: (allNews || []).filter(item => 
      item?.category === 'certificatesReceived' || item?.category === 'Certificate Received' || 
      item?.category === 'وەرگرتنی سوپاس و پێزانین' ||
      item?.title?.toLowerCase().includes('certificate') || item?.content?.toLowerCase().includes('certificate') ||
      item?.title?.toLowerCase().includes('appreciation') || item?.content?.toLowerCase().includes('appreciation') ||
      item?.title?.includes('سوپاس') || item?.content?.includes('سوپاس') ||
      item?.title?.includes('پێزانین') || item?.content?.includes('پێزانین')
    ),
    certificatesAwarded: (allNews || []).filter(item => 
      item?.category === 'certificatesAwarded' || item?.category === 'Certificate Awarded' ||
      item?.title?.toLowerCase().includes('volunteer') || item?.content?.toLowerCase().includes('volunteer') ||
      item?.title?.toLowerCase().includes('thank') || item?.content?.toLowerCase().includes('thank') ||
      item?.title?.includes('بەخشین') || item?.content?.includes('بەخشین')
    )
  };


  const filterNews = (newsItems: NewsCard[]) => {
    if (!newsItems || !Array.isArray(newsItems)) return [];
    return newsItems.filter(Boolean);
  };

  const getTabIcon = (tabValue: string) => {
    const icons = {
      'placesVisited': '📍',
      'visitors': '👥',
      'certificatesReceived': '🏆',
      'certificatesAwarded': '🎖️'
    };
    return icons[tabValue as keyof typeof icons] || '📰';
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

  const handleReadMore = (newsItem: NewsCard) => {
    setSelectedNewsItem(toDialogNewsItem(newsItem));
    setIsDetailDialogOpen(true);
  };

  const closeDetailDialog = () => {
    setIsDetailDialogOpen(false);
    setSelectedNewsItem(null);
  };

  const renderNewsGrid = (newsItems: NewsCard[], category: string) => {
    const filteredNews = filterNews(newsItems);
    
    if (filteredNews.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400 text-lg">
            {isLoading ? t('loadingNews') : t('noNewsInCategory')}
          </div>
        </div>
      );
    }

    // Sort by creation date (newest first) and limit to 3 items
    const sortedNews = filteredNews
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || a.date || 0);
        const dateB = new Date(b.createdAt || b.date || 0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 3);

    return (
      <div className="grid md:grid-cols-2 gap-8">
        {sortedNews.map((item, index) => {
          if (!item) return null;
          
          const imageUrl = getImageSrc(item.imageUrl || item.image_url);
          const IconComponent = getIconComponent(category);
          const title = item.title || item.title_en || t('untitledNews');
          const body = item.content || item.description_en || item.description || '';
          const excerpt = body.length > 150 ? `${body.substring(0, 150)}...` : body;
          const date = new Date(item.createdAt || item.date || Date.now()).toLocaleDateString();

          // Same card as the Activities section: image (or a branded placeholder
          // when the post has none), category label, title, excerpt, date + read more.
          return (
            <Card key={item.id ?? index} className="group bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden rounded-3xl hover-lift fade-in-on-scroll" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="relative overflow-hidden">
                {imageUrl ? (
                  <img loading="lazy" decoding="async" src={imageUrl}
                    alt={title}
                    className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="h-56 w-full bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                    <IconComponent className="w-20 h-20 text-white/70" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                <div className="absolute top-4 start-4 flex items-center gap-2">
                  <span className="text-2xl">{getTabIcon(category)}</span>
                  <span className="text-sm text-white/90 font-medium bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    {t(category)}
                  </span>
                </div>

                <div className="absolute top-4 end-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:hover:text-blue-400 dark:text-blue-400 transition-colors duration-300 line-clamp-2" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.05)' }}>
                  {title}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed text-base" style={{ textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.05)' }}>
                  {excerpt}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4 me-2" />
                    <span className="text-sm font-medium">{date}</span>
                  </div>
                  <Button
                    variant="ghost"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-gray-800 dark:bg-blue-950/40 p-0 h-auto font-medium group/btn"
                    onClick={() => handleReadMore(item)}
                  >
                    {t('readMore')}
                    <ArrowRight className="w-4 h-4 ms-1 transition-transform duration-300 group-hover/btn:translate-x-1 rtl:rotate-180" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  // Show error state if there's an error
  if (error) {
    return (
      <section id="news" className="py-24 bg-gradient-to-br from-purple-50/30 dark:from-gray-950 via-blue-50/20 dark:via-gray-950 to-gray-50 dark:to-gray-950 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="text-red-500">{t('errorLoadingNews')}</div>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section id="news" className="py-24 bg-gradient-to-br from-purple-50/30 dark:from-gray-950 via-blue-50/20 dark:via-gray-950 to-gray-50 dark:to-gray-950 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="animate-pulse text-lg">{t('loadingNews')}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="news" className="py-24 bg-gradient-to-br from-purple-50/30 dark:from-gray-950 via-blue-50/20 dark:via-gray-950 to-gray-50 dark:to-gray-950 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-32 right-10 w-80 h-80 bg-gradient-to-r from-purple-200/20 to-blue-200/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-32 left-10 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-green-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-pink-200/20 to-purple-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20 fade-in-on-scroll">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-purple-600 to-blue-600 mb-8 animate-scale-in shadow-2xl">
            <span className="text-3xl">📰</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {t('newsTitle')}
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">{t('latestNews')}</p>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 mx-auto rounded-full"></div>
        </div>

        <Tabs defaultValue="placesVisited" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg rounded-2xl p-2 h-auto">
            {Object.keys(newsData).map((key) => (
              <TabsTrigger 
                key={key}
                value={key} 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl py-3 px-4 flex items-center gap-2 font-medium transition-all duration-300"
              >
                <span className="text-lg">{getTabIcon(key)}</span>
                <span className="hidden sm:inline">{t(key)}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="placesVisited" className="mt-8">
            {renderNewsGrid(newsData.placesVisited, 'placesVisited')}
          </TabsContent>

          <TabsContent value="visitors" className="mt-8">
            {renderNewsGrid(newsData.visitors, 'visitors')}
          </TabsContent>

          <TabsContent value="certificatesReceived" className="mt-8">
            {renderNewsGrid(newsData.certificatesReceived, 'certificatesReceived')}
          </TabsContent>

          <TabsContent value="certificatesAwarded" className="mt-8">
            {renderNewsGrid(newsData.certificatesAwarded, 'certificatesAwarded')}
          </TabsContent>
        </Tabs>

        <div className="text-center mt-16 fade-in-on-scroll">
          <Link to="/news">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white font-medium px-8 py-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105">
              {t('viewAllNews')}
            </Button>
          </Link>
        </div>
      </div>

      <NewsDetailDialog 
        newsItem={selectedNewsItem}
        isOpen={isDetailDialogOpen}
        onClose={closeDetailDialog}
      />
    </section>
  );
};

export default NewsSection;
