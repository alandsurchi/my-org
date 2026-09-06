const express = require('express');
const router = express.Router();
const pool = require('../db');
const upload = require('../middleware/upload');
const { saveFile } = require('../utils/storage');
const { getDimensions } = require('../utils/imageMeta');
const { requireAuth } = require('../middleware/auth');
const { fileValidation, validateRequest } = require('../middleware/validator');

const HERO_COLUMNS = `id, url, original_name AS "originalName", file_name AS "fileName", file_size AS "fileSize", mime_type AS "mimeType", dimensions, uploaded_by AS "uploadedBy", is_active AS "isActive", created_at AS "createdAt", updated_at AS "updatedAt"`;

// GET current hero image
router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT ${HERO_COLUMNS} FROM hero_images WHERE is_active = true ORDER BY updated_at DESC LIMIT 1`
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No hero image found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

const replaceHero = async (req, res, next, statusCode) => {
  const client = await pool.connect();
  try {
    const imageUrl = await saveFile(req.file, 'hero');
    const opt = req.file.optimised || {};
    const dimensions = opt.width ? { width: opt.width, height: opt.height } : getDimensions(req.file.buffer);
    const storedSize = opt.size || req.file.size;
    const storedType = opt.mimetype || req.file.mimetype;

    await client.query('BEGIN');
    await client.query('UPDATE hero_images SET is_active = false WHERE is_active = true');
    const result = await client.query(
      `INSERT INTO hero_images (url, original_name, file_name, file_size, mime_type, dimensions, uploaded_by, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true) RETURNING ${HERO_COLUMNS}`,
      [imageUrl, req.file.originalname, req.file.originalname, storedSize, storedType, JSON.stringify(dimensions), req.user.email]
    );
    await client.query('COMMIT');

    res.status(statusCode).json({ success: true, data: result.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    next(error);
  } finally {
    client.release();
  }
};

// POST / PUT upload new hero image (both replace the active one)
router.post('/', requireAuth, upload.single('heroImage'), fileValidation, validateRequest, (req, res, next) => replaceHero(req, res, next, 201));
router.put('/', requireAuth, upload.single('heroImage'), fileValidation, validateRequest, (req, res, next) => replaceHero(req, res, next, 200));

module.exports = router;
