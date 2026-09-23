"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import {
  AuthBrandHeader,
  AuthDivider,
  AuthSocialButtons,
  PasswordInput,
} from "@/components/auth/shared";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AUTH_EMAIL_PATTERN, SIGN_IN_COPY } from "@/lib/auth";
import { cn } from "@/lib/utils";

function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [socialNotice, setSocialNotice] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSocialNotice(null);

    const trimmedEmail = email.trim();
    const nextErrors: { email?: string; password?: string } = {};

    if (!AUTH_EMAIL_PATTERN.test(trimmedEmail)) {
      nextErrors.email = SIGN_IN_COPY.invalidEmail;
    }
    if (!password) {
      nextErrors.password = SIGN_IN_COPY.passwordRequired;
    }

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setFormError(null);
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    await new Promise((resolve) => window.setTimeout(resolve, 650));
    setIsSubmitting(false);
    setFormError(SIGN_IN_COPY.invalidCredentials);
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8">
      <AuthBrandHeader title={SIGN_IN_COPY.title} subtitle={SIGN_IN_COPY.subtitle} />

      <div data-auth-reveal className="will-change-transform">
        <AuthSocialButtons
          googleLabel={SIGN_IN_COPY.googleLabel}
          facebookLabel={SIGN_IN_COPY.facebookLabel}
          onUnavailable={() => setSocialNotice(SIGN_IN_COPY.socialComingSoon)}
        />
        {socialNotice ? (
          <p role="status" className="mt-3 text-sm text-muted-foreground">
            {socialNotice}
          </p>
        ) : null}
      </div>

      <AuthDivider label={SIGN_IN_COPY.divider} />

      <form
        data-auth-reveal
        className="flex flex-col gap-5 will-change-transform"
        onSubmit={handleSubmit}
        noValidate
      >
        <Field>
          <FieldLabel htmlFor="sign-in-email">{SIGN_IN_COPY.emailLabel}</FieldLabel>
          <Input
            id="sign-in-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={SIGN_IN_COPY.emailPlaceholder}
            value={email}
            aria-invalid={fieldErrors.email ? true : undefined}
            aria-describedby={fieldErrors.email ? "sign-in-email-error" : undefined}
            className="h-12 rounded-xl bg-soft-gray/80"
            onChange={(event) => {
              setEmail(event.target.value);
              if (fieldErrors.email) {
                setFieldErrors((current) => ({ ...current, email: undefined }));
              }
            }}
          />
          {fieldErrors.email ? (
            <FieldError id="sign-in-email-error">{fieldErrors.email}</FieldError>
          ) : null}
        </Field>

        <Field>
          <FieldLabel htmlFor="sign-in-password">{SIGN_IN_COPY.passwordLabel}</FieldLabel>
          <PasswordInput
            id="sign-in-password"
            name="password"
            autoComplete="current-password"
            placeholder={SIGN_IN_COPY.passwordPlaceholder}
            value={password}
            aria-invalid={fieldErrors.password ? true : undefined}
            aria-describedby={fieldErrors.password ? "sign-in-password-error" : undefined}
            onChange={(value) => {
              setPassword(value);
              if (fieldErrors.password) {
                setFieldErrors((current) => ({ ...current, password: undefined }));
              }
            }}
          />
          {fieldErrors.password ? (
            <FieldError id="sign-in-password-error">{fieldErrors.password}</FieldError>
          ) : null}
        </Field>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="sign-in-remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
            />
            <Label htmlFor="sign-in-remember" className="text-sm font-normal text-muted-foreground">
              {SIGN_IN_COPY.rememberMe}
            </Label>
          </div>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
          >
            {SIGN_IN_COPY.forgotPassword}
          </Link>
        </div>

        {formError ? (
          <p role="alert" className="text-sm text-destructive">
            {formError}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={isSubmitting}
          className={cn("h-12 w-full rounded-xl text-base font-semibold")}
        >
          {isSubmitting ? SIGN_IN_COPY.submitting : SIGN_IN_COPY.submit}
        </Button>
      </form>

      <p
        data-auth-reveal
        className="text-center text-sm text-muted-foreground will-change-transform"
      >
        {SIGN_IN_COPY.noAccount}{" "}
        <Link
          href="/sign-up"
          className="font-semibold text-heading underline-offset-4 transition-colors hover:text-primary hover:underline"
        >
          {SIGN_IN_COPY.signUp}
        </Link>
      </p>
    </div>
  );
}

export { SignInForm };
