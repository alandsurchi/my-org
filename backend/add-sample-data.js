require('dotenv').config();
const mongoose = require('mongoose');
const News = require('./models/News');
const Project = require('./models/Project');

const addSampleData = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Add sample news items
    console.log('\n📰 Adding sample news items...');
    const sampleNews = [
      {
        title: 'سەردانی فەرمی بۆ رێکخراوی تەندروستی',
        content: 'لە ڕۆژی دووشەممە، ٢٠٢٥/٠١/١٠، وەفدێکی ڕێکخراوی مرۆڤدۆستان سەردانی رێکخراوی تەندروستی جیهانی کرد بۆ باسکردنی پرۆژەکانی هاوبەش',
        category: 'KurdishVisitors'
      },
      {
        title: 'وەرگرتنی سوپاس و پێزانین',
        content: 'رێکخراوەکەمان بەڕێزنامەی سوپاسی لە لایەن وەزارەتی تەندروستیەوە ڕێزی لێ نرا بۆ کارە مرۆڤدۆستییەکانمان',
        category: 'KurdishCertificate'
      },
      {
        title: 'Official Visit to Health Ministry',
        content: 'Our organization conducted an official visit to the Ministry of Health to discuss ongoing projects and future collaborations.',
        category: 'SardaniFrami'
      }
    ];

    for (const newsItem of sampleNews) {
      const news = new News(newsItem);
      await news.save();
      console.log(`✅ Created news: ${newsItem.title}`);
    }

    // Add sample projects
    console.log('\n🚀 Adding sample projects...');
    const sampleProjects = [
      {
        title: 'دابینکردنی دەرمانی پێویست بۆ نەخۆشخانەکان',
        description: 'لە ڕۆژی دووشەممە، ٢٠٢٥/٠١/١٠، رێکخراوی مرۆڤدۆستان دەرمانی پێویستی دابین کرد بۆ نەخۆشخانە و بنکەی تەندروستی لە شاری هەولێر',
        status: 'completed'
      },
      {
        title: 'دابەشکردنی سەبەتەی خۆراک',
        description: 'دابەشکردنی سەبەتەی خۆراک و هێلکە بۆ خاوەنپێدایوستی تایبەت لە پارێزگای دهۆک',
        status: 'completed'
      },
      {
        title: 'نۆژەنکردنەوەی قوتابخانە',
        description: 'نۆژەنکردنەوەی قوتابخانەی قەریتاغی بنەڕەتی تێکەڵاو لە شاری هەولێر',
        status: 'completed'
      },
      {
        title: 'Medical Supply Distribution',
        description: 'Distributed essential medical supplies to hospitals and health centers in Erbil',
        status: 'completed'
      }
    ];

    for (const projectData of sampleProjects) {
      const project = new Project(projectData);
      await project.save();
      console.log(`✅ Created project: ${projectData.title}`);
    }

    console.log('\n✨ Sample data added successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - News items added: ${sampleNews.length}`);
    console.log(`   - Projects added: ${sampleProjects.length}`);
    console.log('\n🎉 You can now view these items on the website!');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding sample data:', error);
    process.exit(1);
  }
};

addSampleData();
