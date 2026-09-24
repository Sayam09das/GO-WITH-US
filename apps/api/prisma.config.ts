import { resolve } from "node:path";
import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../../.env") });

const fallbackUrl = "postgresql://gowithus:gowithus@localhost:5432/gowithus?schema=public";

// Use DIRECT_URL for Prisma CLI migrations/pushes if available, falling back to DATABASE_URL
const dbUrl =
  process.env.DIRECT_URL || process.env.DATABASE_URL || env("DATABASE_URL") || fallbackUrl;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: dbUrl,
  },
});
