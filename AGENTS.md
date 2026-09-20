# AGENTS.md

Guidance for coding agents working on **GO WITH US**.

---

## 1. What this product is

A premium travel **discovery and trip-planning** platform. Users browse destinations, stays, and experiences, save places, create trips, and build day-by-day itineraries.

It is **not** a booking engine, OTA, airline GDS, payment marketplace, or social network.

---

## 2. Spec precedence

When implementing, follow documents in this order:

1. `docs/PRODUCT.md` — non-negotiable product direction
2. `docs/FEATURES.md` and `docs/USER_FLOWS.md`
3. `docs/INFORMATION_ARCHITECTURE.md` and `docs/PAGE_SPECIFICATIONS.md`
4. `docs/DESIGN_SYSTEM.md`, `docs/UI_COMPONENT_SYSTEM.md`, `docs/ANIMATION_GUIDELINES.md`, `docs/CONTENT_GUIDELINES.md`
5. `docs/FRONTEND_ARCHITECTURE.md`
6. `docs/API_SPECIFICATION.md`, `docs/DATABASE.md`, `docs/BACKEND_ARCHITECTURE.md`
7. `docs/AUTHENTICATION.md`, `docs/SECURITY.md`
8. `docs/ROADMAP.md` — build order

If code and docs conflict, stop and align the code to the docs unless the user explicitly changes product direction.

---

## 3. Stack rules

* Frontend: Next.js App Router, TypeScript, Tailwind CSS.
* Backend: Node.js, TypeScript, Fastify.
* Database: PostgreSQL. Cache/jobs: Redis.
* HTTP client: native `fetch()` only. **Do not use Axios.**
* Global client state: URL params, local state, RSC. **Do not add Redux.**
* Auth: HTTP-only cookies. **Do not store session tokens in localStorage.**
* UI: shadcn/ui for base primitives, Lucide for icons, Magic UI / VengeanceUI only for their owned roles (see `docs/UI_COMPONENT_SYSTEM.md`).
* Animation: Motion for UI chrome, GSAP for editorial/hero timelines, Lenis for scrolling. **Do not animate the same node with two libraries.**

---

## 4. Implementation order

Follow `docs/ROADMAP.md`. Default sequence:

1. Design tokens and UI primitives
2. Navbar, mobile tab bar, footer
3. Homepage
4. Destinations, stays, experiences, search (fixtures)
5. Saved + account UI
6. Trips + itinerary workspace
7. Frontend polish
8. Fastify + Postgres + auth
9. Replace fixtures with REST

Do not start payments, maps, AI itineraries, or collaborative trips unless asked. Those are post-MVP.

---

## 5. Frontend conventions

* Server Components by default; `"use client"` only for interactivity.
* Pages compose sections; they do not inline `fetch()`.
* All API calls go through `lib/api/*`.
* Fixtures must match `types/*` and future API JSON (`camelCase`).
* Every data surface needs loading skeleton, empty, and error states.
* Use design tokens; avoid arbitrary Tailwind colors.
* Touch targets ≥ 44px; visible focus rings; `prefers-reduced-motion`.

---

## 6. Backend conventions

* Modular monolith: routes → controllers → services → repositories.
* Public GET for catalogs; session for saves, trips, review writes.
* Owner checks on every trip/itinerary/saved mutation.
* Envelope errors with `code` + `message`.
* Parameterized SQL only.

---

## 7. Copy and visual tone

Follow `docs/CONTENT_GUIDELINES.md` and `docs/DESIGN_SYSTEM.md`.

Sound warm, calm, and editorial. Never use fake scarcity (“ONLY 1 ROOM LEFT”). Never make the UI look like a dense booking marketplace.

---

## 8. Definition of done

A feature is done when it matches page specs, works on mobile and desktop, includes empty/error/loading states, and does not introduce booking-scope or AI dependencies.
