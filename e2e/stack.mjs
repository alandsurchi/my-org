/**
 * Boots the full stack for end-to-end tests: the backend API on E2E_API_PORT
 * and the production web server (server.mjs, serving dist/ and proxying /api)
 * on E2E_WEB_PORT. Playwright waits for the web port, then runs the tests.
 *
 * Required env: DATABASE_URL (a throwaway Postgres), JWT_SECRET, DEFAULT_ADMIN_PASSWORD.
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const API_PORT = process.env.E2E_API_PORT || '5101';
const WEB_PORT = process.env.E2E_WEB_PORT || '4101';

for (const key of ['DATABASE_URL', 'JWT_SECRET', 'DEFAULT_ADMIN_PASSWORD']) {
  if (!process.env[key]) {
    console.error(`e2e stack: ${key} is required`);
    process.exit(1);
  }
}

const backend = spawn(process.execPath, ['index.js'], {
  cwd: path.join(root, 'backend'),
  // DEFAULT_ADMIN_RESET makes every boot restore the admin password, so a failed run cannot poison the next one
  env: { ...process.env, PORT: API_PORT, NODE_ENV: 'test', STORAGE_PATH: process.env.STORAGE_PATH || './uploads-e2e', ALLOWED_ORIGINS: '', DEFAULT_ADMIN_RESET: 'true' },
  stdio: 'inherit',
});

const web = spawn(process.execPath, ['server.mjs'], {
  cwd: root,
  env: { ...process.env, PORT: WEB_PORT, BACKEND_URL: `http://127.0.0.1:${API_PORT}` },
  stdio: 'inherit',
});

const stop = () => { backend.kill(); web.kill(); };
process.on('SIGINT', () => { stop(); process.exit(0); });
process.on('SIGTERM', () => { stop(); process.exit(0); });
backend.on('exit', (code) => { if (code) { console.error('backend exited', code); stop(); process.exit(code); } });
web.on('exit', (code) => { if (code) { console.error('web exited', code); stop(); process.exit(code); } });
