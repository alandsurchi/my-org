// Empty hook - functionality provided by useStaffAPI
export const useCreateStaff = () => {
  return {
    mutate: () => console.log('Create staff temporarily disabled during migration'),
    isPending: false,
  };
};
