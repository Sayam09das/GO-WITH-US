import type { Metadata } from "next";
import { buildPageMetadata, buildPageTitle } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: buildPageTitle("Account"),
  description: "Your GO WITH US journey — trips, saved places, and planning at a glance.",
  path: "/account",
  noIndex: true,
});

export default function AccountOverviewPage() {
  return (
    <div className="container-travel py-10 sm:py-12 lg:py-14">
      <div className="max-w-2xl">
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          Your overview will live here — recent trips, saved inspiration, and what to plan next.
        </p>
      </div>
    </div>
  );
}
