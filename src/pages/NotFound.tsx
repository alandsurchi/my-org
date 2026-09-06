import { useLocation } from "react-router-dom";
import { usePageMeta } from '@/hooks/usePageMeta';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from "react";

const NotFound = () => {
  const { t } = useLanguage();
  usePageMeta({ title: '404', noindex: true });
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">{t('pageNotFound')}</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          {t('returnHome')}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
