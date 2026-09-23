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
const PUBLIC_ROUTES = ['/', '/projects', '/news', '/gallery', '/privacy'];
// index.html carries this origin in its JSON-LD and social tags; every request
// swaps it for the host the visitor actually used. A literal swap rather than a
// regex, so adding fields to the structured data can never rewrite the wrong one.
const CANONICAL_ORIGIN = 'https://mrovdostan.org';
const INDEX_HTML = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');

// One canonical hostname: "www." is redirected away permanently so search engines
// index a single address. Host-based, not domain-specific, so localhost, the
// Railway URL and the e2e stack are all left alone.
function canonicalHostRedirect(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return false;
  const host = (req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim();
  if (!host.toLowerCase().startsWith('www.')) return false;
  const proto = (req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim();
  res.writeHead(301, {
    Location: `${proto}://${host.slice(4)}${req.url}`,
    'Cache-Control': 'public, max-age=3600',
    ...SECURITY_HEADERS
  });
  res.end();
  return true;
}

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
  '/privacy': { title: 'Privacy Policy | Mrovdostan', description: 'How Mrovdostan handles visitor information on this website: what we measure, what we never collect, and which other services are involved.' },
};
const NOINDEX_PREFIXES = ['/dashboard', '/staff-login', '/forgot-password', '/reset-password'];

// The social-preview image is the current hero photo (cached for 5 minutes).
// Dimensions come along for the ride: og:image:width/height in the static HTML
// describe the logo, and would be a lie once this photo replaces it.
let heroCache = { url: null, width: null, height: null, at: 0 };
async function heroImage() {
  if (!backend) return null;
  if (Date.now() - heroCache.at < 5 * 60 * 1000) return heroCache.url ? heroCache : null;
  try {
    const r = await fetch(`${BACKEND_URL}/api/hero`, { signal: AbortSignal.timeout(3000) });
    const j = r.ok ? await r.json() : null;
    heroCache = {
      url: j?.data?.url || null,
      width: j?.data?.dimensions?.width || null,
      height: j?.data?.dimensions?.height || null,
      at: Date.now(),
    };
  } catch {
    heroCache = { url: null, width: null, height: null, at: Date.now() };
  }
  return heroCache.url ? heroCache : null;
}

const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** Small TTL cache so a crawler sweeping 50 posts does not hammer the backend. */
const jsonCache = new Map();
async function cachedJson(apiPath, ttlMs) {
  if (!backend) return null;
  const hit = jsonCache.get(apiPath);
  if (hit && Date.now() - hit.at < ttlMs) return hit.value;
  let value = null;
  try {
    const r = await fetch(`${BACKEND_URL}${apiPath}`, { signal: AbortSignal.timeout(3000) });
    value = r.ok ? (await r.json())?.data ?? null : null;
  } catch {
    value = null;
  }
  jsonCache.set(apiPath, { value, at: Date.now() });
  // The map is bounded by the number of posts; trim if a site ever grows large.
  if (jsonCache.size > 500) jsonCache.clear();
  return value;
}

// Each post has its own address, so each needs its own title, description and
// preview image — otherwise every one of them ships the home page's metadata and
// search engines treat them as duplicates.
const POST_ROUTES = [
  { re: /^\/projects\/(\d+)$/, api: 'projects', parent: '/projects', parentName: 'All Activities' },
  { re: /^\/news\/(\d+)$/, api: 'news', parent: '/news', parentName: 'All News' },
];

async function postForPath(pathname) {
  for (const route of POST_ROUTES) {
    const id = pathname.match(route.re)?.[1];
    if (!id) continue;
    const data = await cachedJson(`/api/${route.api}/${id}`, 60 * 1000);
    if (!data) return null;
    const title = data.title || data.title_en || '';
    const body = data.description || data.content || '';
    if (!title) return null;
    return {
      title,
      body,
      image: data.image_url || data.imageUrl || null,
      createdAt: data.createdAt || data.created_at || null,
      updatedAt: data.updatedAt || data.updated_at || null,
      parent: route.parent,
      parentName: route.parentName,
      isArticle: route.api === 'news',
    };
  }
  return null;
}

/** Sitemap URLs are XML text: five predefined entities, no HTML rules. */
const escapeXml = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

/** One line of plain text, trimmed to a length search engines actually show. */
const metaText = (text, max = 160) => {
  const flat = String(text || '').replace(/\s+/g, ' ').trim();
  return flat.length <= max ? flat : `${flat.slice(0, max - 1).trimEnd()}…`;
};

// Inline JSON must have "<" neutralised so a value can never close the script
// tag. The replacement has to be the six characters <, NOT the character
// they denote: written as a plain escape it substitutes "<" for "<" and does
// nothing. Post titles come from the database, so this one is load-bearing.
// escapeHtml is for attribute values and would corrupt the JSON.
const ldScript = (obj) =>
  `    <script type="application/ld+json">${JSON.stringify(obj).replace(/</g, String.fromCharCode(92) + "u003c")}</script>`;

// English, to match the English titles ROUTE_META serves to crawlers.
const BREADCRUMB_LEAF = {
  '/projects': 'All Activities',
  '/news': 'All News',
  '/gallery': 'Gallery',
  '/privacy': 'Privacy Policy',
};

/** crumbs: [{ name, path }], root first. */
const breadcrumbLd = (origin, crumbs) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: `${origin}${c.path}`,
  })),
});

