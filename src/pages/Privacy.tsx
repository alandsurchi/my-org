import React from 'react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/site/PageHero';
import { PRIVACY_LAST_UPDATED, privacyContent } from '@/content/privacy';

const Privacy = () => {
  const { t, language } = useLanguage();
  usePageMeta({ title: t('privacyTitle'), description: t('privacyMetaDescription') });

  const doc = privacyContent[language];
  // Fall back to the ISO date if the locale is unavailable in this browser.
  let lastUpdated = PRIVACY_LAST_UPDATED;
  try {
    lastUpdated = new Intl.DateTimeFormat(language, { dateStyle: 'long' }).format(new Date(PRIVACY_LAST_UPDATED));
  } catch {
    /* keep the ISO form */
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-background">
      <Header />
      <PageHero
        eyebrow={t('privacyEyebrow')}
        title={t('privacyTitle')}
        breadcrumbs={[{ label: t('home'), to: '/' }, { label: t('privacyPolicy') }]}
      />

      <section className="pb-20 pt-16 md:pb-28">
        <div className="container-site max-w-3xl">
          <p className="text-sm text-muted-foreground">
            {t('privacyLastUpdatedLabel')}: <time dateTime={PRIVACY_LAST_UPDATED}>{lastUpdated}</time>
          </p>

          <div className="prose prose-lg mt-8 max-w-none dark:prose-invert prose-headings:font-display prose-a:text-primary">
            <p className="lead">{doc.intro}</p>

            {/* Plain <div>, not <section>: useHeaderState observes every <section>
                with an id, and these ids exist only as deep-link anchors. */}
            {doc.sections.map((section) => (
              <div key={section.id} id={section.id}>
                <h2>{section.heading}</h2>
                {section.paragraphs?.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
                {section.bullets && (
                  <ul>
                    {section.bullets.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Privacy;
