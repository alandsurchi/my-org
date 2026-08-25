import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Edit2, Loader2, FolderKanban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from '@/hooks/useProjectsAPI';
import { useToast } from '@/hooks/use-toast';
import { config } from '@/config/env';

import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { ImageUploadPreview } from './ImageUploadPreview';
import { UnsavedChangesDialog } from './UnsavedChangesDialog';
import { useFormUnsavedChanges } from '@/hooks/useFormUnsavedChanges';

const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title is too long"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  status: z.enum(['active', 'completed', 'planned', 'on-hold']),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export function ProjectsAdminTab() {
  const { toast } = useToast();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>(undefined);
  
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'active',
    },
  });

  useFormUnsavedChanges(form.formState.isDirty || selectedImage !== null);

  const handleOpenCreate = () => {
    setEditingId(null);
    setCurrentImageUrl(undefined);
    setSelectedImage(null);
    form.reset({ title: '', description: '', status: 'active' });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (project: any) => {
    setEditingId(project.id);
    setCurrentImageUrl(project.imageUrl ? (project.imageUrl.startsWith('/') ? `${config.cdnUrl}${project.imageUrl}` : project.imageUrl) : undefined);
    setSelectedImage(null);
    form.reset({ title: project.title, description: project.description, status: project.status });
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

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      if (editingId) {
        await updateProject.mutateAsync({
          id: editingId,
          title: data.title,
          description: data.description,
          status: data.status,
          image: selectedImage || undefined,
        });
        toast({ title: 'Success', description: 'Project updated successfully!' });
      } else {
        await createProject.mutateAsync({
          title: data.title,
          description: data.description,
          status: data.status,
          image: selectedImage || undefined,
        });
        toast({ title: 'Success', description: 'Project created successfully!' });
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
        <h2 className="text-2xl font-bold">Projects Management</h2>
        <Button onClick={handleOpenCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Project
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Project' : 'Create Project'}</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter description" rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="on-hold">On Hold</SelectItem>
                      </SelectContent>
                    </Select>
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
                <Button type="submit" disabled={createProject.isPending || updateProject.isPending}>
                  {(createProject.isPending || updateProject.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingId ? 'Save Changes' : 'Create Project'}
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
          <CardTitle>Projects Portfolio ({projects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {projectsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4 p-4 border rounded-lg">
                  <Skeleton className="w-24 h-24 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-8 w-24 rounded-full mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg bg-gray-50">
              <FolderKanban className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">No projects yet</h3>
              <p className="text-gray-500 mt-1">Start building your portfolio by creating a project.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {projects.map((project: any) => (
                <div key={project.id} className="flex items-start gap-4 p-4 border rounded-lg bg-white shadow-sm hover:shadow transition-shadow">
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl.startsWith('/') ? `${config.cdnUrl}${project.imageUrl}` : project.imageUrl}
                      alt={project.title}
                      className="w-24 h-24 object-cover rounded-md border"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-100 flex items-center justify-center rounded-md border">
                      <FolderKanban className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">{project.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {project.description}
                    </p>
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full mt-3 ${
                      project.status === 'active' ? 'bg-green-100 text-green-800' :
                      project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      project.status === 'planned' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpenEdit(project)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <DeleteConfirmDialog 
                      onConfirm={() => deleteProject.mutate(project.id)}
                      isDeleting={deleteProject.isPending && deleteProject.variables === project.id}
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
