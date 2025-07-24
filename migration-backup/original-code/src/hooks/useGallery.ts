
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
      console.log('🔍 Fetching gallery data from Supabase...');
      
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('🔴 Error fetching gallery:', error);
        throw error;
      }
      
      console.log('✅ Gallery data fetched successfully:', data);
      return data as GalleryItem[];
    },
  });
};

export const useCreateGalleryItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ title, description, image_url }: { title: string; description: string; image_url: string }) => {
      console.log('📝 Creating gallery item...');
      
      const { data, error } = await supabase
        .from('gallery')
        .insert([{ title, description, image_url }])
        .select()
        .single();
      
      if (error) {
        console.error('🔴 Error creating gallery item:', error);
        throw error;
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
      
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('🔴 Error deleting gallery item:', error);
        throw error;
      }
      
      console.log('✅ Gallery item deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
  });
};
