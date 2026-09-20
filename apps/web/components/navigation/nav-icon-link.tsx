"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { type NavbarOverlayTone, type NavbarVisualState, navIconClass } from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface NavIconLinkProps {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  visualState: NavbarVisualState;
  overlayTone?: NavbarOverlayTone;
  showLabel?: boolean;
  className?: string;
  onNavigate?: () => void;
}

function NavIconLink({
  href,
  label,
  icon: Icon,
  isActive,
  visualState,
  overlayTone = "light",
  showLabel = false,
  className,
  onNavigate,
}: NavIconLinkProps) {
  const link = (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      aria-label={showLabel ? undefined : label}
      className={cn(
        "nav-link inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md px-2.5 text-sm transition-colors duration-150 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        navIconClass(visualState, overlayTone, isActive),
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-5 shrink-0" />
      {showLabel ? <span>{label}</span> : null}
    </Link>
  );

  if (showLabel) {
    return link;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}

export { NavIconLink };
