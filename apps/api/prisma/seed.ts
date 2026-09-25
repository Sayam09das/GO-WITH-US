import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type StoryCategory } from "../src/generated/client.js";

const currentDir = dirname(fileURLToPath(import.meta.url));
const apiRoot = resolve(currentDir, "..");
const fixturesRoot = resolve(apiRoot, "../../apps/web/data/fixtures");

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://gowithus:gowithus@localhost:5432/gowithus?schema=public";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

type FixtureDestination = {
  slug: string;
  title: string;
  location: string;
  country: string;
  region: string;
  style: string;
  category: string;
  budgetTier: "budget" | "moderate" | "luxury";
  popularity: number;
  rating: number;
  image: { src: string; alt: string };
};

type FixtureStay = {
  slug: string;
  name: string;
  destination: string;
  propertyType: string;
  propertyTypeLabel: string;
  description: string;
  isFeatured?: boolean;
  image: { src: string; alt: string };
};

type FixtureExperience = {
  slug: string;
  title: string;
  destination: string;
  category: string;
  categoryLabel: string;
  description: string;
  isFeatured?: boolean;
  image: { src: string; alt: string };
};

type FixtureStory = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readLabel: string;
  isFeatured?: boolean;
  destination?: string;
  image: { src: string; alt: string };
};

