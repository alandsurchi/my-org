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



const ProjectsTab = () => {
  const { toast } = useToast();
  // Real data from PostgreSQL database
  const { data: news = [] } = useNews();
  const { data: projects = [] } = useProjects();
  const createNews = useCreateNews();
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();
  // Kurdish Project Template - Provision (دابینکردن)
  const [newProjectForm, setNewProjectForm] = useState({
    category: ''
  });
  const [kurdishProvisionFields, setKurdishProvisionFields] = useState({
    dayOfWeek: '',
    date: '',
    whatProvided: '', // e.g., "دەرمانی پێویست"
    recipientPlace: '', // e.g., "نەخۆشخانە و بنکەی تەندروستی"
    givingOrganization: '', // e.g., "رێکخراوی مرۆڤدۆستان"
    detailedRecipients: '', // e.g., "نەخۆشخانەکانی هەولێری فێرکاری و رزگاری و بنکەی تەندروستی شاوێس"
    city: '' // e.g., "شاری هەولێر"
  });
  // Kurdish Project Template - Distribution (دابەشکردن)
  const [kurdishDistributionFields, setKurdishDistributionFields] = useState({
    dayOfWeek: '',
    date: '',
    whatDistributed: '', // e.g., "سەبەتەی خۆراک و هێلکە"
    recipientType: '', // e.g., "خاوەنپێدایوستی تایبەت"
    location: '', // e.g., "دهۆک"
    givingOrganization: '', // e.g., "رێکخراوی مرۆڤدۆستان"
    province: '' // e.g., "پارێزگای دهۆک"
  });
  // Kurdish Project Template - Renovation (نۆژەنکردنەوە)
  const [kurdishRenovationFields, setKurdishRenovationFields] = useState({
    dayOfWeek: '',
    date: '',
    whatRenovated: '', // e.g., "قوتابخانەی قەریتاغی بنەڕەتی تێکەڵاو"
    location: '', // e.g., "هەولێر"
    givingOrganization: '', // e.g., "رێکخراوی مرۆڤدۆستان"
    city: '' // e.g., "شاری هەولێر"
  });
  // Kurdish Project Template - Building (دروستکردن)
  const [kurdishBuildingFields, setKurdishBuildingFields] = useState({
    whatBuilt: '', // e.g., "(4) ژووری پێویست"
    dayOfWeek: '',
    date: '',
    builtFor: '', // e.g., "بنکەی تەندروستی زانکۆ"
    location: '', // e.g., "هەولێر"
    givingOrganization: '', // e.g., "رێکخراوی مرۆڤدۆستان"
    supervision: '', // e.g., "بەڕێوەبەرایەتی گشتی تەندروستی هەولێر"
    city: '' // e.g., "شاری هەولێر"
  });
  // News and Project image states
  const [newsImageFile, setNewsImageFile] = useState<File | null>(null);
  const [projectImageFile, setProjectImageFile] = useState<File | null>(null);
  // Image cropper states
  const [cropperImage, setCropperImage] = useState<string | null>(null);
  const [cropperType, setCropperType] = useState<'news' | 'project' | 'hero' | 'gallery' | null>(null);
  const [cropperFileName, setCropperFileName] = useState<string>('');
  // Project / news post currently open in the edit dialog
  const [editingPost, setEditingPost] = useState<EditablePost | null>(null);
  // Projects section state
  const [showAllProjects, setShowAllProjects] = useState(false);
  // New news creation state
  const [newNewsForm, setNewNewsForm] = useState({
    category: '',
    date: ''
  });
  const [kurdishTemplateFields, setKurdishTemplateFields] = useState({
    dayOfWeek: '',
    date: '',
    networkOrOrg: '',
    visitedPlaceCity: '',
    visitingOrg: '',
    visitedEntity: '',
    visitorNameAndTitle: '',
    visitPurpose: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [editableContent, setEditableContent] = useState({ title: '', content: '' });
  const [editContentType, setEditContentType] = useState<'news' | 'project'>('news');
  const handleCreateFromEdit = async () => {
    if (!editableContent.title || !editableContent.content) {
      toast({
        title: "خطا - Error",
        description: "Please fill in both title and content",
        variant: "destructive",
      });
      return;
    }

    // Map to English category based on which template was used
    let category = 'Place Visited'; // Default
    if (newNewsForm.category === 'KurdishVisitors') {
      category = 'Visitors';
    } else if (newNewsForm.category === 'KurdishCertificate') {
      category = 'Certificate Awarded';
    } else if (newNewsForm.category === 'KurdishCertGroup') {
      category = 'Certificate Awarded';
    } else if (newNewsForm.category === 'KurdishCertIndividual') {
      category = 'Certificate Received';
    }

    try {
      await createNews.mutateAsync({
        title: editableContent.title,
        content: editableContent.content,
        category: category
      });
      
      toast({
        title: "بەسەركەوتوویی - Success",
        description: "News article created successfully",
      });

      setEditableContent({ title: '', content: '' });
      setEditMode(false);
      setKurdishTemplateFields({
        dayOfWeek: '',
        date: '',
        networkOrOrg: '',
        visitedPlaceCity: '',
        visitingOrg: '',
        visitedEntity: '',
        visitorNameAndTitle: '',
        visitPurpose: ''
      });
    } catch (error) {
      toast({
        title: "خطا - Error",
        description: "Failed to create news article",
        variant: "destructive",
      });
    }
  };
  // Generate Kurdish Provision Project Content
  const generateKurdishProvisionContent = () => {
    const { dayOfWeek, date, whatProvided, recipientPlace, givingOrganization, detailedRecipients, city } = kurdishProvisionFields;
    
    const title = `دابینکردنی (${whatProvided})`;
    const description = `${dayOfWeek} - ${date}\n(${recipientPlace})\n====================\n(${givingOrganization})\nهەڵسا بە دابینکردنی (بڕێک لە ${whatProvided} بۆ (${detailedRecipients}) لە (${city})`;
    
    return { title, description };
  };
  // Generate Kurdish Distribution Project Content
  const generateKurdishDistributionContent = () => {
    const { dayOfWeek, date, whatDistributed, recipientType, location, givingOrganization, province } = kurdishDistributionFields;
    
    const title = `دابەشکردنی ${whatDistributed}`;
    const description = `${dayOfWeek} - ${date}\n${recipientType} - ${location}\n\n===========================\n\n(${givingOrganization})\nهەڵسا بە دابەشکردنی (${whatDistributed}) بەسەر خێزانانی (${recipientType}) لە (${province})`;
    
    return { title, description };
  };
  // Generate Kurdish Renovation Project Content
  const generateKurdishRenovationContent = () => {
    const { dayOfWeek, date, whatRenovated, location, givingOrganization, city } = kurdishRenovationFields;
    
    const title = `نۆژەنکردنەوە`;
    const description = `${dayOfWeek} - ${date}\n${whatRenovated} - ${location}\n===========================\n\n(${givingOrganization})\nهەڵسا بە نۆژەنکردنەوەی (${whatRenovated}) لە ${city}`;
    
    return { title, description };
  };
  // Generate Kurdish Building Project Content
  const generateKurdishBuildingContent = () => {
    const { whatBuilt, dayOfWeek, date, builtFor, location, givingOrganization, supervision, city } = kurdishBuildingFields;
    
    const title = `دروستکردن`;
    const description = `دروستکردنی ${whatBuilt}\n${dayOfWeek} - ${date}\n${builtFor} - ${location}\n======================\n\n(${givingOrganization})\nلەژێر چاودێری (${supervision})، بەهاوکاری خێرخوازان هەڵدەستێت بە دروستکردنی (${whatBuilt}) بۆ (${builtFor}) لە ${city}`;
    
    return { title, description };
  };
  // Handle editing Kurdish Provision content
  const handleEditKurdishProvisionContent = () => {
    const { title, description } = generateKurdishProvisionContent();
    setEditableContent({ title, content: description });
    setEditContentType('project');
    setEditMode(true);
  };
  // Handle creating project from edited content
  const handleCreateProjectFromEdit = async () => {
    if (!editableContent.title || !editableContent.content) {
      toast({
        title: "خطا - Error",
        description: "Please fill in both title and description",
        variant: "destructive"
      });
      return;
    }

    try {
      await createProject.mutateAsync({
        title_en: editableContent.title,
        description_en: editableContent.content,
        status: 'completed',
        category: newProjectForm.category || '',
        location: ''
      });

      toast({
        title: "بەسەركەوتوویی - Success",
        description: "Project created successfully from edited content",
      });

      setEditableContent({ title: '', content: '' });
      setEditMode(false);
      setKurdishProvisionFields({
        dayOfWeek: '',
        date: '',
        whatProvided: '',
        recipientPlace: '',
        givingOrganization: '',
        detailedRecipients: '',
        city: ''
      });
      setNewProjectForm({ category: '' });
    } catch (error) {
      toast({
        title: "خطا - Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    }
  };
  const handleCreateProjectFromTemplate = async () => {
    if (!newProjectForm.category) {
      toast({
        title: "خطا - Error",
        description: "Please select a category",
        variant: "destructive"
      });
      return;
    }

    if (newProjectForm.category === 'KurdishProvision') {
      const { title, description } = generateKurdishProvisionContent();
      try {
        await createProject.mutateAsync({
          title_en: title,
          description_en: description,
          status: 'completed',
          category: 'provision',
          location: '',
          image: projectImageFile || undefined
        });
        setKurdishProvisionFields({
          dayOfWeek: '',
          date: '',
          whatProvided: '',
          recipientPlace: '',
          givingOrganization: '',
          detailedRecipients: '',
          city: ''
        });
        setNewProjectForm({ category: '' });
        setProjectImageFile(null); // Clear the image
        toast({
          title: "بەسەركەوتوویی - Success",
          description: "دابینکردن project created successfully.",
        });
      } catch (error) {
        toast({
          title: "خطا - Error",
          description: "Failed to create دابینکردن project. Please try again.",
          variant: "destructive"
        });
      }
      return;
    }

    if (newProjectForm.category === 'KurdishDistribution') {
      const { title, description } = generateKurdishDistributionContent();
      try {
        await createProject.mutateAsync({
          title_en: title,
          description_en: description,
          status: 'completed',
          category: 'distribution',
          location: '',
          image: projectImageFile || undefined
        });
        setKurdishDistributionFields({
          dayOfWeek: '',
          date: '',
          whatDistributed: '',
          recipientType: '',
          location: '',
          givingOrganization: '',
          province: ''
        });
        setNewProjectForm({ category: '' });
        setProjectImageFile(null); // Clear the image
        toast({
          title: "بەسەركەوتوویی - Success",
          description: "دابەشکردن project created successfully.",
        });
      } catch (error) {
        toast({
          title: "خطا - Error",
          description: "Failed to create دابەشکردن project. Please try again.",
          variant: "destructive"
        });
      }
      return;
    }

    if (newProjectForm.category === 'KurdishRenovation') {
      const { title, description } = generateKurdishRenovationContent();
      try {
        await createProject.mutateAsync({
          title_en: title,
          description_en: description,
          status: 'completed',
          category: 'renovation',
          location: '',
          image: projectImageFile || undefined
        });
        setKurdishRenovationFields({
          dayOfWeek: '',
          date: '',
          whatRenovated: '',
          location: '',
          givingOrganization: '',
          city: ''
        });
        setNewProjectForm({ category: '' });
        setProjectImageFile(null); // Clear the image
        toast({
          title: "بەسەركەوتوویی - Success",
          description: "نۆژەنکردنەوە project created successfully.",
        });
      } catch (error) {
        toast({
          title: "خطا - Error",
          description: "Failed to create نۆژەنکردنەوە project. Please try again.",
          variant: "destructive"
        });
      }
      return;
    }

    if (newProjectForm.category === 'KurdishBuilding') {
      const { title, description } = generateKurdishBuildingContent();
      try {
        await createProject.mutateAsync({
          title_en: title,
          description_en: description,
          status: 'completed',
          category: 'building',
          location: '',
          image: projectImageFile || undefined
        });
        setKurdishBuildingFields({
          whatBuilt: '',
          dayOfWeek: '',
          date: '',
          builtFor: '',
          location: '',
          givingOrganization: '',
          supervision: '',
          city: ''
        });
        setNewProjectForm({ category: '' });
        setProjectImageFile(null); // Clear the image
        toast({
          title: "بەسەركەوتوویی - Success",
          description: "دروستکردن project created successfully.",
        });
      } catch (error) {
        toast({
          title: "خطا - Error",
          description: "Failed to create دروستکردن project. Please try again.",
          variant: "destructive"
        });
      }
      return;
    }
  };
  const handleDeleteProject = async (id: string) => {
    await deleteProject.mutateAsync(id);
    toast({
      title: "Project deleted",
      description: "The project has been removed successfully.",
    });
  };

  return (
    <>
      <TabsContent value="projects" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Management</CardTitle>
            <CardDescription>Create, edit, and manage project activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Template-based Project Creation */}
              <Card className="bg-gradient-to-r from-green-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg">📋 Create Project from Template</CardTitle>
                  <CardDescription>Use Kurdish templates for project activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="projectCategorySelect">Project Category</Label>
                      <Select 
                        value={newProjectForm.category} 
                        onValueChange={(value) => setNewProjectForm({...newProjectForm, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select project category..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="KurdishProvision">دابینکردن (Provision)</SelectItem>
                          <SelectItem value="KurdishDistribution">دابەشکردن (Distribution)</SelectItem>
                          <SelectItem value="KurdishRenovation">نۆژەنکردنەوە (Renovation)</SelectItem>
                          <SelectItem value="KurdishBuilding">دروستکردن (Building)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Image Upload for Projects */}
                    <div>
                      <Label htmlFor="projectImageUpload">📷 Upload Image for this Project (optional)</Label>
                      <p className="text-xs text-gray-500 mb-2">Each project post can have its own unique image</p>
                      <Input
                        id="projectImageUpload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // Open image cropper
                            const reader = new FileReader();
                            reader.onload = () => {
                              setCropperImage(reader.result as string);
                              setCropperType('project');
                              setCropperFileName(file.name);
                            };
                            reader.readAsDataURL(file);
                            
                            // Clear the input
                            e.target.value = '';
                          }
                        }}
                        className="cursor-pointer"
                      />
                      {projectImageFile && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                          <p className="text-sm text-green-700 font-medium">✓ Ready to upload: {projectImageFile.name}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setProjectImageFile(null);
                              const input = document.getElementById('projectImageUpload') as HTMLInputElement;
                              if (input) input.value = '';
                            }}
                            className="mt-1 h-6 text-xs text-red-600 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Kurdish Provision Template */}
                    {newProjectForm.category === 'KurdishProvision' && (
                      <div className="space-y-4 border-t pt-4">
                        <div className="bg-green-50 p-4 rounded-lg mb-4">
                          <p className="text-sm text-green-800 font-medium">دابینکردن - Provision Template</p>
                          <p className="text-xs text-green-600 mt-1">For providing supplies, medicines, or resources</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>ڕۆژی هەفتە (Day of Week)</Label>
                            <DayOfWeekSelect value={kurdishProvisionFields.dayOfWeek} onChange={(v) => setKurdishProvisionFields(prev => ({ ...prev, dayOfWeek: v }))} />
                          </div>
                          <div>
                            <Label>بەروار (Date)</Label>
                            <DatePickerField value={kurdishProvisionFields.date} onChange={(v) => setKurdishProvisionFields(prev => ({ ...prev, date: v }))} onDayOfWeek={(day) => setKurdishProvisionFields(prev => ({ ...prev, dayOfWeek: day }))} />
                          </div>
                          <div className="md:col-span-2">
                            <Label>چی دابین کرا (What Was Provided)</Label>
                            <Input
                              value={kurdishProvisionFields.whatProvided}
                              onChange={(e) => setKurdishProvisionFields(prev => ({ ...prev, whatProvided: e.target.value }))}
                              placeholder="نموونە: دەرمانی پێویست"
                            />
                          </div>
                          <div>
                            <Label>شوێنی وەرگر - کورت (Recipient Place - Short)</Label>
                            <Input
                              value={kurdishProvisionFields.recipientPlace}
                              onChange={(e) => setKurdishProvisionFields(prev => ({ ...prev, recipientPlace: e.target.value }))}
                              placeholder="نموونە: نەخۆشخانە و بنکەی تەندروستی"
                            />
                          </div>
                          <div>
                            <Label>ناوی رێکخراوی پێدەر (Giving Organization)</Label>
                            <Input
                              value={kurdishProvisionFields.givingOrganization}
                              onChange={(e) => setKurdishProvisionFields(prev => ({ ...prev, givingOrganization: e.target.value }))}
                              placeholder="نموونە: رێکخراوی مرۆڤدۆستان"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label>وردەکاری شوێنی وەرگر (Detailed Recipients)</Label>
                            <Textarea
                              value={kurdishProvisionFields.detailedRecipients}
                              onChange={(e) => setKurdishProvisionFields(prev => ({ ...prev, detailedRecipients: e.target.value }))}
                              placeholder="نموونە: نەخۆشخانەکانی هەولێری فێرکاری و رزگاری و بنکەی تەندروستی شاوێس"
                              rows={2}
                            />
                          </div>
                          <div>
                            <Label>شار (City)</Label>
                            <Input
                              value={kurdishProvisionFields.city}
                              onChange={(e) => setKurdishProvisionFields(prev => ({ ...prev, city: e.target.value }))}
                              placeholder="نموونە: شاری هەولێر"
                            />
                          </div>
                        </div>
                        <div className="pt-4 space-y-2">
                          <Button 
                            onClick={handleEditKurdishProvisionContent}
                            variant="outline"
                            className="w-full"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit & Write Freely
                          </Button>
                          <Button 
                            onClick={handleCreateProjectFromTemplate}
                            disabled={createProject.isPending}
                            className="w-full"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            {createProject.isPending ? 'Creating...' : 'Create دابینکردن Project'}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Kurdish Distribution Template */}
                    {newProjectForm.category === 'KurdishDistribution' && (
                      <div className="space-y-4 border-t pt-4">
                        <div className="bg-purple-50 p-4 rounded-lg mb-4">
                          <p className="text-sm text-purple-800 font-medium">دابەشکردن - Distribution Template</p>
                          <p className="text-xs text-purple-600 mt-1">For distributing food, baskets, or supplies to families</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>ڕۆژی هەفتە (Day of Week)</Label>
                            <DayOfWeekSelect value={kurdishDistributionFields.dayOfWeek} onChange={(v) => setKurdishDistributionFields(prev => ({ ...prev, dayOfWeek: v }))} />
                          </div>
                          <div>
                            <Label>بەروار (Date)</Label>
                            <DatePickerField value={kurdishDistributionFields.date} onChange={(v) => setKurdishDistributionFields(prev => ({ ...prev, date: v }))} onDayOfWeek={(day) => setKurdishDistributionFields(prev => ({ ...prev, dayOfWeek: day }))} />
                          </div>
                          <div className="md:col-span-2">
                            <Label>چی دابەش کرا (What Was Distributed)</Label>
                            <Input
                              value={kurdishDistributionFields.whatDistributed}
                              onChange={(e) => setKurdishDistributionFields(prev => ({ ...prev, whatDistributed: e.target.value }))}
                              placeholder="نموونە: سەبەتەی خۆراک و هێلکە"
                            />
                          </div>
                          <div>
                            <Label>جۆری وەرگر (Recipient Type)</Label>
                            <Input
                              value={kurdishDistributionFields.recipientType}
                              onChange={(e) => setKurdishDistributionFields(prev => ({ ...prev, recipientType: e.target.value }))}
                              placeholder="نموونە: خاوەنپێدایوستی تایبەت"
                            />
                          </div>
                          <div>
                            <Label>شار (Location/City)</Label>
                            <Input
                              value={kurdishDistributionFields.location}
                              onChange={(e) => setKurdishDistributionFields(prev => ({ ...prev, location: e.target.value }))}
                              placeholder="نموونە: دهۆک"
                            />
                          </div>
                          <div>
                            <Label>ناوی رێکخراوی دابەشکەر (Distributing Organization)</Label>
                            <Input
                              value={kurdishDistributionFields.givingOrganization}
                              onChange={(e) => setKurdishDistributionFields(prev => ({ ...prev, givingOrganization: e.target.value }))}
                              placeholder="نموونە: رێکخراوی مرۆڤدۆستان"
                            />
                          </div>
                          <div>
                            <Label>پارێزگا (Province)</Label>
                            <Input
                              value={kurdishDistributionFields.province}
                              onChange={(e) => setKurdishDistributionFields(prev => ({ ...prev, province: e.target.value }))}
                              placeholder="نموونە: پارێزگای دهۆک"
                            />
                          </div>
                        </div>
                        <div className="pt-4">
                          <Button 
                            onClick={handleCreateProjectFromTemplate}
                            disabled={createProject.isPending}
                            className="w-full"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            {createProject.isPending ? 'Creating...' : 'Create دابەشکردن Project'}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Kurdish Renovation Template */}
                    {newProjectForm.category === 'KurdishRenovation' && (
                      <div className="space-y-4 border-t pt-4">
                        <div className="bg-blue-50 p-4 rounded-lg mb-4">
                          <p className="text-sm text-blue-800 font-medium">نۆژەنکردنەوە - Renovation Template</p>
                          <p className="text-xs text-blue-600 mt-1">For renovating schools, buildings, or facilities</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>ڕۆژی هەفتە (Day of Week)</Label>
                            <DayOfWeekSelect value={kurdishRenovationFields.dayOfWeek} onChange={(v) => setKurdishRenovationFields(prev => ({ ...prev, dayOfWeek: v }))} />
                          </div>
                          <div>
                            <Label>بەروار (Date)</Label>
                            <DatePickerField value={kurdishRenovationFields.date} onChange={(v) => setKurdishRenovationFields(prev => ({ ...prev, date: v }))} onDayOfWeek={(day) => setKurdishRenovationFields(prev => ({ ...prev, dayOfWeek: day }))} />
                          </div>
                          <div className="md:col-span-2">
                            <Label>چی نۆژەن کرایەوە (What Was Renovated)</Label>
                            <Input
                              value={kurdishRenovationFields.whatRenovated}
                              onChange={(e) => setKurdishRenovationFields(prev => ({ ...prev, whatRenovated: e.target.value }))}
                              placeholder="نموونە: قوتابخانەی قەریتاغی بنەڕەتی تێکەڵاو"
                            />
                          </div>
                          <div>
                            <Label>شوێن (Location - Short)</Label>
                            <Input
                              value={kurdishRenovationFields.location}
                              onChange={(e) => setKurdishRenovationFields(prev => ({ ...prev, location: e.target.value }))}
                              placeholder="نموونە: هەولێر"
                            />
                          </div>
                          <div>
                            <Label>ناوی رێکخراو (Organization)</Label>
                            <Input
                              value={kurdishRenovationFields.givingOrganization}
                              onChange={(e) => setKurdishRenovationFields(prev => ({ ...prev, givingOrganization: e.target.value }))}
                              placeholder="نموونە: رێکخراوی مرۆڤدۆستان"
                            />
                          </div>
                          <div>
                            <Label>شار (City - Full)</Label>
                            <Input
                              value={kurdishRenovationFields.city}
                              onChange={(e) => setKurdishRenovationFields(prev => ({ ...prev, city: e.target.value }))}
                              placeholder="نموونە: شاری هەولێر"
                            />
                          </div>
                        </div>
                        <div className="pt-4">
                          <Button 
                            onClick={handleCreateProjectFromTemplate}
                            disabled={createProject.isPending}
                            className="w-full"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            {createProject.isPending ? 'Creating...' : 'Create نۆژەنکردنەوە Project'}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Kurdish Building Template */}
                    {newProjectForm.category === 'KurdishBuilding' && (
                      <div className="space-y-4 border-t pt-4">
                        <div className="bg-orange-50 p-4 rounded-lg mb-4">
                          <p className="text-sm text-orange-800 font-medium">دروستکردن - Building Template</p>
                          <p className="text-xs text-orange-600 mt-1">For building/constructing facilities, rooms, or structures</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <Label>چی دروست کرا (What Was Built)</Label>
                            <Input
                              value={kurdishBuildingFields.whatBuilt}
                              onChange={(e) => setKurdishBuildingFields(prev => ({ ...prev, whatBuilt: e.target.value }))}
                              placeholder="نموونە: (4) ژووری پێویست"
                            />
                          </div>
                          <div>
                            <Label>ڕۆژی هەفتە (Day of Week)</Label>
                            <DayOfWeekSelect value={kurdishBuildingFields.dayOfWeek} onChange={(v) => setKurdishBuildingFields(prev => ({ ...prev, dayOfWeek: v }))} />
                          </div>
                          <div>
                            <Label>بەروار (Date)</Label>
                            <DatePickerField value={kurdishBuildingFields.date} onChange={(v) => setKurdishBuildingFields(prev => ({ ...prev, date: v }))} onDayOfWeek={(day) => setKurdishBuildingFields(prev => ({ ...prev, dayOfWeek: day }))} />
                          </div>
                          <div>
                            <Label>دروست کرا بۆ (Built For)</Label>
                            <Input
                              value={kurdishBuildingFields.builtFor}
                              onChange={(e) => setKurdishBuildingFields(prev => ({ ...prev, builtFor: e.target.value }))}
                              placeholder="نموونە: بنکەی تەندروستی زانکۆ"
                            />
                          </div>
                          <div>
                            <Label>شوێن (Location - Short)</Label>
                            <Input
                              value={kurdishBuildingFields.location}
                              onChange={(e) => setKurdishBuildingFields(prev => ({ ...prev, location: e.target.value }))}
                              placeholder="نموونە: هەولێر"
                            />
                          </div>
                          <div>
                            <Label>ناوی رێکخراو (Organization)</Label>
                            <Input
                              value={kurdishBuildingFields.givingOrganization}
                              onChange={(e) => setKurdishBuildingFields(prev => ({ ...prev, givingOrganization: e.target.value }))}
                              placeholder="نموونە: رێکخراوی مرۆڤدۆستان"
                            />
                          </div>
                          <div>
                            <Label>لەژێر چاودێری (Under Supervision)</Label>
                            <Input
                              value={kurdishBuildingFields.supervision}
                              onChange={(e) => setKurdishBuildingFields(prev => ({ ...prev, supervision: e.target.value }))}
                              placeholder="نموونە: بەڕێوەبەرایەتی گشتی تەندروستی هەولێر"
                            />
                          </div>
                          <div>
                            <Label>شار (City - Full)</Label>
                            <Input
                              value={kurdishBuildingFields.city}
                              onChange={(e) => setKurdishBuildingFields(prev => ({ ...prev, city: e.target.value }))}
                              placeholder="نموونە: شاری هەولێر"
                            />
                          </div>
                        </div>
                        <div className="pt-4">
                          <Button 
                            onClick={handleCreateProjectFromTemplate}
                            disabled={createProject.isPending}
                            className="w-full"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            {createProject.isPending ? 'Creating...' : 'Create دروستکردن Project'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Show All Projects Button */}
              <div className="mb-6">
                <Label className="text-lg font-semibold mb-3 block">
                  View All Projects:
                </Label>
                <div className="flex gap-2">
                  <Button 
                    variant={showAllProjects ? 'default' : 'outline'}
                    onClick={() => setShowAllProjects(!showAllProjects)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    {showAllProjects ? 'Hide Projects' : 'Show All Projects'}
                  </Button>
                  <div className="text-sm text-gray-500 flex items-center ml-4">
                    Total: {projects.length} projects
                  </div>
                </div>
              </div>

              {showAllProjects && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {projects.length === 0 ? (
                    <Card className="col-span-full text-center py-12 bg-gray-50">
                      <CardContent>
                        <div className="text-gray-500 text-lg mb-4">
                          No projects found in the database.
                        </div>
                        <div className="text-sm text-gray-400">
                          Use the form above to create your first project.
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    projects.map((project) => {
                      const projectId = String(project.id);
                      return (
                        <Card 
                          key={projectId}
                          className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                          <CardContent className="p-6">
                            {/* Edit and Delete Buttons */}
                            <div className="absolute top-4 right-4 flex gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                onClick={() => setEditingPost({ kind: 'project', item: project })}
                                title="Edit this project"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                onClick={() => handleDeleteProject(projectId)}
                                disabled={deleteProject.isPending}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>

                            {/* Image */}
                            {resolveImage(project.imageUrl) && (
                              <img
                                src={resolveImage(project.imageUrl) ?? undefined}
                                alt=""
                                className="w-full h-40 object-cover rounded-xl mb-4"
                              />
                            )}

                            {/* Status Badge */}
                            <div className="mb-4 flex flex-wrap gap-2 pr-16">
                              {project.category && (
                                <Badge variant="outline" className="text-xs font-medium">{project.category}</Badge>
                              )}
                              {project.location && (
                                <Badge variant="outline" className="text-xs font-medium">{project.location}</Badge>
                              )}
                              <Badge
                                variant="secondary" 
                                className={`${
                                  project.status === 'completed' 
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                                    : project.status === 'active'
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                                    : 'bg-gradient-to-r from-gray-500 to-gray-600'
                                } text-white px-3 py-1 rounded-full text-sm font-medium`}
                              >
                                {project.status || 'active'}
                              </Badge>
                            </div>

                            {/* Title */}
                            <CardHeader className="p-0 mb-4">
                              <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2 pr-16">
                                {project.title_en || project.title}
                              </CardTitle>
                            </CardHeader>

                            {/* Description */}
                            <div className="text-gray-700 leading-relaxed">
                              <pre className="whitespace-pre-line font-sans line-clamp-6">
                                {project.description_en || project.description}
                              </pre>
                            </div>

                            {/* Footer Info */}
                            <div className="mt-6 pt-4 border-t border-gray-100">
                              <Badge variant="outline" className="text-xs font-medium">
                                Created: {new Date(project.createdAt).toLocaleDateString()}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <PostEditDialog post={editingPost} onClose={() => setEditingPost(null)} />
      {cropperImage && cropperType && (
        <ImageCropper
          image={cropperImage}
          fileName={cropperFileName}
          aspectRatio={16 / 9}
          onCropComplete={(croppedFile) => {
            if (cropperType === 'news') {
              setNewsImageFile(croppedFile);
              toast({
                title: "✓ Image cropped",
                description: `${croppedFile.name} is ready to upload with this news`,
              });
            } else if (cropperType === 'project') {
              setProjectImageFile(croppedFile);
              toast({
                title: "✓ Image cropped",
                description: `${croppedFile.name} is ready to upload with this project`,
              });
            }
            // Close cropper
            setCropperImage(null);
            setCropperType(null);
            setCropperFileName('');
          }}
          onCancel={() => {
            setCropperImage(null);
            setCropperType(null);
            setCropperFileName('');
          }}
        />
      )}
      {/* Edit Dialog */}
      <Dialog open={editMode} onOpenChange={setEditMode}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>Edit Content - دەستکاریکردنی ناوەڕۆک</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title (ناونیشان):</Label>
              <Input 
                id="edit-title"
                value={editableContent.title}
                onChange={(e) => setEditableContent(prev => ({ ...prev, title: e.target.value }))}
                className="mt-2"
                placeholder="Enter title..."
              />
            </div>
            <div>
              <Label htmlFor="edit-content">Content (ناوەڕۆک):</Label>
              <Textarea 
                id="edit-content"
                value={editableContent.content}
                onChange={(e) => setEditableContent(prev => ({ ...prev, content: e.target.value }))}
                className="mt-2 min-h-[300px]"
                placeholder="Write your content freely..."
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={editContentType === 'news' ? handleCreateFromEdit : handleCreateProjectFromEdit}
                disabled={editContentType === 'news' ? createNews.isPending : createProject.isPending}
                className="flex-1"
              >
                <Plus className="w-4 h-4 mr-2" />
                {editContentType === 'news' 
                  ? (createNews.isPending ? 'Creating...' : 'Create News')
                  : (createProject.isPending ? 'Creating...' : 'Create Project')
                }
              </Button>
              <Button 
                variant="outline"
                onClick={() => setEditMode(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectsTab;
