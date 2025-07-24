import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

export interface WebsiteImage {
  id: string;
  name: string;
  image_url: string;
  category?: string;
  section?: string;
  created_at: string;
  updated_at: string;
}

export const useWebsiteImages = (category?: string, section?: string) => {
  return useQuery({
    queryKey: ['website-images', category, section],
    queryFn: async () => {
      console.log('🔍 Fetching website images from MongoDB API...');
      
      const { data, error } = await apiClient.getWebsiteImages({ category, section });
      
      if (error) {
        console.error('❌ Error fetching website images:', error);
        throw new Error(error);
      }
      
      console.log('✅ Website images fetched successfully:', data);
      return data || [];
    },
  });
};

export const useCreateWebsiteImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      name,
      image_url,
      category,
      section,
    }: {
      name: string;
      image_url: string;
      category?: string;
      section?: string;
    }) => {
      console.log('📝 Creating website image...');
      
      const { data, error } = await apiClient.createWebsiteImage({ name, image_url, category, section });
      
      if (error) {
        console.error('❌ Error creating website image:', error);
        throw new Error(error);
      }
      
      console.log('✅ Website image created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-images'] });
    },
  });
};

export const useUpdateWebsiteImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updateData }: { id: string } & Partial<{
      name: string;
      image_url: string;
      category: string;
      section: string;
    }>) => {
      console.log('📝 Updating website image:', id);
      
      const { data, error } = await apiClient.updateWebsiteImage(id, updateData);
      
      if (error) {
        console.error('❌ Error updating website image:', error);
        throw new Error(error);
      }
      
      console.log('✅ Website image updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-images'] });
    },
  });
};

export const useDeleteWebsiteImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('🗑️ Deleting website image:', id);
      
      const { data, error } = await apiClient.deleteWebsiteImage(id);
      
      if (error) {
        console.error('❌ Error deleting website image:', error);
        throw new Error(error);
      }
      
      console.log('✅ Website image deleted successfully');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-images'] });
    },
  });
};
