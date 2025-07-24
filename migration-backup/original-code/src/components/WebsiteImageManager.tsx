
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, Edit, Trash2, Plus, Settings, Home, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWebsiteImages, useCreateWebsiteImage, useUpdateWebsiteImage, useDeleteWebsiteImage } from '@/hooks/useWebsiteImages';
import { useFileUpload } from '@/hooks/useFileUpload';
import ImageCategorySelector from './ImageCategorySelector';

const WebsiteImageManager = () => {
  const { toast } = useToast();
  const { uploadFile, uploading } = useFileUpload();
  const { data: websiteImages = [] } = useWebsiteImages();
  const createWebsiteImage = useCreateWebsiteImage();
  const updateWebsiteImage = useUpdateWebsiteImage();
  const deleteWebsiteImage = useDeleteWebsiteImage();

  const [imageForm, setImageForm] = useState({
    name: '',
    category: '',
    section: ''
  });

  const [editingImage, setEditingImage] = useState<any>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0 && imageForm.name && imageForm.category) {
      for (const file of Array.from(files)) {
        const imageUrl = await uploadFile(file);
        if (imageUrl) {
          await createWebsiteImage.mutateAsync({
            name: imageForm.name,
            image_url: imageUrl,
            category: imageForm.category,
            section: imageForm.section
          });
        }
      }
      setImageForm({ name: '', category: '', section: '' });
      toast({
        title: "Images uploaded successfully",
        description: `${files.length} image(s) have been uploaded.`,
      });
      // Reset the file input
      event.target.value = '';
    } else {
      toast({
        title: "Please fill required fields",
        description: "Name and category are required.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteImage = async (id: string) => {
    await deleteWebsiteImage.mutateAsync(id);
    toast({
      title: "Image deleted",
      description: "The image has been removed successfully.",
    });
  };

  const handleEditImage = async () => {
    if (editingImage && editingImage.id) {
      await updateWebsiteImage.mutateAsync({
        id: editingImage.id,
        name: editingImage.name,
        category: editingImage.category,
        section: editingImage.section
      });
      setEditingImage(null);
      toast({
        title: "Image updated",
        description: "The image has been updated successfully.",
      });
    }
  };

  const filteredImages = filterCategory === 'all' 
    ? websiteImages 
    : websiteImages.filter(img => img.category === filterCategory);

  const categories = ['all', 'hero', 'about', 'gallery', 'news', 'projects', 'team', 'general'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Website Images</CardTitle>
          <CardDescription>Manage all images across the website</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Images
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Website Images</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="imageName">Image Name</Label>
                    <Input 
                      id="imageName" 
                      placeholder="Enter image name"
                      value={imageForm.name}
                      onChange={(e) => setImageForm({...imageForm, name: e.target.value})}
                    />
                  </div>
                  <ImageCategorySelector
                    category={imageForm.category}
                    section={imageForm.section}
                    onCategoryChange={(category) => setImageForm({...imageForm, category})}
                    onSectionChange={(section) => setImageForm({...imageForm, section})}
                  />
                  <div>
                    <Label htmlFor="imageFiles">Select Images</Label>
                    <Input 
                      id="imageFiles" 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      className="cursor-pointer"
                      disabled={uploading || createWebsiteImage.isPending}
                    />
                    {(uploading || createWebsiteImage.isPending) && (
                      <p className="text-sm text-gray-500 mt-2">Uploading...</p>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={filterCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterCategory(category)}
                >
                  {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredImages.map((image) => (
                <div key={image.id} className="relative group">
                  <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={image.image_url || '/placeholder.svg'} 
                      alt={image.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 rounded-b-lg">
                    <p className="text-sm font-medium">{image.name}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {image.category && (
                        <Badge variant="secondary" className="text-xs">
                          {image.category}
                        </Badge>
                      )}
                      {image.section && (
                        <Badge variant="outline" className="text-xs">
                          {image.section}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="secondary"
                            onClick={() => setEditingImage({...image})}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Image</DialogTitle>
                          </DialogHeader>
                          {editingImage && (
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="editImageName">Image Name</Label>
                                <Input 
                                  id="editImageName" 
                                  value={editingImage.name}
                                  onChange={(e) => setEditingImage({...editingImage, name: e.target.value})}
                                />
                              </div>
                              <ImageCategorySelector
                                category={editingImage.category || ''}
                                section={editingImage.section || ''}
                                onCategoryChange={(category) => setEditingImage({...editingImage, category})}
                                onSectionChange={(section) => setEditingImage({...editingImage, section})}
                              />
                              <Button 
                                onClick={handleEditImage}
                                disabled={updateWebsiteImage.isPending}
                                className="w-full"
                              >
                                {updateWebsiteImage.isPending ? 'Updating...' : 'Update Image'}
                              </Button>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDeleteImage(image.id)}
                        disabled={deleteWebsiteImage.isPending}
                      >
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

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            <Home className="w-4 h-4 mr-2" />
            Edit Homepage Images
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <FileText className="w-4 h-4 mr-2" />
            Edit About Section Images
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Settings className="w-4 h-4 mr-2" />
            Site Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebsiteImageManager;
