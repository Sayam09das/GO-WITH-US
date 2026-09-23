import type { Metadata } from "next";
import { DashboardHero } from "@/components/account/dashboard/dashboard-hero";
import { buildPageMetadata, buildPageTitle } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: buildPageTitle("Account"),
  description: "Your GO WITH US journey — trips, saved places, and planning at a glance.",
  path: "/account",
  noIndex: true,
});

export default function AccountOverviewPage() {
  return <DashboardHero />;
}
