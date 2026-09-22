import type { Metadata } from "next";
import { PrivacyPolicyPage } from "@/components/legal";
import { buildPageMetadata, buildPageTitle } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: buildPageTitle("Privacy Policy"),
  description:
    "Learn how GO WITH US collects, uses, and protects your personal information and travel data. We never sell your preferences to ad networks.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return <PrivacyPolicyPage />;
}
