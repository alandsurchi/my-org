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

## Managing accounts without the website

The dashboard can only manage staff once you are already signed in, and the
"forgot password" email is disabled while no mail service is configured. So if
the only super admin forgets their password, nobody can get back in through the
website. `scripts/admin.js` is the way in, and the way to add people.

The database is only reachable from inside the Railway project, so run it there:

```bash
railway ssh --service charity-backend "node scripts/admin.js list"
railway ssh --service charity-backend "node scripts/admin.js reset you@example.org"
railway ssh --service charity-backend "node scripts/admin.js create colleague@example.org --name 'Full Name' --role admin"
railway ssh --service charity-backend "node scripts/admin.js role colleague@example.org super_admin"
railway ssh --service charity-backend "node scripts/admin.js delete colleague@example.org --yes"
```

Locally (with `backend/.env` pointing at a database) the same commands work as
`npm run admin -- list`.

Without `--password` a strong one is generated and printed **once** — it is
hashed with bcrypt before storage and never logged anywhere else. Two guards
prevent locking everyone out: the last `super_admin` cannot be demoted or
deleted, and `delete` requires `--yes`.

This replaces the older `DEFAULT_ADMIN_RESET=true` recovery variable for
day-to-day use. That still works, but it resets the password on **every**
restart until you remove the variable again, which is easy to forget.

## Uploads

Images (JPEG, PNG, WebP, GIF, max 5 MB) are stored under `STORAGE_PATH` (`/data/uploads` on the Railway volume) and served from `/uploads/...`. Set `STORAGE_TYPE=r2` plus the `R2_*` variables to store them in Cloudflare R2 instead.

## Environment variables

See `.env.example`. Required: `DATABASE_URL`, `JWT_SECRET`.
