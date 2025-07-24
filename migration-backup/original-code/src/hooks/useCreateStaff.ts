
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (staffData: {
      name_en: string;
      position_en: string;
      bio_en?: string;
      email?: string;
      image_url?: string;
      is_active?: boolean;
      display_order?: number;
    }) => {
      console.log('📝 Creating staff member...');
      
      const { data, error } = await supabase
        .from('staff')
        .insert([{ ...staffData, is_active: true }])
        .select()
        .single();
      
      if (error) {
        console.error('🔴 Error creating staff member:', error);
        throw error;
      }
      
      console.log('✅ Staff member created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updateData }: { id: string } & Partial<{
      name_en: string;
      position_en: string;
      bio_en: string;
      email: string;
      image_url: string;
      is_active: boolean;
      display_order: number;
    }>) => {
      console.log('📝 Updating staff member:', id);
      
      const { data, error } = await supabase
        .from('staff')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('🔴 Error updating staff member:', error);
        throw error;
      }
      
      console.log('✅ Staff member updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
};

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('🗑️ Deleting staff member:', id);
      
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('🔴 Error deleting staff member:', error);
        throw error;
      }
      
      console.log('✅ Staff member deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
};
