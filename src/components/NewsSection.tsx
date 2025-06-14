
import React, { useState } from 'react';
import { Search, Calendar, ArrowRight, Award, Users, Building, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const NewsSection = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const newsData = {
    placesVisited: [
      { 
        id: 1, 
        titleKey: 'erbilSchoolsTitle', 
        date: '2024-06-10', 
        descriptionKey: 'erbilSchoolsDesc',
        image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=250&fit=crop',
        icon: Building
      },
      { 
        id: 2, 
        titleKey: 'dohukHealthcareTitle', 
        date: '2024-06-05', 
        descriptionKey: 'dohukHealthcareDesc',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop',
        icon: Building
      },
      {
        id: 3,
        title: 'Community Center Visit in Sulaymaniyah',
        date: '2024-05-28',
        description: 'Our team visited the new community center in Sulaymaniyah to assess infrastructure needs and discuss potential collaboration opportunities.',
        image: 'https://images.unsplash.com/photo-1527576539890-dfa815648363?w=400&h=250&fit=crop',
        icon: Building
      },
      {
        id: 4,
        title: 'Rural Villages Assessment in Zakho',
        date: '2024-05-20',
        description: 'Comprehensive assessment of rural villages in Zakho district to identify priority areas for development projects.',
        image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=250&fit=crop',
        icon: Building
      },
      {
        id: 5,
        title: 'University Partnership Meeting in Baghdad',
        date: '2024-05-15',
        description: 'Met with university representatives in Baghdad to discuss educational partnerships and research collaboration opportunities.',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=250&fit=crop',
        icon: Building
      }
    ],
    visitors: [
      { 
        id: 1, 
        titleKey: 'unVisitTitle', 
        date: '2024-06-08', 
        descriptionKey: 'unVisitDesc',
        image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=250&fit=crop',
        icon: Users
      },
      { 
        id: 2, 
        titleKey: 'govMeetingTitle', 
        date: '2024-06-03', 
        descriptionKey: 'govMeetingDesc',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
        icon: Users
      },
      {
        id: 3,
        title: 'European Union Delegation Visit',
        date: '2024-05-25',
        description: 'High-level delegation from the European Union visited our headquarters to discuss ongoing humanitarian projects and future funding opportunities.',
        image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=250&fit=crop',
        icon: Users
      },
      {
        id: 4,
        title: 'International Red Cross Coordination Meeting',
        date: '2024-05-18',
        description: 'Collaborative meeting with International Red Cross representatives to coordinate emergency response efforts in the region.',
        image: 'https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?w=400&h=250&fit=crop',
        icon: Users
      },
      {
        id: 5,
        title: 'Local Community Leaders Forum',
        date: '2024-05-12',
        description: 'Monthly forum with local community leaders to discuss ongoing projects and gather feedback from grassroots organizations.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop',
        icon: Users
      }
    ],
    certificatesReceived: [
      { 
        id: 1, 
        titleKey: 'excellenceAwardTitle', 
        date: '2024-05-30', 
        descriptionKey: 'excellenceAwardDesc',
        image: 'https://images.unsplash.com/photo-1569025743873-ea3a9ade89f9?w=400&h=250&fit=crop',
        icon: Award
      },
      { 
        id: 2, 
        titleKey: 'healthcareInnovationTitle', 
        date: '2024-05-25', 
        descriptionKey: 'healthcareInnovationDesc',
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop',
        icon: Award
      },
      {
        id: 3,
        title: 'UNESCO Recognition for Education Programs',
        date: '2024-05-10',
        description: 'Received official recognition from UNESCO for our innovative education programs serving displaced communities in Kurdistan Region.',
        image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=250&fit=crop',
        icon: Award
      },
      {
        id: 4,
        title: 'WHO Certificate for Health Initiative',
        date: '2024-04-28',
        description: 'World Health Organization certified our mobile health clinics program as a model for rural healthcare delivery in conflict-affected areas.',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop',
        icon: Award
      },
      {
        id: 5,
        title: 'UNICEF Partnership Certification',
        date: '2024-04-15',
        description: 'Achieved official partnership status with UNICEF for our child protection and education programs across Iraq.',
        image: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=400&h=250&fit=crop',
        icon: Award
      }
    ],
    certificatesAwarded: [
      { 
        id: 1, 
        titleKey: 'communityLeaderTitle', 
        date: '2024-06-01', 
        descriptionKey: 'communityLeaderDesc',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop',
        icon: Trophy
      },
      { 
        id: 2, 
        titleKey: 'volunteerExcellenceTitle', 
        date: '2024-05-28', 
        descriptionKey: 'volunteerExcellenceDesc',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=250&fit=crop',
        icon: Trophy
      },
      {
        id: 3,
        title: 'Outstanding Healthcare Worker Recognition',
        date: '2024-05-22',
        description: 'Awarded certificates to 15 local healthcare workers for their exceptional service during the COVID-19 pandemic response.',
        image: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=400&h=250&fit=crop',
        icon: Trophy
      },
      {
        id: 4,
        title: 'Teacher Training Program Graduates',
        date: '2024-05-14',
        description: 'Celebrated 25 teachers who completed our specialized training program for teaching children in emergency situations.',
        image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=250&fit=crop',
        icon: Trophy
      },
      {
        id: 5,
        title: 'Youth Leadership Development Awards',
        date: '2024-05-08',
        description: 'Recognized 30 young leaders who completed our youth empowerment and leadership development program.',
        image: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400&h=250&fit=crop',
        icon: Trophy
      },
      {
        id: 6,
        title: 'Women Entrepreneurs Certification',
        date: '2024-04-30',
        description: 'Awarded business certificates to 20 women who successfully completed our entrepreneurship training and micro-finance program.',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=250&fit=crop',
        icon: Trophy
      }
    ]
  };

  const filterNews = (newsItems: any[]) => {
    return newsItems.filter(item => {
      const title = item.titleKey ? t(item.titleKey) : item.title;
      const description = item.descriptionKey ? t(item.descriptionKey) : item.description;
      return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             description.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  const getTabIcon = (tabValue: string) => {
    const icons = {
      'placesVisited': '📍',
      'visitors': '👥',
      'certificatesReceived': '🏆',
      'certificatesAwarded': '🎖️'
    };
    return icons[tabValue as keyof typeof icons] || '📰';
  };

  const renderNewsGrid = (newsItems: any[]) => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filterNews(newsItems).map((item, index) => {
        const IconComponent = item.icon;
        const title = item.titleKey ? t(item.titleKey) : item.title;
        const description = item.descriptionKey ? t(item.descriptionKey) : item.description;
        
        return (
          <Card key={item.id} className="group bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden rounded-3xl hover-lift fade-in-on-scroll" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="relative overflow-hidden">
              <img 
                src={item.image} 
                alt={title}
                className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              <div className="absolute top-4 right-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="absolute bottom-4 left-4 flex items-center text-white/90 text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                {item.date}
              </div>
            </div>
            
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.05)' }}>
                {title}
              </CardTitle>
              <CardDescription className="text-gray-600 leading-relaxed line-clamp-3" style={{ textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.05)' }}>
                {description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-0">
              <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium group/btn justify-between">
                {t('readMore')}
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  return (
    <section id="news" className="py-24 bg-gradient-to-br from-purple-50/30 via-blue-50/20 to-gray-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-32 right-10 w-80 h-80 bg-gradient-to-r from-purple-200/20 to-blue-200/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-32 left-10 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-green-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-pink-200/20 to-purple-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20 fade-in-on-scroll">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-purple-600 to-blue-600 mb-8 animate-scale-in shadow-2xl">
            <span className="text-3xl">📰</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {t('newsTitle')}
            </span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 mx-auto rounded-full"></div>
        </div>

        <div className="relative mb-12 fade-in-on-scroll">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder={t('searchNews')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 border-0 bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl max-w-lg mx-auto focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>

        <Tabs defaultValue="placesVisited" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-12 bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-2 h-auto">
            {Object.keys(newsData).map((key) => (
              <TabsTrigger 
                key={key}
                value={key} 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl py-3 px-4 flex items-center gap-2 font-medium transition-all duration-300"
              >
                <span className="text-lg">{getTabIcon(key)}</span>
                <span className="hidden sm:inline">{t(key)}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="placesVisited" className="mt-8">
            {renderNewsGrid(newsData.placesVisited)}
          </TabsContent>

          <TabsContent value="visitors" className="mt-8">
            {renderNewsGrid(newsData.visitors)}
          </TabsContent>

          <TabsContent value="certificatesReceived" className="mt-8">
            {renderNewsGrid(newsData.certificatesReceived)}
          </TabsContent>

          <TabsContent value="certificatesAwarded" className="mt-8">
            {renderNewsGrid(newsData.certificatesAwarded)}
          </TabsContent>
        </Tabs>

        <div className="text-center mt-16 fade-in-on-scroll">
          <Button size="lg" className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white font-medium px-8 py-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105">
            {t('viewAllNews')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
