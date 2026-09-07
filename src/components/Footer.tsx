import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Facebook, Instagram, Mail, MapPin, Youtube } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const SOCIALS = [
  { label: 'Facebook', href: 'https://www.facebook.com/mrovdostanorganization', icon: Facebook },
  { label: 'Instagram', href: 'https://www.instagram.com/mrov.dostan?igsh=Mmk0a3Mzb2d5MTdr', icon: Instagram },
  { label: 'YouTube', href: 'https://www.youtube.com/@mrovdostanorganization174', icon: Youtube },
];

const Footer = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSectionClick = (event: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    event.preventDefault();

    if (sectionId === 'home') {
      if (location.pathname !== '/') {
        navigate('/');
      }
      window.history.replaceState(null, '', '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (location.pathname !== '/') {
      navigate('/');
    }

    window.history.replaceState(null, '', `#${sectionId}`);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  };

  const quickLinks = ['about', 'projects', 'news', 'gallery'] as const;

  return (
    <footer className="border-t border-brand-800 bg-brand-950 text-brand-100">
      <div className="container-site py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <img
                src="/lovable-uploads/1b274aba-eb01-4306-999b-6798375f09e4.png"
                alt="MROVDOSTAN Logo"
                width={48}
                height={48}
                className="h-12 w-12 rounded-full bg-white object-contain p-0.5"
              />
              <span className="font-display text-xl font-bold text-white">{t('orgName')}</span>
            </div>
            <p className="mt-5 max-w-md leading-relaxed text-brand-200">{t('footerDescription')}</p>
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-4 font-display text-base font-semibold text-white">{t('quickLinks')}</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((id) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={(event) => handleSectionClick(event, id)}
                    className="text-brand-200 underline-offset-4 transition-colors hover:text-white hover:underline"
                  >
                    {t(id)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="mb-4 font-display text-base font-semibold text-white">{t('contactInfo')}</h3>
            <ul className="space-y-3 text-brand-200">
              <li>
                <a href="mailto:ohumanism@gmail.com" className="inline-flex items-center gap-2.5 transition-colors hover:text-white">
                  <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                  ohumanism@gmail.com
                </a>
              </li>
              <li className="inline-flex items-center gap-2.5">
                <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                Kurdistan Region, Iraq
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-4 font-display text-base font-semibold text-white">{t('followUs')}</h3>
            <div className="flex gap-3">
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-700 text-brand-100 transition-colors hover:bg-brand-800 hover:text-white"
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-brand-800 pt-8 text-center text-sm text-brand-300">
          {t('footerCopyright').replace(/\b20\d\d\b/, String(new Date().getFullYear()))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
