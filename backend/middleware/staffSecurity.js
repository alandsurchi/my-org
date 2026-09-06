const rateLimit = require('express-rate-limit');
const { requireAuth } = require('./auth');

// Rate limiting for staff login attempts.
// Requires `app.set('trust proxy', 1)` so the limiter keys on the real client IP
// behind Railway's proxy instead of the proxy's own address.
const staffLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // failed attempts per IP per window
  message: {
    success: false,
    error: 'Too many login attempts from this IP, please try again later.',
    code: 'TOO_MANY_REQUESTS',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true
});

// Security headers middleware
const securityHeaders = (req, res, next) => {
  // Force HTTPS in production (Railway terminates TLS and sets x-forwarded-proto)
  if (process.env.NODE_ENV === 'production' && req.header('x-forwarded-proto') === 'http') {
    return res.redirect(301, `https://${req.header('host')}${req.originalUrl}`);
  }

  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); // uploads are embedded by the frontend

  next();
};

// Audit logging middleware
const auditLog = (action) => (req, res, next) => {
  const logData = {
    timestamp: new Date().toISOString(),
    action,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    url: req.originalUrl,
    method: req.method,
    user: req.user ? req.user.email : 'anonymous'
  };
  console.log('AUDIT', JSON.stringify(logData));
  next();
};

module.exports = {
  requireStaffAuth: requireAuth, // kept for backwards compatibility
  staffLoginLimiter,
  securityHeaders,
  auditLog
};
