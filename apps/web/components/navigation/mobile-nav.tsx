"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId } from "react";
import { AccountNav } from "@/components/navigation/account-nav";
import { BrandLink } from "@/components/navigation/brand-link";
import { NavIconLink } from "@/components/navigation/nav-icon-link";
import { NavLink } from "@/components/navigation/nav-link";
import { IconButton } from "@/components/ui/icon-button";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import type { NavbarOverlayTone, NavbarVisualState } from "@/lib/navigation";
import {
  isAccountActive,
  isNavItemActive,
  navIconClass,
  PRIMARY_NAV_ITEMS,
  UTILITY_NAV_ITEMS,
} from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  visualState: NavbarVisualState;
  overlayTone: NavbarOverlayTone;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const MENU_EASE: [number, number, number, number] = [0, 0, 0.2, 1];
const EXIT_EASE: [number, number, number, number] = [0.4, 0, 1, 1];
const STAGGER = 0.04;

function MobileNav({ visualState, overlayTone, isOpen, onOpenChange }: MobileNavProps) {
  const pathname = usePathname();
  const menuId = useId();
  const reducedMotion = useReducedMotion();
  const isOverlay = visualState === "transparent";

  const closeMenu = useCallback(() => onOpenChange(false), [onOpenChange]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeMenu]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: close mobile menu when route changes
  useEffect(() => {
    onOpenChange(false);
  }, [pathname, onOpenChange]);

  const motionDuration = reducedMotion ? 0.01 : 0.28;
  const itemVariants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 8 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: motionDuration,
        ease: MENU_EASE,
        delay: reducedMotion ? 0 : index * STAGGER,
      },
    }),
    exit: {
      opacity: 0,
      y: reducedMotion ? 0 : -4,
      transition: { duration: reducedMotion ? 0.01 : 0.18, ease: EXIT_EASE },
    },
  };

  const allPrimary = PRIMARY_NAV_ITEMS;
  const utilityItems = UTILITY_NAV_ITEMS;

  return (
    <div className="lg:hidden">
      <div className="flex min-h-16 items-center justify-between gap-4">
        <BrandLink visualState={visualState} overlayTone={overlayTone} onNavigate={closeMenu} />

        <IconButton
          label={isOpen ? "Close menu" : "Open menu"}
          icon={isOpen ? X : Menu}
          variant="ghost"
          aria-expanded={isOpen}
          aria-controls={menuId}
          onClick={() => onOpenChange(!isOpen)}
          className={cn(isOverlay && !isOpen && navIconClass(visualState, overlayTone, false))}
        />
      </div>

      <AnimatePresence>
        {isOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 z-40 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: motionDuration, ease: MENU_EASE }}
              onClick={closeMenu}
            />

            <motion.div
              id={menuId}
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              className="fixed inset-x-0 top-0 z-50 flex max-h-[100dvh] flex-col bg-background shadow-lg"
              initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : -8 }}
              transition={{ duration: motionDuration, ease: MENU_EASE }}
            >
              <div className="flex min-h-16 items-center justify-between border-b border-border/60 px-6">
                <BrandLink visualState="default" onNavigate={closeMenu} />
                <IconButton label="Close menu" icon={X} variant="ghost" onClick={closeMenu} />
              </div>

              <nav
                aria-label="Mobile"
                className="container-travel flex flex-1 flex-col overflow-y-auto py-8"
              >
                <div className="flex flex-col gap-1">
                  {allPrimary.map((item, index) => (
                    <motion.div
                      key={item.href}
                      custom={index}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <NavLink
                        href={item.href}
                        label={item.label}
                        isActive={isNavItemActive(pathname, item.match)}
                        visualState="default"
                        className="destination-title min-h-12 px-0 text-2xl sm:text-3xl"
                        onNavigate={closeMenu}
                      />
                    </motion.div>
                  ))}
                </div>

                <div className="my-8 h-px bg-border/70" aria-hidden="true" />

                <div className="flex flex-col gap-2">
                  {utilityItems.map((item, index) => {
                    if (!item.icon) {
                      return null;
                    }

                    return (
                      <motion.div
                        key={item.href}
                        custom={allPrimary.length + index}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <NavIconLink
                          href={item.href}
                          label={item.label}
                          icon={item.icon}
                          isActive={isNavItemActive(pathname, item.match)}
                          visualState="default"
                          showLabel
                          className="min-h-12 w-full justify-start px-0 text-base"
                          onNavigate={closeMenu}
                        />
                      </motion.div>
                    );
                  })}

                  <motion.div
                    custom={allPrimary.length + utilityItems.length}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="pt-2"
                  >
                    <AccountNav
                      isActive={isAccountActive(pathname)}
                      visualState="default"
                      className="min-h-12 w-fit px-4"
                      onNavigate={closeMenu}
                    />
                  </motion.div>
                </div>
              </nav>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export { MobileNav };
