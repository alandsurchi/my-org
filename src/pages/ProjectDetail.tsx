import React from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, FolderOpen, MapPin } from 'lucide-react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProjectById } from '@/hooks/useProjectsAPI';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/site/PageHero';
import Chip, { STATUS_TONE } from '@/components/site/Chip';
import EmptyState from '@/components/site/EmptyState';
import ErrorState from '@/components/site/ErrorState';
import { Skeleton } from '@/components/ui/skeleton';
import { resolveImageUrl } from '@/lib/images';
import { excerpt, formatDate } from '@/lib/format';
import { isUntranslated, postBody, postTitle } from '@/lib/postText';
import { projectCategoryIcon, projectCategoryLabel, projectStatusLabel } from '@/lib/labels';

/** One activity, at its own address, so it can be shared, linked and indexed. */
const ProjectDetail = () => {
  const { t, language } = useLanguage();
  const { id = '' } = useParams();
  const { data: project, isLoading, error } = useProjectById(id);

  const title = postTitle(project, language);
  const description = postBody(project, project?.description || project?.description_en, language);
  const machineTranslated = !isUntranslated(project, language) && language !== 'ku';
  usePageMeta({
    title: title || t('allProjectsTitle'),
    description: excerpt(description, 160) || t('allProjectsDescription'),
  });

  const category = project?.category || 'water';
  const status = project?.status || 'active';
  const CategoryIcon = projectCategoryIcon(category);
  const imageSrc = resolveImageUrl(project?.image_url || project?.imageUrl);

  return (
    <div className="min-h-screen overflow-x-clip bg-background">
      <Header />
      <PageHero
        eyebrow={project ? projectCategoryLabel(category, t) : t('projects')}
        title={title || (isLoading ? '…' : t('pageNotFound'))}
        breadcrumbs={[
          { label: t('home'), to: '/' },
          { label: t('allProjectsTitle'), to: '/projects' },
          { label: title || t('projectDetails') },
        ]}
      />

      <section className="pb-20 pt-12 md:pb-28">
        <div className="container-site max-w-3xl">
          {error ? (
            <ErrorState
              title={t('errorLoadingProjects')}
              detail={error.message}
              onRetry={() => window.location.reload()}
              retryLabel={t('retry')}
            />
          ) : isLoading ? (
            <div aria-busy="true" className="space-y-4">
              <Skeleton className="aspect-[16/9] w-full rounded-card" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
            </div>
          ) : !project ? (
            <EmptyState icon={FolderOpen} title={t('noProjectsFound')} description={t('pageNotFound')} />
          ) : (
            <article>
              {imageSrc && (
                <figure className="relative mb-8 overflow-hidden rounded-card">
                  <img
                    src={imageSrc}
                    alt={title || t('projectImageAlt')}
                    className="aspect-[16/9] w-full object-cover"
                  />
                </figure>
              )}

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  {t('started')}: {formatDate(project.createdAt || project.created_at)}
                </span>
                {project.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    {project.location}
                  </span>
                )}
                <Chip tone="brand" icon={CategoryIcon}>{projectCategoryLabel(category, t)}</Chip>
                <Chip tone={STATUS_TONE[status] || 'brand'}>{projectStatusLabel(status, t)}</Chip>
              </div>

              {machineTranslated && (
                <p className="mt-8 rounded-card border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
                  {t('machineTranslated')}
                </p>
              )}

              <h2 className="mb-3 mt-10 font-display text-h3">{t('aboutThisProject')}</h2>
              <div className="prose prose-lg max-w-none whitespace-pre-line dark:prose-invert">
                <p>{description}</p>
              </div>

              <aside className="mt-10 rounded-card border-s-4 border-primary bg-muted p-6">
                <h2 className="font-display text-base font-semibold">{t('projectImpact')}</h2>
                <p className="mt-2 text-muted-foreground">{t('projectImpactText')}</p>
              </aside>
            </article>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProjectDetail;
