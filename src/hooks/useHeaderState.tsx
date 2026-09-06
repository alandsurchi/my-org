
import { useState, useEffect } from 'react';

export const useHeaderState = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isInHeroSection, setIsInHeroSection] = useState(true);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);
      
      // Check if we're in the hero section (top of the page)
      const heroSection = document.querySelector('section');
      if (heroSection) {
        const heroHeight = heroSection.offsetHeight;
        setIsInHeroSection(scrollY < heroHeight - 100); // Give some buffer
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            if (sectionId) {
              setActiveSection(sectionId);
            } else {
              // If no id, assume it's the hero section (home)
              setActiveSection('home');
            }
          }
        });
      },
      {
        threshold: 0.15, // Section needs to be 15% visible to be considered active (more responsive)
        rootMargin: '-80px 0px -80px 0px' // Offset to account for header height
      }
    );

    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section) => {
      // Observe all sections that have an id attribute
      if (section.id) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isScrolled,
    isInHeroSection,
    activeSection,
    setActiveSection
  };
};
