
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const AboutSection = () => {
  const { t } = useLanguage();

  const goals = [
    { key: 'goal1', icon: '📚' },
    { key: 'goal2', icon: '🏥' },
    { key: 'goal3', icon: '💼' },
    { key: 'goal4', icon: '⚖️' }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('aboutTitle')}</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-3xl mr-3">🎯</span>
                {t('mission')}
              </h3>
              <p className="text-gray-700 leading-relaxed">{t('missionText')}</p>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-3xl mr-3">👁️</span>
                {t('vision')}
              </h3>
              <p className="text-gray-700 leading-relaxed">{t('visionText')}</p>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="text-3xl mr-3">🎯</span>
              {t('goals')}
            </h3>
            <div className="space-y-4">
              {goals.map((goal, index) => (
                <div key={goal.key} className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-2xl">{goal.icon}</span>
                  <span className="text-gray-700 leading-relaxed">{t(goal.key)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
