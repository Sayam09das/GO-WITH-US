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
| `Restaurant` | `restaurants` | Dining linked to a destination |
| `Story` | `stories` | Editorial travel stories |
| `Booking` | `bookings` | Stay/experience bookings |
| `BookingItem` | `booking_items` | Line items on a booking |
| `Payment` | `payments` | Payment records linked to bookings |
| `ReviewReport` | `review_reports` | User reports on reviews |
| `Trip` | `trips` | User-owned trip plans |
| `SavedItem` | `saved_items` | Polymorphic saved destinations, stays, and experiences |
| `TripDay` | `trip_days` | Day shells linked to trip date ranges |
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
| `TripDay` | `trip_days` | Explicit day records with titles and dates |
| `TripItem` | `ItineraryItem` + `sortOrder` | Items stored on `itinerary_items` with `day_index` |
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

## Step 7 — Stays API

**Status:** Complete

- `GET /api/v1/stays` — paginated listing with optional filters
- `QUERY /api/v1/stays/search` — complex JSON search (idempotent)
- `GET /api/v1/stays/:slug` — detail with rooms, pricing, policies, nearby experiences, optional `isSaved`
- `QUERY /api/v1/stays/:stayId/availability` — guidance-based room availability by dates/guests
- `GET /api/v1/stays/:stayId/reviews` — paginated reviews with aggregate rating
- `POST /api/v1/stays/:stayId/reviews` — auth required; user must have stay on a trip itinerary or a `BOOKED_STAY` activity

Saved stays remain on `/api/v1/users/me/saved-stays/*`.

---

## Next step

**Step 8 — Wire stays UI** to the stays API and seed catalog data.

---

## Step 8 — Trips & Itinerary API

**Status:** Complete

- `POST /api/v1/trips` — create trip and auto-generate trip days from dates
- `GET /api/v1/trips` — owner-scoped list with `status` filters (`draft`, `upcoming`, `ongoing`, `past`, `cancelled`)
- `GET /api/v1/trips/:tripId` — full trip detail with day-by-day itinerary
- `PATCH /api/v1/trips/:tripId` — update metadata; validates itinerary fits new date range
- `DELETE /api/v1/trips/:tripId` — cascade delete with ownership check
- `GET/POST /api/v1/trips/:tripId/days` — list or append trip days
- `PATCH /api/v1/trips/:tripId/days/:dayId` — update day title/date
- `POST/PATCH/DELETE /api/v1/trips/:tripId/days/:dayId/items/*` — itinerary CRUD
- `PATCH /api/v1/trips/:tripId/days/:dayId/items/reorder` — atomic drag-and-drop ordering
- `PATCH /api/v1/trips/:tripId/items/:itemId/move` — move item between days

Trip status is computed from dates (`draft`, `upcoming`, `active`, `completed`) unless manually set to `cancelled`.

---

## Next step

**Step 9 — Wire discovery UI** to experiences, restaurants, and seed catalog data.

---

## Step 9 — Experiences & Restaurants API

**Status:** Complete

**Experiences**
- `GET /api/v1/experiences` — paginated listing
- `QUERY /api/v1/experiences/search` — complex JSON search
- `GET /api/v1/experiences/featured`
- `GET /api/v1/experiences/:slug` — detail
- `QUERY /api/v1/experiences/:experienceId/availability` — guidance-based availability
- `GET/POST /api/v1/experiences/:experienceId/reviews`

**Restaurants**
- `GET /api/v1/restaurants` — paginated listing
- `QUERY /api/v1/restaurants/search`
- `GET /api/v1/restaurants/featured`
- `GET /api/v1/restaurants/:slug` — detail
- `GET/POST /api/v1/restaurants/:restaurantId/reviews`

**Saved items**
- `GET/POST/DELETE /api/v1/users/me/saved-experiences/:experienceId`
- `GET/POST/DELETE /api/v1/users/me/saved-restaurants/:restaurantId`

Itinerary items accept `restaurantId` via `POST /api/v1/trips/:tripId/days/:dayId/items`.

---

## Step 10 — Bookings & Payments API

**Status:** Complete

- `POST /api/v1/bookings` — create pending booking with server-side pricing and `Idempotency-Key`
- `GET /api/v1/bookings` — owner list (`?status=upcoming|past|cancelled`)
- `GET /api/v1/bookings/:bookingId` — booking detail
- `POST /api/v1/bookings/:bookingId/cancel` — state transition (not delete)
- `POST /api/v1/payments/create` — create payment intent for a booking
- `POST /api/v1/payments/webhook` — verified webhook confirms payment + booking

---

## Step 11 — Reviews & Stories API

**Status:** Complete

**Unified reviews**
- `POST /api/v1/reviews` — create review by target type
- `PATCH /api/v1/reviews/:reviewId` — owner update
- `DELETE /api/v1/reviews/:reviewId` — owner delete
- `POST /api/v1/reviews/:reviewId/report` — report review

**Resource review lists**
- `GET /api/v1/destinations/:destinationId/reviews`
- Existing stay/experience/restaurant review routes

**Stories**
- `GET /api/v1/stories` — published editorial content
- `GET /api/v1/stories/featured`
- `GET /api/v1/stories/categories`
- `GET /api/v1/stories/:slug`
- `QUERY /api/v1/stories/search`

---

## Next step

**Step 12 — Seed catalog data** and wire frontend discovery/booking flows.

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
