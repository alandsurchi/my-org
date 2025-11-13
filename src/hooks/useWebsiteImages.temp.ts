// Temporary hook to provide empty data while migrating from Supabase
import { useQuery } from '@tanstack/react-query';

export const useWebsiteImages = () => {
  return useQuery({
    queryKey: ['website-images'],
    queryFn: async () => {
      console.log('🔍 Website images temporarily disabled during migration...');
      return [];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useCreateWebsiteImage = () => {
  return {
    mutate: () => console.log('Create website image temporarily disabled'),
    isPending: false,
  };
};

export const useDeleteWebsiteImage = () => {
  return {
    mutate: () => console.log('Delete website image temporarily disabled'),
    isPending: false,
  };
};
