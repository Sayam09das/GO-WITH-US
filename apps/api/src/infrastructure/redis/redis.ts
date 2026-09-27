import { Redis } from "ioredis";
import { env } from "../../config/env.js";
import { logger } from "../logging/logger.js";

const globalForRedis = globalThis as typeof globalThis & {
  redis?: Redis | null;
  redisAvailable?: boolean;
  redisAbandoned?: boolean;
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
    enableOfflineQueue: false,
    retryStrategy: () => null,
    reconnectOnError: () => false,
  });

  client.on("error", (error: Error) => {
    if (globalForRedis.redisAbandoned) {
      return;
    }
    globalForRedis.redisAvailable = false;
    logger.warn("redis.error", {
      message: error.message || "Redis connection error",
    });
  });

  client.on("connect", () => {
    globalForRedis.redisAvailable = true;
    globalForRedis.redisAbandoned = false;
    logger.info("redis.connected");
  });

  return client;
}

function abandonRedis(client: Redis, reason: string): void {
  globalForRedis.redisAbandoned = true;
  globalForRedis.redisAvailable = false;
  client.removeAllListeners();
  if (client.status !== "end") {
    client.disconnect(false);
  }
  logger.warn("redis.unavailable", { message: reason });
}

export const redis = globalForRedis.redis ?? createRedisClient();

if (env.nodeEnv !== "production") {
  globalForRedis.redis = redis;
}

export function isRedisConfigured(): boolean {
  return Boolean(env.redisUrl);
}

export function isRedisReady(): boolean {
  return Boolean(
    redis &&
      !globalForRedis.redisAbandoned &&
      redis.status === "ready" &&
      globalForRedis.redisAvailable !== false,
  );
}

export async function connectRedis(): Promise<boolean> {
  if (!redis || globalForRedis.redisAbandoned) {
    return false;
  }

  if (redis.status === "ready") {
    return true;
  }

  try {
    await redis.connect();
    globalForRedis.redisAvailable = true;
    globalForRedis.redisAbandoned = false;
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Redis connection error";
    abandonRedis(redis, message);
    return false;
  }
}

export async function pingRedis(timeoutMs = 2_000): Promise<boolean> {
  if (!redis || globalForRedis.redisAbandoned) {
    return false;
  }

  if (redis.status !== "ready") {
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
