const express = require('express');
const router = express.Router();
const pool = require('../db');
const upload = require('../middleware/upload');
const { saveFile } = require('../utils/storage');
const { requireAuth } = require('../middleware/auth');
const { newsValidation, validateRequest } = require('../middleware/validator');

const NEWS_COLUMNS = `id, title, content, category, image_url AS "imageUrl", created_at AS "createdAt", updated_at AS "updatedAt"`;

const parseId = (value) => {
  const id = parseInt(value, 10);
  return Number.isNaN(id) ? null : id;
};

// GET all news (optional ?limit=&category=)
router.get('/', async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 100, 1), 500);
    const params = [limit];
    let where = '';
    if (req.query.category) {
      params.push(req.query.category);
      where = 'WHERE category = $2';
    }
    const result = await pool.query(`SELECT ${NEWS_COLUMNS} FROM news ${where} ORDER BY created_at DESC LIMIT $1`, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
});

// GET single news by ID
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ success: false, message: 'Invalid id' });
    const result = await pool.query(`SELECT ${NEWS_COLUMNS} FROM news WHERE id = $1`, [id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'News not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// POST create news
router.post('/', requireAuth, upload.single('image'), newsValidation(false), validateRequest, async (req, res, next) => {
  try {
    const imageUrl = req.file ? await saveFile(req.file, 'news') : null;
    const result = await pool.query(
      `INSERT INTO news (title, content, category, image_url) VALUES ($1, $2, $3, $4) RETURNING ${NEWS_COLUMNS}`,
      [req.body.title, req.body.content || '', req.body.category || null, imageUrl]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// PUT update news
router.put('/:id', requireAuth, upload.single('image'), newsValidation(true), validateRequest, async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ success: false, message: 'Invalid id' });

    const imageUrl = req.file ? await saveFile(req.file, 'news') : undefined;
    const updates = [];
    const values = [];
    let i = 1;

    if (req.body.title) { updates.push(`title = $${i++}`); values.push(req.body.title); }
    if (req.body.content) { updates.push(`content = $${i++}`); values.push(req.body.content); }
    if (req.body.category !== undefined) { updates.push(`category = $${i++}`); values.push(req.body.category || null); }
    if (imageUrl) { updates.push(`image_url = $${i++}`); values.push(imageUrl); }
    updates.push('updated_at = NOW()');

    values.push(id);
    const result = await pool.query(`UPDATE news SET ${updates.join(', ')} WHERE id = $${i} RETURNING ${NEWS_COLUMNS}`, values);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'News not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// DELETE news
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ success: false, message: 'Invalid id' });
    const result = await pool.query('DELETE FROM news WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'News not found' });
    res.json({ success: true, data: { message: 'News deleted successfully' } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
