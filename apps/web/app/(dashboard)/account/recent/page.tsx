import type { Metadata } from "next";
import Link from "next/link";
import { DashboardRecentCard } from "@/components/account/dashboard/dashboard-recent-card";
import { DashboardRecentEmpty } from "@/components/account/dashboard/dashboard-recent-empty";
import { DashboardRecentHeader } from "@/components/account/dashboard/dashboard-recent-header";
import { Button } from "@/components/ui/button";
import { mapActivityToRecentItems } from "@/lib/api/dashboard-mappers";
import { listUserActivity } from "@/lib/api/users.server";
import { buildPageMetadata, buildPageTitle } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: buildPageTitle("Recent Activity"),
  description: "Your recent browsing and account activity on GO WITH US.",
  path: "/account/recent",
  noIndex: true,
});

export default async function AccountRecentPage() {
  const activity = await listUserActivity();
  const items = mapActivityToRecentItems(activity);

  return (
    <div className="container-travel py-10 sm:py-12 lg:py-14">
      <DashboardRecentHeader />

      {!activity.length ? (
        <div className="mt-8 space-y-4">
          <DashboardRecentEmpty />
          <Button asChild variant="outline">
            <Link href="/destinations">Start exploring</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 flex flex-wrap gap-3">
          {items.map((item) => (
            <DashboardRecentCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
