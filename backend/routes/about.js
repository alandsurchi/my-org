const express = require('express');
const router = express.Router();
const pool = require('../db');
const upload = require('../middleware/upload');
const { saveFile } = require('../utils/storage');
const { getDimensions } = require('../utils/imageMeta');
const { requireAuth } = require('../middleware/auth');
const { fileValidation, validateRequest } = require('../middleware/validator');

const ABOUT_COLUMNS = `id, url, original_name AS "originalName", file_name AS "fileName", file_size AS "fileSize", mime_type AS "mimeType", dimensions, uploaded_by AS "uploadedBy", is_active AS "isActive", uploaded_at AS "uploadedAt"`;

// GET current about image
router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT ${ABOUT_COLUMNS} FROM about_image WHERE is_active = true ORDER BY uploaded_at DESC LIMIT 1`
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
router.post('/', requireAuth, upload.single('aboutImage'), fileValidation, validateRequest, async (req, res, next) => {
  const client = await pool.connect();
  try {
    const imageUrl = await saveFile(req.file, 'about');
    const dimensions = getDimensions(req.file.buffer);

    await client.query('BEGIN');
    await client.query('UPDATE about_image SET is_active = false WHERE is_active = true');
    const result = await client.query(
      `INSERT INTO about_image (url, original_name, file_name, file_size, mime_type, dimensions, uploaded_by, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true) RETURNING ${ABOUT_COLUMNS}`,
      [imageUrl, req.file.originalname, req.file.originalname, req.file.size, req.file.mimetype, JSON.stringify(dimensions), req.user.email]
    );
    await client.query('COMMIT');

    res.status(201).json({ success: true, message: 'About image uploaded successfully', data: result.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    next(error);
  } finally {
    client.release();
  }
});

// DELETE about image (deactivates the current one)
router.delete('/', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('UPDATE about_image SET is_active = false WHERE is_active = true RETURNING id');
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No about image to delete' });
    }
    res.json({ success: true, data: { message: 'About image deleted successfully' } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
