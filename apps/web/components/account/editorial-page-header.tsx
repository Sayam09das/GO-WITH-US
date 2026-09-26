import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EditorialPageHeaderProps {
  eyebrow: string;
  heading: string;
  supporting: string;
  action?: ReactNode;
  className?: string;
}

function EditorialPageHeader({
  eyebrow,
  heading,
  supporting,
  action,
  className,
}: EditorialPageHeaderProps) {
  return (
    <header
      className={cn(
        "mb-10 flex flex-col gap-8 border-b border-border/60 pb-10 sm:mb-12 sm:pb-12 lg:flex-row lg:items-end lg:justify-between lg:gap-10",
        className,
      )}
    >
      <div className="flex max-w-2xl flex-col gap-3 sm:gap-4">
        <p className="label-text text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {eyebrow}
        </p>
        <h1 className="hero-heading text-[2rem] font-semibold leading-[1.08] tracking-tight text-heading sm:text-4xl lg:text-[2.75rem]">
          {heading}
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">{supporting}</p>
      </div>
      {action ? <div className="w-full shrink-0 lg:w-auto">{action}</div> : null}
    </header>
  );
}

export { EditorialPageHeader };
