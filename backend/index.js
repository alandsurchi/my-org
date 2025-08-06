require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const User = require('./models/User');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    // Create default admin after DB connection
    createDefaultAdmin();
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Charity Dashboard API Running',
    version: '1.0.0',
    endpoints: [
      '/api/hero',
      '/api/news', 
      '/api/projects',
      '/api/gallery',
      '/api/auth'
    ]
  });
});

// API Routes
app.use('/api/hero', require('./routes/hero'));
app.use('/api/news', require('./routes/news'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/auth', require('./routes/auth'));

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
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 API available at: http://localhost:${PORT}`);
});
