
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface EmailSubscription {
  id: string;
  email: string;
  user_id: string | null;
  subscribed_to: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useEmailSubscription = () => {
  return useQuery({
    queryKey: ['email-subscription'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('email_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error);
        throw error;
      }
      
      return data as EmailSubscription;
    },
  });
};

export const useUpdateEmailSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ subscribed_to, is_active }: { subscribed_to: string[]; is_active: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('email_subscriptions')
        .upsert({
          user_id: user.id,
          email: user.email!,
          subscribed_to,
          is_active,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error updating subscription:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-subscription'] });
    },
  });
};

export const useSubscribeNewsletter = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const { data, error } = await supabase
        .from('email_subscriptions')
        .insert({
          email,
          subscribed_to: ['news', 'projects'],
          is_active: true
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error subscribing to newsletter:', error);
        throw error;
      }
      
      return data;
    },
  });
};
