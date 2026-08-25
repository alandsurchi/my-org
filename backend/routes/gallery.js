const express = require('express');
const router = express.Router();
const pool = require('../db');
const upload = require('../middleware/upload');
const { uploadToR2 } = require('../utils/r2Client');
const { requireStaffAuth } = require('../middleware/staffSecurity');
const { galleryValidation, validateRequest } = require('../middleware/validator');

const SELECT_GALLERY = `SELECT id, url, title, description, caption, uploaded_at AS "uploadedAt" FROM gallery_photos`;

// GET all gallery photos
router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query(`${SELECT_GALLERY} ORDER BY uploaded_at DESC`);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// GET single photo by ID
router.get('/:id', async (req, res, next) => {
  try {
    const result = await pool.query(`${SELECT_GALLERY} WHERE id = $1`, [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// POST upload new photo
router.post('/', requireStaffAuth, upload.single('photo'), galleryValidation, validateRequest, async (req, res, next) => {
  try {
    const imageUrl = await uploadToR2(req.file, 'gallery');
    
    const result = await pool.query(
      `INSERT INTO gallery_photos (url, title, description, caption) VALUES ($1, $2, $3, $4) RETURNING id, url, title, description, caption, uploaded_at AS "uploadedAt"`,
      [
        imageUrl,
        req.body.title || req.body.caption || 'Untitled',
        req.body.description || '',
        req.body.caption || ''
      ]
    );
    
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// PUT update photo caption
router.put('/:id', requireStaffAuth, async (req, res, next) => {
  try {
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (req.body.caption !== undefined) { updates.push(`caption = $${paramIndex++}`); values.push(req.body.caption); }
    if (req.body.title !== undefined) { updates.push(`title = $${paramIndex++}`); values.push(req.body.title); }
    if (req.body.description !== undefined) { updates.push(`description = $${paramIndex++}`); values.push(req.body.description); }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    values.push(req.params.id);
    const query = `UPDATE gallery_photos SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING id, url, title, description, caption, uploaded_at AS "uploadedAt"`;
    
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// DELETE photo
router.delete('/:id', requireStaffAuth, async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM gallery_photos WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }
    res.json({ success: true, data: { message: 'Photo deleted successfully' } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
