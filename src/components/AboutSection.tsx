
import React, { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Heart, Users, Globe, Target } from 'lucide-react';

const AboutSection = () => {
  const { t } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.fade-in-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const stats = [
    { icon: Users, number: '50+', label: 'Communities Served' },
    { icon: Heart, number: '10K+', label: 'Lives Impacted' },
    { icon: Globe, number: '15+', label: 'Years of Service' },
    { icon: Target, number: '100+', label: 'Projects Completed' }
  ];

  return (
    <section id="about" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-purple-200 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-200 rounded-full opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center mb-20 fade-in-on-scroll">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 mb-6 animate-scale-in">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            About MROVDOSTAN
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={index} 
                className="text-center p-6 glass rounded-2xl hover-lift fade-in-on-scroll hover-scale"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 mb-4 animate-glow">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="fade-in-on-scroll">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed mb-6 font-light">
                For over a decade, <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">MROVDOSTAN</span> has been dedicated to transforming lives and communities across the Kurdistan region through sustainable development and humanitarian aid.
              </p>
              
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Founded in 2010, we emerged from a simple belief: every person deserves access to basic necessities like clean water, education, healthcare, and opportunity. What started as a small group of volunteers has grown into a regional movement reaching over 50 communities across Kurdistan.
              </p>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                Through our comprehensive programs in education, healthcare, economic development, and human rights advocacy, we continue to build hope for tomorrow while addressing today's most urgent needs.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-1">Our Vision</h4>
                <p className="text-sm text-blue-600">Empowered communities across Kurdistan</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-1">Our Mission</h4>
                <p className="text-sm text-purple-600">Sustainable development & humanitarian aid</p>
              </div>
            </div>
          </div>

          <div className="fade-in-on-scroll">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=600&h=400&fit=crop" 
                alt="MROVDOSTAN community work" 
                className="rounded-3xl shadow-2xl w-full h-96 object-cover hover-lift"
              />
              
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 animate-float"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
              
              {/* Glass overlay with stats */}
              <div className="absolute bottom-6 left-6 right-6 glass rounded-2xl p-4">
                <div className="flex justify-between items-center text-white">
                  <div>
                    <div className="text-2xl font-bold">2010</div>
                    <div className="text-sm opacity-80">Founded</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">50+</div>
                    <div className="text-sm opacity-80">Communities</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">∞</div>
                    <div className="text-sm opacity-80">Impact</div>
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
