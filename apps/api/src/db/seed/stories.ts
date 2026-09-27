import type { PrismaClient, StoryCategory } from "@prisma/client";
import { pickHeroImage } from "./helpers.js";

type StorySeed = {
  slug: string;
  title: string;
  excerpt: string;
  category: StoryCategory;
  readTimeMinutes: number;
  isFeatured: boolean;
  imageIndex: number;
};

const STORY_SEEDS: StorySeed[] = [
  {
    slug: "coastal-road-amalfi",
    title: "The coastal road less traveled",
    excerpt:
      "Limestone bends, sea air, and the kind of drive that turns distance into part of the story — not just the route to somewhere else.",
    category: "guides",
    readTimeMinutes: 7,
    isFeatured: true,
    imageIndex: 8,
  },
  {
    slug: "marrakech-morning-markets",
    title: "Morning markets and old recipes",
    excerpt:
      "Spice stalls, shared tables, and the quiet pleasure of eating somewhere before the day fully begins.",
    category: "editorial",
    readTimeMinutes: 5,
    isFeatured: false,
    imageIndex: 2,
  },
  {
    slug: "kyoto-weekend-pace",
    title: "A weekend in a city that never rushes",
    excerpt:
      "Temple paths, late breakfasts, and the gentle discipline of moving through a place without trying to see all of it at once.",
    category: "journeys",
    readTimeMinutes: 6,
    isFeatured: false,
    imageIndex: 1,
  },
  {
    slug: "patagonia-wind-and-distance",
    title: "Wind, distance, and the color of late light",
    excerpt:
      "When the horizon feels wider than your itinerary, the best plan is often fewer plans.",
    category: "inspiration",
    readTimeMinutes: 8,
    isFeatured: true,
    imageIndex: 10,
  },
  {
    slug: "lisbon-tile-and-tide",
    title: "Tile, tide, and tram-line neighborhoods",
    excerpt:
      "Lisbon rewards short walks between viewpoints — each hill revealing another layer of sound and color.",
    category: "guides",
    readTimeMinutes: 6,
    isFeatured: false,
    imageIndex: 3,
  },
  {
    slug: "bali-slow-coast-mornings",
    title: "Slow coast mornings before the day fills up",
    excerpt:
      "An unhurried rhythm of coffee, coastal air, and short drives to places that feel discovered rather than delivered.",
    category: "tips",
    readTimeMinutes: 4,
    isFeatured: false,
    imageIndex: 12,
  },
  {
    slug: "cape-town-table-and-harbor",
    title: "Table, harbor, and the city in between",
    excerpt:
      "Cape Town is best approached as a series of contrasting neighborhoods rather than a checklist of famous views.",
    category: "editorial",
    readTimeMinutes: 7,
    isFeatured: true,
    imageIndex: 5,
  },
  {
    slug: "queenstown-alpine-lake-days",
    title: "Alpine lake days with room to breathe",
    excerpt:
      "Queenstown works when you leave space for weather, wind, and the occasional unplanned lakeside pause.",
    category: "journeys",
    readTimeMinutes: 5,
    isFeatured: false,
    imageIndex: 6,
  },
  {
    slug: "tokyo-neighborhood-food-walks",
    title: "Neighborhood food walks after dark",
    excerpt:
      "Small counters, seasonal plates, and the pleasure of letting appetite — not maps — choose the next stop.",
    category: "tips",
    readTimeMinutes: 5,
    isFeatured: false,
    imageIndex: 4,
  },
  {
    slug: "iceland-light-and-weather",
    title: "Reading light and weather in Iceland",
    excerpt:
      "Flexible days, warm layers, and the habit of checking the sky before committing to a long drive.",
    category: "guides",
    readTimeMinutes: 6,
    isFeatured: false,
    imageIndex: 11,
  },
  {
    slug: "santorini-beyond-the-postcard",
    title: "Santorini beyond the postcard angles",
    excerpt:
      "Early walks, quieter lanes, and the difference between seeing a famous view and feeling present in it.",
    category: "inspiration",
    readTimeMinutes: 6,
    isFeatured: true,
    imageIndex: 9,
  },
  {
    slug: "singapore-gardens-and-hawker-nights",
    title: "Gardens by day, hawker nights",
    excerpt:
      "Singapore shines when you balance structured green spaces with spontaneous food hall discoveries.",
    category: "editorial",
    readTimeMinutes: 5,
    isFeatured: false,
    imageIndex: 7,
  },
];

export async function seedStories(prisma: PrismaClient): Promise<void> {
  for (const story of STORY_SEEDS) {
    const coverImage = pickHeroImage(story.imageIndex);

    await prisma.story.upsert({
      where: { slug: story.slug },
      update: {
        title: story.title,
        excerpt: story.excerpt,
        content: `${story.excerpt}\n\nExplore the full guide on GO WITH US.`,
        category: story.category,
        coverImage,
        authorName: "GO WITH US Editorial",
        readTimeMinutes: story.readTimeMinutes,
        isFeatured: story.isFeatured,
        status: "published",
        publishedAt: new Date(),
      },
      create: {
        slug: story.slug,
        title: story.title,
        excerpt: story.excerpt,
        content: `${story.excerpt}\n\nExplore the full guide on GO WITH US.`,
        category: story.category,
        coverImage,
        authorName: "GO WITH US Editorial",
        readTimeMinutes: story.readTimeMinutes,
        isFeatured: story.isFeatured,
        status: "published",
        publishedAt: new Date(),
      },
    });
  }
}
