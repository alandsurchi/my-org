/**
 * End-to-end smoke test. Boots the real server against the database in
 * DATABASE_URL and exercises auth, roles, content CRUD and uploads.
 *
 *   DATABASE_URL=... JWT_SECRET=... DEFAULT_ADMIN_PASSWORD=... npm test
 */
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

const PORT = process.env.TEST_PORT || 5099;
const BASE = `http://127.0.0.1:${PORT}`;
const ADMIN_EMAIL = (process.env.DEFAULT_ADMIN_EMAIL || 'admin@charity.com').toLowerCase();
const ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD;

if (!process.env.DATABASE_URL || !process.env.JWT_SECRET || !ADMIN_PASSWORD) {
  console.error('Set DATABASE_URL, JWT_SECRET and DEFAULT_ADMIN_PASSWORD to run the smoke test');
  process.exit(1);
}

let server;

const api = async (method, url, { token, body, form } = {}) => {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers['Content-Type'] = 'application/json';
  const res = await fetch(BASE + url, { method, headers, body: form || (body ? JSON.stringify(body) : undefined) });
  let json = null;
  try { json = await res.json(); } catch { /* non-JSON */ }
  return { status: res.status, json, headers: res.headers };
};

const waitForServer = async () => {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`${BASE}/health`);
      if (r.ok) return;
    } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('Server did not start');
};

const pngFile = () => {
  const png = fs.readFileSync(path.join(__dirname, '..', '..', 'public', 'lovable-uploads', '1b274aba-eb01-4306-999b-6798375f09e4.png'));
  return new Blob([png], { type: 'image/png' });
};

