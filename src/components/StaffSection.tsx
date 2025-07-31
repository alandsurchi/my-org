import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Users, ArrowRight } from 'lucide-react';
import { useStaff } from '@/hooks/useStaff';
import { StaffSkeleton } from '@/components/ui/staff-skeleton';
import { Link } from 'react-router-dom';

const StaffSection = () => {
  const { t } = useLanguage();
  const { data: staffMembers = [], isLoading, error } = useStaff();

  console.log('🔵 StaffSection component is rendering');
  console.log('🔵 StaffSection render - staffMembers:', staffMembers);
  console.log('🔵 StaffSection render - staffMembers length:', staffMembers?.length);
  console.log('🔵 StaffSection render - isLoading:', isLoading);
  console.log('🔵 StaffSection render - error:', error);

  if (isLoading) {
    console.log('🟡 Staff section is loading...');
    return <StaffSkeleton />;
  }

  if (error) {
    console.log('🔴 Staff section error:', error);
    return (
      <section id="staff" className="py-24 bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-gray-50 relative overflow-hidden min-h-screen">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-red-100 mb-8">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-2xl font-bold text-red-600 mb-4">Unable to Load Staff</h3>
            <p className="text-red-500 mb-6">We're having trouble loading our team members. Please try again later.</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (!staffMembers || staffMembers.length === 0) {
    console.log('🟠 No staff members found');
    return (
      <section id="staff" className="py-24 bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-gray-50 relative overflow-hidden min-h-screen">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gray-100 mb-8">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-4">No Staff Members</h3>
            <p className="text-gray-500">We're currently updating our team information.</p>
          </div>
        </div>
      </section>
    );
  }

  console.log('🟢 Rendering staff members:', staffMembers.length);
  console.log('🟢 Staff members data:', staffMembers);

  return (
    <section id="staff" className="py-24 bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-gray-50 relative overflow-hidden w-full min-h-screen">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-r from-indigo-200/20 to-blue-200/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-200/20 to-indigo-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 w-full">
        <div className="text-center mb-20 fade-in-on-scroll">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 mb-8 animate-scale-in shadow-2xl">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('staff')}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.05)' }}>
            Meet our dedicated team of professionals working tirelessly to make a positive impact in our communities.
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 mx-auto rounded-full mt-6"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-16">
          {staffMembers.map((member, index) => {
            console.log('🟢 Rendering individual staff member:', member);
            return (
              <Card key={member.id} className="group bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden rounded-3xl hover-lift fade-in-on-scroll w-full" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-8 text-center">
                  <div className="relative mb-6">
                    {/* Circular image with gradient border */}
                    <div className="relative mx-auto w-32 h-32 mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 rounded-full p-1">
                        <img
                          src={member.image_url || 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                          alt={member.name}
                          className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.05)' }}>
                      {member.name}
                    </h3>
                    <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider">{member.position}</p>
                    
                    <p className="text-gray-600 text-sm leading-relaxed" style={{ textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.05)' }}>
                      {member.bio}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* See All Staff Button */}
        <div className="text-center fade-in-on-scroll">
          <Link to="/staff">
            <Button 
              className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 hover:from-indigo-700 hover:via-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group"
            >
              See All Staff
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default StaffSection;
