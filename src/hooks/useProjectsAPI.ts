import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/charityDashboardAPI';

// Hook to fetch all projects
export const useProjects = (status?: string) => {
  return useQuery({
    queryKey: ['projects', status],
    queryFn: async () => {
      console.log('🔍 Fetching projects data from Node.js API...');
      const data = await api.getAllProjects(status);
      console.log('✅ Projects data fetched successfully:', data);
      return data;
    },
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook to fetch single project by ID
export const useProjectById = (id: string) => {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: async () => {
      if (!id) return null;
      return await api.getProjectById(id);
    },
    enabled: !!id,
  });
};

// Hook to create project
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ title, description, status, image }: {
      title: string;
      description: string;
      status: string;
      image?: File;
    }) => {
      console.log('📝 Creating project...');
      return await api.createProject(title, description, status, image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      console.log('✅ Project created and cache invalidated');
    },
    onError: (error) => {
      console.error('❌ Error creating project:', error);
    },
  });
};

// Hook to update project
export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, title, description, status, image }: {
      id: string;
      title: string;
      description: string;
      status: string;
      image?: File;
    }) => {
      console.log('📝 Updating project...');
      return await api.updateProject(id, title, description, status, image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      console.log('✅ Project updated and cache invalidated');
    },
    onError: (error) => {
      console.error('❌ Error updating project:', error);
    },
  });
};

// Hook to delete project
export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('🗑️ Deleting project...');
      return await api.deleteProject(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      console.log('✅ Project deleted and cache invalidated');
    },
    onError: (error) => {
      console.error('❌ Error deleting project:', error);
    },
  });
};
