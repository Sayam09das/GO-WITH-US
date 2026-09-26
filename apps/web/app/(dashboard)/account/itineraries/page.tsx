import type { Metadata } from "next";
import { AccountPageHeader } from "@/components/account/account-page-header";
import { TripsList } from "@/components/account/trips/trips-list";
import { buildPageMetadata, buildPageTitle } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: buildPageTitle("Itineraries"),
  description: "View and manage your day-by-day trip itineraries on GO WITH US.",
  path: "/account/itineraries",
  noIndex: true,
});

export default function AccountItinerariesPage() {
  return (
    <div className="container-travel py-10 sm:py-12 lg:py-14">
      <AccountPageHeader
        title="Itineraries"
        description="Trips with day-by-day plans appear here once you start building a journey."
      />
      <section aria-labelledby="itineraries-trips-heading">
        <h2
          id="itineraries-trips-heading"
          className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
        >
          Your trips
        </h2>
        <TripsList />
      </section>
    </div>
  );
}
