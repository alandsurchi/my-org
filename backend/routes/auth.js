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

// ---------------------------------------------------------------------------
// Password reset + change
// ---------------------------------------------------------------------------
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const { sendMail, isEmailConfigured } = require('../utils/mailer');

const forgotLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, standardHeaders: true, legacyHeaders: false });
const hashToken = (t) => crypto.createHash('sha256').update(t).digest('hex');

const siteUrl = (req) => {
  const configured = (process.env.PUBLIC_SITE_URL || process.env.FRONTEND_URL || '').replace(/\/+$/, '');
  if (configured) return configured;
  const origin = req.get('origin');
  return origin || `${req.protocol}://${req.get('host')}`;
};

// GET /api/auth/features — lets the login page know whether "forgot password" can work
router.get('/features', (req, res) => {
  res.json({ success: true, data: { passwordResetEmail: isEmailConfigured() } });
});

// POST /api/auth/forgot { email } — always 204 so emails cannot be enumerated
router.post('/forgot', forgotLimiter, body('email').trim().toLowerCase().isEmail(), validateRequest, async (req, res) => {
  const email = normalizeEmail(req.body.email);
  try {
    if (!isEmailConfigured()) {
      console.warn(`Password reset requested for ${email} but email is not configured`);
      return res.status(204).end();
    }
    const user = (await pool.query('SELECT id, name, email FROM users WHERE email = $1', [email])).rows[0];
    if (user) {
      const token = crypto.randomBytes(32).toString('base64url');
      await pool.query('DELETE FROM password_resets WHERE user_id = $1', [user.id]);
      await pool.query(
        "INSERT INTO password_resets (user_id, token_hash, expires_at) VALUES ($1, $2, NOW() + INTERVAL '1 hour')",
        [user.id, hashToken(token)]
      );
      const link = `${siteUrl(req)}/reset-password?token=${token}`;
      await sendMail({
        to: user.email,
        subject: 'Reset your Mrovdostan staff password',
        text: `Hello ${user.name},\n\nUse this link to choose a new password (valid for 1 hour):\n${link}\n\nIf you did not ask for this, ignore this email.`,
        html: `<p>Hello ${user.name},</p><p>Use this link to choose a new password (valid for 1 hour):</p><p><a href="${link}">${link}</a></p><p>If you did not ask for this, ignore this email.</p>`,
      });
      console.log(`Password reset email sent to ${email}`);
    }
  } catch (err) {
    console.error('Password reset request failed:', err.message);
  }
  res.status(204).end();
});

// POST /api/auth/reset { token, password }
router.post('/reset',
  body('token').isString().isLength({ min: 20 }),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  validateRequest,
  async (req, res, next) => {
    try {
      const row = (await pool.query(
        'SELECT id, user_id FROM password_resets WHERE token_hash = $1 AND used_at IS NULL AND expires_at > NOW()',
        [hashToken(req.body.token)]
      )).rows[0];
      if (!row) return res.status(400).json({ success: false, message: 'This reset link is invalid or has expired. Request a new one.' });

      const hashed = await bcrypt.hash(req.body.password, 10);
      await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashed, row.user_id]);
      await pool.query('UPDATE password_resets SET used_at = NOW() WHERE id = $1', [row.id]);
      res.json({ success: true, message: 'Password updated. You can log in now.' });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/auth/change-password { currentPassword, newPassword } (logged in)
router.post('/change-password', requireAuth,
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
  validateRequest,
  async (req, res, next) => {
    try {
      const user = (await pool.query('SELECT password FROM users WHERE id = $1', [req.user.id])).rows[0];
      const ok = user && (await bcrypt.compare(req.body.currentPassword, user.password));
      if (!ok) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      const hashed = await bcrypt.hash(req.body.newPassword, 10);
      await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashed, req.user.id]);
      res.json({ success: true, message: 'Password changed' });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
