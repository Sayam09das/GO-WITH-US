import { DESTINATION_SEEDS } from "./destinations.js";
import { type CatalogIds, normalizeRating, pickHeroImage, slugify } from "./helpers.js";
import { pickTags } from "./tags.js";

const RESTAURANT_NAMES = [
  "Ember & Salt Kitchen",
  "Lotus Street Noodles",
  "Harbor Table Seafood",
  "Terrace Olive Trattoria",
  "Spice Route Tandoor",
  "Garden Room Vegetarian",
  "Midnight Ramen Bar",
  "Citrus & Stone Mediterranean",
  "Fireside Steakhouse",
  "Morning Market Café",
  "Blue Lantern Sushi",
  "Courtyard Mezze House",
  "Riverbend Farm Table",
  "Sunset Deck Grill",
  "Old Town Baker & Brew",
  "Coral Reef Raw Bar",
  "Piazza Rossa Ristorante",
  "Silk Road Tea House",
  "Clay Oven Curry Room",
  "Vine Street Wine Bar",
  "Lagoon View Cantina",
  "Hearthstone Bistro",
  "Golden Hour Rooftop",
  "Forest Floor Vegan",
  "Dockside Oyster Co.",
  "Lantern Alley Tapas",
  "Mountain View Chalet Dining",
  "Coastal Lime Taqueria",
  "Heritage Hall Fine Dining",
  "Palm Shade Brunch Club",
  "Stone Mill Pasta Bar",
  "Harbor Mist Izakaya",
  "Cedar Smoke BBQ",
  "Market Square Falafel",
  "Moonlit Jazz Supper Club",
  "Bay Leaf Thai Kitchen",
  "Canyon Road Cantina",
  "Willow Pond Dim Sum",
  "Salt & Sage Seafood",
  "Copper Pan Brasserie",
  "Fig Tree Courtyard",
  "North Pier Fish House",
  "Saffron Silk Indian Kitchen",
  "Driftwood Beach Shack",
  "Cathedral Cellar Wine Room",
  "River Stone Ramen",
  "Olive & Ash Pizzeria",
  "Starlit Dessert Salon",
  "Harbor House Ramen",
  "Summit Lodge Alpine Dining",
];

const CUISINES = [
  "Local",
  "Japanese",
  "Seafood",
  "Italian",
  "Indian",
  "Vegetarian",
  "Asian fusion",
  "Mediterranean",
  "Steakhouse",
  "Café",
  "Mexican",
  "Middle Eastern",
  "Farm-to-table",
  "Grill",
  "European",
];

export async function seedRestaurants(
  prisma: import("../../generated/client.js").PrismaClient,
  ids: CatalogIds,
): Promise<void> {
  for (let index = 0; index < RESTAURANT_NAMES.length; index += 1) {
    const title = RESTAURANT_NAMES[index] ?? "Neighborhood restaurant";
    const slug = slugify(title);
    const destination = DESTINATION_SEEDS[index % DESTINATION_SEEDS.length];
    if (!destination) {
      continue;
    }
    const destinationId = ids.destinations.get(destination.slug);
    if (!destinationId) {
      continue;
    }

    const cuisine = CUISINES[index % CUISINES.length] ?? "Local";
    const heroImage = pickHeroImage(index + 2);
    const priceLevel = (index % 4) + 1;
    const rating = normalizeRating(4.1 + (index % 9) * 0.1);
    const tags = pickTags(index);

    const record = await prisma.restaurant.upsert({
      where: { slug },
      update: {
        destinationId,
        title,
        cuisine,
        heroImage,
        gallery: [heroImage],
        overview: `${title} serves ${cuisine.toLowerCase()} plates in ${destination.title} with a relaxed, reservation-friendly atmosphere.`,
        priceLevel,
        address: `${destination.city} old quarter`,
        latitude: destination.latitude,
        longitude: destination.longitude,
        menuHighlights: ["Seasonal tasting plate", "Chef's dessert"],
        amenities: tags.includes("romantic")
          ? ["Outdoor seating", "Wine list"]
          : ["Walk-ins welcome"],
        ratingAvg: rating,
        reviewCount: 10 + (index % 30),
        isFeatured: index < 10,
        isPublished: true,
      },
      create: {
        slug,
        destinationId,
        title,
        cuisine,
        heroImage,
        gallery: [heroImage],
        overview: `${title} serves ${cuisine.toLowerCase()} plates in ${destination.title} with a relaxed, reservation-friendly atmosphere.`,
        priceLevel,
        address: `${destination.city} old quarter`,
        latitude: destination.latitude,
        longitude: destination.longitude,
        menuHighlights: ["Seasonal tasting plate", "Chef's dessert"],
        amenities: tags.includes("romantic")
          ? ["Outdoor seating", "Wine list"]
          : ["Walk-ins welcome"],
        ratingAvg: rating,
        reviewCount: 10 + (index % 30),
        isFeatured: index < 10,
        isPublished: true,
      },
    });

    ids.restaurants.set(slug, record.id);
  }
}
