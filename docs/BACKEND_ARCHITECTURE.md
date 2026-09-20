# GO WITH US — Backend Architecture

This document defines the backend architecture, service boundaries, request lifecycle, caching strategy, and implementation conventions for the **GO WITH US** travel discovery and trip-planning platform.

---

## 1. Purpose

The backend exists to replace frontend fixture data with a secure, typed REST API. It persists users, discovery catalogs, saved places, trips, itineraries, reviews, and notifications without turning GO WITH US into a booking marketplace or payment processor.

Key architectural goals:
* **Discovery First**: Public catalog reads stay fast and unauthenticated.
* **Planning Integrity**: Trips and itineraries remain private, owner-scoped, and transactional.
* **Fixture Compatibility**: API payloads match frontend TypeScript interfaces in `types/` so UI components do not rewrite.
* **Progressive Replacement**: Frontend `lib/api/*` clients swap fixtures for live endpoints without changing page markup.

---

## 2. Confirmed Backend Stack

* **Runtime**: Node.js
* **Language**: TypeScript (strict)
* **Framework**: Fastify
* **Database**: PostgreSQL
* **Cache & Queues**: Redis + background workers
* **API Protocol**: REST (`/api/v1`)
* **Validation**: Schema validation at the HTTP boundary (Zod or equivalent)
* **Migrations**: Versioned SQL migrations
* **Containerization**: Docker & Docker Compose

---

## 3. Architectural Principles

1. **Modular Monolith**: One Fastify service with domain modules, not premature microservices.
2. **Layered Request Path**: Routes → hooks/plugins → controllers → services → repositories.
3. **PostgreSQL Is Source of Truth**: Redis may cache, never own, catalog or trip data.
4. **Public Reads, Private Writes**: Destinations, stays, experiences, and reviews are public to read; saves, trips, itinerary edits, and review writes require auth.
5. **Owner Authorization**: Trip, saved-item, and profile mutations are scoped to the authenticated user.
6. **No Inline SQL in Controllers**: Data access lives in repositories.
7. **Idempotent Safe Methods**: GET requests never mutate state.
8. **Structured Errors**: Every failure returns a consistent JSON error envelope.
9. **Observability by Default**: JSON logs, request IDs, and health endpoints ship with the server.
10. **No Booking Scope Creep**: The API never processes payments, GDS inventory, or airline tickets.

---

## 4. Recommended Backend Structure

```text
apps/api/
├── src/
│   ├── server.ts                    # Fastify bootstrap
│   ├── app.ts                       # Plugin registration
│   ├── config/
│   │   └── env.ts                   # Environment validation
│   ├── plugins/
│   │   ├── cors.ts
│   │   ├── cookie.ts
│   │   ├── rate-limit.ts
│   │   ├── auth.ts
│   │   └── error-handler.ts
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── destinations/
│   │   ├── stays/
│   │   ├── experiences/
│   │   ├── search/
│   │   ├── saved/
│   │   ├── trips/
│   │   ├── itinerary/
│   │   ├── reviews/
│   │   └── notifications/
│   ├── lib/
│   │   ├── db.ts                    # PostgreSQL pool
│   │   ├── redis.ts
│   │   ├── logger.ts
│   │   └── passwords.ts
│   └── types/
├── migrations/
├── seeds/
└── tests/
```

Each domain module contains `routes.ts`, `controller.ts`, `service.ts`, `repository.ts`, and `schemas.ts`.

---

## 5. Request Lifecycle

```text
HTTP Request
    │
    ▼
Fastify Plugins (CORS, cookies, rate limit, request ID)
    │
    ▼
Route Schema Validation
    │
    ▼
Auth Hook (public skip / session required)
    │
    ▼
Controller
    │
    ▼
Service (business rules, ownership checks)
    │
    ▼
Repository (PostgreSQL)
    │
    ▼
Optional Redis Cache Read/Write
    │
    ▼
Standard JSON Envelope
```

---

## 6. Domain Modules

| Module | Responsibility |
| :--- | :--- |
| **Auth** | Sign up, sign in, sign out, password reset, session cookies |
| **Users** | Profile, preferences, account settings, account deletion |
| **Destinations** | Catalog listing, filters, detail by slug |
| **Stays** | Catalog listing, filters, detail by slug |
| **Experiences** | Catalog listing, filters, detail by slug |
| **Search** | Unified query across destinations, stays, and experiences |
| **Saved** | Bookmark create, list, and delete |
| **Trips** | Trip CRUD and lifecycle status |
| **Itinerary** | Day items, reorder, notes, slot assignment |
| **Reviews** | Public read, authenticated write/edit/delete |
| **Notifications** | Trip reminders and itinerary alerts |

