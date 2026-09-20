"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { DesktopNav } from "@/components/navigation/desktop-nav";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { useNavbarScroll } from "@/lib/hooks/use-navbar-scroll";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import {
  type NavbarOverlayTone,
  type NavbarVariant,
  resolveNavbarVariant,
  resolveNavbarVisualState,
} from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface NavbarProps {
  /** Override route-derived variant when needed. */
  variant?: NavbarVariant;
  /** Use `dark` when the hero sits on a dark image; defaults to readable dark text. */
  overlayTone?: NavbarOverlayTone;
  className?: string;
}

function Navbar({ variant, overlayTone = "light", className }: NavbarProps) {
  const pathname = usePathname();
  const isScrolled = useNavbarScroll();
  const reducedMotion = useReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);

  const baseVariant = variant ?? resolveNavbarVariant(pathname);
  const visualState = resolveNavbarVisualState(baseVariant, isScrolled);

  return (
    <motion.header
      className={cn(
        "z-50 w-full transition-[padding,background-color,border-color,box-shadow]",
        visualState === "transparent" ? "fixed inset-x-0 top-0 bg-transparent" : "sticky top-0",
        visualState === "scrolled" &&
          "border-b border-border/60 bg-background/95 shadow-xs backdrop-blur-[2px]",
        visualState === "default" &&
          baseVariant === "default" &&
          "border-b border-border/50 bg-background",
        className,
      )}
      initial={false}
      animate={{
        paddingTop: isScrolled && !reducedMotion ? 12 : 16,
        paddingBottom: isScrolled && !reducedMotion ? 12 : 16,
      }}
      transition={{ duration: reducedMotion ? 0.01 : 0.22, ease: [0, 0, 0.2, 1] }}
    >
      <div className="container-travel">
        <DesktopNav visualState={visualState} overlayTone={overlayTone} />
        <MobileNav
          visualState={visualState}
          overlayTone={overlayTone}
          isOpen={mobileOpen}
          onOpenChange={setMobileOpen}
        />
      </div>
    </motion.header>
  );
}

export { Navbar, type NavbarProps };
