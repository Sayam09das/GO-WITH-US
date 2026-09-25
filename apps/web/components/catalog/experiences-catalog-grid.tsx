import { ExperienceCard } from "@/components/landing/featured-experiences/experience-card";
import { getAllExperiences } from "@/lib/api/experiences";

export async function ExperiencesCatalogGrid() {
  const experiences = await getAllExperiences();

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {experiences.map((experience, index) => (
        <ExperienceCard key={experience.id} experience={experience} index={index} />
      ))}
    </div>
  );
}