// Mirrors the English faqQ1..faqA5 strings in src/content/uiStrings.ts. This file
// cannot import from src/ (the Dockerfile ships only dist/ and server.mjs), so the
// copy is deliberate; an e2e test asserts the two stay the same length.
const FAQ_EN = [
  ['What does Mrovdostan do?', 'Mrovdostan is a humanitarian, non-profit organisation. We provide emergency aid, educational support and long-term development for people living in difficult circumstances.'],
  ['Where do you work?', 'We work in the Kurdistan Region of Iraq, alongside the affected and vulnerable communities there.'],
  ['Who can receive your help?', 'We provide humanitarian assistance regardless of religion, race, nationality or political views. Our aim is to deliver aid justly and quickly to those who need it.'],
  ['What kind of work do you focus on?', 'Our goals are quality education for underserved communities, better access to healthcare, sustainable economic development, and the promotion of human rights and dignity.'],
  ['How can I follow your work or get in touch?', 'You can follow our Activities, News and Gallery pages, or find us on Facebook, Instagram and YouTube. To contact us directly, write to ohumanism@gmail.com.'],
];

const faqLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_EN.map(([name, text]) => ({
    '@type': 'Question',
    name,
    acceptedAnswer: { '@type': 'Answer', text },
  })),
});

/** News posts are Articles; activities are ongoing work, so they are not. */
const articleLd = (origin, pathname, post) => {
  const ld = {
    '@context': 'https://schema.org',
    '@type': post.isArticle ? 'NewsArticle' : 'CreativeWork',
    headline: post.title,
    description: metaText(post.body),
    mainEntityOfPage: `${origin}${pathname}`,
    // Must use the live origin, not CANONICAL_ORIGIN: the literal swap only runs
    // over INDEX_HTML, and this block is appended after it. Pointing at a
    // different host than the NGO block's @id would break the entity link.
    author: { '@id': `${origin}/#organization` },
    publisher: { '@id': `${origin}/#organization` },
  };
  if (post.image) ld.image = post.image.startsWith('http') ? post.image : `${origin}${post.image}`;
  if (post.createdAt) ld.datePublished = post.createdAt;
  if (post.updatedAt) ld.dateModified = post.updatedAt;
  return ld;
};

