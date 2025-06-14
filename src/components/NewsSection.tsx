
import React, { useState } from 'react';
import { Search } from 'lucide-react';
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
      { id: 1, title: 'Visit to Erbil Schools', date: '2024-06-10', description: 'Successful visit to 5 schools in Erbil province' },
      { id: 2, title: 'Dohuk Healthcare Assessment', date: '2024-06-05', description: 'Comprehensive assessment of healthcare needs in Dohuk' }
    ],
    visitors: [
      { id: 1, title: 'UN Representative Visit', date: '2024-06-08', description: 'Meeting with UN officials to discuss collaboration' },
      { id: 2, title: 'Government Officials Meeting', date: '2024-06-03', description: 'Strategic planning session with local government' }
    ],
    certificatesReceived: [
      { id: 1, title: 'Excellence in Education Award', date: '2024-05-30', description: 'Recognition for outstanding educational initiatives' },
      { id: 2, title: 'Healthcare Innovation Certificate', date: '2024-05-25', description: 'Acknowledgment for innovative healthcare solutions' }
    ],
    certificatesAwarded: [
      { id: 1, title: 'Community Leader Certification', date: '2024-06-01', description: 'Awarded to outstanding community leaders' },
      { id: 2, title: 'Volunteer Excellence Award', date: '2024-05-28', description: 'Recognition for dedicated volunteers' }
    ]
  };

  const filterNews = (newsItems: any[]) => {
    return newsItems.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <section id="news" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('newsTitle')}</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={t('searchNews')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 max-w-md mx-auto"
          />
        </div>

        <Tabs defaultValue="placesVisited" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="placesVisited">{t('placesVisited')}</TabsTrigger>
            <TabsTrigger value="visitors">{t('visitorsToOrg')}</TabsTrigger>
            <TabsTrigger value="certificatesReceived">{t('certificatesReceived')}</TabsTrigger>
            <TabsTrigger value="certificatesAwarded">{t('certificatesAwarded')}</TabsTrigger>
          </TabsList>

          <TabsContent value="placesVisited" className="mt-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterNews(newsData.placesVisited).map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.date}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="visitors" className="mt-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterNews(newsData.visitors).map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.date}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="certificatesReceived" className="mt-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterNews(newsData.certificatesReceived).map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.date}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="certificatesAwarded" className="mt-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterNews(newsData.certificatesAwarded).map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.date}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-12">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            {t('viewAllNews')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
