"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { NavCountBadge, navCountAriaSuffix } from "@/components/navigation/nav-count-badge";
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
  badgeCount?: number;
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
  badgeCount = 0,
  className,
  onNavigate,
}: NavIconLinkProps) {
  const ariaLabel = showLabel
    ? undefined
    : badgeCount > 0 && (href === "/saved" || href === "/trips")
      ? `${label}${navCountAriaSuffix(badgeCount, href === "/trips" ? "trip" : "saved place")}`
      : label;

  const link = (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      aria-label={ariaLabel}
      className={cn(
        "nav-link inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md px-2.5 text-sm transition-colors duration-150 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        navIconClass(visualState, overlayTone, isActive),
        className,
      )}
    >
      <span className="relative inline-flex shrink-0">
        <Icon aria-hidden="true" className="size-5 shrink-0" />
        {!showLabel ? (
          <NavCountBadge
            count={badgeCount}
            className="absolute -right-2 -top-2 min-w-[1rem] px-1 py-px text-[0.5625rem]"
          />
        ) : null}
      </span>
      {showLabel ? (
        <>
          <span>{label}</span>
          <NavCountBadge count={badgeCount} className="ml-auto" />
        </>
      ) : null}
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
