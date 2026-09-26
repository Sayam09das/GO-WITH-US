import type { Metadata } from "next";
import { AccountPageHeader } from "@/components/account/account-page-header";
import { AccountDiscoverContent } from "@/components/account/discover/account-discover-content";
import { buildPageMetadata, buildPageTitle } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: buildPageTitle("Discover"),
  description: "Explore destinations and travel inspiration on GO WITH US.",
  path: "/account/discover",
  noIndex: true,
});

export default function AccountDiscoverPage() {
  return (
    <div className="container-travel py-10 sm:py-12 lg:py-14">
      <AccountPageHeader
        title="Discover"
        description="Curated catalogs and starting points for your next journey."
      />
      <AccountDiscoverContent />
    </div>
  );
}
