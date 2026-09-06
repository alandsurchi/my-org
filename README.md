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
cp .env.example .env          # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                   # http://localhost:8080
```

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

The same checks run in GitHub Actions on every push (`.github/workflows/ci.yml`).

## Deployment (Railway)

Two services in one Railway project, both deploying from this repository:

**Backend service** — Root directory `backend`. Attach a PostgreSQL database and a volume mounted at `/data/uploads`. Variables:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=<long random string, 32+ chars>
NODE_ENV=production
ALLOWED_ORIGINS=https://<frontend-domain>
STORAGE_PATH=/data/uploads
DEFAULT_ADMIN_EMAIL=<your email>
DEFAULT_ADMIN_PASSWORD=<initial password, remove after first login>
```

**Frontend service** — Root directory `/`. Variables:

```
VITE_API_URL=https://<backend-domain>/api
VITE_SECRET_STAFF_PATH=<hidden login path>
```

Rebuild the frontend whenever `VITE_*` variables change (they are baked in at build time).

### Custom domain

1. Railway → frontend service → Settings → Networking → Custom Domain: add `www.yourdomain.org` (and the bare domain). Add the CNAME records Railway shows at your registrar.
2. Railway → backend service → Custom Domain: add `api.yourdomain.org`.
3. Update `ALLOWED_ORIGINS` on the backend and `VITE_API_URL` on the frontend to the new hosts, then redeploy both.

## Repository layout

```
src/            React app (pages, components, hooks, contexts, lib/apiClient.ts)
public/         static assets
backend/        Express API (routes, middleware, utils, init-db.js schema, seed.js)
.github/        CI workflow
```
