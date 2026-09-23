import type { Metadata } from "next";
import { buildPageMetadata, buildPageTitle } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: buildPageTitle("Itinerary"),
  description: "Plan day-by-day itineraries for your GO WITH US trips.",
  path: "/account/itinerary",
  noIndex: true,
});

export default function AccountItineraryPage() {
  return (
    <div className="container-travel py-10 sm:py-12 lg:py-14">
      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Select a trip to open its itinerary workspace — or start a new journey from My Trips.
      </p>
    </div>
  );
}
