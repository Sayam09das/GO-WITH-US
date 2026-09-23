import type { Metadata } from "next";
import { buildPageMetadata, buildPageTitle } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: buildPageTitle("Settings"),
  description: "Account settings for GO WITH US.",
  path: "/account/settings",
  noIndex: true,
});

export default function AccountSettingsPage() {
  return (
    <div className="container-travel py-10 sm:py-12 lg:py-14">
      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Notification, privacy, and account settings will appear here.
      </p>
    </div>
  );
}
