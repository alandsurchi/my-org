import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/charityDashboardAPI';
import { config } from '../config/env';

export interface GalleryPhoto {
  id: string;
  _id?: string; // Kept for compatibility
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

// Hook to fetch all gallery photos
export const useGallery = () => {
  return useQuery({
    queryKey: ['gallery'],
    queryFn: async (): Promise<GalleryPhoto[]> => {
      const data = await api.getAllGalleryPhotos();

      const normalized = (data || []).map((item: any, index: number) => {
        const sourceUrl = item.url || item.image_url || item.imageUrl || '';
        const title = item.title || item.caption || 'Gallery photo';
        const description = item.description || item.caption || '';

        return {
          id: item._id || item.id || sourceUrl || `gallery-item-${index}`,
          _id: item._id,
          url: buildImageUrl(sourceUrl),
          title,
          description,
          caption: item.caption || '',
          uploadedAt: item.uploadedAt,
        };
      });

      return normalized;
    },
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // Keep data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

// Hook to upload gallery photo
export const useUploadGalleryPhoto = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ photo, caption }: {
      photo: File;
      caption?: string;
    }) => {
      return await api.uploadGalleryPhoto(photo, caption);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
    onError: (error) => {
    },
  });
};

// Hook to update photo caption
export const useUpdatePhotoCaption = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, caption }: {
      id: string;
      caption: string;
    }) => {
      return await api.updatePhotoCaption(id, caption);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
    onError: (error) => {
    },
  });
};

// Hook to delete photo
export const useDeletePhoto = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      return await api.deletePhoto(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
    onError: (error) => {
    },
  });
};
