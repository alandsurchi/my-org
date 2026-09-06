const express = require('express');
const router = express.Router();
const pool = require('../db');
const upload = require('../middleware/upload');
const { saveFile } = require('../utils/storage');
const { requireAuth } = require('../middleware/auth');
const { galleryValidation, validateRequest } = require('../middleware/validator');

const GALLERY_COLUMNS = `id, url, title, description, caption, uploaded_at AS "uploadedAt"`;

const parseId = (value) => {
  const id = parseInt(value, 10);
  return Number.isNaN(id) ? null : id;
};

// GET all gallery photos
router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query(`SELECT ${GALLERY_COLUMNS} FROM gallery_photos ORDER BY uploaded_at DESC`);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
});

// GET single photo
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ success: false, message: 'Invalid id' });
    const result = await pool.query(`SELECT ${GALLERY_COLUMNS} FROM gallery_photos WHERE id = $1`, [id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Photo not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// POST upload new photo
router.post('/', requireAuth, upload.single('photo'), galleryValidation, validateRequest, async (req, res, next) => {
  try {
    const imageUrl = await saveFile(req.file, 'gallery');
    const result = await pool.query(
      `INSERT INTO gallery_photos (url, title, description, caption) VALUES ($1, $2, $3, $4) RETURNING ${GALLERY_COLUMNS}`,
      [imageUrl, req.body.title || req.body.caption || 'Untitled', req.body.description || '', req.body.caption || '']
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// PUT update photo text fields
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ success: false, message: 'Invalid id' });

    const updates = [];
    const values = [];
    let i = 1;
    for (const field of ['caption', 'title', 'description']) {
      if (typeof req.body[field] === 'string') { updates.push(`${field} = $${i++}`); values.push(req.body[field]); }
    }
    if (updates.length === 0) return res.status(400).json({ success: false, message: 'No fields to update' });

    values.push(id);
    const result = await pool.query(`UPDATE gallery_photos SET ${updates.join(', ')} WHERE id = $${i} RETURNING ${GALLERY_COLUMNS}`, values);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Photo not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// DELETE photo
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ success: false, message: 'Invalid id' });
    const result = await pool.query('DELETE FROM gallery_photos WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Photo not found' });
    res.json({ success: true, data: { message: 'Photo deleted successfully' } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
