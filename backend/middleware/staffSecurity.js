const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

// Rate limiting for staff login attempts
const staffLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many login attempts from this IP, please try again later.',
    retryAfter: 15 * 60 // 15 minutes in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip successful requests
  skipSuccessfulRequests: true,
  // Only count failed requests
  skip: (req, res) => res.statusCode < 400
});

// Enhanced authentication middleware for staff routes
const requireStaffAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Access denied. No valid token provided.',
        code: 'NO_TOKEN'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Access denied. Token is required.',
        code: 'EMPTY_TOKEN'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user has staff privileges
    if (!decoded.role || (decoded.role !== 'admin' && decoded.role !== 'staff')) {
      return res.status(403).json({ 
        error: 'Access denied. Insufficient privileges.',
        code: 'INSUFFICIENT_PRIVILEGES'
      });
    }

    // Check token expiry (additional check)
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return res.status(401).json({ 
        error: 'Access denied. Token has expired.',
        code: 'TOKEN_EXPIRED'
      });
    }

    // Add user info to request
    req.user = decoded;
    next();
    
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Access denied. Invalid token.',
        code: 'INVALID_TOKEN'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Access denied. Token has expired.',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    return res.status(500).json({ 
      error: 'Internal server error during authentication.',
      code: 'AUTH_ERROR'
    });
  }
};

// Security headers middleware
const securityHeaders = (req, res, next) => {
  // Force HTTPS in production
  if (process.env.NODE_ENV === 'production' && req.header('x-forwarded-proto') !== 'https') {
    return res.redirect(`https://${req.header('host')}${req.url}`);
  }

  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  next();
};

// Audit logging middleware
const auditLog = (action) => {
  return (req, res, next) => {
    const logData = {
      timestamp: new Date().toISOString(),
      action: action,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl,
      method: req.method,
      user: req.user ? req.user.email : 'anonymous'
    };
    
    // In production, you might want to log to a file or external service
    console.log('🔒 AUDIT LOG:', JSON.stringify(logData));
    
    next();
  };
};

// Session timeout checker
const checkSessionTimeout = (req, res, next) => {
  if (req.user && req.user.exp) {
    const timeUntilExpiry = (req.user.exp * 1000) - Date.now();
    
    // If less than 5 minutes until expiry, suggest refresh
    if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
      res.setHeader('X-Session-Warning', 'Session expires soon');
    }
  }
  next();
};

module.exports = {
  requireStaffAuth,
  staffLoginLimiter,
  securityHeaders,
  auditLog,
  checkSessionTimeout
};
