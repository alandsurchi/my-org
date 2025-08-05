import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/charityDashboardAPI';

// Hook to authenticate user
export const useAuth = () => {
  return useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const user = await api.verifyToken();
      return user;
    },
    retry: false,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to login
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ email, password }: {
      email: string;
      password: string;
    }) => {
      console.log('🔐 Logging in...');
      return await api.login(email, password);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      console.log('✅ Login successful');
    },
    onError: (error) => {
      console.error('❌ Login failed:', error);
    },
  });
};

// Hook to register
export const useRegister = () => {
  return useMutation({
    mutationFn: async ({ email, password, role }: {
      email: string;
      password: string;
      role?: string;
    }) => {
      console.log('📝 Registering user...');
      return await api.register(email, password, role);
    },
    onError: (error) => {
      console.error('❌ Registration failed:', error);
    },
  });
};

// Hook to logout
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      api.logout();
      return true;
    },
    onSuccess: () => {
      queryClient.setQueryData(['auth'], null);
      queryClient.clear();
      console.log('✅ Logout successful');
    },
  });
};

// Hook to fetch all users (admin only)
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('🔍 Fetching users from Node.js API...');
      const data = await api.getAllUsers();
      console.log('✅ Users data fetched successfully:', data);
      return data;
    },
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: api.getCurrentUser()?.role === 'admin', // Only fetch if user is admin
  });
};

// Helper functions
export const getCurrentUser = () => api.getCurrentUser();
export const isAuthenticated = () => api.isAuthenticated();
