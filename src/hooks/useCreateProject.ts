// Temporary hook to provide empty functionality while migrating from Supabase
export const useCreateProject = () => {
  return {
    mutate: () => console.log('Create project temporarily disabled during migration'),
    isPending: false,
  };
};
