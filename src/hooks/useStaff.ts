import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

export interface StaffMember {
  id: string;
  name: string;
  position: string;
  bio?: string;
  email?: string;
  phone?: string;
  image_url?: string;
  social_links?: Record<string, string>;
  order?: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useStaff = () => {
  return useQuery<StaffMember[]>({
    queryKey: ['staff'],
    queryFn: async () => {
      console.log('🔍 Fetching staff data from MongoDB API...');
      
      const { data, error } = await apiClient.getStaff();
      
      if (error) {
        console.error('❌ Error fetching staff:', error);
        throw new Error(error);
      }
      
      console.log('✅ Staff data fetched successfully:', data);
      console.log('✅ Number of staff members:', (data as StaffMember[])?.length);
      console.log('✅ First staff member:', (data as StaffMember[])?.[0]);
      return (data as StaffMember[]) || [];
    },
    staleTime: 0, // Always fetch fresh data
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};

export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (staffData: {
      name: string;
      position: string;
      bio?: string;
      email?: string;
      phone?: string;
      image_url?: string;
      social_links?: Record<string, string>;
      order?: number;
      status?: string;
    }) => {
      console.log('📝 Creating staff member...');
      
      const { data, error } = await apiClient.createStaff({ ...staffData, status: 'active' });
      
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
      name: string;
      position: string;
      bio: string;
      email: string;
      phone: string;
      image_url: string;
      social_links: Record<string, string>;
      order: number;
      status: string;
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
