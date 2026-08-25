const express = require('express');
const router = express.Router();
const pool = require('../db');
const upload = require('../middleware/upload');
const { saveFile } = require('../utils/storage');
const { requireStaffAuth } = require('../middleware/staffSecurity');
const { projectValidation, validateRequest } = require('../middleware/validator');

const SELECT_PROJECTS = `SELECT id, title, description, category, status, image_url AS "imageUrl", location, created_at AS "createdAt", updated_at AS "updatedAt" FROM projects`;

// GET all projects
router.get('/', async (req, res) => {
  try {
    const { status, limit: queryLimit } = req.query;
    const limit = parseInt(queryLimit) || 100;
    let result;
    
    if (status) {
      result = await pool.query(
        `${SELECT_PROJECTS} WHERE status = $1 ORDER BY created_at DESC LIMIT $2`,
        [status, limit]
      );
    } else {
      result = await pool.query(
        `${SELECT_PROJECTS} ORDER BY created_at DESC LIMIT $1`,
        [limit]
      );
    }
    
    // Transform projects to include both formats for frontend compatibility
    const transformedProjects = result.rows.map(project => ({
      ...project,
      title_en: project.title,
      description_en: project.description,
      created_at: project.createdAt
    }));
    
    res.json({ success: true, data: transformedProjects });
  } catch (error) {
    next(error);
  }
});

// GET single project by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(`${SELECT_PROJECTS} WHERE id = $1`, [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// POST create new project
router.post('/', requireStaffAuth, upload.single('image'), projectValidation(false), validateRequest, async (req, res, next) => {
  try {
    let imageUrl = null;
    if (req.file) {
      imageUrl = await saveFile(req.file, 'projects');
    }

    const result = await pool.query(
      `INSERT INTO projects (title, description, status, image_url, category, location)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, title, description, category, status, image_url AS "imageUrl", location, created_at AS "createdAt", updated_at AS "updatedAt"`,
      [
        req.body.title || req.body.title_en,
        req.body.description || req.body.description_en,
        req.body.status || 'active',
        imageUrl,
        req.body.category || null,
        req.body.location || null
      ]
    );
    
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// PUT update project
router.put('/:id', requireStaffAuth, upload.single('image'), projectValidation(true), validateRequest, async (req, res, next) => {
  try {
    const imageUrl = req.file ? await saveFile(req.file, 'projects') : undefined;
    
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (req.body.title) { updates.push(`title = $${paramIndex++}`); values.push(req.body.title); }
    if (req.body.description) { updates.push(`description = $${paramIndex++}`); values.push(req.body.description); }
    if (req.body.status) { updates.push(`status = $${paramIndex++}`); values.push(req.body.status); }
    if (req.body.category !== undefined) { updates.push(`category = $${paramIndex++}`); values.push(req.body.category || null); }
    if (req.body.location !== undefined) { updates.push(`location = $${paramIndex++}`); values.push(req.body.location || null); }
    if (imageUrl) { updates.push(`image_url = $${paramIndex++}`); values.push(imageUrl); }
    updates.push(`updated_at = NOW()`);

    values.push(req.params.id);
    const query = `UPDATE projects SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING id, title, description, category, status, image_url AS "imageUrl", location, created_at AS "createdAt", updated_at AS "updatedAt"`;
    
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// DELETE project
router.delete('/:id', requireStaffAuth, async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, data: { message: 'Project deleted successfully' } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
