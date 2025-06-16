
import React, { useState } from 'react';
import { Search, ArrowLeft, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStaff } from '@/hooks/useStaff';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AllStaff = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: staffMembers = [], isLoading } = useStaff();

  const filteredStaff = staffMembers.filter(member => {
    const name = member.name_en || '';
    const position = member.position_en || '';
    const bio = member.bio_en || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           position.toLowerCase().includes(searchTerm.toLowerCase()) ||
           bio.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="py-24 flex items-center justify-center">
          <div className="animate-pulse text-lg">Loading staff...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <section className="py-24 bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-gray-50">
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
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Our Team
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet our dedicated team of professionals working tirelessly to make a positive impact in our communities.
            </p>
          </div>

          <div className="mb-8">
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-0 bg-white/80 backdrop-blur-sm shadow-lg rounded-xl"
              />
            </div>
          </div>

          {filteredStaff.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">
                {staffMembers.length === 0 ? 'No staff members found.' : 'No staff members match your search.'}
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredStaff.map((member, index) => (
                <Card key={member.id} className="group bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl">
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-6">
                      <div className="relative mx-auto w-24 h-24 mb-4">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 rounded-full p-1">
                          <img
                            src={member.image_url || 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                            alt={member.name_en}
                            className="w-full h-full object-cover rounded-full transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                        {member.name_en}
                      </h3>
                      <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider">{member.position_en}</p>
                      
                      {member.bio_en && (
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                          {member.bio_en}
                        </p>
                      )}
                      
                      {member.email && (
                        <p className="text-gray-500 text-xs">{member.email}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AllStaff;
