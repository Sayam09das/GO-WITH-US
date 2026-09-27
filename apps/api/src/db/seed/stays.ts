import type { PrismaClient } from "@prisma/client";
import { DESTINATION_SEEDS } from "./destinations.js";
import {
  type CatalogIds,
  normalizeRating,
  PROPERTY_TYPES,
  pickHeroImage,
  slugify,
} from "./helpers.js";

const STAY_NAMES = [
  "Harbor House Boutique Hotel",
  "Cedar Ridge Eco Lodge",
  "Palmside Villa Retreat",
  "Old Quarter Guesthouse",
  "Summit View Design Stay",
  "Lagoon Edge Resort",
  "Garden Court Apartments",
  "Cliffside Inn & Terrace",
  "Riverstone Lodge",
  "Sunlit Courtyard Hotel",
  "Pine Trail Mountain Lodge",
  "Seaside Canvas Villa",
  "Heritage Lane Hotel",
  "Skyline Terrace Suites",
  "Meadowbrook Guesthouse",
  "Coral Bay Resort",
  "Studio Quarter Apartments",
  "Forest Haven Lodge",
  "Canal View Boutique Hotel",
  "Desert Rose Villa",
  "Bayfront Boardwalk Inn",
  "Alpine Crest Lodge",
  "Olive Grove Retreat",
  "City Park Design Hotel",
  "Cove Light Resort",
  "Stone Arch Guesthouse",
  "Horizon Line Apartments",
  "Rainforest Canopy Lodge",
  "Marina House Hotel",
  "Dune Walk Villa",
  "Cathedral Square Inn",
  "Lake Mirror Lodge",
  "Terrace & Timber Hotel",
  "Coastal Pine Guesthouse",
  "Sunset Ridge Resort",
  "Market Lane Apartments",
  "Highland Pass Lodge",
  "Palm Court Villa",
  "Old Mill Boutique Hotel",
  "Starlit Bay Resort",
  "Canyon View Lodge",
  "Harbor Lantern Guesthouse",
  "Vineyard Terrace Hotel",
  "Island Breeze Villa",
  "Clocktower Design Stay",
  "Silver Sand Resort",
  "Mountain Echo Lodge",
  "Courtyard & Co. Hotel",
  "Laguna Shore Guesthouse",
  "North Star Boutique Hotel",
];

export async function seedStays(prisma: PrismaClient, ids: CatalogIds): Promise<void> {
  for (let index = 0; index < STAY_NAMES.length; index += 1) {
    const name = STAY_NAMES[index] ?? "Curated stay";
    const slug = slugify(name);
    const destination = DESTINATION_SEEDS[index % DESTINATION_SEEDS.length];
    if (!destination) {
      continue;
    }
    const destinationId = ids.destinations.get(destination.slug);
    if (!destinationId) {
      continue;
    }

    const propertyType = PROPERTY_TYPES[index % PROPERTY_TYPES.length] ?? "boutique_hotel";
    const heroImage = pickHeroImage(index);
    const priceTier = destination.budgetTier;
    const nightly =
      priceTier === "luxury" ? 420 + (index % 5) * 40 : priceTier === "moderate" ? 220 : 110;
    const rating = normalizeRating(4.4 + (index % 6) * 0.1);

    const record = await prisma.stay.upsert({
      where: { slug },
      update: {
        destinationId,
        title: name,
        propertyType,
        locationLabel: `${destination.city}, ${destination.country}`,
        heroImage,
        gallery: [heroImage, pickHeroImage(index + 3)],
        overview: `${name} is a calm base in ${destination.title} with thoughtful service and an easy connection to local neighborhoods.`,
        amenities: ["Wi‑Fi", "Daily housekeeping", "Concierge", "Air conditioning"],
        priceTier,
        estimatedNightlyFrom: nightly,
        ratingAvg: rating,
        reviewCount: 18 + (index % 35),
        isFeatured: index < 6,
        isPublished: true,
        latitude: destination.latitude + (index % 3) * 0.01,
        longitude: destination.longitude - (index % 3) * 0.01,
      },
      create: {
        slug,
        destinationId,
        title: name,
        propertyType,
        locationLabel: `${destination.city}, ${destination.country}`,
        heroImage,
        gallery: [heroImage, pickHeroImage(index + 3)],
        overview: `${name} is a calm base in ${destination.title} with thoughtful service and an easy connection to local neighborhoods.`,
        amenities: ["Wi‑Fi", "Daily housekeeping", "Concierge", "Air conditioning"],
        priceTier,
        estimatedNightlyFrom: nightly,
        ratingAvg: rating,
        reviewCount: 18 + (index % 35),
        isFeatured: index < 6,
        isPublished: true,
        latitude: destination.latitude + (index % 3) * 0.01,
        longitude: destination.longitude - (index % 3) * 0.01,
      },
    });

    ids.stays.set(slug, record.id);
  }
}
