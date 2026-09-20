# GO WITH US — Project Structure

This document defines the intended repository layout for **GO WITH US** so frontend, API, docs, and infrastructure stay predictable as the product moves from fixtures to production.

---

## 1. Purpose

The repo is a small monorepo: a Next.js web app, a Fastify API, shared documentation, and Compose-based local infrastructure. Feature work should land in the matching app rather than mixing UI and SQL in one folder.

---

## 2. Target Tree

```text
GO WITH US/
├── apps/
│   ├── web/                          # Next.js App Router frontend
│   │   ├── app/                      # Routes (see FRONTEND_ARCHITECTURE.md)
│   │   ├── components/
│   │   ├── data/fixtures/
│   │   ├── lib/api/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── public/
│   └── api/                          # Node.js + Fastify REST API
│       ├── src/
│       ├── migrations/
│       ├── seeds/
│       └── tests/
├── docs/                             # Product & technical specifications
├── docker-compose.yml
├── .github/workflows/
├── README.md
├── AGENTS.md
└── CONTRIBUTING.md
```

Until apps are scaffolded, `docs/` remains the source of truth for this structure.

---

## 3. Web App Boundaries

Follow `docs/FRONTEND_ARCHITECTURE.md`:
* Routes live under `apps/web/app`.
* UI primitives in `components/ui`; domain cards in `components/[feature]`.
* Fixtures in `data/fixtures` implement `types/*`.
* HTTP belongs only in `lib/api`.

---

## 4. API App Boundaries

Follow `docs/BACKEND_ARCHITECTURE.md`:
* Domain modules under `apps/api/src/modules`.
* Plugins for CORS, cookies, auth, and errors.
* Migrations are the only schema source.

---

## 5. Documentation Map

### Product & UX
* `docs/PRODUCT.md`
* `docs/FEATURES.md`
* `docs/USER_FLOWS.md`
* `docs/INFORMATION_ARCHITECTURE.md`
* `docs/PAGE_SPECIFICATIONS.md`
* `docs/CONTENT_GUIDELINES.md`
* `docs/ROADMAP.md`

### Design & Frontend
* `docs/DESIGN_SYSTEM.md`
* `docs/FRONTEND_ARCHITECTURE.md`
* `docs/ANIMATION_GUIDELINES.md`

### Backend & Delivery
* `docs/BACKEND_ARCHITECTURE.md`
* `docs/DATABASE.md`
* `docs/API_SPECIFICATION.md`
* `docs/AUTHENTICATION.md`
* `docs/SECURITY.md`
* `docs/TESTING.md`
* `docs/DEPLOYMENT.md`
* `docs/PROJECT_STRUCTURE.md`

---

## 6. Path Alias & Naming

* Web imports use `@/` pointing at `apps/web`.
* Components are `PascalCase`; hooks are `useX`.
* API modules are lowercase domain names.
* Docs stay `SCREAMING_SNAKE.md` to match the existing set.

---

## 7. Related Documents

* `docs/FRONTEND_ARCHITECTURE.md`
* `docs/BACKEND_ARCHITECTURE.md`
* `docs/ROADMAP.md`
