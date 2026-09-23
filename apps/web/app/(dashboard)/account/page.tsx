import type { Metadata } from "next";
import { DashboardExploreSection } from "@/components/account/dashboard/dashboard-explore-section";
import { DashboardHero } from "@/components/account/dashboard/dashboard-hero";
import { DashboardInspirationSection } from "@/components/account/dashboard/dashboard-inspiration-section";
import { DashboardRecentSection } from "@/components/account/dashboard/dashboard-recent-section";
import { DashboardSavedPlacesSection } from "@/components/account/dashboard/dashboard-saved-places-section";
import { DashboardUpcomingTripSection } from "@/components/account/dashboard/dashboard-upcoming-trip-section";
import { buildPageMetadata, buildPageTitle } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: buildPageTitle("Account"),
  description: "Your GO WITH US journey — trips, saved places, and planning at a glance.",
  path: "/account",
  noIndex: true,
});

export default function AccountOverviewPage() {
  return (
    <>
      <DashboardHero />
      <DashboardUpcomingTripSection />
      <DashboardExploreSection />
      <DashboardSavedPlacesSection />
      <DashboardInspirationSection />
      <DashboardRecentSection />
    </>
  );
}
