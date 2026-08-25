import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/charityDashboardAPI';

// Hook to fetch about image
export const useAboutImage = () => {
  return useQuery({
    queryKey: ['about'],
    queryFn: async () => {
      const data = await api.getAboutImage();
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
      return await api.uploadAboutImage(image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about'] });
    },
    onError: (error) => {
    },
  });
};

// Hook to delete about image
export const useDeleteAboutImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      return await api.deleteAboutImage();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about'] });
    },
    onError: (error) => {
    },
  });
};
