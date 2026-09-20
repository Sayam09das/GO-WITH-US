# GO WITH US — System Architecture

This document defines the high-level system architecture, component relationships, data flow, security boundaries, and infrastructure strategy for the **GO WITH US** travel discovery and trip-planning platform.

---

## 1. Executive Summary

**GO WITH US** is a full-stack, discovery-first travel platform designed as a **modular monolith**. It decouples frontend user experience from backend domain logic while maintaining simple deployment and operational boundaries.

```text
                  ┌────────────────────────────────────────┐
                  │          Client / Browser              │
                  │   Next.js App Router (TypeScript)      │
                  └───────────────────┬────────────────────┘
                                      │
                                      ▼ (HTTPS / REST API)
                  ┌────────────────────────────────────────┐
                  │           Backend Service              │
                  │     Node.js + Fastify (TypeScript)     │
                  └─────────┬────────────────────┬─────────┘
                            │                    │
                            ▼                    ▼
                  ┌──────────────────┐  ┌──────────────────┐
                  │    PostgreSQL    │  │  Redis & Workers │
                  │ (Relational Data)│  │ (Cache / Queues) │
                  └──────────────────┘  └──────────────────┘
```

---

## 2. System Architecture Topology

### 1. Presentation Layer (Frontend App)
* **Framework**: Next.js App Router (React + TypeScript)
* **Styling & Motion**: Tailwind CSS + Motion + GSAP + Lenis
* **Data Fetching**: Native `fetch()` HTTP client targeting backend REST endpoints.
* **State Management**: URL parameters (`useSearchParams`), React Server Components (RSC), and localized component state.

### 2. Application Layer (Backend API Service)
* **Runtime**: Node.js
* **Framework**: Fastify (TypeScript)
* **Pattern**: Modular Monolith organized into `routes → controllers → services → repositories`.
* **API Protocol**: REST API delivering `camelCase` JSON envelopes.

### 3. Data & Storage Layer
* **Primary Database**: PostgreSQL (relational tables for destinations, stays, experiences, saved items, trips, itineraries, reviews, users).
* **Caching & Queue Layer**: Redis (session caching, expensive query result caches, rate limiting, async background worker queues).

### 4. Infrastructure & CI/CD Layer
* **Containerization**: Docker & Docker Compose.
* **CI/CD Pipeline**: GitHub Actions for automated linting, type-checking, testing, and container deployment.

---

## 3. High-Level System Architecture Diagram

```text
                                  GO WITH US SYSTEM
                                          │
       ┌──────────────────────────────────┴──────────────────────────────────┐
       ▼                                                                     ▼
[ Client Workspace ]                                                  [ Public Visitors ]
       │                                                                     │
       └──────────────────────────────────┬──────────────────────────────────┘
                                          │
                                          ▼
                         ┌─────────────────────────────────┐
                         │  Next.js App Router (Frontend)  │
                         │  - Server Components (RSC)      │
                         │  - Targeted Client Components   │
                         │  - Fixtures / REST API Layer    │
                         └────────────────┬────────────────┘
                                          │
                                          ▼ (REST API / JSON)
                         ┌─────────────────────────────────┐
                         │   Fastify Backend API Service   │
                         │  - Security & Rate Limiting     │
                         │  - Auth & Cookie Sessions       │
                         │  - Domain Controllers & Logic   │
                         └───────┬─────────────────┬───────┘
                                 │                 │
             ┌───────────────────┴──┐           ┌──┴───────────────────┐
             ▼                      ▼           ▼                      ▼
    ┌──────────────────┐   ┌─────────────────┐ ┌───────────────┐   ┌────────────────┐
    │  Users & Auth    │   │  Destinations,  │ │ Saved Places  │   │  Trips & Day   │
    │  Repository      │   │  Stays & Exp    │ │ Repository    │   │  Itineraries   │
    └────────┬─────────┘   └────────┬────────┘ └───────┬───────┘   └───────┬────────┘
             │                      │                  │                   │
             └──────────────────────┼──────────────────┴───────────────────┘
                                    │
                                    ▼
                         ┌─────────────────────────────────┐
                         │       PostgreSQL Database       │
                         │   (Parameterized SQL Queries)   │
                         └────────────────┬────────────────┘
                                          │
                                          ▼
                         ┌─────────────────────────────────┐
                         │      Redis & Job Workers        │
                         │   (Cache, Rate Limits, Queues)  │
                         └─────────────────────────────────┘
```

