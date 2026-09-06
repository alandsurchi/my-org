import { usePageMeta } from '@/hooks/usePageMeta';

import React from 'react';
import Dashboard from '@/components/Dashboard';
import ProtectedStaffRoute from '@/components/ProtectedStaffRoute';
import { useStaffAuth } from '@/contexts/StaffAuthContext';

const DashboardPage = () => {
  usePageMeta({ title: 'Staff dashboard', noindex: true });
  const { staffUser } = useStaffAuth();

  return (
    <ProtectedStaffRoute>
      <Dashboard 
        userType="staff" 
        userName={staffUser?.name || 'Staff Member'} 
      />
    </ProtectedStaffRoute>
  );
};

export default DashboardPage;
