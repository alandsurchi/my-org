import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin';
  createdAt: string;
  isSuperAdmin?: boolean;
  canEdit?: boolean;
}

export interface CreateStaffData {
  name: string;
  email: string;
  password: string;
  role: 'super_admin' | 'admin';
}

export interface UpdateStaffData {
  name?: string;
  email?: string;
  password?: string;
  role?: 'super_admin' | 'admin';
}

// Get all staff members
export const useStaffMembers = () => {
  return useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      const response = await apiClient.getStaff();
      return response.data as StaffMember[];
    },
    staleTime: 0,
    gcTime: 0,
  });
};

// Get current user info
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await apiClient.getCurrentUser();
      return response.data as StaffMember;
    },
    staleTime: 0,
    gcTime: 0,
  });
};

// Create staff member
export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateStaffData) => {
      const response = await apiClient.createStaff(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
};

// Update staff member
export const useUpdateStaff = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateStaffData }) => {
      const response = await apiClient.updateStaff(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
};

// Delete staff member
export const useDeleteStaff = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.deleteStaff(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
};
