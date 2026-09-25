import { createHash } from "node:crypto";
import { logger } from "../logging/logger.js";
import { redis } from "../redis/redis.js";

function serializeValue<T>(value: T): string {
  return JSON.stringify(value);
}

function deserializeValue<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export const cacheService = {
  async get<T>(key: string): Promise<T | null> {
    if (!redis) {
      return null;
    }

    try {
      const value = await redis.get(key);
      if (!value) {
        return null;
      }

      return deserializeValue<T>(value);
    } catch (error) {
      logger.warn("cache.get_failed", {
        key,
        message: error instanceof Error ? error.message : "Unknown cache read error",
      });
      return null;
    }
  },

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    if (!redis) {
      return;
    }

    try {
      await redis.set(key, serializeValue(value), "EX", ttlSeconds);
    } catch (error) {
      logger.warn("cache.set_failed", {
        key,
        message: error instanceof Error ? error.message : "Unknown cache write error",
      });
    }
  },

  async del(keys: string | string[]): Promise<void> {
    if (!redis) {
      return;
    }

    const keyList = Array.isArray(keys) ? keys : [keys];
    if (keyList.length === 0) {
      return;
    }

    try {
      await redis.del(...keyList);
    } catch (error) {
      logger.warn("cache.del_failed", {
        keys: keyList,
        message: error instanceof Error ? error.message : "Unknown cache delete error",
      });
    }
  },

  async getOrSet<T>(key: string, ttlSeconds: number, fetcher: () => Promise<T>): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await fetcher();
    await this.set(key, value, ttlSeconds);
    return value;
  },

  hashQuery(input: unknown): string {
    return createHash("sha256").update(JSON.stringify(input)).digest("hex").slice(0, 16);
  },
};
