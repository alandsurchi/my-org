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



const NewsTab = () => {
  const { toast } = useToast();
  // Real data from PostgreSQL database
  const { data: news = [] } = useNews();
  const createNews = useCreateNews();
  const deleteNews = useDeleteNews();
  const createProject = useCreateProject();
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
  // News and Project image states
  const [newsImageFile, setNewsImageFile] = useState<File | null>(null);
  const [projectImageFile, setProjectImageFile] = useState<File | null>(null);
  // Image cropper states
  const [cropperImage, setCropperImage] = useState<string | null>(null);
  const [cropperType, setCropperType] = useState<'news' | 'project' | 'hero' | 'gallery' | null>(null);
  const [cropperFileName, setCropperFileName] = useState<string>('');
  // Dynamic News Section state
  const [selectedNewsCategory, setSelectedNewsCategory] = useState('');
  // Project / news post currently open in the edit dialog
  const [editingPost, setEditingPost] = useState<EditablePost | null>(null);
  // New news creation state
  const [newNewsForm, setNewNewsForm] = useState({
    category: '',
    date: ''
  });
  const [templateFields, setTemplateFields] = useState({
    organizationName: '',
    personVisited: '',
    position: '',
    location: '',
    secondLocation: '',
    secondPerson: '',
    visitorName: '',
    specialty: '',
    purpose: '',
    recipients: '',
    institution: '',
    individual: '',
    visitingInstitution: '',
    reason: ''
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
  const [kurdishVisitorsFields, setKurdishVisitorsFields] = useState({
    dayOfWeek: '',
    date: '',
    visitorName: '',
    visitorTitle: '',
    visitedOrganization: '',
    visitPurpose: ''
  });
  const [kurdishCertificateFields, setKurdishCertificateFields] = useState({
    dayOfWeek: '',
    date: '',
    visitingOrganization: '',
    visitingOrgCity: '',
    receivingOrganization: '',
    reasonForCertificate: ''
  });
  // Kurdish Certificate Group Template (وەرگرتنی سوپاس - کۆمەڵگا)
  const [kurdishCertGroupFields, setKurdishCertGroupFields] = useState({
    dayOfWeek: '',
    date: '',
    activityDescription: '', // e.g., "چاڵاکی بەربانگکردنەوە بۆ خوێندکارانی بەشەناوخۆییەکانی"
    institutionName: '', // e.g., "زانکۆی سلێمانی"
    givingOrganization: '', // e.g., "رێکخراوی مرۆڤدۆستان"
    recipientGroup: '', // e.g., "خۆبەخشانی مرۆڤدۆستان"
    cityOrProvince: '' // e.g., "پارێزگای سلێمانی"
  });
  // Kurdish Certificate Individual Template (وەرگرتنی سوپاس - تاک)
  const [kurdishCertIndividualFields, setKurdishCertIndividualFields] = useState({
    dayOfWeek: '',
    date: '',
    serviceDescription: '', // e.g., "چارەسەری نەخۆشانی هەژار و بێ باوکان"
    givingOrganization: '', // e.g., "رێکخراوی مرۆڤدۆستان"
    recipientName: '', // e.g., "دکتۆر ئەرسەلان شەم"
    recipientTitle: '' // Optional title
  });
  const [editMode, setEditMode] = useState(false);
  const [editableContent, setEditableContent] = useState({ title: '', content: '' });
  const [editContentType, setEditContentType] = useState<'news' | 'project'>('news');
  const generateKurdishContentFromTemplate = () => {
    const {
      dayOfWeek,
      date,
      networkOrOrg,
      visitedPlaceCity,
      visitingOrg,
      visitedEntity,
      visitorNameAndTitle,
      visitPurpose
    } = kurdishTemplateFields;

    const title = `سەردانی فەرمی: ${networkOrOrg} - ${visitedPlaceCity}`;
    const content = `((ڕۆژی هەفتە) - (بەروار) (ناوی تۆڕ یان ڕێکخراو) - (شوێنی سەردان - شار))\n\nشاندێكی (${visitingOrg}) سەردانی **(${visitedEntity})**ی کرد، لەلایەن بەرێز (${visitorNameAndTitle}) پێشوازیان لێكرا، ئەم سەردانەش بەمەبەستی (${visitPurpose}).`;
    
    return { title, content };
  };
  const generateKurdishVisitorsContent = () => {
    const {
      dayOfWeek,
      date,
      visitorName,
      visitorTitle,
      visitedOrganization,
      visitPurpose
    } = kurdishVisitorsFields;

    const title = `میوانداری: ${visitorName}`;
    const content = `(${dayOfWeek} - ${date}\n${visitorName} - ${visitorTitle})\n\nبەرێز (${visitorName}) ${visitorTitle}، سەردانی (${visitedOrganization})ی کرد، لەلایەن سەرۆکی رێکخراو پێشوازی لێکرا. ئەم سەردانەش بەمەبەستی (${visitPurpose})`;
    
    return { title, content };
  };
  const generateKurdishCertificateContent = () => {
    const {
      dayOfWeek,
      date,
      visitingOrganization,
      visitingOrgCity,
      receivingOrganization,
      reasonForCertificate
    } = kurdishCertificateFields;

    const title = `وەرگرتنی سوپاس و پێزانین: ${visitingOrganization}`;
    const content = `(${dayOfWeek} - ${date}\n${visitingOrganization} ${visitingOrgCity ? `لە ${visitingOrgCity}` : ''})\n\nشاندێکی (${visitingOrganization}) سەردانی (${receivingOrganization})یان کرد، ئەم سەردانەش بەمەبەستی پێدانی سوپاس و پێزانین بوو بە رێکخراو، لەپای (${reasonForCertificate})`;
    
    return { title, content };
  };
  // Generate content for Kurdish Certificate Group Template
  const generateKurdishCertGroupContent = () => {
    const { dayOfWeek, date, activityDescription, institutionName, givingOrganization, recipientGroup, cityOrProvince } = kurdishCertGroupFields;
    
    const title = `وەرگرتنی سوپاس و پێزانین - ${dayOfWeek} - ${date}`;
    const content = `لە بەرامبەر هاوکاری کردن و کاری خۆبەخشی لە (${activityDescription} (${institutionName}))، (${givingOrganization}) هەڵسا بە بەخشینی سوپاس و پێزانین بە ${recipientGroup} لە (${cityOrProvince})`;
    
    return { title, content };
  };
  // Generate content for Kurdish Certificate Individual Template
  const generateKurdishCertIndividualContent = () => {
    const { dayOfWeek, date, serviceDescription, givingOrganization, recipientName, recipientTitle } = kurdishCertIndividualFields;
    
    const recipientFullName = recipientTitle ? `${recipientTitle} ${recipientName}` : recipientName;
    const title = `وەرگرتنی سوپاس و پێزانین - ${dayOfWeek} - ${date}`;
    const content = `لە بەرامبەر هاوکاری کردن (${serviceDescription})، بەئەرکی خۆمانی دەزانین بەناوی (${givingOrganization}) سوپاس و پێزانینی خۆمان ئاراستەی بەرێز (${recipientFullName}) بکەین، هیوای سەرکەوتن و سەرفرازی بۆ دەخوازین…`;
    
    return { title, content };
  };
  const handleEditKurdishContent = () => {
    const { title, content } = generateKurdishContentFromTemplate();
    setEditableContent({ title, content });
    setEditContentType('news');
    setEditMode(true);
  };
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
  // Template and creation handlers
  const resetTemplateFields = (category: string) => {
    setTemplateFields({
      organizationName: '',
      personVisited: '',
      position: '',
      location: '',
      secondLocation: '',
      secondPerson: '',
      visitorName: '',
      specialty: '',
      purpose: '',
      recipients: '',
      institution: '',
      individual: '',
      visitingInstitution: '',
      reason: ''
    });
  };
  const clearTemplateForm = () => {
    setNewNewsForm({ category: '', date: '' });
    resetTemplateFields('');
  };
  const generateContentFromTemplate = (category: string, fields: Record<string, string>, date: string) => {
    switch (category) {
      case 'Certificate Awarded':
        return {
          title: `${fields.recipients || 'Recipients'} - ${fields.institution || 'Institution'}${fields.individual ? ` / ${fields.individual}` : ''}`,
          content: `In recognition of the volunteer work in awareness-raising activities for students of the internal departments of (${fields.institution || 'Institution'}), as well as the dedicated efforts of (${fields.individual || 'Individual Name'}) in providing assistance and treatment for poor patients and orphans, the (${fields.organizationName || 'Humanitarian Organization'}) extended its sincere thanks and appreciation. Both the ${fields.recipients || 'volunteers'} and ${fields.individual || 'individual'} are acknowledged for their humanitarian contributions, and we wish them continued success and honor.`
        };
        
      case 'Certificate Received':
        return {
          title: `${fields.visitingInstitution || 'Visiting Institution'}`,
          content: `A delegation from (${fields.visitingInstitution || 'Institution Name'}) visited the (${fields.organizationName || 'Humanitarian Organization'}). This visit was for the purpose of offering thanks and appreciation to the organization, in recognition of ${fields.reason || 'the assistance provided'}.`
        };
        
      default:
        return { title: '', content: '' };
    }
  };
  const handleCreateNewsFromTemplate = async () => {
    if (!newNewsForm.category) {
      toast({
        title: "Missing Information",
        description: "Please select a category.",
        variant: "destructive"
      });
      return;
    }

    if (newNewsForm.category === 'SardaniFrami') {
      const { title, content } = generateKurdishContentFromTemplate();
      try {
        await createNews.mutateAsync({
          title: title,
          content: content,
          category: 'Place Visited'
        });
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
        clearTemplateForm();
        toast({
          title: "News Created",
          description: "New Kurdish news item has been created and saved to database.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create Kurdish news item. Please try again.",
          variant: "destructive"
        });
      }
      return;
    }

    if (newNewsForm.category === 'KurdishVisitors') {
      const { title, content } = generateKurdishVisitorsContent();
      try {
        await createNews.mutateAsync({
          title: title,
          content: content,
          category: 'Visitors'
        });
        setKurdishVisitorsFields({
          dayOfWeek: '',
          date: '',
          visitorName: '',
          visitorTitle: '',
          visitedOrganization: '',
          visitPurpose: ''
        });
        clearTemplateForm();
        toast({
          title: "بەسەركەوتوویی - Success",
          description: "میوانداری news created successfully.",
        });
      } catch (error) {
        toast({
          title: "خطا - Error",
          description: "Failed to create میوانداری news. Please try again.",
          variant: "destructive"
        });
      }
      return;
    }

    if (newNewsForm.category === 'KurdishCertificate') {
      const { title, content } = generateKurdishCertificateContent();
      try {
        await createNews.mutateAsync({
          title: title,
          content: content,
          category: 'Certificate Awarded'
        });
        setKurdishCertificateFields({
          dayOfWeek: '',
          date: '',
          visitingOrganization: '',
          visitingOrgCity: '',
          receivingOrganization: '',
          reasonForCertificate: ''
        });
        clearTemplateForm();
        toast({
          title: "بەسەركەوتوویی - Success",
          description: "وەرگرتنی سوپاس و پێزانین news created successfully.",
        });
      } catch (error) {
        toast({
          title: "خطا - Error",
          description: "Failed to create وەرگرتنی سوپاس و پێزانین news. Please try again.",
          variant: "destructive"
        });
      }
      return;
    }

    if (newNewsForm.category === 'KurdishCertGroup') {
      const { title, content } = generateKurdishCertGroupContent();
      try {
        await createNews.mutateAsync({
          title: title,
          content: content,
          category: 'Certificate Awarded'
        });
        setKurdishCertGroupFields({
          dayOfWeek: '',
          date: '',
          activityDescription: '',
          institutionName: '',
          givingOrganization: '',
          recipientGroup: '',
          cityOrProvince: ''
        });
        clearTemplateForm();
        toast({
          title: "بەسەركەوتوویی - Success",
          description: "وەرگرتنی سوپاس - کۆمەڵگا news created successfully.",
        });
      } catch (error) {
        toast({
          title: "خطا - Error",
          description: "Failed to create certificate group news. Please try again.",
          variant: "destructive"
        });
      }
      return;
    }

    if (newNewsForm.category === 'KurdishCertIndividual') {
      const { title, content } = generateKurdishCertIndividualContent();
      try {
        await createNews.mutateAsync({
          title: title,
          content: content,
          category: 'Certificate Received'
        });
        setKurdishCertIndividualFields({
          dayOfWeek: '',
          date: '',
          serviceDescription: '',
          givingOrganization: '',
          recipientName: '',
          recipientTitle: ''
        });
        clearTemplateForm();
        toast({
          title: "بەسەركەوتوویی - Success",
          description: "وەرگرتنی سوپاس - تاک news created successfully.",
        });
      } catch (error) {
        toast({
          title: "خطا - Error",
          description: "Failed to create certificate individual news. Please try again.",
          variant: "destructive"
        });
      }
      return;
    }

    const { title, content } = generateContentFromTemplate(newNewsForm.category, templateFields, newNewsForm.date);

    try {
      await createNews.mutateAsync({
        title: title,
        content: content,
        category: newNewsForm.category, // Include category in the API call
        image: newsImageFile || undefined // Include image if uploaded
      });
      clearTemplateForm();
      setNewsImageFile(null); // Clear the image file

      toast({
        title: "News Created",
        description: "New news item has been created and saved to database.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create news item. Please try again.",
        variant: "destructive"
      });
    }
  };
  const handleDeleteNewsItem = async (itemId: string) => {
    // Ensure we have a valid ID
    if (!itemId) {
      toast({
        title: "Error",
        description: "Invalid news item ID",
        variant: "destructive"
      });
      return;
    }

    try {
      await deleteNews.mutateAsync(itemId);

      toast({
        title: "News Deleted",
        description: "The news item has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete news item: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <TabsContent value="news" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>📰 Dynamic News Section</CardTitle>
            <CardDescription>Manage news with four specialized categories and templates</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Create New News Item */}
            <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="text-lg">Create New News Item</CardTitle>
                <CardDescription>Use templates to quickly create new news items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="newsCategorySelect">Category</Label>
                    <Select 
                      value={newNewsForm.category} 
                      onValueChange={(value) => {
                        setNewNewsForm({...newNewsForm, category: value});
                        resetTemplateFields(value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SardaniFrami">سەردانی فەرمی (Official Visit)</SelectItem>
                        <SelectItem value="KurdishVisitors">میوانداری (Visitors)</SelectItem>
                        <SelectItem value="KurdishCertificate">وەرگرتنی سوپاس و پێزانین (Certificate Received)</SelectItem>
                        <SelectItem value="KurdishCertGroup">وەرگرتنی سوپاس - کۆمەڵگا (Certificate - Group)</SelectItem>
                        <SelectItem value="KurdishCertIndividual">وەرگرتنی سوپاس - تاک (Certificate - Individual)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Image Upload for News */}
                  <div>
                    <Label htmlFor="newsImageUpload">📷 Upload Image for this News (optional)</Label>
                    <p className="text-xs text-gray-500 mb-2">Each news post can have its own unique image</p>
                    <Input
                      id="newsImageUpload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Open image cropper
                          const reader = new FileReader();
                          reader.onload = () => {
                            setCropperImage(reader.result as string);
                            setCropperType('news');
                            setCropperFileName(file.name);
                          };
                          reader.readAsDataURL(file);
                          
                          // Clear the input
                          e.target.value = '';
                        }
                      }}
                      className="cursor-pointer"
                    />
                    {newsImageFile && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                        <p className="text-sm text-green-700 font-medium">✓ Ready to upload: {newsImageFile.name}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setNewsImageFile(null);
                            const input = document.getElementById('newsImageUpload') as HTMLInputElement;
                            if (input) input.value = '';
                          }}
                          className="mt-1 h-6 text-xs text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Template Fields based on Category */}
                {newNewsForm.category && (
                  <div className="mt-6 space-y-4">
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3">Template Fields for {newNewsForm.category}</h4>
                      
                      {/* Template fields for each category */}
                      {newNewsForm.category === 'KurdishVisitors' && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>ڕۆژی هەفتە (Day of Week)</Label>
                              <DayOfWeekSelect value={kurdishVisitorsFields.dayOfWeek} onChange={(v) => setKurdishVisitorsFields(prev => ({ ...prev, dayOfWeek: v }))} />
                            </div>
                            <div>
                              <Label>بەروار (Date)</Label>
                              <DatePickerField value={kurdishVisitorsFields.date} onChange={(v) => setKurdishVisitorsFields(prev => ({ ...prev, date: v }))} onDayOfWeek={(day) => setKurdishVisitorsFields(prev => ({ ...prev, dayOfWeek: day }))} />
                            </div>
                            <div>
                              <Label>ناوی میوان (Visitor Name)</Label>
                              <Input
                                value={kurdishVisitorsFields.visitorName}
                                onChange={(e) => setKurdishVisitorsFields(prev => ({ ...prev, visitorName: e.target.value }))}
                                placeholder="نموونە: دکتۆر دیدار صدیق"
                              />
                            </div>
                            <div>
                              <Label>پێوانە/پسپۆری (Title/Specialty)</Label>
                              <Input
                                value={kurdishVisitorsFields.visitorTitle}
                                onChange={(e) => setKurdishVisitorsFields(prev => ({ ...prev, visitorTitle: e.target.value }))}
                                placeholder="نموونە: پسپۆری نەخۆشیەکانی چاو"
                              />
                            </div>
                            <div>
                              <Label>ناوی رێکخراوی سەردانکراو (Visited Organization)</Label>
                              <Input
                                value={kurdishVisitorsFields.visitedOrganization}
                                onChange={(e) => setKurdishVisitorsFields(prev => ({ ...prev, visitedOrganization: e.target.value }))}
                                placeholder="نموونە: رێکخراوی مرۆڤدۆستان"
                              />
                            </div>
                            <div>
                              <Label>مەبەستی سەردان (Visit Purpose)</Label>
                              <Textarea
                                value={kurdishVisitorsFields.visitPurpose}
                                onChange={(e) => setKurdishVisitorsFields(prev => ({ ...prev, visitPurpose: e.target.value }))}
                                placeholder="نموونە: گفتوگۆکردن بوو لەبارەی هاوکاری کردنی زیاتری نەخۆشانی هەژار و کەمدەرامەت"
                              />
                            </div>
                          </div>
                          <div className="pt-4 space-y-2">
                            <Button 
                              onClick={() => {
                                const { title, content } = generateKurdishVisitorsContent();
                                setEditableContent({ title, content });
                                setEditContentType('news');
                                setEditMode(true);
                              }}
                              variant="outline"
                              className="w-full"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit & Write Freely
                            </Button>
                            <Button 
                              onClick={handleCreateNewsFromTemplate}
                              disabled={createNews.isPending}
                              className="w-full"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              {createNews.isPending ? 'Creating...' : 'Create News Article'}
                            </Button>
                          </div>
                        </div>
                      )}

                      {newNewsForm.category === 'KurdishCertificate' && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>ڕۆژی هەفتە (Day of Week)</Label>
                              <DayOfWeekSelect value={kurdishCertificateFields.dayOfWeek} onChange={(v) => setKurdishCertificateFields(prev => ({ ...prev, dayOfWeek: v }))} />
                            </div>
                            <div>
                              <Label>بەروار (Date)</Label>
                              <DatePickerField value={kurdishCertificateFields.date} onChange={(v) => setKurdishCertificateFields(prev => ({ ...prev, date: v }))} onDayOfWeek={(day) => setKurdishCertificateFields(prev => ({ ...prev, dayOfWeek: day }))} />
                            </div>
                            <div>
                              <Label>ناوی رێکخراوی میوان (Visiting Organization)</Label>
                              <Input
                                value={kurdishCertificateFields.visitingOrganization}
                                onChange={(e) => setKurdishCertificateFields(prev => ({ ...prev, visitingOrganization: e.target.value }))}
                                placeholder="نموونە: پەیمانگای ئەزهەر"
                              />
                            </div>
                            <div>
                              <Label>شار (City - Optional)</Label>
                              <Input
                                value={kurdishCertificateFields.visitingOrgCity}
                                onChange={(e) => setKurdishCertificateFields(prev => ({ ...prev, visitingOrgCity: e.target.value }))}
                                placeholder="نموونە: هەولێر"
                              />
                            </div>
                            <div>
                              <Label>ناوی رێکخراوی وەرگر (Receiving Organization)</Label>
                              <Input
                                value={kurdishCertificateFields.receivingOrganization}
                                onChange={(e) => setKurdishCertificateFields(prev => ({ ...prev, receivingOrganization: e.target.value }))}
                                placeholder="نموونە: رێکخراوی مرۆڤدۆستان"
                              />
                            </div>
                            <div>
                              <Label>هۆکاری پێدانی سوپاس (Reason for Certificate)</Label>
                              <Textarea
                                value={kurdishCertificateFields.reasonForCertificate}
                                onChange={(e) => setKurdishCertificateFields(prev => ({ ...prev, reasonForCertificate: e.target.value }))}
                                placeholder="نموونە: ئەو هاوکاریانەی کە پێشکەشی قوتابیانی بەشەناوخۆیی پەیمانگای ئەزهەر کرابوو"
                              />
                            </div>
                          </div>
                          <div className="pt-4 space-y-2">
                            <Button 
                              onClick={() => {
                                const { title, content } = generateKurdishCertificateContent();
                                setEditableContent({ title, content });
                                setEditContentType('news');
                                setEditMode(true);
                              }}
                              variant="outline"
                              className="w-full"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit & Write Freely
                            </Button>
                            <Button 
                              onClick={handleCreateNewsFromTemplate}
                              disabled={createNews.isPending}
                              className="w-full"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              {createNews.isPending ? 'Creating...' : 'Create News Article'}
                            </Button>
                          </div>
                        </div>
                      )}

                      {newNewsForm.category === 'KurdishCertGroup' && (
                        <div className="space-y-4">
                          <div className="bg-blue-50 p-4 rounded-lg mb-4">
                            <p className="text-sm text-blue-800 font-medium">سوپاس بۆ کۆمەڵگا - Certificate for Group</p>
                            <p className="text-xs text-blue-600 mt-1">For giving certificates to a group of people or volunteers</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>ڕۆژی هەفتە (Day of Week)</Label>
                              <DayOfWeekSelect value={kurdishCertGroupFields.dayOfWeek} onChange={(v) => setKurdishCertGroupFields(prev => ({ ...prev, dayOfWeek: v }))} />
                            </div>
                            <div>
                              <Label>بەروار (Date)</Label>
                              <DatePickerField value={kurdishCertGroupFields.date} onChange={(v) => setKurdishCertGroupFields(prev => ({ ...prev, date: v }))} onDayOfWeek={(day) => setKurdishCertGroupFields(prev => ({ ...prev, dayOfWeek: day }))} />
                            </div>
                            <div className="md:col-span-2">
                              <Label>وەسفی چاڵاکی (Activity Description)</Label>
                              <Input
                                value={kurdishCertGroupFields.activityDescription}
                                onChange={(e) => setKurdishCertGroupFields(prev => ({ ...prev, activityDescription: e.target.value }))}
                                placeholder="نموونە: چاڵاکی بەربانگکردنەوە بۆ خوێندکارانی بەشەناوخۆییەکانی"
                              />
                            </div>
                            <div>
                              <Label>ناوی دامەزراوە (Institution Name)</Label>
                              <Input
                                value={kurdishCertGroupFields.institutionName}
                                onChange={(e) => setKurdishCertGroupFields(prev => ({ ...prev, institutionName: e.target.value }))}
                                placeholder="نموونە: زانکۆی سلێمانی"
                              />
                            </div>
                            <div>
                              <Label>ناوی رێکخراوی پێدەر (Giving Organization)</Label>
                              <Input
                                value={kurdishCertGroupFields.givingOrganization}
                                onChange={(e) => setKurdishCertGroupFields(prev => ({ ...prev, givingOrganization: e.target.value }))}
                                placeholder="نموونە: رێکخراوی مرۆڤدۆستان"
                              />
                            </div>
                            <div>
                              <Label>کۆمەڵی وەرگر (Recipient Group)</Label>
                              <Input
                                value={kurdishCertGroupFields.recipientGroup}
                                onChange={(e) => setKurdishCertGroupFields(prev => ({ ...prev, recipientGroup: e.target.value }))}
                                placeholder="نموونە: خۆبەخشانی مرۆڤدۆستان"
                              />
                            </div>
                            <div>
                              <Label>شار یان پارێزگا (City or Province)</Label>
                              <Input
                                value={kurdishCertGroupFields.cityOrProvince}
                                onChange={(e) => setKurdishCertGroupFields(prev => ({ ...prev, cityOrProvince: e.target.value }))}
                                placeholder="نموونە: پارێزگای سلێمانی"
                              />
                            </div>
                          </div>
                          <div className="pt-4 space-y-2">
                            <Button 
                              onClick={() => {
                                const { title, content } = generateKurdishCertGroupContent();
                                setEditableContent({ title, content });
                                setEditContentType('news');
                                setEditMode(true);
                              }}
                              variant="outline"
                              className="w-full"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit & Write Freely
                            </Button>
                            <Button 
                              onClick={handleCreateNewsFromTemplate}
                              disabled={createNews.isPending}
                              className="w-full"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              {createNews.isPending ? 'Creating...' : 'Create News Article'}
                            </Button>
                          </div>
                        </div>
                      )}

                      {newNewsForm.category === 'KurdishCertIndividual' && (
                        <div className="space-y-4">
                          <div className="bg-purple-50 p-4 rounded-lg mb-4">
                            <p className="text-sm text-purple-800 font-medium">سوپاس بۆ تاک - Certificate for Individual</p>
                            <p className="text-xs text-purple-600 mt-1">For giving a certificate to a specific person</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>ڕۆژی هەفتە (Day of Week)</Label>
                              <DayOfWeekSelect value={kurdishCertIndividualFields.dayOfWeek} onChange={(v) => setKurdishCertIndividualFields(prev => ({ ...prev, dayOfWeek: v }))} />
                            </div>
                            <div>
                              <Label>بەروار (Date)</Label>
                              <DatePickerField value={kurdishCertIndividualFields.date} onChange={(v) => setKurdishCertIndividualFields(prev => ({ ...prev, date: v }))} onDayOfWeek={(day) => setKurdishCertIndividualFields(prev => ({ ...prev, dayOfWeek: day }))} />
                            </div>
                            <div className="md:col-span-2">
                              <Label>وەسفی خزمەتگوزاری (Service Description)</Label>
                              <Textarea
                                value={kurdishCertIndividualFields.serviceDescription}
                                onChange={(e) => setKurdishCertIndividualFields(prev => ({ ...prev, serviceDescription: e.target.value }))}
                                placeholder="نموونە: چارەسەری نەخۆشانی هەژار و بێ باوکان"
                                rows={2}
                              />
                            </div>
                            <div>
                              <Label>ناوی رێکخراوی پێدەر (Giving Organization)</Label>
                              <Input
                                value={kurdishCertIndividualFields.givingOrganization}
                                onChange={(e) => setKurdishCertIndividualFields(prev => ({ ...prev, givingOrganization: e.target.value }))}
                                placeholder="نموونە: رێکخراوی مرۆڤدۆستان"
                              />
                            </div>
                            <div>
                              <Label>ناوی کەسی وەرگر (Recipient Name)</Label>
                              <Input
                                value={kurdishCertIndividualFields.recipientName}
                                onChange={(e) => setKurdishCertIndividualFields(prev => ({ ...prev, recipientName: e.target.value }))}
                                placeholder="نموونە: ئەرسەلان شەم"
                              />
                            </div>
                            <div>
                              <Label>پێوانە (Title - Optional)</Label>
                              <Input
                                value={kurdishCertIndividualFields.recipientTitle}
                                onChange={(e) => setKurdishCertIndividualFields(prev => ({ ...prev, recipientTitle: e.target.value }))}
                                placeholder="نموونە: دکتۆر"
                              />
                            </div>
                          </div>
                          <div className="pt-4 space-y-2">
                            <Button 
                              onClick={() => {
                                const { title, content } = generateKurdishCertIndividualContent();
                                setEditableContent({ title, content });
                                setEditContentType('news');
                                setEditMode(true);
                              }}
                              variant="outline"
                              className="w-full"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit & Write Freely
                            </Button>
                            <Button 
                              onClick={handleCreateNewsFromTemplate}
                              disabled={createNews.isPending}
                              className="w-full"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              {createNews.isPending ? 'Creating...' : 'Create News Article'}
                            </Button>
                          </div>
                        </div>
                      )}

                      {newNewsForm.category === 'SardaniFrami' && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>ڕۆژی هەفتە (Day of Week)</Label>
                              <DayOfWeekSelect value={kurdishTemplateFields.dayOfWeek} onChange={(v) => setKurdishTemplateFields(prev => ({ ...prev, dayOfWeek: v }))} />
                            </div>
                            <div>
                              <Label>بەروار (Date)</Label>
                              <DatePickerField value={kurdishTemplateFields.date} onChange={(v) => setKurdishTemplateFields(prev => ({ ...prev, date: v }))} onDayOfWeek={(day) => setKurdishTemplateFields(prev => ({ ...prev, dayOfWeek: day }))} />
                            </div>
                          </div>
                          <div>
                            <Label>ناوی تۆڕ یان ڕێکخراو (Network or Org Name)</Label>
                            <Input value={kurdishTemplateFields.networkOrOrg} onChange={(e) => setKurdishTemplateFields(prev => ({ ...prev, networkOrOrg: e.target.value }))} />
                          </div>
                          <div>
                            <Label>شوێنی سەردان - شار (Visited Place - City)</Label>
                            <Input value={kurdishTemplateFields.visitedPlaceCity} onChange={(e) => setKurdishTemplateFields(prev => ({ ...prev, visitedPlaceCity: e.target.value }))} />
                          </div>
                          <div>
                            <Label>ناوی ڕێکخراو یان دامەزراوەی سەردانکار (Visiting Org)</Label>
                            <Input value={kurdishTemplateFields.visitingOrg} onChange={(e) => setKurdishTemplateFields(prev => ({ ...prev, visitingOrg: e.target.value }))} />
                          </div>
                          <div>
                            <Label>ناوی شوێن یان بەڕێوەبەری سەردانکراو (Visited Entity/Person)</Label>
                            <Input value={kurdishTemplateFields.visitedEntity} onChange={(e) => setKurdishTemplateFields(prev => ({ ...prev, visitedEntity: e.target.value }))} />
                          </div>
                          <div>
                            <Label>ناوی کەسە سەردانکار و پێوانەکەی (Visitor Name & Title)</Label>
                            <Input value={kurdishTemplateFields.visitorNameAndTitle} onChange={(e) => setKurdishTemplateFields(prev => ({ ...prev, visitorNameAndTitle: e.target.value }))} />
                          </div>
                          <div>
                            <Label>وەسفکردنی سەردان (Visit Purpose)</Label>
                            <Textarea value={kurdishTemplateFields.visitPurpose} onChange={(e) => setKurdishTemplateFields(prev => ({ ...prev, visitPurpose: e.target.value }))} />
                          </div>
                          <div className="pt-4 space-y-2">
                            <Button 
                              onClick={handleEditKurdishContent}
                              variant="outline"
                              className="w-full"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit & Write Freely
                            </Button>
                            <Button 
                              onClick={handleCreateNewsFromTemplate}
                              disabled={createNews.isPending}
                              className="w-full"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              {createNews.isPending ? 'Creating...' : 'Create News Article'}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Category Dropdown */}
            <div className="mb-6">
              <Label htmlFor="news-category-select" className="text-lg font-semibold mb-3 block">
                View All News Items:
              </Label>
              <div className="flex gap-2">
                <Button 
                  variant={selectedNewsCategory === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedNewsCategory('all')}
                  className="flex items-center gap-2"
                >
                  📰 Show All News
                </Button>
                <div className="text-sm text-gray-500 flex items-center ml-4">
                  Total: {Array.isArray(news) ? news.length : 0} items
                </div>
              </div>
            </div>

            {/* News Cards Display */}
            {selectedNewsCategory && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {(Array.isArray(news) ? news : [])
                  .map(item => {
                    const itemId = String(item.id);
                    return (
                    <Card 
                      key={itemId}
                      className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <CardContent className="p-6">
                        {/* Edit and Delete Buttons */}
                        <div className="absolute top-4 right-4 flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            onClick={() => setEditingPost({ kind: 'news', item })}
                            title="Edit this post"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            onClick={() => handleDeleteNewsItem(itemId)}
                            disabled={deleteNews.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Image */}
                        {resolveImage(item.imageUrl) && (
                          <img
                            src={resolveImage(item.imageUrl) ?? undefined}
                            alt=""
                            className="w-full h-40 object-cover rounded-xl mb-4"
                          />
                        )}

                        {/* Date + category */}
                        <div className="mb-4 flex flex-wrap gap-2 pr-16">
                          <Badge
                            variant="secondary"
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {new Date(item.createdAt).toLocaleDateString()}
                          </Badge>
                          {item.category && (
                            <Badge variant="outline" className="text-xs font-medium">{item.category}</Badge>
                          )}
                        </div>

                        {/* Title */}
                        <CardHeader className="p-0 mb-4">
                          <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2">
                            {item.title}
                          </CardTitle>
                        </CardHeader>

                        {/* Content */}
                        <div className="text-gray-700 leading-relaxed">
                          <pre className="whitespace-pre-line font-sans line-clamp-6">{item.content}</pre>
                        </div>

                        {/* Category Badge */}
                        <div className="mt-6 pt-4 border-t border-gray-100">
                          <Badge variant="outline" className="text-xs font-medium">
                            Created: {new Date(item.createdAt).toLocaleDateString()}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                  })}
              </div>
            )}

            {/* Empty State */}
            {selectedNewsCategory && (Array.isArray(news) ? news : []).length === 0 && (
              <Card className="text-center py-12 bg-gray-50">
                <CardContent>
                  <div className="text-gray-500 text-lg mb-4">
                    No news items found in the database.
                  </div>
                  <div className="text-sm text-gray-400">
                    Use the form above to create your first news item.
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            {!selectedNewsCategory && (
              <Card className="text-center py-12 bg-white shadow-sm">
                <CardContent>
                  <div className="text-gray-500 text-lg mb-4">
                    Please select a category from the dropdown above to view news items.
                  </div>
                  <div className="text-sm text-gray-400">
                    Available categories: Place Visited, Visitors, Certificate Awarded, Certificate Received
                  </div>
                </CardContent>
              </Card>
            )}
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

export default NewsTab;
