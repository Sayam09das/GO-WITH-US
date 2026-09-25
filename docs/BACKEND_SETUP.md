# GO WITH US — Backend Setup

Step-by-step backend implementation guide for `apps/api`. This document tracks setup progress and maps tutorial-style model names to the canonical Prisma schema used by GO WITH US.

For full table definitions, see `docs/DATABASE.md`. For architecture rules, see `docs/BACKEND_ARCHITECTURE.md`.

---

## Step 1 — Express API Foundation

**Status:** Complete

- Node.js + TypeScript + Express in `apps/api`
- `src/app.ts` and `src/server.ts`
- Environment config in `src/config/env.ts`
- CORS, `/health`, and `/api/v1`

---

## Step 2 — PostgreSQL + Prisma

**Status:** Complete

- Prisma 7 with PostgreSQL (`prisma/schema.prisma`, `prisma.config.ts`)
- Prisma Client singleton in `src/lib/db.ts` using `@prisma/adapter-pg`
- Initial migration in `prisma/migrations/20250923140000_init/`
- `/ready` endpoint verifies database connectivity
- Local Postgres via root `docker-compose.yml`

---

## Step 3 — Database Schema & Core Models

**Status:** Complete (canonical schema — no refactor to split tables)

GO WITH US uses a **consolidated relational model** aligned with `docs/DATABASE.md`. The Prisma schema in `apps/api/prisma/schema.prisma` is the source of truth.

### Canonical Prisma models

| Prisma model | SQL table | Purpose |
| :--- | :--- | :--- |
| `User` | `users` | Auth identity + profile fields |
| `Destination` | `destinations` | Public discovery catalog |
| `Stay` | `stays` | Accommodations linked to a destination |
| `Experience` | `experiences` | Activities linked to a destination |
| `Trip` | `trips` | User-owned trip plans |
| `SavedItem` | `saved_items` | Polymorphic saved destinations, stays, and experiences |
| `ItineraryItem` | `itinerary_items` | Day-by-day trip activities and custom notes |
| `Review` | `reviews` | Polymorphic user reviews |
| `Notification` | `notifications` | In-app user notifications |
| `PasswordResetToken` | `password_reset_tokens` | Password reset flow tokens |

### Tutorial name → canonical mapping

Use this when comparing generic backend tutorials to GO WITH US:

| Common tutorial name | GO WITH US implementation | Notes |
| :--- | :--- | :--- |
| `User` | `User` | Direct match |
| `Profile` | Fields on `User` | `fullName`, `avatarUrl`, `bio`, `homeCity`, `travelStyles`, `budgetPreference` |
| `Destination` | `Destination` | Direct match |
| `Stay` | `Stay` | Direct match |
| `Experience` | `Experience` | Direct match |
| `Trip` | `Trip` | Direct match |
| `TripDay` | `ItineraryItem.dayIndex` + `dayDate` | No separate day table; days are derived from trip dates |
| `TripItem` | `ItineraryItem` | One table for scheduled items and custom notes |
| `SavedDestination` | `SavedItem` where `itemType = destination` | Polymorphic saves, not per-entity tables |
| `SavedStay` | `SavedItem` where `itemType = stay` | Polymorphic saves, not per-entity tables |
| `SavedExperience` | `SavedItem` where `itemType = experience` | Also covered by the same table |
| `Review` | `Review` | Direct match |
| `Booking` | **Not in MVP** | Out of product scope — GO WITH US is discovery + planning, not a booking engine |
| `Story` | **Not in MVP** | Editorial content stays in fixtures / CMS for now, not a database table |

### Why we keep this shape

1. **Matches product docs** — `docs/PRODUCT.md` and `docs/DATABASE.md` explicitly avoid booking marketplace tables.
2. **Fewer joins for saves** — one `saved_items` table powers the Saved Places UI across destinations, stays, and experiences.
3. **Flexible itineraries** — `itinerary_items` supports destinations, stays, experiences, and custom notes without rigid day/item split tables.
4. **Profile on user** — account profile is owner-scoped data; a separate `profiles` table adds complexity without MVP benefit.

### Verify locally

```bash
docker compose up -d postgres

cd apps/api
export DATABASE_URL="postgresql://gowithus:gowithus@localhost:5432/gowithus?schema=public"
pnpm db:migrate
pnpm db:generate
pnpm dev
```

```bash
curl http://localhost:4000/ready
pnpm exec prisma studio
```

---

## Step 5 — User & Dashboard Backend

**Status:** Complete

- `GET/PATCH /api/v1/users/me` — profile (`name`, `email`, `avatar`, `bio`, `phone`, `country`, `timezone`)
- `PATCH /api/v1/users/me/avatar` — avatar URL update (upload pipeline later)
- `GET /api/v1/dashboard` — aggregated dashboard payload
- `GET /api/v1/trips?status=upcoming` — upcoming trips list
- Saved destinations + stays under `/api/v1/users/me/saved-*`
- `GET /api/v1/users/me/activity` — recent user activity feed

---

## Step 6 — Destinations API

**Status:** Complete

- `GET /api/v1/destinations` — paginated listing with optional `featured` and `sort`
- `GET /api/v1/destinations/featured` — homepage featured destinations
- `GET /api/v1/destinations/categories` — distinct category tags
- `QUERY /api/v1/destinations/search` — complex JSON search (idempotent, CORS preflight enabled)
- `GET /api/v1/destinations/:slug` — detail with stays, experiences, related destinations, optional `isSaved`

Saved destinations remain on `/api/v1/users/me/saved-destinations/*`.

---

## Next step

**Step 7 — Wire discovery UI** to destinations API and seed catalog data.

---

## Step 4 — Authentication

**Status:** Complete

- Argon2id password hashing
- PostgreSQL-backed sessions (`sessions` table) with hashed tokens in HTTP-only cookie `gowithus_session`
- Email verification links (24h, single-use, hashed)
- Password reset links (1h, single-use, hashed, revokes sessions)
- Rate limiting on auth mutations (in-memory; Redis-ready later)
- Helmet, origin guard, Zod validation, security event audit log
- Frontend auth forms wired to `/api/v1/auth/*`

See endpoint list in `docs/API_SPECIFICATION.md` plus aliases `/register`, `/login`, `/logout`.
