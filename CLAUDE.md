# test-2 / Mrovdostan Organization website

Public website + staff dashboard for the Mrovdostan Organization for Humanitarian Aid (Kurdistan Region, Iraq). The actual project lives in the **`my-org/`** subfolder, which is its own existing git repository (branch `main`) — this outer `test-2` folder is just a container and is not itself a git repo.

Aland Agency project. Follow C:\Users\aland\Desktop\Aland Agency\Aland-HQ\rules\global-rules.md and the tiers in C:\Users\aland\Desktop\Aland Agency\Aland-HQ\playbooks\tiers.md.

Tier 3: has auth (JWT staff login), user/donor-facing data, a Postgres database, and production deploys — treat changes here with the higher tier.

## Stack
- Frontend (`my-org/`): React 18, Vite, TypeScript, Tailwind, shadcn/ui, TanStack Query. Kurdish/Arabic/English with RTL.
- Backend (`my-org/backend/`): Node.js, Express, PostgreSQL, JWT auth, image uploads (S3/R2-capable).
- Hosting: Railway (backend + Postgres + upload volume; frontend as a static site served by `server.mjs`, proxying `/api`).

## Commands (run inside `my-org/`)
- install: `npm install` (root) and `cd backend && npm install`
- dev: `npm run dev` (frontend, :8080) / `cd backend && npm run dev` (:5000)
- build: `npm run build`
- lint / typecheck: `npm run lint`, `npm run typecheck`
- test: `cd backend && npm test` (needs `DATABASE_URL`, `JWT_SECRET`, `DEFAULT_ADMIN_PASSWORD`); `npm run test:e2e` (Playwright, root)

## Key folders
- `my-org/src/` — React app; `my-org/backend/` — Express API, `init-db.js` schema, `seed.js`
- `my-org/e2e/` — Playwright suite; `my-org/.github/workflows/ci.yml` — CI

## Specialists that fit (Agency Library)
- Frontend Developer, Backend Architect, API Tester, Application Security Engineer (auth/JWT)

## Project rules
- Don't restyle existing UI unless Aland asks. Smallest change. Never commit `.env`/`.env.example` values (DB creds, JWT_SECRET, admin password) — both `my-org/.env` and `my-org/backend/.env` exist locally.
- Ask Aland before any Railway deploy or production env change.
- Unclear / flagged for Aland: this outer `test-2` folder has no git repo of its own, and `my-org/` already has one. Registering a new repo here would embed `my-org/.git` as a nested/gitlink entry rather than tracking its real history — the git step was skipped pending your call on which repo should be authoritative.
