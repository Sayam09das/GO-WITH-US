import type { Metadata } from "next";
import Link from "next/link";
import { AccountPageHeader } from "@/components/account/account-page-header";
import { TripsList } from "@/components/account/trips/trips-list";
import { Button } from "@/components/ui/button";
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
      <AccountPageHeader
        title="My trips"
        description="Draft, upcoming, and completed journeys in one calm workspace."
      />
      <div className="mb-8">
        <Button asChild>
          <Link href="/trips/new">Plan a trip</Link>
        </Button>
      </div>
      <TripsList />
    </div>
  );
}