function readFixture<T>(filename: string, key: string): T[] {
  const raw = JSON.parse(readFileSync(resolve(fixturesRoot, filename), "utf8")) as Record<
    string,
    T[]
  >;
  return raw[key] ?? [];
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeRating(value: number): number {
  return Math.min(Math.max(value, 0), 5);
}

function mapPropertyType(value: string) {
  switch (value) {
    case "boutique-hotel":
      return "boutique_hotel" as const;
    case "eco-lodge":
      return "eco_lodge" as const;
    case "apartment":
      return "apartment" as const;
    case "lodge":
      return "lodge" as const;
    default:
      return "villa" as const;
  }
}

function mapExperienceCategory(value: string) {
  switch (value) {
    case "tours":
      return "tours" as const;
    case "cultural":
      return "cultural" as const;
    case "food-dining":
      return "food_dining" as const;
    case "attractions":
      return "attractions" as const;
    default:
      return "outdoor" as const;
  }
}

function mapStoryCategory(value: string): StoryCategory {
  const normalized = value.toLowerCase();

  if (normalized.includes("guide")) {
    return "guides";
  }

  if (normalized.includes("tip") || normalized.includes("idea")) {
    return "tips";
  }

  if (normalized.includes("journey") || normalized.includes("story")) {
    return "journeys";
  }

  if (normalized.includes("inspiration") || normalized.includes("editorial")) {
    return "inspiration";
  }

  return "editorial";
}

function parseReadMinutes(readLabel: string): number {
  const match = readLabel.match(/(\d+)/);
  return match ? Number(match[1]) : 5;
}

const DESTINATION_ALIASES: Record<string, string> = {
  "amalfi coast, italy": "amalfi-coast",
  "venice, italy": "venice",
  "cappadocia, türkiye": "cappadocia",
  "cappadocia, turkey": "cappadocia",
  "dolomites, italy": "dolomites",
  "greek islands": "greek-islands",
  "bali, indonesia": "bali-coast",
};

const EXTRA_DESTINATIONS: FixtureDestination[] = [
  {
    slug: "venice",
    title: "Venice",
    location: "Venice",
    country: "Italy",
    region: "Europe",
    style: "Cultural",
    category: "Historic",
    budgetTier: "luxury",
    popularity: 96,
    rating: 4.8,
    image: {
      src: "/landingImg/about/about-venice.jpg",
      alt: "Historic Venetian canal with gondolas and warm evening light",
    },
  },
  {
    slug: "cappadocia",
    title: "Cappadocia",
    location: "Göreme",
    country: "Türkiye",
    region: "Middle East",
    style: "Adventure",
    category: "Mountain",
    budgetTier: "moderate",
    popularity: 91,
    rating: 4.7,
    image: {
      src: "/landingImg/about/about-cappadocia.jpg",
      alt: "Hot air balloons rising over Cappadocia at sunrise",
    },
  },
];

function resolveDestinationSlug(label: string): string {
  const normalized = label.trim().toLowerCase();
  return DESTINATION_ALIASES[normalized] ?? slugify(label.split(",")[0] ?? label);
}

function buildDestinationOverview(destination: FixtureDestination): string {
  return `${destination.title} invites travelers with ${destination.style.toLowerCase()} energy and ${destination.category.toLowerCase()} character across ${destination.region}.`;
}

async function seedDestinations(): Promise<Map<string, string>> {
  const fixtureDestinations = readFixture<FixtureDestination>("destinations.json", "destinations");
  const allDestinations = [...fixtureDestinations, ...EXTRA_DESTINATIONS];
  const destinationIds = new Map<string, string>();

  for (const destination of allDestinations) {
    const record = await prisma.destination.upsert({
      where: { slug: destination.slug },
      update: {
        title: destination.title,
        country: destination.country,
        region: destination.region,
        heroImage: destination.image.src,
        gallery: [destination.image.src],
        overview: buildDestinationOverview(destination),
        highlights: [
          `${destination.style} travel style`,
          `${destination.category} experiences`,
          `Best explored around ${destination.location}`,
        ],
        budgetTier: destination.budgetTier,
        bestTimeToVisit: "Spring and early autumn",
        categoryTags: [destination.category],
        travelStyles: [destination.style],
        ratingAvg: normalizeRating(destination.rating),
        reviewCount: destination.popularity,
        isFeatured: destination.popularity >= 90,
        isPublished: true,
      },
      create: {
        slug: destination.slug,
        title: destination.title,
        country: destination.country,
        region: destination.region,
        heroImage: destination.image.src,
        gallery: [destination.image.src],
        overview: buildDestinationOverview(destination),
        highlights: [
          `${destination.style} travel style`,
          `${destination.category} experiences`,
          `Best explored around ${destination.location}`,
        ],
        budgetTier: destination.budgetTier,
        bestTimeToVisit: "Spring and early autumn",
        categoryTags: [destination.category],
        travelStyles: [destination.style],
        ratingAvg: normalizeRating(destination.rating),
        reviewCount: destination.popularity,
        isFeatured: destination.popularity >= 90,
        isPublished: true,
      },
    });

    destinationIds.set(destination.slug, record.id);
  }

  return destinationIds;
}

async function seedStays(destinationIds: Map<string, string>): Promise<void> {
  const stays = readFixture<FixtureStay>("stays.json", "stays");

  for (const stay of stays) {
    const destinationSlug = resolveDestinationSlug(stay.destination);
    const destinationId = destinationIds.get(destinationSlug);

    if (!destinationId) {
      console.warn(`Skipping stay ${stay.slug}; destination not found for ${stay.destination}`);
      continue;
    }

    await prisma.stay.upsert({
      where: { slug: stay.slug },
      update: {
        destinationId,
        title: stay.name,
        propertyType: mapPropertyType(stay.propertyType),
        locationLabel: stay.destination,
        heroImage: stay.image.src,
        gallery: [stay.image.src],
        overview: stay.description,
        amenities: ["Wi‑Fi", "Concierge", "Daily housekeeping"],
        priceTier: "luxury",
        estimatedNightlyFrom: 320,
        ratingAvg: 4.8,
        reviewCount: 42,
        isFeatured: Boolean(stay.isFeatured),
        isPublished: true,
      },
      create: {
        slug: stay.slug,
        destinationId,
        title: stay.name,
        propertyType: mapPropertyType(stay.propertyType),
        locationLabel: stay.destination,
        heroImage: stay.image.src,
        gallery: [stay.image.src],
        overview: stay.description,
        amenities: ["Wi‑Fi", "Concierge", "Daily housekeeping"],
        priceTier: "luxury",
        estimatedNightlyFrom: 320,
        ratingAvg: 4.8,
        reviewCount: 42,
        isFeatured: Boolean(stay.isFeatured),
        isPublished: true,
      },
    });
  }
}

async function seedExperiences(destinationIds: Map<string, string>): Promise<void> {
  const experiences = readFixture<FixtureExperience>("experiences.json", "experiences");

  for (const experience of experiences) {
    const destinationSlug = resolveDestinationSlug(experience.destination);
    const destinationId = destinationIds.get(destinationSlug);

    if (!destinationId) {
      console.warn(
        `Skipping experience ${experience.slug}; destination not found for ${experience.destination}`,
      );
      continue;
    }

    await prisma.experience.upsert({
      where: { slug: experience.slug },
      update: {
        destinationId,
        title: experience.title,
        category: mapExperienceCategory(experience.category),
        durationLabel: experience.categoryLabel,
        durationMinutes: 180,
        meetingPoint: experience.destination,
        heroImage: experience.image.src,
        gallery: [experience.image.src],
        overview: experience.description,
        highlights: [experience.categoryLabel, "Small-group experience", "Local guide"],
        included: ["Guide", "Equipment where needed"],
        requirements: ["Comfortable walking shoes"],
        cancellationPolicy: "Free cancellation up to 24 hours before start time.",
        priceTier: "moderate",
        estimatedPriceFrom: 120,
        ratingAvg: 4.7,
        reviewCount: 28,
        isFeatured: Boolean(experience.isFeatured),
        isPublished: true,
      },
      create: {
        slug: experience.slug,
        destinationId,
        title: experience.title,
        category: mapExperienceCategory(experience.category),
        durationLabel: experience.categoryLabel,
        durationMinutes: 180,
        meetingPoint: experience.destination,
        heroImage: experience.image.src,
        gallery: [experience.image.src],
        overview: experience.description,
        highlights: [experience.categoryLabel, "Small-group experience", "Local guide"],
        included: ["Guide", "Equipment where needed"],
        requirements: ["Comfortable walking shoes"],
        cancellationPolicy: "Free cancellation up to 24 hours before start time.",
        priceTier: "moderate",
        estimatedPriceFrom: 120,
        ratingAvg: 4.7,
        reviewCount: 28,
        isFeatured: Boolean(experience.isFeatured),
        isPublished: true,
      },
    });
  }
}

async function seedStories(): Promise<void> {
  const journalStories = readFixture<FixtureStory>("journal.json", "stories");
  const inspirationStories = readFixture<FixtureStory>("inspiration.json", "stories");
  const allStories = [...journalStories, ...inspirationStories];

  for (const story of allStories) {
    await prisma.story.upsert({
      where: { slug: story.slug },
      update: {
        title: story.title,
        excerpt: story.excerpt,
        content: `${story.excerpt}\n\nDiscover more in the full editorial.`,
        category: mapStoryCategory(story.category),
        coverImage: story.image.src,
        authorName: "GO WITH US Editorial",
        readTimeMinutes: parseReadMinutes(story.readLabel),
        isFeatured: Boolean(story.isFeatured),
        status: "published",
        publishedAt: new Date(),
      },
      create: {
        slug: story.slug,
        title: story.title,
        excerpt: story.excerpt,
        content: `${story.excerpt}\n\nDiscover more in the full editorial.`,
        category: mapStoryCategory(story.category),
        coverImage: story.image.src,
        authorName: "GO WITH US Editorial",
        readTimeMinutes: parseReadMinutes(story.readLabel),
        isFeatured: Boolean(story.isFeatured),
        status: "published",
        publishedAt: new Date(),
      },
    });
  }
}

async function main(): Promise<void> {
  console.log("Seeding GO WITH US catalog from frontend fixtures…");

  const destinationIds = await seedDestinations();
  await seedStays(destinationIds);
  await seedExperiences(destinationIds);
  await seedStories();

  console.log("Catalog seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
