/** Reusable catalog tags assigned across destinations, stays, experiences, restaurants, and places. */
export const CATALOG_TAGS = [
  "islands",
  "hidden-gem",
  "family-friendly",
  "romantic",
  "luxury",
  "budget",
  "local-food",
  "sunset",
  "hiking",
  "architecture",
  "coastal",
  "slow-travel",
  "weekend-escape",
  "wildlife",
  "design-forward",
] as const;

export type CatalogTag = (typeof CATALOG_TAGS)[number];

export function pickTags(index: number, count = 3): string[] {
  const tags: string[] = [];
  for (let offset = 0; offset < count; offset += 1) {
    tags.push(CATALOG_TAGS[(index + offset) % CATALOG_TAGS.length] ?? CATALOG_TAGS[0]);
  }
  return [...new Set(tags)];
}
