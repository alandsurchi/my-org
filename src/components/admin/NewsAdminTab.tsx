import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Edit2, Loader2, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { useNews, useCreateNews, useUpdateNews, useDeleteNews } from '@/hooks/useNewsAPI';
import { useToast } from '@/hooks/use-toast';
import { config } from '@/config/env';

import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { ImageUploadPreview } from './ImageUploadPreview';
import { UnsavedChangesDialog } from './UnsavedChangesDialog';
import { useFormUnsavedChanges } from '@/hooks/useFormUnsavedChanges';

const newsSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title is too long"),
  content: z.string().min(10, "Content must be at least 10 characters"),
});

type NewsFormValues = z.infer<typeof newsSchema>;

export function NewsAdminTab() {
  const { toast } = useToast();
  const { data: news = [], isLoading: newsLoading } = useNews();
  const createNews = useCreateNews();
  const updateNews = useUpdateNews();
  const deleteNews = useDeleteNews();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>(undefined);
  
  // Unsaved changes tracking
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  useFormUnsavedChanges(form.formState.isDirty || selectedImage !== null);

  const handleOpenCreate = () => {
    setEditingId(null);
    setCurrentImageUrl(undefined);
    setSelectedImage(null);
    form.reset({ title: '', content: '' });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (article: any) => {
    setEditingId(article.id);
    setCurrentImageUrl(article.imageUrl ? (article.imageUrl.startsWith('/') ? `${config.cdnUrl}${article.imageUrl}` : article.imageUrl) : undefined);
    setSelectedImage(null);
    form.reset({ title: article.title, content: article.content });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    if (form.formState.isDirty || selectedImage !== null) {
      setShowUnsavedDialog(true);
    } else {
      setIsDialogOpen(false);
    }
  };

  const forceCloseDialog = () => {
    setShowUnsavedDialog(false);
    setIsDialogOpen(false);
    form.reset();
    setSelectedImage(null);
  };

  const onSubmit = async (data: NewsFormValues) => {
    try {
      if (editingId) {
        await updateNews.mutateAsync({
          id: editingId,
          title: data.title,
          content: data.content,
          image: selectedImage || undefined,
        });
        toast({ title: 'Success', description: 'News article updated successfully!' });
      } else {
        await createNews.mutateAsync({
          title: data.title,
          content: data.content,
          image: selectedImage || undefined,
        });
        toast({ title: 'Success', description: 'News article created successfully!' });
      }
      setIsDialogOpen(false);
      form.reset();
      setSelectedImage(null);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">News Management</h2>
        <Button onClick={handleOpenCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Article
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Article' : 'Create Article'}</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Article Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Article Content</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter content" rows={6} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label>Featured Image</Label>
                <ImageUploadPreview 
                  currentImageUrl={currentImageUrl}
                  onImageSelected={(file) => setSelectedImage(file)}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>Cancel</Button>
                <Button type="submit" disabled={createNews.isPending || updateNews.isPending}>
                  {(createNews.isPending || updateNews.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingId ? 'Save Changes' : 'Create Article'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <UnsavedChangesDialog 
        isOpen={showUnsavedDialog} 
        onConfirm={forceCloseDialog}
        onCancel={() => setShowUnsavedDialog(false)} 
      />

      <Card>
        <CardHeader>
          <CardTitle>Published Articles ({news.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {newsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4 p-4 border rounded-lg">
                  <Skeleton className="w-24 h-24 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg bg-gray-50">
              <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">No news articles yet</h3>
              <p className="text-gray-500 mt-1">Get started by creating your first article above.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {news.map((article: any) => (
                <div key={article.id} className="flex items-start gap-4 p-4 border rounded-lg bg-white shadow-sm hover:shadow transition-shadow">
                  {article.imageUrl ? (
                    <img
                      src={article.imageUrl.startsWith('/') ? `${config.cdnUrl}${article.imageUrl}` : article.imageUrl}
                      alt={article.title}
                      className="w-24 h-24 object-cover rounded-md border"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-100 flex items-center justify-center rounded-md border">
                      <Newspaper className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">{article.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {article.content}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpenEdit(article)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <DeleteConfirmDialog 
                      onConfirm={() => deleteNews.mutate(article.id)}
                      isDeleting={deleteNews.isPending && deleteNews.variables === article.id}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
