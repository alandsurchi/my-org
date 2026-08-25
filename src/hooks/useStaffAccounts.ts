import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

export interface StaffAccount {
  id: string;
  _id?: string; // Kept for compatibility
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
      try {
        const response = await apiClient.getStaff();
        
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
      const response = await apiClient.createStaff(accountData);
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
      const response = await apiClient.updateStaff(id, data);
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
      const response = await apiClient.deleteStaff(id);
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
      try {
        const response = await apiClient.getCurrentUser();
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    staleTime: 0,
    gcTime: 0,
  });
};
