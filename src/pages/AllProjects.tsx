
import React, { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProjects } from '@/hooks/useProjectsAPI';
import ProjectDetailDialog from '@/components/ProjectDetailDialog';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AllProjects = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const { data: projects = [], isLoading } = useProjects();

  const getImageSrc = (url?: string) => {
    if (!url) return null;
    if (url.startsWith('/uploads/')) {
      return `http://localhost:5000${url}`;
    }
    return url;
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleReadMore = (project: any) => {
    // Transform project data to match dialog interface
    const transformedProject = {
      id: project._id || project.id,
      title_en: project.title || project.title_en,
      description_en: project.description || project.description_en,
      category: project.category,
      image_url: project.imageUrl || project.image_url,
      location: project.location,
      status: project.status,
      created_at: project.createdAt || project.created_at
    };
    setSelectedProject(transformedProject);
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

  return (
    <div className="min-h-screen">
      <Header />
      <section className="py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
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
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                All Projects
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore all our projects and initiatives making a difference in communities worldwide.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-0 bg-white/80 backdrop-blur-sm shadow-lg rounded-xl"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-64 h-12 border-0 bg-white/80 backdrop-blur-sm shadow-lg rounded-xl">
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
              <div className="text-gray-500 text-lg">No projects found matching your criteria.</div>
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
                  <div key={project._id || project.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    {imageUrl && (
                      <img 
                        src={imageUrl} 
                        alt={project.title || project.title_en}
                        className="h-48 w-full object-cover"
                      />
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                          {getCategoryLabel(project.category)}
                        </span>
                        <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                          {project.isNewsProject ? 'News' : (project.status || 'active')}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{project.title || project.title_en}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{project.description || project.description_en}</p>
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
