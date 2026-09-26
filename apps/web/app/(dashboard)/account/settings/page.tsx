import type { Metadata } from "next";
import { EditorialPageHeader } from "@/components/account/editorial-page-header";
import { AccountSettingsSections } from "@/components/account/settings/account-settings-sections";
import { buildPageMetadata, buildPageTitle } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: buildPageTitle("Settings"),
  description: "Security, notifications, privacy, and account controls for GO WITH US.",
  path: "/account/settings",
  noIndex: true,
});

export default function AccountSettingsPage() {
  return (
    <div className="container-travel py-10 sm:py-12 lg:py-14">
      <EditorialPageHeader
        eyebrow="ACCOUNT"
        heading="Settings"
        supporting="Security, notifications, privacy, and account controls—separate from your travel profile."
      />
      <AccountSettingsSections />
    </div>
  );
}
