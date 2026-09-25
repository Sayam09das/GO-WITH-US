-- Step 15.4–15.5: provider linkage and sync metadata for catalog entities.

CREATE TYPE "ProviderSyncStatus" AS ENUM ('ACTIVE', 'STALE', 'FAILED');

ALTER TABLE "destinations"
  ADD COLUMN "city" TEXT,
  ADD COLUMN "latitude" DECIMAL(10, 7),
  ADD COLUMN "longitude" DECIMAL(10, 7),
  ADD COLUMN "provider" TEXT,
  ADD COLUMN "provider_place_id" TEXT,
  ADD COLUMN "provider_synced_at" TIMESTAMPTZ(6),
  ADD COLUMN "sync_status" "ProviderSyncStatus" DEFAULT 'ACTIVE';

ALTER TABLE "restaurants"
  ADD COLUMN "provider" TEXT,
  ADD COLUMN "provider_place_id" TEXT,
  ADD COLUMN "provider_synced_at" TIMESTAMPTZ(6);

ALTER TABLE "experiences"
  ADD COLUMN "latitude" DECIMAL(10, 7),
  ADD COLUMN "longitude" DECIMAL(10, 7),
  ADD COLUMN "provider" TEXT,
  ADD COLUMN "provider_place_id" TEXT,
  ADD COLUMN "provider_synced_at" TIMESTAMPTZ(6);

CREATE UNIQUE INDEX "destinations_provider_provider_place_id_key"
  ON "destinations" ("provider", "provider_place_id");

CREATE INDEX "destinations_provider_place_id_idx"
  ON "destinations" ("provider_place_id");

CREATE UNIQUE INDEX "restaurants_provider_provider_place_id_key"
  ON "restaurants" ("provider", "provider_place_id");

CREATE INDEX "restaurants_provider_place_id_idx"
  ON "restaurants" ("provider_place_id");

CREATE UNIQUE INDEX "experiences_provider_provider_place_id_key"
  ON "experiences" ("provider", "provider_place_id");

CREATE INDEX "experiences_provider_place_id_idx"
  ON "experiences" ("provider_place_id");

ALTER TABLE "stays"
  ADD COLUMN "latitude" DECIMAL(10, 7),
  ADD COLUMN "longitude" DECIMAL(10, 7),
  ADD COLUMN "provider" TEXT,
  ADD COLUMN "provider_property_id" TEXT,
  ADD COLUMN "provider_synced_at" TIMESTAMPTZ(6);

CREATE UNIQUE INDEX "stays_provider_provider_property_id_key"
  ON "stays" ("provider", "provider_property_id");

CREATE INDEX "stays_provider_property_id_idx"
  ON "stays" ("provider_property_id");
