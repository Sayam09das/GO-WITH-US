import experiencesFixture from "@/data/fixtures/experiences.json";
import type { ExperienceCategory, ExperienceListItem } from "@/types/experience";

interface ExperienceFixtureImage {
  src: string;
  alt: string;
  objectPosition?: string;
}

interface ExperienceFixtureRecord {
  id: string;
  slug: string;
  title: string;
  destination: string;
  category: ExperienceCategory;
  categoryLabel: string;
  description: string;
  isFeatured?: boolean;
  image: ExperienceFixtureImage;
}

interface ExperiencesFixtureFile {
  experiences: ExperienceFixtureRecord[];
}

function mapExperienceRecord(record: ExperienceFixtureRecord): ExperienceListItem {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    destination: record.destination,
    category: record.category,
    categoryLabel: record.categoryLabel,
    description: record.description,
    heroImage: record.image.src,
    imageAlt: record.image.alt,
    objectPosition: record.image.objectPosition,
    isFeatured: record.isFeatured,
  };
}

const fixtureData = experiencesFixture as ExperiencesFixtureFile;

export const EXPERIENCES_FIXTURE: ExperienceListItem[] =
  fixtureData.experiences.map(mapExperienceRecord);
