import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/charityDashboardAPI';

const NEWS_API_KEY = 'news-api';

// Hook to fetch all news
export const useNews = () => {
  return useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      try {
        const data = await api.getAllNews();
        if (data && data.length > 0) {
        }
        return data || [];
      } catch (error: any) {
        throw error;
      }
    },
    retry: (failureCount, error) => {
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // Keep data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true, // ensure fresh data after navigation
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
      return await api.createNews(title, content, category, image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
    onError: (error) => {
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
      return await api.updateNews(id, title, content, image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
    onError: (error) => {
    },
  });
};

// Hook to delete news
export const useDeleteNews = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      return await api.deleteNews(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
    onError: (error) => {
    },
  });
};
