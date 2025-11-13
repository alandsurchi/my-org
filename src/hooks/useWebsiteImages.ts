import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

export interface WebsiteImage {
  id: string;
  category: string;
  image_url: string;
  alt_text?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useWebsiteImages = () => {
  return useQuery({
    queryKey: ['website-images'],
    queryFn: async () => {
      console.log('🔍 Fetching website images data from API...');
      
      const { data, error } = await apiClient.getWebsiteImages();
      
      if (error) {
        console.error('🔴 Error fetching website images:', error);
        throw new Error(error);
      }
      
      console.log('✅ Website images fetched successfully:', data);
      return data || [];
    },
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useCreateWebsiteImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (imageData: {
      category: string;
      image_url: string;
      alt_text?: string;
      is_active: boolean;
    }) => {
      console.log('📝 Creating website image...');
      
      const { data, error } = await apiClient.createWebsiteImage(imageData);
      
      if (error) {
        console.error('🔴 Error creating website image:', error);
        throw new Error(error);
      }
      
      console.log('✅ Website image created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-images'] });
    },
  });
};

export const useDeleteWebsiteImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('🗑️ Deleting website image:', id);
      
      const { data, error } = await apiClient.deleteWebsiteImage(id);
      
      if (error) {
        console.error('🔴 Error deleting website image:', error);
        throw new Error(error);
      }
      
      console.log('✅ Website image deleted successfully');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-images'] });
    },
  });
};
