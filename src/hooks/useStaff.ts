
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useStaff = () => {
  return useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      console.log('Fetching staff data from Supabase...');
      
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) {
        console.error('Error fetching staff:', error);
        throw error;
      }
      
      console.log('Staff data fetched successfully:', data);
      return data;
    },
  });
};
