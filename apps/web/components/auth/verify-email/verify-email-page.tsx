"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { AuthBrandHeader, AuthShell } from "@/components/auth/shared";
import { Button } from "@/components/ui/button";
import { resendVerification } from "@/lib/api/auth";
import { ApiRequestError } from "@/lib/api/client";
import { AUTH_VISUALS } from "@/lib/auth";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const maskedEmail = email
    ? `${email.slice(0, 1)}***@${email.split("@")[1] ?? "email"}`
    : "your email";

  async function handleResend() {
    if (!email) {
      setError("Enter your email on the sign-up page to request a new verification link.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await resendVerification({ email });
      setMessage(result.message);
    } catch (requestError) {
      setError(
        requestError instanceof ApiRequestError
          ? requestError.message
          : "Unable to resend verification email.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8">
      <AuthBrandHeader
        title="Check your inbox"
        subtitle={`We sent a verification link to ${maskedEmail}. Verify your email before signing in.`}
      />

      {message ? (
        <p role="status" className="text-sm text-muted-foreground">
          {message}
        </p>
      ) : null}

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-4">
        <Button
          type="button"
          variant="outline"
          className="h-12 rounded-xl"
          disabled={isSubmitting}
          onClick={() => {
            void handleResend();
          }}
        >
          {isSubmitting ? "Sending..." : "Resend verification email"}
        </Button>
        <Button asChild className="h-12 rounded-xl text-base font-semibold">
          <Link href="/sign-in">Continue to sign in</Link>
        </Button>
      </div>
    </div>
  );
}

function VerifyEmailPage() {
  return <AuthShell form={<VerifyEmailContent />} visual={AUTH_VISUALS.signUp} />;
}

export { VerifyEmailPage };
