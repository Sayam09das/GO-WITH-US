# GO WITH US — Deployment & Infrastructure

This document defines local development containers, CI, and production hardening for **GO WITH US**.

---

## 1. Purpose

GO WITH US ships as a small set of containers: Next.js web, Fastify API, PostgreSQL, and Redis. Deployment should stay boring, repeatable, and secret-safe.

---

## 2. Runtime Topology

```text
Internet
   │
   ▼
[ Next.js Web :3000 ]
   │  REST fetch /api/v1
   ▼
[ Fastify API :4000 ]
   │
   ├── PostgreSQL :5432
   └── Redis :6379 ──► Background workers
```

Workers may run as a second Node process sharing the API codebase and Redis connection.

### Vercel (web tier only)

The marketing and dashboard UI (`apps/web`) can deploy to **Vercel** while API, Postgres, Redis, and worker stay on Docker/Kubernetes.

* Vercel project **Root Directory**: `apps/web`.
* Monorepo install/build: [`apps/web/vercel.json`](../apps/web/vercel.json).
* Server-side rewrites proxy `/api/v1` to `API_URL` (see `apps/web/next.config.ts`), so browsers keep same-origin cookies when `NEXT_PUBLIC_API_URL=/api/v1`.
* Set `NEXT_PUBLIC_SITE_URL` to the Vercel (or custom) domain; mirror that value on the API as `APP_ORIGIN` / `APP_URL`.
* Do not put `DATABASE_URL`, `SESSION_SECRET`, or Redis URLs in Vercel unless you intentionally colocate backend secrets there (default: API host only).

---

## 3. Docker Compose (Development)

Services:
* `web` — Next.js app (`apps/web`)
* `api` — Fastify app (`apps/api`)
* `postgres` — PostgreSQL 16+
* `redis` — Redis 7+
* `worker` — optional queue consumer

Compose mounts source for local iteration, injects `.env` values, and waits on `api` `/ready` before considering the stack healthy.

---

## 4. Environment Strategy

| Variable | Where | Public? |
| :--- | :--- | :---: |
| `NEXT_PUBLIC_API_URL` | Web | Yes |
| `NEXT_PUBLIC_SITE_URL` | Web | Yes |
| `DATABASE_URL` | API / worker | No |
| `REDIS_URL` | API / worker | No |
| `COOKIE_SECRET` | API | No |
| `APP_ORIGIN` | API CORS | No |

Never commit real secrets. Provide `.env.example` only.

Environments: `development`, `test`, `production`.

---

## 5. Database Operations

* Schema changes ship as numbered migrations in `apps/api/migrations`.
* Deploy order: migrate → start API → start web.
* Seeds populate catalog fixtures for local and demo environments only; production catalog data is curated separately.
* Backups: nightly PostgreSQL dumps in production; Redis is cache/queue and is reconstructable.

---

## 6. CI / CD (GitHub Actions)

On pull request:
1. Install dependencies.
2. Typecheck web + API.
3. Lint.
4. Unit / component tests (Vitest).
5. API tests (Supertest) against ephemeral Postgres.

On main:
* Build Docker images.
* Run Playwright against a compose stack or preview URL when available.
* Deploy only after migrations succeed.

---

## 7. Production Hardening

* HTTPS termination.
* CORS allowlist locked to the site origin.
* API rate limiting enabled.
* Non-root container users.
* Resource limits on Compose/Kubernetes as applicable.
* Structured logs shipped with `requestId`.
* `/health` for liveness, `/ready` for Postgres + Redis.

---

## 8. Observability

* JSON logs from Fastify and Next.js server.
* Error envelopes never include stack traces in production responses.
* Basic uptime checks on `/` and `/api/v1` readiness.
* Worker failures retry with backoff; poison jobs are logged, not silent.

---

## 9. Image & Asset Delivery

Travel photography uses Next.js `<Image>` with CDN caching. Object storage can be added later for user avatars; MVP may use static/public URLs. Do not block page deploys on media processing.

---

## 10. Rollback

* Keep previous web and API image tags.
* Migrations should be backward compatible with the currently running API whenever possible.
* If a migration is unsafe, stop the deploy rather than rewriting production data ad hoc.

---

## 11. Related Documents

* `docs/BACKEND_ARCHITECTURE.md`
* `docs/SECURITY.md`
* `docs/TESTING.md`
* `docs/ROADMAP.md`
* `docs/PROJECT_STRUCTURE.md`
