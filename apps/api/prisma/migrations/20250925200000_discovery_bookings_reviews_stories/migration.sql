-- Step 9–11: restaurants, experience fields, reviews, stories, bookings, payments

ALTER TYPE "ItemType" ADD VALUE IF NOT EXISTS 'restaurant';

CREATE TYPE "ReviewStatus" AS ENUM ('pending', 'published', 'hidden');
CREATE TYPE "ReviewReportReason" AS ENUM ('spam', 'inappropriate_content', 'harassment', 'false_information', 'other');
CREATE TYPE "StoryCategory" AS ENUM ('editorial', 'guides', 'journeys', 'tips', 'inspiration');
CREATE TYPE "StoryStatus" AS ENUM ('draft', 'published', 'archived');
CREATE TYPE "BookingType" AS ENUM ('stay', 'experience');
CREATE TYPE "BookingStatus" AS ENUM ('pending', 'confirmed', 'cancelled', 'completed', 'expired');
CREATE TYPE "PaymentStatus" AS ENUM ('unpaid', 'pending', 'paid', 'failed', 'refunded');
CREATE TYPE "PaymentProvider" AS ENUM ('stripe', 'manual');

ALTER TYPE "UserActivityType" ADD VALUE IF NOT EXISTS 'SAVED_EXPERIENCE';
ALTER TYPE "UserActivityType" ADD VALUE IF NOT EXISTS 'UNSAVED_EXPERIENCE';
ALTER TYPE "UserActivityType" ADD VALUE IF NOT EXISTS 'SAVED_RESTAURANT';
ALTER TYPE "UserActivityType" ADD VALUE IF NOT EXISTS 'UNSAVED_RESTAURANT';
ALTER TYPE "UserActivityType" ADD VALUE IF NOT EXISTS 'BOOKED_EXPERIENCE';

ALTER TABLE "experiences"
  ADD COLUMN IF NOT EXISTS "included" TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "requirements" TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "cancellation_policy" TEXT,
  ADD COLUMN IF NOT EXISTS "estimated_price_from" INTEGER;

ALTER TABLE "reviews"
  ADD COLUMN IF NOT EXISTS "title" TEXT,
  ADD COLUMN IF NOT EXISTS "status" "ReviewStatus" NOT NULL DEFAULT 'published';

CREATE INDEX IF NOT EXISTS "reviews_item_type_item_id_status_created_at_idx"
  ON "reviews"("item_type", "item_id", "status", "created_at" DESC);

CREATE TABLE IF NOT EXISTS "restaurants" (
  "id" UUID NOT NULL,
  "destination_id" UUID NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "cuisine" TEXT NOT NULL,
  "hero_image" TEXT NOT NULL,
  "gallery" TEXT[] NOT NULL,
  "overview" TEXT NOT NULL,
  "price_level" SMALLINT NOT NULL,
  "address" TEXT,
  "latitude" DECIMAL(10,7),
  "longitude" DECIMAL(10,7),
  "opening_hours" JSONB,
  "menu_highlights" TEXT[] NOT NULL,
  "amenities" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "rating_avg" DECIMAL(3,2),
  "review_count" INTEGER NOT NULL DEFAULT 0,
  "is_featured" BOOLEAN NOT NULL DEFAULT false,
  "is_published" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "restaurants_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "restaurants_slug_key" ON "restaurants"("slug");
CREATE INDEX IF NOT EXISTS "restaurants_destination_id_is_published_idx"
  ON "restaurants"("destination_id", "is_published");

CREATE TABLE IF NOT EXISTS "review_reports" (
  "id" UUID NOT NULL,
  "review_id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "reason" "ReviewReportReason" NOT NULL,
  "details" TEXT,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "review_reports_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "review_reports_review_id_user_id_key"
  ON "review_reports"("review_id", "user_id");

CREATE TABLE IF NOT EXISTS "stories" (
  "id" UUID NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "excerpt" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "category" "StoryCategory" NOT NULL,
  "cover_image" TEXT NOT NULL,
  "author_name" TEXT NOT NULL,
  "read_time_minutes" INTEGER NOT NULL,
  "is_featured" BOOLEAN NOT NULL DEFAULT false,
  "status" "StoryStatus" NOT NULL DEFAULT 'draft',
  "published_at" TIMESTAMPTZ(6),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "stories_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "stories_slug_key" ON "stories"("slug");

CREATE TABLE IF NOT EXISTS "bookings" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "booking_reference" TEXT NOT NULL,
  "type" "BookingType" NOT NULL,
  "status" "BookingStatus" NOT NULL DEFAULT 'pending',
  "payment_status" "PaymentStatus" NOT NULL DEFAULT 'unpaid',
  "start_date" DATE,
  "end_date" DATE,
  "guest_count" INTEGER NOT NULL DEFAULT 1,
  "total_amount" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "idempotency_key" TEXT,
  "cancellation_note" TEXT,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "bookings_booking_reference_key" ON "bookings"("booking_reference");
CREATE UNIQUE INDEX IF NOT EXISTS "bookings_idempotency_key_key" ON "bookings"("idempotency_key");
CREATE INDEX IF NOT EXISTS "bookings_user_id_status_start_date_idx"
  ON "bookings"("user_id", "status", "start_date");

CREATE TABLE IF NOT EXISTS "booking_items" (
  "id" UUID NOT NULL,
  "booking_id" UUID NOT NULL,
  "stay_id" UUID,
  "experience_id" UUID,
  "room_id" TEXT,
  "room_label" TEXT,
  "check_in" DATE,
  "check_out" DATE,
  "experience_date" DATE,
  "start_time" TIME(6),
  "guests" JSONB NOT NULL,
  "unit_price" INTEGER NOT NULL,
  "total_price" INTEGER NOT NULL,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "booking_items_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "booking_items_booking_id_idx" ON "booking_items"("booking_id");

CREATE TABLE IF NOT EXISTS "payments" (
  "id" UUID NOT NULL,
  "booking_id" UUID NOT NULL,
  "provider" "PaymentProvider" NOT NULL,
  "provider_payment_id" TEXT,
  "amount" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
  "idempotency_key" TEXT,
  "metadata" JSONB,
  "paid_at" TIMESTAMPTZ(6),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "payments_idempotency_key_key" ON "payments"("idempotency_key");
CREATE INDEX IF NOT EXISTS "payments_booking_id_status_idx" ON "payments"("booking_id", "status");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'restaurants_destination_id_fkey') THEN
    ALTER TABLE "restaurants"
      ADD CONSTRAINT "restaurants_destination_id_fkey"
      FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'review_reports_review_id_fkey') THEN
    ALTER TABLE "review_reports"
      ADD CONSTRAINT "review_reports_review_id_fkey"
      FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'review_reports_user_id_fkey') THEN
    ALTER TABLE "review_reports"
      ADD CONSTRAINT "review_reports_user_id_fkey"
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bookings_user_id_fkey') THEN
    ALTER TABLE "bookings"
      ADD CONSTRAINT "bookings_user_id_fkey"
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'booking_items_booking_id_fkey') THEN
    ALTER TABLE "booking_items"
      ADD CONSTRAINT "booking_items_booking_id_fkey"
      FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payments_booking_id_fkey') THEN
    ALTER TABLE "payments"
      ADD CONSTRAINT "payments_booking_id_fkey"
      FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
