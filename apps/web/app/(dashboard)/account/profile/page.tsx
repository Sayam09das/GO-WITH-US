import type { Metadata } from "next";
import Link from "next/link";
import { AccountPageHeader } from "@/components/account/account-page-header";
import { AccountProfilePanel } from "@/components/account/profile/account-profile-panel";
import { Button } from "@/components/ui/button";
import { getUserProfile } from "@/lib/api/users.server";
import { buildPageMetadata, buildPageTitle } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: buildPageTitle("My Profile"),
  description: "Manage your GO WITH US profile.",
  path: "/account/profile",
  noIndex: true,
});

export default async function AccountProfilePage() {
  const profile = await getUserProfile();

  if (!profile) {
    return (
      <div className="container-travel py-10 sm:py-12 lg:py-14">
        <AccountPageHeader
          title="My profile"
          description="Sign in to view and update your profile details."
        />
        <Button asChild className="mt-2">
          <Link href="/sign-in">Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-travel py-10 sm:py-12 lg:py-14">
      <AccountPageHeader title="My profile" description="Your account details from GO WITH US." />
      <AccountProfilePanel initialProfile={profile} />
    </div>
  );
}
