
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHelmetProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

const SEOHelmet = ({ 
  title = 'Mercy Organization - Helping Communities Worldwide',
  description = 'Join us in making a difference. Mercy Organization works to improve lives through education, healthcare, emergency relief, and community development projects.',
  keywords = 'charity, nonprofit, humanitarian aid, education, healthcare, emergency relief, community development',
  image = '/og-image.jpg',
  url = window.location.href,
  type = 'website'
}: SEOHelmetProps) => {
  const siteName = 'Mercy Organization';
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={siteName} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={url} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#3B82F6" />
      <meta name="msapplication-TileColor" content="#3B82F6" />
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "NGO",
          "name": siteName,
          "description": description,
          "url": url,
          "logo": `${window.location.origin}/logo.png`,
          "image": image,
          "sameAs": [
            "https://facebook.com/mercyorg",
            "https://twitter.com/mercyorg",
            "https://instagram.com/mercyorg"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "availableLanguage": ["English", "Arabic", "Kurdish"]
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEOHelmet;
