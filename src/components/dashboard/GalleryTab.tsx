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



const GalleryTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileUploadMutation = useFileUpload();
  const { data: galleryItems = [] } = useGallery();
  // Mutations
  const createGalleryItem = useUploadGalleryPhoto();
  const deleteGalleryItem = useDeletePhoto();
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    description: ''
  });
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
          
          // Create FormData with file and metadata
          const formData = new FormData();
          formData.append('photo', file); // Backend expects 'photo' field name
          formData.append('title', galleryForm.title);
          formData.append('description', galleryForm.description);
          
          // Upload directly to backend
          const authToken = localStorage.getItem('authToken') || localStorage.getItem('auth_token') || '';
          const response = await fetch(`${config.apiUrl}/gallery`, {
            method: 'POST',
            headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {},
            body: formData,
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Upload failed: ${response.statusText}`);
          }

          const data = await response.json();
          successCount++;
        } catch (fileError) {
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

  return (
    <>
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
                        src={item.url || '/placeholder.svg'}
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
    </>
  );
};

export default GalleryTab;