---

## 4. Layer Architecture & Responsibilities

### Presentation Layer (`apps/web`)
* Renders React Server Components by default for SEO-critical discovery routes (`/destinations`, `/stays`, `/experiences`).
* Encapsulates client interactivity inside localized `"use client"` components (search inputs, filter drawers, save buttons, itinerary day builders).
* Routes all API interactions through a dedicated data client wrapper (`lib/api/*`) using native `fetch()`.

### API Domain Layer (`apps/api`)
Organized as a modular monolith where each feature domain manages its own HTTP routing, business rules, and database persistence:

```text
apps/api/src/domains/
├── auth/          # Authentication & session verification
├── destinations/  # Destination catalog & detail lookup
├── stays/         # Stay discovery & amenity management
├── experiences/   # Activity discovery & specifications
├── saved/         # User saved bookmarks management
├── trips/         # Trip container creation & management
├── itineraries/   # Day-by-day itinerary slotting & reordering
├── reviews/       # Review submission & rating aggregation
└── users/         # User profiles & preferences
```

#### Layer Breakdown per Domain:
1. **Routes (`*.routes.ts`)**: Fastify plugin definitions setting up URL paths, HTTP verbs, and JSON schema validations.
2. **Controllers (`*.controller.ts`)**: Request handlers extracting inputs, invoking domain services, and returning structured API response envelopes.
3. **Services (`*.service.ts`)**: Pure business logic, permission checks, and transactional rules.
4. **Repositories (`*.repository.ts`)**: Data access layer executing parameterized SQL queries against PostgreSQL.

---

## 5. Security & Authorization Architecture

1. **Authentication**: HTTP-only, `SameSite=Lax`, secure session cookies. Session tokens are never exposed to client-side `localStorage`.
2. **Authorization & Ownership Verification**: Strict resource ownership checks enforced at the service layer for all mutation operations (saving items, updating trip dates, reordering itinerary slots, submitting reviews).
3. **Data Protection**: Parameterized SQL queries used universally to prevent SQL injection vulnerabilities.
4. **Input Sanitization**: User-generated content (review text, trip notes) is sanitized to block XSS attacks.
5. **CORS & Rate Limiting**: Fastify security plugins restrict API origins and throttle excessive requests per IP/session.

---

## 6. Data Architecture & Persistence

### PostgreSQL Relational Schema
* **Users Table**: `id`, `email`, `password_hash`, `full_name`, `avatar_url`, `created_at`.
* **Destinations Table**: `id`, `slug`, `title`, `country`, `region`, `hero_image`, `overview`, `budget_tier`, `rating`.
* **Stays Table**: `id`, `slug`, `destination_id`, `title`, `property_type`, `price_tier`, `rating`, `amenities_json`.
* **Experiences Table**: `id`, `slug`, `destination_id`, `title`, `category`, `duration_minutes`, `price_tier`, `rating`.
* **Saved Items Table**: `id`, `user_id`, `item_type` (`destination` | `stay` | `experience`), `item_id`, `created_at`.
* **Trips Table**: `id`, `user_id`, `title`, `destination_id`, `start_date`, `end_date`, `status` (`draft` | `upcoming` | `active` | `completed`).
* **Itinerary Items Table**: `id`, `trip_id`, `day_number`, `time_slot`, `item_type`, `item_id`, `custom_notes`, `display_order`.
* **Reviews Table**: `id`, `user_id`, `target_type`, `target_id`, `rating`, `review_text`, `created_at`.

---

## 7. Caching & Background Processing Strategy

Redis is utilized selectively for high-throughput, low-latency requirements:

