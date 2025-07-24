import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

export interface StaffAccount {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export const useStaffAccounts = () => {
  return useQuery({
    queryKey: ['staff-accounts'],
    queryFn: async () => {
      console.log('🔍 Fetching staff accounts from MongoDB API...');
      
      const { data, error } = await apiClient.getStaffAccounts();
      
      if (error) {
        console.error('❌ Error fetching staff accounts:', error);
        throw new Error(error);
      }
      
      console.log('✅ Staff accounts fetched successfully:', data);
      return data || [];
    },
  });
};

export const useCreateStaffAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ name, email, role, password }: { name: string; email: string; role: string; password: string }) => {
      console.log('📝 Creating staff account...');
      
      const { data, error } = await apiClient.createStaffAccount({ name, email, role, password });
      
      if (error) {
        console.error('❌ Error creating staff account:', error);
        throw new Error(error);
      }
      
      console.log('✅ Staff account created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-accounts'] });
    },
  });
};

export const useDeleteStaffAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('🗑️ Deleting staff account:', id);
      
      const { data, error } = await apiClient.deleteStaffAccount(id);
      
      if (error) {
        console.error('❌ Error deleting staff account:', error);
        throw new Error(error);
      }
      
      console.log('✅ Staff account deleted successfully');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-accounts'] });
    },
  });
};
