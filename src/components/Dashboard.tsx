import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Home } from 'lucide-react';
import { useStaffAuth } from '@/contexts/StaffAuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import HomeTab from './dashboard/HomeTab';
import ProjectsTab from './dashboard/ProjectsTab';
import NewsTab from './dashboard/NewsTab';
import GalleryTab from './dashboard/GalleryTab';
import StaffTab from './dashboard/StaffTab';

interface DashboardProps {
  userType: 'client' | 'staff';
  userName: string;
}

/** Staff dashboard shell: header + tabs. Each tab lives in ./dashboard/. */
const Dashboard = ({ userName }: DashboardProps) => {
  const { toast } = useToast();
  const { logout, staffUser } = useStaffAuth();
  const navigate = useNavigate();
  // Event handlers
  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the staff dashboard.",
    });
  };
  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Phones: title above the buttons; from sm up, side by side. */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Staff Dashboard</h1>
            <p className="text-gray-600">Welcome back, {userName}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-11 flex-1 sm:h-10 sm:flex-none" onClick={handleGoHome}>
              <Home className="me-2 h-4 w-4" />
              Go to Home
            </Button>
            <Button variant="outline" className="h-11 flex-1 sm:h-10 sm:flex-none" onClick={handleLogout}>
              <LogOut className="me-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="home" className="w-full">
          {/* Phones: two rows (3 + 2) so every tab stays visible and tappable. */}
          <TabsList className="grid h-auto w-full grid-cols-3 gap-1 sm:grid-cols-5 [&>button]:min-h-10">
            <TabsTrigger value="home">پەرەی سەرەکی</TabsTrigger>
            <TabsTrigger value="projects">چاڵاکیەکان</TabsTrigger>
            <TabsTrigger value="news">هەواڵەکان</TabsTrigger>
            <TabsTrigger value="gallery">وێنەکان</TabsTrigger>
            <TabsTrigger value="staff">ستاف</TabsTrigger>
          </TabsList>

          <HomeTab />

          <GalleryTab />

          <NewsTab />

          <ProjectsTab />

          <StaffTab />
        </Tabs>
      </div>

    </div>
  );
};

export default Dashboard;
