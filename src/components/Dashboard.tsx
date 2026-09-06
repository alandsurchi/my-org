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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
            <p className="text-gray-600">Welcome back, {userName}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleGoHome}>
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="home" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
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
