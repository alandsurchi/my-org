// Loaded here too: `npm run db:init` runs this file directly, where nothing
// else has read .env yet, so DATABASE_URL would be undefined.
require('dotenv').config();
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

    // Password reset tokens (only the hash is stored)
    await client.query(`
      CREATE TABLE IF NOT EXISTS password_resets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash VARCHAR(64) NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        used_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
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

    // Small internal key/value store. Used so that account provisioning driven
    // by environment variables can record that it already ran, instead of
    // re-applying the same password on every restart.
    await client.query(`
      CREATE TABLE IF NOT EXISTS app_settings (
        key VARCHAR(100) PRIMARY KEY,
        value TEXT,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Posts are written in Kurdish and machine-translated into English and
    // Arabic. The translations live in one JSONB column rather than six more
    // columns, so adding a language later is a code change, not a migration:
    //   { "sourceHash": "...",
    //     "en": { "title": "...", "body": "...", "auto": true, "stale": false },
    //     "ar": { ... } }
    // `auto: false` means a human edited it, and the machine must not overwrite
    // it; `stale: true` means the Kurdish source changed since it was written.
    await client.query(`ALTER TABLE news ADD COLUMN IF NOT EXISTS translations JSONB;`);
    await client.query(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS translations JSONB;`);

    // Names that must always be written the same way. Without this, a translator
    // renders the organisation's own name as "Humanitarian Organization" and
    // invents a new spelling for every village each time.
    await client.query(`
      CREATE TABLE IF NOT EXISTS glossary (
        id SERIAL PRIMARY KEY,
        term VARCHAR(200) NOT NULL UNIQUE,
        en VARCHAR(300) NOT NULL,
        ar VARCHAR(300) NOT NULL,
        note VARCHAR(300),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Seed the terms we already know. ON CONFLICT DO NOTHING so edits survive.
    // Both Kurdish spellings of the organisation's name are listed: the site
    // uses مرۆڤدۆستان and the posts use مۆرڤدۆستان.
    await client.query(
      `INSERT INTO glossary (term, en, ar, note) VALUES
         ($1, $2, $3, $4), ($5, $6, $7, $8), ($9, $10, $11, $12)
       ON CONFLICT (term) DO NOTHING`,
      [
        'مرۆڤدۆستان', 'Mrovdostan', 'مروڤدوستان', 'Organisation name (site spelling)',
        'مۆرڤدۆستان', 'Mrovdostan', 'مروڤدوستان', 'Organisation name (spelling used in posts)',
        'هەولێر', 'Erbil', 'أربيل', 'City',
      ],
    );

    // Uploaded images used to be stored as absolute URLs pointing at this
    // service's own domain, which meant every photo bypassed the CDN in front
    // of the public site. Paths are relative now; normalise the rows written
    // before that. Idempotent: rows already relative do not match.
    for (const [table, column] of [
      ['hero_images', 'url'],
      ['gallery_photos', 'url'],
      ['about_image', 'url'],
      ['news', 'image_url'],
      ['projects', 'image_url'],
    ]) {
      await client.query(
        `UPDATE ${table} SET ${column} = regexp_replace(${column}, '^https?://[^/]+(/uploads/)', '\\1')
         WHERE ${column} ~ '^https?://[^/]+/uploads/'`,
      );
    }

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
