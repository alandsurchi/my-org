const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Do NOT call process.exit on pool errors — the pool automatically removes
// broken clients and creates new ones.  Exiting here means any transient
// database hiccup (idle timeout, brief network blip) kills the entire server.
pool.on('error', (err) => {
  console.error('❌ Unexpected PostgreSQL pool error:', err.message);
  // Log but do NOT exit — the pool handles broken connections automatically.
});

module.exports = pool;
