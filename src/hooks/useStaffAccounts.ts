import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, type Role, type StaffInput, type StaffMember, type StaffUpdate } from '@/lib/apiClient';

export interface StaffAccount {
  id: string;
  email: string;
  name: string;
  role: Role;
  is_active: boolean;
  isSuperAdmin: boolean;
  isProtected: boolean;
  canEdit: boolean;
  createdAt?: string;
  created_at?: string;
  status: 'active';
}

const toAccount = (member: StaffMember): StaffAccount => ({
  id: String(member.id),
  email: member.email,
  name: member.name,
  role: member.role,
  is_active: true,
  isSuperAdmin: !!member.isSuperAdmin,
  isProtected: !!member.isProtected,
  canEdit: !!member.canEdit,
  createdAt: member.createdAt,
  created_at: member.createdAt,
  status: 'active',
});

export const useStaffAccounts = () => {
  return useQuery<StaffAccount[]>({
    queryKey: ['staff-accounts'],
    queryFn: async () => {
      const response = await apiClient.getStaff();
      if (response.error) throw new Error(response.error);
      return (response.data ?? []).map(toAccount);
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
};

export const useCreateStaffAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: StaffInput) => {
      const response = await apiClient.createStaff(input);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff-accounts'] }),
  });
};

export const useUpdateStaffAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string | number; data: StaffUpdate }) => {
      const response = await apiClient.updateStaff(id, data);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff-accounts'] }),
  });
};

export const useDeleteStaffAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string | number) => {
      const response = await apiClient.deleteStaff(id);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff-accounts'] }),
  });
};

export const useCurrentUser = () => {
  return useQuery<StaffMember | null>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await apiClient.getCurrentUser();
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    staleTime: 0,
    gcTime: 0,
  });
};
