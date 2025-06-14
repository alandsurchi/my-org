
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
    home: 'Home',
    about: 'About',
    projects: 'Activities',
    news: 'News',
    gallery: 'Gallery',
    staff: 'Staff',
    login: 'Staff Login',
    signUp: 'Sign Up',
    join: 'Join',
    
    // Hero section
    heroTitle: 'Building Hope for Tomorrow',
    heroSubtitle: 'MROVDOSTAN is dedicated to creating lasting change in communities through education, healthcare, and sustainable development programs.',
    donateNow: 'Donate Now',
    learnMore: 'Learn More',
    
    // About section
    aboutTitle: 'About MROVDOSTAN',
    aboutDescription: 'For over a decade, MROVDOSTAN has been dedicated to transforming lives and communities across the Kurdistan region through sustainable development and humanitarian aid. Founded in 2010, we emerged from a simple belief: every person deserves access to basic necessities like clean water, education, healthcare, and opportunity. What started as a small group of volunteers has grown into a regional movement reaching over 50 communities across Kurdistan. Through our comprehensive programs in education, healthcare, economic development, and human rights advocacy, we continue to build hope for tomorrow while addressing today\'s most urgent needs.',
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
    projectsTitle: 'Our Activities',
    projectsDescription: 'See how we\'re making a difference in communities around the world through our comprehensive programs',
    allCategories: 'All Categories',
    education: 'Education',
    healthcare: 'Healthcare',
    water: 'Water & Sanitation',
    emergency: 'Emergency Relief',
    searchProjects: 'Search activities...',
    viewAllProjects: 'View All Activities',
    readMore: 'Read More',
    
    // Project items
    cleanWaterTitle: 'Clean Water Initiative',
    cleanWaterDesc: 'Bringing clean water to rural communities through sustainable well construction and maintenance programs.',
    educationSupportTitle: 'Education Support Program',
    educationSupportDesc: 'Providing school supplies, scholarships, and educational infrastructure to underprivileged children.',
    emergencyReliefTitle: 'Emergency Relief Effort',
    emergencyReliefDesc: 'Disaster response providing food, shelter, medical aid, and psychological support to affected families.',
    healthcareMobileTitle: 'Healthcare Mobile Clinic',
    healthcareMobileDesc: 'Mobile medical units providing primary healthcare services to remote rural communities.',
    
    // Badges
    survey: 'Survey',
    sustainable: 'Sustainable',
    response: 'Response',
    bangladesh: 'Bangladesh',
    
    // News section
    newsTitle: 'Latest News',
    placesVisited: 'Places Visited',
    visitorsToOrg: 'Visitors to Organization',
    certificatesReceived: 'Certificates Received',
    certificatesAwarded: 'Certificates Awarded',
    searchNews: 'Search news...',
    viewAllNews: 'View All News',
    
    // News items
    erbilSchoolsTitle: 'Visit to Erbil Schools',
    erbilSchoolsDesc: 'Successful visit to 5 schools in Erbil province',
    dohukHealthcareTitle: 'Dohuk Healthcare Assessment',
    dohukHealthcareDesc: 'Comprehensive assessment of healthcare needs in Dohuk',
    unVisitTitle: 'UN Representative Visit',
    unVisitDesc: 'Meeting with UN officials to discuss collaboration',
    govMeetingTitle: 'Government Officials Meeting',
    govMeetingDesc: 'Strategic planning session with local government',
    excellenceAwardTitle: 'Excellence in Education Award',
    excellenceAwardDesc: 'Recognition for outstanding educational initiatives',
    healthcareInnovationTitle: 'Healthcare Innovation Certificate',
    healthcareInnovationDesc: 'Acknowledgment for innovative healthcare solutions',
    communityLeaderTitle: 'Community Leader Certification',
    communityLeaderDesc: 'Awarded to outstanding community leaders',
    volunteerExcellenceTitle: 'Volunteer Excellence Award',
    volunteerExcellenceDesc: 'Recognition for dedicated volunteers',
    
    // Gallery section
    galleryTitle: 'Gallery',
    viewAllImages: 'View All Images',
    
    // Gallery descriptions
    childrenEducation: 'Children participating in educational activities',
    communityHealth: 'Community health program in action',
    wildlifeConservation: 'Wildlife conservation efforts',
    agriculturalDevelopment: 'Agricultural development project',
    womenWorkshop: 'Educational workshop for women',
    technologyTraining: 'Technology training session',
    
    // Staff section
    staffTitle: 'Our Staff',
    
    // Staff members
    drAhmadName: 'Dr. Ahmad Rahman',
    drAhmadPosition: 'Executive Director',
    drAhmadBio: 'Leading healthcare initiatives across the Kurdistan region with over 15 years of experience.',
    sarahName: 'Sarah Mohammed',
    sarahPosition: 'Education Program Manager',
    sarahBio: 'Developing educational programs and managing school construction projects.',
    omarName: 'Omar Hassan',
    omarPosition: 'Community Outreach Coordinator',
    omarBio: 'Building bridges between communities and coordinating volunteer activities.',
    rojinName: 'Rojin Khalil',
    rojinPosition: 'Healthcare Coordinator',
    rojinBio: 'Managing mobile health clinics and medical supply distribution programs.',
    
    // Footer
    footerDescription: 'Building hope for tomorrow through sustainable development, education, and healthcare initiatives.',
    quickLinks: 'Quick Links',
    contactInfo: 'Contact Info',
    followUs: 'Follow Us',
    footerCopyright: '© 2024 MROVDOSTAN. All rights reserved. | Built with ❤️ for making a difference.',
    
    // Login
    staffLogin: 'Staff Login',
    email: 'Email',
    password: 'Password',
    loginButton: 'Login',
    cancel: 'Cancel'
  },
  ar: {
    // Navigation
    home: 'الرئيسية',
    about: 'حول',
    projects: 'الأنشطة',
    news: 'الأخبار',
    gallery: 'المعرض',
    staff: 'الموظفون',
    login: 'دخول الموظفين',
    signUp: 'اشتراك',
    join: 'انضم',
    
    // Hero section
    heroTitle: 'بناء الأمل للغد',
    heroSubtitle: 'مروڤدوستان مكرسة لإحداث تغيير دائم في المجتمعات من خلال برامج التعليم والرعاية الصحية والتنمية المستدامة.',
    donateNow: 'تبرع الآن',
    learnMore: 'اعرف أكثر',
    
    // About section
    aboutTitle: 'حول مروڤدوستان',
    aboutDescription: 'لأكثر من عقد من الزمان، كرست مروڤدوستان نفسها لتحويل الحياة والمجتمعات عبر منطقة كردستان من خلال التنمية المستدامة والمساعدات الإنسانية. تأسست في عام 2010، نشأنا من إيمان بسيط: كل شخص يستحق الوصول إلى الضروريات الأساسية مثل المياه النظيفة والتعليم والرعاية الصحية والفرص. ما بدأ كمجموعة صغيرة من المتطوعين نما ليصبح حركة إقليمية تصل إلى أكثر من 50 مجتمعاً عبر كردستان. من خلال برامجنا الشاملة في التعليم والرعاية الصحية والتنمية الاقتصادية ودعوة حقوق الإنسان، نواصل بناء الأمل للغد بينما نعالج احتياجات اليوم الأكثر إلحاحاً.',
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
    projectsTitle: 'أنشطتنا',
    projectsDescription: 'انظر كيف نحدث فرقاً في المجتمعات حول العالم من خلال برامجنا الشاملة',
    allCategories: 'جميع الفئات',
    education: 'التعليم',
    healthcare: 'الرعاية الصحية',
    water: 'المياه والصرف الصحي',
    emergency: 'الإغاثة الطارئة',
    searchProjects: 'البحث في الأنشطة...',
    viewAllProjects: 'عرض جميع الأنشطة',
    readMore: 'اقرأ المزيد',
    
    // Project items
    cleanWaterTitle: 'مبادرة المياه النظيفة',
    cleanWaterDesc: 'جلب المياه النظيفة للمجتمعات الريفية من خلال برامج بناء وصيانة الآبار المستدامة.',
    educationSupportTitle: 'برنامج دعم التعليم',
    educationSupportDesc: 'توفير المستلزمات المدرسية والمنح الدراسية والبنية التحتية التعليمية للأطفال المحرومين.',
    emergencyReliefTitle: 'جهد الإغاثة الطارئة',
    emergencyReliefDesc: 'الاستجابة للكوارث بتوفير الطعام والمأوى والمساعدة الطبية والدعم النفسي للعائلات المتضررة.',
    healthcareMobileTitle: 'العيادة المتنقلة للرعاية الصحية',
    healthcareMobileDesc: 'وحدات طبية متنقلة تقدم خدمات الرعاية الصحية الأولية للمجتمعات الريفية النائية.',
    
    // Badges
    survey: 'مسح',
    sustainable: 'مستدام',
    response: 'استجابة',
    bangladesh: 'بنغلاديش',
    
    // News section
    newsTitle: 'آخر الأخبار',
    placesVisited: 'الأماكن المزارة',
    visitorsToOrg: 'زوار المنظمة',
    certificatesReceived: 'الشهادات المستلمة',
    certificatesAwarded: 'الشهادات الممنوحة',
    searchNews: 'البحث في الأخبار...',
    viewAllNews: 'عرض جميع الأخبار',
    
    // News items
    erbilSchoolsTitle: 'زيارة مدارس أربيل',
    erbilSchoolsDesc: 'زيارة ناجحة لـ 5 مدارس في محافظة أربيل',
    dohukHealthcareTitle: 'تقييم الرعاية الصحية في دهوك',
    dohukHealthcareDesc: 'تقييم شامل لاحتياجات الرعاية الصحية في دهوك',
    unVisitTitle: 'زيارة ممثل الأمم المتحدة',
    unVisitDesc: 'اجتماع مع مسؤولي الأمم المتحدة لمناقشة التعاون',
    govMeetingTitle: 'اجتماع المسؤولين الحكوميين',
    govMeetingDesc: 'جلسة تخطيط استراتيجي مع الحكومة المحلية',
    excellenceAwardTitle: 'جائزة التميز في التعليم',
    excellenceAwardDesc: 'تقدير للمبادرات التعليمية المتميزة',
    healthcareInnovationTitle: 'شهادة الابتكار في الرعاية الصحية',
    healthcareInnovationDesc: 'اعتراف بالحلول المبتكرة للرعاية الصحية',
    communityLeaderTitle: 'شهادة قائد المجتمع',
    communityLeaderDesc: 'تُمنح لقادة المجتمع المتميزين',
    volunteerExcellenceTitle: 'جائزة تميز المتطوعين',
    volunteerExcellenceDesc: 'تقدير للمتطوعين المخلصين',
    
    // Gallery section
    galleryTitle: 'المعرض',
    viewAllImages: 'عرض جميع الصور',
    
    // Gallery descriptions
    childrenEducation: 'أطفال يشاركون في الأنشطة التعليمية',
    communityHealth: 'برنامج الصحة المجتمعية في العمل',
    wildlifeConservation: 'جهود حفظ الحياة البرية',
    agriculturalDevelopment: 'مشروع التنمية الزراعية',
    womenWorkshop: 'ورشة تعليمية للنساء',
    technologyTraining: 'جلسة تدريب التكنولوجيا',
    
    // Staff section
    staffTitle: 'موظفونا',
    
    // Staff members
    drAhmadName: 'د. أحمد رحمن',
    drAhmadPosition: 'المدير التنفيذي',
    drAhmadBio: 'يقود مبادرات الرعاية الصحية عبر منطقة كردستان مع أكثر من 15 عاماً من الخبرة.',
    sarahName: 'سارة محمد',
    sarahPosition: 'مدير برنامج التعليم',
    sarahBio: 'تطوير البرامج التعليمية وإدارة مشاريع بناء المدارس.',
    omarName: 'عمر حسن',
    omarPosition: 'منسق التواصل المجتمعي',
    omarBio: 'بناء جسور بين المجتمعات وتنسيق أنشطة المتطوعين.',
    rojinName: 'روژين خليل',
    rojinPosition: 'منسق الرعاية الصحية',
    rojinBio: 'إدارة العيادات الصحية المتنقلة وبرامج توزيع الإمدادات الطبية.',
    
    // Footer
    footerDescription: 'بناء الأمل للغد من خلال التنمية المستدامة والتعليم ومبادرات الرعاية الصحية.',
    quickLinks: 'روابط سريعة',
    contactInfo: 'معلومات الاتصال',
    followUs: 'تابعنا',
    footerCopyright: '© 2024 مروڤدوستان. جميع الحقوق محفوظة. | مبني بـ ❤️ لإحداث فرق.',
    
    // Login
    staffLogin: 'دخول الموظفين',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    loginButton: 'تسجيل الدخول',
    cancel: 'إلغاء'
  },
  ku: {
    // Navigation
    home: 'سەرەتا',
    about: 'دەربارە',
    projects: 'چالاکیەکان',
    news: 'هەواڵ',
    gallery: 'گالەری',
    staff: 'کارمەندان',
    login: 'چوونەژوورەوەی کارمەندان',
    signUp: 'تۆمارکردن',
    join: 'بەشداری بکە',
    
    // Hero section
    heroTitle: 'ئومێد دروستکردن بۆ سبەینێ',
    heroSubtitle: 'مروڤدۆستان خۆی تەرخان کردووە بۆ دروستکردنی گۆڕانکاری بەردەوام لە کۆمەڵگاکاندا لە ڕێگەی پڕۆگرامەکانی پەروەردە، چاودێری تەندروستی و گەشەسەندنی بەردەوام.',
    donateNow: 'ئێستا بەخشین بکە',
    learnMore: 'زیاتر فێربە',
    
    // About section
    aboutTitle: 'دەربارەی مروڤدۆستان',
    aboutDescription: 'بۆ زیاتر لە یەک دەیە، مروڤدۆستان خۆی تەرخان کردووە بۆ گۆڕینی ژیان و کۆمەڵگاکان لە هەرێمی کوردستاندا لە ڕێگەی گەشەسەندنی بەردەوام و یارمەتی مرۆیی. لە ساڵی 2010 دامەزرا، لە باوەڕێکی سادەوە دەرچووین: هەر کەسێک شایستەی دەستڕاگەیشتنە بە پێداویستیە بنەڕەتیەکان وەک ئاوی پاک، پەروەردە، چاودێری تەندروستی و دەرفەت. ئەوەی وەک کۆمەڵێک بچووک لە خۆبەخشان دەستیپێکرد گەشەی کردووە بۆ بزووتنەوەیەکی هەرێمی کە دەگاتە زیاتر لە 50 کۆمەڵگا لە کوردستان. لە ڕێگەی پڕۆگرامە فراوانەکانمان لە پەروەردە، چاودێری تەندروستی، گەشەسەندنی ئابووری و بەرگریکردن لە مافەکانی مرۆڤ، بەردەوامین لە دروستکردنی ئومێد بۆ سبەینێ لە کاتێکدا پەرەپێدان بە پێداویستیە ئاکامەکانی ئەمڕۆ.',
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
    projectsTitle: 'چالاکیەکانمان',
    projectsDescription: 'ببینە چۆن جیاوازی دروست دەکەین لە کۆمەڵگاکاندا لە سەرانسەری جیهان لە ڕێگەی پڕۆگرامە فراوانەکانمان',
    allCategories: 'هەموو پۆلەکان',
    education: 'پەروەردە',
    healthcare: 'چاودێری تەندروستی',
    water: 'ئاو و پاکوێژی',
    emergency: 'فریاکەوتنی لەناکاو',
    searchProjects: 'گەڕان لە چالاکیەکان...',
    viewAllProjects: 'بینینی هەموو چالاکیەکان',
    readMore: 'زیاتر بخوێنەوە',
    
    // Project items
    cleanWaterTitle: 'دەستپێشخەری ئاوی پاک',
    cleanWaterDesc: 'هێنانی ئاوی پاک بۆ کۆمەڵگا لادێیەکان لە ڕێگەی بیرەکانی بەردەوام و پڕۆگرامەکانی چاککردنەوە.',
    educationSupportTitle: 'پڕۆگرامی پشتگیری پەروەردە',
    educationSupportDesc: 'دابینکردنی کەرەستەی قوتابخانە، بورس و بنکەی تەکنەلۆژیای پەروەردە بۆ منداڵانی بێبەش.',
    emergencyReliefTitle: 'هەوڵی فریاکەوتنی لەناکاو',
    emergencyReliefDesc: 'وەڵامدانەوەی کارەسات بە دابینکردنی خۆراک، پەناگا، یارمەتی پزیشکی و پشتگیری دەروونی بۆ خێزانە زیانمەندەکان.',
    healthcareMobileTitle: 'نەخۆشخانەی گواستراوەی چاودێری تەندروستی',
    healthcareMobileDesc: 'یەکە پزیشکیە گواستراوەکان کە خزمەتگوزاری چاودێری تەندروستی سەرەتایی دەگەیەنن بۆ کۆمەڵگا لادێیە دوورەکان.',
    
    // Badges
    survey: 'ڕاپرسی',
    sustainable: 'بەردەوام',
    response: 'وەڵام',
    bangladesh: 'بەنگلادیش',
    
    // News section
    newsTitle: 'تازەترین هەواڵ',
    placesVisited: 'شوێنە سەردانکراوەکان',
    visitorsToOrg: 'میوانەکانی ڕێکخراوە',
    certificatesReceived: 'بڕوانامە وەرگیراوەکان',
    certificatesAwarded: 'بڕوانامە دراوەکان',
    searchNews: 'گەڕان لە هەواڵ...',
    viewAllNews: 'بینینی هەموو هەواڵەکان',
    
    // News items
    erbilSchoolsTitle: 'سەردانی قوتابخانەکانی هەولێر',
    erbilSchoolsDesc: 'سەردانێکی سەرکەوتوو بۆ 5 قوتابخانە لە پارێزگای هەولێر',
    dohukHealthcareTitle: 'هەڵسەنگاندنی چاودێری تەندروستی دهۆک',
    dohukHealthcareDesc: 'هەڵسەنگاندنێکی گشتگیر بۆ پێداویستیەکانی چاودێری تەندروستی لە دهۆک',
    unVisitTitle: 'سەردانی نوێنەری نەتەوە یەکگرتووەکان',
    unVisitDesc: 'چاوپێکەوتن لەگەڵ کارمەندانی نەتەوە یەکگرتووەکان بۆ گفتوگۆ لەسەر هاوکاری',
    govMeetingTitle: 'چاوپێکەوتنی کارمەندانی حکومی',
    govMeetingDesc: 'دانیشتنی پلاندانانی ستراتیژی لەگەڵ حکومەتی ناوخۆیی',
    excellenceAwardTitle: 'خەڵاتی باشی لە پەروەردە',
    excellenceAwardDesc: 'ناسینەوە بۆ دەستپێشخەری پەروەردەیی نایاب',
    healthcareInnovationTitle: 'بڕوانامەی نوێکاری چاودێری تەندروستی',
    healthcareInnovationDesc: 'دانپێدانان بۆ چارەسەری نوێی چاودێری تەندروستی',
    communityLeaderTitle: 'بڕوانامەی ڕابەری کۆمەڵگا',
    communityLeaderDesc: 'بۆ ڕابەرانی نایابی کۆمەڵگا دەدرێت',
    volunteerExcellenceTitle: 'خەڵاتی باشی خۆبەخش',
    volunteerExcellenceDesc: 'ناسینەوە بۆ خۆبەخشانی خۆشەویست',
    
    // Gallery section
    galleryTitle: 'گالەری',
    viewAllImages: 'بینینی هەموو وێنەکان',
    
    // Gallery descriptions
    childrenEducation: 'منداڵان بەشداری چالاکیە پەروەردەیەکان دەکەن',
    communityHealth: 'پڕۆگرامی تەندروستی کۆمەڵگا لە کار',
    wildlifeConservation: 'هەوڵەکانی پاراستنی ژیانی کێوی',
    agriculturalDevelopment: 'پڕۆژەی گەشەسەندنی کشتوکاڵ',
    womenWorkshop: 'ورشەی پەروەردەیی بۆ ژنان',
    technologyTraining: 'خولی ڕاهێنانی تەکنەلۆژیا',
    
    // Staff section
    staffTitle: 'کارمەندانمان',
    
    // Staff members
    drAhmadName: 'د. ئەحمەد ڕەحمان',
    drAhmadPosition: 'بەڕێوەبەری جێبەجێکار',
    drAhmadBio: 'ڕابەری دەستپێشخەری چاودێری تەندروستی لە سەرانسەری هەرێمی کوردستان لەگەڵ زیاتر لە 15 ساڵ ئەزموون.',
    sarahName: 'سارا محەمەد',
    sarahPosition: 'بەڕێوەبەری پڕۆگرامی پەروەردە',
    sarahBio: 'گەشەپێدانی پڕۆگرامەکانی پەروەردە و بەڕێوەبردنی پڕۆژەکانی دروستکردنی قوتابخانە.',
    omarName: 'عومەر حەسەن',
    omarPosition: 'هەماهەنگکەری پەیوەندی کۆمەڵگا',
    omarBio: 'دروستکردنی پرد لە نێوان کۆمەڵگاکان و هەماهەنگکردنی چالاکیەکانی خۆبەخشان.',
    rojinName: 'رۆژین خەلیل',
    rojinPosition: 'هەماهەنگکەری چاودێری تەندروستی',
    rojinBio: 'بەڕێوەبردنی نەخۆشخانە گواستراوەکان و پڕۆگرامەکانی دابەشکردنی کەرەستەی پزیشکی.',
    
    // Footer
    footerDescription: 'دروستکردنی ئومێد بۆ سبەینێ لە ڕێگەی گەشەسەندنی بەردەوام، پەروەردە و دەستپێشخەری چاودێری تەندروستی.',
    quickLinks: 'بەستەرە خێراکان',
    contactInfo: 'زانیاری پەیوەندی',
    followUs: 'شوێنمان بکەوە',
    footerCopyright: '© 2024 مروڤدۆستان. هەموو مافەکان پارێزراون. | بە ❤️ دروستکراوە بۆ جیاوازی دروستکردن.',
    
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
