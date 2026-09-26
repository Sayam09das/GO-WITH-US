"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavCountBadge } from "@/components/navigation/nav-count-badge";
import { isDashboardNavActive, navCountForHref, useNavCounts } from "@/lib/account";
import { cn } from "@/lib/utils";

interface DashboardSidebarNavLinkProps {
  label: string;
  href: string;
  match: string;
  className?: string;
}

function DashboardSidebarNavLink({ label, href, match, className }: DashboardSidebarNavLinkProps) {
  const pathname = usePathname();
  const { counts } = useNavCounts();
  const active = isDashboardNavActive(pathname, match);
  const badgeCount = navCountForHref(href, counts);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-10 items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors duration-200",
        active
          ? "bg-muted/60 font-semibold text-heading"
          : "font-medium text-muted-foreground hover:bg-muted/35 hover:text-heading",
        className,
      )}
    >
      <span>{label}</span>
      <NavCountBadge count={badgeCount} />
    </Link>
  );
}

export { DashboardSidebarNavLink };
