import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload, Edit2, Loader2, Image as ImageIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { useGallery, useUploadGalleryPhoto, useUpdatePhotoCaption, useDeletePhoto } from '@/hooks/useGalleryAPI';
import { useToast } from '@/hooks/use-toast';
import { config } from '@/config/env';

import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { ImageUploadPreview } from './ImageUploadPreview';
import { UnsavedChangesDialog } from './UnsavedChangesDialog';
import { useFormUnsavedChanges } from '@/hooks/useFormUnsavedChanges';

const captionSchema = z.object({
  caption: z.string().max(200, "Caption is too long").optional().or(z.literal('')),
});

type CaptionFormValues = z.infer<typeof captionSchema>;

export function GalleryAdminTab() {
  const { toast } = useToast();
  const { data: gallery = [], isLoading: galleryLoading } = useGallery();
  const uploadPhoto = useUploadGalleryPhoto();
  const updateCaption = useUpdatePhotoCaption();
  const deletePhoto = useDeletePhoto();

  // Upload Form State
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploadCaption, setUploadCaption] = useState('');
  
  // Edit Dialog State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  const editForm = useForm<CaptionFormValues>({
    resolver: zodResolver(captionSchema),
    defaultValues: { caption: '' },
  });

  useFormUnsavedChanges(editForm.formState.isDirty || selectedImage !== null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) {
      toast({ title: 'Error', description: 'Please select an image first.', variant: 'destructive' });
      return;
    }
    
    try {
      await uploadPhoto.mutateAsync({
        photo: selectedImage,
        caption: uploadCaption,
      });
      toast({ title: 'Success', description: 'Photo uploaded successfully!' });
      setSelectedImage(null);
      setUploadCaption('');
      // Force unmount of ImageUploadPreview to clear its internal state if needed, but it handles clear internally
      // Wait, we need a way to clear the ImageUploadPreview from parent. We can use a key.
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleOpenEdit = (photo: any) => {
    setEditingId(photo.id);
    editForm.reset({ caption: photo.caption || '' });
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    if (editForm.formState.isDirty) {
      setShowUnsavedDialog(true);
    } else {
      setIsEditOpen(false);
    }
  };

  const forceCloseEdit = () => {
    setShowUnsavedDialog(false);
    setIsEditOpen(false);
    editForm.reset();
  };

  const onEditSubmit = async (data: CaptionFormValues) => {
    if (!editingId) return;
    try {
      await updateCaption.mutateAsync({
        id: editingId,
        caption: data.caption || '',
      });
      toast({ title: 'Success', description: 'Caption updated successfully!' });
      setIsEditOpen(false);
      editForm.reset();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gallery Management</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload New Photo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-4 max-w-xl">
            <div className="space-y-2">
              <Label>Select Image</Label>
              {/* Using a key that changes after successful upload forces it to completely reset */}
              <ImageUploadPreview 
                key={uploadPhoto.isSuccess ? Date.now() : 'upload-preview'}
                onImageSelected={(file) => setSelectedImage(file)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="upload-caption">Caption (Optional)</Label>
              <Input
                id="upload-caption"
                placeholder="Enter a caption for this photo..."
                value={uploadCaption}
                onChange={(e) => setUploadCaption(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={!selectedImage || uploadPhoto.isPending}>
              {uploadPhoto.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {uploadPhoto.isPending ? 'Uploading...' : 'Upload to Gallery'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gallery Grid ({gallery.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {galleryLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="space-y-2">
                  <Skeleton className="w-full h-32 rounded-lg" />
                  <Skeleton className="h-4 w-3/4 mx-auto" />
                </div>
              ))}
            </div>
          ) : gallery.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg bg-gray-50">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">Gallery is empty</h3>
              <p className="text-gray-500 mt-1">Upload some memorable photos above to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gallery.map((photo: any) => (
                <div key={photo.id} className="relative group rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-all">
                  <img
                    src={photo.url.startsWith('/') ? `${config.cdnUrl}${photo.url}` : photo.url}
                    alt={photo.caption || 'Gallery photo'}
                    className="w-full h-40 object-cover"
                  />
                  
                  {/* Hover Overlay with Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="icon" 
                        variant="secondary" 
                        className="h-8 w-8 bg-white/90 hover:bg-white"
                        onClick={() => handleOpenEdit(photo)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <DeleteConfirmDialog 
                        onConfirm={() => deletePhoto.mutate(photo.id)}
                        isDeleting={deletePhoto.isPending && deletePhoto.variables === photo.id}
                        trigger={
                          <Button size="icon" variant="destructive" className="h-8 w-8 bg-red-600/90 hover:bg-red-600">
                            <Loader2 className={`w-4 h-4 animate-spin ${deletePhoto.isPending && deletePhoto.variables === photo.id ? '' : 'hidden'}`} />
                            <Trash2 className={`w-4 h-4 ${deletePhoto.isPending && deletePhoto.variables === photo.id ? 'hidden' : ''}`} />
                          </Button>
                        }
                      />
                    </div>
                    {photo.caption && (
                      <p className="text-white text-xs text-center truncate px-1 bg-black/50 py-1 rounded">
                        {photo.caption}
                      </p>
                    )}
                  </div>
                  
                  {/* Persistent Caption below image if no hover */}
                  <div className="p-2 bg-white">
                    <p className="text-xs text-gray-600 truncate text-center">
                      {photo.caption || <span className="text-gray-400 italic">No caption</span>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={(open) => !open && handleCloseEdit()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Photo Caption</DialogTitle>
            <DialogDescription>Update the metadata for this gallery image.</DialogDescription>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="caption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Caption</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a caption..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={handleCloseEdit}>Cancel</Button>
                <Button type="submit" disabled={updateCaption.isPending}>
                  {updateCaption.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Caption
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <UnsavedChangesDialog 
        isOpen={showUnsavedDialog} 
        onConfirm={forceCloseEdit}
        onCancel={() => setShowUnsavedDialog(false)} 
      />
    </div>
  );
}

// Ensure Trash2 is imported! (I forgot it in the lucide-react import above, let me fix it via multi_replace later if needed, actually I'll just use the button string)
// Wait, I used <Trash2> inside the trigger of DeleteConfirmDialog. I must import it.
