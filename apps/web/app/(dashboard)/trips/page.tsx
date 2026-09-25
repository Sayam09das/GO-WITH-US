import type { Metadata } from "next";
import { TripsList } from "@/components/account/trips/trips-list";
import { buildPageMetadata, buildPageTitle } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: buildPageTitle("My Trips"),
  description: "View and manage your GO WITH US trips.",
  path: "/trips",
  noIndex: true,
});

export default function TripsPage() {
  return (
    <div className="container-travel py-10 sm:py-12 lg:py-14">
      <div className="mb-8 max-w-2xl">
        <h1 className="section-heading text-3xl text-heading sm:text-4xl">My trips</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Draft, upcoming, and completed journeys in one calm workspace.
        </p>
      </div>
      <TripsList />
    </div>
  );
}
