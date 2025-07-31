import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { News } from '../models/News';
import { Project } from '../models/Project';
import { Staff } from '../models/Staff';
import { StaffAccount } from '../models/StaffAccount';

// Load environment variables
dotenv.config();

// Your actual exported data
const actualNewsData = [
  {
    "id": "1a98c866-51a8-46ec-bb41-92cb300c42a5",
    "title_en": "Visit to Erbil Schools",
    "title_ar": "زيارة مدارس أربيل",
    "title_ku": "سەردانی قوتابخانەکانی هەولێر",
    "description_en": "Successful visit to 5 schools in Erbil province to assess educational needs and infrastructure.",
    "description_ar": "زيارة ناجحة لـ 5 مدارس في محافظة أربيل لتقييم الاحتياجات التعليمية والبنية التحتية.",
    "description_ku": "سەردانێکی سەرکەوتوو بۆ 5 قوتابخانە لە پارێزگای هەولێر بۆ هەڵسەنگاندنی پێداویستیە پەروەردەیەکان.",
    "category": "placesVisited",
    "image_url": "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=250&fit=crop",
    "date": "2024-06-10",
    "created_at": "2025-06-14 16:09:30.009906+00",
    "updated_at": "2025-06-14 16:09:30.009906+00"
  },
  {
    "id": "973b461a-67f6-473f-8f0a-eb1202bd0a0c",
    "title_en": "Excellence in Education Award",
    "title_ar": "جائزة التميز في التعليم",
    "title_ku": "خەڵاتی باشی لە پەروەردە",
    "description_en": "Received recognition for outstanding educational initiatives serving displaced communities.",
    "description_ar": "تلقينا اعترافًا بالمبادرات التعليمية المتميزة التي تخدم المجتمعات النازحة.",
    "description_ku": "ناسینەوەمان وەرگرت بۆ دەستپێشخەری پەروەردەیی نایاب کە خزمەت بە کۆمەڵگا کۆچبەرەکان دەکات.",
    "category": "certificatesReceived",
    "image_url": "https://images.unsplash.com/photo-1569025743873-ea3a9ade89f9?w=400&h=250&fit=crop",
    "date": "2024-05-30",
    "created_at": "2025-06-14 16:09:30.009906+00",
    "updated_at": "2025-06-14 16:09:30.009906+00"
  },
  {
    "id": "bb147840-eb22-4015-9536-13d18273209a",
    "title_en": "Community Leader Certification",
    "title_ar": "شهادة قائد المجتمع",
    "title_ku": "بڕوانامەی ڕابەری کۆمەڵگا",
    "description_en": "Awarded certificates to outstanding community leaders for their dedication to social development.",
    "description_ar": "منحنا شهادات لقادة المجتمع المتميزين لتفانيهم في التنمية الاجتماعية.",
    "description_ku": "بڕوانامەمان دا بە ڕابەرانی نایابی کۆمەڵگا بۆ تەرخانکردنیان بۆ گەشەسەندنی کۆمەڵایەتی.",
    "category": "certificatesAwarded",
    "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
    "date": "2024-06-01",
    "created_at": "2025-06-14 16:09:30.009906+00",
    "updated_at": "2025-06-14 16:09:30.009906+00"
  },
  {
    "id": "bbeb5266-348b-4756-9779-d62c6be9ac12",
    "title_en": "UN Representative Visit",
    "title_ar": "زيارة ممثل الأمم المتحدة",
    "title_ku": "سەردانی نوێنەری نەتەوە یەکگرتووەکان",
    "description_en": "Meeting with UN officials to discuss collaboration opportunities and humanitarian projects.",
    "description_ar": "اجتماع مع مسؤولي الأمم المتحدة لمناقشة فرص التعاون والمشاريع الإنسانية.",
    "description_ku": "چاوپێکەوتن لەگەڵ کارمەندانی نەتەوە یەکگرتووەکان بۆ گفتوگۆ لەسەر دەرفەتەکانی هاوکاری.",
    "category": "visitors",
    "image_url": "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=250&fit=crop",
    "date": "2024-06-08",
    "created_at": "2025-06-14 16:09:30.009906+00",
    "updated_at": "2025-06-14 16:09:30.009906+00"
  }
];

