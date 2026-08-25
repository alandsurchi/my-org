const express = require('express');
const router = express.Router();
const pool = require('../db');
const upload = require('../middleware/upload');
const { uploadToR2 } = require('../utils/r2Client');
const { requireStaffAuth } = require('../middleware/staffSecurity');
const { newsValidation, validateRequest } = require('../middleware/validator');

const SELECT_NEWS = `SELECT id, title, content, category, image_url AS "imageUrl", created_at AS "createdAt", updated_at AS "updatedAt" FROM news`;

// GET all news
router.get('/', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const result = await pool.query(
      `${SELECT_NEWS} ORDER BY created_at DESC LIMIT $1`,
      [limit]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
});

// GET single news by ID
router.get('/:id', async (req, res, next) => {
  try {
    const result = await pool.query(`${SELECT_NEWS} WHERE id = $1`, [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'News not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// POST create new news
router.post('/', requireStaffAuth, upload.single('image'), newsValidation(false), validateRequest, async (req, res, next) => {
  try {
    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadToR2(req.file, 'news');
    }
    
    const result = await pool.query(
      `INSERT INTO news (title, content, category, image_url) VALUES ($1, $2, $3, $4) RETURNING id, title, content, category, image_url AS "imageUrl", created_at AS "createdAt", updated_at AS "updatedAt"`,
      [req.body.title, req.body.content, req.body.category || null, imageUrl]
    );
    
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// PUT update news
router.put('/:id', requireStaffAuth, upload.single('image'), newsValidation(true), validateRequest, async (req, res, next) => {
  try {
    const imageUrl = req.file ? await uploadToR2(req.file, 'news') : undefined;
    
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (req.body.title) { updates.push(`title = $${paramIndex++}`); values.push(req.body.title); }
    if (req.body.content) { updates.push(`content = $${paramIndex++}`); values.push(req.body.content); }
    if (req.body.category !== undefined) { updates.push(`category = $${paramIndex++}`); values.push(req.body.category || null); }
    if (imageUrl) { updates.push(`image_url = $${paramIndex++}`); values.push(imageUrl); }
    updates.push(`updated_at = NOW()`);

    values.push(req.params.id);
    const query = `UPDATE news SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING id, title, content, category, image_url AS "imageUrl", created_at AS "createdAt", updated_at AS "updatedAt"`;
    
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'News not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// DELETE news
router.delete('/:id', requireStaffAuth, async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM news WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'News not found' });
    }
    res.json({ success: true, data: { message: 'News deleted successfully' } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
