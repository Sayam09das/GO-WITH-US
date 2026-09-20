# GO WITH US — API Specification

This document is the REST contract for **GO WITH US**. Frontend clients in `lib/api/*.ts` and Fastify routes must implement these endpoints, payloads, and error shapes so fixture data can be replaced without UI rewrites.

---

## 1. Purpose

The API powers public discovery plus authenticated saving, trip planning, reviews, and notifications. It does not expose booking checkout, payments, or airline inventory.

---

## 2. Base URL & Conventions

* **Base path**: `/api/v1`
* **Local origin**: `http://localhost:4000`
* **Content-Type**: `application/json`
* **JSON keys**: `camelCase`
* **Timestamps**: ISO 8601 UTC
* **IDs**: UUID strings
* **Public slugs**: kebab-case
* **Auth**: HTTP-only session cookie (`gowithus_session`) sent with `credentials: "include"`
* **Client**: native `fetch()` only (Axios is prohibited)

---

## 3. Shared Query Parameters

| Param | Used By | Notes |
| :--- | :--- | :--- |
| `page` | Lists | Default `1` |
| `pageSize` | Lists | Default `20`, max `50` |
| `q` | Search & catalogs | Trimmed, max 120 chars |
| `region` | Destinations | |
| `country` | Destinations | |
| `style` | Destinations / search | Travel style |
| `category` | Destinations / experiences / search | |
| `budgetTier` | Catalogs / search | `budget` \| `moderate` \| `luxury` |
| `propertyType` | Stays | |
| `amenities` | Stays | Comma-separated |
| `duration` | Experiences | `day-trip` \| `2-3-days` \| `1-week` or duration label |
| `rating` | Catalogs / search | Minimum `3`, `4`, or `4.5` |
| `sort` | Catalogs | Allowlisted per resource |
| `status` | Trips | `draft` \| `upcoming` \| `active` \| `completed` |
| `type` | Saved | `destination` \| `stay` \| `experience` |

---

## 4. Authentication Endpoints

### `POST /api/v1/auth/sign-up`
Body: `{ "fullName", "email", "password" }`
Response `201`: `{ "data": { "user": PublicUser } }` + session cookie.

### `POST /api/v1/auth/sign-in`
Body: `{ "email", "password", "rememberMe?": boolean }`
Response `200`: `{ "data": { "user": PublicUser } }` + session cookie.
Invalid credentials return `401` with a generic message: `"Invalid email or password"`.

### `POST /api/v1/auth/sign-out`
Auth required. Clears cookie. Response `204`.

### `GET /api/v1/auth/me`
Auth required. Response `200`: `{ "data": { "user": PublicUser } }`.

### `POST /api/v1/auth/forgot-password`
Body: `{ "email" }`
Always returns `202` to avoid email enumeration.

### `POST /api/v1/auth/reset-password`
Body: `{ "token", "password" }`
Response `204`. Invalid or expired token returns `400`.

---

## 5. User Account Endpoints

All routes require authentication.

### `GET /api/v1/account/profile`
### `PATCH /api/v1/account/profile`
Body may include `fullName`, `avatarUrl`, `bio`, `homeCity`. Email is read-only.

### `GET /api/v1/account/preferences`
### `PATCH /api/v1/account/preferences`
Body: `{ "travelStyles": string[], "budgetPreference": "budget" | "moderate" | "luxury" }`

### `GET /api/v1/account/history`
Returns completed trips with read-only itinerary summaries.

### `POST /api/v1/account/password`
Body: `{ "currentPassword", "newPassword" }`

### `DELETE /api/v1/account`
Body: `{ "confirm": "DELETE" }` — permanently deletes the user and personal data.

---

## 6. Destination Endpoints

### `GET /api/v1/destinations`
Public. Filters: `q`, `region`, `country`, `style`, `category`, `budgetTier`, `rating`, `sort` (`popularity` \| `name` \| `newest` \| `rating`).
Featured/popular homepage fragments may use `featured=true` or `sort=popularity`.

### `GET /api/v1/destinations/:slug`
Public detail including highlights, travel info, recommended stay IDs/cards, featured experiences, related destinations, aggregate rating, and `isSaved` when a session exists.

---

## 7. Stay Endpoints

### `GET /api/v1/stays`
Public. Filters: `q`, `destination`, `propertyType`, `budgetTier`, `amenities`, `rating`, `sort` (`recommended` \| `rating` \| `price`).

### `GET /api/v1/stays/:slug`
Public detail including gallery, amenities, location label, price tier, reviews summary, and `isSaved`.

---

## 8. Experience Endpoints

### `GET /api/v1/experiences`
Public. Filters: `q`, `destination`, `category`, `duration`, `budgetTier`, `rating`, `sort` (`popularity` \| `duration` \| `rating`).

### `GET /api/v1/experiences/:slug`
Public detail including duration, meeting point, highlights, price tier, reviews summary, and `isSaved`.

---

## 9. Search

### `GET /api/v1/search?q=`
Public. Optional `type=destination|stay|experience`, plus shared facet filters.
Response groups results:

```json
{
  "data": {
    "destinations": [],
    "stays": [],
    "experiences": []
  },
  "meta": {
    "query": "paris",
    "totals": { "destinations": 4, "stays": 6, "experiences": 4 }
  }
}
```

Empty `q` may return trending suggestions rather than a full catalog dump.

---

## 10. Saved Items

Auth required.

### `GET /api/v1/saved`
Query `type` optional. Returns hydrated cards with `itemType`, `item`, and `savedAt`.

