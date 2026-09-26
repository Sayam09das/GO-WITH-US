import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MY_TRIPS_PAGE_COPY } from "@/lib/account/trips/my-trips-copy";

function TripsPageHeader() {
  return (
    <header className="mb-10 flex flex-col gap-8 border-b border-border/60 pb-10 sm:mb-12 sm:pb-12 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
      <div className="flex max-w-2xl flex-col gap-3 sm:gap-4">
        <p className="label-text text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {MY_TRIPS_PAGE_COPY.eyebrow}
        </p>
        <h1 className="hero-heading text-[2rem] font-semibold leading-[1.08] tracking-tight text-heading sm:text-4xl lg:text-[2.75rem]">
          {MY_TRIPS_PAGE_COPY.heading}
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
          {MY_TRIPS_PAGE_COPY.supporting}
        </p>
      </div>

      <Button asChild className="w-full shrink-0 rounded-full px-5 sm:w-auto">
        <Link href="/trips/new">
          <Plus aria-hidden="true" className="size-4" />
          {MY_TRIPS_PAGE_COPY.planTrip}
        </Link>
      </Button>
    </header>
  );
}

export { TripsPageHeader };
