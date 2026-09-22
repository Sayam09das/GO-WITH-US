import inspirationFixture from "@/data/fixtures/inspiration.json";
import type { InspirationStory } from "@/types/inspiration";

interface InspirationFixtureImage {
  src: string;
  alt: string;
  objectPosition?: string;
}

interface InspirationFixtureRecord {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readLabel: string;
  isFeatured?: boolean;
  image: InspirationFixtureImage;
}

interface InspirationFixtureFile {
  stories: InspirationFixtureRecord[];
}

function mapInspirationRecord(record: InspirationFixtureRecord): InspirationStory {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    excerpt: record.excerpt,
    category: record.category,
    readLabel: record.readLabel,
    heroImage: record.image.src,
    imageAlt: record.image.alt,
    objectPosition: record.image.objectPosition,
    isFeatured: record.isFeatured,
  };
}

const fixtureData = inspirationFixture as InspirationFixtureFile;

export const INSPIRATION_FIXTURE: InspirationStory[] =
  fixtureData.stories.map(mapInspirationRecord);
