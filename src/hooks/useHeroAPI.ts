import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/charityDashboardAPI';

// Hook to fetch hero image
export const useHeroImage = () => {
  return useQuery({
    queryKey: ['hero'],
    queryFn: async () => {
      console.log('🔍 Fetching hero image from Node.js API...');
      const data = await api.getHeroImage();
      console.log('✅ Hero image fetched successfully:', data);
      return data;
    },
    retry: 3,
    retryDelay: 1000,
    staleTime: 1000, // Reduced to 1 second for testing
    refetchOnWindowFocus: true, // Enable refetch on focus
    refetchInterval: 5000, // Refetch every 5 seconds for testing
  });
};

// Hook to upload hero image
export const useUploadHeroImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (image: File) => {
      console.log('📤 Uploading hero image...');
      return await api.uploadHeroImage(image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero'] });
      console.log('✅ Hero image uploaded and cache invalidated');
    },
    onError: (error) => {
      console.error('❌ Error uploading hero image:', error);
    },
  });
};
