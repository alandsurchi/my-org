
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStaffAuth } from '@/contexts/StaffAuthContext';

interface ProtectedStaffRouteProps {
  children: React.ReactNode;
}

const ProtectedStaffRoute = ({ children }: ProtectedStaffRouteProps) => {
  const { isAuthenticated } = useStaffAuth();

  if (!isAuthenticated) {
    return <Navigate to="/staff-login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedStaffRoute;
