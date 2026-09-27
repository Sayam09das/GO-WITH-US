# GO WITH US

A premium travel discovery and planning platform built for modern travelers who want clarity, inspiration, and confidence at every stage of the journey.

GO WITH US is a destination-first travel product designed to simplify the planning experience without compromising elegance or utility. The platform helps users discover destinations, compare stays and experiences, save ideas, and transform inspiration into structured trip plans in a way that feels intentional, premium, and easy to use.

Built as a high-end travel product with a strong technical foundation, GO WITH US sits at the intersection of product design, user experience, and scalable engineering.

---

## Why it exists

Travel planning is often fragmented, noisy, and overwhelming. Most travelers move across multiple apps, booking portals, and planning notes before a trip ever takes shape.

GO WITH US solves that by creating a unified experience that blends:

- curated discovery
- personalized trip planning
- premium visual storytelling
- structured itinerary management
- a polished, modern product experience

The result is a platform that feels more like a luxury travel companion than a crowded marketplace.

---

## Product vision

GO WITH US is not a booking engine, OTA, airline marketplace, or payment platform. It is a discovery-driven travel planning product focused on inspiration, preparation, and organization.

The platform is intentionally designed around three core objectives:

1. Help users discover meaningful destinations and experiences
2. Make planning feel calm, organized, and enjoyable
3. Build a premium travel brand experience with strong UX and product clarity

This direction is formalized in:

- [docs/PRODUCT.md](docs/PRODUCT.md)
- [docs/FEATURES.md](docs/FEATURES.md)
- [docs/USER_FLOWS.md](docs/USER_FLOWS.md)
- [docs/INFORMATION_ARCHITECTURE.md](docs/INFORMATION_ARCHITECTURE.md)
- [docs/PAGE_SPECIFICATIONS.md](docs/PAGE_SPECIFICATIONS.md)

---

## Market and product positioning

GO WITH US occupies a differentiated space in the travel tech landscape:

- premium over transactional
- editorial over cluttered
- planning-first over booking-first
- lifestyle-driven over commoditized

This is a product with startup appeal: clear user value, scalable product logic, a strong brand story, and a foundation built for future feature expansion.

---

## Live product

| Surface | URL |
| :--- | :--- |
| Production web app | [https://go-with-us-web.vercel.app](https://go-with-us-web.vercel.app) |
| API | [https://go-with-us-5jyq.onrender.com](https://go-with-us-5jyq.onrender.com) |
| Health check | [https://go-with-us-5jyq.onrender.com/health/ready](https://go-with-us-5jyq.onrender.com/health/ready) |
| GitHub repository | [https://github.com/Sayam09das/GO-WITH-US](https://github.com/Sayam09das/GO-WITH-US) |

---

## Technical implementation

| Layer | Stack |
| :--- | :--- |
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS |
| API | Node.js 22, TypeScript, Fastify |
| Database | PostgreSQL, Prisma |
| Background jobs | Redis, worker processing |
| Tooling | pnpm, Biome, Husky, Docker, GitHub Actions |

The system is structured with clear boundaries between product experience, service logic, and infrastructure. Shared packages support maintainability, modular development, and long-term product scale without sacrificing performance or clarity.

---

## Architecture overview

```text
apps/
  web/        Product frontend and user experience
  api/        Service layer and API logic
  worker/     Background processing and async workflows
packages/    Shared utilities, UI, config, and types
docs/        Product, architecture, and deployment specs
docker/      Deployment and runtime entrypoints
.github/     CI/CD and automation workflows
```

Supporting files:

- [AGENTS.md](AGENTS.md)
- [CONTRIBUTING.md](CONTRIBUTING.md)
- [docs/ROADMAP.md](docs/ROADMAP.md)

---

## Getting started

### Prerequisites

- Node.js 22+
- pnpm 11
- Docker for PostgreSQL and Redis

### Install dependencies

```bash
pnpm install
```

### Configure environment variables

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
```

Example environment files:

- [.env.example](.env.example)
- [apps/api/.env.example](apps/api/.env.example)
- [apps/web/.env.example](apps/web/.env.example)

### Start infrastructure

```bash
docker compose up -d postgres redis
```

### Run the application

```bash
pnpm dev
```

Local endpoints:

- Web: http://localhost:3000
- API: http://localhost:4000/api/v1
- Health: http://localhost:4000/health/ready

Run services individually:

```bash
pnpm --filter @gowithus/web dev
pnpm --filter @gowithus/api dev
pnpm --filter @gowithus/worker dev
```

---

## Quality and delivery standards

Before launch, validate the project with:

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm check
```

Operational references:

- [docs/BACKEND_SETUP.md](docs/BACKEND_SETUP.md)
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- [docs/PRODUCTION_CHECKLIST.md](docs/PRODUCTION_CHECKLIST.md)

---

## Documentation

| Area | Reference |
| :--- | :--- |
| Product | [docs/PRODUCT.md](docs/PRODUCT.md) |
| Roadmap | [docs/ROADMAP.md](docs/ROADMAP.md) |
| Frontend architecture | [docs/FRONTEND_ARCHITECTURE.md](docs/FRONTEND_ARCHITECTURE.md) |
| Backend architecture | [docs/BACKEND_ARCHITECTURE.md](docs/BACKEND_ARCHITECTURE.md) |
| API specification | [docs/API_SPECIFICATION.md](docs/API_SPECIFICATION.md) |
| Deployment | [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) |
| Security | [docs/SECURITY.md](docs/SECURITY.md) |
| Authentication | [docs/AUTHENTICATION.md](docs/AUTHENTICATION.md) |

---

## Contribution and standards

This project is structured for high-quality execution, scalable iteration, and product integrity. Review [CONTRIBUTING.md](CONTRIBUTING.md) and [AGENTS.md](AGENTS.md) before making changes.

---

## Production and security notes

The repository is built with production readiness in mind, including secure session handling, environment isolation, and deployment-safe service integration.

Before production launch, review:

- [docs/PRODUCTION_CHECKLIST.md](docs/PRODUCTION_CHECKLIST.md)
- [docs/SECURITY.md](docs/SECURITY.md)
- [docs/AUTHENTICATION.md](docs/AUTHENTICATION.md)

---

## License

This project is proprietary and confidential. All rights are reserved by the copyright holder unless otherwise explicitly stated in writing.

No part of this repository may be reproduced, distributed, copied, modified, or used for any commercial or non-commercial purpose without prior written permission.

See [LICENSE](LICENSE) for the full legal terms.
