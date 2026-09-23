import type { Metadata } from "next";
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
      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Saved places and inspiration will be collected here.
      </p>
    </div>
  );
}
