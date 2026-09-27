import { useEffect } from 'react';

const SITE_NAME = 'MROVDOSTAN';

/** The home page's tab text. Kept in step with index.html and server.mjs. */
export const HOME_TITLE = `${SITE_NAME} | Humanitarian Aid in the Kurdistan Region of Iraq`;

const setMeta = (selector: string, attr: 'name' | 'property', key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

interface PageMeta {
  title: string;
  description?: string;
  /** The title already carries the brand, so don't append the site name. */
  exact?: boolean;
  /** Keep search engines out (staff pages). */
  noindex?: boolean;
}

/** Sets the document title, description and social-preview tags for a page. */
export const usePageMeta = ({ title, description, exact = false, noindex = false }: PageMeta) => {
  useEffect(() => {
    const fullTitle = !title ? SITE_NAME : exact ? title : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    if (description) {
      setMeta('meta[name="description"]', 'name', 'description', description);
      setMeta('meta[property="og:description"]', 'property', 'og:description', description);
      setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    }
    setMeta('meta[name="robots"]', 'name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
  }, [title, description, exact, noindex]);
};
