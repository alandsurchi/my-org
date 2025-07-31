import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

// Import routes
import newsRoutes from './routes/news';
import projectRoutes from './routes/projects';
import staffRoutes from './routes/staff';
import galleryRoutes from './routes/gallery';
import staffAccountRoutes from './routes/staffAccounts';
import authRoutes from './routes/auth';
import uploadRoutes from './routes/upload';
import databaseRoutes from './routes/database';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Rate limiting
const limiter = rateLimit({
  windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW || '15') || 15) * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX || '100') || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://localhost:8080',
    process.env.CORS_ORIGIN || 'http://localhost:3000'
  ],
  credentials: true
}));
app.use(morgan('combined'));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/staff-accounts', staffAccountRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/database', databaseRoutes);

// API root welcome message
app.get('/api', (req, res) => {
  res.json({
    message: 'Organization Website API',
    version: '1.0.0',
    status: 'Active',
    endpoints: {
      health: '/api/health',
      news: '/api/news',
      projects: '/api/projects',
      staff: '/api/staff',
      gallery: '/api/gallery',
      auth: '/api/auth',
      database: '/api/database'
    },
    documentation: 'API is working correctly!'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message 
  });
});

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/org_website';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
    console.log(`🔗 Frontend CORS origin: ${process.env.CORS_ORIGIN}`);
  });
};

startServer().catch(console.error);

export default app;
