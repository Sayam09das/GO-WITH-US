import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { StayListItem } from "@/types/stay";

type StayCatalogCardProps = {
  stay: StayListItem;
};

export function StayCatalogCard({ stay }: StayCatalogCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-border/60 bg-background shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/stays/${stay.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        <Image
          src={stay.heroImage}
          alt={stay.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={cn(
            "object-cover transition-transform duration-300 group-hover:scale-[1.03]",
            stay.objectPosition ?? "object-center",
          )}
        />
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="text-[0.6875rem] uppercase tracking-[0.12em]">
            {stay.propertyTypeLabel}
          </Badge>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin aria-hidden="true" className="size-3 shrink-0 text-primary" />
            {stay.destination}
          </span>
        </div>

        <h2 className="text-lg font-bold leading-snug text-heading">
          <Link href={`/stays/${stay.slug}`} className="transition-colors hover:text-primary">
            {stay.name}
          </Link>
        </h2>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {stay.description}
        </p>
      </div>
    </article>
  );
}
