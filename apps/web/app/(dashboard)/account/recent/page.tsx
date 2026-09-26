import type { Metadata } from "next";
import Link from "next/link";
import { AccountPageHeader } from "@/components/account/account-page-header";
import { DashboardRecentCard } from "@/components/account/dashboard/dashboard-recent-card";
import { DashboardRecentEmpty } from "@/components/account/dashboard/dashboard-recent-empty";
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
      <AccountPageHeader
        title="Recently viewed"
        description="A running log of destinations and places you've opened recently."
      />

      {!activity.length ? (
        <div className="mt-2 max-w-lg space-y-4 rounded-[1.25rem] border border-border/60 bg-background p-8 shadow-sm">
          <DashboardRecentEmpty />
          <Button asChild variant="outline">
            <Link href="/destinations">Start exploring</Link>
          </Button>
        </div>
      ) : (
        <section aria-labelledby="recent-activity-heading">
          <h2 id="recent-activity-heading" className="sr-only">
            Activity items
          </h2>
          <div className="flex flex-wrap gap-3">
            {items.map((item) => (
              <DashboardRecentCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
