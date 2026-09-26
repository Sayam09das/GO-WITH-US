import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MY_TRIPS_BOTTOM_CTA } from "@/lib/account/trips/my-trips-copy";

function MyTripsBottomCta() {
  return (
    <section
      aria-labelledby="my-trips-bottom-cta-heading"
      className="mt-14 border-t border-border/60 pt-12 sm:mt-16 sm:pt-14"
    >
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
        <h2
          id="my-trips-bottom-cta-heading"
          className="section-heading text-2xl text-heading sm:text-3xl"
        >
          {MY_TRIPS_BOTTOM_CTA.heading}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          {MY_TRIPS_BOTTOM_CTA.supporting}
        </p>
        <Button asChild variant="outline" className="mt-2 rounded-full px-5">
          <Link href={MY_TRIPS_BOTTOM_CTA.href}>
            {MY_TRIPS_BOTTOM_CTA.action}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

export { MyTripsBottomCta };
