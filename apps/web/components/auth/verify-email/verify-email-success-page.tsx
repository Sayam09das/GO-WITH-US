"use client";

import Link from "next/link";
import { AuthBrandHeader, AuthShell } from "@/components/auth/shared";
import { Button } from "@/components/ui/button";
import { AUTH_VISUALS } from "@/lib/auth";

function VerifyEmailSuccessContent() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8">
      <AuthBrandHeader
        title="Email verified"
        subtitle="Your GO WITH US account is ready. Sign in to start planning."
      />
      <Button asChild className="h-12 rounded-xl text-base font-semibold">
        <Link href="/sign-in">Continue to sign in</Link>
      </Button>
    </div>
  );
}

function VerifyEmailSuccessPage() {
  return <AuthShell form={<VerifyEmailSuccessContent />} visual={AUTH_VISUALS.signIn} />;
}

export { VerifyEmailSuccessPage };