async function sendIndex(req, res, pathname) {
  const origin = publicOrigin(req);
  const post = await postForPath(pathname);
  const meta = post
    ? { title: `${post.title} | Mrovdostan`, description: metaText(post.body) }
    : ROUTE_META[pathname] || ROUTE_META['/'];
  const hero = await heroImage();
  // A post URL that resolves to nothing is a soft 404: the app renders a "not
  // found" state, so keep it out of the index rather than letting Google collect
  // /news/99999 and friends.
  const missingPost = !post && POST_ROUTES.some((r) => r.re.test(pathname));
  const noindex = missingPost || NOINDEX_PREFIXES.some((p) => pathname.startsWith(p));

  // A post's own photo is a far better link preview than the site-wide hero.
  const preview = post?.image
    ? { url: post.image, width: null, height: null, alt: post.title }
    : hero && { ...hero, alt: 'A photograph from the work of Mrovdostan Organization for Humanitarian Aid' };

  let html = INDEX_HTML
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(meta.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${escapeHtml(meta.description)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${escapeHtml(meta.title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${escapeHtml(meta.description)}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${escapeHtml(meta.title)}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${escapeHtml(meta.description)}$2`)
    .replace(/content="\/(lovable-uploads\/[^"]+)"/g, `content="${origin}/$1"`)
    // One literal swap for every absolute URL in the structured data and social
    // tags. The two regexes this replaced matched only their first occurrence,
    // so adding a nested "url" to the JSON-LD would have rewritten the wrong one.
    .replaceAll(CANONICAL_ORIGIN, origin);

  if (preview) {
    // A photo previews better than the emblem, but the emblem's dimensions do
    // not describe it. Use the real ones, or drop the tags — a wrong
    // og:image:width makes the preview render cropped.
    const url = preview.url.startsWith('http') ? preview.url : `${origin}${preview.url}`;
    const dims = preview.width && preview.height
      ? `<meta property="og:image:width" content="${preview.width}" />\n    <meta property="og:image:height" content="${preview.height}" />`
      : '';
    html = html
      .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${escapeHtml(url)}$2`)
      .replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${escapeHtml(url)}$2`)
      .replace(/(<meta property="og:image:alt" content=")[^"]*(")/, `$1${escapeHtml(preview.alt)}$2`)
      .replace(/(<meta name="twitter:image:alt" content=")[^"]*(")/, `$1${escapeHtml(preview.alt)}$2`)
      .replace(/<meta property="og:image:width"[^>]*\/>\s*<meta property="og:image:height"[^>]*\/>/, dims)
      .replace('<meta name="twitter:card" content="summary"', '<meta name="twitter:card" content="summary_large_image"');
  }

  // Appended after every replace above has already run, so these blocks can
  // neither be clobbered by those patterns nor shift their first match.
  const extra = [
    `    <link rel="canonical" href="${origin}${pathname === '/' ? '/' : pathname}" />`,
    `    <meta property="og:url" content="${origin}${pathname}" />`,
    noindex ? '    <meta name="robots" content="noindex, nofollow" />' : '',
    post
      ? ldScript(breadcrumbLd(origin, [
          { name: 'Home', path: '/' },
          { name: post.parentName, path: post.parent },
          { name: post.title, path: pathname },
        ]))
      : BREADCRUMB_LEAF[pathname]
        ? ldScript(breadcrumbLd(origin, [
            { name: 'Home', path: '/' },
            { name: BREADCRUMB_LEAF[pathname], path: pathname },
          ]))
        : '',
    post ? ldScript(articleLd(origin, pathname, post)) : '',
    pathname === '/' ? ldScript(faqLd()) : '',
    // Runtime config for the browser (error monitoring turns on when SENTRY_DSN is set)
    process.env.SENTRY_DSN ? `    <script>window.__SENTRY_DSN__=${JSON.stringify(process.env.SENTRY_DSN)};</script>` : '',
    // Cloudflare Web Analytics: the beacon only loads when this token is set.
    process.env.CF_BEACON_TOKEN ? `    <script>window.__CF_BEACON_TOKEN__=${JSON.stringify(process.env.CF_BEACON_TOKEN)};</script>` : '',
  ].filter(Boolean).join('\n');
  html = html.replace('</head>', `${extra}\n  </head>`);

  sendText(res, html, 'text/html; charset=utf-8', 'no-cache');
}

/**
 * The sitemap is built from live content, not a fixed list: every activity and
 * news post has its own address now, and a sitemap that listed only the four
 * static pages would hide all of them from search engines.
 *
 * If the backend is unreachable we still serve the static routes rather than an
 * error, so a brief outage cannot make the whole sitemap disappear.
 */
async function sendSitemap(req, res) {
  const origin = publicOrigin(req);
  const entries = PUBLIC_ROUTES.map((r) => ({ loc: `${origin}${r}` }));

  const [projects, news] = await Promise.all([
    cachedJson('/api/projects', 5 * 60 * 1000),
    cachedJson('/api/news', 5 * 60 * 1000),
  ]);
  for (const [list, prefix] of [[projects, '/projects'], [news, '/news']]) {
    for (const item of Array.isArray(list) ? list : []) {
      if (item?.id === undefined || item?.id === null) continue;
      entries.push({
        loc: `${origin}${prefix}/${item.id}`,
        lastmod: (item.updatedAt || item.updated_at || item.createdAt || item.created_at || '').slice(0, 10) || null,
      });
    }
  }

  const xml = entries
    .map((e) => `  <url><loc>${escapeXml(e.loc)}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ''}</url>`)
    .join('\n');
  sendText(
    res,
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${xml}\n</urlset>\n`,
    'application/xml; charset=utf-8',
  );
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const pathname = decodeURIComponent(url.pathname);

  if (PROXY_PREFIXES.some((p) => pathname.startsWith(p))) return proxy(req, res);

  // Page requests only: /api and /uploads above are never redirected, so a request
  // method or body can never be lost to a 301.
  if (canonicalHostRedirect(req, res)) return;

  if (pathname === '/robots.txt') {
    // Derived from NOINDEX_PREFIXES so the two can never disagree. The secret
    // staff path is deliberately absent: robots.txt is world-readable, so
    // listing it there would publish it.
    const body = [
      'User-agent: *',
      'Allow: /',
      ...NOINDEX_PREFIXES.map((p) => `Disallow: ${p}`),
      '',
      `Sitemap: ${publicOrigin(req)}/sitemap.xml`,
      '',
    ].join('\n');
    return sendText(res, body, 'text/plain; charset=utf-8');
  }
  if (pathname === '/sitemap.xml') return sendSitemap(req, res);
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
