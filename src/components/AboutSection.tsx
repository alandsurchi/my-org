
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const AboutSection = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">{t('aboutTitle')}</h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            For over a decade, we've been dedicated to transforming lives and communities 
            across the Kurdistan region through sustainable development and humanitarian aid.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Founded in 2010, MROVDOSTAN emerged from a simple belief: every person 
                  deserves access to basic necessities like clean water, education, healthcare, 
                  and opportunity. What started as a small group of volunteers has grown into 
                  a regional movement reaching over 50 communities across Kurdistan.
                </p>
                <p>
                  Our work spans across multiple sectors, bringing sustainable solutions to the 
                  region's most pressing challenges. We believe in empowering communities to become 
                  self-sufficient, creating lasting change that spans generations.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 pt-8">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
                <div className="text-gray-700">Communities Served</div>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">15+</div>
                <div className="text-gray-700">Years of Service</div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-100 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="text-3xl mr-3">🎯</span>
                {t('mission')}
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">{t('missionText')}</p>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="text-3xl mr-3">👁️</span>
                {t('vision')}
              </h3>
              <p className="text-gray-700 leading-relaxed">{t('visionText')}</p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Focus Areas</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <span className="text-2xl">📚</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Education</h4>
                    <p className="text-gray-600 text-sm">Building schools and providing quality education to underserved communities</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <span className="text-2xl">🏥</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Healthcare</h4>
                    <p className="text-gray-600 text-sm">Improving healthcare access and medical services</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <span className="text-2xl">💼</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Economic Development</h4>
                    <p className="text-gray-600 text-sm">Creating sustainable livelihood opportunities</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <span className="text-2xl">⚖️</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Human Rights</h4>
                    <p className="text-gray-600 text-sm">Promoting human rights and dignity for all</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
