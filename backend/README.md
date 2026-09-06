# Charity Dashboard Backend

Node.js + Express + PostgreSQL API for the Mrovdostan website and staff dashboard. Runs on Railway with a PostgreSQL service and a volume for uploads.

## Run locally

```bash
cp .env.example .env     # set DATABASE_URL and JWT_SECRET
npm install
npm run dev              # http://localhost:5000
```

The schema is created automatically on start (`init-db.js`). On an empty database, sample news and projects are seeded once (`seed.js`) and a first super admin is created from `DEFAULT_ADMIN_EMAIL` / `DEFAULT_ADMIN_PASSWORD`.

## Test

```bash
DATABASE_URL=... JWT_SECRET=... DEFAULT_ADMIN_PASSWORD=... npm test
```

Boots the server against the given database and runs the end-to-end smoke test in `test/smoke.test.js`.

## Endpoints

| Route | Public | Notes |
|---|---|---|
| `GET /health`, `GET /api/health` | yes | status + database state |
| `POST /api/auth/login` | yes | rate limited, returns JWT |
| `GET /api/auth/verify` | token | current user |
| `POST /api/auth/register` | super admin | create account |
| `GET /api/staff`, `GET /api/staff/me` | token | list / current user |
| `POST/PUT/DELETE /api/staff/:id` | super admin | manage accounts |
| `GET /api/hero`, `GET /api/about` | yes | active image |
| `POST /api/hero`, `POST /api/about`, `DELETE /api/about` | token | replace / remove image |
| `GET /api/news`, `GET /api/news/:id` | yes | `?limit=&category=` |
| `POST/PUT/DELETE /api/news/:id` | token | multipart, field `image` |
| `GET /api/projects`, `GET /api/projects/:id` | yes | `?status=&category=&limit=` |
| `POST/PUT/DELETE /api/projects/:id` | token | multipart, field `image` |
| `GET /api/gallery`, `GET /api/gallery/:id` | yes | |
| `POST/PUT/DELETE /api/gallery/:id` | token | multipart, field `photo` |

All responses use `{ success, data }` or `{ success: false, message | error, code }`.

## Roles

`staff` and `admin` manage content. `super_admin` also manages accounts. Emails listed in `SUPER_ADMINS` are always treated as super admins.

## Uploads

Images (JPEG, PNG, WebP, GIF, max 5 MB) are stored under `STORAGE_PATH` (`/data/uploads` on the Railway volume) and served from `/uploads/...`. Set `STORAGE_TYPE=r2` plus the `R2_*` variables to store them in Cloudflare R2 instead.

## Environment variables

See `.env.example`. Required: `DATABASE_URL`, `JWT_SECRET`.
