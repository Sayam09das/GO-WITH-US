import type { PrismaClient } from "../../generated/client.js";
import { seedExperiences } from "./experiences.js";
import type { CatalogIds } from "./helpers.js";
import { seedPlaces } from "./places.js";
import { seedRestaurants } from "./restaurants.js";
import { seedReviews } from "./reviews.js";
import { seedDestinations } from "./seed-destinations.js";
import { seedStays } from "./stays.js";
import { seedStories } from "./stories.js";
import { seedDemoUsers } from "./users.js";

function createCatalogIds(): CatalogIds {
  return {
    destinations: new Map(),
    stays: new Map(),
    experiences: new Map(),
    restaurants: new Map(),
    places: new Map(),
    users: new Map(),
  };
}

async function invalidateCatalogCache(): Promise<void> {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    return;
  }

  try {
    const { default: Redis } = await import("ioredis");
    const redis = new Redis(redisUrl, { maxRetriesPerRequest: 1, lazyConnect: true });
    await redis.connect();
    await redis.del(
      "destinations:featured",
      "experiences:featured",
      "stories:featured",
      "discovery:homepage",
    );
    console.log("Catalog cache invalidated.");
    redis.disconnect();
  } catch {
    console.warn("Could not invalidate Redis cache (Redis may be offline).");
  }
}

export async function runCatalogSeed(prisma: PrismaClient): Promise<void> {
  console.log("Seeding GO WITH US PostgreSQL catalog…");

  const ids = createCatalogIds();

  await seedDestinations(prisma, ids);
  await seedStays(prisma, ids);
  await seedExperiences(prisma, ids);
  await seedRestaurants(prisma, ids);
  await seedPlaces(prisma, ids);
  await seedStories(prisma);
  await seedDemoUsers(prisma, ids);
  await seedReviews(prisma, ids);
  await invalidateCatalogCache();

  console.log("Catalog seed complete.");
  console.log(
    `Counts — destinations: ${ids.destinations.size}, stays: ${ids.stays.size}, experiences: ${ids.experiences.size}, restaurants: ${ids.restaurants.size}, places: ${ids.places.size}`,
  );
}
