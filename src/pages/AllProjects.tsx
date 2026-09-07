import React, { useState } from 'react';
import { FolderOpen, Search } from 'lucide-react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProjects, type Project } from '@/hooks/useProjectsAPI';
import ProjectDetailDialog, { toDialogProject, type DialogProject } from '@/components/ProjectDetailDialog';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/site/PageHero';
import FilterBar from '@/components/site/FilterBar';
import PostCard from '@/components/site/PostCard';
import PostCardSkeleton from '@/components/site/PostCardSkeleton';
import EmptyState from '@/components/site/EmptyState';
import ErrorState from '@/components/site/ErrorState';
import { resolveImageUrl } from '@/lib/images';
import { excerpt, formatDate } from '@/lib/format';
import { PROJECT_FILTER_CATEGORIES, projectCategoryIcon, projectCategoryLabel, projectStatusLabel } from '@/lib/labels';

const AllProjects = () => {
  const { t } = useLanguage();
  usePageMeta({ title: t('allProjectsTitle'), description: t('allProjectsDescription') });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<DialogProject | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const { data: projects = [], isLoading, error } = useProjects();

  const term = searchTerm.toLowerCase();
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = (project.title ?? '').toLowerCase().includes(term) ||
      (project.description ?? '').toLowerCase().includes(term);
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleReadMore = (project: Project) => {
    setSelectedProject(toDialogProject(project));
    setIsDetailDialogOpen(true);
  };

  const closeDetailDialog = () => {
    setIsDetailDialogOpen(false);
    setSelectedProject(null);
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-background">
      <Header />
      <PageHero
        eyebrow={t('projects')}
        title={t('allProjectsTitle')}
        description={t('allProjectsDescription')}
        backTo="/"
        backLabel={t('backToHome')}
      />

      <section className="pb-20 md:pb-28">
        <div className="container-site">
          <FilterBar>
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute start-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                aria-label={t('searchProjects')}
                placeholder={t('searchProjects')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-11 rounded-pill border-border bg-background ps-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger aria-label={t('category')} className="h-11 w-full rounded-pill border-border bg-background md:w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allCategories')}</SelectItem>
                {PROJECT_FILTER_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c === 'news' ? t('newsUpdates') : t(c)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterBar>

          {error ? (
            <ErrorState
              title={t('errorLoadingProjects')}
              detail={error.message}
              onRetry={() => window.location.reload()}
              retryLabel={t('retry')}
            />
          ) : isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-busy="true">
              <PostCardSkeleton count={6} />
            </div>
          ) : filteredProjects.length === 0 ? (
            <EmptyState
              icon={FolderOpen}
              title={t('noProjectsFound')}
              action={searchTerm || selectedCategory !== 'all' ? (
                <Button variant="outline" onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}>{t('clearSearch')}</Button>
              ) : undefined}
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((p, index) => (
                <PostCard
                  key={p.id}
                  index={index}
                  title={p.title || p.title_en || ''}
                  excerpt={excerpt(p.description || p.description_en, 160)}
                  imageUrl={resolveImageUrl(p.image_url || p.imageUrl)}
                  imageAlt={p.title || p.title_en}
                  categoryLabel={projectCategoryLabel(p.category, t)}
                  categoryIcon={projectCategoryIcon(p.category)}
                  statusLabel={projectStatusLabel(p.status || 'active', t)}
                  statusKey={p.status || 'active'}
                  date={formatDate(p.createdAt || p.created_at)}
                  location={p.location}
                  readMoreLabel={t('readMore')}
                  onOpen={() => handleReadMore(p)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />

      <ProjectDetailDialog project={selectedProject} isOpen={isDetailDialogOpen} onClose={closeDetailDialog} />
    </div>
  );
};

export default AllProjects;
