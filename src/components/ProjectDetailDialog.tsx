import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Project } from '@/lib/apiClient';
import { resolveImageUrl } from '@/lib/images';
import { formatDate } from '@/lib/format';
import { projectCategoryIcon, projectCategoryLabel, projectStatusLabel } from '@/lib/labels';
import Chip, { STATUS_TONE } from '@/components/site/Chip';

export interface DialogProject {
  id: string;
  title_en: string;
  description_en: string;
  category: string;
  image_url?: string;
  location?: string;
  status: string;
  created_at: string;
}

/** Converts an API project (or legacy shape) into what the dialog renders. */
export const toDialogProject = (p: Partial<Project> & { id: number | string }): DialogProject => ({
  id: String(p.id),
  title_en: p.title ?? p.title_en ?? '',
  description_en: p.description ?? p.description_en ?? '',
  category: p.category ?? 'water',
  image_url: p.imageUrl ?? p.image_url ?? undefined,
  location: p.location ?? undefined,
  status: p.status ?? 'active',
  created_at: p.createdAt ?? p.created_at ?? new Date().toISOString(),
});

interface ProjectDetailDialogProps {
  project: DialogProject | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetailDialog = ({ project, isOpen, onClose }: ProjectDetailDialogProps) => {
  const { t } = useLanguage();

  if (!project) return null;

  const imageSrc = resolveImageUrl(project.image_url);
  const CategoryIcon = projectCategoryIcon(project.category);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-h-[90vh] max-w-3xl gap-0 overflow-y-auto p-0">
        {imageSrc ? (
          <figure className="relative">
            <img src={imageSrc} alt={project.title_en} className="aspect-[16/9] w-full object-cover" />
            <div className="absolute start-4 top-4 flex flex-wrap gap-2">
              <Chip tone="onPhoto" icon={CategoryIcon}>{projectCategoryLabel(project.category, t)}</Chip>
              <Chip tone={STATUS_TONE[project.status] || 'brand'}>{projectStatusLabel(project.status, t)}</Chip>
            </div>
          </figure>
        ) : (
          <div className="flex h-28 items-center justify-center bg-brand-950 text-brand-200">
            <CategoryIcon className="h-10 w-10" aria-hidden="true" />
          </div>
        )}

        <div className="space-y-6 p-6 md:p-8">
          <div>
            <DialogTitle className="font-display text-h2 text-balance">{project.title_en}</DialogTitle>
            <DialogDescription className="sr-only">{t('projectDetails')}</DialogDescription>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                {t('started')}: {formatDate(project.created_at)}
              </span>
              {project.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {project.location}
                </span>
              )}
              <span className="inline-flex items-center gap-2">
                {t('category')}:
                <Chip tone="brand" icon={CategoryIcon}>{projectCategoryLabel(project.category, t)}</Chip>
              </span>
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-display text-h3">{t('aboutThisProject')}</h3>
            <div className="prose prose-neutral max-w-none whitespace-pre-line dark:prose-invert">
              <p>{project.description_en}</p>
            </div>
          </div>

          <aside className="rounded-card border-s-4 border-primary bg-muted p-6">
            <h3 className="font-display text-base font-semibold">{t('projectImpact')}</h3>
            <p className="mt-2 text-muted-foreground">{t('projectImpactText')}</p>
          </aside>

          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>{t('close')}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailDialog;
