import type { BookingJobPayload } from "@gowithus/jobs";
import type { Job } from "bullmq";
import { logger } from "../infrastructure/logging/logger.js";
import { createNotification, expirePendingBookings, findUserContact } from "../lib/db.js";
import { sendBookingConfirmationEmail } from "../lib/mail.js";

async function handlePostCreate(
  job: Extract<BookingJobPayload, { type: "post-create" }>,
): Promise<void> {
  const user = await findUserContact(job.userId);

  if (!user) {
    logger.warn("job.booking.user_missing", { userId: job.userId, bookingId: job.bookingId });
    return;
  }

  await sendBookingConfirmationEmail({
    email: user.email,
    fullName: user.fullName,
    bookingReference: job.bookingReference,
  });

  await createNotification({
    userId: job.userId,
    type: "system",
    title: "Booking received",
    body: `Your booking ${job.bookingReference} was created successfully.`,
  });

  logger.info("job.booking.post_create_completed", {
    bookingId: job.bookingId,
    bookingReference: job.bookingReference,
    userId: job.userId,
  });
}

async function handleExpiredBookingCleanup(): Promise<void> {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const updatedCount = await expirePendingBookings(cutoff);
  logger.info("job.cleanup.expired_bookings", { updatedCount });
}

async function handleReviewModeration(reviewId: string): Promise<void> {
  logger.info("job.review.moderation_stub", { reviewId });
}

export async function processBookingJob(job: Job<BookingJobPayload>): Promise<void> {
  logger.info("job.booking.start", { jobId: job.id, type: job.data.type });

  switch (job.data.type) {
    case "post-create":
      await handlePostCreate(job.data);
      break;
    case "cleanup-expired-bookings":
      await handleExpiredBookingCleanup();
      break;
    case "moderate-review":
      await handleReviewModeration(job.data.reviewId);
      break;
    case "warm-cache":
      logger.info("job.cache.warm_stub", { target: job.data.target });
      break;
    default:
      throw new Error(`Unsupported booking job type: ${(job.data as BookingJobPayload).type}`);
  }

  logger.info("job.booking.completed", { jobId: job.id, type: job.data.type });
}
