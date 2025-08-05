import React, { useState } from 'react';
import { Plus, Edit, Trash2, Upload, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNews, useCreateNews, useDeleteNews } from '@/hooks/useNewsAPI';
import { useProjects, useCreateProject, useDeleteProject } from '@/hooks/useProjectsAPI';
import { useGallery, useUploadGalleryPhoto, useDeletePhoto } from '@/hooks/useGalleryAPI';
import { useHeroImage, useUploadHeroImage } from '@/hooks/useHeroAPI';
import { useToast } from '@/hooks/use-toast';

const StaffDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('news');
  
  // News state
  const { data: news = [], isLoading: newsLoading } = useNews();
  const createNews = useCreateNews();
  const deleteNews = useDeleteNews();
  const [newsForm, setNewsForm] = useState({ title: '', content: '', image: null });
  
  // Projects state
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();
  const [projectForm, setProjectForm] = useState({ title: '', description: '', status: 'active', image: null });
  
  // Gallery state
  const { data: gallery = [], isLoading: galleryLoading } = useGallery();
  const uploadPhoto = useUploadGalleryPhoto();
  const deletePhoto = useDeletePhoto();
  const [galleryForm, setGalleryForm] = useState({ caption: '', photo: null });
  
  // Hero image state
  const { data: heroImage } = useHeroImage();
  const uploadHeroImage = useUploadHeroImage();
  const [heroFile, setHeroFile] = useState(null);

  const handleCreateNews = async (e) => {
    e.preventDefault();
    try {
      await createNews.mutateAsync({
        title: newsForm.title,
        content: newsForm.content,
        image: newsForm.image
      });
      setNewsForm({ title: '', content: '', image: null });
      toast({ title: 'Success', description: 'News article created successfully!' });
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await createProject.mutateAsync({
        title: projectForm.title,
        description: projectForm.description,
        status: projectForm.status,
        image: projectForm.image
      });
      setProjectForm({ title: '', description: '', status: 'active', image: null });
      toast({ title: 'Success', description: 'Project created successfully!' });
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleUploadPhoto = async (e) => {
    e.preventDefault();
    try {
      await uploadPhoto.mutateAsync({
        photo: galleryForm.photo,
        caption: galleryForm.caption
      });
      setGalleryForm({ caption: '', photo: null });
      toast({ title: 'Success', description: 'Photo uploaded successfully!' });
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleUploadHero = async () => {
    if (!heroFile) return;
    try {
      await uploadHeroImage.mutateAsync(heroFile);
      setHeroFile(null);
      toast({ title: 'Success', description: 'Hero image updated successfully!' });
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('/uploads/')) {
      return `http://localhost:5000${imageUrl}`;
    }
    return imageUrl;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Staff Dashboard</h1>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 mb-6">
          {['news', 'projects', 'gallery', 'hero'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* News Tab */}
        {activeTab === 'news' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create News Article
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateNews} className="space-y-4">
                  <Input
                    placeholder="Article title"
                    value={newsForm.title}
                    onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                    required
                  />
                  <Textarea
                    placeholder="Article content"
                    value={newsForm.content}
                    onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                    rows={4}
                    required
                  />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewsForm({ ...newsForm, image: e.target.files[0] })}
                  />
                  <Button type="submit" disabled={createNews.isPending}>
                    {createNews.isPending ? 'Creating...' : 'Create Article'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>News Articles ({news.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {newsLoading ? (
                  <div>Loading...</div>
                ) : (
                  <div className="grid gap-4">
                    {news.map((article) => (
                      <div key={article._id} className="flex items-start gap-4 p-4 border rounded-lg">
                        {article.imageUrl && (
                          <img
                            src={getImageUrl(article.imageUrl)}
                            alt={article.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold">{article.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {article.content.substring(0, 100)}...
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(article.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteNews.mutate(article._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create Project
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateProject} className="space-y-4">
                  <Input
                    placeholder="Project title"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    required
                  />
                  <Textarea
                    placeholder="Project description"
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    rows={4}
                    required
                  />
                  <select
                    value={projectForm.status}
                    onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="planned">Planned</option>
                    <option value="on-hold">On Hold</option>
                  </select>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProjectForm({ ...projectForm, image: e.target.files[0] })}
                  />
                  <Button type="submit" disabled={createProject.isPending}>
                    {createProject.isPending ? 'Creating...' : 'Create Project'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Projects ({projects.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {projectsLoading ? (
                  <div>Loading...</div>
                ) : (
                  <div className="grid gap-4">
                    {projects.map((project) => (
                      <div key={project._id} className="flex items-start gap-4 p-4 border rounded-lg">
                        {project.imageUrl && (
                          <img
                            src={getImageUrl(project.imageUrl)}
                            alt={project.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold">{project.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {project.description.substring(0, 100)}...
                          </p>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                            project.status === 'active' ? 'bg-green-100 text-green-800' :
                            project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            project.status === 'planned' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteProject.mutate(project._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Photo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUploadPhoto} className="space-y-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setGalleryForm({ ...galleryForm, photo: e.target.files[0] })}
                    required
                  />
                  <Input
                    placeholder="Photo caption (optional)"
                    value={galleryForm.caption}
                    onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })}
                  />
                  <Button type="submit" disabled={uploadPhoto.isPending}>
                    {uploadPhoto.isPending ? 'Uploading...' : 'Upload Photo'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gallery ({gallery.length} photos)</CardTitle>
              </CardHeader>
              <CardContent>
                {galleryLoading ? (
                  <div>Loading...</div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {gallery.map((photo) => (
                      <div key={photo._id} className="relative group">
                        <img
                          src={getImageUrl(photo.url)}
                          alt={photo.caption}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deletePhoto.mutate(photo._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        {photo.caption && (
                          <p className="text-xs text-gray-600 mt-1 truncate">{photo.caption}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Hero Image Tab */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  Hero Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                {heroImage && (
                  <div className="mb-4">
                    <img
                      src={getImageUrl(heroImage.url)}
                      alt="Current hero image"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      Last updated: {new Date(heroImage.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
                
                <div className="space-y-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setHeroFile(e.target.files[0])}
                  />
                  <Button 
                    onClick={handleUploadHero} 
                    disabled={!heroFile || uploadHeroImage.isPending}
                  >
                    {uploadHeroImage.isPending ? 'Uploading...' : 'Update Hero Image'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;
