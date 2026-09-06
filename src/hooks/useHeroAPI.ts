import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, type ImageAsset } from '@/lib/apiClient';

export const useHeroImage = () => {
  return useQuery<ImageAsset | null>({
    queryKey: ['hero'],
    queryFn: async () => {
      const result = await apiClient.getHeroImage();
      // 404 simply means no hero image has been uploaded yet
      if (result.error && /404/.test(result.error)) return null;
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useUploadHeroImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (image: File) => {
      const result = await apiClient.uploadHeroImage(image);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hero'] }),
  });
};
