import type { Metadata } from "next";
import { VerifyEmailPage } from "@/components/auth/verify-email/verify-email-page";
import { buildPageMetadata, buildPageTitle } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: buildPageTitle("Verify email"),
  description: "Verify your GO WITH US account email address.",
  path: "/verify-email",
  noIndex: true,
});

export default function VerifyEmailRoute() {
  return <VerifyEmailPage />;
}
