import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

export interface StaffMember {
  id: string;
  name_en: string;
  position_en: string;
  bio_en?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useStaff = () => {
  return useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      console.log('🔍 Fetching staff data from API...');
      
      const { data, error } = await apiClient.getStaff();
      
      if (error) {
        console.error('🔴 Error fetching staff:', error);
        throw new Error(error);
      }
      
      console.log('✅ Staff data fetched successfully:', data);
      console.log('✅ Number of staff members:', data?.length);
      console.log('✅ First staff member:', data?.[0]);
      return data || [];
    },
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (staffData: {
      name_en: string;
      position_en: string;
      bio_en?: string;
      image_url?: string;
      display_order: number;
      is_active: boolean;
    }) => {
      console.log('📝 Creating staff member...');
      
      const { data, error } = await apiClient.createStaff(staffData);
      
      if (error) {
        console.error('🔴 Error creating staff member:', error);
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
      image_url: string;
      display_order: number;
      is_active: boolean;
    }>) => {
      console.log('📝 Updating staff member:', id);
      
      const { data, error } = await apiClient.updateStaff(id, updateData);
      
      if (error) {
        console.error('🔴 Error updating staff member:', error);
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
        console.error('🔴 Error deleting staff member:', error);
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
