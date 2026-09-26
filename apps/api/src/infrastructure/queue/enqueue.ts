import type {
  BookingConfirmationEmailJob,
  BookingPostCreateJob,
  EmailJobPayload,
  NotificationJobPayload,
  PasswordResetEmailJob,
  VerificationEmailJob,
} from "@gowithus/jobs";
import { sendPasswordResetEmail, sendVerificationEmail } from "../../lib/mail.js";
import { logger } from "../logging/logger.js";
import { bookingQueue, emailQueue, enqueueJob, notificationQueue } from "./queues.js";

export async function enqueueVerificationEmail(input: VerificationEmailJob): Promise<void> {
  const queued = await enqueueJob(emailQueue, input.type, input);
  if (!queued) {
    await sendVerificationEmail(input);
  }
}

export async function enqueuePasswordResetEmail(input: PasswordResetEmailJob): Promise<void> {
  const queued = await enqueueJob(emailQueue, input.type, input);
  if (!queued) {
    await sendPasswordResetEmail(input);
  }
}

export async function enqueueBookingConfirmationEmail(
  input: BookingConfirmationEmailJob,
): Promise<void> {
  await enqueueJob(emailQueue, input.type, input);
}

export async function enqueueBookingPostCreate(input: BookingPostCreateJob): Promise<void> {
  await enqueueJob(bookingQueue, input.type, input);
}

export async function enqueueNotification(input: NotificationJobPayload): Promise<void> {
  const queued = await enqueueJob(notificationQueue, input.type, input);
  if (!queued) {
    logger.debug("notification.skipped", { userId: input.userId, reason: "redis_unavailable" });
  }
}

export type { EmailJobPayload };
