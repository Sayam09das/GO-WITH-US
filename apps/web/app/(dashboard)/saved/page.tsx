import type { Metadata } from "next";
import { AccountPageHeader } from "@/components/account/account-page-header";
import { SavedPlacesList } from "@/components/account/saved/saved-places-list";
import { buildPageMetadata, buildPageTitle } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: buildPageTitle("Saved"),
  description: "Your saved destinations, stays, and experiences on GO WITH US.",
  path: "/saved",
  noIndex: true,
});

export default function SavedPage() {
  return (
    <div className="container-travel py-10 sm:py-12 lg:py-14">
      <AccountPageHeader
        title="Saved places"
        description="Destinations, stays, and experiences you've saved for future journeys."
      />
      <SavedPlacesList />
    </div>
  );
}
