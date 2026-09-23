import type { Metadata } from "next";
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
      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Help articles and support options will be available here.
      </p>
    </div>
  );
}
