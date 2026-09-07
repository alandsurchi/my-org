import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const NotFound = () => {
  const { t } = useLanguage();
  usePageMeta({ title: '404', noindex: true });
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen overflow-x-clip bg-background">
      <Header />
      <section id="main-content" className="flex min-h-[70vh] items-center bg-brand-950 pt-24 text-white">
        <div className="container-site py-20">
          <h1 className="font-display text-display">404</h1>
          <p className="mt-4 max-w-xl text-lead text-brand-100">{t('pageNotFound')}</p>
          <Button asChild variant="accent" size="xl" className="mt-8">
            <Link to="/">{t('returnHome')}</Link>
          </Button>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default NotFound;
