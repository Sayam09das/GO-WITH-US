# GO WITH US

Premium travel discovery and trip-planning platform.

## Stack

| Layer | Technology |
| :--- | :--- |
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Backend | Node.js, Fastify, TypeScript |
| Data | PostgreSQL, Redis |
| Tooling | pnpm, Biome, Husky, GitHub Actions, Docker |

## Monorepo structure

```text
apps/web     Next.js frontend
apps/api     Fastify API
packages/*   Shared ui, types, utils, config
docs/        Product and architecture specifications
```

## Prerequisites

- Node.js 20+
- pnpm 9+
- Docker (optional, for local PostgreSQL and Redis)

## Setup

```bash
pnpm install
cp .env.example .env
docker compose up -d   # optional local infra
```

## Development

```bash
pnpm dev          # web (3000) + api (4000)
pnpm --filter @gowithus/web dev
pnpm --filter @gowithus/api dev
```

## Quality

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm check        # lint + typecheck
```

## Documentation

Product specs live in `docs/`. Start with `docs/PRODUCT.md` and `docs/ROADMAP.md`.

Agent guidance: `AGENTS.md`
