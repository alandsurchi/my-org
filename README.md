# Mrovdostan Organization Website

Public website and staff dashboard for the Mrovdostan Organization for Humanitarian Aid (Kurdistan Region, Iraq).

- **Frontend** (`/`): React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query. Kurdish, Arabic and English with RTL support.
- **Backend** (`/backend`): Node.js, Express, PostgreSQL, JWT auth, image uploads.
- **Hosting**: both services run on Railway (backend + PostgreSQL + upload volume; frontend as a static site).

## Local development

Prerequisites: Node.js 20+, a PostgreSQL database (any local instance or a Railway database URL).

```bash
# 1. Backend
cd backend
cp .env.example .env          # set DATABASE_URL and JWT_SECRET
npm install
npm run dev                   # http://localhost:5000

# 2. Frontend (new terminal, repo root)
npm install
npm run dev                   # http://localhost:8080, /api proxied to the Railway backend
```

To develop against the local backend instead, create `.env` with `BACKEND_URL=http://localhost:5000`.

On Windows, `start-app.ps1` opens both servers once the two `.env` files exist.

On first start with an empty database the backend creates a super admin using
`DEFAULT_ADMIN_EMAIL` / `DEFAULT_ADMIN_PASSWORD`. If no password is set, a random one is printed once in the logs.
Log in at `/staff-login` and change it from the Staff tab.

## Roles

| Role | Content (hero, about, news, projects, gallery) | Staff accounts |
|-------------|------|------|
| staff | edit | view |
| admin | edit | view |
| super_admin | edit | create, edit, delete |

## Checks

```bash
npm run typecheck && npm run lint && npm run build     # frontend
cd backend && npm test                                  # backend smoke test (needs DATABASE_URL, JWT_SECRET, DEFAULT_ADMIN_PASSWORD)
```

### Browser tests (Playwright)

`e2e/` boots the real backend and the production web server against a throwaway Postgres and drives Chrome through the public pages, login, dashboard editing, and an accessibility scan (axe, WCAG 2 A/AA):

```bash
npm run build
DATABASE_URL=postgresql://... JWT_SECRET=... DEFAULT_ADMIN_EMAIL=admin@charity.com DEFAULT_ADMIN_PASSWORD=... npm run test:e2e
```

Locally it uses the installed Google Chrome. Failures leave screenshots and traces in `test-results/`.

### Automated runs on Railway (no GitHub Actions needed)

The `tests` service in the Railway project builds `Dockerfile.tests` from the repo and runs `e2e/runner.mjs`: it starts a private PostgreSQL inside its own container, runs the backend suite and the browser suite, then shows the result on its public URL (green PASSED / red FAILED, history, log tail) and repeats every `TEST_INTERVAL_HOURS` (default 24). Every push redeploys it, so each change is tested within a few minutes. Production data is never touched.

`.github/workflows/ci.yml` runs the same checks on GitHub Actions when that is available.

## Deployment (Railway)

Two services in one Railway project, both deploying from this repository:

**Backend service** — Root directory `backend`. Attach a PostgreSQL database and a volume mounted at `/data/uploads`. Variables:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=<long random string, 32+ chars>
NODE_ENV=production
STORAGE_PATH=/data/uploads
DEFAULT_ADMIN_EMAIL=<your email>
DEFAULT_ADMIN_PASSWORD=<initial password, remove after first login>
```

The API accepts requests from any site (safe: auth is a Bearer token, not a cookie). To restrict it, set `CORS_STRICT=true` and `ALLOWED_ORIGINS=https://your-frontend-domain`.

**Frontend web service** — Root directory `/`. It builds the site and runs `server.mjs`, which serves the files and proxies `/api` and `/uploads` to the backend, so the browser only talks to one origin. Variables:

```
BACKEND_URL=https://<backend-service-domain>
VITE_SECRET_STAFF_PATH=<hidden login path>
```

Do not set `VITE_API_URL` on Railway: the default `/api` goes through the proxy. (Set it only when hosting the frontend somewhere without the proxy, e.g. Vercel.)

### Backups

- **Database**: Railway point-in-time recovery is enabled on the Postgres service (`railway postgres pitr status --service Postgres`).
- **Everything, downloadable**: Dashboard → Staff tab → **Download backup (.zip)** (super admin). The zip holds `data.json` (all tables) and `uploads/` (all images). Keep it private; it contains staff password hashes.
- **Uploads off-site (optional)**: set `STORAGE_TYPE=r2` plus `R2_ENDPOINT`, `R2_ACCESS_KEY`, `R2_SECRET_KEY`, `R2_BUCKET`, `R2_PUBLIC_URL` on the backend to store new uploads in Cloudflare R2.

### Monitoring

- Backend health check: `/health` (Railway restarts the service if it fails).
- Error tracking: create a project at sentry.io and set `SENTRY_DSN` on **both** Railway services. The backend reports server errors; the web service injects the DSN so the browser reports front-end crashes. No rebuild needed.
- Uptime alerts: add `https://<your-domain>/api/health` to a free monitor such as UptimeRobot or Better Stack.

### Password reset

Staff change their own password in Dashboard → Staff tab → **My password**. A super admin can set anyone's password from the staff list.
"Forgot your password?" on the login page sends a one-hour reset link by email once an email provider is configured on the backend: either `RESEND_API_KEY`, or `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS`, plus `MAIL_FROM` and `PUBLIC_SITE_URL`. Until then the link is hidden and the page tells staff to ask a super admin.

### Analytics

Built in, first-party and cookie-free: the site sends one beacon per page view to `/api/analytics/view` (path, referrer host, language, device). Visitors are counted with a daily salted hash, never an IP. Staff pages are excluded and Do-Not-Track is honoured. See Dashboard → Home tab → **Website visitors**.

### Custom domain

1. Railway → frontend web service → Settings → Networking → Custom Domain: add `www.yourdomain.org` and the bare domain. Add the CNAME records Railway shows at your registrar.
2. The backend needs no public domain change; the frontend proxies to it via `BACKEND_URL`.

## Repository layout

```
src/            React app (pages, components, hooks, contexts, lib/apiClient.ts)
public/         static assets
backend/        Express API (routes, middleware, utils, init-db.js schema, seed.js)
.github/        CI workflow
```
