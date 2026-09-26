import { DESTINATION_SEEDS } from "./destinations.js";
import {
  type CatalogIds,
  normalizeRating,
  PLACE_CATEGORIES,
  pickHeroImage,
  slugify,
} from "./helpers.js";
import { pickTags } from "./tags.js";

const PLACE_NAMES = [
  "National Maritime Museum",
  "Sunrise Cliff Beach",
  "Central Botanic Park",
  "Old Town Night Market",
  "Panorama Ridge Viewpoint",
  "Heritage Temple Quarter",
  "Fortress Gate Historic Site",
  "Artisan Alley Neighborhood",
  "Modern Gallery Pavilion",
  "Emerald Falls Natural Reserve",
  "Cathedral Square",
  "Coastal Lighthouse Walk",
  "Riverfront Public Gardens",
  "Crafts & Spice Market Hall",
  "Skyline Observation Deck",
  "Sacred Grove Temple",
  "Colonial Quarter Streets",
  "Contemporary Art Museum",
  "Hidden Cove Beach",
  "Urban Forest Park",
  "Harbor Fish Market",
  "Sunset Point Lookout",
  "Ancient Ruins Archaeological Park",
  "Waterfront Creative District",
  "Sculpture Garden Gallery",
  "Alpine Meadow Trailhead",
  "Historic Clocktower Plaza",
  "Lagoon Boardwalk",
  "Temple of the Winds",
  "Old Port Warehouse District",
  "Coastal Dune Preserve",
  "City History Museum",
  "Morning Flower Market",
  "Cliffside Viewing Platform",
  "Shrine Hill Temple",
  "Old Merchant Neighborhood",
  "Photography & Design Gallery",
  "Rainforest Canopy Park",
  "Harbor Promenade",
  "Desert Rock Formations",
  "Royal Palace Gardens",
  "Street Art Passage",
  "Coral Bay Beach",
  "Hilltop Sunset Viewpoint",
  "Monastery Heritage Site",
  "Canal-side Quarter",
  "Indigenous Art Center",
  "Volcanic Crater Park",
  "Coastal Sea Stack Beach",
  "Historic Bridge & River Walk",
];

export async function seedPlaces(
  prisma: import("../../generated/client.js").PrismaClient,
  ids: CatalogIds,
): Promise<void> {
  for (let index = 0; index < PLACE_NAMES.length; index += 1) {
    const title = PLACE_NAMES[index] ?? "Landmark place";
    const slug = slugify(title);
    const destination = DESTINATION_SEEDS[index % DESTINATION_SEEDS.length];
    if (!destination) {
      continue;
    }
    const destinationId = ids.destinations.get(destination.slug);
    if (!destinationId) {
      continue;
    }

    const category = PLACE_CATEGORIES[index % PLACE_CATEGORIES.length] ?? "park";
    const heroImage = pickHeroImage(index + 1);
    const rating = normalizeRating(4.0 + (index % 10) * 0.1);
    const tags = pickTags(index + 2);

    const record = await prisma.place.upsert({
      where: { slug },
      update: {
        destinationId,
        title,
        category,
        locationLabel: `${destination.city}, ${destination.country}`,
        heroImage,
        gallery: [heroImage],
        overview: `${title} is a ${category.replace("_", " ")} highlight in ${destination.title}, best visited with unhurried time and comfortable shoes.`,
        categoryTags: tags,
        latitude: destination.latitude + (index % 5) * 0.008,
        longitude: destination.longitude + (index % 4) * 0.008,
        ratingAvg: rating,
        reviewCount: 8 + (index % 25),
        isFeatured: index < 8,
        isPublished: true,
      },
      create: {
        slug,
        destinationId,
        title,
        category,
        locationLabel: `${destination.city}, ${destination.country}`,
        heroImage,
        gallery: [heroImage],
        overview: `${title} is a ${category.replace("_", " ")} highlight in ${destination.title}, best visited with unhurried time and comfortable shoes.`,
        categoryTags: tags,
        latitude: destination.latitude + (index % 5) * 0.008,
        longitude: destination.longitude + (index % 4) * 0.008,
        ratingAvg: rating,
        reviewCount: 8 + (index % 25),
        isFeatured: index < 8,
        isPublished: true,
      },
    });

    ids.places.set(slug, record.id);
  }
}
