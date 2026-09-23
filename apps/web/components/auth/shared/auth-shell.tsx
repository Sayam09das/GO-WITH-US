"use client";

import { useRef } from "react";
import { AuthVisual } from "@/components/auth/shared/auth-visual";
import { useAuthPageAnimation } from "@/components/auth/shared/use-auth-page-animation";
import type { AuthVisualConfig } from "@/lib/auth";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface AuthShellProps {
  form: React.ReactNode;
  visual: AuthVisualConfig;
}

function AuthShell({ form, visual }: AuthShellProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useAuthPageAnimation(rootRef, reducedMotion);

  return (
    <div
      ref={rootRef}
      className={cn(
        "min-h-screen bg-background",
        reducedMotion &&
          "[&_[data-auth-reveal]]:opacity-100 [&_[data-auth-visual]]:opacity-100 [&_[data-auth-visual-copy]]:opacity-100",
      )}
    >
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div className="flex items-center justify-center px-5 py-10 sm:px-8 sm:py-12 lg:px-12 xl:px-16">
          {form}
        </div>

        <div className="hidden p-3 lg:block lg:p-4 xl:p-5">
          <AuthVisual visual={visual} />
        </div>
      </div>
    </div>
  );
}

export { AuthShell };
