/**
 * Railway test runner.
 *
 * 1. Starts a private PostgreSQL inside the container (nothing touches production).
 * 2. Runs the backend suite (backend/npm test) and the browser suite (Playwright).
 * 3. Serves a status page on $PORT with the latest result and log tail.
 * 4. Repeats every TEST_INTERVAL_HOURS (default 24). Every deploy (push) also runs it.
 *
 * Env: JWT_SECRET (any long string), DEFAULT_ADMIN_PASSWORD (any), TEST_INTERVAL_HOURS (optional)
 */
import http from 'node:http';
import { spawn, spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT) || 3000;
const INTERVAL_MS = (Number(process.env.TEST_INTERVAL_HOURS) || 24) * 3600 * 1000;
const PG_DIR = '/tmp/pgdata';
const PG_PORT = '5432';

const env = {
  ...process.env,
  DATABASE_URL: `postgresql://postgres:tests@127.0.0.1:${PG_PORT}/charity_tests`,
  JWT_SECRET: process.env.JWT_SECRET || 'railway-test-runner-secret-at-least-32-characters-long',
  DEFAULT_ADMIN_EMAIL: 'admin@charity.com',
  DEFAULT_ADMIN_PASSWORD: process.env.DEFAULT_ADMIN_PASSWORD || 'RunnerAdmin123!',
  STORAGE_PATH: '/tmp/uploads-tests',
  CI: 'true',
  E2E_API_PORT: '5101',
  E2E_WEB_PORT: '4101',
};

// ---------------------------------------------------------------------------
// Status page (up immediately so Railway's health check passes)
// ---------------------------------------------------------------------------
const state = {
  status: 'starting',
  startedAt: new Date().toISOString(),
  lastRun: null,
  runs: [],
};

