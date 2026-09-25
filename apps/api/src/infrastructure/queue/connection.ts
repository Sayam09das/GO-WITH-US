import type { ConnectionOptions } from "bullmq";
import { env } from "../../config/env.js";

export function getQueueConnection(): ConnectionOptions | undefined {
  if (!env.redisUrl) {
    return undefined;
  }

  return {
    url: env.redisUrl,
    maxRetriesPerRequest: null,
  };
}
