
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface NewsItem {
  id: string;
  title_en: string;
  title_ar: string | null;
  title_ku: string | null;
  description_en: string;
  description_ar: string | null;
  description_ku: string | null;
  category: string;
  image_url: string | null;
  date: string;
}

export const useNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('date', { ascending: false });

        if (error) throw error;
        setNews(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const getNewsByCategory = (category: string) => {
    return news.filter(item => item.category === category);
  };

  return { news, loading, error, getNewsByCategory };
};
