import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/charityDashboardAPI';

// Hook to fetch all projects (ONLY projects, not news)
export const useProjects = (status?: string) => {
  return useQuery({
    queryKey: ['projects', status],
    queryFn: async () => {
      console.log('🔍 Fetching projects data from Node.js API...');
      
      try {
        const projectsData = await api.getAllProjects(status);
        
        console.log('✅ Projects data fetched:', projectsData);
        return projectsData || [];
      } catch (error) {
        console.error('❌ Error fetching projects:', error);
        throw error;
      }
    },
    retry: (failureCount, error) => {
      console.log(`🔄 Retry attempt ${failureCount} for projects fetch`);
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // Keep data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Use cached data if available
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
    mutationFn: async (projectData: any) => {
      console.log('📝 Creating project...', projectData);
      // Pass through to API which handles FormData and extra fields like category/location
      return await api.createProject(projectData);
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
