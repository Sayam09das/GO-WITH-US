-- Adds optional JSON preferences for profile personalization fields.
ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "profile_preferences" JSONB;
