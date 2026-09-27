import { ExperienceCard } from "@/components/landing/featured-experiences/experience-card";
import { getAllExperiences } from "@/lib/api/experiences";
import { withApiFallback } from "@/lib/api/with-api-fallback";
import {
  FEATURED_EXPERIENCES_HOMEPAGE_SHOWCASE,
  mergeExperienceHomeCatalog,
} from "@/lib/landing/featured-experiences";

export async function ExperiencesCatalogGrid() {
  const experiences = mergeExperienceHomeCatalog(
    await withApiFallback(getAllExperiences(), []),
    FEATURED_EXPERIENCES_HOMEPAGE_SHOWCASE,
  );

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {experiences.map((experience, index) => (
        <ExperienceCard key={experience.id} experience={experience} index={index} />
      ))}
    </div>
  );
}
