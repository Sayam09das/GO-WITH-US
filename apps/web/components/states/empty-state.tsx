import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateAction {
  href: string;
  label: string;
}

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  className?: string;
}

function EmptyState({
  title,
  description,
  icon: Icon,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center gap-6 text-center", className)}>
      {Icon ? (
        <div
          aria-hidden="true"
          className="flex size-14 items-center justify-center rounded-2xl bg-section text-primary"
        >
          <Icon className="size-6" />
        </div>
      ) : null}

      <div className="flex flex-col gap-3">
        <h2 className="section-heading text-2xl sm:text-3xl">{title}</h2>
        <p className="text-base leading-relaxed text-muted-foreground">{description}</p>
      </div>

      {action || secondaryAction ? (
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">
          {action ? (
            <Button asChild className="w-full sm:w-auto">
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ) : null}
          {secondaryAction ? (
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export { EmptyState, type EmptyStateAction, type EmptyStateProps };
