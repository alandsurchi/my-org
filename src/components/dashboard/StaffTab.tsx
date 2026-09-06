import React, { useState } from 'react';
import { config } from '@/config/env';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Bell, Upload, Trash2, Edit, Plus, Settings, LogOut, Shield, Users, UserPlus, Home, Eye, Heart } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useStaffAuth } from '@/contexts/StaffAuthContext';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useNews, useCreateNews, useDeleteNews } from '@/hooks/useNewsAPI';
// Use the API-backed hooks that handle FormData uploads
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from '@/hooks/useProjectsAPI';
import { useGallery, useUploadGalleryPhoto, useDeletePhoto } from '@/hooks/useGalleryAPI';
import { useStaffAccounts, useCreateStaffAccount, useDeleteStaffAccount, useCurrentUser, useUpdateStaffAccount, type StaffAccount } from '@/hooks/useStaffAccounts';
import type { NewsItem, Role, StaffUpdate } from '@/lib/apiClient';
import { useHeroImage, useUploadHeroImage } from '@/hooks/useHeroAPI';
import { useAboutImage, useUploadAboutImage } from '@/hooks/useAboutAPI';
import { useFileUpload } from '@/hooks/useFileUpload';
import ImageCropDialog from '../ImageCropDialog';
import ImageCropper from '../ImageCropper';
import PostEditDialog, { type EditablePost } from '../admin/PostEditDialog';
import { DayOfWeekSelect, DatePickerField } from '../admin/DateFields';
import AnalyticsCard from '../admin/AnalyticsCard';
import BackupCard from '../admin/BackupCard';
import ChangePasswordCard from '../admin/ChangePasswordCard';

const resolveImage = (url?: string | null) => (url ? (url.startsWith('http') ? url : `${config.cdnUrl}${url}`) : null);

interface LegacyNewsInput {
  title?: string;
  title_en?: string;
  content?: string;
  description?: string;
  description_en?: string;
  category?: string;
}



