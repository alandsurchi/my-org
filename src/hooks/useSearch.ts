
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SearchResult {
  type: string;
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  created_at: string;
  rank: number;
}

export const useSearch = (query: string) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query || query.trim().length < 2) return [];

      const { data, error } = await supabase.rpc('search_content', {
        search_query: query.trim()
      });
      
      if (error) {
        console.error('Search error:', error);
        throw error;
      }
      
      return data as SearchResult[];
    },
    enabled: !!query && query.trim().length >= 2,
  });
};
