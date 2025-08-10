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
import { useNews, useCreateNews, useDeleteNews } from '@/hooks/useNewsAPI';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from '@/hooks/useProjects';
import { useGallery, useCreateGalleryItem, useDeleteGalleryItem } from '@/hooks/useGallery';
import { useWebsiteImages, useCreateWebsiteImage, useDeleteWebsiteImage } from '@/hooks/useWebsiteImages';
import { useStaffAccounts, useCreateStaffAccount, useDeleteStaffAccount } from '@/hooks/useStaffAccounts';
import { useStaff, useCreateStaff, useUpdateStaff, useDeleteStaff } from '@/hooks/useStaff';
import { useHeroImage, useUploadHeroImage } from '@/hooks/useHeroAPI';
import { useFileUpload } from '@/hooks/useFileUpload';
import WebsiteImageManager from './WebsiteImageManager';

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
  const { data: staffMembers = [] } = useStaff();
  const { data: heroImage } = useHeroImage();

  // Mutations
  const createGalleryItem = useCreateGalleryItem();
  const deleteGalleryItem = useDeleteGalleryItem();
  const createWebsiteImage = useCreateWebsiteImage();
  const deleteWebsiteImage = useDeleteWebsiteImage();
  const createStaffAccount = useCreateStaffAccount();
  const deleteStaffAccount = useDeleteStaffAccount();
  const createNews = useCreateNews();
  const deleteNews = useDeleteNews();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const createStaff = useCreateStaff();
  const updateStaff = useUpdateStaff();
  const deleteStaff = useDeleteStaff();
  const uploadHeroImage = useUploadHeroImage();

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

  const [newsForm, setNewsForm] = useState({
    title_en: '',
    description_en: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [projectForm, setProjectForm] = useState({
    title_en: '',
    description_en: '',
    category: '',
    status: 'active',
    location: ''
  });

  const [staffMemberForm, setStaffMemberForm] = useState({
    name_en: '',
    position_en: '',
    bio_en: '',
    email: ''
  });

  // Hero image state
  const [heroFile, setHeroFile] = useState<File | null>(null);

  // Announcement system state
  const [announcementCategory, setAnnouncementCategory] = useState<string>('');
  const [announcementForm, setAnnouncementForm] = useState<any>({});
  const [generatedAnnouncement, setGeneratedAnnouncement] = useState<string>('');

  // Template forms for each category
  const placesVisitedForm = {
    day: '',
    date: '',
    placeName: '',
    hostName: '',
    yourOrgName: '',
    attendees: '',
    purpose: '',
    hostOrganization: '',
    representativeName: '',
    position: ''
  };

  const visitorsForm = {
    day: '',
    date: '',
    visitorName: '',
    yourOrgName: '',
    yourPlace: '',
    topic: '',
    representativeName: '',
    position: ''
  };

  const certificatesAwardedForm = {
    day: '',
    date: '',
    recipientName: '',
    reason: '',
    organizationName: '',
    yourOrgName: '',
    representativeName: '',
    position: ''
  };

  const certificatesReceivedForm = {
    day: '',
    date: '',
    yourOrgName: '',
    awardingOrganization: '',
    certificateName: '',
    mission: '',
    representativeName: '',
    position: ''
  };

  // Edit states
  const [editingNews, setEditingNews] = useState<any>(null);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [editingStaff, setEditingStaff] = useState<any>(null);

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

  const handleHeroImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await uploadHeroImage.mutateAsync(file);
        setHeroFile(null);
        toast({
          title: "Hero image updated",
          description: "The hero section image has been updated successfully.",
        });
        // Reset the file input
        event.target.value = '';
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "Failed to update hero image. Please try again.",
          variant: "destructive"
        });
      }
    }
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

  const handleCreateNews = async (customNews?: any) => {
    const newsData = customNews || newsForm;
    const backendData = {
      title: newsData.title_en || newsData.title,
      content: newsData.description_en || newsData.content || newsData.description,
      category: newsData.category
    };
    
    if (backendData.title && backendData.content && backendData.category) {
      try {
        await createNews.mutateAsync(backendData);
        if (!customNews) {
          setNewsForm({
            title_en: '',
            description_en: '',
            category: '',
            date: new Date().toISOString().split('T')[0]
          });
        }
        toast({
          title: "News article created",
          description: "The news article has been created successfully.",
        });
      } catch (error) {
        toast({
          title: "Error creating news",
          description: "Failed to create the news article.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Please fill all required fields",
        description: "Title, content, and category are required.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteNews = async (id: string) => {
    await deleteNews.mutateAsync(id);
    toast({
      title: "News article deleted",
      description: "The news article has been removed successfully.",
    });
  };

  // Announcement system helper functions
  const getEmptyForm = (category: string) => {
    switch (category) {
      case 'places-visited':
        return placesVisitedForm;
      case 'visitors':
        return visitorsForm;
      case 'certificates-awarded':
        return certificatesAwardedForm;
      case 'certificates-received':
        return certificatesReceivedForm;
      default:
        return {};
    }
  };

  const generateAnnouncement = () => {
    let template = '';
    
    switch (announcementCategory) {
      case 'places-visited':
        template = `Certificate / Letter of Appreciation
📅 ${announcementForm.day} – ${announcementForm.date}
To: ${announcementForm.placeName}

==============================
On behalf of ${announcementForm.yourOrgName}, we express our heartfelt appreciation to ${announcementForm.hostName} for their warm welcome and valuable time during our visit to ${announcementForm.placeName}.
Our team, including ${announcementForm.attendees}, had the honor of learning more about ${announcementForm.purpose}, and we deeply value the shared insights and hospitality extended to us.
This visit marks a step forward in fostering mutual respect, understanding, and cooperation between ${announcementForm.yourOrgName} and ${announcementForm.hostOrganization}.
${announcementForm.yourOrgName}
${announcementForm.representativeName} & ${announcementForm.position}`;
        break;
        
      case 'visitors':
        template = `Certificate / Letter of Appreciation
📅 ${announcementForm.day} – ${announcementForm.date}
To: ${announcementForm.visitorName}

==============================
On behalf of ${announcementForm.yourOrgName}, we warmly thank ${announcementForm.visitorName} for visiting us at ${announcementForm.yourPlace}.
We truly appreciate the effort and time you dedicated to meeting with us and discussing ${announcementForm.topic}. Your visit has strengthened the bond of friendship and collaboration we hope to nurture in the future.
Your presence was an honor and an inspiration to all our members.
${announcementForm.yourOrgName}
${announcementForm.representativeName} & ${announcementForm.position}`;
        break;
        
      case 'certificates-awarded':
        template = `Certificate of Appreciation
📅 ${announcementForm.day} – ${announcementForm.date}

==============================
This certificate is proudly presented to ${announcementForm.recipientName} in recognition of ${announcementForm.reason}.
We commend your commitment, hard work, and the positive impact you have brought to ${announcementForm.organizationName}.
Your dedication sets an inspiring example for others and plays an important role in achieving our shared mission.
${announcementForm.yourOrgName}
${announcementForm.representativeName} & ${announcementForm.position}`;
        break;
        
      case 'certificates-received':
        template = `Certificate / Letter of Gratitude
📅 ${announcementForm.day} – ${announcementForm.date}

==============================
On behalf of ${announcementForm.yourOrgName}, we express our sincere gratitude to ${announcementForm.awardingOrganization} for honoring us with this ${announcementForm.certificateName}.
This recognition motivates us to continue working with passion, dedication, and commitment towards ${announcementForm.mission}.
We deeply appreciate your acknowledgment of our efforts and look forward to strengthening our cooperation in the future.
${announcementForm.yourOrgName}
${announcementForm.representativeName} & ${announcementForm.position}`;
        break;
        
      default:
        template = 'Please select a category first.';
    }
    
    setGeneratedAnnouncement(template);
  };

  const handleCreateProject = async () => {
    if (projectForm.title_en && projectForm.description_en && projectForm.category) {
      try {
        await createProject.mutateAsync(projectForm);
        setProjectForm({
          title_en: '',
          description_en: '',
          category: '',
          status: 'active',
          location: ''
        });
        toast({
          title: "Project created",
          description: "The project has been created successfully.",
        });
      } catch (error) {
        toast({
          title: "Error creating project",
          description: "Failed to create the project.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Please fill all required fields",
        description: "Title, description, and category are required.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteProject = async (id: string) => {
    await deleteProject.mutateAsync(id);
    toast({
      title: "Project deleted",
      description: "The project has been removed successfully.",
    });
  };

  const handleCreateStaffMember = async () => {
    if (staffMemberForm.name_en && staffMemberForm.position_en) {
      try {
        await createStaff.mutateAsync(staffMemberForm);
        setStaffMemberForm({
          name_en: '',
          position_en: '',
          bio_en: '',
          email: ''
        });
        toast({
          title: "Team member added",
          description: "The team member has been added successfully.",
        });
      } catch (error) {
        toast({
          title: "Error adding team member",
          description: "Failed to add the team member.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Please fill required fields",
        description: "Name and position are required.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteStaffTeamMember = async (id: string) => {
    await deleteStaff.mutateAsync(id);
    toast({
      title: "Team member removed",
      description: "The team member has been removed successfully.",
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

        <Tabs defaultValue="home" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="staff">Staff Management</TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Hero Section Management
                </CardTitle>
                <CardDescription>
                  Upload and manage the main hero image for your website homepage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Hero Image Display */}
                {heroImage && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Current Hero Image</h3>
                    <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={heroImage.url?.startsWith('http') ? heroImage.url : `http://localhost:5000${heroImage.url}`}
                        alt="Current hero image"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    {heroImage.originalName && (
                      <div className="text-sm text-gray-600">
                        <p><strong>File:</strong> {heroImage.originalName}</p>
                        {heroImage.fileSize && (
                          <p><strong>Size:</strong> {(heroImage.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                        )}
                        {heroImage.dimensions && (
                          <p><strong>Dimensions:</strong> {heroImage.dimensions.width} × {heroImage.dimensions.height} pixels</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Upload New Hero Image */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    {heroImage ? 'Replace Hero Image' : 'Upload Hero Image'}
                  </h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <div className="space-y-2">
                      <p className="text-lg font-medium">Upload Hero Image</p>
                      <p className="text-gray-500">Choose a high-quality image for your website's hero section</p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleHeroImageUpload}
                        className="max-w-xs mx-auto cursor-pointer"
                        disabled={uploadHeroImage.isPending}
                      />
                      {uploadHeroImage.isPending && (
                        <p className="text-sm text-blue-600">Uploading...</p>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p><strong>Recommended:</strong> High-resolution images (1920×1080 or larger)</p>
                    <p><strong>Formats:</strong> JPG, PNG, WebP</p>
                    <p><strong>Max size:</strong> 10MB</p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                <CardTitle>News & Announcement Management</CardTitle>
                <CardDescription>Create announcements with templates or add regular news articles</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="announcements" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="announcements">Announcement Generator</TabsTrigger>
                    <TabsTrigger value="regular">Regular News</TabsTrigger>
                  </TabsList>

                  {/* Announcement Generator Tab */}
                  <TabsContent value="announcements" className="space-y-6">
                    {/* Category Selection */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Select Announcement Category</CardTitle>
                        <CardDescription>Choose the type of announcement or certificate you want to create</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <Button 
                            variant={announcementCategory === 'places-visited' ? 'default' : 'outline'}
                            onClick={() => {
                              setAnnouncementCategory('places-visited');
                              setAnnouncementForm(placesVisitedForm);
                              setGeneratedAnnouncement('');
                            }}
                            className="h-20 flex flex-col items-center justify-center space-y-2"
                          >
                            <span className="text-lg">🏛️</span>
                            <span className="text-sm font-medium">Places Visited</span>
                          </Button>
                          <Button 
                            variant={announcementCategory === 'visitors' ? 'default' : 'outline'}
                            onClick={() => {
                              setAnnouncementCategory('visitors');
                              setAnnouncementForm(visitorsForm);
                              setGeneratedAnnouncement('');
                            }}
                            className="h-20 flex flex-col items-center justify-center space-y-2"
                          >
                            <span className="text-lg">👥</span>
                            <span className="text-sm font-medium">Visitors</span>
                          </Button>
                          <Button 
                            variant={announcementCategory === 'certificates-awarded' ? 'default' : 'outline'}
                            onClick={() => {
                              setAnnouncementCategory('certificates-awarded');
                              setAnnouncementForm(certificatesAwardedForm);
                              setGeneratedAnnouncement('');
                            }}
                            className="h-20 flex flex-col items-center justify-center space-y-2"
                          >
                            <span className="text-lg">🏆</span>
                            <span className="text-sm font-medium">Certificates Awarded</span>
                          </Button>
                          <Button 
                            variant={announcementCategory === 'certificates-received' ? 'default' : 'outline'}
                            onClick={() => {
                              setAnnouncementCategory('certificates-received');
                              setAnnouncementForm(certificatesReceivedForm);
                              setGeneratedAnnouncement('');
                            }}
                            className="h-20 flex flex-col items-center justify-center space-y-2"
                          >
                            <span className="text-lg">🎖️</span>
                            <span className="text-sm font-medium">Certificates Received</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Form Fields for Selected Category */}
                    {announcementCategory && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Fill Template Fields</CardTitle>
                          <CardDescription>
                            {announcementCategory === 'places-visited' && 'Generate appreciation letter for places you have visited'}
                            {announcementCategory === 'visitors' && 'Generate appreciation letter for visitors to your organization'}
                            {announcementCategory === 'certificates-awarded' && 'Generate certificate for someone you are recognizing'}
                            {announcementCategory === 'certificates-received' && 'Generate gratitude letter for certificates you have received'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(announcementForm).map(([key, value]) => (
                              <div key={key} className={key === 'purpose' || key === 'topic' || key === 'reason' || key === 'mission' ? 'md:col-span-2' : ''}>
                                <Label htmlFor={key} className="capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                </Label>
                                {key === 'purpose' || key === 'topic' || key === 'reason' || key === 'mission' ? (
                                  <Textarea
                                    id={key}
                                    placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                                    value={value as string || ''}
                                    onChange={(e) => setAnnouncementForm({...announcementForm, [key]: e.target.value})}
                                    rows={3}
                                  />
                                ) : (
                                  <Input
                                    id={key}
                                    placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                                    value={value as string || ''}
                                    onChange={(e) => setAnnouncementForm({...announcementForm, [key]: e.target.value})}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="mt-6 flex space-x-2">
                            <Button onClick={generateAnnouncement} className="flex-1">
                              Generate {announcementCategory === 'places-visited' || announcementCategory === 'visitors' || announcementCategory === 'certificates-received' ? 'Letter' : 'Certificate'}
                            </Button>
                            <Button variant="outline" onClick={() => {
                              setAnnouncementForm(getEmptyForm(announcementCategory));
                              setGeneratedAnnouncement('');
                            }}>
                              Clear
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Generated Announcement Preview */}
                    {generatedAnnouncement && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Generated Document</CardTitle>
                          <CardDescription>Preview and copy your generated announcement or certificate</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-gray-50 p-6 rounded-lg border">
                            <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed">
                              {generatedAnnouncement}
                            </pre>
                          </div>
                          <div className="mt-4 flex space-x-2">
                            <Button onClick={() => {
                              navigator.clipboard.writeText(generatedAnnouncement);
                              toast({
                                title: "Copied to clipboard",
                                description: "The announcement has been copied to your clipboard.",
                              });
                            }}>
                              Copy to Clipboard
                            </Button>
                            <Button variant="outline" onClick={() => {
                              const categoryMap = {
                                'places-visited': 'placesVisited',
                                'visitors': 'visitors',
                                'certificates-awarded': 'certificatesAwarded',
                                'certificates-received': 'certificatesReceived'
                              };
                              
                              const webCategory = categoryMap[announcementCategory as keyof typeof categoryMap];
                              const summary = generatedAnnouncement.split('\n').slice(0, 3).join(' ').substring(0, 150) + '...';
                              
                              const newArticle = {
                                title: `${announcementCategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} - ${new Date().toLocaleDateString()}`,
                                content: generatedAnnouncement,
                                category: webCategory
                              };
                              handleCreateNews(newArticle);
                            }}>
                              Save as News Article
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  {/* Regular News Tab */}
                  <TabsContent value="regular" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Create Regular News Article</CardTitle>
                        <CardDescription>Add a standard news article that will appear on the main website</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="newsTitle">Title</Label>
                            <Input 
                              id="newsTitle" 
                              placeholder="Enter article title"
                              value={newsForm.title_en}
                              onChange={(e) => setNewsForm({...newsForm, title_en: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="newsCategory">Category</Label>
                            <Select value={newsForm.category} onValueChange={(value) => setNewsForm({...newsForm, category: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="placesVisited">Places Visited</SelectItem>
                                <SelectItem value="visitors">Visitors</SelectItem>
                                <SelectItem value="certificatesReceived">Certificates Received</SelectItem>
                                <SelectItem value="certificatesAwarded">Certificates Awarded</SelectItem>
                                <SelectItem value="general">General News</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-2">
                            <Label htmlFor="newsDescription">Description</Label>
                            <Textarea 
                              id="newsDescription" 
                              placeholder="Enter article description"
                              value={newsForm.description_en}
                              onChange={(e) => setNewsForm({...newsForm, description_en: e.target.value})}
                              rows={4}
                            />
                          </div>
                          <div>
                            <Label htmlFor="newsDate">Date</Label>
                            <Input 
                              id="newsDate" 
                              type="date"
                              value={newsForm.date}
                              onChange={(e) => setNewsForm({...newsForm, date: e.target.value})}
                            />
                          </div>
                          <div className="flex items-end">
                            <Button 
                              onClick={() => {
                                const articleData = {
                                  title: newsForm.title_en,
                                  content: newsForm.description_en,
                                  category: newsForm.category
                                };
                                handleCreateNews(articleData);
                              }}
                              disabled={createNews.isPending}
                              className="w-full"
                            >
                              {createNews.isPending ? 'Creating...' : 'Create Article'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                {/* Published News Articles */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Published Articles ({news.length})</h3>
                  {news.length === 0 ? (
                    <p className="text-gray-500">No news articles found in the database.</p>
                  ) : (
                    news.map((article) => (
                      <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{article.title}</h4>
                          <p className="text-sm text-gray-500">Category: {article.category} | Date: {new Date(article.createdAt).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-600 mt-1">{article.content.substring(0, 100)}...</p>
                        </div>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                View Full
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>{article.title}</DialogTitle>
                              </DialogHeader>
                              <div className="bg-gray-50 p-6 rounded-lg border">
                                <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed">
                                  {article.content}
                                </pre>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleDeleteNews(article.id)}
                            disabled={deleteNews.isPending}
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
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Management</CardTitle>
                <CardDescription>Create, edit, and manage project activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Create New Project</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="projectTitle">Title</Label>
                          <Input 
                            id="projectTitle" 
                            placeholder="Enter project title"
                            value={projectForm.title_en}
                            onChange={(e) => setProjectForm({...projectForm, title_en: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="projectCategory">Category</Label>
                          <Select value={projectForm.category} onValueChange={(value) => setProjectForm({...projectForm, category: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="education">Education</SelectItem>
                              <SelectItem value="healthcare">Healthcare</SelectItem>
                              <SelectItem value="community">Community</SelectItem>
                              <SelectItem value="environment">Environment</SelectItem>
                              <SelectItem value="infrastructure">Infrastructure</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="projectDescription">Description</Label>
                          <Textarea 
                            id="projectDescription" 
                            placeholder="Enter project description"
                            value={projectForm.description_en}
                            onChange={(e) => setProjectForm({...projectForm, description_en: e.target.value})}
                            rows={4}
                          />
                        </div>
                        <div>
                          <Label htmlFor="projectLocation">Location</Label>
                          <Input 
                            id="projectLocation" 
                            placeholder="Enter location"
                            value={projectForm.location}
                            onChange={(e) => setProjectForm({...projectForm, location: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="projectStatus">Status</Label>
                          <Select value={projectForm.status} onValueChange={(value) => setProjectForm({...projectForm, status: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="planned">Planned</SelectItem>
                              <SelectItem value="paused">Paused</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2">
                          <Button 
                            onClick={handleCreateProject}
                            disabled={createProject.isPending}
                            className="w-full"
                          >
                            {createProject.isPending ? 'Creating...' : 'Create Project'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

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
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleDeleteProject(project.id)}
                              disabled={deleteProject.isPending}
                            >
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

          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Management</CardTitle>
                <CardDescription>Manage website team members (public facing)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Add New Team Member</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="staffName">Full Name</Label>
                          <Input 
                            id="staffName" 
                            placeholder="Enter full name"
                            value={staffMemberForm.name_en}
                            onChange={(e) => setStaffMemberForm({...staffMemberForm, name_en: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="staffPosition">Position</Label>
                          <Input 
                            id="staffPosition" 
                            placeholder="Enter position/title"
                            value={staffMemberForm.position_en}
                            onChange={(e) => setStaffMemberForm({...staffMemberForm, position_en: e.target.value})}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="staffBio">Bio</Label>
                          <Textarea 
                            id="staffBio" 
                            placeholder="Enter bio/description"
                            value={staffMemberForm.bio_en}
                            onChange={(e) => setStaffMemberForm({...staffMemberForm, bio_en: e.target.value})}
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="staffEmail">Email (Optional)</Label>
                          <Input 
                            id="staffEmail" 
                            type="email"
                            placeholder="Enter email"
                            value={staffMemberForm.email}
                            onChange={(e) => setStaffMemberForm({...staffMemberForm, email: e.target.value})}
                          />
                        </div>
                        <div className="flex items-end">
                          <Button 
                            onClick={handleCreateStaffMember}
                            disabled={createStaff.isPending}
                            className="w-full"
                          >
                            {createStaff.isPending ? 'Adding...' : 'Add Team Member'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Team Members ({staffMembers.length})</h3>
                    {staffMembers.length === 0 ? (
                      <p className="text-gray-500">No team members found.</p>
                    ) : (
                      staffMembers.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                              <img 
                                src={member.image_url || '/placeholder.svg'} 
                                alt={member.name_en}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/placeholder.svg';
                                }}
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">{member.name_en}</h4>
                              <p className="text-sm text-gray-500">{member.position_en}</p>
                              {member.email && (
                                <p className="text-xs text-gray-400">{member.email}</p>
                              )}
                              {member.bio_en && (
                                <p className="text-sm text-gray-600 mt-1 max-w-md truncate">{member.bio_en}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleDeleteStaffTeamMember(member.id)}
                              disabled={deleteStaff.isPending}
                            >
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
