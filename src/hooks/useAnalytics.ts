
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsEvent {
  page_url: string;
  event_type: 'page_view' | 'click' | 'search' | 'download';
  event_data?: Record<string, any>;
}

export const useAnalytics = () => {
  const trackEvent = useMutation({
    mutationFn: async (event: AnalyticsEvent) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const analyticsData = {
        user_id: user?.id || null,
        session_id: sessionStorage.getItem('session_id') || generateSessionId(),
        page_url: event.page_url,
        event_type: event.event_type,
        event_data: event.event_data || null,
        user_agent: navigator.userAgent,
      };

      // Store session ID for this session
      if (!sessionStorage.getItem('session_id')) {
        sessionStorage.setItem('session_id', analyticsData.session_id);
      }

      const { error } = await supabase
        .from('user_analytics')
        .insert([analyticsData]);
      
      if (error) {
        console.error('Analytics tracking error:', error);
        // Don't throw error to avoid breaking user experience
      }
    },
  });

  const generateSessionId = () => {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  return {
    trackEvent: trackEvent.mutate,
    trackPageView: (url: string) => trackEvent.mutate({ 
      page_url: url, 
      event_type: 'page_view' 
    }),
    trackClick: (url: string, data?: Record<string, any>) => trackEvent.mutate({
      page_url: url,
      event_type: 'click',
      event_data: data
    }),
    trackSearch: (url: string, query: string) => trackEvent.mutate({
      page_url: url,
      event_type: 'search',
      event_data: { search_query: query }
    }),
  };
};
