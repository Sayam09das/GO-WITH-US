import type { Metadata } from "next";
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
      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Planned trips and day-by-day schedules will appear here once you create a journey.
      </p>
    </div>
  );
}
