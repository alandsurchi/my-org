import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

export interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useGallery = () => {
  return useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      console.log('🔍 Fetching gallery data from MongoDB API...');
      
      const { data, error } = await apiClient.getGallery();
      
      if (error) {
        console.error('❌ Error fetching gallery:', error);
        throw new Error(error);
      }
      
      console.log('✅ Gallery data fetched successfully:', data);
      return data || [];
    },
  });
};

export const useCreateGalleryItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ title, description, image_url }: { title: string; description: string; image_url: string }) => {
      console.log('📝 Creating gallery item...');
      
      const { data, error } = await apiClient.createGalleryItem({ title, description, image_url });
      
      if (error) {
        console.error('❌ Error creating gallery item:', error);
        throw new Error(error);
      }
      
      console.log('✅ Gallery item created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
  });
};

export const useDeleteGalleryItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('🗑️ Deleting gallery item:', id);
      
      const { data, error } = await apiClient.deleteGalleryItem(id);
      
      if (error) {
        console.error('❌ Error deleting gallery item:', error);
        throw new Error(error);
      }
      
      console.log('✅ Gallery item deleted successfully');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
  });
};
