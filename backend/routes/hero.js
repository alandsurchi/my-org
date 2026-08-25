const express = require('express');
const router = express.Router();
const pool = require('../db');
const upload = require('../middleware/upload');
const { saveFile } = require('../utils/storage');
const { requireStaffAuth } = require('../middleware/staffSecurity');
const { fileValidation, validateRequest } = require('../middleware/validator');

const SELECT_HERO = `SELECT id, url, original_name AS "originalName", file_name AS "fileName", file_size AS "fileSize", mime_type AS "mimeType", dimensions, uploaded_by AS "uploadedBy", is_active AS "isActive", created_at AS "createdAt", updated_at AS "updatedAt" FROM hero_images`;

// GET current hero image
router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query(
      `${SELECT_HERO} WHERE is_active = true ORDER BY updated_at DESC LIMIT 1`
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No hero image found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// POST upload new hero image
router.post('/', requireStaffAuth, upload.single('heroImage'), fileValidation, validateRequest, async (req, res, next) => {
  try {
    const imageUrl = await saveFile(req.file, 'hero');
    
    const sizeOf = require('image-size');
    let dimensions = { width: 0, height: 0 };
    try {
      dimensions = sizeOf(req.file.buffer);
    } catch (err) {
      console.warn('Could not get image dimensions:', err.message);
    }
    
    await pool.query('UPDATE hero_images SET is_active = false');
    
    const result = await pool.query(
      `INSERT INTO hero_images (url, original_name, file_name, file_size, mime_type, dimensions, uploaded_by, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true) RETURNING id, url, original_name AS "originalName", file_name AS "fileName", file_size AS "fileSize", mime_type AS "mimeType", dimensions, uploaded_by AS "uploadedBy", is_active AS "isActive", created_at AS "createdAt", updated_at AS "updatedAt"`,
      [
        imageUrl,
        req.file.originalname,
        req.file.originalname,
        req.file.size,
        req.file.mimetype,
        JSON.stringify(dimensions),
        req.user?.email || 'admin'
      ]
    );
    
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// PUT update hero image
router.put('/', requireStaffAuth, upload.single('heroImage'), fileValidation, validateRequest, async (req, res, next) => {
  try {
    const imageUrl = await saveFile(req.file, 'hero');
    
    const sizeOf = require('image-size');
    let dimensions = { width: 0, height: 0 };
    try {
      dimensions = sizeOf(req.file.buffer);
    } catch (err) {
      console.warn('Could not get image dimensions:', err.message);
    }
    
    await pool.query('UPDATE hero_images SET is_active = false');
    
    const result = await pool.query(
      `INSERT INTO hero_images (url, original_name, file_name, file_size, mime_type, dimensions, uploaded_by, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true) RETURNING id, url, original_name AS "originalName", file_name AS "fileName", file_size AS "fileSize", mime_type AS "mimeType", dimensions, uploaded_by AS "uploadedBy", is_active AS "isActive", created_at AS "createdAt", updated_at AS "updatedAt"`,
      [
        imageUrl,
        req.file.originalname,
        req.file.originalname,
        req.file.size,
        req.file.mimetype,
        JSON.stringify(dimensions),
        req.user?.email || 'admin'
      ]
    );
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
