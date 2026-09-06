import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, type NewsInput, type NewsItem } from '@/lib/apiClient';

export type { NewsItem };

export const useNews = () => {
  return useQuery<NewsItem[]>({
    queryKey: ['news'],
    queryFn: () => apiClient.getAllNews(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

export const useNewsById = (id: string) => {
  return useQuery<NewsItem | null>({
    queryKey: ['news', id],
    queryFn: () => (id ? apiClient.getNewsById(id) : Promise.resolve(null)),
    enabled: !!id,
  });
};

export const useCreateNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NewsInput) => apiClient.createNews(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['news'] }),
  });
};

export const useUpdateNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: NewsInput & { id: string | number }) => apiClient.updateNews(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['news'] }),
  });
};

export const useDeleteNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => apiClient.deleteNews(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['news'] }),
  });
};
