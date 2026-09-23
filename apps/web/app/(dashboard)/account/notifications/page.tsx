import type { Metadata } from "next";
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
      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Trip reminders, saved-place updates, and account alerts will appear here.
      </p>
    </div>
  );
}
