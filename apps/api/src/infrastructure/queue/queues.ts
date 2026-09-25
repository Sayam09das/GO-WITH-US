import {
  type BookingJobPayload,
  type CleanupJobPayload,
  type EmailJobPayload,
  type NotificationJobPayload,
  QUEUE_NAMES,
} from "@gowithus/jobs";
import { Queue } from "bullmq";
import { logger } from "../logging/logger.js";
import { getQueueConnection } from "./connection.js";

const connection = getQueueConnection();

function createQueue<T>(name: string): Queue<T> | null {
  if (!connection) {
    return null;
  }

  return new Queue<T>(name, {
    connection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      removeOnComplete: 100,
      removeOnFail: 500,
    },
  });
}

export const emailQueue = createQueue<EmailJobPayload>(QUEUE_NAMES.email);
export const bookingQueue = createQueue<BookingJobPayload>(QUEUE_NAMES.booking);
export const notificationQueue = createQueue<NotificationJobPayload>(QUEUE_NAMES.notification);
export const cleanupQueue = createQueue<CleanupJobPayload>(QUEUE_NAMES.cleanup);

export async function enqueueJob<T>(
  queue: Queue<T> | null,
  jobName: string,
  data: T,
): Promise<boolean> {
  if (!queue) {
    logger.debug("queue.skipped", { jobName, reason: "redis_unavailable" });
    return false;
  }

  await queue.add(jobName as never, data as never);
  logger.info("queue.enqueued", { queue: queue.name, jobName });
  return true;
}

export async function closeQueues(): Promise<void> {
  const queues = [emailQueue, bookingQueue, notificationQueue, cleanupQueue].filter(
    (queue): queue is NonNullable<typeof emailQueue> => queue !== null,
  );

  await Promise.all(queues.map((queue) => queue.close()));
}
