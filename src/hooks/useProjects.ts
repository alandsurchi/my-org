import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

export interface Project {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  project_url?: string;
  technologies: string[];
  status: string;
  location?: string;
  category?: string;
  created_at: string;
  updated_at: string;
}

export const useProjects = () => {
  return useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      console.log('🔍 Fetching projects data from MongoDB API...');
      
      const { data, error } = await apiClient.getProjects();
      
      if (error) {
        console.error('❌ Error fetching projects:', error);
        throw new Error(error);
      }
      
      console.log('✅ Projects data fetched successfully:', data);
      return (data as Project[]) || [];
    },
    staleTime: 0, // Always fetch fresh data
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (projectData: {
      title: string;
      description: string;
      image_url?: string;
      project_url?: string;
      technologies?: string[];
      status?: string;
    }) => {
      console.log('📝 Creating project...');
      
      const { data, error } = await apiClient.createProject(projectData);
      
      if (error) {
        console.error('❌ Error creating project:', error);
        throw new Error(error);
      }
      
      console.log('✅ Project created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updateData }: { id: string } & Partial<{
      title: string;
      description: string;
      image_url: string;
      project_url: string;
      technologies: string[];
      status: string;
    }>) => {
      console.log('📝 Updating project:', id);
      
      const { data, error } = await apiClient.updateProject(id, updateData);
      
      if (error) {
        console.error('❌ Error updating project:', error);
        throw new Error(error);
      }
      
      console.log('✅ Project updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('🗑️ Deleting project:', id);
      
      const { data, error } = await apiClient.deleteProject(id);
      
      if (error) {
        console.error('❌ Error deleting project:', error);
        throw new Error(error);
      }
      
      console.log('✅ Project deleted successfully');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};
