"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";
import { AuthBrandHeader, PasswordInput } from "@/components/auth/shared";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { resetPassword } from "@/lib/api/auth";
import { ApiRequestError } from "@/lib/api/client";
import { AUTH_PASSWORD_MIN_LENGTH, RESET_PASSWORD_COPY } from "@/lib/auth";
import { cn } from "@/lib/utils";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  if (!token) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col gap-8">
        <AuthBrandHeader
          title={RESET_PASSWORD_COPY.missingTokenTitle}
          subtitle={RESET_PASSWORD_COPY.missingTokenDescription}
        />
        <div data-auth-reveal className="flex flex-col gap-4 will-change-transform">
          <Button asChild className="h-12 rounded-xl text-base font-semibold">
            <Link href="/forgot-password">{RESET_PASSWORD_COPY.requestNewLink}</Link>
          </Button>
          <Link
            href="/sign-in"
            className="text-center text-sm font-semibold text-heading underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            {RESET_PASSWORD_COPY.backToSignIn}
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: typeof fieldErrors = {};

    if (!password) {
      nextErrors.password = RESET_PASSWORD_COPY.passwordRequired;
    } else if (password.length < AUTH_PASSWORD_MIN_LENGTH) {
      nextErrors.password = RESET_PASSWORD_COPY.passwordTooShort;
    }
    if (!confirmPassword) {
      nextErrors.confirmPassword = RESET_PASSWORD_COPY.confirmPasswordRequired;
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = RESET_PASSWORD_COPY.passwordsMismatch;
    }

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword({
        token,
        password,
        confirmPassword,
      });
      setIsSuccess(true);
    } catch (error) {
      setFieldErrors({
        password:
          error instanceof ApiRequestError ? error.message : RESET_PASSWORD_COPY.passwordRequired,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col gap-8">
        <AuthBrandHeader
          title={RESET_PASSWORD_COPY.successTitle}
          subtitle={RESET_PASSWORD_COPY.successDescription}
        />
        <div data-auth-reveal className="will-change-transform">
          <Button asChild className="h-12 w-full rounded-xl text-base font-semibold">
            <Link href="/sign-in">{RESET_PASSWORD_COPY.signIn}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8">
      <AuthBrandHeader title={RESET_PASSWORD_COPY.title} subtitle={RESET_PASSWORD_COPY.subtitle} />

      <form
        data-auth-reveal
        className="flex flex-col gap-5 will-change-transform"
        onSubmit={handleSubmit}
        noValidate
      >
        <Field>
          <FieldLabel htmlFor="reset-password">{RESET_PASSWORD_COPY.passwordLabel}</FieldLabel>
          <PasswordInput
            id="reset-password"
            name="password"
            autoComplete="new-password"
            placeholder={RESET_PASSWORD_COPY.passwordPlaceholder}
            value={password}
            aria-invalid={fieldErrors.password ? true : undefined}
            aria-describedby={fieldErrors.password ? "reset-password-error" : undefined}
            onChange={(value) => {
              setPassword(value);
              if (fieldErrors.password) {
                setFieldErrors((current) => ({ ...current, password: undefined }));
              }
            }}
          />
          {fieldErrors.password ? (
            <FieldError id="reset-password-error">{fieldErrors.password}</FieldError>
          ) : null}
        </Field>

        <Field>
          <FieldLabel htmlFor="reset-confirm-password">
            {RESET_PASSWORD_COPY.confirmPasswordLabel}
          </FieldLabel>
          <PasswordInput
            id="reset-confirm-password"
            name="confirmPassword"
            autoComplete="new-password"
            placeholder={RESET_PASSWORD_COPY.confirmPasswordPlaceholder}
            value={confirmPassword}
            aria-invalid={fieldErrors.confirmPassword ? true : undefined}
            aria-describedby={
              fieldErrors.confirmPassword ? "reset-confirm-password-error" : undefined
            }
            onChange={(value) => {
              setConfirmPassword(value);
              if (fieldErrors.confirmPassword) {
                setFieldErrors((current) => ({ ...current, confirmPassword: undefined }));
              }
            }}
          />
          {fieldErrors.confirmPassword ? (
            <FieldError id="reset-confirm-password-error">{fieldErrors.confirmPassword}</FieldError>
          ) : null}
        </Field>

        <Button
          type="submit"
          disabled={isSubmitting}
          className={cn("h-12 w-full rounded-xl text-base font-semibold")}
        >
          {isSubmitting ? RESET_PASSWORD_COPY.submitting : RESET_PASSWORD_COPY.submit}
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
          {RESET_PASSWORD_COPY.backToSignIn}
        </Link>
      </p>
    </div>
  );
}

export { ResetPasswordForm };