---

## 7. REST Response Envelope

Successful single resource:

```json
{
  "data": {},
  "meta": {
    "requestId": "req_01HXYZ"
  }
}
```

Successful list:

```json
{
  "data": [],
  "meta": {
    "requestId": "req_01HXYZ",
    "page": 1,
    "pageSize": 20,
    "total": 128
  }
}
```

Error:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Start date must be before end date.",
    "details": [{ "field": "endDate", "message": "Must be after startDate" }]
  },
  "meta": {
    "requestId": "req_01HXYZ"
  }
}
```

---

## 8. Pagination, Filtering & Sorting

* Discovery lists use page + pageSize (`page=1&pageSize=20`) with a hard maximum of 50.
* Search and catalog filters map to URL query params used by the frontend (`region`, `style`, `budgetTier`, `rating`, `sort`).
* Sort values are allowlisted (`popularity`, `name`, `rating`, `newest`). Unknown sort keys are rejected.
* Slug lookups return `404` with `NOT_FOUND` when unpublished or missing.

---

## 9. Caching Strategy

Redis is used for:
* Public destination/stay/experience detail payloads.
* Popular and featured catalog fragments used on Home.
* Rate-limit counters.
* Password-reset tokens (short TTL) if not stored only in PostgreSQL.
* Background job queues.

Rules:
* Cache keys include entity type + slug/id + content version.
* Writes to a destination, stay, or experience invalidate that key.
* User-private data (trips, saved items, notifications) is not cached in shared public keys.
* Cache misses fall back to PostgreSQL; cache outages must not fail public reads.

---

## 10. Background Workers

Workers handle non-blocking tasks:
* Approaching-trip reminder fan-out.
* Itinerary alert generation during active trip windows.
* Search index refresh after catalog seed/admin updates.
* Cache warming for featured homepage sections.

HTTP request handlers never wait for worker completion. Job failures retry with backoff and do not corrupt trip data.

---

## 11. Environment Configuration

```text
NODE_ENV=development
PORT=4000
DATABASE_URL=postgres://gowithus:gowithus@localhost:5432/gowithus
REDIS_URL=redis://localhost:6379
COOKIE_SECRET=
APP_ORIGIN=http://localhost:3000
API_BASE_URL=http://localhost:4000/api/v1
```

Secrets never use `NEXT_PUBLIC_` prefixes. Environment validation fails fast on boot if required variables are missing.

---

## 12. Logging & Health

* Structured JSON logs with `requestId`, method, path, status, and duration.
* `GET /health` returns process liveness.
* `GET /ready` verifies PostgreSQL and Redis connectivity.
* Passwords, session tokens, and reset tokens are never logged.

---

## 13. Error Mapping

| Condition | HTTP Status | Error Code |
| :--- | :---: | :--- |
| Invalid body or query | 400 | `VALIDATION_ERROR` |
| Missing session | 401 | `UNAUTHENTICATED` |
| Valid session, wrong owner | 403 | `FORBIDDEN` |
| Unknown slug or trip | 404 | `NOT_FOUND` |
| Duplicate email / unique conflict | 409 | `CONFLICT` |
| Rate limit exceeded | 429 | `RATE_LIMITED` |
| Unexpected failure | 500 | `INTERNAL_ERROR` |

---

## 14. Backend Quality Rules

1. Strict TypeScript; no `any`.
2. Controllers stay thin; business rules live in services.
3. Repositories accept typed query objects, not raw request bodies.
4. Migrations are additive and reversible where practical.
5. Seeds match frontend fixture shapes so local demos stay realistic.
6. Axios is not used on the frontend client; the API remains fetch-friendly JSON.

---

## 15. Architecture Boundaries

```text
[ Next.js lib/api/* ]
         │  fetch()
         ▼
[ Fastify Route + Schema ]
         │
         ▼
[ Domain Service ]
         │
    ┌────┴────┐
    ▼         ▼
PostgreSQL   Redis / Workers
```

Frontend components never call Fastify directly. All HTTP access goes through `lib/api`.

---

## 16. Anti-Patterns

* No payment, checkout, or GDS modules.
* No GraphQL requirement for MVP.
* No storing sessions in `localStorage`.
* No sharing Redis keys between public catalog and private trips.
* No mixing Motion/GSAP concerns into the API layer.

---

## 17. Related Documents

* `docs/API_SPECIFICATION.md` — endpoint contracts
* `docs/DATABASE.md` — relational schema
* `docs/AUTHENTICATION.md` — session and password flows
* `docs/SECURITY.md` — threat and hardening rules
* `docs/FRONTEND_ARCHITECTURE.md` — client data layer
