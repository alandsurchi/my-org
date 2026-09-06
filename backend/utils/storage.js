/**
 * Storage abstraction: local disk (Railway volume) by default, Cloudflare R2
 * when STORAGE_TYPE=r2. Every upload is optimised first (resized to a sane
 * maximum and re-encoded as WebP) so pages stay fast on mobile.
 */

const path = require('path');
const fs = require('fs');

const STORAGE_TYPE = process.env.STORAGE_TYPE || 'local';
const STORAGE_PATH = process.env.STORAGE_PATH || '/data/uploads';

// Longest edge per folder. Hero/about are full-width banners; the rest are cards.
const MAX_EDGE = { hero: 1920, about: 1600, news: 1600, projects: 1600, gallery: 1600 };
const WEBP_QUALITY = 82;

function getPublicBaseUrl() {
  if (STORAGE_TYPE === 'r2') return process.env.R2_PUBLIC_URL || '';
  const domain = process.env.RAILWAY_PUBLIC_DOMAIN;
  if (domain) return `https://${domain}`;
  return '';
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function generateFileName(ext, folder) {
  return `${folder}/${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
}

/**
 * Resize + re-encode. Returns { buffer, ext, mimetype, width, height }.
 * GIFs are left untouched (to keep animation); anything sharp cannot read is
 * stored as-is.
 */
async function optimiseImage(file, folder) {
  if (file.mimetype === 'image/gif') {
    return { buffer: file.buffer, ext: '.gif', mimetype: 'image/gif', width: 0, height: 0 };
  }
  try {
    const sharp = require('sharp');
    const maxEdge = MAX_EDGE[folder] || 1600;
    const pipeline = sharp(file.buffer, { failOn: 'none' })
      .rotate() // honour EXIF orientation from phones
      .resize({ width: maxEdge, height: maxEdge, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY });
    const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });
    return { buffer: data, ext: '.webp', mimetype: 'image/webp', width: info.width, height: info.height };
  } catch (err) {
    console.warn('Image optimisation skipped:', err.message);
    return { buffer: file.buffer, ext: path.extname(file.originalname) || '.jpg', mimetype: file.mimetype, width: 0, height: 0 };
  }
}

/**
 * Saves an uploaded multer file. Returns the public URL. Also sets
 * file.optimised = { size, width, height, mimetype } for callers that store metadata.
 */
async function saveFile(file, folder) {
  const img = await optimiseImage(file, folder);
  file.optimised = { size: img.buffer.length, width: img.width, height: img.height, mimetype: img.mimetype };
  const fileName = generateFileName(img.ext, folder);

  if (STORAGE_TYPE === 'r2') {
    const { uploadToR2 } = require('./r2Client');
    return await uploadToR2({ buffer: img.buffer, mimetype: img.mimetype, originalname: fileName }, folder);
  }

  ensureDir(path.join(STORAGE_PATH, folder));
  fs.writeFileSync(path.join(STORAGE_PATH, fileName), img.buffer);
  return `${getPublicBaseUrl()}/uploads/${fileName}`;
}

function getFileUrl(filePath) {
  if (!filePath) return null;
  if (filePath.startsWith('http')) return filePath;
  return `${getPublicBaseUrl()}${filePath}`;
}

module.exports = { saveFile, getFileUrl, STORAGE_TYPE, STORAGE_PATH };
