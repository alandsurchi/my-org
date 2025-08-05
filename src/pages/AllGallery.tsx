
import React, { useState } from 'react';
import { Search, ArrowLeft, Camera, Eye, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGallery } from '@/hooks/useGalleryAPI';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AllGallery = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);
  const { data: galleryImages = [], isLoading } = useGallery();

  // Fallback static images if no data from backend
  const fallbackImages = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      title: 'Children Education Program',
      description: 'Educational initiatives for underprivileged children'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1439886183900-e79ec0057170?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      title: 'Community Health Initiative',
      description: 'Healthcare programs in rural communities'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      title: 'Environmental Conservation',
      description: 'Wildlife protection and environmental awareness'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      title: 'Agricultural Development',
      description: 'Supporting farmers with modern techniques'
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      title: 'Women Empowerment Workshop',
      description: 'Skills training and empowerment programs'
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      title: 'Technology Training',
      description: 'Digital literacy and technology education'
    }
  ];

  // Use backend data if available, otherwise fallback to static data
  const displayImages = galleryImages.length > 0 
    ? galleryImages.map((item) => ({
        id: item.id,
        url: item.image_url || '',
        title: item.title,
        description: item.description || ''
      }))
    : fallbackImages;

  const filteredImages = displayImages.filter(image => {
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
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">No images found matching your search.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredImages.map((image, index) => (
                <div 
                  key={image.id} 
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
                  onMouseEnter={() => setHoveredImage(Number(image.id))}
                  onMouseLeave={() => setHoveredImage(null)}
                >
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={image.url} 
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  
                  {/* Hover overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${hoveredImage === Number(image.id) ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-lg font-bold mb-2">{image.title}</h3>
                      <p className="text-sm text-white/80 mb-3">{image.description}</p>
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
