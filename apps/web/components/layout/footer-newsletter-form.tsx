"use client";

import { Check, Mail, Send } from "lucide-react";
import { type FormEvent, useState } from "react";
import { FOOTER_COPY } from "@/lib/layout/footer";
import { cn } from "@/lib/utils";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function FooterNewsletterForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setError(FOOTER_COPY.invalidEmail);
      setIsSubmitted(false);
      return;
    }

    setError(null);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div
        role="status"
        className="inline-flex w-full max-w-md items-center gap-2 rounded-full border border-primary/20 bg-card px-5 py-3 text-sm text-heading sm:max-w-lg"
      >
        <Check aria-hidden="true" className="size-4 shrink-0 text-primary" />
        {FOOTER_COPY.successMessage}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="relative w-full max-w-md sm:max-w-lg">
      <label htmlFor="footer-email" className="sr-only">
        {FOOTER_COPY.emailLabel}
      </label>
      <Mail
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 size-[1.125rem] -translate-y-1/2 text-muted-foreground"
      />
      <input
        id="footer-email"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        value={email}
        placeholder={FOOTER_COPY.emailPlaceholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "footer-email-error" : undefined}
        className={cn(
          "h-12 w-full rounded-full border border-border bg-card py-2 pr-16 pl-11 text-sm text-heading shadow-xs outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground focus-visible:border-primary/40 focus-visible:ring-[3px] focus-visible:ring-primary/15 sm:h-[3.25rem] sm:text-base",
          error && "border-destructive focus-visible:ring-destructive/20",
        )}
        onChange={(event) => {
          setEmail(event.target.value);
          if (error) {
            setError(null);
          }
        }}
      />
      <button
        type="submit"
        aria-label={FOOTER_COPY.subscribe}
        className="absolute top-1/2 right-1.5 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:size-10"
      >
        <Send aria-hidden="true" className="size-4" />
      </button>
      {error ? (
        <p id="footer-email-error" role="alert" className="mt-2 text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </form>
  );
}

export { FooterNewsletterForm };
