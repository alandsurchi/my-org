import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHeroImage } from '@/hooks/useHeroAPI';
import { HERO_FALLBACK, resolveImageUrl } from '@/lib/images';

/**
 * Full-bleed hero photo under a navy scrim, with the organisation name in
 * display type and a cream "ledger card" (tagline + calls to action) that
 * overlaps the About section below. This card is the site's visual signature.
 */
const HeroSection = () => {
  const { t } = useLanguage();
  const { data: heroImage, isLoading } = useHeroImage();
  const [loaded, setLoaded] = useState(false);

  // Wait for the API before choosing a photo, so we never download the
  // fallback first and swap it for the real hero a moment later.
  const src = isLoading ? null : resolveImageUrl(heroImage?.url, HERO_FALLBACK);

  useEffect(() => { setLoaded(false); }, [src]);

  return (
    <section id="home" className="relative isolate flex min-h-[100svh] flex-col justify-end bg-brand-950 text-white">
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        {src && (
          <img
            src={src}
            alt=""
            {...({ fetchpriority: 'high' } as Record<string, string>)}
            decoding="async"
            onLoad={() => setLoaded(true)}
            data-loaded={loaded}
            className="h-full w-full object-cover opacity-0 motion-safe:transition-opacity motion-safe:duration-700 data-[loaded=true]:opacity-100"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/45 to-brand-950/30" />
      </div>

      <div className="container-site pb-0 pt-32 md:pt-40">
        <p className="eyebrow text-brand-100 [&::before]:bg-accent-warm">{t('heroSubtitle')}</p>
        <h1 className="mt-5 max-w-4xl font-display text-display text-balance text-white drop-shadow-sm">
          {t('orgName')}
        </h1>

        <div className="card-surface relative z-10 -mb-16 mt-10 grid max-w-3xl gap-6 p-6 md:-mb-20 md:grid-cols-[1fr_auto] md:items-center md:p-8">
          <p className="text-lead font-medium text-foreground">{t('heroTitle')}</p>
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
            <Button asChild variant="accent" size="xl">
              <a href="#projects">
                {t('heroCtaProjects')}
                <ArrowRight className="rtl:rotate-180" aria-hidden="true" />
              </a>
            </Button>
            <Button asChild variant="outline" size="xl">
              <a href="#about">{t('learnMore')}</a>
            </Button>
          </div>
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-28 end-6 hidden items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/80 hover:text-white md:inline-flex lg:end-8"
      >
        <span>{t('discoverMore')}</span>
        <ArrowDown className="h-4 w-4 motion-safe:animate-bounce" aria-hidden="true" />
      </a>
    </section>
  );
};

export default HeroSection;
