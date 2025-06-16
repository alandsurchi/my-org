import React, { useState } from 'react';
import { Search, Calendar, ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProjects } from '@/hooks/useProjects';
import ProjectDetailDialog from './ProjectDetailDialog';
import { Link } from 'react-router-dom';

const ProjectsSection = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const { data: projects = [], isLoading } = useProjects();

  console.log('🚀 Projects data from backend:', projects);

  const filteredActivities = projects.filter(project => {
    const matchesSearch = project.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description_en.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getBadgeColor = (category: string) => {
    const colors = {
      'water': 'bg-gradient-to-r from-blue-500 to-blue-600',
      'education': 'bg-gradient-to-r from-green-500 to-emerald-600',
      'emergency': 'bg-gradient-to-r from-purple-500 to-purple-600',
      'healthcare': 'bg-gradient-to-r from-indigo-500 to-indigo-600'
    };
    return colors[category as keyof typeof colors] || 'bg-gradient-to-r from-blue-500 to-blue-600';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      'water': '💧',
      'education': '📚',
      'emergency': '🚨',
      'healthcare': '🏥'
    };
    return icons[category as keyof typeof icons] || '🌟';
  };

  const handleReadMore = (project: any) => {
    setSelectedProject(project);
    setIsDetailDialogOpen(true);
  };

  const closeDetailDialog = () => {
    setIsDetailDialogOpen(false);
    setSelectedProject(null);
  };

  if (isLoading) {
    return (
      <section id="projects" className="py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="animate-pulse">Loading projects...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-green-200/20 to-blue-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20 fade-in-on-scroll">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 mb-8 animate-scale-in shadow-2xl">
            <span className="text-3xl">🚀</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t('projectsTitle')}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.05)' }}>
            {t('projectsDescription')}
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mx-auto rounded-full mt-6"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-16 fade-in-on-scroll">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder={t('searchProjects')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 border-0 bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full lg:w-64 h-14 border-0 bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl focus:ring-2 focus:ring-blue-500/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
              <SelectItem value="all" className="rounded-xl">{t('allCategories')}</SelectItem>
              <SelectItem value="water" className="rounded-xl">{t('water')}</SelectItem>
              <SelectItem value="education" className="rounded-xl">{t('education')}</SelectItem>
              <SelectItem value="emergency" className="rounded-xl">{t('emergency')}</SelectItem>
              <SelectItem value="healthcare" className="rounded-xl">{t('healthcare')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No projects available matching your criteria.</div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {filteredActivities.map((activity, index) => (
              <Card key={activity.id} className="group bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden rounded-3xl hover-lift fade-in-on-scroll" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="relative overflow-hidden">
                  <img 
                    src={activity.image_url || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop'} 
                    alt={activity.title_en}
                    className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="text-2xl">{getCategoryIcon(activity.category)}</span>
                    <span className="text-sm text-white/90 font-medium bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      {t(activity.category)}
                    </span>
                  </div>
                  
                  <div className="absolute top-4 right-4">
                    <span className={`${getBadgeColor(activity.category)} text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg`}>
                      {activity.status}
                    </span>
                  </div>

                  {activity.location && (
                    <div className="absolute bottom-4 left-4 flex items-center text-white/90 text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      {activity.location}
                    </div>
                  )}
                </div>
                
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.05)' }}>
                    {activity.title_en}
                  </CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed text-base" style={{ textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.05)' }}>
                    {activity.description_en.length > 150 
                      ? `${activity.description_en.substring(0, 150)}...` 
                      : activity.description_en
                    }
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">{new Date(activity.created_at).toLocaleDateString()}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0 h-auto font-medium group/btn"
                      onClick={() => handleReadMore(activity)}
                    >
                      {t('readMore')} 
                      <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center fade-in-on-scroll">
          <Link to="/projects">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-medium px-8 py-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105">
              {t('viewAllProjects')}
            </Button>
          </Link>
        </div>
      </div>

      <ProjectDetailDialog 
        project={selectedProject}
        isOpen={isDetailDialogOpen}
        onClose={closeDetailDialog}
      />
    </section>
  );
};

export default ProjectsSection;
