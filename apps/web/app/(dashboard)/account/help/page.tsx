import type { Metadata } from "next";
import { AccountPageHeader } from "@/components/account/account-page-header";
import { AccountHelpSections } from "@/components/account/help/account-help-sections";
import { buildPageMetadata, buildPageTitle } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: buildPageTitle("Help"),
  description: "Get help with GO WITH US.",
  path: "/account/help",
  noIndex: true,
});

export default function AccountHelpPage() {
  return (
    <div className="container-travel py-10 sm:py-12 lg:py-14">
      <AccountPageHeader
        title="Help & support"
        description="Quick answers for planning, saved places, and your account."
      />
      <AccountHelpSections />
    </div>
  );
}
