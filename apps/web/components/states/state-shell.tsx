import type * as React from "react";
import { cn } from "@/lib/utils";

interface StateShellProps {
  children: React.ReactNode;
  className?: string;
  /** Visually hidden prefix for screen readers when the visible title differs. */
  ariaLabel?: string;
}

function StateShell({ children, className, ariaLabel }: StateShellProps) {
  return (
    <main
      className={cn("min-h-[calc(100vh-4rem)] bg-background", className)}
      aria-label={ariaLabel}
    >
      <section className="container-travel flex min-h-[inherit] flex-col items-center justify-center px-6 py-16 sm:py-24">
        <div className="mx-auto flex w-full max-w-lg flex-col items-center text-center">
          {children}
        </div>
      </section>
    </main>
  );
}

export { StateShell };
