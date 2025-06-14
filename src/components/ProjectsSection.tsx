
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const ProjectsSection = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const activities = [
    {
      id: 1,
      titleKey: 'cleanWaterTitle',
      descriptionKey: 'cleanWaterDesc',
      category: 'water',
      badgeKey: 'survey',
      date: '2024-01-15'
    },
    {
      id: 2,
      titleKey: 'educationSupportTitle',
      descriptionKey: 'educationSupportDesc',
      category: 'education',
      badgeKey: 'sustainable',
      date: '2024-01-10'
    },
    {
      id: 3,
      titleKey: 'emergencyReliefTitle',
      descriptionKey: 'emergencyReliefDesc',
      category: 'emergency',
      badgeKey: 'response',
      date: '2024-01-05'
    },
    {
      id: 4,
      titleKey: 'healthcareMobileTitle',
      descriptionKey: 'healthcareMobileDesc',
      category: 'healthcare',
      badgeKey: 'bangladesh',
      date: '2024-01-01'
    }
  ];

  const filteredActivities = activities.filter(activity => {
    const title = t(activity.titleKey);
    const description = t(activity.descriptionKey);
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || activity.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getBadgeColor = (badgeKey: string) => {
    const colors = {
      'survey': 'bg-blue-500',
      'sustainable': 'bg-blue-500',
      'response': 'bg-purple-500',
      'bangladesh': 'bg-blue-500'
    };
    return colors[badgeKey as keyof typeof colors] || 'bg-blue-500';
  };

  return (
    <section id="projects" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('projectsTitle')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('projectsDescription')}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={t('searchProjects')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allCategories')}</SelectItem>
              <SelectItem value="water">{t('water')}</SelectItem>
              <SelectItem value="education">{t('education')}</SelectItem>
              <SelectItem value="emergency">{t('emergency')}</SelectItem>
              <SelectItem value="healthcare">{t('healthcare')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {filteredActivities.map((activity) => (
            <Card key={activity.id} className="bg-white border-0 shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
              <div className="relative">
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  <div className="w-12 h-12 border-2 border-gray-300 rounded"></div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="text-sm text-gray-500 capitalize">{t(activity.category)}</span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`${getBadgeColor(activity.badgeKey)} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                    {t(activity.badgeKey)}
                  </span>
                </div>
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900">{t(activity.titleKey)}</CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {t(activity.descriptionKey)}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{activity.date}</span>
                  <Button variant="ghost" className="text-blue-600 hover:text-blue-700 p-0 h-auto font-medium">
                    {t('readMore')} →
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            {t('viewAllProjects')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
