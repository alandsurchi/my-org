/**
 * Storage abstraction module.
 * Currently uses local filesystem (Railway persistent volume).
 * Can be swapped to Cloudflare R2, S3, etc. by changing this module only.
 */

const path = require('path');
const fs = require('fs');

const STORAGE_TYPE = process.env.STORAGE_TYPE || 'local';
const STORAGE_PATH = process.env.STORAGE_PATH || '/data/uploads';

// Build the public URL base
function getPublicBaseUrl() {
  if (STORAGE_TYPE === 'r2') return process.env.R2_PUBLIC_URL || '';
  // For local storage, use the backend's public domain
  const domain = process.env.RAILWAY_PUBLIC_DOMAIN;
  if (domain) return `https://${domain}`;
  return ''; // fallback to relative path
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function generateFileName(originalName, folder) {
  const ext = path.extname(originalName);
  return `${folder}/${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
}

async function saveFile(file, folder) {
  const fileName = generateFileName(file.originalname, folder);
  
  if (STORAGE_TYPE === 'r2') {
    const { uploadToR2 } = require('./r2Client');
    return await uploadToR2(file, folder);
  }
  
  // Local storage (Railway volume)
  ensureDir(path.join(STORAGE_PATH, folder));
  const filePath = path.join(STORAGE_PATH, fileName);
  fs.writeFileSync(filePath, file.buffer);
  
  // Return full URL so frontend can load it directly
  const baseUrl = getPublicBaseUrl();
  return `${baseUrl}/uploads/${fileName}`;
}

function getFileUrl(filePath) {
  if (!filePath) return null;
  if (filePath.startsWith('http')) return filePath;
  const baseUrl = getPublicBaseUrl();
  return `${baseUrl}${filePath}`;
}

module.exports = { saveFile, getFileUrl, STORAGE_TYPE, STORAGE_PATH };
