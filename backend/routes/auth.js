const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../db');
const { staffLoginLimiter, securityHeaders, auditLog } = require('../middleware/staffSecurity');
const { loginValidation, staffValidation, validateRequest } = require('../middleware/validator');

const SUPER_ADMINS = process.env.SUPER_ADMINS ? process.env.SUPER_ADMINS.split(',') : [
  'aland.surchi456@gmail.com',
  'aland.raed.othman@gmail.com'
];

const SELECT_USER_SAFE = 'SELECT id, name, email, role, created_at AS "createdAt"';
const SELECT_USER_ALL = 'SELECT id, name, email, role, created_at AS "createdAt", last_login AS "lastLogin"';

router.use(securityHeaders);

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Access token required' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// POST register
router.post('/register', staffValidation, validateRequest, async (req, res, next) => {
  try {
    const { email, password, role, name } = req.body;
    const normalizedEmail = email.toLowerCase();
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await pool.query(
      `${SELECT_USER_SAFE} FROM users WHERE email = $1`,
      [normalizedEmail]
    );
    // Re-query to get the inserted user
    await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
      [name || normalizedEmail.split('@')[0], normalizedEmail, hashedPassword, role || 'staff']
    );
    const inserted = await pool.query(`${SELECT_USER_SAFE} FROM users WHERE email = $1`, [normalizedEmail]);
    res.status(201).json({ success: true, message: 'User created successfully', data: { user: inserted.rows[0] } });
  } catch (error) {
    next(error);
  }
});

// POST login
router.post('/login', staffLoginLimiter, auditLog('LOGIN_ATTEMPT'), loginValidation, validateRequest, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' });
    }
    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' });
    }
    const sessionTimeout = process.env.STAFF_SESSION_TIMEOUT || '1h';
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, iat: Math.floor(Date.now() / 1000) },
      process.env.JWT_SECRET,
      { expiresIn: sessionTimeout }
    );
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);
    console.log(`🔒 SUCCESSFUL LOGIN: ${email} from IP: ${req.ip}`);
    const isSuperAdmin = SUPER_ADMINS.includes(user.email);
    res.json({
      success: true,
      data: {
        message: 'Login successful',
        token,
        expiresIn: sessionTimeout,
        user: { id: user.id, name: user.name, email: user.email, role: user.role, isSuperAdmin }
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET verify token
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`${SELECT_USER_SAFE} FROM users WHERE id = $1`, [req.user.userId]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: { user: result.rows[0] } });
  } catch (error) {
    next(error);
  }
});

// GET all users (admin only)
router.get('/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin access required' });
    const result = await pool.query(`${SELECT_USER_SAFE} FROM users ORDER BY created_at DESC`);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
