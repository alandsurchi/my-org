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



const HomeTab = () => {
  const { toast } = useToast();
  const { data: heroImage } = useHeroImage();
  const { data: aboutImage } = useAboutImage();
  const uploadHeroImage = useUploadHeroImage();
  const uploadAboutImage = useUploadAboutImage();
  // Crop dialog states
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>('');
  const [cropImageType, setCropImageType] = useState<'hero' | 'about'>('hero');
  // Hero image state
  const [heroFile, setHeroFile] = useState<File | null>(null);
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
        : `${config.apiUrl.replace(/\/api$/, '')}${heroImage.url}`;
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
        : `${config.apiUrl.replace(/\/api$/, '')}${aboutImage.url}`;
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

  return (
    <>
      <TabsContent value="home" className="space-y-6">
        <AnalyticsCard />
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
                  <img                         src={heroImage.url?.startsWith('http') ? heroImage.url : `${config.apiUrl.replace(/\/api$/, '')}${heroImage.url}`}
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
                  <img                         src={aboutImage.url?.startsWith('http') ? aboutImage.url : `${config.apiUrl.replace(/\/api$/, '')}${aboutImage.url}`}
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
      <ImageCropDialog
        open={cropDialogOpen}
        onClose={() => setCropDialogOpen(false)}
        imageSrc={imageToCrop}
        onCropComplete={handleCropComplete}
        aspectRatio={16 / 9}
      />
    </>
  );
};

export default HomeTab;
