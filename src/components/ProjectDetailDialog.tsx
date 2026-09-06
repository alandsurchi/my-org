
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { config } from '../config/env';
import type { Project } from '@/lib/apiClient';

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

  const getImageSrc = (url?: string) => {
    if (!url) return null;
    if (url.startsWith('/uploads/')) {
      return `${config.cdnUrl}${url}`;
    }
    return url;
  };

  const getBadgeColor = (category: string) => {
    const colors = {
      'water': 'bg-gradient-to-r from-blue-500 to-blue-600',
      'education': 'bg-gradient-to-r from-green-500 to-emerald-600',
      'emergency': 'bg-gradient-to-r from-purple-500 to-purple-600',
      'healthcare': 'bg-gradient-to-r from-indigo-500 to-indigo-600'
    };
    return colors[category as keyof typeof colors] || 'bg-gradient-to-r from-blue-500 to-blue-600';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      'water': '💧',
      'education': '📚',
      'emergency': '🚨',
      'healthcare': '🏥'
    };
    return icons[category as keyof typeof icons] || '🌟';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 mb-4">
            {project.title_en}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Project Image */}
          {getImageSrc(project.image_url) && (
            <div className="relative">
              <img 
                src={getImageSrc(project.image_url)!} 
                alt={project.title_en}
                className="w-full h-64 md:h-80 object-cover rounded-lg"
              />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="text-2xl">{getCategoryIcon(project.category)}</span>
                <span className="text-sm text-white font-medium bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  {t(project.category)}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <span className={`${getBadgeColor(project.category)} text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg`}>
                  {project.status}
                </span>
              </div>
            </div>
          )}

          {/* Project Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">Started: {new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                  {project.location && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{project.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Category</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getCategoryIcon(project.category)}</span>
                  <span className="font-medium">{t(project.category)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Project Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Project</h3>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {project.description_en}
              </p>
            </div>
          </div>

          {/* Additional sections could be added here for more details */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Impact</h3>
            <p className="text-gray-700">
              This {t(project.category).toLowerCase()} project is making a meaningful difference in our community. 
              Through dedicated efforts and community support, we continue to work towards our mission of creating positive change.
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={onClose} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailDialog;
