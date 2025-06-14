
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const AboutSection = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">{t('aboutTitle')}</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-lg text-gray-700 leading-relaxed">
              For over a decade, MROVDOSTAN has been dedicated to transforming lives and communities 
              across the Kurdistan region through sustainable development and humanitarian aid. 
              Founded in 2010, we emerged from a simple belief: every person deserves access to basic 
              necessities like clean water, education, healthcare, and opportunity. What started as a 
              small group of volunteers has grown into a regional movement reaching over 50 communities 
              across Kurdistan. Our work spans across multiple sectors, bringing sustainable solutions 
              to the region's most pressing challenges. We believe in empowering communities to become 
              self-sufficient, creating lasting change that spans generations. Through our comprehensive 
              programs in education, healthcare, economic development, and human rights advocacy, we 
              continue to build hope for tomorrow while addressing today's most urgent needs.
            </p>
          </div>

          <div>
            <img 
              src="https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=600&h=400&fit=crop" 
              alt="MROVDOSTAN community work" 
              className="rounded-2xl shadow-lg w-full h-96 object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
