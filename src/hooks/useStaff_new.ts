import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

export const useStaff = () => {
  return useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      console.log('🔍 Fetching staff data from MongoDB API...');
      
      const { data, error } = await apiClient.getStaff();
      
      if (error) {
        console.error('❌ Error fetching staff:', error);
        throw new Error(error);
      }
      
      console.log('✅ Staff data fetched successfully:', data);
      console.log('✅ Number of staff members:', data?.length);
      console.log('✅ First staff member:', data?.[0]);
      return data || [];
    },
  });
};

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
      
      const { data, error } = await apiClient.createStaff({ ...staffData, is_active: true });
      
      if (error) {
        console.error('❌ Error creating staff member:', error);
        throw new Error(error);
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
      
      const { data, error } = await apiClient.updateStaff(id, updateData);
      
      if (error) {
        console.error('❌ Error updating staff member:', error);
        throw new Error(error);
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
      
      const { data, error } = await apiClient.deleteStaff(id);
      
      if (error) {
        console.error('❌ Error deleting staff member:', error);
        throw new Error(error);
      }
      
      console.log('✅ Staff member deleted successfully');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
};
