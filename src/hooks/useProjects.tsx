
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Project {
  id: string;
  title_en: string;
  title_ar: string | null;
  title_ku: string | null;
  description_en: string;
  description_ar: string | null;
  description_ku: string | null;
  category: string;
  image_url: string | null;
  location: string | null;
  status: string;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProjects(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getProjectsByCategory = (category: string) => {
    return projects.filter(project => project.category === category);
  };

  return { projects, loading, error, getProjectsByCategory };
};
