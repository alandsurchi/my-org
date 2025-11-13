import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

export interface StaffAccount {
  id: string;
  _id?: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin';
  is_active?: boolean;
  isSuperAdmin?: boolean;
  canEdit?: boolean;
  createdAt?: string;
  created_at?: string;
  updated_at?: string;
}

export const useStaffAccounts = () => {
  return useQuery({
    queryKey: ['staff-accounts'],
    queryFn: async () => {
      console.log('🔍 Fetching staff accounts from API...');
      try {
        const response = await apiClient.getStaff();
        console.log('✅ Staff accounts fetched:', response.data);
        
        // Transform backend format to match frontend expectations
        const staff = response.data.map((member: any) => ({
          id: member._id || member.id,
          _id: member._id,
          email: member.email,
          name: member.name,
          role: member.role,
          is_active: true,
          isSuperAdmin: member.isSuperAdmin,
          canEdit: member.canEdit,
          created_at: member.createdAt || member.created_at,
          createdAt: member.createdAt,
          status: 'active'
        }));
        
        return staff;
      } catch (error) {
        console.error('❌ Error fetching staff accounts:', error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: 1000,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
};

export const useCreateStaffAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (accountData: {
      email: string;
      name: string;
      role: 'super_admin' | 'admin';
      password: string;
    }) => {
      console.log('📝 Creating staff account:', accountData.email);
      const response = await apiClient.createStaff(accountData);
      console.log('✅ Staff account created successfully');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-accounts'] });
    },
  });
};

export const useUpdateStaffAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<StaffAccount> }) => {
      console.log('✏️ Updating staff account:', id);
      const response = await apiClient.updateStaff(id, data);
      console.log('✅ Staff account updated successfully');
      return response.data;
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
      const response = await apiClient.deleteStaff(id);
      console.log('✅ Staff account deleted successfully');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-accounts'] });
    },
  });
};

// Get current user info (for role checking)
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      console.log('👤 Fetching current user info...');
      try {
        const response = await apiClient.getCurrentUser();
        console.log('✅ Current user fetched:', response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Error fetching current user:', error);
        throw error;
      }
    },
    staleTime: 0,
    gcTime: 0,
  });
};
