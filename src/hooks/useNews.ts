import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  image_url?: string;
  status: string;
  author_id?: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export const useNews = () => {
  return useQuery<NewsItem[]>({
    queryKey: ['news'],
    queryFn: async () => {
      console.log('🔍 Fetching news data from MongoDB API...');
      
      const { data, error } = await apiClient.getNews();
      
      if (error) {
        console.error('❌ Error fetching news:', error);
        throw new Error(error);
      }
      
      console.log('✅ News data fetched successfully:', data);
      return (data as any)?.news || (data as NewsItem[]) || [];
    },
    staleTime: 0, // Always fetch fresh data
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};

export const useCreateNews = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newsData: {
      title: string;
      content: string;
      excerpt?: string;
      category: string;
      image_url?: string;
      status?: string;
    }) => {
      console.log('📝 Creating news article...');
      
      const { data, error } = await apiClient.createNews(newsData);
      
      if (error) {
        console.error('❌ Error creating news:', error);
        throw new Error(error);
      }
      
      console.log('✅ News article created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
};

export const useUpdateNews = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...newsData }: { id: string } & any) => {
      console.log('📝 Updating news article...');
      
      const { data, error } = await apiClient.updateNews(id, newsData);
      
      if (error) {
        console.error('❌ Error updating news:', error);
        throw new Error(error);
      }
      
      console.log('✅ News article updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
};

export const useDeleteNews = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('🗑️ Deleting news article...');
      
      const { data, error } = await apiClient.deleteNews(id);
      
      if (error) {
        console.error('❌ Error deleting news:', error);
        throw new Error(error);
      }
      
      console.log('✅ News article deleted successfully');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
};
