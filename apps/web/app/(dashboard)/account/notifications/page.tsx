import { Bell } from "lucide-react";
import type { Metadata } from "next";
import { AccountPageHeader } from "@/components/account/account-page-header";
import { EmptyState } from "@/components/states";
import { buildPageMetadata, buildPageTitle } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: buildPageTitle("Notifications"),
  description: "Your GO WITH US notifications and travel updates.",
  path: "/account/notifications",
  noIndex: true,
});

export default function AccountNotificationsPage() {
  return (
    <div className="container-travel py-10 sm:py-12 lg:py-14">
      <AccountPageHeader
        title="Notifications"
        description="Trip reminders, saved-place updates, and calm account alerts — no noise."
      />
      <section className="max-w-lg rounded-[1.25rem] border border-border/60 bg-background p-8 shadow-sm">
        <EmptyState
          icon={Bell}
          title="You're all caught up"
          description="When something needs your attention on a trip or saved place, it will appear here."
          action={{ href: "/account/settings", label: "Notification settings" }}
        />
      </section>
    </div>
  );
}
