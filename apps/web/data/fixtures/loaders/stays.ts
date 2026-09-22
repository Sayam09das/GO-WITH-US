import staysFixture from "@/data/fixtures/stays.json";
import type { StayLayoutVariant, StayListItem, StayPropertyType } from "@/types/stay";

interface StayFixtureImage {
  src: string;
  alt: string;
  objectPosition?: string;
}

interface StayFixtureRecord {
  id: string;
  slug: string;
  name: string;
  destination: string;
  propertyType: StayPropertyType;
  propertyTypeLabel: string;
  description: string;
  isFeatured?: boolean;
  layoutVariant?: StayLayoutVariant;
  image: StayFixtureImage;
}

interface StaysFixtureFile {
  stays: StayFixtureRecord[];
}

function mapStayRecord(record: StayFixtureRecord): StayListItem {
  return {
    id: record.id,
    slug: record.slug,
    name: record.name,
    destination: record.destination,
    propertyType: record.propertyType,
    propertyTypeLabel: record.propertyTypeLabel,
    description: record.description,
    heroImage: record.image.src,
    imageAlt: record.image.alt,
    objectPosition: record.image.objectPosition,
    isFeatured: record.isFeatured,
    layoutVariant: record.layoutVariant,
  };
}

const fixtureData = staysFixture as StaysFixtureFile;

export const STAYS_FIXTURE: StayListItem[] = fixtureData.stays.map(mapStayRecord);
