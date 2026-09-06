const pool = require('./db');

async function initDatabase() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'staff' CHECK (role IN ('super_admin', 'admin', 'staff')),
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // News table
    await client.query(`
      CREATE TABLE IF NOT EXISTS news (
        id SERIAL PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(100),
        image_url TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Projects table
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(100) CHECK (category IN ('provision', 'distribution', 'renovation', 'building', 'news', 'water', 'education', 'emergency', 'healthcare')),
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'planned', 'on-hold')),
        image_url TEXT,
        location VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Hero images table
    await client.query(`
      CREATE TABLE IF NOT EXISTS hero_images (
        id SERIAL PRIMARY KEY,
        url TEXT NOT NULL,
        original_name VARCHAR(500) DEFAULT '',
        file_name VARCHAR(500) DEFAULT '',
        file_size INTEGER DEFAULT 0,
        mime_type VARCHAR(100) DEFAULT '',
        dimensions JSONB DEFAULT '{"width": 0, "height": 0}',
        uploaded_by VARCHAR(255) DEFAULT 'admin',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Gallery photos table
    await client.query(`
      CREATE TABLE IF NOT EXISTS gallery_photos (
        id SERIAL PRIMARY KEY,
        url TEXT NOT NULL,
        title VARCHAR(500) DEFAULT 'Untitled',
        description TEXT DEFAULT '',
        caption VARCHAR(500) DEFAULT '',
        uploaded_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // About image table (single row, replaces in-memory store)
    await client.query(`
      CREATE TABLE IF NOT EXISTS about_image (
        id SERIAL PRIMARY KEY,
        url TEXT,
        original_name VARCHAR(500) DEFAULT '',
        file_name VARCHAR(500) DEFAULT '',
        file_size INTEGER DEFAULT 0,
        mime_type VARCHAR(100) DEFAULT '',
        dimensions JSONB DEFAULT '{"width": 0, "height": 0}',
        uploaded_by VARCHAR(255) DEFAULT 'admin',
        is_active BOOLEAN DEFAULT true,
        uploaded_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // First-party analytics (no cookies, no IPs; visitor is a daily salted hash)
    await client.query(`
      CREATE TABLE IF NOT EXISTS page_views (
        id BIGSERIAL PRIMARY KEY,
        day DATE NOT NULL,
        path VARCHAR(200) NOT NULL,
        visitor VARCHAR(32) NOT NULL,
        referrer VARCHAR(255),
        lang VARCHAR(8),
        device VARCHAR(10),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_page_views_day ON page_views(day);`);

    // Indexes
    await client.query(`CREATE INDEX IF NOT EXISTS idx_news_created ON news(created_at DESC);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_projects_status_created ON projects(status, created_at DESC);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_hero_active ON hero_images(is_active);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_gallery_uploaded ON gallery_photos(uploaded_at DESC);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`);

    await client.query('COMMIT');
    console.log('✅ Database schema initialized successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Schema initialization failed:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

// Run if called directly
if (require.main === module) {
  initDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = initDatabase;
