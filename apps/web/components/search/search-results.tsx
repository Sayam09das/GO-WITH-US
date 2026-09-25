import { MapPin, SearchX } from "lucide-react";
import Image from "next/image";
import { StayCatalogCard } from "@/components/catalog/stay-catalog-card";
import { ExperienceCard } from "@/components/landing/featured-experiences/experience-card";
import { DestinationCard } from "@/components/landing/popular-destinations/destination-card";
import { EmptyState } from "@/components/states";
import type { GlobalSearchResults } from "@/lib/api/search";

type SearchResultsProps = {
  query: string;
  results: GlobalSearchResults;
};

export function SearchResults({ query, results }: SearchResultsProps) {
  const total =
    results.destinations.length +
    results.stays.length +
    results.experiences.length +
    results.stories.length;

  if (!query.trim()) {
    return (
      <EmptyState
        title="Start with a destination, stay, or experience"
        description="Search the catalog to discover places worth building a journey around."
        icon={SearchX}
      />
    );
  }

  if (total === 0) {
    return (
      <EmptyState
        title={`No results for “${query}”`}
        description="Try a broader place name or browse destinations to get inspired."
        icon={SearchX}
      />
    );
  }

  return (
    <div className="flex flex-col gap-12">
      {results.destinations.length > 0 ? (
        <section>
          <h2 className="section-heading mb-5 text-2xl text-heading">Destinations</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.destinations.map((destination, index) => (
              <DestinationCard key={destination.id} destination={destination} index={index} />
            ))}
          </div>
        </section>
      ) : null}

      {results.stays.length > 0 ? (
        <section>
          <h2 className="section-heading mb-5 text-2xl text-heading">Stays</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.stays.map((stay) => (
              <StayCatalogCard key={stay.id} stay={stay} />
            ))}
          </div>
        </section>
      ) : null}

      {results.experiences.length > 0 ? (
        <section>
          <h2 className="section-heading mb-5 text-2xl text-heading">Experiences</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.experiences.map((experience, index) => (
              <ExperienceCard key={experience.id} experience={experience} index={index} />
            ))}
          </div>
        </section>
      ) : null}

      {results.stories.length > 0 ? (
        <section>
          <h2 className="section-heading mb-5 text-2xl text-heading">Stories</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.stories.map((story) => (
              <article
                key={story.id}
                className="overflow-hidden rounded-[1.25rem] border border-border/60 bg-background"
              >
                <div className="relative aspect-[16/10]">
                  <Image src={story.heroImage} alt={story.imageAlt} fill className="object-cover" />
                </div>
                <div className="space-y-2 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                    {story.categoryLabel}
                  </p>
                  <h3 className="text-lg font-semibold text-heading">{story.title}</h3>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{story.excerpt}</p>
                  <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin aria-hidden="true" className="size-3" />
                    {story.destination}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
