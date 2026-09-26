DO $$
BEGIN
  CREATE TYPE "TravelDocumentCategory" AS ENUM (
    'bookings',
    'flights',
    'stays',
    'experiences',
    'invoices',
    'other'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "user_travel_documents" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "trip_id" UUID,
  "name" TEXT NOT NULL,
  "category" "TravelDocumentCategory" NOT NULL DEFAULT 'other',
  "storage_path" TEXT NOT NULL,
  "public_url" TEXT NOT NULL,
  "mime_type" TEXT NOT NULL,
  "size_bytes" INTEGER NOT NULL,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "user_travel_documents_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "user_travel_documents_user_id_created_at_idx"
  ON "user_travel_documents" ("user_id", "created_at" DESC);

CREATE INDEX IF NOT EXISTS "user_travel_documents_user_id_category_idx"
  ON "user_travel_documents" ("user_id", "category");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_travel_documents_user_id_fkey'
  ) THEN
    ALTER TABLE "user_travel_documents"
      ADD CONSTRAINT "user_travel_documents_user_id_fkey"
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_travel_documents_trip_id_fkey'
  ) THEN
    ALTER TABLE "user_travel_documents"
      ADD CONSTRAINT "user_travel_documents_trip_id_fkey"
      FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
