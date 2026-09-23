import type { Metadata } from "next";
import { buildPageMetadata, buildPageTitle } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: buildPageTitle("My Profile"),
  description: "Manage your GO WITH US profile.",
  path: "/account/profile",
  noIndex: true,
});

export default function AccountProfilePage() {
  return (
    <div className="container-travel py-10 sm:py-12 lg:py-14">
      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Profile details and travel preferences will live here.
      </p>
    </div>
  );
}
