
import React, { useState } from 'react';
import { Search, ArrowLeft, Camera, Eye, Heart, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGallery, GalleryPhoto } from '@/hooks/useGalleryAPI';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AllGallery = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);
  const { data: galleryImages = [], isLoading, error } = useGallery();

  const normalizedImages: GalleryPhoto[] = galleryImages.map((item, index) => ({
    ...item,
    id: item.id || String(index),
    url: item.url || '',
    title: item.title || 'Gallery photo',
    description: item.description || item.caption || ''
  }));

  const filteredImages = normalizedImages.filter(image => {
    return image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           image.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="py-24 flex items-center justify-center">
          <div className="animate-pulse text-lg">Loading gallery...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="py-24 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-2">Error loading gallery</div>
            <div className="text-gray-500 text-sm">{error.message}</div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <section className="py-24 bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Gallery
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our collection of impactful moments and community stories through images.
            </p>
          </div>

          <div className="mb-8">
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-0 bg-white/80 backdrop-blur-sm shadow-lg rounded-xl"
              />
            </div>
          </div>

          {filteredImages.length === 0 ? (
            <div className="text-center py-16 bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white">
                  <ImageOff className="w-7 h-7" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No photos yet</h3>
              <p className="text-gray-600 mb-6">There are no gallery items available right now.</p>
              <Button variant="outline" onClick={() => setSearchTerm('')}>Clear search</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredImages.map((image, index) => (
                <div 
                  key={image.id || index} 
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
                  onMouseEnter={() => setHoveredImage(Number(index))}
                  onMouseLeave={() => setHoveredImage(null)}
                >
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img 
                      src={image.url || '/placeholder.svg'} 
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  
                  {/* Hover overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${hoveredImage === Number(index) ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-lg font-bold mb-2">{image.title}</h3>
                      <p className="text-sm text-white/80 mb-3 line-clamp-2">{image.description || ' '}</p>
                      <div className="flex items-center gap-4 text-sm">
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
                    <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AllGallery;
