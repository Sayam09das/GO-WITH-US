import journalFixture from "@/data/fixtures/journal.json";
import type { JournalCategory, JournalLayoutVariant, JournalStory } from "@/types/journal";

interface JournalFixtureImage {
  src: string;
  alt: string;
  objectPosition?: string;
}

interface JournalFixtureRecord {
  id: string;
  slug: string;
  title: string;
  destination: string;
  excerpt: string;
  category: JournalCategory;
  categoryLabel: string;
  readLabel: string;
  isFeatured?: boolean;
  layoutVariant?: JournalLayoutVariant;
  image: JournalFixtureImage;
}

interface JournalFixtureFile {
  stories: JournalFixtureRecord[];
}

function mapJournalRecord(record: JournalFixtureRecord): JournalStory {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    destination: record.destination,
    excerpt: record.excerpt,
    category: record.category,
    categoryLabel: record.categoryLabel,
    readLabel: record.readLabel,
    heroImage: record.image.src,
    imageAlt: record.image.alt,
    objectPosition: record.image.objectPosition,
    isFeatured: record.isFeatured,
    layoutVariant: record.layoutVariant,
  };
}

const fixtureData = journalFixture as JournalFixtureFile;

export const JOURNAL_FIXTURE: JournalStory[] = fixtureData.stories.map(mapJournalRecord);
