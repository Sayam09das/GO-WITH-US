"use client";

import { ArrowUpRight, Check } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { STAY_INSPIRED_COPY } from "@/lib/landing/stay-inspired";
import { cn } from "@/lib/utils";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function StayInspiredForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setError(STAY_INSPIRED_COPY.invalidEmail);
      setIsSubmitted(false);
      return;
    }

    setError(null);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div
        data-si-success
        className="flex flex-col gap-2 rounded-2xl border border-primary/20 bg-soft-orange/50 px-5 py-5 sm:px-6 sm:py-6"
        role="status"
      >
        <div className="inline-flex items-center gap-2 text-primary">
          <Check aria-hidden="true" className="size-4" />
          <p className="text-sm font-semibold sm:text-base">{STAY_INSPIRED_COPY.successTitle}</p>
        </div>
        <p className="text-sm text-muted-foreground sm:text-base">
          {STAY_INSPIRED_COPY.successMessage}
        </p>
      </div>
    );
  }

  return (
    <form data-si-form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4" noValidate>
      <Field className="gap-3">
        <div className="flex flex-col gap-3 min-[520px]:flex-row min-[520px]:items-stretch">
          <Input
            id="stay-inspired-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            placeholder={STAY_INSPIRED_COPY.emailPlaceholder}
            aria-label={STAY_INSPIRED_COPY.emailLabel}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "stay-inspired-email-error" : "stay-inspired-privacy"}
            className={cn(
              "h-12 rounded-xl bg-background/80 px-4 text-base shadow-none min-[520px]:min-w-0 min-[520px]:flex-1",
              error && "border-destructive",
            )}
            onChange={(event) => {
              setEmail(event.target.value);
              if (error) {
                setError(null);
              }
            }}
          />

          <Button
            type="submit"
            size="lg"
            className="h-12 w-full shrink-0 rounded-xl px-6 min-[520px]:w-auto"
          >
            {STAY_INSPIRED_COPY.submit}
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Button>
        </div>

        {error ? (
          <FieldError id="stay-inspired-email-error">{error}</FieldError>
        ) : (
          <p id="stay-inspired-privacy" className="text-xs text-muted-foreground sm:text-sm">
            {STAY_INSPIRED_COPY.privacy}
          </p>
        )}
      </Field>
    </form>
  );
}

export { StayInspiredForm };
