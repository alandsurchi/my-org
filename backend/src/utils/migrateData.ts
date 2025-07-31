import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { News } from '../models/News';
import { Project } from '../models/Project';
import { Staff } from '../models/Staff';
import { StaffAccount } from '../models/StaffAccount';

// Load environment variables
dotenv.config();

// Sample data to migrate (from your backup)
const sampleNews = [
  {
    title: "Organization Launch",
    content: "We are excited to announce the launch of our organization. This marks a significant milestone in our journey to serve the community and make a positive impact in the world. We have been working tirelessly to establish our foundation and are now ready to begin our mission of creating meaningful change.",
    excerpt: "Exciting launch announcement",
    category: "announcements",
    image_url: "/lovable-uploads/1b274aba-eb01-4306-999b-6798375f09e4.png",
    status: "published",
    author_id: null,
    date: new Date('2024-01-15')
  },
  {
    title: "New Initiative Started",
    content: "Our new community initiative has begun with great enthusiasm from local participants. This program aims to address key challenges in our community while fostering collaboration and innovative solutions. We are thrilled to see the early engagement and look forward to the positive outcomes this initiative will bring.",
    excerpt: "Community initiative launch",
    category: "programs",
    image_url: "/lovable-uploads/2ba81074-4283-4f16-a659-4f4a054275fa.png",
    status: "published",
    author_id: null,
    date: new Date('2024-02-01')
  },
  {
    title: "Partnership Announcement",
    content: "We are pleased to announce our new partnership with several local organizations. This collaboration will amplify our impact and expand our reach in the community. Together, we will work towards shared goals and create sustainable solutions for the challenges we face.",
    excerpt: "New partnership formed",
    category: "partnerships",
    image_url: null,
    status: "published",
    author_id: null,
    date: new Date('2024-02-15')
  },
  {
    title: "Upcoming Event",
    content: "Join us for our upcoming community event where we will showcase our recent work and discuss future plans. This is a great opportunity to meet our team, learn about our initiatives, and discover ways to get involved. Light refreshments will be provided.",
    excerpt: "Community event invitation",
    category: "events",
    image_url: "/lovable-uploads/eb6198ca-261c-4e22-ba5c-9af9f83d0c52.png",
    status: "published",
    author_id: null,
    date: new Date('2024-03-01')
  }
];

const sampleProjects = [
  {
    title: "Community Garden",
    description: "A sustainable community garden project to promote local food production and environmental awareness.",
    image_url: "/lovable-uploads/1b274aba-eb01-4306-999b-6798375f09e4.png",
    project_url: "https://example.com/community-garden",
    technologies: ["Sustainable Agriculture", "Community Engagement"],
    status: "active"
  },
  {
    title: "Education Initiative",
    description: "Providing educational resources and support to underserved communities.",
    image_url: "/lovable-uploads/2ba81074-4283-4f16-a659-4f4a054275fa.png",
    project_url: "https://example.com/education",
    technologies: ["Education", "Community Outreach"],
    status: "active"
  },
  {
    title: "Environmental Conservation",
    description: "Working to protect and preserve local environmental resources.",
    image_url: "/lovable-uploads/eb6198ca-261c-4e22-ba5c-9af9f83d0c52.png",
    project_url: "https://example.com/conservation",
    technologies: ["Environmental Science", "Conservation"],
    status: "active"
  },
  {
    title: "Youth Programs",
    description: "Engaging local youth through various educational and recreational programs.",
    image_url: null,
    project_url: "https://example.com/youth",
    technologies: ["Youth Development", "Education"],
    status: "active"
  }
];

const sampleStaff = [
  {
    name: "John Smith",
    position: "Executive Director",
    bio: "John has over 15 years of experience in nonprofit management and community development.",
    image_url: "/lovable-uploads/1b274aba-eb01-4306-999b-6798375f09e4.png",
    email: "john.smith@org.com",
    phone: "+1-555-0101",
    social_links: {
      linkedin: "https://linkedin.com/in/johnsmith",
      twitter: "https://twitter.com/johnsmith"
    },
    order: 1,
    status: "active"
  },
  {
    name: "Sarah Johnson",
    position: "Program Manager",
    bio: "Sarah leads our community programs and has a background in social work and project management.",
    image_url: "/lovable-uploads/2ba81074-4283-4f16-a659-4f4a054275fa.png",
    email: "sarah.johnson@org.com",
    phone: "+1-555-0102",
    social_links: {
      linkedin: "https://linkedin.com/in/sarahjohnson"
    },
    order: 2,
    status: "active"
  },
  {
    name: "Michael Davis",
    position: "Community Coordinator",
    bio: "Michael works directly with community members to coordinate events and initiatives.",
    image_url: "/lovable-uploads/eb6198ca-261c-4e22-ba5c-9af9f83d0c52.png",
    email: "michael.davis@org.com",
    phone: "+1-555-0103",
    social_links: {},
    order: 3,
    status: "active"
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

const migrateData = async () => {
  await connectDB();

  try {
    console.log('🚀 Starting data migration...');

    // Clear existing data
    await News.deleteMany({});
    await Project.deleteMany({});
    await Staff.deleteMany({});
    await StaffAccount.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Insert sample data
    const newsResults = await News.insertMany(sampleNews);
    console.log(`📰 Inserted ${newsResults.length} news articles`);

    const projectResults = await Project.insertMany(sampleProjects);
    console.log(`🏗️  Inserted ${projectResults.length} projects`);

    const staffResults = await Staff.insertMany(sampleStaff);
    console.log(`👥 Inserted ${staffResults.length} staff members`);

    // Create a default admin account
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

    console.log('✅ Data migration completed successfully!');
    console.log(`📧 Admin email: ${adminAccount.email}`);
    console.log(`🔑 Admin password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);

  } catch (error) {
    console.error('❌ Migration error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

if (require.main === module) {
  migrateData();
}

export { migrateData };
