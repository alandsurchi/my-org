import React, { useState } from 'react';
import { ArrowRight, FolderOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProjects, type Project } from '@/hooks/useProjectsAPI';
import ProjectDetailDialog, { toDialogProject, type DialogProject } from './ProjectDetailDialog';
import Section from '@/components/site/Section';
import SectionHeading from '@/components/site/SectionHeading';
import PostCard from '@/components/site/PostCard';
import PostCardSkeleton from '@/components/site/PostCardSkeleton';
import EmptyState from '@/components/site/EmptyState';
import { resolveImageUrl } from '@/lib/images';
import { excerpt, formatDate, getSortTime } from '@/lib/format';
import { PROJECT_FILTER_CATEGORIES, projectCategoryIcon, projectCategoryLabel, projectStatusLabel } from '@/lib/labels';

const ProjectsSection = () => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<DialogProject | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const { data: projects = [], isLoading } = useProjects();

  // Same rules as before: category filter (uncategorised items always show), newest first, latest 3.
  const recentActivities = projects
    .filter((p) => selectedCategory === 'all' || p.category === selectedCategory || !p.category)
    .sort((a, b) => getSortTime(b) - getSortTime(a))
    .slice(0, 3);

  const handleReadMore = (project: Project) => {
    setSelectedProject(toDialogProject(project));
    setIsDetailDialogOpen(true);
  };

  const closeDetailDialog = () => {
    setIsDetailDialogOpen(false);
    setSelectedProject(null);
  };

  return (
    <Section id="projects" tone="muted">
      <div className="container-site">
        <SectionHeading
          eyebrow={t('projects')}
          title={t('projectsTitle')}
          description={t('projectsDescription')}
          actions={
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger aria-label={t('category')} className="h-11 w-full rounded-pill border-border bg-card shadow-sm md:w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allCategories')}</SelectItem>
                {PROJECT_FILTER_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c === 'news' ? t('newsUpdates') : t(c)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        />

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-busy="true">
            <PostCardSkeleton count={3} />
          </div>
        ) : recentActivities.length === 0 ? (
          <EmptyState icon={FolderOpen} title={t('noProjectsFound')} />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentActivities.map((p, index) => (
              <PostCard
                key={p.id}
                index={index}
                title={p.title_en || p.title}
                excerpt={excerpt(p.description_en || p.description, 160)}
                imageUrl={resolveImageUrl(p.image_url || p.imageUrl)}
                imageAlt={p.title_en || p.title}
                categoryLabel={projectCategoryLabel(p.category, t)}
                categoryIcon={projectCategoryIcon(p.category)}
                statusLabel={projectStatusLabel(p.status || 'completed', t)}
                statusKey={p.status || 'completed'}
                date={formatDate(p.created_at || p.createdAt)}
                location={p.location}
                readMoreLabel={t('readMore')}
                onOpen={() => handleReadMore(p)}
              />
            ))}
          </div>
        )}

        <p className="mt-6 text-sm text-muted-foreground">{t('showingLatestActivities')}</p>

        <div className="fade-in-on-scroll mt-10 text-center">
          <Button asChild variant="outline" size="lg" className="rounded-pill">
            <Link to="/projects">
              {t('viewAllProjects')}
              <ArrowRight className="rtl:rotate-180" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>

      <ProjectDetailDialog project={selectedProject} isOpen={isDetailDialogOpen} onClose={closeDetailDialog} />
    </Section>
  );
};

export default ProjectsSection;
