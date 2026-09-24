const express = require('express');
const router = express.Router();
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');
const { refreshTranslations, isEnabled, BODY_COLUMN, LANGUAGES } = require('../utils/translate');

/**
 * Reviewing and correcting machine translations.
 *
 * Posts are written in Kurdish and translated automatically. Everything here
 * exists so a human can overrule the machine: an edit saved through this route
 * is marked `auto: false`, which stops any later re-translation from
 * overwriting it.
 */

const parseId = (value) => {
  const id = parseInt(value, 10);
  return Number.isNaN(id) ? null : id;
};

/** Guards the :table segment so it can never reach SQL as arbitrary text. */
const tableOf = (name) => (Object.prototype.hasOwnProperty.call(BODY_COLUMN, name) ? name : null);

// GET the source text and current translations for one post
router.get('/:table/:id', requireAuth, async (req, res, next) => {
  try {
    const table = tableOf(req.params.table);
    const id = parseId(req.params.id);
    if (!table || id === null) return res.status(400).json({ success: false, message: 'Invalid post' });

    const { rows } = await pool.query(
      `SELECT id, title, ${BODY_COLUMN[table]} AS body, translations FROM ${table} WHERE id = $1`,
      [id],
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Not found' });

    res.json({ success: true, data: { ...rows[0], languages: LANGUAGES, enabled: isEnabled() } });
  } catch (error) {
    next(error);
  }
});

// PUT a corrected translation for one language
router.put('/:table/:id/:lang', requireAuth, async (req, res, next) => {
  try {
    const table = tableOf(req.params.table);
    const id = parseId(req.params.id);
    const lang = req.params.lang;
    if (!table || id === null) return res.status(400).json({ success: false, message: 'Invalid post' });
    if (!LANGUAGES.includes(lang)) {
      return res.status(400).json({ success: false, message: `Language must be one of ${LANGUAGES.join(', ')}` });
    }

    const title = String(req.body.title ?? '').trim();
    const body = String(req.body.body ?? '').trim();
    if (!title && !body) return res.status(400).json({ success: false, message: 'Nothing to save' });

    const { rows } = await pool.query(`SELECT translations FROM ${table} WHERE id = $1`, [id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Not found' });

    const translations = rows[0].translations && typeof rows[0].translations === 'object' ? rows[0].translations : {};
    translations[lang] = {
      ...(translations[lang] || {}),
      title,
      body,
      // The point of this route: mark it human-owned so re-translation skips it.
      auto: false,
      stale: false,
      at: new Date().toISOString(),
    };

    await pool.query(`UPDATE ${table} SET translations = $1 WHERE id = $2`, [JSON.stringify(translations), id]);
    res.json({ success: true, data: translations });
  } catch (error) {
    next(error);
  }
});

// POST regenerate — discards the stored version for that language and re-translates
router.post('/:table/:id/regenerate', requireAuth, async (req, res, next) => {
  try {
    const table = tableOf(req.params.table);
    const id = parseId(req.params.id);
    if (!table || id === null) return res.status(400).json({ success: false, message: 'Invalid post' });
    if (!isEnabled()) {
      return res.status(503).json({ success: false, message: 'Translation is not configured on this server' });
    }

    const { rows } = await pool.query(`SELECT translations FROM ${table} WHERE id = $1`, [id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Not found' });

    // Clearing the hash makes mergeTranslations treat the source as changed;
    // dropping the requested language's `auto: false` lets it be replaced.
    const current = rows[0].translations || {};
    const lang = req.body?.lang;
    const reset = { ...current, sourceHash: null };
    if (lang && LANGUAGES.includes(lang)) delete reset[lang];
    else for (const l of LANGUAGES) delete reset[l];

    await pool.query(`UPDATE ${table} SET translations = $1 WHERE id = $2`, [JSON.stringify(reset), id]);
    await refreshTranslations(table, id);

    const { rows: after } = await pool.query(`SELECT translations FROM ${table} WHERE id = $1`, [id]);
    res.json({ success: true, data: after[0].translations });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
