# GO WITH US

**A premium travel discovery and trip-planning platform.**

GO WITH US helps travelers discover destinations, stays, and experiences, save what inspires them, and build day-by-day itineraries. It is not a hotel checkout clone, airline engine, or booking marketplace.

> Discover places. Save what inspires you. Build your trip. Go with us.

| | |
| :--- | :--- |
| **Frontend** | Next.js (App Router), TypeScript, Tailwind CSS |
| **Backend** | Node.js, TypeScript, Fastify |
| **Data** | PostgreSQL, Redis, background workers |
| **API** | REST `/api/v1` (native `fetch`, no Axios) |
| **Phase** | 0 — product & architecture specs |

---

## Product in one paragraph

Travel planning is scattered across social feeds, blogs, lodging sites, and spreadsheets. GO WITH US unifies visual discovery, saved places, trip containers, and itinerary assembly in one editorial, mobile-friendly workspace.

---

## Core journey

```text
Discover ──► Explore ──► Save ──► Plan ──► Organize ──► Travel ──► Remember
```

---

## MVP

* Destination, stay, and experience discovery
* Unified search and filters
* Save / favorite
* Trip creation and day-by-day itinerary builder
* Accounts, reviews, and ratings

Explicitly out of scope: GDS flights, hotel checkout, payments marketplace, social feeds, and required AI.

---

## Documentation

Start here:

| Doc | What it covers |
| :--- | :--- |
| [docs/PRODUCT.md](docs/PRODUCT.md) | Vision, users, MVP, non-negotiables |
| [docs/FEATURES.md](docs/FEATURES.md) | Feature matrix and quality rules |
| [docs/USER_FLOWS.md](docs/USER_FLOWS.md) | Interaction journeys |
| [docs/INFORMATION_ARCHITECTURE.md](docs/INFORMATION_ARCHITECTURE.md) | Routes and navigation |
| [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | Visual tokens and UI patterns |
| [docs/FRONTEND_ARCHITECTURE.md](docs/FRONTEND_ARCHITECTURE.md) | Next.js structure and data layer |
| [docs/PAGE_SPECIFICATIONS.md](docs/PAGE_SPECIFICATIONS.md) | Page-level UI specs |
| [docs/ANIMATION_GUIDELINES.md](docs/ANIMATION_GUIDELINES.md) | Motion, GSAP, Lenis ownership |
| [docs/CONTENT_GUIDELINES.md](docs/CONTENT_GUIDELINES.md) | Voice and copy |
| [docs/BACKEND_ARCHITECTURE.md](docs/BACKEND_ARCHITECTURE.md) | Fastify service design |
| [docs/DATABASE.md](docs/DATABASE.md) | PostgreSQL schema |
| [docs/API_SPECIFICATION.md](docs/API_SPECIFICATION.md) | REST contracts |
| [docs/AUTHENTICATION.md](docs/AUTHENTICATION.md) | Sessions and access rules |
| [docs/SECURITY.md](docs/SECURITY.md) | Hardening requirements |
| [docs/TESTING.md](docs/TESTING.md) | Vitest, Supertest, Playwright |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Docker, CI, production |
| [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) | Repository layout |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Phased delivery |

Implementation guidance for agents: [AGENTS.md](AGENTS.md). Contribution habits: [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Implementation sequence

Build the frontend against realistic fixtures first, then replace `lib/api` with Fastify. See `docs/ROADMAP.md`.

```text
Next.js UI ──► Fixtures ──► Fastify REST ──► PostgreSQL ──► Redis / workers
```

---

## Brand notes

* Accent: ocean teal (`#0D9488`)
* Surfaces: warm off-white, not a dense SaaS dashboard
* Motion is calm and owned per library (Motion vs GSAP vs Lenis)
