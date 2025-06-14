
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Users } from 'lucide-react';

const StaffSection = () => {
  const { t } = useLanguage();

  const staffMembers = [
    {
      id: 1,
      nameKey: 'drAhmadName',
      positionKey: 'drAhmadPosition',
      image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bioKey: 'drAhmadBio'
    },
    {
      id: 2,
      nameKey: 'sarahName',
      positionKey: 'sarahPosition',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bioKey: 'sarahBio'
    },
    {
      id: 3,
      nameKey: 'omarName',
      positionKey: 'omarPosition',
      image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bioKey: 'omarBio'
    },
    {
      id: 4,
      nameKey: 'rojinName',
      positionKey: 'rojinPosition',
      image: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bioKey: 'rojinBio'
    }
  ];

  return (
    <section id="staff" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Users className="w-10 h-10 text-blue-600" />
            {t('staffTitle')}
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {staffMembers.map((member) => (
            <Card key={member.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-6 text-center">
                <div className="relative mb-6">
                  <img
                    src={member.image}
                    alt={t(member.nameKey)}
                    className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-blue-100 group-hover:border-blue-300 transition-colors"
                  />
                  <div className="absolute inset-0 rounded-full bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t(member.nameKey)}</h3>
                <p className="text-blue-600 font-semibold mb-3">{t(member.positionKey)}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{t(member.bioKey)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StaffSection;
