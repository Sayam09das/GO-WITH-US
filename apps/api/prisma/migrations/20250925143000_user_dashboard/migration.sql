-- CreateEnum
CREATE TYPE "UserActivityType" AS ENUM ('SAVED_DESTINATION', 'UNSAVED_DESTINATION', 'SAVED_STAY', 'UNSAVED_STAY', 'CREATED_TRIP', 'COMPLETED_PROFILE', 'BOOKED_STAY');

-- AlterTable
ALTER TABLE "users" ADD COLUMN "phone" TEXT;
ALTER TABLE "users" ADD COLUMN "country" TEXT;
ALTER TABLE "users" ADD COLUMN "timezone" TEXT;

-- CreateTable
CREATE TABLE "user_activities" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "UserActivityType" NOT NULL,
    "title" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_activities_user_id_created_at_idx" ON "user_activities"("user_id", "created_at" DESC);

-- AddForeignKey
ALTER TABLE "user_activities" ADD CONSTRAINT "user_activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
