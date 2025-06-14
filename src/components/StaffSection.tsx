
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Users, MapPin, Calendar, Award } from 'lucide-react';

const StaffSection = () => {
  const { t } = useLanguage();

  const staffMembers = [
    {
      id: 1,
      nameKey: 'drAhmadName',
      positionKey: 'drAhmadPosition',
      image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bioKey: 'drAhmadBio',
      experience: '15+ years',
      location: 'Erbil',
      specialization: 'Healthcare Leadership'
    },
    {
      id: 2,
      nameKey: 'sarahName',
      positionKey: 'sarahPosition',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bioKey: 'sarahBio',
      experience: '10+ years',
      location: 'Dohuk',
      specialization: 'Education Development'
    },
    {
      id: 3,
      nameKey: 'omarName',
      positionKey: 'omarPosition',
      image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bioKey: 'omarBio',
      experience: '8+ years',
      location: 'Sulaymaniyah',
      specialization: 'Community Engagement'
    },
    {
      id: 4,
      nameKey: 'rojinName',
      positionKey: 'rojinPosition',
      image: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bioKey: 'rojinBio',
      experience: '12+ years',
      location: 'Baghdad',
      specialization: 'Mobile Healthcare'
    }
  ];

  return (
    <section id="staff" className="py-24 bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-gray-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-r from-indigo-200/20 to-blue-200/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-200/20 to-indigo-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20 fade-in-on-scroll">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 mb-8 animate-scale-in shadow-2xl">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('staffTitle')}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.05)' }}>
            {t('staffDescription')}
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 mx-auto rounded-full mt-6"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {staffMembers.map((member, index) => (
            <Card key={member.id} className="group bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden rounded-3xl hover-lift fade-in-on-scroll" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={member.image}
                    alt={t(member.nameKey)}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Floating badge */}
                  <div className="absolute top-4 right-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  {/* Experience badge */}
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-white text-sm font-medium">{member.experience}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.05)' }}>
                    {t(member.nameKey)}
                  </h3>
                  <p className="text-blue-600 font-semibold mb-3">{t(member.positionKey)}</p>
                  
                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="w-4 h-4 mr-2" />
                      {member.location}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Award className="w-4 h-4 mr-2" />
                      {member.specialization}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3" style={{ textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.05)' }}>
                    {t(member.bioKey)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16 fade-in-on-scroll">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('joinTeamTitle')}</h3>
            <p className="text-gray-600 mb-6">{t('joinTeamDescription')}</p>
            <button className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 hover:from-indigo-700 hover:via-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-medium transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105">
              {t('joinTeam')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StaffSection;
