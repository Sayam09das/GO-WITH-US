import type { Metadata } from "next";
import { AccountPageHeader } from "@/components/account/account-page-header";
import { AccountSettingsSections } from "@/components/account/settings/account-settings-sections";
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
      <AccountPageHeader
        title="Settings"
        description="Manage profile, notifications, and privacy preferences for your account."
      />
      <AccountSettingsSections />
    </div>
  );
}
