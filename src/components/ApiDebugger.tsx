import React, { useEffect, useState } from 'react';
import { useNews } from '@/hooks/useNewsAPI';
import { useProjects } from '@/hooks/useProjectsAPI';

const ApiDebugger = () => {
  const [mounted, setMounted] = useState(false);
  const { data: newsData, isLoading: newsLoading, error: newsError } = useNews();
  const { data: projectsData, isLoading: projectsLoading, error: projectsError } = useProjects();

  useEffect(() => {
    setMounted(true);
    console.log('🔍 API Debugger mounted');
  }, []);

  useEffect(() => {
    if (mounted) {
      console.log('📊 API Debug Status:', {
        mounted,
        news: {
          loading: newsLoading,
          error: newsError?.message,
          dataLength: newsData?.length || 0,
          hasData: !!newsData && newsData.length > 0
        },
        projects: {
          loading: projectsLoading,
          error: projectsError?.message,
          dataLength: projectsData?.length || 0,
          hasData: !!projectsData && projectsData.length > 0
        }
      });
    }
  }, [mounted, newsData, newsLoading, newsError, projectsData, projectsLoading, projectsError]);

  if (!mounted) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h4>API Debug Info</h4>
      <p>News: {newsLoading ? 'Loading...' : `${newsData?.length || 0} items`}</p>
      {newsError && <p style={{color: 'red'}}>News Error: {newsError.message}</p>}
      <p>Projects: {projectsLoading ? 'Loading...' : `${projectsData?.length || 0} items`}</p>
      {projectsError && <p style={{color: 'red'}}>Projects Error: {projectsError.message}</p>}
    </div>
  );
};

export default ApiDebugger;
