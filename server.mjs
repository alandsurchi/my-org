/**
 * Production web server for the frontend (used by Railway: `npm start`).
 *
 * - Serves the built site from ./dist with SPA fallback.
 * - Proxies /api/* and /uploads/* to the backend given by BACKEND_URL, so the
 *   browser only ever talks to this origin. No CORS, and the API address is a
 *   runtime variable instead of being baked into the build.
 *
 * Env: PORT (Railway sets it), BACKEND_URL (e.g. https://charity-backend-production-944a.up.railway.app)
 */
import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, 'dist');
const PORT = Number(process.env.PORT) || 3000;
const BACKEND_URL = (process.env.BACKEND_URL || '').replace(/\/+$/, '');
const PROXY_PREFIXES = ['/api/', '/uploads/'];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.map': 'application/json'
};

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};

if (!fs.existsSync(path.join(DIST, 'index.html'))) {
  console.error('dist/index.html not found. Run `npm run build` first.');
  process.exit(1);
}
if (!BACKEND_URL) {
  console.warn('BACKEND_URL is not set: /api and /uploads requests will return 502.');
}

const backend = BACKEND_URL ? new URL(BACKEND_URL) : null;

function proxy(req, res) {
  if (!backend) {
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: 'BACKEND_URL is not configured on the web service' }));
    return;
  }
  const client = backend.protocol === 'https:' ? https : http;
  const headers = { ...req.headers, host: backend.host };
  delete headers.connection;
  const upstream = client.request(
    {
      protocol: backend.protocol,
      hostname: backend.hostname,
      port: backend.port || (backend.protocol === 'https:' ? 443 : 80),
      method: req.method,
      path: req.url,
      headers
    },
    (up) => {
      res.writeHead(up.statusCode || 502, up.headers);
      up.pipe(res);
    }
  );
  upstream.on('error', (err) => {
    console.error('Proxy error:', err.message);
    if (!res.headersSent) res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: 'Backend unreachable' }));
  });
  req.pipe(upstream);
}

function sendFile(res, filePath, cacheControl) {
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Cache-Control': cacheControl,
    ...SECURITY_HEADERS
  });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const pathname = decodeURIComponent(url.pathname);

  if (PROXY_PREFIXES.some((p) => pathname.startsWith(p))) return proxy(req, res);

  // Static assets (never escape dist)
  const safePath = path.normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(DIST, safePath);
  if (filePath.startsWith(DIST) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const immutable = pathname.startsWith('/assets/');
    return sendFile(res, filePath, immutable ? 'public, max-age=31536000, immutable' : 'public, max-age=3600');
  }

  // SPA fallback
  sendFile(res, path.join(DIST, 'index.html'), 'no-cache');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Web server listening on ${PORT}, proxying /api and /uploads to ${BACKEND_URL || '(unset)'}`);
});
