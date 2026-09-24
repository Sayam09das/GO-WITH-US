# GO WITH US — Database Design

This document defines the PostgreSQL data model for **GO WITH US**, covering entities, relationships, constraints, indexes, and lifecycle rules used by discovery, saved places, trips, itineraries, and reviews.

---

## 1. Purpose

PostgreSQL is the single transactional source of truth. Redis may cache public reads and queue jobs, but user accounts, catalogs, saved items, trips, and reviews always persist in PostgreSQL.

---

## 2. Design Principles

1. **UUIDs Internally, Slugs Publicly**: Tables use UUID primary keys. Public discovery URLs use unique kebab-case slugs.
2. **Owner Scoping**: Saved items, trips, itinerary items, and notifications always belong to a user.
3. **Catalog Independence**: Destinations, stays, and experiences are first-class rows, not JSON blobs.
4. **Polymorphic Saves & Reviews**: Saved items and reviews reference a type + target id rather than duplicating tables per entity.
5. **Itinerary Integrity**: Deleting a trip cascades itinerary items; deleting a destination does not silently destroy user trip history (items keep denormalized titles).
6. **No Marketplace Tables**: No bookings, inventory locks, payments, or airline PNRs.

---

## 3. Entity Relationship Overview

```text
users
  ├── saved_items ────────► destinations | stays | experiences
  ├── trips
  │     └── itinerary_items ──► destinations | stays | experiences | custom notes
  ├── reviews ────────────► destinations | stays | experiences
  └── notifications

destinations
  ├── stays (destination_id)
  ├── experiences (destination_id)
  └── reviews

stays ──────────────► reviews
experiences ────────► reviews
```

---

## 4. Enumerations

| Name | Values |
| :--- | :--- |
| `budget_tier` | `budget`, `moderate`, `luxury` |
| `travel_style` | `adventure`, `relaxation`, `cultural`, `luxury`, `budget-friendly`, `solo`, `couple`, `family`, `group` |
| `property_type` | `boutique-hotel`, `villa`, `apartment`, `eco-lodge`, `lodge` |
| `experience_category` | `tours`, `outdoor`, `cultural`, `food-dining`, `attractions` |
| `item_type` | `destination`, `stay`, `experience` |
| `itinerary_item_type` | `destination`, `stay`, `experience`, `custom` |
| `time_slot` | `morning`, `afternoon`, `evening` |
| `trip_status` | `draft`, `upcoming`, `active`, `completed` |
| `notification_type` | `trip_reminder`, `itinerary_alert`, `system` |

Trip status is derived from dates on read and can be stored as a generated/maintained column for filtering.

---

## 5. Core Tables

### 5.1 `users`

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID PK | |
| `email` | CITEXT UNIQUE NOT NULL | Canonical lowercase |
| `password_hash` | TEXT NOT NULL | argon2 or bcrypt |
| `full_name` | TEXT NOT NULL | |
| `avatar_url` | TEXT | Optional |
| `bio` | TEXT | Optional |
| `home_city` | TEXT | Optional |
| `travel_styles` | TEXT[] | Explicit preference tags |
| `budget_preference` | `budget_tier` | Optional |
| `created_at` | TIMESTAMPTZ NOT NULL | |
| `updated_at` | TIMESTAMPTZ NOT NULL | |

### 5.2 `destinations`

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID PK | |
| `slug` | TEXT UNIQUE NOT NULL | `kyoto-japan` |
| `title` | TEXT NOT NULL | |
| `country` | TEXT NOT NULL | |
| `region` | TEXT NOT NULL | |
| `hero_image` | TEXT NOT NULL | |
| `gallery` | TEXT[] | |
| `overview` | TEXT NOT NULL | |
| `highlights` | TEXT[] | |
| `climate_notes` | TEXT | |
| `currency` | TEXT | |
| `primary_language` | TEXT | |
| `transport_tips` | TEXT | |
| `budget_tier` | `budget_tier` NOT NULL | |
| `best_time_to_visit` | TEXT | |
| `category_tags` | TEXT[] | Coastal, Mountain, Historic, Urban, Tropical |
| `travel_styles` | TEXT[] | |
| `rating_avg` | NUMERIC(3,2) | Maintained from reviews |
| `review_count` | INTEGER DEFAULT 0 | |
| `is_featured` | BOOLEAN DEFAULT FALSE | |
| `is_published` | BOOLEAN DEFAULT TRUE | |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

