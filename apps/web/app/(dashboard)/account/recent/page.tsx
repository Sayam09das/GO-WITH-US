import type { Metadata } from "next";
import { buildPageMetadata, buildPageTitle } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: buildPageTitle("Recently Viewed"),
  description: "Destinations and stays you recently explored on GO WITH US.",
  path: "/account/recent",
  noIndex: true,
});

export default function AccountRecentPage() {
  return (
    <div className="container-travel py-10 sm:py-12 lg:py-14">
      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Recently viewed destinations and stays will show up here as you explore.
      </p>
    </div>
  );
}
