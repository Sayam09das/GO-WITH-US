import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import type { CatalogIds } from "../src/db/seed/helpers.js";
import { seedDestinations } from "../src/db/seed/seed-destinations.js";

const currentDir = dirname(fileURLToPath(import.meta.url));
const apiRoot = resolve(currentDir, "..");
const monorepoRoot = resolve(apiRoot, "..");

config({ path: resolve(monorepoRoot, ".env") });
config({ path: resolve(apiRoot, ".env") });

const databaseUrl =
  process.env.DIRECT_URL ??
  process.env.DATABASE_URL ??
  "postgresql://gowithus:gowithus@localhost:5432/gowithus?schema=public";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

async function main() {
  const ids: CatalogIds = {
    destinations: new Map(),
    stays: new Map(),
    experiences: new Map(),
    restaurants: new Map(),
    places: new Map(),
    users: new Map(),
  };
  await seedDestinations(prisma, ids);
  console.log(`Upserted ${ids.destinations.size} destinations.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
