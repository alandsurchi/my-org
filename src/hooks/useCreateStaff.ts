// Temporary hook to provide empty functionality while migrating from Supabase
export const useCreateStaff = () => {
  return {
    mutate: () => console.log('Create staff temporarily disabled during migration'),
    isPending: false,
  };
};
