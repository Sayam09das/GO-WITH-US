import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordPage } from "@/components/auth";
import { buildPageMetadata, buildPageTitle } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: buildPageTitle("Reset password"),
  description: "Set a new password for your GO WITH US account.",
  path: "/reset-password",
  noIndex: true,
});

function ResetPasswordFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <p className="text-sm text-muted-foreground">Loading…</p>
    </div>
  );
}

export default function ResetPasswordRoute() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordPage />
    </Suspense>
  );
}
