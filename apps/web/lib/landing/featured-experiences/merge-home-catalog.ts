import type { ExperienceListItem } from "@/types/experience";
import { FEATURED_EXPERIENCES_GRID_PAGE_SIZE } from "./config";

/**
 * Keeps the homepage grid rich when the live catalog is still sparse:
 * API items first, then editorial showcase entries (deduped by slug).
 */
export function mergeExperienceHomeCatalog(
  catalog: ExperienceListItem[],
  showcase: ExperienceListItem[],
  minCount = FEATURED_EXPERIENCES_GRID_PAGE_SIZE,
): ExperienceListItem[] {
  if (catalog.length >= minCount) {
    return catalog;
  }

  const seen = new Set(catalog.map((item) => item.slug));
  const merged = [...catalog];

  for (const item of showcase) {
    if (seen.has(item.slug)) {
      continue;
    }
    merged.push(item);
    seen.add(item.slug);
  }

  return merged.length > 0 ? merged : showcase;
}
