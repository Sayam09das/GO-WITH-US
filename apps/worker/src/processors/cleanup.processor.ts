import type { CleanupJobPayload } from "@gowithus/jobs";
import type { Job } from "bullmq";
import { logger } from "../infrastructure/logging/logger.js";
import { expirePendingBookings } from "../lib/db.js";

async function handleExpiredBookingCleanup(): Promise<void> {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const updatedCount = await expirePendingBookings(cutoff);
  logger.info("job.cleanup.expired_bookings", { updatedCount });
}

async function handleDestinationSync(job: DestinationSyncJob): Promise<void> {
  logger.info("job.destination.sync_stub", {
    provider: job.provider,
    providerPlaceId: job.providerPlaceId,
    message: "Destination sync worker stub — run sync via API service in production worker wiring.",
  });
}

type DestinationSyncJob = Extract<CleanupJobPayload, { type: "sync-destination" }>;

export async function processCleanupJob(job: Job<CleanupJobPayload>): Promise<void> {
  logger.info("job.cleanup.start", { jobId: job.id, type: job.data.type });

  switch (job.data.type) {
    case "cleanup-expired-bookings":
      await handleExpiredBookingCleanup();
      break;
    case "sync-destination":
      await handleDestinationSync(job.data);
      break;
    default:
      throw new Error(`Unsupported cleanup job type: ${(job.data as CleanupJobPayload).type}`);
  }

  logger.info("job.cleanup.completed", { jobId: job.id, type: job.data.type });
}
