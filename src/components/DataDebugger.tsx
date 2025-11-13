import React from 'react';
import { useNews } from '@/hooks/useNewsAPI';
import { useProjects } from '@/hooks/useProjectsAPI';
import { useGallery } from '@/hooks/useGalleryAPI';
import { useHeroImage } from '@/hooks/useHeroAPI';

const DataDebugger = () => {
  const { data: news, isLoading: newsLoading, error: newsError } = useNews();
  const { data: projects, isLoading: projectsLoading, error: projectsError } = useProjects();
  const { data: gallery, isLoading: galleryLoading, error: galleryError } = useGallery();
  const { data: hero, isLoading: heroLoading, error: heroError } = useHeroImage();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      right: 0,
      background: 'rgba(0,0,0,0.9)',
      color: 'white',
      padding: '15px',
      fontSize: '12px',
      maxWidth: '400px',
      maxHeight: '300px',
      overflow: 'auto',
      zIndex: 9999,
      borderTopLeftRadius: '8px',
      fontFamily: 'monospace'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#4ade80' }}>🔍 Data Debugger</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Hero Image:</strong>
        {heroLoading ? ' ⏳ Loading...' : heroError ? ' ❌ Error' : hero ? ' ✅ Loaded' : ' ⚠️ No data'}
        {hero && <div style={{ fontSize: '10px', color: '#94a3b8' }}>URL: {hero.url}</div>}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>News:</strong>
        {newsLoading ? ' ⏳ Loading...' : newsError ? ' ❌ Error' : ` ✅ ${news?.length || 0} items`}
        {newsError && <div style={{ fontSize: '10px', color: '#ef4444' }}>{String(newsError)}</div>}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>Projects:</strong>
        {projectsLoading ? ' ⏳ Loading...' : projectsError ? ' ❌ Error' : ` ✅ ${projects?.length || 0} items`}
        {projectsError && <div style={{ fontSize: '10px', color: '#ef4444' }}>{String(projectsError)}</div>}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>Gallery:</strong>
        {galleryLoading ? ' ⏳ Loading...' : galleryError ? ' ❌ Error' : ` ✅ ${gallery?.length || 0} items`}
        {galleryError && <div style={{ fontSize: '10px', color: '#ef4444' }}>{String(galleryError)}</div>}
      </div>

      <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #374151', fontSize: '10px', color: '#94a3b8' }}>
        Backend: http://localhost:5000
      </div>
    </div>
  );
};

export default DataDebugger;
