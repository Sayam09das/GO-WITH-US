# GO WITH US

Premium travel **discovery and trip-planning** platform. Browse destinations, stays, and experiences, save places, build trips, and plan day-by-day itineraries.

This is **not** a booking marketplace or OTA. See [`docs/PRODUCT.md`](docs/PRODUCT.md) for product direction.

---

## Production URLs

| Surface | URL |
| :--- | :--- |
| **Live web app** | [https://go-with-us-web.vercel.app](https://go-with-us-web.vercel.app) |
| **API (Render)** | [https://go-with-us-5jyq.onrender.com](https://go-with-us-5jyq.onrender.com) |
| **API health** | [https://go-with-us-5jyq.onrender.com/health/ready](https://go-with-us-5jyq.onrender.com/health/ready) |
| **GitHub** | [https://github.com/Sayam09das/GO-WITH-US](https://github.com/Sayam09das/GO-WITH-US) |

**Vercel (web)** — set in Project → Environment Variables:

| Variable | Production value |
| :--- | :--- |
| `API_URL` | `https://go-with-us-5jyq.onrender.com` |
| `NEXT_PUBLIC_API_URL` | `/api/v1` |
| `NEXT_PUBLIC_SITE_URL` | `https://go-with-us-web.vercel.app` |

**Render (API)** — must match the Vercel origin for CORS and cookies:

| Variable | Production value |
| :--- | :--- |
| `APP_ORIGIN` | `https://go-with-us-web.vercel.app` |
| `APP_URL` | `https://go-with-us-web.vercel.app` |
| `API_URL` | `https://go-with-us-5jyq.onrender.com` |

Full local vs production templates: [`apps/web/.env.example`](apps/web/.env.example), [`.env.example`](.env.example), [`apps/api/.env.example`](apps/api/.env.example).

---

## Stack

| Layer | Technology |
| :--- | :--- |
| Frontend | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS |
| Backend | Node.js 22, **Express**, TypeScript, Prisma 7, PostgreSQL |
| Jobs | BullMQ worker (`apps/worker`), Redis |
| Tooling | pnpm 11, Biome, Husky, GitHub Actions, Docker |

Shared packages live under `packages/*` (`types`, `utils`, `config`, `jobs`, `ui`).

---

## Repository layout

```text
apps/web/          Next.js frontend (port 3000)
apps/api/          Express REST API + Prisma (port 4000)
apps/worker/       Background jobs (email, queues)
packages/          Shared libraries
docs/              Product & engineering specifications
docker/            Container entrypoints
docker-compose.yml Local full stack (Postgres, Redis, api, worker, web)
.github/workflows/ CI and deploy pipelines
```

Agent and contributor guidance: [`AGENTS.md`](AGENTS.md), [`CONTRIBUTING.md`](CONTRIBUTING.md).

---

## Prerequisites

- **Node.js 22+**
- **pnpm 11** (version pinned in root `package.json` → `packageManager`)
- **Docker** (recommended for PostgreSQL, Redis, and production-like runs)

---

## Local setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Environment

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env   # optional; API also reads root .env via docker-compose
```

Edit `.env` with real secrets before production. Never commit `.env` files.

Key variables:

| Variable | Purpose |
| :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis for cache, rate limits, queues |
| `SESSION_SECRET` | Session cookie signing (long random string in prod) |
| `APP_URL` / `APP_ORIGIN` | Public site origin (CORS + links) |
| `NEXT_PUBLIC_API_URL` | Browser API base (`/api/v1` for same-origin proxy in dev) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for SEO and SSR |

See [`.env.example`](.env.example) and [`apps/api/.env.example`](apps/api/.env.example).

### 3. Start infrastructure

```bash
docker compose up -d postgres redis
```

Or the **full stack** (API runs migrations on start, then web + worker):

```bash
pnpm docker:build
pnpm docker:up
# web → http://localhost:3000  |  api → http://localhost:4000
```

### 4. Database (local dev without full compose)

```bash
docker compose up -d postgres redis
pnpm --filter @gowithus/api db:migrate
pnpm db:seed
```

### 5. Run apps

```bash
pnpm dev
```

| App | URL |
| :--- | :--- |
| Web | http://localhost:3000 |
| API | http://localhost:4000/api/v1 |
| Health | http://localhost:4000/health/ready |

Individual filters:

```bash
pnpm --filter @gowithus/web dev
pnpm --filter @gowithus/api dev
pnpm --filter @gowithus/worker dev
```

---

## Quality checks

```bash
pnpm lint          # Biome
pnpm typecheck     # All workspaces
pnpm build         # Production build (all apps)
pnpm check         # lint + typecheck
```

---

## Docker images

| Dockerfile | Service |
| :--- | :--- |
| `apps/web/Dockerfile` | Next.js standalone |
| `apps/api/Dockerfile` | API + Prisma migrate entrypoint |
| `apps/worker/Dockerfile` | Queue worker |

Root [`.dockerignore`](.dockerignore) keeps images small. API entrypoint: [`docker/api-entrypoint.sh`](docker/api-entrypoint.sh) (`RUN_DB_MIGRATIONS=true` by default).

Production pull example: [`docker-compose.prod.example.yml`](docker-compose.prod.example.yml) and [`docker/README.md`](docker/README.md).

### Vercel (Next.js web UI)

Host **`apps/web`** on Vercel; keep **API** and **worker** on your container host (GHCR images from [`deploy.yml`](.github/workflows/deploy.yml)).

1. Import the repo in Vercel → **Root Directory** `apps/web` (install/build commands live in [`apps/web/vercel.json`](apps/web/vercel.json)).
2. From `apps/web`: `vercel link` (and `vercel env pull` for local previews).
3. Set environment variables (Production + Preview) — see [Production URLs](#production-urls) for current values:

   | Variable | Example |
   | :--- | :--- |
   | `API_URL` | `https://go-with-us-5jyq.onrender.com` (rewrite target for `/api/v1`) |
   | `NEXT_PUBLIC_API_URL` | `/api/v1` |
   | `NEXT_PUBLIC_SITE_URL` | `https://go-with-us-web.vercel.app` |

4. On the API host, set `APP_ORIGIN` / `APP_URL` to the same site URL so session cookies and CORS match the Vercel origin.

Docker builds still use Next **standalone** output; Vercel builds skip standalone automatically when `VERCEL=1`.

---

## CI/CD

### Continuous integration ([`.github/workflows/ci.yml`](.github/workflows/ci.yml))

On push to `main` / `feat/api-express-foundation` and on PRs to `main`:

1. `pnpm install --frozen-lockfile`
2. `pnpm lint` → `pnpm typecheck` → `pnpm build`
3. Build **api**, **worker**, and **web** Docker images (no push)

pnpm version comes from root `packageManager` (do not pin a duplicate version in the workflow).

### Deploy ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml))

On push to **`main`** (and manual `workflow_dispatch`):

1. Same quality gate as CI
2. Push images to **GitHub Container Registry**:
   - `ghcr.io/<owner>/<repo>-api:<sha>`
   - `ghcr.io/<owner>/<repo>-worker:<sha>`
   - `ghcr.io/<owner>/<repo>-web:<sha>`

**GitHub repository variable (recommended):** `PUBLIC_SITE_URL` — production URL baked into the web image at build time.

**Production secrets (host / orchestrator):** `SESSION_SECRET`, `DATABASE_URL`, `REDIS_URL`, `APP_URL`, SMTP if using email.

Detailed ops notes: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md), [`docs/BACKEND_SETUP.md`](docs/BACKEND_SETUP.md).

---

## Documentation map

| Start here | Document |
| :--- | :--- |
| Product direction | [`docs/PRODUCT.md`](docs/PRODUCT.md) |
| Build order | [`docs/ROADMAP.md`](docs/ROADMAP.md) |
| Frontend | [`docs/FRONTEND_ARCHITECTURE.md`](docs/FRONTEND_ARCHITECTURE.md) |
| Backend | [`docs/BACKEND_ARCHITECTURE.md`](docs/BACKEND_ARCHITECTURE.md), [`docs/BACKEND_SETUP.md`](docs/BACKEND_SETUP.md) |
| API contract | [`docs/API_SPECIFICATION.md`](docs/API_SPECIFICATION.md) |
| Deployment | [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) |

---

## License

Private project — all rights reserved unless otherwise noted in repository settings.
