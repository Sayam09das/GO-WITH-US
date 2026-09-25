import type { EmailJobPayload } from "@gowithus/jobs";
import type { Job } from "bullmq";
import { logger } from "../infrastructure/logging/logger.js";
import {
  sendBookingConfirmationEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "../lib/mail.js";

export async function processEmailJob(job: Job<EmailJobPayload>): Promise<void> {
  logger.info("job.email.start", { jobId: job.id, type: job.data.type });

  switch (job.data.type) {
    case "verification":
      await sendVerificationEmail(job.data);
      break;
    case "password-reset":
      await sendPasswordResetEmail(job.data);
      break;
    case "booking-confirmation":
      await sendBookingConfirmationEmail(job.data);
      break;
    default:
      throw new Error(`Unsupported email job type: ${(job.data as EmailJobPayload).type}`);
  }

  logger.info("job.email.completed", { jobId: job.id, type: job.data.type });
}
