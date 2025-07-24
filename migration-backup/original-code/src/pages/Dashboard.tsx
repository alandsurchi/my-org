
import React from 'react';
import Dashboard from '@/components/Dashboard';
import ProtectedStaffRoute from '@/components/ProtectedStaffRoute';
import { useStaffAuth } from '@/contexts/StaffAuthContext';

const DashboardPage = () => {
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
