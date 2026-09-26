import type { Metadata } from "next";
import { MyTripsContent } from "@/components/account/trips/my-trips-content";
import { TripsPageHeader } from "@/components/account/trips/trips-page-header";
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
      <TripsPageHeader />
      <MyTripsContent />
    </div>
  );
}
