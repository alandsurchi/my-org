
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      console.log('🔍 Fetching projects data from API...');
      
      const { data, error } = await apiClient.getProjects();
      
      if (error) {
        console.error('❌ Error fetching projects:', error);
        throw new Error(error);
      }
      
      console.log('✅ Projects data fetched successfully:', data);
      return data || [];
    },
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (projectData: {
      title_en: string;
      description_en: string;
      category: string;
      status: string;
      location?: string;
      image_url?: string;
      image?: File;
    }) => {
      console.log('📝 Creating project...');
      
      const { data, error } = await apiClient.createProject(projectData);
      
      if (error) {
        console.error('🔴 Error creating project:', error);
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
      title_en: string;
      description_en: string;
      category: string;
      status: string;
      location: string;
      image_url: string;
    }>) => {
      console.log('📝 Updating project:', id);
      
      const { data, error } = await apiClient.updateProject(id, updateData);
      
      if (error) {
        console.error('🔴 Error updating project:', error);
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
        console.error('🔴 Error deleting project:', error);
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
