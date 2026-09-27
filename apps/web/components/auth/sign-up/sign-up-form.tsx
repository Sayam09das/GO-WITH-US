"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { AuthBrandHeader, PasswordInput } from "@/components/auth/shared";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register } from "@/lib/api/auth";
import { ApiRequestError } from "@/lib/api/client";
import { AUTH_EMAIL_PATTERN, AUTH_PASSWORD_MIN_LENGTH, SIGN_UP_COPY } from "@/lib/auth";
import { cn } from "@/lib/utils";

function SignUpForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const nextErrors: typeof fieldErrors = {};

    if (!trimmedName) {
      nextErrors.fullName = SIGN_UP_COPY.fullNameRequired;
    }
    if (!AUTH_EMAIL_PATTERN.test(trimmedEmail)) {
      nextErrors.email = SIGN_UP_COPY.invalidEmail;
    }
    if (!password) {
      nextErrors.password = SIGN_UP_COPY.passwordRequired;
    } else if (password.length < AUTH_PASSWORD_MIN_LENGTH) {
      nextErrors.password = SIGN_UP_COPY.passwordTooShort;
    }
    if (!confirmPassword) {
      nextErrors.confirmPassword = SIGN_UP_COPY.confirmPasswordRequired;
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = SIGN_UP_COPY.passwordsMismatch;
    }
    if (!acceptedTerms) {
      nextErrors.terms = SIGN_UP_COPY.termsRequired;
    }

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setFormError(null);
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      await register({
        fullName: trimmedName,
        email: trimmedEmail,
        password,
        confirmPassword,
      });
      router.push(`/verify-email?email=${encodeURIComponent(trimmedEmail)}`);
    } catch (error) {
      setFormError(error instanceof ApiRequestError ? error.message : SIGN_UP_COPY.createError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8">
      <AuthBrandHeader title={SIGN_UP_COPY.title} subtitle={SIGN_UP_COPY.subtitle} />

      <form
        data-auth-reveal
        className="flex flex-col gap-5 will-change-transform"
        onSubmit={handleSubmit}
        noValidate
      >
        <Field>
          <FieldLabel htmlFor="sign-up-full-name">{SIGN_UP_COPY.fullNameLabel}</FieldLabel>
          <Input
            id="sign-up-full-name"
            name="fullName"
            autoComplete="name"
            placeholder={SIGN_UP_COPY.fullNamePlaceholder}
            value={fullName}
            aria-invalid={fieldErrors.fullName ? true : undefined}
            aria-describedby={fieldErrors.fullName ? "sign-up-full-name-error" : undefined}
            className="h-12 rounded-xl bg-soft-gray/80"
            onChange={(event) => {
              setFullName(event.target.value);
              if (fieldErrors.fullName) {
                setFieldErrors((current) => ({ ...current, fullName: undefined }));
              }
            }}
          />
          {fieldErrors.fullName ? (
            <FieldError id="sign-up-full-name-error">{fieldErrors.fullName}</FieldError>
          ) : null}
        </Field>

        <Field>
          <FieldLabel htmlFor="sign-up-email">{SIGN_UP_COPY.emailLabel}</FieldLabel>
          <Input
            id="sign-up-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={SIGN_UP_COPY.emailPlaceholder}
            value={email}
            aria-invalid={fieldErrors.email ? true : undefined}
            aria-describedby={fieldErrors.email ? "sign-up-email-error" : undefined}
            className="h-12 rounded-xl bg-soft-gray/80"
            onChange={(event) => {
              setEmail(event.target.value);
              if (fieldErrors.email) {
                setFieldErrors((current) => ({ ...current, email: undefined }));
              }
            }}
          />
          {fieldErrors.email ? (
            <FieldError id="sign-up-email-error">{fieldErrors.email}</FieldError>
          ) : null}
        </Field>

        <Field>
          <FieldLabel htmlFor="sign-up-password">{SIGN_UP_COPY.passwordLabel}</FieldLabel>
          <PasswordInput
            id="sign-up-password"
            name="password"
            autoComplete="new-password"
            placeholder={SIGN_UP_COPY.passwordPlaceholder}
            value={password}
            aria-invalid={fieldErrors.password ? true : undefined}
            aria-describedby={fieldErrors.password ? "sign-up-password-error" : undefined}
            onChange={(value) => {
              setPassword(value);
              if (fieldErrors.password) {
                setFieldErrors((current) => ({ ...current, password: undefined }));
              }
            }}
          />
          {fieldErrors.password ? (
            <FieldError id="sign-up-password-error">{fieldErrors.password}</FieldError>
          ) : null}
        </Field>

        <Field>
          <FieldLabel htmlFor="sign-up-confirm-password">
            {SIGN_UP_COPY.confirmPasswordLabel}
          </FieldLabel>
          <PasswordInput
            id="sign-up-confirm-password"
            name="confirmPassword"
            autoComplete="new-password"
            placeholder={SIGN_UP_COPY.confirmPasswordPlaceholder}
            value={confirmPassword}
            aria-invalid={fieldErrors.confirmPassword ? true : undefined}
            aria-describedby={
              fieldErrors.confirmPassword ? "sign-up-confirm-password-error" : undefined
            }
            onChange={(value) => {
              setConfirmPassword(value);
              if (fieldErrors.confirmPassword) {
                setFieldErrors((current) => ({ ...current, confirmPassword: undefined }));
              }
            }}
          />
          {fieldErrors.confirmPassword ? (
            <FieldError id="sign-up-confirm-password-error">
              {fieldErrors.confirmPassword}
            </FieldError>
          ) : null}
        </Field>

        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-2">
            <Checkbox
              id="sign-up-terms"
              checked={acceptedTerms}
              onCheckedChange={(checked) => {
                setAcceptedTerms(checked === true);
                if (fieldErrors.terms) {
                  setFieldErrors((current) => ({ ...current, terms: undefined }));
                }
              }}
            />
            <Label
              htmlFor="sign-up-terms"
              className="text-sm leading-relaxed font-normal text-muted-foreground"
            >
              {SIGN_UP_COPY.termsPrefix}{" "}
              <Link
                href={SIGN_UP_COPY.termsHref}
                className="font-medium text-heading hover:text-primary hover:underline"
              >
                {SIGN_UP_COPY.termsLink}
              </Link>
            </Label>
          </div>
          {fieldErrors.terms ? <FieldError>{fieldErrors.terms}</FieldError> : null}
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
          {isSubmitting ? SIGN_UP_COPY.submitting : SIGN_UP_COPY.submit}
        </Button>
      </form>

      <p
        data-auth-reveal
        className="text-center text-sm text-muted-foreground will-change-transform"
      >
        {SIGN_UP_COPY.hasAccount}{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-heading underline-offset-4 transition-colors hover:text-primary hover:underline"
        >
          {SIGN_UP_COPY.signIn}
        </Link>
      </p>
    </div>
  );
}

export { SignUpForm };
