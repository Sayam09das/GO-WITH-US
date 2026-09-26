import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

const currentDir = dirname(fileURLToPath(import.meta.url));
const apiRoot = resolve(currentDir, "../..");
const monorepoRoot = resolve(apiRoot, "..");

config({ path: resolve(monorepoRoot, ".env") });
config({ path: resolve(apiRoot, ".env") });

function parsePort(value: string | undefined, fallback: number): number {
  const port = Number(value ?? fallback);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid PORT value: ${value ?? fallback}`);
  }

  return port;
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value ?? fallback);

  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`Invalid integer value: ${value ?? fallback}`);
  }

  return parsed;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: parsePort(process.env.PORT, 4000),
  host: process.env.HOST ?? "0.0.0.0",
  appOrigin: process.env.APP_ORIGIN ?? "http://localhost:3000",
  appUrl: process.env.APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  apiUrl: process.env.API_URL ?? "http://localhost:4000",
  sessionSecret:
    process.env.SESSION_SECRET ?? "gowithus_dev_session_secret_change_in_production_32bytes_min",
  sessionCookieName: process.env.SESSION_COOKIE_NAME ?? "gowithus_session",
  sessionDurationDays: parsePositiveInt(process.env.SESSION_DURATION_DAYS, 7),
  sessionRememberDurationDays: parsePositiveInt(process.env.SESSION_REMEMBER_DURATION_DAYS, 30),
  databaseUrl:
    process.env.DIRECT_URL ??
    process.env.DATABASE_URL ??
    "postgresql://gowithus:gowithus@localhost:5432/gowithus?schema=public",
  redisUrl: process.env.REDIS_URL ?? "redis://localhost:6379",
  smtpHost: process.env.SMTP_HOST ?? "",
  smtpPort: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
  smtpUser: process.env.SMTP_USER ?? "",
  smtpPass: process.env.SMTP_PASS ?? "",
  mailFrom: process.env.MAIL_FROM ?? "GoWithUs <noreply@localhost>",
  paymentWebhookSecret: process.env.PAYMENT_WEBHOOK_SECRET ?? "",
  supabaseUrl: process.env.SUPABASE_URL ?? "",
  supabaseSecretKey: process.env.SUPABASE_SECRET_KEY ?? "",
  supabaseAvatarsBucket: process.env.SUPABASE_AVATARS_BUCKET ?? "avatars",
  supabaseDocumentsBucket: process.env.SUPABASE_DOCUMENTS_BUCKET ?? "travel-documents",
  isProduction: (process.env.NODE_ENV ?? "development") === "production",
} as const;
