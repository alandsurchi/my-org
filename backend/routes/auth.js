const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { staffLoginLimiter, securityHeaders, auditLog } = require('../middleware/staffSecurity');

// Super admin emails (hardcoded)
const SUPER_ADMINS = [
  'aland.surchi456@gmail.com',
  'aland.raed.othman@gmail.com'
];

// Apply security headers to all auth routes
router.use(securityHeaders);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// POST register new user (admin only in production)
router.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const user = new User({
      email,
      password,
      role: role || 'staff'
    });
    
    await user.save();
    
    // Don't send password in response
    const userResponse = {
      id: user._id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };
    
    res.status(201).json({ 
      message: 'User created successfully', 
      user: userResponse 
    });
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error: error.message });
  }
});

// POST login with enhanced security
router.post('/login', staffLoginLimiter, auditLog('LOGIN_ATTEMPT'), async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Input validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required',
        code: 'MISSING_CREDENTIALS'
      });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal whether user exists or not
      return res.status(401).json({ 
        message: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }
    
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }
    
    // Generate JWT token with shorter expiry for security
    const sessionTimeout = process.env.STAFF_SESSION_TIMEOUT || '1h';
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role,
        iat: Math.floor(Date.now() / 1000)
      },
      process.env.JWT_SECRET,
      { expiresIn: sessionTimeout }
    );
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Log successful login
    console.log(`🔒 SUCCESSFUL LOGIN: ${email} from IP: ${req.ip}`);
    
    const isSuperAdmin = SUPER_ADMINS.includes(user.email);
    
    res.json({
      message: 'Login successful',
      token,
      expiresIn: sessionTimeout,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isSuperAdmin: isSuperAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
});

// GET verify token
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying token', error: error.message });
  }
});

// GET all users (admin only)
router.get('/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

module.exports = router;
