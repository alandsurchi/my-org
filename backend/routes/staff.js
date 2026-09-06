const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../db');
const { requireAuth, requireSuperAdmin } = require('../middleware/auth');
const { staffCreateValidation, staffUpdateValidation, validateRequest } = require('../middleware/validator');
const { isSuperAdmin, isValidRole, normalizeEmail, SUPER_ADMIN_EMAILS } = require('../config/roles');

const SELECT_USER_SAFE = 'SELECT id, name, email, role, created_at AS "createdAt", last_login AS "lastLogin"';

// isProtected: cannot be edited/deleted by the requester (own account, or an
// email pinned in SUPER_ADMINS). Deleting yourself is never allowed.
const withFlags = (member, requester) => ({
  ...member,
  isSuperAdmin: isSuperAdmin(member),
  isProtected: member.id === requester.id || SUPER_ADMIN_EMAILS.includes(member.email),
  canEdit: requester.isSuperAdmin
});

const countSuperAdmins = async () => {
  const result = await pool.query("SELECT COUNT(*)::int AS count FROM users WHERE role = 'super_admin'");
  return result.rows[0].count;
};

// GET /api/staff — any authenticated staff member can see the list
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query(`${SELECT_USER_SAFE} FROM users ORDER BY created_at DESC`);
    res.json({ success: true, data: result.rows.map((m) => withFlags(m, req.user)) });
  } catch (error) {
    next(error);
  }
});

// GET /api/staff/me
router.get('/me', requireAuth, (req, res) => {
  const { tokenExp, ...user } = req.user;
  res.json({ success: true, data: user });
});

// POST /api/staff — super admin only
router.post('/', requireAuth, requireSuperAdmin, staffCreateValidation, validateRequest, async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { name, password } = req.body;
    const role = isValidRole(req.body.role) ? req.body.role : 'admin';

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, created_at AS "createdAt", last_login AS "lastLogin"`,
      [name.trim(), email, hashedPassword, role]
    );
    res.status(201).json({ success: true, data: withFlags(result.rows[0], req.user) });
  } catch (error) {
    next(error);
  }
});

// PUT /api/staff/:id — super admin only
router.put('/:id', requireAuth, requireSuperAdmin, staffUpdateValidation, validateRequest, async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (Number.isNaN(userId)) return res.status(400).json({ success: false, message: 'Invalid user id' });

    const existing = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (existing.rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    const target = existing.rows[0];

    const { name, password, role } = req.body;
    const email = req.body.email ? normalizeEmail(req.body.email) : undefined;

    // Accounts listed in SUPER_ADMINS (env) can only be edited by their owner.
    if (SUPER_ADMIN_EMAILS.includes(target.email) && target.id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'This account is protected and can only be edited by its owner' });
    }

    // Never demote the last super admin.
    if (role && role !== 'super_admin' && target.role === 'super_admin' && (await countSuperAdmins()) <= 1) {
      return res.status(403).json({ success: false, message: 'Cannot demote the last super admin' });
    }

    if (email && email !== target.email) {
      const clash = await pool.query('SELECT id FROM users WHERE email = $1 AND id <> $2', [email, userId]);
      if (clash.rows.length > 0) return res.status(409).json({ success: false, message: 'Email already in use' });
    }

    const updates = [];
    const values = [];
    let i = 1;
    if (name) { updates.push(`name = $${i++}`); values.push(name.trim()); }
    if (email) { updates.push(`email = $${i++}`); values.push(email); }
    if (role && isValidRole(role)) { updates.push(`role = $${i++}`); values.push(role); }
    if (password) { updates.push(`password = $${i++}`); values.push(await bcrypt.hash(password, 10)); }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    values.push(userId);
    const result = await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${i}
       RETURNING id, name, email, role, created_at AS "createdAt", last_login AS "lastLogin"`,
      values
    );
    res.json({ success: true, data: withFlags(result.rows[0], req.user) });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/staff/:id — super admin only
router.delete('/:id', requireAuth, requireSuperAdmin, async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (Number.isNaN(userId)) return res.status(400).json({ success: false, message: 'Invalid user id' });

    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    const target = result.rows[0];

    if (target.id === req.user.id) return res.status(403).json({ success: false, message: 'Cannot delete your own account' });
    if (SUPER_ADMIN_EMAILS.includes(target.email)) return res.status(403).json({ success: false, message: 'This account is protected' });
    if (target.role === 'super_admin' && (await countSuperAdmins()) <= 1) {
      return res.status(403).json({ success: false, message: 'Cannot delete the last super admin' });
    }

    await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    res.json({ success: true, data: { message: 'Staff member deleted successfully' } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
