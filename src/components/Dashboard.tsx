import React, { useState } from 'react';
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
import { useGallery, useCreateGalleryItem, useDeleteGalleryItem } from '@/hooks/useGallery';
import { useWebsiteImages, useCreateWebsiteImage, useDeleteWebsiteImage } from '@/hooks/useWebsiteImages';
import { useStaffAccounts, useCreateStaffAccount, useDeleteStaffAccount, useCurrentUser, useUpdateStaffAccount } from '@/hooks/useStaffAccounts';
import { useHeroImage, useUploadHeroImage } from '@/hooks/useHeroAPI';
import { useAboutImage, useUploadAboutImage } from '@/hooks/useAboutAPI';
import { useFileUpload } from '@/hooks/useFileUpload';
import WebsiteImageManager from './WebsiteImageManager';
import ImageCropDialog from './ImageCropDialog';
import ImageCropper from './ImageCropper';

interface DashboardProps {
  userType: 'client' | 'staff';
  userName: string;
}

const Dashboard = ({ userType, userName }: DashboardProps) => {
  const { toast } = useToast();
  const { logout, staffUser } = useStaffAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileUploadMutation = useFileUpload();

  // Real data from Supabase
  const { data: news = [] } = useNews();
  const { data: projects = [] } = useProjects() as { data: any[] };
  const { data: galleryItems = [] } = useGallery();
  const { data: websiteImages = [] } = useWebsiteImages();
  const { data: staffAccounts = [] } = useStaffAccounts();
  const { data: heroImage } = useHeroImage();
  const { data: aboutImage } = useAboutImage();
  
  // Use staffUser from auth context for super admin check
  const isSuperAdmin = staffUser?.isSuperAdmin || false;

  // Mutations
  const createGalleryItem = useCreateGalleryItem();
  const deleteGalleryItem = useDeleteGalleryItem();
  const uploadHeroImage = useUploadHeroImage();
  const uploadAboutImage = useUploadAboutImage();
  const createWebsiteImage = useCreateWebsiteImage();
  const deleteWebsiteImage = useDeleteWebsiteImage();
  const createStaffAccount = useCreateStaffAccount();
  const deleteStaffAccount = useDeleteStaffAccount();
  const createNews = useCreateNews();
  const deleteNews = useDeleteNews();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
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

  // Crop dialog states
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>('');
  const [cropImageType, setCropImageType] = useState<'hero' | 'about'>('hero');

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

  // Hero image state
  const [heroFile, setHeroFile] = useState<File | null>(null);

  // News and Project image states
  const [newsImageFile, setNewsImageFile] = useState<File | null>(null);
  const [projectImageFile, setProjectImageFile] = useState<File | null>(null);

  // Image cropper states
  const [cropperImage, setCropperImage] = useState<string | null>(null);
  const [cropperType, setCropperType] = useState<'news' | 'project' | 'hero' | 'gallery' | null>(null);
  const [cropperFileName, setCropperFileName] = useState<string>('');

  // Dynamic News Section state
  const [selectedNewsCategory, setSelectedNewsCategory] = useState('');
  const [editingNewsItem, setEditingNewsItem] = useState<string | null>(null);
  const [tempNewsData, setTempNewsData] = useState({
    date: '',
    title: '',
    content: ''
  });

  // Projects section state
  const [showAllProjects, setShowAllProjects] = useState(false);

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

  // Pre-populated news data with exact content as specified
  // Note:
  const sampleNewsTemplates = [
    {
      id: 'place-visited-1',
      category: 'Place Visited',
      date: 'Wednesday - 25/01/2023',
      title: 'President of Organizations Network - Halabja / Directorate of Women and Children Welfare - Erbil',
      content: `The President of (Humanitarian Organization) paid a visit to the honorable (Asi Fayek), President of the Organizations Network, offering congratulations on his new position in martyr Halabja.

At the same time, a delegation from (Humanitarian Organization) visited the (Directorate of Women and Children Welfare - Erbil), where they were welcomed by the honorable (Taib Abdul Aziz Ahmad). These visits served both as gestures of goodwill and as opportunities to discuss future projects with children and students of the welfare center.`
    },
    {
      id: 'visitors-1',
      category: 'Visitors',
      date: 'Wednesday - 25/01/2023',
      title: 'Dr. Didar Sadiq - Eye Diseases Specialist',
      content: `The honorable (Dr. Didar Sadiq), specialist in eye diseases, visited the (Humanitarian Organization), where he was welcomed by the President of the Organization. This visit was for the purpose of discussing increased assistance for poor and underprivileged patients.`
    },
    {
      id: 'certificate-awarded-1',
      category: 'Certificate Awarded',
      date: 'Thursday - 09/06/2022',
      title: 'Humanitarian Volunteers - University of Sulaymaniyah / Dr. Arsalan Sham',
      content: `In recognition of the volunteer work in awareness-raising activities for students of the internal departments of (University of Sulaymaniyah), as well as the dedicated efforts of (Dr. Arsalan Sham) in providing assistance and treatment for poor patients and orphans, the (Humanitarian Organization) extended its sincere thanks and appreciation. Both the volunteers and Dr. Sham are acknowledged for their humanitarian contributions, and we wish them continued success and honor.`
    },
    {
      id: 'certificate-received-1',
      category: 'Certificate Received',
      date: 'Saturday - 04/06/2022',
      title: 'Al-Azhar Institute in Erbil',
      content: `A delegation from (Al-Azhar Institute in Erbil) visited the (Humanitarian Organization). This visit was for the purpose of offering thanks and appreciation to the organization, in recognition of the assistance provided to the students of the internal departments of Al-Azhar Institute.`
    }
  ];

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

  const handleHeroImageAdjust = () => {
    if (heroImage?.url) {
      const fullUrl = heroImage.url.startsWith('http') 
        ? heroImage.url 
        : `http://localhost:5000${heroImage.url}`;
      setImageToCrop(fullUrl);
      setCropImageType('hero');
      setCropDialogOpen(true);
    }
  };

  const handleAboutImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await uploadAboutImage.mutateAsync(file);
        toast({
          title: "About image updated",
          description: "The about section image has been updated successfully.",
        });
        // Reset the file input
        event.target.value = '';
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "Failed to update about image. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleAboutImageAdjust = () => {
    if (aboutImage?.url) {
      const fullUrl = aboutImage.url.startsWith('http') 
        ? aboutImage.url 
        : `http://localhost:5000${aboutImage.url}`;
      setImageToCrop(fullUrl);
      setCropImageType('about');
      setCropDialogOpen(true);
    }
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    try {
      // Convert blob to file
      const file = new File([croppedImageBlob], `cropped-${cropImageType}.jpg`, {
        type: 'image/jpeg',
      });

      if (cropImageType === 'hero') {
        await uploadHeroImage.mutateAsync(file);
        toast({
          title: "Hero image updated",
          description: "The hero image has been cropped and updated successfully.",
        });
      } else {
        await uploadAboutImage.mutateAsync(file);
        toast({
          title: "About image updated",
          description: "The about image has been cropped and updated successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to save the cropped image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      for (const file of Array.from(files)) {
        const result = await fileUploadMutation.mutateAsync(file);
        if (result?.url) {
          await createWebsiteImage.mutateAsync({
            category: 'website',
            image_url: result.url,
            alt_text: file.name.replace(/\.[^/.]+$/, ""),
            is_active: true
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
    
    // Validate inputs
    if (!galleryForm.title || !galleryForm.description) {
      toast({
        title: "Missing Information",
        description: "Please enter both title and description before uploading photos.",
        variant: "destructive"
      });
      event.target.value = ''; // Reset file input
      return;
    }

    if (!files || files.length === 0) {
      return;
    }

    try {
      let successCount = 0;
      
      for (const file of Array.from(files)) {
        try {
          console.log('Uploading file:', file.name);
          
          // Create FormData with file and metadata
          const formData = new FormData();
          formData.append('photo', file); // Backend expects 'photo' field name
          formData.append('title', galleryForm.title);
          formData.append('description', galleryForm.description);
          
          // Upload directly to backend
          const response = await fetch('http://localhost:5000/api/gallery', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Upload failed:', errorText);
            throw new Error(`Upload failed: ${response.statusText}`);
          }

          const data = await response.json();
          console.log('Gallery item created:', data);
          successCount++;
        } catch (fileError) {
          console.error('Error uploading file:', file.name, fileError);
          toast({
            title: "Upload Failed",
            description: `Failed to upload ${file.name}. Please try again.`,
            variant: "destructive"
          });
        }
      }

      if (successCount > 0) {
        setGalleryForm({ title: '', description: '' });
        
        // Invalidate gallery query to refresh the list
        await queryClient.invalidateQueries({ queryKey: ['gallery'] });
        
        toast({
          title: "✅ Success!",
          description: `${successCount} photo(s) uploaded successfully!`,
        });
      }
      
      // Reset the file input
      event.target.value = '';
    } catch (error) {
      console.error('Gallery upload error:', error);
      toast({
        title: "Upload Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
      event.target.value = '';
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
          role: newStaffForm.role as 'super_admin' | 'admin',
          password: newStaffForm.password
        });
        setNewStaffForm({ name: '', email: '', role: '', password: '' });
        toast({
          title: "✅ Staff member added",
          description: `${newStaffForm.name} has been added successfully as ${newStaffForm.role === 'super_admin' ? 'Full Control' : 'Admin'}.`,
        });
      } catch (error) {
        console.error('Error adding staff member:', error);
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

  const handleEditStaffMember = (member: any) => {
    setEditStaffForm({
      id: member.id || member._id,
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
        const updateData: any = {
          name: editStaffForm.name,
          email: editStaffForm.email,
          role: editStaffForm.role
        };
        
        // Only include password if it was changed
        if (editStaffForm.password && editStaffForm.password.length >= 6) {
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
        console.error('Error updating staff member:', error);
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

  // Backend news editing handlers
  const handleCancelEdit = () => {
    setEditingNewsItem(null);
    setTempNewsData({ date: '', title: '', content: '' });
  };

  const handleEditBackendNewsItem = (item: any) => {
    if (editingNewsItem) {
      handleCancelEdit();
    }
    
    const itemId = item._id || item.id;
    setEditingNewsItem(itemId);
    setTempNewsData({
      date: item.date || new Date(item.createdAt).toLocaleDateString(),
      title: item.title_en || item.title,
      content: item.description_en || item.content
    });
  };

  const handleSaveBackendNewsItem = async (item: any) => {
    const itemId = item._id || item.id;
    try {
      // Create a new updated item (since we don't have an update API, we'll create new and delete old)
      await createNews.mutateAsync({
        title: tempNewsData.title,
        content: tempNewsData.content
      });
      
      // Delete the old item
      await deleteNews.mutateAsync(itemId);
      
      setEditingNewsItem(null);
      setTempNewsData({ date: '', title: '', content: '' });
      
      toast({
        title: "News Updated",
        description: "The news item has been successfully updated.",
      });
    } catch (error) {
      console.error('❌ Dashboard: Update error:', error);
      toast({
        title: "Error", 
        description: `Failed to update news item: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
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

  const generateContentFromTemplate = (category: string, fields: any, date: string) => {
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
      console.log('🗑️ Dashboard: Attempting to delete news with ID:', itemId);
      await deleteNews.mutateAsync(itemId);
      
      if (editingNewsItem === itemId) {
        setEditingNewsItem(null);
        setTempNewsData({ date: '', title: '', content: '' });
      }

      toast({
        title: "News Deleted",
        description: "The news item has been deleted successfully.",
      });
    } catch (error) {
      console.error('❌ Dashboard: Delete error:', error);
      toast({
        title: "Error",
        description: `Failed to delete news item: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    }
  };

  // Function to populate database with sample data
  const populateSampleData = async () => {
    try {
      for (const template of sampleNewsTemplates) {
        await createNews.mutateAsync({
          title: template.title,
          content: template.content
        });
      }

      toast({
        title: "Sample Data Added",
        description: "All sample news items have been added to the database.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add sample data. Some items may already exist.",
        variant: "destructive"
      });
    }
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="home">پەرەی سەرەکی</TabsTrigger>
            <TabsTrigger value="projects">چاڵاکیەکان</TabsTrigger>
            <TabsTrigger value="news">هەواڵەکان</TabsTrigger>
            <TabsTrigger value="gallery">وێنەکان</TabsTrigger>
            <TabsTrigger value="staff">ستاف</TabsTrigger>
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
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Current Hero Image</h3>
                      <Button 
                        onClick={handleHeroImageAdjust}
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Adjust Image
                      </Button>
                    </div>
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

            {/* About Section Image Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  About Section Image Management
                </CardTitle>
                <CardDescription>
                  Upload and manage the image displayed in the About section
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current About Image Display */}
                {aboutImage && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Current About Image</h3>
                      <Button 
                        onClick={handleAboutImageAdjust}
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Adjust Image
                      </Button>
                    </div>
                    <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={aboutImage.url?.startsWith('http') ? aboutImage.url : `http://localhost:5000${aboutImage.url}`}
                        alt="Current about image"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    {aboutImage.originalName && (
                      <div className="text-sm text-gray-600">
                        <p><strong>File:</strong> {aboutImage.originalName}</p>
                        {aboutImage.fileSize && (
                          <p><strong>Size:</strong> {(aboutImage.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                        )}
                        {aboutImage.dimensions && (
                          <p><strong>Dimensions:</strong> {aboutImage.dimensions.width} × {aboutImage.dimensions.height} pixels</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Upload New About Image */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    {aboutImage ? 'Replace About Image' : 'Upload About Image'}
                  </h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Heart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <div className="space-y-2">
                      <p className="text-lg font-medium">Upload About Section Image</p>
                      <p className="text-gray-500">Choose an image that represents your community work</p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleAboutImageUpload}
                        className="max-w-xs mx-auto cursor-pointer"
                        disabled={uploadAboutImage.isPending}
                      />
                      {uploadAboutImage.isPending && (
                        <p className="text-sm text-blue-600">Uploading...</p>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p><strong>Recommended:</strong> High-quality images showing community activities</p>
                    <p><strong>Formats:</strong> JPG, PNG, WebP</p>
                    <p><strong>Max size:</strong> 10MB</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery" className="space-y-6">
            {/* Upload New Photo Card */}
            <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 border-2 border-purple-200 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  Upload New Photo
                </CardTitle>
                <CardDescription className="text-base">Add beautiful images to your gallery with descriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="galleryTitle" className="text-base font-semibold">Photo Title</Label>
                      <Input 
                        id="galleryTitle" 
                        placeholder="Enter a descriptive title..."
                        value={galleryForm.title}
                        onChange={(e) => setGalleryForm({...galleryForm, title: e.target.value})}
                        className="h-12 text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="galleryDescription" className="text-base font-semibold">Description</Label>
                      <Input 
                        id="galleryDescription" 
                        placeholder="Enter a brief description..."
                        value={galleryForm.description}
                        onChange={(e) => setGalleryForm({...galleryForm, description: e.target.value})}
                        className="h-12 text-base"
                      />
                    </div>
                  </div>

                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-purple-300 rounded-2xl p-8 bg-white/50 hover:bg-white/80 transition-all duration-300">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                        <Upload className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <Label htmlFor="galleryImages" className="cursor-pointer">
                          <div className="text-lg font-semibold text-purple-600 hover:text-purple-700">
                            Click to upload or drag and drop
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            PNG, JPG, GIF up to 10MB
                          </div>
                        </Label>
                        <Input 
                          id="galleryImages" 
                          type="file" 
                          multiple 
                          accept="image/*" 
                          onChange={handleGalleryUpload}
                          className="hidden"
                          disabled={fileUploadMutation.isPending || createGalleryItem.isPending}
                        />
                      </div>
                      {(fileUploadMutation.isPending || createGalleryItem.isPending) && (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-3 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-sm text-purple-600 font-medium">Uploading photos...</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gallery Grid */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Gallery Photos</CardTitle>
                    <CardDescription className="text-base">
                      {galleryItems.length} {galleryItems.length === 1 ? 'photo' : 'photos'} in your gallery
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {galleryItems.length} Photos
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {galleryItems.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50 rounded-2xl">
                    <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4">
                      <Upload className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No photos yet</h3>
                    <p className="text-gray-500 mb-6">Upload your first photo to get started!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryItems.map((item) => (
                      <div 
                        key={item.id} 
                        className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                      >
                        {/* Image */}
                        <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                          <img 
                            src={item.image_url || '/placeholder.svg'} 
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder.svg';
                            }}
                          />
                        </div>

                        {/* Info Overlay */}
                        <div className="p-4 bg-white">
                          <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {item.description}
                          </p>
                        </div>

                        {/* Hover Actions */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                          <div className="flex gap-3">
                            <Button 
                              size="lg" 
                              variant="secondary"
                              className="rounded-full w-14 h-14 shadow-xl hover:scale-110 transition-transform"
                            >
                              <Edit className="w-6 h-6" />
                            </Button>
                            <Button 
                              size="lg" 
                              variant="destructive"
                              className="rounded-full w-14 h-14 shadow-xl hover:scale-110 transition-transform"
                              onClick={() => handleDeleteGalleryItem(item.id)}
                              disabled={deleteGalleryItem.isPending}
                            >
                              <Trash2 className="w-6 h-6" />
                            </Button>
                          </div>
                        </div>

                        {/* Corner Badge */}
                        <div className="absolute top-3 right-3 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                          New
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

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
                                  <Input
                                    value={kurdishVisitorsFields.dayOfWeek}
                                    onChange={(e) => setKurdishVisitorsFields(prev => ({ ...prev, dayOfWeek: e.target.value }))}
                                    placeholder="نموونە: چوار شەممە"
                                  />
                                </div>
                                <div>
                                  <Label>بەروار (Date)</Label>
                                  <Input
                                    value={kurdishVisitorsFields.date}
                                    onChange={(e) => setKurdishVisitorsFields(prev => ({ ...prev, date: e.target.value }))}
                                    placeholder="نموونە: 25/01/2023"
                                  />
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
                                  <Input
                                    value={kurdishCertificateFields.dayOfWeek}
                                    onChange={(e) => setKurdishCertificateFields(prev => ({ ...prev, dayOfWeek: e.target.value }))}
                                    placeholder="نموونە: شەممە"
                                  />
                                </div>
                                <div>
                                  <Label>بەروار (Date)</Label>
                                  <Input
                                    value={kurdishCertificateFields.date}
                                    onChange={(e) => setKurdishCertificateFields(prev => ({ ...prev, date: e.target.value }))}
                                    placeholder="نموونە: 04/06/2022"
                                  />
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
                                  <Input
                                    value={kurdishCertGroupFields.dayOfWeek}
                                    onChange={(e) => setKurdishCertGroupFields(prev => ({ ...prev, dayOfWeek: e.target.value }))}
                                    placeholder="نموونە: شەممە"
                                  />
                                </div>
                                <div>
                                  <Label>بەروار (Date)</Label>
                                  <Input
                                    value={kurdishCertGroupFields.date}
                                    onChange={(e) => setKurdishCertGroupFields(prev => ({ ...prev, date: e.target.value }))}
                                    placeholder="نموونە: 15/03/2023"
                                  />
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
                                  <Input
                                    value={kurdishCertIndividualFields.dayOfWeek}
                                    onChange={(e) => setKurdishCertIndividualFields(prev => ({ ...prev, dayOfWeek: e.target.value }))}
                                    placeholder="نموونە: یەک شەممە"
                                  />
                                </div>
                                <div>
                                  <Label>بەروار (Date)</Label>
                                  <Input
                                    value={kurdishCertIndividualFields.date}
                                    onChange={(e) => setKurdishCertIndividualFields(prev => ({ ...prev, date: e.target.value }))}
                                    placeholder="نموونە: 20/04/2023"
                                  />
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
                                  <Input value={kurdishTemplateFields.dayOfWeek} onChange={(e) => setKurdishTemplateFields(prev => ({ ...prev, dayOfWeek: e.target.value }))} />
                                </div>
                                <div>
                                  <Label>بەروار (Date)</Label>
                                  <Input value={kurdishTemplateFields.date} onChange={(e) => setKurdishTemplateFields(prev => ({ ...prev, date: e.target.value }))} />
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
                        const itemId = item._id || item.id;
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
                                onClick={() => handleEditBackendNewsItem(item)}
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

                            {/* Date Badge */}
                            <div className="mb-4">
                              <Badge 
                                variant="secondary" 
                                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium"
                              >
                                {editingNewsItem === itemId ? (
                                  <Input
                                    value={tempNewsData.date || item.date || new Date(item.createdAt).toLocaleDateString()}
                                    onChange={(e) => setTempNewsData({...tempNewsData, date: e.target.value})}
                                    className="w-full bg-white text-gray-900 text-xs"
                                    placeholder="Enter date..."
                                  />
                                ) : (
                                  item.date || new Date(item.createdAt).toLocaleDateString()
                                )}
                              </Badge>
                            </div>

                            {/* Title */}
                            <CardHeader className="p-0 mb-4">
                              <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2 pr-16">
                                {editingNewsItem === itemId ? (
                                  <Input
                                    value={tempNewsData.title || item.title}
                                    onChange={(e) => setTempNewsData({...tempNewsData, title: e.target.value})}
                                    className="w-full text-lg font-bold"
                                    placeholder="Enter title..."
                                  />
                                ) : (
                                  item.title
                                )}
                              </CardTitle>
                            </CardHeader>

                            {/* Content */}
                            <div className="text-gray-700 leading-relaxed">
                              {editingNewsItem === itemId ? (
                                <Textarea
                                  value={tempNewsData.content || item.content}
                                  onChange={(e) => setTempNewsData({...tempNewsData, content: e.target.value})}
                                  className="w-full min-h-[120px] resize-none"
                                  placeholder="Enter content..."
                                />
                              ) : (
                                <pre className="whitespace-pre-line font-sans">{item.content}</pre>
                              )}
                            </div>

                            {/* Edit Controls */}
                            {editingNewsItem === itemId && (
                              <div className="flex gap-2 mt-4">
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => handleSaveBackendNewsItem(item)}
                                  disabled={createNews.isPending}
                                >
                                  {createNews.isPending ? 'Saving...' : 'Save'}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={handleCancelEdit}
                                >
                                  Cancel
                                </Button>
                              </div>
                            )}

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
                        Use the form above to create your first news item, or click "Add Sample Data" to populate with examples.
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
                                <Input
                                  value={kurdishProvisionFields.dayOfWeek}
                                  onChange={(e) => setKurdishProvisionFields(prev => ({ ...prev, dayOfWeek: e.target.value }))}
                                  placeholder="نموونە: شەممە"
                                />
                              </div>
                              <div>
                                <Label>بەروار (Date)</Label>
                                <Input
                                  value={kurdishProvisionFields.date}
                                  onChange={(e) => setKurdishProvisionFields(prev => ({ ...prev, date: e.target.value }))}
                                  placeholder="نموونە: 02/08/2025"
                                />
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
                                <Input
                                  value={kurdishDistributionFields.dayOfWeek}
                                  onChange={(e) => setKurdishDistributionFields(prev => ({ ...prev, dayOfWeek: e.target.value }))}
                                  placeholder="نموونە: سێ شەممە"
                                />
                              </div>
                              <div>
                                <Label>بەروار (Date)</Label>
                                <Input
                                  value={kurdishDistributionFields.date}
                                  onChange={(e) => setKurdishDistributionFields(prev => ({ ...prev, date: e.target.value }))}
                                  placeholder="نموونە: 29/07/2025"
                                />
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
                                <Input
                                  value={kurdishRenovationFields.dayOfWeek}
                                  onChange={(e) => setKurdishRenovationFields(prev => ({ ...prev, dayOfWeek: e.target.value }))}
                                  placeholder="نموونە: شەممە"
                                />
                              </div>
                              <div>
                                <Label>بەروار (Date)</Label>
                                <Input
                                  value={kurdishRenovationFields.date}
                                  onChange={(e) => setKurdishRenovationFields(prev => ({ ...prev, date: e.target.value }))}
                                  placeholder="نموونە: 11/10/2025"
                                />
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
                                <Input
                                  value={kurdishBuildingFields.dayOfWeek}
                                  onChange={(e) => setKurdishBuildingFields(prev => ({ ...prev, dayOfWeek: e.target.value }))}
                                  placeholder="نموونە: شەممە"
                                />
                              </div>
                              <div>
                                <Label>بەروار (Date)</Label>
                                <Input
                                  value={kurdishBuildingFields.date}
                                  onChange={(e) => setKurdishBuildingFields(prev => ({ ...prev, date: e.target.value }))}
                                  placeholder="نموونە: 11/10/2025"
                                />
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
                          const projectId = project._id || project.id;
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

                                {/* Status Badge */}
                                <div className="mb-4">
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

          <TabsContent value="staff" className="space-y-6">
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
                            {isSuperAdmin && !member.isSuperAdmin && (
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
                            {member.isSuperAdmin && (
                              <Badge variant="outline" className="text-xs text-gray-400">
                                Protected
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
        </Tabs>
      </div>

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

      {/* Image Crop Dialog */}
      <ImageCropDialog
        open={cropDialogOpen}
        onClose={() => setCropDialogOpen(false)}
        imageSrc={imageToCrop}
        onCropComplete={handleCropComplete}
        aspectRatio={16 / 9}
      />

      {/* New Image Cropper for News/Projects */}
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
    </div>
  );
};

export default Dashboard;
