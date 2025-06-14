
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Bell, Upload, Trash2, Edit, Plus, Settings, LogOut, Shield, Users, UserPlus, Home } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useStaffAuth } from '@/contexts/StaffAuthContext';
import { useNavigate } from 'react-router-dom';
import { useNews } from '@/hooks/useNews';
import { useProjects } from '@/hooks/useProjects';
import { useGallery, useCreateGalleryItem, useDeleteGalleryItem } from '@/hooks/useGallery';
import { useWebsiteImages, useCreateWebsiteImage, useDeleteWebsiteImage } from '@/hooks/useWebsiteImages';
import { useStaffAccounts, useCreateStaffAccount, useDeleteStaffAccount } from '@/hooks/useStaffAccounts';
import { useFileUpload } from '@/hooks/useFileUpload';

interface DashboardProps {
  userType: 'client' | 'staff';
  userName: string;
}

const Dashboard = ({ userType, userName }: DashboardProps) => {
  const { toast } = useToast();
  const { logout } = useStaffAuth();
  const navigate = useNavigate();
  const { uploadFile, uploading } = useFileUpload();

  // Real data from Supabase
  const { data: news = [] } = useNews();
  const { data: projects = [] } = useProjects();
  const { data: galleryItems = [] } = useGallery();
  const { data: websiteImages = [] } = useWebsiteImages();
  const { data: staffAccounts = [] } = useStaffAccounts();

  // Mutations
  const createGalleryItem = useCreateGalleryItem();
  const deleteGalleryItem = useDeleteGalleryItem();
  const createWebsiteImage = useCreateWebsiteImage();
  const deleteWebsiteImage = useDeleteWebsiteImage();
  const createStaffAccount = useCreateStaffAccount();
  const deleteStaffAccount = useDeleteStaffAccount();

  // Form states
  const [newStaffForm, setNewStaffForm] = useState({
    name: '',
    email: '',
    role: '',
    password: ''
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

  const handleGoHome = () => {
    navigate('/');
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      for (const file of Array.from(files)) {
        const imageUrl = await uploadFile(file);
        if (imageUrl) {
          await createWebsiteImage.mutateAsync({
            name: file.name.replace(/\.[^/.]+$/, ""),
            image_url: imageUrl
          });
        }
      }
      toast({
        title: "Images uploaded successfully",
        description: `${files.length} image(s) have been uploaded.`,
      });
      // Reset the file input
      event.target.value = '';
    }
  };

  const handleDeleteImage = async (id: string) => {
    await deleteWebsiteImage.mutateAsync(id);
    toast({
      title: "Image deleted",
      description: "The image has been removed successfully.",
    });
  };

  const handleGalleryUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0 && galleryForm.title && galleryForm.description) {
      for (const file of Array.from(files)) {
        const imageUrl = await uploadFile(file);
        if (imageUrl) {
          await createGalleryItem.mutateAsync({
            title: galleryForm.title,
            description: galleryForm.description,
            image_url: imageUrl
          });
        }
      }
      setGalleryForm({ title: '', description: '' });
      toast({
        title: "Gallery items added",
        description: `${files.length} item(s) have been added to the gallery.`,
      });
      // Reset the file input
      event.target.value = '';
    } else if (!galleryForm.title || !galleryForm.description) {
      toast({
        title: "Please fill all fields",
        description: "Title and description are required.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteGalleryItem = async (id: string) => {
    await deleteGalleryItem.mutateAsync(id);
    toast({
      title: "Gallery item deleted",
      description: "The gallery item has been removed successfully.",
    });
  };

  const handleAddStaffMember = async () => {
    if (newStaffForm.name && newStaffForm.email && newStaffForm.role && newStaffForm.password) {
      try {
        await createStaffAccount.mutateAsync({
          name: newStaffForm.name,
          email: newStaffForm.email,
          role: newStaffForm.role,
          password: newStaffForm.password
        });
        setNewStaffForm({ name: '', email: '', role: '', password: '' });
        toast({
          title: "Staff member added",
          description: "The new staff member has been added successfully.",
        });
      } catch (error) {
        toast({
          title: "Error adding staff member",
          description: "Failed to add the staff member. Email might already exist.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Please fill all fields",
        description: "All fields are required to add a staff member.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteStaffMember = async (id: string) => {
    await deleteStaffAccount.mutateAsync(id);
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
                    <div key={project.id} className="text-sm">• {project.title_en}</div>
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
                      {websiteImages.map((image) => (
                        <div key={image.id} className="relative group">
                          <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                            <img 
                              src={image.image_url || '/placeholder.svg'} 
                              alt={image.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder.svg';
                              }}
                            />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 rounded-b-lg">
                            <span className="text-sm">{image.name}</span>
                          </div>
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="secondary">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => handleDeleteImage(image.id)}
                                disabled={deleteWebsiteImage.isPending}
                              >
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
                        <Input 
                          id="imageUpload" 
                          type="file" 
                          multiple 
                          accept="image/*" 
                          onChange={handleImageUpload}
                          className="cursor-pointer"
                          disabled={uploading || createWebsiteImage.isPending}
                        />
                        {(uploading || createWebsiteImage.isPending) && (
                          <p className="text-sm text-gray-500 mt-2">Uploading...</p>
                        )}
                      </div>
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
                          <Label htmlFor="galleryDescription">Description</Label>
                          <Textarea 
                            id="galleryDescription" 
                            placeholder="Enter image description"
                            value={galleryForm.description}
                            onChange={(e) => setGalleryForm({...galleryForm, description: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="galleryImages">Select Images</Label>
                          <Input 
                            id="galleryImages" 
                            type="file" 
                            multiple 
                            accept="image/*" 
                            onChange={handleGalleryUpload}
                            className="cursor-pointer"
                            disabled={uploading || createGalleryItem.isPending}
                          />
                          {(uploading || createGalleryItem.isPending) && (
                            <p className="text-sm text-gray-500 mt-2">Uploading...</p>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {galleryItems.map((item) => (
                      <div key={item.id} className="relative group">
                        <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                          <img 
                            src={item.image_url || '/placeholder.svg'} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder.svg';
                            }}
                          />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 rounded-b-lg">
                          <p className="text-sm font-medium">{item.title}</p>
                          <p className="text-xs text-gray-300">{item.description}</p>
                        </div>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="secondary">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => handleDeleteGalleryItem(item.id)}
                              disabled={deleteGalleryItem.isPending}
                            >
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
                <CardDescription>View and manage news articles from the database</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Published Articles ({news.length})</h3>
                    {news.length === 0 ? (
                      <p className="text-gray-500">No news articles found in the database.</p>
                    ) : (
                      news.map((article) => (
                        <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{article.title_en}</h4>
                            <p className="text-sm text-gray-500">Category: {article.category} | Date: {article.date}</p>
                            <p className="text-sm text-gray-600 mt-1">{article.description_en}</p>
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
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Management</CardTitle>
                <CardDescription>View and manage project activities from the database</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Current Projects ({projects.length})</h3>
                    {projects.length === 0 ? (
                      <p className="text-gray-500">No projects found in the database.</p>
                    ) : (
                      projects.map((project) => (
                        <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{project.title_en}</h4>
                            <p className="text-sm text-gray-600 mt-1">{project.description_en}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline">{project.category}</Badge>
                              <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                                {project.status}
                              </Badge>
                              {project.location && (
                                <Badge variant="secondary">{project.location}</Badge>
                              )}
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
                      ))
                    )}
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
                          <Button 
                            className="w-full" 
                            onClick={handleAddStaffMember}
                            disabled={createStaffAccount.isPending}
                          >
                            {createStaffAccount.isPending ? 'Creating...' : 'Create Staff Account'}
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
                    {staffAccounts.length === 0 ? (
                      <p className="text-gray-500">No staff accounts found. Add some staff members to get started.</p>
                    ) : (
                      staffAccounts.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-medium">{member.name}</h3>
                            <p className="text-sm text-gray-500">{member.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={member.role === 'admin' ? 'destructive' : member.role === 'editor' ? 'default' : 'secondary'}>
                                {member.role}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {member.status}
                              </Badge>
                              <span className="text-xs text-gray-400">Joined: {new Date(member.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => handleDeleteStaffMember(member.id)}
                              disabled={deleteStaffAccount.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
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
