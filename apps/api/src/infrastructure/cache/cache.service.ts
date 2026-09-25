import { createHash } from "node:crypto";
import { logger } from "../logging/logger.js";
import { redis } from "../redis/redis.js";

export type CachedEnvelope<T> = {
  value: T;
  fetchedAt: string;
  expiresAt: string;
};

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

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
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

  async getCachedEntry<T>(key: string): Promise<CachedEnvelope<T> | null> {
    return this.get<CachedEnvelope<T>>(key);
  },

  async setCachedEntry<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    const fetchedAt = new Date();
    const envelope: CachedEnvelope<T> = {
      value,
      fetchedAt: fetchedAt.toISOString(),
      expiresAt: new Date(fetchedAt.getTime() + ttlSeconds * 1_000).toISOString(),
    };

    await this.set(key, envelope, ttlSeconds);
  },

  async getOrSetWithLock<T>(
    key: string,
    ttlSeconds: number,
    fetcher: () => Promise<T>,
  ): Promise<{ value: T; stale: boolean }> {
    const cached = await this.getCachedEntry<T>(key);
    if (cached && new Date(cached.expiresAt).getTime() > Date.now()) {
      return { value: cached.value, stale: false };
    }

    if (cached) {
      void this.refreshCachedEntry(key, ttlSeconds, fetcher).catch((error) => {
        logger.warn("cache.refresh_failed", {
          key,
          message: error instanceof Error ? error.message : "Unknown cache refresh error",
        });
      });
      return { value: cached.value, stale: true };
    }

    const lockKey = `${key}:lock`;
    if (redis) {
      const lock = await redis.set(lockKey, "1", "EX", 10, "NX");
      if (lock !== "OK") {
        await delay(150);
        const retry = await this.getCachedEntry<T>(key);
        if (retry) {
          return {
            value: retry.value,
            stale: new Date(retry.expiresAt).getTime() <= Date.now(),
          };
        }
      }
    }

    try {
      const value = await fetcher();
      await this.setCachedEntry(key, value, ttlSeconds);
      return { value, stale: false };
    } finally {
      if (redis) {
        await redis.del(lockKey).catch(() => undefined);
      }
    }
  },

  async refreshCachedEntry<T>(
    key: string,
    ttlSeconds: number,
    fetcher: () => Promise<T>,
  ): Promise<void> {
    const value = await fetcher();
    await this.setCachedEntry(key, value, ttlSeconds);
  },

  hashQuery(input: unknown): string {
    return createHash("sha256").update(JSON.stringify(input)).digest("hex").slice(0, 16);
  },
};
