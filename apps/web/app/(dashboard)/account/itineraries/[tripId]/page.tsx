import type { Metadata } from "next";
import { ItineraryWorkspace } from "@/components/account/itineraries/itinerary-workspace";
import { buildPageMetadata, buildPageTitle } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: buildPageTitle("Itinerary"),
  description: "Plan your day-by-day GO WITH US itinerary.",
  path: "/account/itineraries",
  noIndex: true,
});

export default function ItineraryDetailPage() {
  return (
    <div className="container-travel py-10 sm:py-12 lg:py-14">
      <ItineraryWorkspace />
    </div>
  );
}
