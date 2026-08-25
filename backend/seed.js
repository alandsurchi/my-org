const fs = require('fs');
const path = require('path');
const pool = require('./db');

async function seedDatabase() {
  const client = await pool.connect();
  try {
    // Check if users table is empty (excluding the auto-created default admin)
    const result = await client.query('SELECT COUNT(*) FROM users');
    const count = parseInt(result.rows[0].count);
    
    if (count > 1) {
      console.log('📦 Database already seeded (' + count + ' users). Skipping.');
      return;
    }

    // Read and execute seed SQL
    const seedPath = path.join(__dirname, 'seed-data.sql');
    if (!fs.existsSync(seedPath)) {
      console.log('📦 No seed file found. Skipping seed.');
      return;
    }

    const seedSql = fs.readFileSync(seedPath, 'utf8');
    console.log('📦 Seeding database from seed-data.sql...');
    
    await client.query('BEGIN');
    
    // Split by semicolons and execute each statement
    const statements = seedSql.split(';').filter(s => s.trim() && !s.trim().startsWith('--'));
    for (const stmt of statements) {
      const trimmed = stmt.trim();
      if (trimmed) {
        try {
          await client.query(trimmed);
        } catch (err) {
          console.warn('  ⚠️ Seed statement warning:', err.message.substring(0, 80));
        }
      }
    }
    
    await client.query('COMMIT');
    
    // Verify
    const after = await client.query('SELECT COUNT(*) FROM users');
    console.log('✅ Seed complete. Users now: ' + after.rows[0].count);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seed failed:', error.message);
  } finally {
    client.release();
  }
}

module.exports = seedDatabase;

// Run if called directly
if (require.main === module) {
  seedDatabase().then(() => process.exit(0)).catch(() => process.exit(1));
}
