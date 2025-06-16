
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCreateNews = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newsData: {
      title_en: string;
      description_en: string;
      category: string;
      image_url?: string;
      date: string;
    }) => {
      console.log('📝 Creating news article...');
      
      const { data, error } = await supabase
        .from('news')
        .insert([newsData])
        .select()
        .single();
      
      if (error) {
        console.error('🔴 Error creating news:', error);
        throw error;
      }
      
      console.log('✅ News article created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
};

export const useUpdateNews = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updateData }: { id: string } & Partial<{
      title_en: string;
      description_en: string;
      category: string;
      image_url: string;
      date: string;
    }>) => {
      console.log('📝 Updating news article:', id);
      
      const { data, error } = await supabase
        .from('news')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('🔴 Error updating news:', error);
        throw error;
      }
      
      console.log('✅ News article updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
};

export const useDeleteNews = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('🗑️ Deleting news article:', id);
      
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('🔴 Error deleting news:', error);
        throw error;
      }
      
      console.log('✅ News article deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
};
