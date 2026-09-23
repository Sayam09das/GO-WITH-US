import type { Metadata } from "next";
import { ForgotPasswordPage } from "@/components/auth";
import { buildPageMetadata, buildPageTitle } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: buildPageTitle("Forgot password"),
  description: "Request a password reset link for your GO WITH US account.",
  path: "/forgot-password",
  noIndex: true,
});

export default function ForgotPasswordRoute() {
  return <ForgotPasswordPage />;
}
