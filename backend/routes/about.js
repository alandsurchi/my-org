const express = require('express');
const router = express.Router();
const pool = require('../db');
const upload = require('../middleware/upload');
const { uploadToR2 } = require('../utils/r2Client');
const { requireStaffAuth } = require('../middleware/staffSecurity');
const { fileValidation, validateRequest } = require('../middleware/validator');

const SELECT_ABOUT = `SELECT id, url, original_name AS "originalName", file_name AS "fileName", file_size AS "fileSize", mime_type AS "mimeType", dimensions, uploaded_by AS "uploadedBy", is_active AS "isActive", uploaded_at AS "uploadedAt" FROM about_image`;

// GET current about image
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `${SELECT_ABOUT} WHERE is_active = true ORDER BY uploaded_at DESC LIMIT 1`
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No about image set' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// POST new about image
router.post('/', requireStaffAuth, upload.single('aboutImage'), fileValidation, validateRequest, async (req, res, next) => {
  try {
    const imageUrl = await uploadToR2(req.file, 'about');

    const sizeOf = require('image-size');
    let dimensions = { width: 0, height: 0 };
    try {
      dimensions = sizeOf(req.file.buffer);
    } catch (err) {
      console.warn('Could not get image dimensions:', err.message);
    }

    await pool.query('UPDATE about_image SET is_active = false');

    const result = await pool.query(
      `INSERT INTO about_image (url, original_name, file_name, file_size, mime_type, dimensions, uploaded_by, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true) RETURNING id, url, original_name AS "originalName", file_name AS "fileName", file_size AS "fileSize", mime_type AS "mimeType", dimensions, uploaded_by AS "uploadedBy", is_active AS "isActive", uploaded_at AS "uploadedAt"`,
      [
        imageUrl,
        req.file.originalname,
        req.file.originalname,
        req.file.size,
        req.file.mimetype,
        JSON.stringify(dimensions),
        'admin'
      ]
    );

    const aboutImageData = result.rows[0];
    console.log('✅ About image uploaded:', aboutImageData);

    res.status(200).json({
      success: true,
      message: 'About image uploaded successfully',
      data: aboutImageData
    });

  } catch (error) {
    console.error('❌ Error uploading about image:', error);
    next(error);
  }
});

// DELETE about image
router.delete('/', requireStaffAuth, async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id FROM about_image WHERE is_active = true LIMIT 1'
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No about image to delete' });
    }

    await pool.query('UPDATE about_image SET is_active = false WHERE id = $1', [result.rows[0].id]);

    res.json({ success: true, data: { message: 'About image deleted successfully' } });

  } catch (error) {
    console.error('❌ Error deleting about image:', error);
    next(error);
  }
});

module.exports = router;
