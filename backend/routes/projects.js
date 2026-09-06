const express = require('express');
const router = express.Router();
const pool = require('../db');
const upload = require('../middleware/upload');
const { saveFile } = require('../utils/storage');
const { requireAuth } = require('../middleware/auth');
const { projectValidation, validateRequest } = require('../middleware/validator');

const PROJECT_COLUMNS = `id, title, description, category, status, image_url AS "imageUrl", location, created_at AS "createdAt", updated_at AS "updatedAt"`;

const parseId = (value) => {
  const id = parseInt(value, 10);
  return Number.isNaN(id) ? null : id;
};

// Adds the legacy field names some frontend components still read.
const withLegacyFields = (project) => ({
  ...project,
  title_en: project.title,
  description_en: project.description,
  image_url: project.imageUrl,
  created_at: project.createdAt
});

// GET all projects (optional ?status=&category=&limit=)
router.get('/', async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 100, 1), 500);
    const params = [limit];
    const where = [];
    if (req.query.status) { params.push(req.query.status); where.push(`status = $${params.length}`); }
    if (req.query.category) { params.push(req.query.category); where.push(`category = $${params.length}`); }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const result = await pool.query(`SELECT ${PROJECT_COLUMNS} FROM projects ${whereSql} ORDER BY created_at DESC LIMIT $1`, params);
    res.json({ success: true, data: result.rows.map(withLegacyFields) });
  } catch (error) {
    next(error);
  }
});

// GET single project
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ success: false, message: 'Invalid id' });
    const result = await pool.query(`SELECT ${PROJECT_COLUMNS} FROM projects WHERE id = $1`, [id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: withLegacyFields(result.rows[0]) });
  } catch (error) {
    next(error);
  }
});

// POST create project
router.post('/', requireAuth, upload.single('image'), projectValidation(false), validateRequest, async (req, res, next) => {
  try {
    const imageUrl = req.file ? await saveFile(req.file, 'projects') : null;
    const result = await pool.query(
      `INSERT INTO projects (title, description, status, image_url, category, location)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING ${PROJECT_COLUMNS}`,
      [
        req.body.title || req.body.title_en,
        req.body.description || req.body.description_en || '',
        req.body.status || 'active',
        imageUrl,
        req.body.category || null,
        req.body.location || null
      ]
    );
    res.status(201).json({ success: true, data: withLegacyFields(result.rows[0]) });
  } catch (error) {
    next(error);
  }
});

// PUT update project
router.put('/:id', requireAuth, upload.single('image'), projectValidation(true), validateRequest, async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ success: false, message: 'Invalid id' });

    const imageUrl = req.file ? await saveFile(req.file, 'projects') : undefined;
    const updates = [];
    const values = [];
    let i = 1;

    if (req.body.title) { updates.push(`title = $${i++}`); values.push(req.body.title); }
    if (req.body.description) { updates.push(`description = $${i++}`); values.push(req.body.description); }
    if (req.body.status) { updates.push(`status = $${i++}`); values.push(req.body.status); }
    if (req.body.category !== undefined) { updates.push(`category = $${i++}`); values.push(req.body.category || null); }
    if (req.body.location !== undefined) { updates.push(`location = $${i++}`); values.push(req.body.location || null); }
    if (imageUrl) { updates.push(`image_url = $${i++}`); values.push(imageUrl); }
    else if (req.body.removeImage === 'true') { updates.push('image_url = NULL'); }
    updates.push('updated_at = NOW()');

    values.push(id);
    const result = await pool.query(`UPDATE projects SET ${updates.join(', ')} WHERE id = $${i} RETURNING ${PROJECT_COLUMNS}`, values);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: withLegacyFields(result.rows[0]) });
  } catch (error) {
    next(error);
  }
});

// DELETE project
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ success: false, message: 'Invalid id' });
    const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: { message: 'Project deleted successfully' } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
