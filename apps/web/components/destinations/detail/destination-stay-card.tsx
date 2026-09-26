import { MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { DestinationDetailResponse } from "@/lib/api/destinations";

type DestinationStay = DestinationDetailResponse["stays"][number];

interface DestinationStayCardProps {
  stay: DestinationStay;
}

function formatPropertyType(value: string): string {
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function DestinationStayCard({ stay }: DestinationStayCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-border/60 bg-background shadow-sm">
      <Link href={`/stays/${stay.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        <Image src={stay.heroImage} alt={stay.title} fill className="object-cover" sizes="33vw" />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full bg-soft-gray px-2.5 py-1 font-medium uppercase tracking-[0.12em]">
            {formatPropertyType(stay.propertyType)}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin aria-hidden="true" className="size-3 text-primary" />
            {stay.locationLabel}
          </span>
        </div>
        <h3 className="text-lg font-bold text-heading">
          <Link href={`/stays/${stay.slug}`} className="hover:text-primary">
            {stay.title}
          </Link>
        </h3>
        <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Star aria-hidden="true" className="size-3.5 fill-primary text-primary" />
            {stay.rating.toFixed(1)}
          </span>
          <span className="capitalize">{stay.priceTier}</span>
        </div>
        <Button asChild className="mt-auto w-full">
          <Link href={`/stays/${stay.slug}#request-booking`}>View stay &amp; book</Link>
        </Button>
      </div>
    </article>
  );
}

export { DestinationStayCard };
