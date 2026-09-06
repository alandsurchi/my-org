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

// The public origin is derived from the request, so a custom domain needs no
// code or variable change: robots.txt, sitemap.xml and social preview tags
// always point at whatever host the visitor used.
const PUBLIC_ROUTES = ['/', '/projects', '/news', '/gallery'];
const INDEX_HTML = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');

function publicOrigin(req) {
  const proto = (req.headers['x-forwarded-proto'] || 'http').split(',')[0].trim();
  const host = (req.headers['x-forwarded-host'] || req.headers.host || `localhost:${PORT}`).split(',')[0].trim();
  return `${proto}://${host}`;
}

function sendText(res, body, type, cacheControl = 'public, max-age=3600') {
  res.writeHead(200, { 'Content-Type': type, 'Cache-Control': cacheControl, ...SECURITY_HEADERS });
  res.end(body);
}

// Per-route title/description for crawlers and link previews (the app updates
// them again client-side once it loads).
const ROUTE_META = {
  '/': { title: 'Mrovdostan Organization for Humanitarian Aid', description: 'Mrovdostan is a non-profit humanitarian organization in the Kurdistan Region of Iraq, building hope and transforming lives through aid, education and community projects.' },
  '/projects': { title: 'All Activities | Mrovdostan', description: 'Explore all our activities and initiatives making a difference in our communities.' },
  '/news': { title: 'All News | Mrovdostan', description: 'Stay updated with our latest news, achievements and community impact stories.' },
  '/gallery': { title: 'Gallery | Mrovdostan', description: 'Moments from our activities and the communities we serve.' },
};
const NOINDEX_PREFIXES = ['/dashboard', '/staff-login'];

// The social-preview image is the current hero photo (cached for 5 minutes).
let heroCache = { url: null, at: 0 };
async function heroImageUrl() {
  if (!backend) return null;
  if (Date.now() - heroCache.at < 5 * 60 * 1000) return heroCache.url;
  try {
    const r = await fetch(`${BACKEND_URL}/api/hero`, { signal: AbortSignal.timeout(3000) });
    const j = r.ok ? await r.json() : null;
    heroCache = { url: j?.data?.url || null, at: Date.now() };
  } catch {
    heroCache = { url: null, at: Date.now() };
  }
  return heroCache.url;
}

const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

async function sendIndex(req, res, pathname) {
  const origin = publicOrigin(req);
  const meta = ROUTE_META[pathname] || ROUTE_META['/'];
  const hero = await heroImageUrl();
  const noindex = NOINDEX_PREFIXES.some((p) => pathname.startsWith(p));

  let html = INDEX_HTML
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(meta.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${escapeHtml(meta.description)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${escapeHtml(meta.title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${escapeHtml(meta.description)}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${escapeHtml(meta.title)}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${escapeHtml(meta.description)}$2`)
    .replace(/content="\/(lovable-uploads\/[^"]+)"/g, `content="${origin}/$1"`)
    .replace(/"url": "https:\/\/[^"]+\/"/, `"url": "${origin}/"`)
    .replace(/"logo": "https:\/\/[^"]+\/(lovable-uploads\/[^"]+)"/, `"logo": "${origin}/$1"`);

  if (hero) {
    html = html
      .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${escapeHtml(hero)}$2`)
      .replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${escapeHtml(hero)}$2`)
      .replace('<meta name="twitter:card" content="summary"', '<meta name="twitter:card" content="summary_large_image"');
  }

  const extra = [
    `    <link rel="canonical" href="${origin}${pathname === '/' ? '/' : pathname}" />`,
    `    <meta property="og:url" content="${origin}${pathname}" />`,
    noindex ? '    <meta name="robots" content="noindex, nofollow" />' : '',
    // Runtime config for the browser (error monitoring turns on when SENTRY_DSN is set)
    process.env.SENTRY_DSN ? `    <script>window.__SENTRY_DSN__=${JSON.stringify(process.env.SENTRY_DSN)};</script>` : '',
  ].filter(Boolean).join('\n');
  html = html.replace('</head>', `${extra}\n  </head>`);

  sendText(res, html, 'text/html; charset=utf-8', 'no-cache');
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const pathname = decodeURIComponent(url.pathname);

  if (PROXY_PREFIXES.some((p) => pathname.startsWith(p))) return proxy(req, res);

  if (pathname === '/robots.txt') {
    return sendText(res, `User-agent: *\nAllow: /\nDisallow: /staff-login\nDisallow: /dashboard\n\nSitemap: ${publicOrigin(req)}/sitemap.xml\n`, 'text/plain; charset=utf-8');
  }
  if (pathname === '/sitemap.xml') {
    const origin = publicOrigin(req);
    const urls = PUBLIC_ROUTES.map((r) => `  <url><loc>${origin}${r}</loc></url>`).join('\n');
    return sendText(res, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, 'application/xml; charset=utf-8');
  }
  if (pathname === '/' || pathname === '/index.html') return sendIndex(req, res, '/');

  // Static assets (never escape dist)
  const safePath = path.normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(DIST, safePath);
  if (filePath.startsWith(DIST) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const immutable = pathname.startsWith('/assets/');
    return sendFile(res, filePath, immutable ? 'public, max-age=31536000, immutable' : 'public, max-age=3600');
  }

  // SPA fallback
  sendIndex(req, res, pathname);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Web server listening on ${PORT}, proxying /api and /uploads to ${BACKEND_URL || '(unset)'}`);
});
