import type { Metadata } from "next";
import { VerifyEmailSuccessPage } from "@/components/auth/verify-email/verify-email-success-page";
import { buildPageMetadata, buildPageTitle } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: buildPageTitle("Email verified"),
  description: "Your GO WITH US email address has been verified.",
  path: "/verify-email/success",
  noIndex: true,
});

export default function VerifyEmailSuccessRoute() {
  return <VerifyEmailSuccessPage />;
}
