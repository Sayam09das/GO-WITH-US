import type { Metadata } from "next";
import { NotificationsPageShell } from "@/components/account/notifications/notifications-page-shell";
import { buildPageMetadata, buildPageTitle } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: buildPageTitle("Notifications"),
  description: "Trip, booking, and journey updates from GO WITH US.",
  path: "/account/notifications",
  noIndex: true,
});

export default function AccountNotificationsPage() {
  return <NotificationsPageShell />;
}
