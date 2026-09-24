import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError, apiClient, type ImageAsset } from '@/lib/apiClient';

export const useAboutImage = () => {
  return useQuery<ImageAsset | null>({
    queryKey: ['about'],
    queryFn: async () => {
      const result = await apiClient.getAboutImage();
      // "No about image set" is a normal, permanent answer, not a failure.
      if (result.status === 404) return null;
      if (result.error) throw new ApiError(result.error, result.status);
      return result.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useUploadAboutImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (image: File) => {
      const result = await apiClient.uploadAboutImage(image);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['about'] }),
  });
};

export const useDeleteAboutImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const result = await apiClient.deleteAboutImage();
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['about'] }),
  });
};
