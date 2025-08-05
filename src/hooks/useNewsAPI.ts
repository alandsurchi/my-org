import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/charityDashboardAPI';

// Hook to fetch all news
export const useNews = () => {
  return useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      console.log('🔍 Fetching news data from Node.js API...');
      const data = await api.getAllNews();
      console.log('✅ News data fetched successfully:', data);
      return data;
    },
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
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
    mutationFn: async ({ title, content, image }: {
      title: string;
      content: string;
      image?: File;
    }) => {
      console.log('📝 Creating news article...');
      return await api.createNews(title, content, image);
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