### 5.3 `stays`

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID PK | |
| `destination_id` | UUID FK → destinations | |
| `slug` | TEXT UNIQUE NOT NULL | |
| `title` | TEXT NOT NULL | |
| `property_type` | `property_type` NOT NULL | |
| `location_label` | TEXT NOT NULL | City / neighborhood |
| `hero_image` | TEXT NOT NULL | |
| `gallery` | TEXT[] | |
| `overview` | TEXT NOT NULL | |
| `amenities` | TEXT[] | Wi-Fi, Pool, Breakfast, Parking, Air Conditioning |
| `price_tier` | `budget_tier` NOT NULL | |
| `estimated_nightly_from` | INTEGER | Optional guidance amount, not a live rate |
| `rating_avg` | NUMERIC(3,2) | |
| `review_count` | INTEGER DEFAULT 0 | |
| `is_featured` | BOOLEAN DEFAULT FALSE | |
| `is_published` | BOOLEAN DEFAULT TRUE | |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

### 5.4 `experiences`

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID PK | |
| `destination_id` | UUID FK → destinations | |
| `slug` | TEXT UNIQUE NOT NULL | |
| `title` | TEXT NOT NULL | |
| `category` | `experience_category` NOT NULL | |
| `duration_label` | TEXT | e.g. `3 Hours`, `Full Day` |
| `duration_minutes` | INTEGER | Optional numeric sort helper |
| `meeting_point` | TEXT | |
| `hero_image` | TEXT NOT NULL | |
| `gallery` | TEXT[] | |
| `overview` | TEXT NOT NULL | |
| `highlights` | TEXT[] | |
| `price_tier` | `budget_tier` NOT NULL | |
| `rating_avg` | NUMERIC(3,2) | |
| `review_count` | INTEGER DEFAULT 0 | |
| `is_featured` | BOOLEAN DEFAULT FALSE | |
| `is_published` | BOOLEAN DEFAULT TRUE | |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

---

## 6. Personalization Tables

### 6.1 `saved_items`

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID PK | |
| `user_id` | UUID FK → users ON DELETE CASCADE | |
| `item_type` | `item_type` NOT NULL | |
| `item_id` | UUID NOT NULL | Target catalog id |
| `created_at` | TIMESTAMPTZ NOT NULL | |

Unique constraint: `(user_id, item_type, item_id)`.

### 6.2 `trips`

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID PK | |
| `user_id` | UUID FK → users ON DELETE CASCADE | |
| `title` | TEXT NOT NULL | |
| `destination_id` | UUID FK → destinations | Nullable for drafts |
| `start_date` | DATE | Nullable for drafts |
| `end_date` | DATE | Nullable for drafts |
| `description` | TEXT | |
| `cover_image` | TEXT | Defaults from destination hero |
| `status` | `trip_status` NOT NULL DEFAULT `draft` | |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

Check: `end_date IS NULL OR start_date IS NULL OR end_date >= start_date`.

### 6.3 `itinerary_items`

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID PK | |
| `trip_id` | UUID FK → trips ON DELETE CASCADE | |
| `day_index` | INTEGER NOT NULL | 1-based day number |
| `day_date` | DATE | Copied from trip date range when known |
| `time_slot` | `time_slot` NOT NULL | |
| `scheduled_time` | TIME | Optional exact time |
| `sort_order` | INTEGER NOT NULL | Order within the day |
| `item_type` | `itinerary_item_type` NOT NULL | |
| `item_id` | UUID | Null for custom notes |
| `title` | TEXT NOT NULL | Denormalized snapshot |
| `notes` | TEXT | e.g. "Bring walking shoes" |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

Unique helper index: `(trip_id, day_index, sort_order)` is not unique forever during reorder transactions; services assign contiguous `sort_order` values after moves.

### 6.4 `reviews`

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID PK | |
| `user_id` | UUID FK → users ON DELETE CASCADE | |
| `item_type` | `item_type` NOT NULL | |
| `item_id` | UUID NOT NULL | |
| `rating` | SMALLINT NOT NULL | 1–5 |
| `body` | TEXT | Optional written review |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

