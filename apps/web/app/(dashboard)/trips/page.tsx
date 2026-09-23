import type { Metadata } from "next";
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
      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Your trips dashboard will list active, upcoming, and draft journeys here.
      </p>
    </div>
  );
}
