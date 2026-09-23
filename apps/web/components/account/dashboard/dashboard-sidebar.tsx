"use client";

import { CircleHelp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardSidebarNavGroupSection } from "@/components/account/dashboard/dashboard-sidebar-nav-group";
import { DashboardSidebarUser } from "@/components/account/dashboard/dashboard-sidebar-user";
import {
  DASHBOARD_SIDEBAR_GROUPS,
  DASHBOARD_SIDEBAR_HELP,
  DASHBOARD_SIDEBAR_WIDTH_CLASS,
  isDashboardNavActive,
} from "@/lib/account";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  className?: string;
}

function DashboardSidebar({ className }: DashboardSidebarProps) {
  const pathname = usePathname();
  const helpActive = isDashboardNavActive(pathname, DASHBOARD_SIDEBAR_HELP.match);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border/60 bg-background px-4 py-6",
        DASHBOARD_SIDEBAR_WIDTH_CLASS,
        className,
      )}
    >
      <div data-dash-reveal className="mb-6 will-change-transform">
        <Link
          href="/"
          aria-label="GO WITH US — Home"
          className="inline-flex items-center gap-2 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <span
            aria-hidden="true"
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
          >
            G
          </span>
          <span className="hero-heading text-base font-semibold tracking-tight text-heading">
            GO WITH US
          </span>
        </Link>
        <div aria-hidden="true" className="mt-5 border-t border-border/60" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-7 overflow-y-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {DASHBOARD_SIDEBAR_GROUPS.map((group) => (
          <DashboardSidebarNavGroupSection key={group.label} group={group} />
        ))}

        <div data-dash-reveal className="will-change-transform">
          <Link
            href={DASHBOARD_SIDEBAR_HELP.href}
            aria-current={helpActive ? "page" : undefined}
            className={cn(
              "inline-flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors duration-200",
              helpActive
                ? "bg-muted/60 font-semibold text-heading"
                : "font-medium text-muted-foreground hover:bg-muted/35 hover:text-heading",
            )}
          >
            <CircleHelp aria-hidden="true" className="size-4" />
            {DASHBOARD_SIDEBAR_HELP.label}
          </Link>
        </div>
      </div>

      <DashboardSidebarUser />
    </aside>
  );
}

export { DashboardSidebar };
