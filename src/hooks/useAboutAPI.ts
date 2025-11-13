import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/charityDashboardAPI';

// Hook to fetch about image
export const useAboutImage = () => {
  return useQuery({
    queryKey: ['about'],
    queryFn: async () => {
      console.log('🔍 Fetching about image from Node.js API...');
      const data = await api.getAboutImage();
      console.log('✅ About image fetched successfully:', data);
      return data;
    },
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // Keep data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Use cached data if available
  });
};

// Hook to upload about image
export const useUploadAboutImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (image: File) => {
      console.log('📤 Uploading about image...');
      return await api.uploadAboutImage(image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about'] });
      console.log('✅ About image uploaded and cache invalidated');
    },
    onError: (error) => {
      console.error('❌ Error uploading about image:', error);
    },
  });
};

// Hook to delete about image
export const useDeleteAboutImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      console.log('🗑️ Deleting about image...');
      return await api.deleteAboutImage();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about'] });
      console.log('✅ About image deleted and cache invalidated');
    },
    onError: (error) => {
      console.error('❌ Error deleting about image:', error);
    },
  });
};
