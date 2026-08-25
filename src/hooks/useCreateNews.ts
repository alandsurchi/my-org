// Empty hook - functionality provided by useNewsAPI
export const useCreateNews = () => {
  return {
    mutate: () => console.log('Create news temporarily disabled during migration'),
    isPending: false,
  };
};
