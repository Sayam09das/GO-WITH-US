import type {
  BookingConfirmationEmailJob,
  BookingPostCreateJob,
  EmailJobPayload,
  NotificationJobPayload,
  PasswordResetEmailJob,
  VerificationEmailJob,
} from "@gowithus/jobs";
import { env } from "../../config/env.js";
import { sendPasswordResetEmail, sendVerificationEmail } from "../../lib/mail.js";
import { notificationsService } from "../../modules/notifications/notifications.service.js";
import { logger } from "../logging/logger.js";
import { bookingQueue, emailQueue, enqueueJob, notificationQueue } from "./queues.js";

async function deliverAuthEmail(
  send: () => Promise<void>,
  queue: typeof emailQueue,
  jobName: string,
  data: VerificationEmailJob | PasswordResetEmailJob,
): Promise<void> {
  if (env.isProduction) {
    const queued = await enqueueJob(queue, jobName, data);
    if (queued) {
      return;
    }
  }

  await send();
}

function scheduleAuthEmail(
  send: () => Promise<void>,
  queue: typeof emailQueue,
  jobName: string,
  data: VerificationEmailJob | PasswordResetEmailJob,
): void {
  void deliverAuthEmail(send, queue, jobName, data).catch((error) => {
    logger.error("mail.enqueue_failed", {
      jobName,
      to: "email" in data ? data.email : undefined,
      message: error instanceof Error ? error.message : String(error),
    });
  });
}

export function enqueueVerificationEmail(input: VerificationEmailJob): void {
  scheduleAuthEmail(() => sendVerificationEmail(input), emailQueue, input.type, input);
}

export function enqueuePasswordResetEmail(input: PasswordResetEmailJob): void {
  scheduleAuthEmail(() => sendPasswordResetEmail(input), emailQueue, input.type, input);
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
    try {
      await notificationsService.createFromJob(input);
    } catch (error) {
      logger.error("notification.sync_create_failed", {
        userId: input.userId,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

export type { EmailJobPayload };
