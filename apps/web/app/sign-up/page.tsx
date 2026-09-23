import type { Metadata } from "next";
import { SignUpPage } from "@/components/auth";
import { buildPageMetadata, buildPageTitle } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: buildPageTitle("Sign up"),
  description:
    "Create a GO WITH US account to save destinations, build trips, and plan day-by-day itineraries.",
  path: "/sign-up",
  noIndex: true,
});

export default function SignUpRoute() {
  return <SignUpPage />;
}
