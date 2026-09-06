import { useEffect } from 'react';

const SELECTOR = '.fade-in-on-scroll';

const isInViewport = (el: Element) => {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
};

/**
 * Reveals every `.fade-in-on-scroll` element when it enters the viewport.
 *
 * A single IntersectionObserver is shared for the whole page, and a
 * MutationObserver picks up elements that mount later (sections behind
 * Suspense or the API health check), so nothing stays invisible. Elements
 * already on screen are revealed synchronously so above-the-fold content
 * never waits on observer timing.
 */
export const useScrollReveal = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reveal = (el: Element) => el.classList.add('animate');
    const revealAll = () => document.querySelectorAll(SELECTOR).forEach(reveal);

    // Reduced-motion users (and very old browsers) get the content immediately.
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealAll();
      const mo = new MutationObserver(revealAll);
      mo.observe(document.body, { childList: true, subtree: true });
      return () => mo.disconnect();
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -5% 0px' }
    );

    const observeAll = () => {
      document.querySelectorAll(SELECTOR).forEach((el) => {
        if (el.classList.contains('animate')) return;
        if (isInViewport(el)) reveal(el);
        else io.observe(el);
      });
    };

    observeAll();
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });

    // Safety net for browsers that throttle observers on background tabs.
    const onScroll = () => observeAll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      mo.disconnect();
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
};

/** Drop-in component so the hook can live inside the router tree. */
export const ScrollReveal = () => {
  useScrollReveal();
  return null;
};
