import { STAYS_FIXTURE } from "@/data/fixtures/loaders/stays";
import type { StayListItem } from "@/types/stay";

/** Featured editorial stay for the homepage — JSON fixture-backed until REST is wired. */
export function getFeaturedStay(): StayListItem | undefined {
  return STAYS_FIXTURE.find((item) => item.isFeatured);
}

export function getSupportingStays(): StayListItem[] {
  return STAYS_FIXTURE.filter((item) => !item.isFeatured);
}

export function getStayBySlug(slug: string): StayListItem | undefined {
  return STAYS_FIXTURE.find((item) => item.slug === slug);
}
