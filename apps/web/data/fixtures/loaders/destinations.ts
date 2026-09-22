import destinationsFixture from "@/data/fixtures/destinations.json";
import type { DestinationListItem } from "@/types/destination";

interface DestinationFixtureImage {
  src: string;
  alt: string;
}

interface DestinationFixtureRecord {
  id: string;
  slug: string;
  title: string;
  location: string;
  country: string;
  rating: number;
  priceLabel: string;
  image: DestinationFixtureImage;
  objectPosition?: string;
}

interface DestinationsFixtureFile {
  destinations: DestinationFixtureRecord[];
}

function mapDestinationRecord(record: DestinationFixtureRecord): DestinationListItem {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    location: record.location,
    country: record.country,
    rating: record.rating,
    priceLabel: record.priceLabel,
    heroImage: record.image.src,
    imageAlt: record.image.alt,
    objectPosition: record.objectPosition,
  };
}

const fixtureData = destinationsFixture as DestinationsFixtureFile;

/** Normalized destination list from JSON fixture — swap file for API later. */
export const DESTINATIONS_FIXTURE: DestinationListItem[] =
  fixtureData.destinations.map(mapDestinationRecord);
