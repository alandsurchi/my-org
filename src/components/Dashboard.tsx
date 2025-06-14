
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Bell, Upload, Trash2, Edit, Plus, Settings, LogOut } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface DashboardProps {
  userType: 'client' | 'staff';
  userName: string;
}

const Dashboard = ({ userType, userName }: DashboardProps) => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'project', title: 'New project: Clean Water Initiative launched', date: '2024-06-10', read: false },
    { id: 2, type: 'news', title: 'Visit to Erbil Schools completed', date: '2024-06-08', read: false },
    { id: 3, type: 'gallery', title: 'New photos added to Community Outreach', date: '2024-06-05', read: true }
  ]);

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
            <Button variant="outline">
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
                  <div className="text-sm">• Clean Water Initiative</div>
                  <div className="text-sm">• Education Support Program</div>
                  <div className="text-sm">• Emergency Relief Effort</div>
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
          <Button variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content">Content Management</TabsTrigger>
            <TabsTrigger value="gallery">Gallery Management</TabsTrigger>
            <TabsTrigger value="news">News Management</TabsTrigger>
            <TabsTrigger value="projects">Project Management</TabsTrigger>
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
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="relative group">
                          <div className="aspect-square bg-gray-200 rounded-lg"></div>
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="secondary">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload New Images
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Upload Images</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="imageUpload">Select Images</Label>
                            <Input id="imageUpload" type="file" multiple accept="image/*" />
                          </div>
                          <Button className="w-full">Upload</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
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
                          <Label htmlFor="galleryImages">Select Images</Label>
                          <Input id="galleryImages" type="file" multiple accept="image/*" />
                        </div>
                        <div>
                          <Label htmlFor="imageDescription">Description</Label>
                          <Textarea id="imageDescription" placeholder="Enter image description" />
                        </div>
                        <Button className="w-full">Add to Gallery</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="relative group">
                        <div className="aspect-square bg-gray-200 rounded-lg"></div>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="secondary">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive">
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
                          <Input id="newsTitle" placeholder="Enter article title" />
                        </div>
                        <div>
                          <Label htmlFor="newsContent">Content</Label>
                          <Textarea id="newsContent" placeholder="Enter article content" rows={6} />
                        </div>
                        <div>
                          <Label htmlFor="newsCategory">Category</Label>
                          <select className="w-full p-2 border rounded">
                            <option>Places Visited</option>
                            <option>Visitors to Organization</option>
                            <option>Certificates Received</option>
                            <option>Certificates Awarded</option>
                          </select>
                        </div>
                        <Button className="w-full">Publish Article</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
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
                          <Input id="projectTitle" placeholder="Enter project title" />
                        </div>
                        <div>
                          <Label htmlFor="projectDescription">Description</Label>
                          <Textarea id="projectDescription" placeholder="Enter project description" rows={4} />
                        </div>
                        <div>
                          <Label htmlFor="projectCategory">Category</Label>
                          <select className="w-full p-2 border rounded">
                            <option>Water & Sanitation</option>
                            <option>Education</option>
                            <option>Emergency Relief</option>
                            <option>Healthcare</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="projectBadge">Badge</Label>
                          <Input id="projectBadge" placeholder="e.g., Survey, Sustainable, Response" />
                        </div>
                        <Button className="w-full">Create Project</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
