/** Curated GO WITH US catalog categories (applied via categoryTags / travelStyles on entities). */
export const CATALOG_CATEGORIES = [
  "Adventure",
  "Nature",
  "Culture",
  "Food",
  "Wellness",
  "History",
  "Beach",
  "Art",
  "Nightlife",
  "Urban",
  "Wildlife",
  "Mountains",
] as const;

export type CatalogCategory = (typeof CATALOG_CATEGORIES)[number];
