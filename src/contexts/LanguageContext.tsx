
import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'ar' | 'ku';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    about: 'About',
    projects: 'Projects',
    news: 'News',
    gallery: 'Gallery',
    login: 'Staff Login',
    
    // Hero section
    heroTitle: 'Building Hope for Tomorrow',
    heroSubtitle: 'MROVDOSTAN is dedicated to creating lasting change in communities through education, healthcare, and sustainable development programs.',
    donateNow: 'Donate Now',
    learnMore: 'Learn More',
    
    // About section
    aboutTitle: 'About MROVDOSTAN',
    mission: 'Our Mission',
    missionText: 'To empower communities through sustainable development, education, and healthcare initiatives that create lasting positive change.',
    vision: 'Our Vision',
    visionText: 'A world where every individual has access to quality education, healthcare, and opportunities for growth.',
    goals: 'Our Goals',
    goal1: 'Provide quality education to underserved communities',
    goal2: 'Improve healthcare access and services',
    goal3: 'Foster sustainable economic development',
    goal4: 'Promote human rights and dignity',
    
    // Projects section
    projectsTitle: 'Our Projects',
    allCategories: 'All Categories',
    education: 'Education',
    healthcare: 'Healthcare',
    searchProjects: 'Search projects...',
    viewAllProjects: 'View All Projects',
    
    // News section
    newsTitle: 'Latest News',
    placesVisited: 'Places Visited',
    visitorsToOrg: 'Visitors to Organization',
    certificatesReceived: 'Certificates Received',
    certificatesAwarded: 'Certificates Awarded',
    searchNews: 'Search news...',
    viewAllNews: 'View All News',
    
    // Gallery section
    galleryTitle: 'Gallery',
    viewAllImages: 'View All Images',
    
    // Login
    staffLogin: 'Staff Login',
    email: 'Email',
    password: 'Password',
    loginButton: 'Login',
    cancel: 'Cancel'
  },
  ar: {
    // Navigation
    about: 'حول',
    projects: 'المشاريع',
    news: 'الأخبار',
    gallery: 'المعرض',
    login: 'دخول الموظفين',
    
    // Hero section
    heroTitle: 'بناء الأمل للغد',
    heroSubtitle: 'مروڤدوستان مكرسة لإحداث تغيير دائم في المجتمعات من خلال برامج التعليم والرعاية الصحية والتنمية المستدامة.',
    donateNow: 'تبرع الآن',
    learnMore: 'اعرف أكثر',
    
    // About section
    aboutTitle: 'حول مروڤدوستان',
    mission: 'مهمتنا',
    missionText: 'تمكين المجتمعات من خلال التنمية المستدامة ومبادرات التعليم والرعاية الصحية التي تخلق تغييراً إيجابياً دائماً.',
    vision: 'رؤيتنا',
    visionText: 'عالم يحصل فيه كل فرد على تعليم ورعاية صحية وفرص نمو عالية الجودة.',
    goals: 'أهدافنا',
    goal1: 'توفير تعليم جيد للمجتمعات المحرومة',
    goal2: 'تحسين الوصول إلى خدمات الرعاية الصحية',
    goal3: 'تعزيز التنمية الاقتصادية المستدامة',
    goal4: 'تعزيز حقوق الإنسان والكرامة',
    
    // Projects section
    projectsTitle: 'مشاريعنا',
    allCategories: 'جميع الفئات',
    education: 'التعليم',
    healthcare: 'الرعاية الصحية',
    searchProjects: 'البحث في المشاريع...',
    viewAllProjects: 'عرض جميع المشاريع',
    
    // News section
    newsTitle: 'آخر الأخبار',
    placesVisited: 'الأماكن المزارة',
    visitorsToOrg: 'زوار المنظمة',
    certificatesReceived: 'الشهادات المستلمة',
    certificatesAwarded: 'الشهادات الممنوحة',
    searchNews: 'البحث في الأخبار...',
    viewAllNews: 'عرض جميع الأخبار',
    
    // Gallery section
    galleryTitle: 'المعرض',
    viewAllImages: 'عرض جميع الصور',
    
    // Login
    staffLogin: 'دخول الموظفين',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    loginButton: 'تسجيل الدخول',
    cancel: 'إلغاء'
  },
  ku: {
    // Navigation
    about: 'دەربارە',
    projects: 'پڕۆژەکان',
    news: 'هەواڵ',
    gallery: 'گالەری',
    login: 'چوونەژوورەوەی کارمەندان',
    
    // Hero section
    heroTitle: 'ئومێد دروستکردن بۆ سبەینێ',
    heroSubtitle: 'مروڤدۆستان خۆی تەرخان کردووە بۆ دروستکردنی گۆڕانکاری بەردەوام لە کۆمەڵگاکاندا لە ڕێگەی پڕۆگرامەکانی پەروەردە، چاودێری تەندروستی و گەشەسەندنی بەردەوام.',
    donateNow: 'ئێستا بەخشین بکە',
    learnMore: 'زیاتر فێربە',
    
    // About section
    aboutTitle: 'دەربارەی مروڤدۆستان',
    mission: 'ئەرکەکەمان',
    missionText: 'بەهێزکردنی کۆمەڵگاکان لە ڕێگەی گەشەسەندنی بەردەوام، پەروەردە و دەستپێشخەریەکانی چاودێری تەندروستی کە گۆڕانکاری ئەرێنی بەردەوام دروست دەکەن.',
    vision: 'بینینەکەمان',
    visionText: 'جیهانێک کە هەر تاکێک دەستی بە پەروەردە، چاودێری تەندروستی و دەرفەتەکانی گەشەکردنی کوالیتی بەرز هەبێت.',
    goals: 'ئامانجەکانمان',
    goal1: 'دابینکردنی پەروەردەی کوالیتی بۆ کۆمەڵگا بێبەشەکان',
    goal2: 'باشترکردنی دەستڕاگەیشتن و خزمەتگوزاریەکانی چاودێری تەندروستی',
    goal3: 'پەرەپێدانی گەشەسەندنی ئابووری بەردەوام',
    goal4: 'پەرەپێدانی مافەکانی مرۆڤ و کەرامەت',
    
    // Projects section
    projectsTitle: 'پڕۆژەکانمان',
    allCategories: 'هەموو پۆلەکان',
    education: 'پەروەردە',
    healthcare: 'چاودێری تەندروستی',
    searchProjects: 'گەڕان لە پڕۆژەکان...',
    viewAllProjects: 'بینینی هەموو پڕۆژەکان',
    
    // News section
    newsTitle: 'تازەترین هەواڵ',
    placesVisited: 'شوێنە سەردانکراوەکان',
    visitorsToOrg: 'میوانەکانی ڕێکخراوە',
    certificatesReceived: 'بڕوانامە وەرگیراوەکان',
    certificatesAwarded: 'بڕوانامە دراوەکان',
    searchNews: 'گەڕان لە هەواڵ...',
    viewAllNews: 'بینینی هەموو هەواڵەکان',
    
    // Gallery section
    galleryTitle: 'گالەری',
    viewAllImages: 'بینینی هەموو وێنەکان',
    
    // Login
    staffLogin: 'چوونەژوورەوەی کارمەندان',
    email: 'ئیمەیڵ',
    password: 'وشەی نهێنی',
    loginButton: 'چوونەژوور',
    cancel: 'پاشگەزبوونەوە'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
