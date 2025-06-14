
import React from 'react';
import Dashboard from '@/components/Dashboard';

const DashboardPage = () => {
  // This would normally come from your authentication context
  const user = {
    name: 'John Doe',
    type: 'client' as const, // Change this to 'staff' to see staff dashboard
    email: 'john@example.com'
  };

  return <Dashboard userType={user.type} userName={user.name} />;
};

export default DashboardPage;
