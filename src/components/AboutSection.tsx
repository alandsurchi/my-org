import React from 'react';
import { CheckCircle2, Eye, Target } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAboutImage } from '@/hooks/useAboutAPI';
import { ABOUT_FALLBACK, resolveImageUrl } from '@/lib/images';
import Section from '@/components/site/Section';

const AboutSection = () => {
  const { t } = useLanguage();
  const { data: aboutImage } = useAboutImage();
  const imageSrc = resolveImageUrl(aboutImage?.url, ABOUT_FALLBACK) ?? ABOUT_FALLBACK;

  const pillars = [
    { icon: Target, title: t('mission'), text: t('missionText') },
    { icon: Eye, title: t('vision'), text: t('visionText') },
  ];
  const goals = ['goal1', 'goal2', 'goal3', 'goal4'];

  return (
    <Section id="about" tone="base" className="pt-32 md:pt-40">
      <div className="container-site">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="fade-in-on-scroll">
              <p className="eyebrow mb-4">{t('about')}</p>
              <h2 className="font-display text-h2 text-balance">{t('aboutTitle')}</h2>
              <p className="mt-6 text-lead text-foreground/90">{t('aboutDescription')}</p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {pillars.map(({ icon: Icon, title, text }, i) => (
                <div key={title} className="fade-in-on-scroll" style={{ transitionDelay: `${(i + 1) * 60}ms` }}>
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-200">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-h3">{title}</h3>
                  <p className="mt-2 text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <figure className="fade-in-on-scroll relative lg:col-span-5 lg:mt-12" style={{ transitionDelay: '120ms' }}>
            <div
              className="absolute -inset-3 translate-x-4 translate-y-4 rounded-card bg-brand-100 dark:bg-brand-900 rtl:-translate-x-4"
              aria-hidden="true"
            />
            <img
              src={imageSrc}
              alt={t('aboutImageAlt')}
              loading="lazy"
              decoding="async"
              className="relative aspect-[4/5] w-full rounded-card object-cover shadow-card"
            />
          </figure>
        </div>

        <div className="fade-in-on-scroll mt-16 rounded-card bg-muted p-8 md:mt-20 md:p-10">
          <h3 className="font-display text-h3">{t('goals')}</h3>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {goals.map((key) => (
              <li key={key} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <span className="text-foreground/90">{t(key)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
};

export default AboutSection;
