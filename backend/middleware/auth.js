const jwt = require('jsonwebtoken');
const pool = require('../db');
const { isSuperAdmin, isValidRole } = require('../config/roles');

const SELECT_USER = 'SELECT id, name, email, role, created_at AS "createdAt", last_login AS "lastLogin" FROM users WHERE id = $1';

const extractToken = (req) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return null;
  const token = header.slice(7).trim();
  return token || null;
};

/**
 * Verifies the JWT and loads the user from the database so that deleted or
 * demoted accounts lose access immediately, not only when their token expires.
 * Attaches `req.user` = { id, name, email, role, isSuperAdmin, tokenExp }.
 */
const requireAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ success: false, error: 'Access denied. No valid token provided.', code: 'NO_TOKEN' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      const expired = err.name === 'TokenExpiredError';
      return res.status(401).json({
        success: false,
        error: expired ? 'Access denied. Token has expired.' : 'Access denied. Invalid token.',
        code: expired ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN'
      });
    }

    const result = await pool.query(SELECT_USER, [decoded.userId]);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Access denied. User no longer exists.', code: 'USER_NOT_FOUND' });
    }

    const user = result.rows[0];
    if (!isValidRole(user.role)) {
      return res.status(403).json({ success: false, error: 'Access denied. Insufficient privileges.', code: 'INSUFFICIENT_PRIVILEGES' });
    }

    req.user = { ...user, isSuperAdmin: isSuperAdmin(user), tokenExp: decoded.exp };

    // Warn the client when the session is about to expire
    if (decoded.exp && decoded.exp * 1000 - Date.now() < 5 * 60 * 1000) {
      res.setHeader('X-Session-Warning', 'Session expires soon');
    }

    next();
  } catch (error) {
    next(error);
  }
};

/** Must be used after requireAuth. */
const requireSuperAdmin = (req, res, next) => {
  if (!req.user || !req.user.isSuperAdmin) {
    return res.status(403).json({ success: false, error: 'Access denied. Super admin only.', code: 'SUPER_ADMIN_ONLY' });
  }
  next();
};

module.exports = { requireAuth, requireSuperAdmin };