Unique constraint: one review per user per target `(user_id, item_type, item_id)`.
Check: `rating BETWEEN 1 AND 5`.

### 6.5 `notifications`

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID PK | |
| `user_id` | UUID FK → users ON DELETE CASCADE | |
| `type` | `notification_type` NOT NULL | |
| `title` | TEXT NOT NULL | |
| `body` | TEXT NOT NULL | |
| `trip_id` | UUID FK → trips ON DELETE SET NULL | |
| `read_at` | TIMESTAMPTZ | |
| `created_at` | TIMESTAMPTZ | |

### 6.6 `password_reset_tokens`

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID PK | |
| `user_id` | UUID FK → users ON DELETE CASCADE | |
| `token_hash` | TEXT UNIQUE NOT NULL | Store hash, never raw token |
| `expires_at` | TIMESTAMPTZ NOT NULL | |
| `used_at` | TIMESTAMPTZ | |
| `created_at` | TIMESTAMPTZ | |

---

## 7. Trip Status Rules

```text
No dates                         ──► draft
start_date > today               ──► upcoming
start_date <= today <= end_date  ──► active
end_date < today                 ──► completed
```

A nightly worker or read-time derivation keeps `status` aligned. Dashboards filter on this column.

---

## 8. Indexes

* `destinations(slug)`, `stays(slug)`, `experiences(slug)` unique.
* `destinations(is_published, is_featured)`, `stays(destination_id, is_published)`, `experiences(destination_id, is_published)`.
* GIN indexes on `category_tags`, `travel_styles`, `amenities` as needed.
* Full-text indexes on title + overview for search (`tsvector` generated columns).
* `saved_items(user_id, created_at DESC)`.
* `trips(user_id, status, start_date)`.
* `itinerary_items(trip_id, day_index, sort_order)`.
* `reviews(item_type, item_id, created_at DESC)`.
* `notifications(user_id, created_at DESC)` partial where `read_at IS NULL`.

---

## 9. Integrity Rules

1. Public catalog queries include `is_published = true`.
2. Saved-item `item_id` must exist in the matching catalog table at write time.
3. Itinerary custom items require `title` and allow null `item_id`.
4. Review aggregates (`rating_avg`, `review_count`) update in the same transaction or via a deferred trigger.
5. Users can delete their account; personal rows cascade, catalog rows remain.
6. Soft-delete is not required for MVP; hard delete of trips is allowed after confirmation.

---

## 10. Seed Data

Seed scripts should populate realistic destinations, stays, experiences, and reviews matching `data/fixtures/*.ts` field names so the fixture-to-API cutover stays visual and typed.

---

## 11. Prisma Implementation (Step 3)

The live schema lives in `apps/api/prisma/schema.prisma`. It implements this document’s relational design using consolidated models rather than split tutorial tables.

### Implemented models

| Prisma model | SQL table | Covers |
| :--- | :--- | :--- |
| `User` | `users` | Identity + profile (`full_name`, `avatar_url`, `bio`, etc.) |
| `Destination` | `destinations` | Discovery catalog |
| `Stay` | `stays` | Accommodations |
| `Experience` | `experiences` | Activities |
| `Trip` | `trips` | User trips |
| `SavedItem` | `saved_items` | Saved destinations, stays, and experiences |
| `ItineraryItem` | `itinerary_items` | Trip days and scheduled items |
| `Review` | `reviews` | User reviews |
| `Notification` | `notifications` | User notifications |
| `PasswordResetToken` | `password_reset_tokens` | Auth password reset |

### Intentionally excluded from MVP

| Concept | Reason |
| :--- | :--- |
| `Booking` | Product is not a booking marketplace (`docs/PRODUCT.md`) |
| `Story` | Editorial/journal content uses fixtures until a CMS phase |
| Separate `Profile` table | Profile fields belong on `users` |
| Separate `TripDay` / `TripItem` tables | Replaced by `itinerary_items` with `day_index` |

See `docs/BACKEND_SETUP.md` for the full tutorial-name mapping and setup verification steps.

---

## 12. Related Documents

* `docs/BACKEND_ARCHITECTURE.md`
* `docs/API_SPECIFICATION.md`
* `docs/AUTHENTICATION.md`
* `docs/FEATURES.md`
