require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const pool = require('./db');
const initDatabase = require('./init-db');
const seedDatabase = require('./seed');
const { securityHeaders } = require('./middleware/staffSecurity');
const { STORAGE_PATH } = require('./utils/storage');

// ---------------------------------------------------------------------------
// Startup validation
// ---------------------------------------------------------------------------
const REQUIRED_ENV = ['DATABASE_URL', 'JWT_SECRET'];
const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}
if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET.length < 32) {
  console.warn('WARNING: JWT_SECRET is shorter than 32 characters. Generate a longer one and update it in Railway.');
}

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  process.exit(1);
});

console.log('Environment:');
console.log('  NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('  DATABASE_URL:', process.env.DATABASE_URL ? 'set' : 'NOT SET');
console.log('  JWT_SECRET:', process.env.JWT_SECRET ? 'set' : 'NOT SET');
console.log('  STORAGE_TYPE:', process.env.STORAGE_TYPE || 'local');

const app = express();

// Railway (and most PaaS) sit behind one reverse proxy. Without this,
// req.ip is the proxy address, so rate limiting would be shared by all users.
app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(securityHeaders);

// ---------------------------------------------------------------------------
// CORS
// ---------------------------------------------------------------------------
// Auth uses Bearer tokens (no cookies), so accepting any origin is safe: a
// foreign page cannot read our token. Every origin is accepted so the
// frontend can live on any host (Railway, Vercel, localhost). To restrict,
// set CORS_STRICT=true together with ALLOWED_ORIGINS (comma-separated list).
const configuredOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
const restrictOrigins = process.env.CORS_STRICT === 'true' && configuredOrigins.length > 0;
console.log('  CORS:', restrictOrigins ? `restricted to ${configuredOrigins.join(', ')}` : 'any origin');

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || !restrictOrigins || configuredOrigins.includes(origin)) return callback(null, true);
    return callback(null, false); // no CORS headers, no 500
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Session-Warning'],
  optionsSuccessStatus: 204
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Uploaded files (local storage on the Railway volume)
app.use('/uploads', express.static(STORAGE_PATH, { maxAge: '7d', immutable: true }));

// ---------------------------------------------------------------------------
// Bootstrap: default super admin
// ---------------------------------------------------------------------------
const ensureSuperAdmin = async () => {
  const email = (process.env.DEFAULT_ADMIN_EMAIL || 'admin@charity.com').trim().toLowerCase();

  // One-time recovery: DEFAULT_ADMIN_RESET=true forces DEFAULT_ADMIN_EMAIL to
  // exist as a super admin with DEFAULT_ADMIN_PASSWORD. Remove the variable
  // afterwards, otherwise every restart resets that password again.
  if (process.env.DEFAULT_ADMIN_RESET === 'true' && process.env.DEFAULT_ADMIN_PASSWORD) {
    const hashed = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD, 10);
    await pool.query(
      `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, 'super_admin')
       ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password, role = 'super_admin'`,
      ['Administrator', email, hashed]
    );
    console.log(`DEFAULT_ADMIN_RESET applied to ${email}. Remove DEFAULT_ADMIN_RESET from the variables now.`);
    return;
  }

  const superAdmins = await pool.query("SELECT COUNT(*)::int AS count FROM users WHERE role = 'super_admin'");
  if (superAdmins.rows[0].count > 0) return;

  const existing = await pool.query('SELECT id, email FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    // Nobody can manage staff yet: promote the default admin account once.
    await pool.query("UPDATE users SET role = 'super_admin' WHERE id = $1", [existing.rows[0].id]);
    console.log(`Promoted ${email} to super_admin (no super admin existed).`);
    return;
  }

  // Fresh database: create the first super admin. The password comes from
  // DEFAULT_ADMIN_PASSWORD, or a random one is generated and printed ONCE.
  const password = process.env.DEFAULT_ADMIN_PASSWORD || crypto.randomBytes(12).toString('base64url');
  const hashed = await bcrypt.hash(password, 10);
  await pool.query(
    "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, 'super_admin')",
    ['Administrator', email, hashed]
  );
  console.log(`Created first super admin: ${email}`);
  if (!process.env.DEFAULT_ADMIN_PASSWORD) {
    console.log(`Generated password (shown once, change it after first login): ${password}`);
  }
};

// ---------------------------------------------------------------------------
// Database availability
// ---------------------------------------------------------------------------
let isDbConnected = false;

const tryReconnect = async () => {
  try {
    await pool.query('SELECT 1');
    if (!isDbConnected) console.log('Database connection restored');
    isDbConnected = true;
  } catch (err) {
    console.error('Database unavailable:', err.message);
    isDbConnected = false;
  }
};

setInterval(() => { if (!isDbConnected) tryReconnect(); }, 30000).unref();

const dbUnavailable = (res) => res.status(503).json({
  success: false,
  error: 'Database connection unavailable',
  message: 'The database is temporarily unavailable. Please try again shortly.'
});

const checkDatabaseConnection = async (req, res, next) => {
  if (isDbConnected) return next();
  await tryReconnect();
  return isDbConnected ? next() : dbUnavailable(res);
};

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.get('/', (req, res) => {
  res.json({
    message: 'Charity Dashboard API',
    version: '1.1.0',
    database: isDbConnected ? 'Connected' : 'Disconnected',
    endpoints: ['/api/hero', '/api/about', '/api/news', '/api/projects', '/api/gallery', '/api/auth', '/api/staff']
  });
});

const health = (req, res) => {
  res.status(isDbConnected ? 200 : 503).json({
    status: isDbConnected ? 'OK' : 'DEGRADED',
    database: isDbConnected ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
};
app.get('/health', health);
app.get('/api/health', health); // reachable through the frontend's /api proxy

app.use('/api', checkDatabaseConnection);
app.use('/api/hero', require('./routes/hero'));
app.use('/api/about', require('./routes/about'));
app.use('/api/news', require('./routes/news'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/staff', require('./routes/staff'));

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  if (err && err.name === 'MulterError') {
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err && err.message === 'Only image files are allowed!') {
    return res.status(400).json({ success: false, message: err.message });
  }
  console.error(err.stack || err);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
async function startServer() {
  try {
    await initDatabase();
    await pool.query('SELECT 1');
    isDbConnected = true;
    console.log('PostgreSQL connected');

    await seedDatabase();
    await ensureSuperAdmin();
  } catch (error) {
    console.error('Database initialisation failed:', error.message);
    console.log('Server will start anyway and keep retrying the database.');
    isDbConnected = false;
  }

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
