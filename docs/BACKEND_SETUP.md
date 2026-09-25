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

## Step 13 — Production Infrastructure

**Status:** Complete

Production-ready infrastructure for caching, background jobs, observability, and deployment.

### Redis + cache layer

- Redis client: `apps/api/src/infrastructure/redis/redis.ts`
- Cache service + keys: `apps/api/src/infrastructure/cache/`
- Cached surfaces:
  - Featured destinations, experiences, stories
  - Destination detail by slug
  - Discovery homepage feed (`GET /api/v1/discovery/homepage`)
  - Destination search + short-query suggestion keys

### Background jobs (BullMQ)

- Shared job contracts: `packages/jobs`
- API enqueue helpers: `apps/api/src/infrastructure/queue/`
- Separate worker process: `apps/worker` (not exposed as HTTP)
- Queues: `email`, `booking`, `notification`, `cleanup`
- Jobs include verification/reset emails, booking post-create processing, notifications, expired booking cleanup

Run locally:

```bash
pnpm --filter @gowithus/worker dev
```

### Rate limiting

Redis-backed when available, in-memory fallback otherwise.

- Strict: auth + booking creation
- Moderate: search routes
- Higher: catalog GET routes

### Logging + request tracing

- Structured JSON logs: `apps/api/src/infrastructure/logging/logger.ts`
- Request IDs via `x-request-id` middleware
- Error responses include `requestId`
- Sensitive values are redacted from logs

### Health checks

- `GET /health/live` — process liveness
- `GET /health/ready` — PostgreSQL + Redis readiness
- Legacy alias: `GET /ready`

### Booking + payment hardening

- Transactional overlap checks for stay/experience bookings
- Idempotent booking creation via `Idempotency-Key`
- Payment webhook signature verification + processed event IDs

### Database performance

Migration: `apps/api/prisma/migrations/20250925213000_production_indexes/`

Adds indexes for review user lookups and booking overlap queries.

Apply on Supabase:

```bash
pnpm exec prisma db execute --file apps/api/prisma/migrations/20250925213000_production_indexes/migration.sql
```

### Docker + CI/CD

- Root `docker-compose.yml` services: `postgres`, `redis`, `api`, `worker`
- Dockerfiles: `apps/api/Dockerfile`, `apps/worker/Dockerfile`
- CI builds + typechecks all packages and builds Docker images
- Deploy workflow builds production images (registry hook placeholder)

---

## Step 12 — Seed Catalog Data + Frontend Wiring

**Status:** Complete

### Catalog seed

- Idempotent seed script: `apps/api/prisma/seed.ts`
- Seeds destinations, stays, experiences, and stories from `apps/web/data/fixtures/*.json`
- Adds Venice and Cappadocia destinations required by editorial stay fixtures
- Run locally:

```bash
pnpm db:seed
# or
pnpm --filter @gowithus/api db:seed
```

Apply after migrations on a fresh database. Re-running the seed upserts by slug.

### Frontend API wiring

Discovery modules in `apps/web/lib/api/` now call the REST API via `apiFetch()` with fixture fallbacks when the API is unavailable:

- `destinations.ts` — featured, catalog list, destination detail
- `stays.ts` — homepage stays blocks
- `experiences.ts` — featured experiences
- `journal.ts` / `inspiration.ts` — editorial stories
- `bookings.ts` — authenticated booking list

Editorial presentation fields (`objectPosition`, layout variants, category labels) remain in `lib/api/catalog-enrichment.ts`, keyed by slug.

### Pages updated

- Homepage server-fetches catalog data and passes props into landing sections
- `/destinations` loads from API
- `/destinations/[slug]` — destination detail page
- `/stays` and `/stays/[slug]` — stays catalog + detail with booking request form
- `/experiences` and `/experiences/[slug]` — experiences catalog + detail with booking request form
- `/account/bookings` — authenticated bookings list UI
- Account overview inspiration block uses seeded journal stories
- Sitemap includes destination, stay, and experience slugs from the API

### Next step

See Step 14 for remaining frontend integration (restaurants pages, itinerary workspace, E2E QA).

---

## Step 14 — Frontend Integration (Client ↔ Backend)

**Status:** In progress

Follow this order — do not wire everything at once:

