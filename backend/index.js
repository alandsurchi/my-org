require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const initDatabase = require('./init-db');
const { securityHeaders } = require('./middleware/staffSecurity');

// Add process error handlers
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

console.log('🔧 Environment variables loaded:');
console.log('  DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
console.log('  PORT:', process.env.PORT || 'Using default 5000');
console.log('  JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');

const app = express();

// Security middleware (apply early)
app.use(securityHeaders);

// Parse ALLOWED_ORIGINS from environment
const rawOrigins = process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || '';
const parsedOrigins = rawOrigins.split(',').map(o => o.trim()).filter(o => o.length > 0);

// Default development origins
const devOrigins = ['http://localhost:8080', 'http://127.0.0.1:8080', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'];

// Combine origins - always include devOrigins to facilitate local testing
const allowedOrigins = [...new Set([...devOrigins, ...parsedOrigins])];

// Enhanced CORS configuration for frontend-backend communication
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create default admin user
const createDefaultAdmin = async () => {
  try {
    const result = await pool.query(
      `SELECT id FROM users WHERE email = $1`,
      ['admin@charity.com']
    );
    if (result.rows.length === 0) {
      const bcrypt = require('bcrypt');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      await pool.query(
        `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)`,
        ['Default Admin', 'admin@charity.com', hashedPassword, 'admin']
      );
      console.log('🔑 Default admin user created:');
      console.log('   Email: admin@charity.com');
      console.log('   Password: admin123');
      console.log('   Role: admin');
    } else {
      console.log('✅ Admin user already exists: admin@charity.com');
    }
  } catch (error) {
    console.error('❌ Error creating default admin:', error.message);
  }
};

// Database connection check
let isDbConnected = false;

const checkDatabaseConnection = (req, res, next) => {
  if (!isDbConnected) {
    return res.status(503).json({ 
      error: 'Database connection unavailable',
      message: 'PostgreSQL connection failed. Please check the database configuration.'
    });
  }
  next();
};

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Charity Dashboard API Running',
    version: '1.0.0',
    database: isDbConnected ? 'Connected' : 'Disconnected',
    endpoints: [
      '/api/hero',
      '/api/about',
      '/api/news', 
      '/api/projects',
      '/api/gallery',
      '/api/auth',
      '/api/staff'
    ]
  });
});

// Health check endpoint (no database required)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'Server is running',
    database: isDbConnected ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Initialize DB and start server
async function startServer() {
  try {
    // Initialize database schema
    await initDatabase();
    
    // Test connection
    const result = await pool.query('SELECT NOW()');
    console.log('✅ PostgreSQL connected successfully at:', result.rows[0].now);
    isDbConnected = true;
    
    // Create default admin after DB connection
    await createDefaultAdmin();
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error.message);
    console.log('⚠️ Server will continue running without database connection');
    isDbConnected = false;
  }

  // API Routes with database connection check
  try {
    app.use('/api/hero', checkDatabaseConnection, require('./routes/hero'));
    app.use('/api/about', require('./routes/about'));
    app.use('/api/news', checkDatabaseConnection, require('./routes/news'));
    app.use('/api/projects', checkDatabaseConnection, require('./routes/projects'));
    app.use('/api/gallery', checkDatabaseConnection, require('./routes/gallery'));
    app.use('/api/auth', checkDatabaseConnection, require('./routes/auth'));
    app.use('/api/staff', checkDatabaseConnection, require('./routes/staff'));
    console.log('✅ All routes loaded successfully');
  } catch (error) {
    console.error('❌ Error loading routes:', error);
  }

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
  });

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', (err) => {
    if (err) {
      console.error('❌ Server failed to start:', err);
      process.exit(1);
    }
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 API available at: http://localhost:${PORT}`);
    console.log(`🌐 Also available at: http://0.0.0.0:${PORT}`);
  });
}

startServer();
