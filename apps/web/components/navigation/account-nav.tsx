"use client";

import Link from "next/link";
import { NavbarProfileMenu } from "@/components/navigation/navbar-profile-menu";
import { Button } from "@/components/ui/button";
import { useAuthSession } from "@/lib/auth";
import {
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
  className?: string;
  onNavigate?: () => void;
}

function AccountNav({
  isActive,
  visualState,
  overlayTone = "light",
  className,
  onNavigate,
}: AccountNavProps) {
  const { user, isLoading } = useAuthSession();

  if (isLoading) {
    return (
      <span
        aria-hidden="true"
        className={cn("inline-block h-11 min-w-[5.5rem] shrink-0 rounded-lg opacity-0", className)}
      />
    );
  }

  if (user) {
    return (
      <NavbarProfileMenu
        user={user}
        visualState={visualState}
        overlayTone={overlayTone}
        isActive={isActive}
        className={className}
        onNavigate={onNavigate}
      />
    );
  }

  return (
    <Button asChild variant="default" size="default" className={className}>
      <Link
        href={ACCOUNT_SIGN_IN_HREF}
        onClick={onNavigate}
        aria-current={isActive ? "page" : undefined}
        className={cn(accountNavClass(visualState, overlayTone, isActive))}
      >
        Sign in
      </Link>
    </Button>
  );
}

export { AccountNav };
