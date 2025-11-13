import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/charityDashboardAPI';

// Hook to fetch all news
export const useNews = () => {
  return useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      console.log('🔍 Fetching news data from Node.js API...');
      try {
        const data = await api.getAllNews();
        console.log('✅ News data fetched successfully:', data);
        console.log('✅ News data type:', typeof data, 'Array:', Array.isArray(data));
        console.log('✅ News data length:', data?.length || 0);
        if (data && data.length > 0) {
          console.log('✅ First news item:', JSON.stringify(data[0], null, 2));
        }
        return data || [];
      } catch (error) {
        console.error('❌ Error fetching news:', error);
        console.error('❌ Error details:', error.message);
        throw error;
      }
    },
    retry: (failureCount, error) => {
      console.log(`🔄 Retry attempt ${failureCount} for news fetch`);
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // Keep data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Use cached data if available
  });
};

// Hook to fetch single news by ID
export const useNewsById = (id: string) => {
  return useQuery({
    queryKey: ['news', id],
    queryFn: async () => {
      if (!id) return null;
      return await api.getNewsById(id);
    },
    enabled: !!id,
  });
};

// Hook to create news
export const useCreateNews = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ title, content, category, image }: {
      title: string;
      content: string;
      category?: string;
      image?: File;
    }) => {
      console.log('📝 Creating news article...');
      return await api.createNews(title, content, category, image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      console.log('✅ News created and cache invalidated');
    },
    onError: (error) => {
      console.error('❌ Error creating news:', error);
    },
  });
};

// Hook to update news
export const useUpdateNews = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, title, content, image }: {
      id: string;
      title: string;
      content: string;
      image?: File;
    }) => {
      console.log('📝 Updating news article...');
      return await api.updateNews(id, title, content, image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      console.log('✅ News updated and cache invalidated');
    },
    onError: (error) => {
      console.error('❌ Error updating news:', error);
    },
  });
};

// Hook to delete news
export const useDeleteNews = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('🗑️ Deleting news article...');
      return await api.deleteNews(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      console.log('✅ News deleted and cache invalidated');
    },
    onError: (error) => {
      console.error('❌ Error deleting news:', error);
    },
  });
};
