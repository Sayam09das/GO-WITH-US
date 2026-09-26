-- CreateEnum
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

ALTER TYPE "ItemType" ADD VALUE IF NOT EXISTS 'place';
ALTER TYPE "ItineraryItemType" ADD VALUE IF NOT EXISTS 'place';

-- CreateTable
CREATE TABLE "places" (
  "id" UUID NOT NULL,
  "destination_id" UUID NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "category" "PlaceCategory" NOT NULL,
  "location_label" TEXT,
  "hero_image" TEXT NOT NULL,
  "gallery" TEXT[],
  "overview" TEXT NOT NULL,
  "category_tags" TEXT[],
  "latitude" DECIMAL(10,7),
  "longitude" DECIMAL(10,7),
  "rating_avg" DECIMAL(3,2),
  "review_count" INTEGER NOT NULL DEFAULT 0,
  "is_featured" BOOLEAN NOT NULL DEFAULT false,
  "is_published" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,

  CONSTRAINT "places_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "places_slug_key" ON "places"("slug");

-- CreateIndex
CREATE INDEX "places_destination_id_is_published_idx" ON "places"("destination_id", "is_published");

-- AddForeignKey
ALTER TABLE "places" ADD CONSTRAINT "places_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
