import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SAVED_PLACES_EMPTY_COPY, SAVED_PLACES_LINKS } from "@/lib/account";

function DashboardSavedPlacesEmpty() {
  return (
    <div
      data-dash-saved-card
      className="rounded-2xl border border-dashed border-border/70 bg-muted/20 px-6 py-10 will-change-transform sm:px-8 sm:py-12"
    >
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
        <h3 className="hero-heading text-xl font-semibold tracking-tight text-heading sm:text-2xl">
          {SAVED_PLACES_EMPTY_COPY.heading}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          {SAVED_PLACES_EMPTY_COPY.supporting}
        </p>
        <Button asChild className="mt-1 rounded-full px-5">
          <Link href={SAVED_PLACES_LINKS.discover}>
            {SAVED_PLACES_EMPTY_COPY.action}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export { DashboardSavedPlacesEmpty };
