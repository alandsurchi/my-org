import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImagePlus, Loader2, Trash2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUpdateProject, type Project } from '@/hooks/useProjectsAPI';
import { useUpdateNews, type NewsItem } from '@/hooks/useNewsAPI';
import { config } from '@/config/env';

export type EditablePost =
  | { kind: 'project'; item: Project }
  | { kind: 'news'; item: NewsItem };

interface PostEditDialogProps {
  post: EditablePost | null;
  onClose: () => void;
}

const PROJECT_CATEGORIES = [
  { value: 'provision', label: 'Provision' },
  { value: 'distribution', label: 'Distribution' },
  { value: 'renovation', label: 'Renovation' },
  { value: 'building', label: 'Building' },
  { value: 'water', label: 'Water' },
  { value: 'education', label: 'Education' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'news', label: 'News' },
];

const PROJECT_STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'planned', label: 'Planned' },
  { value: 'on-hold', label: 'On hold' },
];

const NEWS_CATEGORIES = [
  { value: 'Place Visited', label: 'Place Visited' },
  { value: 'Visitors', label: 'Visitors' },
  { value: 'Certificate Received', label: 'Certificate Received' },
  { value: 'Certificate Awarded', label: 'Certificate Awarded' },
];

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const resolveImage = (url?: string | null) => {
  if (!url) return null;
  return url.startsWith('http') ? url : `${config.cdnUrl}${url}`;
};

interface FormState {
  title: string;
  body: string;
  category: string;
  status: string;
  location: string;
}

const initialForm = (post: EditablePost | null): FormState => {
  if (!post) return { title: '', body: '', category: '', status: '', location: '' };
  if (post.kind === 'project') {
    const p = post.item;
    return {
      title: p.title || p.title_en || '',
      body: p.description || p.description_en || '',
      category: p.category || '',
      status: p.status || 'active',
      location: p.location || '',
    };
  }
  const n = post.item;
  return { title: n.title || '', body: n.content || '', category: n.category || '', status: '', location: '' };
};

/**
 * One dialog to edit everything about a project or a news post: text fields,
 * category/status, and the image (replace or remove) with a live preview.
 */