* **Session Store**: Validating active user authentication sessions.
* **Catalog Caching**: Caching featured destination grids and landing page datasets to minimize SQL load.
* **Rate Limiting**: Tracking request counts across public search and authentication endpoints.
* **Async Workers**: Background worker queues handling asynchronous tasks (email dispatch, daily trip status state updates).

---

## 8. Non-Negotiable System Rules

1. **HTTP Client**: Use native `fetch()` only. **Do not use Axios.**
2. **State Management**: Use URL params, component local state, and RSC. **Do not add Redux.**
3. **Session Tokens**: Use HTTP-only cookies. **Do not store session tokens in localStorage.**
4. **Database Safety**: Parameterized SQL queries only; no raw unescaped string concatenation.
5. **Mutation Security**: Every trip, itinerary, or saved place mutation must execute explicit owner checks.
6. **Error Envelope**: All backend API errors must be wrapped in a standardized `{ code, message }` JSON envelope.
7. **Animation Separation**: Motion handles UI chrome/interactivity, GSAP handles scroll/hero timelines, Lenis handles scroll smoothing. Never animate the same DOM node with multiple libraries.

---

## 9. Architecture Document Map

| Document | Scope & Purpose |
| :--- | :--- |
| [`docs/PRODUCT.md`](file:///Users/sayamdas/Documents/Programming/Mern%20Stack/My%20Website/GO%20WITH%20US/docs/PRODUCT.md) | High-level product vision, mission, problem statement, non-negotiables. |
| [`docs/FEATURES.md`](file:///Users/sayamdas/Documents/Programming/Mern%20Stack/My%20Website/GO%20WITH%20US/docs/FEATURES.md) | Comprehensive feature matrix, MVP classification, non-goals. |
| [`docs/USER_FLOWS.md`](file:///Users/sayamdas/Documents/Programming/Mern%20Stack/My%20Website/GO%20WITH%20US/docs/USER_FLOWS.md) | Detailed user journeys, public vs authenticated action rules. |
| [`docs/INFORMATION_ARCHITECTURE.md`](file:///Users/sayamdas/Documents/Programming/Mern%20Stack/My%20Website/GO%20WITH%20US/docs/INFORMATION_ARCHITECTURE.md) | Route hierarchy, Next.js URLs, page relationships. |
| [`docs/DESIGN_SYSTEM.md`](file:///Users/sayamdas/Documents/Programming/Mern%20Stack/My%20Website/GO%20WITH%20US/docs/DESIGN_SYSTEM.md) | Visual design tokens, typography, color palette, card specs. |
| [`docs/FRONTEND_ARCHITECTURE.md`](file:///Users/sayamdas/Documents/Programming/Mern%20Stack/My%20Website/GO%20WITH%20US/docs/FRONTEND_ARCHITECTURE.md) | Next.js App Router patterns, RSC rules, fetch API client. |
| [`docs/PAGE_SPECIFICATIONS.md`](file:///Users/sayamdas/Documents/Programming/Mern%20Stack/My%20Website/GO%20WITH%20US/docs/PAGE_SPECIFICATIONS.md) | Page-by-page layout structure, sections, interactive specs. |
| [`docs/ANIMATION_GUIDELINES.md`](file:///Users/sayamdas/Documents/Programming/Mern%20Stack/My%20Website/GO%20WITH%20US/docs/ANIMATION_GUIDELINES.md) | Motion, GSAP, and Lenis responsibilities and timing rules. |
| [`docs/CONTENT_GUIDELINES.md`](file:///Users/sayamdas/Documents/Programming/Mern%20Stack/My%20Website/GO%20WITH%20US/docs/CONTENT_GUIDELINES.md) | Tone of voice, copywriting rules, metadata standards. |
| [`docs/ROADMAP.md`](file:///Users/sayamdas/Documents/Programming/Mern%20Stack/My%20Website/GO%20WITH%20US/docs/ROADMAP.md) | 20-phase implementation roadmap & sprint breakdown. |
| **`docs/ARCHITECTURE.md`** | **This document: System topology, modular monolith, database, security.** |
