import React, { useState } from 'react';
import { Search, Calendar, ArrowRight, Award, Users, Building, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNews } from '@/hooks/useNewsAPI';
import NewsDetailDialog from './NewsDetailDialog';
import { Link } from 'react-router-dom';

const NewsSection = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNewsItem, setSelectedNewsItem] = useState<any>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const { data: allNews = [], isLoading, error } = useNews();

  const getImageSrc = (url?: string) => {
    if (!url) return null;
    if (url.startsWith('/uploads/')) {
      return `http://localhost:5000${url}`;
    }
    return url;
  };

  console.log('📰 NewsSection rendering...');
  console.log('📰 News data from backend:', allNews);
  console.log('📰 News data length:', allNews?.length);
  console.log('📰 News loading state:', isLoading);
  console.log('📰 News error state:', error);
  console.log('📰 Type of allNews:', typeof allNews, Array.isArray(allNews));
  
  // Debug: Log all categories found in news data
  if (allNews && allNews.length > 0) {
    const categories = allNews.map(item => item?.category).filter(Boolean);
    console.log('📰 All categories found in news:', [...new Set(categories)]);
    console.log('📰 First news item structure:', JSON.stringify(allNews[0], null, 2));
    console.log('📰 First news item category:', allNews[0]?.category);
    console.log('📰 First news item title:', allNews[0]?.title);
    console.log('📰 First news item content:', allNews[0]?.content);
  } else {
    console.log('📰 No news data found or empty array');
    console.log('📰 allNews value:', allNews);
  }

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

  // Debug: Log grouped news data
  console.log('📰 Grouped news data:', newsData);
  console.log('📰 placesVisited count:', newsData.placesVisited?.length);
  console.log('📰 visitors count:', newsData.visitors?.length);
  console.log('📰 certificatesReceived count:', newsData.certificatesReceived?.length);
  console.log('📰 certificatesAwarded count:', newsData.certificatesAwarded?.length);
  console.log('📰 Total news items:', allNews?.length || 0);
  
  // Log first item from each category if exists
  if (newsData.placesVisited?.length > 0) {
    console.log('📰 First placesVisited item:', newsData.placesVisited[0]);
  }
  if (newsData.visitors?.length > 0) {
    console.log('📰 First visitors item:', newsData.visitors[0]);
  }
  if (newsData.certificatesReceived?.length > 0) {
    console.log('📰 First certificatesReceived item:', newsData.certificatesReceived[0]);
  }
  if (newsData.certificatesAwarded?.length > 0) {
    console.log('📰 First certificatesAwarded item:', newsData.certificatesAwarded[0]);
  }

  const filterNews = (newsItems: any[]) => {
    if (!newsItems || !Array.isArray(newsItems)) return [];
    
    return newsItems.filter(item => {
      if (!item) return false;
      const title = item.title || '';
      const content = item.content || '';
      return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             content.toLowerCase().includes(searchTerm.toLowerCase());
    });
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

  const handleReadMore = (newsItem: any) => {
    setSelectedNewsItem(newsItem);
    setIsDetailDialogOpen(true);
  };

  const closeDetailDialog = () => {
    setIsDetailDialogOpen(false);
    setSelectedNewsItem(null);
  };

  const renderNewsGrid = (newsItems: any[], category: string) => {
    const filteredNews = filterNews(newsItems);
    
    if (filteredNews.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            {isLoading ? 'Loading news...' : 'No news available in this category yet.'}
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
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedNews.map((item, index) => {
          if (!item) return null;
          
          const imageUrl = getImageSrc(item.imageUrl || item.image_url);
          const IconComponent = getIconComponent(category);
          
          return (
            <Card key={item._id || item.id || index} className="group bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden rounded-3xl hover-lift fade-in-on-scroll" style={{ animationDelay: `${index * 0.1}s` }}>
              {imageUrl && (
                <div className="relative overflow-hidden">
                  <img 
                    src={imageUrl} 
                    alt={item.title || item.title_en || 'News item'}
                    className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  <div className="absolute top-4 right-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 flex items-center text-white/90 text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : (item.date ? new Date(item.date).toLocaleDateString() : 'No date')}
                  </div>
                </div>
              )}
              
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.05)' }}>
                  {item.title || item.title_en || 'Untitled News'}
                </CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed line-clamp-3" style={{ textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.05)' }}>
                  {item.content || item.description_en || item.description || 'No description available'}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <Button 
                  variant="ghost" 
                  className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium group/btn justify-between"
                  onClick={() => handleReadMore(item)}
                >
                  {t('readMore')}
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  // Show error state if there's an error
  if (error) {
    console.error('News section error:', error);
    return (
      <section id="news" className="py-24 bg-gradient-to-br from-purple-50/30 via-blue-50/20 to-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="text-red-500">Error loading news. Please try again later.</div>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section id="news" className="py-24 bg-gradient-to-br from-purple-50/30 via-blue-50/20 to-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="animate-pulse text-lg">Loading news...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="news" className="py-24 bg-gradient-to-br from-purple-50/30 via-blue-50/20 to-gray-50 relative overflow-hidden">
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
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {t('newsTitle')}
            </span>
          </h2>
          <p className="text-lg text-gray-600 mb-4">Latest 3 news updates</p>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 mx-auto rounded-full"></div>
        </div>

        <div className="relative mb-12 fade-in-on-scroll">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder={t('searchNews')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 border-0 bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl max-w-lg mx-auto focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>

        <Tabs defaultValue="placesVisited" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-12 bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-2 h-auto">
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
