import type { Metadata } from "next";
import Link from "next/link";
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
        <h1 className="section-heading text-3xl text-heading sm:text-4xl">My profile</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Sign in to view and update your profile details.
        </p>
        <Button asChild className="mt-6">
          <Link href="/sign-in">Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-travel py-10 sm:py-12 lg:py-14">
      <div className="mb-8 max-w-2xl">
        <h1 className="section-heading text-3xl text-heading sm:text-4xl">My profile</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Your account details from GO WITH US.
        </p>
      </div>

      <dl className="grid max-w-2xl gap-4 rounded-[1.25rem] border border-border/60 bg-background p-5 shadow-sm">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Name
          </dt>
          <dd className="mt-1 text-base text-heading">{profile.name}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Email
          </dt>
          <dd className="mt-1 text-base text-heading">{profile.email}</dd>
        </div>
        {profile.country ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Country
            </dt>
            <dd className="mt-1 text-base text-heading">{profile.country}</dd>
          </div>
        ) : null}
        {profile.bio ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Bio
            </dt>
            <dd className="mt-1 text-base text-heading">{profile.bio}</dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}
