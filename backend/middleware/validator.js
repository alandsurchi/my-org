const { body, validationResult } = require('express-validator');

// 1. Centralized Error Handler for express-validator
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({ field: err.path || err.param, message: err.msg }))
    });
  }
  next();
};

// Reusable File Validator (for Multer)
const checkFile = (isRequired) => {
  return (value, { req }) => {
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
};

// 2. Login Validation
const loginValidation = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
];

// 3. Staff Validation (Creation & Updates)
const staffValidation = [
  body('name')
    .optional({ checkFalsy: true }) // optional for updates
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email')
    .optional({ checkFalsy: true })
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .optional({ checkFalsy: true })
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role')
    .optional({ checkFalsy: true })
    .isIn(['admin', 'super_admin', 'staff']).withMessage('Role must be one of admin, super_admin, or staff')
];

// 4. News Validation
const newsValidation = (isUpdate = false) => [
  body('title')
    .if(() => !isUpdate).notEmpty().withMessage('Title is required')
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('content')
    .optional({ checkFalsy: true })
    .isLength({ min: 5 }).withMessage('Content must be at least 5 characters'),
  body('category').optional({ checkFalsy: true }),
  body('image').custom(checkFile(false)) // Optional file upload
];

// 5. Project Validation
const projectValidation = (isUpdate = false) => [
  body('title')
    .if(() => !isUpdate).notEmpty().withMessage('Title is required')
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description')
    .optional({ checkFalsy: true })
    .isLength({ min: 5 }).withMessage('Description must be at least 5 characters'),
  body('status')
    .optional({ checkFalsy: true })
    .isIn(['active', 'completed', 'planned']).withMessage('Status must be active, completed, or planned'),
  body('category').optional({ checkFalsy: true }),
  body('location').optional({ checkFalsy: true }),
  body('image').custom(checkFile(false))
];

// 6. Gallery Validation
const galleryValidation = [
  body('caption')
    .optional({ checkFalsy: true })
    .isString().withMessage('Caption must be a string'),
  body('photo').custom(checkFile(true)) // Photo is required for gallery upload
];

// 7. Hero & About Validation (File only)
const fileValidation = [
  body('file').custom(checkFile(true)) // File is required
];

module.exports = {
  validateRequest,
  loginValidation,
  staffValidation,
  newsValidation,
  projectValidation,
  galleryValidation,
  fileValidation
};
