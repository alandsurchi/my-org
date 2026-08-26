import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/charityDashboardAPI';

// Hook to fetch hero image
export const useHeroImage = () => {
  return useQuery({
    queryKey: ['hero'],
    queryFn: async () => {
      const result = await api.getHeroImage();
      return result.data;
    },
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // Keep data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Use cached data if available
  });
};

// Hook to upload hero image
export const useUploadHeroImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (image: File) => {
      return await api.uploadHeroImage(image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero'] });
    },
    onError: (error) => {
    },
  });
};