1. **API client** — `lib/api/client.ts`, `lib/api/server.ts` (cookie-forwarding for RSC)
2. **Auth** — `lib/api/auth.ts` (forms + session cookie)
3. **User / profile** — `lib/api/users.ts`, `/account/profile`
4. **Destinations** — `lib/api/destinations.ts` + catalog pages
5. **Stays** — `lib/api/stays.ts` + `/stays` pages
6. **Experiences** — `lib/api/experiences.ts` + `/experiences` pages
7. **Restaurants** — `lib/api/restaurants.ts` (API client ready; pages pending)
8. **Stories** — `lib/api/journal.ts`, `lib/api/inspiration.ts`
9. **Dashboard** — `lib/api/dashboard.ts`, `/dashboard` aggregate on `/account`
10. **Trips / itinerary** — `lib/api/trips.ts`, `/trips` list (itinerary workspace pending)
11. **Bookings** — `lib/api/bookings.ts`, booking request forms + `/account/bookings`
12. **Reviews** — `lib/api/reviews.ts`, review sections on detail pages
13. **Global search** — `lib/api/search.ts`, `/search?q=`
14. **Loading / error / empty states** — `EmptyState`, skeletons on list pages
15. **End-to-end testing** — manual QA with API + Postgres + Redis running

### Environment

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

Authenticated server requests forward the session cookie via `serverApiFetch()`.

---

## Next step

Complete restaurant discovery pages, itinerary workspace UI, and end-to-end QA per Step 14.15.

---

## Step 15 — External Travel Providers

### Step 15.1 — Provider Architecture

**Status:** Complete (scaffolding)

External travel APIs are isolated behind a dedicated provider layer. Domain services never call third-party HTTP APIs directly.

**Flow:**

```
Controller → Domain Service → Provider Interface → Provider Implementation → External API
```

**Folder layout:**

```
apps/api/src/providers/
├── index.ts                         # ProviderFactory (env-driven selection)
├── provider.types.ts
├── places/
│   ├── places.provider.ts           # PlacesProvider interface
│   ├── places.types.ts              # NormalizedPlace
│   ├── places.mapper.ts
│   ├── noop.places.provider.ts
│   └── foursquare/
│       ├── foursquare.client.ts     # HTTP only
│       └── foursquare.provider.ts
├── accommodation/
│   ├── accommodation.provider.ts
│   ├── accommodation.types.ts
│   ├── accommodation.mapper.ts
│   ├── noop.accommodation.provider.ts
│   └── booking/
│       ├── booking.client.ts
│       └── booking.provider.ts
└── experiences/
    ├── experiences.provider.ts
    ├── experiences.types.ts
    ├── experiences.mapper.ts
    ├── noop.experiences.provider.ts
    └── amadeus/
        ├── amadeus.client.ts
        └── amadeus.provider.ts
```

**Provider categories:**

| Category | Interface | Default | Used by |
|----------|-----------|---------|---------|
| Places | `PlacesProvider` | `noop` | `restaurantsService`, `destinationsService` |
| Accommodation | `AccommodationProvider` | `noop` | `staysService.getAvailability()` |
| Experiences | `ExperienceProvider` | `noop` | `experiencesService.getAvailability()` |

**Environment variables** (see `apps/api/.env.example`):

```bash
PROVIDER_PLACES=none            # or foursquare
PROVIDER_ACCOMMODATION=none     # or booking
PROVIDER_EXPERIENCES=none       # or amadeus
FOURSQUARE_API_KEY=
BOOKING_API_KEY=
AMADEUS_API_KEY=
AMADEUS_API_SECRET=
```

When provider env vars are unset or set to `none`, noop providers return empty results and domain services fall back to the existing Prisma seed catalog / guidance inventory.

**Integration points (without breaking existing routes):**

- `staysService.getAvailability()` — tries `AccommodationProvider` first, falls back to `buildStayAvailability()`
- `experiencesService.getAvailability()` — tries `ExperienceProvider` first, falls back to guidance inventory
- `restaurantsService.search()` — augments DB results with optional `placeSuggestions` from `PlacesProvider`
- `destinationsService.search()` — optional autocomplete suggestions via `PlacesProvider`

**Rules:**

- Controllers and routes are unchanged
- Prisma repositories remain the source of truth for published catalog content
- External responses are normalized before reaching services/controllers
- Provider API keys stay server-side only

---

## Step 4 — Authentication

**Status:** Complete

- Argon2id password hashing
- PostgreSQL-backed sessions (`sessions` table) with hashed tokens in HTTP-only cookie `gowithus_session`
- Email verification links (24h, single-use, hashed)
- Password reset links (1h, single-use, hashed, revokes sessions)
- Rate limiting on auth mutations (Redis-backed with in-memory fallback)
- Helmet, origin guard, Zod validation, security event audit log
- Frontend auth forms wired to `/api/v1/auth/*`

See endpoint list in `docs/API_SPECIFICATION.md` plus aliases `/register`, `/login`, `/logout`.