before(async () => {
  server = spawn(process.execPath, ['index.js'], {
    cwd: path.join(__dirname, '..'),
    env: { ...process.env, PORT: String(PORT), NODE_ENV: 'test', STORAGE_PATH: process.env.STORAGE_PATH || './uploads-test' },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  server.stdout.on('data', (d) => { if (process.env.VERBOSE) process.stdout.write(d); });
  server.stderr.on('data', (d) => process.stderr.write(d));
  await waitForServer();
});

after(() => {
  if (server) server.kill();
});

let adminToken;
let staffToken;
let staffId;

test('health reports a connected database', async () => {
  const { status, json } = await api('GET', '/health');
  assert.equal(status, 200);
  assert.equal(json.database, 'Connected');
});

test('public self-registration is rejected', async () => {
  const { status } = await api('POST', '/api/auth/register', { body: { email: 'x@example.com', password: 'Password123', name: 'X' } });
  assert.equal(status, 401);
});

test('login with wrong password fails and does not reveal the account', async () => {
  const { status, json } = await api('POST', '/api/auth/login', { body: { email: ADMIN_EMAIL, password: 'definitely-wrong' } });
  assert.equal(status, 401);
  assert.equal(json.code, 'INVALID_CREDENTIALS');
});

test('default admin logs in as super admin', async () => {
  const { status, json } = await api('POST', '/api/auth/login', { body: { email: ADMIN_EMAIL.toUpperCase(), password: ADMIN_PASSWORD } });
  assert.equal(status, 200, JSON.stringify(json));
  assert.ok(json.token);
  assert.equal(json.user.isSuperAdmin, true);
  adminToken = json.token;
});

test('super admin can create a staff account; dotted gmail address is preserved', async () => {
  const email = 'first.last.test@gmail.com';
  await api('DELETE', '/api/staff/0', { token: adminToken }); // no-op cleanup guard
  const list = await api('GET', '/api/staff', { token: adminToken });
  const existing = list.json.data.find((u) => u.email === email);
  if (existing) await api('DELETE', `/api/staff/${existing.id}`, { token: adminToken });

  const { status, json } = await api('POST', '/api/staff', { token: adminToken, body: { name: 'Test Staff', email, password: 'StaffPass123', role: 'staff' } });
  assert.equal(status, 201, JSON.stringify(json));
  assert.equal(json.data.email, email);
  staffId = json.data.id;

  const login = await api('POST', '/api/auth/login', { body: { email, password: 'StaffPass123' } });
  assert.equal(login.status, 200, JSON.stringify(login.json));
  assert.equal(login.json.user.isSuperAdmin, false);
  staffToken = login.json.token;
});

test('weak passwords are rejected when creating staff', async () => {
  const { status } = await api('POST', '/api/staff', { token: adminToken, body: { name: 'Weak', email: 'weak@example.com', password: 'short', role: 'staff' } });
  assert.equal(status, 400);
});

test('staff cannot manage accounts but can read the list', async () => {
  const list = await api('GET', '/api/staff', { token: staffToken });
  assert.equal(list.status, 200);
  assert.equal(list.json.data[0].canEdit, false);

  const create = await api('POST', '/api/staff', { token: staffToken, body: { name: 'Nope', email: 'nope@example.com', password: 'Password123' } });
  assert.equal(create.status, 403);
});

test('super admin can upload content and staff can too', async () => {
  for (const token of [adminToken, staffToken]) {
    const form = new FormData();
    form.append('heroImage', pngFile(), 'logo.png');
    const { status, json } = await api('POST', '/api/hero', { token, form });
    assert.equal(status, 201, JSON.stringify(json));
    assert.equal(json.data.dimensions.width, 498);
  }
  const current = await api('GET', '/api/hero');
  assert.equal(current.status, 200);
  assert.equal(current.json.data.isActive, true);
});

test('news CRUD works and anonymous writes are blocked', async () => {
  const anon = await api('POST', '/api/news', { body: { title: 'Anon', content: 'should fail' } });
  assert.equal(anon.status, 401);

  const form = new FormData();
  form.append('title', 'Smoke test article');
  form.append('content', 'Created by the smoke test');
  form.append('image', pngFile(), 'img.png');
  const created = await api('POST', '/api/news', { token: staffToken, form });
  assert.equal(created.status, 201, JSON.stringify(created.json));
  const id = created.json.data.id;
  assert.ok(created.json.data.imageUrl.includes('/uploads/news/'));

  const list = await api('GET', '/api/news?limit=5');
  assert.equal(list.status, 200);
  assert.ok(list.json.data.some((n) => n.id === id));

  const del = await api('DELETE', `/api/news/${id}`, { token: staffToken });
  assert.equal(del.status, 200);
  const gone = await api('GET', `/api/news/${id}`);
  assert.equal(gone.status, 404);
});

test('gallery returns the standard envelope', async () => {
  const { status, json } = await api('GET', '/api/gallery');
  assert.equal(status, 200);
  assert.equal(json.success, true);
  assert.ok(Array.isArray(json.data));
});

test('a deleted user loses access immediately', async () => {
  const del = await api('DELETE', `/api/staff/${staffId}`, { token: adminToken });
  assert.equal(del.status, 200, JSON.stringify(del.json));
  const me = await api('GET', '/api/staff/me', { token: staffToken });
  assert.equal(me.status, 401);
});

test('a super admin can remove another super admin but never themselves', async () => {
  const email = 'second.super@example.com';
  const list = await api('GET', '/api/staff', { token: adminToken });
  const existing = list.json.data.find((u) => u.email === email);
  if (existing) await api('DELETE', `/api/staff/${existing.id}`, { token: adminToken });

  const created = await api('POST', '/api/staff', { token: adminToken, body: { name: 'Second Super', email, password: 'SuperPass123', role: 'super_admin' } });
  assert.equal(created.status, 201, JSON.stringify(created.json));
  assert.equal(created.json.data.isSuperAdmin, true);
  assert.equal(created.json.data.isProtected, false);

  const me = await api('GET', '/api/staff/me', { token: adminToken });
  const self = (await api('GET', '/api/staff', { token: adminToken })).json.data.find((u) => u.id === me.json.data.id);
  assert.equal(self.isProtected, true);

  const del = await api('DELETE', `/api/staff/${created.json.data.id}`, { token: adminToken });
  assert.equal(del.status, 200, JSON.stringify(del.json));
});

test('the last super admin cannot demote themselves or delete themselves', async () => {
  const me = await api('GET', '/api/staff/me', { token: adminToken });
  const demote = await api('PUT', `/api/staff/${me.json.data.id}`, { token: adminToken, body: { role: 'staff' } });
  assert.equal(demote.status, 403);
  const del = await api('DELETE', `/api/staff/${me.json.data.id}`, { token: adminToken });
  assert.equal(del.status, 403);
});

test('unknown routes return JSON 404; any origin is accepted unless ALLOWED_ORIGINS is set', async () => {
  const nf = await api('GET', '/api/nothing-here');
  assert.equal(nf.status, 404);
  const res = await fetch(`${BASE}/api/news`, { headers: { Origin: 'https://some-frontend.example' } });
  const allowed = res.headers.get('access-control-allow-origin');
  if (process.env.ALLOWED_ORIGINS) assert.equal(allowed, null);
  else assert.equal(allowed, 'https://some-frontend.example');
  const health = await api('GET', '/api/health');
  assert.equal(health.status, 200);
});
