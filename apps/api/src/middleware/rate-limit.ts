import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { redis } from "../infrastructure/redis/redis.js";

function createRedisStore(prefix: string): RedisStore | undefined {
  const client = redis;
  if (!client) {
    return undefined;
  }

  return new RedisStore({
    sendCommand: (command: string, ...args: string[]) =>
      client.call(command, ...args) as Promise<number | string>,
    prefix: `rl:${prefix}:`,
  });
}

function rateLimitMessage(message: string) {
  return {
    error: {
      code: "RATE_LIMITED",
      message,
    },
  };
}

function createLimiter(input: {
  prefix: string;
  windowMs: number;
  limit: number;
  message: string;
  keyGenerator?: (req: import("express").Request) => string;
}) {
  const store = createRedisStore(input.prefix);

  return rateLimit({
    windowMs: input.windowMs,
    limit: input.limit,
    standardHeaders: true,
    legacyHeaders: false,
    message: rateLimitMessage(input.message),
    ...(input.keyGenerator ? { keyGenerator: input.keyGenerator } : {}),
    ...(store ? { store } : {}),
  });
}

export const authRateLimit = createLimiter({
  prefix: "auth",
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: "Too many attempts. Please try again later.",
});

export const loginRateLimit = createLimiter({
  prefix: "login",
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: "Too many login attempts. Please try again later.",
  keyGenerator: (req) => `${req.ip}:${String(req.body?.email ?? "").toLowerCase()}`,
});

export const searchRateLimit = createLimiter({
  prefix: "search",
  windowMs: 60 * 1000,
  limit: 60,
  message: "Too many search requests. Please slow down.",
});

export const catalogRateLimit = createLimiter({
  prefix: "catalog",
  windowMs: 60 * 1000,
  limit: 300,
  message: "Too many requests. Please slow down.",
});

export const bookingRateLimit = createLimiter({
  prefix: "booking",
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: "Too many booking attempts. Please try again later.",
});
