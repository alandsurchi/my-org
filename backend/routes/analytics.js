/**
 * Privacy-friendly, first-party analytics. No cookies, no IP addresses stored.
 * A visitor is identified for one day only by a salted hash of IP + user agent,
 * which cannot be reversed and changes every day.
 */
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');

const viewLimiter = rateLimit({ windowMs: 60 * 1000, max: 60, standardHeaders: true, legacyHeaders: false });

const ALLOWED_PATH = /^\/[a-zA-Z0-9\-_/]{0,200}$/;

const visitorHash = (req, day) =>
  crypto.createHash('sha256')
    .update(`${req.ip}|${req.get('user-agent') || ''}|${day}|${process.env.JWT_SECRET}`)
    .digest('hex')
    .slice(0, 32);

const referrerHost = (ref) => {
  try { return ref ? new URL(ref).hostname.replace(/^www\./, '') : null; } catch { return null; }
};

// POST /api/analytics/view  { path, referrer?, lang?, device? }
router.post('/view', viewLimiter, async (req, res) => {
  try {
    const { path: p, referrer, lang, device } = req.body || {};
    if (typeof p !== 'string' || !ALLOWED_PATH.test(p)) return res.status(204).end();
    if (/^\/(dashboard|staff-login|forgot-password|reset-password)/.test(p)) return res.status(204).end();
    const day = new Date().toISOString().slice(0, 10);
    await pool.query(
      `INSERT INTO page_views (day, path, visitor, referrer, lang, device) VALUES ($1, $2, $3, $4, $5, $6)`,
      [day, p, visitorHash(req, day), referrerHost(referrer), String(lang || '').slice(0, 8) || null, device === 'mobile' ? 'mobile' : 'desktop']
    );
  } catch (err) {
    console.warn('analytics insert failed:', err.message);
  }
  res.status(204).end();
});

// GET /api/analytics/summary?days=30  (staff)
router.get('/summary', requireAuth, async (req, res, next) => {
  try {
    const days = Math.min(Math.max(parseInt(req.query.days, 10) || 30, 1), 365);
    const since = `CURRENT_DATE - INTERVAL '${days - 1} days'`;
    const [totals, byDay, topPages, referrers, langs, devices] = await Promise.all([
      pool.query(`SELECT COUNT(*)::int AS views, COUNT(DISTINCT visitor || day::text)::int AS visitors FROM page_views WHERE day >= ${since}`),
      pool.query(`SELECT day::text, COUNT(*)::int AS views, COUNT(DISTINCT visitor)::int AS visitors FROM page_views WHERE day >= ${since} GROUP BY day ORDER BY day`),
      pool.query(`SELECT path, COUNT(*)::int AS views FROM page_views WHERE day >= ${since} GROUP BY path ORDER BY views DESC LIMIT 8`),
      pool.query(`SELECT referrer, COUNT(*)::int AS views FROM page_views WHERE day >= ${since} AND referrer IS NOT NULL GROUP BY referrer ORDER BY views DESC LIMIT 8`),
      pool.query(`SELECT lang, COUNT(*)::int AS views FROM page_views WHERE day >= ${since} AND lang IS NOT NULL GROUP BY lang ORDER BY views DESC`),
      pool.query(`SELECT device, COUNT(*)::int AS views FROM page_views WHERE day >= ${since} GROUP BY device ORDER BY views DESC`),
    ]);
    res.json({
      success: true,
      data: {
        days,
        views: totals.rows[0].views,
        visitors: totals.rows[0].visitors,
        byDay: byDay.rows,
        topPages: topPages.rows,
        referrers: referrers.rows,
        languages: langs.rows,
        devices: devices.rows,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
