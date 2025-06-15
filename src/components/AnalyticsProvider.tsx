
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalytics } from '@/hooks/useAnalytics';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

const AnalyticsProvider = ({ children }: AnalyticsProviderProps) => {
  const location = useLocation();
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    // Track page view on route change
    trackPageView(location.pathname + location.search);
  }, [location, trackPageView]);

  return <>{children}</>;
};

export default AnalyticsProvider;
