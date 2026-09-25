-- Trip days, itinerary extensions, and status updates for Step 8.

ALTER TYPE "ItineraryItemType" ADD VALUE IF NOT EXISTS 'restaurant';
ALTER TYPE "TripStatus" ADD VALUE IF NOT EXISTS 'cancelled';

ALTER TABLE "itinerary_items" ADD COLUMN IF NOT EXISTS "scheduled_end_time" TIME(6);

CREATE TABLE IF NOT EXISTS "trip_days" (
    "id" UUID NOT NULL,
    "trip_id" UUID NOT NULL,
    "day_index" INTEGER NOT NULL,
    "day_date" DATE,
    "title" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "trip_days_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "trip_days_trip_id_day_index_key" ON "trip_days"("trip_id", "day_index");
CREATE INDEX IF NOT EXISTS "trip_days_trip_id_day_index_idx" ON "trip_days"("trip_id", "day_index");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'trip_days_trip_id_fkey'
  ) THEN
    ALTER TABLE "trip_days"
      ADD CONSTRAINT "trip_days_trip_id_fkey"
      FOREIGN KEY ("trip_id") REFERENCES "trips"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
