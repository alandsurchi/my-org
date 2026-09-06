import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { config } from '../config/env';

export interface GalleryPhoto {
  id: string;
  url: string;
  title: string;
  description: string;
  caption?: string;
  uploadedAt?: string;
}

const buildImageUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${config.cdnUrl}${url}`;
};

export const useGallery = () => {
  return useQuery<GalleryPhoto[]>({
    queryKey: ['gallery'],
    queryFn: async () => {
      const data = await apiClient.getAllGalleryPhotos();
      return data.map((item, index) => ({
        id: String(item.id ?? item.url ?? `gallery-item-${index}`),
        url: buildImageUrl(item.url),
        title: item.title || item.caption || 'Gallery photo',
        description: item.description || item.caption || '',
        caption: item.caption || '',
        uploadedAt: item.uploadedAt,
      }));
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

export const useUploadGalleryPhoto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ photo, caption }: { photo: File; caption?: string }) => apiClient.uploadGalleryPhoto(photo, caption || ''),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gallery'] }),
  });
};

export const useUpdatePhotoCaption = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, caption }: { id: string | number; caption: string }) => apiClient.updatePhotoCaption(id, caption),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gallery'] }),
  });
};

export const useDeletePhoto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => apiClient.deletePhoto(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gallery'] }),
  });
};
