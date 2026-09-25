import destinationsFixture from "@/data/fixtures/destinations.json";
import experiencesFixture from "@/data/fixtures/experiences.json";
import inspirationFixture from "@/data/fixtures/inspiration.json";
import journalFixture from "@/data/fixtures/journal.json";
import staysFixture from "@/data/fixtures/stays.json";

type DestinationEditorial = {
  location: string;
  style: string;
  category: string;
  popularity: number;
  priceLabel: string;
  imageAlt: string;
  objectPosition?: string;
};

type StayEditorial = {
  propertyType: string;
  propertyTypeLabel: string;
  description: string;
  imageAlt: string;
  objectPosition?: string;
  isFeatured?: boolean;
  layoutVariant?: "tall" | "wide" | "portrait";
};

type ExperienceEditorial = {
  category: string;
  categoryLabel: string;
  description: string;
  imageAlt: string;
  objectPosition?: string;
  isFeatured?: boolean;
};

type JournalEditorial = {
  destination: string;
  category: string;
  categoryLabel: string;
  readLabel: string;
  imageAlt: string;
  objectPosition?: string;
  layoutVariant?: "horizontal" | "tall" | "compact";
};

type InspirationEditorial = {
  category: string;
  readLabel: string;
  imageAlt: string;
  objectPosition?: string;
};

const destinationEditorial = new Map(
  destinationsFixture.destinations.map((item) => [
    item.slug,
    {
      location: item.location,
      style: item.style,
      category: item.category,
      popularity: item.popularity,
      priceLabel: item.priceLabel,
      imageAlt: item.image.alt,
    } satisfies DestinationEditorial,
  ]),
);

const stayEditorial = new Map(
  staysFixture.stays.map((item) => [
    item.slug,
    {
      propertyType: item.propertyType,
      propertyTypeLabel: item.propertyTypeLabel,
      description: item.description,
      imageAlt: item.image.alt,
      objectPosition: item.image.objectPosition,
      isFeatured: item.isFeatured,
      layoutVariant: item.layoutVariant as StayEditorial["layoutVariant"],
    } satisfies StayEditorial,
  ]),
);

const experienceEditorial = new Map(
  experiencesFixture.experiences.map((item) => [
    item.slug,
    {
      category: item.category,
      categoryLabel: item.categoryLabel,
      description: item.description,
      imageAlt: item.image.alt,
      objectPosition: item.image.objectPosition,
      isFeatured: item.isFeatured,
    } satisfies ExperienceEditorial,
  ]),
);

const journalEditorial = new Map(
  journalFixture.stories.map((item) => [
    item.slug,
    {
      destination: item.destination,
      category: item.category,
      categoryLabel: item.categoryLabel,
      readLabel: item.readLabel,
      imageAlt: item.image.alt,
      objectPosition: item.image.objectPosition,
      layoutVariant: item.layoutVariant as JournalEditorial["layoutVariant"],
    } satisfies JournalEditorial,
  ]),
);

const inspirationEditorial = new Map(
  inspirationFixture.stories.map((item) => [
    item.slug,
    {
      category: item.category,
      readLabel: item.readLabel,
      imageAlt: item.image.alt,
      objectPosition: item.image.objectPosition,
    } satisfies InspirationEditorial,
  ]),
);

export function getDestinationEditorial(slug: string): DestinationEditorial | undefined {
  return destinationEditorial.get(slug);
}

export function getStayEditorial(slug: string): StayEditorial | undefined {
  return stayEditorial.get(slug);
}

export function getExperienceEditorial(slug: string): ExperienceEditorial | undefined {
  return experienceEditorial.get(slug);
}

export function getJournalEditorial(slug: string): JournalEditorial | undefined {
  return journalEditorial.get(slug);
}

export function getInspirationEditorial(slug: string): InspirationEditorial | undefined {
  return inspirationEditorial.get(slug);
}
