
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StaffMember {
  id: string;
  name_en: string;
  name_ar: string | null;
  name_ku: string | null;
  position_en: string;
  position_ar: string | null;
  position_ku: string | null;
  bio_en: string | null;
  bio_ar: string | null;
  bio_ku: string | null;
  image_url: string | null;
  email: string | null;
  phone: string | null;
  display_order: number;
}

export const useStaff = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const { data, error } = await supabase
          .from('staff')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) throw error;
        setStaff(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch staff');
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  return { staff, loading, error };
};
