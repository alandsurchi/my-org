
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface WebsiteImage {
  id: string;
  name: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export const useWebsiteImages = () => {
  return useQuery({
    queryKey: ['website-images'],
    queryFn: async () => {
      console.log('🔍 Fetching website images from Supabase...');
      
      const { data, error } = await supabase
        .from('website_images')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('🔴 Error fetching website images:', error);
        throw error;
      }
      
      console.log('✅ Website images fetched successfully:', data);
      return data as WebsiteImage[];
    },
  });
};

export const useCreateWebsiteImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ name, image_url }: { name: string; image_url: string }) => {
      console.log('📝 Creating website image...');
      
      const { data, error } = await supabase
        .from('website_images')
        .insert([{ name, image_url }])
        .select()
        .single();
      
      if (error) {
        console.error('🔴 Error creating website image:', error);
        throw error;
      }
      
      console.log('✅ Website image created successfully:', data);
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
      
      const { error } = await supabase
        .from('website_images')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('🔴 Error deleting website image:', error);
        throw error;
      }
      
      console.log('✅ Website image deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-images'] });
    },
  });
};
