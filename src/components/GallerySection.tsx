import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Camera, Eye, Heart, ImageOff } from 'lucide-react';
import { useGallery } from '@/hooks/useGalleryAPI';
import { Link } from 'react-router-dom';

const GallerySection = () => {
  const { t } = useLanguage();
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);
  const { data: galleryImages = [], isLoading } = useGallery();

  if (isLoading) {
    return (
      <section id="gallery" className="py-24 bg-gradient-to-br from-purple-50/30 dark:from-gray-950 via-pink-50/20 dark:via-gray-950 to-gray-50 dark:to-gray-950 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="animate-pulse">Loading gallery...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-24 bg-gradient-to-br from-purple-50/30 dark:from-gray-950 via-pink-50/20 dark:via-gray-950 to-gray-50 dark:to-gray-950 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-32 right-10 w-80 h-80 bg-gradient-to-r from-pink-200/20 to-purple-200/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-32 left-10 w-96 h-96 bg-gradient-to-r from-purple-200/20 to-blue-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-blue-200/20 to-pink-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20 fade-in-on-scroll">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-pink-600 to-purple-600 mb-8 animate-scale-in shadow-2xl">
            <Camera className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              {t('galleryTitle')}
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.05)' }}>
            {t('galleryDescription')}
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 mx-auto rounded-full mt-6"></div>
        </div>

        {galleryImages.length === 0 ? (
          <div className="text-center py-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white">
                <ImageOff className="w-7 h-7" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('galleryTitle')}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{t('galleryDescription')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {galleryImages.slice(0, 6).map((image, index) => (
              <div 
                key={image.id || index} 
                className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover-lift fade-in-on-scroll bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
                style={{ animationDelay: `${index * 0.1}s` }}
                onMouseEnter={() => setHoveredImage(Number(index))}
                onMouseLeave={() => setHoveredImage(null)}
              >
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={image.url || '/placeholder.svg'} 
                    alt={image.title || t('galleryTitle')}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                {/* Category badge */}
                <div className="absolute top-4 left-4">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-2">
                  <Camera className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">{t('gallery')}</span>
                </div>
              </div>

                {/* Hover overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${hoveredImage === Number(index) ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl font-bold mb-2">{image.title || t('galleryTitle')}</h3>
                    <div className="flex items-center gap-4 text-sm text-white/80">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>Like</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating action button */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center fade-in-on-scroll">
          <Link to="/gallery">
            <Button size="lg" className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 hover:from-pink-700 hover:via-purple-700 hover:to-blue-700 text-white font-medium px-8 py-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105">
              <Camera className="w-5 h-5 mr-2" />
              {t('viewAllImages')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
