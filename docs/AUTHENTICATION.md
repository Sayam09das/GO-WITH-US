# GO WITH US — Authentication

This document defines registration, session, password recovery, and authorization rules for **GO WITH US**.

---

## 1. Purpose

Authentication exists so travelers can persist saved places, trips, itineraries, reviews, and profile preferences. Public discovery stays open. Login is requested only when a persistent personal action begins.

---

## 2. Goals and Non-Goals

| In scope | Out of scope |
| :--- | :--- |
| Email + password sign up / sign in / sign out | OAuth social login (future) |
| HTTP-only secure session cookies | JWT in `localStorage` |
| Forgot / reset password | SMS OTP |
| Owner-only trip and saved-item access | Role-heavy admin CMS for MVP |
| Return-to-context after auth modal | Mandatory login wall on Home |

---

## 3. Session Model

```text
Sign In / Sign Up
        │
        ▼
Server creates session record (or signed cookie)
        │
        ▼
Set-Cookie: gowithus_session
  HttpOnly; Secure; SameSite=Lax; Path=/
        │
        ▼
Browser sends cookie on subsequent fetch(..., { credentials: "include" })
```

* Passwords are hashed with **argon2** (preferred) or bcrypt.
* Session lifetime: standard ~7 days; `rememberMe` may extend to ~30 days.
* Sign out clears the cookie and invalidates the server session.
* Access tokens are never stored in `localStorage` or URL query strings.

---

## 4. PublicUser vs Secrets

API responses may return `PublicUser` (`id`, `email`, `fullName`, `avatarUrl`, `bio`, `homeCity`, `travelStyles`, `budgetPreference`).
Responses never include `passwordHash`, session secrets, or reset tokens.

---

## 5. Sign Up

Required fields: full name, email, password, confirm password (client), terms acceptance (client).

Server rules:
* Email is unique and stored in a case-insensitive form.
* Password minimum 8 characters; reject common-only whitespace.
* On success, create the user, start a session, and return `201`.
* Duplicate email returns `409 CONFLICT`.

After sign up, redirect to the original intent (save, create trip, write review) or Home.

---

## 6. Sign In

* Generic failure copy: **"Invalid email or password"** — do not reveal which field failed.
* Rate-limit sign-in by IP and email to slow credential stuffing.
* Successful sign in restores the previous page context.

---

## 7. Auth Modal Rule

Unauthenticated users can browse destinations, stays, experiences, search, and reviews. Clicking Save, Add to Trip, Create Trip, or Write a Review opens a non-blocking authentication modal. After success, the original action completes without forcing the user to restart discovery.

---

## 8. Password Recovery

```text
/forgot-password
        │
        ▼
POST /api/v1/auth/forgot-password { email }
        │
        ▼
Always 202 (no email enumeration)
        │
        ▼
If account exists, email a single-use reset link
        │
        ▼
/reset-password?token=
        │
        ▼
POST /api/v1/auth/reset-password { token, password }
```

* Tokens are stored hashed, expire quickly (e.g. 1 hour), and are single-use.
* Reset invalidates other outstanding reset tokens for that user.

---

## 9. Account Security Settings

From `/account/settings`:
* Change password (requires current password).
* Sign out.
* Delete account with explicit confirmation (`DELETE` typed or equivalent double confirm).

Account deletion cascades saved items, trips, itinerary items, reviews authored by the user, and notifications. Catalog content remains.

---

## 10. Authorization Matrix

| Action | Guest | Authenticated owner | Other user |
| :--- | :---: | :---: | :---: |
| Browse catalogs & search | Yes | Yes | Yes |
| Read reviews | Yes | Yes | Yes |
| Save / unsave place | No | Yes | — |
| Create / edit / delete own trip | No | Yes | 403 |
| Read another user's trip | No | — | 403 / 404 |
| Edit itinerary | No | Yes | 403 |
| Write / edit own review | No | Yes | — |
| Edit another user's review | No | — | 403 |
| Patch profile / preferences | No | Yes | 403 |

Prefer `404 NOT_FOUND` over `403` when revealing that a trip ID exists would leak another user's plans.

---

## 11. Route Protection

| Frontend route | API requirement |
| :--- | :--- |
| `/sign-in`, `/sign-up`, `/forgot-password`, `/reset-password` | Public |
| `/`, `/destinations/*`, `/stays/*`, `/experiences/*`, `/search` | Public |
| `/saved`, `/trips/*`, `/account/*` | Session required; unauthenticated users redirect to sign-in with return URL |

Fastify auth hooks run on protected `/api/v1` routes. Public catalog handlers may optionally read a session to attach `isSaved`.

---

## 12. Cookie & CORS

* Production cookies: `Secure` + `HttpOnly` + `SameSite=Lax` (or `None` only if a true cross-site frontend/API split requires it, always with `Secure`).
* CORS allowlist is the frontend origin only (`APP_ORIGIN`).
* Credentials are required on the Next.js `apiFetch` client.

---

## 13. Password Rules

* Minimum 8 characters for MVP.
* Never log raw passwords or hashes in request logs.
* Timing-safe compare on password verification.

---

## 14. Related Documents

* `docs/API_SPECIFICATION.md`
* `docs/DATABASE.md`
* `docs/SECURITY.md`
* `docs/USER_FLOWS.md`
* `docs/INFORMATION_ARCHITECTURE.md`
