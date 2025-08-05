import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/charityDashboardAPI';

// Hook to fetch all gallery photos
export const useGallery = () => {
  return useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      console.log('🔍 Fetching gallery data from Node.js API...');
      const data = await api.getAllGalleryPhotos();
      console.log('✅ Gallery data fetched successfully:', data);
      return data;
    },
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
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
      console.log('📤 Uploading gallery photo...');
      return await api.uploadGalleryPhoto(photo, caption);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      console.log('✅ Photo uploaded and cache invalidated');
    },
    onError: (error) => {
      console.error('❌ Error uploading photo:', error);
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
      console.log('📝 Updating photo caption...');
      return await api.updatePhotoCaption(id, caption);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      console.log('✅ Caption updated and cache invalidated');
    },
    onError: (error) => {
      console.error('❌ Error updating caption:', error);
    },
  });
};

// Hook to delete photo
export const useDeletePhoto = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('🗑️ Deleting photo...');
      return await api.deletePhoto(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      console.log('✅ Photo deleted and cache invalidated');
    },
    onError: (error) => {
      console.error('❌ Error deleting photo:', error);
    },
  });
};
