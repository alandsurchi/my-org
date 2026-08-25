/**
 * Data Migration Script: MongoDB → PostgreSQL
 * 
 * This script migrates data from the existing MongoDB database to the new
 * Railway PostgreSQL database. Run it once after setting up the PostgreSQL database.
 * 
 * Usage:
 *   MONGO_URI=mongodb://... DATABASE_URL=postgresql://... node migrate-data.js
 * 
 * Requirements:
 *   - Mongoose (for reading from MongoDB)
 *   - pg (for writing to PostgreSQL)
 */

require('dotenv').config();
const { Pool } = require('pg');
const mongoose = require('mongoose');

// Connect to both databases
async function migrateData() {
  console.log('🚀 Starting data migration: MongoDB → PostgreSQL\n');

  // Connect to MongoDB (source)
  console.log('📡 Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('✅ MongoDB connected');

  // Connect to PostgreSQL (destination)
  const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });
  console.log('✅ PostgreSQL connected\n');

  const client = await pgPool.connect();
  
  try {
    await client.query('BEGIN');

    // Define MongoDB schemas (read-only, to fetch data)
    const UserSchema = new mongoose.Schema({}, { strict: false, collection: 'users' });
    const NewsSchema = new mongoose.Schema({}, { strict: false, collection: 'news' });
    const ProjectSchema = new mongoose.Schema({}, { strict: false, collection: 'projects' });
    const HeroImageSchema = new mongoose.Schema({}, { strict: false, collection: 'heroimages' });
    const GalleryPhotoSchema = new mongoose.Schema({}, { strict: false, collection: 'galleryphotos' });

    const MongoUser = mongoose.model('User', UserSchema);
    const MongoNews = mongoose.model('News', NewsSchema);
    const MongoProject = mongoose.model('Project', ProjectSchema);
    const MongoHeroImage = mongoose.model('HeroImage', HeroImageSchema);
    const MongoGalleryPhoto = mongoose.model('GalleryPhoto', GalleryPhotoSchema);

    // Migrate Users
    console.log('📋 Migrating users...');
    const users = await MongoUser.find({});
    console.log(`   Found ${users.length} users in MongoDB`);
    let userCount = 0;
    for (const user of users) {
      try {
        await client.query(
          `INSERT INTO users (name, email, password, role, created_at) VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (email) DO NOTHING`,
          [
            user.name || 'Unknown',
            user.email,
            user.password, // Already hashed
            user.role || 'staff',
            user.createdAt || new Date()
          ]
        );
        userCount++;
      } catch (err) {
        console.warn(`   ⚠️ Skipping user ${user.email}: ${err.message}`);
      }
    }
    console.log(`   ✅ Migrated ${userCount} users\n`);

    // Migrate News
    console.log('📰 Migrating news...');
    const newsItems = await MongoNews.find({});
    console.log(`   Found ${newsItems.length} news items in MongoDB`);
    for (const item of newsItems) {
      try {
        await client.query(
          `INSERT INTO news (title, content, category, image_url, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            item.title,
            item.content,
            item.category || null,
            item.imageUrl || null,
            item.createdAt || new Date(),
            item.updatedAt || new Date()
          ]
        );
      } catch (err) {
        console.warn(`   ⚠️ Skipping news "${item.title}": ${err.message}`);
      }
    }
    console.log(`   ✅ Migrated ${newsItems.length} news items\n`);

    // Migrate Projects
    console.log('📁 Migrating projects...');
    const projects = await MongoProject.find({});
    console.log(`   Found ${projects.length} projects in MongoDB`);
    for (const project of projects) {
      try {
        await client.query(
          `INSERT INTO projects (title, description, category, status, image_url, location, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            project.title,
            project.description,
            project.category || null,
            project.status || 'active',
            project.imageUrl || null,
            project.location || null,
            project.createdAt || new Date(),
            project.updatedAt || new Date()
          ]
        );
      } catch (err) {
        console.warn(`   ⚠️ Skipping project "${project.title}": ${err.message}`);
      }
    }
    console.log(`   ✅ Migrated ${projects.length} projects\n`);

    // Migrate Hero Images
    console.log('🖼️ Migrating hero images...');
    const heroImages = await MongoHeroImage.find({});
    console.log(`   Found ${heroImages.length} hero images in MongoDB`);
    for (const hero of heroImages) {
      try {
        await client.query(
          `INSERT INTO hero_images (url, original_name, file_name, file_size, mime_type, dimensions, uploaded_by, is_active, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            hero.url,
            hero.originalName || '',
            hero.fileName || '',
            hero.fileSize || 0,
            hero.mimeType || '',
            JSON.stringify(hero.dimensions || { width: 0, height: 0 }),
            hero.uploadedBy || 'admin',
            hero.isActive !== false,
            hero.createdAt || new Date(),
            hero.updatedAt || new Date()
          ]
        );
      } catch (err) {
        console.warn(`   ⚠️ Skipping hero image: ${err.message}`);
      }
    }
    console.log(`   ✅ Migrated ${heroImages.length} hero images\n`);

    // Migrate Gallery Photos
    console.log('📸 Migrating gallery photos...');
    const galleryPhotos = await MongoGalleryPhoto.find({});
    console.log(`   Found ${galleryPhotos.length} gallery photos in MongoDB`);
    for (const photo of galleryPhotos) {
      try {
        await client.query(
          `INSERT INTO gallery_photos (url, title, description, caption, uploaded_at)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            photo.url,
            photo.title || photo.caption || 'Untitled',
            photo.description || '',
            photo.caption || '',
            photo.uploadedAt || new Date()
          ]
        );
      } catch (err) {
        console.warn(`   ⚠️ Skipping gallery photo: ${err.message}`);
      }
    }
    console.log(`   ✅ Migrated ${galleryPhotos.length} gallery photos\n`);

    await client.query('COMMIT');
    
    // Print summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Migration Summary');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Users:       ${userCount}`);
    console.log(`   News:        ${newsItems.length}`);
    console.log(`   Projects:    ${projects.length}`);
    console.log(`   Hero Images: ${heroImages.length}`);
    console.log(`   Gallery:     ${galleryPhotos.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Migration complete!\n');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pgPool.end();
    await mongoose.disconnect();
    console.log('🔌 Database connections closed');
  }
}

migrateData().catch(() => process.exit(1));
