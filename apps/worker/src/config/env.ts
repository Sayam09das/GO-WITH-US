import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

const currentDir = dirname(fileURLToPath(import.meta.url));
const workerRoot = resolve(currentDir, "../..");
const monorepoRoot = resolve(workerRoot, "../..");
const apiRoot = resolve(monorepoRoot, "apps/api");

config({ path: resolve(monorepoRoot, ".env") });
config({ path: resolve(apiRoot, ".env") });

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  databaseUrl:
    process.env.DATABASE_URL ??
    "postgresql://gowithus:gowithus@localhost:5432/gowithus?schema=public",
  redisUrl: process.env.REDIS_URL ?? "redis://localhost:6379",
  appUrl: process.env.APP_URL ?? "http://localhost:3000",
  apiUrl: process.env.API_URL ?? "http://localhost:4000",
  smtpHost: process.env.SMTP_HOST ?? "",
  smtpPort: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
  smtpUser: process.env.SMTP_USER ?? "",
  smtpPass: process.env.SMTP_PASS ?? "",
  mailFrom: process.env.MAIL_FROM ?? "GoWithUs <noreply@localhost>",
} as const;

export function getQueueConnection() {
  return {
    url: env.redisUrl,
    maxRetriesPerRequest: null,
  };
}
