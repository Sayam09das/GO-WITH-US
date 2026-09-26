import { MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { DestinationDetailResponse } from "@/lib/api/destinations";

type DestinationExperience = DestinationDetailResponse["experiences"][number];

interface DestinationExperienceCardProps {
  experience: DestinationExperience;
}

function DestinationExperienceCard({ experience }: DestinationExperienceCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-border/60 bg-background shadow-sm">
      <Link
        href={`/experiences/${experience.slug}`}
        className="relative block aspect-[4/3] overflow-hidden"
      >
        <Image
          src={experience.heroImage}
          alt={experience.title}
          fill
          className="object-cover"
          sizes="33vw"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full bg-soft-gray px-2.5 py-1 font-medium uppercase tracking-[0.12em]">
            {experience.category}
          </span>
          {experience.durationLabel ? (
            <span className="inline-flex items-center gap-1">
              <MapPin aria-hidden="true" className="size-3 text-primary" />
              {experience.durationLabel}
            </span>
          ) : null}
        </div>
        <h3 className="text-lg font-bold text-heading">
          <Link href={`/experiences/${experience.slug}`} className="hover:text-primary">
            {experience.title}
          </Link>
        </h3>
        <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Star aria-hidden="true" className="size-3.5 fill-primary text-primary" />
            {experience.rating.toFixed(1)}
          </span>
          <span className="capitalize">{experience.priceTier}</span>
        </div>
        <Button asChild className="mt-auto w-full">
          <Link href={`/experiences/${experience.slug}#request-booking`}>
            View experience &amp; book
          </Link>
        </Button>
      </div>
    </article>
  );
}

export { DestinationExperienceCard };