const actualProjectsData = [
  {
    "id": "2274f63a-d7e0-4796-a54a-c3ee81a54d2b",
    "title_en": "Education Support Program",
    "title_ar": "برنامج دعم التعليم",
    "title_ku": "پڕۆگرامی پشتگیری پەروەردە",
    "description_en": "Providing school supplies, scholarships, and educational infrastructure to underprivileged children.",
    "description_ar": "توفير المستلزمات المدرسية والمنح الدراسية والبنية التحتية التعليمية للأطفال المحرومين.",
    "description_ku": "دابینکردنی کەرەستەی قوتابخانە، بورس و بنکەی تەکنەلۆژیای پەروەردە بۆ منداڵانی بێبەش.",
    "category": "education",
    "image_url": "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=250&fit=crop",
    "location": "Erbil Province",
    "status": "active",
    "created_at": "2025-06-14 16:09:30.009906+00",
    "updated_at": "2025-06-14 16:09:30.009906+00"
  },
  {
    "id": "72561c7d-b5d1-467e-b1d4-3154f3e65e4f",
    "title_en": "Clean Water Initiative",
    "title_ar": "مبادرة المياه النظيفة",
    "title_ku": "دەستپێشخەری ئاوی پاک",
    "description_en": "Bringing clean water to rural communities through sustainable well construction and maintenance programs.",
    "description_ar": "جلب المياه النظيفة للمجتمعات الريفية من خلال برامج بناء وصيانة الآبار المستدامة.",
    "description_ku": "هێنانی ئاوی پاک بۆ کۆمەڵگا لادێیەکان لە ڕێگەی بیرەکانی بەردەوام و پڕۆگرامەکانی چاککردنەوە.",
    "category": "water",
    "image_url": "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=250&fit=crop",
    "location": "Dohuk Province",
    "status": "active",
    "created_at": "2025-06-14 16:09:30.009906+00",
    "updated_at": "2025-06-14 16:09:30.009906+00"
  },
  {
    "id": "b017d1dd-e076-4096-a458-23091e61afcb",
    "title_en": "Healthcare Mobile Clinic",
    "title_ar": "العيادة المتنقلة للرعاية الصحية",
    "title_ku": "نەخۆشخانەی گواستراوەی چاودێری تەندروستی",
    "description_en": "Mobile medical units providing primary healthcare services to remote rural communities.",
    "description_ar": "وحدات طبية متنقلة تقدم خدمات الرعاية الصحية الأولية للمجتمعات الريفية النائية.",
    "description_ku": "یەکە پزیشکیە گواستراوەکان کە خزمەتگوزاری چاودێری تەندروستی سەرەتایی دەگەیەنن بۆ کۆمەڵگا لادێیە دوورەکان.",
    "category": "healthcare",
    "image_url": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop",
    "location": "Sulaymaniyah Province",
    "status": "active",
    "created_at": "2025-06-14 16:09:30.009906+00",
    "updated_at": "2025-06-14 16:09:30.009906+00"
  },
  {
    "id": "dc79dfe7-e74d-4557-87b4-d68deecc02ca",
    "title_en": "Emergency Relief Effort",
    "title_ar": "جهد الإغاثة الطارئة",
    "title_ku": "هەوڵی فریاکەوتنی لەناکاو",
    "description_en": "Disaster response providing food, shelter, medical aid, and psychological support to affected families.",
    "description_ar": "الاستجابة للكوارث بتوفير الطعام والمأوى والمساعدة الطبية والدعم النفسي للعائلات المتضررة.",
    "description_ku": "وەڵامدانەوەی کارەسات بە دابینکردنی خۆراک، پەناگا، یارمەتی پزیشکی و پشتگیری دەروونی بۆ خێزانە زیانمەندەکان.",
    "category": "emergency",
    "image_url": "https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=400&h=250&fit=crop",
    "location": "Kurdistan Region",
    "status": "completed",
    "created_at": "2025-06-14 16:09:30.009906+00",
    "updated_at": "2025-06-14 16:09:30.009906+00"
  }
];

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/org_website';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const migrateActualData = async () => {
  await connectDB();

  try {
    console.log('🚀 Starting migration with your actual Supabase data...');

    // Clear existing data
    await News.deleteMany({});
    await Project.deleteMany({});
    await Staff.deleteMany({});
    await StaffAccount.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Transform and insert news data
    const newsData = actualNewsData.map(item => ({
      title: item.title_en, // Primary title in English
      content: item.description_en, // Primary content in English
      excerpt: item.description_en.substring(0, 150) + '...', // Create excerpt
      category: item.category,
      image_url: item.image_url,
      status: 'published',
      author_id: null,
      date: new Date(item.date),
      // Store multilingual data in additional fields
      title_ar: item.title_ar,
      title_ku: item.title_ku,
      description_ar: item.description_ar,
      description_ku: item.description_ku
    }));

    const newsResults = await News.insertMany(newsData);
    console.log(`📰 Inserted ${newsResults.length} news articles`);

    // Transform and insert projects data  
    const projectsData = actualProjectsData.map(item => ({
      title: item.title_en, // Primary title in English
      description: item.description_en, // Primary description in English
      image_url: item.image_url,
      project_url: null, // Not available in source data
      technologies: [item.category], // Use category as technology tag
      status: item.status,
      location: item.location,
      // Store multilingual data in additional fields
      title_ar: item.title_ar,
      title_ku: item.title_ku,
      description_ar: item.description_ar,
      description_ku: item.description_ku,
      category: item.category
    }));

    const projectResults = await Project.insertMany(projectsData);
    console.log(`🏗️  Inserted ${projectResults.length} projects`);

    // Add sample staff data (since not provided in export)
    const sampleStaff = [
      {
        name: "Ahmed Al-Rashid",
        position: "Executive Director",
        bio: "Leading humanitarian efforts in the Kurdistan Region with over 15 years of experience.",
        email: "ahmed.rashid@org.com",
        phone: "+964-750-123-4567",
        image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
        social_links: {
          linkedin: "https://linkedin.com/in/ahmed-rashid",
          twitter: "https://twitter.com/ahmed_rashid"
        },
        order: 1,
        status: "active"
      },
      {
        name: "Layla Hassan",
        position: "Program Manager",
        bio: "Coordinating educational and healthcare programs across Kurdish communities.",
        email: "layla.hassan@org.com",
        phone: "+964-750-234-5678",
        image_url: "https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=300&h=300&fit=crop&crop=face",
        social_links: {
          linkedin: "https://linkedin.com/in/layla-hassan"
        },
        order: 2,
        status: "active"
      },
      {
        name: "Omar Mahmud",
        position: "Field Coordinator",
        bio: "Managing field operations and community outreach initiatives.",
        email: "omar.mahmud@org.com",
        phone: "+964-750-345-6789",
        image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
        social_links: {},
        order: 3,
        status: "active"
      }
    ];

    const staffResults = await Staff.insertMany(sampleStaff);
    console.log(`👥 Inserted ${staffResults.length} staff members`);

    // Create admin account
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12);
    const adminAccount = new StaffAccount({
      firstName: 'Admin',
      lastName: 'User',
      email: process.env.ADMIN_EMAIL || 'admin@org.com',
      password: hashedPassword,
      role: 'admin',
      status: 'active'
    });

    await adminAccount.save();
    console.log('👤 Created admin account');

    console.log('✅ Migration completed successfully with your actual data!');
    console.log(`📧 Admin email: ${adminAccount.email}`);
    console.log(`🔑 Admin password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);

    // Display imported data summary
    console.log('\n📊 Imported Data Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📰 NEWS ARTICLES:');
    newsData.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.title} (${item.category})`);
    });
    
    console.log('\n🏗️  PROJECTS:');
    projectsData.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.title} (${item.status})`);
    });

  } catch (error) {
    console.error('❌ Migration error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

if (require.main === module) {
  migrateActualData();
}

export { migrateActualData };
