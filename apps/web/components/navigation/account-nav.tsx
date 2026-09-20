"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ACCOUNT_HREF,
  ACCOUNT_SIGN_IN_HREF,
  accountNavClass,
  type NavbarOverlayTone,
  type NavbarVisualState,
} from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface AccountNavProps {
  isActive: boolean;
  visualState: NavbarVisualState;
  overlayTone?: NavbarOverlayTone;
  /** When auth ships, swap to profile trigger without changing nav structure. */
  isSignedIn?: boolean;
  className?: string;
  onNavigate?: () => void;
}

function AccountNav({
  isActive,
  visualState,
  overlayTone = "light",
  isSignedIn = false,
  className,
  onNavigate,
}: AccountNavProps) {
  const href = isSignedIn ? ACCOUNT_HREF : ACCOUNT_SIGN_IN_HREF;
  const label = isSignedIn ? "Account" : "Sign in";

  if (isSignedIn) {
    return (
      <Link
        href={href}
        onClick={onNavigate}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "nav-link inline-flex min-h-11 items-center rounded-md px-3.5 text-sm transition-colors duration-150 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
          accountNavClass(visualState, overlayTone, isActive),
          className,
        )}
      >
        {label}
      </Link>
    );
  }

  return (
    <Button asChild variant="default" size="default" className={className}>
      <Link href={href} onClick={onNavigate} aria-current={isActive ? "page" : undefined}>
        {label}
      </Link>
    </Button>
  );
}

export { AccountNav };
