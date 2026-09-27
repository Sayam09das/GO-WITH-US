# Docker — GO WITH US

## Development (monorepo root)

```bash
docker compose up -d --build
```

Services:

| Service | Port | Notes |
| :--- | :--- | :--- |
| `web` | 3000 | Next.js; proxies `/api/v1` to `api` |
| `api` | 4000 | Runs `prisma migrate deploy` on start |
| `worker` | — | BullMQ consumer |
| `postgres` | 5432 | Default user/db: `gowithus` |
| `redis` | 6379 | Cache + queues |

Environment: copy [`.env.example`](../.env.example) to `.env` and adjust.

Disable auto-migrate:

```bash
RUN_DB_MIGRATIONS=false docker compose up -d api
```

## Production example

Copy [`docker-compose.prod.example.yml`](../docker-compose.prod.example.yml) to `docker-compose.prod.yml`, set image names from GHCR (see deploy workflow summary), and provide a production `.env` with strong `SESSION_SECRET` and managed Postgres/Redis URLs.

Images are published on merge to `main` via [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml).
