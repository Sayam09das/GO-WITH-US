import { DESTINATION_SEEDS } from "./destinations.js";
import {
  type CatalogIds,
  EXPERIENCE_CATEGORIES,
  normalizeRating,
  pickHeroImage,
  slugify,
} from "./helpers.js";

const EXPERIENCE_TITLES = [
  "Sunrise ridge walk with a local naturalist",
  "Hidden courtyards and craft ateliers tour",
  "Coastal kayak and cliff-side picnic",
  "Market-to-table cooking workshop",
  "Temple district storytelling walk",
  "Volcano viewpoint and hot springs soak",
  "Old town photography stroll at golden hour",
  "Family-friendly wildlife sanctuary visit",
  "Sunset sail with regional small plates",
  "Mountain bike loop through pine forests",
  "Heritage architecture highlights tour",
  "Riverfront cycling and coffee crawl",
  "Guided snorkeling over calm reefs",
  "Village homestay lunch and farm visit",
  "Night market flavors and street food trail",
  "Desert stargazing with astronomer guide",
  "Waterfall hike with forest bathing pause",
  "Artisan pottery studio immersion",
  "Historic fortress and museum morning",
  "Lagoon paddle and mangrove ecology talk",
  "Winery terrace tasting and vineyard walk",
  "Old quarter rickshaw heritage route",
  "Highland tea plantation day trip",
  "Coastal cliff path and lighthouse visit",
  "Urban murals and design district tour",
  "Island hopping with snorkeling stops",
  "Sacred site etiquette and culture briefing",
  "Rainforest canopy walk and birdwatching",
  "Fjord cruise with geology commentary",
  "Local music evening in a courtyard venue",
  "Glacier viewpoint hike with ranger talk",
  "Floating market breakfast experience",
  "Cave temple visit with textile demo",
  "Coastal dune walk and sandboard lesson",
  "Old port warehouses creative district tour",
  "Mountain village cheese-making visit",
  "Sunrise yoga on a quiet beach deck",
  "Historic trade route cycling segment",
  "Botanical garden curator-led walk",
  "Coastal fishing village and seafood lunch",
  "High desert photography workshop",
  "Old city gates and ramparts walk",
  "River canyon rafting half-day",
  "Traditional dance performance and dinner",
  "Alpine lake picnic and short summit hike",
  "Urban park foraging and herbal tea session",
  "Coastal lighthouse and tidepool exploration",
  "Craft distillery tour and tasting flight",
  "Old town lantern-lit evening walk",
  "Wildflower meadow hike in spring bloom",
];

export async function seedExperiences(
  prisma: import("../../generated/client.js").PrismaClient,
  ids: CatalogIds,
): Promise<void> {
  for (let index = 0; index < EXPERIENCE_TITLES.length; index += 1) {
    const title = EXPERIENCE_TITLES[index] ?? "Guided local experience";
    const slug = slugify(title);
    const destination = DESTINATION_SEEDS[index % DESTINATION_SEEDS.length];
    if (!destination) {
      continue;
    }
    const destinationId = ids.destinations.get(destination.slug);
    if (!destinationId) {
      continue;
    }

    const category = EXPERIENCE_CATEGORIES[index % EXPERIENCE_CATEGORIES.length] ?? "tours";
    const heroImage = pickHeroImage(index + 4);
    const priceTier = destination.budgetTier;
    const rating = normalizeRating(4.3 + (index % 7) * 0.1);

    const record = await prisma.experience.upsert({
      where: { slug },
      update: {
        destinationId,
        title,
        category,
        durationLabel: index % 2 === 0 ? "Half day" : "Full day",
        durationMinutes: index % 2 === 0 ? 240 : 420,
        meetingPoint: `${destination.city} central meeting point`,
        heroImage,
        gallery: [heroImage],
        overview: `${title} in ${destination.title} focuses on small groups, local hosts, and unhurried pacing.`,
        highlights: ["Local host", "Small group", "Flexible pacing"],
        included: ["Guide", "Entry fees where listed"],
        requirements: ["Comfortable shoes", "Sun protection"],
        cancellationPolicy: "Free cancellation up to 24 hours before start time.",
        priceTier,
        estimatedPriceFrom: priceTier === "luxury" ? 180 : priceTier === "moderate" ? 95 : 55,
        ratingAvg: rating,
        reviewCount: 12 + (index % 40),
        isFeatured: index < 8,
        isPublished: true,
        latitude: destination.latitude,
        longitude: destination.longitude,
      },
      create: {
        slug,
        destinationId,
        title,
        category,
        durationLabel: index % 2 === 0 ? "Half day" : "Full day",
        durationMinutes: index % 2 === 0 ? 240 : 420,
        meetingPoint: `${destination.city} central meeting point`,
        heroImage,
        gallery: [heroImage],
        overview: `${title} in ${destination.title} focuses on small groups, local hosts, and unhurried pacing.`,
        highlights: ["Local host", "Small group", "Flexible pacing"],
        included: ["Guide", "Entry fees where listed"],
        requirements: ["Comfortable shoes", "Sun protection"],
        cancellationPolicy: "Free cancellation up to 24 hours before start time.",
        priceTier,
        estimatedPriceFrom: priceTier === "luxury" ? 180 : priceTier === "moderate" ? 95 : 55,
        ratingAvg: rating,
        reviewCount: 12 + (index % 40),
        isFeatured: index < 8,
        isPublished: true,
        latitude: destination.latitude,
        longitude: destination.longitude,
      },
    });

    ids.experiences.set(slug, record.id);
  }
}
