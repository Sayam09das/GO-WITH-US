import type { Metadata } from "next";
import { SignInPage } from "@/components/auth";
import { buildPageMetadata, buildPageTitle } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: buildPageTitle("Sign in"),
  description:
    "Sign in to GO WITH US to save destinations, build trips, and plan day-by-day itineraries.",
  path: "/sign-in",
  noIndex: true,
});

export default function SignInRoute() {
  return <SignInPage />;
}
