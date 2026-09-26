import type { CleanupJobPayload } from "@gowithus/jobs";
import type { Job } from "bullmq";
import { logger } from "../infrastructure/logging/logger.js";
import { expirePendingBookings } from "../lib/db.js";

async function handleExpiredBookingCleanup(): Promise<void> {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const updatedCount = await expirePendingBookings(cutoff);
  logger.info("job.cleanup.expired_bookings", { updatedCount });
}

export async function processCleanupJob(job: Job<CleanupJobPayload>): Promise<void> {
  logger.info("job.cleanup.start", { jobId: job.id, type: job.data.type });

  if (job.data.type !== "cleanup-expired-bookings") {
    throw new Error(`Unsupported cleanup job type: ${job.data.type}`);
  }

  await handleExpiredBookingCleanup();

  logger.info("job.cleanup.completed", { jobId: job.id, type: job.data.type });
}
