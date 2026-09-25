import { QUEUE_NAMES } from "@gowithus/jobs";
import { Queue, Worker } from "bullmq";
import { env, getQueueConnection } from "./config/env.js";
import { logger } from "./infrastructure/logging/logger.js";
import { disconnectDatabase } from "./lib/db.js";
import { processBookingJob } from "./processors/booking.processor.js";
import { processEmailJob } from "./processors/email.processor.js";
import { processNotificationJob } from "./processors/notification.processor.js";

const connection = getQueueConnection();

if (!env.redisUrl) {
  logger.error("worker.redis_required", {
    message: "REDIS_URL must be configured for the worker.",
  });
  process.exit(1);
}

const workers = [
  new Worker(QUEUE_NAMES.email, processEmailJob, { connection }),
  new Worker(QUEUE_NAMES.booking, processBookingJob, { connection }),
  new Worker(QUEUE_NAMES.notification, processNotificationJob, { connection }),
  new Worker(QUEUE_NAMES.cleanup, processBookingJob, { connection }),
];

for (const worker of workers) {
  worker.on("failed", (job, error) => {
    logger.error("job.failed", {
      queue: worker.name,
      jobId: job?.id,
      message: error.message,
    });
  });

  worker.on("completed", (job) => {
    logger.info("job.completed", { queue: worker.name, jobId: job.id });
  });
}

async function scheduleRecurringJobs(): Promise<void> {
  const cleanupQueue = new Queue(QUEUE_NAMES.cleanup, { connection });

  await cleanupQueue.add(
    "cleanup-expired-bookings",
    { type: "cleanup-expired-bookings" },
    {
      repeat: { pattern: "0 * * * *" },
      jobId: "cleanup-expired-bookings-hourly",
    },
  );

  await cleanupQueue.close();
  logger.info("worker.schedules.registered");
}

async function shutdown(signal: string): Promise<void> {
  logger.info("worker.shutdown", { signal });
  await Promise.all(workers.map((worker) => worker.close()));
  await disconnectDatabase();
  process.exit(0);
}

void scheduleRecurringJobs().then(() => {
  logger.info("worker.started", { queues: Object.values(QUEUE_NAMES) });
});

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});
