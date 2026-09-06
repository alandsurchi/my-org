import React, { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNews, type NewsItem } from '@/hooks/useNewsAPI';
import NewsDetailDialog from '@/components/NewsDetailDialog';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { config } from '../config/env';

interface DialogNewsItem {
  id: string;
  title_en: string;
  description_en: string;
  category: string;
  image_url?: string;
  date: string;
}

const AllNews = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNewsItem, setSelectedNewsItem] = useState<DialogNewsItem | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const { data: allNews = [], isLoading, error } = useNews();

  const filteredNews = allNews.filter((item: NewsItem) => {
    if (!item) return false;
    const title = item.title || '';
    const content = item.content || '';
    return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           content.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleReadMore = (newsItem: NewsItem) => {
    const dialogNewsItem: DialogNewsItem = {
      id: String(newsItem.id),
      title_en: newsItem.title,
      description_en: newsItem.content,
      category: 'News',
      image_url: newsItem.imageUrl,
      date: newsItem.createdAt
    };
    setSelectedNewsItem(dialogNewsItem);
    setIsDetailDialogOpen(true);
  };

  const closeDetailDialog = () => {
    setIsDetailDialogOpen(false);
    setSelectedNewsItem(null);
  };

  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return null;
    // If it's a relative path, prepend the API base URL
    if (imageUrl.startsWith('/uploads/')) {
      return `${config.cdnUrl}${imageUrl}`;
    }
    return imageUrl;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="py-24 flex items-center justify-center">
          <div className="animate-pulse text-lg">Loading news...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="py-24 flex items-center justify-center">
          <div className="text-red-500 text-lg">Error loading news: {error.message}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <section className="py-24 bg-gradient-to-br from-purple-50/30 via-blue-50/20 to-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                All News
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with our latest news, achievements, and community impact stories.
            </p>
          </div>

          <div className="mb-8">
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-0 bg-white/80 backdrop-blur-sm shadow-lg rounded-xl"
              />
            </div>
          </div>

          {filteredNews.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">
                {allNews.length === 0 ? 'No news articles available yet.' : 'No news found matching your search.'}
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((newsItem: NewsItem) => {
                const imageUrl = getImageUrl(newsItem.imageUrl);
                
                return (
                  <div key={newsItem.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    {imageUrl && (
                      <img 
                        src={imageUrl} 
                        alt={newsItem.title}
                        className="h-48 w-full object-cover"
                      />
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
                          News
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(newsItem.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{newsItem.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {newsItem.content.length > 100 
                          ? `${newsItem.content.substring(0, 100)}...` 
                          : newsItem.content
                        }
                      </p>
                      <Button 
                        onClick={() => handleReadMore(newsItem)}
                        className="w-full"
                      >
                        Read More
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <Footer />

      <NewsDetailDialog 
        newsItem={selectedNewsItem}
        isOpen={isDetailDialogOpen}
        onClose={closeDetailDialog}
      />
    </div>
  );
};

export default AllNews;
