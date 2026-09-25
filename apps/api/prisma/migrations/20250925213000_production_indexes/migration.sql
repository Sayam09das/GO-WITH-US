-- Production index review for frequently queried fields

CREATE INDEX IF NOT EXISTS "reviews_user_id_created_at_idx"
  ON "reviews" ("user_id", "created_at" DESC);

CREATE INDEX IF NOT EXISTS "bookings_user_id_idx"
  ON "bookings" ("user_id");

CREATE INDEX IF NOT EXISTS "booking_items_stay_id_check_in_check_out_idx"
  ON "booking_items" ("stay_id", "check_in", "check_out");

CREATE INDEX IF NOT EXISTS "booking_items_experience_id_experience_date_idx"
  ON "booking_items" ("experience_id", "experience_date");
