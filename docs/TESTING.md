# GO WITH US — Testing Strategy

This document defines how **GO WITH US** is tested across UI, API, and end-to-end journeys. Testing protects discovery quality, itinerary integrity, accessibility, and the fixture-to-API cutover.

---

## 1. Purpose

Tests should fail when core traveler workflows break—not when decorative copy shifts. Early phases run against fixture data. Later phases add Fastify and Playwright coverage against the real API.

---

## 2. Tooling

| Layer | Tool |
| :--- | :--- |
| Unit / component | Vitest + React Testing Library |
| API | Supertest against Fastify |
| End-to-end | Playwright |
| Types | TypeScript `strict` |

---

## 3. Testing Principles

1. **User journeys first**: Discover → Save → Create Trip → Build Itinerary.
2. **Fixtures for UI, database for API**: Component tests do not require a live Fastify process.
3. **No booking assertions**: Tests never expect checkout, payments, or GDS fields.
4. **Accessibility is tested**: Keyboard focus, labels, and empty/error states are first-class.
5. **Deterministic data**: Seeds and fixtures use stable slugs (`kyoto-japan`), not random titles.

---

## 4. Frontend Tests

Cover:
* UI primitives (`Button`, `Input`, `Badge`, `Dialog`, `Skeleton`).
* Domain cards (destination, stay, experience, trip).
* Save toggle optimistic UI.
* Search URL param encoding (`q`, `category`, `budget`).
* Empty, loading, and error states listed in `docs/FEATURES.md`.
* Auth modal appearing on Save / Create Trip for guests.

Do not require real network in component tests. Mock `lib/api/*` or import fixtures.

---

## 5. API Tests

Cover:
* Public catalog filters and slug 404s.
* Sign up, sign in, generic invalid-credential message.
* Session required on `/saved` and `/trips`.
* Owner-only trip GET/PATCH/DELETE (second user receives 403/404).
* Itinerary create, reorder, move day, delete.
* One review per user per item (`409` on duplicate).
* Password reset token expiry.

Each API test boots Fastify against a disposable PostgreSQL schema or transaction rollback.

---

## 6. End-to-End Flows

From the product roadmap:

### Flow 1 — Discover → View → Save
1. Open Home.
2. Open a destination from discovery.
3. Save the destination (sign in if needed).
4. Confirm it appears on `/saved`.

### Flow 2 — Create Trip → Assign Days → Build Itinerary
1. Create a trip with title, destination, and dates.
2. Open `/trips/[tripId]/itinerary`.
3. Add a stay or experience to Day 1 morning.
4. Reorder or add notes.
5. Reload and confirm persistence.

Additional E2E (recommended):
* Search filters survive reload via URL params.
* Guest can browse without auth and is prompted only on Save.
* Completed trips appear read-only in `/account/history`.

---

## 7. Accessibility Checks

* Interactive controls are reachable by keyboard.
* Icon-only save buttons expose `aria-label`.
* Forms associate labels and show inline errors.
* Reduced-motion paths do not hang the test runner.

---

## 8. What Not to Test in MVP

* Pixel-perfect photography crops.
* Third-party Mapbox (Phase 2).
* AI itinerary generators (out of scope).
* Payment or booking sandbox flows (non-goals).

---

## 9. Definition of Done (Quality)

A feature is not done until it has:
* Loading, empty, and error UI where data is fetched.
* Component or API coverage for the happy path plus one failure path.
* E2E coverage if it is Flow 1 or Flow 2.

---

## 10. Related Documents

* `docs/ROADMAP.md`
* `docs/USER_FLOWS.md`
* `docs/FEATURES.md`
* `docs/FRONTEND_ARCHITECTURE.md`
* `docs/API_SPECIFICATION.md`
