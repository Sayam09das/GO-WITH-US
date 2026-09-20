"use client";

import Link from "next/link";
import type { NavbarOverlayTone, NavbarVisualState } from "@/lib/navigation";
import { brandWordmarkClass } from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface BrandLinkProps {
  visualState: NavbarVisualState;
  overlayTone?: NavbarOverlayTone;
  className?: string;
  onNavigate?: () => void;
}

function BrandLink({ visualState, overlayTone = "light", className, onNavigate }: BrandLinkProps) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      aria-label="GO WITH US — Home"
      className={cn(
        "group inline-flex min-h-11 shrink-0 items-center gap-2.5 rounded-md outline-none transition-colors duration-150 focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-xs transition-transform duration-150 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      >
        G
      </span>
      <span
        className={cn(
          "hero-heading text-lg font-semibold tracking-tight transition-colors duration-150 sm:text-xl",
          brandWordmarkClass(visualState, overlayTone),
        )}
      >
        GO WITH US
      </span>
    </Link>
  );
}

export { BrandLink };
