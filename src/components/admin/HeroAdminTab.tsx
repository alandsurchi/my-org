import React, { useState } from 'react';
import { Image as ImageIcon, Upload, Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useHeroImage, useUploadHeroImage } from '@/hooks/useHeroAPI';
import { useToast } from '@/hooks/use-toast';
import { config } from '@/config/env';

import { ImageUploadPreview } from './ImageUploadPreview';
import { useFormUnsavedChanges } from '@/hooks/useFormUnsavedChanges';

export function HeroAdminTab() {
  const { toast } = useToast();
  const { data: heroImage, isLoading } = useHeroImage();
  const uploadHeroImage = useUploadHeroImage();
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useFormUnsavedChanges(selectedImage !== null);

  const handleUpload = async () => {
    if (!selectedImage) return;
    try {
      await uploadHeroImage.mutateAsync(selectedImage);
      toast({ title: 'Success', description: 'Hero image updated successfully!' });
      setSelectedImage(null);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const getImageUrl = (url?: string) => {
    if (!url) return undefined;
    return url.startsWith('/') ? `${config.cdnUrl}${url}` : url;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Hero Image Management</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Current Hero Image
            </CardTitle>
            <CardDescription>
              This is the main image displayed on the landing page of the website.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="w-full h-64 rounded-lg" />
            ) : heroImage && heroImage.url ? (
              <div className="space-y-4">
                <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <img
                    src={getImageUrl(heroImage.url)}
                    alt="Current hero"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                    Active on Website
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 space-y-2 border">
                  <p><strong>URL:</strong> <span className="truncate block mt-1 text-gray-500">{heroImage.url}</span></p>
                  <p><strong>Last Updated:</strong> {new Date(heroImage.updatedAt || Date.now()).toLocaleString()}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                <ImageIcon className="w-12 h-12 mb-3 text-gray-400" />
                <p className="font-medium">No hero image configured</p>
                <p className="text-sm">Upload an image below to set it up.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload New Hero
            </CardTitle>
            <CardDescription>
              Replace the current hero image with a new one.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="bg-blue-50 border-blue-200 text-blue-800">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription>
                Recommended: High-resolution images (1920x1080 or larger) in JPG, PNG, or WebP format for crisp display on 4K monitors.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <ImageUploadPreview 
                key={uploadHeroImage.isSuccess ? Date.now() : 'hero-upload'}
                onImageSelected={(file) => setSelectedImage(file)} 
              />
              
              <Button 
                onClick={handleUpload} 
                disabled={!selectedImage || uploadHeroImage.isPending}
                className="w-full sm:w-auto"
              >
                {uploadHeroImage.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {uploadHeroImage.isPending ? 'Updating Website...' : 'Set as New Hero Image'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
