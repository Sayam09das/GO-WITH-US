import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

const currentDir = dirname(fileURLToPath(import.meta.url));
const apiRoot = resolve(currentDir, "../..");
const monorepoRoot = resolve(apiRoot, "../..");

config({ path: resolve(monorepoRoot, ".env") });
config({ path: resolve(apiRoot, ".env") });

function parsePort(value: string | undefined, fallback: number): number {
  const port = Number(value ?? fallback);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid PORT value: ${value ?? fallback}`);
  }

  return port;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: parsePort(process.env.PORT, 4000),
  host: process.env.HOST ?? "0.0.0.0",
  appOrigin: process.env.APP_ORIGIN ?? "http://localhost:3000",
  isProduction: (process.env.NODE_ENV ?? "development") === "production",
} as const;
