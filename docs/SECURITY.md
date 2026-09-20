# GO WITH US — Security

This document states security requirements for **GO WITH US**. The product stores user accounts, saved places, and private trip itineraries. It does not process payments or custody booking inventory in the MVP.

---

## 1. Purpose

Security is a product requirement, not a launch afterthought. These rules protect traveler accounts and itineraries while keeping public discovery fast and open.

---

## 2. Security Objectives

| Objective | Meaning |
| :--- | :--- |
| Confidentiality | Password hashes, sessions, trips, and saved lists stay private |
| Integrity | Catalog and itinerary data change only through authorized APIs |
| Availability | Rate limits and health checks reduce trivial abuse |
| Privacy | Travel preferences are not sold to ad networks |

---

## 3. Threat Model (Summary)

Primary assets:
* User credentials and sessions
* Private trips and itinerary notes
* Saved places
* Review integrity

Primary threats:
* Credential stuffing and password reuse
* Session theft via XSS
* IDOR on `/trips/:id` and saved items
* XSS through review or trip note HTML
* Catalog scraping / search abuse
* Email enumeration on password reset

Out of MVP threat scope:
* Payment card skimming (no payments)
* Airline GDS fraud (no tickets)

---

## 4. Authentication & Session Controls

* Hash passwords with argon2 or bcrypt.
* Store sessions in HTTP-only secure cookies, never `localStorage`.
* Generic login errors.
* Password reset tokens hashed, short-lived, single-use.
* Sign-in and password-reset endpoints are rate limited.

Details live in `docs/AUTHENTICATION.md`.

---

## 5. Authorization

* Every trip, itinerary item, saved item, notification, and profile mutation verifies `user_id === session.userId`.
* Do not trust client-supplied user IDs as ownership proof.
* Prefer not to leak existence of another user's trip IDs.

---

## 6. Input Validation

* Validate all bodies and query params with schemas at the Fastify boundary.
* Allowlist enums (`budgetTier`, `timeSlot`, `itemType`, `sort`).
* Bound string lengths (titles, notes, review body, search `q`).
* Reject unknown fields where practical.
* Never concatenate user `q` into unescaped SQL or regular expressions.
* Parameterize all PostgreSQL queries.

---

## 7. User-Generated Content

Reviews, trip notes, bios, and custom itinerary titles are untrusted:
* Store as text, not raw HTML.
* Escape on render to prevent XSS.
* Enforce length limits and basic profanity/spam rate limits for reviews.
* Users may edit or delete only their own reviews.

---

## 8. Rate Limiting

| Surface | Guidance |
| :--- | :--- |
| `POST /auth/sign-in` | Strict per IP + email |
| `POST /auth/forgot-password` | Strict per IP |
| `POST /reviews` | Moderate per user |
| `GET /search` | Per IP to protect database |
| Global API | Baseline per IP |

Return `429 RATE_LIMITED` with a clear retry message. Redis holds counters.

---

## 9. CORS, Headers & Transport

* TLS in production.
* CORS allowlist = frontend origin.
* Security headers on API and web: `Content-Security-Policy` (web), `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Frame-Options` / `CSP frame-ancestors`.
* No wildcard `Access-Control-Allow-Origin` with credentials.

---

## 10. Secrets

* Secrets live in environment variables, never in the client bundle.
* `NEXT_PUBLIC_*` variables are public; never put `COOKIE_SECRET` or `DATABASE_URL` there.
* Rotate session signing secrets without committing them to git.

---

## 11. Data Protection

* Encrypt data in transit (HTTPS).
* Restrict production database network access to the API service.
* Account export/delete on demand (`DELETE /api/v1/account`).
* Do not log emails alongside raw tokens; redact secrets in structured logs.

---

## 12. Dependency & Delivery Hygiene

* Lockfile committed; audit dependencies in CI.
* Docker images run as a non-root user.
* Health endpoints do not expose stack traces or versions beyond what is needed.

---

## 13. Security Checklist (Pre-Release)

- [ ] Passwords hashed; no plaintext credential storage
- [ ] Session cookie HttpOnly + Secure
- [ ] Trip and saved-item IDOR tests pass
- [ ] Review/note XSS escaped in UI
- [ ] Auth and search rate limits enabled
- [ ] CORS origin allowlist configured
- [ ] Secrets absent from frontend env and git
- [ ] Account deletion cascades personal data
- [ ] Error responses do not leak SQL or stack traces to clients

---

## 14. Related Documents

* `docs/AUTHENTICATION.md`
* `docs/BACKEND_ARCHITECTURE.md`
* `docs/API_SPECIFICATION.md`
* `docs/PRODUCT.md`
