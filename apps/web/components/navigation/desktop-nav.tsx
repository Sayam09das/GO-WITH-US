"use client";

import { usePathname } from "next/navigation";
import { AccountNav } from "@/components/navigation/account-nav";
import { BrandLink } from "@/components/navigation/brand-link";
import { NavIconLink } from "@/components/navigation/nav-icon-link";
import { NavLink } from "@/components/navigation/nav-link";
import type { NavbarOverlayTone, NavbarVisualState } from "@/lib/navigation";
import {
  isAccountActive,
  isNavItemActive,
  PRIMARY_NAV_ITEMS,
  UTILITY_NAV_ITEMS,
} from "@/lib/navigation";

interface DesktopNavProps {
  visualState: NavbarVisualState;
  overlayTone: NavbarOverlayTone;
}

function DesktopNav({ visualState, overlayTone }: DesktopNavProps) {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex lg:min-h-16 lg:items-center lg:justify-between lg:gap-8">
      <div className="flex min-w-0 flex-1 items-center gap-10">
        <BrandLink visualState={visualState} overlayTone={overlayTone} />

        <nav aria-label="Primary" className="flex items-center gap-6">
          {PRIMARY_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              isActive={isNavItemActive(pathname, item.match)}
              visualState={visualState}
              overlayTone={overlayTone}
            />
          ))}
        </nav>
      </div>

      <nav aria-label="Utility" className="flex shrink-0 items-center gap-1 xl:gap-2">
        {UTILITY_NAV_ITEMS.map((item) => {
          if (!item.icon) {
            return null;
          }

          return (
            <NavIconLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              isActive={isNavItemActive(pathname, item.match)}
              visualState={visualState}
              overlayTone={overlayTone}
              showLabel={false}
              className="xl:px-3"
            />
          );
        })}
        <div className="mx-1 hidden h-5 w-px bg-border/70 xl:block" aria-hidden="true" />
        <AccountNav
          isActive={isAccountActive(pathname)}
          visualState={visualState}
          overlayTone={overlayTone}
        />
      </nav>
    </div>
  );
}

export { DesktopNav };
