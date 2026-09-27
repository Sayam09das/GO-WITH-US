# Production checklist — GO WITH US

Use this before portfolio launch or merging to `main`. Live URLs: see [README](../README.MD#production-urls).

---

## Vercel (web)

| Variable | Required value |
| :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | `https://go-with-us-web.vercel.app` |
| `NEXT_PUBLIC_API_URL` | `/api/v1` |
| `API_URL` | `https://go-with-us-5jyq.onrender.com` |

**Verify after deploy**

- View source on `/` → `og:url` uses your Vercel domain (not localhost).
- `/sitemap.xml` → `<loc>` entries use your Vercel domain.
- `/api/v1/health/ready` via the Vercel proxy returns JSON (`database`, `redis`, `status`) from Render.

Production builds **fail** if `NEXT_PUBLIC_SITE_URL` is missing or localhost (`apps/web/next.config.ts` guard).

---

## Render (API)

**Build command (repo root):** `pnpm install && pnpm --filter @gowithus/api build`

**Start command:** `pnpm --filter @gowithus/api db:migrate:deploy && pnpm --filter @gowithus/api start`

Email templates live in `apps/api/src/lib/email-templates.ts` (compiled to `dist/`). Do not import Node-only email code from `@gowithus/utils` (web-only `cn()` helper).

| Variable | Required value |
| :--- | :--- |
| `APP_ORIGIN` | `https://go-with-us-web.vercel.app` |
| `APP_URL` | `https://go-with-us-web.vercel.app` |
| `API_URL` | `https://go-with-us-5jyq.onrender.com` |
| `DATABASE_URL` | Supabase / Postgres connection string |
| `DIRECT_URL` | Direct Postgres URL (migrations; optional if same as `DATABASE_URL`) |
| `SESSION_SECRET` | Long random string |
| `NODE_ENV` | `production` |

**Redis (optional)**

- Add `REDIS_URL` from Render Redis or Upstash (`rediss://` for TLS), **or**
- **Remove** `REDIS_URL` entirely — API runs without Redis; cache/queues/rate-limit store use in-memory fallback.

**Verify**

- `GET /health/ready` → `"database":"up"`.
- Sign-in from Vercel → session cookie on `go-with-us-web.vercel.app`, `/auth/me` succeeds.

---

## Manual QA (logged in)

- [ ] Register → verify email → sign in → sign out
- [ ] Saved item from explore / catalog
- [ ] Create trip → add itinerary items → reorder
- [ ] Review on stay or destination
- [ ] Profile update
- [ ] Search with filters
- [ ] Mobile layout + no console errors

---

## SEO

- [ ] Metadata on key routes
- [ ] Open Graph + Twitter cards (after `NEXT_PUBLIC_SITE_URL`)
- [ ] `robots.txt`, `sitemap.xml`
- [x] JSON-LD on destination, stay, and experience detail pages (+ site-wide WebSite on root layout)

---

## Portfolio

- [ ] Merge feature branch to `main`
- [ ] Add screenshots under [`docs/screenshots/`](screenshots/) (see README)
- [ ] GitHub repo + live demo links in README

---

## Out of MVP scope (expected)

- Google / Facebook OAuth (removed from sign-in UI until implemented)
- Payments / OTA booking
- Dedicated worker on Render (API can send auth email inline when SMTP is set)
