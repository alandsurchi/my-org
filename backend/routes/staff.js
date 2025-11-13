const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Super admin emails (hardcoded)
const SUPER_ADMINS = [
  'aland.surchi456@gmail.com',
  'aland.raed.othman@gmail.com'
];

// Middleware to verify token and check if user is super admin
const verifySuperAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Check if user is super admin (either by role or hardcoded email)
    if (user.role !== 'super_admin' && !SUPER_ADMINS.includes(user.email)) {
      return res.status(403).json({ message: 'Access denied. Super admin only.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to verify token (for any authenticated user)
const verifyAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// GET all staff members (Super admin only)
router.get('/', verifySuperAdmin, async (req, res) => {
  try {
    const staff = await User.find().select('-password').sort({ createdAt: -1 });
    
    // Add isSuperAdmin flag based on hardcoded emails
    const staffWithFlags = staff.map(member => ({
      ...member.toObject(),
      isSuperAdmin: SUPER_ADMINS.includes(member.email),
      canEdit: SUPER_ADMINS.includes(req.user.email)
    }));
    
    res.json(staffWithFlags);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching staff', error: error.message });
  }
});

// POST create new staff member (Super admin only)
router.post('/', verifySuperAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Validate role
    if (role && !['super_admin', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Create new user
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'admin'
    });

    await newUser.save();

    // Return user without password
    const userResponse = newUser.toObject();
    delete userResponse.password;
    userResponse.isSuperAdmin = SUPER_ADMINS.includes(newUser.email);

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Error creating staff member', error: error.message });
  }
});

// PUT update staff member (Super admin only)
router.put('/:id', verifySuperAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent modification of super admin emails
    if (SUPER_ADMINS.includes(user.email) && email && email.toLowerCase() !== user.email) {
      return res.status(403).json({ message: 'Cannot change email of super admin' });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (role && ['super_admin', 'admin'].includes(role)) {
      user.role = role;
    }
    
    // Update password if provided
    if (password && password.length >= 6) {
      user.password = password; // Will be hashed by pre-save hook
    }

    await user.save();

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;
    userResponse.isSuperAdmin = SUPER_ADMINS.includes(user.email);

    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Error updating staff member', error: error.message });
  }
});

// DELETE staff member (Super admin only)
router.delete('/:id', verifySuperAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deletion of super admins
    if (SUPER_ADMINS.includes(user.email)) {
      return res.status(403).json({ message: 'Cannot delete super admin' });
    }

    // Prevent users from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(403).json({ message: 'Cannot delete your own account' });
    }

    await User.findByIdAndDelete(userId);
    res.json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting staff member', error: error.message });
  }
});

// GET current user info
router.get('/me', verifyAuth, async (req, res) => {
  try {
    const userResponse = req.user.toObject();
    delete userResponse.password;
    userResponse.isSuperAdmin = SUPER_ADMINS.includes(req.user.email);
    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user info', error: error.message });
  }
});

module.exports = router;
