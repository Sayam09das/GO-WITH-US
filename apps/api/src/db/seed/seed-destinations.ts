import type { PrismaClient } from "@prisma/client";
import { CATALOG_CATEGORIES } from "./categories.js";
import { DESTINATION_SEEDS } from "./destinations.js";
import { type CatalogIds, normalizeRating, pickHeroImage } from "./helpers.js";
import { pickTags } from "./tags.js";

export async function seedDestinations(prisma: PrismaClient, ids: CatalogIds): Promise<void> {
  for (let index = 0; index < DESTINATION_SEEDS.length; index += 1) {
    const destination = DESTINATION_SEEDS[index];
    if (!destination) {
      continue;
    }

    const heroImage = pickHeroImage(index);
    const categoryTag = destination.category;
    const travelStyle = destination.style;
    const tags = pickTags(index);
    const categoryTags = [
      categoryTag,
      ...tags,
      CATALOG_CATEGORIES[index % CATALOG_CATEGORIES.length] ?? "Culture",
    ].slice(0, 5);

    const record = await prisma.destination.upsert({
      where: { slug: destination.slug },
      update: {
        title: destination.title,
        country: destination.country,
        region: destination.region,
        city: destination.city,
        heroImage,
        gallery: [heroImage, pickHeroImage(index + 5)],
        overview: destination.overview,
        highlights: destination.highlights,
        climateNotes: "Check seasonal weather before long outdoor days.",
        currency: "Local currency",
        primaryLanguage: "Local language + English in tourist areas",
        transportTips: "Combine walking with short rides for older neighborhoods.",
        budgetTier: destination.budgetTier,
        bestTimeToVisit: "Spring and early autumn",
        categoryTags,
        travelStyles: [travelStyle, "Slow travel"],
        ratingAvg: normalizeRating(destination.rating),
        reviewCount: destination.popularity,
        isFeatured: destination.featured,
        isPublished: true,
        latitude: destination.latitude,
        longitude: destination.longitude,
      },
      create: {
        slug: destination.slug,
        title: destination.title,
        country: destination.country,
        region: destination.region,
        city: destination.city,
        heroImage,
        gallery: [heroImage, pickHeroImage(index + 5)],
        overview: destination.overview,
        highlights: destination.highlights,
        climateNotes: "Check seasonal weather before long outdoor days.",
        currency: "Local currency",
        primaryLanguage: "Local language + English in tourist areas",
        transportTips: "Combine walking with short rides for older neighborhoods.",
        budgetTier: destination.budgetTier,
        bestTimeToVisit: "Spring and early autumn",
        categoryTags,
        travelStyles: [travelStyle, "Slow travel"],
        ratingAvg: normalizeRating(destination.rating),
        reviewCount: destination.popularity,
        isFeatured: destination.featured,
        isPublished: true,
        latitude: destination.latitude,
        longitude: destination.longitude,
      },
    });

    ids.destinations.set(destination.slug, record.id);
  }
}
