import React, { useState } from 'react';
import { Home, Newspaper, FolderKanban, Image as ImageIcon } from 'lucide-react';

import { NewsAdminTab } from '@/components/admin/NewsAdminTab';
import { ProjectsAdminTab } from '@/components/admin/ProjectsAdminTab';
import { GalleryAdminTab } from '@/components/admin/GalleryAdminTab';
import { HeroAdminTab } from '@/components/admin/HeroAdminTab';

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');

  const tabs = [
    { key: 'home', label: 'Home / Hero', icon: Home },
    { key: 'news', label: 'News', icon: Newspaper },
    { key: 'projects', label: 'Projects', icon: FolderKanban },
    { key: 'gallery', label: 'Gallery', icon: ImageIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Staff Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage content, images, and projects across your platform.</p>
          </div>
        </div>
        
        {/* Mobile Responsive Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border p-1.5 w-full overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary-foreground' : 'text-gray-500'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Render */}
        <div className="bg-white/50 rounded-xl shadow-sm border p-6 min-h-[500px]">
          {activeTab === 'home' && <HeroAdminTab />}
          {activeTab === 'news' && <NewsAdminTab />}
          {activeTab === 'projects' && <ProjectsAdminTab />}
          {activeTab === 'gallery' && <GalleryAdminTab />}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
