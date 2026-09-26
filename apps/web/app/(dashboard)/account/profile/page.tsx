import type { Metadata } from "next";
import Link from "next/link";
import { AccountProfilePageShell } from "@/components/account/profile/account-profile-page-shell";
import { Button } from "@/components/ui/button";
import { getUserProfile } from "@/lib/api/users.server";
import { buildPageMetadata, buildPageTitle } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: buildPageTitle("Profile"),
  description: "Your personal travel identity and preferences on GO WITH US.",
  path: "/account/profile",
  noIndex: true,
});

export default async function AccountProfilePage() {
  const profile = await getUserProfile();

  if (!profile) {
    return (
      <div className="container-travel py-10 sm:py-12 lg:py-14">
        <div className="mx-auto flex max-w-lg flex-col gap-4 text-center">
          <p className="label-text text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            YOUR PROFILE
          </p>
          <h1 className="hero-heading text-2xl font-semibold text-heading">
            Sign in to view your profile
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your details, travel preferences, and saved destinations.
          </p>
          <Button asChild className="mx-auto rounded-full">
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <AccountProfilePageShell initialProfile={profile} />;
}
