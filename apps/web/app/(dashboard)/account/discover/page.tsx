import type { Metadata } from "next";
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
      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Discover curated destinations, stays, and experiences tailored to your journey.
      </p>
    </div>
  );
}
