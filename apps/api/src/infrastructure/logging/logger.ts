import { env } from "../../config/env.js";

type LogLevel = "debug" | "info" | "warn" | "error";

type LogContext = Record<string, unknown>;

const SENSITIVE_KEYS = new Set([
  "password",
  "token",
  "cookie",
  "authorization",
  "session",
  "secret",
  "smtpPass",
  "paymentWebhookSecret",
]);

function sanitizeContext(context: LogContext): LogContext {
  const sanitized: LogContext = {};

  for (const [key, value] of Object.entries(context)) {
    const normalizedKey = key.toLowerCase();

    if (SENSITIVE_KEYS.has(normalizedKey) || normalizedKey.includes("password")) {
      sanitized[key] = "[redacted]";
      continue;
    }

    sanitized[key] = value;
  }

  return sanitized;
}

function writeLog(level: LogLevel, event: string, context: LogContext = {}): void {
  const payload = {
    level,
    event,
    service: "gowithus-api",
    timestamp: new Date().toISOString(),
    ...sanitizeContext(context),
  };

  const line = JSON.stringify(payload);

  if (level === "error") {
    console.error(line);
    return;
  }

  if (level === "warn") {
    console.warn(line);
    return;
  }

  if (level === "debug" && env.nodeEnv === "production") {
    return;
  }

  console.log(line);
}

export const logger = {
  debug(event: string, context?: LogContext): void {
    writeLog("debug", event, context);
  },
  info(event: string, context?: LogContext): void {
    writeLog("info", event, context);
  },
  warn(event: string, context?: LogContext): void {
    writeLog("warn", event, context);
  },
  error(event: string, context?: LogContext): void {
    writeLog("error", event, context);
  },
};