### `POST /api/v1/saved`
Body: `{ "itemType": "destination" | "stay" | "experience", "itemId": "uuid" }`
Response `201`. Duplicate save returns the existing row (`200`) rather than erroring.

### `DELETE /api/v1/saved/:id`
Owner only. Response `204`.

Clients may alternatively call `DELETE /api/v1/saved?itemType=&itemId=` for unsave-from-card flows.

---

## 11. Trips

Auth required. All trip routes are owner-scoped.

### `GET /api/v1/trips`
Query `status` optional. Each card includes title, destination, dates, status, cover image, and itinerary item count.

### `POST /api/v1/trips`
Body: `{ "title", "destinationId?", "startDate?", "endDate?", "description?" }`
Response `201` with the created trip. Missing dates keep status `draft`.

### `GET /api/v1/trips/:id`
Trip overview plus summary stats (`totalDays`, `plannedItemCount`).

### `PATCH /api/v1/trips/:id`
Updates metadata. Recalculates status from dates.

### `DELETE /api/v1/trips/:id`
Cascades itinerary items. Response `204`.

---

## 12. Itinerary

Auth required. Owner only.

### `GET /api/v1/trips/:id/itinerary`
Returns days grouped with morning/afternoon/evening items:

```json
{
  "data": {
    "tripId": "uuid",
    "days": [
      {
        "dayIndex": 1,
        "date": "2027-10-12",
        "items": [
          {
            "id": "uuid",
            "timeSlot": "morning",
            "scheduledTime": "09:00",
            "sortOrder": 0,
            "itemType": "experience",
            "itemId": "uuid",
            "title": "Tsukiji Outer Market Experience",
            "notes": "Bring walking shoes"
          }
        ]
      }
    ]
  }
}
```

### `POST /api/v1/trips/:id/itinerary/items`
Body: `{ "dayIndex", "timeSlot", "scheduledTime?", "itemType", "itemId?", "title?", "notes?", "sortOrder?" }`
Custom items require `title` and `itemType: "custom"`.

### `PATCH /api/v1/trips/:id/itinerary/items/:itemId`
Update time, notes, day, slot, or `sortOrder`. Used for reorder and move-between-days.

### `DELETE /api/v1/trips/:id/itinerary/items/:itemId`
Response `204`.

### `POST /api/v1/trips/:id/itinerary/reorder`
Body: `{ "dayIndex", "orderedItemIds": ["uuid"] }` — atomic reorder within a day.

---

## 13. Reviews

### `GET /api/v1/reviews?itemType=&itemId=`
Public paginated list plus aggregate `{ "average", "count" }`.

### `POST /api/v1/reviews`
Auth required. Body: `{ "itemType", "itemId", "rating", "body?" }`
One review per user per item. Duplicate returns `409`.

### `PATCH /api/v1/reviews/:id`
Owner only.

### `DELETE /api/v1/reviews/:id`
Owner only.

---

## 14. Notifications

Auth required.

### `GET /api/v1/notifications`
Newest first. Includes unread count in `meta`.

### `POST /api/v1/notifications/:id/read`
Marks a single notification read.

### `POST /api/v1/notifications/read-all`
Marks all current user notifications read.

---

## 15. Resource Shapes

### PublicUser
```json
{
  "id": "uuid",
  "email": "traveler@example.com",
  "fullName": "Alex Rivera",
  "avatarUrl": null,
  "bio": null,
  "homeCity": "Lisbon",
  "travelStyles": ["cultural", "culinary"],
  "budgetPreference": "moderate"
}
```

### DestinationCard
Matches frontend `Destination` fields: `id`, `slug`, `title`, `country`, `region`, `heroImage`, `overview`, `highlights`, `budgetTier`, `bestTimeToVisit`, `rating`, `reviewCount`, `isSaved`.

Stay and experience cards follow the same fixture-compatible fields defined in `docs/FRONTEND_ARCHITECTURE.md`.

---

## 16. Status Codes

| Status | When |
| :---: | :--- |
| 200 | Successful read or idempotent save |
| 201 | Resource created |
| 202 | Password reset email accepted |
| 204 | Successful empty body |
| 400 | Validation failure |
| 401 | Missing or invalid session |
| 403 | Authenticated but not the owner |
| 404 | Unknown slug, trip, or item |
| 409 | Unique conflict (email, review) |
| 429 | Rate limited |
| 500 | Unexpected server error |

---

## 17. Frontend Mapping

| Client module | Endpoints |
| :--- | :--- |
| `lib/api/destinations.ts` | `GET /destinations`, `GET /destinations/:slug` |
| `lib/api/stays.ts` | `GET /stays`, `GET /stays/:slug` |
| `lib/api/experiences.ts` | `GET /experiences`, `GET /experiences/:slug` |
| `lib/api/saved.ts` | `GET/POST/DELETE /saved` |
| `lib/api/trips.ts` | Trips + itinerary routes |
| `lib/api/client.ts` | Shared `apiFetch` wrapper |

UI components must not call these URLs inline.

---

## 18. Out of Scope

* Checkout, payments, or reservation locking
* WebSocket live inventory
* GraphQL
* Public user-to-user messaging
* Collaborative trip invites (Phase 2)

---

## 19. Related Documents

* `docs/BACKEND_ARCHITECTURE.md`
* `docs/DATABASE.md`
* `docs/AUTHENTICATION.md`
* `docs/USER_FLOWS.md`
* `docs/FRONTEND_ARCHITECTURE.md`
