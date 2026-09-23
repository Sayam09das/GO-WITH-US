"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DASHBOARD_MOBILE_TAB_ITEMS, isDashboardNavActive } from "@/lib/account";
import { cn } from "@/lib/utils";

function DashboardMobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Dashboard"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur-[2px] lg:hidden"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1">
        {DASHBOARD_MOBILE_TAB_ITEMS.map((item) => {
          const active = isDashboardNavActive(pathname, item.match);
          const Icon = item.icon;

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 text-[0.6875rem] font-medium transition-colors",
                  active ? "text-heading" : "text-muted-foreground hover:text-heading",
                )}
              >
                <Icon
                  aria-hidden="true"
                  className={cn("size-[1.125rem]", active && "text-primary")}
                />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export { DashboardMobileTabBar };
