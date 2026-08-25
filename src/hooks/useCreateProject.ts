// Empty hook - functionality provided by useProjectsAPI
export const useCreateProject = () => {
  return {
    mutate: () => console.log('Create project temporarily disabled during migration'),
    isPending: false,
  };
};