const PostEditDialog = ({ post, onClose }: PostEditDialogProps) => {
  const { toast } = useToast();
  const updateProject = useUpdateProject();
  const updateNews = useUpdateNews();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>(() => initialForm(post));
  const [newImage, setNewImage] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isProject = post?.kind === 'project';
  const currentImage = post ? resolveImage(isProject ? (post.item as Project).imageUrl : (post.item as NewsItem).imageUrl) : null;
  const saving = updateProject.isPending || updateNews.isPending;

  // Reset the form whenever a different post is opened
  useEffect(() => {
    setForm(initialForm(post));
    setNewImage(null);
    setRemoveImage(false);
  }, [post]);

  // Object URL for the newly chosen image
  useEffect(() => {
    if (!newImage) { setPreviewUrl(null); return; }
    const url = URL.createObjectURL(newImage);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [newImage]);

  const categories = isProject ? PROJECT_CATEGORIES : NEWS_CATEGORIES;
  const categoryOptions = useMemo(() => {
    // Keep an unknown existing value selectable so nothing is silently lost
    if (form.category && !categories.some((c) => c.value === form.category)) {
      return [{ value: form.category, label: form.category }, ...categories];
    }
    return categories;
  }, [categories, form.category]);

  const dirty = useMemo(() => {
    const base = initialForm(post);
    return newImage !== null || removeImage || (Object.keys(base) as (keyof FormState)[]).some((k) => base[k] !== form[k]);
  }, [post, form, newImage, removeImage]);

  const set = (key: keyof FormState) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  const pickImage = (file: File | undefined) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast({ title: 'Unsupported file', description: 'Use a JPG, PNG, WebP or GIF image.', variant: 'destructive' });
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast({ title: 'Image too large', description: 'Maximum size is 5 MB.', variant: 'destructive' });
      return;
    }
    setNewImage(file);
    setRemoveImage(false);
  };

  const requestClose = () => {
    if (saving) return;
    if (dirty && !window.confirm('Discard your unsaved changes?')) return;
    onClose();
  };

  const handleSave = async () => {
    if (!post) return;
    const title = form.title.trim();
    const body = form.body.trim();
    if (title.length < 3) {
      toast({ title: 'Title is too short', description: 'Enter at least 3 characters.', variant: 'destructive' });
      return;
    }
    if (body.length < 5) {
      toast({ title: 'Text is too short', description: 'Enter at least 5 characters.', variant: 'destructive' });
      return;
    }

    try {
      if (post.kind === 'project') {
        await updateProject.mutateAsync({
          id: post.item.id,
          title,
          description: body,
          category: form.category || undefined,
          status: form.status || undefined,
          location: form.location.trim(),
          image: newImage,
          removeImage,
        });
      } else {
        await updateNews.mutateAsync({
          id: post.item.id,
          title,
          content: body,
          category: form.category || undefined,
          image: newImage,
          removeImage,
        });
      }
      toast({ title: 'Saved', description: `${isProject ? 'Project' : 'News post'} updated successfully.` });
      onClose();
    } catch (error) {
      toast({
        title: 'Could not save',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const shownImage = previewUrl || (removeImage ? null : currentImage);

  return (
    <Dialog open={!!post} onOpenChange={(open) => { if (!open) requestClose(); }}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto" dir="ltr">
        <DialogHeader>
          <DialogTitle>{isProject ? 'Edit project' : 'Edit news post'}</DialogTitle>
          <DialogDescription>Change any field below, then save. The public site updates immediately.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Image */}
          <div className="space-y-2">
            <Label>Image</Label>
            <div className="relative rounded-2xl overflow-hidden border bg-gray-50">
              {shownImage ? (
                <img src={shownImage} alt="" className="w-full h-56 object-cover" />
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-40 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <ImagePlus className="w-8 h-8 mb-2" />
                  <span className="text-sm">No image. Click to add one.</span>
                </button>
              )}
              {newImage && (
                <span className="absolute top-3 left-3 text-xs bg-blue-600 text-white px-2 py-1 rounded-full">New image (not saved yet)</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                <ImagePlus className="w-4 h-4 mr-2" />
                {shownImage ? 'Replace image' : 'Add image'}
              </Button>
              {newImage && (
                <Button type="button" variant="ghost" size="sm" onClick={() => setNewImage(null)}>
                  <X className="w-4 h-4 mr-2" />
                  Keep current image
                </Button>
              )}
              {!newImage && currentImage && !removeImage && (
                <Button type="button" variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => setRemoveImage(true)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove image
                </Button>
              )}
              {removeImage && (
                <Button type="button" variant="ghost" size="sm" onClick={() => setRemoveImage(false)}>
                  Undo remove
                </Button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_TYPES.join(',')}
                className="hidden"
                onChange={(e) => { pickImage(e.target.files?.[0]); e.target.value = ''; }}
              />
            </div>
            <p className="text-xs text-gray-500">JPG, PNG, WebP or GIF, up to 5 MB.</p>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="post-title">Title</Label>
            <Input id="post-title" value={form.title} onChange={(e) => set('title')(e.target.value)} placeholder="Title" />
          </div>

          {/* Body */}
          <div className="space-y-2">
            <Label htmlFor="post-body">{isProject ? 'Description' : 'Content'}</Label>
            <Textarea
              id="post-body"
              value={form.body}
              onChange={(e) => set('body')(e.target.value)}
              className="min-h-[160px]"
              placeholder={isProject ? 'Describe the project' : 'Write the news post'}
            />
          </div>

          {/* Category / status / location */}
          <div className={`grid gap-4 ${isProject ? 'md:grid-cols-3' : 'md:grid-cols-1'}`}>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={set('category')}>
                <SelectTrigger><SelectValue placeholder="Choose a category" /></SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {isProject && (
              <>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={set('status')}>
                    <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      {PROJECT_STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="post-location">Location</Label>
                  <Input id="post-location" value={form.location} onChange={(e) => set('location')(e.target.value)} placeholder="e.g. Erbil" />
                </div>
              </>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={requestClose} disabled={saving}>Cancel</Button>
          <Button type="button" onClick={handleSave} disabled={saving || !dirty}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PostEditDialog;
