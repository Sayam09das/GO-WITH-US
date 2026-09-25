import type { NotificationJobPayload } from "@gowithus/jobs";
import type { Job } from "bullmq";
import { logger } from "../infrastructure/logging/logger.js";
import { createNotification } from "../lib/db.js";

export async function processNotificationJob(job: Job<NotificationJobPayload>): Promise<void> {
  logger.info("job.notification.start", { jobId: job.id, userId: job.data.userId });

  await createNotification({
    userId: job.data.userId,
    type: job.data.notificationType,
    title: job.data.title,
    body: job.data.body,
  });

  logger.info("job.notification.completed", { jobId: job.id, userId: job.data.userId });
}
