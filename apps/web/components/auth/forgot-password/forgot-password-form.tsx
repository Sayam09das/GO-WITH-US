"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { AuthBrandHeader } from "@/components/auth/shared";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AUTH_EMAIL_PATTERN, FORGOT_PASSWORD_COPY } from "@/lib/auth";
import { cn } from "@/lib/utils";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    if (!AUTH_EMAIL_PATTERN.test(trimmedEmail)) {
      setFieldError(FORGOT_PASSWORD_COPY.invalidEmail);
      return;
    }

    setFieldError(null);
    setIsSubmitting(true);

    // UI-only — always show success per AUTHENTICATION.md (no email enumeration).
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col gap-8">
        <AuthBrandHeader
          title={FORGOT_PASSWORD_COPY.successTitle}
          subtitle={FORGOT_PASSWORD_COPY.successDescription}
        />

        <div data-auth-reveal className="flex flex-col gap-4 will-change-transform">
          <Button
            type="button"
            variant="outline"
            className="h-12 rounded-xl"
            onClick={() => {
              setIsSubmitted(false);
              setEmail("");
            }}
          >
            {FORGOT_PASSWORD_COPY.resend}
          </Button>
          <Link
            href="/sign-in"
            className="text-center text-sm font-semibold text-heading underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            {FORGOT_PASSWORD_COPY.backToSignIn}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8">
      <AuthBrandHeader
        title={FORGOT_PASSWORD_COPY.title}
        subtitle={FORGOT_PASSWORD_COPY.subtitle}
      />

      <form
        data-auth-reveal
        className="flex flex-col gap-5 will-change-transform"
        onSubmit={handleSubmit}
        noValidate
      >
        <Field>
          <FieldLabel htmlFor="forgot-password-email">{FORGOT_PASSWORD_COPY.emailLabel}</FieldLabel>
          <Input
            id="forgot-password-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={FORGOT_PASSWORD_COPY.emailPlaceholder}
            value={email}
            aria-invalid={fieldError ? true : undefined}
            aria-describedby={fieldError ? "forgot-password-email-error" : undefined}
            className="h-12 rounded-xl bg-soft-gray/80"
            onChange={(event) => {
              setEmail(event.target.value);
              if (fieldError) {
                setFieldError(null);
              }
            }}
          />
          {fieldError ? (
            <FieldError id="forgot-password-email-error">{fieldError}</FieldError>
          ) : null}
        </Field>

        <Button
          type="submit"
          disabled={isSubmitting}
          className={cn("h-12 w-full rounded-xl text-base font-semibold")}
        >
          {isSubmitting ? FORGOT_PASSWORD_COPY.submitting : FORGOT_PASSWORD_COPY.submit}
        </Button>
      </form>

      <p
        data-auth-reveal
        className="text-center text-sm text-muted-foreground will-change-transform"
      >
        <Link
          href="/sign-in"
          className="font-semibold text-heading underline-offset-4 transition-colors hover:text-primary hover:underline"
        >
          {FORGOT_PASSWORD_COPY.backToSignIn}
        </Link>
      </p>
    </div>
  );
}

export { ForgotPasswordForm };
