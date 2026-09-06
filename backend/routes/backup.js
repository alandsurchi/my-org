const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const pool = require('../db');
const { requireAuth, requireSuperAdmin } = require('../middleware/auth');
const { STORAGE_PATH } = require('../utils/storage');

const TABLES = ['users', 'news', 'projects', 'gallery_photos', 'hero_images', 'about_image', 'page_views'];

const dirSize = (dir) => {
  let bytes = 0, files = 0;
  if (!fs.existsSync(dir)) return { bytes, files };
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) { const s = dirSize(p); bytes += s.bytes; files += s.files; }
    else { bytes += fs.statSync(p).size; files++; }
  }
  return { bytes, files };
};

// GET /api/backup/info — what a backup would contain
router.get('/info', requireAuth, requireSuperAdmin, async (req, res, next) => {
  try {
    const counts = {};
    for (const t of TABLES) {
      const r = await pool.query(`SELECT COUNT(*)::int AS c FROM ${t}`);
      counts[t] = r.rows[0].c;
    }
    const uploads = dirSize(STORAGE_PATH);
    res.json({ success: true, data: { tables: counts, uploads } });
  } catch (error) {
    next(error);
  }
});

// GET /api/backup — zip with data.json (all tables) + every uploaded file.
// Super admin only: the export includes staff password hashes so it can be restored.
router.get('/', requireAuth, requireSuperAdmin, async (req, res, next) => {
  try {
    const data = { exportedAt: new Date().toISOString(), version: 1, tables: {} };
    for (const t of TABLES) {
      const r = await pool.query(`SELECT * FROM ${t} ORDER BY 1`);
      data.tables[t] = r.rows;
    }

    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="mrovdostan-backup-${stamp}.zip"`);

    const archive = archiver('zip', { zlib: { level: 6 } });
    archive.on('error', (err) => next(err));
    archive.pipe(res);
    archive.append(JSON.stringify(data, null, 2), { name: 'data.json' });
    archive.append(
      'Mrovdostan site backup\n\n' +
      'data.json  - every database table (users include password hashes, keep this file private)\n' +
      'uploads/   - all uploaded images, same paths as served under /uploads\n\n' +
      'To restore: import data.json rows into the same tables and copy uploads/ to the storage volume.\n',
      { name: 'README.txt' }
    );
    if (fs.existsSync(STORAGE_PATH)) archive.directory(STORAGE_PATH, 'uploads');
    await archive.finalize();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
