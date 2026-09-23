"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DASHBOARD_NAV_ITEMS } from "@/lib/account";
import { cn } from "@/lib/utils";

function isNavActive(pathname: string, match: string): boolean {
  if (match === "/account") {
    return pathname === "/account";
  }
  return pathname === match || pathname.startsWith(`${match}/`);
}

function DashboardQuickNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard sections" data-dash-reveal className="will-change-transform">
      <ul className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {DASHBOARD_NAV_ITEMS.map((item) => {
          const active = isNavActive(pathname, item.match);

          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-10 items-center border-b-2 px-3 py-2 text-sm transition-colors duration-200",
                  active
                    ? "border-primary font-semibold text-heading"
                    : "border-transparent font-medium text-muted-foreground hover:border-border hover:text-heading",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export { DashboardQuickNav };
