
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProjects } from '@/hooks/useProjects';
import { 
  GraduationCap, 
  Heart, 
  Droplets, 
  ShieldAlert,
  MapPin,
  Calendar,
  ArrowRight
} from 'lucide-react';

const ProjectsSection = () => {
  const { t, language } = useLanguage();
  const { projects, loading, error, getProjectsByCategory } = useProjects();

  const getLocalizedText = (item: any, field: string) => {
    if (language === 'ar' && item[`${field}_ar`]) return item[`${field}_ar`];
    if (language === 'ku' && item[`${field}_ku`]) return item[`${field}_ku`];
    return item[`${field}_en`];
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      education: GraduationCap,
      healthcare: Heart,
      water: Droplets,
      emergency: ShieldAlert
    };
    return icons[category as keyof typeof icons] || GraduationCap;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      planned: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const renderProjectsGrid = (projectsList: any[]) => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projectsList.map((project, index) => {
        const IconComponent = getCategoryIcon(project.category);
        const title = getLocalizedText(project, 'title');
        const description = getLocalizedText(project, 'description');
        
        return (
          <Card key={project.id} className="group bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden rounded-3xl hover-lift fade-in-on-scroll" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="relative overflow-hidden">
              <img 
                src={project.image_url || 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=250&fit=crop'} 
                alt={title}
                className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              <div className="absolute top-4 right-4">
                <Badge className={`${getStatusColor(project.status)} border-0`}>
                  {project.status}
                </Badge>
              </div>

              <div className="absolute top-4 left-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>
              
              {project.location && (
                <div className="absolute bottom-4 left-4 flex items-center text-white/90 text-sm">
                  <MapPin className="w-4 h-4 mr-2" />
                  {project.location}
                </div>
              )}
            </div>
            
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                {title}
              </CardTitle>
              <CardDescription className="text-gray-600 leading-relaxed line-clamp-3">
                {description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-0">
              <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium group/btn justify-between">
                Learn More
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  if (loading) {
    return (
      <section id="projects" className="py-24 bg-gradient-to-br from-green-50/30 via-blue-50/20 to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading projects...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="py-24 bg-gradient-to-br from-green-50/30 via-blue-50/20 to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-600">Error loading projects: {error}</div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-24 bg-gradient-to-br from-green-50/30 via-blue-50/20 to-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20 fade-in-on-scroll">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-green-600 to-blue-600 mb-8 animate-scale-in shadow-2xl">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-green-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {t('projectsTitle')}
            </span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-green-600 via-blue-600 to-indigo-600 mx-auto rounded-full"></div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-12 bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-2 h-auto">
            <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-xl py-3 px-4">
              All Projects
            </TabsTrigger>
            {['education', 'healthcare', 'water', 'emergency'].map((category) => {
              const IconComponent = getCategoryIcon(category);
              return (
                <TabsTrigger 
                  key={category}
                  value={category}
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-xl py-3 px-4 flex items-center gap-2"
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="hidden sm:inline capitalize">{category}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="all" className="mt-8">
            {renderProjectsGrid(projects)}
          </TabsContent>

          {['education', 'healthcare', 'water', 'emergency'].map((category) => (
            <TabsContent key={category} value={category} className="mt-8">
              {renderProjectsGrid(getProjectsByCategory(category))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default ProjectsSection;
