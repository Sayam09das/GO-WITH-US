import { Redis } from "ioredis";
import { env } from "../../config/env.js";
import { logger } from "../logging/logger.js";

const globalForRedis = globalThis as typeof globalThis & {
  redis?: Redis | null;
  redisAvailable?: boolean;
};

function createRedisClient(): Redis | null {
  if (!env.redisUrl) {
    logger.warn("redis.unconfigured", {
      message: "REDIS_URL is not set. Caching and queues are disabled.",
    });
    return null;
  }

  const client = new Redis(env.redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    lazyConnect: true,
    connectTimeout: 5_000,
    commandTimeout: 5_000,
  });

  client.on("error", (error: Error) => {
    globalForRedis.redisAvailable = false;
    logger.error("redis.error", { message: error.message });
  });

  client.on("connect", () => {
    globalForRedis.redisAvailable = true;
    logger.info("redis.connected");
  });

  return client;
}

export const redis = globalForRedis.redis ?? createRedisClient();

if (env.nodeEnv !== "production") {
  globalForRedis.redis = redis;
}

export function isRedisConfigured(): boolean {
  return Boolean(env.redisUrl);
}

export function isRedisReady(): boolean {
  return Boolean(redis && redis.status === "ready" && globalForRedis.redisAvailable !== false);
}

export async function connectRedis(): Promise<boolean> {
  if (!redis) {
    return false;
  }

  if (redis.status === "ready") {
    return true;
  }

  try {
    await redis.connect();
    globalForRedis.redisAvailable = true;
    return true;
  } catch (error) {
    globalForRedis.redisAvailable = false;
    logger.error("redis.connect_failed", {
      message: error instanceof Error ? error.message : "Unknown Redis connection error",
    });
    return false;
  }
}

export async function pingRedis(timeoutMs = 2_000): Promise<boolean> {
  if (!redis) {
    return false;
  }

  try {
    const response = await Promise.race([
      redis.ping(),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Redis ping timed out.")), timeoutMs);
      }),
    ]);
    return response === "PONG";
  } catch {
    return false;
  }
}

export async function disconnectRedis(): Promise<void> {
  if (!redis || redis.status === "end") {
    return;
  }

  await redis.quit();
}
