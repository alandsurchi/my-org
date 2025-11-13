// Temporary hook to provide empty functionality while migrating from Supabase
export const useCreateNews = () => {
  return {
    mutate: () => console.log('Create news temporarily disabled during migration'),
    isPending: false,
  };
};
