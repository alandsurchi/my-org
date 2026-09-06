const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const { staffLoginLimiter, auditLog } = require('../middleware/staffSecurity');
const { requireAuth, requireSuperAdmin } = require('../middleware/auth');
const { loginValidation, staffCreateValidation, validateRequest } = require('../middleware/validator');
const { isSuperAdmin, normalizeEmail } = require('../config/roles');

const SELECT_USER_SAFE = 'SELECT id, name, email, role, created_at AS "createdAt", last_login AS "lastLogin"';

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  isSuperAdmin: isSuperAdmin(user),
  createdAt: user.createdAt || user.created_at,
  lastLogin: user.lastLogin || user.last_login
});

// POST /api/auth/login
router.post('/login', staffLoginLimiter, auditLog('LOGIN_ATTEMPT'), loginValidation, validateRequest, async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    // Compare against a dummy hash when the user does not exist so that the
    // response time does not reveal whether the email is registered.
    const hash = user ? user.password : '$2a$10$CwTycUXWue0Thq9StjUM0uJ8Z0iZzqZ0Y7q4sRr5o1lZC5kQ8iX9W';
    const valid = await bcrypt.compare(password, hash);
    if (!user || !valid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' });
    }

    const sessionTimeout = process.env.STAFF_SESSION_TIMEOUT || '1h';
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: sessionTimeout }
    );

    await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);
    console.log(`LOGIN OK: ${email} from ${req.ip}`);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      expiresIn: sessionTimeout,
      user: publicUser(user)
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/register — super admins only. Public self-registration is disabled.
router.post('/register', requireAuth, requireSuperAdmin, staffCreateValidation, validateRequest, async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password, role, name } = req.body;

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const inserted = await pool.query(
      `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, created_at AS "createdAt"`,
      [name || email.split('@')[0], email, hashedPassword, role || 'staff']
    );
    res.status(201).json({ success: true, message: 'User created successfully', data: { user: publicUser(inserted.rows[0]) } });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/verify
router.get('/verify', requireAuth, (req, res) => {
  res.json({ success: true, data: { user: publicUser(req.user) } });
});

// GET /api/auth/users — admins and super admins
router.get('/users', requireAuth, async (req, res, next) => {
  try {
    if (!req.user.isSuperAdmin && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    const result = await pool.query(`${SELECT_USER_SAFE} FROM users ORDER BY created_at DESC`);
    res.json({ success: true, data: result.rows.map(publicUser) });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
