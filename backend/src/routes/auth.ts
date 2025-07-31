import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { StaffAccount } from '../models/StaffAccount';

const router = express.Router();

// Staff login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find staff account
    const staffAccount = await StaffAccount.findOne({ email }).select('+password');
    if (!staffAccount) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, staffAccount.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: staffAccount._id, 
        email: staffAccount.email, 
        role: staffAccount.role 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    // Update last login
    staffAccount.lastLogin = new Date();
    await staffAccount.save();

    res.json({
      token,
      user: {
        id: staffAccount._id,
        email: staffAccount.email,
        firstName: staffAccount.firstName,
        lastName: staffAccount.lastName,
        role: staffAccount.role,
        lastLogin: staffAccount.lastLogin
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify token (middleware endpoint)
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    const staffAccount = await StaffAccount.findById(decoded.id);

    if (!staffAccount) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.json({
      user: {
        id: staffAccount._id,
        email: staffAccount.email,
        firstName: staffAccount.firstName,
        lastName: staffAccount.lastName,
        role: staffAccount.role,
        lastLogin: staffAccount.lastLogin
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Logout (client-side token removal, but we can track logout time)
router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
      const staffAccount = await StaffAccount.findById(decoded.id);
      
      if (staffAccount) {
        staffAccount.lastLogout = new Date();
        await staffAccount.save();
      }
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    // Even if token verification fails, we return success for logout
    res.json({ message: 'Logged out successfully' });
  }
});

export default router;
