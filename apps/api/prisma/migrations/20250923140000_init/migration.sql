-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- Extensions
CREATE EXTENSION IF NOT EXISTS citext;

-- CreateEnum
CREATE TYPE "BudgetTier" AS ENUM ('budget', 'moderate', 'luxury');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('boutique-hotel', 'villa', 'apartment', 'eco-lodge', 'lodge');

-- CreateEnum
CREATE TYPE "ExperienceCategory" AS ENUM ('tours', 'outdoor', 'cultural', 'food-dining', 'attractions');

-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('destination', 'stay', 'experience');

-- CreateEnum
CREATE TYPE "ItineraryItemType" AS ENUM ('destination', 'stay', 'experience', 'custom');

-- CreateEnum
CREATE TYPE "TimeSlot" AS ENUM ('morning', 'afternoon', 'evening');

-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('draft', 'upcoming', 'active', 'completed');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('trip_reminder', 'itinerary_alert', 'system');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" CITEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "avatar_url" TEXT,
    "bio" TEXT,
    "home_city" TEXT,
    "travel_styles" TEXT[],
    "budget_preference" "BudgetTier",
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "destinations" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "hero_image" TEXT NOT NULL,
    "gallery" TEXT[],
    "overview" TEXT NOT NULL,
    "highlights" TEXT[],
    "climate_notes" TEXT,
    "currency" TEXT,
    "primary_language" TEXT,
    "transport_tips" TEXT,
    "budget_tier" "BudgetTier" NOT NULL,
    "best_time_to_visit" TEXT,
    "category_tags" TEXT[],
    "travel_styles" TEXT[],
    "rating_avg" DECIMAL(3,2),
    "review_count" INTEGER NOT NULL DEFAULT 0,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "destinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stays" (
    "id" UUID NOT NULL,
    "destination_id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "property_type" "PropertyType" NOT NULL,
    "location_label" TEXT NOT NULL,
    "hero_image" TEXT NOT NULL,
    "gallery" TEXT[],
    "overview" TEXT NOT NULL,
    "amenities" TEXT[],
    "price_tier" "BudgetTier" NOT NULL,
    "estimated_nightly_from" INTEGER,
    "rating_avg" DECIMAL(3,2),
    "review_count" INTEGER NOT NULL DEFAULT 0,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "stays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiences" (
    "id" UUID NOT NULL,
    "destination_id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "ExperienceCategory" NOT NULL,
    "duration_label" TEXT,
    "duration_minutes" INTEGER,
    "meeting_point" TEXT,
    "hero_image" TEXT NOT NULL,
    "gallery" TEXT[],
    "overview" TEXT NOT NULL,
    "highlights" TEXT[],
    "price_tier" "BudgetTier" NOT NULL,
    "rating_avg" DECIMAL(3,2),
    "review_count" INTEGER NOT NULL DEFAULT 0,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_items" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "item_type" "ItemType" NOT NULL,
    "item_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trips" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "destination_id" UUID,
    "start_date" DATE,
    "end_date" DATE,
    "description" TEXT,
    "cover_image" TEXT,
    "status" "TripStatus" NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itinerary_items" (
    "id" UUID NOT NULL,
    "trip_id" UUID NOT NULL,
    "day_index" INTEGER NOT NULL,
    "day_date" DATE,
    "time_slot" "TimeSlot" NOT NULL,
    "scheduled_time" TIME(6),
    "sort_order" INTEGER NOT NULL,
    "item_type" "ItineraryItemType" NOT NULL,
    "item_id" UUID,
    "title" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "itinerary_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "item_type" "ItemType" NOT NULL,
    "item_id" UUID NOT NULL,
    "rating" SMALLINT NOT NULL,
    "body" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "trip_id" UUID,
    "read_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "used_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "destinations_slug_key" ON "destinations"("slug");

-- CreateIndex
CREATE INDEX "destinations_is_published_is_featured_idx" ON "destinations"("is_published", "is_featured");

-- CreateIndex
CREATE UNIQUE INDEX "stays_slug_key" ON "stays"("slug");

-- CreateIndex
CREATE INDEX "stays_destination_id_is_published_idx" ON "stays"("destination_id", "is_published");

-- CreateIndex
CREATE UNIQUE INDEX "experiences_slug_key" ON "experiences"("slug");

-- CreateIndex
CREATE INDEX "experiences_destination_id_is_published_idx" ON "experiences"("destination_id", "is_published");

-- CreateIndex
CREATE INDEX "saved_items_user_id_created_at_idx" ON "saved_items"("user_id", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "saved_items_user_id_item_type_item_id_key" ON "saved_items"("user_id", "item_type", "item_id");

-- CreateIndex
CREATE INDEX "trips_user_id_status_start_date_idx" ON "trips"("user_id", "status", "start_date");

-- CreateIndex
CREATE INDEX "itinerary_items_trip_id_day_index_sort_order_idx" ON "itinerary_items"("trip_id", "day_index", "sort_order");

-- CreateIndex
CREATE INDEX "reviews_item_type_item_id_created_at_idx" ON "reviews"("item_type", "item_id", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "reviews_user_id_item_type_item_id_key" ON "reviews"("user_id", "item_type", "item_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_created_at_idx" ON "notifications"("user_id", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_hash_key" ON "password_reset_tokens"("token_hash");

-- AddForeignKey
ALTER TABLE "stays" ADD CONSTRAINT "stays_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_items" ADD CONSTRAINT "saved_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itinerary_items" ADD CONSTRAINT "itinerary_items_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
