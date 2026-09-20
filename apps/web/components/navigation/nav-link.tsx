"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import {
  type NavbarOverlayTone,
  type NavbarVisualState,
  navIndicatorClass,
  navLinkTextClass,
} from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
  visualState: NavbarVisualState;
  overlayTone?: NavbarOverlayTone;
  className?: string;
  onNavigate?: () => void;
}

function NavLink({
  href,
  label,
  isActive,
  visualState,
  overlayTone = "light",
  className,
  onNavigate,
}: NavLinkProps) {
  const reducedMotion = useReducedMotion();

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "nav-link group relative inline-flex min-h-11 items-center rounded-md px-2 text-sm transition-colors duration-150 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        navLinkTextClass(visualState, overlayTone, isActive),
        className,
      )}
    >
      <span>{label}</span>
      {!reducedMotion && isActive ? (
        <motion.span
          layoutId="navbar-active-indicator"
          className={cn(
            "absolute inset-x-2 -bottom-0.5 h-0.5",
            navIndicatorClass(visualState, overlayTone),
          )}
          transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
        />
      ) : (
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-x-2 -bottom-0.5 h-0.5 origin-left scale-x-0 transition-transform duration-200 ease-out group-hover:scale-x-100 motion-reduce:transition-none",
            isActive && "scale-x-100",
            navIndicatorClass(visualState, overlayTone),
          )}
        />
      )}
    </Link>
  );
}

export { NavLink };
