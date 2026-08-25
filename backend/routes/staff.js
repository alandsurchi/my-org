const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../db');
const { staffValidation, validateRequest } = require('../middleware/validator');

const SUPER_ADMINS = process.env.SUPER_ADMINS ? process.env.SUPER_ADMINS.split(',') : [
  'aland.surchi456@gmail.com',
  'aland.raed.othman@gmail.com'
];

const SELECT_USER_SAFE = 'SELECT id, name, email, role, created_at AS "createdAt"';

const verifySuperAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
    if (result.rows.length === 0) return res.status(401).json({ success: false, message: 'User not found' });
    const user = result.rows[0];
    if (user.role !== 'super_admin' && !SUPER_ADMINS.includes(user.email)) {
      return res.status(403).json({ success: false, message: 'Access denied. Super admin only.' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

const verifyAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
    if (result.rows.length === 0) return res.status(401).json({ success: false, message: 'User not found' });
    req.user = result.rows[0];
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

const verifyStaffAccess = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
    if (result.rows.length === 0) return res.status(401).json({ success: false, message: 'User not found' });
    const user = result.rows[0];
    if (!['super_admin', 'admin', 'staff'].includes(user.role) && !SUPER_ADMINS.includes(user.email)) {
      return res.status(403).json({ success: false, message: 'Access denied. Staff access only.' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// GET all staff members
router.get('/', verifyStaffAccess, async (req, res, next) => {
  try {
    const result = await pool.query(`${SELECT_USER_SAFE} FROM users ORDER BY created_at DESC`);
    const staffWithFlags = result.rows.map(member => ({
      ...member,
      isSuperAdmin: SUPER_ADMINS.includes(member.email),
      canEdit: SUPER_ADMINS.includes(req.user.email)
    }));
    res.json({ success: true, data: staffWithFlags });
  } catch (error) {
    next(error);
  }
});

// POST create new staff member
router.post('/', verifySuperAdmin, staffValidation, validateRequest, async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
      [name, email.toLowerCase(), hashedPassword, role || 'admin']
    );
    const result = await pool.query(`${SELECT_USER_SAFE} FROM users WHERE email = $1`, [email.toLowerCase()]);
    const user = result.rows[0];
    user.isSuperAdmin = SUPER_ADMINS.includes(user.email);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

// PUT update staff member
router.put('/:id', verifySuperAdmin, staffValidation, validateRequest, async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const userId = req.params.id;
    const existing = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (existing.rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    const user = existing.rows[0];
    if (SUPER_ADMINS.includes(user.email) && email && email.toLowerCase() !== user.email) {
      return res.status(403).json({ success: false, message: 'Cannot change email of super admin' });
    }
    const updates = [];
    const values = [];
    let paramIndex = 1;
    if (name) { updates.push(`name = $${paramIndex++}`); values.push(name); }
    if (email) { updates.push(`email = $${paramIndex++}`); values.push(email.toLowerCase()); }
    if (role && ['super_admin', 'admin', 'staff'].includes(role)) { updates.push(`role = $${paramIndex++}`); values.push(role); }
    if (password && password.length >= 6) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updates.push(`password = $${paramIndex++}`); values.push(hashedPassword);
    }
    if (updates.length > 0) {
      values.push(userId);
      await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex}`, values);
    }
    const result = await pool.query(`${SELECT_USER_SAFE} FROM users WHERE id = $1`, [userId]);
    const updatedUser = result.rows[0];
    updatedUser.isSuperAdmin = SUPER_ADMINS.includes(updatedUser.email);
    res.json({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
});

// DELETE staff member
router.delete('/:id', verifySuperAdmin, async (req, res, next) => {
  try {
    const userId = req.params.id;
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    const user = result.rows[0];
    if (SUPER_ADMINS.includes(user.email)) return res.status(403).json({ success: false, message: 'Cannot delete super admin' });
    if (user.id === req.user.id) return res.status(403).json({ success: false, message: 'Cannot delete your own account' });
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    res.json({ success: true, data: { message: 'Staff member deleted successfully' } });
  } catch (error) {
    next(error);
  }
});

// GET current user info
router.get('/me', verifyAuth, async (req, res, next) => {
  try {
    const userResponse = { ...req.user };
    delete userResponse.password;
    userResponse.isSuperAdmin = SUPER_ADMINS.includes(req.user.email);
    res.json({ success: true, data: userResponse });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
