require('dotenv').config();
const mongoose = require('mongoose');
const News = require('./models/News');
const Project = require('./models/Project');
const GalleryPhoto = require('./models/GalleryPhoto');
const fs = require('fs');
const path = require('path');

const clearAllData = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear News
    console.log('\n📰 Clearing all News items...');
    const newsCount = await News.countDocuments();
    await News.deleteMany({});
    console.log(`✅ Deleted ${newsCount} news items`);

    // Clear Projects
    console.log('\n🚀 Clearing all Projects...');
    const projectsCount = await Project.countDocuments();
    await Project.deleteMany({});
    console.log(`✅ Deleted ${projectsCount} projects`);

    // Clear Gallery
    console.log('\n🖼️ Clearing all Gallery items...');
    const galleryCount = await GalleryPhoto.countDocuments();
    await GalleryPhoto.deleteMany({});
    console.log(`✅ Deleted ${galleryCount} gallery photos`);

    // Clear uploaded files
    console.log('\n🗑️ Clearing uploaded files...');
    
    const uploadsDir = path.join(__dirname, 'uploads');
    const directories = ['news', 'projects', 'gallery'];

    for (const dir of directories) {
      const dirPath = path.join(uploadsDir, dir);
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        for (const file of files) {
          // Skip .gitkeep files
          if (file !== '.gitkeep') {
            fs.unlinkSync(path.join(dirPath, file));
          }
        }
        console.log(`✅ Cleared ${files.length - 1} files from ${dir}/`);
      }
    }

    console.log('\n✨ All data cleared successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - News items deleted: ${newsCount}`);
    console.log(`   - Projects deleted: ${projectsCount}`);
    console.log(`   - Gallery photos deleted: ${galleryCount}`);
    console.log('\n🎉 Database is now clean and ready for fresh data!');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    process.exit(1);
  }
};

clearAllData();
