"use client";

import type { LucideIcon } from "lucide-react";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateAction {
  href: string;
  label: string;
}

interface ErrorStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  onRetry?: () => void;
  retryLabel?: string;
  homeAction?: ErrorStateAction;
  secondaryAction?: ErrorStateAction;
  referenceId?: string;
  className?: string;
}

function ErrorState({
  title,
  description,
  icon: Icon = AlertCircle,
  onRetry,
  retryLabel = "Try again",
  homeAction = { href: "/", label: "Go home" },
  secondaryAction,
  referenceId,
  className,
}: ErrorStateProps) {
  return (
    <div role="alert" className={cn("flex flex-col items-center gap-6 text-center", className)}>
      <div
        aria-hidden="true"
        className="flex size-14 items-center justify-center rounded-2xl bg-soft-orange text-primary"
      >
        <Icon className="size-6" />
      </div>

      <div className="flex flex-col gap-3">
        <h1 className="hero-heading text-3xl sm:text-4xl">{title}</h1>
        <p className="text-base leading-relaxed text-muted-foreground">{description}</p>
        {referenceId ? (
          <p className="text-xs text-muted-foreground/80">Reference: {referenceId}</p>
        ) : null}
      </div>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">
        {onRetry ? (
          <Button type="button" onClick={onRetry} className="w-full sm:w-auto">
            {retryLabel}
          </Button>
        ) : null}

        {secondaryAction ? (
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
          </Button>
        ) : null}

        {!secondaryAction && homeAction ? (
          <Button asChild variant={onRetry ? "outline" : "default"} className="w-full sm:w-auto">
            <Link href={homeAction.href}>{homeAction.label}</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export { ErrorState, type ErrorStateAction, type ErrorStateProps };