const escape = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const page = () => {
  const last = state.lastRun;
  const color = !last ? '#64748b' : last.ok ? '#16a34a' : '#dc2626';
  const rows = state.runs.slice(-20).reverse().map((r) =>
    `<tr><td>${r.finishedAt}</td><td style="color:${r.ok ? '#16a34a' : '#dc2626'};font-weight:600">${r.ok ? 'PASSED' : 'FAILED'}</td><td>${r.backend}</td><td>${r.e2e}</td><td>${Math.round(r.durationMs / 1000)}s</td></tr>`
  ).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><title>Mrovdostan test runner</title>
<meta http-equiv="refresh" content="30"><style>body{font-family:system-ui,sans-serif;max-width:960px;margin:40px auto;padding:0 16px;color:#0f172a}
.badge{display:inline-block;padding:6px 14px;border-radius:999px;color:#fff;background:${color};font-weight:700}
table{border-collapse:collapse;width:100%;margin-top:16px}td,th{border-bottom:1px solid #e2e8f0;padding:8px;text-align:left;font-size:14px}
pre{background:#0f172a;color:#e2e8f0;padding:16px;border-radius:8px;overflow:auto;font-size:12px;max-height:480px}</style></head><body>
<h1>Mrovdostan automated tests</h1>
<p><span class="badge">${escape(state.status.toUpperCase())}</span> &nbsp; runner up since ${state.startedAt}, repeats every ${INTERVAL_MS / 3600000} h</p>
${last ? `<p>Last run finished ${last.finishedAt}: backend <b>${escape(last.backend)}</b>, browser <b>${escape(last.e2e)}</b></p>` : '<p>First run in progress…</p>'}
<table><tr><th>Finished</th><th>Result</th><th>Backend</th><th>Browser</th><th>Duration</th></tr>${rows}</table>
${last ? `<h2>Log tail</h2><pre>${escape(last.logTail)}</pre>` : ''}
</body></html>`;
};

http.createServer((req, res) => {
  if (req.url === '/status.json') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: state.status, lastRun: state.lastRun && { ...state.lastRun, logTail: undefined }, runs: state.runs.slice(-20) }));
  }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(page());
}).listen(PORT, '0.0.0.0', () => console.log(`status page on ${PORT}`));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const run = (cmd, args, opts = {}) => new Promise((resolve) => {
  const child = spawn(cmd, args, { cwd: opts.cwd || root, env: { ...env, ...(opts.env || {}) }, shell: false });
  let out = '';
  const push = (d) => { const s = d.toString(); out += s; process.stdout.write(s); };
  child.stdout.on('data', push);
  child.stderr.on('data', push);
  child.on('close', (code) => resolve({ code: code ?? 1, out }));
});

const sh = (command) => spawnSync('bash', ['-lc', command], { stdio: 'inherit' });

function startPostgres() {
  // Debian's postgresql package installs a cluster; run our own single instance as the postgres user.
  sh(`mkdir -p ${PG_DIR} /tmp/uploads-tests && chown -R postgres:postgres ${PG_DIR}`);
  const bin = spawnSync('bash', ['-lc', 'ls -d /usr/lib/postgresql/*/bin | head -1'], { encoding: 'utf8' }).stdout.trim();
  const initialized = spawnSync('test', ['-f', `${PG_DIR}/PG_VERSION`]).status === 0;
  if (!initialized) {
    sh(`su postgres -c "${bin}/initdb -D ${PG_DIR} --auth=trust -U postgres" > /dev/null`);
  }
  sh(`su postgres -c "${bin}/pg_ctl -D ${PG_DIR} -o '-p ${PG_PORT} -c listen_addresses=127.0.0.1' -l /tmp/pg.log start"`);
  sh(`for i in $(seq 1 30); do ${bin}/pg_isready -h 127.0.0.1 -p ${PG_PORT} >/dev/null 2>&1 && break; sleep 1; done`);
  sh(`su postgres -c "${bin}/psql -h 127.0.0.1 -p ${PG_PORT} -c \\"ALTER USER postgres PASSWORD 'tests'\\"" > /dev/null`);
  sh(`su postgres -c "${bin}/psql -h 127.0.0.1 -p ${PG_PORT} -tc \\"SELECT 1 FROM pg_database WHERE datname='charity_tests'\\" | grep -q 1 || ${bin}/psql -h 127.0.0.1 -p ${PG_PORT} -c 'CREATE DATABASE charity_tests'"`);
  // Fresh schema every run so results never depend on the previous run
  sh(`su postgres -c "${bin}/psql -h 127.0.0.1 -p ${PG_PORT} -d charity_tests -c 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;'" > /dev/null`);
}

const summarize = (out, re, fallback) => (out.match(re) || [null, fallback])[1] || fallback;

async function runSuite() {
  const started = Date.now();
  state.status = 'running';
  let log = '';
  try {
    startPostgres();
  } catch (e) {
    log += `postgres failed: ${e.message}\n`;
  }

  const backend = await run('npm', ['test'], { cwd: path.join(root, 'backend'), env: { TEST_PORT: '5099' } });
  log += backend.out;
  // node --test prints "# pass N" (TAP) when piped and "ℹ pass N" (spec) on a TTY
  const backendSummary = `${summarize(backend.out, /(?:#|ℹ) pass (\d+)/, '?')} passed, ${summarize(backend.out, /(?:#|ℹ) fail (\d+)/, '?')} failed`;

  const e2e = await run('npx', ['playwright', 'test', '--reporter=line']);
  log += e2e.out;
  const e2eSummary = (e2e.out.match(/\d+ passed[^\n]*/) || ['no result'])[0] + (e2e.out.match(/\d+ failed/) ? `, ${e2e.out.match(/\d+ failed/)[0]}` : '');

  const ok = backend.code === 0 && e2e.code === 0;
  const result = { ok, backend: backendSummary, e2e: e2eSummary, finishedAt: new Date().toISOString(), durationMs: Date.now() - started, logTail: log.slice(-12000) };
  state.lastRun = result;
  state.runs.push(result);
  state.status = ok ? 'passed' : 'failed';
  console.log(`\n=== TEST RUN ${ok ? 'PASSED' : 'FAILED'} — backend: ${backendSummary}; browser: ${e2eSummary} ===\n`);
}

(async () => {
  for (;;) {
    await runSuite();
    console.log(`next run in ${INTERVAL_MS / 3600000} h`);
    await new Promise((r) => setTimeout(r, INTERVAL_MS));
  }
})();
