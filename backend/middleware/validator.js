const { body, validationResult } = require('express-validator');
const { ROLES } = require('../config/roles');

// Centralized error handler for express-validator
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({ field: err.path || err.param, message: err.msg }))
    });
  }
  next();
};

// Reusable file validator (for multer)
const checkFile = (isRequired) => (value, { req }) => {
  if (isRequired && !req.file) {
    throw new Error('Image file is required');
  }
  if (req.file) {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      throw new Error('Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed');
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (req.file.size > maxSize) {
      throw new Error('File size exceeds 5MB limit');
    }
  }
  return true;
};

// NOTE: we deliberately do NOT use normalizeEmail() — it strips dots from
// Gmail addresses, which would make stored emails and login emails differ.
const emailField = (field = 'email') =>
  body(field).trim().toLowerCase().isEmail().withMessage('Must be a valid email address');

const loginValidation = [
  emailField().notEmpty().withMessage('Email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Staff creation
const staffCreateValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  emailField(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').optional({ checkFalsy: true }).isIn(ROLES).withMessage(`Role must be one of ${ROLES.join(', ')}`)
];

// Staff update (all fields optional)
const staffUpdateValidation = [
  body('name').optional({ checkFalsy: true }).trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').optional({ checkFalsy: true }).trim().toLowerCase().isEmail().withMessage('Must be a valid email address'),
  body('password').optional({ checkFalsy: true }).isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').optional({ checkFalsy: true }).isIn(ROLES).withMessage(`Role must be one of ${ROLES.join(', ')}`)
];

const PROJECT_STATUSES = ['active', 'completed', 'planned', 'on-hold'];
const PROJECT_CATEGORIES = ['provision', 'distribution', 'renovation', 'building', 'news', 'water', 'education', 'emergency', 'healthcare'];

const newsValidation = (isUpdate = false) => [
  body('title')
    .if(() => !isUpdate).notEmpty().withMessage('Title is required')
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('content').optional({ checkFalsy: true }).isLength({ min: 5 }).withMessage('Content must be at least 5 characters'),
  body('category').optional({ checkFalsy: true }).isString(),
  body('image').custom(checkFile(false))
];

const projectValidation = (isUpdate = false) => [
  body('title')
    .if(() => !isUpdate).notEmpty().withMessage('Title is required')
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').optional({ checkFalsy: true }).isLength({ min: 5 }).withMessage('Description must be at least 5 characters'),
  body('status').optional({ checkFalsy: true }).isIn(PROJECT_STATUSES).withMessage(`Status must be one of ${PROJECT_STATUSES.join(', ')}`),
  body('category').optional({ checkFalsy: true }).isIn(PROJECT_CATEGORIES).withMessage(`Category must be one of ${PROJECT_CATEGORIES.join(', ')}`),
  body('location').optional({ checkFalsy: true }).isString(),
  body('image').custom(checkFile(false))
];

const galleryValidation = [
  body('caption').optional({ checkFalsy: true }).isString().withMessage('Caption must be a string'),
  body('photo').custom(checkFile(true))
];

// Hero & About (file only)
const fileValidation = [body('file').custom(checkFile(true))];

module.exports = {
  validateRequest,
  loginValidation,
  staffCreateValidation,
  staffUpdateValidation,
  newsValidation,
  projectValidation,
  galleryValidation,
  fileValidation
};
