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

  const [staffMembers] = useState([
    { id: 1, name: 'Ahmad Rahman', email: 'ahmad@mrovdostan.org', role: 'Admin', status: 'Active', joinDate: '2023-01-15' },
    { id: 2, name: 'Sarah Mohammed', email: 'sarah@mrovdostan.org', role: 'Editor', status: 'Active', joinDate: '2023-03-20' },
    { id: 3, name: 'Omar Hassan', email: 'omar@mrovdostan.org', role: 'Viewer', status: 'Active', joinDate: '2023-06-10' }
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
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="places">Places Visited</SelectItem>
                              <SelectItem value="visitors">Visitors to Organization</SelectItem>
                              <SelectItem value="certificates-received">Certificates Received</SelectItem>
                              <SelectItem value="certificates-awarded">Certificates Awarded</SelectItem>
                            </SelectContent>
                          </Select>
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
                          <Select>
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
                              <Input id="staffName" placeholder="Enter full name" />
                            </div>
                            <div>
                              <Label htmlFor="staffEmailNew">Email</Label>
                              <Input id="staffEmailNew" type="email" placeholder="Enter email address" />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="staffRole">Role</Label>
                            <Select>
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
                            <Input id="tempPassword" type="password" placeholder="Set temporary password" />
                          </div>
                          <Button className="w-full" onClick={() => toast({ title: "Staff member added successfully" })}>
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
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
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
