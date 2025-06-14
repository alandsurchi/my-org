
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Bell, Upload, Trash2, Edit, Plus, Settings, LogOut, Shield, Users, UserPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useStaffAuth } from '@/contexts/StaffAuthContext';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  userType: 'client' | 'staff';
  userName: string;
}

const Dashboard = ({ userType, userName }: DashboardProps) => {
  const { toast } = useToast();
  const { logout } = useStaffAuth();
  const navigate = useNavigate();
  
  // State for managing content
  const [images, setImages] = useState([
    { id: 1, name: 'Hero Image', url: 'placeholder1.jpg' },
    { id: 2, name: 'About Image', url: 'placeholder2.jpg' },
    { id: 3, name: 'Project Image', url: 'placeholder3.jpg' },
    { id: 4, name: 'Team Image', url: 'placeholder4.jpg' }
  ]);

  const [galleryItems, setGalleryItems] = useState([
    { id: 1, title: 'Community Event', description: 'Local community gathering', url: 'gallery1.jpg' },
    { id: 2, title: 'Water Project', description: 'Clean water initiative', url: 'gallery2.jpg' },
    { id: 3, title: 'Education Program', description: 'School support program', url: 'gallery3.jpg' },
    { id: 4, title: 'Healthcare Drive', description: 'Medical assistance program', url: 'gallery4.jpg' },
    { id: 5, title: 'Emergency Relief', description: 'Disaster response efforts', url: 'gallery5.jpg' },
    { id: 6, title: 'Youth Training', description: 'Skills development workshop', url: 'gallery6.jpg' }
  ]);

  const [newsArticles, setNewsArticles] = useState([
    { id: 1, title: 'Visit to Local School', category: 'places', date: '2024-06-10' },
    { id: 2, title: 'UN Representative Meeting', category: 'visitors', date: '2024-06-08' },
    { id: 3, title: 'Excellence Award Received', category: 'certificatesReceived', date: '2024-06-05' }
  ]);

  const [projects, setProjects] = useState([
    { id: 1, title: 'Clean Water Initiative', category: 'water', status: 'active', badge: 'Sustainable' },
    { id: 2, title: 'Education Support Program', category: 'education', status: 'active', badge: 'Impact' },
    { id: 3, title: 'Emergency Relief Effort', category: 'emergency', status: 'completed', badge: 'Response' }
  ]);

  const [staffMembers, setStaffMembers] = useState([
    { id: 1, name: 'Ahmad Rahman', email: 'ahmad@mrovdostan.org', role: 'Admin', status: 'Active', joinDate: '2023-01-15' },
    { id: 2, name: 'Sarah Mohammed', email: 'sarah@mrovdostan.org', role: 'Editor', status: 'Active', joinDate: '2023-03-20' },
    { id: 3, name: 'Omar Hassan', email: 'omar@mrovdostan.org', role: 'Viewer', status: 'Active', joinDate: '2023-06-10' }
  ]);

  // Form states
  const [newStaffForm, setNewStaffForm] = useState({
    name: '',
    email: '',
    role: '',
    password: ''
  });

  const [newArticleForm, setNewArticleForm] = useState({
    title: '',
    content: '',
    category: ''
  });

  const [newProjectForm, setNewProjectForm] = useState({
    title: '',
    description: '',
    category: '',
    badge: ''
  });

  const [galleryForm, setGalleryForm] = useState({
    title: '',
    description: ''
  });

  // Notifications state
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'project', title: 'New project: Clean Water Initiative launched', date: '2024-06-10', read: false },
    { id: 2, type: 'news', title: 'Visit to Erbil Schools completed', date: '2024-06-08', read: false },
    { id: 3, type: 'gallery', title: 'New photos added to Community Outreach', date: '2024-06-05', read: true }
  ]);

  // Event handlers
  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the staff dashboard.",
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map((file, index) => ({
        id: images.length + index + 1,
        name: file.name,
        url: URL.createObjectURL(file)
      }));
      setImages([...images, ...newImages]);
      toast({
        title: "Images uploaded successfully",
        description: `${files.length} image(s) have been uploaded.`,
      });
    }
  };

  const handleDeleteImage = (id: number) => {
    setImages(images.filter(img => img.id !== id));
    toast({
      title: "Image deleted",
      description: "The image has been removed successfully.",
    });
  };

  const handleGalleryUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && galleryForm.title && galleryForm.description) {
      const newItems = Array.from(files).map((file, index) => ({
        id: galleryItems.length + index + 1,
        title: galleryForm.title,
        description: galleryForm.description,
        url: URL.createObjectURL(file)
      }));
      setGalleryItems([...galleryItems, ...newItems]);
      setGalleryForm({ title: '', description: '' });
      toast({
        title: "Gallery items added",
        description: `${files.length} item(s) have been added to the gallery.`,
      });
    } else {
      toast({
        title: "Please fill all fields",
        description: "Title and description are required.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteGalleryItem = (id: number) => {
    setGalleryItems(galleryItems.filter(item => item.id !== id));
    toast({
      title: "Gallery item deleted",
      description: "The gallery item has been removed successfully.",
    });
  };

  const handleCreateArticle = () => {
    if (newArticleForm.title && newArticleForm.content && newArticleForm.category) {
      const newArticle = {
        id: newsArticles.length + 1,
        title: newArticleForm.title,
        category: newArticleForm.category,
        date: new Date().toISOString().split('T')[0]
      };
      setNewsArticles([...newsArticles, newArticle]);
      setNewArticleForm({ title: '', content: '', category: '' });
      toast({
        title: "Article published",
        description: "The news article has been published successfully.",
      });
    } else {
      toast({
        title: "Please fill all fields",
        description: "All fields are required to publish an article.",
        variant: "destructive"
      });
    }
  };

  const handleCreateProject = () => {
    if (newProjectForm.title && newProjectForm.description && newProjectForm.category && newProjectForm.badge) {
      const newProject = {
        id: projects.length + 1,
        title: newProjectForm.title,
        category: newProjectForm.category,
        status: 'active' as const,
        badge: newProjectForm.badge
      };
      setProjects([...projects, newProject]);
      setNewProjectForm({ title: '', description: '', category: '', badge: '' });
      toast({
        title: "Project created",
        description: "The new project has been created successfully.",
      });
    } else {
      toast({
        title: "Please fill all fields",
        description: "All fields are required to create a project.",
        variant: "destructive"
      });
    }
  };

  const handleAddStaffMember = () => {
    if (newStaffForm.name && newStaffForm.email && newStaffForm.role && newStaffForm.password) {
      const newMember = {
        id: staffMembers.length + 1,
        name: newStaffForm.name,
        email: newStaffForm.email,
        role: newStaffForm.role,
        status: 'Active' as const,
        joinDate: new Date().toISOString().split('T')[0]
      };
      setStaffMembers([...staffMembers, newMember]);
      setNewStaffForm({ name: '', email: '', role: '', password: '' });
      toast({
        title: "Staff member added",
        description: "The new staff member has been added successfully.",
      });
    } else {
      toast({
        title: "Please fill all fields",
        description: "All fields are required to add a staff member.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteStaffMember = (id: number) => {
    setStaffMembers(staffMembers.filter(member => member.id !== id));
    toast({
      title: "Staff member removed",
      description: "The staff member has been removed successfully.",
    });
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  if (userType === 'client') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome, {userName}</h1>
              <p className="text-gray-600">Stay updated with our latest activities</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.slice(0, 3).map((notif) => (
                    <div 
                      key={notif.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        notif.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                      }`}
                      onClick={() => markAsRead(notif.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{notif.title}</p>
                          <p className="text-xs text-gray-500">{notif.date}</p>
                        </div>
                        {!notif.read && (
                          <Badge variant="default" className="ml-2">New</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {projects.slice(0, 3).map((project) => (
                    <div key={project.id} className="text-sm">• {project.title}</div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="w-4 h-4 mr-2" />
                  Notification Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Notifications</CardTitle>
              <CardDescription>Stay updated with our latest news, projects, and gallery updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      notif.read ? 'bg-white' : 'bg-blue-50 border-blue-200'
                    }`}
                    onClick={() => markAsRead(notif.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium">{notif.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{notif.date}</p>
                        <Badge variant="secondary" className="mt-2 capitalize">
                          {notif.type}
                        </Badge>
                      </div>
                      {!notif.read && (
                        <Badge variant="default">New</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Staff Dashboard
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
            <p className="text-gray-600">Welcome back, {userName}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="staff">Staff Management</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Website Images</CardTitle>
                  <CardDescription>Manage all images across the website</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {images.map((image) => (
                        <div key={image.id} className="relative group">
                          <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-sm text-gray-500">{image.name}</span>
                          </div>
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="secondary">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDeleteImage(image.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="imageUpload">Select Images</Label>
                        <Input id="imageUpload" type="file" multiple accept="image/*" onChange={handleImageUpload} />
                      </div>
                      <Button className="w-full">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Images
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Content
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Homepage
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Site Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gallery Management</CardTitle>
                <CardDescription>Add, edit, or remove gallery images</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Gallery Images
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Gallery Images</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="galleryTitle">Title</Label>
                          <Input 
                            id="galleryTitle" 
                            placeholder="Enter image title"
                            value={galleryForm.title}
                            onChange={(e) => setGalleryForm({...galleryForm, title: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="galleryImages">Select Images</Label>
                          <Input id="galleryImages" type="file" multiple accept="image/*" onChange={handleGalleryUpload} />
                        </div>
                        <div>
                          <Label htmlFor="imageDescription">Description</Label>
                          <Textarea 
                            id="imageDescription" 
                            placeholder="Enter image description"
                            value={galleryForm.description}
                            onChange={(e) => setGalleryForm({...galleryForm, description: e.target.value})}
                          />
                        </div>
                        <Button className="w-full" onClick={() => document.getElementById('galleryImages')?.click()}>
                          Add to Gallery
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {galleryItems.map((item) => (
                      <div key={item.id} className="relative group">
                        <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                          <div className="text-center p-2">
                            <p className="text-sm font-medium">{item.title}</p>
                            <p className="text-xs text-gray-500">{item.description}</p>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="secondary">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteGalleryItem(item.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>News Management</CardTitle>
                <CardDescription>Create and manage news articles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Article
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create News Article</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="newsTitle">Title</Label>
                          <Input 
                            id="newsTitle" 
                            placeholder="Enter article title"
                            value={newArticleForm.title}
                            onChange={(e) => setNewArticleForm({...newArticleForm, title: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="newsContent">Content</Label>
                          <Textarea 
                            id="newsContent" 
                            placeholder="Enter article content" 
                            rows={6}
                            value={newArticleForm.content}
                            onChange={(e) => setNewArticleForm({...newArticleForm, content: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="newsCategory">Category</Label>
                          <Select value={newArticleForm.category} onValueChange={(value) => setNewArticleForm({...newArticleForm, category: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="places">Places Visited</SelectItem>
                              <SelectItem value="visitors">Visitors to Organization</SelectItem>
                              <SelectItem value="certificatesReceived">Certificates Received</SelectItem>
                              <SelectItem value="certificatesAwarded">Certificates Awarded</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button className="w-full" onClick={handleCreateArticle}>Publish Article</Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Published Articles</h3>
                    {newsArticles.map((article) => (
                      <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{article.title}</h4>
                          <p className="text-sm text-gray-500">Category: {article.category} | Date: {article.date}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Management</CardTitle>
                <CardDescription>Create and manage project activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create New Project</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="projectTitle">Project Title</Label>
                          <Input 
                            id="projectTitle" 
                            placeholder="Enter project title"
                            value={newProjectForm.title}
                            onChange={(e) => setNewProjectForm({...newProjectForm, title: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="projectDescription">Description</Label>
                          <Textarea 
                            id="projectDescription" 
                            placeholder="Enter project description" 
                            rows={4}
                            value={newProjectForm.description}
                            onChange={(e) => setNewProjectForm({...newProjectForm, description: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="projectCategory">Category</Label>
                          <Select value={newProjectForm.category} onValueChange={(value) => setNewProjectForm({...newProjectForm, category: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="water">Water & Sanitation</SelectItem>
                              <SelectItem value="education">Education</SelectItem>
                              <SelectItem value="emergency">Emergency Relief</SelectItem>
                              <SelectItem value="healthcare">Healthcare</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="projectBadge">Badge</Label>
                          <Input 
                            id="projectBadge" 
                            placeholder="e.g., Survey, Sustainable, Response"
                            value={newProjectForm.badge}
                            onChange={(e) => setNewProjectForm({...newProjectForm, badge: e.target.value})}
                          />
                        </div>
                        <Button className="w-full" onClick={handleCreateProject}>Create Project</Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Current Projects</h3>
                    {projects.map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{project.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{project.category}</Badge>
                            <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                              {project.status}
                            </Badge>
                            <Badge variant="secondary">{project.badge}</Badge>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Staff Management
                  </CardTitle>
                  <CardDescription>Manage staff accounts and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Add New Staff Member
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Add New Staff Member</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="staffName">Full Name</Label>
                              <Input 
                                id="staffName" 
                                placeholder="Enter full name"
                                value={newStaffForm.name}
                                onChange={(e) => setNewStaffForm({...newStaffForm, name: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="staffEmailNew">Email</Label>
                              <Input 
                                id="staffEmailNew" 
                                type="email" 
                                placeholder="Enter email address"
                                value={newStaffForm.email}
                                onChange={(e) => setNewStaffForm({...newStaffForm, email: e.target.value})}
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="staffRole">Role</Label>
                            <Select value={newStaffForm.role} onValueChange={(value) => setNewStaffForm({...newStaffForm, role: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin - Full access</SelectItem>
                                <SelectItem value="editor">Editor - Can edit content</SelectItem>
                                <SelectItem value="viewer">Viewer - View only</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="tempPassword">Temporary Password</Label>
                            <Input 
                              id="tempPassword" 
                              type="password" 
                              placeholder="Set temporary password"
                              value={newStaffForm.password}
                              onChange={(e) => setNewStaffForm({...newStaffForm, password: e.target.value})}
                            />
                          </div>
                          <Button className="w-full" onClick={handleAddStaffMember}>
                            Create Staff Account
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Current Staff Members
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {staffMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium">{member.name}</h3>
                          <p className="text-sm text-gray-500">{member.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={member.role === 'Admin' ? 'destructive' : member.role === 'Editor' ? 'default' : 'secondary'}>
                              {member.role}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {member.status}
                            </Badge>
                            <span className="text-xs text-gray-400">Joined: {member.joinDate}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteStaffMember(member.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