const StaffTab = () => {
  const { toast } = useToast();
  const { logout, staffUser } = useStaffAuth();
  const { data: staffAccounts = [] } = useStaffAccounts();
  // Use staffUser from auth context for super admin check
  const isSuperAdmin = staffUser?.isSuperAdmin || false;
  const createStaffAccount = useCreateStaffAccount();
  const deleteStaffAccount = useDeleteStaffAccount();
  const updateStaffMutation = useUpdateStaffAccount();
  // Form states
  const [newStaffForm, setNewStaffForm] = useState({
    name: '',
    email: '',
    role: '',
    password: ''
  });
  const [editStaffForm, setEditStaffForm] = useState({
    id: '',
    name: '',
    email: '',
    role: '',
    password: ''
  });
  const [editStaffDialogOpen, setEditStaffDialogOpen] = useState(false);
  const handleAddStaffMember = async () => {
    if (newStaffForm.name && newStaffForm.email && newStaffForm.role && newStaffForm.password) {
      try {
        await createStaffAccount.mutateAsync({
          name: newStaffForm.name,
          email: newStaffForm.email,
          role: newStaffForm.role as 'super_admin' | 'admin',
          password: newStaffForm.password
        });
        setNewStaffForm({ name: '', email: '', role: '', password: '' });
        toast({
          title: "✅ Staff member added",
          description: `${newStaffForm.name} has been added successfully as ${newStaffForm.role === 'super_admin' ? 'Full Control' : 'Admin'}.`,
        });
      } catch (error) {
        toast({
          title: "❌ Error adding staff member",
          description: "Failed to add the staff member. Email might already exist or you don't have permission.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "⚠️ Please fill all fields",
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
  const handleEditStaffMember = (member: StaffAccount) => {
    setEditStaffForm({
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.role,
      password: '' // Don't pre-fill password
    });
    setEditStaffDialogOpen(true);
  };
  const handleUpdateStaffMember = async () => {
    if (editStaffForm.id && editStaffForm.name && editStaffForm.email && editStaffForm.role) {
      try {
        const updateData: StaffUpdate = {
          name: editStaffForm.name,
          email: editStaffForm.email,
          role: editStaffForm.role as Role
        };
        
        // Only include password if it was changed
        if (editStaffForm.password && editStaffForm.password.length >= 8) {
          updateData.password = editStaffForm.password;
        }

        await updateStaffMutation.mutateAsync({
          id: editStaffForm.id,
          data: updateData
        });
        
        setEditStaffDialogOpen(false);
        setEditStaffForm({ id: '', name: '', email: '', role: '', password: '' });
        
        toast({
          title: "✅ Staff member updated",
          description: `${editStaffForm.name} has been updated successfully.`,
        });
      } catch (error) {
        toast({
          title: "❌ Error updating staff member",
          description: "Failed to update the staff member. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "⚠️ Please fill required fields",
        description: "Name, email, and role are required.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <TabsContent value="staff" className="space-y-6">
        <ChangePasswordCard />
        {isSuperAdmin && <BackupCard />}
        {isSuperAdmin ? (
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
                            <SelectItem value="super_admin">Full Control - Can do everything including managing admins</SelectItem>
                            <SelectItem value="admin">Admin - Can do everything except managing other admins</SelectItem>
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
                        <h3 className="font-medium">
                          {member.name}
                          {member.isSuperAdmin && (
                            <Badge variant="destructive" className="ml-2 text-xs">SUPER ADMIN</Badge>
                          )}
                        </h3>
                        <p className="text-sm text-gray-500">{member.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={member.role === 'super_admin' ? 'destructive' : 'default'}>
                            {member.role === 'super_admin' ? 'Full Control' : 'Admin'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {member.status || 'active'}
                          </Badge>
                          <span className="text-xs text-gray-400">Joined: {new Date(member.created_at || member.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isSuperAdmin && !member.isProtected && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditStaffMember(member)}
                            >
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
                          </>
                        )}
                        {member.isProtected && (
                          <Badge variant="outline" className="text-xs text-gray-400">
                            {member.email === staffUser?.email ? 'You' : 'Protected'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-yellow-500" />
                Access Restricted
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Staff management is only available to users with Full Control permissions.
                Please contact a super administrator if you need to manage staff accounts.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Edit Staff Dialog */}
        <Dialog open={editStaffDialogOpen} onOpenChange={setEditStaffDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Staff Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editStaffName">Full Name</Label>
                  <Input 
                    id="editStaffName" 
                    placeholder="Enter full name"
                    value={editStaffForm.name}
                    onChange={(e) => setEditStaffForm({...editStaffForm, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="editStaffEmail">Email</Label>
                  <Input 
                    id="editStaffEmail" 
                    type="email" 
                    placeholder="Enter email address"
                    value={editStaffForm.email}
                    onChange={(e) => setEditStaffForm({...editStaffForm, email: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="editStaffRole">Role</Label>
                <Select value={editStaffForm.role} onValueChange={(value) => setEditStaffForm({...editStaffForm, role: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Full Control - Can do everything including managing admins</SelectItem>
                    <SelectItem value="admin">Admin - Can do everything except managing other admins</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editPassword">New Password (optional)</Label>
                <Input 
                  id="editPassword" 
                  type="password" 
                  placeholder="Leave blank to keep current password"
                  value={editStaffForm.password}
                  onChange={(e) => setEditStaffForm({...editStaffForm, password: e.target.value})}
                />
                <p className="text-xs text-gray-500 mt-1">Only enter a new password if you want to change it</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="flex-1" 
                  onClick={handleUpdateStaffMember}
                  disabled={updateStaffMutation.isPending}
                >
                  {updateStaffMutation.isPending ? 'Updating...' : 'Update Staff Member'}
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => setEditStaffDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </TabsContent>
    </>
  );
};

export default StaffTab;
