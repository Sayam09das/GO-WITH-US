import { EXPERIENCES_FIXTURE } from "@/data/fixtures/experiences";
import type { ExperienceListItem } from "@/types/experience";

/** Featured editorial set for the homepage — fixture-backed until REST is wired. */
export function getFeaturedExperiences(): ExperienceListItem[] {
  const featured = EXPERIENCES_FIXTURE.find((item) => item.isFeatured);
  const supporting = EXPERIENCES_FIXTURE.filter((item) => !item.isFeatured);

  if (!featured) {
    return EXPERIENCES_FIXTURE.slice(0, 4);
  }

  return [featured, ...supporting];
}

export function getExperienceBySlug(slug: string): ExperienceListItem | undefined {
  return EXPERIENCES_FIXTURE.find((item) => item.slug === slug);
}
