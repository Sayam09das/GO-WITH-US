-- Idempotent repair for databases that predate provider/places migrations.
-- Safe to run multiple times. Use: pnpm --filter @gowithus/api exec prisma db execute --file prisma/scripts/repair-catalog-columns.sql

DO $$
BEGIN
  CREATE TYPE "ProviderSyncStatus" AS ENUM ('ACTIVE', 'STALE', 'FAILED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "PlaceCategory" AS ENUM (
    'museum',
    'beach',
    'park',
    'market',
    'viewpoint',
    'temple',
    'historic-site',
    'neighborhood',
    'gallery',
    'natural-attraction'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TYPE "ItemType" ADD VALUE IF NOT EXISTS 'place';
ALTER TYPE "ItineraryItemType" ADD VALUE IF NOT EXISTS 'place';

ALTER TABLE "destinations" ADD COLUMN IF NOT EXISTS "city" TEXT;
ALTER TABLE "destinations" ADD COLUMN IF NOT EXISTS "latitude" DECIMAL(10, 7);
ALTER TABLE "destinations" ADD COLUMN IF NOT EXISTS "longitude" DECIMAL(10, 7);
ALTER TABLE "destinations" ADD COLUMN IF NOT EXISTS "provider" TEXT;
ALTER TABLE "destinations" ADD COLUMN IF NOT EXISTS "provider_place_id" TEXT;
ALTER TABLE "destinations" ADD COLUMN IF NOT EXISTS "provider_synced_at" TIMESTAMPTZ(6);
ALTER TABLE "destinations" ADD COLUMN IF NOT EXISTS "sync_status" "ProviderSyncStatus" DEFAULT 'ACTIVE';

ALTER TABLE "experiences" ADD COLUMN IF NOT EXISTS "latitude" DECIMAL(10, 7);
ALTER TABLE "experiences" ADD COLUMN IF NOT EXISTS "longitude" DECIMAL(10, 7);
ALTER TABLE "experiences" ADD COLUMN IF NOT EXISTS "provider" TEXT;
ALTER TABLE "experiences" ADD COLUMN IF NOT EXISTS "provider_place_id" TEXT;
ALTER TABLE "experiences" ADD COLUMN IF NOT EXISTS "provider_synced_at" TIMESTAMPTZ(6);

ALTER TABLE "restaurants" ADD COLUMN IF NOT EXISTS "provider" TEXT;
ALTER TABLE "restaurants" ADD COLUMN IF NOT EXISTS "provider_place_id" TEXT;
ALTER TABLE "restaurants" ADD COLUMN IF NOT EXISTS "provider_synced_at" TIMESTAMPTZ(6);

ALTER TABLE "stays" ADD COLUMN IF NOT EXISTS "latitude" DECIMAL(10, 7);
ALTER TABLE "stays" ADD COLUMN IF NOT EXISTS "longitude" DECIMAL(10, 7);
ALTER TABLE "stays" ADD COLUMN IF NOT EXISTS "provider" TEXT;
ALTER TABLE "stays" ADD COLUMN IF NOT EXISTS "provider_property_id" TEXT;
ALTER TABLE "stays" ADD COLUMN IF NOT EXISTS "provider_synced_at" TIMESTAMPTZ(6);

CREATE UNIQUE INDEX IF NOT EXISTS "destinations_provider_provider_place_id_key"
  ON "destinations" ("provider", "provider_place_id");

CREATE INDEX IF NOT EXISTS "destinations_provider_place_id_idx"
  ON "destinations" ("provider_place_id");

CREATE TABLE IF NOT EXISTS "places" (
  "id" UUID NOT NULL,
  "destination_id" UUID NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "category" "PlaceCategory" NOT NULL,
  "location_label" TEXT,
  "hero_image" TEXT NOT NULL,
  "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "overview" TEXT NOT NULL,
  "category_tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "latitude" DECIMAL(10, 7),
  "longitude" DECIMAL(10, 7),
  "rating_avg" DECIMAL(3, 2),
  "review_count" INTEGER NOT NULL DEFAULT 0,
  "is_featured" BOOLEAN NOT NULL DEFAULT false,
  "is_published" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "places_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "places_slug_key" ON "places"("slug");
CREATE INDEX IF NOT EXISTS "places_destination_id_is_published_idx"
  ON "places"("destination_id", "is_published");

DO $$
BEGIN
  ALTER TABLE "places"
    ADD CONSTRAINT "places_destination_id_fkey"
    FOREIGN KEY ("destination_id") REFERENCES "destinations"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
