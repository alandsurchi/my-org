require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const User = require('./models/User');
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
console.log('  MONGO_URI:', process.env.MONGO_URI ? 'Set' : 'Not set');
console.log('  PORT:', process.env.PORT || 'Using default 5000');
console.log('  JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');

const app = express();

// Security middleware (apply early)
app.use(securityHeaders);

// Enhanced CORS configuration for frontend-backend communication
const corsOptions = {
  origin: ['http://localhost:8080', 'http://127.0.0.1:8080', 'http://localhost:3000'],
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

// Serve static files for uploads with CORS headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Create default admin user
const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@charity.com' });
    if (!adminExists) {
      const defaultAdmin = new User({
        email: 'admin@charity.com',
        password: 'admin123',
        role: 'admin'
      });
      await defaultAdmin.save();
      console.log('🔑 Default admin user created:');
      console.log('   Email: admin@charity.com');
      console.log('   Password: admin123');
      console.log('   Role: admin');
    } else {
      console.log('✅ Admin user already exists: admin@charity.com');
    }
  } catch (error) {
    console.error('❌ Error creating default admin:', error);
  }
};

// MongoDB Connection
let isMongoConnected = false;
console.log('🔗 Connecting to MongoDB...');
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    isMongoConnected = true;
    // Create default admin after DB connection
    createDefaultAdmin();
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    console.log('⚠️ Server will continue running without database connection');
    console.log('💡 Please check your MongoDB Atlas IP whitelist and connection string');
    isMongoConnected = false;
  });

// Middleware to check database connection
const checkDatabaseConnection = (req, res, next) => {
  if (!isMongoConnected) {
    return res.status(503).json({ 
      error: 'Database connection unavailable',
      message: 'MongoDB connection failed. Please check the database configuration.'
    });
  }
  next();
};

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Charity Dashboard API Running',
    version: '1.0.0',
    database: isMongoConnected ? 'Connected' : 'Disconnected',
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
    database: isMongoConnected ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// API Routes with database connection check
try {
  app.use('/api/hero', checkDatabaseConnection, require('./routes/hero'));
  app.use('/api/about', require('./routes/about')); // No database needed for about image
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
