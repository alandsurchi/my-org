import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, type Project, type ProjectInput } from '@/lib/apiClient';

export type { Project };

export const useProjects = (status?: string) => {
  return useQuery<Project[]>({
    queryKey: ['projects', status ?? 'all'],
    queryFn: () => apiClient.getAllProjects(status),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

export const useProjectById = (id: string) => {
  return useQuery<Project | null>({
    queryKey: ['projects', 'one', id],
    queryFn: () => (id ? apiClient.getProjectById(id) : Promise.resolve(null)),
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ProjectInput) => apiClient.createProject(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: ProjectInput & { id: string | number }) => apiClient.updateProject(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => apiClient.deleteProject(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });
};
