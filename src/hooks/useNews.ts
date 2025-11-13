import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

export interface NewsItem {
  id: string;
  title_en: string;
  description_en: string;
  category: string;
  status: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export const useNews = () => {
  return useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      console.log('🔍 Fetching news data from API...');
      
      const { data, error } = await apiClient.getNews();
      
      if (error) {
        console.error('❌ Error fetching news:', error);
        throw new Error(error);
      }
      
      console.log('✅ News data fetched successfully:', data);
      return data || [];
    },
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useCreateNews = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newsData: {
      title_en: string;
      description_en: string;
      category: string;
      status: string;
      image_url?: string;
    }) => {
      console.log('📝 Creating news...');
      
      const { data, error } = await apiClient.createNews(newsData);
      
      if (error) {
        console.error('🔴 Error creating news:', error);
        throw new Error(error);
      }
      
      console.log('✅ News created successfully:', data);
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
    mutationFn: async ({ id, ...updateData }: { id: string } & Partial<{
      title_en: string;
      description_en: string;
      category: string;
      status: string;
      image_url: string;
    }>) => {
      console.log('📝 Updating news:', id);
      
      const { data, error } = await apiClient.updateNews(id, updateData);
      
      if (error) {
        console.error('🔴 Error updating news:', error);
        throw new Error(error);
      }
      
      console.log('✅ News updated successfully:', data);
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
      console.log('🗑️ Deleting news:', id);
      
      const { data, error } = await apiClient.deleteNews(id);
      
      if (error) {
        console.error('🔴 Error deleting news:', error);
        throw new Error(error);
      }
      
      console.log('✅ News deleted successfully');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
};
