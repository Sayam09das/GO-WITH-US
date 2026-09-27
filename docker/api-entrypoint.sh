#!/bin/sh
set -e

if [ "${RUN_DB_MIGRATIONS:-true}" = "true" ]; then
  echo "Running database migrations…"
  pnpm --dir /app/apps/api db:migrate:deploy
fi

exec "$@"
