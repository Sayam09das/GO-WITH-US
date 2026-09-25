import type { Metadata } from "next";
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
      <div className="mb-8 max-w-2xl">
        <h1 className="section-heading text-3xl text-heading sm:text-4xl">Saved places</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Destinations, stays, and experiences you&apos;ve saved for future journeys.
        </p>
      </div>
      <SavedPlacesList />
    </div>
  );
}
