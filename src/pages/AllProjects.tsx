import React, { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProjects, type Project } from '@/hooks/useProjectsAPI';
import ProjectDetailDialog, { toDialogProject, type DialogProject } from '@/components/ProjectDetailDialog';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { config } from '../config/env';

const AllProjects = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<DialogProject | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const { data: projects = [], isLoading, error } = useProjects();

  const getImageSrc = (url?: string) => {
    if (!url) return null;
    if (url.startsWith('/uploads/')) {
      return `${config.cdnUrl}${url}`;
    }
    return url;
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleReadMore = (project: Project) => {
    setSelectedProject(toDialogProject(project));
    setIsDetailDialogOpen(true);
  };

  const closeDetailDialog = () => {
    setIsDetailDialogOpen(false);
    setSelectedProject(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="py-24 flex items-center justify-center">
          <div className="animate-pulse text-lg">Loading projects...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="py-24 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-2">Error loading projects</div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">{error.message}</div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <section className="py-24 bg-gradient-to-br from-gray-50 dark:from-gray-950 via-blue-50/30 dark:via-gray-950 to-purple-50/20 dark:to-gray-950">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                All Projects
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Explore all our projects and initiatives making a difference in communities worldwide.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg rounded-xl"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-64 h-12 border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="news">📰 News Updates</SelectItem>
                <SelectItem value="water">Water</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 text-lg">No projects found matching your criteria.</div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => {
                const imageUrl = getImageSrc(project.image_url || project.imageUrl);

                const getCategoryLabel = (category?: string) => {
                  if (!category) return 'دابینکردن';
                  const labels: Record<string, string> = {
                    provision: 'دابینکردن',
                    distribution: 'دابەشکردن',
                    renovation: 'نۆژەنکردنەوە',
                    building: 'دروستکردن',
                    news: 'News Update'
                  };
                  return labels[category] || category;
                };

                return (
                  <div key={project.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    {imageUrl && (
                      <img 
                        src={imageUrl} 
                        alt={project.title || project.title_en}
                        className="h-48 w-full object-cover"
                      />
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-400 px-3 py-1 rounded-full font-medium">
                          {getCategoryLabel(project.category)}
                        </span>
                        <span className="text-sm bg-green-100 dark:bg-green-950/40 text-green-800 px-3 py-1 rounded-full font-medium">
                          {project.status || 'active'}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">{project.title || project.title_en}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{project.description || project.description_en}</p>
                      <Button 
                        onClick={() => handleReadMore(project)}
                        className="w-full"
                      >
                        Read More
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <Footer />

      <ProjectDetailDialog 
        project={selectedProject}
        isOpen={isDetailDialogOpen}
        onClose={closeDetailDialog}
      />
    </div>
  );
};

export default AllProjects;
